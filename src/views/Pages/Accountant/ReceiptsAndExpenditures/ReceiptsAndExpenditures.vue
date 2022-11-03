<script setup lang="ts">
import { h, reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../../Components/TableDataBase.vue'
import { getReceiptsExpendituresList } from '@/api/Business'
import { PAYMENT, ATTACH_DOCUMENT, STATUS_TYPE } from '@/utils/API.Variables'
import {
  filtersReceiptExpenditure,
  filterStatusRevenueExpenditure,
  filterReciprocalProfile
} from '@/utils/filters'
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
    label: t('reuse.formCode'),
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
    minWidth: '200',
    headerFilter: 'Name'
  },
  {
    field: 'attachDocument',
    label: t('reuse.reciprocalProfile'),
    minWidth: '150',
    filters: filterReciprocalProfile,
    formatter: (_record: Recordable, __: TableColumn, cellValue: TableSlotDefault) => {
      return h(cellValue ? h('div', ATTACH_DOCUMENT[1].label) : h('div', ATTACH_DOCUMENT[0].label))
    }
  },
  {
    field: 'accountNumber',
    label: t('reuse.accountCode'),
    minWidth: '150',
    headerFilter: 'Name'
  },
  {
    field: 'accountName',
    label: t('login.username'),
    minWidth: '150',
    headerFilter: 'Name'
  },
  {
    field: 'accountingDate',
    label: t('reuse.accountingDate'),
    minWidth: '150',
    sortable: true
  },
  {
    field: 'createdAt',
    label: t('reuse.createDate'),
    minWidth: '130',
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
    filters: filterStatusRevenueExpenditure,
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
  <tableDatetimeFilterBasicVue :columns="columns" :api="getReceiptsExpendituresList" />
</template>
