import { config } from '@/config/axios/config'
import { MockMethod } from 'vite-plugin-mock'
const { result_code } = config
const utility = 'Utility'

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
                path: `${utility}/:type?/:id?`,
                component: 'views/Pages/ProductsAndServices/ProductLibrary/ProductUtility',
                name: `products-services.productLibrary.Products.${utility}`,
                meta: {
                  title: 'reuse.addNewCategory',
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
            name: 'products-services.ServiceLibrary.SpaService',
            meta: {
              title: 'router.ServiceLibrarySpaService'
            }
          },
          {
            path: `${utility}/:type?/:id?`,
            component: 'views/Pages/ProductsAndServices/ServiceLibrary/SpaServiceUtility',
            name: `products-services.ServiceLibrary.SpaService.${utility}`,
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
                path: `${utility}/:type?/:id?`,
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
                path: `${utility}/:type?/:id?/:tab?`,
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
                path: `${utility}/:type?/:id?`,
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
                path: `${utility}/:type?/:id?`,
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
                path: `${utility}/:type?/:id?`,
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
            path: `${utility}/:type?/:id?`,
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
            path: '${utility}/:id?/:type/:tab?',
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
            path: `${utility}/:type?/:id?`,
            component: 'views/Pages/Business/CustomerManagement/CustomerAdd',
            name: `business.customer-management.customerList.${utility}`,
            meta: {
              title: 'reuse.createANewCustomer',
              noTagsView: true,
              noCache: true,
              hidden: true,
              showMainRoute: true
            }
          },
          {
            path: 'customerRatings',
            name: 'business.customer-management.customerRatings',
            component: 'views/Pages/Business/CustomerManagement/TabsCustomerRatings',
            meta: {
              title: 'router.customerRatings'
            },
            children: [
              {
                path: `${utility}/:type?/:id?`,
                component: 'views/Pages/Business/CustomerManagement/AddNewRanking',
                name: `business.customer-management.customerRatings.${utility}`,
                meta: {
                  title: 'customerList.addNewRanking',
                  noTagsView: true,
                  noCache: true,
                  hidden: true,
                  showMainRoute: true
                }
              }
            ]
          },
          {
            path: 'customerAdd',
            name: 'business.customer-management.customerAdd',
            component: 'views/Pages/Business/CustomerManagement/CustomerAdd',
            meta: {
              title: 'router.customerAdd'
            }
          },
          {
            path: `${utility}/:id?/:type?`,
            component: 'views/Pages/Business/CustomerManagement/CustomerAdd',
            name: `business.customer-management.customerList.${utility}`,
            meta: {
              title: 'router.customerAdd',
              hidden: true,
              canto: true
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
            },
            children: [
              {
                path: `${utility}/:type?/:id?`,
                name: `business.collaborators.collaboratorsList.${utility}`,
                component: 'views/Pages/Business/Collaborators/CollaboratorsAdd',
                meta: {
                  title: 'router.collaboratorsAdd',
                  noTagsView: true,
                  noCache: true,
                  hidden: true,
                  showMainRoute: true
                }
              }
            ]
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
            path: `${utility}/:type?/:id?`,
            name: `business.collaborators.paymentRequest.${utility}`,
            component: 'views/Pages/Business/Collaborators/PaymentRequestAdd',
            meta: {
              title: 'router.newInitialization',
              noTagsView: true,
              noCache: true,
              hidden: true,
              showMainRoute: true
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
            path: `${utility}/:type?/:id?`,
            component: 'views/Pages/Business/PromotionStrategy/FlashSaleUtility',
            name: `business.promotion-strategy.flash-sale.${utility}`,
            meta: {
              title: 'reuse.flashSaleDetail',
              noTagsView: true,
              noCache: true,
              hidden: true,
              showMainRoute: true
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
            path: `${utility}/:type?/:id?`,
            component: 'views/Pages/Business/PromotionStrategy/CollectionUtility',
            name: `business.promotion-strategy.collection.${utility}`,
            meta: {
              title: 'reuse.collectionDetail',
              noTagsView: true,
              noCache: true,
              hidden: true,
              showMainRoute: true
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
            path: `${utility}/:type?/:id?`,
            component: 'views/Pages/Business/PromotionStrategy/NewProductUtility',
            name: `business.promotion-strategy.new-product.${utility}`,
            meta: {
              title: 'reuse.newProductDetail',
              noTagsView: true,
              noCache: true,
              hidden: true,
              showMainRoute: true
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
            path: `${utility}/:type?/:id?`,
            component: 'views/Pages/Business/PromotionStrategy/indexVoucher',
            name: `business.promotion-strategy.voucher.${utility}`,
            meta: {
              title: 'reuse.initializationVoucher',
              noTagsView: true,
              noCache: true,
              hidden: true,
              showMainRoute: true
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
            path: `${utility}/:type?/:id?`,
            component: 'views/Pages/Business/PromotionStrategy/ComboUtility',
            name: `business.promotion-strategy.combo.${utility}`,
            meta: {
              title: 'reuse.comboDetail',
              noTagsView: true,
              noCache: true,
              hidden: true,
              showMainRoute: true
            }
          },
          {
            path: 'auction',
            name: 'business.promotion-strategy.auction',
            component: 'views/Pages/Business/PromotionStrategy/Auction',
            meta: {
              title: 'router.auction'
            }
          },
          {
            path: `${utility}/:type?/:id?`,
            component: 'views/Pages/Business/PromotionStrategy/AuctionUtility',
            name: `business.promotion-strategy.auction.${utility}`,
            meta: {
              title: 'reuse.auctionDetail',
              noTagsView: true,
              noCache: true,
              hidden: true,
              showMainRoute: true
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
            },
            children: [
              {
                path: `${utility}/:type?/:id?`,
                component: 'views/Pages/Business/AccumulatePoints/SettingsPointsAdd',
                name: `business.accumulate-points.settings-points.${utility}`,
                meta: {
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
            },
            children: [
              {
                path: `${utility}/:type?/:id?`,
                component: 'views/Pages/Business/VirtualWallet/VirtualWalletUtility',
                name: `business.virtual-wallet.customer.${utility}`,
                meta: {
                  title: 'reuse.VirtualWalletUtility',
                  noTagsView: true,
                  noCache: true,
                  hidden: true,
                  showMainRoute: true
                }
              }
            ]
          },
          {
            path: 'with-drewal-request',
            name: 'business.virtual-wallet.with-drewal-request',
            component: 'views/Pages/Business/VirtualWallet/WithdrawalRequest',
            meta: {
              title: 'router.withDrawalRequest'
            },
            children: [
              {
                path: `${utility}/:type?/:id?`,
                name: `business.virtual-wallet.with-drewal-request.${utility}`,
                component: 'views/Pages/Business/VirtualWallet/WithdrawalRequestUtility',
                meta: {
                  title: 'reuse.addNewVirtualWalletRequest',
                  noTagsView: true,
                  noCache: true,
                  hidden: true,
                  showMainRoute: true
                }
              }
            ]
          },
          {
            path: 'settings',
            name: 'business.virtual-wallet.settings',
            component: 'views/Pages/Business/VirtualWallet/SettingsVirtualWallet',
            meta: {
              title: 'router.settingsvirtualWallet'
            },
            children: [
              {
                path: `${utility}/:type?/:id?`,
                component: 'views/Pages/Business/VirtualWallet/SettingsVirtualWalletUtility',
                name: `business.virtual-wallet.settings.${utility}`,
                meta: {
                  title: 'reuse.addNewMoneyPaymentCode',
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
                path: `${utility}/:type?/:id?`,
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
            path: `${utility}/:type?/:id?`,
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
            path: `${utility}/:type?/:id?`,
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
  '/products-services',
  '/products-services/product-library',
  '/products-services/product-library/products',
  `/products-services/product-library/products-utility/:type?/:id?`,
  '/products-services/service-library',
  '/products-services/service-library/spa-service',
  `/products-services/service-library/spa-service-utility/:type?/:id?`,
  '/products-services/product-property',
  '/products-services/product-property/product-category',
  `/products-services/product-property/product-category-utility/:type?/:id?`,
  '/products-services/product-property/attribute-category',
  `/products-services/product-property/attribute-category-utility/:type?/:id?/:tab?`,
  '/products-services/product-property/unit-category',
  `/products-services/product-property/unit-category-utility/:type?/:id?`,
  '/products-services/product-property/brand-category',
  `/products-services/product-property/brand-category-utility/:type?/:id?`,
  '/products-services/product-property/origin-category',
  `/products-services/product-property/origin-category-utility/:type?/:id?`,
  '/business',
  '/business/potential-customer-care',
  '/business/potential-customer-care/potential-customer-list',
  `/business/potential-customer-care/potential-utility/:type?/:id?`,
  '/business/potential-customer-care/manage-chat',

  '/business/order-management',
  '/business/order-management/order-list',
  '/business/order-management/order-list-add/:type?/:tab?/:id?',

  '/business/customer-management',
  '/business/customer-management/customerList',
  '/business/customer-management/customer-add/:type?/:id?',
  '/business/customer-management/customerRatings',
  `/business/customer-management/customerRatings-utility/:type?/:id?`,

  '/business/collaborators',
  '/business/collaborators/collaboratorsList',
  '/business/collaborators/collaboratorsAdd/:type?/:id?',
  '/business/collaborators/paymentRequest',
  '/business/collaborators/paymentRequestAdd/:type?/:id?',

  '/business/promotion-strategy',
  '/business/promotion-strategy/flash-sale',
  `/business/promotion-strategy/flash-sale-utility/:type?/:id?`,
  '/business/promotion-strategy/collection',
  `/business/promotion-strategy/collection-utility/:type?/:id?`,
  '/business/promotion-strategy/new-product',
  `/business/promotion-strategy/new-product-utility/:type?/:id?`,
  '/business/promotion-strategy/voucher',
  `/business/promotion-strategy/voucher-utility/:type?/:tab?/:id?`,
  '/business/promotion-strategy/combo',
  `/business/promotion-strategy/combo-utility/:type?/:id?`,
  '/business/promotion-strategy/auction',
  `/business/promotion-strategy/auction-utility/:type?/:id?`,
  '/business/service-survey',

  '/business/accumulate-points',
  '/business/accumulate-points/customer-points',
  '/business/accumulate-points/settings-points',
  '/business/accumulate-points/settings-points-utility/:id?/type?',

  '/business/virtual-wallet',
  '/business/virtual-wallet/customer',
  '/business/virtual-wallet/customer-utility/:type?/:id?',
  '/business/virtual-wallet/with-drewal-request',
  '/business/virtual-wallet/with-drewal-request-utility/:type?/:id?',
  '/business/virtual-wallet/settings',
  '/business/virtual-wallet/settings-utility/:type?/:id?',
  '/business/employee-management',
  '/business/employee-management/employeeList',
  '/business/employee-management/employeeRatings',
  '/business/business-report',
  '/business/business-report/growth',
  '/business/business-report/sales',
  '/business/business-report/debt',
  '/business/business-report/turnover',

  '/purchase',
  '/purchase/business-purchases',
  '/purchase/business-purchases/purchase-order-list',
  '/purchase/business-purchases/purchase-order-add',

  '/inventory-management',
  '/inventory-management/business-product-warehouse',
  '/inventory-management/business-product-warehouse/inventory-tracking',
  '/inventory-management/business-product-warehouse/ware-house',
  '/inventory-management/business-product-warehouse/export',
  '/inventory-management/create-repository-directory',
  '/inventory-management/create-repository-directory/product-storage',
  '/inventory-management/create-repository-directory/product-storage-utility/:type?/:id?',

  '/accountant',
  '/accountant/payment-proposal',
  '/accountant/payment-proposal/payment-proposal-list',
  '/accountant/payment-proposal/payment-proposal-list/:type?/:tab?/:id?',

  '/accountant/receipts-expenditures',
  '/accountant/receipts-expenditures/receipts-expenditures-list',
  '/accountant/receipts-expenditures/receipts-add',
  '/accountant/receipts-expenditures/payment-add',
  '/accountant/balanceSheet',
  `/accountant/balanceSheet-utility`,
  '/approve',
  '/approve/products-approval',
  '/approve/products-approval/newly-initialized',
  '/approve/products-approval/edit',
  '/approve/orders-approval',
  '/approve/orders-approval/oders-new',
  '/approve/orders-approval/oders-cancel',
  '/approve/payment-approval',
  '/approve/payment-approval/proposal',
  '/approve/payment-approval/receipts-and-expenditures',

  '/approve/accounts-approval',
  '/approve/accounts-approval/user-account',
  '/approve/accounts-approval/collaborator-account',
  '/approve/accounts-approval/internal-account',
  '/approve/approve-promotion-strategy',
  '/approve/approve-promotion-strategy/approve-flashsale',
  '/approve/approve-promotion-strategy/approve-collection',
  '/approve/approve-promotion-strategy/approve-newproduct',
  '/approve/approve-promotion-strategy/approve-voucher',
  '/approve/approve-promotion-strategy/approve-combo',
  '/approve/approve-promotion-strategy/approve-auction',
  '/approve/approve-promotion-strategy/approve-advertisingBanner',
  '/approve/approve-management',
  '/new-and-advertisement',
  '/new-and-advertisement/notify',
  '/new-and-advertisement/forum',
  '/new-and-advertisement/banner-advertisement',
  '/new-and-advertisement/news-site',
  '/new-and-advertisement/news-site/news-list',
  '/new-and-advertisement/news-site/manage-news',
  '/new-and-advertisement/profile-admin',
  '/new-and-advertisement/profile-admin/policies-guidelines',
  '/new-and-advertisement/profile-admin/about-us',
  '/new-and-advertisement/profile-admin/contact',
  '/new-and-advertisement/profile-admin/transaction-point',
  '/human-resource-management',
  '/human-resource-management/personnel-accounts',
  '/human-resource-management/department-directory',
  `/human-resource-management/department-directory-utility/:type?/:id?`
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
        // data: roleName === 'admin' ? adminList : testList
        data: testList
      }
    }
  }
] as MockMethod[]
