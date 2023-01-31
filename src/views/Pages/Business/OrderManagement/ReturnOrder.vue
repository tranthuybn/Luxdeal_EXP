<script setup lang="ts">
import {
  ElDivider,
  ElDialog,
  ElTable,
  ElTableColumn,
  ElButton,
  ElInput,
  ElDatePicker,
  ElSelect,
  ElOption
} from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { dateTimeFormat } from '@/utils/format'
import Qrcode from '@/components/Qrcode/src/Qrcode.vue'
import MultipleOptionsBox from '@/components/MultipleOptionsBox.vue'
import { ref } from 'vue'

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
  'remove-row'
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
  console.log('data', props.orderId, props.orderData)
  emit('post-return-request', orderStatusType)
  emit('update:modelValue', false)
}

const donePaymentRequest = async (orderStatusType) => {
  console.log('data', props.orderId, props.orderData)
  emit('post-return-request', orderStatusType)
  emit('update:modelValue', false)
}

const disableCheck = ref(false)

const extendDate = (data) => {
  emit('extend-date', data)
}
const removeRow = (scope) => {
  if (props.orderData.tableData.length < 2) {
    return
  }
  emit('remove-row', scope.$index)
}
console.log('listProductsTable', props.listProductsTable)
</script>
<template>
  <!-- 2:Trả hàng trước hạn -->
  <el-dialog
    :model-Value="modelValue"
    v-if="orderStatusType == 2"
    @open="open"
    @close="close"
    class="font-bold"
    :title="t('formDemo.infoReturnAheadOfTime')"
    width="45%"
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
            <div>Mã QR đơn hàng</div>
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
      {{ orderData }}
      <el-table :data="orderData?.tableData" border style="width: 100%" fit>
        <el-table-column label="STT" type="index" width="60" align="center" />
        <el-table-column
          v-if="statusActive == 2"
          prop="productPropertyName"
          :label="t('formDemo.commodityName')"
          width="350"
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
              :disable="disableCheck"
              valueKey="productPropertyId"
              labelKey="name"
              :hiddenKey="['id']"
              :placeHolder="'Chọn mã sản phẩm'"
              :clearable="false"
              @update-value="(value, obj) => updateValue(value, obj, scope)"
            />
          </template>
        </el-table-column>
        <el-table-column
          v-if="statusActive == 3"
          prop="productPropertyName"
          :label="t('formDemo.commodityName')"
          width="350"
        >
          <template #default="scope">
            {{ scope.row.productPropertyName }}
          </template>
        </el-table-column>
        <el-table-column prop="accessory" :label="t('reuse.accessory')">
          <template #default="scope">
            <el-input v-if="statusActive == 2" v-model="scope.row.accessory" />
            <p v-else>{{ scope.row.accessory }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" :label="t('reuse.quantity')">
          <template #default="scope">
            <el-input
              v-if="statusActive == 2"
              v-model="scope.row.quantity"
              type="number"
              :max="scope.row.quantity"
            />
            <p v-else>{{ scope.row.quantity }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="hirePrice" :label="t('reuse.conditionProducts')">
          <template #default="scope">
            <el-input v-if="statusActive == 2" v-model="scope.row.hirePrice" />
            <p v-else>{{ scope.row.hirePrice }}</p>
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
          <div v-if="statusActive == 2" class="flex items-center gap-2 flex-wrap w-[100%]">
            <span class="box dark:text-black">
              {{ t('reuse.initializeAndWrite') }}
              <span class="triangle-right"> </span>
            </span>
            <span
              class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-neutral-900 dark:bg-transparent"
            ></span>
            <span class="box ml-2 text-yellow-500">
              Duyệt trả hàng trước hạn
              <span class="triangle-right"> </span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end">
        <div v-if="statusActive == 2">
          <el-button type="primary" class="min-w-42 min-h-11" @click="postReturnRequest(2)">{{
            t('formDemo.saveAndPending')
          }}</el-button>
          <el-button class="min-w-32 min-h-11" @click="close">{{ t('reuse.exit') }}</el-button>
        </div>
        <div v-if="statusActive == 3">
          <el-button class="min-w-42 min-h-11" type="warning" @click="donePaymentRequest(2)"
            >Hoàn thành trả hàng</el-button
          >
          <el-button class="min-w-32 min-h-11" @click="close">{{ t('reuse.exit') }}</el-button>
        </div>
      </div>
    </template>
  </el-dialog>
  <!-- 3.Trả hàng hết hạn -->
  <el-dialog
    :model-Value="modelValue"
    v-if="orderStatusType == 3"
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
          <el-button type="primary" @click="postReturnRequest(3)" class="min-w-42 min-h-11"
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
    v-if="orderStatusType == 4"
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
            <el-input v-model="scope.row.quantity" type="number" :max="scope.row.quantity" />
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
            <el-input v-model="scope.row.quantity" type="number" :max="scope.row.quantity" />
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
            <el-input v-model="scope.row.quantity" type="number" :max="scope.row.quantity" />
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
            <el-input v-model="scope.row.quantity" type="number" :max="scope.row.quantity" />
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
            <el-input v-model="scope.row.quantity" type="number" :max="scope.row.quantity" />
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
      {{ orderData?.tableData }}
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
            <el-input v-model="scope.row.quantity" type="number" :max=scope.row.quantity :min="0" />
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
          <el-button type="primary" class="min-w-42 min-h-11" @click="postReturnRequest(8)"
            >Lưu & ghi phiếu trả hàng</el-button
          >
          <el-button @click="close" class="min-w-30 min-h-11">{{ t('reuse.exit') }}</el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<style scope>
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
</style>
