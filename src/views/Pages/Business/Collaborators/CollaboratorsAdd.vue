<script setup lang="ts">
import { useIcon } from '@/hooks/web/useIcon'
import { Collapse } from '../../Components/Type'
import { dateTimeFormat, moneyFormat } from '@/utils/format'
import TableOperatorCollaborators from './TableOperatorCollaborators.vue'
import { onBeforeMount, reactive, ref, h } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import {
  getCollaboratorsById,
  // getGenCodeCollaborators,
  addNewCollaborators,
  updateCollaborators,
  cancelCustomerCollabolator,
  GetOrderByCollabolatorId,
  getCommissionPaymentByCollaboratorId,
} from '@/api/Business'
import { useValidator } from '@/hooks/web/useValidator'
import { useRouter } from 'vue-router'
import { getAllCustomer, getCustomerById } from '@/api/Business'
import { GenerateCodeOrder } from '@/api/common'
import {
  ElCollapse,
  ElCollapseItem,
  ElButton,
  ElNotification,
  ElTable,
  ElTableColumn,
} from 'element-plus'
import { FORM_IMAGES } from '@/utils/format'
import type { FormRules } from 'element-plus'
// import { appModules } from '@/config/app'
import { IFormData, FormDataPostAndEdit, ICustomer } from './types'
import { CODE } from '@/utils/API.Variables'

// const { utility } = appModules
const { required, ValidService } = useValidator()
const { t } = useI18n()
const { push } = useRouter()
const setFormData = reactive({} as IFormData)
const codeDefault= 'CTV' + Date.now()
const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })
const escape = useIcon({ icon: 'quill:escape' })
const router = useRouter()
const id = Number(router.currentRoute.value.params.id)
const tableData = ref<Array<any>>([])
const totalFinalPrice = ref(0)
const totalPriceCumulativeCom = ref(0)
const totalReceivePrice = ref(0)
const totalCumulativeCom = ref(0)
const customerObj = ref({} as ICustomer)
const orderList = ref()
const commissionPaymentList = ref()

const type = String(router.currentRoute.value.params.type) === ':type' ? 'add' : String(router.currentRoute.value.params.type)
const collapse: Array<Collapse> = [
  {
    icon: minusIcon,
    name: 'customerInfo',
    title: t('formDemo.detailCollaborator')
  },
  {
    icon: plusIcon,
    name: 'ManageSalesHistoryAndCommissionPayments',
    title: t('reuse.ManageSalesHistoryAndCommissionPayments')
  }
]

const getMapData = ({code, phonenumber,name, id, email}) => ({label: `${name} | ${phonenumber}`, code, phonenumber, name, id, email  })

onBeforeMount(async () => {
  await GenerateCodeOrder({CodeType :CODE.COLLABORATOR})
  .then(res => {
    schema[1].value = res.data
  })
  .catch(() => {
    ElNotification({
        message: t('reuse.generateCodeFail'),
        type: 'warning'
    })
  })

})
const getOrderByCollaborator = async (formValue) => {
  const res = await GetOrderByCollabolatorId({ Id: id })
  const obj = [...res?.data.data]
  if (obj) {
    orderList.value = [
      ...obj.map((val) => ({
        date: val.createdAt,
        code: val.code,
        commission: val.collaboratorCommission,
        totalPrice: val.totalPrice,
        paidMoney: val.paidMoney,
        cumulativeCom: 0
      }))
    ]
    getCommissionPaymentByCollaborator(formValue)
  }
}
const getCommissionPaymentByCollaborator = async (formValue) => {
  const res = await getCommissionPaymentByCollaboratorId({ Id: id })
  const obj = [...res?.data]
  if (obj) {
    commissionPaymentList.value = [
      ...obj.map((val) => ({
        date: val.createdAt,
        code: val.code,
        commission: formValue.discount,
        totalPrice: val.price,
        paidMoney: 0,
        cumulativeCom: 0
      }))
    ]
    tableData.value = orderList.value.concat(commissionPaymentList.value)
    tableData.value.sort(function (a, b) {
      var c: any = new Date(a.date)
      var d: any = new Date(b.date)
      return c - d
    })

    tableData.value.map((val) => {
      if (val.totalPrice) {
        totalFinalPrice.value += val.totalPrice
        totalPriceCumulativeCom.value += (val.commission * val.totalPrice) / 100
        totalReceivePrice.value += val.paidMoney
      }
    })
  }
}
const setCustomer = async (id) => {
  await getCustomerById({Id: id})
    .then(res => customerObj.value = res.data)
    .catch(error => {throw new Error(error)})
}

