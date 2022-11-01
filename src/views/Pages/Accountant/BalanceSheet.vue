<script setup lang="ts">
import { useI18n } from '@/hooks/web/useI18n'
import { getBalanceList } from '@/api/Business'
import TableType01 from '@/views/Pages/Components/TableDataBase.vue'
import { h } from 'vue'
import { filterStatusRevenueExpenditure } from '@/utils/filters'
import { STATUS } from '@/utils/API.Variables'
const { t } = useI18n()

const unitCategories = [
  { field: '', width: '50' },
  {
    field: 'accountName',
    label: t('reuse.accountCode'),
    minWidth: '100'
  },
  {
    field: 'accountNumber',
    label: t('userDemo.username'),
    minWidth: '350'
  },
  {
    field: 'beginningPeriodRevenue',
    label: t('reuse.openingBalance'),
    children: [
      {
        field: 'beginningPeriodRevenue',
        label: t('reuse.owed'),
        minWidth: '100',
        align: 'right'
      },
      {
        field: 'beginningPeriodPayment',
        label: t('reuse.cash'),
        minWidth: '100',
        align: 'right'
      }
    ]
  },
  {
    field: 'arisingInThePeriod',
    label: t('reuse.arisingInThePeriod'),
    children: [
      {
        field: 'duringPeriodRevenue',
        label: t('reuse.owed'),
        minWidth: '100',
        align: 'right'
      },
      {
        field: 'duringPeriodPayment',
        label: t('reuse.cash'),
        minWidth: '100',
        align: 'right'
      }
    ]
  },
  {
    field: 'arisingInTheEndOfPeriod',
    label: t('reuse.arisingInTheEndOfPeriod'),
    children: [
      {
        field: 'endPeriodRevenue',
        label: t('reuse.owed'),
        minWidth: '100',
        align: 'right'
      },
      {
        field: 'endPeriodpayment',
        label: t('reuse.cash'),
        minWidth: '100',
        align: 'right'
      }
    ]
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '150',
    filters: filterStatusRevenueExpenditure,
    formatter: (record: Recordable, __: TableColumn, _cellValue: TableSlotDefault) => {
      if (record.pepopleType == false) {
        return h('div', STATUS[0].label)
      } else {
        return h('div', STATUS[1].label)
      }
    }
  }
]
</script>
<template>
  <TableType01
    :columns="unitCategories"
    :api="getBalanceList"
    :selection="false"
    :customOperator="4"
  />
</template>
