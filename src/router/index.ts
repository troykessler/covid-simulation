import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Base from '../views/Base.vue'
import Hotspots from '../views/Hotspots.vue'
import Communities from '../views/Communities.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Base',
    component: Base
  },
  {
    path: '/hotspots',
    name: 'Hotspots',
    component: Hotspots
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
