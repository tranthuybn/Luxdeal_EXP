import {
  filterService,
  filterIventory,
  filterDeposit,
  filterLocation,
  filterWarehouseManagement
} from '@/utils/filters'
import { h } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { dateTimeFormat, formatPotentialCustomerStatusIdToText } from '@/utils/format'
import { setImageDisplayInDOm } from '@/utils/domUtils'
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
    field: 'LotImageUrl',
    label: t('reuse.image'),
    minWidth: '100',
    formatter: (record: Recordable, column: TableColumn, cellValue: TableSlotDefault) =>
      setImageDisplayInDOm(record, column, cellValue, record.name)
  },
  {
    field: 'typeOfTransfer',
    label: t('reuse.category'),
    minWidth: '100'
  },
  {
    field: 'warehouse',
    label: t('router.warehouse'),
    minWidth: '100',
    filters: filterWarehouseManagement
  },
  {
    field: 'locationWarehouse',
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
    field: 'inputPrice',
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
    field: 'inputPrice',
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
    field: 'createdAt',
    label: t('reuse.firstEntryDate'),
    minWidth: '100',
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '100'
  },
  {
    field: 'operator',
    label: t('reuse.operator'),
    minWidth: '100'
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
    field: 'transactionType',
    label: t('reuse.importExportTransferWarehouse'),
    minWidth: '150',
    filters: filterIventory
  },
  {
    field: 'transactionCode',
    label: t('reuse.importExportTransferWarehouseCode'),
    minWidth: '150',
    filters: filterIventory
  },
  {
    field: 'orderCode',
    label: t('reuse.orderCode'),
    minWidth: '150',
    filters: filterIventory
  },
  {
    field: 'orderDetails',
    label: t('reuse.managementCode'),
    minWidth: '150',
    formatter: (row, _column, _cellValue, _index) => {
      return h(
        'ul',
        // assuming `items` is a ref with array value
        row.orderDetails.map(({ id, productCode }) => {
          return h('li', { key: id }, productCode)
        })
      )
    }
  },
  {
    field: 'characteristic',
    label: t('reuse.productInformation'),
    minWidth: '250',
    formatter: (row, _column, _cellValue, _index) => {
      return h(
        'ul',
        // assuming `items` is a ref with array value
        row.orderDetails.map(({ id, productName }) => {
          return h('li', { key: id }, productName)
        })
      )
    }
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
    field: 'transactionDetails[0].warehouseName',
    label: t('reuse.warehouse'),
    minWidth: '100',
    filters: filterIventory
  },

  {
    field: 'transactionDetails[0].locationName',
    label: t('reuse.location'),
    minWidth: '100',
    sortable: true
  },

  {
    field: 'transactionDetails[0].lotCode',
    label: t('reuse.lotCode'),
    minWidth: '100',
    sortable: true,
    filters: filterIventory
  },
  {
    field: 'typeOfFirstEntry',
    label: t('reuse.productType'),
    minWidth: '100'
  },
  {
    field: 'orderDescription',
    label: t('reuse.note'),
    minWidth: '100'
  },
  {
    field: 'typeOfTransfer',
    label: t('reuse.quantity'),
    minWidth: '100'
  },
  {
    field: 'orderDetails[0].unitName',
    label: t('reuse.dram'),
    minWidth: '100'
  },
  {
    field: 'createdAt',
    label: t('reuse.createDate'),
    minWidth: '100',
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'staffName',
    label: t('reuse.petitioner'),
    minWidth: '100'
  },
  {
    field: 'customerName',
    label: t('reuse.subject'),
    minWidth: '100',
    filters: filterIventory
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '100',
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return formatPotentialCustomerStatusIdToText(cellValue)
    }
  }
]
