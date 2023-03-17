<script setup lang="ts">
import { provide, reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../../Components/TableDataBase.vue'
import { getCampaignList } from '@/api/Business'
import { filterPromotionPrice, filterTableStatus, filterSubject } from '@/utils/filters'
import { dateTimeFormat, formatStatusVoucher, formatSubjectVoucher } from '@/utils/format'
import { PROMOTION_STRATEGY } from '@/utils/API.Variables'

const { t } = useI18n()
const params = { CampaignType: PROMOTION_STRATEGY[2].key }
provide('parameters', {
  params
})

const columns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center',

  },
  {
    field: 'code',
    label: t('reuse.newproductCode'),
    minWidth: '130',
    headerAlign: 'left',
  },
  {
    field: 'description',
    label: t('reuse.descriptions'),
    minWidth: '250',
    headerAlign: 'left',
  },
  {
    field: 'targetType',
    label: t('reuse.subject'),
    minWidth: '130',
    headerAlign: 'left',
    filters: filterSubject,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return t(`${formatSubjectVoucher(cellValue)}`)
    }
  },
  {
    field: 'reduce',
    label: t('reuse.promotion'),
    minWidth: '150',
    headerAlign: 'left',
    filters: filterPromotionPrice
  },
  {
    field: 'fromDate',
    label: t('reuse.start'),
    minWidth: '130',
    headerAlign: 'left',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'toDate',
    label: t('common.doneLabel'),
    minWidth: '130',
    headerAlign: 'left',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'createdAt',
    label: t('reuse.createDate'),
    minWidth: '130',
    headerAlign: 'left',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'createdBy',
    label: t('reuse.creator'),
    minWidth: '130',
    headerAlign: 'left',
    headerFilter: 'Name'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '150',
    headerAlign: 'left',
    filters: filterTableStatus,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
     return t(`${formatStatusVoucher(cellValue)}`)
    }
  },
  {
    field: 'operator',
    label: t('reuse.operator'),
    minWidth: '150',
    headerAlign: 'left',
    align: 'center'
  }
])
</script>
<template>
  <tableDatetimeFilterBasicVue :columns="columns" :api="getCampaignList" :customOperator="5" />
</template>
