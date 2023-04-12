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
  ElDialog,
  ElTableColumn,
  ElInput,
  ElForm,
  ElFormItem,
  ElDatePicker,
  ElNotification,
  ElMessageBox,
  ElMessage
} from 'element-plus'
import type {FormRules, FormInstance} from 'element-plus'
import InfinitOptions from '@/components/Select/InfinitOptions.vue'
import {
  GetPaymentRequestDetail,
  deletePaymentProposal,
  getStaffList,
  getAllCustomer,
  approvalOrder,
} from '@/api/Business'
import { postNewPaymentRequest } from '@/api/Accountant'
import InputPrice from '@/components/CurrencyInputComponent.vue'
import { onBeforeMount, reactive, ref, watch, unref, h } from 'vue'
import { FORM_IMAGES } from '@/utils/format'
import { dateTimeFormat } from '@/utils/format'
import { useIcon } from '@/hooks/web/useIcon'
import { Collapse } from '../../Components/Type'
import moment from 'moment';
import { useRoute, useRouter } from 'vue-router'
import { changeMoney, printPage, formartDate } from '@/utils/tsxHelper'
import { IDetailExpenses } from '../types/PaymentProposal.d'
import { useValidator } from '@/hooks/web/useValidator'
import { statusService } from '@/utils/status'
import { IStatusHistory } from '../types'
import paymentOrderPrint from '@/views/Pages/Components/formPrint/src/paymentOrderPrint.vue'

const statusHistory = reactive<Array<IStatusHistory>>([])
const currentUser = (JSON.parse(JSON.parse(localStorage.getItem('STAFF_INFO') || '')?.v)) || {}
const { t } = useI18n()
const escape = useIcon({ icon: 'quill:escape' })
const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })
const ruleFormRef = ref<FormInstance>()
const rulePaymentFormRef = ref<FormInstance>()
const formValue = ref()
const router = useRouter()
const route = useRoute()
const currentDate = ref(moment().format("DD/MM/YYYY"))
const curCode = 'DNTT' + moment().format('hhmmss')
const createdByOptions = ref([{}])
const peopleOptions = ref([{}])
const optionPeople = ref()
const optionCreatedBy = ref()
const id = Number(router.currentRoute.value.params.id)
const approvalId = String(route.query.approvalId)
const type = String(route.params.type) == ':type' ? 'add' : String(route.params.type)
const tableData = ref<Array<IDetailExpenses>>([])
const showInputPricePlaceholder = ref(true)
const disableForm = ref(false)
const formPaymentProposal = ref()
const nameDialog = ref('')
const printPayment = ref(false)
const pageIndex = ref(1)
const doCloseOnClickModal = ref(false)
const detailedListExpenses = ref<Array<IDetailExpenses>>([])
const { ValidService } = useValidator()
const rules = reactive<FormRules>({  
  createdBy: [ValidService.required] ,
  description: [ValidService.required],
  peopleId: [ValidService.required],        
})
const rulesPaymentMethod = reactive<FormRules>({
  totalMoney : [ValidService.required],
  enterMoney: [ValidService.required],
  typeOfPayment : [ValidService.required]
})
 
const setStatusHistory = () => {
  const newStatus = [
    {
      statusName: t('reuse.initializeAndWrite'),
      statusValue: 0, 
      approvedAt: currentDate.value,
      isActive: true
    }, 
    {
      statusName: t('reuse.approvePaymentProposal'),
      statusValue: 1, 
      approvedAt: formartDate(formValue.value?.approvedAt),
      isActive: true
    }, 
    {
      statusName: t('button.cancel'),
      statusValue: 4, 
      approvedAt: formartDate(formValue.value?.cancelAt),
      isActive: formValue.value?.isCancel ,
    },
  ]
    if(statusHistory.length > 0) statusHistory.splice(0, statusHistory.length)
    statusHistory.push(...newStatus)
    console.log(statusHistory)
}

