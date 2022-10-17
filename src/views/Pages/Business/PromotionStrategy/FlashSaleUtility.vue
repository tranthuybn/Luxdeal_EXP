<script setup lang="ts">
import { h, reactive, ref } from 'vue'
import { Collapse } from '../../Components/Type'
import { getCampaignList, addNewCampaign, updateCampaign } from '@/api/Business'
import { useIcon } from '@/hooks/web/useIcon'
import { useI18n } from '@/hooks/web/useI18n'
import { ElCollapse, ElCollapseItem, ElButton, ElNotification } from 'element-plus'
import TableOperatorCollection from './TableOperatorCollection.vue'
import { useRouter } from 'vue-router'
import { PROMOTION_STRATEGY } from '@/utils/API.Variables'
import { FORM_IMAGES, moneyToNumber } from '@/utils/format'
import { useValidator } from '@/hooks/web/useValidator'
const { t } = useI18n()

const params = { CampaignType: PROMOTION_STRATEGY[0].key }

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
    label: t('formDemo.flashSaleCode'),
    component: 'Input',
    colProps: {
      span: 24
    }
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
    }
  },
  {
    field: 'reduce',
    component: 'Input',
    colProps: {
      span: 6
    },
    value: '',
    componentProps: {
      formatter: null,
      parser: null,
      placeholder: t('reuse.enterPercentOrMoney'),
      suffixIcon: h('span', ''),
      max: 100
    },
    formItemProps: {
      labelWidth: '0px'
    }
  },
  {
    field: 'date',
    label: t('formDemo.duration'),
    component: 'DatePicker',
    colProps: {
      span: 24
    },
    componentProps: {
      format: 'YYYY-MM-DD',
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
    label: t('reuse.status'),
    component: 'Divider',
    colProps: {
      span: 24
    }
  },
  {
    field: 'statusValue',
    label: t('reuse.status'),
    component: 'Input',
    colProps: {
      span: 24
    }
  }
])
const { required, ValidService } = useValidator()
const rules = reactive({
  code: [{ validator: ValidService.checkCodeServiceLength.validator }, required()],
  promotion: required(),
  date: required(),
  reduce: [{ validator: ValidService.checkPositiveNumber.validator }]
})

let valueRadioOjbApply = ref(2)
const hideTableCustomer = (data) => {
  data == 3 ? (schema[8].hidden = true) : (schema[8].hidden = false)
  valueRadioOjbApply.value = data
}

const changeSuffixIcon = (data) => {
  if (schema[3].componentProps) {
    if (data == 1) {
      schema[3].hidden = false
      schema[2].colProps!.span = 18
      schema[3].componentProps.suffixIcon = h('span', '%')
      rules.reduce = [{ validator: ValidService.maxPercent.validator }]
    }
    if (data == 2) {
      schema[3].hidden = false
      schema[2].colProps!.span = 18
      schema[3].componentProps.suffixIcon = h('span', 'đ')
      rules.reduce = [{ validator: ValidService.checkPositiveNumber.validator }]
    }
    if (data == 3) {
      schema[3].hidden = true
      schema[2].colProps!.span = 24
      schema[3].componentProps.suffixIcon = h('span', '')
      rules.reduce = []
    }
  }
}
const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })
const collapse: Array<Collapse> = [
  {
    icon: minusIcon,
    name: 'generalInformation',
    title: t('formDemo.detailsOfFlashSaleProgram'),
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
  VoucherType: number
  ExchangeValue: number
  ServiceType: number
  Image: any
  CampaignType: number
}

const customPostDataFlashSale = (data) => {
  const customData = {} as FormDataPost

  if (data.promotion == 1) {
    customData.ReducePercent = data.reduce
    customData.ReduceCash = null
  } else if (data.promotion == 2) {
    customData.ReduceCash = data.reduce
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
  customData.CampaignType = 1
  customData.ServiceType = 1
  customData.Image = data.Images
  if (valueRadioOjbApply.value == 1) {
    customData.CustomerIds = null
    customData.TargetType = 3
  } else {
    customData.TargetType = 2
    customData.CustomerIds = data.customers.map((customer) => customer.id).toString()
  }
  customData.ProductPropertyIdJson = JSON.stringify(data.products)
  return customData
}

//edit data api
type FormDataEdit = {
  Id: number
  Name?: string
  Description?: string
  ReducePercent?: number | null
  ReduceCash?: number | null
  CustomerIds?: string
  CustomerIdsAdd?: string
  CustomerIdsDelete?: string
  ProductPropertyIdJson: string
  StartDate: string
  EndDate: string
  TargetType: number
  ServiceType: number
  Image: any
  CampaignType: number
}

const customEditDataFlashSale = (data) => {
  const customData = {} as FormDataEdit
  customData.Id = id
  customData.Name = data.code
  customData.Description = data.shortDescription
  if (data.promotion == 1) {
    customData.ReducePercent = data.reduce
    customData.ReduceCash = null
  } else if (data.promotion == 2) {
    customData.ReduceCash = data.reduce
    customData.ReducePercent = null
  } else {
    customData.ReducePercent = null
    customData.ReduceCash = null
  }
  customData.CustomerIds = data.customers.map((customer) => customer.id).toString()
  customData.CustomerIdsDelete = '2,3'
  customData.StartDate = data.date[0]
  customData.EndDate = data.date[1]
  customData.CampaignType = 1
  customData.TargetType = 2
  customData.ServiceType = 1
  customData.Image = data.Images
  if (valueRadioOjbApply.value == 1) {
    customData.CustomerIdsAdd = ''
  } else {
    customData.CustomerIdsAdd = data.customers.map((customer) => customer.id).toString()
  }
  customData.ProductPropertyIdJson = JSON.stringify(data.products)
  console.log('data edit', data)

  return customData
}

const postData = async (data) => {
  data = customPostDataFlashSale(data)
  console.log('data post:', data)

  await addNewCampaign(FORM_IMAGES(data))
    .then(() =>
      ElNotification({
        message: t('reuse.addSuccess'),
        type: 'success'
      })
    )
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
}
const emptyFormData = {} as SetFormData
const setFormData = reactive(emptyFormData)

const customizeData = async (data) => {
  if (data[0].reduce) {
    const moneyType = data[0].reduce.split(' ')
    moneyType[1] == '%' ? (setFormData.promotion = 1) : (setFormData.promotion = 2)
  } else {
    setFormData.promotion = 3
  }
  changeSuffixIcon(setFormData.promotion)
  setFormData.code = data[0].code
  setFormData.date = [data[0].fromDate, data[0].toDate]
  setFormData.reduce = moneyToNumber(data[0].reduce)
  setFormData.shortDescription = data[0].shortDescription
  setFormData.customers = data[0].customers
  setFormData.products = data[0].productProperties
  setFormData.Images = data[0].images
  setFormData.target = data[0].targetType
  hideTableCustomer(data[0].targetType)
}

const editData = async (data) => {
  data = customEditDataFlashSale(data)

  await updateCampaign(FORM_IMAGES(data))
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
  <div class="demo-collapse dark:bg-[#141414]">
    <el-collapse v-model="activeName" @change="collapseChangeEvent">
      <el-collapse-item :name="collapse[0].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[0].icon" link />
          <span class="text-center text-xl">{{ collapse[0].title }}</span>
        </template>
        <TableOperatorCollection
          ref="formRef"
          :schema="schema"
          :type="type"
          :id="id"
          :apiId="getCampaignList"
          @post-data="postData"
          :params="params"
          :rules="rules"
          @customize-form-data="customizeData"
          :formDataCustomize="setFormData"
          @edit-data="editData"
        />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