const schema = reactive<FormSchema[]>([
  {
    field: 'generalInformation',
    label: t('formDemo.profileCollaborator'),
    component: 'Divider'
  },
  {
    field: 'collaboratorId',
    label: t('formDemo.CollaboratorCode'),
    component: 'Input',
    colProps: {
      span: 24
    },
    value: codeDefault,
    componentProps: {
      readonly: true,
      class: 'readonly-info',
    }
  },
  {
    field: 'discount',
    label: t('formDemo.discountCollaborator'),
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('formDemo.enterCommissionCalculatedOnOrderSales'),
      suffixIcon: h('div', '%'),
    }
  },
  {
    field: 'generalInformation',
    label: t('reuse.customerInfo'),
    component: 'Divider'
  },
  {
    field: 'customerId',
    label: t('formDemo.chooseACustomer'),
    component: 'SelectMultipleOption',
    componentProps: {
      placeholder: t('formDemo.chooseCustomer'),
      valueKey: "id" ,
      labelKey: "label",
      hiddenKey: ['id', 'label', 'email'],
      params: {CTV: true},
      api: getAllCustomer,
      mapFunction: getMapData,
      clearable: false,
      showDetailOption: true,
      fields: [t('reuse.customerCode'),t('reuse.phoneNumber'),t('reuse.customerName')],
      onChange: setCustomer,
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'customerDetail',
    colProps: {
      span: 24
    },
  },
  {
    field: 'generalInformation',
    label: t('reuse.statusAndAccount'),
    component: 'Divider'
  },
  {
    field: 'collaboratorStatus',
    label: t('formDemo.statusActive'),
    component: 'CheckboxSingle',
    colProps: {
      span: 18
    },
    value: true,
    componentProps: {
      label: t('formDemo.isActive'),
      disabled: true
    }
  },
  {
    field: 'status',
    label: t('formDemo.statusAccount'),
    colProps: {
      span: 24
    },
    componentProps : {
      readonly: true,
    }
  }

])

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

const rules = reactive<FormRules>({
  discount: [
    required(),
    ValidService.maxPercent
  ],
  customersValue: [required()]
})


// get data from router

const cancel = async () => {
  push({
    name: 'business.collaborators.collaboratorsList',
    params: { backRoute: 'business.collaborators.collaboratorsList' }
  })
}


const customizeData = async (data) => {
  setFormData.code = data.code
  setFormData.discount = data.discount
  setFormData.customerId = data.customerId
  setCustomer(data.customerId)
  getOrderByCollaborator(data)
}

const customData = (data) => {
  const customData = {} as FormDataPostAndEdit
  customData.CustomerId = data.customersValue
  customData.Code = data.code
  customData.Status = 0
  customData.Discount = Number(data.discount)
  customData.AccountNumber = customerObj.value.accountNumber
  customData.AccountName = customerObj.value.accountName
  customData.BankId = customerObj.value.bankId
  return customData
}

const activeName = ref(collapse[0].name)

