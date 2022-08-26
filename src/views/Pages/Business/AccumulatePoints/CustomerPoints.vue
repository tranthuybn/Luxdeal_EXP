<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../../Components/tableType01-datetimefilter-basic.vue'
import { getCustomerPointsList } from '@/api/Business'
import { filterPointStatus } from '@/utils/filters'
const { t } = useI18n()
const columns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'customerCode',
    label: t('reuse.customerCode'),
    minWidth: '150'
  },
  {
    field: 'customerName',
    label: t('reuse.customerName'),
    minWidth: '150'
  },
  {
    field: 'totalRechargePoints',
    label: t('reuse.totalRechargePoints'),
    minWidth: '100',
    align: 'center',
    sortable: true
  },
  {
    field: 'pointsUsed',
    label: t('reuse.pointsUsed'),
    minWidth: '250',
    align: 'center',
    sortable: true
  },
  {
    field: 'remainingPoints',
    label: t('reuse.remainingPoints'),
    minWidth: '200',
    align: 'center',
    sortable: true
  },
  {
    field: 'mostRecentChange',
    label: t('reuse.mostRecentChange'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '150',
    filters: filterPointStatus
  }
])
</script>
<template>
  <tableDatetimeFilterBasicVue :columns="columns" :api="getCustomerPointsList" />
</template>
