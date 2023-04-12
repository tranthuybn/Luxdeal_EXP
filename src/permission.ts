import router from './router'
import { useCache } from '@/hooks/web/useCache'
import type { RouteRecordRaw } from 'vue-router'
import { useTitle } from '@/hooks/web/useTitle'
import { useNProgress } from '@/hooks/web/useNProgress'
import { usePermissionStoreWithOut } from '@/store/modules/permission'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { usePageLoading } from '@/hooks/web/usePageLoading'
import { getDictApi } from '@/api/common'

const permissionStore = usePermissionStoreWithOut()
const dictStore = useDictStoreWithOut()

const { wsCache } = useCache()

const { start, done } = useNProgress()

const { loadStart, loadDone } = usePageLoading()

const whiteList = ['/login'] // Don’t reconstruct a white list

router.beforeEach(async (to, from, next) => {
  start()
  loadStart()
  const userInfo = wsCache.get(permissionStore.getStaffInfo)
  const routesPermission = wsCache.get(permissionStore.getRouterByRoles)
  if (userInfo && routesPermission) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (permissionStore.getIsAddRouters) {
        next()
        return
      }

      if (!dictStore.getIsSetDict) {
        // Get all dictionaries
        const res = await getDictApi()
        if (res) {
          dictStore.setDictObj(res.data)
          dictStore.setIsSetDict(true)
        }
      }

      // Developers can modify it according to the actual situation
      // force to logout if login before this time
      const loginBefore = new Date('2023-30-28')
      if (userInfo.loginTime < loginBefore.getTime()) {
        wsCache.clear()
        next({ path: '/login' })
        return
      }
      await permissionStore.generateRoutes(routesPermission.map(el=>el.url) as AppCustomRouteRecordRaw[], 'client')
  
      permissionStore.getAddRouters.forEach((route) => {
        router.addRoute(route as unknown as RouteRecordRaw) // Dynamic adding accessible routing table
      })
      const redirectPath = from.query.redirect || to.path
      const redirect = decodeURIComponent(redirectPath as string)
      const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect }
      permissionStore.setIsAddRouters(true)
      next(nextData)
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      if(to.path == "/guide" || to.path == "/UserGuide.html"){
        next()
      }else{
        next(`/login?redirect=${to.path}`) // Otherwise, all redirect to the login page
        wsCache.clear()
      }
    }
  }
})

router.afterEach((to) => {
  useTitle(to?.meta?.title as string)
  done() //End Progress
  loadDone()
})
