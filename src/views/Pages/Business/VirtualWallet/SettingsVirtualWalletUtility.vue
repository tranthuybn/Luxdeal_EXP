<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { h, reactive } from 'vue'
import { useRouter } from 'vue-router'
import TableOperator from '../../Components/TableBase/src/TableOperator.vue'
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
    field: 'startDate',
    label: t('formDemo.duration'),
    component: 'DatePicker',
    colProps: { span: 12 },
    componentProps: {
      style: 'width: 100%',
      editable: false,
      placeholder: t('formDemo.startDay')
    }
  },
  {
    field: 'endDate',
    component: 'DatePicker',
    colProps: { span: 12 },
    formItemProps: {
      labelWidth: '0px'
    },
    componentProps: {
      style: 'width: 100%',
      editable: false,
      placeholder: t('formDemo.endDay')
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
    label: t('reuse.generalInformation'),
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
</script>
<template>
  <TableOperator :id="id" :type="type" :schema="formVirtualWalletSettings" :title="title" />
</template>
<style scoped>
:deep(.el-input__wrapper) {
  width: 100%;
}
</style>
