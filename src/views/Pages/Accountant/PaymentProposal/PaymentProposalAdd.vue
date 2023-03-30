<script setup lang="ts">
import { useI18n } from '@/hooks/web/useI18n'
import {
  ElRow,
  ElCol,
  ElCollapse,
  ElCollapseItem,
  ElSelect,
  ElOption,
  ElButton,
  ElDivider,
  ElTable,
  ElTableColumn,
  ElInput,
  ElForm,
  ElFormItem,
  ElDatePicker  
} from 'element-plus'
import type {FormRules, FormInstance} from 'element-plus'
import MultipleOptionsBox from '@/components/MultipleOptionsBox.vue'
import {
  GetPaymentRequestDetail,
  getStaffList,
  getAllCustomer,
  approvalOrder,
} from '@/api/Business'
import { postNewPaymentRequest } from '@/api/Accountant'

import { onBeforeMount, reactive, ref, watch, h } from 'vue'
import { FORM_IMAGES } from '@/utils/format'
import { dateTimeFormat } from '@/utils/format'
import { useIcon } from '@/hooks/web/useIcon'
import { Collapse } from '../../Components/Type'
import moment from 'moment';
import { useRoute, useRouter } from 'vue-router'
import { changeMoney } from '@/utils/tsxHelper'
import { IDetailExpenses } from '../types/PaymentProposal.d'
import { useValidator } from '@/hooks/web/useValidator'

const { t } = useI18n()
const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })
const ruleFormRef = ref<FormInstance>()
const router = useRouter()
const route = useRoute()
const curCode = 'DNTT' + moment().format('hhmmss')
const createdByOptions = ref([{}])
const peopleOptions = ref([{}])
const pageIndexStaff = ref(1)
const pageIndexCustomer = ref(1)
const optionPeople = ref()
const optionCreatedBy = ref()
const pageSize = ref(10)
const id = Number(router.currentRoute.value.params.id)
const approvalId = String(route.params.approvalId)
const type = String(route.params.type) == ':type' ? 'add' : String(route.params.type)
const tableData = ref<Array<IDetailExpenses>>([])
const detailedListExpenses = ref<Array<IDetailExpenses>>([])
const { ValidService } = useValidator()
const rules = reactive<FormRules>({  
  createdBy: [ValidService.required] ,
  description: [ValidService.required]                  
})
const rulesPaymentMethod = reactive<FormRules>({
  totalMoney : [ValidService.required],
  enterMoney: [ValidService.required],
  typeOfPayment : [ValidService.required]
})

const optionsPayments = [
  {
    value: 1,
    key: 0,
    label: t('reuse.payThroughMoney')
  },
  {
    value: 2,
    key: 1,
    label: t('reuse.payThroughCard'),
  }
]
const collapse: Array<Collapse> = [
  {
    icon: minusIcon,
    name: 'generalInformation',
    title: t('formDemo.paymentrequestinformation')
  },
  {
    icon: minusIcon,
    name: 'productAndPayment',
    title: t('formDemo.detailedlistofexpenses')
  }
]

const collapseChangeEvent = (val) => {
  if (val) {
    collapse.forEach((el) => {
      if (val.includes(el.name)) el.icon = minusIcon
      else if (el.icon == minusIcon) el.icon = plusIcon
    })
  } else {
    collapse.forEach((el) => {
      el.icon = plusIcon
    })
  }
}
const activeName = ref([collapse[0].name, collapse[1].name])

const form = ref({
  code: curCode,
  createdAt: new Date(),
  createdBy: "",
  description: "",
  peopleId: "",
  debtMoney: 0,
  typeOfPayment: 1,
  status: 1,
  depositeMoney: 0,
  totalMoney: "",
  enterMoney: "",
  totalPrice: 0,
})

const deleteRow = (index: number) => {
  tableData.value.splice(index, 1)
}

const onAddItem = () => {
  tableData.value.push({    
    numberVouchers: "",
    dayVouchers: new Date(),
    spendFor: "",
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
    note: "",
  })
}

watch(
  () => tableData.value[tableData.value.length - 1],
  () => {
    if (
      tableData.value[tableData.value.length - 1].numberVouchers &&
      tableData.value[tableData.value.length - 1].dayVouchers &&
      tableData.value[tableData.value.length - 1].spendFor &&
      tableData.value[tableData.value.length - 1].quantity &&
      tableData.value[tableData.value.length - 1].unitPrice &&
      tableData.value[tableData.value.length - 1].totalPrice
    )
    onAddItem()
  },
  {
    deep: true
  }
)

