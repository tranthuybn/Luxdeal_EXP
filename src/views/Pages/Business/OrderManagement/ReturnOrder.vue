<script setup lang="ts">
import { ElDivider, ElDialog, ElTable, ElTableColumn, ElButton, ElInput } from 'element-plus'
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
    6.Gia hạn
    */
    default: 0
  }
})
const emit = defineEmits(['update:modelValue', 'add-row', 'post-return-request', 'wait-approve'])
type Product = {
  productCode: string
  value: Number
  name: string
  price: Number
  productPropertyId: Number
  productPropertyCode: string
  hirePrice: Number
  finalPrice: Number
  depositePrice: Number
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
const postReturnRequest = async () => {
  emit('wait-approve')
  emit('update:modelValue', false)
}
</script>
<template>
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
      <div class="flex pt-4 pb-4 items-center">
        <div class="flex-1">
          <div class="flex gap-4">
            <label class="w-[40%] text-right">{{ t('formDemo.orderCode') }}</label>
            <div class="w-[60%] text-xl text-black font-bold dark:text-light-50">{{
              orderData?.orderCode
            }}</div>
          </div>
          <div class="flex gap-4">
            <label class="w-[40%] text-right">{{ t('reuse.rentalTerm') }}</label>
            <div class="w-[60%] text-black dark:text-light-50">{{
              orderData?.leaseTerm == '1'
                ? 'Theo ngày'
                : orderData?.leaseTerm == '7'
                ? 'Theo tuần'
                : 'Theo tháng'
            }}</div>
          </div>
          <div class="flex gap-4">
            <label class="w-[40%] text-right">{{ t('formDemo.rentalPeriod') }}</label>
            <div class="w-[60%] text-black dark:text-light-50"
              >{{ dateTimeFormat(orderData?.rentalPeriod[0]) }} đến
              {{ dateTimeFormat(orderData?.rentalPeriod[1]) }}</div
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
        <div class="flex gap-4 pb-4 items-center">
          <label class="w-[30%] text-right">{{ t('reuse.phoneNumber') }}</label>
          <div class="w-[100%] text-black dark:text-light-50">{{ orderData?.phone }}</div>
        </div>
      </div>
      <div class="flex items-center">
        <span class="w-[30%] text-base font-bold break-w">{{
          t('formDemo.rentalProductInformation')
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
            <el-input v-model="scope.row.quantity" />
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
  <el-dialog
    :model-Value="modelValue"
    v-if="orderStatusType == 3"
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
      <div class="flex pt-4 pb-4 items-center">
        <div class="flex-1">
          <div class="flex gap-4">
            <label class="w-[40%] text-right">{{ t('formDemo.orderCode') }}</label>
            <div class="w-[60%] text-xl text-black font-bold dark:text-light-50">{{
              orderData?.orderCode
            }}</div>
          </div>
          <div class="flex gap-4">
            <label class="w-[40%] text-right">{{ t('reuse.rentalTerm') }}</label>
            <div class="w-[60%] text-black dark:text-light-50">{{
              orderData?.leaseTerm == '1'
                ? 'Theo ngày'
                : orderData?.leaseTerm == '7'
                ? 'Theo tuần'
                : 'Theo tháng'
            }}</div>
          </div>
          <div class="flex gap-4">
            <label class="w-[40%] text-right">{{ t('formDemo.rentalPeriod') }}</label>
            <div class="w-[60%] text-black dark:text-light-50"
              >{{ dateTimeFormat(orderData?.rentalPeriod[0]) }} đến
              {{ dateTimeFormat(orderData?.rentalPeriod[1]) }}</div
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
        <div class="flex gap-4 pb-4 items-center">
          <label class="w-[30%] text-right">{{ t('reuse.phoneNumber') }}</label>
          <div class="w-[100%] text-black dark:text-light-50">{{ orderData?.phone }}</div>
        </div>
      </div>
      <div class="flex items-center">
        <span class="w-[30%] text-base font-bold break-w">{{
          t('formDemo.rentalProductInformation')
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
            <el-input v-model="scope.row.quantity" />
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
  <el-dialog
    :model-Value="modelValue"
    v-if="orderStatusType == 4"
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
      <div class="flex pt-4 pb-4 items-center">
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
        <div class="flex gap-4 pt-4 pb-4 items-center">
          <label class="w-[30%] text-right">{{ t('formDemo.ReasonExchangeReturn') }}</label>
          {{ orderData.inputReturnReason }}
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
            <el-input v-model="scope.row.quantity" />
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
  <el-dialog
    :model-Value="modelValue"
    v-if="orderStatusType == 5"
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
      <div class="flex pt-4 pb-4 items-center">
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
        <div class="flex gap-4 pt-4 pb-4 items-center">
          <label class="w-[30%] text-right">{{ t('formDemo.ReasonExchangeReturn') }}</label>
          {{ orderData.inputReturnReason }}
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
            <el-input v-model="scope.row.quantity" />
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
      <div class="flex pt-4 pb-4 items-center">
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
        <div class="flex gap-4 pt-4 pb-4 items-center">
          <label class="w-[30%] text-right">{{ t('formDemo.ReasonExchangeReturn') }}</label>
          {{ orderData.inputReturnReason }}
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
            <el-input v-model="scope.row.quantity" />
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
      <div class="flex pt-4 pb-4 items-center">
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
        <div class="flex gap-4 pt-4 pb-4 items-center">
          <label class="w-[30%] text-right">{{ t('formDemo.ReasonExchangeReturn') }}</label>
          {{ orderData.inputReturnReason }}
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
            <el-input v-model="scope.row.quantity" />
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
</template>
