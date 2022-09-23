<script setup lang="ts">
import { ref } from 'vue'
import { TabsPaneContext, ElTabs, ElTabPane } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import OrderListUtility from './OrderListUtility.vue'
import addNewRentalOrdersUtility from './addNewRentalOrdersUtility.vue'
const { t } = useI18n()

const activeName = ref('first-page')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
</script>
<template>
  <ElTabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <ElTabPane :label="`${t('formDemo.addNewSalesOrders')}`" name="first-page"
      ><OrderListUtility />
    </ElTabPane>
    <ElTabPane :label="`${t('formDemo.addNewRentalOrder')}`" name="second"
      ><addNewRentalOrdersUtility
    /></ElTabPane>
    <ElTabPane :label="`${t('formDemo.addNewConsignmentOrders')}`" name="third">Role</ElTabPane>
    <ElTabPane :label="`${t('formDemo.addNewPawnOrders')}`" name="fourth">dasds</ElTabPane>
    <ElTabPane :label="`${t('formDemo.addNewSpaOrders')}`" name="five">Task</ElTabPane>
  </ElTabs>
</template>
