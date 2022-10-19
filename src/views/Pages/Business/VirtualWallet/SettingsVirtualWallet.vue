<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../../Components/TableDataBase.vue'
import { getCustomerVirtualEWalletList } from '@/api/Business'
import { filterPending } from '@/utils/filters'
const { t } = useI18n()
const columns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'moneyPaymentCode',
    label: t('reuse.moneyPaymentCode'),
    minWidth: '150'
  },
  {
    field: 'description',
    label: t('reuse.description'),
    minWidth: '250'
  },
  {
    field: 'amountOfMoney',
    label: t('reuse.amountOfMoney'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'start',
    label: t('reuse.start'),
    minWidth: '150',
    align: 'center',
    sortable: true
  },
  {
    field: 'end',
    label: t('common.doneLabel'),
    minWidth: '150',
    align: 'center',
    sortable: true
  },
  {
    field: 'updatedAt',
    label: t('reuse.createDate'),
    minWidth: '150',
    align: 'center',
    sortable: true
  },
  {
    field: 'creator',
    label: t('reuse.creator'),
    minWidth: '150',
    align: 'left',
    headerFilter: 'Name'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '150',
    filters: filterPending
  }
])
</script>
<template>
  <tableDatetimeFilterBasicVue :columns="columns" :api="getCustomerVirtualEWalletList" />
</template>
