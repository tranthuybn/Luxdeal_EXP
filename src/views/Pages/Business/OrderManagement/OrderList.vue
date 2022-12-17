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
import { onBeforeMount, provide, reactive, ref, watch } from 'vue'
import { API_ORDER } from '@/utils/API.Variables'
import { useRouter } from 'vue-router'

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
    titleAdd: 'formDemo.addNewSalesOrders'
  },
  {
    name: API_ORDER[1].label,
    label: t('reuse.orderRental'),
    api: getRentalorderList,
    column: rentalorder,
    titleAdd: 'formDemo.addNewRentalOrders'
  },
  {
    name: API_ORDER[2].label,
    label: t('reuse.orderDeposit'),
    api: getOrderDepositList,
    column: orderDeposit,
    titleAdd: 'formDemo.addNewConsignmentOrders'
  },
  {
    name: API_ORDER[3].label,
    label: t('reuse.orderPawn'),
    api: getOrderPawnList,
    column: orderPawn,
    titleAdd: 'formDemo.addNewPawnOrders'
  },
  {
    name: API_ORDER[4].label,
    label: t('reuse.orderSpa'),
    api: getOrderSpaList,
    column: orderSpa,
    titleAdd: 'formDemo.addNewSpaOrders'
  }
]

// const changeParam = (val: string) => {
//   const index = API_ORDER.find((e) => e.label == val) ?? {
//     value: 0,
//     key: 1,
//     label: 'orderSell'
//   }
//   params.ServiceType = index?.key
//   provide('parameters', {
//     params
//   })
// }
const route = useRouter()
console.log('router', route)

const getCurrentTab = () => {
  const tab = String(route.currentRoute.value.params.tab)

  console.log('tab', tab)
}
let currentTab = ref('')

watch(
  () => params.ServiceType,
  () => {
    currentTab.value = String(params.ServiceType)
  }
)

const changeParam = (val = '') => {
  if ((val = 'orderSell')) {
    params.ServiceType = 1
    currentTab.value = 'orderSell'
  } else if ((val = 'orderDeposit')) {
    params.ServiceType = 2
    currentTab.value = 'orderDeposit'
  } else if ((val = 'orderRental')) {
    params.ServiceType = 3
    currentTab.value = 'orderRental'
  } else if ((val = 'orderPawn')) {
    params.ServiceType = 4
    currentTab.value = 'orderPawn'
  } else if ((val = 'orderSpa')) {
    params.ServiceType = 5
    currentTab.value = 'orderSpa'
  }
  provide('parameters', {
    params
  })
  console.log('val', val)
}

onBeforeMount(() => {
  getCurrentTab()
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
