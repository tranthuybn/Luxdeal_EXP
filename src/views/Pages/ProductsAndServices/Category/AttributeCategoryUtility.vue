<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { TableOperator } from '../../Components/TableBase'
import { useRoute, useRouter } from 'vue-router'
import {
  getCategories,
  getCategoryById,
  postCategory,
  updateCategory,
  deleteCategory,
  hideCategory
} from '@/api/LibraryAndSetting'
import { useValidator } from '@/hooks/web/useValidator'
import { ElMessage } from 'element-plus'
import { API_URL } from '@/utils/API_URL'

const { required, ValidService, notSpecialCharacters } = useValidator()
const { t } = useI18n()
let rank1SelectOptions = reactive([])
let timesCallAPI = 0
// get data from router
const router = useRouter()
const route = useRoute()
const tab = String(route.params.tab)
const currentRoute = String(router.currentRoute.value.params.backRoute)
const id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)

let title = ref()
let disableCheckBox = ref(false)

const params = { TypeName: tab }
const hierarchical = params.TypeName === 'mausac' || params.TypeName === 'chatlieu' ? true : false
const schema = reactive<FormSchema[]>([
  {
    field: 'category',
    label: t('reuse.typeAttribute'),
    component: 'Divider'
  },
  {
    field: 'rankCategory',
    label: t('reuse.selectLevelAttribute'),
    component: 'Select',
    modelValue: 1,
    value: 1,
    colProps: {
      span: 24
    },
    componentProps: {
      style: 'width: 100%',
      clearable: false,
      disabled: !hierarchical,
      placeholder: t('reuse.selectLevelAttribute'),
      options: [
        {
          label: t('reuse.attributeLevel1'),
          value: 1
        },
        {
          label: t('reuse.attributeLevel2'),
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
    field: 'generalInformation',
    label: t('reuse.generalInformation'),
    component: 'Divider'
  },
  {
    field: 'name',
    label: t('reuse.nameAttributeLevel1'),
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('reuse.InputNameAttributeLevel1'),
      formatter: (value) => value.replace(/^\s+$/gm, '')
    },
    hidden: false
  },
  {
    field: 'parentid',
    label: t('reuse.nameAttributeLevel1'),
    component: 'Select',
    colProps: {
      span: 24
    },
    componentProps: {
      options: [],
      style: 'width: 100%',
      placeholder: t('reuse.InputNameAttributeLevel1'),
      formatter: (value) => value.replace(/^\s+$/gm, '')
    },
    hidden: true
  },
  {
    field: 'name',
    label: t('reuse.nameAttributeLevel2'),
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('reuse.InputNameAttributeLevel2'),
      formatter: (value) => value.replace(/^\s+$/gm, '')
    },
    hidden: true
  },
  {
    field: 'index',
    label: t('reuse.displayPosition'),
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('reuse.EnterDisplayPosition'),
      formatter: (value) =>
        value
          .replace(/^\s+$/gm, '')
          .replace(/^[a-zA-Z]*$/gm, '')
          .replace(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/gi, '')
    }
  },
  {
    field: 'statusAndFunction',
    label: t('reuse.statusAndFunction'),
    component: 'Divider'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    component: 'Radio',
    colProps: {
      span: 12
    },
    componentProps: {
      disabled: disableCheckBox,
      options: [
        {
          label: t('reuse.active'),
          value: 1
        }
      ]
    }
  },
  {
    field: 'status',
    component: 'Radio',
    colProps: {
      span: 12
    },
    componentProps: {
      disabled: disableCheckBox,
      options: [
        {
          label: t('reuse.stopShowAppWeb'),
          value: 2
        }
      ]
    }
  }
])
const rules = reactive({
  rankCategory: [required()],
  name: [
    required(),
    { validator: notSpecialCharacters },
    { validator: ValidService.checkNameServiceLength.validator },
    { validator: ValidService.checkSpace.validator }
  ],
  parentid: [
    required(),
    { validator: notSpecialCharacters },
    { validator: ValidService.checkNameServiceLength.validator },
    { validator: ValidService.checkSpace.validator }
  ],
  index: [{ validator: ValidService.checkPositiveNumber.validator }]
})

