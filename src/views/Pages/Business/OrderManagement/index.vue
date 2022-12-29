<script setup lang="ts">
import AddNewConsignment from './AddNewConsignmentOrder.vue'
import AddNewPawn from './AddNewPawnOrder.vue'
import AddNewSpa from './AddNewSpaOrder.vue'
import { onBeforeMount, ref } from 'vue'
import { ElTabs, ElTabPane } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import OrderListUtility from './OrderListUtility.vue'
import AddNewRentalOrdersUtility from './addNewRentalOrdersUtility.vue'
import { useRoute, useRouter } from 'vue-router'
const { t } = useI18n()
const router = useRouter()
const type = String(router.currentRoute.value.params.type)
const route = useRoute()
const tab = String(route.params.tab) ? String(route.params.tab) : 'orderSell'
const tabPosition = ref(tab)
const disabledTab1 = ref(false)
const disabledTab2 = ref(false)
const disabledTab3 = ref(false)
const disabledTab4 = ref(false)
const disabledTab5 = ref(false)
const checkTab = String(router.currentRoute.value.fullPath)

const changeTab = () => {
  tabPosition.value = tab

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
// click in nav
const checkDisabledTab = () => {
  if (checkTab == '/business/order-management/order-list-add/:type?/:tab?/:id?') {
    disabledTab2.value = false
    disabledTab3.value = false
    disabledTab4.value = false
    disabledTab5.value = false
  } else {
    changeTab()
  }
}

const titleOrderSell = ref(t('formDemo.addNewSalesOrders'))
const titleOrderRental = ref(t('formDemo.addNewRentalOrders'))
const titleOrderConsign = ref(t('formDemo.addNewConsignmentOrders'))
const titleOrderPawn = ref(t('formDemo.addNewPawnOrders'))
const titleOrderSpa = ref(t('formDemo.addNewSpaOrders'))
const changeTitle = () => {
  if (type == 'edit' || type == 'detail') {
    titleOrderSell.value = t('reuse.orderSell')
    titleOrderRental.value = t('reuse.orderRental')
    titleOrderConsign.value = t('reuse.orderDeposit')
    titleOrderPawn.value = t('reuse.orderPawn')
    titleOrderSpa.value = t('reuse.orderSpa')
  }
}
onBeforeMount(() => {
  checkDisabledTab()
  changeTitle()
})
</script>
<template>
  <ElTabs v-model="tabPosition" class="demo-tabs">
    <ElTabPane lazy :label="titleOrderSell" name="orderSell" :disabled="disabledTab1"
      ><OrderListUtility v-if="tabPosition === 'orderSell'"
    /></ElTabPane>
    <ElTabPane lazy :label="titleOrderRental" name="orderRental" :disabled="disabledTab2"
      ><AddNewRentalOrdersUtility v-if="tabPosition === 'orderRental'"
    /></ElTabPane>
    <ElTabPane lazy :label="titleOrderConsign" name="orderDeposit" :disabled="disabledTab3">
      <AddNewConsignment v-if="tabPosition === 'orderDeposit'" />
    </ElTabPane>
    <ElTabPane lazy :label="titleOrderPawn" name="orderPawn" :disabled="disabledTab4">
      <AddNewPawn v-if="tabPosition === 'orderPawn'" />
    </ElTabPane>
    <ElTabPane lazy :label="titleOrderSpa" name="orderSpa" :disabled="disabledTab5">
      <AddNewSpa v-if="tabPosition === 'orderSpa'" />
    </ElTabPane>
  </ElTabs>
</template>
