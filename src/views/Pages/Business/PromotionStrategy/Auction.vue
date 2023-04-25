<script setup lang="ts">
import { provide, reactive, h } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../../Components/TableDataBase.vue'
import { getCampaignList } from '@/api/Business'
import { filterAuctionResult, filterTableStatus } from '@/utils/filters'
import { PROMOTION_STRATEGY } from '@/utils/API.Variables'
import { dateTimeFormat, formatStatusVoucher } from '@/utils/format'


const { t } = useI18n()
const params = { CampaignType: PROMOTION_STRATEGY[5].key }
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
    label: t('reuse.auctionCode'),
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
    field: 'productCode',
    label: t('reuse.productCode'),
    minWidth: '200',
    headerAlign: 'left',
    formatter: (row, _column, _cellValue, _index) => {
      return h(
        'ul',
        // assuming `items` is a ref with array value
        row?.productProperties.map((item) => {
          if (item.code) {
            return h('span', `${item.code}`)
          }
        })
      )
    }
  },
  {
    field: 'floorPrice',
    label: t('reuse.floorPrice'),
    minWidth: '150',
    headerAlign: 'left',
    align: 'right',
    sortable: true
  },
  {
    field: 'priceStep',
    label: t('reuse.priceStep'),
    minWidth: '150',
    align: 'right',
    headerAlign: 'left',
    sortable: true
  },
  {
    field: 'highestBid',
    label: t('reuse.highestBid'),
    minWidth: '150',
    align: 'right',
    headerAlign: 'left',
    sortable: true
  },
  {
    field: 'joined',
    label: t('reuse.joined'),
    minWidth: '150',
    headerAlign: 'left',
  },
  {
    field: 'result',
    label: t('reuse.result'),
    minWidth: '150',
    headerAlign: 'left',
    filters: filterAuctionResult
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
  }
])
</script>
<template>
  <tableDatetimeFilterBasicVue :columns="columns" :api="getCampaignList" :customOperator="5"/>
</template>
