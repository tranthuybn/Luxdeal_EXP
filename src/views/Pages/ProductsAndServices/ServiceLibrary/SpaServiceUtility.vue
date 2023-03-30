<script setup lang="ts">
import { h, reactive, ref, RendererElement, RendererNode, VNode } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { TableOperator } from '../../Components/TableBase'
import { useRouter } from 'vue-router'
import { getSpaById, deleteSpa, postSpa, updateSpa } from '@/api/LibraryAndSetting'
import { useValidator } from '@/hooks/web/useValidator'
import { ElNotification, ElCollapse, ElCollapseItem, ElButton } from 'element-plus'
import { API_URL } from '@/utils/API_URL'
import { useIcon } from '@/hooks/web/useIcon'
import moment from 'moment'
import { FORM_IMAGES } from '@/utils/format'
const { required, ValidService, notSpecialCharacters } = useValidator()
const { t } = useI18n()
const minusIcon = useIcon({ icon: 'akar-icons:minus' })
// get data from router
const router = useRouter()
const id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)

//random field code
const curDate = 'SPA' + moment().format('hhmmss')

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
      disabled: true
    },
    value: curDate
  },
  {
    field: 'name',
    label: t('formDemo.serviceName'),
    labelDescription: t('reuse.under50Characters'),
    component: 'Input',
    colProps: {
      span: 18
    },
    componentProps: {
      placeholder: t('formDemo.enterServiceName'),
      formatter: (value) => value.replace(/^\s+$/gm, '')
    }
  },
  {
    field: 'shortDescription',
    label: t('formDemo.shortDescription'),
    labelDescription: t('reuse.under256Characters'),
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
      style: 'max-width: 100%',
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
    component: 'InputPrice',
    value: '',
    colProps: {
      span: 18
    },
    componentProps: {
      showCurrency: false,
      placeholder: t('formDemo.enterPrice'),
      suffixIcon: h('div', 'đ'),
    }
  },
  {
    field: 'promotePrice',
    label: t('formDemo.promotionalPrice'),
    component: 'InputPrice',
    colProps: {
      span: 18
    },
    componentProps: {
      showCurrency: false,
      placeholder: t('formDemo.enterPrice'),
      suffixIcon: h('div', 'đ'),
    }
  },
  {
    field: 'time',
    label: t('formDemo.executionTime'),
    component: 'Input',
    labelDescription: t('reuse.descIsTheStandardTime'),
    colProps: {
      span: 18
    },
    componentProps: {
      placeholder: t('formDemo.enterNumberMinute'),
      suffixIcon: h('div',{class: 'suffixIcon'}, 'phút')
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
    component: 'Radio',
    colProps: {
      span: 18
    },
    componentProps: {
      options: [
        {
          label: t('formDemo.isActive'),
          value: true
        }
      ]
    }
  },
  {
    field: 'approval',
    label: ' ',
    colProps: {
      span: 18
    },
    component: 'Input',
    componentProps: {
      value: t('reuse.pendings'),
      class: 'approval-wrap',
      readonly: true
    }
  }
])
const rules = reactive({
  name: [required()],
  code: [required()],
  shortDescription: [
    { validator: notSpecialCharacters },
    { validator: ValidService.checkSpace.validator },
    { validator: ValidService.checkNameLength.validator }
  ],
  description: [
    { validator: ValidService.checkSpace.validator },
    { validator: ValidService.checkDescriptionLength.validator }
  ],
  cost: [required(),{ validator: ValidService.checkPositiveNumber.validator }],
  time: [required()],
  promotePrice: [required(), { validator: ValidService.checkPositiveNumber.validator }],
  warranty: [
    required(),
    {
      validator: (_rule: any, value: any, callback: any) => {
        if (isNaN(value)) callback(new Error(t('reuse.numberFormat')))
        callback()
      },
      required: false,
      trigger: 'blur'
    }
  ],

})
const formDataCustomize = ref()
const customizeData = async (formData) => {
  formDataCustomize.value = formData
  formDataCustomize.value.Images = formData.photos
  formDataCustomize.value.cost = formData.cost
  formDataCustomize.value.promotePrice = formData.promotePrice
  formDataCustomize.value.status = formData.isActive
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
  IsActive?: boolean
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
  customData.Photo = data.Images
  customData.Cost = data.cost
  customData.PromotePrice = data.promotePrice
  customData.Time = data.time
  customData.Warranty = data.warranty
  customData.Description = data.description
  customData.ShortDescription = data.shortDescription
  customData.Name = data.name
  customData.Code = data.code
  customData.IsActive = data.status
  customData.UpdatedBy = 'katsuke'
  customData.CreatedBy = 'katnguyen'
  customData.UpdatedAt = curDate.toString()
  customData.CreatedAt = curDate.toString()
  customData.IsApproved = false
  return customData
}
const { push } = useRouter()
const editData = async (data) => {
  const payload = {
    Id: id,
    DeletedImages: data.DeleteFileIds.toString(),
    NewPhotos: data.Images
  }
  await updateSpa({ ...payload, ...customPostData(data) })
    .then(() => {
      ElNotification({
        message: t('reuse.updateSuccess'),
        type: 'success'
      }),
        push({
          name: 'products-services.ServiceLibrary.SpaService',
          params: { backRoute: 'products-services.ServiceLibrary.SpaService' }
        })
    })
    .catch(() =>
      ElNotification({
        message: t('reuse.updateFail'),
        type: 'warning'
      })
    )
}
const postData = async (data) => {
  console.log('có vào đây ko')
  data = customPostData(data)
  await postSpa(FORM_IMAGES(data))
    .then(() => {
      ElNotification({
        message: t('reuse.addSuccess'),
        type: 'success'
      }),
        push({
          name: 'products-services.ServiceLibrary.SpaService',
          params: { backRoute: 'products-services.ServiceLibrary.SpaService' }
        })
    })
    .catch((res) =>
      ElNotification({
        message: res.response.data.message,
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
          :apiId="getSpaById"
          :schema="schema"
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
<style lang="less" scoped>
  ::v-deep(.el-checkbox-group) {
    display: flex;
  }

  ::v-deep(.approval-wrap) {
      width: 150px;

    .el-input__wrapper{
      padding: 0;
    }

    input {
      padding: 0 8px ;
      color: rgb(234 179 8); 
      background-color: #fff0d9;
      border-width: 0;
    }
  } 

  ::v-deep(.el-input__icon){
    min-width: 30px;
    justify-content: flex-end;
  }

  ::v-deep(.btn-wrap) {
    margin-left: 140px;
  }

</style>
