import { Layout } from '@/utils/routerHelper'
import { useI18n } from '@/hooks/web/useI18n'
import { appModules } from '@/config/app'
const { utility } = appModules
const { t } = useI18n()

export default {
  path: '/products-services',
  component: Layout,
  redirect: { name: 'products-services.ProductLibrary' },
  name: 'products-services',
  meta: {
    title: t('router.productsAndServices'),
    icon: 'gridicons:product-virtual',
    alwaysShow: true
  },
  children: [
    {
      path: 'product-library',
      name: 'products-services.ProductLibrary',
      meta: {
        title: t('router.productManagement'),
        alwaysShow: true
      },
      children: [
        {
          path: 'products',
          component: () => import('@/views/Pages/ProductsAndServices/ProductLibrary/Products.vue'),
          name: 'products-services.productLibrary.Products',
          meta: {
            title: t('router.productLibraryProducts')
          }
        },
        {
          path: `products-utility/:type?/:id?`,
          component: () =>
            import('@/views/Pages/ProductsAndServices/ProductLibrary/ProductUtility.vue'),
          name: `products-services.productLibrary.Products.${utility}`,
          meta: {
            title: t('reuse.addNewCategory')
          }
        }
      ]
    },
    {
      path: 'service-library',
      name: 'products-services.ServiceLibrary',
      meta: {
        title: t('router.serviceManagement'),
        alwaysShow: true
      },
      children: [
        {
          path: 'spa-service',
          component: () =>
            import('@/views/Pages/ProductsAndServices/ServiceLibrary/SpaService.vue'),
          name: 'products-services.ServiceLibrary.SpaService',
          meta: {
            title: t('router.ServiceLibrarySpaService')
          }
        },
        {
          path: `spa-service-utility/:type?/:id?`,
          component: () =>
            import('@/views/Pages/ProductsAndServices/ServiceLibrary/SpaServiceUtility.vue'),
          name: `products-services.ServiceLibrarySpaService.${utility}`,
          meta: {
            title: t('reuse.addNewSpaService'),
            noTagsView: true,
            noCache: true,
            canTo: true,
            hidden: true,
            canto: true
          }
        }
      ]
    },
    {
      path: 'product-property',
      name: 'products-services.product-property',
      meta: {
        title: t('router.productPropertyNew')
      },
      children: [
        {
          path: 'product-category',
          component: () => import('@/views/Pages/ProductsAndServices/Category/Product.vue'),
          name: 'products-services.ProductCategory',
          meta: {
            title: t('router.productCategoryProducts')
          }
        },
        {
          path: `product-category-utility/:type?/:id?`,
          component: () =>
            import('@/views/Pages/ProductsAndServices/Category/ProductCategoryUtility.vue'),
          name: `products-services.ProductCategory.${utility}`,
          meta: {
            title: t('reuse.addNewCategory'),
            noTagsView: true,
            canTo: true,
            noCache: true,
            hidden: true,
            showMainRoute: true
          }
        },
        {
          path: 'attribute-category',
          component: () => import('@/views/Pages/ProductsAndServices/Category/Attribute.vue'),
          name: 'products-services.AttributeCategory',
          meta: {
            title: t('router.productCategoryAttribute')
          }
        },
        {
          path: `attribute-category-utility/:type?/:id?/:tab?`,
          component: () =>
            import('@/views/Pages/ProductsAndServices/Category/AttributeCategoryUtility.vue'),
          name: `products-services.AttributeCategory.${utility}`,
          meta: {
            title: t('reuse.addNewAttribute'),
            noTagsView: true,
            noCache: true,
            canTo: true,
            hidden: true,
            showMainRoute: true
          }
        },
        {
          path: 'unit-category',
          component: () => import('@/views/Pages/ProductsAndServices/Category/Unit.vue'),
          name: 'products-services.UnitCategory',
          meta: {
            title: t('router.productCategoryUnit')
          }
        },
        {
          path: `unit-category-utility/:type?/:id?`,
          component: () =>
            import('@/views/Pages/ProductsAndServices/Category/UnitCategoryUtility.vue'),
          name: `products-services.UnitCategory.${utility}`,
          meta: {
            title: t('reuse.addNewUnit'),
            noTagsView: true,
            noCache: true,
            hidden: true,
            canTo: true,
            showMainRoute: true
          }
        },
        {
          path: 'brand-category',
          component: () => import('@/views/Pages/ProductsAndServices/Category/Brand.vue'),
          name: 'products-services.BrandCategory',
          meta: {
            title: t('router.productCategoryBrand')
          }
        },
        {
          path: `brand-category-utility/:type?/:id?`,
          component: () =>
            import('@/views/Pages/ProductsAndServices/Category/BrandCategoryUtility.vue'),
          name: `products-services.BrandCategory.${utility}`,
          meta: {
            title: t('reuse.addNewBrand'),
            noTagsView: true,
            noCache: true,
            canTo: true,
            hidden: true,
            showMainRoute: true
          }
        },
        {
          path: 'origin-category',
          component: () => import('@/views/Pages/ProductsAndServices/Category/Origin.vue'),
          name: 'products-services.OriginCategory',
          meta: {
            title: t('router.productCategoryOrigin')
          }
        },
        {
          path: `origin-category-utility/:type?/:id?`,
          component: () =>
            import('@/views/Pages/ProductsAndServices/Category/OriginCategoryUtility.vue'),
          name: `products-services.OriginCategory.${utility}`,
          meta: {
            title: t('reuse.addNewOrigin'),
            noTagsView: true,
            noCache: true,
            canTo: true,
            hidden: true,
            showMainRoute: true
          }
        }
      ]
    }
  ]
}
