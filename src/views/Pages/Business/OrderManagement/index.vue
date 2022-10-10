<script setup lang="ts">
import AddNewConsignment from './AddNewConsignmentOrder.vue'
import AddNewPawn from './AddNewPawnOrder.vue'
import AddNewSpa from './AddNewSpaOrder.vue'
import { ref } from 'vue'
import { TabsPaneContext, ElTabs, ElTabPane } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import OrderListUtility from './OrderListUtility.vue'
import AddNewRentalOrdersUtility from './addNewRentalOrdersUtility.vue'
import { useRoute } from 'vue-router'
const { t } = useI18n()

//lay du lieu tu router
// const router = useRouter()
// const id = Number(router.currentRoute.value.params.id)
// const type = String(router.currentRoute.value.params.type)
const route = useRoute()
const tab = String(route.params.tab) ? String(route.params.tab) : 'orderSell'
const tabPosition = ref(tab)

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
</script>
<template>
  <ElTabs v-model="tabPosition" class="demo-tabs" @tab-click="handleClick">
    <ElTabPane :label="`${t('formDemo.addNewSalesOrders')}`" name="orderSell"
      ><OrderListUtility
    /></ElTabPane>
    <ElTabPane :label="`${t('formDemo.addNewRentalOrders')}`" name="orderRental"
      ><AddNewRentalOrdersUtility
    /></ElTabPane>
    <ElTabPane :label="`${t('formDemo.addNewConsignmentOrders')}`" name="orderDeposit">
      <AddNewConsignment />
    </ElTabPane>
    <ElTabPane :label="`${t('formDemo.addNewPawnOrders')}`" name="orderPawn">
      <AddNewPawn />
    </ElTabPane>
    <ElTabPane :label="`${t('formDemo.addNewSpaOrders')}`" name="orderSpa">
      <AddNewSpa />
    </ElTabPane>
  </ElTabs>
</template>
