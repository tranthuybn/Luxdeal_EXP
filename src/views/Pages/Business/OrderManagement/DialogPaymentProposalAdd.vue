<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import {
  ElSelect,
  ElOption,
  ElButton,
  ElDivider,
  ElTable,
  ElTableColumn,
  ElInput,
  ElDialog,
  ElDatePicker,
  ElMessage
} from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { changeMoney, printPage } from '@/utils/tsxHelper'
import { getStaffList} from '@/api/Business'
import InfinitOptions from '@/components/Select/InfinitOptions.vue'
import paymentOrderPrint from '@/views/Pages/Components/formPrint/src/paymentOrderPrint.vue'


const { t } = useI18n()
const doCloseOnClickModal = ref(false)
const props = defineProps({
    openDialog: {
        type: Boolean,
        default: false
    },
    formData: {
        type: Object,
        default: () => {}
    },
    formPrint: {
        type: String,
        default: ''
    }

})
const formPaymentRequest = ref()
const pageIndex = ref(1)
const formValue = reactive({...props.formData})
const open = computed(() => props.openDialog)
const choosePayment = [
  {
    value: 1,
    label: t('formDemo.cashPayment')
  },
  {
    value: 2,
    label: t('formDemo.cardPayment')
  }
]
const createdByOption = ref()
const formTotalMoney = {
    totalPaymentRequest: NaN,
    depositPayment: NaN,
    remaining: NaN

}
const detailedListExpenses = ref([
  {
    numberVouchers: '',
    dayVouchers: '',
    spentFor: '',
    quantity: 0,
    unitPrice: 0,
    totalPrice: 0,
    note: ''
  }
])
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
    console.log('createdByOption.value', createdByOption.value)
}
const printPaymentRequest = () => {
    const tableData = [...detailedListExpenses.value]
    formPaymentRequest.value = {
      code: formValue.codePaymentRequest,
      user: createdByOption.value,
      description: formValue.describe,
      enterMoney: formValue.enterMoney,
      payment: formValue.payment ? t('reuse.cashPayment') : t('reuse.bankTransferPayment'),
      money: formValue.money,
      detailedListExpenses: tableData,
      totalPrice: formTotalMoney.totalPaymentRequest,
      debtMoney: formTotalMoney.remaining,
      depositeMoney: formTotalMoney.depositPayment,
    }
    printPage(props.formPrint)
}

const postPaymentRequest = () => {

}
const calculateTotalPaymentRequest = () => {

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
</script>

<template>
    <div id="IPRFormPrint">
        <slot>
            <paymentOrderPrint v-if="formPaymentRequest" :formPaymentRequest="formPaymentRequest" />
        </slot>
    </div>
    <el-dialog
        :close-on-click-modal="doCloseOnClickModal"
        v-model="open"
        :title="t('formDemo.informationPaymentRequestForm')"
        width="40%"
        :lock-scroll="true"
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
                :defaultValue="formValue.createdId"
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
                  <CurrencyInputComponent
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
                <template #default="props">
                  {{ changeMoney.format(props.row.totalPrice) }}
                </template>
              </el-table-column>
              <el-table-column prop="note" :label="t('reuse.note')" width="180">
                <template #default="data">
                  <el-input v-model="data.row.note" type="text" />
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="flex justify-end mr-[90px]">
            <div class="w-[145px] text-right">
              <p class="text-black font-bold dark:text-white">{{ t('formDemo.total') }}</p>
            </div>
            <div class="w-[145px] text-right">
              <p class="pr-2 text-black font-bold dark:text-white">
                {{ changeMoney.format(formTotalMoney.totalPaymentRequest) }}
              </p>
            </div>
          </div>
          <span
            class="block h-1 float-right w-[45%] border-t-1 dark:border-[#4c4d4f] mt-2 mb-2"
          ></span>
          <div class="flex w-[100%] justify-end">
            <div class="w-[145px] text-right">
              <p class="text-blue-400 mb-2">
                {{ t('formDemo.deposit') }}
                <span class="text-red-500">*</span>
              </p>
              <p class="text-red-600">{{ t('reuse.remaining') }}</p>
            </div>
            <div class="w-[145px] text-right">
              <input
                v-model="formTotalMoney.depositPayment"
                class="pr-2 w-[130px] text-right border-1 outline-none rounded mb-2"
              />
              <p class="pr-2 text-red-600">{{
                formTotalMoney.remaining ? changeMoney.format(formTotalMoney.remaining) : '0 đ'
              }}</p>
            </div>
            <div class="w-[90px]"></div>
          </div>
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('formDemo.billingInformation') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
        </div>
        <div>
          <div class="flex gap-4 pt-4 items-center">
            <label class="w-[30%] text-right">{{ t('formDemo.amountSpent') }}</label>
            <div class="w-[100%] text-xl">{{ formValue.spendMoney }}</div>
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
                  @click="
                    () => {
                      open = false
                      postPaymentRequest()
                    }
                  "
                  >{{ t('formDemo.saveRecordDebts') }}</el-button
                >
                <el-button @click="open = false">{{ t('reuse.exit') }}</el-button>
              </span>
            </div>
          </div>
        </template>
    </el-dialog>
</template>