<script setup lang="ts">
import { getProductsApproval } from '@/api/Approval'
import { h, reactive } from 'vue'
import TableType01 from '../../Components/tableType01-datetimefilter-basic.vue'
import { useI18n } from '@/hooks/web/useI18n'
import { filterTableCategory, filterTableStatus } from '@/utils/filters'
import { ElButton } from 'element-plus'
const { t } = useI18n()
const columns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'productCode',
    label: t('reuse.productCode'),
    minWidth: '150'
  },
  {
    field: 'productName',
    label: t('reuse.productName'),
    minWidth: '150'
  },
  {
    field: 'description',
    label: t('reuse.description'),
    minWidth: '200'
  },

  {
    field: 'category',
    label: t('reuse.category'),
    minWidth: '150',
    filters: filterTableCategory
  },
  {
    field: 'image',
    label: t('reuse.image'),
    minWidth: '150',
    align: 'center'
  },
  {
    field: 'createDate',
    label: t('reuse.createDate'),
    minWidth: '150',
    align: 'center',
    sortable: true
  },
  {
    field: 'creator',
    label: t('reuse.creator'),
    minWidth: '150',
    headerFilter: 'Name'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '150',
    filters: filterTableStatus
  },
  {
    field: 'detail',
    label: t('reuse.operator'),
    minWidth: '170',
    fixed: false,
    align: 'center',
    formatter: (record: Recordable, __: TableColumn, cellValue: TableSlotDefault) => {
      return h(ElButton, {
        style: { margin: 'auto' },
        onClick: () => seeDetail(record, cellValue)
      })
    }
  }
])
const seeDetail = (record: Recordable, data: TableSlotDefault) => {
  console.log(record, data)
}
</script>
<template>
  <TableType01 :columns="columns" :api="getProductsApproval" isOperatorColumnCustomize />
</template>
