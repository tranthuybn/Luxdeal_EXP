<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../../Components/TableDataBase.vue'
import { getPaymentList } from '@/api/Business'
const { t } = useI18n()
const columns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'proposalCode',
    label: t('reuse.proposalCode'),
    minWidth: '150'
  },
  {
    field: 'contentDescriptions',
    label: t('reuse.contentDescriptions'),
    minWidth: '150'
  },
  {
    field: 'amountOfMoney',
    label: t('reuse.amountOfMoney'),
    minWidth: '100',
    sortable: true
  },
  {
    field: 'revenueAndExpenditure',
    label: t('reuse.revenueAndExpenditure'),
    minWidth: '100'
  },
  {
    field: 'subject',
    label: t('reuse.subject'),
    minWidth: '200'
  },
  {
    field: 'type',
    label: t('reuse.type'),
    minWidth: '150'
  },
  {
    field: 'reciprocalProfile',
    label: t('reuse.reciprocalProfile'),
    minWidth: '150'
  },
  {
    field: 'createDate',
    label: t('reuse.createDate'),
    minWidth: '130'
  },
  {
    field: 'creator',
    label: t('reuse.creator'),
    minWidth: '130'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '150'
  }
])
</script>
<template>
  <tableDatetimeFilterBasicVue :columns="columns" :api="getPaymentList" />
</template>
