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
import { provide, reactive } from 'vue'
import { API_ORDER } from '@/utils/API.Variables'

const { t } = useI18n()
let params = reactive({ ServiceType: 1 })
provide('parameters', {
  params
})
const tabs: Array<Tab> = [
  {
    name: API_ORDER[0].label,
    label: t('reuse.orderSell'),
    api: getSellOrderList,
    column: sellOrder,
    titleAdd: 'formDemo.addNewSalesOrders',
    customOperator: 5
  },
  {
    name: API_ORDER[1].label,
    label: t('reuse.orderRental'),
    api: getRentalorderList,
    column: rentalorder,
    titleAdd: 'formDemo.addNewRentalOrders',
    customOperator: 5
  },
  {
    name: API_ORDER[2].label,
    label: t('reuse.orderDeposit'),
    api: getOrderDepositList,
    column: orderDeposit,
    titleAdd: 'formDemo.addNewConsignmentOrders',
    customOperator: 5
  },
  {
    name: API_ORDER[3].label,
    label: t('reuse.orderPawn'),
    api: getOrderPawnList,
    column: orderPawn,
    titleAdd: 'formDemo.addNewPawnOrders',
    customOperator: 5
  },
  {
    name: API_ORDER[4].label,
    label: t('reuse.orderSpa'),
    api: getOrderSpaList,
    column: orderSpa,
    titleAdd: 'formDemo.addNewSpaOrders',
    customOperator: 5
  }
]

// const changeCurrentTab = (data) => {
//   console.log('changeCurrentTab: ', data)
// }

const changeParam = (val: string) => {
  const index = API_ORDER.find((e) => e.label == val) ?? {
    value: 0,
    key: 1,
    label: 'orderSell'
  }
  params.ServiceType = index?.key

  provide('parameters', {
    params
  })
}
</script>
<template>
  <tableDatetimeFilterBasicVue
    :selection="true"
    title="orderList"
    :tabs="tabs"
    @tab-change-event="changeParam"
  />
</template>
