<script lang="tsx">
import { computed, defineComponent, unref, PropType } from 'vue'
import { ElMenu, ElScrollbar } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import type { LayoutType } from '@/config/app'
import { useRenderMenuItem } from './components/useRenderMenuItem'
import { useRouter } from 'vue-router'
import { isUrl } from '@/utils/is'
import { useDesign } from '@/hooks/web/useDesign'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('menu')

export default defineComponent({
  name: 'Menu',
  props: {
    menuSelect: {
      type: Function as PropType<(index: string) => void>,
      default: undefined
    }
  },
  setup(props) {
    const appStore = useAppStore()

    //get type of layout
    const layout = computed(() => appStore.getLayout)

    const { push, currentRoute } = useRouter()

    const permissionStore = usePermissionStore()

    const menuMode = computed((): 'vertical' | 'horizontal' => {
      // vertical
      const vertical: LayoutType[] = ['classic', 'topLeft', 'cutMenu']

      if (vertical.includes(unref(layout))) {
        return 'vertical'
      } else {
        return 'horizontal'
      }
    })

    const routers = computed(() =>
      unref(layout) === 'cutMenu' ? permissionStore.getMenuTabRouters : permissionStore.getRouters
    )

    const collapse = computed(() => appStore.getCollapse)

    const uniqueOpened = computed(() => appStore.getUniqueOpened)

    const activeMenu = computed(() => {
      const { meta, path } = unref(currentRoute)
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu as string
      }
      return path
    })
    // select menu event
    const menuSelect = (index: string) => {
      if (props.menuSelect) {
        props.menuSelect(index)
      }
      // Custom event
      if (isUrl(index)) {
        window.open(index)
      } else {
        push(index)
      }
    }
    // if menu is side bar that will be has scroll bar
    const renderMenuWrap = () => {
      if (unref(layout) === 'top') {
        return renderMenu()
      } else {
        return <ElScrollbar>{renderMenu()}</ElScrollbar>
      }
    }

    const renderMenu = () => {
      return (
        <ElMenu
          defaultActive={unref(activeMenu)}
          mode={unref(menuMode)}
          collapse={
            unref(layout) === 'top' || unref(layout) === 'cutMenu' ? false : unref(collapse)
          }
          uniqueOpened={unref(layout) === 'top' ? false : unref(uniqueOpened)}
          backgroundColor="var(--left-menu-bg-color)"
          textColor="var(--left-menu-text-color)"
          activeTextColor="var(--left-menu-text-active-color)"
          onSelect={menuSelect}
        >
          {{
            default: () => {
              const { renderMenuItem } = useRenderMenuItem(unref(routers), unref(menuMode))
              return renderMenuItem()
            }
          }}
        </ElMenu>
      )
    }

    return () => (
      <div
        id={prefixCls}
        class={[
          `${prefixCls} ${prefixCls}__${unref(menuMode)}`,
          'h-[100%] overflow-hidden flex-col bg-[var(--left-menu-bg-color)]',
          {
            'w-[var(--left-menu-min-width)]': unref(collapse) && unref(layout) !== 'cutMenu',
            'w-[var(--left-menu-max-width)]': !unref(collapse) && unref(layout) !== 'cutMenu'
          }
        ]}
      >
        {renderMenuWrap()}
      </div>
    )
  }
})
</script>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-menu';

.is-active--after {
  position: absolute;
  top: 0;
  right: 0;
  width: 4px;
  height: 100%;
  background-color: var(--el-color-primary);
  content: '';
}

