import { useI18n } from '@/hooks/web/useI18n'
import { filterTableStatus } from '@/utils/filters'
import { productStatusTransferToText, dateTimeFormat } from '@/utils/format'
import { h } from 'vue'
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
    field: 'code',
    label: t('reuse.serviceCode'),
    minWidth: '150'
  },
  {
    field: 'name',
    label: t('reuse.serviceName'),
    minWidth: '250'
  },
  {
    field: 'description',
    label: t('reuse.description'),
    minWidth: '250',
    formatter: (_: Recordable, __: TableColumn, cellValue: any) => {
      return h('span', { innerHTML: cellValue })
    }
  },
  {
    field: 'cost',
    label: t('reuse.unitPrice'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'time',
    label: t('reuse.timeMinute'),
    minWidth: '150',
    align: 'center',
    sortable: true
  },
  {
    field: 'warranty',
    label: t('reuse.insuranceDate'),
    minWidth: '150',
    align: 'center',
    sortable: true
  },
  {
    field: 'imageList',
    label: t('reuse.image'),
    minWidth: '150',
    align: 'center'
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
    align: 'center',
    headerFilter: 'Name'
  },
  {
    field: 'isActive',
    label: t('reuse.status'),
    minWidth: '150',
    filters: filterTableStatus,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return h('div', productStatusTransferToText(cellValue))
    }
  }
]
