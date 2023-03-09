<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Collapse } from '../../Components/Type'
import { useIcon } from '@/hooks/web/useIcon'
import { useI18n } from '@/hooks/web/useI18n'
import { ElCollapse, ElCollapseItem, ElButton, ElNotification } from 'element-plus'
import TableOperatorCollection from './TableOperatorCollection.vue'
import { getCampaignList, addNewCampaign, updateCampaign } from '@/api/Business'
import { PROMOTION_STRATEGY } from '@/utils/API.Variables'
import { useRouter } from 'vue-router'
import { FORM_IMAGES } from '@/utils/format'
import moment from 'moment'
import { API_URL } from '@/utils/API_URL'

const { t } = useI18n()
const curDate = 'Combo0' + moment().format('hhmmss')
const params = { CampaignType: PROMOTION_STRATEGY[4].key }

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
    label: t('formDemo.comboCode'),
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
      options: [
        { label: t('reuse.freeReceiveCombo'), value: 1 },
        { label: t('reuse.exchangeByPoints'), value: 2 },
        { label: t('reuse.buyByVirtualWallet'), value: 3 }
      ]
    }
  },
  {
    field: 'comboButton',
    component: 'Input',
    colProps: {
      span: 4
    },
    formItemProps: {
      labelWidth: '0px'
    }
  },
  {
    field: 'applicationProduct',
    label: t('formDemo.ApplicableSpaProductsServices'),
    component: 'Divider',
    colProps: {
      span: 24
    }
  },
  {
    field: 'tableProductOfCombo',
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
    label: t('reuse.statusProgram'),
    component: 'Input',
    colProps: {
      span: 24
    }
  }
])

const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })
const collapse: Array<Collapse> = [
  {
    icon: minusIcon,
    name: 'generalInformation',
    title: t('formDemo.comboProgramDetails'),
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
  ComboValue: any
}

const customPostDataCombo = (data) => {
  console.log('data before post', data)
  const customData = {} as FormDataPost
  customData.Code = data.code
  customData.Name = data.code
  customData.Description = data.shortDescription
  customData.StartDate = data.date[0]
  customData.EndDate = data.date[1]
  customData.CampaignType = 5
  customData.Image = data.Image
  customData.VoucherConditionType = data.condition

  let postIdSpaService = ref('')
  data.tableProductOfCombo.pop()
  data.tableProductOfCombo?.map((val) => {
    postIdSpaService.value += val.service.toString()
  })

  let postSpaTable = data.tableProductOfCombo?.map((val) => ({
    Id: val.id,
    IsActive: val.isActive,
    SpaServiceIds: postIdSpaService.value
  }))


  customData.ProductPropertyIdJson = JSON.stringify(
    postSpaTable
  )
  customData.ComboValue = 1
  return customData
}


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
  ComboValue: any
}


const customEditDataCombo = (data) => {
  const customData = {} as FormDataEdit
  customData.Id = id
  customData.Name = data.code
  customData.Description = data.shortDescription
  customData.StartDate = data.date[0]
  customData.EndDate = data.date[1]
  customData.CampaignType = 6
  customData.Image = data.Image

  let postIdSpaService = ref('')
  data.tableProductOfCombo.pop()
  data.tableProductOfCombo?.map((val) => {
    postIdSpaService.value += val.service.toString()
  })

  let postSpaTable = data.tableProductOfCombo?.map((val) => ({
    Id: val.id,
    IsActive: val.isActive,
    SpaServiceIds: postIdSpaService.value
  }))


  customData.ProductPropertyIdJson = JSON.stringify(
    postSpaTable
  )
  customData.ComboValue = data.spa
  return customData
}

const postData = async (data) => {
  data = customPostDataCombo(data)
  await addNewCampaign(FORM_IMAGES(data))
    .then(() => {
      ElNotification({
        message: t('reuse.addSuccess'),
        type: 'success'
      }),
        push({
          name: 'business.promotion-strategy.combo',
          params: { backRoute: 'business.promotion-strategy.combo' }
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
  date: any
  shortDescription: string
  customers: any
  products: any
  Image: any
  imageurl?: string
  statusHistory?: any
}

const emptyFormData = {} as SetFormData
const setFormData = reactive(emptyFormData)



// let apiData = ref()
const customizeData = async (data) => {
  setFormData.date = [data[0].fromDate, data[0].toDate]
  setFormData.products = data[0]?.productProperties
  setFormData.code = data[0]?.code
  setFormData.shortDescription = data[0].description
  setFormData.Image = data[0]?.Images
  setFormData.imageurl = `${API_URL}${data[0].images[0].path}`
  setFormData.statusHistory = data[0].statusHistory

}

const { push } = useRouter()
const editData = async (data) => {
  data = customEditDataCombo(data)

  await updateCampaign(FORM_IMAGES(data))
    .then(() => {
      ElNotification({
        message: t('reuse.updateSuccess'),
        type: 'success'
      }),
        push({
          name: 'business.promotion-strategy.combo',
          params: { backRoute: 'business.promotion-strategy.combo' }
        })
    })
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
ref="formRef" :schema="schema" :type="type" :id="id" :multipleImages="false"
          :params="params" :apiId="getCampaignList" @post-data="postData" :formDataCustomize="setFormData"
          @customize-form-data="customizeData" @edit-data="editData" 
          :campaignAndStrategyType="5"
          />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
