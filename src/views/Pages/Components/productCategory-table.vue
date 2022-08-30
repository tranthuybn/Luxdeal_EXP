<script setup lang="ts">
import { useIcon } from '@/hooks/web/useIcon'
import { ElButton, ElTabs, ElTabPane } from 'element-plus'
import { ref, unref, onBeforeMount } from 'vue'
import { HeaderFiler } from './HeaderFilter/index'
import { TableType01 } from './TableBase/index'
import { Tab } from './Type'
import { dynamicApi, dynamicColumns, addOperatorColumn } from './TablesReusabilityFunction'
import { useRouter } from 'vue-router'
import { useI18n } from '@/hooks/web/useI18n'
import { useAppStore } from '@/store/modules/app'
const { t } = useI18n()
const props = defineProps({
  tabs: {
    type: Array<Tab>,
    default: () => []
  },
  nameRouter: {
    type: String,
    default: ''
  }
})
// declare
const createIcon = useIcon({ icon: 'uil:create-dashboard' })
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

const { push } = useRouter()
const router = useRouter()
const appStore = useAppStore()
const Utility = appStore.getUtility
const pushAdd = () => {
  push({
    name: `${String(router.currentRoute.value.name)}.${Utility}`,
    params: { tabName: currentTab.value, backRoute: String(router.currentRoute.value.name) }
  })
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
              <el-button type="primary" :icon="createIcon" @click="pushAdd">
                {{ t('reuse.addCategory') }}
              </el-button>
            </template>
          </HeaderFiler>
          <TableType01
            ref="tableBase01"
            :selection="false"
            :api="dynamicApi"
            :fullColumns="dynamicColumns"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>
