import { useI18n } from '@/hooks/web/useI18n'
import {
  filterAccount,
  filterGender,
  filtersCustomerType,
  filterStatusCustomer
} from '@/utils/filters'
import { dateTimeFormat } from '@/utils/format'
import { h } from 'vue'
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
    minWidth: '150'
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
    field: 'sex',
    label: t('reuse.gender'),
    minWidth: '100',
    filters: filterGender,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return cellValue ? h('div', 'Nam') : h('div', 'Nữ')
    }
  },
  {
    field: 'contact',
    label: t('reuse.contact'),
    minWidth: '400',
    formatter: (Recordable: Recordable, _: TableColumn, __: boolean) => {
      return h('ul', [
        h('li', [
          Recordable['taxCode']
            ? h('li', [
                h('span', [t('reuse.mst'), ':']),
                h('span', { style: { paddingLeft: '3px' } }, Recordable['taxCode'])
              ])
            : h('span')
        ]),
        h('li', [
          h('span', [t('reuse.sdt'), ':']),
          h('span', { style: { paddingLeft: '3px' } }, Recordable['phonenumber'])
        ]),
        h('li', [
          h('span', [t('reuse.email'), ':']),
          h('span', { style: { paddingLeft: '3px' } }, Recordable['email'])
        ]),
        h('li', [
          h('span', [t('formDemo.address'), ':']),
          h('span', { style: { paddingLeft: '3px' } }, Recordable['address'])
        ])
      ])
    }
  },
  {
    field: 'customerType',
    label: t('reuse.accountType'),
    minWidth: '150',
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
    field: 'createdBy',
    label: t('reuse.creator'),
    minWidth: '150',
    headerFilter: 'Name'
  },
  {
    field: 'isActive',
    label: t('reuse.status'),
    minWidth: '150',
    filters: filterStatusCustomer,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return cellValue ? h('div', 'Đang hoạt động') : h('div', 'Ngừng hoạt động')
    }
  }
]
