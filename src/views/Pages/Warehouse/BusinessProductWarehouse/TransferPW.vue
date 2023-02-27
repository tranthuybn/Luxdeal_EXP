<script setup lang="ts">
import { getProductsList } from '@/api/Business'
import { useI18n } from '@/hooks/web/useI18n'
import {
  ElButton,
  ElInput,
  ElMessage,
  ElTable,
  ElTableColumn,
  ElImage,
  ElDialog
} from 'element-plus'
import { computed, onMounted, ref, watch } from 'vue'
import SelectTable from '@/components/SelectTable.vue'
import CurrencyInputComponent from '@/components/CurrencyInputComponent.vue'
import { moneyFormat } from '@/utils/format'
import ChooseExportWarehouse from './ChooseExportWH.vue'
import ChooseImportWarehouse from './ChooseImportWH.vue'

const { t } = useI18n()
const prop = defineProps({
  type: {
    type: String,
    default: ''
  },
  transactionType: {
    type: Number,
    default: 0
  },
  productData: {
    type: Array<ProductWarehouse>,
    default: () => [{}]
  },
  ticketData: {
    type: Object,
    default: () => {}
  },
  status:{
    type: Number,
    default: 0
  },
  returnRequestId: {
    type: Number,
    default: 0
  }
})

type Options = {
  value: number
  label: string
}

type ProductWarehouse = {
  productPropertyId?: number
  productPropertyCode?: string
  productCode?: string
  quantity: number
  price: number
  productPropertyQuality?: string
  accessory?: string
  productName?: string
  finalPrice?: string
  unitName?: string
  fromLocation?: Options
  toLocation?: Options
  fromLot?: Options
  toLot?: Options
  orderId?: number
  serviceType?: number
}
const ListOfProductsForSale = computed(() => {
  return prop.productData
})
// Call api danh sách sản phẩm
let listProducts = ref()
const callApiProductList = async () => {
  const res = await getProductsList({ ...params.value })
  tempListProducts.value = listProducts.value = res.data.map((product) => ({
    productCode: product.code,
    productPropertyId: product.id,
    productPropertyCode: product.productCode,
    name: product.name
  }))
  ListOfProductsForSale.value.forEach(row=>{
    const find = tempListProducts.value.find(product => product.productPropertyId == row.productPropertyId)
    if(!find && row.productPropertyId){
      tempListProducts.value.unshift({
        productCode: row.productCode,
        productPropertyId: row.productPropertyId,
        productPropertyCode: row.productPropertyCode,
        name: row.productName
      })
    }
  })
}
onMounted(() => callApiProductList())
watch(
  () => ListOfProductsForSale.value[ListOfProductsForSale.value.length - 1]?.productPropertyId,
  () => {
    if (
      ListOfProductsForSale.value[ListOfProductsForSale.value.length - 1]?.productPropertyId !=
        null &&
      forceRemove.value == false &&
      prop.type == 'add'
    ) {
      ListOfProductsForSale.value.push({} as ProductWarehouse)
    }
  },
  { deep: true }
)
const removeRow = (props) => {
  ListOfProductsForSale.value.length < 2 ? '' : ListOfProductsForSale.value.splice(props.$index, 1)
}
const forceRemove = ref(false)
const changeProduct = (value, obj, scope) => {
  forceRemove.value = false
  const selected = ListOfProductsForSale.value
    .filter((row) => row !== scope.row)
    .find((product) => product.productPropertyId == value)
  if (selected !== undefined) {
    scope.row.productPropertyId = null
    scope.row.productName = null
    scope.row.productPropertyId = null
    scope.row.unitName = null
    scope.row.productCode = null
    ElMessage({
      message: t('reuse.productCodeExist'),
      type: 'warning'
    })
  } else {
    scope.row.productName = obj.name
    scope.row.productPropertyId = obj.productPropertyId
    scope.row.unitName = obj.unit
  }
}
const scrollProductTop = ref(false)
const scrollProductBottom = ref(false)

const ScrollProductTop = () => {
  scrollProductTop.value = true
}
const noMoreProductData = ref(false)

const ScrollProductBottom = () => {
  scrollProductBottom.value = true
  params.value.pageIndex = params.value.pageIndex + 1
  noMoreProductData.value
    ? ''
    : getProductsList({ ...params.value })
        .then((res) => {
          res.data.length == 0
            ? (noMoreProductData.value = true)
            : res.data.map((product) =>
                listProducts.value.push({
                  productCode: product.code,
                  productPropertyId: product.id,
                  productPropertyCode: product.productCode,
                  name: product.name
                })
              )
        })
        .catch(() => {
          noMoreProductData.value = true
        })
  tempListProducts.value = listProducts.value
}
type ChooseWarehouse = {
  quantity: number | undefined
  fromWarehouseId: number | undefined
  fromLocationId: number | undefined
  toWarehouseId: number | undefined
  toLocationId: number | undefined
  tolotId: number | undefined
}

const warehouseData = ref<ChooseWarehouse>({} as ChooseWarehouse)
//dialog warehouse chuyen kho
const currentRow = ref(0)
const curPPID = ref(0)
const curServiceType = ref(0)

