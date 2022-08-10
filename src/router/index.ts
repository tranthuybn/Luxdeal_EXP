import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'
import { constantRouterMap } from './constant'
import DashBoard from './RouterMap/DashBoard'
import Components from './RouterMap/Components'
import Business from './RouterMap/Business'
import Warehouse from './RouterMap/Warehouse'
import Accountant from './RouterMap/Accountant'
import Approve from './RouterMap/Approve'
import MultiTierMenu from './RouterMap/MultiTierMenu'
import Example from './RouterMap/Example'
import Authentication from './RouterMap/Authentication'
import Hook from './RouterMap/Hook'
import Error from './RouterMap/Error'
import NewAndAdvertisement from './RouterMap/NewAndAdvertisement'
import LibraryAndSetting from './RouterMap/LibraryAndSetting'
export const asyncRouterMap: AppRouteRecordRaw[] = [
  DashBoard,
  Components,
  Business,
  Warehouse,
  Accountant,
  Approve,
  NewAndAdvertisement,
  LibraryAndSetting,
  MultiTierMenu,
  Example,
  Authentication,
  Hook,
  Error,
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
