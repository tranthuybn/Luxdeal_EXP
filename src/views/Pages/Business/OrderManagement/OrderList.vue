<script setup lang="ts">
import tableDatetimeFilterBasicVue from '../../Components/TabsBase.vue'
import { getOrderList } from '@/api/Business'
import { sellOrder, rentalorder, orderDeposit, orderPawn, orderSpa } from './OrderManagement'
import { Tab } from '../../Components/Type'
import { useI18n } from '@/hooks/web/useI18n'
import { provide, reactive } from 'vue'
import { API_ORDER } from '@/utils/API.Variables'

const { t } = useI18n()
let params = reactive({ ServiceType: '1' })
provide('parameters', {
  params
})
const tabs: Array<Tab> = [
  {
    name: API_ORDER[0].key,
    label: t('reuse.orderSell'),
    api: getOrderList,
    column: sellOrder,
    titleAdd: 'formDemo.addNewSalesOrders',
    customOperator: 5
  },
  {
    name: API_ORDER[1].key,
    label: t('reuse.orderRental'),
    api: getOrderList,
    column: rentalorder,
    titleAdd: 'formDemo.addNewRentalOrders',
    customOperator: 5
  },
  {
    name: API_ORDER[2].key,
    label: t('reuse.orderDeposit'),
    api: getOrderList,
    column: orderDeposit,
    titleAdd: 'formDemo.addNewConsignmentOrders',
    customOperator: 5
  },
  {
    name: API_ORDER[3].key,
    label: t('reuse.orderPawn'),
    api: getOrderList,
    column: orderPawn,
    titleAdd: 'formDemo.addNewPawnOrders',
    customOperator: 5
  },
  {
    name: API_ORDER[4].key,
    label: t('reuse.orderSpa'),
    api: getOrderList,
    column: orderSpa,
    titleAdd: 'formDemo.addNewSpaOrders',
    customOperator: 5
  }
]

const changeParam = (_val: '') => {
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
