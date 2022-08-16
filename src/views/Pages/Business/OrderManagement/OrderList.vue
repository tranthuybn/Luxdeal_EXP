<script setup lang="ts">
import tableDatetimeFilterBasicVue from '../../Components/tableType01-datetimefilter-basic.vue'
import { getSellOrderList, getRentalorderList } from '@/api/Business'
import { sellOrder, rentalorder } from './OrderManagement'
import { Tab } from '../../Components/Type'
const tabs: Array<Tab> = [
  {
    name: 'orderSell',
    label: 'Đơn hàng bán',
    api: getSellOrderList,
    column: sellOrder
  },
  {
    name: 'orderRental',
    label: 'Đơn hàng cho thuê',
    api: getRentalorderList,
    column: rentalorder
  },
  {
    name: 'orderConsignment',
    label: 'Đơn hàng kí gửi',
    api: getSellOrderList,
    column: sellOrder
  },
  {
    name: 'orderPawn',
    label: 'Đơn hàng cầm đồ',
    api: getSellOrderList,
    column: sellOrder
  },
  {
    name: 'orderSpa',
    label: 'Đơn hàng kí Spa',
    api: getSellOrderList,
    column: sellOrder
  }
]
</script>
<template>
  <tableDatetimeFilterBasicVue title="orderList" :tabs="tabs" />
</template>
