<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../../Components/table-datetimeFilter-basic.vue'
import { getcollectionList } from '@/api/Business'

const { t } = useI18n()
const columns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'createDate',
    label: t('reuse.createDate'),
    minWidth: '150'
  },
  {
    field: 'collectionCode',
    label: t('reuse.collectionCode'),
    minWidth: '150'
  },
  {
    field: 'descriptions',
    label: t('reuse.descriptions'),
    minWidth: '100'
  },
  {
    field: 'subject',
    label: t('reuse.subject'),
    minWidth: '250'
  },
  {
    field: 'start',
    label: t('countToDemo.start'),
    minWidth: '200'
  },
  {
    field: 'doneLabel',
    label: t('common.doneLabel'),
    minWidth: '150'
  },
  {
    field: 'promotion',
    label: t('reuse.promotion'),
    minWidth: '150'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '150'
  }
])
</script>
<template>
  <tableDatetimeFilterBasicVue :columns="columns" :api="getcollectionList" />
</template>
