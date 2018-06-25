/**
 * Simple console.log wrapper that gives each log a readable namespace
 *
 *  Usage:
 *
 *  let log = require('logging')('mymodule')
 *
 *  log('something')
 *
 *  > '[mymodule] something'
 *
 */
module.exports = function getLog (namespace) {
  return function logger (msg, data) {
    let text = `[${namespace}] ${msg}`

    if (!data) return console.log(text)

    console.log(text, JSON.stringify(data))
  }
}
