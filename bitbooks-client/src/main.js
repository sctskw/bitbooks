import Vue from 'vue'
import Vuetify from 'vuetify'
import router from './router'
import store from './store/'
import App from './views/App/index.vue'

Vue.use(Vuetify)

Vue.config.productionTip = false

// initialize the store
// TODO: can this be done somewhere else?
store.dispatch('monitor')

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
