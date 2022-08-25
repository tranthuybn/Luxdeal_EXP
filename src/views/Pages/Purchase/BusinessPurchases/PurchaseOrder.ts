import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
import { filterTableStatus, filterTableCategory } from '@/utils/filters'
export const PurchaseOrderColumn = [
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center',
    sortable: true
  },
  {
    field: 'productCode',
    label: t('reuse.productCode'),
    minWidth: '200'
  },
  {
    field: 'saleCode',
    label: t('reuse.saleCode'),
    minWidth: '200',
    sortable: true
  },
  {
    field: 'saleName',
    label: t('reuse.saleName'),
    minWidth: '200',
    headerFilter: 'Name'
  },
  {
    field: 'companyName',
    label: t('reuse.companyName'),
    minWidth: '200',
    headerFilter: 'Name'
  },
  {
    field: 'description',
    label: t('reuse.description'),
    minWidth: '200'
  },
  {
    field: 'numberInput',
    label: t('reuse.numberInput'),
    minWidth: '200',
    sortable: true
  },
  {
    field: 'totalMoneyInput',
    label: t('reuse.totalMoneyInput'),
    minWidth: '200',
    sortable: true
  },
  {
    field: 'unpaidDebt',
    label: t('reuse.unpaidDebt'),
    minWidth: '200',
    sortable: true
  },
  {
    field: 'revenueAndExpenditure',
    label: t('reuse.revenueAndExpenditure'),
    minWidth: '200',
    sortable: true
  },
  {
    field: 'createDate',
    label: t('reuse.createDate'),
    minWidth: '150',
    align: 'center',
    headerFilter: 'Date'
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
    minWidth: '150',
    filters: filterTableStatus
  }
]
