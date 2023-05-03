<script setup lang="ts">
import { onBeforeMount, reactive, ref, watch } from 'vue'
import {
  ElSelect,
  ElOption,
  ElButton,
  ElCol,
  ElRow,
  ElDivider,
  ElTable,
  ElTableColumn,
  ElInput,
  ElForm,
  ElFormItem,
  ElDialog,
  ElDatePicker,
  ElMessage,
  ElNotification
} from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { changeMoney, printPage } from '@/utils/tsxHelper'
import { getStaffList, addDNTT } from '@/api/Business'
import InfinitOptions from '@/components/Select/InfinitOptions.vue'
import paymentOrderPrint from '@/views/Pages/Components/formPrint/src/paymentOrderPrint.vue'
import { FORM_IMAGES } from '@/utils/format'

const { t } = useI18n()
const doCloseOnClickModal = ref(false)
const props = defineProps({
  modelValue:{
    type: Boolean,
    required: true,
    default: false
  },
  formData: {
    type: Object,
    default: () => {}
  },
  orderId: {
    type: Number,
    default: NaN
  }

})

const printpaymentOrderPrint = ref(false)
const formPaymentRequest = ref()
const currentUser = (JSON.parse(JSON.parse(localStorage.getItem('STAFF_INFO') || '')?.v)) || {}
const pageIndex = ref(1)
const detailedListExpenses  = ref<Array<any>>([
])
onBeforeMount(() =>{
  onAddItem()
})

