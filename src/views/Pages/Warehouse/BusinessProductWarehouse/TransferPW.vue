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
import { computed, onBeforeMount, ref, watch } from 'vue'
import MultipleOptionsBox from '@/components/MultipleOptionsBox.vue'
import ChooseTransferWarehouse from './ChooseTransferWH.vue'
import CurrencyInputComponent from '@/components/CurrencyInputComponent.vue'
import { moneyFormat } from '@/utils/format'

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
  testReactive: {
    type: String,
    default: ''
  }
})

type ExportLots = {
  fromLotId: number
  quantity: number
}
type Options = {
  value: number
  label: string
}

type ProductWarehouse = {
  productPropertyId?: number
  quantity?: number
  price?: number
  productPropertyQuality?: string
  accessory?: string
  fromLotId?: number
  toLotId?: number
  exportLots?: Array<ExportLots>
  productName?: string
  finalPrice?: string
  unitName?: string
  fromWarehouse?: Options
  fromLocation?: Options
  toWarehouse?: Options
  toLocation?: Options
  lot?: Options
}
const ListOfProductsForSale = computed(() => {
  return prop.productData
})
const listOfProduct = computed(() => {
  return prop.productData
})
// Call api danh sách sản phẩm
const productLoading = ref(true)
let listProducts = ref()
const pageIndexProducts = ref(1)
const callApiProductList = async () => {
  productLoading.value = true
  const res = await getProductsList({ PageIndex: pageIndexProducts.value, PageSize: 10 })
  listProducts.value = res.data.map((product) => ({
    productCode: product.code,
    value: product.productCode,
    name: product.name ?? '',
    price: product.price,
    unit: product.unitName,
    productPropertyId: product.id,
    productPropertyCode: product.productPropertyCode
  }))
  productLoading.value = false
}
onBeforeMount(async () => await callApiProductList())
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
const getProductSelected = (_value, obj, scope) => {
  scope.row.productName = obj.name
  scope.row.productPropertyId = obj.productPropertyId
  scope.row.unitName = obj.unit
}
const changeProduct = (data, scope) => {
  forceRemove.value = false
  const selected = ListOfProductsForSale.value
    .filter((row) => row !== scope.row)
    .find((product) => product.productPropertyId == data)
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
  }
}
const scrollProductTop = ref(false)
const scrollProductBottom = ref(false)

const ScrollProductTop = () => {
  scrollProductTop.value = true
}
const noMoreProductData = ref(false)

