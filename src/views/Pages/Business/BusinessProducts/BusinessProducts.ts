import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
//Đơn bán hàng
export const productsList = [
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'productCode',
    label: t('reuse.productCode'),
    minWidth: '150',
    sortable: true
  },
  {
    field: 'productName',
    label: t('reuse.productName'),
    minWidth: '150',
    sortable: true
  },
  {
    field: 'description',
    label: t('reuse.description'),
    minWidth: '150',
    sortable: true
  },
  {
    field: 'category',
    label: t('reuse.category'),
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
    minWidth: '170'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '120'
  }
]
