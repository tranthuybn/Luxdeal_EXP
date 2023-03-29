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
  addDNTT
} from '@/api/Business'
import { onBeforeMount, reactive, ref, watch, h } from 'vue'
import { FORM_IMAGES } from '@/utils/format'
import { dateTimeFormat } from '@/utils/format'
import { useIcon } from '@/hooks/web/useIcon'
import { Collapse } from '../../Components/Type'
import moment from 'moment';
import { useRoute, useRouter } from 'vue-router'
import { changeMoney } from '@/utils/tsxHelper'
import { IDetailExpenses } from '../types/PaymentProposal.d'

const { t } = useI18n()
const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })
const ruleFormRef = ref<FormInstance>()
const router = useRouter()
const route = useRoute()
const curDate = 'DNTT' + moment().format('hhmmss')
const createdByOptions = ref([{}])
const peopleTypeOptions = ref([{}])
const pageIndexStaff = ref(1)
const pageIndexCustomer = ref(1)
const optionPeopleType = ref()
const optionCreatedBy = ref()
const pageSize = ref(10)
const id = Number(router.currentRoute.value.params.id)
const approvalId = String(route.params.approvalId)
const type = String(route.params.type) == ':type' ? 'add' : String(route.params.type)

const rules = reactive<FormRules>({  
  peopleId: [
   { required: true, message: 'Chọn dữ liệu' },
   { type: 'string', message: 'Chọn giá trị' }   
  ]                      
})
const rulesPaymentMethod = reactive<FormRules>({
  totalMoney : [
    { required: true, message: 'Nhập số tiền', trigger: 'blur' }
  ],
  enterMoney: [
    { required: true, message: 'Nhập chữ', trigger: 'blur' },
    { type: 'string', message: 'Nhập chữ', trigger: 'blur' },
  ],
  typeOfPayment : [
    { required: true, message: 'Viết bằng chữ', trigger: 'blur' },
    { type: 'string', message: 'Viết bằng chữ', trigger: 'blur' },
  ]
})
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
  code: "",
  createdAt: new Date(),
  createdBy: "",
  idCustomer: '',
  debtMoney: 0,
  depositeMoney: 0,
  description: '',
  enterMoney: "",
  id: undefined,
  isDelete: false,
  typeOfPayment: 1,
  peopleId: undefined,
  peopleName: null,
  pepopleType: 1,
  status: 1,
  totalMoney: '',
  totalPrice: 0,
})

interface typeOfTableData {
  dayVouchers: any 
  note: string
  numberVouchers: string | number
  paymentRequestId: number | undefined
  quantity: number
  spentFor: string
  totalPrice: number
  unitPrice: number
}

const tableData = ref<Array<typeOfTableData>>([])
const deleteRow = (index: number) => {
  tableData.value.splice(index, 1)
}

const onAddItem = () => {
  tableData.value.push({    
    dayVouchers: new Date(),
    note: "",
    numberVouchers: "",
    paymentRequestId: undefined,
    quantity: 1,
    spentFor: "",
    totalPrice: 0,
    unitPrice: 0
  })
}

