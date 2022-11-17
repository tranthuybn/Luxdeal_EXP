<script setup lang="ts">
import { useIcon } from '@/hooks/web/useIcon'
import { ElButton, ElTabs, ElTabPane } from 'element-plus'
import { ref, unref, onBeforeMount } from 'vue'
import { HeaderFiler } from './HeaderFilter/index'
import { TableBase, TableExtension } from './TableBase/index'
import { Tab } from './Type'
import {
  dynamicApi,
  dynamicColumns,
  addOperatorColumn,
  getTotalRecord,
  getSelectedRecord
} from './TablesReusabilityFunction'
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
  selection: {
    type: Boolean,
    default: false
  },
  titleAdd: {
    type: String,
    default: 'reuse.addCategory',
    Descriptions: 'tiêu đề nút thêm mới'
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
const pushWarehouse = (type) => {
  push({ path: `/inventory-management/business-product-warehouse/warehouse-transaction-${type}` })
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
                <el-button type="primary" :icon="addIcon" @click="pushWarehouse(1)">
                  Nhập kho
                </el-button>
                <el-button type="primary" :icon="dashIcon" @click="pushWarehouse(2)">
                  Xuất kho
                </el-button>
                <el-button type="primary" :icon="changeIcon" @click="pushWarehouse(3)">
                  Chuyển kho
                </el-button>
              </div>
              <div v-if="customHeaderButton === 'Base'">
                <el-button type="primary" :icon="createIcon" @click="pushAdd">
                  {{ t(`${item.titleAdd}`) ?? '' }}
                </el-button>
              </div>
            </template>
          </HeaderFiler>
          <TableExtension
            v-if="props.selection"
            :totalRecord="getTotalRecord"
            :selectedRecord="getSelectedRecord" />
          <TableBase
            ref="tableBase01"
            :selection="selection"
            :api="dynamicApi"
            :fullColumns="dynamicColumns"
            :customOperator="item.customOperator"
            :delApi="item.delApi"
            :tabs="item.name"
        /></div>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>