watch(
  () => type,
  () => {
    if (type === 'add') {
      title.value = router.currentRoute.value.meta.title
      disableCheckBox.value = true
      schema[8].value = 1
    } else if (type === 'detail') {
      title.value = t('reuse.detailProductCategory')
    } else if (type === 'edit') {
      title.value = t('reuse.editProductCategory')
    }
  },
  {
    deep: true,
    immediate: true
  }
)
//call api for select options
const getRank1SelectOptions = async () => {
  const payload = {
    PageIndex: 1,
    PageSize: 1000
  }
  await getCategories({ ...payload, ...params })
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
const removeFormSchema = () => {
  schema[3].hidden = false
  schema[4].hidden = true
  schema[5].hidden = true
}
const postData = async (data) => {
  //manipulate Data

  if (data.status === 1) {
    data.isActive = true
  } else {
    data.isActive = false
  }
  if (data.status === 2) {
    data.isHide = true
    await hideCategory(data.id)
  } else {
    data.isHide = false
  }
  // const payload = {
  //   Name: data.name,
  //   Image: data.Image,
  //   ParentId: 0,
  //   Index: parseInt(data.index)
  // }
  // await postCategory({ ...params, ...payload })

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
  // TODO (FIX BUG ROUTER DAC TINH )
  if (data.backRouter == true) {
    push({
      name: 'products-services.AttributeCategory',
      params: { backRoute: `products-services.AttributeCategory`, tab: data.tabs }
    })
  }
}

const formDataCustomize = ref()
const customizeData = async (formData) => {
  formDataCustomize.value = formData
  console.log('formData', formData)

  if (formData.isActive == true) {
    formDataCustomize.value['status'] = 1
  }
  if (formData.isHide == true) {
    formDataCustomize.value['status'] = 2
  }
  if (schema[4].componentProps !== undefined) {
    schema[4].componentProps.disabled = true
  }
  if (schema[1].componentProps !== undefined) {
    schema[1].componentProps.disabled = true
  }
  formDataCustomize.value.imageurl = `${API_URL}${formData.imageurl}`
    ? (formDataCustomize.value.imageurl = `${API_URL}${formData.imageurl}`)
    : null
  if (formData.parentid == 0) {
    formDataCustomize.value.rankCategory = 1
  } else {
    formDataCustomize.value.rankCategory = 2
    await addFormSchema(timesCallAPI, formData.name)
  }

  formDataCustomize.value.isDelete = false
}
type FormDataPost = {
  Id: number
  Name: string
  code?: string
  Image?: any
  TypeName: string
  ParentId: number
  CreatedBy: string
  isHide: boolean
  isActive: boolean
  Index: number
  imageurl?: string
}
const customPostData = async (data) => {
  const customData = {} as FormDataPost
  if (data.ParentId == undefined) {
    data.ParentId = 0
  }
  if (data.status == 1) {
    customData.isActive = true
    customData.isHide = false
  } else if (data.status == 2) {
    customData.isActive = false
    customData.isHide = true
    await hideCategory({ Id: data.id })
  } else {
    customData.isActive = true
    customData.isHide = false
  }
  customData.Id = data.id
  customData.Name = data.name
  customData.TypeName = data.typeName
  customData.ParentId = data.parentid
  customData.imageurl = data.imageurl.replace(`${API_URL}`, '')
  customData.Image = data.Image

  if (data.index == null) {
    customData.Index = 1
  } else {
    customData.Index = data.index
  }

  return customData
}

const { push } = useRouter()

const editData = async (data) => {
  data = await customPostData(data)
  await updateCategory(data)
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
    ),
    push({
      name: 'products-services.AttributeCategory',
      params: { backRoute: `products-services.AttributeCategory`, tab: data.TypeName }
    })
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
