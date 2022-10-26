<script setup lang="ts">
import { h, reactive, ref } from 'vue'
import { Collapse } from '../../Components/Type'
import { useIcon } from '@/hooks/web/useIcon'
import { useI18n } from '@/hooks/web/useI18n'
import { getCampaignList } from '@/api/Business'
import {
  ElCollapse,
  ElCollapseItem,
  ElButton,
  ElTable,
  ElTableColumn,
  ElSwitch
} from 'element-plus'
import TableOperatorCollection from './TableOperatorCollection.vue'
import { useRouter } from 'vue-router'
import { PROMOTION_STRATEGY } from '@/utils/API.Variables'
const { t } = useI18n()
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
    field: 'discountCode',
    label: t('formDemo.auctionCode'),
    component: 'Input',
    colProps: {
      span: 24
    }
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
    }
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
    field: 'tableProductOfAuction',
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
const rules = reactive({})

const router = useRouter()
const id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)

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
}
const emptyFormData = {} as SetFormData
const setFormData = reactive(emptyFormData)

const postData = () => {}
const customizeData = async (data) => {
  setFormData.date = [data[0].fromDate, data[0].toDate]
  setFormData.products = data[0].productProperties
}
const editData = () => {}
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
          :apiId="getCampaignList"
          :schema="schema"
          :type="type"
          :multipleImages="false"
          :id="id"
          :params="params"
          @post-data="postData"
          :formDataCustomize="setFormData"
          :rules="rules"
          @customize-form-data="customizeData"
          @edit-data="editData"
        />
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
          <el-table-column
            prop="permissionPurchase"
            :label="t('formDemo.permissionPurchase')"
            width="180"
            align="center"
          >
            <template #default="props">
              <el-switch
                v-model="props.row.permissionPurchase"
                inline-prompt
                active-text="ON"
                inactive-text="OFF"
              />
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
