<script setup lang="ts">
import tableDatetimeFilterBasicVue from '../../Components/TabsBase.vue'
import { getWareHouseList, getWareHouseTransactionList } from '@/api/Business'
import { wareHouse, wareHouseContainer } from '../Warehouse'
import { Tab } from '../../Components/Type'
const tabs: Array<Tab> = [
  {
    name: 'followinventory',
    label: 'Theo dõi tồn kho',
    api: getWareHouseList,
    column: wareHouse,
    customOperator: 4
  },
  {
    name: 'wareHouse',
    label: 'Lịch sử nhập/xuất/chuyển kho',
    api: getWareHouseTransactionList,
    column: wareHouseContainer,
    customOperator: 3
  }
]
const typeTable = 'Warehouse'
</script>
<template>
  <tableDatetimeFilterBasicVue title="orderList" :tabs="tabs" :customHeaderButton="typeTable" />
</template>
