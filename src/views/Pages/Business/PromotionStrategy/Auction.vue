<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../../Components/TableDataBase.vue'
import { getAuctionList } from '@/api/Business'
import { filterAuctionResult, filterAuctionStatus } from '@/utils/filters'

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
    field: 'productCode',
    label: t('reuse.productCode'),
    minWidth: '200'
  },
  {
    field: 'floorPrice',
    label: t('reuse.floorPrice'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'priceStep',
    label: t('reuse.priceStep'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'highestBid',
    label: t('reuse.highestBid'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'joined',
    label: t('reuse.joined'),
    minWidth: '150',
    align: 'right'
  },
  {
    field: 'result',
    label: t('reuse.result'),
    minWidth: '150',
    filters: filterAuctionResult
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
    filters: filterAuctionStatus
  }
])
</script>
<template>
  <tableDatetimeFilterBasicVue :columns="columns" :api="getAuctionList" />
</template>
