const { execSync } = require('child_process')

const findPythonSync = binary_name => {
  try {
    const raw = execSync(
      `${binary_name} -c "import sys; print(sys.executable)"`
    ).toString()
    return raw.trim()
  } catch (e) {
    return null
  }
}

const getInterpreterPathSync = () => {
  let localPython = findPythonSync('python3')

  if (!localPython) {
    findPythonSync('python')
  }

  if (!localPython) {
    throw new Error('Could not find local python')
  }

  return localPython
}

const getInterpreterPath = async () => await getInterpreterPathSync()

module.exports = {
  getInterpreterPath,
  getInterpreterPathSync
}
