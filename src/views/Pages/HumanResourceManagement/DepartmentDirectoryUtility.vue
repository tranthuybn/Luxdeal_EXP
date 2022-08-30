<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { TableOperator } from '../Components/TableBase'
import { useRouter } from 'vue-router'

const { t } = useI18n()

const schema = reactive<FormSchema[]>([
  {
    field: 'field1',
    label: t('reuse.generalInformation'),
    component: 'Divider'
  },
  {
    field: 'field2',
    label: t('reuse.branchCode'),
    component: 'Input',
    colProps: {
      span: 13
    }
  },
  {
    field: 'field3',
    label: t('reuse.branchName'),
    component: 'Input',
    colProps: {
      span: 13
    }
  },
  {
    field: 'field41',
    label: t('reuse.statusAndFunction'),
    component: 'Divider'
  },
  {
    field: 'field42',
    label: t('reuse.status'),
    component: 'Checkbox',
    value: [],
    componentProps: {
      options: [
        {
          label: t('reuse.active'),
          value: '1'
        },
        {
          label: t('reuse.stopActive'),
          value: '2'
        }
      ]
    }
  }
])
const router = useRouter()
const currentRoute = String(router.currentRoute.value.params.backRoute)
const title = router.currentRoute.value.meta.title
</script>

<template>
  <TableOperator :schema="schema" :nameBack="currentRoute" :title="title" />
</template>
