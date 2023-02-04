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
  ElTable,
  ElTableColumn,
  ElRadio,
  ElMessage
} from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { computed, reactive, ref, watch } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { dateTimeFormat } from '@/utils/format'
import moment from 'moment'

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
    type: Object,
    default: () => {}
  },
  orderId: {
    type: Number,
    default: 0
  },
  warehouse: {
    type: Object,
    default: () => {}
  },
  serviceType: {
    type: Number,
    default: 6
  }
})

const closeDialog = () => {
  emit('close-dialog-warehouse', null)
}
const createNewLot = async () => {
  const Code = 'lot' + moment().format('hhmmss')
  const res = await createWarehouseLot(
    FORM_IMAGES({
      OrderId: isNaN(props.orderId) || props.orderId == 0 ? null : props.orderId,
      Code: Code,
      WarehouseId: props.warehouse?.value,
      LocationId: warehouseData.value.location.value,
      ProductPropertyId: props.productPropertyId
    })
  )
  if (res) {
    warehouseData.value.lot = { value: res.data, label: Code }
    warehouseData.value.quantity = warehouseForm.value.quantity
  }
  emit('close-dialog-warehouse', warehouseData.value)
}
const saveOldLot = () => {
  radioSelected.value == -1
  warehouseData.value.quantity = warehouseForm.value.quantity
  warehouseData.value.lot.value = warehouseData.value.lot['id']
  emit('close-dialog-warehouse', warehouseData.value)
}
const emit = defineEmits(['close-dialog-warehouse'])

const warehouseForm = computed(() => {
  return props.warehouseFormData
})
const rules = reactive<FormRules>({
  quantity: [required()],
  warehouseImportId: [required()],
  locationImportId: [required()]
})
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
  warehouseForm.value.locationImportId = undefined
  await getWarehouseLot({ WarehouseId: warehouseId, productPropertyId: props.productPropertyId })
    .then((res) => {
      lotData.value = res.data.map((item) => ({
        id: item.id,
        warehouseId: item.warehouseId,
        locationId: item.locationId,
        location: item.locationName,
        lotCode: item.code,
        orderType: item.serviceType,
        inventory: item.inventory,
        unit: item?.unitName,
        createdAt: item.createdAt
      }))
      lotData.value = lotData.value.filter((lot) => lot.orderType == 6)
    })
    .finally(() => ((loadingLot.value = false), (radioSelected.value = -1), calculateInventory()))
  tempLotData.value = lotData.value
}
const filterLotData = (locationId) => {
  if (lotData.value !== undefined) {
    lotData.value = tempLotData.value
    lotData.value = lotData.value.filter((lot) => lot.locationId == locationId)
    calculateInventory()
  }
  warehouseData.value.location = locationOptions.value.find((wh) => wh.value == locationId)
}
const checkLocationData = () => {
  if (locationOptions.value == undefined || locationOptions.value.length == 0) {
    ElMessage({
      message: t('reuse.warehouseDoesntHaveLocation'),
      type: 'warning'
    })
  }
}
const calculateInventory = () => {
  if (lotData.value !== undefined) {
    totalInventory.value = lotData.value.reduce(function (accumulator, curValue) {
      return accumulator + curValue.inventory
    }, 0)
  }
}
const calculateQuantity = (scope) => {
  if (scope.row.inventory >= warehouseForm.value.quantity) {
    return warehouseForm.value.quantity
  } else {
    return scope.row.inventory
  }
}
const radioSelected = ref(-1)
const rowClick = (row, __column, _event) => {
  if (lotData.value !== undefined) {
    warehouseData.value.lot = row
  }
}
const warehouseData = ref({
  quantity: 0,
  warehouse: { value: undefined, label: undefined },
  location: { value: undefined, label: undefined },
  lot: { value: undefined, label: '' }
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

//fix bug
watch(
  () => props.showDialog,
  async () => {
    await getLocation(props.warehouse?.value)
    props.orderId == 0 ? await changeWarehouseData(props.warehouse?.value) : ''
  }
)
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
        {{ warehouseForm.quantity }}
      </el-form-item>
      <el-form-item :label="t('reuse.type')" prop="serviceType">
        {{ orderType(serviceType) }}
      </el-form-item>
      <div class="flex import" v-if="transactionType != 2">
        <el-form-item :label="t('reuse.chooseLocation')" prop="locationImportId" class="w-full">
          <el-select
            class="w-full"
            v-model="warehouseForm.locationImportId"
            @change="filterLotData"
            @focus="checkLocationData"
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
    </el-form>
    <div v-if="orderId == 0 && transactionType !== 3">
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
          <span class="pl-180px font-bold">{{ warehouseForm.quantity }}</span>
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
        <el-table-column prop="createdAt" :label="t('reuse.createDate')" width="180">
          <template #default="scope">
            {{ dateTimeFormat(scope.row.createdAt) }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          v-if="orderId == 0 && transactionType !== 3"
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
