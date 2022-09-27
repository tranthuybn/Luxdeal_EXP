import { config } from '@/config/axios/config'
import { serviceResponse } from '../_reponseStructure'
import { MockMethod } from 'vite-plugin-mock'

const utility = 'Utility'
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
    path: '/products-services',
    component: '#',
    redirect: { name: 'products-services.ProductLibrary' },
    name: 'products-services',
    meta: {
      title: 'router.productsAndServices',
      icon: 'gridicons:product-virtual',
      alwaysShow: true
    },
    children: [
      {
        path: 'product-library',
        name: 'products-services.ProductLibrary',
        redirect: { name: 'products-services.productLibrary.Products' },
        meta: {
          title: 'router.productManagement',
          alwaysShow: true
        },
        children: [
          {
            path: 'products',
            component: 'views/Pages/ProductsAndServices/ProductLibrary/Products',
            name: 'products-services.productLibrary.Products',
            meta: {
              title: 'router.productLibraryProducts'
            },
            children: [
              {
                path: `${utility}/:id?/:type?`,
                component: 'views/Pages/ProductsAndServices/ProductLibrary/ProductUtility',
                name: `products-services.productLibrary.Products.${utility}`,
                meta: {
                  title: 'reuse.addNewProductCategory',
                  noTagsView: true,
                  noCache: true,
                  hidden: true
                }
              }
            ]
          }
        ]
      },
      {
        path: 'service-library',
        name: 'products-services.ServiceLibrary',
        meta: {
          title: 'router.serviceManagement',
          alwaysShow: true
        },
        children: [
          {
            path: 'spa-service',
            component: 'views/Pages/ProductsAndServices/ServiceLibrary/SpaService',
            name: 'products-services.ServiceLibrarySpaService',
            meta: {
              title: 'router.ServiceLibrarySpaService'
            }
          },
          {
            path: `${utility}/:id?/:type?`,
            component: 'views/Pages/ProductsAndServices/ServiceLibrary/SpaServiceUtility',
            name: `products-services.ServiceLibrarySpaService.${utility}`,
            meta: {
              title: 'reuse.addNewSpaService',
              noTagsView: true,
              noCache: true,
              hidden: true,
              showMainRoute: true
            }
          }
        ]
      },
      {
        path: 'product-property',
        name: 'products-services.product-property',
        meta: {
          title: 'router.productPropertyNew'
        },
        children: [
          {
            path: 'product-category',
            component: 'views/Pages/ProductsAndServices/Category/Product',
            name: 'products-services.ProductCategory',
            meta: {
              title: 'router.productCategoryProducts'
            },
            children: [
              {
                path: `${utility}/:id?/:type?`,
                component: 'views/Pages/ProductsAndServices/Category/ProductCategoryUtility',
                name: `products-services.ProductCategory.${utility}`,
                meta: {
                  title: 'reuse.addNewProductCategory',
                  noTagsView: true,
                  noCache: true,
                  hidden: true,
                  showMainRoute: true
                }
              }
            ]
          },
          {
            path: 'attribute-category',
            component: 'views/Pages/ProductsAndServices/Category/Attribute',
            name: 'products-services.AttributeCategory',
            meta: {
              title: 'router.productCategoryAttribute'
            },
            children: [
              {
                path: `${utility}/:id?/:type?/:tab?`,
                component: 'views/Pages/ProductsAndServices/Category/AttributeCategoryUtility',
                name: `products-services.AttributeCategory.${utility}`,
                meta: {
                  title: 'reuse.addNewAttribute',
                  noTagsView: true,
                  noCache: true,
                  hidden: true,
                  showMainRoute: true
                }
              }
            ]
          },
          {
            path: 'unit-category',
            component: 'views/Pages/ProductsAndServices/Category/Unit',
            name: 'products-services.UnitCategory',
            meta: {
              title: 'router.productCategoryUnit'
            },
            children: [
              {
                path: `${utility}/:id?/:type?`,
                component: 'views/Pages/ProductsAndServices/Category/UnitCategoryUtility',
                name: `products-services.UnitCategory.${utility}`,
                meta: {
                  title: 'reuse.addNewUnit',
                  noTagsView: true,
                  noCache: true,
                  hidden: true,
                  showMainRoute: true
                }
              }
            ]
          },
          {
            path: 'brand-category',
            component: 'views/Pages/ProductsAndServices/Category/Brand',
            name: 'products-services.BrandCategory',
            meta: {
              title: 'router.productCategoryBrand'
            },
            children: [
              {
                path: `${utility}/:id?/:type?`,
                component: 'views/Pages/ProductsAndServices/Category/BrandCategoryUtility',
                name: `products-services.BrandCategory.${utility}`,
                meta: {
                  title: 'reuse.addNewBrand',
                  noTagsView: true,
                  noCache: true,
                  hidden: true,
                  showMainRoute: true
                }
              }
            ]
          },
          {
            path: 'origin-category',
            component: 'views/Pages/ProductsAndServices/Category/Origin',
            name: 'products-services.OriginCategory',
            meta: {
              title: 'router.productCategoryOrigin'
            },
            children: [
              {
                path: `${utility}/:id?/:type?`,
                component: 'views/Pages/ProductsAndServices/Category/OriginCategoryUtility',
                name: `products-services.OriginCategory.${utility}`,
                meta: {
                  title: 'reuse.addNewOrigin',
                  noTagsView: true,
                  noCache: true,
                  hidden: true,
                  showMainRoute: true
                }
              }
            ]
          }
        ]
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
        redirect: { name: 'business.potential-customer-care.potential-customer-list' },
        name: 'Business.PotentialCustomerCare',
        meta: {
          title: 'router.potentialCustomerCare'
        },
        children: [
          {
            path: 'potential-customer-list',
            component: 'views/Pages/Business/PotentialCustomerCare/PotentialCustomerList',
            name: 'business.potential-customer-care.potential-customer-list',
            meta: {
              title: 'router.potentialCustomerList'
            }
          },
          {
            path: `${utility}/:id?/:type?`,
            component: 'views/Pages/Business/PotentialCustomerCare/PotentialCustomerAdd',
            name: `business.potential-customer-care.potential-customer-list.${utility}`,
            meta: {
              title: 'router.potentialCustomerAdd'
            }
          },
          {
            path: 'manage-chat',
            component: 'views/Pages/Business/PotentialCustomerCare/ManageChat',
            name: 'business.potential-customer-care.manage-chat',
            meta: {
              title: 'router.manageChat'
            }
          }
        ]
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
            path: `${utility}`,
            component: 'views/Pages/Business/OrderManagement/index',
            name: `business.order-management.order-list.${utility}`,
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
            component: 'views/Pages/Business/OrderManagement/index',
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
            component: 'views/Pages/Business/Collaborators/CollaboratorsAdd',
            meta: {
              title: 'router.collaboratorsAdd'
            }
          }
        ]
      },
      {
        path: 'promotion-strategy',
        name: 'business.promotion-strategy',
        redirect: { name: 'business.promotion-strategy.flash-sale' },
        meta: {
          title: 'router.promotionCampaign'
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
        path: 'accumulate-points',
        name: 'business.accumulate-points',
        redirect: { name: 'business.accumulate-points.customer' },
        meta: {
          title: 'router.accumulatePoints'
        },
        children: [
          {
            path: 'customer-points',
            name: 'business.accumulate-points.customer-points',
            component: 'views/Pages/Business/AccumulatePoints/CustomerPoints',
            meta: {
              title: 'router.customerPoints'
            }
          },
          {
            path: 'settings-points',
            name: 'business.accumulate-points.settings-points',
            component: 'views/Pages/Business/AccumulatePoints/SettingsPoints',
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
          title: 'router.virtualWallet'
        },
        children: [
          {
            path: 'customer',
            name: 'business.virtual-wallet.customer',
            component: 'views/Pages/Business/VirtualWallet/CustomerVirtualWallet',
            meta: {
              title: 'router.customervirtualWallet'
            }
          },
          {
            path: 'with-drewal-request',
            name: 'business.virtual-wallet.with-drewal-request',
            component: 'views/Pages/Business/VirtualWallet/WithdrawalRequest',
            meta: {
              title: 'router.withDrawalRequest'
            }
          },
          {
            path: 'settings',
            name: 'business.virtual-wallet.settings',
            component: 'views/Pages/Business/VirtualWallet/SettingsVirtualWallet',
            meta: {
              title: 'router.settingsvirtualWallet'
            }
          }
        ]
      },
      {
        path: 'employee-management',
        name: 'business.employee-management',
        redirect: { name: 'business.employee-management.employeeList' },
        meta: {
          title: 'router.businessMan'
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
        name: 'business.business-report',
        redirect: { name: 'business.business-report.growth' },
        meta: {
          title: 'router.businessReport'
        },
        children: [
          {
            path: 'growth',
            name: 'business.business-report.growth',
            component: 'views/Pages/Business/BusinessReport/Growth',
            meta: {
              title: 'router.growth'
            }
          },
          {
            path: 'sales',
            name: 'business.business-report.sales',
            component: 'views/Pages/Business/BusinessReport/Sales',
            meta: {
              title: 'router.sales'
            }
          },
          {
            path: 'debt',
            name: 'business.business-report.debt',
            component: 'views/Pages/Business/BusinessReport/Debt',
            meta: {
              title: 'router.debt'
            }
          },
          {
            path: 'turnover',
            name: 'business.business-report.turnover',
            component: 'views/Pages/Business/BusinessReport/Turnover',
            meta: {
              title: 'router.turnover'
            }
          }
        ]
      }
    ]
  },
  {
    path: '/purchase',
    component: '#',
    redirect: '/purchase',
    name: 'purchase',
    meta: {
      title: 'router.purchase',
      icon: 'arcticons:purchased-apps',
      alwaysShow: true
    },
    children: [
      {
        path: 'business-purchases',
        name: 'purchase.business-purchases',
        redirect: { name: 'purchase.business-purchases.purchase-order-list' },
        meta: {
          title: 'router.businessPurchases'
        },
        children: [
          {
            path: 'purchase-order-list',
            component: 'views/Pages/Purchase/BusinessPurchases/PurchaseOrderList',
            name: 'purchase.business-purchases.purchase-order-list',
            meta: {
              title: 'router.purchaseOrderList'
            }
          },
          {
            path: 'purchase-order-add',
            component: 'views/Pages/Purchase/BusinessPurchases/PurchaseOrderAdd',
            name: 'purchase.business-purchases.purchase-order-add',
            meta: {
              title: 'router.purchaseOrderAdd'
            }
          }
        ]
      }
    ]
  },
  {
    path: '/inventory-management',
    component: '#',
    redirect: '/inventory-management/business-product-warehouse',
    name: 'Inventorymanagement',
    meta: {
      title: 'router.warehouseManagement',
      icon: 'maki:warehouse',
      alwaysShow: true
    },
    children: [
      {
        path: 'business-product-warehouse',
        name: 'Inventorymanagement.ListWarehouse',
        redirect: { name: 'Inventorymanagement.ListWarehouse.inventory-tracking' },
        meta: {
          title: 'router.createRepositoryDirectoryProductStorage'
        },
        children: [
          {
            path: 'inventory-tracking',
            component: 'views/Pages/Warehouse/BusinessProductWarehouse/index',
            name: 'Inventorymanagement.ListWarehouse.inventory-tracking',
            meta: {
              title: 'router.inventoryTracking'
            }
          },
          {
            path: 'ware-house',
            component: 'views/Pages/Warehouse/BusinessProductWarehouse/WareHouse',
            name: 'Inventorymanagement.ListWarehouse.ware-house',
            meta: {
              title: 'router.warehouse'
            }
          },
          {
            path: 'export',
            component: 'views/Pages/Warehouse/BusinessProductWarehouse/Export',
            name: 'Inventorymanagement.ListWarehouse.export',
            meta: {
              title: 'router.export'
            }
          }
        ]
      },
      {
        path: 'create-repository-directory',
        name: 'Inventorymanagement.createRepositoryDirectory',
        meta: {
          title: 'router.createRepositoryDirectory',
          alwaysShow: true
        },
        children: [
          {
            path: 'product-storage',
            component: 'views/Pages/Warehouse/CreateStorageCategory/ProductStorage',
            name: 'Inventorymanagement.CreateStorageCategory.ProductStorage',
            meta: {
              title: 'router.createRepositoryDirectoryProductStorage'
            },
            children: [
              {
                path: `${utility}/:id?/:type?`,
                component: 'views/Pages/Warehouse/CreateStorageCategory/ProductStorageUtility',
                name: `Inventorymanagement.CreateStorageCategory.ProductStorage.${utility}`,
                meta: {
                  title: 'reuse.addNewWarehouse',
                  noTagsView: true,
                  noCache: true,
                  hidden: true,
                  showMainRoute: true
                }
              }
            ]
          }
        ]
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
        name: 'accountant.payment-proposal',
        redirect: { name: 'accountant.payment-proposal.payment-proposal-list' },
        meta: {
          title: 'router.paymentProposal'
        },
        children: [
          {
            path: 'payment-proposal-list',
            component: 'views/Pages/Accountant/PaymentProposal/PaymentProposalList',
            name: 'accountant.payment-proposal.payment-proposal-list',
            meta: {
              title: 'router.paymentProposalList'
            }
          },
          {
            path: 'payment-proposal-add',
            component: 'views/Pages/Accountant/PaymentProposal/PaymentProposalAdd',
            name: 'accountant.payment-proposal.payment-proposal-add',
            meta: {
              title: 'router.paymentProposalAdd'
            }
          }
        ]
      },
      {
        path: 'receipts-expenditures',
        name: 'accountant.receipts-expenditures',
        meta: {
          title: 'router.receiptsAndExpenditures'
        },
        children: [
          {
            path: 'receipts-expenditures-list',
            component: 'views/Pages/Accountant/ReceiptsAndExpenditures/ReceiptsAndExpenditures',
            name: 'accountant.receipts-expenditures.receipts-expenditures-list',
            meta: {
              title: 'router.receiptsAndExpendituresList'
            }
          },
          {
            path: 'receipts-add',
            component: 'views/Pages/Accountant/ReceiptsAndExpenditures/ReceiptsAdd',
            name: 'accountant.receipts-expenditures.receipts-add',
            meta: {
              title: 'router.receiptsAdd'
            }
          },
          {
            path: 'payment-add',
            component: 'views/Pages/Accountant/ReceiptsAndExpenditures/PaymentsAdd',
            name: 'accountant.receipts-expenditures.payment-add',
            meta: {
              title: 'router.paymentsAdd'
            }
          }
        ]
      },
      {
        path: 'balanceSheet',
        component: 'views/Pages/Accountant/BalanceSheet',
        name: 'accountant.balanceSheet',
        meta: {
          title: 'router.balanceSheet'
        },
        children: [
          {
            path: `${utility}/:id?/:type?`,
            component: 'views/Pages/Accountant/BalanceSheetUtility',
            name: `accountant.balanceSheet.${utility}`,
            meta: {
              title: 'reuse.addNewAccount',
              noTagsView: true,
              noCache: true,
              hidden: true,
              showMainRoute: true
            }
          }
        ]
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
        name: 'approve.products-approval',
        redirect: { name: 'approve.products-approval.newly-initialized' },
        meta: {
          title: 'router.approveProducts'
        },
        children: [
          {
            path: 'newly-initialized',
            component: 'views/Pages/Approval/Products/index',
            name: 'approve.products-approval.newly-initialized',
            meta: {
              title: 'router.newlyInitialized'
            }
          },
          {
            path: 'edit',
            component: 'views/Pages/Approval/Products/index',
            name: 'approve.products-approval.edit',
            meta: {
              title: 'router.edit'
            }
          }
        ]
      },
      {
        path: 'orders-approval',
        name: 'approve.orders-approval',
        redirect: { name: 'approve.orders-approval.oders-new' },
        meta: {
          title: 'router.approveOrders'
        },
        children: [
          {
            path: 'oders-new',
            component: 'views/Pages/Approval/Orders/index',
            name: 'approve.orders-approval.oders-new',
            meta: {
              title: 'router.odersNew'
            }
          },
          {
            path: 'oders-cancel',
            component: 'views/Pages/Approval/Orders/index',
            name: 'approve.orders-approval.oders-cancel',
            meta: {
              title: 'router.odersCancel'
            }
          }
        ]
      },
      {
        path: 'payment-approval',
        name: 'approve.payment-approval',
        redirect: { name: 'approve.payment-approval.proposal' },
        meta: {
          title: 'router.approvePayments'
        },
        children: [
          {
            path: 'proposal',
            component: 'views/Pages/Approval/Payments/index',
            name: 'approve.payment-approval.proposal',
            meta: {
              title: 'router.paymentProposal'
            }
          },
          {
            path: 'receipts-and-expenditures',
            component: 'views/Pages/Approval/Payments/index',
            name: 'approve.payment-approval.receipts-and-expenditures',
            meta: {
              title: 'router.receiptsAndExpenditures'
            }
          }
        ]
      },
      {
        path: 'accounts-approval',
        name: 'approve.accounts-approval',
        redirect: { name: 'approve.accounts-approval.user-account' },
        meta: {
          title: 'router.approveAccounts'
        },
        children: [
          {
            path: 'user-account',
            component: 'views/Pages/Approval/Accounts/index',
            name: 'approve.accounts-approval.user-account',
            meta: {
              title: 'router.userAccount'
            }
          },
          {
            path: 'collaborator-account',
            component: 'views/Pages/Approval/Accounts/index',
            name: 'approve.accounts-approval.collaborator-account',
            meta: {
              title: 'router.collaboratorAccount'
            }
          },
          {
            path: 'internal-account',
            component: 'views/Pages/Approval/Accounts/index',
            name: 'approve.accounts-approval.internal-account',
            meta: {
              title: 'router.internalAccount'
            }
          }
        ]
      },
      {
        path: 'approve-promotion-strategy',
        name: 'approve.approve-promotion-strategy',
        redirect: { name: 'approve.approve-promotion-strategy.approve-flashsale' },
        meta: {
          title: 'router.approvePromotionStrategy'
        },
        children: [
          {
            path: 'approve-flashsale',
            component: 'views/Pages/Approval/PromotionStrategy/index',
            name: 'approve.approve-promotion-strategy.approve-flashsale',
            meta: {
              title: 'router.flashsale'
            }
          },
          {
            path: 'approve-collection',
            component: 'views/Pages/Approval/PromotionStrategy/index',
            name: 'approve.approve-promotion-strategy.approve-collection',
            meta: {
              title: 'router.collection'
            }
          },
          {
            path: 'approve-newproduct',
            component: 'views/Pages/Approval/PromotionStrategy/index',
            name: 'approve.approve-promotion-strategy.approve-newproduct',
            meta: {
              title: 'router.newproduct'
            }
          },
          {
            path: 'approve-voucher',
            component: 'views/Pages/Approval/PromotionStrategy/index',
            name: 'approve.approve-promotion-strategy.approve-voucher',
            meta: {
              title: 'router.voucher'
            }
          },
          {
            path: 'approve-combo',
            component: 'views/Pages/Approval/PromotionStrategy/index',
            name: 'approve.approve-promotion-strategy.approve-combo',
            meta: {
              title: 'router.combo'
            }
          },
          {
            path: 'approve-auction',
            component: 'views/Pages/Approval/PromotionStrategy/index',
            name: 'approve.approve-promotion-strategy.approve-auction',
            meta: {
              title: 'router.auction'
            }
          },
          {
            path: 'approve-advertisingBanner',
            component: 'views/Pages/Approval/PromotionStrategy/index',
            name: 'approve.approve-promotion-strategy.approve-advertisingBanner',
            meta: {
              title: 'router.advertisingBanner'
            }
          }
        ]
      },
      {
        path: 'approve-management',
        component: 'views/Pages/Approval/ApprovalManagement',
        name: 'approve.approve-management',
        meta: {
          title: 'router.approveManagement'
        }
      }
    ]
  },
  {
    path: '/new-and-advertisement',
    component: '#',
    redirect: { name: 'New-and-advertisement.notify' },
    name: 'New-and-advertisement',
    meta: {
      title: 'router.newsAndAdvertisement',
      icon: 'arcticons:social',
      alwaysShow: true
    },
    children: [
      {
        path: 'notify',
        component: 'views/Pages/NewsAndAdvertisement/Notify',
        name: 'New-and-advertisement.notify',
        meta: {
          title: 'router.notify'
        }
      },
      {
        path: 'forum',
        name: 'New-and-advertisement.forum',
        component: 'views/Pages/NewsAndAdvertisement/ForumPage/forum',
        meta: {
          title: 'router.forum'
        }
      },
      {
        path: 'banner-advertisement',
        component: 'views/Pages/NewsAndAdvertisement/BannerAdvertisement',
        name: 'New-and-advertisement.banner-advertisement',
        meta: {
          title: 'router.bannerAdvertisement'
        }
      },
      {
        path: 'news-site',
        name: 'New-and-advertisement.news-site',
        meta: {
          title: 'router.newsSite'
        },
        children: [
          {
            path: 'news-list',
            component: 'views/Pages/NewsAndAdvertisement/NewsSites/NewsList',
            name: 'New-and-advertisement.news-site.news-list',
            meta: {
              title: 'router.newsList'
            }
          },
          {
            path: 'manage-news',
            component: 'views/Pages/NewsAndAdvertisement/NewsSites/ManageNewsCategories',
            name: 'New-and-advertisement.news-site.manage-news',
            meta: {
              title: 'router.manageNew'
            }
          }
        ]
      },
      {
        path: 'profile-admin',
        name: 'New-and-advertisement.profile-admin',
        redirect: { name: 'New-and-advertisement.profile-admin.policies-guidelines' },
        meta: {
          title: 'router.profileAdmin'
        },
        children: [
          {
            path: 'policies-guidelines',
            component: 'views/Pages/NewsAndAdvertisement/ProfileAdmin/PoliciesGuidelines',
            name: 'New-and-advertisement.profile-admin.policies-guidelines',
            meta: {
              title: 'router.policiesGuidelines'
            }
          },
          {
            path: 'about-us',
            component: 'views/Pages/NewsAndAdvertisement/ProfileAdmin/AboutUs',
            name: 'New-and-advertisement.profile-admin.about-us',
            meta: {
              title: 'router.aboutUs'
            }
          },
          {
            path: 'contact',
            component: 'views/Pages/NewsAndAdvertisement/ProfileAdmin/Contact',
            name: 'New-and-advertisement.profile-admin.contact',
            meta: {
              title: 'reuse.contact'
            }
          },
          {
            path: 'transaction-point',
            component: 'views/Pages/NewsAndAdvertisement/ProfileAdmin/TransactionPoint',
            name: 'New-and-advertisement.profile-admin.transaction-point',
            meta: {
              title: 'router.transactionPoint'
            }
          }
        ]
      }
    ]
  },
  {
    path: '/human-resource-management',
    component: '#',
    redirect: '/human-resource-management',
    name: 'human-resource-management',
    meta: {
      title: 'router.humanResourceManagement',
      icon: 'bx:user',
      alwaysShow: true
    },
    children: [
      {
        path: 'personnel-accounts',
        name: 'human-resource-management.personnel-accounts',
        component: 'views/Pages/HumanResourceManagement/PersonnelAccounts/index',
        meta: {
          title: 'router.personnelAccounts'
        }
      },
      {
        path: 'department-directory',
        name: 'human-resource-management.department-directory',
        component: 'views/Pages/HumanResourceManagement/DepartmentDirectory',
        meta: {
          title: 'router.departmentDirectory'
        },
        children: [
          {
            path: `${utility}/:id?/:type?`,
            component: 'views/Pages/HumanResourceManagement/DepartmentDirectoryUtility',
            name: `human-resource-management.department-directory.${utility}`,
            meta: {
              title: 'reuse.addNewBranch',
              noTagsView: true,
              noCache: true,
              hidden: true,
              showMainRoute: true
            }
          }
        ]
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
      const responseStructure = new serviceResponse(
        roleName === 'admin' ? adminList : testList,
        200,
        true,
        result_code,
        'Succeed',
        null
      )
      return {
        ...responseStructure
      }
    }
  }
] as MockMethod[]
