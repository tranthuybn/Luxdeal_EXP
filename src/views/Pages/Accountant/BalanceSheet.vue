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
    field: 'accountNumber',
    label: t('reuse.badgeAccount'),
    minWidth: '130'
  },
  {
    field: 'accountName',
    label: t('reuse.accountName'),
    minWidth: '337'
  },
  {
    field: 'beginningPeriodRevenue',
    label: t('reuse.openingBalance'),
    minWidth: '300',
    headerAlign: 'center',
    children: [
      {
        field: 'beginningPeriodRevenue',
        label: t('reuse.owed'),
        minWidth: '100',
        headerAlign: 'center',
        align: 'right'
      },
      {
        field: 'beginningPeriodPayment',
        label: t('reuse.cash'),
        minWidth: '100',
        headerAlign: 'center',
        align: 'right'
      }
    ]
  },
  {
    field: 'arisingInThePeriod',
    label: t('reuse.arisingInThePeriod'),
    minWidth: '300',
    headerAlign: 'center',
    children: [
      {
        field: 'duringPeriodRevenue',
        label: t('reuse.owed'),
        minWidth: '100',
        headerAlign: 'center',
        align: 'right'
      },
      {
        field: 'duringPeriodPayment',
        label: t('reuse.cash'),
        minWidth: '100',
        headerAlign: 'center',
        align: 'right'
      }
    ]
  },
  {
    field: 'arisingInTheEndOfPeriod',
    label: t('reuse.arisingInTheEndOfPeriod'),
    headerAlign: 'center',
    minWidth: '300',
    children: [
      {
        field: 'endPeriodRevenue',
        label: t('reuse.owed'),
        minWidth: '100',
        headerAlign: 'center',
        align: 'right'
      },
      {
        field: 'endPeriodpayment',
        label: t('reuse.cash'),
        minWidth: '100',
        headerAlign: 'center',
        align: 'right'
      }
    ]
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '130',
    filters: filterStatusRevenueExpenditure,
    formatter: (record: Recordable, __: TableColumn, _cellValue: TableSlotDefault) => {
      if (record.pepopleType == false) {
        return h('div', STATUS[0].label)
      } else {
        return h('div', STATUS[1].label)
      }
    }
  },
  {
    field: 'operator',
    label: t('reuse.operator'),
    minWidth: '80',
    align: 'center',
  }
]

</script>
<template>
  <TableType01
    :columns="unitCategories"
    :api="getBalanceList"
    :customOperator="4"
    :pagination="false"
    :titleAdd="t('reuse.addAccount')"
  >
  <template #expand>hello</template>
  </TableType01>
</template>
