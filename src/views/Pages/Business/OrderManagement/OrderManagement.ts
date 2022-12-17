import { useI18n } from '@/hooks/web/useI18n'
import {
  filtersReceiptExpenditure,
  filtersStatus,
  filterRentTerm,
  filterDeposit,
  filterSpaService,
  filtersCustomerType
} from '@/utils/filters'
import { h } from 'vue'
import { dateTimeFormat } from '@/utils/format'
const { t } = useI18n()

const changeMoney = new Intl.NumberFormat('vi', {
  style: 'currency',
  currency: 'vnd',
  minimumFractionDigits: 0
})

//Đơn bán hàng
export const sellOrder = [
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'code',
    label: t('reuse.orderCode'),
    minWidth: '150'
  },
  {
    field: 'collaboratorId',
    label: t('reuse.collaboratorsCode'),
    minWidth: '150',
    sortable: true
  },
  {
    field: 'promotionCode',
    label: t('reuse.promotionCode'),
    minWidth: '150',
    sortable: true
  },
  {
    field: 'userName',
    label: t('reuse.customerName'),
    minWidth: '170',
    filters: filtersCustomerType
  },
  {
    field: 'description',
    label: t('reuse.explain'),
    minWidth: '170'
  },
  {
    field: 'productManagementCode',
    label: t('formDemo.productManagementCode'),
    minWidth: '170',
    headerFilter: 'Name',
    formatter: (row, _column, _cellValue, _index) => {
      return h(
        'ul',
        row.orderDetails.map(({ id, productCode }) => {
          return h('li', { key: id }, productCode)
        })
      )
    }
  },
  {
    field: 'productInformation',
    label: t('formDemo.productInformation'),
    minWidth: '300',
    headerFilter: 'Name',
    formatter: (row, _column, _cellValue, _index) => {
      return h(
        'ul',
        row.orderDetails.map(({ id, productName, productPropertyName }) => {
          return h('li', { key: id }, `${productName}${productPropertyName}`)
        })
      )
    }
  },
  {
    field: 'totalQuantity',
    label: t('reuse.saleNumber'),
    minWidth: '200',
    align: 'right',
    sortable: true
  },
  {
    field: 'totalPrice',
    label: t('reuse.totaMoney'),
    minWidth: '150',
    align: 'right',
    sortable: true,
    formatter: (row, _column, _cellValue) => {
      const x = changeMoney.format(parseInt(row.totalPrice))
      return x
    }
  },
  {
    field: 'totalDebt',
    label: t('formDemo.totalSalesDebt'),
    minWidth: '130',
    align: 'right',
    sortable: true,
    formatter: (row, _column, _cellValue) => {
      const x = changeMoney.format(parseInt(row.totalDebt))
      return x
    }
  },
  {
    field: 'receiptAndExpenditure',
    label: t('reuse.haveToCollect') + '/' + t('reuse.havetoPay'),
    minWidth: '170',
    filters: filtersReceiptExpenditure
  },
  {
    field: 'createdAt',
    label: t('reuse.createDate'),
    minWidth: '150',
    align: 'center',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'createdBy',
    label: t('reuse.creator'),
    minWidth: '150',
    headerFilter: 'Name'
  },
  {
    field: 'isActive',
    label: t('reuse.status'),
    minWidth: '120',
    filters: filtersStatus,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return h('div', cellValue ? 'Đang hoạt động' : 'Ngưng hoạt động')
    }
  }
]
//Đơn hàng cho thuê
export const rentalorder = [
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'code',
    label: t('reuse.orderCode'),
    minWidth: '150'
  },
  {
    field: 'collaboratorId',
    label: t('reuse.collaboratorsCode'),
    minWidth: '150',
    sortable: true
  },
  {
    field: 'promotionCode',
    label: t('reuse.promotionCode'),
    minWidth: '150',
    sortable: true
  },
  {
    field: 'userName',
    label: t('reuse.customerName'),
    minWidth: '170',
    filters: filtersCustomerType
  },
  {
    field: 'description',
    label: t('reuse.explain'),
    minWidth: '170'
  },
  {
    field: 'productManagementCode',
    label: t('formDemo.productManagementCode'),
    minWidth: '170',
    headerFilter: 'Name',
    formatter: (row, _column, _cellValue, _index) => {
      return h(
        'ul',
        row.orderDetails.map(({ id, productCode }) => {
          return h('li', { key: id }, productCode)
        })
      )
    }
  },
  {
    field: 'productInformation',
    label: t('formDemo.productInformation'),
    minWidth: '300',
    headerFilter: 'Name',
    formatter: (row, _column, _cellValue, _index) => {
      return h(
        'ul',
        row.orderDetails.map(({ id, productName, productPropertyName }) => {
          return h('li', { key: id }, `${productName}${productPropertyName}`)
        })
      )
    }
  },
  {
    field: 'totalQuantity',
    label: t('reuse.rentingNumber'),
    minWidth: '200',
    align: 'right',
    sortable: true
  },
  {
    field: 'returnedNumber',
    label: t('reuse.returnedNumber'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'totalPrice',
    label: t('reuse.totalDepositMoney'),
    minWidth: '150',
    align: 'right',
    sortable: true,
    formatter: (row, _column, _cellValue) => {
      const total = row.orderDetails.reduce((sum, val) => {
        sum += val.depositePrice
        return sum
      }, 0)
      const x = changeMoney.format(parseInt(total))
      return x
    }
  },
  {
    field: 'totalRentFeeByTerm',
    label: t('reuse.totalRentFeeByTerm'),
    minWidth: '150',
    align: 'right',
    sortable: true,
    formatter: (row, _column, _cellValue) => {
      const total = row.orderDetails.reduce((sum, val) => {
        sum += val.hirePrice
        return sum
      }, 0)
      const x = changeMoney.format(parseInt(total))
      return x
    }
  },

  {
    field: 'totalDebt',
    label: t('reuse.totalRentalFeeDebt'),

    minWidth: '150',
    align: 'right',
    sortable: true,
    formatter: (row, _column, _cellValue) => {
      const x = changeMoney.format(parseInt(row.totalDebt))
      return x
    }
  },
  {
    field: 'receiptAndExpenditure',
    label: t('reuse.haveToCollect') + '/' + t('reuse.havetoPay'),
    minWidth: '170',
    filters: filtersReceiptExpenditure
  },
  {
    field: 'hirePeriodName',
    label: t('reuse.rentTerm'),
    minWidth: '150',
    filters: filterRentTerm
  },
  {
    field: 'fromDate',
    label: t('reuse.startDate'),
    minWidth: '150',
    align: 'center',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, _cellValue: boolean) => {
      return dateTimeFormat(_.fromDate)
    }
  },
  {
    field: 'toDate',
    label: t('reuse.endDate'),
    minWidth: '150',
    align: 'center',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, _cellValue: boolean) => {
      return dateTimeFormat(_.toDate)
    }
  },
  {
    field: 'createdAt',
    label: t('reuse.createDate'),
    minWidth: '150',
    align: 'center',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'createdBy',
    label: t('reuse.creator'),
    minWidth: '150',
    headerFilter: 'Name'
  },
  {
    field: 'isActive',
    label: t('reuse.status'),
    minWidth: '120',
    filters: filtersStatus,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return h('div', cellValue ? 'Đang hoạt động' : 'Ngưng hoạt động')
    }
  }
]
//Đơn hàng ký gửi
export const depositOrder = [
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'code',
    label: t('reuse.orderCode'),
    minWidth: '150'
  },
  {
    field: 'collaboratorId',
    label: t('reuse.collaboratorsCode'),
    minWidth: '150',
    sortable: true
  },
  {
    field: 'promotionCode',
    label: t('reuse.promotionCode'),
    minWidth: '150',
    sortable: true
  },
  {
    field: 'userName',
    label: t('reuse.customerName'),
    minWidth: '170',
    filters: filtersCustomerType
  },
  {
    field: 'description',
    label: t('reuse.explain'),
    minWidth: '170'
  },
  {
    field: 'productManagementCode',
    label: t('formDemo.productManagementCode'),
    minWidth: '170',
    headerFilter: 'Name',
    formatter: (row, _column, _cellValue, _index) => {
      return h(
        'ul',
        row.orderDetails.map(({ id, productCode }) => {
          return h('li', { key: id }, productCode)
        })
      )
    }
  },
  {
    field: 'productInformation',
    label: t('formDemo.productInformation'),
    minWidth: '300',
    headerFilter: 'Name',
    formatter: (row, _column, _cellValue, _index) => {
      return h(
        'ul',
        row.orderDetails.map(({ id, productName, productPropertyName }) => {
          return h('li', { key: id }, `${productName}${productPropertyName}`)
        })
      )
    }
  },
  {
    field: 'depositNumber',
    label: t('reuse.depositNumber'),
    minWidth: '200',
    align: 'right',
    sortable: true
  },
  {
    field: 'soldNumber',
    label: t('reuse.soldNumber'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'rentedTimes',
    label: t('reuse.rentedTimes'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'spaTimes',
    label: t('reuse.spaTimes'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'rentingNumber',
    label: t('reuse.rentingNumber'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'returnedNumber',
    label: t('reuse.returnedNumber'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'totalDepositRevenue',
    label: t('reuse.totalAmountOfNetSales'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'totalNegotiateMoney',
    label: t('reuse.totalAmountNegotiationDeposit'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'totalFeeMoney',
    label: t('reuse.totalDepositDebt'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'receiptAndExpenditure',
    label: t('reuse.haveToCollect') + '/' + t('reuse.havetoPay'),
    minWidth: '170',
    filters: filtersReceiptExpenditure
  },
  {
    field: 'depositManagement',
    label: t('reuse.depositManagement'),
    minWidth: '150',
    filters: filterDeposit
  },
  {
    field: 'startDate',
    label: t('reuse.startDate'),
    minWidth: '150',
    align: 'center',
    sortable: true
  },
  {
    field: 'endDate',
    label: t('reuse.endDate'),
    minWidth: '150',
    align: 'center',
    sortable: true
  },
  {
    field: 'createdAt',
    label: t('reuse.createDate'),
    minWidth: '150',
    align: 'center',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'createdBy',
    label: t('reuse.creator'),
    minWidth: '150',
    headerFilter: 'Name'
  },
  {
    field: 'isActive',
    label: t('reuse.status'),
    minWidth: '120',
    filters: filtersStatus,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return h('div', cellValue ? 'Đang hoạt động' : 'Ngưng hoạt động')
    }
  }
]
//Đơn hàng cầm đồ
export const pawnOrder = [
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'code',
    label: t('reuse.orderCode'),
    minWidth: '150'
  },
  {
    field: 'collaboratorId',
    label: t('reuse.collaboratorsCode'),
    minWidth: '150'
  },
  {
    field: 'promotionCode',
    label: t('reuse.promotionCode'),
    minWidth: '150'
  },
  {
    field: 'userName',
    label: t('reuse.customerName'),
    minWidth: '170',
    filters: filtersCustomerType
  },
  {
    field: 'description',
    label: t('reuse.explain'),
    minWidth: '170'
  },

  {
    field: 'depositedRentTimes',
    label: t('reuse.depositedRentTimes'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'spaTimes',
    label: t('reuse.spaTimes'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'depositingRentNumber',
    label: t('reuse.depositingRentNumber'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'quantityHasBroken',
    label: t('reuse.quantityHasBroken'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'redeemNumber',
    label: t('reuse.redeemNumber'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },

  {
    field: 'totalPawnMoney',
    label: t('reuse.totalPrincipalBalance'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'totalPawnFee',
    label: t('reuse.totalPawnFee'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'totalPawnFee',
    label: t('reuse.totalPawnDebt'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'receiptAndExpenditure',
    label: t('reuse.haveToCollect') + '/' + t('reuse.havetoPay'),
    minWidth: '170',
    filters: filtersReceiptExpenditure
  },
  {
    field: 'depositManagement',
    label: t('reuse.depositManagement'),
    minWidth: '150',
    filters: filterDeposit
  },
  {
    field: 'startDate',
    label: t('reuse.startDate'),
    minWidth: '150',
    align: 'center',
    sortable: true
  },
  {
    field: 'endDate',
    label: t('reuse.endDate'),
    minWidth: '150',
    align: 'center',
    sortable: true
  },
  {
    field: 'createdAt',
    label: t('reuse.createDate'),
    minWidth: '150',
    align: 'center',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'createdBy',
    label: t('reuse.creator'),
    minWidth: '150',
    headerFilter: 'Name'
  },

  {
    field: 'isActive',
    label: t('reuse.status'),
    minWidth: '120',
    filters: filtersStatus,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return h('div', cellValue ? 'Đang hoạt động' : 'Ngưng hoạt động')
    }
  }
]
//Đơn hàng SPA
export const spaOrder = [
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'code',
    label: t('reuse.orderCode'),
    minWidth: '150'
  },
  {
    field: 'typeSpa',
    label: t('reuse.type'),
    minWidth: '150'
  },
  {
    field: 'collaboratorId',
    label: t('reuse.collaboratorsCode'),
    minWidth: '150',
    sortable: true
  },
  {
    field: 'promotionCode',
    label: t('reuse.promotionCode'),
    minWidth: '150',
    sortable: true
  },
  {
    field: 'userName',
    label: t('reuse.customerName'),
    minWidth: '170',
    filters: filtersCustomerType
  },
  {
    field: 'description',
    label: t('reuse.explain'),
    minWidth: '170'
  },
  {
    field: 'productManagementCode',
    label: t('formDemo.productManagementCode'),
    minWidth: '170',
    headerFilter: 'Name',
    formatter: (row, _column, _cellValue, _index) => {
      return h(
        'ul',
        row.orderDetails.map(({ id, productCode }) => {
          return h('li', { key: id }, productCode)
        })
      )
    }
  },
  {
    field: 'productInformation',
    label: t('formDemo.productInformation'),
    minWidth: '300',
    headerFilter: 'Name',
    formatter: (row, _column, _cellValue, _index) => {
      return h(
        'ul',
        row.orderDetails.map(({ id, productName, productPropertyName }) => {
          return h('li', { key: id }, `${productName}${productPropertyName}`)
        })
      )
    }
  },
  {
    field: 'spaService',
    label: t('reuse.spaService'),
    minWidth: '170',
    filters: filterSpaService
  },
  {
    field: 'spaNumberInput',
    label: t('reuse.spaNumberInput'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'spaTimes',
    label: t('reuse.spaTimesDone'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'returnedNumber',
    label: t('reuse.returnedNumber'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'totalPrice',
    label: t('reuse.totalSpaFeeMoney'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'totalDebt',
    label: t('reuse.totalSpaFeeDebt'),
    minWidth: '130',
    align: 'right',
    sortable: true,
    formatter: (row, _column, _cellValue) => {
      const x = changeMoney.format(parseInt(row.totalDebt))
      return x
    }
  },
  {
    field: 'receiptAndExpenditure',
    label: t('reuse.haveToCollect') + '/' + t('reuse.havetoPay'),
    minWidth: '170',
    filters: filtersReceiptExpenditure
  },
  {
    field: 'spaDeadline',
    label: t('reuse.spaDeadline'),
    minWidth: '150',
    align: 'center',
    sortable: true
  },
  {
    field: 'createdAt',
    label: t('reuse.createDate'),
    minWidth: '150',
    align: 'center',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'createdBy',
    label: t('reuse.creator'),
    minWidth: '150',
    headerFilter: 'Name'
  },

  {
    field: 'isActive',
    label: t('reuse.status'),
    minWidth: '120',
    filters: filtersStatus,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return h('div', cellValue ? 'Đang hoạt động' : 'Ngưng hoạt động')
    }
  }
]
