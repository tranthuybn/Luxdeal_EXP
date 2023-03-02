<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../../Components/TableDataBase.vue'
import { getStaffList } from '@/api/Business'
import {
  filterStatusCustomer,
  filterBranch,
  filterDepartment,
  filterRankEmployee,
  filterTypeEmployee
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
    field: 'employeeCode',
    label: t('reuse.employeeCode'),
    minWidth: '250'
  },
  {
    field: 'employeeName',
    label: t('reuse.employeeName'),
    minWidth: '150'
  },
  {
    field: 'phoneNumber',
    label: t('reuse.phoneNumber'),
    minWidth: '100'
  },
  {
    field: 'email',
    label: t('reuse.email'),
    minWidth: '100',
    align: 'center',
    sortable: true
  },
  {
    field: 'branch',
    label: t('reuse.branch'),
    minWidth: '200',
    filters: filterBranch
  },
  {
    field: 'department',
    label: t('reuse.department'),
    minWidth: '200',
    filters: filterDepartment
  },
  {
    field: 'rank',
    label: t('reuse.rank'),
    minWidth: '200',
    filters: filterRankEmployee
  },
  {
    field: 'type',
    label: t('reuse.type'),
    minWidth: '150',
    filters: filterTypeEmployee
  },
  {
    field: 'monthlySales',
    label: t('customerList.monthlyRevenue'),
    minWidth: '100'
  },
  {
    field: 'quarterlySales',
    label: t('customerList.quarterlySales'),
    minWidth: '150',
    align: 'center',
    sortable: true
  },
  {
    field: 'annualSales',
    label: t('customerList.salesYear'),
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
  <tableDatetimeFilterBasicVue 
  :removeHeaderFilter="true" 
  :columns="columns" 
  :api="getStaffList" />
</template>
