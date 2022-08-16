<script setup lang="ts">
import { useI18n } from '@/hooks/web/useI18n'
import { useIcon } from '@/hooks/web/useIcon'
import { ElButton, ElCol, ElRow, ElTabs, ElTabPane } from 'element-plus'
import { h, ref, unref, onUnmounted, onBeforeMount } from 'vue'
import { HeaderFiler } from './HeaderFilter/index'
import { TableExtension, TableType01 } from './TableBase/index'
import { apiType, Tab } from './Type'
const { t } = useI18n()
const props = defineProps({
  tabs: {
    type: Array<Tab>,
    default: () => []
  }
})
// declare
const eyeIcon = useIcon({ icon: 'emojione-monotone:eye-in-speech-bubble' })
const editIcon = useIcon({ icon: 'akar-icons:chat-edit' })
const trashIcon = useIcon({ icon: 'fluent:delete-12-filled' })
const createIcon = useIcon({ icon: 'uil:create-dashboard' })
// Add operation column for table
const operatorColumn: TableColumn = {
  field: 'operator',
  label: t('reuse.operator'),
  minWidth: '180',
  fixed: false,
  formatter: (record: Recordable, __: TableColumn, cellValue: TableSlotDefault) => {
    return h(ElRow, { gutter: 20, justify: 'space-around' }, () => [
      h(ElCol, { span: 8 }, () =>
        h(ElButton, { icon: eyeIcon, onClick: () => acitonFn(record, cellValue) })
      ),
      h(ElCol, { span: 8 }, () => h(ElButton, { icon: editIcon })),
      h(ElCol, { span: 8 }, () => h(ElButton, { icon: trashIcon }))
    ])
  }
}
// table operator
const acitonFn = (record: Recordable, data: TableSlotDefault) => {
  console.log(record, data)
}

const getTotalRecord = ref(0)
const getSelectedRecord = ref<Array<any>>([])
function fnGetTotalRecord(val) {
  getTotalRecord.value = val ?? 0
}
function fnGetSelectedRecord(val) {
  getSelectedRecord.value = val ?? []
}
const tableBase01 = ref<ComponentRef<typeof TableType01>>()

const getData = () => {
  unref(tableBase01)?.getData()
}
// tab logic
const currentTab = ref<string>('')
const dynamicApi = ref<apiType>()
const dynamicColumns = ref<TableColumn[]>()
onBeforeMount(() => {
  if (Array.isArray(props.tabs) && props.tabs?.length > 0) {
    const theFirstTab = props.tabs[0]
    dynamicApi.value = theFirstTab.api
    dynamicColumns.value = theFirstTab.column
    dynamicColumns.value?.push(operatorColumn)
    currentTab.value = theFirstTab.name
  }
})
onUnmounted(() => {
  dynamicColumns.value?.splice(0, dynamicColumns.value.length)
})
const tabChangeEvent = (name) => {
  currentTab.value = name
  if (Array.isArray(props.tabs) && props.tabs?.length > 0) {
    const tab = props.tabs.find((el) => el.name === name)
    dynamicColumns.value = tab?.column
    dynamicApi.value = tab?.api ?? undefined
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
      <el-tab-pane v-for="(item, index) in tabs" :label="item.label" :name="item.name" :key="index">
        <HeaderFiler @get-data="getData" @refresh-data="getData" :key="currentTab">
          <template #headerFilterSlot>
            <el-button type="primary" :icon="createIcon"> Khởi tạo mới </el-button>
          </template>
        </HeaderFiler>
        <TableExtension :totalRecord="getTotalRecord" :selectedRecord="getSelectedRecord" />
        <TableType01
          ref="tableBase01"
          :key="currentTab + index"
          :api="dynamicApi"
          :fullColumns="dynamicColumns"
          @total-record="fnGetTotalRecord"
          @selected-record="fnGetSelectedRecord"
        />
      </el-tab-pane>
    </el-tabs>
  </section>
</template>
