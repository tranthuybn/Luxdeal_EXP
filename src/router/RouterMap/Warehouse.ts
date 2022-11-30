import { Layout } from '@/utils/routerHelper'
import { useI18n } from '@/hooks/web/useI18n'
import { appModules } from '@/config/app'
const { utility } = appModules

const { t } = useI18n()
export default {
  path: '/inventory-management',
  component: Layout,
  redirect: '/inventory-management/business-product-warehouse',
  name: 'Inventorymanagement',
  meta: {
    title: t('router.warehouseManagement'),
    icon: 'maki:warehouse',
    alwaysShow: true
  },
  children: [
    {
      path: 'business-product-warehouse',
      name: 'Inventorymanagement.ListWarehouse',
      redirect: { name: 'Inventorymanagement.ListWarehouse.inventory-tracking' },
      meta: {
        title: t('router.createRepositoryDirectoryProductStorage')
      },
      children: [
        {
          path: 'inventory-tracking',
          component: () => import('@/views/Pages/Warehouse/BusinessProductWarehouse/index.vue'),
          name: 'Inventorymanagement.ListWarehouse.inventory-tracking',
          meta: {
            title: t('router.inventoryTracking')
          }
        },
        {
          path: 'warehouse-transaction-1/:id?',
          component: () =>
            import('@/views/Pages/Warehouse/BusinessProductWarehouse/ImportTransaction.vue'),
          name: 'Inventorymanagement.ListWarehouse.import',
          meta: {
            title: t('router.warehouse')
          }
        },
        {
          path: 'warehouse-transaction-2/:id?',
          component: () =>
            import('@/views/Pages/Warehouse/BusinessProductWarehouse/ExportTransaction.vue'),
          name: 'Inventorymanagement.ListWarehouse.export',
          meta: {
            title: t('router.export')
          }
        },
        {
          path: 'warehouse-transaction-3/:id?',
          component: () =>
            import('@/views/Pages/Warehouse/BusinessProductWarehouse/TransferTransaction.vue'),
          name: 'Inventorymanagement.ListWarehouse.transfer',
          meta: {
            title: t('reuse.transfer')
          }
        }
      ]
    },
    {
      path: 'create-repository-directory',
      name: 'Inventorymanagement.createRepositoryDirectory',
      meta: {
        title: t('router.createRepositoryDirectory'),
        alwaysShow: true
      },
      children: [
        {
          path: 'product-storage',
          component: () =>
            import('@/views/Pages/Warehouse/CreateStorageCategory/ProductStorage.vue'),
          name: 'Inventorymanagement.CreateStorageCategory.ProductStorage',
          meta: {
            title: t('router.createRepositoryDirectoryProductStorage')
          }
        },
        {
          path: 'product-storage-utility/:type?/:id?',
          component: () =>
            import('@/views/Pages/Warehouse/CreateStorageCategory/ProductStorageUtility.vue'),
          name: `Inventorymanagement.CreateStorageCategory.ProductStorage.${utility}`,
          meta: {
            title: t('reuse.addNewWarehouse'),
            noTagsView: true,
            noCache: true,
            hidden: true,
            canTo: true,
            showMainRoute: true
          }
        }
      ]
    }
  ]
}
