/** __mocks__ **/

// const MOCK_CONFIG = {
//   APP: 'test',
//   APP_BASE: __dirname,
//   API_SERVER: '1.1.1.1',
//   API_PORT: 2
// }

function doMocks () {
  jest.resetModules()
  jest.mock('config.js')
  jest.mock('server/main.js')
  jest.mock('server/socket.js')
  jest.mock('lib/cache')
  jest.mock('bin/feeds.js')

  jest.genMockFromModule('config.js')
  jest.genMockFromModule('server/main.js')
  jest.genMockFromModule('server/socket.js')
  jest.genMockFromModule('lib/cache')
  jest.genMockFromModule('bin/feeds.js')
}

describe('non-production tests', () => {
  beforeEach(() => {
    doMocks()
    process.env.NODE_ENV = 'something'
  })

  afterEach(() => {
    delete process.env.NODE_ENV
  })

  test('server/serve starts the server', (done) => {
    const SERVER = require('server/main.js')
    const SOCKET = require('server/socket.js')
    const FEEDS = require('bin/feeds.js')

    let emitter = jest.fn()

    SERVER.listen.mockImplementation(jest.fn())
    SOCKET.serve.mockImplementation(jest.fn().mockResolvedValue({
      on: emitter
    }))
    FEEDS.start.mockImplementation(jest.fn())

    // init the server
    require('server')

    // TODO: wait for actual state versus abitrary time
    // NOTE: this could cause intermittent failures during test
    // suite runs
    setTimeout(() => {
      expect(SERVER.listen).toBeCalled()
      expect(FEEDS.start).not.toBeCalled()
      done()
    }, 50)
  })
})

describe('production tests', () => {
  beforeEach(() => {
    doMocks()
    process.env.NODE_ENV = 'production'
  })

  afterEach(() => {
    delete process.env.NODE_ENV
  })

  test('server/serve starts the server and feeds', (done) => {
    const SERVER = require('server/main.js')
    const SOCKET = require('server/socket.js')
    const FEEDS = require('bin/feeds.js')

    let emitter = jest.fn()

    SERVER.listen.mockImplementation(jest.fn())
    SOCKET.serve.mockImplementation(jest.fn().mockResolvedValue({
      on: emitter
    }))
    FEEDS.start.mockImplementation(jest.fn())

    // init the server
    require('server')

    // TODO: wait for actual state versus abitrary time
    // NOTE: this could cause intermittent failures during test
    // suite runs
    setTimeout(() => {
      expect(SERVER.listen).toBeCalled()
      expect(FEEDS.start).toBeCalled()
      expect(emitter).toBeCalled()
      done()
    }, 50)
  })
})

