import Vue from 'vue'
import Router from 'vue-router'
import Lancamentos from './components/lancamentos/Lancamentos.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/lancamentos',
    component: Lancamentos
  }]
})