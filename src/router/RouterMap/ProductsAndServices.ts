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
          },
          children: [
            {
              path: `${utility}/:id?/:type?`,
              component: () =>
                import('@/views/Pages/ProductsAndServices/ProductLibrary/ProductUtility.vue'),
              name: `products-services.productLibrary.Products.${utility}`,
              meta: {
                title: t('reuse.addNewCategory'),
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
          name: 'products-services.ServiceLibrarySpaService',
          meta: {
            title: t('router.ServiceLibrarySpaService')
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
          },
          children: [
            {
              path: `${utility}`,
              component: () =>
                import('@/views/Pages/ProductsAndServices/Category/ProductCategoryUtility.vue'),
              name: `products-services.ProductCategory.${utility}`,
              meta: {
                title: t('reuse.addNewCategory'),
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
          component: () => import('@/views/Pages/ProductsAndServices/Category/Attribute.vue'),
          name: 'products-services.AttributeCategory',
          meta: {
            title: t('router.productCategoryAttribute')
          },
          children: [
            {
              path: `${utility}`,
              component: () =>
                import('@/views/Pages/ProductsAndServices/Category/AttributeCategoryUtility.vue'),
              name: `products-services.AttributeCategory.${utility}`,
              meta: {
                title: t('reuse.addNewAttribute'),
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
          component: () => import('@/views/Pages/ProductsAndServices/Category/Unit.vue'),
          name: 'products-services.UnitCategory',
          meta: {
            title: t('router.productCategoryUnit')
          },
          children: [
            {
              path: `${utility}`,
              component: () =>
                import('@/views/Pages/ProductsAndServices/Category/UnitCategoryUtility.vue'),
              name: `products-services.UnitCategory.${utility}`,
              meta: {
                title: t('reuse.addNewUnit'),
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
          component: () => import('@/views/Pages/ProductsAndServices/Category/Brand.vue'),
          name: 'products-services.BrandCategory',
          meta: {
            title: t('router.productCategoryBrand')
          },
          children: [
            {
              path: `${utility}`,
              component: () =>
                import('@/views/Pages/ProductsAndServices/Category/BrandCategoryUtility.vue'),
              name: `products-services.BrandCategory.${utility}`,
              meta: {
                title: t('reuse.addNewBrand'),
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
          component: () => import('@/views/Pages/ProductsAndServices/Category/Origin.vue'),
          name: 'products-services.OriginCategory',
          meta: {
            title: t('router.productCategoryOrigin')
          },
          children: [
            {
              path: `${utility}`,
              component: () =>
                import('@/views/Pages/ProductsAndServices/Category/OriginCategoryUtility.vue'),
              name: `products-services.OriginCategory.${utility}`,
              meta: {
                title: t('reuse.addNewOrigin'),
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
}
