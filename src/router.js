import Vue from 'vue'
import Router from 'vue-router'
import Lancamentos from './components/lancamentos/Lancamentos.vue'
import MenuPrincipal from './components/MenuPrincipal.vue'
import Metas from './components/lancamentos/Metas.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: MenuPrincipal,
    },
    {
      path: '/lancamentos/',
      component: Lancamentos,
    },
    {
      name: 'metas',
      path: '/metas/:metaId',
      component: Metas,
      props: true,
    },
  ],
})
