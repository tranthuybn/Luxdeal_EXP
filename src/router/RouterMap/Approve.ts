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
        },
        {
          path: `products-approval-utility/:type?/:id?/:approvalId?`,
          component: () =>
            import('@/views/Pages/ProductsAndServices/ProductLibrary/ProductUtility.vue'),
          name: `approve.products-approval.products-approval-utility.${utility}`,
          meta: {
            title: t('router.productLibraryProducts'),
            canTo: true,
            hidden: true
          }
        },
        {
          path: `service-approval-utility/:type?/:id?/:approvalId?`,
          component: () =>
            import('@/views/Pages/ProductsAndServices/ServiceLibrary/SpaServiceUtility.vue'),
          name: `approve.products-approval.service-approval-utility.${utility}`,
          meta: {
            title: t('router.ServiceLibrarySpaService'),
            noTagsView: true,
            noCache: true,
            canTo: true,
            hidden: true,
            canto: true
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
        },
        {
          path: 'orders-utility/:type?/:tab?/:id?/:approvalId?',
          component: () => import('@/views/Pages/Business/OrderManagement/index.vue'),
          name: `approve.orders-approval.orders-utility.${utility}`,
          meta: {
            title: t('reuse.ordersDetail'),
            noCache: true,
            showMainRoute: true,
            hidden: true,
            canTo: true
          }
        },
        {
          path: 'purchase-utility/:type?/:tab?/:id?/:approvalId?',
          component: () => import('@/views/Pages/Purchase/BusinessPurchases/PurchaseOrderAdd.vue'),
          name: `approve.orders-approval.purchase-utility.${utility}`,
          meta: {
            title: t('reuse.purchaseOrdersDetail'),
            noCache: true,
            showMainRoute: true,
            hidden: true,
            canTo: true
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
          path: 'proposal-utility/:type?/:id?/:approvalId?',
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
        },
        {
          path: 'receipts-and-expenditures-utility/:type?/:id?/:approvalId?',
          component: () => import('@/views/Pages/Accountant/ReceiptsAndExpenditures/ReceiptsAdd.vue'),
          name: `approve.payment-approval.receipts-and-expenditures.${utility}`,
          meta: {
            title: t('reuse.receiptsAddDetails'),
            hidden: true,
            canTo: true,
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
        },
        {
          path: `customer-accounts-approval-utility/:type?/:id?/:approvalId?`,
          component: () =>
          import('@/views/Pages/Business/CustomerManagement/CustomerAdd.vue'),
          name: `approve.accounts-approval.customer-accounts-approval-utility.${utility}`,
          meta: {
            title: t('reuse.userAccountApprovaeDetail'),
            hidden: true,
            canTo: true,
          }
        },
        {
          path: `collaborators-accounts-approval-utility/:type?/:id?/:approvalId?`,
          component: () =>
            import('@/views/Pages/Business/Collaborators/PaymentRequestAdd.vue'),
          name: `approve.accounts-approval.collaborators-accounts-approval-utility.${utility}`,
          meta: {
            title: t('reuse.collaboratorsAccountApprovaeDetail'),
            hidden: true,
            canTo: true,
          }
        },
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
        },
        {
          path: 'approve-flash-sale-utility/:type?/:id?/:targetId?/:approveRequestId?',
          name: `approve.approve-promotion-strategy.approve-flash-sale-utility.${utility}`,
          component: () => import('@/views/Pages/Business/PromotionStrategy/FlashSaleUtility.vue'),
          meta: {
            title: t('reuse.flashSaleDetail'),
            canTo: true,
            hidden: true
          }
        },
        {
          path: 'approve-collection-utility/:type?/:id?/:targetId?/:approveRequestId?',
          name: `approve.approve-promotion-strategy.approve-collection-utility.${utility}`,
          component: () => import('@/views/Pages/Business/PromotionStrategy/CollectionUtility.vue'),
          meta: {
            title: t('reuse.collectionDetail'),
            canTo: true,
            hidden: true
          }
        },
        {
          path: 'approve-new-product-utility/:type?/:id?/:targetId?/:approveRequestId?',
          name: `approve.approve-promotion-strategy.approve-new-product-utility.${utility}`,
          component: () => import('@/views/Pages/Business/PromotionStrategy/NewProductUtility.vue'),
          meta: {
            title: t('reuse.newProductDetail'),
            canTo: true,
            hidden: true
          }
        },
        {
          path: 'approve-voucher-utility/:type?/:id?/:targetId?/:approveRequestId?',
          name: `approve.approve-promotion-strategy.approve-voucher-utility.${utility}`,
          component: () => import('@/views/Pages/Business/PromotionStrategy/indexVoucher.vue'),
          meta: {
            title: t('router.voucher'),
            canTo: true,
            hidden: true
          }
        },
        {
          path: 'approve-combo-utility/:type?/:id?/:targetId?/:approveRequestId?',
          name: `approve.approve-promotion-strategy.approve-combo-utility.${utility}`,
          component: () => import('@/views/Pages/Business/PromotionStrategy/ComboUtility.vue'),
          meta: {
            title: t('router.comboTitle'),
            canTo: true,
            hidden: true
          }
        },
        {
          path: 'approve-auction-utility/:type?/:id?/:targetId?/:approveRequestId?',
          name: `approve.approve-promotion-strategy.approve-auction-utility.${utility}`,
          component: () => import('@/views/Pages/Business/PromotionStrategy/Auction.vue'),
          meta: {
            title: t('router.auction'),
            canTo: true,
            hidden: true
          }
        },
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
