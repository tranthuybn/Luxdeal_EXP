<script setup lang="ts">
import { h, reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../../Components/TableDataBase.vue'
import { filtersReceiptExpenditure } from '@/utils/filters'
import { PAYMENT, PEOPLE_TYPE, ATTACH_DOCUMENT, STATUS_TYPE } from '@/utils/API.Variables'
import { getPaymentList } from '@/api/Business'
import { dateTimeFormat } from '@/utils/format'
const { t } = useI18n()

const columns = reactive<TableColumn[]>([
  {
    field: 'id',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'code',
    label: t('reuse.proposalCode'),
    minWidth: '150'
  },
  {
    field: 'description',
    label: t('reuse.contentDescriptions'),
    minWidth: '150'
  },
  {
    field: 'totalMoney',
    label: t('reuse.amountOfMoney'),
    minWidth: '100',
    align: 'right',
    sortable: true
  },
  {
    field: 'paymentType',
    label: t('reuse.revenueAndExpenditure'),
    minWidth: '100',
    filters: filtersReceiptExpenditure,
    formatter: (_record: Recordable, __: TableColumn, cellValue: TableSlotDefault) => {
      return h(cellValue ? h('div', PAYMENT[0].label) : h('div', PAYMENT[1].label))
    }
  },
  {
    field: 'peopleName',
    label: t('reuse.subject'),
    minWidth: '200'
  },
  {
    field: 'pepopleType',
    label: t('reuse.type'),
    minWidth: '150',
    align: 'left',
    formatter: (record: Recordable, __: TableColumn, _cellValue: TableSlotDefault) => {
      if (record.pepopleType == 1) {
        return h('div', PEOPLE_TYPE[0].label)
      } else if (record.pepopleType == 1) {
        return h('div', PEOPLE_TYPE[1].label)
      } else {
        return h('div', PEOPLE_TYPE[2].label)
      }
    }
  },
  {
    field: 'attachDocument',
    label: t('reuse.reciprocalProfile'),
    minWidth: '150',
    formatter: (_record: Recordable, __: TableColumn, cellValue: TableSlotDefault) => {
      return h(cellValue ? h('div', ATTACH_DOCUMENT[1].label) : h('div', ATTACH_DOCUMENT[0].label))
    }
  },
  {
    field: 'createdAt',
    label: t('reuse.createDate'),
    minWidth: '130',
    align: 'center',
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'createdBy',
    label: t('reuse.creator'),
    minWidth: '130'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '150',
    align: 'center',
    formatter: (record: Recordable, __: TableColumn, _cellValue: TableSlotDefault) => {
      if (record.pepopleType == 0) {
        return h('div', STATUS_TYPE[0].label)
      } else if (record.pepopleType == 1) {
        return h('div', STATUS_TYPE[1].label)
      } else {
        return h('div', STATUS_TYPE[2].label)
      }
    }
  }
])
</script>
<template>
  <tableDatetimeFilterBasicVue :columns="columns" :api="getPaymentList" />
</template>
