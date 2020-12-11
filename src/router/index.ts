import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Base from '../views/Base.vue'
import CentralLocation from '../views/CentralLocation.vue'
import Communities from '../views/Communities.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Base',
    component: Base
  },
  {
    path: '/central',
    name: 'CentralLocation',
    component: CentralLocation
  },
  {
    path: '/communities',
    name: 'Communities',
    component: Communities
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router;
