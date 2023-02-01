import { Layout } from '@/utils/routerHelper'
import { useI18n } from '@/hooks/web/useI18n'
import { appModules } from '@/config/app'
const { t } = useI18n()
const { utility } = appModules
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
          component: () => import('@/views/Pages/Purchase/BusinessPurchases/PurchaseOrderList.vue'),
          name: 'purchase.business-purchases.purchase-order-list',
          meta: {
            title: t('router.purchaseOrderList'),
            add: true,
            edit: true,
            delete:true,
          }
        },
        {
          path: 'purchase-order-add/:type?/:id?/:approvalId?',
          component: () => import('@/views/Pages/Purchase/BusinessPurchases/PurchaseOrderAdd.vue'),
          name: `purchase.business-purchases.purchase-order-list.${utility}`,
          meta: {
            title: t('router.purchaseOrderAdd'),
            noCache: true,
            showMainRoute: true
          }
        }
      ]
    }
  ]
}
