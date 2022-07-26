import { Layout } from '@/utils/routerHelper'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
export default {
  path: '/hooks',
  component: Layout,
  redirect: '/hooks/useWatermark',
  name: 'Hooks',
  meta: {
    title: t('router.component'),
    icon: 'ic:outline-webhook',
    alwaysShow: true
  },
  children: [
    {
      path: 'useWatermark',
      component: () => import('@/views/hooks/useWatermark.vue'),
      name: 'UseWatermark',
      meta: {
        title: 'useWatermark'
      }
    },
    {
      path: 'useCrudSchemas',
      component: () => import('@/views/hooks/useCrudSchemas.vue'),
      name: 'UseCrudSchemas',
      meta: {
        title: 'useCrudSchemas'
      }
    }
  ]
}
