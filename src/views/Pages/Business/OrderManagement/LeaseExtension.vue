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
  ElMessage
//   ElOption,
//   ElSelect
} from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { dateTimeFormat } from '@/utils/format'
import Qrcode from '@/components/Qrcode/src/Qrcode.vue'
import MultipleOptionsBox from '@/components/MultipleOptionsBox.vue'
import { onBeforeMount, reactive, ref, watch } from 'vue'
import { changeMoney } from '@/utils/tsxHelper'
import moment from 'moment'

const { t } = useI18n()
const doCloseOnClickModal = ref(false)
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

const emit = defineEmits([
  'update:modelValue',
  'post-return-request',
  'extend-date'
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

// Bật dialog
const open = () => {
  emit('update:modelValue', true)
}

// Tắt dialog và reset value
const close = () => {
  emit('update:modelValue', false)
  tableAheadOfTime.value?.splice(0, tableAheadOfTime.value.length)
  tableExpend.value.forEach((val) => {
    val.quantity = val.maximumQuantity
  })
  autoUpdatePrice()
  addRowTable()
}

// Hàm emit để xử lý trên component cha
const postReturnRequest = async (orderStatusType) => {
  if(orderStatusType == 5 && !rentExtensionValue.value){
    ElMessage.info(t('reuse.pleaseChooseDate'))
    return
  }
  emit('post-return-request', orderStatusType, tableAheadOfTime.value, rentExtensionValue.value, tableExpend.value)
  emit('update:modelValue', false)
}

// Tạo 1 bảng mới để xử lý tránh thay đổi dữ liệu gốc
const tableExpend = ref(props.orderData.tableData)
// Thêm 1 biến giới hạn số lượng sản phẩm cho bảng
tableExpend.value.forEach((val) => {
    val.maximumQuantity = val.quantity
})

interface tableReturnType {
  productPropertyId: number | undefined
  productPropertyName: string
  accessory: string
  quantity: number
  conditionProducts: string
  selected: boolean
}
const tableAheadOfTime = ref<Array<tableReturnType>>([])
const productForSale = reactive<tableReturnType>({
    productPropertyId: undefined,
    productPropertyName: '',
    accessory: '',
    quantity: 1,
    conditionProducts: '',
    selected: false
})

// Hàm thêm row table
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
  } else if (data.selected) {
    ElMessage.error('Không được thay đổi sản phẩm đã chọn, muốn thay đổi vui lòng tắt và bật lại dialog')
  } else if(!data.selected) {
      data.productPropertyId = obj?.productPropertyId
      data.productPropertyName = obj?.name
      data.maximumQuantity = obj?.maximumQuantity
      data.selected = true
      updateQuantityTableExpand(_value, 1)
  }
}

// Thay đổi số lượng ở bảng nhập hoàn tự động cập nhật lại số lượng ở bảng sản phẩm gia giạn
const updateQuantityTableExpand = (index, quantity) => {
    tableExpend.value.forEach((val) => {
        if (val.productPropertyId == index) {
            val.quantity = val?.maximumQuantity - quantity
            autoUpdatePrice()
        }
    })
}

// Tính lại tiền sau khi thay đổi số lượng
const autoUpdatePrice = () => {
    totalRentFee.value = tableExpend.value.reduce((total, cur) => {
        cur.totalPrice = cur?.hirePrice * cur?.quantity
        return total += cur?.totalPrice
    },0)
}

// Trả hàng trước hạn
watch(
  () => tableAheadOfTime.value[tableAheadOfTime.value.length - 1],
  () => {
    if (
      tableAheadOfTime.value[tableAheadOfTime.value.length - 1]?.productPropertyName &&
      tableAheadOfTime.value[tableAheadOfTime.value.length - 1]?.quantity 
    )
    addRowTable()
  },
  {
    deep: true
  }
)

const rentExtensionValue = ref()
// total price
const totalRentFee = ref(0)

const calculateMoney = () => {
    totalRentFee.value = tableExpend.value.reduce((total, cur) => {
        return total += cur.totalPrice
    },0)
}

onBeforeMount(()=>{
  addRowTable()
  calculateMoney()
})

const handleDisabledDate = (date) => {
  return date.getTime() <= moment(props.orderData?.period[1]).valueOf()
}

</script>
<template>
  <!-- Gia hạn thuê -->
  <el-dialog
