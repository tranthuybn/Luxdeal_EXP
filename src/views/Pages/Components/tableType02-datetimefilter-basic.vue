<script setup lang="ts">
import { useIcon } from '@/hooks/web/useIcon'
import { ElButton, ElTabs, ElTabPane } from 'element-plus'
import { ref, unref, onBeforeMount } from 'vue'
import { HeaderFiler } from './HeaderFilter/index'
import { TableExtension, TableType01 } from './TableBase/index'
import { Tab } from './Type'
import {
  addOperatorColumn,
  getTotalRecord,
  getSelectedRecord,
  fnGetTotalRecord,
  fnGetSelectedRecord,
  dynamicApi,
  dynamicColumns
} from './TablesReusabilityFunction'

const props = defineProps({
  tabs: {
    type: Array<Tab>,
    default: () => []
  }
})
// declare
const addIcon = useIcon({ icon: 'carbon:add' })
const dashIcon = useIcon({ icon: 'bi:dash-lg' })
const changeIcon = useIcon({ icon: 'fa:exchange' })

const tableBase01 = ref<ComponentRef<typeof TableType01>>()

const getData = (data) => {
  unref(tableBase01)?.getData(data)
}
// tab logic
const currentTab = ref<string>('')
onBeforeMount(() => {
  if (Array.isArray(props.tabs) && props.tabs?.length > 0) {
    const theFirstTab = props.tabs[0]
    dynamicApi.value = theFirstTab.api
    dynamicColumns.value = theFirstTab.column
    addOperatorColumn(dynamicColumns.value)
    /*
     * alway set currentTab at the end of function after column and api
     * Due to current tab was set as a key of the table and the header filter
     * if current tab changes table will immediate reload
     * if api and column had been not assigned before then no content should be render
     */
    currentTab.value = theFirstTab.name
  }
})

const tabChangeEvent = (name) => {
  currentTab.value = name
  if (Array.isArray(props.tabs) && props.tabs?.length > 0) {
    const tab = props.tabs.find((el) => el.name === name)
    dynamicColumns.value = tab?.column
    dynamicApi.value = tab?.api ?? undefined
    addOperatorColumn(dynamicColumns.value)
  }
}
</script>
<template>
  <section>
    <el-tabs
      v-model="currentTab"
      class="demo-tabs"
      v-if="Array.isArray(tabs) && tabs?.length > 0"
      @tab-change="tabChangeEvent"
    >
      <el-tab-pane
        v-for="(item, index) in tabs"
        :label="item.label"
        :name="item.name"
        :key="index"
        lazy
      >
        <div :key="currentTab" v-if="item.name === currentTab">
          <HeaderFiler @get-data="getData" @refresh-data="getData">
            <template #headerFilterSlot>
              <el-button type="primary" :icon="addIcon"> Nhập kho </el-button>
              <el-button type="primary" :icon="dashIcon"> Xuất kho </el-button>
              <el-button type="primary" :icon="changeIcon"> Chuyển kho </el-button>
            </template>
          </HeaderFiler>
          <TableExtension :totalRecord="getTotalRecord" :selectedRecord="getSelectedRecord" />
          <TableType01
            ref="tableBase01"
            :api="dynamicApi"
            :fullColumns="dynamicColumns"
            :maxHeight="'65vh'"
            :filter="dynamicColumns?.filter"
            @total-record="fnGetTotalRecord"
            @selected-record="fnGetSelectedRecord"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>
