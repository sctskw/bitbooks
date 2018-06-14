#!/bin/sh
export APP_BASE=$PWD
echo "Application Base Path: ${APP_BASE}"
cd $APP_BASE/bitbooks-api && npm install
cd $APP_BASE/bitbooks-client && npm install

