import { useI18n } from '@/hooks/web/useI18n'
import {
  filtersReceiptExpenditure,
  filterRentTerm,
  filterDeposit,
  filterSpaService,
  filtersCustomerType,
  filtersStatusOrder
} from '@/utils/filters'
import { h } from 'vue'
import { dateTimeFormat, moneyFormat } from '@/utils/format'
import { useIcon } from '@/hooks/web/useIcon'
import { ElButton } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import router from '@/router'
import { API_ORDER } from '@/utils/API.Variables'
import { changeMoney } from '@/utils/tsxHelper'
const { t } = useI18n()

const eyeIcon = useIcon({ icon: 'emojione-monotone:eye-in-speech-bubble' })
const editIcon = useIcon({ icon: 'akar-icons:chat-edit' })
const appStore = useAppStore()
const utility = appStore.getUtility
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
    field: 'collaboratorCode',
    label: t('reuse.collaboratorsCode'),
    minWidth: '150',
    sortable: true
  },
  {
    field: 'promotionCode',
    label: t('reuse.promotionCode'),
    minWidth: '170',
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
    minWidth: '190',
    headerFilter: 'Name',
    align: 'center',
    formatter: (row, _column, _cellValue, _index) => {
      return h(
        'ul',
        row.orderDetails.map(({ id, productPropertyCode }) => {
          return h('li', { key: id }, productPropertyCode)
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
    field: 'OrderStatusFilter',
    label: t('reuse.status'),
    minWidth: '120',
    filters: filtersStatusOrder,
    formatter: (row: Recordable, __: TableColumn, _cellValue: boolean) => {
      return row.statusName
    }
  },
  {
    field: 'operator',
    label: t('reuse.operator'),
    minWidth: '200',
    formatter: (row: Recordable, __: TableColumn, _cellValue: boolean) => {
      return h('div', { style: 'display:flex;justify-content: center;' }, [
        h(ElButton, { icon: eyeIcon, onClick: () => action(row, 'detail', 'orderSell') }),
        h(ElButton, { icon: editIcon, onClick: () => action(row, 'edit', 'orderSell') })
      ])
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
    minWidth: '190'
  },
  {
    field: 'collaboratorCode',
    label: t('reuse.collaboratorsCode'),
    minWidth: '150',
    sortable: true
  },
  {
    field: 'promotionCode',
    label: t('reuse.promotionCode'),
    minWidth: '190',
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
    minWidth: '190',
    headerFilter: 'Name',
    formatter: (row, _column, _cellValue, _index) => {
      return h(
        'ul',
        row.orderDetails.map(({ id, productPropertyCode }) => {
          return h('li', { key: id }, productPropertyCode)
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
    minWidth: '230',
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
    minWidth: '190',
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
    field: 'OrderStatusFilter',
    label: t('reuse.status'),
    minWidth: '120',
    filters: filtersStatusOrder,
    formatter: (row: Recordable, __: TableColumn, _cellValue: boolean) => {
      return row.statusName
    }
  },
  {
    field: 'operator',
    label: t('reuse.operator'),
    minWidth: '200',
    formatter: (row: Recordable, __: TableColumn, _cellValue: boolean) => {
      return h('div', { style: 'display:flex;justify-content: center;' }, [
        h(ElButton, { icon: eyeIcon, onClick: () => action(row, 'detail', 'orderRental') }),
        h(ElButton, { icon: editIcon, onClick: () => action(row, 'edit', 'orderRental') })
      ])
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
    field: 'collaboratorCode',
    label: t('reuse.collaboratorsCode'),
    minWidth: '150',
    sortable: true
  },
  {
    field: 'promotionCode',
    label: t('reuse.promotionCode'),
    minWidth: '170',
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
    minWidth: '190',
    headerFilter: 'Name',
    formatter: (row, _column, _cellValue, _index) => {
      return h(
        'ul',
        row.orderDetails.map(({ id, productPropertyCode }) => {
          return h('li', { key: id }, productPropertyCode)
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
    field: 'orderStat.kyGui',
    label: t('reuse.depositNumber'),
    minWidth: '200',
    align: 'right',
    sortable: true
  },
  {
    field: 'orderStat.ban',
    label: t('reuse.soldNumber'),
    minWidth: '170',
    align: 'right',
    sortable: true
  },
  {
    field: 'orderStat.choThue',
    label: t('reuse.rentedTimes'),
    minWidth: '180',
    align: 'right',
    sortable: true
  },
  {
    field: 'orderStat.spa',
    label: t('reuse.spaTimesDone'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'orderStat.dangThue',
    label: t('reuse.rentingNumber'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'orderStat.traLai',
    label: t('reuse.returnedNumber'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'orderMoneyStat',
    label: t('reuse.totalAmountOfNetSales'),
    minWidth: '150',
    align: 'right',
    sortable: true,
    formatter: (row: Recordable, __: TableColumn, _cellValue: boolean) => {
      return h('div', moneyFormat(row.orderMoneyStat.tongTienBan + row.orderMoneyStat.tongPhiThue))
    }
  },
  {
    field: 'orderMoneyStat.tongDamPhan',
    label: t('reuse.totalAmountNegotiationDeposit'),
    minWidth: '150',
    align: 'right',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return h('div', moneyFormat(cellValue))
    }
  },
  {
    field: 'orderMoneyStat.tongCongNo',
    label: t('reuse.totalDepositDebt'),
    minWidth: '150',
    align: 'right',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return h('div', moneyFormat(cellValue))
    }
  },
  {
    field: 'orderDetails[0]?.businessSetupName',
    label: t('reuse.depositManagement'),
    minWidth: '150',
    filters: filterDeposit
  },
  {
    field: 'fromDate',
    label: t('reuse.startDate'),
    minWidth: '150',
    align: 'center',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'toDate',
    label: t('reuse.endDate'),
    minWidth: '150',
    align: 'center',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
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
    field: 'OrderStatusFilter',
    label: t('reuse.status'),
    minWidth: '120',
    filters: filtersStatusOrder,
    formatter: (row: Recordable, __: TableColumn, _cellValue: boolean) => {
      return row.statusName
    }
  },
  {
    field: 'operator',
    label: t('reuse.operator'),
    minWidth: '200',
    formatter: (row: Recordable, __: TableColumn, _cellValue: boolean) => {
      return h('div', { style: 'display:flex;justify-content: center;' }, [
        h(ElButton, { icon: eyeIcon, onClick: () => action(row, 'detail', 'orderDeposit') }),
        h(ElButton, { icon: editIcon, onClick: () => action(row, 'edit', 'orderDeposit') })
      ])
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
    field: 'collaboratorCode',
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
    field: 'productManagementCode',
    label: t('formDemo.productManagementCode'),
    minWidth: '190',
    headerFilter: 'Name',
    align: 'center',
    formatter: (row, _column, _cellValue, _index) => {
      return h(
        'ul',
        row.orderDetails.map(({ id, productPropertyCode }) => {
          return h('li', { key: id }, productPropertyCode)
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
    field: 'pawnNumber',
    label: t('reuse.pawnNumber'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'depositedSoldNumber',
    label: t('reuse.depositedSoldNumber'),
    minWidth: '150',
    align: 'right',
    sortable: true
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
    label: t('reuse.spaTimesDone'),
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
    field: 'OrderStatusFilter',
    label: t('reuse.status'),
    minWidth: '120',
    filters: filtersStatusOrder,
    formatter: (row: Recordable, __: TableColumn, _cellValue: boolean) => {
      return row.statusName
    }
  },
  {
    field: 'operator',
    label: t('reuse.operator'),
    minWidth: '200',
    formatter: (row: Recordable, __: TableColumn, _cellValue: boolean) => {
      return h('div', { style: 'display:flex;justify-content: center;' }, [
        h(ElButton, { icon: eyeIcon, onClick: () => action(row, 'detail', 'orderPawn') }),
        h(ElButton, { icon: editIcon, onClick: () => action(row, 'edit', 'orderPawn') })
      ])
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
    field: 'collaboratorCode',
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
    minWidth: '190',
    headerFilter: 'Name',
    formatter: (row, _column, _cellValue, _index) => {
      return h(
        'ul',
        row.orderDetails.map(({ id, productPropertyCode }) => {
          return h('li', { key: id }, productPropertyCode)
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
    minWidth: '180',
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
    field: 'OrderStatusFilter',
    label: t('reuse.status'),
    minWidth: '120',
    filters: filtersStatusOrder,
    formatter: (row: Recordable, __: TableColumn, _cellValue: boolean) => {
      return row.statusName
    }
  },
  {
    field: 'operator',
    label: t('reuse.operator'),
    minWidth: '200',
    formatter: (row: Recordable, __: TableColumn, _cellValue: boolean) => {
      return h('div', { style: 'display:flex;justify-content: center;' }, [
        h(ElButton, { icon: eyeIcon, onClick: () => action(row, 'detail', 'orderSpa') }),
        h(ElButton, { icon: editIcon, onClick: () => action(row, 'edit', 'orderSpa') })
      ])
    }
  }
]
const action = (row: any, type: string, _tab: string) => {
  const curTab: any = API_ORDER.find((el) => el.key == row.serviceType)
  router.push({
    name: `business.order-management.order-list.${utility}`,
    params: {
      backRoute: 'business.order-management.order-list',
      tab: curTab.label,
      id: row.id,
      type: type
    }
  })
}
