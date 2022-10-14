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
import { FORM_IMAGES } from '@/utils/format'
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
      span: 14
    },
    componentProps: {
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
      span: 10
    },
    componentProps: {
      placeholder: t('formDemo.enterPercent'),
      suffixIcon: h('div', '%')
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
        { label: t('reuse.allCustomer'), value: 1 },
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

let valueRadioOjbApply = ref(2)
const hideTableCustomer = (data) => {
  data == 1 ? (schema[8].hidden = true) : (schema[8].hidden = false)
  valueRadioOjbApply = data
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
const rules = reactive({})

const router = useRouter()
const id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)

//post data api
type FormDataPost = {
  Id: number
  Code: string
  Name: string
  Description?: string
  ReducePercent?: number
  ReduceCash?: number
  CustomerIds: string
  ProductPropertyIdJson: string
  StartDate: string
  EndDate: string
  TargetType: number
  ServiceType: number
  Image: any
  CampaignType: number
}

const customPostDataFlashSale = (data) => {
  const customData = {} as FormDataPost

  customData.Code = data.code
  customData.Name = data.code
  customData.Description = data.shortDescription
  customData.ReducePercent = data.reduce
  customData.StartDate = data.date[0]
  customData.EndDate = data.date[1]
  customData.CampaignType = 1
  customData.TargetType = 2
  customData.ServiceType = 1
  customData.Image = data.Images
  if (valueRadioOjbApply.value == 1) {
    customData.CustomerIds = ''
  } else {
    customData.CustomerIds = data.customers.map((customer) => customer.id).toString()
  }
  customData.ProductPropertyIdJson = JSON.stringify(data.products)
  return customData
}

//edit data api
type FormDataEdit = {
  Id: number
  Name: string
  Description?: string
  ReducePercent?: number
  ReduceCash?: number
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
  customData.ReducePercent = data.reduce
  customData.ReduceCash = 30
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
  return customData
}

const postData = async (data) => {
  data = customPostDataFlashSale(data)
  await addNewCampaign(FORM_IMAGES(data))
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

type SetFormData = {
  code: string
  promotion: number
  reduce: number
  date: any
  shortDescription: string
  customers: any
  products: any
  Image: any
}
const emptyFormData = {} as SetFormData
const setFormData = reactive(emptyFormData)

const customizeData = async (data) => {
  setFormData.code = data[0].code
  setFormData.promotion = 2
  setFormData.date = [data[0].fromDate, data[0].toDate]
  setFormData.reduce = data[0].reduce
  setFormData.shortDescription = data[0].shortDescription
  setFormData.customers = data[0].customers
  setFormData.products = data[0].productProperties
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
