// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store.js'
import pendingRequestManager from './models/pendingRequestManager.js'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Tooltip from 'vue-directive-tooltip'
import 'vue-directive-tooltip/css/index.css'

Vue.use(BootstrapVue)
Vue.config.productionTip = false
Vue.use(Tooltip, {
  delay: 200,
  placement: 'auto',
  class: '', // ex: 'tooltip-custom tooltip-other-custom'
  triggers: ['hover'],
  offset: 5
})

pendingRequestManager.init()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
