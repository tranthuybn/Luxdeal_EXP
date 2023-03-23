<script setup lang="ts">
import { h, reactive, ref, RendererElement, RendererNode, VNode, onBeforeMount, watch } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import TableOperatorAccountant from '../TableOperatorAccountant.vue'
import { useRouter } from 'vue-router'
import { updateReceiptOrPayment, postNewReceiOrPayment, deleteReceiptOrPayment, getDetailReceiptPayment } from '@/api/Accountant'
import { useValidator } from '@/hooks/web/useValidator'
import { ElNotification, ElCollapse, ElCollapseItem, ElButton } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import moment from 'moment'
import { FORM_IMAGES } from '@/utils/format'
import { FormDataPostAndEdit, FormData } from '../types/ReceiptsAndExpenditures'
import { getStaffList, getAllCustomer } from '@/api/Business'
import MultipleOptionsBox from '@/components/MultipleOptionsBox.vue'

const { required } = useValidator()
const { t } = useI18n()
const minusIcon = useIcon({ icon: 'akar-icons:minus' })
const router = useRouter()
const id = Number(router.currentRoute.value.params.id)
const type = 'add'
const { push } = useRouter()
const escape = useIcon({ icon: 'quill:escape' })
const setFormData = reactive({} as FormData)
interface Collapse {
  icon: VNode<RendererNode, RendererElement, { [key: string]: any }>
  name: string
  title: string
  columns?: TableColumn[]
}

const back = async () => {
  push({
    name: 'accountant.receipts-expenditures.receipts-expenditures-list'
  })
}
//random field code
const curDate = 'PT' + moment().format('hhmmss')
const schema = reactive<FormSchema[]>([
  {
    field: 'generalServiceInformation',
    label: t('formDemo.informationReceipts'),
    component: 'Divider'
  },
  {
    field: 'code',
    label: t('formDemo.receiptsCode'),
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      readonly: true,
      class: 'readonly-info',
      value: curDate
    },
  },
  {
    field: 'createdAt',
    label: t('reuse.createDate'),
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      readonly: true,
      class: 'readonly-info',
      value: moment().format('DD/MM/YYYY')
    },
  },
  {
    field: 'createdBy',
    label: t('reuse.petitioner'),
    component: 'Select',
    colProps: {
      span: 24
    },
    componentProps: {
      style: 'width: 100%',
      placeholder: t('reuse.chooseARecommender'),
    }
  },
  {
    field: 'description',
    label: t('formDemo.reasonCollectingMoney'),
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('formDemo.enterDescription'),
    }
  },
  {
    field: 'generalServiceInformation',
    label: t('reuse.subject'),
    component: 'Divider'
  },
  {
    field: 'peopleType',
    label: t('reuse.selectObject'),
    component: 'Select',
    colProps: {
      span: 24
    },
    componentProps: {
      style: 'width: 100%',
      placeholder: '',
    }
  },
  {
    field: 'generalServiceInformation',
    label: t('formDemo.billingInformation'),
    component: 'Divider'
  },
  {
    field: 'totalMoney',
    label: t('formDemo.amountCollect'),
    component: 'InputPrice',
    value: '',
    colProps: {
      span: 24
    },
    componentProps: {
      showCurrency: false,
      placeholder: t('reuse.placeholderMoney'),
      suffixIcon: h('div', 'đ'),
    }
  },
  {
    field: 'enterMoney',
    label: t('formDemo.writtenWords'),
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('formDemo.writtenWords'),
    }
  },
  {
    field: 'paymentMethod',
    label: t('formDemo.formPayment'),
    component: 'Select',
    value: 1,
    colProps: {
      span: 24
    },
    componentProps: {
      style: 'width: 100%',
      options: [
      { label: t('reuse.payThroughMoney'), value: 1 },
      { label: t('reuse.payThroughCard'), value: 2 },
      ]
    }
  },
  {
    field: 'accountNumber',
    label: t('reuse.accountingAccount'),
    component: 'Select',
    value: 1,
    colProps: {
      span: 24
    },
    componentProps: {
      style: 'width: 100%',
      options: [
      { label: t('reuse.payThroughMoney'), value: 1 },
      { label: t('reuse.payThroughCard'), value: 2 },
      ],
    }
  },
  {
    field: 'paid',
    label: t('reuse.payment'),
    component: 'Radio',
    value: false,
    colProps: {
      span: 18
    },
    componentProps: {
      options: [
        {
          label: t('reuse.collectedMoney'),
          value: true
        }
      ]
    }
  },
  {
    field: 'statusHistory',
    label: t('reuse.status'),
    colProps: {
      span: 24
    },
    componentProps : {
      readonly: true,
    }
  }
])
const rules = reactive({
  createdBy: [required()],
  description: [required()],
  totalMoney: [required()],
  enterMoney: [required()],
  paymentMethod: [required()],
})

const customizeData = async (data) => {
  setFormData.code = data.code
  setFormData.description = data.description
  setFormData.totalMoney = data.totalMoney
  setFormData.createdBy = data.createdBy
  setFormData.createAt = data.createAt
  setFormData.createdBy = data.createdBy
  setFormData.peopleType = data.peopleType
  setFormData.enterMoney = data.enterMoney
  setFormData.paymentMethod = data.paymentMethod
  setFormData.accountNumber = data.accountNumber
  setFormData.paid = data.paid
}

