import { useI18n } from '@/hooks/web/useI18n'
import { filterProductStatus } from '@/utils/filters'
import { productStatusTransferToText, dateTimeFormat } from '@/utils/format'
import { h } from 'vue'
import { setImageDisplayInDOm } from '@/utils/domUtils'

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
    minWidth: '150',
    headerAlign: 'left',
  },
  {
    field: 'name',
    label: t('reuse.serviceName'),
    minWidth: '250',
    headerAlign: 'left',
  },
  {
    field: 'description',
    label: t('reuse.description'),
    minWidth: '250',
    headerAlign: 'left',
    formatter: (_: Recordable, __: TableColumn, cellValue: any) => {
      return h('span', { innerHTML: cellValue })
    }
  },
  {
    field: 'cost',
    label: t('reuse.unitPrice'),
    minWidth: '150',
    align: 'right',
    sortable: true,
    headerAlign: 'left',
  },
  {
    field: 'time',
    label: t('reuse.timeMinute'),
    minWidth: '150',
    align: 'center',
    sortable: true,
    headerAlign: 'left',
  },
  {
    field: 'warranty',
    label: t('reuse.insuranceDate'),
    minWidth: '150',
    align: 'center',
    sortable: true,
    headerAlign: 'left',
  },
  {
    field: 'photos',
    label: t('reuse.image'),
    minWidth: '120',
    headerAlign: 'left',
    align: 'center',
    formatter: (record: Recordable, column: TableColumn, _: TableSlotDefault) =>
      setImageDisplayInDOm(record, column, record.photos[0]?.path)
  },
  {
    field: 'createdAt',
    label: t('formDemo.createdAtEdit'),
    minWidth: '150',
    align: 'center',
    sortable: true,
    headerAlign: 'left',
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'createdBy',
    label: t('formDemo.createdByEdit'),
    minWidth: '150',
    align: 'center',
    headerAlign: 'left',
    headerFilter: 'Name'
  },
  {
    field: 'isActive',
    label: t('reuse.status'),
    minWidth: '150',
    headerAlign: 'left',
    filters: filterProductStatus,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return t(`${productStatusTransferToText(cellValue)}`)
    }
  },
  {
    field: 'operator',
    label: t('reuse.operator'),
    minWidth: '220',
    headerAlign: 'left',
    align: 'center',
  }

]
