<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Collapse } from '../../Components/Type'
import { useIcon } from '@/hooks/web/useIcon'
import { useI18n } from '@/hooks/web/useI18n'
import { ElCollapse, ElCollapseItem, ElButton } from 'element-plus'
import TableOperatorCollection from './TableOperatorCollection.vue'
import { getCampaignList, addNewCampaign, updateCampaign } from '@/api/Business'
import { PROMOTION_STRATEGY } from '@/utils/API.Variables'
import { useRouter } from 'vue-router'
import { FORM_IMAGES } from '@/utils/format'
import moment from 'moment'

const { t } = useI18n()

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
    field: 'discountCode',
    label: t('formDemo.auctionCode'),
    component: 'Input',
    colProps: {
      span: 24
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
    label: t('reuse.status'),
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
    title: t('formDemo.auctionProgramDetails'),
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
  discountCode: string
}
const emptyFormData = {} as SetFormData
const setFormData = reactive(emptyFormData)

const activeName = ref(collapse[0].name)
const rules = reactive({})

const router = useRouter()
const id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)

const postData = async (data) => {
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
  const payload = {
    Code: data.discountCode,
    Name: data.discountCode,
    Description: data.shortDescription,
    ReducePercent: 1,
    CustomerIds: '2,3',
    ProductPropertyIdJson: JSON.stringify(postSpaTable),
    StartDate: moment(data.date[0]).format('YYYY-MM-DD'),
    EndDate: moment(data.date[1]).format('YYYY-MM-DD'),
    CampaignType: 5,
    TargetType: 2,
    ComboValue: data.spa,
    ServiceType: 1,
    Image: data.Image
  }

  console.log('payload: ', payload)
  let postPayload = FORM_IMAGES(payload)
  await addNewCampaign(postPayload)
}
// let apiData = ref()
const customizeData = async (data) => {
  // apiData.value = data
  setFormData.date = [data[0]?.fromDate, data[0]?.toDate]
  setFormData.products = data[0]?.productProperties
  setFormData.discountCode = data[0]?.code
  setFormData.shortDescription = data[0]?.description
  setFormData.Images = data[0]?.Images
}

const editData = async (data) => {
  console.log('edit data', data)
  let postIdSpaService = ref('')
  data.tableProductOfCombo.map((val) => {
    postIdSpaService.value += val.service?.toString()
  })
  let postSpaTable = data.tableProductOfCombo.map((val) => ({
    Id: val.id,
    IsActive: val.isActive,
    SpaServiceIds: postIdSpaService.value ?? '2,3'
  }))
  console.log('postSpaTable: ', postSpaTable)
  const payload = {
    Id: id,
    Name: data.name,
    Description: data.Description,
    ProductPropertyIdJson: JSON.stringify(postSpaTable),
    StartDate: data.date[0],
    EndDate: data.date[1],
    ExchangeValue: data.spa,
    Image: data.Image
  }

  const updateForm = FORM_IMAGES(payload)
  await updateCampaign(updateForm)
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
          :multipleImages="false"
          :params="params"
          :apiId="getCampaignList"
          @post-data="postData"
          :formDataCustomize="setFormData"
          :rules="rules"
          @customize-form-data="customizeData"
          @edit-data="editData"
        />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
