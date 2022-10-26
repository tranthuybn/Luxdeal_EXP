<script setup lang="ts">
import { h, reactive, ref } from 'vue'
import { Collapse } from '../../Components/Type'
import { getCampaignList } from '@/api/Business'
import { useIcon } from '@/hooks/web/useIcon'
import { useI18n } from '@/hooks/web/useI18n'
import { ElCollapse, ElCollapseItem, ElButton } from 'element-plus'
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
    field: 'code',
    label: t('formDemo.voucherCode'),
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
    field: 'order',
    label: t('formDemo.odersApply'),
    component: 'Select',
    colProps: {
      span: 14
    },
    componentProps: {
      placeholder: t('formDemo.choosePromotion'),
      style: 'width: 100%',
      options: [
        { label: t('reuse.sellOrderList'), value: 1 },
        { label: t('reuse.leaseOrderList'), value: 2 },
        { label: t('reuse.spaOrderList'), value: 3 }
      ]
    }
  },
  {
    field: 'orderInput',
    component: 'Input',
    colProps: {
      span: 10
    },
    componentProps: {
      placeholder: t('formDemo.appliesToOrdersFrom'),
      suffixIcon: h('div', 'đ')
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
      placeholder: t('formDemo.enterCondition'),
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
const hideTableCustomer = (data) => {
  data == 1 ? (schema[12].hidden = true) : (schema[12].hidden = false)
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
const rules = reactive({})

const router = useRouter()
const id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)
const postData = () => {}

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
console.log('setFormData_beforeChange: ', setFormData)
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
          :schema="schema"
          :type="type"
          :id="id"
          :params="params"
          :apiId="getCampaignList"
          @post-data="postData"
          :rules="rules"
          @customize-form-data="customizeData"
          :multipleImages="false"
          @edit-data="editData"
        />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
