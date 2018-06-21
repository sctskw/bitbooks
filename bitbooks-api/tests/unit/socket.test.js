const main = require('socket.js')

test('has server() function', () => {
  expect(main.serve).toBeDefined()
})
