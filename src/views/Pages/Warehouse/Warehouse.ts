import {
  filterService,
  filterDeposit,
  filterTransactionType,
  filterLotStatus,
  filterStatusWarehouseTransaction
} from '@/utils/filters'
import { h } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import {
  dateTimeFormat,
  formatTransactionStatus,
  formatTransactionType,
  moneyFormat,
  orderType,
  lotBusinessSetup
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
    align: 'center',
    width: '60'
  },
  {
    field: 'ticketCode',
    label: t('reuse.importTransferWarehouseCode'),
    minWidth: '130'
  },
  {
    field: 'orderCode',
    label: t('reuse.orderCode'),
    minWidth: '130'
  },
  {
    field: 'productCode',
    label: t('reuse.productCode'),
    minWidth: '130'
  },
  {
    field: 'productPropertyCode',
    label: t('reuse.managementCode'),
    minWidth: '130'
  },
  {
    field: 'productPropertyName',
    label: t('reuse.productInformation'),
    minWidth: '200',
    formatter: (row, _column, _cellValue, _index) => {
      return h(
        'ul',
        // assuming `items` is a ref with array value
        [
          h('span', `${row.productName}/`),
          ...row?.productPropertyAttribute.map((item) => {
            if (item.value) {
              return h('span', `${item.value}/`)
            }
          })
        ]
      )
    }
  },
  {
    field: 'accessory',
    label: t('reuse.accessory'),
    minWidth: '150'
  },
  {
    field: 'LotImageUrl',
    label: t('reuse.image'),
    minWidth: '150',
    formatter: (record: Recordable, column: TableColumn, cellValue: TableSlotDefault) =>
      setImageDisplayInDOm(record, column, cellValue, record.name)
  },
  {
    field: 'typeOfTransfer',
    label: t('reuse.category'),
    minWidth: '120',
    headerFilter: 'Search',
    formatter: (row, _column, _cellValue, _index) => {
      return h(
        'span',
        // assuming `items` is a ref with array value
        `${row.categoryParentName || ''}/${row.categoryChildName || ''}`
      )
    }
  },
  {
    field: 'warehouse',
    label: t('router.warehouse'),
    minWidth: '150',
    headerFilter: 'Search',

  },
  {
    field: 'locationWarehouse',
    label: t('reuse.location'),
    minWidth: '150'
  },
  {
    field: 'lotCode',
    label: t('reuse.lotCode'),
    minWidth: '100'
  },
  {
    field: 'orderServiceType',
    label: t('reuse.productType'),
    minWidth: '150',
    filters: filterService,
    formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
     return t(`${orderType(cellValue)}`)
    }
  },
  {
    field: 'totalImport',
    label: t('reuse.amountImportLot'),
    minWidth: '100',
    sortable: true,
    align: 'right'
  },
  {
    field: 'inventory',
    label: t('reuse.quantityInventory'),
    minWidth: '100',
    sortable: true,
    align: 'right'
  },
  {
    field: 'depositQuantity',
    label: t('reuse.depositing'),
    minWidth: '100',
    sortable: true,
    align: 'right'
  },
  {
    field: 'productPropertyAttribute[2].value',
    label: t('reuse.dram'),
    minWidth: '100'
  },
  {
    field: 'importPrice',
    label: t('reuse.priceImport'),
    minWidth: '150',
    sortable: true,
    align: 'right',
    formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
      return moneyFormat(cellValue)
    }
  },
  {
    field: 'totalInventoryMoney',
    label: t('reuse.CashIntoInventory'),
    minWidth: '150',
    sortable: true,
    align: 'right',
    formatter: (_row, _column, cellValue, _index) => {
      return moneyFormat(cellValue)
    }
  },
  {
    field: 'businessManagement',
    label: t('reuse.businessManagement'),
    minWidth: '150',
    filters: filterDeposit,
    formatter: (row, _column, _cellValue, _index) => {
      return row.bussinessSetup?.map((item) => {
        return h('span', t(`${lotBusinessSetup(item)}`))
      }).map(el => el.children).join(', ')
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
    field: 'outOfStock',
    label: t('reuse.status'),
    minWidth: '150',
    filters: filterLotStatus,
    formatter: (row: Recordable, __: TableColumn, _cellValue: boolean) => {
      return h('div', row.inventory > 0 ? t('reuse.stocking') : t('reuse.outOfStock'))
    }
  },
  {
    field: 'operator',
    label: t('reuse.operator'),
    minWidth: '100',
    align: 'center'
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
      return t(`${formatTransactionType(cellValue)}`)
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
        row?.transactionDetails.map(({ id, productPropertyCode }) => {
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
    minWidth: '150',
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
        row.transactionDetails.map(({ productType1Name, productTypeName }) => {
          return h('li', [h('span', productType1Name), h('span', productTypeName)])
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
        [
          row.transactionType == 1
            ? row.toWarehouseName
            : row.transactionType == 2
            ? row.fromWarehouseName
            : `${row.fromWarehouseName}->${row.toWarehouseName}`
        ]
        // assuming `items` is a ref with array value
      )
    }
  },

  {
    field: 'locations',
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
    field: 'lotCode',
    label: t('reuse.lotCode'),
    minWidth: '200',
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
    field: 'serviceType',
    label: t('reuse.productType'),
    minWidth: '100',
    formatter: (row: Recordable, __: TableColumn, _cellValue: boolean) => {
       return t(`${orderType(row?.orderType)}`)
    },
    filters: filterService
  },
  {
    field: 'description',
    label: t('reuse.note'),
    minWidth: '100'
  },
  {
    field: 'quantity',
    label: t('reuse.quantity'),
    minWidth: '100',
    align: 'right',
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
    filters: filterStatusWarehouseTransaction,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return t(`${formatTransactionStatus(cellValue)}`)
    }
  },
  {
    field: 'operator',
    label: t('reuse.operator'),
    minWidth: '100',
    align: 'center',
    formatter: (row: Recordable, __: TableColumn, _cellValue: boolean) => {
      return h('div', [h(ElButton, { icon: eyeIcon, onClick: () => action(row) })])
    }
  }
]
const eyeIcon = useIcon({ icon: 'emojione-monotone:eye-in-speech-bubble' })

const action = (row: any) => {
  const type = row.transactionType
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
