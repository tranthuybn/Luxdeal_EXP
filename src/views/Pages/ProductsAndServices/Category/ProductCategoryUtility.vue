<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { TableOperator } from '../../Components/TableBase'
import { useRouter } from 'vue-router'
import {
  getCategories,
  getCategoryById,
  postCategory,
  updateCategory,
  deleteCategory
} from '@/api/LibraryAndSetting'
import { useValidator } from '@/hooks/web/useValidator'
import { PRODUCTS_AND_SERVICES } from '@/utils/API.Variables'
import { ElNotification } from 'element-plus'
import { API_URL } from '@/utils/API_URL'
const { required, ValidService, notSpecialCharacters, notSpace } = useValidator()
const { t } = useI18n()
let rank1SelectOptions = reactive([])
let timesCallAPI = 0
let disableCheckBox = ref(false)
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
    modelValue: 1,
    value: 1,
    colProps: {
      span: 20
    },
    componentProps: {
      style: 'width: 100%',
      placeholder: t('reuse.chooseRankCategory'),
      disabled: false,
      clearable: false,
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
      placeholder: t('reuse.EnterNameCategory')
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
      disabled: false,
      style: 'width: 100%',
      placeholder: t('reuse.EnterNameCategory')
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
      placeholder: t('reuse.EnterNameCategoryLevel2')
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
      placeholder: t('reuse.EnterDisplayPosition')
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
let rules = reactive({
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
  index: [
    { validator: ValidService.checkPositiveNumber.validator },
    { validator: notSpecialCharacters },
    { validator: notSpace }
  ]
})
//call api for select options
const getRank1SelectOptions = async () => {
  const payload = {
    PageIndex: 1,
    PageSize: 1000
  }
  await getCategories({ ...payload, TypeName: PRODUCTS_AND_SERVICES[0].key })
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
    if (schema[4].componentProps?.options !== undefined) {
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
  console.log('data', data)

  await postCategory({ TypeName: PRODUCTS_AND_SERVICES[0].key, ...data })
    .then(() =>
      ElNotification({
        message: t('reuse.addSuccess'),
        type: 'success'
      })
    )
    .catch((error) =>
      ElNotification({
        message: error,
        type: 'warning'
      })
    )
  if (data.backRouter == true) {
    push({
      name: 'products-services.ProductCategory',
      params: { backRoute: 'products-services.ProductCategory' }
    })
  }
}
// get data from router
const router = useRouter()
// const title = router.currentRoute.value.meta.title
const id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)
const params = { TypeName: PRODUCTS_AND_SERVICES[0].key }
let title = ref()

watch(
  () => type,
  () => {
    if (type === 'add') {
      title.value = router.currentRoute.value.meta.title
      disableCheckBox.value = true
      schema[8].value = ['active']
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
const formDataCustomize = ref()
//custom data before set Value to Form
const customizeData = async (formData) => {
  //disable parent select
  if (schema[4].componentProps !== undefined) {
    schema[4].componentProps.disabled = true
  }
  if (schema[1].componentProps !== undefined) {
    schema[1].componentProps.disabled = true
  }
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
  formDataCustomize.value.isDelete = false
}
//type of post api data
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
const customPostData = (data) => {
  const customData = {} as FormDataPost
  customData.Id = data.id
  customData.Name = data.name
  customData.TypeName = data.typeName
  customData.ParentId = data.parentid
  customData.Image = data.Image
  customData.imageurl = data.imageurl.replace(`${API_URL}`, '')
  customData.index = data.index == null ? '' : data.index
  data.status.includes('active') ? (customData.isActive = true) : (customData.isActive = false)
  data.status.includes('hide') ? (customData.isHide = true) : (customData.isHide = false)
  return customData
}
const { push } = useRouter()

const editData = async (data) => {
  data = customPostData(data)
  await updateCategory({ TypeName: PRODUCTS_AND_SERVICES[0].key, ...data })
    .then(() =>
      ElNotification({
        message: t('reuse.updateSuccess'),
        type: 'success'
      })
    )
    .catch(() =>
      ElNotification({
        message: t('reuse.updateFail'),
        type: 'warning'
      })
    ),
    push({
      name: 'products-services.ProductCategory',
      params: { backRoute: 'products-services.ProductCategory' }
    })
}
const deleteOrigin = `${t('reuse.deleteOrigin')}`
</script>

<template>
  <TableOperator
    ref="formRef"
    :schema="schema"
    :title="title"
    :deleteTitle="deleteOrigin"
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
