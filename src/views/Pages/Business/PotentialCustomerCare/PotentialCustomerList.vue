<script setup lang="ts">
import { h, reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'

import { getPotentialCustomerList, deletePotentialCustomer } from '@/api/Business'
import {
  filterStatus,
  filterPotentialCustomerStatus,
  filterService,
  filterSource,
  filterApproaching,
  filterTransactionStatus,
  filterTransaction
} from '@/utils/filters'
import {
  dateTimeFormat,
  formatPotentialCustomerStatusIdToText,
  formatServiceIdToText,
  onlineToText
} from '@/utils/format'
import tableDatetimeFilterBasicVue from '../../Components/TableDataBase.vue'

const { t } = useI18n()
const columns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'potentialCustomerHistorys[0].staffName',
    label: t('reuse.saleCare'),
    minWidth: '150',
    headerFilter: 'Name'
  },
  {
    field: 'customerInfo',
    label: t('reuse.customerInfo'),
    minWidth: '250',
    formatter: (Recordable: Recordable, _: TableColumn, __: boolean) => {
      return h('ul', [
        h('li', [
          h('span', [t('reuse.name'), ':']),
          h('span', { style: { paddingLeft: '3px' } }, Recordable['name'])
        ]),
        h('li', [
          h('span', [t('reuse.phoneNumber'), ':']),
          h('span', { style: { paddingLeft: '3px' } }, Recordable['phonenumber'])
        ]),
        h('li', [
          h('span', [t('reuse.email'), ':']),
          h('span', { style: { paddingLeft: '3px' } }, Recordable['email'])
        ]),
        h('li', [
          h('span', [t('reuse.link'), ':']),
          h('span', { style: { paddingLeft: '3px' } }, Recordable['link'])
        ])
      ])
    }
  },
  {
    field: 'historyTransactionName',
    label: t('reuse.transaction'),
    minWidth: '200',
    filters: filterTransaction
  },
  {
    field: 'isOnline',
    label: t('reuse.transactionStatus'),
    minWidth: '150',
    filters: filterTransactionStatus,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return t(`${onlineToText(cellValue)}`)
    }
  },
  {
    field: 'accessChannelName',
    label: t('reuse.approachingChannel'),
    minWidth: '150',
    filters: filterApproaching
  },
  {
    field: 'note',
    label: t('reuse.note'),
    minWidth: '150'
  },
  {
    field: 'sourceName',
    label: t('reuse.sourceNewCustomer'),
    minWidth: '100',
    filters: filterSource
  },
  {
    field: 'service',
    label: t('reuse.service'),
    minWidth: '100',
    filters: filterService,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return t(`${formatServiceIdToText(cellValue)}`)
    }
  },
  {
    field: 'serviceDetail',
    label: t('reuse.serviceDetail'),
    minWidth: '200'
  },
  {
    field: 'potentialCustomerHistorys[0].content',
    label: t('reuse.potentialCustomerHistory'),
    minWidth: '200'
  },
  {
    field: 'order',
    label: t('reuse.order'),
    minWidth: '150'
  },
  {
    field: 'feedback',
    label: t('reuse.feedBack'),
    minWidth: '180',
    filters: filterStatus,
    formatter: (Recordable: Recordable, _: TableColumn, __: boolean) => {
      return h('ul', [
        h('li', [
          h('span', [t('reuse.date'), ':']),
          h('span', { style: { paddingLeft: '3px' } }, Recordable['feedbackDate'])
        ]),
        h('li', [
          h('span', [t('reuse.rating'), ':']),
          h('span', { style: { paddingLeft: '3px' } }, Recordable['feedbackStar'])
        ]),
        h('li', [
          h('span', [t('reuse.content'), ':']),
          h('span', { style: { paddingLeft: '3px' } }, Recordable['feedbackContent'])
        ])
      ])
    }
  },
  {
    field: 'createdAt',
    label: t('reuse.createDate'),
    minWidth: '150',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'createdBy',
    label: t('reuse.creator'),
    minWidth: '150',
    headerFilter: 'Name'
  },
  {
    field: 'statusId',
    label: t('reuse.status'),
    minWidth: '180',
    filters: filterPotentialCustomerStatus,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return t(`${formatPotentialCustomerStatusIdToText(cellValue)}`)
    }
  },
])
</script>
<template>
  <tableDatetimeFilterBasicVue
    :columns="columns"
    :api="getPotentialCustomerList"
    :delApi="deletePotentialCustomer"
  />
</template>