watch(pageIndexStaff, async (newPageIndex) => {
  const response = await getStaffList({
    PageIndex: newPageIndex,
    PageSize: pageSize.value
  })

  if(response.data.length > 0) {
    const arr = response.data.map(item => ({label: item.code, value: item.phonenumber, name: item.name, id: item.id }))
    createdByOptions.value.push(...arr); 
  }
});

watch(pageIndexCustomer, async (newPageIndex) => {
  const response = await getAllCustomer({
    PageIndex: newPageIndex,
    PageSize: pageSize.value
  })

  if(response.data.length > 0) {
    const arr = response.data.map(({code, phonenumber,name, id, email}) => ({label: code, value: phonenumber, name, id, email }))
    peopleOptions.value.push(...arr); 
  }
});

const autoCalculate = () =>{
  form.value.totalPrice = 0
  tableData.value.forEach((el) => {
    if (el.numberVouchers && el.unitPrice) {
      form.value.totalPrice += el.totalPrice
    }
  })
  form.value.debtMoney = form.value.totalPrice - form.value.depositeMoney
}

const autoCalculateFun = () => {
  form.value.debtMoney = form.value.totalPrice - form.value.depositeMoney
}
const postData = async() => {
  if (!tableData.value[tableData.value.length - 1].numberVouchers) tableData.value.pop()
  detailedListExpenses.value = tableData.value.map((el) => ({
    numberVouchers: el.numberVouchers,
    dayVouchers: el.dayVouchers,
    spendFor: el.spendFor,
    quantity: el.quantity,
    unitPrice: el.unitPrice,
    totalPrice: el.totalPrice,
    note: el.note
  }))

  const payload = {
    Code: form.value.code,
    TotalMoney: form.value.totalMoney,
    PaymentType : form.value.typeOfPayment,
    PeopleId: form.value.peopleId,
    status: 1,
    PeopleType: 1,
    Description: form.value.description,
    EnterMoney: form.value.enterMoney,
    ExpensesDetail: JSON.stringify(detailedListExpenses.value),
    DepositeMoney: form.value.depositeMoney,
    DebtMoney: form.value.debtMoney,
    TotalPrice: form.value.totalPrice
  }
  await postNewPaymentRequest(FORM_IMAGES(payload))
}

const getDetailPayment = async() => {
  const res = await GetPaymentRequestDetail({id: id})
  form.value = res.data.paymentRequest
  tableData.value = res.data.paymentRequestDetail
}

onBeforeMount(async () => {
  const staffList = await getStaffList({
    PageIndex: pageIndexStaff.value,
    PageSize: pageSize.value
  })
  createdByOptions.value = staffList.data.map(({code, phonenumber, name, id}) => ({label: code, value: phonenumber, name, id}))
  
  const customerList = await getAllCustomer({
    PageIndex: pageIndexCustomer.value,
    PageSize: pageSize.value
  })
  peopleOptions.value = customerList.data.map(({code, phonenumber, name, id, email}) => ({label: code, value: phonenumber, name, id, email }))
  editData()
})

const handleScroll = (field) => {
  switch (field) {
    case 'createdBy' :
      pageIndexStaff.value += 1
      return
    case 'peopleId' : 
      pageIndexCustomer.value += 1
      return
    default: return ''
  }
};
const handleChangeOptions = (option, form, formType) => {
  switch (formType) {
    case 'createdBy' :
      form.createdBy = `${option.name} | ${option.value}`
      optionCreatedBy.value = option
      return
    case 'peopleId' : 
      form.peopleId = `${option.name} | ${option.value}`
      optionPeople.value = option
      return
    default: return ''
  }
}

const { push } = useRouter()

// Duyệt đề nghị thanh toán
const approvalPayments = async (checkApproved) => {
  const payload = { ItemType: 5, Id: parseInt(approvalId), IsApprove: checkApproved }
  await approvalOrder(FORM_IMAGES(payload))
  push({
    name: `accountant.payment-proposal.payment-proposal-list`
  })
}
const disabledEdit = ref(false)

// Xem detail or edit or approved 
const editData = () => {
  if (type == 'approval' || type == 'detail' || type == 'edit') {
    disabledEdit.value = true
    getDetailPayment()
  } else {
    onAddItem()
  }
}

