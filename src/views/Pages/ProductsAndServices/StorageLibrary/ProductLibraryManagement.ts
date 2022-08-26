import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
export const businessProductLibrary = [
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
    align: 'center'
  },
  {
    field: 'productCode',
    label: t('reuse.productCode'),
    minWidth: '150'
  },
  {
    field: 'productName',
    label: t('reuse.productName'),
    minWidth: '250'
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
    sortable: true
  },
  {
    field: 'image',
    label: t('reuse.image'),
    minWidth: '150',
    align: 'center'
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
    sortable: true
  }
]
