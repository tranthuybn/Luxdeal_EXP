<script setup lang="ts">
import tableDatetimeFilterBasicVue from '../../Components/TableInTab-base.vue'
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
    column: sellOrder
  },
  {
    name: 'orderRental',
    label: t('reuse.orderRental'),
    api: getRentalorderList,
    column: rentalorder
  },
  {
    name: 'orderDeposit',
    label: t('reuse.orderDeposit'),
    api: getOrderDepositList,
    column: orderDeposit
  },
  {
    name: 'orderPawn',
    label: t('reuse.orderPawn'),
    api: getOrderPawnList,
    column: orderPawn
  },
  {
    name: 'orderSpa',
    label: t('reuse.orderSpa'),
    api: getOrderSpaList,
    column: orderSpa
  }
]
</script>
<template>
  <tableDatetimeFilterBasicVue title="orderList" :tabs="tabs" />
</template>
