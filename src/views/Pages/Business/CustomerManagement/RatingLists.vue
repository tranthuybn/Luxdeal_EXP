<script setup lang="ts">
import { useI18n } from '@/hooks/web/useI18n'
import { filterRankCustomer } from '@/utils/filters'
import { reactive } from 'vue'
import TableDataBase from '../../Components/TableDataBase.vue'
import { getCustomerRanking } from '@/api/Business'
import { formatRankingCustomer, moneyFormat } from '@/utils/format'
const { t } = useI18n()

const columns = reactive<TableColumn[]>([
  {
    field: 'code',
    label: t('reuse.customerCode'),
    minWidth: '150'
  },
  {
    field: 'name',
    label: t('reuse.customerName'),
    headerAlign: 'left',
    minWidth: '400'
  },
  {
    field: 'monthlySales',
    label: t('customerList.monthlyRevenue'),
    minWidth: '150',
    align: 'right',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
      return moneyFormat(cellValue)
    }
  },
  {
    field: 'quarterlySales',
    label: t('customerList.quarterlySales'),
    minWidth: '150',
    align: 'right',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
      return moneyFormat(cellValue)
    }
  },
  {
    field: 'annualSales',
    label: t('customerList.salesYear'),
    minWidth: '150',
    align: 'right',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
      return moneyFormat(cellValue)
    }
  },
  {
    field: 'monthlyRanking',
    label: t('customerList.rankMonth'),
    minWidth: '150',
    align: 'left',
    filters: filterRankCustomer,
    formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
      return formatRankingCustomer(cellValue)
    }
  },
  {
    field: 'quarterlyRanking',
    label: t('customerList.quarterlyRanking'),
    minWidth: '150',
    align: 'left',
    filters: filterRankCustomer,
    formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
      return formatRankingCustomer(cellValue)
    }
  },
  {
    field: 'annualRanking',
    label: t('customerList.rankingYear'),
    minWidth: '150',
    align: 'left',
    filters: filterRankCustomer,
    formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
      return formatRankingCustomer(cellValue)
    }
  }
])
</script>

<template>
  <TableDataBase
    :columns="columns"
    :api="getCustomerRanking"
    :is-operator-column-customize="true"
    :removeHeaderFilterSlot="true"
  />
</template>
