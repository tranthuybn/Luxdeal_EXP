<script setup lang="ts">
import { h, reactive, ref } from 'vue'
import { Collapse } from '../../Components/Type'
import { useIcon } from '@/hooks/web/useIcon'
import { useI18n } from '@/hooks/web/useI18n'
import { getCampaignList, addNewCampaign, updateCampaign } from '@/api/Business'
import {
  ElCollapse,
  ElCollapseItem,
  ElButton,
  ElTable,
  ElTableColumn,
  ElSwitch,
  ElNotification
} from 'element-plus'
import TableOperatorCollection from './TableOperatorCollection.vue'
import { useRouter } from 'vue-router'
import { FORM_IMAGES, moneyToNumber } from '@/utils/format'
import { PROMOTION_STRATEGY } from '@/utils/API.Variables'
import { API_URL } from '@/utils/API_URL'
import moment from 'moment'

const { t } = useI18n()
const params = { CampaignType: PROMOTION_STRATEGY[5].key }

//random mã
const curDate = 'DG0' + moment().format('hhmmss')

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
    label: t('formDemo.auctionCode'),
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
    field: 'settingPriceStep',
    label: t('formDemo.floorPriceSettingPriceStep'),
    component: 'Select',
    colProps: {
      span: 14
    },
    componentProps: {
      placeholder: t('formDemo.setPriceFloor'),
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
    field: 'duration',
    component: 'Input',
    colProps: {
      span: 10
    },
    componentProps: {
      placeholder: t('formDemo.setPriceStepUp'),
      suffixIcon: h('div', 'đ')
    },
    formItemProps: {
      labelWidth: '0px'
    }
  },
  {
    field: 'date',
    label: t('formDemo.auctionDeadline'),
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
    field: 'durationPurchase',
    component: 'Input',
    label: t('formDemo.purchaseTime'),
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('formDemo.enterNumberDays'),
      suffixIcon: h('div', { style: 'margin-right:25px' }, t('formDemo.day'))
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
    label: t('reuse.statusProgram'),
    component: 'Input',
    colProps: {
      span: 24
    }
  }
])

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
  },
  {
    icon: plusIcon,
    name: 'auctionHistoryResults',
    title: t('formDemo.auctionHistoryResults'),
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

// table history auction
const tableData = ref([
  {
    customerCode: '2016-05-03',
    customerName: 'Tom',
    highest: 'No. 189, Grove St, Los Angeles',
    paymentTime: '23135',
    purchaseTime: '131554',
    orderCode: '',
    status: 'Quá hạn mua hàng',
    permissionPurchase: false
  },
  {
    customerCode: '2016-05-02',
    customerName: 'Tom',
    highest: 'No. 189, Grove St, Los Angeles',
    paymentTime: '23135',
    purchaseTime: '131554',
    orderCode: '',
    status: '',
    permissionPurchase: true
  },
  {
    customerCode: '2016-05-04',
    customerName: 'Tom',
    highest: 'No. 189, Grove St, Los Angeles',
    paymentTime: '23135',
    purchaseTime: '131554',
    orderCode: '',
    status: 'Đã hủy kết quả',
    permissionPurchase: true
  },
  {
    customerCode: '2016-05-01',
    customerName: 'Tom',
    highest: 'No. 189, Grove St, Los Angeles',
    paymentTime: '23135',
    purchaseTime: '131554',
    orderCode: '',
    status: 'Quá hạn mua hàng',
    permissionPurchase: false
  }
])

// delete row table
const deleteRow = (index: number) => {
  tableData.value.splice(index, 1)
}



//upload image

const activeName = ref(collapse[0].name)

const router = useRouter()
const id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)
const targetId = Number(router.currentRoute.value.params.targetId)

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


const customPostDataAuction = (data) => {
  const customData = {} as FormDataPost
  customData.Code = data.code
  customData.Name = data.code
  customData.Description = data.shortDescription
  customData.StartDate = data.date[0]
  customData.EndDate = data.date[1]
  customData.TargetType = 3
  customData.CampaignType = 6
  customData.ServiceType = data.order
  customData.Image = data.Image
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


const customEditDataAuction = (data) => {
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
  customData.CampaignType = 6
  customData.ServiceType = data.order
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
  data = customPostDataAuction(data)
  await addNewCampaign(FORM_IMAGES(data))
    .then(() => {
      ElNotification({
        message: t('reuse.addSuccess'),
        type: 'success'
      }),
        push({
          name: 'business.promotion-strategy.auction',
          params: { backRoute: 'business.promotion-strategy.auction' }
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
  Image: any
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
  setFormData.shortDescription = data[0].description
  setFormData.customers = data[0].customers
  setFormData.products = data[0].productProperties
  setFormData.Image = data[0].images[0].path
  setFormData.target = data[0].targetType
  setFormData.imageurl = `${API_URL}${data[0].images[0].path}`
  setFormData.statusHistory = data[0].statusHistory

}


const { push } = useRouter()
const editData = async (data) => {
  data = customEditDataAuction(data)

  await updateCampaign(FORM_IMAGES(data))
    .then(() => {
      ElNotification({
        message: t('reuse.updateSuccess'),
        type: 'success'
      }),
        push({
          name: 'business.promotion-strategy.auction',
          params: { backRoute: 'business.promotion-strategy.auction' }
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
    name: 'business.promotion-strategy.auction'
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
           ref="formRef" :apiId="getCampaignList" :schema="schema" :type="type"
          :multipleImages="false" :id="id" :params="params" @post-data="postData" :formDataCustomize="setFormData"
          @customize-form-data="customizeData" @edit-data="editData" :show-product="true" :targetId="targetId"
          :campaignAndStrategyType="6" />
      </el-collapse-item>

      <el-collapse-item :name="collapse[1].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[1].icon" link />
          <span class="text-center text-xl">{{ collapse[1].title }}</span>
        </template>
        <el-table :data="tableData" border>
          <el-table-column prop="customerCode" :label="t('reuse.customerCode')" width="180" />
          <el-table-column prop="customerName" :label="t('formDemo.customerName')" width="180" />
          <el-table-column prop="highest" :label="t('formDemo.highestBid')" />
          <el-table-column prop="paymentTime" :label="t('formDemo.paymentTime')" />
          <el-table-column prop="purchaseTime" :label="t('formDemo.purchaseTime')" />
          <el-table-column prop="orderCode" :label="t('formDemo.orderCode')" />
          <el-table-column prop="status" :label="t('formDemo.status')" />
          <el-table-column prop="permissionPurchase" :label="t('formDemo.permissionPurchase')" width="180" align="center">
            <template #default="props">
              <el-switch v-model="props.row.permissionPurchase" inline-prompt active-text="ON" inactive-text="OFF" />
            </template>
          </el-table-column>
          <el-table-column fixed="right" :label="t('reuse.operator')" width="120">
            <template #default="scope">
              <el-button type="danger" @click.prevent="deleteRow(scope.$index)">
                {{ t('button.cancelResult') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style scoped>
::v-deep(.el-table .cell) {
  word-break: break-word;
}
</style>