const back = async () => {
  push({
    name: 'accountant.payment-proposal.payment-proposal-list'
  })
}
const optionsPayments = [
  {
    value: 1,
    key: 0,
    label: t('reuse.payThroughMoney')
  },
  {
    value: 0,
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
  createdBy: Number(currentUser.id),
  description: "",
  peopleId: "",
  debtMoney: 0,
  typeOfPayment: 1,
  status: 1,
  depositeMoney: 0,
  totalMoney: 0,
  enterMoney: '',
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
    const lastItem = tableData.value.at(-1)
    if (
      lastItem?.numberVouchers &&
      lastItem?.dayVouchers &&
      lastItem?.spendFor &&
      lastItem?.quantity &&
      lastItem?.unitPrice &&
      lastItem?.totalPrice
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
    if (el.quantity && el.unitPrice) {
      form.value.totalPrice += el.totalPrice
    }
  })
  form.value.debtMoney = form.value.totalPrice - form.value.depositeMoney
}

const autoCalculateFun = () => {
  form.value.debtMoney = form.value.totalPrice - form.value.depositeMoney
}
const postData = async() => {
  // const reusult = await Promise.all([unref(ruleFormRef), unref(rulePaymentFormRef)])
  await unref(ruleFormRef)!.validate(async (isValid) => {
  if(isValid) {
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
      PeopleId: optionPeople.value.id,
      CreatedBy: '',
      CreatedById: 1,
      status: 0,
      PeopleType: 1,
      Description: form.value.description,
      EnterMoney: form.value.enterMoney,
      ExpensesDetail: JSON.stringify(detailedListExpenses.value),
      DepositeMoney: form.value.depositeMoney,
      DebtMoney: form.value.debtMoney,
      TotalPrice: form.value.totalPrice
    }
    await postNewPaymentRequest(FORM_IMAGES(payload))
      .then(() => {
        ElNotification({
          message: t('reuse.addSuccess'),
          type: 'success'
        }),
          push({
            name: 'accountant.payment-proposal.payment-proposal-list',
            params: { backRoute: 'accountant.payment-proposal.payment-proposal-list' }
          })
        })
      .catch((res) =>
        ElNotification({
          message: res.response.data.message,
          type: 'warning'
        })
    )

  } else {
    ElMessage.error(t('reuse.notFillAllInformation'))
  }

})}

const getDetailPayment = async() => {
  if(!isNaN(id)) {
    const res = await GetPaymentRequestDetail({id: id})
    if(res) {
      formValue.value  = res.data.paymentRequest
      tableData.value = res.data.paymentRequestDetail
      await setFormValue()
    } else {
      ElNotification({
        message: t('reuse.cantGetData'),
        type: 'warning'
      })
    }
  }

}

const setFormValue = () => {
  const data = formValue.value
  form.value.code = data.code
  form.value.createdAt = data.createdAt
  form.value.createdBy = data.createdBy
  form.value.description = data.description
  form.value.peopleId = data.peopleId
  form.value.debtMoney = data.debtMoney
  form.value.typeOfPayment = data.paymentType
  form.value.depositeMoney = data.depositeMoney
  form.value.totalMoney = data.totalMoney
  form.value.enterMoney = data.enterMoney
  form.value.totalPrice = data.totalPrice
  form
  setStatusHistory()
}

onBeforeMount(async () => {
  getData()
})

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
const approvalPayments = async (val) => {
  const payload = { ItemType: 5, Id: parseInt(approvalId), IsApprove: val }
  await approvalOrder(FORM_IMAGES(payload))
  .then(() => {
      ElNotification({
        message: val ? t('reuse.approveSuccess') : t('reuse.cancelApproveSuccess'),
        type: 'success'
      })
      push({
        name: `approve.payment-approval.proposal`
      })
    })
    .catch(() =>
      ElNotification({
        message: t('reuse.approveFail'),
        type: 'warning'
      })
    )
}

// Xem detail or edit or approved 
const getData = () => {
  if (type == 'approval' || type == 'detail' || type == 'edit') {
    getDetailPayment()
    disableForm.value = type == 'approval' || type == 'detail'
  } else {
    onAddItem()
  }
}

const getRules = () => {
  if(type == 'add' || type == 'edit') return rules
  return {}
}

const cancel = () => {
  router.go(-1)
}

const delAction = () => {
  {
    ElMessageBox.confirm(`${t('reuse.deleteWarning')}`, 'Warning', {
      confirmButtonText: t('reuse.delete'),
      cancelButtonText: t('reuse.exit'),
      type: 'warning',
    })
      .then(async () => {
        const res = await deletePaymentProposal({ Id: id })
        if (res) {
          ElNotification({
            message: t('reuse.deleteSuccess'),
            type: 'success'
          })
          router.go(-1)
        } else {
          ElNotification({
            message: t('reuse.deleteFail'),
            type: 'warning'
          })
        }
      })
      .catch(() => {
        ElNotification({
          type: 'info',
          message: t('reuse.deleteCancel')
        })
      })
  }
}
const formPaymentProposalPeopleId = ref()

