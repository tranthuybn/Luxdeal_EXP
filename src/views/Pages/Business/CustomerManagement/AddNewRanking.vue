<script setup lang="ts">
import { getCategoryById, deleteCategory } from '@/api/LibraryAndSetting'
import { h, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import TableOperator from '../../Components/TableBase/src/TableOperator.vue'

const { t } = useI18n()
const schema = reactive<FormSchema[]>([
  {
    field: 'field1',
    label: t('reuse.generalInformation'),
    component: 'Divider'
  },
  {
    field: 'rankName',
    label: t('customerList.rankName'),
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      style: 'width: 100%',
      placeholder: t('customerList.enterNameRanking')
    },
    hidden: false
  },
  {
    field: 'ratings',
    label: t('customerList.ratings'),
    component: 'Select',
    colProps: {
      span: 12
    },
    componentProps: {
      options: [
        {
          label: t('reuse.byMonth'),
          value: 1
        },
        {
          label: t('customerList.byQuarter'),
          value: 2
        },
        {
          label: t('customerList.byYear'),
          value: 3
        }
      ],
      disabled: false,
      style: 'width: 100%'
    }
  },
  {
    field: 'name',
    component: 'Input',
    colProps: {
      span: 12
    },
    formItemProps: {
      labelWidth: '0px'
    },
    componentProps: {
      placeholder: t('customerList.enterSales'),
      suffixIcon: h('div', 'đ')
    }
  },
  {
    field: 'field41',
    label: t('reuse.status'),
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
          value: 1
        }
      ]
    }
  }
])
const rules = [{}]
// get data from router
const router = useRouter()
const title = router.currentRoute.value.meta.title
const id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)

const formDataCustomize = ref()
const postData = () => {}
const customizeData = () => {}
const editData = () => {}
</script>
<template>
  <TableOperator
    ref="formRef"
    :schema="schema"
    :type="type"
    :id="id"
    :title="title"
    @post-data="postData"
    :rules="rules"
    :apiId="getCategoryById"
    @customize-form-data="customizeData"
    @edit-data="editData"
    :formDataCustomize="formDataCustomize"
    :delApi="deleteCategory"
    :backButton="true"
  />
</template>
