<script setup lang="ts">
import { useI18n } from '@/hooks/web/useI18n'
import { getAccountantList } from '@/api/Business'
import TableType01 from '@/views/Pages/Components/TableDataBase.vue'
import { h, reactive } from 'vue'
import { filterStatusRevenueExpenditure } from '@/utils/filters'
import { STATUS } from '@/utils/API.Variables'
import {
  ElTable,
  ElTableColumn,
} from 'element-plus'

const { t } = useI18n()

const columns = [
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
        label: t('reuse.get'),
        minWidth: '100',
        headerAlign: 'center',
        align: 'right'
      },
      {
        field: 'beginningPeriodPayment',
        label: t('reuse.spend'),
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
        label: t('reuse.get'),
        minWidth: '100',
        headerAlign: 'center',
        align: 'right'
      },
      {
        field: 'duringPeriodPayment',
        label: t('reuse.spend'),
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
        label: t('reuse.get'),
        minWidth: '100',
        headerAlign: 'center',
        align: 'right'
      },
      {
        field: 'endPeriodpayment',
        label: t('reuse.spend'),
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

const totalBalance = reactive([
  {
    label: t('reuse.plusLabel'),
    beginningPeriodRevenue: 1,
    beginningPeriodPayment: 2,
    duringPeriodRevenue: 1,
    duringPeriodPayment: 1,
    endPeriodRevenue: 1,
    endPeriodpayment: 1,
  },
])


</script>
<template>
  <TableType01
    :columns="columns"
    :api="getAccountantList"
    :customOperator="6"
    :pagination="false"
    :titleAdd="t('reuse.addAccount')"
  >
    <template  #totalBalanceSheet>
      <el-table :data="totalBalance">
        <el-table-column prop="label"/>
        <el-table-column prop="beginningPeriodRevenue"/>
        <el-table-column prop="beginningPeriodPayment"/>
        <el-table-column prop="duringPeriodRevenue"/>
        <el-table-column prop="duringPeriodPayment"/>
        <el-table-column prop="endPeriodRevenue"/>
        <el-table-column prop="endPeriodpayment"/>
      </el-table>
    </template>
  </TableType01>
</template>
