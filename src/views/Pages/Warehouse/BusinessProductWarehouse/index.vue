<script setup lang="ts">
import tableDatetimeFilterBasicVue from '../../Components/TabsBase.vue'
import { getWareHouseList } from '@/api/Business'
import { wareHouse } from '../Warehouse'
import { Tab } from '../../Components/Type'
const tabs: Array<Tab> = [
  {
    name: 'followinventory',
    label: 'Theo dõi tồn kho',
    api: getWareHouseList,
    column: wareHouse
  },
  {
    name: 'wareHouse',
    label: 'Lịch sử nhập kho',
    api: getWareHouseList,
    column: wareHouse
  },
  {
    name: 'export',
    label: 'Lịch sử xuất kho',
    api: getWareHouseList,
    column: wareHouse
  },
  {
    name: 'warehouseTransfer',
    label: 'Lịch sử chuyển kho',
    api: getWareHouseList,
    column: wareHouse
  },
  {
    name: 'internalSpa',
    label: 'Lịch sử spa nội bộ',
    api: getWareHouseList,
    column: wareHouse
  }
]
const typeTable = 'Warehouse'
</script>
<template>
  <tableDatetimeFilterBasicVue title="orderList" :tabs="tabs" :customHeaderButton="typeTable" />
</template>
