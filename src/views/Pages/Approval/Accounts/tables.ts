import { reactive, h } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { filterStatusAccounting, } from '@/utils/filters'
import { dateTimeFormat, formatStatusAccounting } from '@/utils/format'
import { filterHandler } from '@/utils/tsxHelper'

const { t } = useI18n()

const collaborators = reactive<TableColumn[]>([
    {
      field: 'index',
      label: t('reuse.index'),
      type: 'index',
      sortable: true,
      align: 'center'
    },
    {
      field: 'code',
      label: t('reuse.collaboratorsCode'),
      minWidth: '110',
    },
    {
      field: 'name',
      label: t('reuse.collaboratorsName'),
      minWidth: '200',
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
      field: 'statusName',
      label: t('reuse.status'),
      minWidth: '150',
      filters: filterStatusAccounting,
      filterMethod: filterHandler,
      formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
        return t(`${formatStatusAccounting(cellValue)}`)
      },
    }
])
const userAccount = reactive<TableColumn[]>([
    {
      field: 'index',
      label: t('reuse.index'),
      type: 'index',
      sortable: true,
      align: 'center'
    },
    {
      field: 'code',
      label: t('reuse.customerCode'),
      minWidth: '110',
    },
    {
      field: 'name',
      label: t('reuse.customerName'),
      minWidth: '200',
    },
    {
        field: 'approveItem',
        label: t('reuse.accountType'),
        minWidth: '200',
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
      field: 'statusName',
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
    collaborators,
    userAccount
}