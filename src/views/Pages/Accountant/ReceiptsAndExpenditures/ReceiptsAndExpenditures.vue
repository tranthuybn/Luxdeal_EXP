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
const changeMoney = new Intl.NumberFormat('vi', {
  style: 'currency',
  currency: 'vnd',
  minimumFractionDigits: 0
})
const columns = reactive<TableColumn[]>([
  {
    field: 'id',
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
    formatter: (row, _column, _cellValue) => {
      const x = changeMoney.format(parseInt(row.totalMoney))
      return x
    }
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
    field: 'paymentMethod',
    label: t('reuse.choosePayment'),
    minWidth: '150',
    headerFilter: 'Name',
  },
  {
    field: 'paymentType',
    label: t('reuse.alreadyPaid'),
    minWidth: '100',
    filters: [],
    align: 'center',
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return h('input', {type: 'checkbox', checked: cellValue})
    },
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '150',
    filters: filterStatusAccouting,
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
  :delApi="deleteAReceiptOrPaymentVoucher" 
  :api="getReceiptsExpendituresList" 
  />
</template>
