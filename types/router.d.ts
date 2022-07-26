import type { RouteRecordRaw } from 'vue-router'
import { defineComponent } from 'vue'

/**
* Redirect: No redirect When setting no redirect
* name: 'Router-Name' Set the name of the routing, be sure to fill it out, otherwise you will have various problems when using <Keep-Alive>
* meta: {
    Hidden: True When True is set to True, the route will no longer appear on the sidebar of the side side such as 404, login and other pages (default FALSE)

    AlwaysShow: True When the routing declared by the Children below your routing is greater than 1, it will automatically become an nested mode.
                              When there is only one, it will be displayed as a routing routing on the sidebar,
                              If you think the number of Children declared at the bottom of the route shows your root routing,
                              You can set always show: true so that it will ignore the rules defined before,
                              Always showing root routing (default FALSE)

    Title: 'Title' Set the name displayed in the sidebar and bread dandruff

    icon: 'svg-name' set the icon of this routing

    NoCache: True if it is set to true, it will not be cached by <Keep-alive> (default false)

    BreadCrumb: False If it is set to false, it will not be displayed in BreadCrumb bread dandruff (default true)

    Affix: True If it is set to true, it will be fixed in the TAG item (default FALSE)

    noTagsView: True If it is set to true, it will not appear in tag (default false)

    ActiveMenu: '/dashboard' shows the highlighting route path

    FollowAuth: '/dashboard' which routing is followed by permissions filtering

    CANTO: True is set to true, even if Hidden is true, it can still perform routing jumps (default False)
  }
**/
declare module 'vue-router' {
  interface RouteMeta extends Record<string | number | symbol, unknown> {
    hidden?: boolean
    alwaysShow?: boolean
    title?: string
    icon?: string
    noCache?: boolean
    breadcrumb?: boolean
    affix?: boolean
    activeMenu?: string
    noTagsView?: boolean
    followAuth?: string
    canTo?: boolean
  }
}

type Component<T = any> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<typeof import('*.vue')>)
  | (() => Promise<T>)

declare global {
  declare interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta'> {
    name: string
    meta: RouteMeta
    component?: Component | string
    children?: AppRouteRecordRaw[]
    props?: Recordable
    fullPath?: string
  }

  declare interface AppCustomRouteRecordRaw extends Omit<RouteRecordRaw, 'meta'> {
    name: string
    meta: RouteMeta
    component: string
    path: string
    redirect: string
    children?: AppCustomRouteRecordRaw[]
  }
}