.@{prefix-cls} {
  position: relative;
  transition: width var(--transition-time-02);

  &:after {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    border-left: 1px solid var(--left-menu-border-color);
    content: '';
  }

  :deep(.@{elNamespace}-menu) {
    width: 100% !important;
    border-right: none;

    // Set the color of the child title when selecting
    .is-active {
      & > .@{elNamespace}-sub-menu__title {
        color: var(--left-menu-text-active-color) !important;
      }
    }


    // Set the high brightness and background color of the sub -menu hovering
    .@{elNamespace}-sub-menu__title{
      padding: 0 20px 0 4px;
    }
    .@{elNamespace}-sub-menu__title,
    .@{elNamespace}-menu-item {
      box-shadow: inset 0px 0px 6px 1px var(--left-menu-main-item-box-shadow-color);
      &:hover {
        color: var(--left-menu-text-active-color) !important;
        background-color: var(--left-menu-bg-color) !important;
      }
    }
    .@{elNamespace}-menu-item{
      padding: 0 20px 0 6px;
      span{
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    // Set the high bright background and highlight color when selected
    .@{elNamespace}-sub-menu.is-active,
    .@{elNamespace}-menu-item.is-active {
      color: var(--left-menu-text-active-color) !important;
      background-color: var(--left-menu-bg-active-color) !important;

      &:hover {
        background-color: var(--left-menu-bg-active-color) !important;
      }
    }

    .@{elNamespace}-menu-item.is-active {
      position: relative;

      &:after {
        .is-active--after;
      }
    }

    // Set the background color of the sub -menu
    .@{elNamespace}-menu {
      .@{elNamespace}-sub-menu__title,
      .@{elNamespace}-menu-item:not(.is-active) {
        background-color: var(--left-menu-bg-light-color) !important;
        padding: 0 20px 0 7px;
        border-bottom:1px solid var(--left-menu-bg-color);
        box-shadow: inset 0px 0px 6px 1px var(--left-menu-box-shadow-inset-color);
      }
    }
  }

  // The minimum width when folding
  :deep(.@{elNamespace}-menu--collapse) {
    width: var(--left-menu-min-width);
    .@{elNamespace}-sub-menu__title{
      padding: 0 20px;
    }
    .@{elNamespace}-menu-item{
      padding: 0 22px;

    }
    & > .is-active,
    & > .is-active > .@{elNamespace}-sub-menu__title {
      position: relative;
      background-color: var(--left-menu-collapse-bg-active-color) !important;

      &:after {
        .is-active--after;
      }
    }
  }

  // When folding animation, you need to hide the text
  :deep(.horizontal-collapse-transition) {
    // transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out !important;
    .@{prefix-cls}__title {
      display: none;
    }
  }

  // Horizontal menu
  &__horizontal {
    height: calc(~'var( --top-tool-height)') !important;

    :deep(.@{elNamespace}-menu--horizontal) {
      height: calc(~'var( --top-tool-height)');
      border-bottom: none;
      // Set the high bright color at the bottom
      & > .@{elNamespace}-sub-menu.is-active {
        .@{elNamespace}-sub-menu__title {
          border-bottom-color: var(--el-color-primary) !important;
        }
      }

      .@{elNamespace}-menu-item.is-active {
        position: relative;

        &:after {
          display: none !important;
        }
      }

      .@{prefix-cls}__title {
        /* stylelint-disable-next-line */
        max-height: calc(~'var(--top-tool-height) - 2px') !important;
        /* stylelint-disable-next-line */
        line-height: calc(~'var(--top-tool-height) - 2px');
      }
    }
  }
}
</style>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-menu-popper';
.is-active--after {
  position: absolute;
  top: 0;
  right: 0;
  width: 4px;
  height: 100%;
  background-color: var(--el-color-primary);
  content: '';
}

.@{prefix-cls}--vertical,
.@{prefix-cls}--horizontal {
  // Set the color of the child title when selecting
  .is-active {
    & > .el-sub-menu__title {
      color: var(--left-menu-text-active-color) !important;
    }
  }

  // Set the high brightness and background color of the sub -menu hovering
  .el-sub-menu__title,
  .el-menu-item {
    &:hover {
      color: var(--left-menu-text-active-color) !important;
      background-color: var(--left-menu-bg-color) !important;
    }
  }

  // Set the highlight background when selected
  .el-menu-item.is-active {
    position: relative;
    background-color: var(--left-menu-bg-active-color) !important;

    &:hover {
      background-color: var(--left-menu-bg-active-color) !important;
    }

    &:after {
      .is-active--after;
    }
  }
}
</style>
