<script setup lang="ts">
import { getWareHouseList } from '@/api/Business'
import { getProductStorage } from '@/api/Warehouse'
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
  ElRadio
} from 'element-plus'
import { reactive, ref } from 'vue'
const { t } = useI18n()
defineProps({
  showDialog: {
    type: Boolean,
    default: false
  },
  transactionType: {
    type: Number,
    default: 0
  }
})
const closeDialog = () => {
  emit('close-dialog-warehouse', null)
}
const createNewLot = () => {
  emit('close-dialog-warehouse', warehouseData.value)
}
const saveOldLot = () => {
  emit('close-dialog-warehouse', warehouseData.value)
}
const emit = defineEmits(['close-dialog-warehouse'])
const warehouseForm = reactive({ quantity: 1, warehouseImportId: null, locationImportId: null })
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
  })
}
const lotData = ref()
const tempLotData = ref()
const loadingLot = ref(true)
const changeWarehouseData = async (warehouseId) => {
  warehouseForm.locationImportId = null
  await getWareHouseList({ WarehouseId: warehouseId })
    .then((res) => {
      lotData.value = res.data.map((item) => ({
        warehouseId: item.warehouseId,
        locationId: item.locationId,
        location: item.locationWarehouse,
        lotCode: item.lotCode,
        orderType: item.orderServiceType,
        inventory: item.inventory,
        unit: item?.productPropertyAttribute[2]?.value,
        createdAt: item.createdAt
      }))
    })
    .finally(() => (loadingLot.value = false))
  tempLotData.value = lotData.value
  warehouseData.value.warehouse = warehouseOptions.value.find((wh) => wh.value == warehouseId)
}
const filterLotData = (locationId) => {
  lotData.value = tempLotData.value
  lotData.value = lotData.value.filter((lot) => lot.locationId == locationId)
  warehouseData.value.location = locationOptions.value.find((wh) => wh.value == locationId)
}
const radioSelected = ref()
const handleCurrentChangeSelection = (val) => {
  const index = lotData.value.findIndex((lot) => lot == val)
  radioSelected.value = index
  warehouseData.value.lot = val
}

const warehouseData = ref({ quantity: 1, warehouse: '', location: '', lot: '' })
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
      <el-form-item label="1">
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
      @current-change="handleCurrentChangeSelection"
    >
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
        <template #default="props">
          {{ orderType(props.row.orderType) }}
        </template></el-table-column
      >
      <el-table-column prop="inventory" :label="t('reuse.inventory')" width="180" />
      <el-table-column prop="quantity" :label="t('reuse.quantity')" width="180" />
      <el-table-column prop="unit" :label="t('reuse.unit')" width="180" />
      <el-table-column prop="createdAt" :label="t('reuse.createDate')" width="180" />
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button class="w-[150px]" type="primary" @click="saveOldLot"
          >{{ t('reuse.saveOldLot') }}
        </el-button>
        <el-button class="w-[150px]" type="primary" @click="createNewLot"
          >{{ t('reuse.createNewLot') }}
        </el-button>
        <el-button class="w-[150px]" @click="closeDialog">{{ t('reuse.exit') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>
