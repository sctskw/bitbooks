#!/usr/bin/env node
const path = require('path')
const spawn = require('child_process').spawn

module.exports.start = function () {
  // TODO: check for existing processes before starting
  const feeds = spawn(path.resolve(__dirname, 'start_feeds.sh'))

  feeds.stdout.on('data', function (data) {
    console.log(data.toString())
  })

  feeds.stderr.on('data', (data) => {
   console.log(`fail: ${data.toString()}`);
  })

  feeds.on('close', (code) => {
   console.log(`feeds process exited with code ${code}`);
  })

}
