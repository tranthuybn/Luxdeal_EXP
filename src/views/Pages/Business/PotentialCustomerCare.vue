<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { getPotentialCustomerList } from '@/api/Business'
import TableDatetimefilterBasic from '../Components/table-datetimefilter-basic.vue'
const { t } = useI18n()
const columns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'receivedDate',
    label: t('reuse.receivedDate'),
    minWidth: '150',
    align: 'center',
    sortable: true
  },
  {
    field: 'sale',
    label: t('reuse.sale'),
    minWidth: '150',
    sortable: true
  },
  {
    field: 'customerInfo',
    label: t('reuse.customerInfo'),
    minWidth: '250'
  },
  {
    field: 'transaction',
    label: t('reuse.transaction'),
    minWidth: '200'
  },
  {
    field: 'transactionStatus',
    label: t('reuse.transactionStatus'),
    minWidth: '100'
  },
  {
    field: 'approachingChannel',
    label: t('reuse.approachingChannel'),
    minWidth: '100'
  },
  {
    field: 'note',
    label: t('reuse.note'),
    minWidth: '150'
  },
  {
    field: 'originated',
    label: t('reuse.originated'),
    minWidth: '100'
  },
  {
    field: 'service',
    label: t('reuse.service'),
    minWidth: '100'
  },
  {
    field: 'serviceDetail',
    label: t('reuse.serviceDetail'),
    minWidth: '200'
  },
  {
    field: 'statusTag',
    label: t('reuse.statusTag'),
    minWidth: '150'
  },
  {
    field: 'result',
    label: t('reuse.result'),
    minWidth: '150'
  },
  {
    field: 'order',
    label: t('reuse.order'),
    minWidth: '150'
  },
  {
    field: 'feedBack',
    label: t('reuse.feedBack'),
    minWidth: '180'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '180'
  }
])
</script>
<template>
  <TableDatetimefilterBasic :columns="columns" :api="getPotentialCustomerList" />
</template>
