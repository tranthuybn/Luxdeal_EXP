<script setup lang="ts">
import { createWarehouseLot, getProductStorage, getWarehouseLot } from '@/api/Warehouse'
import { useI18n } from '@/hooks/web/useI18n'
import { FORM_IMAGES, orderType } from '@/utils/format'
import {
  ElButton,
  ElDivider,
  ElDialog,
  ElForm,
  ElSelect,
  ElFormItem,
  ElOption,
  ElInput,
  ElTable,
  ElTableColumn,
  ElRadio,
  ElMessage
} from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { PropType, reactive, ref, watch } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'

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
const closeDialog = () => {
  emit('close-dialog-warehouse', null)
}
const createNewLot = async () => {
  const res = await createWarehouseLot(
    FORM_IMAGES({
      WarehouseId: warehouseData.value.warehouse.value,
      LocationId: warehouseData.value.location.value,
      ProductPropertyId: props.productPropertyId
    })
  )
  if (res) {
    warehouseData.value.lot.value = res.data
  }
  emit('close-dialog-warehouse', warehouseData.value)
}
const saveOldLot = () => {
  warehouseData.value.quantity > totalInventory.value
    ? ElMessage({
        message: 'not enough',
        type: 'warning'
      })
    : radioSelected.value == -1
    ? ElMessage({
        message: 'selected row',
        type: 'warning'
      })
    : emit('close-dialog-warehouse', warehouseData.value)
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
const rules = reactive<FormRules>({
  quantity: [required()],
  warehouseImportId: [required()],
  locationImportId: [required()]
})
const warehouseOptions = ref()
const loadingWarehouse = ref(true)
const locationOptions = ref()
let callAPIWarehouseTimes = 0
const callAPIWarehouse = async () => {
  if (callAPIWarehouseTimes == 0) {
    await getProductStorage({
      pageSize: 1000,
      pageIndex: 1
    }).then((res) => {
      warehouseOptions.value = res.data
        .filter((warehouse) => warehouse.children.length > 0)
        .map((item) => ({
          value: item.id,
          label: item.name
        }))
      loadingWarehouse.value = false
      callAPIWarehouseTimes++
    })
  }
}
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
  await getWarehouseLot({ WarehouseId: warehouseId, productPropertyId: props.productPropertyId })
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
      console.log('res:', lotData.value)
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
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      createNewLot()
    }
  })
}
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
      <el-form-item :label="t('reuse.quantity')" prop="quantity">
        <el-input
          v-model="warehouseForm.quantity"
          type="number"
          :min="1"
          @change="
            (data) => {
              warehouseData.quantity = Number(data)
            }
          "
        />
      </el-form-item>
      <div class="flex import" v-if="transactionType != 2">
        <div class="w-1/2">
          <el-form-item
            :label="t('reuse.chooseImportWarehouse')"
            prop="warehouseImportId"
            class="w-full"
          >
            <el-select
              class="w-full"
              v-model="warehouseForm.warehouseImportId"
              @click="callAPIWarehouse"
              :loading="loadingWarehouse"
              @change="(data) => changeWarehouseData(data)"
            >
              <el-option
                v-for="item in warehouseOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="pl-8 w-1/2">
          <el-form-item :label="t('reuse.chooseLocation')" prop="locationImportId" class="w-full">
            <el-select
              class="w-full"
              v-model="warehouseForm.locationImportId"
              @click="
                () => {
                  getLocation(warehouseForm.warehouseImportId)
                }
              "
              @change="filterLotData"
            >
              <el-option
                v-for="item in locationOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
      </div>
      <div class="flex export" v-if="transactionType != 1">
        <div class="w-1/2">
          <el-form-item label="2" class="w-full">
            <el-select
              class="w-full"
              v-model="warehouseForm.warehouseImportId"
              @click="callAPIWarehouse"
              :loading="loadingWarehouse"
              @change="(data) => changeWarehouseData(data)"
            >
              <el-option
                v-for="item in warehouseOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="pl-8 w-1/2">
          <el-form-item label="3" class="w-full">
            <el-select
              class="w-full"
              v-model="warehouseForm.locationImportId"
              @click="
                () => {
                  getLocation(warehouseForm.warehouseImportId)
                }
              "
              @change="filterLotData"
            >
              <el-option
                v-for="item in locationOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
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
        <span class="pl-180px font-bold">{{ warehouseData.quantity }}</span>
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
      <el-table-column prop="inventory" :label="t('reuse.iventoryy')" width="180" />
      <el-table-column prop="quantity" :label="t('reuse.numberInput')" width="180">
        <template #default="scope">
          {{ calculateQuantity(scope) }}
        </template>
      </el-table-column>
      <el-table-column prop="unit" :label="t('reuse.unit')" width="180" />
      <el-table-column prop="createdAt" :label="t('reuse.createDate')" width="180" />
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          class="w-[150px]"
          type="primary"
          @click="saveOldLot"
          :disabled="lotData == undefined || lotData?.length == 0"
          >{{ t('reuse.importToSelectedLot') }}
        </el-button>
        <el-button
          class="w-[150px]"
          type="primary"
          :disabled="radioSelected !== -1"
          @click="submitForm(ruleFormRef)"
          >{{ t('reuse.createNewLot') }}
        </el-button>
        <el-button class="w-[150px]" @click="closeDialog">{{ t('reuse.exit') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>
