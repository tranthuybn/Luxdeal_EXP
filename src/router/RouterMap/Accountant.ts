import { Layout } from '@/utils/routerHelper'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
export default {
  path: '/accountant',
  component: Layout,
  redirect: '/accountant/payment-proposal',
  name: 'accountant',
  meta: {
    title: t('router.accountant'),
    icon: 'carbon:calculation-alt',
    alwaysShow: true
  },
  children: [
    {
      path: 'payment-proposal',
      component: () => import('@/views/Pages/Accountant/PaymentProposal.vue'),
      name: 'accountant.payment-proposal',
      meta: {
        title: t('router.paymentProposal')
      }
    },
    {
      path: 'receipts-and-expenditures',
      component: () => import('@/views/Pages/Accountant/ReceiptsAndExpenditures.vue'),
      name: 'accountant.receiptsAndExpenditures',
      meta: {
        title: t('router.receiptsAndExpenditures')
      }
    },
    {
      path: 'balanceSheet',
      component: () => import('@/views/Pages/Accountant/BalanceSheet.vue'),
      name: 'accountant.balanceSheet',
      meta: {
        title: t('router.balanceSheet')
      }
    }
  ]
}
