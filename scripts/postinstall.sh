#!/bin/sh
export PATH=$PATH:./node_modules/.bin
export APP_BASE=$PWD

cd $APP_BASE/bitbooks-api && npm run feeders
cd $APP_BASE/bitbooks-client && npm run build

