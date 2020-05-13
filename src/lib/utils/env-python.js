const util = require('util')

const exec = util.promisify(require('child_process').exec)

const findPython = async binary_name => {
  try {
    const raw = await exec(
      `${binary_name} -c "import sys; print(sys.executable)"`
    )
    return raw.stdout.trim()
  } catch (e) {
    return null
  }
}

const getInterpreterPath = async () => {
  let localPython = await findPython('python3')

  if (!localPython) {
    await findPython('python')
  }

  if (!localPython) {
    throw new Error('Could not find local python')
  }

  return localPython
}

module.exports = {
  getInterpreterPath
}
