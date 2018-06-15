import Vue from 'vue'
import App from './views/App/index.vue'
import router from './router'
import store from './store'
import socket from './socket'

Vue.config.productionTip = false

// initialize socket
socket.connect()

new Vue({
  router,
  store,
  socket,
  render: h => h(App),
  beforeDestroy: function () {
    debugger
  }
}).$mount('#app')
