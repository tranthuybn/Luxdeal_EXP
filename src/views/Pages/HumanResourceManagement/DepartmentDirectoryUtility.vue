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
    colProps: {
      span: 24
    },
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
const schema2 = reactive<FormSchema[]>([
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
    colProps: {
      span: 24
    },
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
const schema3 = reactive<FormSchema[]>([
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
    colProps: {
      span: 24
    },
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
const schema4 = reactive<FormSchema[]>([
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
    colProps: {
      span: 24
    },
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
const tab = router.currentRoute.value.params.tab
</script>

<template>
  <TableOperator v-if="tab == 'branch'" :schema="schema" :nameBack="currentRoute" :title="title" />
  <TableOperator
    v-if="tab == 'department'"
    :schema="schema2"
    :nameBack="currentRoute"
    :title="title"
  />
  <TableOperator v-if="tab == 'rank'" :schema="schema3" :nameBack="currentRoute" :title="title" />
  <TableOperator
    v-if="tab == 'tyOfPersonel'"
    :schema="schema4"
    :nameBack="currentRoute"
    :title="title"
  />
</template>
