<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../../Components/TableDataBase.vue'
import { getPoliciesGuidelinesList } from '@/api/NewsAndAdvertisement'
import { filterTypePolicies, filterShow } from '@/utils/filters'
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
    field: 'title',
    label: t('reuse.title'),
    minWidth: '150'
  },
  {
    field: 'content',
    label: t('reuse.content'),
    minWidth: '200'
  },
  {
    field: 'type',
    label: t('reuse.type'),
    minWidth: '100'
  },
  {
    field: 'show',
    label: t('tableDemo.show'),
    minWidth: '150',
    filters: filterShow
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
    filters: filterTypePolicies
  }
])
</script>
<template>
  <tableDatetimeFilterBasicVue :columns="columns" :api="getPoliciesGuidelinesList" />
</template>