interface IFormValue {
  orderCode: string
  codePaymentRequest: string
  describe: string
  spendMoney: string
  enterMoney: string
  payment: number
  createdById: number
  money: string
  customerId: number
}
const emit = defineEmits(['changePaymentOrder', 'update:modelValue'])
const formValue : Partial<IFormValue> = reactive({...props.formData, createdById: currentUser.id })
const choosePayment = [
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
const createdByOption = ref(currentUser)
const formTotalMoney = reactive({
    totalPaymentRequest: 0,
    depositPayment: 0,
    remaining: 0
})
const calculateTotalPaymentRequest = () => {
  formTotalMoney.totalPaymentRequest = detailedListExpenses.value.reduce((total, item) => {
    return total + item.totalPrice
  }, 0)
  calculateRemaining()
}
const calculateRemaining = () => {
  formTotalMoney.remaining = formTotalMoney.totalPaymentRequest - formTotalMoney.depositPayment
}

const checkQuantity = (value) => {
  if (isNaN(value)) {
    ElMessage.error(t('reuse.numberFormat'))
  } else if (value < 0) {
    ElMessage.error(t('reuse.positiveNumber'))
  }
}
const getMapData = ({code, phonenumber,name, id, email}) => ({label: `${name} | ${phonenumber}`, code, value: phonenumber, name, id, email  })
const handleChangeOptions = (_value, option) => {
    formValue.createdById = option.id
    createdByOption.value = option
}
const printPaymentRequest = () => {
    const tableData = [...detailedListExpenses.value]
    formPaymentRequest.value = {
      code: formValue.codePaymentRequest,
      user: createdByOption.value,
      description: formValue.describe,
      enterMoney: formValue.enterMoney,
      payment: formValue.payment ? t('reuse.cashPayment') : t('reuse.bankTransferPayment'),
      money: formValue.spendMoney,
      detailedListExpenses: tableData,
      totalPrice: formTotalMoney.totalPaymentRequest,
      debtMoney: formTotalMoney.remaining,
      depositeMoney: formTotalMoney.depositPayment,
    }
    printpaymentOrderPrint.value = !printpaymentOrderPrint.value
}

const postPaymentRequest = async () => {
  if (!detailedListExpenses.value[detailedListExpenses.value.length - 1].numberVouchers)
    detailedListExpenses.value.pop()
  const payload = {
    Code: formValue.codePaymentRequest,
    CreatedBy: createdByOption.value.name,
    CreatedById: createdByOption.value.id,
    TotalMoney: formValue.spendMoney,
    PaymentType: formValue.payment,
    PeopleId: formValue.customerId,
    status: 1,
    PeopleType: 1,
    OrderId: props.orderId,
    Description: formValue.describe,
    TotalPrice: formTotalMoney.totalPaymentRequest,
    EnterMoney: formValue.enterMoney,
    DebtMoney: formTotalMoney.remaining,
    DepositeMoney: formTotalMoney.depositPayment,
    ExpensesDetail: JSON.stringify(detailedListExpenses.value)
  }
  await addDNTT(FORM_IMAGES(payload))
  .then(res => {
    ElNotification({
      message: t('reuse.addSuccess'),
      type: 'success'
    })
    const idPayment = res.paymentRequestId
    close()
    emit('changePaymentOrder', idPayment)
  })
  .catch(() => {
    ElNotification({
      message: t('reuse.addFail'),
      type: 'warning'
    })
  })
}
const changeQuantity = (scope) => {
    checkQuantity(scope.row.quantity)
    scope.row.totalPrice = scope.row.unitPrice * scope.row.quantity
    calculateTotalPaymentRequest()
}
const changeUnitPrice = (scope) => {
    scope.row.totalPrice = scope.row.unitPrice * scope.row.quantity
    calculateTotalPaymentRequest()
}
const close = () =>{
  emit('update:modelValue', false)
}
const onAddItem = () => {
  detailedListExpenses.value.push({    
    numberVouchers: "",
    dayVouchers: new Date(),
    spentFor: "",
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
    note: "",
  })
}
const deleteRow = (index: number) => {
  detailedListExpenses.value.splice(index, 1)
}

watch(detailedListExpenses.value, () => {
  const lastItem = detailedListExpenses.value.at(-1)
  if (
      lastItem?.numberVouchers &&
      lastItem?.dayVouchers &&
      lastItem?.spentFor &&
      lastItem?.quantity &&
      lastItem?.unitPrice &&
      lastItem?.totalPrice
    )
    onAddItem()
})

</script>

<template>
    <div id="paymentProposalForm">
        <slot>
            <paymentOrderPrint v-if="formPaymentRequest" :formPaymentRequest="formPaymentRequest" />
        </slot>
    </div>
    <el-dialog
        :close-on-click-modal="doCloseOnClickModal"
        :modelValue="modelValue"
        :title="t('formDemo.informationPaymentRequestForm')"
        width="650px"
        :lock-scroll="true"
        @close="close"
      >
        <div>
          <el-divider />
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('formDemo.documentsAttached') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
          <div class="flex gap-4 pt-4 pb-4 items-center">
            <label class="w-[30%] text-right">{{ t('formDemo.orderCode') }}</label>
            <div class="w-[100%] text-xl">{{ formValue.orderCode }}</div>
          </div>
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('router.analysis') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
          <div>
            <div class="flex gap-4 pt-4 items-center">
              <label class="w-[30%] text-right">{{ t('formDemo.PaymentRequestCode') }}</label>
              <div class="w-[100%] text-xl">{{ formValue.codePaymentRequest }}</div>
            </div>
            <div class="flex gap-4 pt-4 items-center">
              <label class="w-[30%] text-right"
                >{{ t('formDemo.proponent') }} <span class="text-red-500">*</span></label
              >
              <InfinitOptions 
                :fields="[t('reuse.employeeCode'),t('reuse.phoneNumber'),t('reuse.employeeName')]"
                min-width="500px"
                :placeHolder="t('reuse.chooseARecommender')"
                valueKey="id" 
                labelKey="label"
                :hiddenKey="['id', 'label', 'email']"
                :clearable="false"
                :pageIndex="pageIndex"
                :api="getStaffList"
                :mapFunction="getMapData"
                :defaultValue="formValue.createdById"
                @update-value="handleChangeOptions"
              />
            </div>
            <div class="flex gap-4 pt-4 pb-4 items-center">
              <label class="w-[30%] text-right"
                >{{ t('formDemo.reasonsSpendMoney') }} <span class="text-red-500">*</span></label
              >
              <el-input
                style="width: 100%"
                v-model="formValue.describe"
                :placeholder="t('formDemo.enterReasonPaymentRequest')"
              />
            </div>
          </div>
          <div class="flex items-center">
            <span class="w-[50%] text-base font-bold">{{
              t('formDemo.detailedListExpenses')
            }}</span>
            <span class="block h-1 w-[50%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
          <div class="pt-2 pb-2">
            <el-table
              :data="detailedListExpenses"
              border
              :class="[
                'bg-[var(--el-color-white)] dark:(text-white-800) border-[var(--el-border-color)] border-1px)'
              ]"
            >
              <el-table-column label="STT" type="index" width="60" align="center" />
              <el-table-column
                prop="numberVouchers"
                :label="t('formDemo.numberVouchers')"
                width="180"
              >
                <template #default="data">
                  <el-input v-model="data.row.numberVouchers" type="text" />
                </template>
              </el-table-column>
              <el-table-column prop="dayVouchers" :label="t('formDemo.dayVouchers')" width="180">
                <template #default="data">
                  <el-date-picker
                    v-model="data.row.dayVouchers"
                    type="date"
                    placeholder="Pick a day"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="spentFor" :label="t('formDemo.spendFor')" width="180">
                <template #default="data">
                  <el-input
                    v-model="data.row.spentFor"
                    placeholder="Nhập nội dung chi"
                    type="text"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="quantity" :label="t('formDemo.sl')" align="center" width="80">
                <template #default="scope">
                  <el-input
                    @change="changeQuantity(scope)"
                    type="number"
                    v-model="scope.row.quantity"
                    style="width: 100%"
                  />
                </template>
              </el-table-column>
              <el-table-column
                prop="unitPrice"
                :label="t('reuse.unitPrice')"
                align="right"
                width="180"
              >
                <template #default="scope">
                  <el-input
                    v-model="scope.row.unitPrice"
                    @change="changeUnitPrice(scope)"
                  />
                </template>
              </el-table-column>
              <el-table-column
                prop="totalPrice"
                :label="t('formDemo.intoMoney')"
                align="right"
                width="180"
              >
                <template #default="scope">
                  {{ changeMoney.format(scope.row.totalPrice) }}
                </template>
              </el-table-column>
              <el-table-column prop="note" :label="t('reuse.note')" width="180">
                <template #default="scope">
                  <el-input v-model="scope.row.note" type="text" />
                </template>
              </el-table-column>
              <el-table-column :label="t('formDemo.manipulation')" min-width="86">
                <template #default="scope">
                  <el-button :disabled="detailedListExpenses.length === 1" size="small" type="danger" @click.prevent="deleteRow(scope.$index)">Xóa</el-button>

                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-row class="justify-end">
            <el-col :span="12">
              <el-form :disabled="disableForm" label-width="150px">
                <el-form-item :label="t('reuse.totaMoney') " class="margin-0">
                  <span class="w-[170px] text-right">{{ changeMoney.format(formTotalMoney.totalPaymentRequest) }}</span>
                </el-form-item>
                <el-form-item :label="t('formDemo.deposit') " class="margin-0">
                  <span class="w-[170px] text-right">
                    <el-input @change="calculateRemaining" class="poi_text_right" v-model="formTotalMoney.depositPayment" />
                  </span>
                </el-form-item>
                <el-form-item :label="t('reuse.remaining')" class="margin-0 debtMoney text-red-500" >
                  <span class="w-[170px] text-right">{{ changeMoney.format(formTotalMoney.remaining) }}</span>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('formDemo.billingInformation') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
        </div>
        <div>
          <div class="flex gap-4 pt-4 items-center">
            <label class="w-[30%] text-right">{{ t('formDemo.amountSpent') }}</label>
            <div class="w-[100%] text-xl">{{ changeMoney.format(formValue.spendMoney) }}</div>
          </div>
          <div class="flex gap-4 pt-4 items-center">
            <label class="w-[30%] text-right"
              >{{ t('formDemo.writtenWords') }} <span class="text-red-500">*</span></label
            >
            <el-input
              v-model="formValue.enterMoney"
              style="width: 100%"
              :placeholder="t('formDemo.writtenWords')"
            />
          </div>
          <div class="flex gap-4 pt-4 items-center">
            <label class="w-[30%] text-right"
              >{{ t('formDemo.formPayment') }} <span class="text-red-500">*</span></label
            >
            <el-select v-model="formValue.payment" placeholder="Select">
              <el-option
                v-for="item in choosePayment"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="flex gap-4 pt-4 pb-4 items-center">
            <label class="w-[30%] text-right">{{ t('reuse.status') }}</label>
            <div class="flex items-center w-[100%]">
              <span
                class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-neutral-900 dark:bg-transparent"
              ></span>
              <span class="box dark:text-black">
                Khởi tạo & ghi sổ
                <span class="triangle-right"> </span>
              </span>
            </div>
          </div>
        </div>
        <template #footer>
          <div class="flex justify-between">
            <el-button @click="printPaymentRequest()">{{ t('button.print') }}</el-button>
            <div>
              <span class="dialog-footer">
                <el-button
                  type="primary"
                  @click="postPaymentRequest"
                  >{{ t('formDemo.saveRecordDebts') }}</el-button
                >
                <el-button @click="close">{{ t('reuse.exit') }}</el-button>
              </span>
            </div>
          </div>
        </template>
    </el-dialog>
    <el-dialog :close-on-click-modal="doCloseOnClickModal" v-model="printpaymentOrderPrint" class="font-bold" width="40%" align-center >
      <div class="section-bill">
        <div class="flex gap-3 justify-end">
          <el-button @click="printPage('paymentProposalForm')">{{ t('button.print') }}</el-button>

          <el-button class="btn" @click="printpaymentOrderPrint = false">{{ t('reuse.exit') }}</el-button>
        </div>
        <div class="dialog-content">
          <slot>
        <paymentOrderPrint v-if="formPaymentRequest" :formPaymentRequest="formPaymentRequest" />
      </slot>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="btn" @click="printpaymentOrderPrint = false">{{ t('reuse.exit') }}</el-button>
        </span>
      </template>
    </el-dialog>
</template>
<style lang="scss">
  #paymentProposalForm {
    display: none;
  }
</style>