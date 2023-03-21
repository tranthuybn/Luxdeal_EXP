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
const curDate = 'PT' + moment().format('hhmmss')

const schema = reactive<FormSchema[]>([
  {
    field: 'generalServiceInformation',
    label: t('formDemo.informationReceipts'),
    component: 'Divider'
  },
  {
    field: 'code',
    label: t('formDemo.receiptsCode'),
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
    label: t('reuse.petitioner'),
    component: 'Select',
    colProps: {
      span: 18
    },
    componentProps: {
      placeholder: t('reuse.chooseARecommender'),
      options: [
      { label: 'Tran Thu', value: 1 },
      ]
    }
  },
  {
    field: 'name',
    label: t('formDemo.reasonCollectingMoney'),
    component: 'Input',
    colProps: {
      span: 18
    },
    componentProps: {
      placeholder: t('formDemo.enterDescription'),
    }
  },
  {
    field: 'generalServiceInformation',
    label: t('reuse.subject'),
    component: 'Divider'
  },
  {
    field: 'name',
    label: t('reuse.selectObject'),
    component: 'Select',
    colProps: {
      span: 18
    },
    componentProps: {
      placeholder: 'Lấy tk đang tạo phiếu',
      options: [
      { label: 'Tran Thu', value: 1 },
      ]
    }
  },
  {
    field: 'generalServiceInformation',
    label: t('formDemo.billingInformation'),
    component: 'Divider'
  },
  {
    field: 'cost',
    label: t('formDemo.amountCollect'),
    component: 'InputPrice',
    value: '',
    colProps: {
      span: 18
    },
    componentProps: {
      showCurrency: false,
      placeholder: t('reuse.placeholderMoney'),
      suffixIcon: h('div', 'đ'),
    }
  },
  {
    field: 'name',
    label: t('formDemo.writtenWords'),
    component: 'Input',
    colProps: {
      span: 18
    },
    componentProps: {
      placeholder: t('formDemo.writtenWords'),
    }
  },
  {
    field: 'name',
    label: t('formDemo.formPayment'),
    component: 'Select',
    value: 1,
    colProps: {
      span: 18
    },
    componentProps: {
      options: [
      { label: t('reuse.payThroughMoney'), value: 1 },
      { label: t('reuse.payThroughCard'), value: 2 },
      ]
    }
  },

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
  cost: [{ validator: ValidService.checkPositiveNumber.validator }],
  time: [],
  promotePrice: [{ validator: ValidService.checkPositiveNumber.validator }],
  warranty: [
    {
      validator: (_rule: any, value: any, callback: any) => {
        if (isNaN(value)) callback(new Error(t('reuse.numberFormat')))
        callback()
      },
      required: false,
      trigger: 'blur'
    }
  ]
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
}
const collapse: Array<Collapse> = [
  {
    icon: minusIcon,
    name: 'receiptsAddDetails',
    title: t('reuse.receiptsAddDetails'),
    columns: schema
  }
]
let currentCollapse = ref<string>(collapse[0].name)
const deleteOrigin = `${t('reuse.deleteUnit')}`
const activeName = ref('receiptsAddDetails')
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
      border-width: 0;
      padding: 0 8px ;
      color: rgb(234 179 8); 
      background-color: #fff0d9;
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
