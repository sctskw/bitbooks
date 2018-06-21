#!/bin/sh
export APP_BASE=$PWD

 (while true; do node $APP_BASE/bitbooks-api/lib/feeder --exchange=poloniex --market=BTC_ETH </dev/null; done) >> /dev/null &
 (while true; do node $APP_BASE/bitbooks-api/lib/feeder --exchange=bittrex --market=BTC-ETH </dev/null; done) >> /dev/null &

# node $APP_BASE/lib/feeder --exchange=poloniex --market=BTC_ETH &
# node $APP_BASE/lib/feeder --exchange=bittrex --market=BTC-ETH &
