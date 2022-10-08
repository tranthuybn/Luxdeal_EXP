<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { h, reactive } from 'vue'
import { useRouter } from 'vue-router'
import TableOperator from '../../Components/TableBase/src/TableOperator.vue'
import { useValidator } from '@/hooks/web/useValidator'
const { t } = useI18n()

//get data from router
const router = useRouter()
const id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)

const formVirtualWalletSettings = reactive<FormSchema[]>([
  {
    field: 'Divider',
    label: t('reuse.generalInformation'),
    component: 'Divider'
  },
  {
    field: 'moneyPaymentCode',
    label: t('reuse.moneyPaymentCode'),
    value: 'NT2001',
    colProps: { span: 24 },
    component: 'Input',
    componentProps: {
      disabled: true
    }
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
    field: 'date',
    label: t('formDemo.duration'),
    component: 'DatePicker',
    colProps: { span: 24 },
    componentProps: {
      type: 'daterange',
      style: 'width: 100%',
      editable: false
    }
  },
  {
    field: 'shortDescription',
    label: t('reuse.shortDescription'),
    colProps: { span: 24 },
    component: 'Input',
    componentProps: {
      placeholder: t('formDemo.enterShortDescription')
    }
  },
  {
    field: 'Divider',
    label: t('reuse.status'),
    component: 'Divider'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    value: [],
    component: 'Checkbox',
    colProps: { span: 13 },
    componentProps: {
      options: [{ label: t('reuse.pending'), value: true }]
    }
  }
])
const title = router.currentRoute.value.meta.title
const { required, ValidService } = useValidator()
const rules = reactive({
  customer: [required()],
  amountOfMoney: [required(), { validator: ValidService.checkMoney.validator }],
  date: [required()],
  shortDescription: [required(), { validator: ValidService.checkNameLength.validator }]
})
</script>
<template>
  <TableOperator
    :id="id"
    :type="type"
    :rules="rules"
    :schema="formVirtualWalletSettings"
    :title="title"
  />
</template>
