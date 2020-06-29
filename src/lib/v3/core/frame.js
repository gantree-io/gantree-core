const path = require('path')
const { oPick, notNull, fallback, funcback, assertType } = require('./pick')
const { ensurePath } = require('../../utils/path-helpers')
const envPython = require('../../utils/env-python')
const {
  GantreeError,
  ErrorTypes: { BAD_CONFIG, MISSING_ARGUMENTS }
} = require('../../error/gantree-error')
const { getValidLevels } = require('../../logging/logger')

const getProjectName = args => {
  const { gco } = args
  const project_name = gco.metadata && gco.metadata.project
  if (!project_name) {
    throw new GantreeError(
      BAD_CONFIG,
      'Config requires |.metadata.project field'
    )
  }
  return project_name
}

const getProjectPath = (args, project_name) => {
  if (args.project_path) {
    return args.project_path
  }

  if (!args.project_root) {
    throw new GantreeError(
      MISSING_ARGUMENTS,
      `Must supply 'project_path' or 'project_root'`
    )
  }

  return path.join(args.project_root, project_name)
}

const getControlPath = (args, project_name) => {
  if (!args.control_root) {
    throw new Error(MISSING_ARGUMENTS, `Must supply 'control_root`)
  }

  return path.join(args.control_root, project_name)
}

const createFrame = args => {
  const project_name = getProjectName(args)
  const project_path = ensurePath(getProjectPath(args, project_name))
  const control_path = ensurePath(getControlPath(args, project_name))

  const frame = {
    project_name,
    project_path,
    control_path,
    ...oPick(
      args,
      'enable_process_stdout',
      fallback(false),
      assertType('boolean')
    ),
    ...oPick(args, 'strict', notNull),
    ...oPick(args, 'logger', notNull),
    ...oPick(
      args,
      'python_interpreter',
      funcback(envPython.getInterpreterPathSync),
      notNull
    ),
    ...oPick(args, 'env', fallback(process.env), notNull)
  }

  frame.active_path = ensurePath(frame.project_path, 'active')

  frame.logAt = meta => {
    if (typeof meta === 'string') {
      meta = { service: meta }
    }

    const log = (level, message = '', more_meta = {}) =>
      frame.logger.log({ ...meta, ...more_meta, level, message })
    const build = level => ({
      [level]: (message, more_meta) => log(level, message, more_meta)
    })
    const buildAll = (...levels) =>
      levels.reduce((res, level) => ({ ...res, ...build(level) }), {})

    return {
      log,
      ...buildAll(...Object.keys(getValidLevels()))
    }
  }

  return frame
}

module.exports = {
  createFrame
}
