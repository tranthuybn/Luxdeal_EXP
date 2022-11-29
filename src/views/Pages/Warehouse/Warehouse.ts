import {
  filterService,
  filterDeposit,
  filterLocation,
  filterWarehouseManagement,
  filterTransactionType,
  filterLotStatus
} from '@/utils/filters'
import { h } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import {
  dateTimeFormat,
  formatTransactionStatus,
  formatTransactionType,
  orderType
} from '@/utils/format'
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
    minWidth: '100',
    formatter: (row, _column, _cellValue, _index) => {
      return h(
        'span',
        // assuming `items` is a ref with array value
        `${row.categoryParentName}/${row.categoryChildName}`
      )
    }
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
    field: 'orderServiceType',
    label: t('reuse.productType'),
    minWidth: '150',
    filters: filterLocation,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return orderType(cellValue)
    }
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
    field: 'productPropertyAttribute[2].value',
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
    sortable: true,
    formatter: (row, _column, _cellValue, _index) => {
      return h(
        'span',
        // assuming `items` is a ref with array value
        `${row.inputPrice * row.inventory}`
      )
    }
  },
  {
    field: 'businessManagement',
    label: t('reuse.businessManagement'),
    minWidth: '100',
    filters: filterDeposit,
    formatter: (row, _column, _cellValue, _index) => {
      return h(
        'ul',
        // assuming `items` is a ref with array value
        row.bussinessSetups.map((item) => {
          if (item.value) {
            return h('li', item.key)
          }
        })
      )
    }
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
    minWidth: '100',
    filters: filterLotStatus
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
        row.transactionDetails.map(({ id, productPropertyCode }) => {
          return h('li', { key: id }, productPropertyCode)
        })
      )
    }
  },
  {
    field: 'productPropertyName',
    label: t('reuse.productInformation'),
    minWidth: '250',
    formatter: (row, _column, _cellValue, _index) => {
      return h(
        'ul',
        // assuming `items` is a ref with array value
        row.transactionDetails.map(({ id, productPropertyName }) => {
          return h('li', { key: id }, productPropertyName)
        })
      )
    }
  },
  {
    field: 'accessory',
    label: t('reuse.accessory'),
    minWidth: '100',
    formatter: (row, _column, _cellValue, _index) => {
      return h(
        'ul',
        // assuming `items` is a ref with array value
        row.transactionDetails.map(({ id, accessory }) => {
          return h('li', { key: id }, accessory)
        })
      )
    }
  },
  {
    field: 'category',
    label: t('reuse.category'),
    minWidth: '250',
    formatter: (row, _column, _cellValue, _index) => {
      return h(
        'ul',
        // assuming `items` is a ref with array value
        row.transactionDetails.map((item) => {
          return h('li', `${item.productType1Name}/${item.productTypeName}`)
        })
      )
    }
  },
  {
    field: 'warehouse',
    label: t('reuse.warehouse'),
    minWidth: '250',
    formatter: (row, _column, _cellValue, _index) => {
      return h(
        'ul',
        // assuming `items` is a ref with array value
        row.transactionDetails.map((item) => {
          if (row.transactionType == 1) {
            return h('li', item.toWarehouseName)
          }
          if (row.transactionType == 2) {
            return h('li', item.fromWarehouseName)
          }
          if (row.transactionType == 3) {
            return h('li', `${item.fromWarehouseName}->${item.toWarehouseName}`)
          }
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
        row.transactionDetails.map((item) => {
          if (row.transactionType == 1) {
            return h('li', item.toLocationName)
          }
          if (row.transactionType == 2) {
            return h('li', item.fromLocationName)
          }
          if (row.transactionType == 3) {
            return h('li', `${item.fromLocationName}->${item.toLocationName}`)
          }
        })
      )
    }
  },
  {
    field: 'lotCode',
    label: t('reuse.lotCode'),
    minWidth: '100',
    formatter: (row, _column, _cellValue, _index) => {
      return h(
        'ul',
        // assuming `items` is a ref with array value
        row.transactionDetails.map(({ id, lotCode }) => {
          return h('li', { key: id }, lotCode)
        })
      )
    }
  },
  {
    field: 'changeThisToOrderType',
    label: t('reuse.productType'),
    minWidth: '100',
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return orderType(cellValue)
    },
    filters: filterService
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
    field: 'unitName',
    label: t('reuse.dram'),
    minWidth: '100',
    formatter: (row, _column, _cellValue, _index) => {
      return h(
        'ul',
        // assuming `items` is a ref with array value
        row.transactionDetails.map(({ id, unitName }) => {
          return h('li', { key: id }, unitName)
        })
      )
    }
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
    minWidth: '100'
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
