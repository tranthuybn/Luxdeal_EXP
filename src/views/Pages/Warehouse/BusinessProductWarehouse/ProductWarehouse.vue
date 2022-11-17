<script setup lang="ts">
import { getProductsList } from '@/api/Business'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElInput, ElNotification, ElTable, ElTableColumn } from 'element-plus'
import { onBeforeMount, ref, watch } from 'vue'
import MultipleOptionsBox from '@/components/MultipleOptionsBox.vue'
const { t } = useI18n()
defineProps({
  type: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['open-dialog-warehouse'])

const openDialog = () => {
  emit('open-dialog-warehouse')
}
type ExportLots = {
  fromLotId: number
  quantity: number
}
type ProductWarehouse = {
  productPropertyId: number | null
  quantity: number | null
  price: number | null
  warehouseId: number | null
  productPropertyQuality: string | null
  accessory: string | null
  fileId: number | null
  fromLotId: number | null
  toLotId: number | null
  exportLots: Array<ExportLots> | null
  productName: string | null
}
let ListOfProductsForSale = ref<ProductWarehouse[]>([{} as ProductWarehouse])
// Call api danh sách sản phẩm
let listProducts = ref()
const pageIndexProducts = ref(1)
const callApiProductList = async () => {
  const res = await getProductsList({ PageIndex: pageIndexProducts.value, PageSize: 20 })
  listProducts.value = res.data.map((product) => ({
    productCode: product.code,
    value: product.productCode,
    name: product.name ?? '',
    price: product.price,
    productPropertyId: product.id,
    productPropertyCode: product.productPropertyCode
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
  ListOfProductsForSale.value.splice(props.$index, 1)
}
const forceRemove = ref(false)
const getProductSelected = (_value, obj, scope) => {
  scope.row.productName = obj.name
  scope.row.productPropertyId = obj.id
}
const changeProduct = (data, scope) => {
  forceRemove.value = false
  const selected = ListOfProductsForSale.value.find((product) => product.productPropertyId == data)
  if (selected !== undefined) {
    scope.row.code = ''
    scope.row.name = null
    ElNotification({
      message: t('reuse.productCodeExist'),
      type: 'warning'
    })
  } else {
    scope.row.productPropertyId = data
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
  pageIndexProducts.value++
  noMoreProductData.value
    ? ''
    : getProductsList({ PageIndex: pageIndexProducts.value, PageSize: 20 })
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
}
</script>
<template>
  <el-table
    border
    :class="[
      'bg-[var(--el-color-white)] dark:(text-white-800) border-[var(--el-border-color)] border-1px)'
    ]"
    :data="ListOfProductsForSale"
  >
    <el-table-column
      :label="t('formDemo.productManagementCode')"
      min-width="200"
      prop="productPropertyId"
    >
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
          valueKey="value"
          labelKey="code"
          :hiddenKey="['id']"
          :placeHolder="t('reuse.chooseProductCode')"
          :clearable="false"
          @update-value="(value, obj) => getProductSelected(value, obj, scope)"
          @change="(option) => changeProduct(option, scope)"
          @scroll-top="ScrollProductTop"
          @scroll-bottom="ScrollProductBottom"
        />
      </template>
    </el-table-column>
    <el-table-column prop="productName" :label="t('formDemo.productInformation')" min-width="620" />
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
      <!-- add image -->
    </el-table-column>
    <el-table-column :label="t('reuse.importWarehouse')" min-width="200">
      <div class="flex w-[100%] items-center">
        <div class="w-[40%]">Còn hàng</div>
        <div class="w-[60%]">
          <el-button text @click="openDialog">
            <span class="text-blue-500"> + {{ t('formDemo.chooseWarehouse') }}</span>
          </el-button>
        </div>
      </div>
    </el-table-column>
    <el-table-column prop="quantity" :label="t('formDemo.amount')" align="center" width="90">
      <template #default="data">
        <div v-if="type == 'detail'">
          {{ data.row.quantity }}
        </div>
        <el-input v-else v-model="data.row.quantity" style="width: 100%" />
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
        <el-input v-if="type != 'detail'" v-model="props.row.price" />
      </template>
    </el-table-column>
    <el-table-column
      prop="finalPrice"
      :label="t('formDemo.intoMoneyWarehouse')"
      align="right"
      width="180"
    />

    <el-table-column
      prop="quantity"
      :label="t('reuse.conditionProducts')"
      align="center"
      width="180"
    >
      <template #default="data">
        <div v-if="type == 'detail'">
          {{ data.row.quantity }}
        </div>
        <el-input v-else v-model="data.row.quantity" style="width: 100%" />
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
</template>
