const socket = require('socket.js')

test('has serve() function', () => {
  expect(socket.serve).toBeDefined()
})
