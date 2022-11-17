<script setup lang="ts">
import { getWareHouseList } from '@/api/Business'
import { getProductStorage } from '@/api/Warehouse'
import { useI18n } from '@/hooks/web/useI18n'
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
  ElTableColumn
} from 'element-plus'
import { reactive, ref } from 'vue'
const { t } = useI18n()
defineProps({
  showDialog: {
    type: Boolean,
    default: false
  },
  type: {
    type: Number,
    default: 0
    //1:Nhập, 2.Xuất, 3.Chuyển kho
  }
})
const closeDialog = () => {
  emit('close-dialog-warehouse')
}
const emit = defineEmits(['close-dialog-warehouse'])
const warehouseForm = reactive({ quantity: null, warehouseImportId: null, locationImportId: null })
const rules = reactive({ quantity: [{ required: true }] })
const warehouseOptions = ref()
const loadingWarehouse = ref(true)
const locationOptions = ref()
let callAPIWarehouseTimes = 0
const callAPIWarehouse = async () => {
  if (callAPIWarehouseTimes == 0) {
    await getProductStorage({ pageSize: 1000, pageIndex: 1 }).then((res) => {
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
    callAPIWarehouseTimes++
  })
}
const lotData = ref()
const loadingLot = ref(true)
const changeWarehouseData = async (warehouseId) => {
  warehouseForm.locationImportId = null
  await getWareHouseList({ WarehouseId: warehouseId })
    .then((res) => {
      lotData.value = res.data.map()
    })
    .finally(() => (loadingLot.value = false))
}
const filterLotData = (locationId) => {
  lotData.value.filter((lot) => (lot.LocationId = locationId))
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
      <el-divider />
    </template>

    <el-form
      ref="ruleFormRef"
      :model="warehouseForm"
      :rules="rules"
      label-width="120px"
      label-position="top"
    >
      <el-form-item label="1">
        <el-input v-model="warehouseForm.quantity" />
      </el-form-item>
      <div class="flex">
        <div class="w-1/2">
          <el-form-item label="3" class="w-full">
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
          <el-form-item label="2" class="w-full">
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
    <el-table :data="lotData" style="width: 100%" :loading="loadingLot">
      <el-table-column prop="location" label="location" width="180" />
      <el-table-column prop="lotCode" label="lotCode" width="180" />
      <el-table-column prop="orderType" label="orderType" width="180" />
      <el-table-column prop="inventory" label="inventory" width="180" />
      <el-table-column prop="quantity" label="quantity" width="180" />
      <el-table-column prop="unit" label="unit" width="180" />
      <el-table-column prop="createdAt" label="createdAt" width="180" />
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button class="w-[150px]" type="primary" @click="closeDialog"
          >{{ t('reuse.saveOldLot') }}
        </el-button>
        <el-button class="w-[150px]" type="primary" @click="closeDialog"
          >{{ t('reuse.createNewLot') }}
        </el-button>
        <el-button class="w-[150px]" @click="closeDialog">{{ t('reuse.exit') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>
