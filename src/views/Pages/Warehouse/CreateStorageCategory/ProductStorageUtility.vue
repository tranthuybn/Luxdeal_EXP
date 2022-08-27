<script setup lang="ts">
import { ContentDetailWrap } from '@/components/ContentDetailWrap'
import { ref, unref, reactive } from 'vue'
import { ElButton } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { useRouter } from 'vue-router'
import { saveTableApi } from '@/api/table'
import { TableData } from '@/api/table/types'
import { useEmitt } from '@/hooks/web/useEmitt'
import { TableOperator } from '../../Components/TableBase'
const { emitter } = useEmitt()

const { push } = useRouter()

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
          label: t('reuse.stopShow'),
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

const TableOperatorRef = ref<ComponentRef<typeof TableOperator>>()

const loading = ref(false)

const save = async () => {
  const write = unref(TableOperatorRef)
  await write?.elFormRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      const data = (await write?.getFormData()) as TableData
      const res = await saveTableApi(data)
        .catch(() => {})
        .finally(() => {
          loading.value = false
        })
      if (res) {
        emitter.emit('getList', 'add')
        push('/example/example-page')
      }
    }
  })
}
</script>

<template>
  <ContentDetailWrap
    :title="t('reuse.addCategory')"
    @back="push({ name: 'Inventorymanagement.CreateStorageCategory.ProductStorage' })"
  >
    <TableOperator ref="TableOperatorRef" :schema="schema" />

    <template #right>
      <ElButton type="primary" :loading="loading" @click="save">
        {{ t('reuse.save') }}
      </ElButton>
    </template>
  </ContentDetailWrap>
</template>
