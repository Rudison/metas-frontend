import Vue from 'vue'
import App from './App.vue'
import './plugins/bootstrap-vue'
import router from './router'
import './plugins/vue-js-modal'
import './plugins/vuelidade'
import './plugins/vue-currency'

Vue.config.productionTip = false

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
