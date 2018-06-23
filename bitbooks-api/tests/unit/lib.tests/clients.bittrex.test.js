/** __mocks__ **/

jest.mock('node.bittrex.api')
jest.genMockFromModule('node.bittrex.api')

// const FIXTURES = {
//   orders: require('./fixtures/bittrex.api.orders.json'),
//   updates: require('./fixtures/bittrex.ws.update.json')
// }

const Bittrex = require('lib/clients/bittrex')

test('client has proper interface', () => {
  expect(Bittrex.name).toBeDefined()
  expect(Bittrex.enabled).toBeTruthy()
  expect(Bittrex.api).toBeDefined()
  expect(Bittrex.subscribe).toBeInstanceOf(Function)
  expect(Bittrex.emit).toBeInstanceOf(Function)
})

test('client emits single message objects', () => {
  let callback = jest.fn()
  let msgs = [
    {test1: true},
    {test2: true}
  ]

  Bittrex.emit(msgs, callback)

  expect(callback).toHaveBeenCalledTimes(2)

  callback.mockReset()

  Bittrex.emit(msgs[0], callback)

  expect(callback).toHaveBeenCalledTimes(1)
})
