import { useI18n } from '@/hooks/web/useI18n'
import {
  filtersReceiptExpenditure,
  filtersStatus,
  filterRentTerm,
  filterDeposit,
  filterSpaService
} from '@/utils/filters'
const { t } = useI18n()

//Đơn bán hàng
export const sellOrder = [
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'orderCode',
    label: t('reuse.orderCode'),
    minWidth: '150'
  },
  {
    field: 'collaboratorsCode',
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
    field: 'customer',
    label: t('reuse.customerName'),
    minWidth: '170',
    headerFilter: 'Name'
  },
  {
    field: 'companyInfo',
    label: t('reuse.companyInfo'),
    minWidth: '170',
    headerFilter: 'Name'
  },
  {
    field: 'explain',
    label: t('reuse.explain'),
    minWidth: '170'
  },
  {
    field: 'saleNumber',
    label: t('reuse.saleNumber'),
    minWidth: '200',
    align: 'right',
    sortable: true
  },
  {
    field: 'totalMoney',
    label: t('reuse.totaMoney'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'debitTotal',
    label: t('reuse.debt'),
    minWidth: '130',
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
    field: 'createDate',
    label: t('reuse.createDate'),
    minWidth: '150',
    align: 'center',
    sortable: true
  },
  {
    field: 'creator',
    label: t('reuse.creator'),
    minWidth: '150',
    headerFilter: 'Name'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '120',
    filters: filtersStatus
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
    field: 'orderCode',
    label: t('reuse.orderCode'),
    minWidth: '150'
  },
  {
    field: 'collaboratorsCode',
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
    field: 'customer',
    label: t('reuse.customerName'),
    minWidth: '170',
    headerFilter: 'Name'
  },
  {
    field: 'companyInfo',
    label: t('reuse.companyInfo'),
    minWidth: '170',
    headerFilter: 'Name'
  },
  {
    field: 'explain',
    label: t('reuse.explain'),
    minWidth: '170'
  },
  {
    field: 'rentingNumber',
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
    field: 'totalDepositMoney',
    label: t('reuse.totalDepositMoney'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'totalRentFeeByTerm',
    label: t('reuse.totalRentFeeByTerm'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'unpaidDebt',
    label: t('reuse.unpaidDebt'),
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
    field: 'rentTerm',
    label: t('reuse.rentTerm'),
    minWidth: '150',
    filters: filterRentTerm
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
    field: 'creator',
    label: t('reuse.creator'),
    minWidth: '150',
    headerFilter: 'Name'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '120',
    filters: filtersStatus
  }
]
//Đơn hàng ký gửi
export const orderDeposit = [
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'orderCode',
    label: t('reuse.orderCode'),
    minWidth: '150'
  },
  {
    field: 'collaboratorsCode',
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
    field: 'customer',
    label: t('reuse.customerName'),
    minWidth: '170',
    headerFilter: 'Name'
  },
  {
    field: 'companyInfo',
    label: t('reuse.companyInfo'),
    minWidth: '170',
    headerFilter: 'Name'
  },
  {
    field: 'explain',
    label: t('reuse.explain'),
    minWidth: '170'
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
    label: t('reuse.totalDepositRevenue'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'totalNegotiateMoney',
    label: t('reuse.totalNegotiateMoney'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'totalFeeMoney',
    label: t('reuse.totalDepositRevenue'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'unpaidDebt',
    label: t('reuse.unpaidDebt'),
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
    field: 'createDate',
    label: t('reuse.createDate'),
    minWidth: '150',
    align: 'center',
    sortable: true
  },
  {
    field: 'creator',
    label: t('reuse.creator'),
    minWidth: '150',
    headerFilter: 'Name'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '120',
    filters: filterDeposit
  }
]
//Đơn hàng cầm đồ
export const orderPawn = [
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'orderCode',
    label: t('reuse.orderCode'),
    minWidth: '150'
  },
  {
    field: 'collaboratorsCode',
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
    field: 'customer',
    label: t('reuse.customerName'),
    minWidth: '170',
    headerFilter: 'Name'
  },
  {
    field: 'companyInfo',
    label: t('reuse.companyInfo'),
    minWidth: '170',
    headerFilter: 'Name'
  },
  {
    field: 'explain',
    label: t('reuse.explain'),
    minWidth: '170'
  },
  {
    field: 'pawnNumber',
    label: t('reuse.pawnNumber'),
    minWidth: '200',
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
    field: 'redeemNumber',
    label: t('reuse.redeemNumber'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'transferToWarehouseNumber',
    label: t('reuse.transferToWarehouseNumber'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'totalPawnMoney',
    label: t('reuse.totalPawnMoney'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'totalDepositRevenue',
    label: t('reuse.totalDepositRevenue'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'totalNegotiateMoney',
    label: t('reuse.totalNegotiateMoney'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'totalFeeMoney',
    label: t('reuse.totalFeeMoney'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'unpaidDebt',
    label: t('reuse.unpaidDebt'),
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
    field: 'createDate',
    label: t('reuse.createDate'),
    minWidth: '150',
    align: 'center',
    sortable: true
  },
  {
    field: 'creator',
    label: t('reuse.creator'),
    minWidth: '150',
    headerFilter: 'Name'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '120',
    filters: filterDeposit
  }
]
//Đơn hàng ký gửi
export const orderSpa = [
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'orderCode',
    label: t('reuse.orderCode'),
    minWidth: '150'
  },
  {
    field: 'collaboratorsCode',
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
    field: 'customer',
    label: t('reuse.customerName'),
    minWidth: '170',
    headerFilter: 'Name'
  },
  {
    field: 'companyInfo',
    label: t('reuse.companyInfo'),
    minWidth: '170',
    headerFilter: 'Name'
  },
  {
    field: 'explain',
    label: t('reuse.explain'),
    minWidth: '170'
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
    label: t('reuse.spaTimes'),
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
    field: 'totalSpaFeeMoney',
    label: t('reuse.totalSpaFeeMoney'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'unpaidDebt',
    label: t('reuse.unpaidDebt'),
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
    field: 'spaDeadline',
    label: t('reuse.spaDeadline'),
    minWidth: '150',
    align: 'center',
    sortable: true
  },
  {
    field: 'createDate',
    label: t('reuse.createDate'),
    minWidth: '150',
    align: 'center',
    sortable: true
  },
  {
    field: 'creator',
    label: t('reuse.creator'),
    minWidth: '150',
    headerFilter: 'Name'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '120',
    filters: filterDeposit
  }
]
