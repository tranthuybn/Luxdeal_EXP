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
      redirect: { name: 'accountant.payment-proposal.payment-proposal-list' },
      name: 'accountant.payment-proposal',
      meta: {
        title: t('router.paymentProposal')
      },
      children: [
        {
          path: 'payment-proposal-list',
          component: () =>
            import('@/views/Pages/Accountant/PaymentProposal/PaymentProposalList.vue'),
          name: 'accountant.payment-proposal.payment-proposal-list',
          meta: {
            title: t('router.paymentProposalList')
          }
        },
        {
          path: 'payment-proposal-add',
          component: () =>
            import('@/views/Pages/Accountant/PaymentProposal/PaymentProposalAdd.vue'),
          name: 'accountant.payment-proposal.payment-proposal-add',
          meta: {
            title: t('router.paymentProposalAdd')
          }
        }
      ]
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
