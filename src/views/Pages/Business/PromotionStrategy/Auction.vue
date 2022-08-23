<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../../Components/tableType01-datetimefilter-basic.vue'
import { getAuctionList } from '@/api/Business'

const { t } = useI18n()
const columns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'auctionCode',
    label: t('reuse.auctionCode'),
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
    field: 'productCode',
    label: t('reuse.productCode'),
    minWidth: '200'
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
    field: 'comboPrice',
    label: t('reuse.comboPrice'),
    minWidth: '150'
  },
  {
    field: 'floorPrice',
    label: t('reuse.floorPrice'),
    minWidth: '150'
  },
  {
    field: 'priceStep',
    label: t('reuse.priceStep'),
    minWidth: '150'
  },
  {
    field: 'highestBid',
    label: t('reuse.highestBid'),
    minWidth: '150'
  },
  {
    field: 'joined',
    label: t('reuse.joined'),
    minWidth: '150'
  },
  {
    field: 'result',
    label: t('reuse.result'),
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
  <tableDatetimeFilterBasicVue :columns="columns" :api="getAuctionList" />
</template>
