<script setup lang="ts">
import AddNewConsignment from './AddNewConsignmentOrder.vue'
import AddNewPawn from './AddNewPawnOrder.vue'
import AddNewSpa from './AddNewSpaOrder.vue'
import { ref } from 'vue'
import { ElTabs, ElTabPane } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import OrderListUtility from './OrderListUtility.vue'
import AddNewRentalOrdersUtility from './addNewRentalOrdersUtility.vue'
import { useRoute } from 'vue-router'
const { t } = useI18n()

const route = useRoute()
console.log('route: ', route.params)
const tab = String(route.params.tab) ? String(route.params.tab) : 'orderSell'
const tabPosition = ref(tab)
</script>
<template>
  <ElTabs v-model="tabPosition" class="demo-tabs">
    <ElTabPane lazy :label="t('formDemo.addNewSalesOrders')" name="orderSell"
      ><OrderListUtility
    /></ElTabPane>
    <ElTabPane lazy :label="t('formDemo.addNewRentalOrders')" name="orderRental"
      ><AddNewRentalOrdersUtility
    /></ElTabPane>
    <ElTabPane lazy :label="t('formDemo.addNewConsignmentOrders')" name="orderDeposit">
      <AddNewConsignment />
    </ElTabPane>
    <ElTabPane lazy :label="t('formDemo.addNewPawnOrders')" name="orderPawn">
      <AddNewPawn />
    </ElTabPane>
    <ElTabPane lazy :label="t('formDemo.addNewSpaOrders')" name="orderSpa">
      <AddNewSpa />
    </ElTabPane>
  </ElTabs>
</template>
