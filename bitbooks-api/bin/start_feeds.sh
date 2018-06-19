#!/bin/sh
export APP_BASE=$PWD
export SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

EXEC=$APP_BASE/bitbooks-api/lib/feeder.js

(while true; do node $EXEC --exchange=poloniex --market=BTC_ETH </dev/null; done) >> /dev/null &
(while true; do node $EXEC --exchange=bittrex --market=BTC-ETH </dev/null; done) >> /dev/null &

#node ./lib/feeder --exchange=poloniex --market=BTC_ETH &
#node ./lib/feeder --exchange=bittrex --market=BTC-ETH &
