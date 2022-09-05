<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../../Components/tableType01-datetimefilter-basic.vue'
import { getManageNewsList } from '@/api/NewsAndAdvertisement'
const { t } = useI18n()

const columns = reactive<TableColumn[]>([
  { field: '', width: '50' },
  {
    field: 'imgTitle',
    label: t('reuse.newsDerectoryinformation'),
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
    minWidth: '100'
  }
])
</script>
<template>
  <tableDatetimeFilterBasicVue :selection="false" :columns="columns" :api="getManageNewsList" />
</template>
