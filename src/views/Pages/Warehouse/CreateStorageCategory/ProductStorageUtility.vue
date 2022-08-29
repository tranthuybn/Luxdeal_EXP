<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { TableOperator } from '../../Components/TableBase'
import { useRoute } from 'vue-router'

const { t } = useI18n()

const schema = reactive<FormSchema[]>([
  {
    field: 'field13',
    label: t('reuse.typeCategory'),
    component: 'Divider'
  },
  {
    field: 'field14',
    label: t('reuse.chooseRankCategory'),
    component: 'Select',
    componentProps: {
      options: [
        {
          label: t('reuse.rank1Category'),
          value: '1'
        },
        {
          label: t('reuse.rank2Category'),
          value: '2'
        }
      ]
    },
    colProps: {
      span: 13
    }
  },
  {
    field: 'field1',
    label: t('reuse.generalInformation'),
    component: 'Divider'
  },
  {
    field: 'field2',
    label: t('reuse.nameRank1Category'),
    component: 'Input',
    colProps: {
      span: 13
    }
  },
  {
    field: 'field3',
    label: t('reuse.displayPosition'),
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
          label: t('reuse.stopShowAppWeb'),
          value: '2'
        },
        {
          label: t('reuse.stopActive'),
          value: '3'
        }
      ]
    }
  }
])
const route = useRoute()
const currentRoute = String(route.params.backRoute)
</script>

<template>
  <TableOperator :schema="schema" :nameBack="currentRoute" title="Warehouse" />
</template>
