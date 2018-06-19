#!/bin/sh

# (while true; do node ./feeder --exchange=poloniex --market=BTC_ETH </dev/null; done) >> /dev/null &
# (while true; do node ./feeder --exchange=bittrex --market=BTC-ETH </dev/null; done) >> /dev/null &

node ./lib/feeder --exchange=poloniex --market=BTC_ETH &
node ./lib/feeder --exchange=bittrex --market=BTC-ETH &
