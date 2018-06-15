class Socket {
  constructor (config) {
    this.conn = null // dummy
  }

  isConnected () {
    if (!this.conn) return false

    return this.conn.readyState === 1
  }

  connect (callback) {
    // TODO: how to dynamically change this for Prod?
    const host = window.location.hostname

    this.conn = new WebSocket(`ws://${host}:11001`)

    this.conn.onopen = callback

    return this
  }

  disconnect () {
    this.conn.close()
    this.conn = null
  }

  send (msg) {
    if (this.isConnected()) this.conn.send(msg)
  }

  on (action, handler) {
    if (this.isConnected()) {
      this.conn.addEventListener(action, handler)
    }
  }
}

export default Socket