const ScrollProductBottom = () => {
  productLoading.value = true
  scrollProductBottom.value = true
  pageIndexProducts.value++
  noMoreProductData.value
    ? ''
    : getProductsList({ PageIndex: pageIndexProducts.value, PageSize: 10 })
        .then((res) => {
          res.data.length == 0
            ? (noMoreProductData.value = true)
            : res.data.map((product) =>
                listProducts.value.push({
                  code: product.code,
                  label: product.name,
                  value: product.id
                })
              )
        })
        .catch(() => {
          noMoreProductData.value = true
        })
        .finally(() => (productLoading.value = false))
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
const dialogWarehouseTransfer = ref(false)
const currentRowWHTrans = ref(0)
const curPPIDWHTrans = ref(0)
const openDialogWarehouseTransfer = (props) => {
  if (props.row.productPropertyId) {
    dialogWarehouseTransfer.value = true
    curPPIDWHTrans.value = props.row.productPropertyId
    currentRowWHTrans.value = props.$index
    warehouseData.value.quantity = prop.productData[currentRowWHTrans.value]?.quantity
    warehouseData.value.fromWarehouseId =
      prop.productData[currentRowWHTrans.value].fromWarehouse?.value
    warehouseData.value.fromLocationId =
      prop.productData[currentRowWHTrans.value].fromLocation?.value
    warehouseData.value.toWarehouseId = prop.productData[currentRowWHTrans.value].toWarehouse?.value
    warehouseData.value.toLocationId = prop.productData[currentRowWHTrans.value].toLocation?.value
    warehouseData.value.tolotId = prop.productData[currentRowWHTrans.value].lot?.value
  } else {
    ElMessage({
      message: t('reuse.pleaseChooseProduct'),
      type: 'warning'
    })
  }
}
const closeDialogWarehouseTrasfer = (warehouseData) => {
  if (warehouseData != null) {
    ListOfProductsForSale.value[currentRowWHTrans.value].quantity = warehouseData.quantity
    ListOfProductsForSale.value[currentRowWHTrans.value].unitName = warehouseData.lot.unit
    ListOfProductsForSale.value[currentRowWHTrans.value].fromWarehouse = warehouseData.fromWarehouse
    ListOfProductsForSale.value[currentRowWHTrans.value].toWarehouse = warehouseData.toWarehouse
    ListOfProductsForSale.value[currentRowWHTrans.value].fromLocation = warehouseData.fromLocation
    ListOfProductsForSale.value[currentRowWHTrans.value].toLocation = warehouseData.toLocation
    ListOfProductsForSale.value[currentRowWHTrans.value].fromLotId = warehouseData.fromLotId
    ListOfProductsForSale.value[currentRowWHTrans.value].toLotId = warehouseData.toLot
  }
  dialogWarehouseTransfer.value = false
  // toLotId
}

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const fromWarehouseFormat = (props) => {
  let fromWarehouseName = ''
  let fromLocationName = ''
  let lotName = ''

  if (
    props.row.fromWarehouse !== undefined &&
    props.row.fromWarehouse?.label !== null &&
    props.row.fromWarehouse?.label !== undefined
  ) {
    fromWarehouseName = props.row.fromWarehouse?.label
  }
  if (
    props.row.fromLocation !== undefined &&
    props.row.fromLocation?.label !== null &&
    props.row.fromLocation?.label !== undefined
  ) {
    fromLocationName = props.row.fromLocation?.label
  }
  if (
    props.row.fromLotId !== undefined &&
    props.row.fromLotId?.label !== null &&
    props.row.fromLotId?.label !== undefined
  ) {
    lotName = props.row.lot?.label
  }
  return `${fromWarehouseName}/${fromLocationName}/${lotName}`
}

const toWarehouseFormat = (props) => {
  let toWarehouseName = ''
  let toLocationName = ''
  let toLotName = ''

  if (
    props.row.toWarehouse !== undefined &&
    props.row.toWarehouse?.label !== null &&
    props.row.toWarehouse?.label !== undefined
  ) {
    toWarehouseName = props.row.toWarehouse?.label
  }
  if (
    props.row.toLocation !== undefined &&
    props.row.toLocation?.label !== null &&
    props.row.toLocation?.label !== undefined
  ) {
    toLocationName = props.row.toLocation?.label
  }
  if (
    props.row.toLotId !== undefined &&
    props.row.toLotId?.label !== null &&
    props.row.toLotId?.label !== undefined
  ) {
    toLotName = props.row.lot?.label
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
    if (row.fromWarehouse?.value == undefined || row.fromLocation?.value == undefined) {
      ElMessage({
        message: t('reuse.pleaseChooseWarehouse'),
        type: 'warning'
      })
      valid = false
      return
    }
    if (row.toWarehouse?.value == undefined || row.toLocation?.value == undefined) {
      ElMessage({
        message: t('reuse.pleaseChooseWarehouse'),
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
  })
  return valid
}
defineExpose({
  ListOfProductsForSale,
  checkValueOfTable
})
</script>
<template>
  <el-dialog top="5vh" v-model="dialogVisible" width="130vh">
    <el-image class="h-full" :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
  <ChooseTransferWarehouse
    :showDialog="dialogWarehouseTransfer"
    @close-dialog-warehouse="closeDialogWarehouseTrasfer"
    :transactionType="transactionType"
    :productPropertyId="curPPIDWHTrans"
    :warehouseData="warehouseData"
  />
  <el-table
    border
    :class="[
      'bg-[var(--el-color-white)] dark:(text-white-800) border-[var(--el-border-color)] border-1px)'
    ]"
    :data="ListOfProductsForSale"
  >
    <el-table-column :label="t('formDemo.productManagementCode')" min-width="160">
      <template #default="scope">
        <MultipleOptionsBox
          :defaultValue="scope.row.productPropertyId"
          :fields="[
            t('reuse.productCode'),
            t('reuse.managementCode'),
            t('reuse.productInformation')
          ]"
          filterable
          width="500px"
          :items="listProducts"
          valueKey="productPropertyId"
          labelKey="productCode"
          :hiddenKey="['id']"
          :placeHolder="t('reuse.chooseProductCode')"
          :clearable="false"
          :loading="productLoading"
          @update-value="(value, obj) => getProductSelected(value, obj, scope)"
          @change="(option) => changeProduct(option, scope)"
          @scroll-top="ScrollProductTop"
          @scroll-bottom="ScrollProductBottom"
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

    <el-table-column :label="t('reuse.importExportWarehouse')" min-width="250">
      <template #default="props">
        <div class="flex w-[100%] items-center">
          <div class="flex-left w-[60%]">
            <div class="break-words">Từ kho:{{ fromWarehouseFormat(props) }}</div>
            <div class="break-words">Đến kho:{{ toWarehouseFormat(props) }}</div>
          </div>
          <div class="w-[40%]">
            <el-button text @click="openDialogWarehouseTransfer(props)">
              <span class="text-blue-500"> + {{ t('formDemo.chooseWarehouse') }}</span>
            </el-button>
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="quantity" :label="t('formDemo.amount')" align="center" width="90">
      <template #default="data">
        {{ data.row.quantity }}
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
      ><template #default="props">
        {{ moneyFormat(props.row.price * props.row.quantity) }}
      </template></el-table-column
    >
    <el-table-column :label="t('formDemo.manipulation')" align="center" min-width="90">
      <template #default="props">
        <el-button @click="removeRow(props)" :disabled="prop.type == 'detail'" type="danger">{{
          t('reuse.delete')
        }}</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
