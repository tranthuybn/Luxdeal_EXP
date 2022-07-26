import { Layout, getParentLayout } from '@/utils/routerHelper'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
export default {
  path: '/components',
  component: Layout,
  redirect: '/components/icon',
  name: 'ComponentsDemo',
  meta: {
    title: t('router.component'),
    icon: 'bx:bxs-component',
    alwaysShow: true
  },
  children: [
    {
      path: 'form',
      component: getParentLayout(),
      name: 'Form',
      meta: {
        title: t('router.form'),
        alwaysShow: true
      },
      children: [
        {
          path: 'default-form',
          component: () => import('@/views/Components/Form/DefaultForm.vue'),
          name: 'DefaultForm',
          meta: {
            title: t('router.defaultForm')
          }
        },
        {
          path: 'use-form',
          component: () => import('@/views/Components/Form/UseFormDemo.vue'),
          name: 'UseForm',
          meta: {
            title: 'UseForm'
          }
        },
        {
          path: 'ref-form',
          component: () => import('@/views/Components/Form/RefForm.vue'),
          name: 'RefForm',
          meta: {
            title: 'RefForm'
          }
        }
      ]
    },
    {
      path: 'table',
      component: getParentLayout(),
      name: 'TableDemo',
      meta: {
        title: t('router.table'),
        alwaysShow: true
      },
      children: [
        {
          path: 'default-table',
          component: () => import('@/views/Components/Table/DefaultTable.vue'),
          name: 'DefaultTable',
          meta: {
            title: t('router.defaultTable')
          }
        },
        {
          path: 'use-table',
          component: () => import('@/views/Components/Table/UseTableDemo.vue'),
          name: 'UseTable',
          meta: {
            title: 'UseTable'
          }
        },
        {
          path: 'ref-table',
          component: () => import('@/views/Components/Table/RefTable.vue'),
          name: 'RefTable',
          meta: {
            title: 'RefTable'
          }
        }
      ]
    },
    {
      path: 'editor-demo',
      component: getParentLayout(),
      name: 'EditorDemo',
      meta: {
        title: t('router.editor'),
        alwaysShow: true
      },
      children: [
        {
          path: 'editor',
          component: () => import('@/views/Components/Editor/Editor.vue'),
          name: 'Editor',
          meta: {
            title: t('router.richText')
          }
        }
      ]
    },
    {
      path: 'search',
      component: () => import('@/views/Components/Search.vue'),
      name: 'Search',
      meta: {
        title: t('router.search')
      }
    },
    {
      path: 'descriptions',
      component: () => import('@/views/Components/Descriptions.vue'),
      name: 'Descriptions',
      meta: {
        title: t('router.descriptions')
      }
    },
    {
      path: 'image-viewer',
      component: () => import('@/views/Components/ImageViewer.vue'),
      name: 'ImageViewer',
      meta: {
        title: t('router.imageViewer')
      }
    },
    {
      path: 'dialog',
      component: () => import('@/views/Components/Dialog.vue'),
      name: 'Dialog',
      meta: {
        title: t('router.dialog')
      }
    },
    {
      path: 'icon',
      component: () => import('@/views/Components/Icon.vue'),
      name: 'Icon',
      meta: {
        title: t('router.icon')
      }
    },
    {
      path: 'echart',
      component: () => import('@/views/Components/Echart.vue'),
      name: 'Echart',
      meta: {
        title: t('router.echart')
      }
    },
    {
      path: 'count-to',
      component: () => import('@/views/Components/CountTo.vue'),
      name: 'CountTo',
      meta: {
        title: t('router.countTo')
      }
    },
    {
      path: 'qrcode',
      component: () => import('@/views/Components/Qrcode.vue'),
      name: 'Qrcode',
      meta: {
        title: t('router.qrcode')
      }
    },
    {
      path: 'highlight',
      component: () => import('@/views/Components/Highlight.vue'),
      name: 'Highlight',
      meta: {
        title: t('router.highlight')
      }
    },
    {
      path: 'infotip',
      component: () => import('@/views/Components/Infotip.vue'),
      name: 'Infotip',
      meta: {
        title: t('router.infotip')
      }
    },
    {
      path: 'input-password',
      component: () => import('@/views/Components/InputPassword.vue'),
      name: 'InputPassword',
      meta: {
        title: t('router.inputPassword')
      }
    },
    {
      path: 'sticky',
      component: () => import('@/views/Components/Sticky.vue'),
      name: 'Sticky',
      meta: {
        title: t('router.sticky')
      }
    }
  ]
}
