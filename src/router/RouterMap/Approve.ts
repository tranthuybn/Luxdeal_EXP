import { Layout } from '@/utils/routerHelper'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
export default {
  path: '/approve',
  component: Layout,
  redirect: '/approve/dashboard',
  name: 'approve',
  meta: {
    title: t('router.business'),
    icon: 'akar-icons:chat-approve',
    alwaysShow: true
  },
  children: [
    {
      path: 'dashboard',
      component: () => import('@/views/Pages/Approval/index.vue'),
      name: 'approve-dashboard',
      meta: {
        title: 'dashboard'
      }
    }
  ]
}
