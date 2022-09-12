import { Layout } from '@/utils/routerHelper'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
export default {
  path: '/business',
  component: Layout,
  redirect: '/business/potential-customer-care',
  name: 'business',
  meta: {
    title: t('router.business'),
    icon: 'ic:round-business-center',
    alwaysShow: true
  },
  children: [
    {
      path: 'potential-customer-care',
      redirect: { name: 'business.potential-customer-care.potential-customer-list' },
      name: 'business.potential-customer-care',
      meta: {
        title: t('router.potentialCustomerCare')
      },
      children: [
        {
          path: 'potential-customer-list',
          component: () =>
            import('@/views/Pages/Business/PotentialCustomerCare/PotentialCustomerList.vue'),
          name: 'business.potential-customer-care.potential-customer-list',
          meta: {
            title: t('router.potentialCustomerList')
          }
        },
        {
          path: 'potential-customer-add',
          component: () =>
            import('@/views/Pages/Business/PotentialCustomerCare/PotentialCustomerAdd.vue'),
          name: 'business.potential-customer-care.potential-customer-add',
          meta: {
            title: t('router.potentialCustomerAdd')
          }
        },
        {
          path: 'manage-chat',
          component: () => import('@/views/Pages/Business/PotentialCustomerCare/ManageChat.vue'),
          name: 'business.potential-customer-care.manage-chat',
          meta: {
            title: t('router.manageChat')
          }
        }
      ]
    },
    {
      path: 'order-management',
      name: 'business.order-management',
      redirect: { name: 'business.order-management.order-list' },
      meta: {
        title: t('router.orderManagement')
      },
      children: [
        {
          path: 'order-list',
          name: 'business.order-management.order-list',
          component: () => import('@/views/Pages/Business/OrderManagement/OrderList.vue'),
          meta: {
            title: t('router.orderList')
          }
        },
        {
          path: 'order-management',
          component: 'views/Pages/Business/OrderManagement/OrderListUtility',
          name: `business.order-management.order-list-add`,
          meta: {
            title: 'reuse.createANewOrder',
            noTagsView: true,
            noCache: true,
            hidden: true,
            showMainRoute: true
          }
        },
        {
          path: 'create-new-order',
          name: 'business.order-management.create-new-order',
          component: 'views/Pages/Business/OrderManagement/OrderListUtility',
          meta: {
            title: 'router.createANewOrder'
          }
        }
      ]
    },
    {
      path: 'customer-management',
      name: 'business.customer-management',
      redirect: { name: 'business.customer-management.customerList' },
      meta: {
        title: t('router.customerManagement')
      },
      children: [
        {
          path: 'customerList',
          name: 'business.customer-management.customerList',
          component: () => import('@/views/Pages/Business/CustomerManagement/CustomerList.vue'),
          meta: {
            title: t('router.customerList')
          }
        },
        {
          path: 'customerRatings',
          name: 'business.customer-management.customerRatings',
          component: () => import('@/views/Pages/Business/CustomerManagement/CustomerRatings.vue'),
          meta: {
            title: t('router.customerRatings')
          }
        },
        {
          path: 'customerAdd',
          name: 'business.customer-management.customerAdd',
          component: () => import('@/views/Pages/Business/CustomerManagement/CustomerAdd.vue'),
          meta: {
            title: t('router.customerAdd')
          }
        }
      ]
    },
    {
      path: 'collaborators',
      name: 'business.collaborators',
      redirect: { name: 'business.collaborators.collaboratorsList' },
      meta: {
        title: t('router.collaborators')
      },
      children: [
        {
          path: 'collaboratorsList',
          name: 'business.collaborators.collaboratorsList',
          component: () => import('@/views/Pages/Business/Collaborators/Collaborators.vue'),
          meta: {
            title: t('router.collaboratorsList')
          }
        },
        {
          path: 'paymentRequest',
          name: 'business.collaborators.paymentRequest',
          component: () => import('@/views/Pages/Business/Collaborators/PaymentRequest.vue'),
          meta: {
            title: t('router.paymentRequest')
          }
        },
        {
          path: 'collaboratorsAdd',
          name: 'business.collaborators.collaboratorsAdd',
          component: () => import('@/views/Pages/Business/Collaborators/CollaboratorsAdd.vue'),
          meta: {
            title: t('router.collaboratorsAdd')
          }
        }
      ]
    },
    {
      path: 'promotion-strategy',
      name: 'business.promotion-strategy',
      redirect: { name: 'business.promotion-strategy.flash-sale' },
      meta: {
        title: t('router.promotionCampaign')
      },
      children: [
        {
          path: 'flash-sale',
          name: 'business.promotion-strategy.flash-sale',
          component: () => import('@/views/Pages/Business/PromotionStrategy/FlashSale.vue'),
          meta: {
            title: t('router.flashsale')
          }
        },
        {
          path: 'collection',
          name: 'business.promotion-strategy.collection',
          component: () => import('@/views/Pages/Business/PromotionStrategy/Collection.vue'),
          meta: {
            title: t('router.collection')
          }
        },
        {
          path: 'new-product',
          name: 'business.promotion-strategy.new-product',
          component: () => import('@/views/Pages/Business/PromotionStrategy/NewProduct.vue'),
          meta: {
            title: t('router.newproduct')
          }
        },
        {
          path: 'voucher',
          name: 'business.promotion-strategy.voucher',
          component: () => import('@/views/Pages/Business/PromotionStrategy/Voucher.vue'),
          meta: {
            title: t('router.voucher')
          }
        },
        {
          path: 'combo',
          name: 'business.promotion-strategy.combo',
          component: () => import('@/views/Pages/Business/PromotionStrategy/Combo.vue'),
          meta: {
            title: t('router.combo')
          }
        },
        {
          path: 'auction',
          name: 'business.promotion-strategy.auction',
          component: () => import('@/views/Pages/Business/PromotionStrategy/Auction.vue'),
          meta: {
            title: t('router.auction')
          }
        }
      ]
    },
    {
      path: 'service-survey',
      name: 'business.service-survey',
      redirect: { name: 'business.accumulate-points.customer-points' },
      meta: {
        title: t('router.serviceSurvey')
      },
      children: [
        {
          path: 'customer-points',
          name: 'business.accumulate-points.customer-points',
          component: () => import('@/views/Pages/Business/AccumulatePoints/CustomerPoints.vue'),
          meta: {
            title: 'router.customerPoints'
          }
        },
        {
          path: 'settings-points',
          name: 'business.accumulate-points.settings-points',
          component: () => import('@/views/Pages/Business/AccumulatePoints/SettingsPoints.vue'),
          meta: {
            title: 'router.installPoints'
          }
        }
      ]
    },
    {
      path: 'virtual-wallet',
      name: 'business.virtual-wallet',
      redirect: { name: 'business.virtual-wallet.customer' },
      meta: {
        title: t('router.virtualWallet')
      },
      children: [
        {
          path: 'customer',
          name: 'business.virtual-wallet.customer',
          component: () => import('@/views/Pages/Business/VirtualWallet/CustomerVirtualWallet.vue'),
          meta: {
            title: t('router.customervirtualWallet')
          }
        },
        {
          path: 'with-drewal-request',
          name: 'business.virtual-wallet.with-drewal-request',
          component: () => import('@/views/Pages/Business/VirtualWallet/WithdrawalRequest.vue'),
          meta: {
            title: t('router.withDrawalRequest')
          }
        },
        {
          path: 'settings',
          name: 'business.virtual-wallet.settings',
          component: () => import('@/views/Pages/Business/VirtualWallet/SettingsVirtualWallet.vue'),
          meta: {
            title: t('router.settingsvirtualWallet')
          }
        }
      ]
    },
    {
      path: 'business-product',
      name: 'business.business-product',
      redirect: { name: 'business.business-product.employeeList' },
      meta: {
        title: t('router.businessProducts')
      },
      children: [
        {
          path: 'product-list',
          name: 'business.business-product.product-list',
          component: () => import('@/views/Pages/Business/BusinessProducts/ProductList.vue'),
          meta: {
            title: t('router.productlist')
          }
        },
        {
          path: 'product-add',
          name: 'business.business-product.product-add',
          component: () => import('@/views/Pages/Business/BusinessProducts/ProductAdd.vue'),
          meta: {
            title: t('router.productadd')
          }
        }
      ]
    },
    {
      path: 'employee-management',
      name: 'business.employee-management',
      redirect: { name: 'business.employee-management.employeeList' },
      meta: {
        title: t('router.businessMan')
      },
      children: [
        {
          path: 'employeeList',
          name: 'business.employee-management.employeeList',
          component: () => import('@/views/Pages/Business/EmployeeManagement/EmployeeList.vue'),
          meta: {
            title: t('router.employeeList')
          }
        },
        {
          path: 'employeeRatings',
          name: 'business.employee-management.employeeRatings',
          component: () => import('@/views/Pages/Business/EmployeeManagement/EmployeeRatings.vue'),
          meta: {
            title: t('router.employeeRatings')
          }
        }
      ]
    },
    {
      path: 'business-report',
      name: 'business.business-report',
      redirect: { name: 'business.business-report.growth' },
      meta: {
        title: t('router.businessReport')
      },
      children: [
        {
          path: 'growth',
          name: 'business.business-report.growth',
          component: () => import('@/views/Pages/Business/BusinessReport/Growth.vue'),
          meta: {
            title: t('router.growth')
          }
        },
        {
          path: 'sales',
          name: 'business.business-report.sales',
          component: () => import('@/views/Pages/Business/BusinessReport/Sales.vue'),
          meta: {
            title: t('router.sales')
          }
        },
        {
          path: 'debt',
          name: 'business.business-report.debt',
          component: () => import('@/views/Pages/Business/BusinessReport/Debt.vue'),
          meta: {
            title: t('router.debt')
          }
        },
        {
          path: 'turnover',
          name: 'business.business-report.turnover',
          component: () => import('@/views/Pages/Business/BusinessReport/Turnover.vue'),
          meta: {
            title: t('router.turnover')
          }
        }
      ]
    }
  ]
}