</script>
<template>
  <el-collapse
    v-model="activeName" 
    @change="collapseChangeEvent" 
    :class="['bg-[var(--el-color-white)] dark:(bg-[var(--el-color-black)] border-[var(--el-border-color)] border-1px)']"
  > 
    <el-collapse-item :name="collapse[0].name" >
      <template #title>
        <el-button class="header-icon" :icon="collapse[0].icon" link />
        <span class="text-center text-xl">{{ collapse[0].title }}</span>
      </template>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-divider content-position="left">{{ t('reuse.paymentRequestInfo') }}</el-divider>
          <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="160px">
            <el-form-item prop="code" :label="t('formDemo.formCode')">
              <div>{{ form.code }}</div>
            </el-form-item>
            <el-form-item prop="createdAt" :label="t('reuse.createDate')">
              <div>{{ dateTimeFormat(form.createdAt) }}</div>
            </el-form-item>
            <el-form-item :label="t('reuse.petitioner')" prop="createdBy">
              <MultipleOptionsBox 
                :fields="[t('reuse.employeeCode'),t('reuse.phoneNumber'),t('reuse.employeeName')]"
                min-width="500px"
                valueKey="id" 
                labelKey="label"
                :hiddenKey="['id']"
                :clearable="false"
                :items="createdByOptions"
                @scroll-bottom="() => handleScroll('createdBy')"
                :defaultValue="form.createdBy"
                @update-value="(_value, option) => handleChangeOptions(option, form, 'createdBy')"
             />
            </el-form-item>
            <el-form-item :label="t('formDemo.reasonsSpendMoney')" prop="description" >
              <el-input v-model="form.description" :placeholder="t('formDemo.enterDescription')" />
            </el-form-item>
            <el-divider content-position="left">{{ t('reuse.subject') }}</el-divider>
            <el-form-item :label="t('reuse.selectObject')" prop="peopleId">
              <MultipleOptionsBox 
                :fields="[t('reuse.customerCode'),t('reuse.phoneNumber'),t('reuse.customerName')]"
                min-width="500px"
                valueKey="id" 
                :placeHolder="t('reuse.selectObject')"
                labelKey="label"
                :hiddenKey="['id', 'email']"
                :clearable="false"
                :defaultValue="form.peopleId"
                :items="peopleOptions"
                @scroll-bottom="() => handleScroll('peopleId')"
                @update-value="(_value, option) =>  handleChangeOptions(option, form, 'peopleId')"
              />
            </el-form-item>

            <el-form-item>
              <ul class="mt-2">
                <li v-if="optionPeople?.name" class="leading-5">{{ optionPeople.name }}</li>
                <li v-if="optionPeople?.value" class="leading-5">{{ t('reuse.phoneNumber') }}: {{ optionPeople.value }}</li>
                <li v-if="optionPeople?.email" class="leading-5">{{ t('reuse.email') }}: {{ optionPeople.email }}</li>
             </ul>            
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <el-divider content-position="left">{{ t('formDemo.documentsAttached') }}</el-divider>
        </el-col>
      </el-row>
    </el-collapse-item>

    <el-collapse-item :name="collapse[1].name">
      <template #title >
        <el-button class="header-icon" :icon="collapse[1].icon" link/>
        <span class="text-center text-xl">{{ collapse[1].title }}</span>
      </template>
      <el-table :data="tableData" border header-row-class-name="dark:text-white text-black">
        <el-table-column type="index" :label="t('reuse.index')" align="center" width="70" />
        <el-table-column prop="numberVouchers" :label="t('formDemo.numberVouchers')" min-width="132" >
          <template #default="scope">
            <el-input  v-model="scope.row.numberVouchers"/>
          </template>
        </el-table-column>
        <el-table-column prop="dayVouchers" :label="t('formDemo.dayVouchers')" min-width="132">
          <template #default="scope">
              <el-date-picker
                v-model="scope.row.dayVouchers"
                type="date"
                placeholder="Pick a day"
                format="DD/MM/YYYY"
              />
          </template>
        </el-table-column>
        <el-table-column prop="spendFor" :label="t('formDemo.spendFor')" min-width="436" >
          <template #default="scope">
                <el-input v-model="scope.row.spendFor" />
          </template>
        </el-table-column>
        <el-table-column prop="quantity" :label="t('reuse.quantity')" min-width="132">
          <template #default="scope">
            <el-input
              v-model="scope.row.quantity"
              @change="
                () => {
                  scope.row.totalPrice = scope.row.unitPrice * scope.row.quantity
                  autoCalculate()
                }
              "
            />
          </template>
        </el-table-column>
        <el-table-column prop="unitPrice" :label="t('reuse.unitPrice')" min-width="132">
            <template #default="scope">
              <el-input
              v-model="scope.row.unitPrice" 
              @change="
                () => {
                  scope.row.totalPrice = scope.row.unitPrice * scope.row.quantity
                  autoCalculate()
                }
              "
              />
          </template>
        </el-table-column>
        <el-table-column prop="totalPrice" :label="t('formDemo.intoMoney')" min-width="132" >
          <template #default="scope">
              {{ scope.row.totalPrice }}
          </template>
        </el-table-column>
        <el-table-column prop="note" :label="t('reuse.note')">
          <template #default="scope">
            <el-input v-model="scope.row.note" />
          </template>            
        </el-table-column>
        <el-table-column :label="t('formDemo.manipulation')" min-width="86">
          <template #default="scope">
            <el-button size="small" type="danger" @click.prevent="deleteRow(scope.$index)">Xóa</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="flex justify-end">
        <div class="total flex flex-col mt-4 w-[880px]">
          <div class="flex gap-4">
            <label class="w-[10%] text-right font-bold">{{ t('reuse.totaMoney') }}</label>
            <span class="w-[170px] text-right">{{ changeMoney.format(form.totalPrice) }}</span>
          </div>
          <div class="flex gap-4">
            <label class="w-[10%] text-right">{{ t('formDemo.deposit') }}</label>
            <span class="w-[170px] text-right">
              <el-input @change="autoCalculateFun" placeholder="đ" class="poi_text_right" v-model="form.depositeMoney" />
            </span>
          </div>
          <div class="flex gap-4">
            <label class="w-[10%] text-right text-red-500">{{ t('reuse.remaining') }}</label>
            <span class="w-[170px] text-right">{{ changeMoney.format(form.debtMoney) }}</span>
          </div>
        </div>
      </div>
      <el-divider content-position="left" >{{ t('formDemo.billingInformation') }}</el-divider>
      <el-row :gutter="20">
        <el-col :span=12>
          <el-form :model="form" :rules="rulesPaymentMethod" label-width="160px" class="basis-1/2" >
          <el-form-item 
            prop="totalMoney"
            :label="t('formDemo.amountSpent')" 
            >
            <el-input
                size="default"
                v-model="form.totalMoney"
                :placeholder="t('reuse.placeholderMoney')"
                :suffixIcon="h('div', 'đ')"
            />
          </el-form-item>
          <el-form-item
            prop="enterMoney"
            :label="t('formDemo.writtenWords')"
            >
              <el-input v-model="form.enterMoney" :placeholder="t('formDemo.writtenWords')" />
          </el-form-item>
          <el-form-item
            prop="typeOfPayment"
            :label="t('formDemo.formPayment')" 
          >
            <el-select v-model="form.typeOfPayment">
              <el-option
                v-for="item in optionsPayments"
                :key="item.key"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('reuse.status')" class="day-update-wrap">
              <div class="flex flex-col gap-1">
                <span class="day-updated">
                  {{ t('reuse.initializeAndWrite') }}
                </span>
                <span class="italic text-xs text-gray-500">
                  <label> {{ dateTimeFormat(moment()) }} </label>
                </span>
              </div>
          </el-form-item>
          <el-form-item/>
          <el-form-item v-if="type === 'add'">
            <el-button>{{ t('button.print') }}</el-button>
            <el-button type="primary" @click="postData">{{ t('reuse.saveAndPending') }}</el-button>
            <el-button type="danger">{{ t('reuse.cancel') }}</el-button>
          </el-form-item>
          <el-form-item v-if="type === 'approval'">
            <el-button @click="approvalPayments(true)" type="warning">{{ t('router.approve') }}</el-button>
            <el-button @click="approvalPayments(false)">{{ t('router.notApproval') }}</el-button>
          </el-form-item>
      </el-form>
        </el-col>
      </el-row>
    </el-collapse-item>
  </el-collapse>

</template>  
<style scoped lang="less">
::v-deep(.el-select){
  width: 100%;
}

::v-deep(.poi_text_right > .el-input__wrapper > .el-input__inner){
  text-align: right;
}

::ve-deep(.collapse-margin){
  margin-top: 30px;
}

.day-updated {
  position: relative;
  width: fit-content;
  padding-left: 20px;
  color: var(--el-color-primary);
  background: rgb(44 109 218 / 5%);
}

.day-updated::after {
  position: absolute;
  top: 0;
  right: -12px;
  width: 0;
  height: 0;
  border-top: 14px solid transparent;
  border-bottom: 18px solid transparent;
  border-left: 12px solid rgb(44 109 218 / 5%);
  content: '';
}

.day-updated::before {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  border-top: 16px solid transparent;
  border-bottom: 16px solid transparent;
  border-left: 12px solid white;
  content: '';
}

::v-deep(.el-table td.el-table__cell div) {
  width: 100%;
}
</style>