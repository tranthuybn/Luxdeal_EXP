<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../../Components/tableType01-datetimefilter-basic.vue'
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
    field: 'collectionCode',
    label: t('reuse.collectionCode'),
    minWidth: '130'
  },
  {
    field: 'descriptions',
    label: t('reuse.descriptions'),
    minWidth: '250'
  },
  {
    field: 'subject',
    label: t('reuse.subject'),
    minWidth: '130'
  },
  {
    field: 'promotion',
    label: t('reuse.promotion'),
    minWidth: '150'
  },
  {
    field: 'start',
    label: t('reuse.start'),
    minWidth: '130'
  },
  {
    field: 'doneLabel',
    label: t('common.doneLabel'),
    minWidth: '130'
  },
  {
    field: 'createDate',
    label: t('reuse.createDate'),
    minWidth: '130'
  },
  {
    field: 'creator',
    label: t('reuse.creator'),
    minWidth: '130'
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
