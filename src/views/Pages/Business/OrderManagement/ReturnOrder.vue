<script setup lang="ts">
import {
  ElDivider,
  ElDialog,
  ElTable,
  ElTableColumn,
  ElButton,
  ElInput,
  ElDatePicker
} from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { dateTimeFormat } from '@/utils/format'
import MultipleOptionsBox from '@/components/MultipleOptionsBox.vue'

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
  }
})
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
const updateValue = (value, obj, scope) => {
  console.log(value, obj, scope)
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
console.log('orderData?', props.orderData)
const postReturnRequest = async (orderStatusType) => {
  emit('post-return-request', orderStatusType)
  emit('update:modelValue', false)
}
const extendDate = (data) => {
  emit('extend-date', data)
}
const removeRow = (scope) => {
  if (props.orderData.tableData.length < 2) {
    return
  }
  emit('remove-row', scope.$index)
}
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
          t('formDemo.productInformationExportChange')
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
            <el-input v-model="scope.row.quantity" type="number" />
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
  <!-- 3.Trả hàng hết hạn -->
  <el-dialog
    :model-Value="modelValue"
    v-if="orderStatusType == 3"
    @open="open"
    @close="close"
    class="font-bold"
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
          <label class="w-[30%] text-right">{{ t('formDemo.returnReason') }}</label>
          <div class="w-[100%] text-black dark:text-light-50">Trả hàng hết hạn</div>
        </div>
      </div>
      <div class="flex items-center">
        <span class="w-[30%] text-base font-bold break-w" v-if="type == 2">{{
          t('formDemo.fullyIntegrated')
        }}</span>
        <span class="w-[30%] text-base font-bold break-w" v-if="type == 3">{{
          t('formDemo.productInformationExportChange')
        }}</span>

        <span class="block h-1 w-[70%] border-t-1 dark:border-[#4c4d4f]"></span>
      </div>
    </div>
    <div class="pt-2 pb-2">
      <el-table :data="orderData?.tableData" border style="width: 100%" fit>
        <el-table-column label="STT" type="index" width="60" align="center" />
        <el-table-column prop="productPropertyName" :label="t('formDemo.commodityName')" />
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
          <el-button type="primary" @click="postReturnRequest">{{
            t('formDemo.saveAndPending')
          }}</el-button>
          <el-button @click="close">{{ t('reuse.exit') }}</el-button>
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
            <el-input v-model="scope.row.quantity" type="number" />
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
            <el-input v-model="scope.row.quantity" type="number" />
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
            <el-input v-model="scope.row.quantity" type="number" />
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
            <el-input v-model="scope.row.quantity" type="number" />
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
  <!--  9.Gia hạn cầm đồ -->
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
            <el-input v-model="scope.row.quantity" type="number" />
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
  <!-- Chưa có người xử lí dữ liệu trên bảng Spa... Ko có dữ liệu để tuyền ... Ko làm được -->
  <!-- <el-dialog
    width="40%"
    align-center
    :model-Value="modelValue"
    v-if="orderStatusType == 8"
    @open="open"
    @close="close"
    title="Thông tin chuộc hàng trước hạn"
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
        <el-table-column prop="accessory" :label="t('reuse.accessory')">
          <template #default="scope">
            <el-input v-model="scope.row.accessory" class="text-right" />
          </template>
        </el-table-column>
        <el-table-column prop="quantity" :label="t('reuse.quantity')" width="90">
          <template #default="scope">
            <el-input v-model="scope.row.quantity" type="number"/>
          </template>
        </el-table-column>
        <el-table-column prop="conditionProducts" :label="t('formDemo.conditionProducts')">
          <template #default="scope">
            <el-input v-model="scope.row.conditionProducts" />
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
  </el-dialog> -->
</template>
