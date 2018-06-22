/** __mocks__ **/

// tell jest we want to mock these dependencies
jest.mock('server/routes')
jest.mock('server/main.js')

// auto-generate a mock
jest.genMockFromModule('server/routes')
jest.genMockFromModule('server/main.js')

/** import the mocked versions of dependencies **/
const ROUTES = require('server/routes')
const SERVER = require('server/main.js')
const PATH = '/test'

/** begin tests **/
const api = require('server/api.js')

test('server/api has mount() function', () => {
  expect(api.mount).toBeDefined()
})

test('server/api can mount()', () => {
  api.mount(SERVER, PATH)

  expect(SERVER.pre).toBeCalled()
  expect(ROUTES.applyRoutes).toBeCalled()
  expect(ROUTES.applyRoutes).toBeCalledWith(SERVER, PATH)
})
