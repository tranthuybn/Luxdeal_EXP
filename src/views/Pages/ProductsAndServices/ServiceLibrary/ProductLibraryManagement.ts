import { useI18n } from '@/hooks/web/useI18n'
import { filterStatusProductAndService } from '@/utils/filters'
import { formatStatusProductAndService, dateTimeFormat } from '@/utils/format'
import { h } from 'vue'
import { setImageDisplayInTable } from '@/utils/domUtils'
import { changeMoney, filterHandler } from '@/utils/tsxHelper'

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
  },
  {
    field: 'name',
    label: t('reuse.serviceName'),
    minWidth: '250',
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
    sortable: true,
    formatter: (row, _column, _cellValue) => changeMoney.format(parseInt(row.cost))
  },
  {
    field: 'time',
    label: t('reuse.timeMinute'),
    minWidth: '150',
    sortable: true,
  },
  {
    field: 'warranty',
    label: t('reuse.insuranceDate'),
    minWidth: '150',
    sortable: true,
  },
  {
    field: 'photos',
    label: t('reuse.image'),
    minWidth: '120',
    headerAlign: 'center',
    align: 'center',
    formatter: (record: Recordable, column: TableColumn, _: TableSlotDefault) =>
      setImageDisplayInTable(record, column, record.photos[0]?.path)
  },
  {
    field: 'createdAt',
    label: t('formDemo.createdAtEdit'),
    minWidth: '180',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'createdBy',
    label: t('formDemo.createdByEdit'),
    minWidth: '180',
    headerFilter: 'Name'
  },
  {
    field: 'isActive',
    label: t('reuse.status'),
    minWidth: '180',
    filters: filterStatusProductAndService,
    filterMethod: filterHandler,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return t(`${formatStatusProductAndService(cellValue)}`)
    }
  },
  {
    field: 'operator',
    label: t('reuse.operator'),
    minWidth: '220',
    align: 'center',
  }

]
