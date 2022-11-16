<script setup lang="ts">
import { getProductsList } from '@/api/Business'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElInput, ElTable, ElTableColumn } from 'element-plus'
import { onBeforeMount, ref } from 'vue'
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
let ListOfProductsForSale = ref()
// Call api danh sách sản phẩm
let listProductsTable = ref()
let optionCallAPi = 0
const callApiProductList = async () => {
  if (optionCallAPi == 0) {
    const res = await getProductsList()
    if (Array.isArray(res.data) && res.data.length > 0) {
      listProductsTable.value = res.data.map((product) => ({
        productCode: product.code,
        value: product.productCode,
        name: product.name ?? '',
        price: product.price.toString(),
        productPropertyId: product.id.toString(),
        productPropertyCode: product.productPropertyCode
      }))
      optionCallAPi++
    }
  }
}
const getValueOfSelected = (_value, obj, scope) => {
  scope.row.productPropertyId = obj.productPropertyId
  scope.row.productCode = obj.value
  scope.row.productName = obj.name
  scope.row.price = obj.price
  scope.row.finalPrice = (parseInt(scope.row.quantity) * parseInt(scope.row.price)).toString()
}
onBeforeMount(async () => await callApiProductList())
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
      <template #default="props">
        <MultipleOptionsBox
          :fields="[
            t('reuse.productCode'),
            t('reuse.managementCode'),
            t('formDemo.productInformation')
          ]"
          filterable
          :items="listProductsTable"
          valueKey="productPropertyId"
          labelKey="productCode"
          :hiddenKey="['id']"
          :placeHolder="'Chọn mã sản phẩm'"
          :defaultValue="props.row.productPropertyCode"
          :clearable="false"
          @update-value="(value, obj) => getValueOfSelected(value, obj, props)"
          ><template #underButton>
            <div class="sticky z-999 bottom-0 bg-white dark:bg-black h-10">
              <div class="block h-1 w-[100%] border-top-1 pb-2"></div>
              <div class="text-base text-blue-400 cursor-pointer pl-2"
                >+ {{ t('formDemo.quicklyAddProducts') }}</div
              >
            </div>
          </template></MultipleOptionsBox
        >
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
      <button class="bg-[#F56C6C] pt-2 pb-2 pl-4 pr-4 text-[#fff] rounded">{{
        t('reuse.delete')
      }}</button>
    </el-table-column>
  </el-table>
</template>
