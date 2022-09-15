<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { TableOperator } from '../../Components/TableBase'
import { useRouter } from 'vue-router'
import {
  getCategories,
  getCategoryById,
  postCategory,
  updateCategory
} from '@/api/LibraryAndSetting'
import { useValidator } from '@/hooks/web/useValidator'
import { PRODUCTS_AND_SERVICES } from '@/utils/API.Variables'
import { ElMessage } from 'element-plus'
const { t } = useI18n()
const { required } = useValidator()
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
      ],
      onChange: (value) => {
        if (value == 1 || value == '') {
          removeFormSchema()
        }
        if (value == 2) {
          addFormSchema(timesCallAPI)
          timesCallAPI++
        }
      }
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
    field: 'name',
    label: t('reuse.nameRank1Category'),
    component: 'Input',
    colProps: {
      span: 13
    }
  },
  {
    field: 'position',
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
    field: 'isActive',
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

const rules = reactive({
  rankCategory: [required()],
  name: [required()],
  parentid: [required()],
  count: [required()]
})

let rank1SelectOptions = reactive([])
let timesCallAPI = 0

const getRank1SelectOptions = async () => {
  await getCategories({ TypeName: PRODUCTS_AND_SERVICES[7].key })
    .then((res) => {
      if (res.data) {
        rank1SelectOptions = res.data.map((index) => ({
          label: index.name,
          value: index.id
        }))
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

const removeFormSchema = () => {
  schema[3].hidden = false
  schema[4].hidden = true
  schema[5].hidden = true
}
const addFormSchema = async (timesCallAPI, nameChildren?: string) => {
  if (timesCallAPI == 0) {
    await getRank1SelectOptions()
    if (schema[4].componentProps?.options != undefined) {
      schema[4].componentProps.options = rank1SelectOptions
    }
  }
  schema[3].hidden = true
  schema[4].hidden = false
  schema[5].hidden = false
  schema[5].value = nameChildren
}

const postData = async (data) => {
  //manipulate Data
  if (data.ParentId == undefined) {
    data.ParentId = 0
  }
  if (data.status[0] === 'active') {
    data.isActive = true
  } else {
    data.isActive = false
  }
  if (data.status[1] === 'hide') {
    data.isHide = true
  } else {
    data.isHide = false
  }
  await postCategory({ TypeName: PRODUCTS_AND_SERVICES[7].key, ...data })
    .then(() =>
      ElMessage({
        message: t('reuse.addSuccess'),
        type: 'success'
      })
    )
    .catch((error) =>
      ElMessage({
        message: error,
        type: 'warning'
      })
    )
}
const router = useRouter()
const currentRoute = String(router.currentRoute.value.params.backRoute)
const title = router.currentRoute.value.meta.title
const id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)
const params = { TypeName: PRODUCTS_AND_SERVICES[7].key }
console.log(currentRoute)

// const title = router.currentRoute.value.meta.title
const formDataCustomize = ref()
const customizeData = async (formData) => {
  console.log('formData', formData)
  formDataCustomize.value = formData
  formDataCustomize.value['status'] = []
  if (formData.parentid == 0) {
    formDataCustomize.value.rankCategory = 1
  } else {
    formDataCustomize.value.rankCategory = 2
    await addFormSchema(timesCallAPI, formData.name)
  }
  if (formData.isActive == true) {
    formDataCustomize.value['status'].push('active')
  }
  if (formData.isHide == true) {
    formDataCustomize.value['status'].push('hide')
  }
  formDataCustomize.value.isDelete = false
  formDataCustomize.value.index = -1
}
type FormDataPost = {
  Id: number
  Name: string
  code?: string
  image?: string
  TypeName: string
  ParentId: number
  CreatedBy: string
  isHide: boolean
  isActive: boolean
  index: number
}
const customPostData = (data) => {
  const customData = {} as FormDataPost
  customData.Id = data.id
  customData.Name = data.name
  customData.TypeName = data.typeName
  customData.ParentId = data.parentid
  data.status.includes('active') ? (customData.isActive = true) : (customData.isActive = false)
  data.status.includes('hide') ? (customData.isHide = true) : (customData.isHide = false)
  customData.index = 0
  return customData
}
const editData = async (data) => {
  data = customPostData(data)
  await updateCategory({ TypeName: PRODUCTS_AND_SERVICES[7].key, ...data })
    .then(() =>
      ElMessage({
        message: t('reuse.updateSuccess'),
        type: 'success'
      })
    )
    .catch((error) =>
      ElMessage({
        message: error,
        type: 'warning'
      })
    )
}
</script>

<template>
  <TableOperator
    ref="formRef"
    :schema="schema"
    :nameBack="currentRoute"
    :title="title"
    :type="type"
    :id="id"
    @post-data="postData"
    :multipleImages="false"
    :rules="rules"
    :api="getCategoryById"
    :params="params"
    @customize-form-data="customizeData"
    @edit-data="editData"
    :formDataCustomize="formDataCustomize"
  />
</template>
