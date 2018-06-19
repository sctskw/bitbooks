const Storage = require('./storage.js')
const Modifiers = require('./modifiers.js')
const Cache = new Storage()

Modifiers.apply(Cache)

module.exports = Cache
