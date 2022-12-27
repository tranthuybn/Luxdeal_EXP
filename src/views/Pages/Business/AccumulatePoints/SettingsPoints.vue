<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import {
  dateTimeFormat,
  formatPointSettingType,
  formatSettingPointStatus,
  formatSubjectVoucher
} from '@/utils/format'
import { filterPointSettingType, filterStatusSettingPoint, filterSubject } from '@/utils/filters'
import tableDatetimeFilterBasicVue from '../../Components/TableDataBase.vue'
import { getSettingPoint } from '@/api/Business'

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
    label: t('router.packageAccumulatePointsCode'),
    minWidth: '100'
  },
  {
    field: 'description',
    label: t('reuse.description'),
    minWidth: '250'
  },
  {
    field: 'type',
    label: t('reuse.type'),
    minWidth: '250',
    filters: filterPointSettingType,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return formatPointSettingType(cellValue)
    }
  },
  {
    field: 'targetType',
    label: t('reuse.subject'),
    minWidth: '130',
    filters: filterSubject,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return formatSubjectVoucher(cellValue)
    }
  },
  {
    field: 'point',
    label: t('reuse.Points'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'price',
    label: t('reuse.moneyExchange'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'startDate',
    label: t('reuse.startDate'),
    minWidth: '150',
    align: 'center',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'endDate',
    label: t('reuse.endDate'),
    minWidth: '150',
    align: 'center',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'createdAt',
    label: t('reuse.createDate'),
    minWidth: '150',
    align: 'center',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'createdBy',
    label: t('reuse.creator'),
    minWidth: '150',
    headerFilter: 'Name'
  },
  {
    field: 'isActive',
    label: t('reuse.status'),
    minWidth: '200',
    filters: filterStatusSettingPoint,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return formatSettingPointStatus(cellValue)
    }
  }
])
</script>
<template>
  <tableDatetimeFilterBasicVue :columns="columns" :api="getSettingPoint" :customOperator="5" />
</template>
