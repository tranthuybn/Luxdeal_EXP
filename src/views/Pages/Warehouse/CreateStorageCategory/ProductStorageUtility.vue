<script setup lang="ts">
import { reactive, ref} from 'vue'
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
import { ElMessage, ElNotification } from 'element-plus'
import { FORM_IMAGES } from '@/utils/format'

const { t } = useI18n()
const params = {}
const formRef= ref<InstanceType<typeof TableOperator>>()
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
      span: 24
    },
    componentProps: {
      style: 'width: 100%',
      clearable: false,
      disabled: false,
      options: [
        {
          label: t('reuse.warehouseLevel1'),
          value: 1
        },
        {
          label: t('reuse.warehouseLevel2'),
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
    label: t('reuse.nameWarehouseLevel1'),
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('reuse.inputNameWarehouseLevel1'),
      formatter: (value) => value.replace(/^\s+$/gm, '')
    },
    hidden: false
  },
  {
    field: 'parentid',
    label: t('reuse.nameWarehouseLevel1'),
    component: 'Select',
    colProps: {
      span: 24
    },
    componentProps: {
      options: [],
      style: 'width: 100%',
      placeholder: t('reuse.inputNameWarehouseLevel1'),
      formatter: (value) => value.replace(/^\s+$/gm, '')
    },
    hidden: true
  },
  {
    field: 'name2',
    label: t('reuse.nameWarehouseLevel2'),
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('reuse.inputNameWarehouseLevel2')
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
    value: ['active'],
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

//set up empty form customize
type SetFormData = {
  name: string
  rankWarehouse: number
  reduce: number
  status: any
  isDelete: boolean
  customers: any
  products: any
  Image: any
  target: number
  percent: number
  money: number
  parentid: number
  imageurl?: string
  name2: string
}
const emptyFormData = {} as SetFormData
const formDataCustomize = reactive(emptyFormData)

//custom data before set Value to Form
const customizeData = async (formData) => {
  //disable parent select
  if (schema[4].componentProps !== undefined) {
    schema[4].componentProps.disabled = true
  }
  if (schema[1].componentProps !== undefined) {
    schema[1].componentProps.disabled = true
  }
  formDataCustomize.status = []
  formDataCustomize.Image = formData.warehouseImages[0].path
  formDataCustomize.imageurl = `${API_URL}${formData.warehouseImages[0].path}`
  if (formData?.isActive == true) {
    formDataCustomize.status.push('active')
  }
  if (formData.isHide == true) {
    formDataCustomize.status.push('hide')
  }
  if (formData.parentid == 0) {
    formDataCustomize.rankWarehouse = 1
  } else {
    formDataCustomize.rankWarehouse = 2
    formDataCustomize.parentid = Number(formData.parentid)
    await getProductStorage({Id: formData.parentid})
    .then(res => {
      if(res.data.length > 0 && !res.data[0].isActive) {
        formRef.value?.setSchema([
          {
            field: 'status',
            path: 'componentProps.disabled',
            value: true
          }
        ])
      }
    })
    .catch(error => {
      console.log('get parent warehouse fail', error)
    })
    await addFormSchema(timesCallAPI, formData.name)
  }
  if (formData?.parentid == 0) {
    formDataCustomize.name = formData?.name
  } else {
    formDataCustomize.name2 = formData?.name
  }
  formDataCustomize.isDelete = false

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
  schema[3].hidden = true
  schema[4].hidden = false
  schema[5].hidden = false
  schema[5].value = nameChildren
  if (timesCallAPI == 0) {
    await getRank1SelectOptions()
    if (schema[4].componentProps?.options != undefined) {
      schema[4].componentProps.options = rank1SelectOptions
    }
  }
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
var curDate = 'WH' + Date.now()

const customPostData = (data) => {
  const customData = {} as FormDataPost
  customData.Id = data?.Id
  customData.Name = data?.name
  customData.Code = curDate
  customData.ParentId = data?.parentid
  customData.Images = data?.Images
  customData.DeleteFileIds = data.DeleteFileIds.toString()
  data?.status.includes('active') ? (customData.isActive = true) : (customData.isActive = false)
  return customData
}

const fixBugPost = (data) => {
  const customData = {} as FormDataPost
  customData.Name = data.name ? data.name : data.name2
  customData.Code = curDate
  customData.ParentId = data?.parentid
  customData.Images = data.Image ?? []
  data?.status.includes('active') ? (customData.isActive = true) : (customData.isActive = false)
  return customData
}
const postData = async (data) => {
  //manipulate Data
  const payload = fixBugPost(data)
  let message = t('reuse.addSuccess')
  if (!payload) {
    message = t('common.inputText')
    ElMessage({
      showClose: true,
      message: message,
      type: 'error',
    })
  }
  else if (!payload.Images || payload.Images.length == 0) {
    message = t('formDemo.addPhotosOrFiles')
    ElMessage({
      showClose: true,
      message: message,
      type: 'error',
    })
  }
  else {
    await createNewProductStorage(FORM_IMAGES(payload))
      .then(() => {
        ElNotification({
          message: message,
          type: 'success'
        }),
          push({
            name: 'Inventorymanagement.CreateStorageCategory.ProductStorage',
            params: { backRoute: 'Inventorymanagement.CreateStorageCategory.ProductStorage' }
          })
      })
      .catch((error) => {
        console.error(error);
        ElNotification({
          message: error.response.data.message ?? error,
          type: 'warning'
        })
      })
  }
    
}
const { push } = useRouter()

const editData = async (data) => {
  const payload  = customPostData(data)
  let message = t('reuse.addSuccess')
  if (!payload) {
    message = t('common.inputText')
    ElMessage({
      showClose: true,
      message: message,
      type: 'error',
    })
  }
  else if (!payload.Images || payload.Images.length == 0) {
    message = t('formDemo.addPhotosOrFiles')
    ElMessage({
      showClose: true,
      message: message,
      type: 'error',
    })
  }
  else {
    await updateProductStorage(payload)
      .then(() => {
        ElNotification({
          message: t('reuse.updateSuccess'),
          type: 'success'
        }),
          push({
            name: 'Inventorymanagement.CreateStorageCategory.ProductStorage',
            params: { backRoute: 'Inventorymanagement.CreateStorageCategory.ProductStorage' }
          })
      })
      .catch((err) => {
        console.error(err)
        ElNotification({
          message:  err.response.data.message ?? t('reuse.updateFail'),
          type: 'warning'
        })
      })
  }
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
    :multipleImages="false"
  />

</template>
