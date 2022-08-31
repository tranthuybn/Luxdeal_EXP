<script setup lang="ts">
import { TableData } from '@/api/table/types'
import { ContentWrap } from '@/components/ContentWrap'
import { Table, TableExpose } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { onBeforeMount, PropType, ref, unref, watch } from 'vue'
import { apiType, TableResponse } from '../../Type'
import { ElImage, ElButton, ElDrawer, ElCheckboxGroup, ElCheckboxButton } from 'element-plus'
import { InputMoneyRange, InputDateRange, InputNumberRange, InputName } from '../index'
import { useIcon } from '@/hooks/web/useIcon'
import { useRoute } from 'vue-router'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
const route = useRoute()
const paginationObj = ref<Pagination>()
const tableRef = ref<TableExpose>()
const props = defineProps({
  api: {
    type: Function as PropType<apiType>,
    default: () => Promise<IResponse<TableResponse<TableData>>>
  },
  fullColumns: {
    type: Array as PropType<TableColumn[]>,
    default: () => []
  },
  selection: { type: Boolean, default: true },
  maxHeight: {
    type: String || Number,
    default: '69vh'
  }
})
const emit = defineEmits(['TotalRecord', 'SelectedRecord'])
// using table's function
const { register, tableObject, methods } = useTable<TableData>({
  getListApi: props.api,
  response: {
    list: 'list',
    total: 'total'
  },
  props: {
    columns: props.fullColumns,
    headerAlign: 'center'
  }
})
// get api
const getData = (data = {}) => {
  methods.setSearchParams(data)
}
onBeforeMount(() => {
  getData()
})
// execute pagination
watch(
  () => tableObject.tableList,
  () => {
    paginationObj.value = {
      total: tableObject.total
    }
    emit('TotalRecord', tableObject.tableList.length)
  },
  {
    immediate: true
  }
)
// operation colum toggle
const { setColumn } = methods
function operatorColumnToggle(param) {
  setColumn([
    {
      field: 'operator',
      path: 'fixed',
      value: param
    }
  ])
}
const { getSelections } = methods
async function getTableSelected() {
  await getSelections()
    .then((res) => {
      emit('SelectedRecord', res)
    })
    .catch(() => {})
}
defineExpose({
  getData,
  tableObject
})
//call api when filter in header change
const { setSearchParams, clearSearchParams } = methods
const filterChange = (filterValue) => {
  if (filterValue && typeof unref(filterValue) === 'object')
    for (let key in filterValue) {
      if (typeof unref(filterValue[key]) === 'object')
        filterValue[key] = Object.values(filterValue[key]).toString()
    }
  setSearchParams(filterValue)
}
//value is an object, get called when filter range(to-from) value
const confirm = (value) => {
  setSearchParams(value)
}
const cancel = (field) => {
  clearSearchParams(field)
}
const filterSelect = (value) => {
  setSearchParams(value)
}
const action = (row: TableData, type: string) => {
  console.log('row', row, 'type', type)
  //push(`/example/example-${type}?id=${row.id}`)
}
const delData = async (row: TableData | null, multiple: boolean) => {
  console.log('row', row, 'multiple', multiple)
}
//get array of headerFilter in column (if there is a headerFilter)
const ColumnsHaveHeaderFilter = props.fullColumns.filter((col) => col.headerFilter)
const eyeIcon = useIcon({ icon: 'emojione-monotone:eye-in-speech-bubble' })
const editIcon = useIcon({ icon: 'akar-icons:chat-edit' })
const trashIcon = useIcon({ icon: 'fluent:delete-12-filled' })
const drawer = ref(false)
const showingColumnList = ref<Array<string>>(
  props.fullColumns.length > 0 ? props.fullColumns.map((el) => el.field) : []
)
const showingColumn =
  props.fullColumns.length > 0
    ? props.fullColumns.map((el) => ({ value: el.field, label: el.label }))
    : []
