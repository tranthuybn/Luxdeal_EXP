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
        name: 'business.customer-management',
        redirect: { name: 'business.customer-management.customerList' },
        meta: {
          title: 'router.customerManagement'
        },
        children: [
          {
            path: 'customerList',
            name: 'business.customer-management.customerList',
            component: 'views/Pages/Business/CustomerManagement/CustomerList',
            meta: {
              title: 'router.customerList'
            }
          },
          {
            path: 'customerRatings',
            name: 'business.customer-management.customerRatings',
            component: 'views/Pages/Business/CustomerManagement/CustomerRatings',
            meta: {
              title: 'router.customerRatings'
            }
          },
          {
            path: 'customerAdd',
            name: 'business.customer-management.customerAdd',
            component: 'views/Pages/Business/CustomerManagement/CustomerAdd',
            meta: {
              title: 'router.customerAdd'
            }
          }
        ]
      },
      {
        path: 'promotion-strategy',
        name: 'business.promotion-strategy',
        redirect: { name: 'business.promotion-strategy.flash-sale' },
        meta: {
          title: 'router.promotionStrategy'
        },
        children: [
          {
            path: 'flash-sale',
            name: 'business.promotion-strategy.flash-sale',
            component: 'views/Pages/Business/PromotionStrategy/FlashSale',
            meta: {
              title: 'router.flashsale'
            }
          },
          {
            path: 'collection',
            name: 'business.promotion-strategy.collection',
            component: 'views/Pages/Business/PromotionStrategy/Collection',
            meta: {
              title: 'router.collection'
            }
          },
          {
            path: 'new-product',
            name: 'business.promotion-strategy.new-product',
            component: 'views/Pages/Business/PromotionStrategy/NewProduct',
            meta: {
              title: 'router.newproduct'
            }
          },
          {
            path: 'voucher',
            name: 'business.promotion-strategy.voucher',
            component: 'views/Pages/Business/PromotionStrategy/Voucher',
            meta: {
              title: 'router.voucher'
            }
          },
          {
            path: 'combo',
            name: 'business.promotion-strategy.combo',
            component: 'views/Pages/Business/PromotionStrategy/Combo',
            meta: {
              title: 'router.combo'
            }
          },
          {
            path: 'auction',
            name: 'business.promotion-strategy.auction',
            component: 'views/Pages/Business/PromotionStrategy/Auction',
            meta: {
              title: 'router.auction'
            }
          }
        ]
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
        name: 'business.collaborators',
        redirect: { name: 'business.collaborators.collaboratorsList' },
        meta: {
          title: 'router.collaborators'
        },
        children: [
          {
            path: 'collaboratorsList',
            name: 'business.collaborators.collaboratorsList',
            component: 'views/Pages/Business/Collaborators/Collaborators',
            meta: {
              title: 'router.collaboratorsList'
            }
          },
          {
            path: 'paymentRequest',
            name: 'business.collaborators.paymentRequest',
            component: 'views/Pages/Business/Collaborators/PaymentRequest',
            meta: {
              title: 'router.paymentRequest'
            }
          },
          {
            path: 'collaboratorsAdd',
            name: 'business.collaborators.collaboratorsAdd',
            component: 'views/Pages/Business/Collaborators/CollaboratorsAdd.vue',
            meta: {
              title: 'router.collaboratorsAdd'
            }
          }
        ]
      },
      {
        path: 'employee-management',
        name: 'business.employee-management',
        redirect: { name: 'business.employee-management.employeeList' },
        meta: {
          title: 'router.employeeManagement'
        },
        children: [
          {
            path: 'employeeList',
            name: 'business.employee-management.employeeList',
            component: 'views/Pages/Business/EmployeeManagement/EmployeeList',
            meta: {
              title: 'router.employeeList'
            }
          },
          {
            path: 'employeeRatings',
            name: 'business.employee-management.employeeRatings',
            component: 'views/Pages/Business/EmployeeManagement/EmployeeRatings',
            meta: {
              title: 'router.employeeRatings'
            }
          }
        ]
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
