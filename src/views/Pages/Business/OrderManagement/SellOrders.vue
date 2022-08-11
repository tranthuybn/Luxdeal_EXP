<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../../Components/table-datetimeFilter-basic.vue'
import { getSellOrderList } from '@/api/Business'

const { t } = useI18n()
const columns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'createDate',
    label: t('reuse.createDate'),
    minWidth: '150'
  },
  {
    field: 'orderCode',
    label: t('reuse.customerName') + ' ' + t('reuse.representative'),
    minWidth: '150'
  },
  {
    field: 'creator',
    label: t('reuse.creator'),
    minWidth: '250'
  },
  {
    field: 'customer',
    label: t('reuse.customerName'),
    minWidth: '100'
  },
  {
    field: 'description',
    label: t('reuse.descriptions'),
    minWidth: '200'
  },
  {
    field: 'saleNumber',
    label: t('reuse.saleNumber'),
    minWidth: '200'
  },
  {
    field: 'totalMoney',
    label: t('reuse.totaMoney'),
    minWidth: '150'
  },
  {
    field: 'debitTotal',
    label: t('reuse.debt'),
    minWidth: '100'
  },
  {
    field: 'receiptAndExpenditure',
    label: t('reuse.haveToCollect') + '/' + t('reuse.havetoPay'),
    minWidth: '100'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '100'
  }
])
</script>
<template>
  <tableDatetimeFilterBasicVue :columns="columns" :api="getSellOrderList" />
</template>
