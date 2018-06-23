#!/usr/bin/env node
const path = require('path')

global.__appbase = path.resolve(__dirname, '..')

const Parser = require('minimist')
const Cache = require('./cache/storage')
const Clients = require('./clients')

const ARGS = Parser(process.argv, {'--': true})

const Storage = new Cache()

Clients.subscribe({
  exchange: ARGS.exchange,
  market: ARGS.market
}, function (message) {
  try {
    Storage[message.type](message)
  } catch (err) {
    console.error(`fail: ${err}`)
    process.exit(0)
  }
})
