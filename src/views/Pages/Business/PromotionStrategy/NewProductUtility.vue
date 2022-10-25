<script setup lang="ts">
import { h, reactive, ref } from 'vue'
import { Collapse } from '../../Components/Type'
import { useIcon } from '@/hooks/web/useIcon'
import { useI18n } from '@/hooks/web/useI18n'
import { ElCollapse, ElCollapseItem, ElButton } from 'element-plus'
import TableOperatorCollection from './TableOperatorCollection.vue'
import { getCampaignList } from '@/api/Business'
import { useRouter } from 'vue-router'
import { PROMOTION_STRATEGY } from '@/utils/API.Variables'
import { moneyToNumber } from '@/utils/format'
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
    field: 'discountCode',
    label: t('formDemo.codeCollection'),
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

const hideTableCustomer = (data) => {
  data == 1 ? (schema[8].hidden = true) : (schema[8].hidden = false)
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
  setFormData.shortDescription = data[0].shortDescription
  setFormData.customers = data[0].customers
  setFormData.products = data[0].productProperties
  setFormData.Images = data[0].images
  setFormData.target = data[0].targetType
  hideTableCustomer(data[0].targetType)
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
          :apiId="getCampaignList"
          :type="type"
          :id="id"
          @post-data="postData"
          :multipleImages="false"
          :params="params"
          :formDataCustomize="setFormData"
          :rules="rules"
          @customize-form-data="customizeData"
          @edit-data="editData"
        />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
