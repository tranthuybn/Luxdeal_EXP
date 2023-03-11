<script setup lang="ts">
import { h, reactive, ref } from 'vue'
import { Collapse } from '../../Components/Type'
import { getCampaignList, addNewCampaign, updateCampaign, deleteCampaign } from '@/api/Business'
import { useIcon } from '@/hooks/web/useIcon'
import { useI18n } from '@/hooks/web/useI18n'
import { ElCollapse, ElCollapseItem, ElButton, ElNotification } from 'element-plus'
import TableOperatorCollection from './TableOperatorCollection.vue'
import { useRouter } from 'vue-router'
import { FORM_IMAGES, moneyToNumber } from '@/utils/format'
import { PROMOTION_STRATEGY } from '@/utils/API.Variables'
import { API_URL } from '@/utils/API_URL'
import moment from 'moment'

import { useValidator } from '@/hooks/web/useValidator'

const { t } = useI18n()

const { required, ValidService, requiredOption } = useValidator()
const rules = reactive({
  code: [{ validator: ValidService.checkCodeServiceLength.validator }, required()],
  promotion: requiredOption(),
  date: required(),

  percent: [
    required(),
    { validator: ValidService.maxPercent.validator, blur: ValidService.maxPercent.trigger }
  ],
  money: [
    required(),
    { validator: ValidService.checkPositiveNumber.validator, blur: ValidService.maxPercent.trigger }
  ],
  shortDescription: [required(), { validator: ValidService.checkDescriptionLength.validator }]
})

const params = { CampaignType: PROMOTION_STRATEGY[1].key }


//random mã
const curDate = 'BST0' + moment().format('hhmmss')
const schema = reactive<FormSchema[]>([
  {
    field: 'collectionInfo',
    label: t('router.analysis'),
    component: 'Divider',
    colProps: {
      span: 24
    }
  },
  {
    field: 'code',
    label: t('formDemo.codeCollection'),
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      disabled: true
    },
    value: curDate
  },
  {
    field: 'promotion',
    label: t('reuse.promotion'),
    component: 'Select',
    colProps: {
      span: 18
    },
    componentProps: {
      onChange: (data) => changeSuffixIcon(data),
      placeholder: t('formDemo.choosePromotion'),
      style: 'width: 100%',
      options: [
        { label: t('formDemo.decreaseByPercent'), value: 1 },
        { label: t('formDemo.decreaseByAmount'), value: 2 },
        { label: t('formDemo.noPromotion'), value: 3 }
      ]
    },
    value: 1
  },
  {
    field: 'percent',
    component: 'Input',
    colProps: {
      span: 6
    },
    value: '',
    componentProps: {
      placeholder: t('formDemo.enterPercent'),
      suffixIcon: h('span', '%')
    },
    formItemProps: {
      labelWidth: '0px'
    },
    hidden: false
  },
  {
    field: 'money',
    component: 'Input',
    colProps: {
      span: 6
    },
    value: '',
    componentProps: {
      placeholder: t('reuse.placeholderMoney'),
      suffixIcon: h('span', 'đ')
    },
    formItemProps: {
      labelWidth: '0px'
    },
    hidden: true
  },
  {
    field: 'date',
    label: t('formDemo.duration'),
    component: 'DatePicker',
    colProps: {
      span: 24
    },
    componentProps: {
      format: 'DD/MM/YYYY',
      valueFormat: 'YYYY-MM-DD',
      type: 'daterange'
    }
  },
  {
    field: 'shortDescription',
    component: 'Input',
    label: t('reuse.shortDescription'),
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('formDemo.enterShortDescription')
    }
  },
  {
    field: 'subjectsOfApplication',
    label: t('reuse.subjectsOfApplication'),
    component: 'Divider',
    colProps: {
      span: 24
    }
  },
  {
    field: 'target',
    component: 'Radio',
    colProps: {
      span: 24
    },
    value: 2,
    componentProps: {
      onChange: (data) => hideTableCustomer(data),
      options: [
        { label: t('reuse.allCustomer'), value: 3 },
        { label: t('formDemo.chooseCustomerDetail'), value: 2 }
      ]
    },
    formItemProps: {
      labelWidth: '0px'
    }
  },
  {
    field: 'tableCustomer',
    component: 'Input',
    hidden: false,
    colProps: {
      span: 24
    },
    formItemProps: {
      labelWidth: '0px'
    }
  },
  {
    field: 'applicationProduct',
    label: t('formDemo.applicationProduct'),
    component: 'Divider',
    colProps: {
      span: 24
    }
  },
  {
    field: 'tableProduct',
    component: 'Input',
    colProps: {
      span: 24
    },
    formItemProps: {
      labelWidth: '0px'
    }
  },
  {
    field: 'status',
    label: t('reuse.status')
    ,
    component: 'Divider',
    colProps: {
      span: 24
    }
  },
  {
    field: 'statusValue',
    label: t('reuse.statusProgram'),
    component: 'Input',
    colProps: {
      span: 24
    }
  }
])

