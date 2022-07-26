import { Layout } from '@/utils/routerHelper'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
export default {
  path: '/warehouse',
  component: Layout,
  redirect: '/warehouse/dashboard',
  name: 'warehouse',
  meta: {
    title: t('router.warehouseManagement'),
    icon: 'maki:warehouse',
    alwaysShow: true
  },
  children: [
    {
      path: 'dashboard',
      component: () => import('@/views/Pages/Warehouse/index.vue'),
      name: 'warehouse-dashboard',
      meta: {
        title: 'dashboard'
      }
    }
  ]
}
