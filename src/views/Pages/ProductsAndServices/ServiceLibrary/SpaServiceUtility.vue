<script setup lang="ts">
import { h, reactive, ref, RendererElement, RendererNode, VNode } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { TableOperator } from '../../Components/TableBase'
import { useRouter } from 'vue-router'
import { getSpaById, getSpaLibrary, deleteSpa, postSpa, updateSpa } from '@/api/LibraryAndSetting'
import { useValidator } from '@/hooks/web/useValidator'
import { ElNotification, ElCollapse, ElCollapseItem, ElButton } from 'element-plus'
import { API_URL } from '@/utils/API_URL'
import { useIcon } from '@/hooks/web/useIcon'
import moment from 'moment'
const { required, ValidService, notSpecialCharacters } = useValidator()
const { t } = useI18n()
let rank1SelectOptions = reactive([])
let timesCallAPI = 0
const minusIcon = useIcon({ icon: 'akar-icons:minus' })
const schema = reactive<FormSchema[]>([
  {
    field: 'generalServiceInformation',
    label: t('formDemo.generalServiceInformation'),
    component: 'Divider'
  },
  {
    field: 'code',
    label: t('formDemo.serviceCode'),
    component: 'Input',
    colProps: {
      span: 18
    },
    componentProps: {
      placeholder: t('formDemo.enterServiceCode')
    }
  },
  {
    field: 'name',
    label: t('formDemo.serviceName'),
    component: 'Input',
    colProps: {
      span: 18
    },
    componentProps: {
      placeholder: t('formDemo.enterServiceName')
    }
  },
  {
    field: 'shortDescription',
    label: t('formDemo.shortDescription'),
    component: 'Input',
    colProps: {
      span: 18
    },
    componentProps: {
      placeholder: t('formDemo.enterDescription')
    }
  },
  {
    field: 'description',
    label: t('formDemo.description'),
    component: 'Editor',
    colProps: {
      span: 24
    },
    componentProps: {
      defaultHtml: ''
    }
  },
  {
    field: 'servicePriceAndExecutionTime',
    label: t('formDemo.servicePriceAndExecutionTime'),
    component: 'Divider'
  },
  {
    field: 'cost',
    label: t('formDemo.serviceUnitPrice'),
    component: 'Input',
    colProps: {
      span: 18
    },
    componentProps: {
      placeholder: t('formDemo.enterPrice'),
      suffixIcon: h('div', 'đ')
    }
  },
  {
    field: 'promotePrice',
    label: t('formDemo.promotionalPrice'),
    component: 'Input',
    colProps: {
      span: 18
    },
    componentProps: {
      placeholder: t('formDemo.enterPrice'),
      suffixIcon: h('div', 'đ')
    }
  },
  {
    field: 'time',
    label: t('formDemo.executionTime'),
    component: 'Input',
    colProps: {
      span: 18
    },
    componentProps: {
      placeholder: t('formDemo.enterNumberHours'),
      suffixIcon: h('div', 'giờ')
    }
  },
  {
    field: 'warranty',
    label: t('formDemo.insurance'),
    component: 'Input',
    colProps: {
      span: 18
    },
    componentProps: {
      placeholder: t('formDemo.enterNumberDays'),
      suffixIcon: h('div', 'ngày')
    }
  },
  {
    field: 'statusAndFunctional',
    label: t('formDemo.statusAndFunctional'),
    component: 'Divider'
  },
  {
    field: 'status',
    label: t('formDemo.status'),
    component: 'Checkbox',
    value: [],
    colProps: {
      span: 18
    },
    componentProps: {
      options: [
        {
          label: t('formDemo.isActive'),
          value: 'active'
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
  ]
})
//call api for select options
const getRank1SelectOptions = async () => {
  await getSpaLibrary({})
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

const addFormSchema = async (timesCallAPI) => {
  if (timesCallAPI == 0) {
    await getRank1SelectOptions()
    if (schema[4].componentProps?.options != undefined) {
      schema[4].componentProps.options = rank1SelectOptions
    }
  }
}

// get data from router
const router = useRouter()
const id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)

const formDataCustomize = ref()
const customizeData = async (formData) => {
  formDataCustomize.value = formData
  console.log('formData', formData)

  formDataCustomize.value.Images = formData.photos
  formDataCustomize.value['status'] = []
  if (formData.parentid == 0) {
    formDataCustomize.value.rankCategory = 1
  } else {
    formDataCustomize.value.rankCategory = 2
    await addFormSchema(timesCallAPI)
  }
  if (formData.isActive == true) {
    formDataCustomize.value['status'].push('active')
  }
  formDataCustomize.value.imageurl = `${API_URL}${formData.imageurl}`
  formDataCustomize.value.isDelete = false
}
type FormDataPost = {
  Id: number
  Name: string
  Code: string
  PromotePrice: number
  Photo?: any
  UpdatedBy: string
  CreatedBy: string
  IsActive: boolean
  IsApproved: boolean
  UpdatedAt: string
  CreatedAt: string
  Cost: number
  Time: number
  Warranty: number
  Description: string
  ShortDescription: string
}
const customPostData = (data) => {
  const customData = {} as FormDataPost
  var curDate = moment().format()
  customData.Id = id
  customData.Photo = data.Images
  customData.Cost = data.cost ?? 0
  customData.PromotePrice = data.promotePrice ?? 0
  customData.Time = data.time ?? 0
  customData.Warranty = data.warranty ?? 0
  customData.Description = data.description
  customData.ShortDescription = data.shortDescription
  customData.Name = data.name
  customData.Code = data.code
  customData.UpdatedBy = 'anle'
  customData.CreatedBy = 'anle'
  customData.UpdatedAt = curDate.toString()
  customData.CreatedAt = curDate.toString()
  data.status.includes('active') ? (customData.IsActive = true) : (customData.IsActive = false)
  customData.IsApproved = true
  return customData
}
const editData = async (data) => {
  //  customPostData(data)

  const payload = {
    Id: id,
    DeletedImages: data.DeleteFileIds.toString(),
    NewPhotos: data.NewPhotos
  }
  console.log('1', payload)
  console.log('2', data)

  await updateSpa({ ...payload, ...customPostData(data) })
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
const postData = async (data) => {
  data = customPostData(data)
  console.log('data', data)

  await postSpa(data)
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
interface Collapse {
  icon: VNode<RendererNode, RendererElement, { [key: string]: any }>
  name: string
  title: string
  columns?: TableColumn[]
  api?: <T = any>(option: any) => Promise<IResponse<T>>
  buttonAdd: string
  buttons: number
}

const collapse: Array<Collapse> = [
  {
    icon: minusIcon,
    name: 'information',
    title: t('reuse.informationServices'),
    columns: schema,
    api: undefined,
    buttonAdd: '',
    buttons: 1
  }
]
let currentCollapse = ref<string>(collapse[0].name)
// const collapseChangeEvent = (val) => {
//   if (val) {
//     collapse.forEach((el) => {
//       if (val.includes(el.name)) el.icon = minusIcon
//       else if (el.icon == minusIcon) el.icon = plusIcon
//     })
//   } else
//     collapse.forEach((el) => {
//       el.icon = plusIcon
//     })
// }
const deleteOrigin = `${t('reuse.deleteUnit')}`
const activeName = ref('information')
</script>

<template>
  <div class="demo-collapse">
    <el-collapse v-model="activeName" :collapse="collapse">
      <el-collapse-item
        v-for="(item, index) in collapse"
        :key="index"
        :name="item.name"
        v-model="currentCollapse"
      >
        <template #title>
          <el-button class="header-icon" :icon="item.icon" link />
          <span class="text-center">{{ item.title }}</span>
        </template>
        <TableOperator
          ref="formRef"
          :apiId="getSpaById"
          :schema="schema"
          :title="item.title"
          :deleteTitle="deleteOrigin"
          :type="type"
          :id="id"
          @post-data="postData"
          :rules="!(type === 'detail') ? rules : {}"
          @customize-form-data="customizeData"
          @edit-data="editData"
          :formDataCustomize="formDataCustomize"
          :delApi="deleteSpa"
        />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<style scoped>
::v-deep(.el-checkbox-group) {
  display: flex;
}
</style>
