<script setup lang="ts">
import { useI18n } from '@/hooks/web/useI18n'
import { h, reactive } from 'vue'
import TableDataBase from '../../Components/TableDataBase.vue'
import { getCustomerRanking } from '@/api/Business'
import { moneyFormat } from '@/utils/format'
import { filterGender, filterProductStatus } from '@/utils/filters'
const { t } = useI18n()

const columns = reactive<TableColumn[]>([
  {
    field: 'id',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'totalMoney',
    label: t('customerList.sales'),
    minWidth: '180',
    align: 'right',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
      return moneyFormat(cellValue)
    }
  },
  {
    field: 'ordinal',
    label: t('customerList.ratings'),
    minWidth: '150',
    align: 'left'
  },
  {
    field: 'code',
    label: t('reuse.customerCode'),
    minWidth: '150'
  },
  {
    field: 'name',
    label: t('reuse.customerName'),
    headerAlign: 'left',
    minWidth: '400'
  },
  {
    field: 'contact',
    label: t('reuse.contact'),
    minWidth: '250',
    formatter: (row, _column, _cellValue, _index) => {
      return h('ul', [
        h('li', row.phonenumber ? `${t('reuse.sdt')}: ${row.phonenumber}` : ''),
        h('li', row.email ? `${t('reuse.email')}: ${row.email}` : ''),
        h('li', row.address ? `${t('formDemo.address')}: ${row.address}` : '')
      ])
    }
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
    field: 'customerStatus',
    label: t('reuse.status'),
    minWidth: '120',
    filters: filterProductStatus
  }
])

// provide('parameters', {
//   params
// })
</script>

<template>
  <TableDataBase
    :columns="columns"
    :api="getCustomerRanking"
    :is-operator-column-customize="true"
    :removeHeaderFilterSlot="true"
  />
</template>
