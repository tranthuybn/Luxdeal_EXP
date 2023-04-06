import { reactive, h } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { filterStatusAccounting, filterTransacted, filterPaymentMethod, filterReciprocalProfile, filtersReceiptExpenditure, filterStatusGeneral } from '@/utils/filters'
import { dateTimeFormat, formatPaymentOrReceipts, formatPaymentMethod, formatStatusAccounting, formatStatusGeneral } from '@/utils/format'
import { filterHandler, changeMoney } from '@/utils/tsxHelper'
import { ATTACH_DOCUMENT } from '@/utils/API.Variables'

const { t } = useI18n()

const recepitAndPayment = reactive<TableColumn[]>([
    {
      field: 'index',
      label: t('reuse.index'),
      type: 'index',
      sortable: true,
      align: 'center'
    },
    {
      field: 'code',
      label: t('reuse.formCode'),
      minWidth: '110',
    },
    {
      field: 'description',
      label: t('reuse.reasonRevenueExpenditure'),
      minWidth: '200',
    },
    {
      field: 'totalMoney',
      label: t('reuse.amountOfMoney'),
      minWidth: '110',
      sortable: true,
      align: 'right',
      formatter: (record: Recordable, __: TableColumn, _cellValue: TableSlotDefault) => {
        const x = changeMoney.format(parseInt(record.totalMoney))
        return x
      }
    },
    {
      field: 'peopleName',
      label: t('reuse.subject'),
      minWidth: '200',
      headerFilter: 'Name',
    },
    {
      field: 'createdAt',
      label: t('reuse.createDate'),
      minWidth: '150',
      sortable: true,
      formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
        return dateTimeFormat(cellValue)
      },
    },
    {
      field: 'createdBy',
      label: t('reuse.creator'),
      minWidth: '150',
      headerFilter: 'Name',
    },
    {
      field: 'approveAction',
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
const paymentProposal = reactive<TableColumn[]>([
  {
    field: 'id',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'code',
    label: t('reuse.proposalCode'),
    minWidth: '130',
  },
  {
    field: 'description',
    label: t('reuse.reasonSpendMoney'),
    minWidth: '200',  
  },
  {
    field: 'totalMoney',
    label: t('reuse.amountOfMoney'),
    minWidth: '130',
    align: 'right',
    sortable: true,
    formatter: (row, _column, _cellValue) => changeMoney.format(parseInt(row.totalMoney))
  },
  {
    field: 'peopleName',
    label: t('reuse.subject'),
    minWidth: '450',
  },
  {
    field: 'createdAt',
    label: t('reuse.createDate'),
    minWidth: '130',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    },
  },
  {
    field: 'createdBy',
    label: t('reuse.creator'),
    minWidth: '130',
    headerFilter: 'Name',
  },
  {
    field: 'approveAction',
    label: t('formDemo.browsingConditions'),
    minWidth: '150',
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '130',
    filters: filterStatusGeneral,
    filterMethod: filterHandler,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return t(`${formatStatusGeneral(cellValue)}`)
    },
  }

])

export { 
  recepitAndPayment,
  paymentProposal
}