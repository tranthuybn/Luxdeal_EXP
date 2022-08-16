<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../../Components/tableType01-datetimefilter-basic.vue'
import { getCustomerList } from '@/api/Business'

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
    field: 'customerOrRepresentative',
    label: t('reuse.customerName') + ' ' + t('reuse.representative'),
    minWidth: '150'
  },
  {
    field: 'customerCode',
    label: t('reuse.customerCode'),
    minWidth: '250'
  },
  {
    field: 'gender',
    label: t('reuse.gender'),
    minWidth: '100'
  },
  {
    field: 'contact',
    label: t('reuse.contact'),
    minWidth: '100'
  },
  {
    field: 'companyInfo',
    label: t('reuse.companyInfo'),
    minWidth: '200'
  },
  {
    field: 'type',
    label: t('reuse.type'),
    minWidth: '150'
  },
  {
    field: 'accountType',
    label: t('reuse.accountType'),
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
  <tableDatetimeFilterBasicVue :columns="columns" :api="getCustomerList" />
</template>
