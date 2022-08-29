import { useI18n } from '@/hooks/web/useI18n'
import { filterTableStatus } from '@/utils/filters'
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
    field: 'serviceCode',
    label: t('reuse.serviceCode'),
    minWidth: '150'
  },
  {
    field: 'serviceName',
    label: t('reuse.serviceName'),
    minWidth: '250'
  },
  {
    field: 'description',
    label: t('reuse.description'),
    minWidth: '250'
  },
  {
    field: 'unitPrice',
    label: t('reuse.unitPrice'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'time',
    label: t('reuse.timeMinute'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'insurance',
    label: t('reuse.insuranceDate'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'image',
    label: t('reuse.image'),
    minWidth: '150',
    align: 'center'
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
    minWidth: '150',
    filters: filterTableStatus
  }
]
