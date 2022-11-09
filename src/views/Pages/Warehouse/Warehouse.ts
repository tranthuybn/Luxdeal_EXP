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
    field: 'ticketCode',
    label: t('reuse.importTransferWarehouseCode'),
    minWidth: '150'
  },
  {
    field: 'ticketCode',
    label: t('reuse.inputLotCode'),
    minWidth: '150'
  },
  {
    field: 'orderCode',
    label: t('reuse.orderCode'),
    minWidth: '150'
  },
  {
    field: 'productCode',
    label: t('reuse.productCode'),
    minWidth: '100'
  },
  {
    field: 'productPropertyCode',
    label: t('reuse.managementCode'),
    minWidth: '100'
  },
  {
    field: 'productPropertyName',
    label: t('reuse.productInformation'),
    minWidth: '100'
  },

  {
    field: 'accessory',
    label: t('reuse.accessory'),
    minWidth: '100',
    filters: filterService
  },
  {
    field: 'image',
    label: t('reuse.image'),
    minWidth: '100'
  },
  {
    field: 'typeOfTransfer',
    label: t('reuse.category'),
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
    field: 'description',
    label: t('reuse.productType'),
    minWidth: '150',
    filters: filterLocation
  },
  {
    field: 'amountImport',
    label: t('reuse.amountImportLot'),
    minWidth: '100',
    sortable: true
  },
  {
    field: 'inventory',
    label: t('reuse.quantityInventory'),
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
    field: 'status',
    label: t('reuse.status'),
    minWidth: '100',
    filters: filterIventory
  }
]

export const wareHouseContainer = [
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'productCode',
    label: t('reuse.importExportTransferWarehouse'),
    minWidth: '150',
    filters: filterIventory
  },
  {
    field: 'managementCode',
    label: t('reuse.importExportTransferWarehouseCode'),
    minWidth: '150',
    filters: filterIventory
  },
  {
    field: 'productName',
    label: t('reuse.orderCode'),
    minWidth: '150',
    filters: filterIventory
  },
  {
    field: 'description',
    label: t('reuse.typeOfProduct'),
    minWidth: '150',
    filters: filterIventory
  },
  {
    field: 'productName',
    label: t('reuse.managementCode'),
    minWidth: '150',
    filters: filterIventory
  },
  {
    field: 'characteristic',
    label: t('reuse.productInformation'),
    minWidth: '250'
  },
  {
    field: 'accessory',
    label: t('reuse.accessory'),
    minWidth: '100'
  },
  {
    field: 'singleEntryCode',
    label: t('reuse.category'),
    minWidth: '100',
    filters: filterService
  },

  {
    field: 'typeOfFirstEntry',
    label: t('reuse.note'),
    minWidth: '100'
  },
  {
    field: 'typeOfTransfer',
    label: t('reuse.quantity'),
    minWidth: '100'
  },
  {
    field: 'warehouseManagement',
    label: t('reuse.dram'),
    minWidth: '100'
  },
  {
    field: 'amountImport',
    label: t('reuse.warehouse'),
    minWidth: '100',
    filters: filterIventory
  },
  {
    field: 'location',
    label: t('reuse.createDateBill'),
    minWidth: '100',
    sortable: true
  },

  {
    field: 'inventory',
    label: t('customerList.petitioner'),
    minWidth: '100',
    sortable: true,
    filters: filterIventory
  },
  {
    field: 'dram',
    label: t('reuse.subject'),
    minWidth: '100',
    filters: filterIventory
  },

  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '100',
    filters: filterIventory
  }
]
