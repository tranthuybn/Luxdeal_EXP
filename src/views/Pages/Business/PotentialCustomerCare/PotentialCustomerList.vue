<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { getPotentialCustomerList } from '@/api/Business'
import TableDatetimefilterBasic from '../../Components/TableDataBase.vue'
import {
  filterStatus,
  filterService,
  filterSource,
  filterApproaching,
  filterTransactionStatus,
  filterTransaction
} from '@/utils/filters'
import {
  dateTimeFormat,
  formatPotentialCustomerStatusIdToText,
  formatServiceIdToText
} from '@/utils/format'
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
    minWidth: '250'
  },
  {
    field: 'historyTransaction',
    label: t('reuse.transaction'),
    minWidth: '200',
    filters: filterTransaction
  },
  {
    field: 'isOnline',
    label: t('reuse.transactionStatus'),
    minWidth: '100',
    filters: filterTransactionStatus
  },
  {
    field: 'accessChannel',
    label: t('reuse.approachingChannel'),
    minWidth: '100',
    filters: filterApproaching
  },
  {
    field: 'note',
    label: t('reuse.note'),
    minWidth: '150'
  },
  {
    field: 'source',
    label: t('reuse.originated'),
    minWidth: '100',
    filters: filterSource
  },
  {
    field: 'service',
    label: t('reuse.service'),
    minWidth: '100',
    filters: filterService,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return formatServiceIdToText(cellValue)
    }
  },
  {
    field: 'serviceDetail',
    label: t('reuse.serviceDetail'),
    minWidth: '200'
  },
  {
    field: 'potentialCustomerHistory',
    label: t('reuse.potentialCustomerHistory'),
    minWidth: '200'
  },
  {
    field: 'order',
    label: t('reuse.order'),
    minWidth: '150'
  },
  {
    field: 'feedBack',
    label: t('reuse.feedBack'),
    minWidth: '180',
    filters: filterStatus
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
    field: 'statusId',
    label: t('reuse.status'),
    minWidth: '180',
    filters: filterStatus,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return formatPotentialCustomerStatusIdToText(cellValue)
    }
  }
])
</script>
<template>
  <TableDatetimefilterBasic :columns="columns" :api="getPotentialCustomerList" />
</template>
