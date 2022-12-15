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
    <ElTabPane :label="t('formDemo.addNewSalesOrders')" name="orderSell"
      ><OrderListUtility :tabSelect="tabPosition" v-if="tabPosition === 'orderSell'"
    /></ElTabPane>
    <ElTabPane :label="t('formDemo.addNewRentalOrders')" name="orderRental"
      ><AddNewRentalOrdersUtility v-if="tabPosition === 'orderRental'"
    /></ElTabPane>
    <ElTabPane :label="t('formDemo.addNewConsignmentOrders')" name="orderDeposit">
      <AddNewConsignment :tabSelect="tabPosition" v-if="tabPosition === 'orderDeposit'" />
    </ElTabPane>
    <ElTabPane :label="t('formDemo.addNewPawnOrders')" name="orderPawn">
      <AddNewPawn :tabSelect="tabPosition" v-if="tabPosition === 'orderPawn'" />
    </ElTabPane>
    <ElTabPane :label="t('formDemo.addNewSpaOrders')" name="orderSpa">
      <AddNewSpa :tabSelect="tabPosition" v-if="tabPosition === 'orderSpa'" />
    </ElTabPane>
  </ElTabs>
</template>
