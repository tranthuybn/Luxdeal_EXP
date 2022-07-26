import { Layout } from '@/utils/routerHelper'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
export default {
  path: '/guide',
  component: Layout,
  name: 'Guide',
  meta: {},
  children: [
    {
      path: 'index',
      component: () => import('@/views/Guide/Guide.vue'),
      name: 'GuideDemo',
      meta: {
        title: t('router.guide'),
        icon: 'dashicons:book'
      }
    }
  ]
}
