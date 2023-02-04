<script setup lang="ts">
import { ElTable, ElTableColumn } from 'element-plus'
import { onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { dateTimeFormat, moneyFormat } from '@/utils/format'
import { getLotHistory } from '@/api/Warehouse'
const { t } = useI18n()
const props = defineProps({
  id: {
    type: Number,
    default: NaN
  }
})

const tableData = ref([
  {
    accessory: '',
    createdAt: '',
    createdBy: '',
    description: '',
    inventory: '',
    lotId: '',
    nhapXuat: 0,
    orderCode: '',
    quantity: 0,
    ticketCode: '',
    type: '',
    unitName: '',
    unitPrice: '',
    updatedAt: '',
    importPrice: 0,
    totalImport: 0,
    totalInventoryMoney: 0,
    productPropertyQuality: ''
  }
])
const stack = ref<any[]>([])
const callAPI = async () => {
  await getLotHistory({ Id: props.id }).then((response) => {
    if (response.data.length == 0) {
      tableData.value.splice(0, 1)
      return
    }
    tableData.value = response.data.map((res) => ({
      accessory: res.accessory,
      createdAt: res.createdAt,
      createdBy: res.createdBy,
      description: res.description,
      inventory: res.inventory,
      lotId: res.lotId,
      nhapXuat: Number(res.nhapXuat),
      orderCode: res.orderCode,
      quantity: res.quantity,
      ticketCode: res.ticketCode,
      type: res.type,
      unitName: res.unitName,
      unitPrice: res.unitPrice,
      updatedAt: res.updatedAt,
      importPrice: res.importPrice,
      totalImport: res.totalImport,
      totalInventoryMoney: res.totalInventoryMoney,
      productPropertyQuality: res?.productPropertyQuality
    }))
  })
  stack.value[0] = tableData.value[0].quantity
  for (let i = 1; i < tableData.value.length; i++) {
    if (tableData.value[i].nhapXuat == 1) {
      stack.value[i] = stack.value[i - 1] + tableData.value[i].quantity
    } else {
      stack.value[i] = stack.value[i - 1] - tableData.value[i].quantity
    }
  }
}
onBeforeMount(() => callAPI())

const formatQuantity = (prop) => {
  if (prop.row?.nhapXuat == 1) {
    return `+${prop.row.quantity}`
  } else {
    return `-${prop.row.quantity}`
  }
}
const formatStack = (prop) => {
  return stack.value[prop.$index]
}
const formatImportMoney = (prop) => {
  if (prop.$index == 0) return moneyFormat(prop.row.importPrice)
  else return ''
}
const formatInventoryMoney = (prop) => {
  return moneyFormat(prop.row.importPrice * stack.value[prop.$index])
}
</script>
<template>
  <el-table :data="tableData" border style="width: 100%" header-row-class-name="breakWords">
    <template #append>
      <span class="pl-6/10 font-bold">{{ stack[stack.length - 1] }}</span>
      <span class="pl-1/15 font-bold">{{ moneyFormat(tableData[0]?.importPrice) }}</span>
      <span class="pl-1/15 font-bold">{{
        moneyFormat(stack[stack.length - 1] * Number(tableData[0]?.importPrice))
      }}</span>
    </template>
    <el-table-column :label="t('reuse.ticketCreatedDay')" :min-width="1">
      <template #default="prop">
        {{ dateTimeFormat(prop.row.createdAt) }}
      </template>
    </el-table-column>
    <el-table-column :label="t('reuse.importExportTransferWarehouse')" :min-width="1">
      <template #default="prop">
        {{ prop.row.type }}
      </template>
    </el-table-column>
    <el-table-column
      prop="ticketCode"
      :label="t('reuse.importExportTransferWarehouseCode')"
      :min-width="1"
    />
    <el-table-column prop="orderCode" :label="t('reuse.orderCode')" :min-width="1" />
    <el-table-column prop="accessory" :label="t('reuse.accessory')" :min-width="1" />
    <el-table-column prop="description" :label="t('reuse.note')" :min-width="1" />
    <el-table-column :label="t('reuse.quantity')" :min-width="1">
      <template #default="prop">
        {{ formatQuantity(prop) }}
      </template>
    </el-table-column>
    <el-table-column :label="t('reuse.stackInventory')" :min-width="1">
      <template #default="prop">
        {{ formatStack(prop) }}
      </template>
    </el-table-column>
    <el-table-column :label="t('reuse.importOrderPrice')" :min-width="1">
      <template #default="prop">
        {{ formatImportMoney(prop) }}
      </template>
    </el-table-column>
    <el-table-column :label="t('reuse.CashIntoInventory')" :min-width="1">
      <template #default="prop">
        {{ formatInventoryMoney(prop) }}
      </template>
    </el-table-column>
    <el-table-column prop="unitName" :label="t('reuse.unit')" :min-width="1" />
    <el-table-column
      prop="productPropertyQuality"
      :label="t('reuse.conditionProducts')"
      :min-width="1"
    />
  </el-table>
</template>
<style scoped>
:deep(.breakWords .cell) {
  word-break: break-word;
}
</style>
