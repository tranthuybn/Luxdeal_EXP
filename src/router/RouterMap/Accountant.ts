import { Layout } from '@/utils/routerHelper'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
export default {
  path: '/accountant',
  component: Layout,
  redirect: '/accountant/dashboard',
  name: 'accountant',
  meta: {
    title: t('router.accountant'),
    icon: 'carbon:calculation-alt',
    alwaysShow: true
  },
  children: [
    {
      path: 'dashboard',
      component: () => import('@/views/Pages/Accountant/index.vue'),
      name: 'accountant-dashboard',
      meta: {
        title: 'dashboard'
      }
    }
  ]
}
