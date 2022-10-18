<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../../Components/TableDataBase.vue'
import { PROMOTION_STRATEGY } from '@/utils/API.Variables'
import { getCampaignList } from '@/api/Business'
import { provide } from 'vue'
import {
  filterPromotionPrice,
  filterTableStatus,
  filterSubject,
  filterVoucherType
} from '@/utils/filters'
import { dateTimeFormat } from '@/utils/format'

const { t } = useI18n()
const params = { CampaignType: PROMOTION_STRATEGY[3].key }
provide('parameters', {
  params
})
const columns = reactive<TableColumn[]>([
  {
    field: 'id',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'code',
    label: t('router.voucherCode'),
    minWidth: '130'
  },
  {
    field: 'description',
    label: t('reuse.descriptions'),
    minWidth: '250'
  },
  {
    field: 'targetType',
    label: t('reuse.type'),
    minWidth: '200',
    filters: filterVoucherType
  },
  {
    field: 'targetType',
    label: t('formDemo.condition'),
    minWidth: '200',
    filters: filterVoucherType
  },
  {
    field: 'targetType',
    label: t('reuse.subject'),
    minWidth: '130',
    filters: filterSubject
  },
  {
    field: 'reduce',
    label: t('reuse.promotion'),
    minWidth: '150',
    filters: filterPromotionPrice
  },
  {
    field: 'fromDate',
    label: t('reuse.start'),
    minWidth: '130',
    align: 'center',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'toDate',
    label: t('common.doneLabel'),
    minWidth: '130',
    align: 'center',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'createdAt',
    label: t('reuse.createDate'),
    minWidth: '130',
    align: 'center',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'createdBy',
    label: t('reuse.creator'),
    minWidth: '130',
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
  <tableDatetimeFilterBasicVue :columns="columns" :api="getCampaignList" />
</template>
