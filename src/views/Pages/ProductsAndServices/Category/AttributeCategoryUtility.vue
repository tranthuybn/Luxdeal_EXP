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
  deleteCategory
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
      span: 20
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
      span: 20
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
      span: 20
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
      span: 20
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
      span: 20
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
    component: 'Checkbox',
    value: [],
    colProps: {
      span: 7
    },
    componentProps: {
      disabled: disableCheckBox,
      options: [
        {
          label: t('reuse.active'),
          value: 'active'
        }
      ]
    }
  },
  {
    field: 'status',
    component: 'Checkbox',
    value: [],
    colProps: {
      span: 11
    },
    componentProps: {
      options: [
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
  ]
})
watch(
  () => type,
  () => {
    if (type === 'add') {
      title.value = router.currentRoute?.value?.meta?.title
      disableCheckBox.value = true
      schema[8].value = ['active']
    } else if (type === 'detail') {
      title.value = t('reuse.detailCharacteristic')
    } else if (type === 'edit') {
      title.value = t('reuse.editCharacteristic')
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
  if (data.backRouter == true) {
    push({
      name: 'products-services.AttributeCategory',
      params: { backRoute: 'products-services.AttributeCategory' }
    })
  }
}
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

  formDataCustomize.value.imageurl = `${API_URL}${formData.imageurl}`
    ? (formDataCustomize.value.imageurl = `${API_URL}${formData.imageurl}`)
    : null

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
  index: number
  imageurl?: string
}
const customPostData = async (data) => {
  const customData = {} as FormDataPost
  customData.Id = data.id
  customData.Name = data.name
  customData.TypeName = data.typeName
  customData.ParentId = data.parentid
  customData.imageurl = data.imageurl.replace(`${API_URL}`, '')
  customData.Image = data.Image
  customData.index = data.index
  data.status.includes('active') ? (customData.isActive = true) : (customData.isActive = false)
  data.status.includes('hide') ? (customData.isHide = true) : (customData.isHide = false)
  return customData
}

const { push } = useRouter()
const editData = async (data) => {
  console.log('data:', data)

  data = customPostData(data)
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
      params: { backRoute: 'products-services.AttributeCategory' }
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
