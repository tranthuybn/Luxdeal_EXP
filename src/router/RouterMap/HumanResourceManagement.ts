import { Layout } from '@/utils/routerHelper'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
export default {
  path: '/human-resource-management',
  component: Layout,
  redirect: '/human-resource-management',
  name: 'human-resource-management',
  meta: {
    title: t('router.humanResourceManagement'),
    icon: 'bx:user',
    alwaysShow: true
  },
  children: [
    {
      path: 'personnel-accounts',
      name: 'human-resource-management.personnel-accounts',
      component: () => import('@/views/Pages/HumanResourceManagement/PersonnelAccounts/index.vue'),
      meta: {
        title: t('router.personnelAccounts')
      }
    }
  ]
}
