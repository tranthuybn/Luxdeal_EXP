import {
  filterService,
  filterIventory,
  filterDeposit,
  filterLocation,
  filterWarehouseManagement
} from '@/utils/filters'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
//Đơn bán hàng
export const wareHouse = [
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'productCode',
    label: t('reuse.productCode'),
    minWidth: '150'
  },
  {
    field: 'managementCode',
    label: t('reuse.managementCode'),
    minWidth: '150'
  },
  {
    field: 'productName',
    label: t('reuse.productName'),
    minWidth: '150'
  },
  {
    field: 'description',
    label: t('reuse.description'),
    minWidth: '150'
  },
  {
    field: 'characteristic',
    label: t('reuse.featureGroup'),
    minWidth: '100'
  },
  {
    field: 'accessory',
    label: t('reuse.accessory'),
    minWidth: '100'
  },
  {
    field: 'singleEntryCode',
    label: t('reuse.singleEntryCode'),
    minWidth: '100'
  },

  {
    field: 'typeOfFirstEntry',
    label: t('reuse.typeOfFirstEntry'),
    minWidth: '100',
    filters: filterService
  },
  {
    field: 'typeOfTransfer',
    label: t('reuse.typeOfTransfer'),
    minWidth: '100'
  },
  {
    field: 'warehouseManagement',
    label: t('router.warehouseManagement'),
    minWidth: '100',
    filters: filterWarehouseManagement
  },
  {
    field: 'location',
    label: t('reuse.location'),
    minWidth: '100',
    filters: filterLocation
  },
  {
    field: 'amountImport',
    label: t('reuse.amountImport'),
    minWidth: '100',
    sortable: true
  },
  {
    field: 'inventory',
    label: t('reuse.inventory'),
    minWidth: '100',
    sortable: true
  },
  {
    field: 'dram',
    label: t('reuse.dram'),
    minWidth: '100'
  },
  {
    field: 'priceImport',
    label: t('reuse.priceImport'),
    minWidth: '100',
    sortable: true
  },
  {
    field: 'CashIntoInventory',
    label: t('reuse.CashIntoInventory'),
    minWidth: '100',
    sortable: true
  },
  {
    field: 'businessManagement',
    label: t('reuse.businessManagement'),
    minWidth: '100',
    filters: filterDeposit
  },
  {
    field: 'firstEntryDate',
    label: t('reuse.firstEntryDate'),
    minWidth: '100',
    sortable: true
  },
  {
    field: 'stockCard',
    label: t('reuse.stockCard'),
    minWidth: '100'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '100',
    filters: filterIventory
  }
]
