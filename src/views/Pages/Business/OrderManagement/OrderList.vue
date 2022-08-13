<script setup lang="ts">
import tableDatetimeFilterBasicVue from '../../Components/table-datetimeFilter-basic.vue'
import { getSellOrderList, getRentalorderList } from '@/api/Business'
import { reactive, ref } from 'vue'
import { TabPanelName, ElTabs, ElTabPane } from 'element-plus'
import { sellOrder, rentalorder } from './OrderManagement'

let columns = reactive<TableColumn[]>([])
interface TableResponse<T = any> {
  total: number
  list: T[]
  pageNumber: number
  pageSize: number
}
let temporaryAPi: <T = any>(option: any) => Promise<IResponse<TableResponse<T>>> = getSellOrderList
const activeName = ref('first')

const onClick = (value: TabPanelName) => {
  switch (value) {
    case 0:
      columns = sellOrder
      temporaryAPi = getSellOrderList
      break
    case 1:
      columns = rentalorder
      temporaryAPi = getRentalorderList
      break
    case 2:
      columns = sellOrder
      temporaryAPi = getSellOrderList
      break
    case 3:
      columns = sellOrder
      temporaryAPi = getSellOrderList
      break
    case 4:
      columns = sellOrder
      temporaryAPi = getSellOrderList
      break
    default:
      break
  }
}
onClick(0)
</script>
<template>
  <ElTabs v-model="activeName" class="demo-tabs" @tab-change="onClick">
    <ElTabPane label="Đơn hàng bán" name="ordersell" />
    <ElTabPane label="Đơn hàng cho thuê" name="orderrental" />
    <ElTabPane label="Đơn hàng kí gửi" name="orderconsignment" />
    <ElTabPane label="Đơn hàng cầm đồ" name="orderpawn" />
    <ElTabPane label="Đơn hàng kí Spa" name="orderspa" />
  </ElTabs>
  <tableDatetimeFilterBasicVue title="orderList" :columns="columns" :api="temporaryAPi" />
</template>
