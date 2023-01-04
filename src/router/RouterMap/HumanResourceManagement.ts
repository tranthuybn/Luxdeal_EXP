import { Layout } from '@/utils/routerHelper'
import { useI18n } from '@/hooks/web/useI18n'
import { appModules } from '@/config/app'
const { utility } = appModules
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
    },
    {
      path: `personnel-accounts-utility/:type?/:id?`,
      component: () =>
        import('@/views/Pages/HumanResourceManagement/PersonnelAccounts/AddPersonnelAccounts.vue'),
      name: `human-resource-management.personnel-accounts.${utility}`,
      meta: {
        title: 'Thêm mới nhân sự & tài khoản',
        noTagsView: true,
        noCache: true,
        hidden: true,
        canTo: true,
        showMainRoute: true
      }
    },
    {
      path: 'department-directory',
      name: 'human-resource-management.department-directory',
      component: () => import('@/views/Pages/HumanResourceManagement/DepartmentDirectory.vue'),
      meta: {
        title: t('router.departmentDirectory')
      }
    },
    {
      path: `department-directory-utility/:type?/:tab?/:id?`,
      component: () =>
        import('@/views/Pages/HumanResourceManagement/DepartmentDirectoryUtility.vue'),
      name: `human-resource-management.department-directory.${utility}`,
      meta: {
        title: t('reuse.addNewBranch'),
        noTagsView: true,
        noCache: true,
        hidden: true,
        canTo: true,
        showMainRoute: true
      }
    }
  ]
}
