<script setup lang="ts">
import tableDatetimeFilterBasicVue from '../Components/tableType02-datetimefilter-basic.vue'
import { getWareHouseList } from '@/api/Business'
import { wareHouse } from './Warehouse'
import { Tab } from '../Components/Type'
const tabs: Array<Tab> = [
  {
    name: 'wareHouseList',
    label: 'Quản lý kho',
    api: getWareHouseList,
    column: wareHouse
  },
  {
    name: 'followinventory',
    label: 'Theo dõi tồn kho',
    api: getWareHouseList,
    column: wareHouse
  },
  {
    name: 'wareHouse',
    label: 'Nhập kho',
    api: getWareHouseList,
    column: wareHouse
  },
  {
    name: 'export',
    label: 'Xuất kho',
    api: getWareHouseList,
    column: wareHouse
  },
  {
    name: 'warehouseTransfer',
    label: 'Chuyển kho',
    api: getWareHouseList,
    column: wareHouse
  }
]
</script>
<template>
  <tableDatetimeFilterBasicVue title="orderList" :tabs="tabs" />
</template>
