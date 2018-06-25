#!/usr/bin/env node

/**
 * Wrapper module to start a feed for an available Exchange Client
 *
 * Usage:
 *
 * ./feeder --exchange=bittrex --market=BTC_ETH
 *
 */
const path = require('path')

// useful to find the base level directory in child processes
global.__appbase = path.resolve(__dirname, '..')

const Parser = require('minimist')
const Cache = require('./cache/storage')
const Clients = require('./clients')

// parse the command line arguments
const ARGS = Parser(process.argv, {'--': true})

// create the storage cache
const Storage = new Cache()

Clients.subscribe({
  exchange: ARGS.exchange,
  market: ARGS.market
}, function (message) {
  try {
    // execute the storage method provided by the message
    Storage[message.type](message)
  } catch (err) {
    console.error(`fail: ${err}`)
    process.exit(0)
  }
})
