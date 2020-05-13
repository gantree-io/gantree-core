const path = require('path')
const { oPick, notNull } = require('./pick')
const { ensurePath } = require('../../utils/path-helpers')
const {
  GantreeError,
  ErrorTypes: { BAD_CONFIG, MISSING_ARGUMENTS }
} = require('../../gantree-error')

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
      `Must supply 'project_path' or 'project_root_path'`
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
  const project_path = getProjectPath(args, project_name)
  const control_path = getControlPath(args, project_name)

  const frame = {
    project_name,
    project_path,
    control_path,
    ...oPick(args, 'strict', notNull),
    ...oPick(args, 'verbose', notNull),
    ...oPick(args, 'verbosity', notNull),
    ...oPick(args, 'logger', notNull),
    ...oPick(args, 'python_interpreter', notNull)
  }

  frame.active_path = ensurePath(frame.project_path, 'active')

  frame.logAt = loc => {
    return frame.logger.child({ defaultMeta: { service_name: loc } })
  }

  return frame
}

module.exports = {
  createFrame
}
