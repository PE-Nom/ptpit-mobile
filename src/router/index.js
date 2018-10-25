import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import ProductsView from '@/components/ProductsView/ProductsView'
import IssuesView from '@/components/IssuesView/IssuesView'
import IssueEdit from '@/components/IssuesView/IssueEdit'
import PendingRequestsView from '@/components/PendingRequestsView/PendingRequestsView'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/products',
      name: 'Products',
      component: ProductsView
    },
    {
      path: '/issues',
      name: 'Issues',
      component: IssuesView
    },
    {
      path: '/issueedit',
      name: 'Issueedit',
      component: IssueEdit
    },
    {
      path: '/pendingrequests',
      name: 'pendingrequest',
      component: PendingRequestsView
    }
  ]
})
