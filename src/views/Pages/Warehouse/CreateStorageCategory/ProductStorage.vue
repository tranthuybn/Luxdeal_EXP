<script setup lang="ts">
import { h, reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../../Components/TableDataBase.vue'
import { getProductStorage, deleteProductStorage } from '@/api/Warehouse'
import { filterTableStatus } from '@/utils/filters'
import { setImageDisplayInDOm } from '@/utils/domUtils'
import { dateTimeFormat, productStatusTransferToText } from '@/utils/format'
const { t } = useI18n()

// const params = { PageIndex: 1, PageSize: 30 }
// provide('parameters', {
//   params
// })
const columns = reactive<TableColumn[]>([
  { field: '', width: '50' },
  {
    field: 'warehouseImages[0].path',
    label: t('reuse.warehouseListInformation'),
    minWidth: '650',
    formatter: (record: Recordable, column: TableColumn, _cellValue: TableSlotDefault) =>
      setImageDisplayInDOm(record, column, record?.warehouseImages[0]?.path, record.name)
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
    field: 'isActive',
    label: t('reuse.status'),
    minWidth: '100',
    filters: filterTableStatus,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return h('div', productStatusTransferToText(cellValue))
    }
  }
])
</script>
<template>
  <tableDatetimeFilterBasicVue
    :columns="columns"
    :api="getProductStorage"
    :selection="false"
    :delApi="deleteProductStorage"
  />
</template>
