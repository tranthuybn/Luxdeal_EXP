<script setup lang="ts">
import { useIcon } from '@/hooks/web/useIcon'
import { ElButton, ElTabs, ElTabPane } from 'element-plus'
import { ref, unref, onBeforeMount } from 'vue'
import { HeaderFiler } from './HeaderFilter/index'
import { TableBase } from './TableBase/index'
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
  customHeaderButton: {
    type: String,
    default: 'Base'
  },
  titleAdd: {
    type: String,
    default: 'reuse.addCategory'
  }
})
const emit = defineEmits(['tabChangeEvent'])
// declare
const createIcon = useIcon({ icon: 'uil:create-dashboard' })
const tableBase01 = ref<ComponentRef<typeof TableBase>>()
const addIcon = useIcon({ icon: 'carbon:add' })
const dashIcon = useIcon({ icon: 'bi:dash-lg' })
const changeIcon = useIcon({ icon: 'fa:exchange' })
const getData = (data) => {
  if (unref(tableBase01) !== undefined) {
    unref(tableBase01)![0]!.getData(data)
  }
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
emit('tabChangeEvent', currentTab.value)
const tabChangeEvent = (name) => {
  currentTab.value = name
  if (Array.isArray(props.tabs) && props.tabs?.length > 0) {
    const tab = props.tabs.find((el) => el.name === name)
    dynamicColumns.value = tab?.column
    dynamicApi.value = tab?.api ?? undefined
    addOperatorColumn(dynamicColumns.value)
  }
  emit('tabChangeEvent', name)
}

const { push } = useRouter()
const router = useRouter()
const appStore = useAppStore()
const Utility = appStore.getUtility
const pushAdd = () => {
  push({
    name: `${String(router.currentRoute.value.name)}.${Utility}`,
    params: {
      type: 'add',
      tab: currentTab.value
    }
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
              <div v-if="customHeaderButton === 'Warehouse'">
                <el-button type="primary" :icon="addIcon"> Nhập kho </el-button>
                <el-button type="primary" :icon="dashIcon"> Xuất kho </el-button>
                <el-button type="primary" :icon="changeIcon"> Chuyển kho </el-button>
              </div>
              <div v-if="customHeaderButton === 'Base'">
                <el-button type="primary" :icon="createIcon" @click="pushAdd">
                  {{ t(`${props.titleAdd}`) }}
                </el-button>
              </div>
            </template>
          </HeaderFiler>
          <TableBase
            ref="tableBase01"
            :selection="false"
            :api="dynamicApi"
            :fullColumns="dynamicColumns"
            :delApi="item.delApi"
            :tab="item.name"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>
