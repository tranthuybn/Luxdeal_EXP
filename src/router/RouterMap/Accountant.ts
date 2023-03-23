import { Layout } from '@/utils/routerHelper'
import { useI18n } from '@/hooks/web/useI18n'
import { appModules } from '@/config/app'
const { utility } = appModules
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
            title: t('router.paymentProposalList'),
            add: true,
            edit: true,
            delete:true,
          }
        },
        {
          path: 'payment-proposal-list/:type?/:id?/:approvalId?',
          component: () =>
            import('@/views/Pages/Accountant/PaymentProposal/PaymentProposalAdd.vue'),
          name: `accountant.payment-proposal.payment-proposal-list.${utility}`,
          meta: {
            title: t('router.paymentProposalAdd')
          }
        }
      ]
    },
    {
      path: 'receipts-expenditures',
      name: 'accountant.receipts-expenditures',
      meta: {
        title: t('router.receiptsAndExpenditures')
      },
      children: [
        {
          path: 'receipts-expenditures-list',
          component: () =>
            import('@/views/Pages/Accountant/ReceiptsAndExpenditures/ReceiptsAndExpenditures.vue'),
          name: 'accountant.receipts-expenditures.receipts-expenditures-list',
          meta: {
            title: t('router.receiptsAndExpendituresList'),
            add: true,
            edit: true,
            delete:true,
          }
        },
        {
          path: `receipts-expenditures-list/:type?/:id?`,
          component: () =>
            import('@/views/Pages/Accountant/ReceiptsAndExpenditures/ReceiptsAdd.vue'),
          name: `accountant.receipts-expenditures.receipts-expenditures-list.${utility}`,
          meta: {
            title: t('router.receiptsAdd')
          }
        },
        {
          path: 'payment-add',
          component: () =>
            import('@/views/Pages/Accountant/ReceiptsAndExpenditures/PaymentsAdd.vue'),
          name: `accountant.receipts-expenditures.receipts-expenditures-list.payment-add.${utility}`,
          meta: {
            title: t('router.paymentsAdd')
          }
        }
      ]
    },
    {
      path: 'balanceSheet',
      name: 'accountant.balanceSheet',
      component: () => import('@/views/Pages/Accountant/BalanceSheet.vue'),
      meta: {
        title: t('router.balanceSheet'),
        add: true,
        edit: true,
        delete:true,
      }
    },
    {
      path: 'balanceSheet-utility/:type?/:id?',
      component: () => import('@/views/Pages/Accountant/BalanceSheetUtility.vue'),
      name: `accountant.balanceSheet.${utility}`,
      meta: {
        title: t('reuse.addNewAccount'),
        noTagsView: true,
        noCache: true,
        canTo: true,
        hidden: true,
        showMainRoute: true
      }
    }
  ]
}
