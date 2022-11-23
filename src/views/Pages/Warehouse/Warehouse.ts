import {
  filterService,
  filterIventory,
  filterDeposit,
  filterLocation,
  filterWarehouseManagement,
  filterTransactionType
} from '@/utils/filters'
import { h } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { dateTimeFormat, formatTransactionStatus, formatTransactionType } from '@/utils/format'
import { setImageDisplayInDOm } from '@/utils/domUtils'
import { ElButton } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import router from '@/router'
const { t } = useI18n()
//Tồn kho
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
  }
]

//Lsu gdich
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
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return formatTransactionType(cellValue)
    },
    filters: filterTransactionType
  },
  {
    field: 'transactionCode',
    label: t('reuse.importExportTransferWarehouseCode'),
    minWidth: '150',
    sortable: true
  },
  {
    field: 'orderCode',
    label: t('reuse.orderCode'),
    minWidth: '150',
    sortable: true
  },
  {
    field: 'productCode',
    label: t('reuse.managementCode'),
    minWidth: '150',
    formatter: (row, _column, _cellValue, _index) => {
      return h(
        'ul',
        // assuming `items` is a ref with array value
        row.transactionDetails.map(({ id, productCode }) => {
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
        row.transactionDetails.map(({ id, productName }) => {
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
    field: 'warehouse',
    label: t('reuse.warehouse'),
    minWidth: '250',
    formatter: (row, _column, _cellValue, _index) => {
      return h(
        'ul',
        // assuming `items` is a ref with array value
        row.transactionDetails.map(({ id, warehouseName }) => {
          return h('li', { key: id }, warehouseName)
        })
      )
    }
  },

  {
    field: 'location',
    label: t('reuse.location'),
    minWidth: '250',
    formatter: (row, _column, _cellValue, _index) => {
      return h(
        'ul',
        // assuming `items` is a ref with array value
        row.transactionDetails.map(({ id, locationName }) => {
          return h('li', { key: id }, locationName)
        })
      )
    }
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
    field: 'quantity',
    label: t('reuse.quantity'),
    minWidth: '250',
    formatter: (row, _column, _cellValue, _index) => {
      return h(
        'ul',
        // assuming `items` is a ref with array value
        row.transactionDetails.map(({ id, quantity }) => {
          return h('li', { key: id }, quantity)
        })
      )
    }
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
      return formatTransactionStatus(cellValue)
    }
  },
  {
    field: 'operator',
    label: t('reuse.operator'),
    minWidth: '200',
    formatter: (row: Recordable, __: TableColumn, _cellValue: boolean) => {
      return h('div', [h(ElButton, { icon: eyeIcon, onClick: () => action(row) })])
    }
  }
]
const eyeIcon = useIcon({ icon: 'emojione-monotone:eye-in-speech-bubble' })

const action = (row: any) => {
  const type = row.transactionType
  console.log('type:', type)
  switch (type) {
    case 1:
      router.push({
        name: 'Inventorymanagement.ListWarehouse.import',
        params: { id: row.id }
      })
      return
    case 2:
      router.push({
        name: 'Inventorymanagement.ListWarehouse.export',
        params: { id: row.id }
      })
      return

    case 3:
      router.push({
        name: 'Inventorymanagement.ListWarehouse.transfer',
        params: { id: row.id }
      })
      return

    default:
      return
  }
}