const openDialogWarehouseImport = (props) => {
  if (!prop.ticketData.toWarehouse) {
    ElMessage({
      message: t('reuse.pleaseChooseWarehouse'),
      type: 'warning'
    })
    return
  }
  if (props.row.productPropertyId) {
    dialogWarehouseImport.value = true
    curPPID.value = props.row.productPropertyId
    curServiceType.value = props.row.serviceType
    currentRow.value = props.$index
    warehouseData.value.quantity = props.row.quantity
  } else {
    ElMessage({
      message: t('reuse.pleaseChooseProduct'),
      type: 'warning'
    })
  }
}
const openDialogWarehouseExport = (props) => {
  if (!prop.ticketData.toWarehouse) {
    ElMessage({
      message: t('reuse.pleaseChooseWarehouse'),
      type: 'warning'
    })
    return
  }
  if (props.row.productPropertyId) {
    dialogWarehouseExport.value = true
    curPPID.value = props.row.productPropertyId
    currentRow.value = props.$index
    warehouseData.value.quantity = props.row.quantity
  } else {
    ElMessage({
      message: t('reuse.pleaseChooseProduct'),
      type: 'warning'
    })
  }
}
const closeDialogWarehouseImport = (warehouseData) => {
  if (warehouseData != null) {
    ListOfProductsForSale.value[currentRow.value].toLot = warehouseData.lot
    ListOfProductsForSale.value[currentRow.value].toLocation = warehouseData.location
  }
  dialogWarehouseImport.value = false
}
const closeDialogWarehouseExport = (warehouseData) => {
  if (warehouseData != null) {
    ListOfProductsForSale.value[currentRow.value].quantity = warehouseData.quantity
    ListOfProductsForSale.value[currentRow.value].unitName = warehouseData.unit
    ListOfProductsForSale.value[currentRow.value].fromLocation = {
      value: warehouseData?.exportLots[0].value,
      label: warehouseData?.location
    }
    ListOfProductsForSale.value[currentRow.value].fromLot = {
      value: warehouseData?.exportLots[0].value,
      label: warehouseData.lot
    }
  }
  dialogWarehouseExport.value = false
}
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const fromWarehouseFormat = (props) => {
  let fromWarehouseName = ''
  let fromLocationName = ''
  let lotName = ''

  if (prop.ticketData?.fromWarehouse?.label) {
    fromWarehouseName = prop.ticketData?.fromWarehouse.label
  }
  if (props.row.fromLocation && props.row.fromLocation?.label) {
    fromLocationName = props.row.fromLocation?.label
  }
  if (props.row.fromLot && props.row.fromLot?.label) {
    lotName = props.row.fromLot?.label
  }
  return `${fromWarehouseName}/${fromLocationName}/${lotName}`
}

const toWarehouseFormat = (props) => {
  let toWarehouseName = ''
  let toLocationName = ''
  let toLotName = ''

  if (prop.ticketData?.toWarehouse?.label) {
    toWarehouseName = prop.ticketData?.toWarehouse.label
  }
  if (props.row.toLocation && props.row.toLocation?.label) {
    toLocationName = props.row.toLocation?.label
  }
  if (props.row.toLot && props.row.toLot?.label) {
    toLotName = props.row.toLot?.label
  }
  return `${toWarehouseName}/${toLocationName}/${toLotName}`
}
const checkValueOfTable = () => {
  if (
    ListOfProductsForSale.value.length > 1 &&
    Object.keys(ListOfProductsForSale.value[ListOfProductsForSale.value.length - 1]).length === 0
  ) {
    // "empty" object
    ListOfProductsForSale.value.splice(ListOfProductsForSale.value.length - 1, 1)
    forceRemove.value = true
  }
  let valid = true
  ListOfProductsForSale.value.forEach((row) => {
    if (row.productPropertyId == undefined || row.productPropertyId == null) {
      ElMessage({
        message: t('reuse.pleaseChooseProduct'),
        type: 'warning'
      })
      valid = false
      return
    }
    if (row.price == undefined) {
      ElMessage({
        message: t('reuse.pleaseChoosePrice'),
        type: 'warning'
      })
      valid = false
      return
    }
    if (!row.toLot || !row.fromLot) {
      ElMessage({
        message: t('reuse.pleaseChooseLot'),
        type: 'warning'
      })
      valid = false
      return
    }
  })
  return valid
}
defineExpose({
  ListOfProductsForSale,
  checkValueOfTable
})

//fixbug
const tempListProducts = ref()
const params = ref({
  pageSize: 10,
  pageIndex: 1,
  Keyword: ''
})
const searchProduct = async (keyword) => {
  params.value.Keyword = keyword
  if (keyword) {
    params.value.pageIndex = 1
    const res = await getProductsList({ ...params.value })
    tempListProducts.value = res.data.map((product) => ({
      productCode: product.code,
      productPropertyId: product.id,
      productPropertyCode: product.productCode,
      name: product.name
    }))
  } else {
    tempListProducts.value = listProducts.value
  }
}

//fix bug
const dialogWarehouseImport = ref(false)
const dialogWarehouseExport = ref(false)

