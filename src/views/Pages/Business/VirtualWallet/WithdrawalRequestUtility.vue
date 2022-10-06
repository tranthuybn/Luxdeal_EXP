<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { h, reactive } from 'vue'
import { useRouter } from 'vue-router'
import TableOperatorPaymentRequest from './TableOperatorPaymentRequest.vue'
const { t } = useI18n()

//get data from router
const router = useRouter()
const id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)

const formVirtualWallet = reactive<FormSchema[]>([
  {
    field: 'Divider',
    label: t('reuse.customerInfo'),
    component: 'Divider'
  },
  {
    field: 'customer',
    label: t('formDemo.chooseACustomer'),
    colProps: { span: 24 }
  },
  {
    field: 'Divider',
    label: t('reuse.withdrawalRequest'),
    component: 'Divider'
  },
  {
    field: 'codeRequest',
    label: t('reuse.codeRequest'),
    colProps: { span: 24 }
  },
  {
    field: 'amountOfMoney',
    label: t('reuse.amountOfMoney'),
    component: 'Input',
    colProps: { span: 24 },
    componentProps: {
      placeholder: t('formDemo.enterPrice'),
      suffixIcon: h('div', 'đ')
    }
  },
  {
    field: 'receiptOrPayment',
    label: t('formDemo.receiptOrPayment'),
    component: 'Select',
    colProps: { span: 20 },
    componentProps: {
      placeholder: t('reuse.chooseReceiptAndPayment'),
      style: 'width: 100%',
      options: [
        { label: t('reuse.using'), value: true },
        { label: t('reuse.lockPoint'), value: false }
      ]
    }
  },
  {
    field: 'buttonReceiptOrPayment',
    colProps: { span: 4 },
    formItemProps: {
      labelWidth: '0px'
    }
  },
  {
    field: 'paymentProposal',
    label: t('router.paymentProposal'),
    component: 'Select',
    colProps: { span: 20 },
    componentProps: {
      placeholder: t('reuse.choosePaymentProposal'),
      style: 'width: 100%',
      options: [
        { label: t('reuse.using'), value: true },
        { label: t('reuse.lockPoint'), value: false }
      ]
    }
  },
  {
    field: 'buttonPaymentProposal',
    colProps: { span: 4 },
    formItemProps: {
      labelWidth: '0px'
    }
  },
  {
    field: 'status',
    label: t('reuse.status'),
    value: [],
    component: 'Checkbox',
    colProps: { span: 13 },
    componentProps: {
      options: [{ label: t('reuse.using'), value: true }]
    }
  }
])
</script>
<template>
  <TableOperatorPaymentRequest
    :id="id"
    :type="type"
    :schema="formVirtualWallet"
    :title="t('reuse.detailVirtualWalletRequest')"
  />
</template>
