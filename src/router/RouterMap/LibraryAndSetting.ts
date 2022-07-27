import { Layout } from '@/utils/routerHelper'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
export default {
  path: '/library-and-setting',
  component: Layout,
  redirect: { name: 'library-and-setting.dashboard' },
  name: 'Library-and-setting',
  meta: {
    title: t('router.libraryAndSetting'),
    icon: 'carbon:cloud-satellite-config',
    alwaysShow: true
  },
  children: [
    {
      path: 'dashboard',
      component: () => import('@/views/Pages/LibraryAndSetting/index.vue'),
      name: 'Library-and-setting.dashboard',
      meta: {
        title: t('router.libraryAndSetting')
      }
    }
  ]
}
