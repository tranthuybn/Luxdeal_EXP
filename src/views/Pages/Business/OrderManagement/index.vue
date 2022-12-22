<script setup lang="ts">
import AddNewConsignment from './AddNewConsignmentOrder.vue'
import AddNewPawn from './AddNewPawnOrder.vue'
import AddNewSpa from './AddNewSpaOrder.vue'
import { onBeforeMount, ref } from 'vue'
import { ElTabs, ElTabPane } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import OrderListUtility from './OrderListUtility.vue'
import AddNewRentalOrdersUtility from './addNewRentalOrdersUtility.vue'
import { useRoute } from 'vue-router'
const { t } = useI18n()

const route = useRoute()
const tab = String(route.params.tab) ? String(route.params.tab) : 'orderSell'
const tabPosition = ref(tab)
const disabledTab1 = ref(false)
const disabledTab2 = ref(false)
const disabledTab3 = ref(false)
const disabledTab4 = ref(false)
const disabledTab5 = ref(false)
onBeforeMount(() => changeTab())
const changeTab = () => {
  tabPosition.value = tab
  console.log('tab', tab)

  switch (tab) {
    case 'orderSell':
      disabledTab2.value = true
      disabledTab3.value = true
      disabledTab4.value = true
      disabledTab5.value = true
      break
    case 'orderRental':
      disabledTab1.value = true
      disabledTab3.value = true
      disabledTab4.value = true
      disabledTab5.value = true
      break
    case 'orderDeposit':
      disabledTab1.value = true
      disabledTab2.value = true
      disabledTab4.value = true
      disabledTab5.value = true
      break
    case 'orderPawn':
      disabledTab1.value = true
      disabledTab2.value = true
      disabledTab3.value = true
      disabledTab5.value = true
      break
    case 'orderSpa':
      disabledTab1.value = true
      disabledTab2.value = true
      disabledTab3.value = true
      disabledTab4.value = true
      break
    default:
      tabPosition.value = 'orderSell'
  }
}
</script>
<template>
  <ElTabs v-model="tabPosition" class="demo-tabs">
    <ElTabPane :label="t('formDemo.addNewSalesOrders')" name="orderSell" :disabled="disabledTab1"
      ><OrderListUtility v-if="tabPosition === 'orderSell'"
    /></ElTabPane>
    <ElTabPane :label="t('formDemo.addNewRentalOrders')" name="orderRental" :disabled="disabledTab2"
      ><AddNewRentalOrdersUtility v-if="tabPosition === 'orderRental'"
    /></ElTabPane>
    <ElTabPane
      :label="t('formDemo.addNewConsignmentOrders')"
      name="orderDeposit"
      :disabled="disabledTab3"
    >
      <AddNewConsignment v-if="tabPosition === 'orderDeposit'" />
    </ElTabPane>
    <ElTabPane :label="t('formDemo.addNewPawnOrders')" name="orderPawn" :disabled="disabledTab4">
      <AddNewPawn v-if="tabPosition === 'orderPawn'" />
    </ElTabPane>
    <ElTabPane :label="t('formDemo.addNewSpaOrders')" name="orderSpa" :disabled="disabledTab5">
      <AddNewSpa v-if="tabPosition === 'orderSpa'" />
    </ElTabPane>
  </ElTabs>
</template>
