<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { TableOperator } from '../Components/TableBase'

const { t } = useI18n()

const schema = reactive<FormSchema[]>([
  {
    field: 'field13',
    label: t('reuse.typeAccount'),
    component: 'Divider'
  },
  {
    field: 'field14',
    label: t('reuse.chooseRankAccount'),
    component: 'Select',
    componentProps: {
      options: [
        {
          label: t('reuse.rank1Account'),
          value: '1'
        },
        {
          label: t('reuse.rank2Account'),
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
    label: t('reuse.badgeAccount1'),
    component: 'Input',
    colProps: {
      span: 13
    }
  },
  {
    field: 'field3',
    label: t('reuse.nameAccount1'),
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
          label: t('reuse.closeAccount'),
          value: '2'
        }
      ]
    }
  }
])
</script>

<template>
  <TableOperator :schema="schema" :hasImage="false" />
</template>
