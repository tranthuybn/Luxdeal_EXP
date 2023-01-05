<script setup lang="ts">
import { getProductStorage, getWarehouseLot } from '@/api/Warehouse'
import { useI18n } from '@/hooks/web/useI18n'
import { orderType } from '@/utils/format'
import {
  ElButton,
  ElDivider,
  ElDialog,
  ElForm,
  ElSelect,
  ElFormItem,
  ElOption,
  ElTable,
  ElTableColumn,
  ElRadio
} from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { PropType, reactive, ref, watch } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { dateTimeFormat } from '@/utils/format'

const { required } = useValidator()
const { t } = useI18n()
const props = defineProps({
  showDialog: {
    type: Boolean,
    default: false
  },
  transactionType: {
    type: Number,
    default: 0
  },
  productPropertyId: {
    type: Number,
    default: 0
  },
  warehouseFormData: {
    type: Object as PropType<ChooseWarehouse>,
    default: () => {}
  },
  warehouseIDParent: {
    type: Number,
    default: 0
  },
  quantitySpa: {
    type: Number,
    default: 0
  },
  changeWH: {
    type: Boolean,
    default: false
  }
})

type ChooseWarehouse = {
  quantity: number
  warehouseId: number
  locationId: number
  lotId: number
}
type ImportWarehouse = {
  quantity: number
  warehouseImportId: number
  locationImportId: number | undefined
  lotId: number
}

const saveOldLot = () => {
  radioSelected.value == -1
  emit('close-dialog-warehouse', warehouseData.value)
}
const emit = defineEmits(['close-dialog-warehouse'])

const warehouseForm = reactive<ImportWarehouse>({} as ImportWarehouse)
watch(
  () => props.warehouseFormData,
  () => {
    warehouseForm.quantity = props.warehouseFormData.quantity
    warehouseForm.warehouseImportId = props.warehouseFormData.warehouseId
    warehouseForm.locationImportId = props.warehouseFormData.locationId
    radioSelected.value = lotData.value.findIndex((lot) => lot.Id == props.warehouseFormData.lotId)
  }
)

const closeDialog = () => {
  emit('close-dialog-warehouse', null)
}

const rules = reactive<FormRules>({
  quantity: [required()],
  warehouseImportId: [required()],
  locationImportId: [required()]
})
const warehouseOptions = ref()
const loadingWarehouse = ref(true)
const locationOptions = ref()
const getLocation = async (parentId) => {
  await getProductStorage({ Id: parentId }).then((res) => {
    locationOptions.value = res.data[0].children.map((item) => ({
      value: item.id,
      label: item.name
    }))
    loadingWarehouse.value = false
  })
}
const lotData = ref()
const tempLotData = ref()
const loadingLot = ref(true)
const totalInventory = ref(0)
const changeWarehouseData = async (warehouseId) => {
  warehouseForm.locationImportId = undefined
  await getWarehouseLot({
    WarehouseId: props.warehouseIDParent,
    productPropertyId: props.productPropertyId
  })
    .then((res) => {
      lotData.value = res.data.map((item) => ({
        warehouseId: item.warehouseId,
        locationId: item.locationId,
        location: item.locationName,
        lotCode: item.code,
        orderType: item.serviceType,
        inventory: item.inventory,
        unit: item?.unitName,
        createdAt: item.createdAt
      }))
    })
    .finally(() => ((loadingLot.value = false), (radioSelected.value = -1), calculateInventory()))
  tempLotData.value = lotData.value
  warehouseData.value.warehouse = warehouseOptions.value.find((wh) => wh.value == warehouseId)
}