let valueRadioOjbApply = ref(2)
const hideTableCustomer = (data) => {
  data == 3 ? (schema[9].hidden = true) : (schema[9].hidden = false)
  valueRadioOjbApply.value = data
}


const changeSuffixIcon = (data) => {
  if (schema[3].componentProps) {
    if (data == 1) {
      schema[3].hidden = false
      schema[4].hidden = true
      schema[2].colProps!.span = 18
    }
    if (data == 2) {
      schema[3].hidden = true
      schema[4].hidden = false
      schema[2].colProps!.span = 18
    }
    if (data == 3) {
      schema[3].hidden = true
      schema[4].hidden = true
      schema[2].colProps!.span = 24
    }
  }
}


const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })
const collapse: Array<Collapse> = [
  {
    icon: minusIcon,
    name: 'generalInformation',
    title: t('formDemo.collectionProgramDetails'),
    columns: [],
    api: undefined,
    buttonAdd: '',
    typeForm: 'form',
    typeButton: 'form01',
    expand: false,
    apiTableChild: undefined,
    columnsTableChild: undefined,
    pagination: false,
    removeHeaderFilter: true,
    removeDrawer: true,
    selection: false,
    customOperator: 3
  }
]

const collapseChangeEvent = (val) => {
  if (val) {
    collapse.forEach((el) => {
      if (val.includes(el.name)) el.icon = minusIcon
      else if (el.icon == minusIcon) el.icon = plusIcon
    })
  } else
    collapse.forEach((el) => {
      el.icon = plusIcon
    })
}
//upload image
const activeName = ref(collapse[0].name)

const router = useRouter()
const id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)


//post data api
type FormDataPost = {
  Code: string
  Name: string
  Description?: string
  ReducePercent?: number | null
  ReduceCash?: number | null
  CustomerIds?: string | null
  ProductPropertyIdJson?: string
  StartDate: string
  EndDate: string
  TargetType: number
  VoucherType?: number
  VoucherConditionType: number
  ExchangeValue?: number
  ServiceType: number
  Image: any
  CampaignType: number
}

const customPostDataCollection = (data) => {
  const customData = {} as FormDataPost
  if (data.promotion == 1) {
    customData.ReducePercent = data.percent
    customData.ReduceCash = null
  } else if (data.promotion == 2) {
    customData.ReduceCash = data.money
    customData.ReducePercent = null
  } else {
    customData.ReducePercent = null
    customData.ReduceCash = null
  }
  customData.Code = data.code
  customData.Name = data.code
  customData.Description = data.shortDescription
  customData.StartDate = data.date[0]
  customData.EndDate = data.date[1]
  customData.CampaignType = 2
  customData.ServiceType = data.order
  customData.Image = data.Image

  if (valueRadioOjbApply.value == 3) {
    customData.CustomerIds = null
    customData.TargetType = 3
  } else {
    customData.TargetType = 2
    customData.CustomerIds = data.customers.map((customer) => customer.id).toString()
  }
  customData.ProductPropertyIdJson = JSON.stringify(data.products)
  customData.VoucherType = 2
  customData.VoucherConditionType = data.conditon
  return customData
}


//edit data api
type FormDataEdit = {
  Id: number
  Name?: string
  Description?: string
  ReducePercent?: number | null
  ReduceCash?: number | null
  CustomerIds?: string | null
  CustomerIdsAdd?: string
  CustomerIdsDelete?: string
  ProductPropertyIdJson: string
  StartDate: string
  EndDate: string
  TargetType: number
  ServiceType: number
  Image: any
  imageurl?: string
  CampaignType: number
}

