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
      component: () => import('@/views/Pages/Business/CustomerManagement.vue'),
      name: 'business.customer-management',
      meta: {
        title: t('router.customerManagement')
      }
    },
    {
      path: 'promotion-strategy',
      component: () => import('@/views/Pages/Business/PromotionStrategy.vue'),
      name: 'business.promotion-strategy',
      meta: {
        title: t('router.promotionStrategy')
      }
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
      component: () => import('@/views/Pages/Business/Collaborators.vue'),
      name: 'business.collaborators',
      meta: {
        title: t('router.collaborators')
      }
    },
    {
      path: 'employee-management',
      component: () => import('@/views/Pages/Business/EmployeeManagement.vue'),
      name: 'business.employee-management',
      meta: {
        title: t('router.employeeManagement')
      }
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
