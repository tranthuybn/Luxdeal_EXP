<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../../Components/tableType01-datetimefilter-basic.vue'
import { getCustomerVirtualEWalletList } from '@/api/Business'
import { Filter } from '../../Components/Type'
const { t } = useI18n()
const filters: Array<Filter> = [
  { text: 'true', value: 'true' },
  { text: 'false', value: 'false' }
]
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
    minWidth: '100'
  },
  {
    field: 'usedMoney',
    label: t('router.usedMoney'),
    minWidth: '250'
  },
  {
    field: 'cashReturn',
    label: t('router.cashReturn'),
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
    minWidth: '150',
    filters: filters
  }
])
</script>
<template>
  <tableDatetimeFilterBasicVue :columns="columns" :api="getCustomerVirtualEWalletList" />
</template>
