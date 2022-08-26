<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../../Components/tableType01-datetimefilter-basic.vue'
import { getCollaboratorsList } from '@/api/Business'
import { filterStatusCustomer } from '@/utils/filters'

const { t } = useI18n()
const columns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'collaboratorsCode',
    label: t('reuse.collaboratorsCode'),
    minWidth: '100'
  },

  {
    field: 'collaboratorsName',
    label: t('reuse.collaboratorsName'),
    minWidth: '150'
  },

  {
    field: 'contact',
    label: t('reuse.contact'),
    minWidth: '250'
  },
  {
    field: 'account',
    label: t('reuse.account'),
    minWidth: '200'
  },
  {
    field: 'totalMoney',
    label: t('reuse.totalMoney'),
    minWidth: '150',
    align: 'right',
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
    minWidth: '130',
    headerFilter: 'Name'
  },
  {
    field: 'accountStatus',
    label: t('reuse.accountStatus'),
    minWidth: '200',
    filters: filterStatusCustomer
  }
])
</script>
<template>
  <tableDatetimeFilterBasicVue :columns="columns" :api="getCollaboratorsList" />
</template>
