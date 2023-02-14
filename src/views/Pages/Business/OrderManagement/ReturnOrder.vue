<script setup lang="ts">
import {
  ElDivider,
  ElDialog,
  ElTable,
  ElTableColumn,
  ElButton,
  ElInput,
  ElInputNumber,
  ElDatePicker,
  ElSelect,
  ElOption,
ElNotification,
  ElMessage
} from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { dateTimeFormat } from '@/utils/format'
import Qrcode from '@/components/Qrcode/src/Qrcode.vue'
import MultipleOptionsBox from '@/components/MultipleOptionsBox.vue'
import { onBeforeMount, reactive, ref, watch } from 'vue'
import { STATUS_ORDER_RENTAL, STATUS_ORDER_DEPOSIT } from '@/utils/API.Variables'

const { t } = useI18n()
const props = defineProps({
  modelValue: Boolean,
  showDialog: {
    type: Boolean,
    default: false
  },
  type: {
    type: Number,
    /*
    1.Đơn bán
    2.Đơn thuê
    3.Đơn ký gửi
    4.Đơn cầm đồ
    5.Đơn Spa
    */
    default: 0
  },
  orderData: {
    type: Object,
    default: () => {}
  },
  listProductsTable: {
    type: Array<Product>,
    default: () => [{}]
  },
  orderId: {
    type: Number,
    default: 0
  },
  orderStatusType: {
    type: Number,
    /*2:Trả hàng trước hạn,
    3.Trả hàng hết hạn, 
    4:chuộc hàng trước thời hạn , 
    5.chuộc hàng trước hết hạn, 
    6.Đứt hàng
    7.Gia hạn cầm đồ
    8.Trả hàng Spa,
    9.Gia hạn ký gửi
    */
    default: 0
  },
  statusActive: {
    type: Number,
    default: 0
  },
  statusApproval: {
    type: Number,
    default: 0
  },
  dateApproval: {
    type: String,
    default: ''
  },
  detailExpand: {
    type: Object,
    default: () => {}
  },
  doneExpand: {
    type: Boolean,
    default: false
  },
  cancelExpend: {
    type: Boolean,
    default: false
  }
})

const optionsTinhTrang = [
  {
    value: true,
    label: 'Đã spa'
  },
  {
    value: false,
    label: 'Không spa'
  }
]

const emit = defineEmits([
  'update:modelValue',
  'add-row',
  'post-return-request',
  'extend-date',
  'remove-row',
  'update-status',
  'cancel-expend'
])
type Product = {
  productCode: string
  value: Number
  name: string
  price: Number
  productPropertyId: Number
  productPropertyCode: string
  hirePrice: Number
}
const updateValue = (value, _obj, scope) => {
  scope.row.productPropertyId = value
  addRow()
}
const addRow = () => {
  emit('add-row')
}
const open = () => {
  emit('update:modelValue', true)
}
const close = () => {
  emit('update:modelValue', false)
}
const postReturnRequest = async (orderStatusType) => {
  emit('post-return-request', orderStatusType, tableAheadOfTime.value)
  emit('update:modelValue', false)
  emit('update-status')
}
const postReturnRequestSpa = async (orderStatusType) => {
  let chooseSpa = true
  props.orderData.tableData.forEach((row)=>{
    if(row.isSpa == undefined){
      chooseSpa = false
    }
  })
  if(chooseSpa){
  emit('post-return-request', orderStatusType)
  emit('update:modelValue', false)}
  else{
    ElNotification({
        title: 'Info',
        message: 'Bạn vui lòng tình trạng sản phẩm nhé!',
        type: 'info'
      })}
}

const donePaymentRequest = async (orderStatusType) => {
  emit('update:modelValue', false)
  emit('update-status', orderStatusType)
}

const cancelPaymentRequest = async (orderStatusType) => {
  emit('update:modelValue', false)
  emit('cancel-expend')
  emit('update-status', orderStatusType)
}

const disableCheck = ref(false)

const extendDate = (data) => {
  emit('extend-date', data)
}
const removeRow = (scope) => {
  if (props.orderData.tableData?.length < 2) {
    return
  }
  emit('remove-row', scope.$index)
}

interface tableReturnType {
  productPropertyId: number | undefined
  productPropertyName: string
  accessory: string
  quantity: number
  conditionProducts: string
}
const tableAheadOfTime = ref<Array<tableReturnType>>([])
  const productForSale = reactive<tableReturnType>({
    productPropertyId: undefined,
    productPropertyName: '',
    accessory: '',
    quantity: 1,
    conditionProducts: ''
})

const addRowTable = () => {
  tableAheadOfTime.value.push({ ...productForSale })
}

const duplicateProduct = ref()
const duplicateProductMessage = () => {
  ElMessage.error('Sản phẩm đã được chọn, vui lòng tăng số lượng hoặc chọn sản phẩm khác')
}
// update value table
const updateValueTable = (_value, obj, scope) => {
  const data = scope.row
  duplicateProduct.value = undefined
  duplicateProduct.value = tableAheadOfTime.value?.find(
    (val) => val?.productPropertyId == _value
  )
  if (duplicateProduct.value) {
    duplicateProductMessage()
  } else if(!data?.selected) {
      data.productPropertyId = obj?.productPropertyId
      data.productPropertyName = obj?.name
      data.maximumQuantity = obj?.maximumQuantity
  }
}

// Trả hàng trước hạn
watch(
  () => tableAheadOfTime.value[tableAheadOfTime.value.length - 1],
  () => {
    if (
      tableAheadOfTime.value[tableAheadOfTime.value.length - 1]?.productPropertyName &&
      tableAheadOfTime.value[tableAheadOfTime.value.length - 1]?.quantity 
      && !props?.doneExpand && !props?.cancelExpend
    )
    addRowTable()
  },
  {
    deep: true
  }
)
const statusApprovalExpand = ref()

// Trạng thái duyệt trả hàng trước hạn được duyệt
watch(
  () => statusApprovalExpand,
  () => {
    if (statusApprovalExpand.value == STATUS_ORDER_RENTAL[4].orderStatus || 
      statusApprovalExpand.value == STATUS_ORDER_DEPOSIT[5].orderStatus) {
        approvalAtStatus.value = props?.dateApproval
      }
  },
  {
    deep: true
  }
)

watch(
  () => props?.detailExpand,
  () => {
    if (props?.doneExpand && props?.detailExpand || props?.cancelExpend && props?.detailExpand) tableAheadOfTime.value = props?.detailExpand.map((val) => ({
    productPropertyId: val?.productPropertyId,
    productPropertyName: val?.productPropertyName,
    accessory: val?.accessory,
    quantity: val?.quantity,
    conditionProducts: val?.description
  }))
  }
)

