<script setup lang="ts">
import tableDatetimeFilterBasicVue from '../../Components/TabsBase.vue'
import {
  getSellOrderList,
  getRentalorderList,
  getOrderDepositList,
  getOrderPawnList,
  getOrderSpaList
} from '@/api/Business'
import { sellOrder, rentalorder, orderDeposit, orderPawn, orderSpa } from './OrderManagement'
import { Tab } from '../../Components/Type'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
const tabs: Array<Tab> = [
  {
    name: 'orderSell',
    label: t('reuse.orderSell'),
    api: getSellOrderList,
    column: sellOrder,
    titleAdd: 'formDemo.addNewSalesOrders'
  },
  {
    name: 'orderRental',
    label: t('reuse.orderRental'),
    api: getRentalorderList,
    column: rentalorder,
    titleAdd: 'formDemo.addnewRentalOrders'
  },
  {
    name: 'orderDeposit',
    label: t('reuse.orderDeposit'),
    api: getOrderDepositList,
    column: orderDeposit,
    titleAdd: 'formDemo.addNewConsignmentOrders'
  },
  {
    name: 'orderPawn',
    label: t('reuse.orderPawn'),
    api: getOrderPawnList,
    column: orderPawn,
    titleAdd: 'formDemo.addNewPawnOrders'
  },
  {
    name: 'orderSpa',
    label: t('reuse.orderSpa'),
    api: getOrderSpaList,
    column: orderSpa,
    titleAdd: 'formDemo.addNewSpaOrders'
  }
]
</script>
<template>
  <tableDatetimeFilterBasicVue :selection="true" title="orderList" :tabs="tabs" />
</template>
