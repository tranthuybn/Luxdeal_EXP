<script setup lang="ts">
import { getProductsList } from '@/api/Business'
import { useI18n } from '@/hooks/web/useI18n'
import {
  ElButton,
  ElInput,
  ElMessage,
  ElNotification,
  ElTable,
  ElTableColumn,
  ElUpload,
  ElImage,
  ElDialog
} from 'element-plus'
import type { UploadFile } from 'element-plus'
import { onBeforeMount, ref, watch } from 'vue'
import SelectTable from '@/components/SelectTable.vue'
import ChooseWarehouse from './ChooseImportWH.vue'
import CurrencyInputComponent from '@/components/CurrencyInputComponent.vue'
import { FORM_IMAGES, moneyFormat } from '@/utils/format'
import { createLotWarehouseImage } from '@/api/Warehouse'

const { t } = useI18n()
defineProps({
  type: {
    type: String,
    default: ''
  },
  transactionType: {
    type: Number,
    default: 0
  },
  productData: {
    type: Object,
    default: () => {}
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
  warehouseId?: number
  productPropertyQuality?: string
  accessory?: string
  fileId?: number
  fromLotId?: number
  toLotId?: number
  exportLots?: Array<ExportLots>
  productName?: string
  finalPrice?: string
  unitName?: string
  warehouse?: Options
  location?: Options
  lot?: Options
  imageUrl?: string
}
let ListOfProductsForSale = ref<ProductWarehouse[]>([{} as ProductWarehouse])
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
}
onBeforeMount(async () => await callApiProductList())
watch(
  () => ListOfProductsForSale.value[ListOfProductsForSale.value.length - 1]?.productPropertyId,
  () => {
    if (
      ListOfProductsForSale.value[ListOfProductsForSale.value.length - 1]?.productPropertyId !=
        null &&
      forceRemove.value == false
    ) {
      ListOfProductsForSale.value.push({} as ProductWarehouse)
    }
  },
  { deep: true }
)
const removeRow = (props) => {
  ListOfProductsForSale.value.length < 2 ? '' : ListOfProductsForSale.value.splice(props.$index, 1)
}
const AddRowTable = () => {
  ListOfProductsForSale.value.push({} as ProductWarehouse)
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
const dialogWarehouse = ref(false)
const currentRow = ref(0)
const curPPID = ref(0)
const openDialogWarehouse = (props) => {
  if (props.row.productPropertyId) {
    dialogWarehouse.value = true
    curPPID.value = props.row.productPropertyId
    currentRow.value = props.$index
  } else {
    ElMessage({
      message: t('reuse.pleaseChooseProduct'),
      type: 'warning'
    })
  }
}
const closeDialogWarehouse = (warehouseData) => {
  if (warehouseData != null) {
    ListOfProductsForSale.value[currentRow.value].quantity = warehouseData.quantity
    ListOfProductsForSale.value[currentRow.value].unitName = warehouseData.lot.unit
    ListOfProductsForSale.value[currentRow.value].warehouse = warehouseData.warehouse
    ListOfProductsForSale.value[currentRow.value].location = warehouseData.location
    ListOfProductsForSale.value[currentRow.value].lot = warehouseData.lot
  }
  dialogWarehouse.value = false
}

const validImageType = ['jpeg', 'png']
const beforeAvatarUpload = (rawFile) => {
  if (rawFile.raw && rawFile.raw['type'].split('/')[0] !== 'image') {
    ElMessage.error(t('reuse.notImageFile'))
    return false
  } else if (rawFile.raw && !validImageType.includes(rawFile.raw['type'].split('/')[1])) {
    ElMessage.error(t('reuse.onlyAcceptValidImageType'))
    return false
  } else if (rawFile.raw?.size / 1024 / 1024 > 4) {
    ElMessage.error(t('reuse.imageOver4MB'))
    return false
  } else if (rawFile.name?.split('.')[0].length > 100) {
    ElMessage.error(t('reuse.checkNameImageLength'))
    return false
  }
  return true
}
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}
const handleChange = async (props, uploadFile) => {
  const validImage = await beforeAvatarUpload(uploadFile)
  if (validImage) {
    props.row.imageUrl = URL.createObjectURL(uploadFile.raw!)
    await createLotWarehouseImage(FORM_IMAGES({ Image: uploadFile.raw }))
      .then((res) => {
        props.row.fileId = res.data
        ElNotification({
          message: t('reuse.addSuccess'),
          type: 'success'
        })
      })
      .catch(() =>
        ElNotification({
          message: t('reuse.addFail'),
          type: 'warning'
        })
      )
  }
}

const warehouseFormat = (props) => {
  if (props.row?.warehouse !== undefined) {
    if (props.row?.lot?.label !== undefined) {
      return `${props.row?.warehouse?.label}/${props.row?.location?.label}/${props.row?.lot?.lotCode}`
    } else {
      return `${props.row?.warehouse?.label}/${props.row?.location?.label}`
    }
  } else {
    return ''
  }
}
const checkValueOfTable = () => {
  if (ListOfProductsForSale.value.length == 1 && forceRemove.value == false) {
    ElMessage({
      message: t('reuse.pleaseChooseProduct'),
      type: 'warning'
    })
    return false
  }
  if (
    ListOfProductsForSale.value.length > 1 &&
    Object.keys(ListOfProductsForSale.value[ListOfProductsForSale.value.length - 1]).length === 0
  ) {
    // "empty" object
    ListOfProductsForSale.value.splice(ListOfProductsForSale.value.length - 1, 1)
    forceRemove.value = true
  }
  let result = true
  ListOfProductsForSale.value.forEach((row) => {
    if (row.productPropertyId == undefined || row.productPropertyId == null) {
      ElMessage({
        message: t('reuse.pleaseChooseProduct'),
        type: 'warning'
      })
      return (result = false)
    }

    if (row.warehouse == undefined || row.location == undefined) {
      ElMessage({
        message: t('reuse.pleaseChooseWarehouse'),
        type: 'warning'
      })
      return (result = false)
    }

    if (row.price == undefined) {
      ElMessage({
        message: t('reuse.pleaseChoosePrice'),
        type: 'warning'
      })
      return (result = false)
    }
  })

  return result
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
</script>
<template>
  <el-dialog top="5vh" v-model="dialogVisible" width="130vh">
    <el-image class="h-full" :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
  <ChooseWarehouse
    :showDialog="dialogWarehouse"
    @close-dialog-warehouse="closeDialogWarehouse"
    :transactionType="transactionType"
    :productPropertyId="curPPID"
  />
  <el-table
    border
    :class="[
      'bg-[var(--el-color-white)] dark:(text-white-800) border-[var(--el-border-color)] border-1px)'
    ]"
    :data="ListOfProductsForSale"
  >
    <el-table-column :label="t('formDemo.productManagementCode')" min-width="200">
      <template #default="scope">
        <SelectTable
          v-model="scope.row.productPropertyId"
          :fields="[
            t('reuse.productCode'),
            t('reuse.managementCode'),
            t('reuse.productInformation')
          ]"
          width="500px"
          :items="tempListProducts"
          valueKey="productPropertyId"
          labelKey="productPropertyCode"
          :hiddenKey="['productPropertyId']"
          :placeHolder="t('reuse.chooseProductCode')"
          @scroll-top="ScrollProductTop"
          @scroll-bottom="ScrollProductBottom"
          @keyword="searchProduct"
          @change="(value, obj) => changeProduct(value, obj, scope)"
        />
      </template>
    </el-table-column>
    <el-table-column prop="productName" :label="t('formDemo.productInformation')" min-width="420" />
    <el-table-column prop="accessory" :label="t('reuse.accessory')" width="180">
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
    <el-table-column :label="t('reuse.picture')" min-width="200">
      <template #default="props">
        <el-upload
          action="#"
          :on-preview="handlePictureCardPreview"
          :on-change="(data) => handleChange(props, data)"
          :before-upload="beforeAvatarUpload"
          :auto-upload="false"
          :show-file-list="false"
        >
          <el-image v-if="props.row.imageUrl" :src="props.row.imageUrl" class="avatar" />
          <el-button
            ><span class="text-blue-500">+ {{ t('reuse.addImage') }}</span></el-button
          >
        </el-upload>
      </template>
    </el-table-column>
    <el-table-column :label="t('reuse.importWarehouse')" min-width="300">
      <template #default="props">
        <div class="flex w-[100%] items-center">
          <div class="w-[60%] break-words">{{ warehouseFormat(props) }}</div>
          <div class="w-[40%]">
            <el-button text @click="openDialogWarehouse(props)">
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
    <el-table-column
      prop="price"
      :label="t('formDemo.unitPriceWarehouse')"
      align="right"
      width="180"
    >
      <template #default="props">
        <div v-if="type == 'detail'">
          {{ props.row.price }}
        </div>
        <CurrencyInputComponent v-else v-model="props.row.price" />
      </template>
    </el-table-column>
    <el-table-column :label="t('formDemo.intoMoneyWarehouse')" align="right" width="180"
      ><template #default="props">
        {{ moneyFormat(props.row.price * props.row.quantity) }}
      </template></el-table-column
    >

    <el-table-column :label="t('reuse.conditionProducts')" align="center" width="180">
      <template #default="data">
        <div v-if="type == 'detail'">
          {{ data.row.productPropertyQuality }}
        </div>
        <el-input v-else v-model="data.row.productPropertyQuality" style="width: 100%" />
      </template>
    </el-table-column>
    <el-table-column :label="t('formDemo.manipulation')" align="center" min-width="90">
      <template #default="props">
        <button
          @click="removeRow(props)"
          class="bg-[#F56C6C] pt-2 pb-2 pl-4 pr-4 text-[#fff] rounded"
          >{{ t('reuse.delete') }}</button
        >
      </template>
    </el-table-column>
  </el-table>
  <el-button @click="AddRowTable">Thêm dòng</el-button>
</template>
