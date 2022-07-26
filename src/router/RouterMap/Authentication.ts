import { Layout } from '@/utils/routerHelper'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
export default {
  path: '/authorization',
  component: Layout,
  redirect: '/authorization/user',
  name: 'Authorization',
  meta: {
    title: t('router.authorization'),
    icon: 'eos-icons:role-binding',
    alwaysShow: true
  },
  children: [
    {
      path: 'user',
      component: () => import('@/views/Authorization/User.vue'),
      name: 'User',
      meta: {
        title: t('router.user')
      }
    },
    {
      path: 'role',
      component: () => import('@/views/Authorization/Role.vue'),
      name: 'Role',
      meta: {
        title: t('router.role')
      }
    }
  ]
}
