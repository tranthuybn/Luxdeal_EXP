<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../../Components/tableType01-datetimefilter-basic.vue'
import { getProductStorageList } from '@/api/Warehouse'
import { filterTableStatus } from '@/utils/filters'
const { t } = useI18n()
const columns = reactive<TableColumn[]>([
  { field: 'void', width: '50' },
  {
    field: 'imgTitle',
    label: t('reuse.categoryColorTitle'),
    minWidth: '650',
    headerFilter: 'Name'
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
  <tableDatetimeFilterBasicVue :columns="columns" :api="getProductStorageList" :selection="false" />
</template>
