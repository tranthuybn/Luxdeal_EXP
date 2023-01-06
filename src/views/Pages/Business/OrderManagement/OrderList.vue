<script setup lang="ts">
import tableDatetimeFilterBasicVue from '../../Components/TabsBase.vue'
import { getOrderList } from '@/api/Business'
import { depositOrder, pawnOrder, rentalorder, sellOrder, spaOrder } from './OrderManagement'
import { Tab } from '../../Components/Type'
import { useI18n } from '@/hooks/web/useI18n'
import { onBeforeMount, provide, reactive, ref } from 'vue'
import { API_ORDER } from '@/utils/API.Variables'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const route = useRoute()
let params = reactive({ ServiceType: 1 })
const tabs: Array<Tab> = [
  {
    name: API_ORDER[0].label,
    label: t('reuse.orderSell'),
    api: getOrderList,
    column: sellOrder,
    titleAdd: 'formDemo.addNewSalesOrders',
    customOperator: 3
  },
  {
    name: API_ORDER[1].label,
    label: t('reuse.orderRental'),
    api: getOrderList,
    column: rentalorder,
    titleAdd: 'formDemo.addNewRentalOrders',
    customOperator: 3
  },
  {
    name: API_ORDER[2].label,
    label: t('reuse.orderDeposit'),
    api: getOrderList,
    column: depositOrder,
    titleAdd: 'formDemo.addNewConsignmentOrders',
    customOperator: 3
  },
  {
    name: API_ORDER[3].label,
    label: t('reuse.orderPawn'),
    api: getOrderList,
    column: pawnOrder,
    titleAdd: 'formDemo.addNewPawnOrders',
    customOperator: 3
  },
  {
    name: API_ORDER[4].label,
    label: t('reuse.orderSpa'),
    api: getOrderList,
    column: spaOrder,
    titleAdd: 'formDemo.addNewSpaOrders',
    customOperator: 3
  }
]

let currentTab = ref()

const changeParam = (val: '') => {
  if (currentTab.value) {
    const index = API_ORDER.find((e) => e.label == currentTab.value)
    if (index) {
      params.ServiceType = index?.key
      provide('parameters', {
        params
      })
    }
  } else {
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
}

onBeforeMount(() => {
  currentTab.value = String(route.params.tab)
})
</script>
<template>
  <tableDatetimeFilterBasicVue
    :selection="true"
    title="orderList"
    :tabs="tabs"
    @tab-change-event="changeParam"
  />
</template>
