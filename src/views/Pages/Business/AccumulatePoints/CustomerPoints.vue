<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../../Components/tableType01-datetimefilter-basic.vue'
import { getCustomerPointsList } from '@/api/Business'
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
    label: t('router.totalRechargePoints'),
    minWidth: '100'
  },
  {
    field: 'pointsUsed',
    label: t('router.pointsUsed'),
    minWidth: '250'
  },
  {
    field: 'remainingPoints',
    label: t('router.remainingPoints'),
    minWidth: '200'
  },
  {
    field: 'mostRecentChange',
    label: t('router.mostRecentChange'),
    minWidth: '150'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '150'
  }
])
</script>
<template>
  <tableDatetimeFilterBasicVue :columns="columns" :api="getCustomerPointsList" />
</template>
