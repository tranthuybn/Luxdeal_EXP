<script setup lang="ts">
import { ElDrawer, ElDivider, ElButton, ElMessage } from 'element-plus'
import { ref, unref, computed, watch } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ThemeSwitch } from '@/components/ThemeSwitch'
import { colorIsDark, lighten, hexToRGB } from '@/utils/color'
import { useCssVar } from '@vueuse/core'
import { useAppStore } from '@/store/modules/app'
import { trim, setCssVar } from '@/utils'
import ColorRadioPicker from './components/ColorRadioPicker.vue'
import InterfaceDisplay from './components/InterfaceDisplay.vue'
import LayoutRadioPicker from './components/LayoutRadioPicker.vue'
import { useCache } from '@/hooks/web/useCache'
import { useClipboard } from '@vueuse/core'
import { useDesign } from '@/hooks/web/useDesign'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('setting')

const appStore = useAppStore()

const { t } = useI18n()

const layout = computed(() => appStore.getLayout)

const drawer = ref(false)

// Theme -related
const systemTheme = ref(appStore.getTheme.elColorPrimary)

const setSystemTheme = (color: string) => {
  setCssVar('--el-color-primary', color)
  appStore.setTheme({ elColorPrimary: color })
  const leftMenuBgColor = useCssVar('--left-menu-bg-color', document.documentElement)
  setMenuTheme(trim(unref(leftMenuBgColor)))
}

// Head -themed theme
const headerTheme = ref(appStore.getTheme.topHeaderBgColor || '')

const setHeaderTheme = (color: string) => {
  const isDarkColor = colorIsDark(color)
  const textColor = isDarkColor ? '#fff' : 'inherit'
  const textHoverColor = isDarkColor ? lighten(color!, 6) : '#f6f6f6'
  const topToolBorderColor = isDarkColor ? color : '#eee'
  setCssVar('--top-header-bg-color', color)
  setCssVar('--top-header-text-color', textColor)
  setCssVar('--top-header-hover-color', textHoverColor)
  setCssVar('--top-tool-border-color', topToolBorderColor)
  appStore.setTheme({
    topHeaderBgColor: color,
    topHeaderTextColor: textColor,
    topHeaderHoverColor: textHoverColor,
    topToolBorderColor
  })
  if (unref(layout) === 'top') {
    setMenuTheme(color)
  }
}

// Menu theme related
const menuTheme = ref(appStore.getTheme.leftMenuBgColor || '')

const setMenuTheme = (color: string) => {
  const primaryColor = useCssVar('--el-color-primary', document.documentElement)
  const isDarkColor = colorIsDark(color)
  const theme: Recordable = {
    // The color of the left menu border
    leftMenuBorderColor: isDarkColor ? 'inherit' : '#eee',
    // The background color of the left menu
    leftMenuBgColor: color,
    // The left menu light background color
    leftMenuBgLightColor: isDarkColor ? lighten(color!, 6) : color,
    // Left menu selection background color
    leftMenuBgActiveColor: isDarkColor
      ? 'var(--el-color-primary)'
      : hexToRGB(unref(primaryColor), 0.1),
    // The left menu puts away the selected background color
    leftMenuCollapseBgActiveColor: isDarkColor
      ? 'var(--el-color-primary)'
      : hexToRGB(unref(primaryColor), 0.1),
    // The font color of the left menu
    leftMenuTextColor: isDarkColor ? '#bfcbd9' : '#333',
    // Select the font color of the left menu
    leftMenuTextActiveColor: isDarkColor ? '#fff' : 'var(--el-color-primary)',
    // logo font color
    logoTitleTextColor: isDarkColor ? '#fff' : 'inherit',
    // LOGO border color
    logoBorderColor: isDarkColor ? color : '#eee'
  }
  appStore.setTheme(theme)
  appStore.setCssVarTheme()
}
if (layout.value === 'top' && !appStore.getIsDark) {
  headerTheme.value = '#fff'
  setHeaderTheme('#fff')
}

// Surveillance layout changes, reset some theme colors
watch(
  () => layout.value,
  (n) => {
    if (n === 'top' && !appStore.getIsDark) {
      headerTheme.value = '#fff'
      setHeaderTheme('#fff')
    } else {
      setMenuTheme(unref(menuTheme))
    }
  }
)

