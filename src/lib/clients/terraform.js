const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')

const cmd = require('../cmd')
const { Project } = require('../project')
const ssh = require('../ssh')
const tpl = require('../tpl')
const provider_env_vars = require('../../static_data/provider_env_vars')

class Terraform {
  constructor(cfg) {
    this.config = JSON.parse(JSON.stringify(cfg))

    const project = new Project(cfg)
    this.terraformOriginPath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'terraform'
    )
    this.terraformFilesPath = path.join(project.path(), 'terraform')

    this.options = {
      verbose: true
    }
  }

  async sync() {
    console.log(chalk.yellow('[Gantree] Initialising Terraform'))
    this._initializeTerraform()

    this._check_environment_variables(this.config.validators.nodes)

    const sshKeys = ssh.keys()

    let validatorSyncPromises = []
    try {
      validatorSyncPromises = await this._create(
        'validator',
        sshKeys.validatorPublicKey,
        this.config.validators.nodes
      )
    } catch (e) {
      console.log(
        `[Gantree] Could not get validator sync promises: ${e.message}`
      )
    }

    const syncPromises = validatorSyncPromises

    return Promise.all(syncPromises)
  }

  async clean() {
    this._initializeTerraform()
    let validatorCleanPromises = []
    try {
      validatorCleanPromises = await this._destroy(
        'validator',
        this.config.validators.nodes
      )
    } catch (e) {
      console.log(
        `[Gantree] Could not get validator clean promises: ${e.message}`
      )
    }

    const cleanPromises = validatorCleanPromises

    return Promise.all(cleanPromises)
  }

  nodeOutput(type, counter, outputField) {
    const cwd = this._terraformNodeDirPath(type, counter)
    const options = { cwd }

    return this._cmd(`output -json ${outputField}`, options)
  }

  async _create(type, sshKey, nodes) {
    const createPromises = []

    for (let counter = 0; counter < nodes.length; counter++) {
      const cwd = this._terraformNodeDirPath(type, counter)
      // const backendConfig = this._backendConfig(type, counter);
      const nodeName = this._nodeName(type, counter)
      createPromises.push(
        new Promise(async resolve => {
          const options = { cwd }
          // await this._cmd(`init -var state_project=${this.config.state.project} -backend-config=bucket=${backendConfig.bucket} -backend-config=prefix=${backendConfig.prefix}`, options);
          await this._cmd(`init`, options)

          this._createVarsFile(cwd, nodes[counter], sshKey, nodeName)

          cmd.exec(`pwd`)
          await this._cmd(`apply -auto-approve`, options)

          resolve(true)
        })
      )
    }
    return createPromises
  }

  async _check_environment_variables(nodes) {
    for (let i = 0; i < nodes.length; i++) {
      let provider_n = nodes[i].provider
      if (provider_n in provider_env_vars) {
        const required_env_vars = provider_env_vars[provider_n]
        for (let i = 0; i < required_env_vars.length; i++) {
          const required_env_var = required_env_vars[i].name
          if (!(required_env_var in process.env)) {
            // if req env var not exported
            console.log(
              chalk.red(
                `[Gantree] Require env var not found!: ${required_env_var}`
              )
            )
            process.exit(-1)
          }
        }
      } else {
        console.log(chalk.red(`[Gantree] INCOMPATIBLE PROVIDER: ${provider_n}`))
        process.exit(-1)
      }
    }
  }

  async _destroy(type, nodes) {
    const destroyPromises = []

    for (let counter = 0; counter < nodes.length; counter++) {
      const cwd = this._terraformNodeDirPath(type, counter)
      destroyPromises.push(
        new Promise(async resolve => {
          const options = { cwd }
          await this._cmd(`init`, options)
          await this._cmd('destroy -lock=false -auto-approve', options)
          resolve(true)
        })
      )
    }
    return destroyPromises
  }

  async _cmd(command, options = {}) {
    const actualOptions = Object.assign({}, this.options, options)
    return cmd.exec(`terraform ${command}`, actualOptions)
  }

  // async _initState(){
  //   const cwd = this._terraformNodeDirPath('remote-state');
  //   const options = { cwd };

  //   await this._cmd(`init -var state_project=${this.config.state.project}`, options);
  //   const bucketName = this._bucketName()
  //   return this._cmd(`apply -var state_project=${this.config.state.project} -var name=${bucketName} -auto-approve`, options);
  // }

  _createVarsFile(cwd, node, sshKey, nodeName) {
    const data = {
      dir: path.resolve(__dirname),
      publicKey: sshKey,
      sshUser: node.sshUser,
      machineType: node.machineType,
      location: node.location,
      zone: node.zone,
      projectId: node.projectId,
      nodeCount: node.count || 1,
      name: nodeName
    }

    const source = path.join(__dirname, '..', '..', '..', 'tpl', 'tfvars')
    const target = path.join(cwd, 'terraform.tfvars')

    tpl.create(source, target, data)
  }

  _initializeTerraform() {
    fs.removeSync(this.terraformFilesPath)
    fs.ensureDirSync(this.terraformFilesPath)

    for (
      let counter = 0;
      counter < this.config.validators.nodes.length;
      counter++
    ) {
      this._copyTerraformFiles(
        'validator',
        counter,
        this.config.validators.nodes[counter].provider
      )
    }

    // for (let counter = 0; counter < this.config.publicNodes.nodes.length; counter++) {
    //   this._copyTerraformFiles('publicNode', counter, this.config.publicNodes.nodes[counter].provider);
    // }
  }

  _copyTerraformFiles(type, counter, provider) {
    const targetDirPath = this._terraformNodeDirPath(type, counter)
    const originDirPath = path.join(this.terraformOriginPath, provider)
    fs.ensureDirSync(targetDirPath)

    const name = this._nodeName(type, counter)

    fs.readdirSync(originDirPath).forEach(item => {
      const origin = path.join(originDirPath, item)
      const target = path.join(targetDirPath, item)
      const data = {
        dir: path.resolve(path.join(__dirname, '..', '..', '..')),
        name
      }
      tpl.create(origin, target, data)
    })
  }

  _terraformNodeDirPath(type, counter = 0) {
    const dirName = this._nodeName(type, counter)
    return path.join(this.terraformFilesPath, dirName)
  }

  // _backendConfig(type, counter) {
  //   const bucket = this._bucketName();
  //   const prefix = this._nodeName(type, counter);

  //   return { bucket, prefix };
  // }

  // _bucketName() {
  //   return `${this.config.project}-sv-tf-state`
  // }

  _nodeName(type, counter) {
    const name = `${type}${counter}`
    return name.toLowerCase()
  }
}

module.exports = {
  Terraform
}
