/** __mocks__ **/

// TODO: this is a real server. a bit obnoxious
const MOCK_SERVER = require('restify').createServer()
MOCK_SERVER.pre = jest.fn().mockName('server.pre()')

const MOCK_API = {
  applyRoutes: jest.fn().mockName('API.applyRoutes()')
}

const MOCK_PATH = '/test'

/** includes **/
const proquire = require('proxyquire')
const main = proquire('main.js', {
  './routes': MOCK_API,
  '@noCallThru': true
})

/** begin tests **/

test('has mount() function', () => {
  expect(main.mount).toBeDefined()
  main.mount(MOCK_SERVER, MOCK_PATH)
  expect(MOCK_SERVER.pre).toBeCalled()
  expect(MOCK_API.applyRoutes).toBeCalledWith(MOCK_SERVER, MOCK_PATH)
})
