<script setup lang="ts">
import { h, onBeforeMount, reactive, ref } from 'vue'
import { Collapse } from '../../Components/Type'
import { addNewCampaign, getCampaignList, updateCampaign } from '@/api/Business'
import { useIcon } from '@/hooks/web/useIcon'
import { useI18n } from '@/hooks/web/useI18n'
import { ElCollapse, ElCollapseItem, ElButton, ElNotification } from 'element-plus'
import TableOperatorCollection from './TableOperatorCollection.vue'
import { useRouter } from 'vue-router'
import { PROMOTION_STRATEGY } from '@/utils/API.Variables'
import moment from 'moment'
import { FORM_IMAGES, moneyToNumber } from '@/utils/format'
import { useValidator } from '@/hooks/web/useValidator'
import { API_URL } from '@/utils/API_URL'
const { t } = useI18n()
const curDate = 'VC' + moment().format('hhmmss')

const params = { CampaignType: PROMOTION_STRATEGY[3].key }

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
    label: t('formDemo.voucherCode'),
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
    field: 'order',
    label: t('formDemo.odersApply'),
    component: 'Select',
    colProps: {
      span: 18
    },
    componentProps: {
      placeholder: t('reuse.selectOrder'),
      style: 'width: 100%',
      options: [
        { label: t('reuse.sellOrderList'), value: 1 },
        { label: t('reuse.leaseOrderList'), value: 3 },
        { label: t('reuse.spaOrderList'), value: 5 }
      ]
    },
    value: 1
  },
  {
    field: 'orderInput',
    component: 'InputPrice',
    value: 0,
    colProps: {
      span: 6
    },
    componentProps: {
      style: 'width: 100%'
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
    field: 'condition',
    component: 'Select',
    label: t('formDemo.condition'),
    colProps: {
      span: 20
    },
    componentProps: {
      style: 'width: 100%',
      disabled: true,
      placeholder: t('reuse.selectCondition'),
      options: [
        { label: t('reuse.freeRecievedVoucher'), value: 1 },
        { label: t('reuse.voucherAffiliate'), value: 2 },
        { label: t('reuse.exchangeByPoints'), value: 3 },
        { label: t('reuse.buyByVirtualWallet'), value: 4 }
      ]
    }
  },
  {
    field: 'voucherButton',
    component: 'Input',
    colProps: {
      span: 4
    },
    formItemProps: {
      labelWidth: '0px'
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
    field: 'status',
    label: t('reuse.status'),
    component: 'Divider',
    colProps: {
      span: 24
    }
  },
  {
    field: 'statusVoucher',
    label: t('formDemo.voucherSendingSettings'),
    component: 'Checkbox',
    colProps: {
      span: 24
    },
    componentProps: {
      options: [
        {
          label: t('formDemo.sendImmediatelyAfterBrowsing'),
          value: true
        }
      ]
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
const { required, ValidService, requiredOption } = useValidator()

const rules = reactive({
  code: [{ validator: ValidService.checkCodeServiceLength.validator }, required()],
  promotion: requiredOption(),
  date: required(),
  percent: [required(), { validator: ValidService.maxPercent.validator }],
  money: [required(), { validator: ValidService.checkPositiveNumber.validator }],
  shortDescription: required(),
  condition: required(),
  order: requiredOption(),
  orderInput: required()
})
let valueRadioOjbApply = ref(2)
const hideTableCustomer = (data) => {
  console.log(data)

  data == 3 ? (schema[13].hidden = true) : (schema[13].hidden = false)
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
    title: t('formDemo.voucherDetails'),
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
  VoucherConditionType?: number
  ExchangeValue?: number
  CampaignType: number
  MinimumPriceToGetReduce: number
  MaximumReduce: number
}

const customEditDataVoucher = (data) => {
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
  customData.MinimumPriceToGetReduce = 10000
  customData.MaximumReduce = 10000
  customData.VoucherConditionType = data.condition.value
  customData.StartDate = data.date[0]
  customData.EndDate = data.date[1]
  customData.CampaignType = 4
  customData.ServiceType = data.order
  customData.Image = data.Image
  if (data.target == 3) {
    customData.CustomerIds = null
    customData.TargetType = 3
  } else {
    customData.TargetType = 2
    customData.CustomerIds = data.customers.map((customer) => customer.id).toString()
  }
  customData.ExchangeValue = 1
  customData.ProductPropertyIdJson = '[]'
  console.log('data edit', data, customData)

  return customData
}

//upload image

const activeName = ref(collapse[0].name)

const router = useRouter()
const id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)
const tab = Number(router.currentRoute.value.params.tab)

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
  MinimumPriceToGetReduce: number
  MaximumReduce: number
}

const customPostDataVoucher = (data) => {
  const customData = {} as FormDataPost
  customData.VoucherType = 1
  customData.CampaignType = 4

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
  customData.MinimumPriceToGetReduce = 10000
  customData.MaximumReduce = 10000
  customData.Code = data.code
  customData.Name = data.code
  customData.Description = data.shortDescription
  customData.StartDate = data.date[0]
  customData.EndDate = data.date[1]
  customData.ServiceType = data.order
  customData.Image = data.Image

  if (valueRadioOjbApply.value == 3) {
    customData.CustomerIds = null
    customData.TargetType = 3
  } else {
    customData.TargetType = 2
    customData.CustomerIds = data.customers.map((customer) => customer.id).toString()
  }
  customData.ProductPropertyIdJson = '[]'
  customData.ExchangeValue = 1
  customData.VoucherConditionType = data.condition
  return customData
}

const postData = async (data) => {
  data = customPostDataVoucher(data)
  console.log('data post:', data)

  await addNewCampaign(FORM_IMAGES(data))
    .then(() => {
      ElNotification({
        message: t('reuse.addSuccess'),
        type: 'success'
      }),
        push({
          name: 'business.promotion-strategy.voucher',
          params: { backRoute: 'business.promotion-strategy.voucher' }
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
  condition: string
  Image: any
  target: number
  percent: number
  money: number
  imageurl?: string
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

  setFormData.condition = data[0].voucherConditionTypeName
  setFormData.code = data[0].code
  setFormData.date = [data[0].fromDate, data[0].toDate]
  setFormData.reduce = data[0].reduce
  setFormData.shortDescription = data[0].description
  setFormData.customers = data[0].customers
  setFormData.Image = data[0].images[0].path
  setFormData.imageurl = `${API_URL}${data[0].images[0].path}`
  console.log('setFormDataAfterChange: ', setFormData)
}
const { push } = useRouter()

const editData = async (data) => {
  data = customEditDataVoucher(data)

  await updateCampaign(FORM_IMAGES(data))
    .then(() => {
      ElNotification({
        message: t('reuse.updateSuccess'),
        type: 'success'
      }),
        push({
          name: 'business.promotion-strategy.voucher',
          params: { backRoute: 'business.promotion-strategy.voucher' }
        })
    })
    .catch(() =>
      ElNotification({
        message: t('reuse.updateFail'),
        type: 'warning'
      })
    )
}

onBeforeMount(() => {
  if (type === 'add') {
    schema[16].hidden = true
  }
})
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
          :params="params"
          :apiId="getCampaignList"
          @post-data="postData"
          :rules="rules"
          @customize-form-data="customizeData"
          :formDataCustomize="setFormData"
          :multipleImages="false"
          @edit-data="editData"
          :tabActive="tab"
        />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
