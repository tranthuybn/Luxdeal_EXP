<script setup lang="ts">
import { h, reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../../Components/TableDataBase.vue'
import { getReceiptsExpendituresList } from '@/api/Business'
import { deleteAReceiptOrPaymentVoucher } from '@/api/Accountant'
import { PAYMENT, ATTACH_DOCUMENT } from '@/utils/API.Variables'
import {
  filtersReceiptExpenditure,
  filterStatusAccouting,
  filterReciprocalProfile,
} from '@/utils/filters'
import { dateTimeFormat, formatStatusAccounting } from '@/utils/format'

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
    minWidth: '110',
    headerAlign: 'left',
  },
  {
    field: 'description',
    label: t('reuse.reasonRevenueExpenditure'),
    minWidth: '200',
    headerAlign: 'left',
  },
  {
    field: 'totalMoney',
    label: t('reuse.amountOfMoney'),
    minWidth: '120',
    sortable: true,
    headerAlign: 'left',
  },
  {
    field: 'typeOfPayment',
    label: t('reuse.revenueAndExpenditure'),
    minWidth: '100',
    filters: filtersReceiptExpenditure,
    formatter: (record: Recordable, __: TableColumn, _cellValue: TableSlotDefault) => {
      if (record.typeOfPayment == 1) {
        return h('div', PAYMENT[0].label)
      } else {
        return h('div', PAYMENT[1].label)
      }
    },
    headerAlign: 'left',
  },
  {
    field: 'peopleName',
    label: t('reuse.subject'),
    minWidth: '200',
    headerFilter: 'Name',
    headerAlign: 'left',
  },
  {
    field: 'attachDocument',
    label: t('reuse.attachDocument'),
    minWidth: '150',
    filters: filterReciprocalProfile,
    formatter: (_record: Recordable, __: TableColumn, cellValue: TableSlotDefault) => {
      return h(cellValue ? h('div', ATTACH_DOCUMENT[1].label) : h('div', ATTACH_DOCUMENT[0].label))
    },
    headerAlign: 'left',
  },
  {
    field: 'accountNumber',
    label: t('reuse.accountCode'),
    minWidth: '140',
    headerFilter: 'Name',
    headerAlign: 'left',
  },
  {
    field: 'accountName',
    label: t('reuse.accountingAccountName'),
    minWidth: '140',
    headerFilter: 'Name',
    headerAlign: 'left',
  },
  {
    field: 'accountingDate',
    label: t('reuse.accountingDate'),
    minWidth: '150',
    sortable: true,
    headerAlign: 'left',
  },
  {
    field: 'createdAt',
    label: t('reuse.createDate'),
    minWidth: '130',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    },
    headerAlign: 'left',
  },
  {
    field: 'createdBy',
    label: t('reuse.creator'),
    minWidth: '130',
    headerFilter: 'Name',
    headerAlign: 'left',
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '150',
    filters: filterStatusAccouting,
    headerAlign: 'left',
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return t(`${formatStatusAccounting(cellValue)}`)
    },
  },
])
</script>
<template>
  <tableDatetimeFilterBasicVue 
  :columns="columns" 
  :delApi="deleteAReceiptOrPaymentVoucher" 
  :api="getReceiptsExpendituresList" 
  />
</template>
