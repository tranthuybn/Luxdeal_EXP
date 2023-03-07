<script setup lang="ts">
import { h, reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { collaboratorStatusTransferToText, dateTimeFormat } from '@/utils/format'
import { getCollaboratorsList } from '@/api/Business'
import { filterStatusCustomer } from '@/utils/filters'
import TableType01 from '../../Components/TableDataBase.vue'

const { t } = useI18n()
const columns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'code',
    label: t('reuse.collaboratorsCode'),
    minWidth: '100'
  },
  {
    field: 'accountName',
    label: t('reuse.collaboratorsName'),
    minWidth: '150'
  },

  {
    field: 'contact',
    label: t('reuse.contact'),
    minWidth: '250',
    formatter: (row, _column, _cellValue, _index) => {
      return h('ul', [
        h('li', row.customerType == 2 ? `${t('reuse.mst')}: ${row.customer.taxCode}` : ''),
        h('li', `${t('reuse.sdt')}: ${row.customer.phonenumber}`),
        h('li', `${t('reuse.email')}: ${row.customer.email}`),
        h('li', `${t('formDemo.address')}: ${row.customer.address}`)
      ])
    }
  },
  {
    field: 'account',
    label: t('reuse.account'),
    minWidth: '200',
    formatter: (row, _column, _cellValue, _index) => {
      return h('ul', [
        h('li', `STK: ${row.accountNumber}`),
        h('li', `Tên TK: ${row.accountName}`),
        h('li', `NH: ${row.bank.code}`)
      ])
    }
  },
  {
    field: 'totalMoney',
    label: t('reuse.totalMoney'),
    minWidth: '150',
    align: 'right',
    sortable: true
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
    minWidth: '130',
    headerFilter: 'Name'
  },
  {
    field: 'status',
    label: t('reuse.accountStatus'),
    minWidth: '200',
    filters: filterStatusCustomer,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return t(`${collaboratorStatusTransferToText(cellValue)}`)
    }
  }
])
</script>
<template>
  <TableType01 :customOperator="5" :columns="columns" :api="getCollaboratorsList" />
</template>
