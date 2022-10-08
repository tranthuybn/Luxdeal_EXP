import { Layout } from '@/utils/routerHelper'
import { useI18n } from '@/hooks/web/useI18n'
const utility = 'Utility'
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
          path: `${utility}/:id?/:type?`,
          component: () =>
            import('@/views/Pages/Business/PotentialCustomerCare/PotentialCustomerAdd.vue'),
          name: `business.potential-customer-care.potential-customer-list.${utility}`,
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
          path: 'customerList-add',
          component: () => import('@/views/Pages/Business/OrderManagement/index.vue'),
          name: `business.order-management.order-list.${utility}`,
          meta: {
            title: t('router.createANewOrder'),
            noTagsView: true,
            noCache: true,
            hidden: true,
            canTo: true,
            showMainRoute: true
          }
        },
        {
          path: `utility/:id?/:type?`,
          component: () => import('@/views/Pages/Business/OrderManagement/index.vue'),
          name: `business.order-management.order-list.${utility}`,
          meta: {
            title: t('router.createANewOrder'),
            noTagsView: true,
            noCache: true,
            hidden: true,
            showMainRoute: true
          }
        },
        {
          path: 'create-new-order',
          name: 'business.order-management.create-new-order',
          component: () => import('@/views/Pages/Business/OrderManagement/index.vue'),
          meta: {
            title: t('router.createANewOrder')
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
          path: 'customerList-add',
          component: () => import('@/views/Pages/Business/CustomerManagement/CustomerAdd.vue'),
          name: `business.customer-management.customerList.${utility}`,
          meta: {
            title: t('router.customerAdd'),
            noTagsView: true,
            noCache: true,
            hidden: true,
            canTo: true,
            showMainRoute: true
          }
        },
        {
          path: 'customerRatings',
          name: 'business.customer-management.customerRatings',
          component: () =>
            import('@/views/Pages/Business/CustomerManagement/TabsCustomerRatings.vue'),
          meta: {
            title: t('router.customerRatings')
          },
          children: [
            {
              path: `${utility}/:id?/:type?`,
              component: () =>
                import('@/views/Pages/Business/CustomerManagement/AddNewRanking.vue'),
              name: `business.customer-management.customerRatings.${utility}`,
              meta: {
                title: t('customerList.addNewRanking'),
                noTagsView: true,
                noCache: true,
                hidden: true,
                showMainRoute: true
              }
            }
          ]
        },
        {
          path: 'customerRatings-utility/:id?/:type?',
          component: () => import('@/views/Pages/Business/CustomerManagement/AddNewRanking.vue'),
          name: `business.customer-management.customerRatings.${utility}`,
          meta: {
            title: t('customerList.addNewRanking'),
            noTagsView: true,
            noCache: true,
            canTo: true,
            hidden: true,
            showMainRoute: true
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
          path: 'collaboratorsAdd/:id?/:type?',
          name: `business.collaborators.collaboratorsList.${utility}`,
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
          path: 'flash-sale-utility',
          name: `business.promotion-strategy.flash-sale.${utility}`,
          component: () => import('@/views/Pages/Business/PromotionStrategy/FlashSaleUtility.vue'),
          meta: {
            title: t('reuse.flashSaleDetail'),
            canTo: true,
            hidden: true
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
          path: 'collection-utility',
          component: () => import('@/views/Pages/Business/PromotionStrategy/CollectionUtility.vue'),
          name: `business.promotion-strategy.collection.${utility}`,
          meta: {
            title: t('reuse.collectionDetail'),
            canTo: true,
            hidden: true
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
          path: 'new-product-utility',
          component: () => import('@/views/Pages/Business/PromotionStrategy/NewProductUtility.vue'),
          name: `business.promotion-strategy.new-product.${utility}`,
          meta: {
            title: t('reuse.newProductDetail'),
            canTo: true,
            hidden: true
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
          path: 'voucher-utility',
          component: () => import('@/views/Pages/Business/PromotionStrategy/indexVoucher.vue'),
          name: `business.promotion-strategy.voucher.${utility}`,
          meta: {
            title: t('reuse.voucherDetail'),
            canTo: true,
            hidden: true
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
          path: 'combo-utility',
          component: () => import('@/views/Pages/Business/PromotionStrategy/ComboUtility.vue'),
          name: `business.promotion-strategy.combo.${utility}`,
          meta: {
            title: t('router.comboTitle'),
            canTo: true,
            hidden: true
          }
        },
        {
          path: 'auction',
          name: 'business.promotion-strategy.auction',
          component: () => import('@/views/Pages/Business/PromotionStrategy/Auction.vue'),
          meta: {
            title: t('router.auction')
          }
        },
        {
          path: 'auction-utility',
          component: () => import('@/views/Pages/Business/PromotionStrategy/AuctionUtility.vue'),
          name: `business.promotion-strategy.auction.${utility}`,
          meta: {
            title: t('router.auctionTitle'),
            canTo: true,
            hidden: true
          }
        }
      ]
    },
    {
      path: 'service-survey',
      component: () => import('@/views/Pages/Business/ServiceSurvey.vue'),
      name: 'business.service-survey',
      meta: {
        title: t('router.serviceSurvey')
      }
    },
    {
      path: 'accumulate-points',
      name: 'business.accumulate-points',
      redirect: { name: 'business.accumulate-points.customer' },
      meta: {
        title: t('router.accumulatePoints')
      },
      children: [
        {
          path: 'customer-points',
          name: 'business.accumulate-points.customer-points',
          component: () => import('@/views/Pages/Business/AccumulatePoints/CustomerPoints.vue'),
          meta: {
            title: t('router.customerPoints')
          }
        },
        {
          path: 'settings-points',
          name: 'business.accumulate-points.settings-points',
          component: () => import('@/views/Pages/Business/AccumulatePoints/SettingsPoints.vue'),
          meta: {
            title: t('router.installPoints')
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
          },
          children: [
            {
              path: `${utility}/:id?/:type?`,
              component: () =>
                import('@/views/Pages/Business/VirtualWallet/VirtualWalletUtility.vue'),
              name: `business.virtual-wallet.customer.${utility}`,
              meta: {
                title: t('reuse.VirtualWalletUtility'),
                noTagsView: true,
                noCache: true,
                hidden: true,
                showMainRoute: true
              }
            }
          ]
        },
        {
          path: 'customer-utility/:id?/:type?',
          component: () => import('@/views/Pages/Business/VirtualWallet/VirtualWalletUtility.vue'),
          name: `business.virtual-wallet.customer.${utility}`,
          meta: {
            title: t('reuse.VirtualWalletUtility'),
            noTagsView: true,
            noCache: true,
            hidden: true,
            canTo: true,
            showMainRoute: true
          }
        },
        {
          path: 'with-drewal-request',
          name: 'business.virtual-wallet.with-drewal-request',
          component: () => import('@/views/Pages/Business/VirtualWallet/WithdrawalRequest.vue'),
          meta: {
            title: t('router.withDrawalRequest')
          },
          children: [
            {
              path: `${utility}/:id?/:type?`,
              name: `business.virtual-wallet.with-drewal-request.${utility}`,
              component: () =>
                import('@/views/Pages/Business/VirtualWallet/WithdrawalRequestUtility.vue'),
              meta: {
                title: t('reuse.addNewVirtualWalletRequest'),
                noTagsView: true,
                noCache: true,
                hidden: true,
                showMainRoute: true
              }
            }
          ]
        },
        {
          path: 'with-drewal-request-utility/:id?/:type?',
          name: `business.virtual-wallet.with-drewal-request.${utility}`,
          component: () =>
            import('@/views/Pages/Business/VirtualWallet/WithdrawalRequestUtility.vue'),
          meta: {
            title: t('reuse.addNewVirtualWalletRequest'),
            noTagsView: true,
            noCache: true,
            canTo: true,
            hidden: true,
            showMainRoute: true
          }
        },
        {
          path: 'settings',
          name: 'business.virtual-wallet.settings',
          component: () => import('@/views/Pages/Business/VirtualWallet/SettingsVirtualWallet.vue'),
          meta: {
            title: t('router.settingsvirtualWallet')
          }
        },
        {
          path: 'settings-utility/:id?/:type?',
          component: () =>
            import('@/views/Pages/Business/VirtualWallet/SettingsVirtualWalletUtility.vue'),
          name: `business.virtual-wallet.settings.${utility}`,
          meta: {
            title: t('reuse.addNewMoneyPaymentCode'),
            noTagsView: true,
            noCache: true,
            canTo: true,
            hidden: true,
            showMainRoute: true
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
