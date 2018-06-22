/** __mocks__ **/

jest.mock('node.bittrex.api')
jest.genMockFromModule('node.bittrex.api')

const bittrex = require('lib/clients/bittrex.js')

test('clients/bittrex has proper interface', function () {
  expect(bittrex.name).toBeDefined()
  expect(bittrex.enabled).toBeTruthy()
  expect(bittrex.api).toBeDefined()
  expect(bittrex.connect).toBeInstanceOf(Function)
  expect(bittrex.disconnect).toBeInstanceOf(Function)
  expect(bittrex.format).toBeInstanceOf(Function)
  expect(bittrex.process).toBeInstanceOf(Function)
  expect(bittrex.emit).toBeInstanceOf(Function)
  expect(bittrex.subscribe).toBeInstanceOf(Function)
})
