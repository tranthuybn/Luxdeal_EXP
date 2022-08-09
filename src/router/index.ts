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
import LibraryAndSetting from './RouterMap/LibraryAndSetting'
import Error from './RouterMap/Error'
export const asyncRouterMap: AppRouteRecordRaw[] = [
  DashBoard,
  Business,
  Warehouse,
  Accountant,
  Approve,
  NewAndAdvertisement,
  LibraryAndSetting,
  Authentication,
  Error
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
