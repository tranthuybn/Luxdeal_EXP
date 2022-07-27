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
  },
  {
    path: '/components',
    component: '#',
    redirect: '/components/icon',
    name: 'ComponentsDemo',
    meta: {
      title: 'router.component',
      icon: 'bx:bxs-component',
      alwaysShow: true
    },
    children: [
      {
        path: 'form',
        component: '##',
        name: 'Form',
        meta: {
          title: 'router.form',
          alwaysShow: true
        },
        children: [
          {
            path: 'default-form',
            component: 'views/Components/Form/DefaultForm',
            name: 'DefaultForm',
            meta: {
              title: 'router.defaultForm'
            }
          },
          {
            path: 'use-form',
            component: 'views/Components/Form/UseFormDemo',
            name: 'UseForm',
            meta: {
              title: 'UseForm'
            }
          },
          {
            path: 'ref-form',
            component: 'views/Components/Form/RefForm',
            name: 'RefForm',
            meta: {
              title: 'RefForm'
            }
          }
        ]
      },
      {
        path: 'table',
        component: '##',
        name: 'TableDemo',
        meta: {
          title: 'router.table',
          alwaysShow: true
        },
        children: [
          {
            path: 'default-table',
            component: 'views/Components/Table/DefaultTable',
            name: 'DefaultTable',
            meta: {
              title: 'router.defaultTable'
            }
          },
          {
            path: 'use-table',
            component: 'views/Components/Table/UseTableDemo',
            name: 'UseTable',
            meta: {
              title: 'UseTable'
            }
          },
          {
            path: 'ref-table',
            component: 'views/Components/Table/RefTable',
            name: 'RefTable',
            meta: {
              title: 'RefTable'
            }
          }
        ]
      },
      {
        path: 'editor-demo',
        component: '##',
        name: 'EditorDemo',
        meta: {
          title: 'router.editor',
          alwaysShow: true
        },
        children: [
          {
            path: 'editor',
            component: 'views/Components/Editor/Editor',
            name: 'Editor',
            meta: {
              title: 'router.richText'
            }
          }
        ]
      },
      {
        path: 'search',
        component: 'views/Components/Search',
        name: 'Search',
        meta: {
          title: 'router.search'
        }
      },
      {
        path: 'descriptions',
        component: 'views/Components/Descriptions',
        name: 'Descriptions',
        meta: {
          title: 'router.descriptions'
        }
      },
      {
        path: 'image-viewer',
        component: 'views/Components/ImageViewer',
        name: 'ImageViewer',
        meta: {
          title: 'router.imageViewer'
        }
      },
      {
        path: 'dialog',
        component: 'views/Components/Dialog',
        name: 'Dialog',
        meta: {
          title: 'router.dialog'
        }
      },
      {
        path: 'icon',
        component: 'views/Components/Icon',
        name: 'Icon',
        meta: {
          title: 'router.icon'
        }
      },
      {
        path: 'echart',
        component: 'views/Components/Echart',
        name: 'Echart',
        meta: {
          title: 'router.echart'
        }
      },
      {
        path: 'count-to',
        component: 'views/Components/CountTo',
        name: 'CountTo',
        meta: {
          title: 'router.countTo'
        }
      },
      {
        path: 'qrcode',
        component: 'views/Components/Qrcode',
        name: 'Qrcode',
        meta: {
          title: 'router.qrcode'
        }
      },
      {
        path: 'highlight',
        component: 'views/Components/Highlight',
        name: 'Highlight',
        meta: {
          title: 'router.highlight'
        }
      },
      {
        path: 'infotip',
        component: 'views/Components/Infotip',
        name: 'Infotip',
        meta: {
          title: 'router.infotip'
        }
      },
      {
        path: 'input-password',
        component: 'views/Components/InputPassword',
        name: 'InputPassword',
        meta: {
          title: 'router.inputPassword'
        }
      },
      {
        path: 'sticky',
        component: 'views/Components/Sticky',
        name: 'Sticky',
        meta: {
          title: 'router.sticky'
        }
      }
    ]
  },
  {
    path: '/guide',
    component: '#',
    name: 'Guide',
    meta: {},
    children: [
      {
        path: 'index',
        component: 'views/Guide/Guide',
        name: 'GuideDemo',
        meta: {
          title: 'router.guide',
          icon: 'dashicons:book'
        }
      }
    ]
  },
  {
    path: '/hooks',
    component: '#',
    redirect: '/hooks/useWatermark',
    name: 'Hooks',
    meta: {
      title: 'hooks',
      icon: 'ic:outline-webhook',
      alwaysShow: true
    },
    children: [
      {
        path: 'useWatermark',
        component: 'views/hooks/useWatermark',
        name: 'UseWatermark',
        meta: {
          title: 'useWatermark'
        }
      },
      {
        path: 'useCrudSchemas',
        component: 'views/hooks/useCrudSchemas',
        name: 'UseCrudSchemas',
        meta: {
          title: 'useCrudSchemas'
        }
      }
    ]
  },
  {
    path: '/level',
    component: '#',
    redirect: '/level/menu1/menu1-1/menu1-1-1',
    name: 'Level',
    meta: {
      title: 'router.level',
      icon: 'carbon:skill-level-advanced'
    },
    children: [
      {
        path: 'menu1',
        name: 'Menu1',
        component: '##',
        redirect: '/level/menu1/menu1-1/menu1-1-1',
        meta: {
          title: 'router.menu1'
        },
        children: [
          {
            path: 'menu1-1',
            name: 'Menu11',
            component: '##',
            redirect: '/level/menu1/menu1-1/menu1-1-1',
            meta: {
              title: 'router.menu11',
              alwaysShow: true
            },
            children: [
              {
                path: 'menu1-1-1',
                name: 'Menu111',
                component: 'views/Level/Menu111',
                meta: {
                  title: 'router.menu111'
                }
              }
            ]
          },
          {
            path: 'menu1-2',
            name: 'Menu12',
            component: 'views/Level/Menu12',
            meta: {
              title: 'router.menu12'
            }
          }
        ]
      },
      {
        path: 'menu2',
        name: 'Menu2Demo',
        component: 'views/Level/Menu2',
        meta: {
          title: 'router.menu2'
        }
      }
    ]
  },
  {
    path: '/example',
    component: '#',
    redirect: '/example/example-dialog',
    name: 'Example',
    meta: {
      title: 'router.example',
      icon: 'ep:management',
      alwaysShow: true
    },
    children: [
      {
        path: 'example-dialog',
        component: 'views/Example/Dialog/ExampleDialog',
        name: 'ExampleDialog',
        meta: {
          title: 'router.exampleDialog'
        }
      },
      {
        path: 'example-page',
        component: 'views/Example/Page/ExamplePage',
        name: 'ExamplePage',
        meta: {
          title: 'router.examplePage'
        }
      },
      {
        path: 'example-add',
        component: 'views/Example/Page/ExampleAdd',
        name: 'ExampleAdd',
        meta: {
          title: 'router.exampleAdd',
          noTagsView: true,
          noCache: true,
          hidden: true,
          showMainRoute: true,
          activeMenu: '/example/example-page'
        }
      },
      {
        path: 'example-edit',
        component: 'views/Example/Page/ExampleEdit',
        name: 'ExampleEdit',
        meta: {
          title: 'router.exampleEdit',
          noTagsView: true,
          noCache: true,
          hidden: true,
          showMainRoute: true,
          activeMenu: '/example/example-page'
        }
      },
      {
        path: 'example-detail',
        component: 'views/Example/Page/ExampleDetail',
        name: 'ExampleDetail',
        meta: {
          title: 'router.exampleDetail',
          noTagsView: true,
          noCache: true,
          hidden: true,
          showMainRoute: true,
          activeMenu: '/example/example-page'
        }
      }
    ]
  }
  // {
  //   path: '/error',
  //   component: '#',
  //   redirect: '/error/404',
  //   name: 'Error',
  //   meta: {
  //     title: 'router.errorPage',
  //     icon: 'ci:error',
  //     alwaysShow: true
  //   },
  //   children: [
  //     {
  //       path: '404-demo',
  //       component: 'views/Error/404',
  //       name: '404Demo',
  //       meta: {
  //         title: '404'
  //       }
  //     },
  //     {
  //       path: '403-demo',
  //       component: 'views/Error/403',
  //       name: '403Demo',
  //       meta: {
  //         title: '403'
  //       }
  //     },
  //     {
  //       path: '500-demo',
  //       component: 'views/Error/500',
  //       name: '500Demo',
  //       meta: {
  //         title: '500'
  //       }
  //     }
  //   ]
  // }
]

const testList: string[] = [
  '/dashboard',
  '/dashboard/analysis',
  '/dashboard/workplace',
  '/guide',
  '/guide/index',
  '/components',
  '/components/form',
  '/components/form/default-form',
  '/components/form/use-form',
  '/components/form/ref-form',
  '/components/table',
  '/components/table/default-table',
  '/components/table/use-table',
  '/components/table/ref-table',
  '/components/editor-demo',
  '/components/editor-demo/editor',
  '/components/search',
  '/components/descriptions',
  '/components/image-viewer',
  '/components/dialog',
  '/components/icon',
  '/components/echart',
  '/components/count-to',
  '/components/qrcode',
  '/components/highlight',
  '/components/infotip',
  '/Components/InputPassword',
  '/Components/Sticky',
  '/hooks',
  '/hooks/useWatermark',
  '/hooks/useCrudSchemas',
  '/level',
  '/level/menu1',
  '/level/menu1/menu1-1',
  '/level/menu1/menu1-1/menu1-1-1',
  '/level/menu1/menu1-2',
  '/level/menu2',
  '/example',
  '/example/example-dialog',
  '/example/example-page',
  '/example/example-add',
  '/example/example-edit',
  '/example/example-detail',
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
