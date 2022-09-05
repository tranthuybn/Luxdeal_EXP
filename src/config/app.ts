import { useCache } from '@/hooks/web/useCache'

const { wsCache } = useCache()

export type LayoutType = 'classic' | 'topLeft' | 'top' | 'cutMenu'

export type ThemeTypes = {
  elColorPrimary?: string
  leftMenuBorderColor?: string
  leftMenuBgColor?: string
  leftMenuBgLightColor?: string
  leftMenuBgActiveColor?: string
  leftMenuCollapseBgActiveColor?: string
  leftMenuTextColor?: string
  leftMenuTextActiveColor?: string
  logoTitleTextColor?: string
  logoBorderColor?: string
  topHeaderBgColor?: string
  topHeaderTextColor?: string
  topHeaderHoverColor?: string
  topToolBorderColor?: string
}
export interface AppState {
  breadcrumb: boolean
  breadcrumbIcon: boolean
  collapse: boolean
  uniqueOpened: boolean
  hamburger: boolean
  screenfull: boolean
  size: boolean
  locale: boolean
  tagsView: boolean
  tagsViewIcon: boolean
  logo: boolean
  fixedHeader: boolean
  greyMode: boolean
  pageLoading: boolean
  layout: LayoutType
  title: string
  userInfo: string
  isDark: boolean
  currentSize: ElememtPlusSize
  sizeMap: ElememtPlusSize[]
  mobile: boolean
  footer: boolean
  theme: ThemeTypes
  utility: string
  version: string
}

export const appModules: AppState = {
  version: 'V.1.0.1', // version
  utility: 'Utility', // push to Add-Component of each route
  userInfo: 'userInfo', // Login information storage field-It is recommended to change a field for each project to avoid conflicting with other projects
  sizeMap: ['default', 'large', 'small'],
  mobile: false, // Whether it is a mobile terminal
  title: 'Luxdeal ERP', //title
  pageLoading: false, // Route jumping loading

  breadcrumb: true, //Bread crumbs
  breadcrumbIcon: true, //Bread crumb icon
  collapse: false, // Folding menu
  uniqueOpened: false, // Do you only keep the expansion of a sub -menu?
  hamburger: true, // Folding icon
  screenfull: true, // Full -screen icon
  size: true, // Size icon
  locale: true, // Multi -language icon
  tagsView: true, // Bookmark page
  tagsViewIcon: true, // Whether to display the label icon
  logo: true, // logo
  fixedHeader: true, // Fixed TOOLHEADER
  footer: false, // Display foot
  greyMode: false, // Whether the gray mode starts for special mourning days

  layout: wsCache.get('layout') || 'cutMenu', // layout layout
  isDark: wsCache.get('isDark') || false, // Is it a dark mode
  currentSize: wsCache.get('default') || 'default', // Component size
  theme: wsCache.get('theme') || {
    // Theme color
    elColorPrimary: '#409eff',
    // The color of the left menu border
    leftMenuBorderColor: 'inherit',
    // The background color of the left menu
    leftMenuBgColor: '#001529',
    // The left menu light background color
    leftMenuBgLightColor: '#0f2438',
    // Left menu selection background color
    leftMenuBgActiveColor: 'var(--el-color-primary)',
    // The left menu puts away the selected background color
    leftMenuCollapseBgActiveColor: 'var(--el-color-primary)',
    // The font color of the left menu
    leftMenuTextColor: '#bfcbd9',
    // Select the font color of the left menu
    leftMenuTextActiveColor: '#fff',
    // logo font color
    logoTitleTextColor: '#fff',
    // LOGO border color
    logoBorderColor: 'inherit',
    // Head background color
    topHeaderBgColor: '#fff',
    // Head font color
    topHeaderTextColor: 'inherit',
    // Head suspension color
    topHeaderHoverColor: '#f6f6f6',
    // Head border color
    topToolBorderColor: '#eee'
  }
}
