#!/usr/bin/env node

const Parser = require('minimist')
const Storage = require('./lib/cache/redis')
const Clients = require('./lib/clients')

const ARGS = Parser(process.argv, {'--': true})

const store = new Storage()

Clients.subscribe({
  exchange: ARGS.exchange,
  market: ARGS.market
}, function (message) {
  if (message.type === 'init') return store.init(message)
  if (message.type === 'patch') return store.patch(message)

  console.error(`invalid message: ${JSON.stringify(message)}`)
})