const customData = (data) => {
  const customData = {} as FormDataPostAndEdit
  customData.CreatedBy = data.CreatedBy
  customData.CreateAt = data.CreateAt
  customData.Description = data.Description
  customData.PeopleType = data.PeopleType
  customData.TotalMoney = data.TotalMoney
  customData.EnterMoney = data.EnterMoney
  customData.PaymentMethod = data.PaymentMethod
  customData.AccountNumber = data.AccountNumber
  customData.Paid = data.Paid
  customData.Type = 1
  return customData
}

const editData = async (data) => {
  data = customData(data)
  await updateReceiptOrPayment(data)
    .then(() => {
      ElNotification({
        message: t('reuse.updateSuccess'),
        type: 'success'
      }),
        push({
          name: 'products-services.ServiceLibrary.SpaService',
          params: { backRoute: 'products-services.ServiceLibrary.SpaService' }
        })
    })
    .catch(() =>
      ElNotification({
        message: t('reuse.updateFail'),
        type: 'warning'
      })
    )
}

const postData = async (data) => {
  data = customData(data)
  await postNewReceiOrPayment(FORM_IMAGES(data))
    .then(() => {
      ElNotification({
        message: t('reuse.addSuccess'),
        type: 'success'
      }),
        push({
          name: 'products-services.ServiceLibrary.SpaService',
          params: { backRoute: 'products-services.ServiceLibrary.SpaService' }
        })
    })
    .catch((res) =>
      ElNotification({
        message: res.response.data.message,
        type: 'warning'
      })
    )
}
const collapse: Array<Collapse> = [
  {
    icon: minusIcon,
    name: 'receiptsAddDetails',
    title: t('reuse.receiptsAddDetails'),
    columns: schema
  }
]
const pageIndex = ref(1)
const pageSize = ref(10)
const currentCollapse = ref<string>(collapse[0].name)
const activeName = ref('receiptsAddDetails')
const params = reactive({
    PageIndex: pageIndex.value,
    PageSize: pageSize.value
})
const handleScroll = async () => {
  pageIndex.value += 1
};

watch(pageIndex, async (newPageIndex) => {
  const response = await getStaffList({
    PageIndex: newPageIndex,
    PageSize: pageSize.value
  })

  if(response.data.length > 0) {
    const arr = response.data.map(item => ({label: item.code, value: item.phonenumber, name: item.name, id: item.id }))
    createdByOptions.value.push(...arr); 
  }

  
});

interface IOptions {
  label: string
  value: string | number
  phonenumber: string
  code: string
}
const createdByOptions = ref([{} as IOptions])
const peopleTypeOptions = ref([{} as IOptions])
onBeforeMount(async () => {
  const res = await getStaffList(params)
  createdByOptions.value = res.data.map(item => ({label: item.code, value: item.phonenumber, name: item.name, id: item.id }))
  const res2 = await getAllCustomer(params)
  peopleTypeOptions.value = res2.data.map(item => ({label: item.code, value: item.phonenumber, name: item.name, id: item.id }))
})

const changeOption = (option) => {
  console.log(option)
}

</script>

<template>
  <div class="demo-collapse">
    <el-collapse v-model="activeName" :collapse="collapse">
      <el-collapse-item
        v-for="(item, index) in collapse"
        :key="index"
        :name="item.name"
        v-model="currentCollapse"
      >
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
        <TableOperatorAccountant
          :apiId="getDetailReceiptPayment"
          :schema="schema"
          :type="type"
          :id="id"
          @post-data="postData"
          :rules="!(type === 'detail') ? rules : {}"
          @customize-form-data="customizeData"
          @edit-data="editData"
          :formDataCustomize="setFormData"
          :delApi="deleteReceiptOrPayment"
          :hasImage="false"
          :hasAttachDocument="true"
          :customAddButton="2"
        >
        <template #createdBySelect="{form}">
          <MultipleOptionsBox 
            :fields="[t('reuse.employeeCode'),t('reuse.phoneNumber'),t('reuse.employeeName')]"
            min-width="500px"
            valueKey="id" 
            labelKey="label"
            :hiddenKey="['id']"
            :clearable="false"
            :items="createdByOptions"
            @scroll-bottom="handleScroll"
            @change="changeOption"
            :defaultValue="form.createdBy"
            @update-value="(_value, option) => form.createdBy = `${option.name} | ${option.value}`"
          />
        </template>
        <template #peopleType="{form}">
          <MultipleOptionsBox 
            :fields="[t('reuse.customerCode'),t('reuse.phoneNumber'),t('reuse.customerName')]"
            min-width="500px"
            valueKey="id" 
            labelKey="label"
            :hiddenKey="['id']"
            :clearable="false"
            :items="peopleTypeOptions"
            @scroll-bottom="handleScroll"
            @change="changeOption"
            :defaultValue="form.peopleType"
            @update-value="(_value, option) => form.peopleType = `${option.name} | ${option.value}`"
          />
          
        </template>
        </TableOperatorAccountant>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<style lang="less" scoped>
  ::v-deep(.readonly-info) {
    .el-input__wrapper{
      padding: 0;
    }
  } 

  ::v-deep(.btn-wrap) {
    margin-left: 150px;
  }

</style>
