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
    field: 'createDate',
    label: t('reuse.createDate'),
    minWidth: '150',
    align: 'center',
    headerFilter: 'Date'
  },
  {
    field: 'productCode',
    label: t('reuse.productCode'),
    minWidth: '150',
    headerFilter: 'Money'
  },
  {
    field: 'productName',
    label: t('reuse.productName'),
    minWidth: '250',
    headerFilter: 'Number'
  },
  {
    field: 'description',
    label: t('reuse.description'),
    minWidth: '250'
  },
  {
    field: 'category',
    label: t('reuse.category'),
    minWidth: '150',
    filters: filterTableCategory
  },
  {
    field: 'image',
    label: t('reuse.image'),
    minWidth: '150'
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
