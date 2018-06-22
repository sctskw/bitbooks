const socket = require(global.__appbase + '/server/socket.js')

test('has serve() function', () => {
  expect(socket.serve).toBeDefined()
})
