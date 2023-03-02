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
    minWidth: '86',
    align: 'center',
  },
  {
    field: 'employeeCode',
    label: t('reuse.employeeCode'),
    minWidth: '250',
    headerAlign: 'left',
  },
  {
    field: 'employeeName',
    label: t('reuse.employeeName'),
    minWidth: '150',
    headerAlign: 'left'
  },
  {
    field: 'phoneNumber',
    label: t('reuse.phoneNumber'),
    minWidth: '100',
    headerAlign: 'left'
  },
  {
    field: 'email',
    label: t('reuse.email'),
    minWidth: '100',
    align: 'center',
    sortable: true,
    headerAlign: 'left'
  },
  {
    field: 'branch',
    label: t('reuse.branch'),
    minWidth: '200',
    filters: filterBranch,
    headerAlign: 'left'
  },
  {
    field: 'department',
    label: t('reuse.department'),
    minWidth: '200',
    filters: filterDepartment,
    headerAlign: 'left'
  },
  {
    field: 'rank',
    label: t('reuse.rank'),
    minWidth: '200',
    filters: filterRankEmployee,
    headerAlign: 'left'
  },
  {
    field: 'type',
    label: t('reuse.type'),
    minWidth: '150',
    filters: filterTypeEmployee,
    headerAlign: 'left'
  },
  {
    field: 'monthlySales',
    label: t('customerList.monthlyRevenue'),
    minWidth: '100',
    headerAlign: 'left'
  },
  {
    field: 'quarterlySales',
    label: t('customerList.quarterlySales'),
    minWidth: '150',
    align: 'center',
    sortable: true,
    headerAlign: 'left'
  },
  {
    field: 'annualSales',
    label: t('customerList.salesYear'),
    minWidth: '150',
    headerFilter: 'Name',
    headerAlign: 'left'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '120',
    filters: filterStatusCustomer,
    headerAlign: 'left'
  }
])
</script>
<template>
  <tableDatetimeFilterBasicVue 
  :removeButtonAdd="true"
  :columns="columns" 
  :api="getStaffList" 
  :customOperator=4
  />
</template>
