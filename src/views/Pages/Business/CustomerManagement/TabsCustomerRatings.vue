<script setup lang="ts">
import { ref } from 'vue'
import { TabsPaneContext, ElTabs, ElTabPane } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import RatingLists from './RatingLists.vue'
import RatingSettings from './RatingSettings.vue'
const { t } = useI18n()

const activeName = ref('first-page')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
</script>
<template>
  <ElTabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <ElTabPane :label="`${t('customerList.rankingList')}`" name="first-page"
      ><RatingLists
    /></ElTabPane>
    <ElTabPane :label="`${t('customerList.ratingSettings')}`" name="second"
      ><RatingSettings />
    </ElTabPane>
  </ElTabs>
</template>
