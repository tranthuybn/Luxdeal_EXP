<script setup lang="ts">
import { useI18n } from '@/hooks/web/useI18n'
import { filterRankCustomer } from '@/utils/filters'
import { reactive } from 'vue'
import TableDataBase from '../../Components/TableDataBase.vue'
import { getCustomerPointsList } from '@/api/Business'
const { t } = useI18n()

const columns = reactive<TableColumn[]>([
  {
    field: 'customerCode',
    label: t('reuse.customerCode'),
    minWidth: '150'
  },
  {
    field: 'customerName',
    label: t('reuse.customerName'),
    headerAlign: 'left',
    minWidth: '400'
  },
  {
    field: 'monthlyRevenue',
    label: t('customerList.monthlyRevenue'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'quarterlySales',
    label: t('customerList.quarterlySales'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'salesYear',
    label: t('customerList.salesYear'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'rankMonth',
    label: t('customerList.rankMonth'),
    minWidth: '150',
    align: 'left',
    filters: filterRankCustomer
  },
  {
    field: 'quarterlyRanking',
    label: t('customerList.quarterlyRanking'),
    minWidth: '150',
    align: 'left',
    filters: filterRankCustomer
  },
  {
    field: 'rankingYear',
    label: t('customerList.rankingYear'),
    minWidth: '150',
    align: 'left',
    filters: filterRankCustomer
  }
])
</script>

<template>
  <TableDataBase
    :columns="columns"
    :api="getCustomerPointsList"
    :is-operator-column-customize="true"
  />
</template>
