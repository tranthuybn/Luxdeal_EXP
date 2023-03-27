import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
import { filterStatusOrder } from '@/utils/filters'
import { dateTimeFormat, statusOrder } from '@/utils/format'

const changeMoney = new Intl.NumberFormat('vi', {
  style: 'currency',
  currency: 'vnd',
  minimumFractionDigits: 0
})

export const PurchaseOrderColumn = [
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center',
    sortable: true
  },
  {
    field: 'code',
    label: t('reuse.orderCode'),
    minWidth: '200'
  },
  {
    field: 'collaboratorCode',
    label: t('reuse.saleCode'),
    minWidth: '200',
    sortable: true
  },
  {
    field: 'userName',
    label: t('reuse.saleName'),
    minWidth: '200',
    headerFilter: 'Name'
  },
  {
    field: 'description',
    label: t('reuse.explain'),
    minWidth: '200'
  },
  {
    field: 'totalQuantity',
    label: t('reuse.numberInput'),
    minWidth: '200',
    align: 'left',
    sortable: true
  },
  {
    field: 'totalPrice',
    label: t('reuse.totalMoneyInput'),
    minWidth: '200',
    align: 'right',
    sortable: true,
    formatter: (row, _column, _cellValue) => {
      const x = changeMoney.format(parseInt(row.totalPrice))
      return x
    }
  },
  {
    field: 'totalDebt',
    label: t('reuse.unpaidDebt'),
    minWidth: '200',
    align: 'right',
    sortable: true,
    formatter: (row, _column, _cellValue) => {
      const x = changeMoney.format(parseInt(row.totalDebt))
      return x
    }
  },
  {
    field: 'receiptAndExpenditure',
    label: t('reuse.revenueAndExpenditure'),
    minWidth: '200',
    align: 'left',
    formatter: (row) => {
      if (row.totalDebt < 0) return t('reuse.haveToCollect')
      else return t('reuse.havetoPay')
    }
  },
  {
    field: 'createdAt',
    label: t('reuse.createDate'),
    minWidth: '150',
    align: 'left',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'createdBy',
    label: t('reuse.creator'),
    minWidth: '150',
    align: 'left',
    headerFilter: 'Name'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '150',
    align: 'left',
    filters: filterStatusOrder,
    formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
      return `${t(statusOrder(cellValue))}`
    }
  }
]