const editData = async (data) => {
  data = customData(data)
  await updateCollaborators(FORM_IMAGES(data))
    .then(() => {
      ElNotification({
        message: t('reuse.updateSuccess'),
        type: 'success'
      })
      push({
        name: 'business.collaborators.collaboratorsList',
        params: { backRoute: 'business.collaborators.collaboratorsList' }
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
  await addNewCollaborators(FORM_IMAGES(data))
    .then(() => {
      ElNotification({
        message: t('reuse.addSuccess'),
        type: 'success'
      }),
      push({
        name: 'business.collaborators.collaboratorsList',
        params: { backRoute: 'business.collaborators.collaboratorsList' }
      })
    })
    .catch((res) =>
      ElNotification({
        message: res.response.data.message,
        type: 'warning'
      })
    )
}

</script>
<template>
  <div class="demo-collapse dark:bg-[#141414]">
    <el-collapse v-model="activeName" @change="collapseChangeEvent">
      <el-collapse-item :icon="false" :name="collapse[0].name">
        <template #title>
          <div class="flex w-[100%] justify-between">
            <div class="before">
              <el-button class="header-icon" :icon="collapse[0].icon" link />
              <span class="text-center text-xl">{{ collapse[0].title }}</span>
            </div>
            <div @click="cancel()" class="after">
              <span class="text-center text-xl">{{ t('reuse.exit') }}</span>
              <el-button class="header-icon" :icon="escape" link />
            </div>
          </div>
        </template>

        <TableOperatorCollaborators
          :apiId="getCollaboratorsById"
          :schema="schema"
          :type="type"
          :id="id"
          @post-data="postData"
          :rules="rules"
          @customize-form-data="customizeData"
          @edit-data="editData"
          :formDataCustomize="setFormData"
          :delApi="cancelCustomerCollabolator"
          :multipleImages="true"
          :customerObj="customerObj"
        />
        
      </el-collapse-item>
      <el-collapse-item :name="collapse[1].title">
        <template #title>
          <el-button class="header-icon" :icon="collapse[1].icon" link />
          <span class="text-center text-xl">{{ collapse[1].title }}</span>
        </template>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="date" :label="t('reuse.date')" width="180">
            <template #default="data">
              {{ dateTimeFormat(data.row.date) }}
            </template>
          </el-table-column>
          <el-table-column prop="code" :label="t('reuse.orderCodepaymentCode')" width="300" />
          <el-table-column prop="commission" :label="t('reuse.percentDiscount')">
            <template #default="data">
              {{ data.row.commission + ' %' }}
            </template>
          </el-table-column>
          <el-table-column prop="totalPrice" :label="t('reuse.orderSales')" align="right">
            <template #default="data">
              {{ moneyFormat(data.row.totalPrice) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="priceCommission"
            :label="t('formDemo.intoDiscountComMoney')"
            align="right"
          >
            <template #default="data">
              {{ moneyFormat((data.row.totalPrice * data.row.commission) / 100) }}
            </template>
          </el-table-column>
          <el-table-column prop="paidMoney" :label="t('formDemo.spent')" align="right">
            <template #default="data">
              {{ moneyFormat(data.row.paidMoney) }}
            </template>
          </el-table-column>
          <el-table-column prop="cumulativeCom" :label="t('formDemo.cumulativeCom')" align="right">
            <template #default="data">
              {{ moneyFormat(data.row.cumulativeCom) }}
            </template>
          </el-table-column>
        </el-table>
        <div class="flex justify-end">
          <div v-if="totalFinalPrice > 0" class="font-bold">{{ moneyFormat(totalFinalPrice) }}</div>
          <div v-if="totalPriceCumulativeCom > 0" class="font-bold pl-3">{{
            moneyFormat(totalPriceCumulativeCom)
          }}</div>
          <div v-if="totalReceivePrice > 0" class="font-bold pl-3">{{
            moneyFormat(totalReceivePrice)
          }}</div>
          <div v-if="totalCumulativeCom > 0" class="font-bold pl-3">{{
            moneyFormat(totalCumulativeCom)
          }}</div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style lang="less" scoped>
  ::v-deep(.btn-wrap) {
    margin-left: 150px;
  }
</style>