// trạng thái trả hàng trước hạn
const createAtStatus = ref(new Date())
const approvalAtStatus = ref()

onBeforeMount(()=>{
  statusApprovalExpand.value = props?.statusApproval
  if (!props?.doneExpand) addRowTable()
})

</script>
<template>
  <!-- 2:Trả hàng trước hạn -->
  <el-dialog
    :model-Value="modelValue"
    v-if="orderStatusType == 3"
    @open="open"
    @close="close"
    class="font-bold"
    :title="t('formDemo.infoReturnAheadOfTime')"
    width="50%"
    align-center
  >
    <div>
      <el-divider />
      <div class="flex items-center">
        <span class="w-[25%] text-base font-bold">{{ t('formDemo.orderInformation') }}</span>
        <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
      </div>
      <div class="flex pt-2 pb-2 items-center">
        <div class="flex-1">
          <div class="flex gap-4">
            <label class="w-[40%] text-right">{{ t('formDemo.orderCode') }}</label>
            <div class="w-[60%] text-xl text-black font-bold dark:text-light-50">{{
              orderData?.orderCode
            }}</div>
          </div>
          <div class="flex gap-4" v-if="type == 2">
            <label class="w-[40%] text-right">{{ t('reuse.rentalTerm') }}</label>
            <div class="w-[60%] text-black dark:text-light-50">{{
              orderData?.leaseTerm == '1'
                ? 'Theo ngày'
                : orderData?.leaseTerm == '7'
                ? 'Theo tuần'
                : 'Theo tháng'
            }}</div>
          </div>
          <div class="flex gap-4" v-if="type == 2">
            <label class="w-[40%] text-right">{{ t('formDemo.rentalPeriod') }}</label>
            <div class="w-[60%] text-black dark:text-light-50">
              {{ dateTimeFormat(orderData?.period[0]) }} đến
              {{ dateTimeFormat(orderData?.period[1]) }}
            </div>
          </div>
          <div class="flex gap-4" v-if="type == 3">
            <label class="w-[40%] text-right">{{ t('reuse.depositPeriod') }}</label>
            <div class="w-[60%] text-black dark:text-light-50">
              {{ dateTimeFormat(orderData?.period[0]) }} đến
              {{ dateTimeFormat(orderData?.period[1]) }}
            </div>
          </div>
        </div>

        <div class="flex-1 flex items-start gap-4">
          <span>
            <div class="text-right">Mã QR đơn hàng</div>
            <span class="text-yellow-400">Thanh toán thông qua app Luxdeal</span>
          </span>

          <span class="border"><Qrcode :width="100" :text="orderData?.orderCode" /></span>
        </div>
      </div>
      <div class="flex items-center">
        <span class="w-[25%] text-base font-bold">{{ t('reuse.customerInfo') }}</span>
        <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
      </div>
      <div>
        <div class="flex gap-4 items-center">
          <label class="w-[30%] text-right">{{ t('reuse.customerName') }}</label>
          <div class="w-[100%] text-black dark:text-light-50">{{ orderData?.name }}</div>
        </div>
        <div class="flex gap-4 items-center">
          <label class="w-[30%] text-right">{{ t('formDemo.address') }}</label>
          <div class="w-[100%] text-black dark:text-light-50">{{ orderData?.customerAddress }}</div>
        </div>
        <div class="flex gap-4 items-center">
          <label class="w-[30%] text-right">{{ t('reuse.phoneNumber') }}</label>
          <div class="w-[100%] text-black dark:text-light-50">{{ orderData?.phone }}</div>
        </div>
        <div class="flex gap-4 pb-4 items-center">
          <label class="w-[30%] text-right">{{ t('formDemo.returnReason') }}</label>
          <div class="w-[100%] text-black dark:text-light-50">{{
            t('formDemo.aheadTimeReturns')
          }}</div>
        </div>
      </div>
      <div class="flex items-center">
        <span class="w-[30%] text-base font-bold break-w" v-if="type == 2">{{
          t('formDemo.fullyIntegrated')
        }}</span>
        <span class="w-[30%] text-base font-bold break-w" v-if="type == 3">{{
          t('reuse.informationReturnExportProduct')
        }}</span>
        <span class="block h-1 w-[70%] border-t-1 dark:border-[#4c4d4f]"></span>
      </div>
    </div>
    <div class="pt-2 pb-2">
      <el-table :data="tableAheadOfTime" border style="width: 100%" fit>
        <el-table-column label="STT" type="index" width="60" align="center" />
        <el-table-column prop="productPropertyName" :label="t('formDemo.commodityName')" width="300">
          <template #default="scope">
            <MultipleOptionsBox
              :defaultValue="scope.row?.productPropertyId"
              v-if="!props?.doneExpand && !props?.detailExpand"
              :fields="[
                t('reuse.productCode'),
                t('reuse.managementCode'),
                t('formDemo.productInformation')
              ]"
              filterable
              :items="listProductsTable"
              :disable="disableCheck"
              valueKey="productPropertyId"
              labelKey="name"
              :hiddenKey="['id']"
              :placeHolder="'Chọn mã sản phẩm'"
              :clearable="false"
              @update-value="(value, obj) => updateValueTable(value, obj, scope)"
            />
            <div v-else>{{scope.row?.productPropertyName}}</div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="statusActive == 3"
          prop="productPropertyName"
          :label="t('formDemo.commodityName')"
          width="350"
        >
          <template #default="scope">
            {{ scope.row?.productPropertyName }}
          </template>
        </el-table-column>
        <el-table-column prop="accessory" :label="t('reuse.accessory')">
          <template #default="scope">
            <el-input v-if="!props?.doneExpand && !props?.detailExpand" v-model="scope.row.accessory" />
            <p v-else>{{ scope.row?.accessory }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" :label="t('reuse.quantity')">
          <template #default="scope">
            <el-input
            v-if="!props?.doneExpand && !props?.detailExpand"
              v-model="scope.row.quantity"
              type="number"
              :min="0"
              :max="scope.row.maximumQuantity"
            />
            <div v-else>{{ scope.row.quantity }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="conditionProducts" :label="t('reuse.conditionProducts')">
          <template #default="scope">
            <el-input v-if="!props?.doneExpand && !props?.detailExpand" v-model="scope.row.conditionProducts" />
            <div v-else>{{ scope.row.conditionProducts }}</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="flex items-center">
        <span class="w-[25%] text-base font-bold">{{ t('reuse.status') }}</span>
        <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
      </div>
      <div class="flex gap-4 pb-2 items-center">
        <label class="w-[30%] text-right">{{ t('reuse.status') }}</label>
        <div class="flex items-center w-[100%]">
          <div class="flex items-center gap-2 flex-wrap w-[100%]">
            <div class="flex gap-4">  
              <span class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-black dark:bg-transparent"></span>
              <span class="box dark:text-black">
                {{ t('reuse.initializeAndWrite') }}
                <span class="triangle-right"> </span>
              </span>     

              <span
                class="triangle-left ml-[155px] border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-black dark:bg-transparent"
              ></span>
              <span
                class="box box_1 text-yellow-500 dark:text-black active"
              >
              {{ t('formDemo.approvedReturnAHeadOfTime') }}
                <span class="triangle-right right_1"> </span>
              </span>
            </div>
          </div>          
        </div>
      </div>
      <div class="flex gap-4">
          <label class="w-[30%]"></label>
          <div class="w-[100%] flex gap-22">
            <i class="">{{ dateTimeFormat(createAtStatus) }}</i>
            <i
              v-if="statusApprovalExpand == STATUS_ORDER_RENTAL[4].orderStatus || 
              statusApprovalExpand == STATUS_ORDER_DEPOSIT[5].orderStatus">{{ dateTimeFormat(approvalAtStatus) }}</i>
          </div>
      </div>
      
    </div>

    <template #footer>
      <div class="flex justify-end">
        <div v-if="props?.doneExpand">
          <el-button class="min-w-42 min-h-11" type="warning" @click="donePaymentRequest(120)">{{ t('formDemo.completeReturn') }}</el-button>
          <el-button class="min-w-36 min-h-11" @click="close">{{ t('reuse.exit') }}</el-button>
        </div>
        <div v-else-if="props?.cancelExpend">
          <el-button class="min-w-42 min-h-11" @click="cancelPaymentRequest(STATUS_ORDER_RENTAL[5].orderStatus)">{{
            t('formDemo.cancelReturn') }}</el-button>
          <el-button class="min-w-36 min-h-11" @click="close">{{ t('reuse.exit') }}</el-button>
        </div>
        <div
          v-else-if="statusApprovalExpand != STATUS_ORDER_RENTAL[4].orderStatus ||
          statusApproval != STATUS_ORDER_DEPOSIT[5].orderStatus">
          <el-button class="min-w-36 min-h-11" type="primary" @click="postReturnRequest(3)">{{
            t('formDemo.saveAndPending')
          }}</el-button>
          <el-button class="min-w-36 min-h-11" @click="close">{{ t('reuse.exit') }}</el-button>
        </div>
        <div
          v-else-if="(statusApprovalExpand == STATUS_ORDER_RENTAL[4].orderStatus || 
          statusApproval == STATUS_ORDER_DEPOSIT[5].orderStatus) && !props?.cancelExpend">
          <el-button class="min-w-42 min-h-11" type="warning" @click="donePaymentRequest(120)"
            >{{ t('formDemo.completeReturn') }}</el-button
          >
          <el-button class="min-w-36 min-h-11" @click="close">{{ t('reuse.exit') }}</el-button>
        </div>
      </div>
    </template>
  </el-dialog>

  <!-- 3.Trả hàng hết hạn -->
  <el-dialog
    :model-Value="modelValue"
    v-if="orderStatusType == 4"
    @open="open"
    @close="close"
    :title="t('reuse.informationReturnAfterDueDate')"
    width="40%"
    align-center
  >
    <div>
      <el-divider />
      <div class="flex items-center">
        <span class="w-[25%] text-base font-bold">{{ t('formDemo.orderInformation') }}</span>
        <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
      </div>
      <div class="flex pt-2 pb-2 gap-3">
        <div class="flex-1">
          <div class="flex gap-4">
            <label class="w-[40%] text-right">{{ t('formDemo.orderCode') }}</label>
            <div class="w-[60%] text-xl text-black font-bold dark:text-light-50">{{
              orderData?.orderCode
            }}</div>
          </div>
          <div class="flex gap-4" v-if="type == 2">
            <label class="w-[40%] text-right">{{ t('reuse.rentalTerm') }}</label>
            <div class="w-[60%] text-black dark:text-light-50">{{
              orderData?.leaseTerm == '1'
                ? 'Theo ngày'
                : orderData?.leaseTerm == '7'
                ? 'Theo tuần'
                : 'Theo tháng'
            }}</div>
          </div>
          <div class="flex gap-4" v-if="type == 2">
            <label class="w-[40%] text-right">{{ t('formDemo.rentalPeriod') }}</label>
            <div class="w-[60%] text-black dark:text-light-50"
              >{{ dateTimeFormat(orderData?.period[0]) }} đến
              {{ dateTimeFormat(orderData?.period[1]) }}</div
            >
          </div>
          <div class="flex gap-4" v-if="type == 3">
            <label class="w-[40%] text-right">{{ t('reuse.depositPeriod') }}</label>
            <div class="w-[60%] text-black dark:text-light-50"
              >{{ dateTimeFormat(orderData?.period[0]) }} đến
              {{ dateTimeFormat(orderData?.period[1]) }}</div
            >
          </div>
        </div>

        <div class="flex-1 flex items-start gap-4">
          <span>
            <div>Mã QR đơn hàng</div>
          </span>

          <span class="border"><Qrcode :width="100" :text="orderData?.orderCode" /></span>
        </div>
      </div>
      <div class="flex items-center">
        <span class="w-[25%] text-base font-bold">{{ t('reuse.customerInfo') }}</span>
        <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
      </div>
      <div>
        <div class="flex gap-4 items-center">
          <label class="w-[30%] text-right">{{ t('reuse.customerName') }}</label>
          <div class="w-[100%] text-black dark:text-light-50">{{ orderData?.name }}</div>
        </div>
        <div class="flex gap-4 items-center">
          <label class="w-[30%] text-right">{{ t('formDemo.address') }}</label>
          <div class="w-[100%] text-black dark:text-light-50">{{ orderData?.customerAddress }}</div>
        </div>
        <div class="flex gap-4 items-center">
          <label class="w-[30%] text-right">{{ t('reuse.phoneNumber') }}</label>
          <div class="w-[100%] text-black dark:text-light-50">{{ orderData?.phone }}</div>
        </div>
        <div class="flex gap-4 pb-4 items-center">
          <label class="w-[30%] text-right">{{ t('formDemo.returnReason') }}</label>
          <div class="w-[100%] text-black dark:text-light-50">Trả hàng hết hạn</div>
        </div>
      </div>
      <div class="flex items-center">
        <span class="w-[30%] text-base font-bold break-w" v-if="type == 2">{{
          t('formDemo.fullyIntegrated')
        }}</span>
        <span class="w-[30%] text-base font-bold break-w" v-if="type == 3">{{
          t('reuse.informationReturnExportProduct')
        }}</span>

        <span class="block h-1 w-[70%] border-t-1 dark:border-[#4c4d4f]"></span>
      </div>
    </div>
    <div class="pt-2 pb-2">
      <el-table :data="orderData?.tableData" border style="width: 100%" fit>
        <el-table-column label="STT" type="index" width="60" align="center" />
        <el-table-column
          prop="productPropertyName"
          :label="t('formDemo.commodityName')"
          width="260"
        />
        <el-table-column prop="accessory" :label="t('reuse.accessory')" />
        <el-table-column prop="quantity" :label="t('reuse.quantity')" />
        <el-table-column prop="conditionProducts" :label="t('reuse.conditionProducts')">
          <template #default="scope">
            <el-input v-model="scope.row.conditionProducts" />
          </template>
        </el-table-column>
      </el-table>
      <div class="flex items-center">
        <span class="w-[15%] text-base font-bold">{{ t('reuse.status') }}</span>
        <span class="block h-1 w-[85%] border-t-1 dark:border-[#4c4d4f]"></span>
      </div>
      <div class="flex gap-4 pb-2 items-center">
        <label class="w-[30%] text-right">{{ t('reuse.status') }}</label>
        <div class="flex items-center w-[100%]">
          <span
            class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-neutral-900 dark:bg-transparent"
          ></span>
          <span class="box dark:text-black active">
            {{ t('reuse.initializeAndWrite') }}
            <span class="triangle-right"> </span>
          </span>
        </div>
      </div>
      <div class="flex gap-4 pb-2 items-center">
        <label class="w-[30%] text-right !text-transparent">sss</label>
        <div class="flex items-center w-[100%]">
          <div >{{ dateTimeFormat(new Date()) }}</div>          
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end">
        <div>
          <el-button type="primary" @click="postReturnRequest(4)" class="min-w-42 min-h-11"
            >Lưu & ghi phiếu xuất trả</el-button
          >
          <el-button @click="close" class="min-w-30 min-h-11">{{ t('reuse.exit') }}</el-button>
        </div>
      </div>
    </template>
  </el-dialog>
  <!-- 4:chuộc hàng trước thời hạn -->
  <el-dialog
    :model-Value="modelValue"
    v-if="orderStatusType == 5"
    @open="open"
    @close="close"
    class="font-bold"
    :title="t('reuse.informationRansomBeforeDueDate')"
    width="40%"
    align-center
  >
    <div>
      <el-divider />
      <div class="flex items-center">
        <span class="w-[25%] text-base font-bold">{{ t('formDemo.orderInformation') }}</span>
        <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
      </div>
      <div class="flex pt-2 pb-2 items-center">
        <div class="flex-1">
          <div class="flex gap-4">
            <label class="w-[40%] text-right">{{ t('formDemo.orderCode') }}</label>
            <div class="w-[60%] text-xl text-black font-bold dark:text-light-50">{{
              orderData?.orderCode
            }}</div>
          </div>
        </div>

        <div class="flex-1"> QRCode </div>
      </div>
      <div class="flex items-center">
        <span class="w-[25%] text-base font-bold">{{ t('reuse.customerInfo') }}</span>
        <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
      </div>
      <div>
        <div class="flex gap-4 items-center">
          <label class="w-[30%] text-right">{{ t('reuse.customerName') }}</label>
          <div class="w-[100%] text-black dark:text-light-50">{{ orderData?.name }}</div>
        </div>
        <div class="flex gap-4 items-center">
          <label class="w-[30%] text-right">{{ t('formDemo.address') }}</label>
          <div class="w-[100%] text-black dark:text-light-50">{{ orderData?.customerAddress }}</div>
        </div>
        <div class="flex gap-4 items-center">
          <label class="w-[30%] text-right">{{ t('reuse.phoneNumber') }}</label>
          <div class="w-[100%] text-black dark:text-light-50">{{ orderData?.phone }}</div>
        </div>
        <div class="flex gap-4 pb-4 items-center">
          <label class="w-[30%] text-right">{{ t('formDemo.ReasonExchangeReturn') }}</label>
          <div class="w-[100%] text-black dark:text-light-50">Chuộc hàng trước hạn</div>
        </div>
      </div>
      <div class="flex items-center">
        <span class="w-[30%] text-base font-bold break-w">{{
          t('reuse.informationReturnExportProduct')
        }}</span>
        <span class="block h-1 w-[70%] border-t-1 dark:border-[#4c4d4f]"></span>
      </div>
    </div>
    <div class="pt-2 pb-2">
      <el-table :data="orderData?.tableData" border style="width: 100%" fit>
        <el-table-column label="STT" type="index" width="60" align="center" />
        <el-table-column prop="productPropertyName" :label="t('formDemo.commodityName')">
          <template #default="scope">
            <MultipleOptionsBox
              :defaultValue="scope.row.productPropertyId"
              :fields="[
                t('reuse.productCode'),
                t('reuse.managementCode'),
                t('formDemo.productInformation')
              ]"
              filterable
              :items="listProductsTable"
              valueKey="productPropertyId"
              labelKey="name"
              :hiddenKey="['id']"
              :placeHolder="'Chọn mã sản phẩm'"
              :clearable="false"
              @update-value="(value, obj) => updateValue(value, obj, scope)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="accessory" :label="t('reuse.accessory')">
          <template #default="scope">
            <el-input v-model="scope.row.accessory" />
          </template>
        </el-table-column>
        <el-table-column prop="quantity" :label="t('reuse.quantity')">
          <template #default="scope">
            <el-input v-model="scope.row.quantity" type="number" :min="0" :max="scope.row.quantity" />
          </template>
        </el-table-column>
        <el-table-column prop="hirePrice" :label="t('reuse.conditionProducts')">
          <template #default="scope">
            <el-input v-model="scope.row.hirePrice" />
          </template>
        </el-table-column>
        <el-table-column prop="operator" :label="t('reuse.operator')">
          <template #default="scope">
            <el-button type="danger" @click="removeRow(scope)">{{ t('reuse.delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="flex items-center">
        <span class="w-[25%] text-base font-bold">{{ t('reuse.status') }}</span>
        <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
      </div>
      <div class="flex gap-4 pb-2 items-center">
        <label class="w-[30%] text-right">{{ t('reuse.status') }}</label>
        <div class="flex items-center w-[100%]">
          <span
            class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-neutral-900 dark:bg-transparent"
          ></span>
          <span class="box dark:text-black active">
            {{ t('reuse.initializeAndWrite') }}
            <span class="triangle-right"> </span>
          </span>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end">
        <div>
          <el-button type="primary" @click="postReturnRequest">{{
            t('formDemo.saveAndPending')
          }}</el-button>
          <el-button @click="close">{{ t('reuse.exit') }}</el-button>
        </div>
      </div>
    </template>
  </el-dialog>
  <!-- 5.chuộc hàng trước hết hạn -->
  <el-dialog
    :model-Value="modelValue"
    v-if="orderStatusType == 5"
    @open="open"
    @close="close"
    class="font-bold"
    :title="t('reuse.informationRansomBeforeDueDate')"
    width="40%"
    align-center
  >
    <div>
      <el-divider />
      <div class="flex items-center">
        <span class="w-[25%] text-base font-bold">{{ t('formDemo.orderInformation') }}</span>
        <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
      </div>
      <div class="flex pt-2 pb-2 items-center">
        <div class="flex-1">
          <div class="flex gap-4">
            <label class="w-[40%] text-right">{{ t('formDemo.orderCode') }}</label>
            <div class="w-[60%] text-xl text-black font-bold dark:text-light-50">{{
              orderData?.orderCode
            }}</div>
          </div>
        </div>

        <div class="flex-1"> QRCode </div>
      </div>
      <div class="flex items-center">
        <span class="w-[25%] text-base font-bold">{{ t('reuse.customerInfo') }}</span>
        <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
      </div>
      <div>
        <div class="flex gap-4 items-center">
          <label class="w-[30%] text-right">{{ t('reuse.customerName') }}</label>
          <div class="w-[100%] text-black dark:text-light-50">{{ orderData?.name }}</div>
        </div>
        <div class="flex gap-4 items-center">
          <label class="w-[30%] text-right">{{ t('formDemo.address') }}</label>
          <div class="w-[100%] text-black dark:text-light-50">{{ orderData?.customerAddress }}</div>
        </div>
        <div class="flex gap-4 pb-4 items-center">
          <label class="w-[30%] text-right">{{ t('reuse.phoneNumber') }}</label>
          <div class="w-[100%] text-black dark:text-light-50">{{ orderData?.phone }}</div>
        </div>
        <div class="flex gap-4 pt-2 pb-2 items-center">
          <label class="w-[30%] text-right">{{ t('formDemo.ReasonExchangeReturn') }}</label>
          <div class="w-[100%] text-black dark:text-light-50">Chuộc hàng hết hạn</div>
        </div>
      </div>
      <div class="flex items-center">
        <span class="w-[30%] text-base font-bold break-w">{{
          t('reuse.informationReturnExportProduct')
        }}</span>
        <span class="block h-1 w-[70%] border-t-1 dark:border-[#4c4d4f]"></span>
      </div>
    </div>
    <div class="pt-2 pb-2">
      <el-table :data="orderData?.tableData" border style="width: 100%" fit>
        <el-table-column label="STT" type="index" width="60" align="center" />
        <el-table-column prop="productPropertyName" :label="t('formDemo.commodityName')">
          <template #default="scope">
            <MultipleOptionsBox
              :defaultValue="scope.row.productPropertyId"
              :fields="[
                t('reuse.productCode'),
                t('reuse.managementCode'),
                t('formDemo.productInformation')
              ]"
              filterable
              :items="listProductsTable"
              valueKey="productPropertyId"
              labelKey="name"
              :hiddenKey="['id']"
              :placeHolder="'Chọn mã sản phẩm'"
              :clearable="false"
              @update-value="(value, obj) => updateValue(value, obj, scope)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="accessory" :label="t('reuse.accessory')">
          <template #default="scope">
            <el-input v-model="scope.row.accessory" />
          </template>
        </el-table-column>
        <el-table-column prop="quantity" :label="t('reuse.quantity')">
          <template #default="scope">
            <el-input v-model="scope.row.quantity" type="number" :min="0" :max="scope.row.quantity" />
          </template>
        </el-table-column>
        <el-table-column prop="hirePrice" :label="t('reuse.conditionProducts')">
          <template #default="scope">
            <el-input v-model="scope.row.hirePrice" />
          </template>
        </el-table-column>
      </el-table>
      <div class="flex items-center">
        <span class="w-[25%] text-base font-bold">{{ t('reuse.status') }}</span>
        <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
      </div>
      <div class="flex gap-4 pb-2 items-center">
        <label class="w-[30%] text-right">{{ t('reuse.status') }}</label>
        <div class="flex items-center w-[100%]">
          <span
            class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-neutral-900 dark:bg-transparent"
          ></span>
          <span class="box dark:text-black">
            {{ t('reuse.initializeAndWrite') }}
            <span class="triangle-right"> </span>
          </span>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end">
        <div>
          <el-button type="primary" @click="postReturnRequest">{{
            t('formDemo.saveAndPending')
          }}</el-button>
          <el-button @click="close">{{ t('reuse.exit') }}</el-button>
        </div>
      </div>
    </template>
  </el-dialog>
  <!--  6.Đứt hàng -->
  <el-dialog
    :model-Value="modelValue"
    v-if="orderStatusType == 6"
    @open="open"
    @close="close"
    class="font-bold"
    title="Thông tin chuộc hàng trước hạn"
    width="40%"
    align-center
  >
    <div>
      <el-divider />
      <div class="flex items-center">
        <span class="w-[25%] text-base font-bold">{{ t('formDemo.orderInformation') }}</span>
        <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
      </div>
      <div class="flex pt-2 pb-2 items-center">
        <div class="flex-1">
          <div class="flex gap-4">
            <label class="w-[40%] text-right">{{ t('formDemo.orderCode') }}</label>
            <div class="w-[60%] text-xl text-black font-bold dark:text-light-50">{{
              orderData?.orderCode
            }}</div>
          </div>
        </div>

        <div class="flex-1"> QRCode </div>
      </div>
      <div class="flex items-center">
        <span class="w-[25%] text-base font-bold">{{ t('reuse.customerInfo') }}</span>
        <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
      </div>
      <div>
        <div class="flex gap-4 items-center">
          <label class="w-[30%] text-right">{{ t('reuse.customerName') }}</label>
          <div class="w-[100%] text-black dark:text-light-50">{{ orderData?.name }}</div>
        </div>
        <div class="flex gap-4 items-center">
          <label class="w-[30%] text-right">{{ t('formDemo.address') }}</label>
          <div class="w-[100%] text-black dark:text-light-50">{{ orderData?.customerAddress }}</div>
        </div>
        <div class="flex gap-4 items-center">
          <label class="w-[30%] text-right">{{ t('reuse.phoneNumber') }}</label>
          <div class="w-[100%] text-black dark:text-light-50">{{ orderData?.phone }}</div>
        </div>
        <div class="flex gap-4 pb-4 items-center">
          <label class="w-[30%] text-right">{{ t('formDemo.ReasonExchangeReturn') }}</label>
          <div class="w-[100%] text-black dark:text-light-50">Đứt hàng</div>
        </div>
      </div>
      <div class="flex items-center">
        <span class="w-[30%] text-base font-bold break-w">{{
          t('reuse.informationReturnExportProduct')
        }}</span>
        <span class="block h-1 w-[70%] border-t-1 dark:border-[#4c4d4f]"></span>
      </div>
    </div>
    <div class="pt-2 pb-2">
      <el-table :data="orderData?.tableData" border style="width: 100%" fit>
        <el-table-column label="STT" type="index" width="60" align="center" />
        <el-table-column prop="productPropertyName" :label="t('formDemo.commodityName')">
          <template #default="scope">
            <MultipleOptionsBox
              :defaultValue="scope.row.productPropertyId"
              :fields="[
                t('reuse.productCode'),
                t('reuse.managementCode'),
                t('formDemo.productInformation')
              ]"
              filterable
              :items="listProductsTable"
              valueKey="productPropertyId"
              labelKey="name"
              :hiddenKey="['id']"
              :placeHolder="'Chọn mã sản phẩm'"
              :clearable="false"
              @update-value="(value, obj) => updateValue(value, obj, scope)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="accessory" :label="t('reuse.accessory')">
          <template #default="scope">
            <el-input v-model="scope.row.accessory" />
          </template>
        </el-table-column>
        <el-table-column prop="quantity" :label="t('reuse.quantity')">
          <template #default="scope">
            <el-input v-model="scope.row.quantity" type="number" :min="0" :max="scope.row.quantity" />
          </template>
        </el-table-column>
        <el-table-column prop="hirePrice" :label="t('reuse.conditionProducts')">
          <template #default="scope">
            <el-input v-model="scope.row.hirePrice" />
          </template>
        </el-table-column>
        <el-table-column prop="operator" :label="t('reuse.operator')">
          <template #default="scope">
            <el-button type="danger" @click="removeRow(scope)">{{ t('reuse.delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="flex items-center">
        <span class="w-[25%] text-base font-bold">{{ t('reuse.status') }}</span>
        <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
      </div>
      <div class="flex gap-4 pb-2 items-center">
        <label class="w-[30%] text-right">{{ t('reuse.status') }}</label>
        <div class="flex items-center w-[100%]">
          <span
            class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-neutral-900 dark:bg-transparent"
          ></span>
          <span class="box dark:text-black">
            {{ t('reuse.initializeAndWrite') }}
            <span class="triangle-right"> </span>
          </span>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end">
        <div>
          <el-button type="primary" @click="postReturnRequest">{{
            t('formDemo.saveAndPending')
          }}</el-button>
          <el-button @click="close">{{ t('reuse.exit') }}</el-button>
        </div>
      </div>
    </template>
  </el-dialog>
  <!--  7.Gia hạn cầm đồ -->
  <el-dialog
    :model-Value="modelValue"
    v-if="orderStatusType == 7"
    @open="open"
    @close="close"
    class="font-bold"
    title="Thông tin chuộc hàng trước hạn"
    width="40%"
    align-center
  >
    <div>
      <el-divider />
      <div class="flex items-center">
        <span class="w-[25%] text-base font-bold">{{ t('formDemo.orderInformation') }}</span>
        <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
      </div>
      <div class="flex pt-2 pb-2 items-center">
        <div class="flex-1">
          <div class="flex gap-4 pt-2 pb-2">
            <label class="w-[40%] text-right">{{ t('formDemo.orderCode') }}</label>
            <div class="w-[60%] text-xl text-black font-bold dark:text-light-50">{{
              orderData?.orderCode
            }}</div>
          </div>
          <div class="flex gap-4 pt-2 pb-2">
            <label class="w-[40%] text-right">{{ t('reuse.pawnPeriod') }}</label>
            <div class="w-[60%] text-black dark:text-light-50"
              >{{ dateTimeFormat(orderData?.period[0]) }} đến
              {{ dateTimeFormat(orderData?.period[1]) }}</div
            >
          </div>
          <div class="flex gap-4 pt-2 pb-2">
            <label class="w-[40%] text-right">{{ t('reuse.extendPawn') }}</label>
            <div class="w-[60%] text-black dark:text-light-50">
              <ElDatePicker modelValue="extendDate" @change="extendDate" />
            </div>
          </div>
        </div>

        <div class="flex-1 pl-8"> QRCode </div>
      </div>
      <div class="flex items-center">
        <span class="w-[25%] text-base font-bold">{{ t('reuse.customerInfo') }}</span>
        <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
      </div>
      <div>
        <div class="flex gap-4 pt-2 pb-2 items-center">
          <label class="w-[30%] text-right">{{ t('reuse.customerName') }}</label>
          <div class="w-[100%] text-black dark:text-light-50">{{ orderData?.name }}</div>
        </div>
        <div class="flex gap-4 pt-2 pb-2 items-center">
          <label class="w-[30%] text-right">{{ t('formDemo.address') }}</label>
          <div class="w-[100%] text-black dark:text-light-50">{{ orderData?.customerAddress }}</div>
        </div>
        <div class="flex gap-4 pt-2 pb-2 items-center">
          <label class="w-[30%] text-right">{{ t('reuse.phoneNumber') }}</label>
          <div class="w-[100%] text-black dark:text-light-50">{{ orderData?.phone }}</div>
        </div>
        <div class="flex gap-4 pt-2 pb-2 items-center">
          <label class="w-[30%] text-right">{{ t('formDemo.ReasonExchangeReturn') }}</label>
          <div class="w-[100%] text-black dark:text-light-50">Trả hàng trước hạn</div>
        </div>
      </div>
      <div class="flex items-center">
        <span class="w-[30%] text-base font-bold break-w">Thông tin sản phẩm xuất trả</span>
        <span class="block h-1 w-[70%] border-t-1 dark:border-[#4c4d4f]"></span>
      </div>
    </div>
    <div class="pt-2 pb-2">
      <el-table :data="orderData?.tableData" border style="width: 100%" fit>
        <el-table-column label="STT" type="index" width="60" align="center" />
        <el-table-column prop="productPropertyName" :label="t('formDemo.commodityName')">
          <template #default="scope">
            <MultipleOptionsBox
              :defaultValue="scope.row.productPropertyId"
              :fields="[
                t('reuse.productCode'),
                t('reuse.managementCode'),
                t('formDemo.productInformation')
              ]"
              filterable
              :items="listProductsTable"
              valueKey="productPropertyId"
              labelKey="name"
              :hiddenKey="['id']"
              :placeHolder="'Chọn mã sản phẩm'"
              :clearable="false"
              @update-value="(value, obj) => updateValue(value, obj, scope)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="accessory" :label="t('reuse.accessory')">
          <template #default="scope">
            <el-input v-model="scope.row.accessory" />
          </template>
        </el-table-column>
        <el-table-column prop="quantity" :label="t('reuse.quantity')">
          <template #default="scope">
            <el-input-number v-model="scope.row.quantity" type="number" :min="0" :max="scope.row.quantity" />
          </template>
        </el-table-column>
        <el-table-column prop="hirePrice" :label="t('reuse.conditionProducts')">
          <template #default="scope">
            <el-input v-model="scope.row.hirePrice" />
          </template>
        </el-table-column>
      </el-table>
      <div class="flex items-center">
        <span class="w-[25%] text-base font-bold">{{ t('reuse.status') }}</span>
        <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
      </div>
      <div class="flex gap-4 pb-2 items-center">
        <label class="w-[30%] text-right">{{ t('reuse.status') }}</label>
        <div class="flex items-center w-[100%]">
          <span
            class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-neutral-900 dark:bg-transparent"
          ></span>
          <span class="box dark:text-black">
            {{ t('reuse.initializeAndWrite') }}
            <span class="triangle-right"> </span>
          </span>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end">
        <div>
          <el-button type="primary" @click="postReturnRequest">{{
            t('formDemo.saveAndPending')
          }}</el-button>
          <el-button @click="close">{{ t('reuse.exit') }}</el-button>
        </div>
      </div>
    </template>
  </el-dialog>
  <!--  9.Gia hạn ký gửi-->
  <el-dialog
    :model-Value="modelValue"
    v-if="orderStatusType == 9"
    @open="open"
    @close="close"
    title="Thông tin gia hạn ký gửi"
    width="40%"
    align-center
  >
    <div>
      <el-divider />
      <div class="flex items-center">
        <span class="w-[25%] text-base font-bold">{{ t('formDemo.orderInformation') }}</span>
        <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
      </div>
      <div class="flex gap-3 pt-2 pb-2 items-center">
        <div class="flex-1">
          <div class="flex gap-4 pt-2">
            <label class="w-[40%] text-right">{{ t('formDemo.orderCode') }}</label>
            <div class="w-[60%] text-xl text-black font-bold dark:text-light-50">{{
              orderData?.orderCode
            }}</div>
          </div>
          <div class="flex gap-4 pt-2 pb-2">
            <label class="w-[40%] text-right">{{ t('reuse.pawnPeriod') }}</label>
            <div class="w-[60%] text-black dark:text-light-50"
              >{{ dateTimeFormat(orderData?.period[0]) }} đến
              {{ dateTimeFormat(orderData?.period[1]) }}</div
            >
          </div>
          <div class="flex gap-4 pt-2 pb-2">
            <label class="w-[40%] text-right">Gia hạn ký gửi đến</label>
            <div class="w-[60%] text-black dark:text-light-50">
              <ElDatePicker modelValue="extendDate" @change="extendDate" />
            </div>
          </div>
        </div>

        <div class="flex-1 flex items-start gap-4">
          <span>
            <div>Mã QR đơn hàng</div>
          </span>

          <span class="border"><Qrcode :width="100" :text="orderData?.orderCode" /></span>
        </div>
      </div>
      <div class="flex items-center">
        <span class="w-[25%] text-base font-bold">{{ t('reuse.customerInfo') }}</span>
        <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
      </div>
      <div>
        <div class="flex gap-4 mt-2 pt-2 pb-2 items-center">
          <label class="w-[30%] text-right">{{ t('reuse.customerName') }}</label>
          <div class="w-[100%] text-black dark:text-light-50">{{ orderData?.name }}</div>
        </div>
        <div class="flex gap-4 pt-2 pb-2 items-center">
          <label class="w-[30%] text-right">{{ t('formDemo.address') }}</label>
          <div class="w-[100%] text-black dark:text-light-50">{{ orderData?.customerAddress }}</div>
        </div>
        <div class="flex gap-4 pt-2 pb-2 items-center">
          <label class="w-[30%] text-right">{{ t('reuse.phoneNumber') }}</label>
          <div class="w-[100%] text-black dark:text-light-50">{{ orderData?.phone }}</div>
        </div>
      </div>
    </div>
    <!-- sản phẩm gia hạn -->
    <div class="flex items-center">
      <span class="w-[31%] text-base font-bold break-w">Thông tin sản phẩm gia hạn</span>
      <span class="block h-1 w-[69%] border-t-1 dark:border-[#4c4d4f]"></span>
    </div>
    <div class="pt-2 pb-2">
      <el-table :data="orderData?.tableData" border style="width: 100%" fit>
        <el-table-column label="STT" type="index" width="60" align="center" />
        <el-table-column
          prop="productPropertyName"
          :label="t('formDemo.commodityName')"
          width="400"
        >
          <template #default="scope">
            {{ scope.row.productPropertyName }}
          </template>
        </el-table-column>
        <el-table-column prop="accessory" :label="t('reuse.accessory')" width="130">
          <template #default="scope">
            {{ scope.row.accessory }}
          </template>
        </el-table-column>
        <el-table-column prop="quantity" :label="t('reuse.quantity')">
          <template #default="scope">
            {{ scope.row.quantity }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="flex items-center">
      <span class="w-[30%] text-base font-bold break-w">Thông tin sản phẩm xuất trả</span>
      <span class="block h-1 w-[70%] border-t-1 dark:border-[#4c4d4f]"></span>
    </div>
    <div class="pt-2 pb-2">
      <el-table :data="orderData?.tableData" border style="width: 100%" fit>
        <el-table-column label="STT" type="index" width="60" align="center" />
        <el-table-column
          prop="productPropertyName"
          width="250"
          :label="t('formDemo.commodityName')"
        >
          <template #default="scope">
            <MultipleOptionsBox
              :defaultValue="scope.row.productPropertyId"
              :fields="[
                t('reuse.productCode'),
                t('reuse.managementCode'),
                t('formDemo.productInformation')
              ]"
              filterable
              :items="listProductsTable"
              valueKey="productPropertyId"
              labelKey="name"
              :hiddenKey="['id']"
              :placeHolder="'Chọn mã sản phẩm'"
              :clearable="false"
              @update-value="(value, obj) => updateValue(value, obj, scope)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="accessory" :label="t('reuse.accessory')">
          <template #default="scope">
            <el-input v-model="scope.row.accessory" />
          </template>
        </el-table-column>
        <el-table-column prop="quantity" :label="t('reuse.quantity')">
          <template #default="scope">
            <el-input v-model="scope.row.quantity" type="number" :min="0" :max="scope.row.quantity" />
          </template>
        </el-table-column>
        <el-table-column prop="hirePrice" :label="t('reuse.conditionProducts')">
          <template #default="scope">
            <el-input v-model="scope.row.hirePrice" />
          </template>
        </el-table-column>
      </el-table>
      <div class="flex items-center">
        <span class="w-[25%] text-base font-bold">{{ t('reuse.status') }}</span>
        <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
      </div>
      <div class="flex gap-4 pb-2 items-center">
        <label class="w-[30%] text-right">{{ t('reuse.status') }}</label>
        <div class="flex items-center w-[100%]">
          <span
            class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-neutral-900 dark:bg-transparent"
          ></span>
          <span class="box dark:text-black">
            {{ t('reuse.initializeAndWrite') }}
            <span class="triangle-right"> </span>
          </span>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end">
        <div>
          <el-button type="primary" class="min-w-42 min-h-11" @click="postReturnRequest(9)"
            >Gia hạn thuê & ghi phiếu xuất trả</el-button
          >
          <el-button @click="close" class="min-w-30 min-h-11">{{ t('reuse.exit') }}</el-button>
        </div>
      </div>
    </template>
  </el-dialog>
  <!-- 8,Trả hàng Spa -->
  <el-dialog
    width="45%"
    align-center
    :model-Value="modelValue"
    v-if="orderStatusType == 8"
    @open="open"
    @close="close"
    title="Thông tin phiếu trả hàng Spa"
  >
    <div>
      <el-divider />
      <div class="flex items-center">
        <span class="w-[25%] text-base font-bold">{{ t('formDemo.orderInformation') }}</span>
        <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
      </div>
      <div class="flex gap-4 pt-4 pb-4 items-center">
        <label class="w-[30%] text-right">{{ t('formDemo.orderCode') }}</label>
        <div class="w-[100%] text-xl">{{ orderData?.orderCode }}</div>
      </div>
      <div class="flex items-center">
        <span class="w-[25%] text-base font-bold">{{ t('reuse.customerInfo') }}</span>
        <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
      </div>
      <div>
        <div class="flex gap-4 items-center">
          <label class="w-[30%] text-right">{{ t('reuse.customerName') }}</label>
          <div class="w-[100%]">{{ orderData?.name }}</div>
        </div>
        <div class="flex gap-4 items-center">
          <label class="w-[30%] text-right">{{ t('formDemo.address') }}</label>
          <div class="w-[100%]">{{ orderData?.customerAddress }}</div>
        </div>
        <div class="flex gap-4 items-center">
          <label class="w-[30%] text-right">{{ t('reuse.phoneNumber') }}</label>
          <div class="w-[100%]">{{ orderData?.phone }}</div>
        </div>
      </div>
    </div>
    <div class="flex items-center">
      <span class="w-[35%] text-base font-bold break-w">{{ t('formDemo.fullyIntegrated') }}</span>
      <span class="block h-1 w-[65%] border-t-1 dark:border-[#4c4d4f]"></span>
    </div>
    <div class="pt-2 pb-2">
      <el-table ref="singleTableRef" :data="orderData?.tableData" border style="width: 100%">
        <el-table-column label="STT" type="index" width="60" align="center" />
        <el-table-column prop="productPropertyId" :label="t('formDemo.commodityName')" width="280">
          <template #default="scope">
            <MultipleOptionsBox
              :defaultValue="scope.row.productPropertyId"
              :fields="[
                t('reuse.productCode'),
                t('reuse.managementCode'),
                t('formDemo.productInformation')
              ]"
              filterable
              :items="listProductsTable"
              valueKey="productPropertyId"
              labelKey="name"
              :hiddenKey="['id']"
              :placeHolder="'Chọn mã sản phẩm'"
              :clearable="false"
              @update-value="(value, obj) => updateValue(value, obj, scope)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="accessory" :label="t('reuse.accessory')" width="150">
          <template #default="scope">
            <el-input v-model="scope.row.accessory" class="text-right" />
          </template>
        </el-table-column>
        <el-table-column prop="accessory" :label="t('router.ServiceLibrarySpaService')">
          <template #default="scope">
            <div class="limit-text">
              <span v-for="item in scope.row.spaServices" :key="item.id">{{ item.name }} </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="type" :label="t('reuse.type')">
          <template #default="scope">
            {{ scope.row.type }}
          </template>
        </el-table-column>
        <el-table-column prop="quantity" :label="t('reuse.quantityReturn')" width="90">
          <template #default="scope">
            <el-input v-model="scope.row.quantity" type="number" :max=scope.row.returnedQuantity :min="0" />
          </template>
        </el-table-column>
        <el-table-column
          prop="conditionProducts"
          :label="t('formDemo.conditionProducts')"
          width="130"
        >
        <template #default="scope">
          <el-select v-model="scope.row.isSpa">
            <el-option
              v-for="item in optionsTinhTrang"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="flex items-center">
      <span class="w-[25%] text-base font-bold">{{ t('reuse.status') }}</span>
      <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
    </div>
    <div class="flex gap-4 pb-2 items-center">
      <label class="w-[30%] text-right">{{ t('reuse.status') }}</label>
      <div class="flex items-center w-[100%]">
        <span
          class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-neutral-900 dark:bg-transparent"
        ></span>
        <span class="box dark:text-black">
          {{ t('reuse.initializeAndWrite') }}
          <span class="triangle-right"> </span>
        </span>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end">
        <div>
          <el-button type="primary" class="min-w-42 min-h-11" @click="postReturnRequestSpa(8)"
            >Lưu & ghi phiếu trả hàng</el-button
          >
          <el-button @click="close" class="min-w-30 min-h-11">{{ t('reuse.exit') }}</el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<style scope>
.limit-text {
  display: -webkit-box;
  max-height: 3.2rem;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  -webkit-line-clamp: 2;
  line-height: 1.6rem;
}
.active {
  opacity: 1 !important;
}
.box {
  padding: 0 10px 0 20px;
  position: relative;
  display: flex;
  width: fit-content;
  align-items: center;
  border: 1px solid #ccc;
  background-color: #ccc;
  opacity: 0.6;
}
.box_1 {
  border: 1px solid #fff0d9!important;
  background-color: #fff0d9!important;
}

.box_2 {
  border: 1px solid #f4f8fd;
  background-color: #f4f8fd;
}

.box_3 {
  border: 1px solid #d9d9d9;
  background-color: #d9d9d9;
}

.box_4 {
  border: 1px solid #fce5e1;
  background-color: #fce5e1;
}

.right_1 {
  border-left: 11px solid #fff0d9 !important;
}
.right_2 {
  border-left: 11px solid #f4f8fd !important;
}

.right_3 {
  border-left: 11px solid #d9d9d9 !important;
}

.right_4 {
  border-left: 11px solid #fce5e1 !important;
}

.triangle-left {
  position: absolute;
  z-index: 1998;
  width: 0;
  height: 0;
}
.triangle-right {
  position: absolute;
  right: -12px;
  width: 0;
  height: 0;
  border-top: 13px solid transparent;
  border-bottom: 12px solid transparent;
  border-left: 11px solid #ccc;
}
</style>
