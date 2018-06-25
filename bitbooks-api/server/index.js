const path = require('path')
global.__appbase = path.resolve(__dirname, '../')

require('./serve')
