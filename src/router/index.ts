import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'
import { constantRouterMap } from './constant'
import DashBoard from './RouterMap/DashBoard'
import Business from './RouterMap/Business'
import Warehouse from './RouterMap/Warehouse'
import Accountant from './RouterMap/Accountant'
import Approve from './RouterMap/Approve'
import Authentication from './RouterMap/Authentication'
import NewAndAdvertisement from './RouterMap/NewAndAdvertisement'
import ProductsAndServices from './RouterMap/ProductsAndServices'
import Purchase from './RouterMap/Purchase'
import HumanResourceManagement from './RouterMap/HumanResourceManagement'
export const asyncRouterMap: AppRouteRecordRaw[] = [
  DashBoard,
  ProductsAndServices,
  Business,
  Purchase,
  Warehouse,
  Accountant,
  Approve,
  NewAndAdvertisement,
  HumanResourceManagement,
  Authentication,
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    meta: {
      title: '404'
    },
    component: () => import('@/views/Error/404.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  strict: true,
  routes: constantRouterMap as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export const resetRouter = (): void => {
  const resetWhiteNameList = ['Redirect', 'Login', 'NoFind', 'Root']
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !resetWhiteNameList.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export const setupRouter = (app: App<Element>) => {
  app.use(router)
}

export default router
