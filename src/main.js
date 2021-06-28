import Vue from 'vue'

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

import router from "./router"
import store from './store'

import App from './App.vue'

import './assets/css/main.css'

Vue.use(VueMaterial)

new Vue({
  render: h => h(App),
  store,
  router,
}).$mount('#app')
