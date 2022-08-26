<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../../Components/tableType01-datetimefilter-basic.vue'
import { getCustomerList } from '@/api/Business'
import { filterGender, filterStatusCustomer, filterType, filterAccount } from '@/utils/filters'

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
    minWidth: '250'
  },
  {
    field: 'customerName',
    label: t('reuse.customerName'),
    minWidth: '150'
  },
  {
    field: 'referralCode',
    label: t('reuse.referralCode'),
    minWidth: '150',
    sortable: true
  },
  {
    field: 'gender',
    label: t('reuse.gender'),
    minWidth: '100',
    filters: filterGender
  },
  {
    field: 'contact',
    label: t('reuse.contact'),
    minWidth: '250'
  },
  {
    field: 'companyInfo',
    label: t('reuse.companyInfo'),
    minWidth: '200',
    sortable: true
  },
  {
    field: 'type',
    label: t('reuse.type'),
    minWidth: '150',
    filters: filterType
  },
  {
    field: 'accountType',
    label: t('reuse.accountType'),
    minWidth: '100',
    filters: filterAccount
  },
  {
    field: 'createDate',
    label: t('reuse.createDate'),
    minWidth: '150',
    align: 'center',
    sortable: true
  },
  {
    field: 'creator',
    label: t('reuse.creator'),
    minWidth: '150',
    headerFilter: 'Name'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '120',
    filters: filterStatusCustomer
  }
])
</script>
<template>
  <tableDatetimeFilterBasicVue :columns="columns" :api="getCustomerList" />
</template>
