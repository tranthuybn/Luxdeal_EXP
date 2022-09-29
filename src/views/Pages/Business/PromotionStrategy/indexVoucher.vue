<script setup lang="ts">
import VoucherDiscount from './VoucherDiscountUtility.vue'
import VoucherGift from './VoucherGiftUtility.vue'
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
    <ElTabPane :label="t('formDemo.voucherDiscount')" name="first-page"
      ><VoucherDiscount
    /></ElTabPane>
    <ElTabPane :label="t('formDemo.voucherGiftSpa')" name="second"><VoucherGift /></ElTabPane>
  </ElTabs>
</template>
