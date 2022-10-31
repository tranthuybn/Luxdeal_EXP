<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Collapse } from '../../Components/Type'
import { useIcon } from '@/hooks/web/useIcon'
import { addNewCampaign, getCampaignList, updateCampaign } from '@/api/Business'
import { useI18n } from '@/hooks/web/useI18n'
import { ElCollapse, ElCollapseItem, ElButton, ElNotification } from 'element-plus'
import TableOperatorCollection from './TableOperatorCollection.vue'
import { useRouter } from 'vue-router'
import moment from 'moment'
import { FORM_IMAGES } from '@/utils/format'
import { PROMOTION_STRATEGY } from '@/utils/API.Variables'
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
    field: 'date',
    label: t('formDemo.duration'),
    component: 'DatePicker',
    colProps: {
      span: 24
    },
    componentProps: {
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
    field: 'SpaApplicationProduct',
    label: t('formDemo.ApplicableSpaProductsServices'),
    component: 'Divider',
    colProps: {
      span: 24
    }
  },
  {
    field: 'spaProduct',
    component: 'Input',
    colProps: {
      span: 24
    },
    formItemProps: {
      labelWidth: '0px'
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

let valueRadioOjbApply = ref(2)
const hideTableCustomer = (data) => {
  data == 3 ? (schema[6].hidden = true) : (schema[6].hidden = false)
  valueRadioOjbApply.value = data
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
  customData.StartDate = data.date[0]
  customData.EndDate = data.date[1]
  customData.CampaignType = 4
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
  console.log('data edit', data, customData)

  return customData
}

//upload image

const activeName = ref(collapse[0].name)
const rules = reactive({})

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

const customPostDataVoucher = (data) => {
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
  customData.ServiceType = 1
  customData.Image = data.Image

  if (valueRadioOjbApply.value == 3) {
    customData.CustomerIds = null
    customData.TargetType = 3
  } else {
    customData.TargetType = 2
    customData.CustomerIds = data.customers.map((customer) => customer.id).toString()
  }
  customData.ProductPropertyIdJson = '[]'
  customData.VoucherType = 2
  customData.ExchangeValue = 1
  customData.VoucherConditionType = 2
  customData.CampaignType = 4
  return customData
}

const postData = async (data) => {
  data = customPostDataVoucher(data)
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
}
const emptyFormData = {} as SetFormData
const setFormData = reactive(emptyFormData)
const customizeData = async (data) => {
  console.log('data here', data)
  setFormData.code = data[0].code
  setFormData.promotion = 2
  setFormData.date = [data[0].fromDate, data[0].toDate]
  setFormData.reduce = data[0].reduce
  setFormData.shortDescription = data[0].shortDescription
  setFormData.customers = data[0].customers
  console.log('setFormDataAfterChange: ', setFormData)
}

const editData = async (data) => {
  data = customEditDataVoucher(data)

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
          :apiId="getCampaignList"
          :id="id"
          :params="params"
          @post-data="postData"
          :showProduct="false"
          :rules="rules"
          @customize-form-data="customizeData"
          :formDataCustomize="setFormData"
          :multipleImages="false"
          @edit-data="editData"
        />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
