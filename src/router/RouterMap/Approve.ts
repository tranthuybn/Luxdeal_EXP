import { Layout } from '@/utils/routerHelper'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
export default {
  path: '/approve',
  component: Layout,
  redirect: '/approve/products-approval',
  name: 'approve',
  meta: {
    title: t('router.approve'),
    icon: 'akar-icons:chat-approve',
    alwaysShow: true
  },
  children: [
    {
      path: 'products-approval',
      component: () => import('@/views/Pages/Approval/Products/index.vue'),
      name: 'approve.products-approval',
      meta: {
        title: t('router.products')
      }
    },
    {
      path: 'orders-approval',
      component: () => import('@/views/Pages/Approval/Orders/index.vue'),
      name: 'approve.orders-approval',
      meta: {
        title: t('router.orders')
      }
    },
    {
      path: 'payment-approval',
      component: () => import('@/views/Pages/Approval/Payments/index.vue'),
      name: 'approve.payment-approval',
      meta: {
        title: t('router.payments')
      }
    },
    {
      path: 'accounts-approval',
      component: () => import('@/views/Pages/Approval/Accounts/index.vue'),
      name: 'approve.accounts-approval',
      meta: {
        title: t('router.accounts')
      }
    }
  ]
}
