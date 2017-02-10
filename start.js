const spawn = require('child_process').spawn
const nwjsPath = require('nw').findpath()

const widget = spawn(nwjsPath, [__dirname], {
  detached: true,
  stdio: 'ignore'
})
widget.unref()
