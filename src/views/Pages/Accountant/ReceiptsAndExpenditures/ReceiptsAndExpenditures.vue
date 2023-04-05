<script setup lang="ts">
import { h, reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../../Components/TableDataBase.vue'
import { getReceiptsExpendituresList } from '@/api/Business'
import { deleteReceiptOrPayment } from '@/api/Accountant'
import { ATTACH_DOCUMENT } from '@/utils/API.Variables'
import { filterHandler, changeMoney } from '@/utils/tsxHelper'
import {
  filtersReceiptExpenditure,
  filterStatusAccounting,
  filterReciprocalProfile,
  filterPaymentMethod,
  filterTransacted
} from '@/utils/filters'
import { dateTimeFormat, formatStatusAccounting, formatPaymentOrReceipts, formatPaymentMethod } from '@/utils/format'

const { t } = useI18n()

const columns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    sortable: true,
    align: 'center'
  },
  {
    field: 'code',
    label: t('reuse.formCode'),
    minWidth: '110',
  },
  {
    field: 'description',
    label: t('reuse.reasonRevenueExpenditure'),
    minWidth: '200',
  },
  {
    field: 'totalMoney',
    label: t('reuse.amountOfMoney'),
    minWidth: '110',
    sortable: true,
    align: 'right',
    formatter: (record: Recordable, __: TableColumn, _cellValue: TableSlotDefault) => {
      const x = changeMoney.format(parseInt(record.totalMoney))
      return x
    }
  },
  {
    field: 'type',
    label: t('reuse.revenueAndExpenditure'),
    minWidth: '100',
    filters: filtersReceiptExpenditure,
    formatter: (_: Recordable, __: TableColumn, cellValue: TableSlotDefault) => {
      return t(`${formatPaymentOrReceipts(cellValue)}`)
    },
  },
  {
    field: 'peopleName',
    label: t('reuse.subject'),
    minWidth: '200',
    headerFilter: 'Name',
  },
  {
    field: 'attachDocument',
    label: t('reuse.attachDocument'),
    minWidth: '150',
    filters: filterReciprocalProfile,
    formatter: (_record: Recordable, __: TableColumn, cellValue: TableSlotDefault) => {
      return h(cellValue ? h('div', ATTACH_DOCUMENT[1].label) : h('div', ATTACH_DOCUMENT[0].label))
    },
  },
  {
    field: 'accountNumber',
    label: t('reuse.accountCode'),
    minWidth: '140',
    headerFilter: 'Name',
  },
  {
    field: 'accountName',
    label: t('reuse.accountingAccountName'),
    minWidth: '140',
    headerFilter: 'Name',
  },
  {
    field: 'accountingDate',
    label: t('reuse.accountingDate'),
    minWidth: '150',
    sortable: true,    
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    },
  },
  {
    field: 'createdAt',
    label: t('reuse.createDate'),
    minWidth: '150',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    },
  },
  {
    field: 'createdBy',
    label: t('reuse.creator'),
    minWidth: '150',
    headerFilter: 'Name',
  },
  {
    field: 'typeOfPayment',
    label: t('reuse.choosePayment'),
    minWidth: '150',
    filters: filterPaymentMethod,
    filterMethod: filterHandler,
    formatter: (_: Recordable, __: TableColumn, cellValue: TableSlotDefault) => {
      return t(`${formatPaymentMethod(cellValue)}`)
    },
  },
  {
    field: 'transacted',
    label: t('reuse.alreadyPaid'),
    minWidth: '100',
    filters: filterTransacted,
    filterMethod: filterHandler,
    align: 'center',
    formatter: (record: Recordable, __: TableColumn, _cellValue: boolean) => {
      return h('input', {type: 'checkbox', checked: record.transacted})
    },
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '150',
    filters: filterStatusAccounting,
    filterMethod: filterHandler,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return t(`${formatStatusAccounting(cellValue)}`)
    },
  },
  {
    field: 'operator',
    label: t('reuse.operator'),
    minWidth: '90',
    align: 'center',
  }
])
</script>
<template>
  <tableDatetimeFilterBasicVue 
  :columns="columns" 
  :customOperator="4" 
  :delApi="deleteReceiptOrPayment" 
  :api="getReceiptsExpendituresList" 
  :titleAdd="t('reuse.receiptsAdd')"
  :titleAdd2="t('reuse.paymentsAdd')"
  customRouterName="payment-add"
  />
</template>
