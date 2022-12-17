import { useI18n } from '@/hooks/web/useI18n'
import {
  filterAccount,
  filterGender,
  filtersCustomerType,
  filterStatusCustomer
} from '@/utils/filters'
import { CUSTOMER_TYPE } from '@/utils/API.Variables'
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
    formatter: (row: Recordable, __: TableColumn, cellValue: boolean) => {
      return row['isOrganization']
        ? ''
        : cellValue
        ? h('div', t('reuse.male'))
        : h('div', t('reuse.female'))
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
    filters: filterAccount,
    formatter: (record: Recordable, __: TableColumn, _cellValue: TableSlotDefault) => {
      if (record.customerType == 0) {
        return h('div', CUSTOMER_TYPE[0].label)
      } else if (record.customerType == 1) {
        return h('div', CUSTOMER_TYPE[1].label)
      } else {
        return h('div', CUSTOMER_TYPE[2].label)
      }
    }
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
      return cellValue ? h('div', 'Đang hoạt động') : h('div', 'Đã hủy')
    }
  }
]
