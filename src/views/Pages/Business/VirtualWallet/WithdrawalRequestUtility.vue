<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
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
    field: 'customerCode',
    label: t('reuse.customerCode'),
    component: 'Input',
    colProps: { span: 13 }
  },
  {
    field: 'customerName',
    label: t('reuse.customerName'),
    component: 'Input',
    colProps: { span: 13 }
  },
  {
    field: 'phoneNumber',
    label: t('reuse.phoneNumber'),
    component: 'Input',
    colProps: { span: 13 }
  },
  { field: 'email', label: t('reuse.email'), component: 'Input', colProps: { span: 13 } },
  {
    field: 'Divider2',
    label: t('reuse.statusPoint'),
    component: 'Divider'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    component: 'Radio',
    colProps: { span: 13 },
    componentProps: {
      options: [
        { label: t('reuse.using'), value: true },
        { label: t('reuse.lockPoint'), value: false }
      ]
    }
  }
])
</script>
<template>
  <div></div>
</template>
