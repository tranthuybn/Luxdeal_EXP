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
    titleAdd: 'formDemo.addNewSalesOrders',
    customOperator: 5
  },
  {
    name: 'orderRental',
    label: t('reuse.orderRental'),
    api: getRentalorderList,
    column: rentalorder,
    titleAdd: 'formDemo.addNewRentalOrders',
    customOperator: 5
  },
  {
    name: 'orderDeposit',
    label: t('reuse.orderDeposit'),
    api: getOrderDepositList,
    column: orderDeposit,
    titleAdd: 'formDemo.addNewConsignmentOrders',
    customOperator: 5
  },
  {
    name: 'orderPawn',
    label: t('reuse.orderPawn'),
    api: getOrderPawnList,
    column: orderPawn,
    titleAdd: 'formDemo.addNewPawnOrders',
    customOperator: 5
  },
  {
    name: 'orderSpa',
    label: t('reuse.orderSpa'),
    api: getOrderSpaList,
    column: orderSpa,
    titleAdd: 'formDemo.addNewSpaOrders',
    customOperator: 5
  }
]
</script>
<template>
  <tableDatetimeFilterBasicVue :selection="true" title="orderList" :tabs="tabs" />
</template>
