import { Layout } from '@/utils/routerHelper'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
export default {
  path: '/purchase',
  component: Layout,
  redirect: '/purchase',
  name: 'purchase',
  meta: {
    title: t('router.purchase'),
    icon: 'arcticons:purchased-apps',
    alwaysShow: true
  },
  children: [
    {
      path: 'business-purchases',
      name: 'purchase.business-purchases',
      redirect: { name: 'purchase.business-purchases.purchase-order-list' },
      meta: {
        title: t('router.businessPurchases')
      },
      children: [
        {
          path: 'purchase-order-list',
          component: () => import('@/views/Pages/Purchase/BusinessPurchases/PurchaseOrderAdd.vue'),
          name: 'purchase.business-purchases.purchase-order-list',
          meta: {
            title: t('router.purchaseOrderList')
          }
        },
        {
          path: 'purchase-order-add',
          component: () => import('@/views/Pages/Purchase/BusinessPurchases/PurchaseOrderList.vue'),
          name: 'purchase.business-purchases.purchase-order-add',
          meta: {
            title: t('router.purchaseOrderAdd')
          }
        }
      ]
    }
  ]
}
