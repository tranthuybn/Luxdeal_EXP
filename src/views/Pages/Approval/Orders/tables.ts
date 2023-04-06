import { reactive, h } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { filterStatusAccounting, } from '@/utils/filters'
import { dateTimeFormat, formatStatusAccounting, orderType } from '@/utils/format'
import { filterHandler } from '@/utils/tsxHelper'

const { t } = useI18n()

const ordersColumn = reactive<TableColumn[]>([
    {
      field: 'index',
      label: t('reuse.index'),
      type: 'index',
      sortable: true,
      align: 'center'
    },
    {
      field: 'code',
      label: t('formDemo.orderCode'),
      minWidth: '110',
    },
    {
      field: 'approveItemType',
      label: t('formDemo.orderType'),
      minWidth: '200',
      formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
        return t(`${orderType(cellValue)}`)
      },
    },
    {
      field: 'customerName',
      label: t('formDemo.customer'),
      minWidth: '110',
      sortable: true,
      align: 'right',
    },
    {
      field: 'createdAt',
      label: t('formDemo.createdAtEdit'),
      minWidth: '150',
      sortable: true,
      formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
        return dateTimeFormat(cellValue)
      },
    },
    {
      field: 'createdBy',
      label: t('formDemo.createdByEdit'),
      minWidth: '150',
      headerFilter: 'Name',
    },
    {
      field: 'orderActionName',
      label: t('formDemo.browsingConditions'),
      minWidth: '150',
    },
    {
      field: 'status',
      label: t('reuse.status'),
      minWidth: '150',
      filters: filterStatusAccounting,
      filterMethod: filterHandler,
      formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
        return t(`${formatStatusAccounting(cellValue)}`)
      },
    }
])
export { 
    ordersColumn,
}