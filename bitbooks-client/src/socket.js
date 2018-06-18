import Vue from 'vue'
import Socket from '@/lib/Socket.js'

// initialize the socket
let socket = new Socket()

// create the Vue facade to install into the App
// this wraps all the handy functions of Socket and exposes them
const Facade = new Vue({

  data: function () {
    return { socket }
  },

  methods: {

    isConnected: function () {
      return this.socket.isConnected() === true
    },

    connect: function (callback) {
      const retry = this.reconnect.bind(this, callback)

      this.$on('closed', retry)
      this.$on('error', retry)

      // monitor connection changes indefinitely
      this.socket.connect((err, success) => {
        if (err) return this.$emit('error')

        this.$emit('connected')

        this.socket.on('open', callback)
        this.socket.on('message', this.emit)
        this.socket.on('close', this.onClose)
        this.socket.on('error', this.onError)

        if (callback) return callback(null, true)
      })
    },

    reconnect: function (callback) {
      // TODO add more logic to prevent retry hammering
      this.disconnect()

      // TODO: better retry logic
      setTimeout(() => {
        this.connect(callback)
      }, 2000)
    },

    disconnect: function () {
      if (this.isConnected()) {
        this.socket.disconnect()
        this.$emit('disconnect')
      }
    },

    send: function (message) {
      this.socket.send(message)
    },

    emit: function (message) {
      this.$emit('message', message)
      this.$emit('data', message.data)
    },

    onClose: function () {
      this.$emit('closed')
    },

    onError: function () {
      this.$emit('error')
    }

  }

})

// attach/install the socket facade onto the App
Vue.use(function ($Vue) {
  Object.defineProperty($Vue.prototype, '$socket', {
    get: function () { return Facade }
  })
})

export default Facade