</script>
<template>
  <ContentWrap class="relative">
    <div class="absolute" id="rabbit-ear" @click="drawer = !drawer">
      <Icon icon="ic:baseline-keyboard-double-arrow-down" />
    </div>
    <ElDrawer v-model="drawer" direction="ttb" size="10%">
      <template #title>
        <h3 class="text-center text-[var(--el-color-primary)]">{{ t(`${route.meta.title}`) }}</h3>
      </template>
      <template #default>
        <ElCheckboxGroup v-model="showingColumnList" fill="var(--el-color-primary)">
          <ElCheckboxButton
            v-for="(item, index) in showingColumn"
            :key="index"
            :label="item.value"
            size="small"
            >{{ item.label }}</ElCheckboxButton
          >
        </ElCheckboxGroup>
      </template>
    </ElDrawer>
    <Table
      ref="tableRef"
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :pagination="paginationObj"
      :showOverflowTooltip="false"
      :maxHeight="maxHeight"
      @cell-mouse-enter="operatorColumnToggle('right')"
      @cell-mouse-leave="operatorColumnToggle(false)"
      @select="getTableSelected"
      @select-all="getTableSelected"
      @register="register"
      @filter-change="filterChange"
      :selection="selection"
    >
      <template #imgTitle="data">
        <div class="imageTitle" style="display: flex; align-items: center">
          <div style="padding-right: 20px">
            <el-image style="width: 100px; height: 100px" :src="data.row.image" />
          </div>
          <div>{{ data.row.title }}</div>
        </div>
      </template>
      <template #image="data">
        <div>
          <el-image style="width: 100px; height: 100px" :src="data.row.image" />
        </div>
      </template>
      <template
        v-for="(header, index) in ColumnsHaveHeaderFilter"
        :key="index"
        #[`${header.field}-header`]
      >
        {{ header.label }}
        <InputMoneyRange
          v-if="header.headerFilter === 'Money'"
          :field="header.field"
          @confirm="confirm"
          @cancel="cancel"
        />
        <InputDateRange
          v-if="header.headerFilter === 'Date'"
          :field="header.field"
          @confirm="confirm"
          @cancel="cancel"
        />
        <InputNumberRange
          v-if="header.headerFilter === 'Number'"
          :field="header.field"
          @confirm="confirm"
          @cancel="cancel"
        />
        <InputName
          v-if="header.headerFilter === 'Name'"
          :field="header.field"
          @filter-select="filterSelect"
          @cancel="cancel"
        />
      </template>
      <template #operator="{ row }">
        <ElButton @click="action(row, 'edit')" :icon="eyeIcon" />
        <ElButton @click="action(row, 'detail')" :icon="editIcon" />
        <ElButton @click="delData(row, false)" :icon="trashIcon" />
      </template>
    </Table>
  </ContentWrap>
</template>
<style lang="less" scoped>
::v-deep(.el-overlay) {
  position: absolute !important;
}
::v-deep(.el-drawer__body) {
  padding: 3px !important ;
  &::-webkit-scrollbar {
    display: block;
    width: 10px; /* width of vertical scrollbar */
    background-color: var(--top-tool-border-color);
    height: 10px; /* height of horizontal scrollbar ← You're missing this */
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: var(--el-color-primary);
    width: 4px;
  }
  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0px 0px 1px var(--el-color-info);
    box-shadow: inset 0px 0px 1px var(--el-color-info);
    background-color: var(--el-color-primary);
  }
}
::v-deep(.el-drawer__header) {
  margin-bottom: 0;
  padding: 0;
}
::v-deep(.el-checkbox-group) {
  display: flex;
  width: max-content;
  justify-content: center;
  align-items: flex-start;
}
#rabbit-ear {
  width: 132px;
  text-align: center;
  z-index: 28;
  border-radius: 0 0 5px 5px;
  border: 1px solid var(--tags-view-border-color);
  background-color: var(--logo-title-text-color);
  box-shadow: 0px 0px 2px 1px var(--left-menu-text-color);
  top: -10px;
  height: 24px;
  right: calc(50% - 66px);
  &:hover {
    top: 0;
    border: 0px 1px 1px 1px solid var(--el-color-primary);
    box-shadow: 0px 0px 2px 1px var(--el-color-primary);
    color: var(--el-color-primary);
  }
}
</style>