const filterLotData = (locationId) => {
  lotData.value = tempLotData.value
  lotData.value = lotData.value.filter((lot) => lot.locationId == locationId)
  warehouseData.value.location = locationOptions.value.find((wh) => wh.value == locationId)
  calculateInventory()
}
const calculateInventory = () => {
  totalInventory.value = lotData.value.reduce(function (accumulator, curValue) {
    return accumulator + curValue.inventory
  }, 0)
}
const calculateQuantity = (scope) => {
  if (scope.row.inventory >= warehouseForm.quantity) {
    return warehouseForm.quantity
  } else {
    return scope.row.inventory
  }
}
const radioSelected = ref(-1)
const rowClick = (row, __column, _event) => {
  const index = lotData.value.findIndex((lot) => lot == row)
  index == radioSelected.value ? (radioSelected.value = -1) : (radioSelected.value = index)
  warehouseData.value.lot = row
}
const warehouseData = ref({
  quantity: 0,
  warehouse: { value: undefined, label: undefined },
  location: { value: undefined, label: undefined },
  lot: { value: undefined, label: undefined }
})

const ruleFormRef = ref<FormInstance>()
</script>
<template>
  <el-dialog
    :model-value="showDialog"
    :title="t('formDemo.inventoryInformation')"
    width="65%"
    align-center
    class="z-50"
    @close="closeDialog"
  >
    <template #header>
      <h1>{{ t('reuse.chooseWarehouse') }}</h1>
      <el-divider class="!mb-0" />
    </template>

    <el-form
      ref="ruleFormRef"
      :model="warehouseForm"
      :rules="rules"
      label-width="120px"
      label-position="top"
    >
      <div class="flex gap-2 mb-2">
        <p>Số lượng yêu cầu Spa:</p>
        <p class="quantity">{{ quantitySpa }}</p>
      </div>

      <div class="w-full">
        <div class="title-location mb-1">
          {{ t('reuse.chooseLocation') }}
        </div>
        <el-form-item prop="locationExportId" class="w-full">
          <el-select
            class="w-full"
            v-model="warehouseForm.locationImportId"
            @click="
              () => {
                getLocation(props.warehouseIDParent)
              }
            "
            @change="
              () => {
                changeWarehouseData
                filterLotData
              }
            "
          >
            <el-option
              v-for="item in locationOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :placeholder="t('reuse.chooseLocation')"
            />
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <div>{{ t('reuse.lotList') }}</div>
    <el-table
      :data="lotData"
      style="width: 100%"
      :loading="loadingLot"
      highlight-current-row
      border
      @row-click="rowClick"
      ref="singleTableRef"
    >
      <template #append>
        <span class="pl-650px font-bold">{{ totalInventory }}</span>
        <span class="pl-180px font-bold">{{ quantitySpa }}</span>
      </template>
      <el-table-column label="" width="70">
        <template #default="scope">
          <el-radio
            v-model="radioSelected"
            :label="scope.$index"
            style="color: #fff; margin-right: -25px"
            ><span></span
          ></el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="location" :label="t('reuse.location')" width="180" />
      <el-table-column prop="lotCode" :label="t('reuse.lotCode')" width="180" />
      <el-table-column prop="orderType" :label="t('reuse.type')" width="180">
        <template #default="scope">
          {{ orderType(scope.row.orderType) }}
        </template></el-table-column
      >
      <el-table-column prop="inventory" :label="t('reuse.iventoryy')" width="100" />
      <el-table-column prop="quantity" :label="t('reuse.numberInput')" width="180">
        <template #default="scope">
          {{ calculateQuantity(scope) }}
        </template>
      </el-table-column>
      <el-table-column prop="unit" :label="t('reuse.unit')" width="150" />
      <el-table-column prop="createdAt" :label="t('reuse.createDate')">
        <template #default="scope">
          {{ dateTimeFormat(scope.row.createdAt) }}
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          class="w-[150px]"
          type="primary"
          @click="saveOldLot"
          :disabled="lotData == undefined || lotData?.length == 0"
          >{{ t('reuse.SpaLotSelected') }}
        </el-button>
        <el-button class="w-[150px]" @click="closeDialog">{{ t('reuse.exit') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>
