import { useI18n } from '@/hooks/web/useI18n'
import {
  filterAccount,
  filterGender,
  filtersCustomerType,
  filterStatusCustomer
} from '@/utils/filters'
import { dateTimeFormat } from '@/utils/format'
const { t } = useI18n()

export const CustomerList = [
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'code',
    label: t('reuse.customerCode'),
    minWidth: '250'
  },
  {
    field: 'name',
    label: t('reuse.customerName'),
    minWidth: '150',
    filters: filtersCustomerType
  },
  {
    field: 'referralCode',
    label: t('reuse.referralCode'),
    minWidth: '150',
    sortable: true
  },
  {
    field: 'gender',
    label: t('reuse.gender'),
    minWidth: '100',
    filters: filterGender
  },
  {
    field: 'contact',
    label: t('reuse.contact'),
    minWidth: '250'
  },
  {
    field: 'accountType',
    label: t('reuse.accountType'),
    minWidth: '100',
    filters: filterAccount
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
    field: 'updatedBy',
    label: t('reuse.creator'),
    minWidth: '150',
    headerFilter: 'Name'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '120',
    filters: filterStatusCustomer
  }
]
