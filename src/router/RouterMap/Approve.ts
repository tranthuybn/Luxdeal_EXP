import { Layout } from '@/utils/routerHelper'
import { useI18n } from '@/hooks/web/useI18n'
import { appModules } from '@/config/app'

const { utility } = appModules
const { t } = useI18n()
export default {
  path: '/approve',
  component: Layout,
  redirect: {name:'approve.products-approval'},
  name: 'approve',
  meta: {
    title: t('router.approve'),
    icon: 'akar-icons:chat-approve',
    alwaysShow: true
  },
  children: [
    {
      path: 'products-approval',
      redirect: { name: 'approve.products-approval.newly-initialized' },
      name: 'approve.products-approval',
      meta: {
        title: t('router.approveProducts')
      },
      children: [
        {
          path: 'newly-initialized',
          component: () => import('@/views/Pages/Approval/Products/ApprovalProduct.vue'),
          name: 'approve.products-approval.newly-initialized',
          meta: {
            title: t('router.newlyInitialized')
          }
        },
        {
          path: 'edit',
          component: () => import('@/views/Pages/Approval/Products/ApprovalProduct.vue'),
          name: 'approve.products-approval.edit',
          meta: {
            title: t('router.edit')
          }
        }
      ]
    },
    {
      path: 'orders-approval',
      redirect: { name: 'approve.orders-approval.orders-new' },
      name: 'approve.orders-approval',
      meta: {
        title: t('router.approveOrders')
      },
      children: [
        {
          path: 'orders-new',
          component: () => import('@/views/Pages/Approval/Orders/index.vue'),
          name: 'approve.orders-approval.orders-new',
          meta: {
            title: t('router.odersNew')
          }
        },
        {
          path: 'orders-edit',
          component: () => import('@/views/Pages/Approval/Orders/index.vue'),
          name: 'approve.orders-approval.orders-edit',
          meta: {
            title: t('router.odersEdit')
          }
        },
        {
          path: 'orders-cancel',
          component: () => import('@/views/Pages/Approval/Orders/index.vue'),
          name: 'approve.orders-approval.orders-cancel',
          meta: {
            title: t('router.odersCancel')
          }
        }
      ]
    },
    {
      path: 'payment-approval',
      redirect: { name: 'approve.payment-approval.proposal' },
      name: 'approve.payment-approval',
      meta: {
        title: t('router.approvePayments')
      },
      children: [
        {
          path: 'proposal',
          component: () => import('@/views/Pages/Approval/Payments/index.vue'),
          name: 'approve.payment-approval.proposal',
          meta: {
            title: t('router.paymentProposal')
          },
        },
        {
          path: 'proposal-utility/:type?/:id?',
          component: () => import('@/views/Pages/Accountant/PaymentProposal/PaymentProposalAdd.vue'),
          name: `approve.payment-approval.proposal.${utility}`,
          meta: {
            title: t('formDemo.detailsOfPaymentRequest'),
            canTo: true,
            hidden: true,
          },
        },
        {
          path: 'receipts-and-expenditures',
          component: () => import('@/views/Pages/Approval/Payments/index.vue'),
          name: 'approve.payment-approval.receipts-and-expenditures',
          meta: {
            title: t('router.receiptsAndExpenditures')
          }
        }
      ]
    },
    {
      path: 'accounts-approval',
      redirect: { name: 'approve.accounts-approval.user-account' },
      name: 'approve.accounts-approval',
      meta: {
        title: t('router.approveAccounts')
      },
      children: [
        {
          path: 'user-account',
          component: () => import('@/views/Pages/Approval/Accounts/index.vue'),
          name: 'approve.accounts-approval.user-account',
          meta: {
            title: t('router.userAccount')
          }
        },
        {
          path: 'collaborator-account',
          component: () => import('@/views/Pages/Approval/Accounts/index.vue'),
          name: 'approve.accounts-approval.collaborator-account',
          meta: {
            title: t('router.collaboratorAccount')
          }
        }
      ]
    },
    {
      path: 'approve-promotion-strategy',
      name: 'approve.approve-promotion-strategy',
      redirect: { name: 'approve.approve-promotion-strategy.approve-flashsale' },
      meta: {
        title: t('router.approvePromotionStrategy')
      },
      children: [
        {
          path: 'approve-flashsale',
          component: () => import('@/views/Pages/Approval/PromotionStrategy/index.vue'),
          name: 'approve.approve-promotion-strategy.approve-flashsale',
          meta: {
            title: t('router.flashsale')
          }
        },
        {
          path: 'approve-collection',
          component: () => import('@/views/Pages/Approval/PromotionStrategy/index.vue'),
          name: 'approve.approve-promotion-strategy.approve-collection',
          meta: {
            title: t('router.collection')
          }
        },
        {
          path: 'approve-newproduct',
          component: () => import('@/views/Pages/Approval/PromotionStrategy/index.vue'),
          name: 'approve.approve-promotion-strategy.approve-newproduct',
          meta: {
            title: t('router.newproduct')
          }
        },
        {
          path: 'approve-voucher',
          component: () => import('@/views/Pages/Approval/PromotionStrategy/index.vue'),
          name: 'approve.approve-promotion-strategy.approve-voucher',
          meta: {
            title: t('router.voucher')
          }
        },
        {
          path: 'approve-combo',
          component: () => import('@/views/Pages/Approval/PromotionStrategy/index.vue'),
          name: 'approve.approve-promotion-strategy.approve-combo',
          meta: {
            title: t('router.combo')
          }
        },
        {
          path: 'approve-auction',
          component: () => import('@/views/Pages/Approval/PromotionStrategy/index.vue'),
          name: 'approve.approve-promotion-strategy.approve-auction',
          meta: {
            title: t('router.auction')
          }
        },
        {
          path: 'approve-advertisingBanner',
          component: () => import('@/views/Pages/Approval/PromotionStrategy/index.vue'),
          name: 'approve.approve-promotion-strategy.approve-advertisingBanner',
          meta: {
            title: t('router.advertisingBanner')
          }
        }
      ]
    },
    {
      path: 'approve-management',
      component: () => import('@/views/Pages/Approval/ApprovalManagement.vue'),
      name: 'approve.approve-management',
      meta: {
        title: t('router.approveManagement')
      }
    }
  ]
}
