<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../../Components/tableType01-datetimefilter-basic.vue'
import { getComboList } from '@/api/Business'

const { t } = useI18n()
const columns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'comboCode',
    label: t('reuse.comboCode'),
    minWidth: '130'
  },
  {
    field: 'descriptions',
    label: t('reuse.descriptions'),
    minWidth: '250'
  },
  {
    field: 'ServiceLibrarySpaService',
    label: t('router.ServiceLibrarySpaService'),
    minWidth: '130'
  },
  {
    field: 'productCode',
    label: t('reuse.productCode'),
    minWidth: '200'
  },
  {
    field: 'cost',
    label: t('reuse.cost'),
    minWidth: '150'
  },
  {
    field: 'comboPrice',
    label: t('reuse.comboPrice'),
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
  <tableDatetimeFilterBasicVue :columns="columns" :api="getComboList" />
</template>
