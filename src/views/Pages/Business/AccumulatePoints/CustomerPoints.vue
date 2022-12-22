<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../../Components/TableDataBase.vue'
import { getCustomerPoint } from '@/api/Business'
import { filterPointStatus } from '@/utils/filters'
import { dateTimeFormat, formatCustomerPointStatus } from '@/utils/format'
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
    minWidth: '150'
  },
  {
    field: 'customerName',
    label: t('reuse.customerName'),
    minWidth: '150'
  },
  {
    field: 'rechargePoint',
    label: t('reuse.totalRechargePoints'),
    minWidth: '250',
    align: 'right',
    sortable: true
  },
  {
    field: 'usedPoint',
    label: t('reuse.pointsUsed'),
    minWidth: '250',
    align: 'right',
    sortable: true
  },
  {
    field: 'point',
    label: t('reuse.remainingPoints'),
    minWidth: '200',
    align: 'right',
    sortable: true
  },
  {
    field: 'updatedAt',
    label: t('reuse.mostRecentChange'),
    minWidth: '150',
    align: 'center',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '150',
    filters: filterPointStatus,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return formatCustomerPointStatus(cellValue)
    }
  }
])
</script>
<template>
  <tableDatetimeFilterBasicVue
    :columns="columns"
    :api="getCustomerPoint"
    :customOperator="4"
    :removeHeaderFilterSlot="false"
  />
</template>
