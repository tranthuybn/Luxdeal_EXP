<script setup lang="ts">
import { useI18n } from '@/hooks/web/useI18n'
import { getAccountantList } from '@/api/Business'
import TableType01 from '@/views/Pages/Components/TableDataBase.vue'
import { h } from 'vue'
import { filterStatusBalance } from '@/utils/filters'

const { t } = useI18n()
const changeMoney = new Intl.NumberFormat('vi', {
  style: 'currency',
  currency: 'vnd',
  minimumFractionDigits: 0
})
const getSummaries = (param) => {
  const { columns, data } = param
  const sums: string[] = []
  columns.forEach((column, index) => {
    if (index === 2) {
      sums[index] = 'Cộng'
      return
    }
    const values = data.map((item) => Number(item[column.property]))
    if (!values.every((value) => Number.isNaN(value))) {
      sums[index] = `${values.reduce((prev, curr) => {
        const value = Number(curr)
        if (!Number.isNaN(value)) {
          return prev + curr
        } else {
          return prev
        }
      }, 0)} đ`
    } else {
      sums[index] = ''
    }
  })

  return sums
}
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
        align: 'right',
        formatter: (row, _column, _cellValue) => {
        const x = changeMoney.format(parseInt(row.beginningPeriodRevenue))
        return x
        }
      },
      {
        field: 'beginningPeriodPayment',
        label: t('reuse.spend'),
        minWidth: '100',
        headerAlign: 'center',
        align: 'right',
        formatter: (row, _column, _cellValue) => {
          const x = changeMoney.format(parseInt(row.beginningPeriodPayment))
          return x
        }
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
    field: 'isActive',
    label: t('reuse.status'),
    minWidth: '130',
    filters: filterStatusBalance,
    formatter: (record: Recordable, __: TableColumn, _cellValue: TableSlotDefault) => {
      if (record.isActive == false) {
        return h('div', t('reuse.stopActive'))
      } else {
        return h('div', t('reuse.active'))
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
    :columns="columns"
    :api="getAccountantList"
    :customOperator="6"
    :titleAdd="t('reuse.addAccount')"
    :showSummary="true"
    :getSummaries="getSummaries"
  />
  
</template>

<style lang="less" scoped>
</style>