const closeDialogExport = () => {
  dialogWarehouseExport.value = false
}
const disabled = computed(() => {
  if (prop.type == 'detail') {
    return true
  }
  return false
})
const totalMoney = () => {
  if (ListOfProductsForSale.value !== undefined) {
    let money = 0
    ListOfProductsForSale.value.forEach((row) => {
      if (row.quantity && row.price) money += Number(row.quantity * row.price)
    })
    return money
  }
  return 0
}
</script>
<template>
  <el-dialog top="5vh" v-model="dialogVisible" width="130vh">
    <el-image class="h-full" :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
  <ChooseImportWarehouse
    v-model:showDialog="dialogWarehouseImport"
    @close-dialog-warehouse="closeDialogWarehouseImport"
    :transactionType="transactionType"
    :productPropertyId="curPPID"
    :warehouseFormData="warehouseData"
    :orderId="ticketData.orderId"
    :warehouse="ticketData.toWarehouse"
    :serviceType="curServiceType"
  />
  <ChooseExportWarehouse
    v-if="dialogWarehouseExport"
    :showDialog="dialogWarehouseExport"
    @close-dialog-warehouse="closeDialogWarehouseExport"
    @close-dialog="closeDialogExport"
    :transactionType="transactionType"
    :productPropertyId="curPPID"
    :warehouseFormData="warehouseData"
    :orderId="ticketData.orderId"
    :warehouse="ticketData.fromWarehouse"
    :serviceType="ticketData.serviceType"
  />
  <el-table
    border
    :class="[
      'bg-[var(--el-color-white)] dark:(text-white-800) border-[var(--el-border-color)] border-1px)'
    ]"
    :data="ListOfProductsForSale"
  >
    <template #append>
      <span class="ml-1/4 font-bold">{{ t('reuse.totalMoneyTransferWarehouse') }}</span>
      <span class="ml-4 font-bold">{{ moneyFormat(totalMoney()) }}</span>
    </template>
    <el-table-column :label="t('formDemo.productManagementCode')" min-width="160">
      <template #default="scope">
        <SelectTable
          v-model="scope.row.productPropertyId"
          :disabled="disabled"
          :fields="[
            t('reuse.productCode'),
            t('reuse.managementCode'),
            t('reuse.productInformation')
          ]"
          width="500px"
          :items="tempListProducts"
          valueKey="productPropertyId"
          labelKey="productCode"
          :hiddenKey="['productPropertyId']"
          :placeHolder="t('reuse.chooseProductCode')"
          @scroll-top="ScrollProductTop"
          @scroll-bottom="ScrollProductBottom"
          @keyword="searchProduct"
          @change="(value, obj) => changeProduct(value, obj, scope)"
        />
      </template>
    </el-table-column>
    <el-table-column prop="productName" :label="t('formDemo.productInformation')" min-width="380" />
    <el-table-column prop="accessory" :label="t('reuse.accessory')" width="170">
      <template #default="data">
        <div v-if="type === 'detail'">{{ data.row.accessory }}</div>
        <el-input
          v-else
          class="max-w-[150px]"
          v-model="data.row.accessory"
          :placeholder="`/${t('formDemo.selfImportAccessories')}/`"
        />
      </template>
    </el-table-column>

    <el-table-column prop="quantity" :label="t('formDemo.amount')" align="center" width="90">
      <template #default="props">
        {{ props.row.quantity }}
      </template>
    </el-table-column>
    <el-table-column prop="unitName" :label="t('reuse.dram')" align="center" min-width="100" />
    <el-table-column prop="price" :label="t('formDemo.unitPriceTransWarehouse')" width="180">
      <template #default="props">
        <div v-if="type == 'detail'">
          {{ props.row.price }}
        </div>
        <CurrencyInputComponent v-else v-model="props.row.price" />
      </template>
    </el-table-column>

    <el-table-column :label="t('formDemo.intoMoneyTransWarehouse')" width="150"
      ><template #default="scope">
        {{ moneyFormat(scope.row.price * scope.row.quantity) }}
      </template></el-table-column
    >
    <el-table-column :label="t('reuse.detailExportWarehouse')" min-width="250">
      <template #default="props">
        {{ fromWarehouseFormat(props) }}
        <el-button
text @click="openDialogWarehouseExport(props)" 
        :disabled="Number(returnRequestId) != 0 || status == 3 || status == 4"
        >
          <span class="text-blue-500"> + {{ t('formDemo.chooseWarehouse') }}</span>
        </el-button>
      </template>
    </el-table-column>
    <el-table-column :label="t('reuse.detailImportWarehouse')" min-width="250">
      <template #default="props">
        {{ toWarehouseFormat(props) }}
        <el-button text @click="openDialogWarehouseImport(props)">
          <span class="text-blue-500"> + {{ t('formDemo.chooseWarehouse') }}</span>
        </el-button>
      </template>
    </el-table-column>
    <el-table-column :label="t('formDemo.manipulation')" align="center" min-width="90">
      <template #default="props">
        <el-button @click="removeRow(props)" :disabled="prop.type == 'detail'" type="danger">{{
          t('reuse.delete')
        }}</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
