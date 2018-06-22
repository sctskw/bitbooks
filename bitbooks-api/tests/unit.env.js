const path = require('path')
const TestEnvironment = require('jest-environment-node')

const APP_BASE = path.resolve(__dirname, '..')

class UnitTestEnv extends TestEnvironment {
  async setup () {
    await super.setup()
    this.global.__appbase = APP_BASE
  }

  async teardown () {
    await super.teardown()
  }

  runScript (script) {
    return super.runScript(script)
  }
}

module.exports = UnitTestEnv
