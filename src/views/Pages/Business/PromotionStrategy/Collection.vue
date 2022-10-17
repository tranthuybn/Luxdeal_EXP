<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../../Components/TableDataBase.vue'
import { getcollectionList } from '@/api/Business'
import { filterPromotionPrice, filterTableStatus, filterSubject } from '@/utils/filters'
import { formatStatusVoucher } from '@/utils/format'

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
    minWidth: '130',
    filters: filterSubject
  },
  {
    field: 'promotion',
    label: t('reuse.promotion'),
    minWidth: '150',
    filters: filterPromotionPrice
  },
  {
    field: 'start',
    label: t('reuse.start'),
    minWidth: '130',
    align: 'center',
    sortable: true
  },
  {
    field: 'doneLabel',
    label: t('common.doneLabel'),
    minWidth: '130',
    align: 'center',
    sortable: true
  },
  {
    field: 'createDate',
    label: t('reuse.createDate'),
    minWidth: '130',
    align: 'center',
    sortable: true
  },
  {
    field: 'creator',
    label: t('reuse.creator'),
    minWidth: '130',
    headerFilter: 'Name'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '150',
    filters: filterTableStatus,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return formatStatusVoucher(cellValue)
    }
  }
])
</script>
<template>
  <tableDatetimeFilterBasicVue :columns="columns" :api="getcollectionList" />
</template>