const getFormPayment = () => {
  if (formValue.value.enterMoney) {
    formPaymentProposal.value = {
      codeReceipts: formValue.value.code,
      moneyReceipts: formValue.value.totalMoney,
      reasonCollectingMoney: formValue.value.description,
      enterMoney: formValue.value.enterMoney,
      payment: formValue.value.typeOfPayment == 1 ? t('reuse.cashPayment') : t('reuse.cardPayment')
    }
    formPaymentProposalPeopleId.value = {
      username: optionPeople.value
    }
    nameDialog.value = t('reuse.labelPaymentProposalprint')

    printPayment.value = !printPayment.value
  }
}
const getMapData = ({code, phonenumber,name, id, email}) => ({label: `${name} | ${phonenumber}`, code, value: phonenumber, name, id, email  })
</script>
<template>
  <div id="IPRFormPrint">
    <slot>
      <paymentOrderPrint v-if="formPaymentProposal" :dataEdit="formPaymentProposalPeopleId" :dataSent="formPaymentProposal"/>
    </slot>
  </div>

      <!-- Dialog In phiếu thanh toán -->
      <el-dialog :close-on-click-modal="doCloseOnClickModal" v-model="printPayment" class="font-bold" width="40%" align-center >
        <div class="section-bill">
          <div class="flex gap-3 justify-end">
            <el-button @click="printPage('IPRFormPrint')">{{ t('button.print') }}</el-button>

            <el-button class="btn" @click="printPayment = false">{{ t('reuse.exit') }}</el-button>
          </div>
          <div class="dialog-content">
            <slot>
              <paymentOrderPrint
                v-if="formPaymentProposal"
                :dataEdit="formPaymentProposalPeopleId"
                :dataSent="formPaymentProposal"
                :nameDialog="nameDialog"
              />
            </slot>
          </div>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button class="btn" @click="printPayment = false">{{ t('reuse.exit') }}</el-button>
          </span>
        </template>
      </el-dialog>
  <el-collapse
    v-model="activeName" 
    @change="collapseChangeEvent" 
    :class="['bg-[var(--el-color-white)] dark:(bg-[var(--el-color-black)] border-[var(--el-border-color)] border-1px)']"
  > 
    <el-collapse-item :name="collapse[0].name" >
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
      <el-row class="border-t py-5 px-13" :gutter="20">
        <el-col :span="12">
          <el-divider content-position="left">{{ t('reuse.paymentRequestInfo') }}</el-divider>
          <el-form ref="ruleFormRef" :model="form" :rules="getRules()" label-width="160px" :disabled="disableForm">
            <el-form-item prop="code" :label="t('formDemo.formCode')">
              <div>{{ form.code }}</div>
            </el-form-item>
            <el-form-item prop="createdAt" :label="t('reuse.createDate')">
              <div>{{ dateTimeFormat(form.createdAt) }}</div>
            </el-form-item>
            <el-form-item :label="t('reuse.petitioner')" prop="createdBy">
              <InfinitOptions 
                :fields="[t('reuse.employeeCode'),t('reuse.phoneNumber'),t('reuse.employeeName')]"
                min-width="500px"
                valueKey="id" 
                labelKey="label"
                :hiddenKey="['id', 'label', 'email']"
                :clearable="false"
                :items="createdByOptions"
                :pageIndex="pageIndex"
                :api="getStaffList"
                :mapFunction="getMapData"
                :defaultValue="form.createdBy"
                @update-value="(_value, option) => handleChangeOptions(option, form, 'createdBy')"
             />
            </el-form-item>
            <el-form-item :label="t('formDemo.reasonsSpendMoney')" prop="description" >
              <el-input v-model="form.description" :placeholder="t('formDemo.enterDescription')" />
            </el-form-item>
            <el-divider content-position="left">{{ t('reuse.subject') }}</el-divider>
            <el-form-item :label="t('reuse.selectObject')" prop="peopleId">
              <InfinitOptions 
                :fields="[t('reuse.customerCode'),t('reuse.phoneNumber'),t('reuse.customerName')]"
                min-width="500px"
                valueKey="id" 
                :placeHolder="t('reuse.selectObject')"
                labelKey="label"
                :hiddenKey="['id', 'email', 'label']"
                :clearable="false"
                :defaultValue="form.peopleId"
                :items="peopleOptions"
                :pageIndex="pageIndex"
                :api="getAllCustomer"
                :mapFunction="getMapData"
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
      <el-form ref="rulePaymentFormRef" :disabled="disableForm">
        <el-table class="px-4" :data="tableData" border header-row-class-name="dark:text-white text-black">
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
          <el-table-column prop="note" :label="t('reuse.note')" min-width="300">
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
      </el-form>
      <el-form :disabled="disableForm" label-width="150px">
        <el-row class="justify-end mt-3 mr-36">
          <el-col :span="6">
            <el-form-item :label="t('reuse.totaMoney') " class="margin-0">
              <span class="w-[170px] text-right">{{ changeMoney.format(form.totalPrice) }}</span>
            </el-form-item>
            <el-form-item :label="t('formDemo.deposit') " class="margin-0">
              <span class="w-[170px] text-right">
                <el-input @change="autoCalculateFun" placeholder="đ" class="poi_text_right" v-model="form.depositeMoney" />
              </span>
            </el-form-item>
            <el-form-item :label="t('reuse.remaining')" class="margin-0 debtMoney text-red-500" >
              <span class="w-[170px] text-right">{{ changeMoney.format(form.debtMoney) }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row class="py-5 px-13" :gutter="20">
        <el-divider content-position="left" >{{ t('formDemo.billingInformation') }}</el-divider>
        <el-col :span=12>
          <el-form :model="form" :rules="rulesPaymentMethod" :disabled="disableForm" label-width="160px" class="basis-1/2" >
            <el-form-item 
              prop="totalMoney"
              :label="t('formDemo.amountSpent')" 
            >
                <InputPrice 
                  v-model="form.totalMoney"
                  style="width: 100%"
                  :placeholder="t('reuse.placeholderMoney')"
                  :suffixIcon="h('div', 'đ')"
                  :showCurrency="false"
                  :showPlaceholder="showInputPricePlaceholder"
                  @update:modelValue="showInputPricePlaceholder = false"
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
              <div class="mr-5 flex flex-col justify-start gap-2" v-if="type=='add'">
                <div>
                  <span
                      class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-black dark:bg-transparent"
                    ></span>
                    <span class="box status--initial dark:text-divck" >
                      {{ t('reuse.initializeAndWrite') }}
                      <span class="triangle-right"></span>
                    </span>
                </div>
                <div class="italic text-xs text-gray-500">{{ currentDate }}</div>
              </div>
              <div v-else class="flex items-start shrink-0" >
                <div          
                    class="duplicate-status align-top"
                    v-for="(item, index) in statusHistory"
                    :key="index"
                >
                  <div v-if="item.isActive" class="mr-5 flex flex-col justify-start gap-2">
                      <div>
                        <span
                          class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-black dark:bg-transparent"
                        ></span>
                        <span class="box dark:text-divck" :class="statusService(item.statusValue)" >
                          {{item.statusName }}    
                          <span class="triangle-right"></span>
                        </span>
                      </div>
                      <div class="italic text-xs text-gray-500">{{dateTimeFormat(item.approvedAt)}}</div>
                  </div>
                </div>
              </div>
            </el-form-item>


          </el-form>
          <el-form label-width="160px" class="basis-1/2">
            <el-form-item v-if="type === 'add'">
              <el-button>{{ t('button.print') }}</el-button>
              <el-button type="primary" @click="postData">{{ t('reuse.saveAndPending') }}</el-button>
              <el-button type="danger" @click="cancel">{{ t('reuse.cancel') }}</el-button>
            </el-form-item>

            <el-form-item v-if="type === 'detail'">
              <el-button v-if="formValue?.isApproved" @click="getFormPayment">{{ t('button.print') }}</el-button>
              <el-button v-else type="danger" @click="delAction">{{ t('reuse.cancel') }}</el-button>
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
@import '../style.scss';
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

.margin-0 {
  margin: 0 !important;
}

::v-deep(.debtMoney) {
  .el-form-item__label {
    color: #ef4444;
  }
}

@media screen {

  #IPRFormPrint {
    display: none;
  }
}
</style>