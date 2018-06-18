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

    connect: function () {
      this.socket.connect(() => {
        this.socket.on('message', this.emit)
      })
    },

    disconnect: function () {
      this.socket.disconnect()
    },

    send: function (message) {
      this.socket.send(message)
    },

    emit: function (message) {
      this.$emit('message', message)
      this.$emit('data', message.data)
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
