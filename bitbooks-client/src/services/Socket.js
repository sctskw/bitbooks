class Socket {
  constructor (config) {
    this.conn = null // dummy
  }

  isConnected () {
    if (!this.conn) return false

    return this.conn.readyState === 1
  }

  connect () {
    // TODO: how to dynamically change this for Prod?
    const host = window.location.hostname

    this.conn = new WebSocket(`ws://${host}:11001`)

    this.conn.onmessage = (msg) => {
      this.emitter.$emit('message', msg.data)
    }

    this.conn.onerror = (err) => {
      this.emitter.$emit('error', err)
    }

    return this.emitter
  }

  disconnect () {
    this.conn.close()
    this.conn = null
  }

  send (msg) {
    if (this.isConnected()) this.conn.send(msg)
  }
}

export default Socket
