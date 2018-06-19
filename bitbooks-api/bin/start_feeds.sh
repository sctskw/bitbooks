#!/bin/sh
export APP_BASE=$PWD
export SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

(while true; do node $APP_BASE/bitbooks-api/lib/feeder --exchange=poloniex --market=BTC_ETH </dev/null; done) >> /dev/null &
(while true; do node $APP_BASE/bitbooks-api/lib/feeder --exchange=bittrex --market=BTC-ETH </dev/null; done) >> /dev/null &

#node ./lib/feeder --exchange=poloniex --market=BTC_ETH &
#node ./lib/feeder --exchange=bittrex --market=BTC-ETH &
