class Socket {
  constructor (config) {
    this.conn = null // dummy
  }

  isReady () {
    return this.conn !== null && (this.isConnected() || this.isConnecting())
  }

  isConnected () {
    if (!this.conn) return false
    return this.conn.readyState === WebSocket.OPEN
  }

  isConnecting () {
    if (!this.conn) return false
    return this.conn.readyState === WebSocket.CONNECTING
  }

  isClosing () {
    if (!this.conn) return false
    return this.conn.readyState === WebSocket.CLOSING
  }

  isClosed () {
    if (!this.conn) return false
    return this.conn.readyState === WebSocket.CLOSED
  }

  connect (callback) {
    // TODO: how to dynamically change this for Prod?
    const host = window.location.hostname

    // don't reconnect more than once
    if (this.isReady()) return this
    if (this.isClosed() || this.isClosing()) this.disconnect() // cleanup

    this.conn = null // GC?
    this.conn = new WebSocket(`ws://${host}:11001`)

    function onConnect ($event) {
      if ($event.type === 'open') return callback(null, true)
      if ($event.type === 'error') {
        this.disconnect()
        return callback($event)
      }
    }

    this.conn.onopen = onConnect.bind(this)
    this.conn.onerror = onConnect.bind(this)

    return this
  }

  disconnect () {
    if (this.isReady()) this.conn.close()
    delete this.conn
    this.conn = null
    return this
  }

  send (msg) {
    if (this.isConnected()) this.conn.send(msg)
  }

  on (action, handler) {
    if (this.isReady()) this.conn.addEventListener(action, handler)
  }
}

export default Socket