// copy
const copyConfig = async () => {
  const { copy, copied, isSupported } = useClipboard({
    source: `
      // Bread crumbs
      breadcrumb: ${appStore.getBreadcrumb},
      // Bread crumb icon
      breadcrumbIcon: ${appStore.getBreadcrumbIcon},
      // Folding icon
      hamburger: ${appStore.getHamburger},
      // Full -screen icon
      screenfull: ${appStore.getScreenfull},
      // Size icon
      size: ${appStore.getSize},
      // Multi -language icon
      locale: ${appStore.getLocale},
      // Bookmark page
      tagsView: ${appStore.getTagsView},
      // Tab icon
      getTagsViewIcon: ${appStore.getTagsViewIcon},
      // logo
      logo: ${appStore.getLogo},
      // Menukin piano
      uniqueOpened: ${appStore.getUniqueOpened},
      // Fixed header
      fixedHeader: ${appStore.getFixedHeader},
      // Kick
      footer: ${appStore.getFooter},
      // Gray mode
      greyMode: ${appStore.getGreyMode},
      // layout layout
      layout: '${appStore.getLayout}',
      // Dark mode
      isDark: ${appStore.getIsDark},
      // Component size
      currentSize: '${appStore.getCurrentSize}',
      // Theme -related
      theme: {
        // Theme color
        elColorPrimary: '${appStore.getTheme.elColorPrimary}',
        // The color of the left menu border
        leftMenuBorderColor: '${appStore.getTheme.leftMenuBorderColor}',
        // The background color of the left menu
        leftMenuBgColor: '${appStore.getTheme.leftMenuBgColor}',
        // The left menu light background color
        leftMenuBgLightColor: '${appStore.getTheme.leftMenuBgLightColor}',
        // Left menu selection background color
        leftMenuBgActiveColor: '${appStore.getTheme.leftMenuBgActiveColor}',
        // The left menu puts away the selected background color
        leftMenuCollapseBgActiveColor: '${appStore.getTheme.leftMenuCollapseBgActiveColor}',
        // The font color of the left menu
        leftMenuTextColor: '${appStore.getTheme.leftMenuTextColor}',
        // Select the font color of the left menu
        leftMenuTextActiveColor: '${appStore.getTheme.leftMenuTextActiveColor}',
        // logo font color
        logoTitleTextColor: '${appStore.getTheme.logoTitleTextColor}',
        // LOGO border color
        logoBorderColor: '${appStore.getTheme.logoBorderColor}',
        // Head background color
        topHeaderBgColor: '${appStore.getTheme.topHeaderBgColor}',
        // Head font color
        topHeaderTextColor: '${appStore.getTheme.topHeaderTextColor}',
        // Head suspension color
        topHeaderHoverColor: '${appStore.getTheme.topHeaderHoverColor}',
        // Head border color
        topToolBorderColor: '${appStore.getTheme.topToolBorderColor}'
      }
    `
  })
  if (!isSupported) {
    ElMessage.error(t('setting.copyFailed'))
  } else {
    await copy()
    if (unref(copied)) {
      ElMessage.success(t('setting.copySuccess'))
    }
  }
}

// Empty the cache
const clear = () => {
  const { wsCache } = useCache()
  wsCache.delete('layout')
  wsCache.delete('theme')
  wsCache.delete('isDark')
  window.location.reload()
}
</script>

<template>
  <div
    :class="prefixCls"
    class="fixed top-[45%] right-0 w-40px h-40px text-center leading-40px bg-[var(--el-color-primary)] cursor-pointer"
    @click="drawer = true"
  >
    <Icon icon="ant-design:setting-outlined" color="#fff" />
  </div>

  <ElDrawer v-model="drawer" direction="rtl" size="350px">
    <template #header>
      <span class="text-16px font-700">{{ t('setting.projectSetting') }}</span>
    </template>

    <div class="text-center">
      <!-- theme -->
      <ElDivider>{{ t('setting.theme') }}</ElDivider>
      <ThemeSwitch />

      <!-- layout -->
      <ElDivider>{{ t('setting.layout') }}</ElDivider>
      <LayoutRadioPicker />

      <!-- System theme -->
      <ElDivider>{{ t('setting.systemTheme') }}</ElDivider>
      <ColorRadioPicker
        v-model="systemTheme"
        :schema="[
          '#409eff',
          '#009688',
          '#536dfe',
          '#ff5c93',
          '#ee4f12',
          '#0096c7',
          '#9c27b0',
          '#ff9800'
        ]"
        @change="setSystemTheme"
      />

      <!-- Head theme -->
      <ElDivider>{{ t('setting.headerTheme') }}</ElDivider>
      <ColorRadioPicker
        v-model="headerTheme"
        :schema="[
          '#fff',
          '#151515',
          '#5172dc',
          '#e74c3c',
          '#24292e',
          '#394664',
          '#009688',
          '#383f45'
        ]"
        @change="setHeaderTheme"
      />

      <!-- Menu theme -->
      <template v-if="layout !== 'top'">
        <ElDivider>{{ t('setting.menuTheme') }}</ElDivider>
        <ColorRadioPicker
          v-model="menuTheme"
          :schema="[
            '#fff',
            '#001529',
            '#212121',
            '#273352',
            '#191b24',
            '#383f45',
            '#001628',
            '#344058'
          ]"
          @change="setMenuTheme"
        />
      </template>
    </div>

    <!-- Interface display -->
    <ElDivider>{{ t('setting.interfaceDisplay') }}</ElDivider>
    <InterfaceDisplay />

    <ElDivider />
    <div>
      <ElButton type="primary" class="w-full" @click="copyConfig">{{ t('setting.copy') }}</ElButton>
    </div>
    <div class="mt-5px">
      <ElButton type="danger" class="w-full" @click="clear">
        {{ t('setting.clearAndReset') }}
      </ElButton>
    </div>
  </ElDrawer>
</template>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-setting';

.@{prefix-cls} {
  border-radius: 6px 0 0 6px;
}
</style>
