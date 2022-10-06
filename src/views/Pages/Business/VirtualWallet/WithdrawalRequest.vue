<script setup lang="ts">
import { reactive, h } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../../Components/TableDataBase.vue'
import { getCustomerVirtualEWalletList } from '@/api/Business'
import { filterPaymentCheckbox, filterPaymentWalletStatus } from '@/utils/filters'
import { ElCheckbox } from 'element-plus'
const { t } = useI18n()
const columns = reactive<TableColumn[]>([
  {
    field: 'customerCode',
    label: t('reuse.customerCode'),
    minWidth: '150'
  },
  {
    field: 'customerName',
    label: t('reuse.customerName'),
    minWidth: '300'
  },
  {
    field: 'amountOfMoney',
    label: t('reuse.amountOfMoney'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'codeRequest',
    label: t('reuse.codeRequest'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'attachments',
    label: t('formDemo.attachments'),
    minWidth: '150',
    align: 'left'
  },
  {
    field: 'receiptOrPayment',
    label: t('formDemo.receiptOrPayment'),
    minWidth: '150'
  },
  {
    field: 'paymentProposal',
    label: t('router.paymentProposal'),
    minWidth: '150'
  },
  {
    field: 'alreadyPaidForTt',
    label: t('formDemo.alreadyPaidForTt'),
    minWidth: '150',
    align: 'center',
    filters: filterPaymentCheckbox,
    formatter: (_record: Recordable, __column: TableColumn, cellValue: boolean) => {
      return h(ElCheckbox, {
        style: { margin: 'auto' },
        modelValue: cellValue
      })
    }
  },
  {
    field: 'updatedAt',
    label: t('reuse.createDate'),
    minWidth: '150',
    align: 'center',
    sortable: true
  },
  {
    field: 'creator',
    label: t('reuse.creator'),
    minWidth: '150',
    align: 'left',
    headerFilter: 'Name'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '150',
    filters: filterPaymentWalletStatus
  }
])
</script>
<template>
  <tableDatetimeFilterBasicVue
    :columns="columns"
    :api="getCustomerVirtualEWalletList"
    :customOperator="5"
  />
</template>
