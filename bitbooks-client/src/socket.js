import Vue from 'vue'
import Socket from '@/services/Socket.js'

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
      this.socket.connect()
      this.socket.on('message', this.emit)
    },

    disconnect: function () {
      this.socket.disconnect()
    },

    send: function (message) {
      this.socket.send(message)
    },

    emit: function () {
      debugger
    }
  }

})

// attach/install the socket
Vue.use(function ($Vue) {
  Object.defineProperty($Vue.prototype, '$socket', {
    get: function () { return Facade }
  })

  // TODO: why does this prevent the rest of the cycle from continuing? There's no error
  // even in a try/catch?
  // Will move the connection to the store instead, but curious nonetheless
  //
  // Facade.connect()
})

export default Facade
