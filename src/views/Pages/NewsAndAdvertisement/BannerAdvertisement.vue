<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../Components/TableDataBase.vue'
import { getBannerAdvertisementList } from '@/api/NewsAndAdvertisement'
import { filterTableStatus } from '@/utils/filters'
import { setImageDisplayInDOm } from '@/utils/domUtils'

const { t } = useI18n()
const columns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'bannerCode',
    label: t('reuse.bannerCode'),
    minWidth: '150'
  },
  {
    field: 'shortDescription',
    label: t('reuse.shortDescription'),
    minWidth: '300'
  },
  {
    field: 'linkBanner',
    label: t('reuse.linkBanner'),
    minWidth: '200',
    filterHeader: 'Name'
  },
  {
    field: 'image',
    label: t('reuse.image'),
    minWidth: '150',
    align: 'center',
    formatter: (record: Recordable, column: TableColumn, cellValue: TableSlotDefault) =>
      setImageDisplayInDOm(record, column, cellValue)
  },
  {
    field: 'position',
    label: t('reuse.position'),
    minWidth: '150',
    align: 'center',
    sortable: true
  },
  {
    field: 'startDate',
    label: t('reuse.startDate'),
    minWidth: '150',
    align: 'center',
    sortable: true
  },
  {
    field: 'endDate',
    label: t('reuse.endDate'),
    minWidth: '150',
    align: 'center',
    sortable: true
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
  }
])
</script>
<template>
  <tableDatetimeFilterBasicVue :columns="columns" :api="getBannerAdvertisementList" />
</template>
