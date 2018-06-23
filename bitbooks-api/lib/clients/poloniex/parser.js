module.exports.process = function (message) {
  let data = message.data || []
  let opts = {
    market: message.channel,
    seq: message.seq
  }

  return data.reduce((memo, msg) => {
    if (isInit(msg)) memo.push(processOrderBook(msg, opts))
    if (isModify(msg)) memo.push(processUpdate(msg, opts))
    return memo
  }, [])
}

function isInit (message) {
  return /orderBook$/i.test(message.type)
}

function isModify (message) {
  return /orderBookModify|orderBookRemove/ig.test(message.type)
}

function processOrderBook (message, opts) {
  let msg = Object.assign({}, {
    type: 'init',
    data: message.data
  }, opts || {})

  return {
    event: 'ORDER_BOOK::STATUS',
    data: msg
  }
}

function processUpdate (message, opts) {
  let msg = Object.assign({}, {
    type: 'patch',
    data: message.data
  }, opts || {})

  return {
    event: 'ORDER_BOOK::UPDATE',
    data: msg
  }
}
