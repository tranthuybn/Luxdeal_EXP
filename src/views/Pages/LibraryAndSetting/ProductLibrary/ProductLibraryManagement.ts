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
    align: 'center',
    sortable: true
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
    minWidth: '250',
    sortable: true
  },
  {
    field: 'description',
    label: t('reuse.description'),
    minWidth: '250',
    sortable: true
  },
  {
    field: 'category',
    label: t('reuse.category'),
    minWidth: '150',
    filters: [
      { text: t('reuse.bag'), value: t('reuse.bag') },
      { text: t('reuse.wallet'), value: t('reuse.wallet') },
      { text: t('reuse.balo'), value: t('reuse.balo') }
    ]
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
    filters: [
      { text: t('reuse.active'), value: t('reuse.active') },
      { text: t('reuse.inactive'), value: t('reuse.inactive') },
      { text: t('reuse.pending'), value: t('reuse.pending') }
    ]
  }
]
