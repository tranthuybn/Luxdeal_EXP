import { defineStore } from 'pinia'
import { asyncRouterMap } from '@/router'
import { constantRouterMap } from '@/router/constant'
import { generateRoutesFn1, generateRoutesFn2, flatMultiLevelRoutes } from '@/utils/routerHelper'
import { store } from '../index'
import { cloneDeep } from 'lodash-es'
import { RouteLocationNormalizedLoaded } from 'vue-router'

interface iUserPermission { 
  addable:boolean 
  deletable:boolean
  editable:boolean
  id:number
  indeterminate:boolean
  url: string
}
export interface PermissionState {
  routers: AppRouteRecordRaw[]
  addRouters: AppRouteRecordRaw[]
  isAddRouters: boolean
  menuTabRouters: AppRouteRecordRaw[]
  userPermission: iUserPermission | Nullable<iUserPermission>
  accessToken: string
  refreshToken: string
  roles: string
  routerByRoles: string
  staffInfo: string
  accountId: string
}

export const usePermissionStore = defineStore({
  id: 'permission',
  state: (): PermissionState => ({
    routers: [],
    addRouters: [],
    isAddRouters: false,
    menuTabRouters: [],
    userPermission: null,
    accessToken: 'ACCESS_TOKEN',
    refreshToken: 'REFRESH_TOKEN',
    roles: 'ROLES',
    routerByRoles: 'ROUTER_BY_ROLES',
    staffInfo: 'STAFF_INFO',
    accountId: 'ACCOUNT_ID'
  }),
  persist: {
    enabled: true
  },
  getters: {
    getRouters(): AppRouteRecordRaw[] {
      return this.routers
    },
    getAddRouters(): AppRouteRecordRaw[] {
      return flatMultiLevelRoutes(cloneDeep(this.addRouters))
    },
    getIsAddRouters(): boolean {
      return this.isAddRouters
    },
    getMenuTabRouters(): AppRouteRecordRaw[] {
      return this.menuTabRouters
    },
    getAccessToken(): string {
      return this.accessToken
    },
    getRefreshToken(): string {
      return this.refreshToken
    },
    getUserRole(): string {
      return this.roles
    },
    getRouterByRoles(): string {
      return this.routerByRoles
    },
    getStaffInfo(): string {
      return this.staffInfo
    },
    getAccountId(): string {
      return this.accountId
    },
    getUserPermission(): iUserPermission|Nullable<iUserPermission> { 
      return this.userPermission
    }
  },
  actions: {
    generateRoutes(
      routers?: AppCustomRouteRecordRaw[] | string[],
      type = 'server' || 'client'
    ): Promise<unknown> {
      return new Promise<void>((resolve) => {
        let routerMap: AppRouteRecordRaw[] = []

        // Simulation rear filter menu
        if (type === 'server') routerMap = generateRoutesFn2(routers as AppCustomRouteRecordRaw[])
        // Simulate front -end filter menu
        else if (type === 'client')
          routerMap = generateRoutesFn1(cloneDeep(asyncRouterMap), routers as string[])
        // Read the static routing table directly
        else routerMap = cloneDeep(asyncRouterMap)

        // Dynamic route, 404 must be placed to the end
        this.addRouters = routerMap.concat([
          {
            path: '/:path(.*)*',
            redirect: '/404',
            name: '404Page',
            meta: {
              hidden: true,
              breadcrumb: false
            }
          }
        ])
        // All routing of the rendering menu
        this.routers = cloneDeep(constantRouterMap).concat(routerMap)
        resolve()
      })
    },
    setIsAddRouters(state: boolean): void {
      this.isAddRouters = state
    },
    setMenuTabRouters(routers: AppRouteRecordRaw[]): void {
      this.menuTabRouters = routers
    },
    checkRoleAndSetPermission(RoleList: iUserPermission[], currentRoute: RouteLocationNormalizedLoaded): void { 
      if (Array.isArray(RoleList) && RoleList.length > 0) {
        const { path } = currentRoute
        const hasRole = RoleList.find(el => el.url === path)
          this.userPermission = hasRole ?? null
      }else
      this.userPermission = null
    }
  }
})

export const usePermissionStoreWithOut = () => {
  return usePermissionStore(store)
}
