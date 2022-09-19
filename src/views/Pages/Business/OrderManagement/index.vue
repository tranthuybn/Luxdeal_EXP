<script setup lang="ts">
import AddNewConsignmentOrder from './AddNewConsignmentOrder.vue'
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
      <AddNewConsignmentOrder />
    </ElTabPane>
    <ElTabPane :label="`${t('formDemo.addNewPawnOrders')}`" name="PawnOrders">dasds</ElTabPane>
    <ElTabPane :label="`${t('formDemo.addNewSpaOrders')}`" name="SpaOrders">Task</ElTabPane>
  </ElTabs>
</template>
