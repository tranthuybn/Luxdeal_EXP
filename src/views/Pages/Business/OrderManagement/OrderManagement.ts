import { useI18n } from '@/hooks/web/useI18n'
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
    field: 'createDate',
    label: t('reuse.createDate'),
    minWidth: '150'
  },
  {
    field: 'orderCode',
    label: t('reuse.customerName') + ' ' + t('reuse.representative'),
    minWidth: '150'
  },
  {
    field: 'creator',
    label: t('reuse.creator'),
    minWidth: '250'
  },
  {
    field: 'customer',
    label: t('reuse.customerName'),
    minWidth: '100'
  },
  {
    field: 'description',
    label: t('reuse.descriptions'),
    minWidth: '200'
  },
  {
    field: 'saleNumber',
    label: t('reuse.saleNumber'),
    minWidth: '200'
  },
  {
    field: 'totalMoney',
    label: t('reuse.totaMoney'),
    minWidth: '150'
  },
  {
    field: 'debitTotal',
    label: t('reuse.debt'),
    minWidth: '100'
  },
  {
    field: 'receiptAndExpenditure',
    label: t('reuse.haveToCollect') + '/' + t('reuse.havetoPay'),
    minWidth: '100'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '100'
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
