import { config } from '@/config/axios/config'
import { MockMethod } from 'vite-plugin-mock'

const { result_code } = config

const timeout = 1000

const adminList = [
  {
    path: '/dashboard',
    component: '#',
    redirect: '/dashboard/analysis',
    name: 'Dashboard',
    meta: {
      title: 'router.dashboard',
      icon: 'eos-icons:virtual-host-manager',
      alwaysShow: true
    },
    children: [
      {
        path: 'analysis',
        component: 'views/Dashboard/Analysis',
        name: 'Analysis',
        meta: {
          title: 'router.analysis',
          noCache: true
        }
      },
      {
        path: 'workplace',
        component: 'views/Dashboard/Workplace',
        name: 'Workplace',
        meta: {
          title: 'router.workplace',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/business',
    component: '#',
    redirect: '/business/potential-customer-care',
    name: 'Business',
    meta: {
      title: 'router.business',
      icon: 'ic:round-business-center',
      alwaysShow: true
    },
    children: [
      {
        path: 'potential-customer-care',
        component: 'views/Pages/Business/PotentialCustomerCare',
        name: 'Business.PotentialCustomerCare',
        meta: {
          title: 'router.potentialCustomerCare'
        }
      },
      {
        path: 'order-management',
        name: 'business.order-management',
        redirect: { name: 'business.order-management.order-list' },
        meta: {
          title: 'router.orderManagement'
        },
        children: [
          {
            path: 'order-list',
            name: 'business.order-management.order-list',
            component: 'views/Pages/Business/OrderManagement/OrderList',
            meta: {
              title: 'router.orderList'
            }
          },
          {
            path: 'create-new-order',
            name: 'business.order-management.create-new-order',
            component: 'views/Pages/Business/OrderManagement/CreateANewOrder',
            meta: {
              title: 'router.createANewOrder'
            }
          }
        ]
      },
      {
        path: 'customer-management',
        component: 'views/Pages/Business/CustomerManagement',
        name: 'business.customer-management',
        meta: {
          title: 'router.customerManagement'
        }
      },
      {
        path: 'promotion-strategy',
        component: 'views/Pages/Business/PromotionStrategy',
        name: 'business.promotion-strategy',
        meta: {
          title: 'router.promotionStrategy'
        }
      },
      {
        path: 'service-survey',
        component: 'views/Pages/Business/ServiceSurvey',
        name: 'business.service-survey',
        meta: {
          title: 'router.serviceSurvey'
        }
      },
      {
        path: 'collaborators',
        component: 'views/Pages/Business/Collaborators',
        name: 'business.collaborators',
        meta: {
          title: 'router.collaborators'
        }
      },
      {
        path: 'employee-management',
        component: 'views/Pages/Business/EmployeeManagement',
        name: 'business.employee-management',
        meta: {
          title: 'router.employeeManagement'
        }
      },
      {
        path: 'business-report',
        component: 'views/Pages/Business/BusinessReport',
        name: 'business.business-report',
        meta: {
          title: 'router.businessReport'
        }
      }
    ]
  },
  {
    path: '/warehouse',
    component: '#',
    redirect: '/warehouse/list-warehouse',
    name: 'Warehouse',
    meta: {
      title: 'router.warehouseManagement',
      icon: 'maki:warehouse',
      alwaysShow: true
    },
    children: [
      {
        path: 'list-warehouse',
        component: 'views/Pages/Warehouse/index',
        name: 'Warehouse.ListWarehouse',
        meta: {
          title: 'router.warehouseList'
        }
      }
    ]
  },
  {
    path: '/accountant',
    component: '#',
    redirect: '/accountant/payment-proposal',
    name: 'accountant',
    meta: {
      title: 'router.accountant',
      icon: 'carbon:calculation-alt',
      alwaysShow: true
    },
    children: [
      {
        path: 'payment-proposal',
        component: 'views/Pages/Accountant/PaymentProposal',
        name: 'accountant.payment-proposal',
        meta: {
          title: 'router.paymentProposal'
        }
      },
      {
        path: 'receipts-and-expenditures',
        component: 'views/Pages/Accountant/ReceiptsAndExpenditures',
        name: 'accountant.receiptsAndExpenditures',
        meta: {
          title: 'router.receiptsAndExpenditures'
        }
      },
      {
        path: 'balanceSheet',
        component: 'views/Pages/Accountant/BalanceSheet',
        name: 'accountant.balanceSheet',
        meta: {
          title: 'router.balanceSheet'
        }
      }
    ]
  },
  {
    path: '/approve',
    component: '#',
    redirect: '/approve/products-approval',
    name: 'approve',
    meta: {
      title: 'router.approve',
      icon: 'akar-icons:chat-approve',
      alwaysShow: true
    },
    children: [
      {
        path: 'products-approval',
        component: 'views/Pages/Approval/Products/index',
        name: 'approve.products-approval',
        meta: {
          title: 'router.products'
        }
      },
      {
        path: 'orders-approval',
        component: 'views/Pages/Approval/Orders/index',
        name: 'approve.orders-approval',
        meta: {
          title: 'router.orders'
        }
      },
      {
        path: 'payment-approval',
        component: 'views/Pages/Approval/Payments/index',
        name: 'approve.payment-approval',
        meta: {
          title: 'router.payments'
        }
      },
      {
        path: 'accounts-approval',
        component: 'views/Pages/Approval/Accounts/index',
        name: 'approve.accounts-approval',
        meta: {
          title: 'router.accounts'
        }
      }
    ]
  },
  {
    path: '/new-and-advertisement',
    component: '#',
    redirect: { name: 'new-and-advertisement.new-and-advertisement-list' },
    name: 'New-and-advertisement',
    meta: {
      title: 'router.newsAndAdvertisement',
      icon: 'arcticons:social',
      alwaysShow: true
    },
    children: [
      {
        path: 'new-and-advertisement-list',
        component: 'views/Pages/NewsAndAdvertisement/index',
        name: 'New-and-advertisement.new-and-advertisement-list',
        meta: {
          title: 'router.newsAndAdvertisement'
        }
      }
    ]
  },
  {
    path: '/library-and-setting',
    component: '#',
    redirect: { name: 'library-and-setting.dashboard' },
    name: 'library-and-setting',
    meta: {
      title: 'router.libraryAndSetting',
      icon: 'carbon:cloud-satellite-config',
      alwaysShow: true
    },
    children: [
      {
        path: 'dashboard',
        component: 'views/Pages/LibraryAndSetting/index',
        name: 'library-and-setting.dashboard',
        meta: {
          title: 'router.libraryAndSetting'
        }
      }
    ]
  }
]

const testList: string[] = [
  '/dashboard',
  '/dashboard/analysis',
  '/dashboard/workplace',
  '/error',
  '/error/404-demo',
  '/error/403-demo',
  '/error/500-demo'
]

export default [
  // List interface
  {
    url: '/role/list',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { roleName } = query
      return {
        code: result_code,
        data: roleName === 'admin' ? adminList : testList
      }
    }
  }
] as MockMethod[]
