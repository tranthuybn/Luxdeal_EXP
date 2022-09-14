<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { TableOperator } from '../../Components/TableBase'
import { useRouter } from 'vue-router'
import { getProductStorageList } from '@/api/Warehouse'
const { t } = useI18n()

const schema = reactive<FormSchema[]>([
  {
    field: 'field13',
    label: t('reuse.typeStorage'),
    component: 'Divider'
  },
  {
    field: 'field14',
    label: t('reuse.chooseRankStorage'),
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
    field: 'title',
    label: t('reuse.nameStorage'),
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
    field: 'status',
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
          value: 'Đang hoạt động'
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
//lay du lieu tu router
const router = useRouter()
const currentRoute = String(router.currentRoute.value.params.backRoute)
const id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)
//title lay trong router
const title = router.currentRoute.value.meta.title
</script>

<template>
  <TableOperator
    :api="getProductStorageList"
    :schema="schema"
    :nameBack="currentRoute"
    :title="title"
    :id="id"
    :type="type"
    :multipleImages="false"
  />
</template>
