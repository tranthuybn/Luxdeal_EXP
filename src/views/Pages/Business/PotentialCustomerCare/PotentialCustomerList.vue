<script setup lang="ts">
import { h, reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { filterHandler, formartDate } from '@/utils/tsxHelper'
import { getPotentialCustomerList, deletePotentialCustomer } from '@/api/Business'
import {
  filterStatus,
  filterPotentialCustomerStatus,
  filterServiceCustomerCare,
  filterSource,
  filterApproaching,
  filterTransactionStatus,
  filterTransaction
} from '@/utils/filters'
import {
  dateTimeFormat,
  formatPotentialCustomerStatusIdToText,
  formatServiceIdToText,
  onlineToText,
  historyTransactionToText,
  accessChannelToText,
  sourceToText
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
    field: 'historyTransaction',
    label: t('reuse.transaction'),
    minWidth: '200',
    filters: filterTransaction,
    filterMethod: filterHandler,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return t(`${historyTransactionToText(cellValue)}`)
    }
  },
  {
    field: 'isOnline',
    label: t('reuse.transactionStatus'),
    minWidth: '150',
    filterMethod: filterHandler,
    filters: filterTransactionStatus,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return t(`${onlineToText(cellValue)}`)
    }
  },
  {
    field: 'accessChannel',
    label: t('reuse.approachingChannel'),
    filterMethod: filterHandler,
    minWidth: '150',
    filters: filterApproaching,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return t(`${accessChannelToText(cellValue)}`)
    }
  },
  {
    field: 'note',
    label: t('reuse.note'),
    minWidth: '150'
  },
  {
    field: 'source',
    label: t('reuse.sourceNewCustomer'),
    minWidth: '150',
    filterMethod: filterHandler,
    filters: filterSource,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return t(`${sourceToText(cellValue)}`)
    }
  },
  {
    field: 'service',
    label: t('reuse.service'),
    minWidth: '100',
    filterMethod: filterHandler,
    filters: filterServiceCustomerCare,
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
    field: 'potentialCustomerHistorys',
    label: t('reuse.potentialCustomerHistory'),
    minWidth: '200',
    formatter: (_Recordable: Recordable, _: TableColumn, cellValue) => {
      if(cellValue && cellValue.length > 0 && cellValue[0] && cellValue[0].content) {
        return h('ul', [
        h('li', [
          h('span', [t('reuse.firstTime'), ':']),
          h('span', { style: { paddingLeft: '3px' } }, cellValue[0].content)
        ]),
        h('li', [
          h('span', [t('reuse.current'), ':']),
          h('span', { style: { paddingLeft: '3px' } }, cellValue[cellValue.length - 1]?.content)
        ])
         ])
      }
      return `${t('reuse.noHistoryOfCare')}`

    }
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
          h('span', { style: { paddingLeft: '3px' } }, formartDate(Recordable['feedbackDate']))
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
    filterMethod: filterHandler,
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
