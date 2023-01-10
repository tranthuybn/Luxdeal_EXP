<script setup lang="ts">
import { ElTable, ElTableColumn } from 'element-plus'
import { onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { dateTimeFormat } from '@/utils/format'
const { t } = useI18n()
const props = defineProps({
  id: {
    type: Number,
    default: NaN
  }
})

const tableData = ref([{}])
const callAPI = async () => {
  console.log(props.id)
  //   await getWareHouseList({ Id: props.id }).then((res) => {
  //     tableData.value = res.data.map(() => {})
  //   })
  // stack[0] = res.data[0].quantity
  // stack for(var i =1;i<res.data.length<i++){
  // if(nhap){
  // stack[i] = stack[i-1] + res.data[i].quantity
  // }
  // else xuat
  // stack[i] = stack[i] - res.data[i].quantity
  // }
}
onBeforeMount(() => callAPI())

const formatQuantity = (prop) => {
  if (prop.row?.nhapXuat == 1) {
    return `+${prop.row.quantity}`
  } else {
    return `-${prop.row.quantity}`
  }
}
</script>
<template>
  <el-table :data="tableData" border style="width: 100%" header-row-class-name="breakWords">
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
        {{ prop.row.quantity }}
      </template>
    </el-table-column>
    <el-table-column :label="t('reuse.importOrderPrice')" :min-width="1">
      <template #default="prop">
        {{ prop.row.unitPrice }}
      </template>
    </el-table-column>
    <el-table-column :label="t('reuse.CashIntoInventory')" :min-width="1">
      <template #default="prop">
        {{ prop.row.quantity * prop.row.unitPrice }}
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
