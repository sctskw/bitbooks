import Vue from 'vue'
import App from './views/App/index.vue'
import router from './router'
import store from './store/'

Vue.config.productionTip = false

// initialize the store
// TODO: can this be done somewhere else?
store.dispatch('monitor')

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
