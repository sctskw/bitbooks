/** __mocks__ **/

jest.mock('poloniex-api-node')
jest.genMockFromModule('poloniex-api-node')

/** begin tests **/

const poloniex = require('lib/clients/poloniex.js')

test('clients/poloniex has proper interface', function () {
  expect(poloniex.name).toBeDefined()
  expect(poloniex.enabled).toBeTruthy()
  expect(poloniex.api).toBeDefined()
  expect(poloniex.connect).toBeInstanceOf(Function)
  expect(poloniex.disconnect).toBeInstanceOf(Function)
  expect(poloniex.process).toBeInstanceOf(Function)
  expect(poloniex.emit).toBeInstanceOf(Function)
  expect(poloniex.subscribe).toBeInstanceOf(Function)
})
