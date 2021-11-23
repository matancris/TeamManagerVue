import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

// Firebase config
// import './services/teamServiceFirebase'
import { firestorePlugin } from 'vuefire'


import './assets/scss/global.scss'


Vue.use(firestorePlugin)


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
