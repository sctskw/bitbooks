#!/bin/sh
export PATH=$PATH:./node_modules/.bin
#npm install -g @vue/cli-service-global
cd bitbooks-client && npm install && npm run build