watch(
  () => tableData.value[tableData.value.length - 1],
  () => {
    if (
      tableData.value[tableData.value.length - 1].numberVouchers &&
      tableData.value[tableData.value.length - 1].dayVouchers &&
      tableData.value[tableData.value.length - 1].spentFor &&
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

const detailedListExpenses = ref<Array<IDetailExpenses>>([])
const postData = async() => {
  if (!tableData.value[tableData.value.length - 1].numberVouchers) tableData.value.pop()
  detailedListExpenses.value = tableData.value.map((el) => ({
    numberVouchers: el.numberVouchers,
    dayVouchers: el.dayVouchers,
    spentFor: el.spentFor,
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
  await addDNTT(FORM_IMAGES(payload))
}

const getDetailPayment = async() => {
  const res = await GetPaymentRequestDetail({id: id})
  form.value = res.data.paymentRequest
  tableData.value = res.data.paymentRequestDetail
}

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

onBeforeMount(async () => {
  editData()
  const staffList = await getStaffList({
    PageIndex: pageIndexStaff.value,
    PageSize: pageSize.value
  })
  createdByOptions.value = staffList.data.map(({code, phonenumber, name, id}) => ({label: code, value: phonenumber, name, id}))
  
  const customerList = await getAllCustomer({
    PageIndex: pageIndexCustomer.value,
    PageSize: pageSize.value
  })
  peopleTypeOptions.value = customerList.data.map(({code, phonenumber, name, id, email}) => ({label: code, value: phonenumber, name, id, email }))
  
})

const handleScroll = (field) => {
  switch (field) {
    case 'createdBy' :
      pageIndexStaff.value += 1
      return
    case 'peopleType' : 
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
    case 'peopleType' : 
      form.peopleType = `${option.name} | ${option.value}`
      optionPeopleType.value = option
      return
    default: return ''
  }
}

const customerName = ref()
const customerPhone = ref()
const customerEmail = ref()


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
    form.value.code = curDate
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
            <el-form-item prop="code" label="Mã phiếu">
              <div>{{ form.code }}</div>
            </el-form-item>
            <el-form-item prop="createdAt" label="Ngày tạo">
              <div>{{ dateTimeFormat(form.createdAt) }}</div>
            </el-form-item>
            <el-form-item label="Người yêu cầu" >
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
              <el-input v-model="form.description" placeholder="Nhập mô tả" />
            </el-form-item>
            <el-divider content-position="left">{{ t('reuse.subject') }}</el-divider>
            <el-form-item :label="t('reuse.selectObject')" prop="idCustomer">
              <MultipleOptionsBox 
                :fields="[t('reuse.customerCode'),t('reuse.phoneNumber'),t('reuse.customerName')]"
                min-width="500px"
                valueKey="id" 
                labelKey="label"
                :hiddenKey="['id', 'email']"
                :clearable="false"
                :items="peopleTypeOptions"
                @scroll-bottom="() => handleScroll('peopleType')"
                @update-value="(_value, option) =>  handleChangeOptions(option, form, 'peopleType')"
              />
            </el-form-item>

            <el-form-item>
              <div v-if="form.idCustomer">
                  <div> {{ customerName ?? '' }} </div>
                  <div>Số điện thoại: {{ customerPhone ?? '' }}</div>
                  <div>Email: {{ customerEmail ?? '' }}</div>
              </div>              
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
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" :label="t('reuse.index')" align="center" min-width="80" />
        <el-table-column prop="numberVouchers" :label="t('formDemo.numberVouchers')" min-width="132" >
          <template #default="props">
            <el-input  v-model="props.row.numberVouchers"/>
          </template>
        </el-table-column>
        <el-table-column prop="dayVouchers" :label="t('formDemo.dayVouchers')" min-width="132">
          <template #default="props">
              <el-date-picker
                v-model="props.row.dayVouchers"
                type="date"
                placeholder="Pick a day"
                format="DD/MM/YYYY"
              />
          </template>
        </el-table-column>
        <el-table-column prop="spentFor" :label="t('formDemo.spendFor')" min-width="436" >
          <template #default="props">
                <el-input v-model="props.row.spentFor" />
          </template>
        </el-table-column>
        <el-table-column prop="quantity" :label="t('reuse.quantity')" min-width="150">
          <template #default="props">
            <el-input
              v-model="props.row.quantity"
              @change="
                () => {
                  props.row.totalPrice = props.row.unitPrice * props.row.quantity
                  autoCalculate()
                }
              "
            />
          </template>
        </el-table-column>
        <el-table-column prop="price" :label="t('reuse.unitPrice')" min-width="150">
            <template #default="props">
              <el-input
              v-model="props.row.unitPrice" 
              @change="
                () => {
                  props.row.totalPrice = props.row.unitPrice * props.row.quantity
                  autoCalculate()
                }
              "/>
          </template>
        </el-table-column>
        <el-table-column prop="totalPrice" :label="t('formDemo.intoMoney')" min-width="150" >
          <template #default="props">
              {{ props.row.totalPrice }}
          </template>
        </el-table-column>
        <el-table-column prop="note" :label="t('reuse.note')">
          <template #default="props">
            <el-input v-model="props.row.note" />
          </template>            
        </el-table-column>
        <el-table-column :label="t('formDemo.manipulation')" min-width="86">
          <template #default="scope">
            <el-button size="small" type="danger" @click.prevent="deleteRow(scope.$index)" >Xóa</el-button>
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