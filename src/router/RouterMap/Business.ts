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
      component: () => import('@/views/Pages/Business/PotentialCustomerCare.vue'),
      name: 'business.potential-customer-care',
      meta: {
        title: t('router.potentialCustomerCare')
      }
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
          path: 'create-new-order',
          name: 'business.order-management.create-new-order',
          component: () => import('@/views/Pages/Business/OrderManagement/CreateANewOrder.vue'),
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
      path: 'promotion-strategy',
      name: 'business.promotion-strategy',
      redirect: { name: 'business.promotion-strategy.flash-sale' },
      meta: {
        title: t('router.promotionStrategy')
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
      component: () => import('@/views/Pages/Business/ServiceSurvey.vue'),
      name: 'business.service-survey',
      meta: {
        title: t('router.serviceSurvey')
      }
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
      path: 'employee-management',
      name: 'business.employee-management',
      redirect: { name: 'business.employee-management.employeeList' },
      meta: {
        title: t('router.employeeManagement')
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
      component: () => import('@/views/Pages/Business/BusinessReport.vue'),
      name: 'business.business-report',
      meta: {
        title: t('router.businessReport')
      }
    }
  ]
}
