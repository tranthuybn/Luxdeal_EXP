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
import { computed, onBeforeMount, ref, watch } from 'vue'
import MultipleOptionsBox from '@/components/MultipleOptionsBox.vue'
import ChooseExportWarehouse from './ChooseExportWH.vue'
import { FORM_IMAGES } from '@/utils/format'
import { createLotWarehouseImage } from '@/api/Warehouse'
import { API_URL } from '@/utils/API_URL'

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
  }
})

type ExportLots = {
  [x: string]: any
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
const ListOfProductsForSale = computed(() => {
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
  warehouseId: number | undefined
  locationId: number | undefined
  lotId: number | undefined
}
const warehouseData = ref<ChooseWarehouse>({} as ChooseWarehouse)
const dialogWarehouse = ref(false)
const currentRow = ref(0)
const curPPID = ref(0)
const openDialogWarehouse = (props) => {
  if (props.row.productPropertyId) {
    dialogWarehouse.value = true
    curPPID.value = props.row.productPropertyId
    currentRow.value = props.$index
    warehouseData.value.quantity = prop.productData[currentRow.value]?.quantity
    warehouseData.value.warehouseId = prop.productData[currentRow.value].warehouse?.value
    warehouseData.value.locationId = prop.productData[currentRow.value].location?.value
    warehouseData.value.lotId = prop.productData[currentRow.value].lot?.value
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
    ListOfProductsForSale.value[currentRow.value].exportLots = warehouseData.exportLots
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
    await createLotWarehouseImage(
      FORM_IMAGES({ Image: uploadFile.raw, WarehouseLotId: props.row.lot.value })
    )
      .then(() => {
        props.row.imageUrl = URL.createObjectURL(uploadFile.raw!)
        ElNotification({
          message: t('reuse.addSuccess'),
          type: 'success'
        })
      })
      .catch(() => {
        props.row.imageUrl = ''
        ElNotification({
          message: t('reuse.addFail'),
          type: 'warning'
        })
      })
  }
}

const warehouseFormat = (props) => {
  let warehouseName = ''
  let locationName = ''
  let lotName = ''

  if (
    props.row.warehouse !== undefined &&
    props.row.warehouse?.label !== null &&
    props.row.warehouse?.label !== undefined
  ) {
    warehouseName = props.row.warehouse?.label
  }
  if (
    props.row.location !== undefined &&
    props.row.location?.label !== null &&
    props.row.location?.label !== undefined
  ) {
    locationName = props.row.location?.label
  }
  if (
    props.row.lot !== undefined &&
    props.row.lot?.label !== null &&
    props.row.lot?.label !== undefined
  ) {
    lotName = props.row.lot?.label
  }
  return `${warehouseName}/${locationName}/${lotName}`
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
    if (row.warehouse?.value == undefined) {
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
const closeDialogExport = () => {
  dialogWarehouse.value = false
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
  <ChooseExportWarehouse
    v-if="transactionType == 2"
    :showDialog="dialogWarehouse"
    @close-dialog-warehouse="closeDialogWarehouse"
    @close-dialog="closeDialogExport"
    :transactionType="transactionType"
    :productPropertyId="curPPID"
    :warehouseData="warehouseData"
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
    <el-table-column v-if="transactionType == 1" :label="t('reuse.picture')" min-width="200">
      <template #default="props">
        <el-upload
          action="#"
          :on-preview="handlePictureCardPreview"
          :on-change="(data) => handleChange(props, data)"
          :before-upload="beforeAvatarUpload"
          :auto-upload="false"
          :show-file-list="false"
          :disabled="prop.type == 'detail'"
        >
          <el-image v-if="props.row.imageUrl" :src="API_URL + props.row.imageUrl" class="avatar" />
          <el-button :disabled="prop.type == 'detail'"
            ><span class="text-blue-500">+ {{ t('reuse.addImage') }}</span></el-button
          >
        </el-upload>
      </template>
    </el-table-column>
    <el-table-column :label="t('formDemo.exportWarehouse')" min-width="300">
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

    <el-table-column :label="t('formDemo.manipulation')" align="center" min-width="90">
      <template #default="props">
        <el-button @click="removeRow(props)" :disabled="prop.type == 'detail'" type="danger">{{
          t('reuse.delete')
        }}</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
