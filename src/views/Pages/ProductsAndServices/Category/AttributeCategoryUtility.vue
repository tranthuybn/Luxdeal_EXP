<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { TableOperator } from '../../Components/TableBase'
import { useRoute, useRouter } from 'vue-router'
import {
  getCategories,
  getCategoryById,
  postCategory,
  updateCategory,
  deleteCategory
} from '@/api/LibraryAndSetting'
import { useValidator } from '@/hooks/web/useValidator'
import { ElMessage } from 'element-plus'
import { API_URL } from '@/utils/API_URL'
const { required, ValidService, notSpecialCharacters, notSpace } = useValidator()
const { t } = useI18n()
let rank1SelectOptions = reactive([])
let timesCallAPI = 0
const schema = reactive<FormSchema[]>([
  {
    field: 'field20',
    label: t('reuse.typeCategory'),
    component: 'Divider'
  },
  {
    field: 'rankCategory',
    label: t('reuse.chooseRankCategory'),
    component: 'Select',
    colProps: {
      span: 20
    },
    componentProps: {
      style: 'width: 100%',
      disabled: true,
      placeholder: t('reuse.selectRankOrigin'),
      options: [
        {
          label: t('reuse.rank1Category'),
          value: 1
        },
        {
          label: t('reuse.rank2Category'),
          value: 2
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
      span: 20
    },
    componentProps: {
      placeholder: t('reuse.inputOrigin')
    },
    hidden: false
  },
  {
    field: 'parentid',
    label: t('reuse.nameRank1Category'),
    component: 'Select',
    colProps: {
      span: 20
    },
    componentProps: {
      options: [],
      disabled: true,
      style: 'width: 100%',
      placeholder: t('reuse.selectRankOrigin')
    },
    hidden: true
  },
  {
    field: 'name',
    label: t('reuse.nameRank2Category'),
    component: 'Input',
    colProps: {
      span: 20
    },
    componentProps: {
      placeholder: t('reuse.inputOrigin')
    },
    hidden: true
  },
  {
    field: 'index',
    label: t('reuse.displayPosition'),
    component: 'Input',
    colProps: {
      span: 20
    },
    componentProps: {
      placeholder: t('reuse.displayPosition')
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
          value: 'active'
        },
        {
          label: t('reuse.stopShowAppWeb'),
          value: 'hide'
        }
      ]
    }
  }
])
const rules = reactive({
  rankCategory: [required()],
  name: [
    { validator: notSpecialCharacters },
    { validator: ValidService.checkNameLength.validator },
    required()
  ],
  parentid: [required()],
  count: [required()],
  categoryName: [required()],
  displayPosition: [required()],
  categoryLevel: [required()],
  index: [{ validator: ValidService.checkPositiveNumber.validator }, { validator: notSpace }]
})
//call api for select options
const getRank1SelectOptions = async () => {
  await getCategories({ ...params })
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
  await postCategory({ ...params, ...data })
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
// get data from router
const router = useRouter()
const route = useRoute()
const tab = String(route.params.tab)
const currentRoute = String(router.currentRoute.value.params.backRoute)
const title = router.currentRoute.value.meta.title
const id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)
const params = { TypeName: tab }

const formDataCustomize = ref()
const customizeData = async (formData) => {
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
  formDataCustomize.value.imageurl = `${API_URL}${formData.imageurl}`
    ? (formDataCustomize.value.imageurl = `${API_URL}${formData.imageurl}`)
    : null
}
type FormDataPost = {
  Id: number
  Name: string
  code?: string
  Image?: string
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
  customData.Image = data.Image
  customData.index = data.index
  data.status.includes('active') ? (customData.isActive = true) : (customData.isActive = false)
  data.status.includes('hide') ? (customData.isHide = true) : (customData.isHide = false)
  return customData
}
const editData = async (data) => {
  data = customPostData(data)
  await updateCategory({ ...params, ...data })
    .then(() =>
      ElMessage({
        message: t('reuse.updateSuccess'),
        type: 'success'
      })
    )
    .catch(() =>
      ElMessage({
        message: t('reuse.updateFail'),
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
    :apiId="getCategoryById"
    :params="params"
    @customize-form-data="customizeData"
    @edit-data="editData"
    :formDataCustomize="formDataCustomize"
    :delApi="deleteCategory"
  />
</template>
