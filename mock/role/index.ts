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
            path: 'potential-customer-add',
            component: 'views/Pages/Business/PotentialCustomerCare/PotentialCustomerAdd',
            name: 'business.potential-customer-care.potential-customer-add',
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
        path: 'business-product',
        name: 'business.business-product',
        redirect: { name: 'business.business-product.employeeList' },
        meta: {
          title: 'router.businessProducts'
        },
        children: [
          {
            path: 'product-list',
            name: 'business.business-product.product-list',
            component: 'views/Pages/Business/BusinessProducts/ProductList',
            meta: {
              title: 'router.productlist'
            }
          },
          {
            path: 'product-add',
            name: 'business.business-product.product-add',
            component: 'views/Pages/Business/BusinessProducts/ProductAdd',
            meta: {
              title: 'router.productadd'
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
            component: 'views/Pages/Purchase/BusinessPurchases/PurchaseOrderAdd',
            name: 'purchase.business-purchases.purchase-order-list',
            meta: {
              title: 'router.purchaseOrderList'
            }
          },
          {
            path: 'purchase-order-add',
            component: 'views/Pages/Purchase/BusinessPurchases/PurchaseOrderList',
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
            path: 'apayment-proposal-add',
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
        component: 'views/Pages/NewsAndAdvertisement/Forum',
        name: 'New-and-advertisement.forum',
        meta: {
          title: 'router.forum'
        }
      },
      {
        path: 'news-site',
        component: 'views/Pages/NewsAndAdvertisement/NewsSites',
        name: 'New-and-advertisement.news-site',
        meta: {
          title: 'router.newsSite'
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
      }
    ]
  },
  {
    path: '/library-and-setting',
    component: '#',
    redirect: { name: 'library-and-setting.product-category' },
    name: 'library-and-setting',
    meta: {
      title: 'router.productsAndServices',
      icon: 'carbon:cloud-satellite-config',
      alwaysShow: true
    },
    children: [
      {
        path: 'product-property',
        name: 'library-and-setting.product-property',
        meta: {
          title: 'router.productProperty'
        },
        children: [
          {
            path: 'product-category',
            component: 'views/Pages/LibraryAndSetting/Category/Product',
            name: 'library-and-setting.productCategoryProducts',
            meta: {
              title: 'router.productCategoryProducts'
            }
          },
          {
            path: 'attribute-category',
            component: 'views/Pages/LibraryAndSetting/Category/Attribute',
            name: 'library-and-setting.productCategoryAttribute',
            meta: {
              title: 'router.productCategoryAttribute'
            }
          },
          {
            path: 'unit-category',
            component: 'views/Pages/LibraryAndSetting/Category/Unit',
            name: 'library-and-setting.productCategoryUnit',
            meta: {
              title: 'router.productCategoryUnit'
            }
          },
          {
            path: 'brand-category',
            component: 'views/Pages/LibraryAndSetting/Category/Brand',
            name: 'library-and-setting.productCategoryBrand',
            meta: {
              title: 'router.productCategoryBrand'
            }
          },
          {
            path: 'origin-category',
            component: 'views/Pages/LibraryAndSetting/Category/Origin',
            name: 'library-and-setting.productCategoryOrigin',
            meta: {
              title: 'router.productCategoryOrigin'
            }
          }
        ]
      },
      {
        path: 'product-library',
        name: 'library-and-setting.ProductLibrary',
        meta: {
          title: 'router.ProductLibrary'
        },
        children: [
          {
            path: 'products',
            component: 'views/Pages/LibraryAndSetting/ProductLibrary/Products',
            name: 'library-and-setting.productLibraryProducts',
            meta: {
              title: 'router.productLibraryProducts'
            }
          },
          {
            path: 'spa-material',
            component: 'views/Pages/LibraryAndSetting/ProductLibrary/SpaMaterial',
            name: 'library-and-setting.productLibrarySpaMaterial',
            meta: {
              title: 'router.productLibrarySpaMaterial'
            }
          },
          {
            path: 'properties',
            component: 'views/Pages/LibraryAndSetting/ProductLibrary/Properties',
            name: 'library-and-setting.productLibraryproperties',
            meta: {
              title: 'router.productLibraryproperties'
            }
          }
        ]
      },
      {
        path: 'service-library',
        name: 'library-and-setting.ServiceLibrary',
        meta: {
          title: 'router.ServiceLibrary',
          alwaysShow: true
        },
        children: [
          {
            path: 'spa-service',
            component: 'views/Pages/LibraryAndSetting/ServiceLibrary/SpaService',
            name: 'library-and-setting.ServiceLibrarySpaService',
            meta: {
              title: 'router.ServiceLibrarySpaService'
            }
          }
        ]
      },
      {
        path: 'storage-library',
        name: 'library-and-setting.StorageLibrary',
        meta: {
          title: 'router.StorageLibrary'
        },
        children: [
          {
            path: 'product-storage',
            component: 'views/Pages/LibraryAndSetting/StorageLibrary/ProductStorage',
            name: 'library-and-setting.ProductStorage',
            meta: {
              title: 'router.StorageLibraryProductStorage'
            }
          },
          {
            path: 'spa-storage',
            component: 'views/Pages/LibraryAndSetting/StorageLibrary/SpaStorage',
            name: 'library-and-setting.productLibrarySpaStorage',
            meta: {
              title: 'router.productLibrarySpaStorage'
            }
          },
          {
            path: 'property-storage',
            component: 'views/Pages/LibraryAndSetting/StorageLibrary/PropertyStorage',
            name: 'library-and-setting.productPropertyStorage',
            meta: {
              title: 'router.productLibrarypropertiesPropertyStorage'
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
      return {
        code: result_code,
        data: roleName === 'admin' ? adminList : testList
      }
    }
  }
] as MockMethod[]
