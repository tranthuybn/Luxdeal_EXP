<script setup lang="ts">
import { ElTabs, ElTabPane } from 'element-plus'
import { ref, onUnmounted, onBeforeMount } from 'vue'
import {
  operatorColumn,
  getSelectedRecord,
  dynamicApi,
  dynamicColumns,
  resetTable
} from './TablesReusabilityFunction'
import { Tab } from './Type'

import TableBase from './tableType01-datetimefilter-basic.vue'
const props = defineProps({
  tabs: {
    type: Array<Tab>,
    default: () => []
  }
})
// tab logic
const currentTab = ref<string>('')
onBeforeMount(() => {
  if (Array.isArray(props.tabs) && props.tabs?.length > 0) {
    const theFirstTab = props.tabs[0]
    dynamicApi.value = theFirstTab.api
    dynamicColumns.value = theFirstTab.column
    if (dynamicColumns.value && dynamicColumns.value?.length > 0)
      dynamicColumns.value?.push(operatorColumn)
    /*
     * alway set currentTab at the end of function after column and api
     * Due to current tab was set as a key of the table and the header filter
     * if current tab changes table will immediate reload
     * if api and column had been not assigned before then no content should be render
     */
    currentTab.value = theFirstTab.name
  }
})
onUnmounted(() => {
  resetTable()
})
const tabChangeEvent = (name) => {
  if (Array.isArray(props.tabs) && props.tabs?.length > 0) {
    const tab = props.tabs.find((el) => el.name === name)
    dynamicColumns.value = tab?.column
    dynamicApi.value = tab?.api ?? undefined
    currentTab.value = name
    getSelectedRecord.value = []
  }
}
</script>
<template>
  <section>
    <el-tabs v-model="currentTab" class="demo-tabs" @tab-change="tabChangeEvent">
      <el-tab-pane
        v-for="(item, index) in tabs"
        :label="item.label"
        :name="item.name"
        :key="index"
        lazy
      >
        <TableBase
          :columns="dynamicColumns"
          :api="dynamicApi"
          :key="currentTab"
          v-if="item.name === currentTab"
        />
      </el-tab-pane>
    </el-tabs>
  </section>
</template>
