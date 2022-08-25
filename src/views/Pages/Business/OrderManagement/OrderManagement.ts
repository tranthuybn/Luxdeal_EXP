import { useI18n } from '@/hooks/web/useI18n'
import { filtersReceiptExpenditure, filtersStatus } from '@/utils/filters'
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
    minWidth: '150',
    sortable: true
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
    sortable: true
  },
  {
    field: 'companyInfo',
    label: t('reuse.companyInfo'),
    minWidth: '170',
    sortable: true
  },
  {
    field: 'explain',
    label: t('reuse.explain'),
    minWidth: '170',
    sortable: true
  },
  {
    field: 'saleNumber',
    label: t('reuse.saleNumber'),
    minWidth: '200',
    sortable: true
  },
  {
    field: 'totalMoney',
    label: t('reuse.totaMoney'),
    minWidth: '150',
    sortable: true
  },
  {
    field: 'debitTotal',
    label: t('reuse.debt'),
    minWidth: '130',
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
    sortable: true
  },
  {
    field: 'creator',
    label: t('reuse.creator'),
    minWidth: '150',
    sortable: true
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
    field: 'createDate',
    label: t('reuse.createDate'),
    minWidth: '150'
  },
  {
    field: 'orderCode',
    label: t('reuse.orderCode'),
    minWidth: '150'
  },
  {
    field: 'creator',
    label: t('reuse.creator'),
    minWidth: '250'
  },
  {
    field: 'customer',
    label: t('reuse.customer'),
    minWidth: '100'
  },
  {
    field: 'explain',
    label: t('reuse.explain'),
    minWidth: '200'
  },
  {
    field: 'rentalQuantity',
    label: t('reuse.rentalQuantity'),
    minWidth: '200'
  },
  {
    field: 'returned',
    label: t('reuse.returned'),
    minWidth: '150'
  },
  {
    field: 'totalRentalDeposit',
    label: t('reuse.totalRentalDeposit'),
    minWidth: '100'
  },
  {
    field: 'totalTermRentalFee',
    label: t('reuse.totalTermRentalFee'),
    minWidth: '100'
  },
  {
    field: 'outstandingDebt',
    label: t('reuse.outstandingDebt'),
    minWidth: '100'
  },
  {
    field: 'receiptAndExpenditure',
    label: t('reuse.haveToCollect') + '/' + t('reuse.havetoPay'),
    minWidth: '100'
  },
  {
    field: 'rentalTerm',
    label: t('reuse.rentalTerm'),
    minWidth: '100'
  },
  {
    field: 'startDate',
    label: t('reuse.startDate'),
    minWidth: '100'
  },
  {
    field: 'startDate',
    label: t('reuse.startDate'),
    minWidth: '100'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '100'
  }
]
