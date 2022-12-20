<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { TabsPaneContext, ElTabs, ElTabPane } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import RatingLists from './RatingLists.vue'
import RatingSettings from './RatingSettings.vue'
import { useRoute } from 'vue-router'
const { t } = useI18n()

const activeName = ref('first-page')
const route = useRoute()

onBeforeMount(() => {
  const tab = String(route.params.tab)
  if (tab == ':tab') activeName.value = 'first-page'
  else activeName.value = tab
})

const handleClick = (_tab: TabsPaneContext, _event: Event) => {}
</script>
<template>
  <ElTabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <ElTabPane :label="`${t('customerList.rankingList')}`" name="first-page" lazy
      ><RatingLists
    /></ElTabPane>
    <ElTabPane :label="`${t('customerList.ratingSettings')}`" name="second" lazy
      ><RatingSettings />
    </ElTabPane>
  </ElTabs>
</template>
