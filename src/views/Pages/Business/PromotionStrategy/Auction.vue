<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../../Components/table-datetimeFilter-basic.vue'
import { getSellOrderList } from '@/api/Business'

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
    field: 'collaboratorsName',
    label: t('reuse.collaboratorsName'),
    minWidth: '150'
  },
  {
    field: 'collaboratorsCode',
    label: t('reuse.collaboratorsCode'),
    minWidth: '100'
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
    minWidth: '150'
  },
  {
    field: 'debt',
    label: t('reuse.debtCom'),
    minWidth: '150'
  },
  {
    field: 'withdrawalRequest',
    label: t('reuse.withdrawalRequest'),
    minWidth: '150'
  },
  {
    field: 'requestDate',
    label: t('reuse.requestDate'),
    minWidth: '150'
  },
  {
    field: 'requestStatus',
    label: t('reuse.requestStatus'),
    minWidth: '150'
  },
  {
    field: 'accountStatus',
    label: t('reuse.accountStatus'),
    minWidth: '200'
  }
])
</script>
<template>
  <tableDatetimeFilterBasicVue :columns="columns" :api="getSellOrderList" />
</template>
