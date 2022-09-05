<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../../Components/tableType01-datetimefilter-basic.vue'
import { getReceiptsExpendituresList } from '@/api/Business'
import {
  filtersReceiptExpenditure,
  filterStatusRevenueExpenditure,
  filterReciprocalProfile
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
    field: 'formCode',
    label: t('reuse.formCode'),
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
    minWidth: '100',
    filters: filtersReceiptExpenditure
  },
  {
    field: 'subject',
    label: t('reuse.subject'),
    minWidth: '200',
    headerFilter: 'Name'
  },
  {
    field: 'reciprocalProfile',
    label: t('reuse.reciprocalProfile'),
    minWidth: '150',
    filters: filterReciprocalProfile
  },
  {
    field: 'accountCode',
    label: t('reuse.accountCode'),
    minWidth: '150',
    headerFilter: 'Name'
  },
  {
    field: 'accountName',
    label: t('login.username'),
    minWidth: '150',
    headerFilter: 'Name'
  },
  {
    field: 'accountingDate',
    label: t('reuse.accountingDate'),
    minWidth: '150',
    sortable: true
  },
  {
    field: 'createDate',
    label: t('reuse.createDate'),
    minWidth: '130',
    sortable: true
  },
  {
    field: 'creator',
    label: t('reuse.creator'),
    minWidth: '130',
    headerFilter: 'Name'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '150',
    filters: filterStatusRevenueExpenditure
  }
])
</script>
<template>
  <tableDatetimeFilterBasicVue :columns="columns" :api="getReceiptsExpendituresList" />
</template>
