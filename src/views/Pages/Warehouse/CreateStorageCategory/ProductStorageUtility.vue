<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { TableOperator } from '../../Components/TableBase'
import { useRouter } from 'vue-router'
import {
  getProductStorage,
  createNewProductStorage,
  updateProductStorage,
  deleteProductStorage
} from '@/api/Warehouse'
import { API_URL } from '@/utils/API_URL'
import { useValidator } from '@/hooks/web/useValidator'
import { ElNotification } from 'element-plus'
import { FORM_IMAGES } from '@/utils/format'
const { t } = useI18n()
const params = {}
let timesCallAPI = 0
let rank1SelectOptions = reactive([])
const { required, ValidService, notSpecialCharacters } = useValidator()

const schema = reactive<FormSchema[]>([
  {
    field: 'warehouse',
    label: t('reuse.typeStorage'),
    component: 'Divider'
  },
  {
    field: 'rankWarehouse',
    label: t('reuse.chooseRankStorage'),
    component: 'Select',
    modelValue: 1,
    value: 1,
    colProps: {
      span: 20
    },
    componentProps: {
      style: 'width: 100%',
      clearable: false,
      disabled: false,
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
    field: 'warehouseInformation',
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
      placeholder: t('reuse.InputNameAttributeLevel1')
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
      placeholder: t('reuse.InputNameAttributeLevel1')
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
      placeholder: t('reuse.InputNameAttributeLevel2')
    },
    hidden: true
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
  ]
})
//lay du lieu tu router
const router = useRouter()
const currentRoute = String(router.currentRoute.value.params.backRoute)
const id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)
//title lay trong router
let title = ref()
if (type === 'add') {
  title.value = router.currentRoute.value.meta.title
} else if (type === 'detail') {
  title.value = t('reuse.detailProductCategory')
} else if (type === 'edit') {
  title.value = t('reuse.editProductCategory')
}
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
  formDataCustomize.value = formData[0]
  formDataCustomize.value['status'] = []
  if (formData[0].parentid == 0) {
    formDataCustomize.value.rankWarehouse = 1
  } else {
    formDataCustomize.value.rankWarehouse = 2
    await addFormSchema(timesCallAPI, formData[0].name)
  }
  if (formData[0].isActive == true) {
    formDataCustomize.value['status'].push('active')
  }
  if (formData[0].isHide == true) {
    formDataCustomize.value['status'].push('hide')
  }
  formDataCustomize.value.imageurl = `${API_URL}${formData[0].imageurl}`
  formDataCustomize.value.isDelete = false
}

//call api for select options
const getRank1SelectOptions = async () => {
  const payload = {
    PageIndex: 1,
    PageSize: 1000
  }
  await getProductStorage({ ...payload })
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

//type of post api data
type FormDataPost = {
  Id: number
  Name: string
  Code: string
  Images?: any
  ParentId: number
  isActive: boolean
  DeleteFileIds: string
}

const customPostData = (data) => {
  const customData = {} as FormDataPost
  customData.Id = data.id
  customData.Name = data.name
  customData.Code = data.name
  customData.ParentId = data.parentid
  customData.Images = data.Images
  data.status.includes('active') ? (customData.isActive = true) : (customData.isActive = false)
  return customData
}

const postData = async (data) => {
  //manipulate Data
  if (data.ParentId == undefined) {
    data.ParentId = 0
  }
  if (data.status === 'active') {
    data.isActive = true
  } else {
    data.isActive = false
  }
  data.Code = 'HN91a'

  await createNewProductStorage(FORM_IMAGES(data))
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
}
const editData = async (data) => {
  data = customPostData(data)
  await updateProductStorage(data)
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
    )
}
</script>

<template>
  <TableOperator
    ref="formRef"
    :apiId="getProductStorage"
    :schema="schema"
    :nameBack="currentRoute"
    :title="title"
    :id="id"
    @edit-data="editData"
    @post-data="postData"
    :rules="rules"
    :params="params"
    :type="type"
    :formDataCustomize="formDataCustomize"
    @customize-form-data="customizeData"
    :delApi="deleteProductStorage"
  />
</template>
