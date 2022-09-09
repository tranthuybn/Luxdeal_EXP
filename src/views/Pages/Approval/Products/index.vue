<script setup lang="ts">
import { getProductsApproval } from '@/api/Approval'
import { h, reactive } from 'vue'
import TableType01 from '../../Components/TableDataBase.vue'
import { useI18n } from '@/hooks/web/useI18n'
import { filterTableCategory, filterTableStatus } from '@/utils/filters'
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
    label: t('reuse.createDate') + '/' + t('reuse.edit'),
    minWidth: '150',
    align: 'center',
    sortable: true
  },
  {
    field: 'creator',
    label: t('reuse.creator') + '/' + t('reuse.edit'),
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
      return h(
        'ElButton',
        {
          style: { margin: 'auto' },
          type: 'primary',
          onClick: () => seeDetail(record, cellValue)
        },
        h('div', [
          h('div', { style: 'display:inline-block;padding-right:1em' }, 'Duyệt chi tiết'),
          h('span', { class: 'arrowRight' })
        ])
      )
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