:close-on-click-modal="doCloseOnClickModal"
    :model-Value="modelValue"
    v-if="orderStatusType == 2"
    @open="open"
    @close="close"
    class="font-bold"
    :title="t('formDemo.rentalRenewalInformation')"
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
          <div class="flex gap-4 pt-2">
            <label class="w-[40%] text-right">{{ t('formDemo.orderCode') }}</label>
            <div class="w-[60%] text-xl text-black font-bold dark:text-light-50">{{
              orderData?.orderCode
            }}</div>
          </div>
          <div class="flex gap-4 pt-2" >
            <label class="w-[40%] text-right">{{ t('reuse.rentalTerm') }}</label>
            <div class="w-[60%] text-black dark:text-light-50">{{
              orderData?.leaseTerm == '1'
                ? 'Theo ngày'
                : orderData?.leaseTerm == '7'
                ? 'Theo tuần'
                : 'Theo tháng'
            }}</div>
          </div>
          <div class="flex gap-4 pt-2" >
            <label class="w-[40%] text-right">{{ t('formDemo.rentalPeriod') }}</label>
            <div class="w-[60%] text-black dark:text-light-50">
              {{ dateTimeFormat(orderData?.period[0]) }} đến
              {{ dateTimeFormat(orderData?.period[1]) }}
            </div>
          </div>
          <div class="flex gap-4 pt-2 items-center" >
            <label class="w-[40%] text-right">{{ t('formDemo.leaseExtensionTo') }} <span class="text-red-600">*</span></label>
            <div class="w-[60%] text-black dark:text-light-50">
                <el-date-picker
                    v-model="rentExtensionValue"
                    type="date"
                    :disabledDate="handleDisabledDate"
                    format="DD/MM/YYYY"
                    placeholder="Chọn ngày"
                />
            </div>
          </div>
        </div>

        <div class="flex-1 flex items-start justify-center gap-4">
          <span>
            <div class="text-right">Mã QR đơn hàng</div>
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
      </div>
    </div>
    <div class="flex items-center">
        <span class="w-[30%] text-base font-bold break-w" >{{
          t('formDemo.informationProductExtend')
        }}</span>
        <span class="block h-1 w-[70%] border-t-1 dark:border-[#4c4d4f]"></span>
    </div>
    
    <div class="pt-2 pb-2">
      <el-table :data="tableExpend" border style="width: 100%" fit>
        <el-table-column label="STT" type="index" width="60" align="center" />
        <el-table-column prop="productPropertyName" :label="t('formDemo.commodityName')" width="300"/>
        <el-table-column prop="accessory" :label="t('reuse.accessory')"/>
        <el-table-column prop="quantity" :label="t('reuse.quantity')"/>
        <el-table-column prop="hirePrice" :label="t('reuse.unitPrice')">
            <template #default="data">
                <div class="text-right">
                    {{ changeMoney.format(data.row.hirePrice) }}
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="totalPrice" :label="t('formDemo.rentalFee')">
            <template #default="data">
                <div class="text-right">
                    {{changeMoney.format(data.row.totalPrice)}}
                </div>
            </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="text-right font-bold">Thành tiền phí thuê: {{ changeMoney.format(totalRentFee) }}</div>
    <div class="flex items-center">
        <span class="w-[30%] text-base font-bold break-w" >{{
          t('formDemo.fullyIntegrated')
        }}</span>
        <span class="block h-1 w-[70%] border-t-1 dark:border-[#4c4d4f]"></span>
    </div>
    
    <div class="pt-2 pb-2">
      <el-table :data="tableAheadOfTime" border style="width: 100%" fit>
        <el-table-column label="STT" type="index" width="60" align="center" />
        <el-table-column prop="productPropertyName" :label="t('formDemo.commodityName')" width="300">
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
              @update-value="(value, obj) => updateValueTable(value, obj, scope)"
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
            <el-input-number
                @change="updateQuantityTableExpand(scope.row.productPropertyId, scope.row.quantity)" 
                v-model="scope.row.quantity" 
                type="number" 
                controls-position="right"
                :min="0"
                :max="scope.row.maximumQuantity" 
            />
          </template>
        </el-table-column>
        <el-table-column prop="conditionProducts" :label="t('reuse.conditionProducts')">
          <template #default="scope">
            <el-input v-model="scope.row.conditionProducts" />
          </template>
        </el-table-column>
      </el-table>
      <div class="flex items-center pt-4">
        <span class="w-[10%] text-base font-bold">{{ t('reuse.status') }}</span>
        <span class="block h-1 w-[90%] border-t-1 dark:border-[#4c4d4f]"></span>
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
      <div class="flex gap-4">
          <label class="w-[30%]"></label>
          <div class="w-[100%] flex gap-22">
            <div class="">{{ dateTimeFormat(new Date()) }}</div>
          </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end">
        <div>
          <el-button type="primary" @click="postReturnRequest(5)">Gia hạn thuê & ghi phiếu nhập hoàn</el-button>
          <el-button @click="close">{{ t('reuse.exit') }}</el-button>
        </div>
      </div>
    </template>
  </el-dialog>

</template>

<style scope>
.box {
  position: relative;
  display: flex;
  width: fit-content;
  padding: 0 10px 0 20px;
  background-color: #ccc;
  border: 1px solid #ccc;
  opacity: 0.6;
  align-items: center;
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

.active {
  opacity: 1 !important;
}
</style>
