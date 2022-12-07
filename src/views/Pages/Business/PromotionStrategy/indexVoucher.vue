<script setup lang="ts">
import VoucherDiscount from './VoucherDiscountUtility.vue'
import VoucherGift from './VoucherGiftUtility.vue'
import { ref, onBeforeMount } from 'vue'
import { ElTabs, ElTabPane } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()

const activeName = ref('first-page')
const disabledTab1 = ref(false)
const disabledTab2 = ref(false)
const router = useRouter()
const tabName = String(router.currentRoute.value.params.tab)

onBeforeMount(() => changeTab())
const changeTab = () => {
  activeName.value = tabName
  switch (tabName) {
    case '1':
      disabledTab2.value = true
      break
    case '2':
      disabledTab1.value = true
      break
    default:
      activeName.value = '1'
  }
}
</script>
<template>
  <ElTabs v-model="activeName" class="demo-tabs" lazy>
    <ElTabPane :label="t('formDemo.voucherDiscount')" name="1" :disabled="disabledTab1"
      ><VoucherDiscount
    /></ElTabPane>
    <ElTabPane :label="t('formDemo.voucherGiftSpa')" name="2" :disabled="disabledTab2"
      ><VoucherGift
    /></ElTabPane>
  </ElTabs>
</template>
