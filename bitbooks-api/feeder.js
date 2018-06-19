#!/usr/bin/env node

const Parser = require('minimist')
const Cache = require('./lib/cache/storage')
const Clients = require('./lib/clients')

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
    process.exit(1)
  }
})