const customEditDataFlashSale = (data) => {
  const customData = {} as FormDataEdit
  customData.Id = id
  customData.Name = data.code
  customData.Description = data.shortDescription
  if (data.promotion == 1) {
    customData.ReducePercent = data.percent
    customData.ReduceCash = null
  } else if (data.promotion == 2) {
    customData.ReduceCash = data.money
    customData.ReducePercent = null
  } else {
    customData.ReducePercent = null
    customData.ReduceCash = null
  }
  customData.StartDate = data.date[0]
  customData.EndDate = data.date[1]
  customData.CampaignType = 1
  customData.ServiceType = 1
  customData.Image = data.Image
  if (data.target == 3) {
    customData.CustomerIds = null
    customData.TargetType = 3
  } else {
    customData.TargetType = 2
    customData.CustomerIds = data.customers.map((customer) => customer.id).toString()
  }
  customData.ProductPropertyIdJson = JSON.stringify(
    data.products.map((product) => ({ Id: product.id, IsActive: product.isActive }))
  )

  return customData
}



const postData = async (data) => {
  data = customPostDataCollection(data)
  await addNewCampaign(FORM_IMAGES(data))
    .then(() => {
      ElNotification({
        message: t('reuse.addSuccess'),
        type: 'success'
      }),
        push({
          name: 'business.promotion-strategy.collection',
          params: { backRoute: 'business.promotion-strategy.collection' }
        })
    })
    .catch(() =>
      ElNotification({
        message: t('reuse.addFail'),
        type: 'warning'
      })
    )
}

type SetFormData = {
  code: string
  promotion: number
  reduce: number
  date: any
  shortDescription: string
  customers: any
  products: any
  Images: any
  target: number
  percent: number
  money: number
  imageurl?: string
  statusHistory?: any
}
const emptyFormData = {} as SetFormData
const setFormData = reactive(emptyFormData)


const customizeData = async (data) => {
  if (data[0].reduce) {
    const moneyType = data[0].reduce.split(' ')
    moneyType[1] == '%'
      ? ((setFormData.promotion = 1), (setFormData.percent = moneyToNumber(data[0].reduce)))
      : ((setFormData.promotion = 2), (setFormData.money = moneyToNumber(data[0].reduce)))
  } else {
    setFormData.promotion = 3
  }
  changeSuffixIcon(setFormData.promotion)
  setFormData.code = data[0].code
  setFormData.date = [data[0].fromDate, data[0].toDate]
  setFormData.shortDescription = data[0].Description
  setFormData.customers = data[0].customers
  setFormData.products = data[0].productProperties
  setFormData.Images = data[0].images
  setFormData.target = data[0].targetType
  setFormData.imageurl = `${API_URL}${data[0].images[0].path}`
  setFormData.statusHistory = data[0].statusHistory

  hideTableCustomer(data[0].targetType)
}

const { push } = useRouter()

const editData = async (data) => {
  data = customEditDataFlashSale(data)

  await updateCampaign(FORM_IMAGES(data))
    .then(() => {
      ElNotification({
        message: t('reuse.updateSuccess'),
        type: 'success'
      }),
        push({
          name: 'business.promotion-strategy.collection',
          params: { backRoute: 'business.promotion-strategy.collection' }
        })
    })
    .catch(() =>
      ElNotification({
        message: t('reuse.updateFail'),
        type: 'warning'
      })
    )
}
const escape = useIcon({ icon: 'quill:escape' })
const back = async () => {
  push({
    name: 'business.promotion-strategy.collection'
  })
}


</script>

<template>
  <div class="demo-collapse dark:bg-[#141414]">
    <el-collapse v-model="activeName" @change="collapseChangeEvent">
      <el-collapse-item :name="collapse[0].name">
        <template #title>
          <div class="flex w-full justify-between">
            <div class="before">
              <el-button class="header-icon" :icon="collapse[0].icon" link />
              <span class="text-center text-xl ml-3">{{ collapse[0].title }}</span>
            </div>
            <div @click="back()" class="after">
              <span class="text-center text-xl">{{ t('reuse.exit') }}</span>
              <el-button class="header-icon" :icon="escape" link />
            </div>
          </div>
        </template>
        <TableOperatorCollection
          ref="formRef" :schema="schema" :type="type" :apiId="getCampaignList" :id="id"
          :delApi="deleteCampaign" :multipleImages="false" @post-data="postData" :params="params" :rules="rules"
          @customize-form-data="customizeData" @edit-data="editData" :formDataCustomize="setFormData"
          :show-product="true"
          :campaignAndStrategyType="2"
          />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
