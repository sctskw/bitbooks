/** __mocks__ **/

jest.mock('ws')
jest.genMockFromModule('ws')

const ws = require('ws')

/** begin tests **/

const socket = require('server/socket.js')

test('server/socket has serve() function', () => {
  expect(socket.serve).toBeDefined()
})

test('server/socket serve() to throw Exception', async () => {
  expect(socket.serve()).rejects.toThrow()
  await expect(socket.serve()).rejects.toThrow()
})

test('server/socket serve() resolves as promised', () => {
  const server = require('server/main.js')
  const conn = socket.serve({server: server})
  expect(conn).resolves.toBeDefined()
  expect(conn).resolves.toBeTruthy()
})

test('server/socket serve() awaits as promised', async () => {
  const server = require('server/main.js')
  const conn = await socket.serve({server: server})
  expect(conn).toBeInstanceOf(ws.Server)
})

test('server/socket serve() configures the server', async () => {
  const server = require('server/main.js')
  const conn = await socket.serve({server: server})

  expect(conn.broadcast).toBeDefined()
  expect(conn.broadcast).toBeInstanceOf(Function)
})
