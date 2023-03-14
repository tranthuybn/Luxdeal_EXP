<script setup lang="ts">
import { h, reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../../Components/TableDataBase.vue'
import { getEmployeeList } from '@/api/Accountant'
import {
  filterGender,
  filterDepartment,
  filterBranch,
  filterRankEmployee,
  filterTypeEmployee,
  filterStatusSettingPoint
} from '@/utils/filters'
import { dateTimeFormat, productStatusTransferToText } from '@/utils/format'
import { deleteStaffAccount } from '@/api/HumanResourceManagement'

const { t } = useI18n()
const columns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'code',
    label: t('reuse.employeeCode'),
    minWidth: '250'
  },
  {
    field: 'name',
    label: t('reuse.employeeName'),
    minWidth: '150'
  },
  {
    field: 'gender',
    label: t('reuse.gender'),
    minWidth: '120',
    filters: filterGender,
    formatter: (row: Recordable, __: TableColumn, cellValue: boolean) => {
      return row['isOrganization']
        ? ''
        : cellValue
        ? h('div', t('reuse.male'))
        : h('div', t('reuse.female'))
    }
  },
  {
    field: 'birthday',
    label: t('reuse.dateOfBirth'),
    minWidth: '120',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'contact',
    label: t('reuse.contact'),
    minWidth: '100'
  },
  {
    field: 'branchName',
    label: t('reuse.branch'),
    minWidth: '200',
    filters: filterBranch
  },
  {
    field: 'departmentName',
    label: t('reuse.department'),
    minWidth: '200',
    filters: filterDepartment
  },
  {
    field: 'positionName',
    label: t('reuse.rank'),
    minWidth: '200',
    filters: filterRankEmployee
  },
  {
    field: 'typeStaffName',
    label: t('reuse.type'),
    minWidth: '150',
    filters: filterTypeEmployee
  },
  {
    field: 'createAt',
    label: t('reuse.createDate'),
    minWidth: '150',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'createBy',
    label: t('reuse.creator'),
    minWidth: '150',
    headerFilter: 'Name'
  },
  {
    field: 'isActive',
    label: t('reuse.status'),
    minWidth: '120',
    filters: filterStatusSettingPoint,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return t(`${productStatusTransferToText(cellValue)}`)
    }
  }
])
</script>
<template>
  <tableDatetimeFilterBasicVue :columns="columns" :api="getEmployeeList" :delApi="deleteStaffAccount" />
</template>
