<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../../Components/TableDataBase.vue'
import { getManageNewsList } from '@/api/NewsAndAdvertisement'
import { filterTableStatus } from '@/utils/filters'
import { setImageDisplayInDOm } from '@/utils/domUtils'

const { t } = useI18n()

const columns = reactive<TableColumn[]>([
  { field: '', width: '50' },
  {
    field: 'imageurl',
    label: t('reuse.newsDerectoryinformation'),
    minWidth: '650',
    headerFilter: 'Name',
    formatter: (record: Recordable, column: TableColumn, cellValue: TableSlotDefault) =>
      setImageDisplayInDOm(record, column, cellValue)
  },
  {
    field: 'createDate',
    label: t('reuse.createDate'),
    minWidth: '150',
    align: 'center',
    sortable: true
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '100',
    filters: filterTableStatus
  }
])
</script>
<template>
  <tableDatetimeFilterBasicVue :selection="false" :columns="columns" :api="getManageNewsList" />
</template>
