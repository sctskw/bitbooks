module.exports = function getLog (namespace) {
  return function logger (msg, data) {

    let text = `[${namespace}] ${msg}`

    if(!data) return console.log(text)

    console.log(text, JSON.stringify(data))
  }
}
