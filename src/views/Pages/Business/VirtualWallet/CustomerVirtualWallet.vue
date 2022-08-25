<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../../Components/tableType01-datetimefilter-basic.vue'
import { getCustomerVirtualEWalletList } from '@/api/Business'
import { filterWalletStatus } from '@/utils/filters'
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
    field: 'totalRecharge',
    label: t('router.totalRecharge'),
    minWidth: '100',
    sortable: true
  },
  {
    field: 'usedMoney',
    label: t('router.usedMoney'),
    minWidth: '250',
    sortable: true
  },
  {
    field: 'cashReturn',
    label: t('router.cashReturn'),
    minWidth: '200',
    sortable: true
  },
  {
    field: 'mostRecentChange',
    label: t('router.mostRecentChange'),
    minWidth: '150',
    sortable: true
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '150',
    filters: filterWalletStatus
  }
])
</script>
<template>
  <tableDatetimeFilterBasicVue :columns="columns" :api="getCustomerVirtualEWalletList" />
</template>
