<script setup lang="ts">
import AddNewConsignment from './AddNewConsignmentOrder.vue'
import AddNewPawn from './AddNewPawnOrder.vue'
import AddNewSpa from './AddNewSpaOrder.vue'
import { ref } from 'vue'
import { TabsPaneContext, ElTabs, ElTabPane } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()

const activeName = ref('first-page')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
</script>
<template>
  <ElTabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <ElTabPane :label="`${t('formDemo.addNewSalesOrders')}`" name="first-page">trang 1 </ElTabPane>
    <ElTabPane :label="`${t('formDemo.addNewRentalOrders')}`" name="second">Config</ElTabPane>
    <ElTabPane :label="`${t('formDemo.addNewConsignmentOrders')}`" name="ConsignmentOrders">
      <AddNewConsignment />
    </ElTabPane>
    <ElTabPane :label="`${t('formDemo.addNewPawnOrders')}`" name="PawnOrders">
      <AddNewPawn />
    </ElTabPane>
    <ElTabPane :label="`${t('formDemo.addNewSpaOrders')}`" name="SpaOrders">
      <AddNewSpa />
    </ElTabPane>
  </ElTabs>
</template>
