<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../../Components/tableType01-datetimefilter-basic.vue'
import { getEmployeeList } from '@/api/Business'
import { filterGender, filterDepartment } from '@/utils/filters'

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
    minWidth: '250',
    sortable: true
  },
  {
    field: 'employeeName',
    label: t('reuse.employeeName'),
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
    field: 'dateOfBirth',
    label: t('reuse.dateOfBirth'),
    minWidth: '100'
  },
  {
    field: 'contact',
    label: t('reuse.contact'),
    minWidth: '100',
    sortable: true
  },
  {
    field: 'branch',
    label: t('reuse.branch'),
    minWidth: '200',
    sortable: true
  },
  {
    field: 'department',
    label: t('reuse.department'),
    minWidth: '200',
    sortable: true
  },
  {
    field: 'rank',
    label: t('reuse.rank'),
    minWidth: '200',
    sortable: true
  },
  {
    field: 'type',
    label: t('reuse.type'),
    minWidth: '150',
    sortable: true
  },
  {
    field: 'createDate',
    label: t('reuse.createDate'),
    minWidth: '150'
  },
  {
    field: 'creator',
    label: t('reuse.creator'),
    minWidth: '150'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '120',
    filters: filterDepartment
  }
])
</script>
<template>
  <tableDatetimeFilterBasicVue :columns="columns" :api="getEmployeeList" />
</template>
