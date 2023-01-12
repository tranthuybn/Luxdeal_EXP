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
  ElInput,
  ElTable,
  ElTableColumn,
  ElMessage
} from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { computed, onBeforeMount, reactive, ref } from 'vue'
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
const getSelection = () => {
  const rowSelected = multipleTableRef.value!.getSelectionRows()
  if (rowSelected.length == 0) {
    return
  }
  if (warehouseForm.value.quantity == totalExport.value) {
    warehouseData.value.exportLots = rowSelected.map((item) => ({
      value: item.id,
      quantity: item.exportQuantity
    }))
    warehouseData.value.location = rowSelected.map((item) => item.location).toString()
    warehouseData.value.lot = rowSelected.map((item) => item.lotCode).toString()
    warehouseData.value.unit = rowSelected[0].unit

    emit('close-dialog-warehouse', warehouseData.value)
  } else {
    ElMessage({
      message: t('reuse.moreOrLessQuantity'),
      type: 'warning'
    })
  }
}
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      saveOldLot()
    }
  })
}
const saveOldLot = () => {
  getSelection()
}
const emit = defineEmits(['close-dialog-warehouse', 'close-dialog'])

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
const getLocation = async () => {
  await getProductStorage({ Id: props.warehouse.value }).then((res) => {
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
        createdAt: item.createdAt,
        exportQuantity: 0
      }))
    })
    .finally(() => ((loadingLot.value = false), (radioSelected.value = -1), calculateInventory()))
  tempLotData.value = lotData.value
}
const filterLotData = (locationId) => {
  lotData.value = tempLotData.value
  lotData.value = lotData.value.filter((lot) => lot.locationId == locationId)
  warehouseData.value.location = locationOptions.value.find((wh) => wh.value == locationId)
  calculateInventory()
}
const calculateInventory = () => {
  if (lotData.value !== undefined) {
    totalInventory.value = lotData?.value.reduce(function (accumulator, curValue) {
      return accumulator + curValue.inventory
    }, 0)
  }
}
const calculateQuantity = (scope) => {
  if (scope.row.exportQuantity > 0) {
    return scope.row.exportQuantity
  } else {
    return ' '
  }
}

const multipleSelection = ref()
const radioSelected = ref(-1)
const totalExport = ref(0)
const selectedRow: number[] = []
const rowClick = (_selection, curRow) => {
  if (warehouseForm.value.quantity == 0 || warehouseForm.value.quantity == null) {
    ElMessage({
      message: t('reuse.pleaseChooseQuantity'),
      type: 'warning'
    })
    multipleTableRef.value!.toggleRowSelection(curRow, false)
    return
  }
  if (curRow.inventory < 1) {
    ElMessage({
      message: t('reuse.pleaseChooseLotHasInventory'),
      type: 'warning'
    })
    multipleTableRef.value!.toggleRowSelection(curRow, false)
    return
  }
  if (totalExport.value == warehouseForm.value.quantity) {
    ElMessage({
      message: t('reuse.moreOrLessQuantity'),
      type: 'warning'
    })
    multipleTableRef.value!.toggleRowSelection(curRow, false)
    return
  }

  multipleSelection.value = curRow
  const index: number = lotData.value.findIndex((lot) => lot == curRow)

  //Kiểm tra xem đã check chưa
  if (!selectedRow.includes(index)) {
    //nếu chưa check thì +
    selectedRow.push(index)

    //nếu lấy hết mà vẫn chưa đủ số lượng
    if (warehouseForm.value.quantity > curRow.inventory + totalExport.value) {
      lotData.value[index].exportQuantity = curRow.inventory
      totalExport.value += Number(lotData.value[index].exportQuantity)
      return
    }
    //nếu lấy hết mà thừa số lượng thì lấy 1 phần
    if (warehouseForm.value.quantity < curRow.inventory + totalExport.value) {
      //mong đúng :))
      lotData.value[index].exportQuantity = warehouseForm.value.quantity - totalExport.value
      totalExport.value += Number(lotData.value[index].exportQuantity)
      return
    }
  } else {
    selectedRow.splice(selectedRow.findIndex((select) => select == index))
    totalExport.value -= Number(curRow.exportQuantity)
    lotData.value[index].exportQuantity = 0
  }
}
const warehouseData = ref({
  quantity: 0,
  exportLots: [{ value: undefined, label: undefined, quantity: undefined }],
  location: '',
  lot: '',
  unit: ''
})

const ruleFormRef = ref<FormInstance>()
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const closeDialogExport = () => {
  emit('close-dialog')
}

//fix bug
onBeforeMount(async () => {
  await changeWarehouseData(props.warehouse?.value)
})
</script>
<template>
  <el-dialog
    :model-value="showDialog"
    :title="t('formDemo.inventoryInformation')"
    width="65%"
    align-center
    class="z-50"
    @close="closeDialogExport"
    destroy-on-close
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
          :disabled="orderId != 0"
          type="number"
          :min="1"
          @change="
            (data) => {
              warehouseData.quantity = Number(data)
            }
          "
        />
      </el-form-item>
      <div class="flex export">
        <div>
          <el-form-item label="Chọn vị trí" class="w-full">
            <el-select
              class="w-full"
              v-model="warehouseForm.locationImportId"
              @click="
                () => {
                  getLocation()
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
      ref="multipleTableRef"
      @select="rowClick"
      style="width: 100%"
      :loading="loadingLot"
      highlight-current-row
      border
    >
      <template #append>
        <span class="pl-650px font-bold">{{ totalInventory }}</span>
        <span class="pl-180px font-bold">{{ warehouseData.quantity }}</span>
      </template>
      <el-table-column type="selection" width="55" />
      <el-table-column prop="location" :label="t('reuse.location')" width="180" />
      <el-table-column prop="lotCode" :label="t('reuse.lotCode')" width="180" />
      <el-table-column prop="orderType" :label="t('reuse.type')" width="180">
        <template #default="scope">
          {{ orderType(scope.row.orderType) }}
        </template></el-table-column
      >
      <el-table-column prop="inventory" :label="t('reuse.iventoryy')" width="180" />
      <el-table-column
        v-if="transactionType == 1"
        prop="quantity"
        :label="t('reuse.numberInput')"
        width="180"
      >
        <template #default="scope">
          {{ calculateQuantity(scope) }}
        </template>
      </el-table-column>
      <el-table-column
        v-else-if="transactionType == 2"
        prop="quantity"
        :label="t('reuse.exportQuantity')"
        width="180"
      >
        <template #default="scope">
          {{ calculateQuantity(scope) }}
        </template>
      </el-table-column>
      <el-table-column prop="unit" :label="t('reuse.unit')" width="180" />
      <el-table-column
        v-if="transactionType == 1"
        prop="createdAt"
        :label="t('reuse.createDate')"
        width="180"
      >
        <template #default="scope">
          {{ dateTimeFormat(scope.row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column
        v-else-if="transactionType == 2"
        prop="createdAt"
        :label="t('reuse.firstEntryDate')"
        width="180"
      >
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
          @click="submitForm(ruleFormRef)"
          :disabled="lotData == undefined || lotData?.length == 0"
          >{{ t('reuse.exportToSelectedLot') }}
        </el-button>
        <el-button class="w-[150px]" @click="closeDialog">{{ t('reuse.exit') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>
