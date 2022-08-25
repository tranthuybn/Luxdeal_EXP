<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { getPotentialCustomerList } from '@/api/Business'
import TableDatetimefilterBasic from '../../Components/tableType01-datetimefilter-basic.vue'
import {
  filterStatus,
  filterResultTable,
  filterStatusTagTable,
  filterService,
  filterSource,
  filterApproaching,
  filterTransactionStatus,
  filterTransaction
} from '@/utils/filters'
const { t } = useI18n()
const columns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'sale',
    label: t('reuse.sale'),
    minWidth: '150',
    headerFilter: 'Name'
  },
  {
    field: 'customerInfo',
    label: t('reuse.customerInfo'),
    minWidth: '250',
    sortable: true
  },
  {
    field: 'transaction',
    label: t('reuse.transaction'),
    minWidth: '200',
    filters: filterTransaction
  },
  {
    field: 'transactionStatus',
    label: t('reuse.transactionStatus'),
    minWidth: '100',
    filters: filterTransactionStatus
  },
  {
    field: 'approachingChannel',
    label: t('reuse.approachingChannel'),
    minWidth: '100',
    filters: filterApproaching
  },
  {
    field: 'note',
    label: t('reuse.note'),
    minWidth: '150',
    sortable: true
  },
  {
    field: 'originated',
    label: t('reuse.originated'),
    minWidth: '100',
    filters: filterSource
  },
  {
    field: 'service',
    label: t('reuse.service'),
    minWidth: '100',
    filters: filterService
  },
  {
    field: 'serviceDetail',
    label: t('reuse.serviceDetail'),
    minWidth: '200',
    sortable: true
  },
  {
    field: 'statusTag',
    label: t('reuse.statusTag'),
    minWidth: '150',
    filters: filterStatusTagTable
  },
  {
    field: 'result',
    label: t('reuse.result'),
    minWidth: '150',
    filters: filterResultTable
  },
  {
    field: 'order',
    label: t('reuse.order'),
    minWidth: '150',
    sortable: true
  },
  {
    field: 'feedBack',
    label: t('reuse.feedBack'),
    minWidth: '180',
    filters: filterStatus
  },
  {
    field: 'createDate',
    label: t('reuse.createDate'),
    minWidth: '150',
    align: 'center',
    sortable: true
  },
  {
    field: 'creator',
    label: t('reuse.creator'),
    minWidth: '150',
    headerFilter: 'Name'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '180',
    filters: filterStatus
  }
])
</script>
<template>
  <TableDatetimefilterBasic :columns="columns" :api="getPotentialCustomerList" />
</template>
