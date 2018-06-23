/** __mocks__ **/

jest.mock('poloniex-api-node')
jest.genMockFromModule('poloniex-api-node')

const FIXTURES = {
  orders: require('./fixtures/poloniex.ws.orders.json'),
  updates: require('./fixtures/poloniex.ws.update.json')
}

/** begin tests **/

const Poloniex = require('lib/clients/poloniex')
const Parser = require('lib/clients/poloniex/parser.js')

test('clients/poloniex has proper interface', function () {
  expect(Poloniex.name).toBeDefined()
  expect(Poloniex.enabled).toBeTruthy()
  expect(Poloniex.api).toBeDefined()
  expect(Poloniex.subscribe).toBeInstanceOf(Function)
  expect(Poloniex.emit).toBeInstanceOf(Function)
})

test('clients/poloniex/parser parses order book', () => {
  let orders = JSON.parse(JSON.stringify(FIXTURES.orders))
  let output = Parser.process(orders)

  expect(output).toHaveLength(1)

  let msg = output[0]

  expect(msg.event).toEqual('ORDER_BOOK::STATUS')
  expect(msg.data).toBeDefined()
  expect(msg.data.type).toEqual('init')
})

test('clients/poloniex/parser parses order book updates', () => {
  let updates = JSON.parse(JSON.stringify(FIXTURES.updates))
  let events = updates.map(Parser.process)

  expect(events).toHaveLength(16)

  events.forEach((messages) => {
    expect(messages.length).toBeGreaterThanOrEqual(1)

    messages.forEach((msg) => {
      expect(msg.event).toEqual('ORDER_BOOK::UPDATE')
      expect(msg.data).toBeDefined()
      expect(msg.data.type).toEqual('patch')
    })
  })
})
