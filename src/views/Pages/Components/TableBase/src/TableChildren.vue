<script setup lang="ts">
import { TableData } from '@/api/table/types'
import { ContentWrap } from '@/components/ContentWrap'
import { Table, TableExpose } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { onBeforeMount, PropType, ref, unref, watch } from 'vue'
import { apiType, TableResponse } from '../../Type'
import { ElButton } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { addOperatorColumn, dynamicApi, dynamicColumns } from '../../TablesReusabilityFunction'
import { InputMoneyRange, InputDateRange, InputNumberRange, InputName } from '../index'
const { t } = useI18n()
let paginationObj = ref<Pagination>()
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
  },
  customOperator: {
    type: Number,
    default: 2,
    validator(value: number) {
      // The value must match one of these strings
      return [1, 2, 3].includes(value)
    },
    Descriptions: '1 thao tác 3 icon ;2 là thao tác 2 button sửa xóa; 3 không có thao tác'
  },
  paginationType: {
    type: Boolean,
    default: false
  },
  expand: {
    type: Boolean,
    default: false
  },
  apiTableChild: {
    type: Function as PropType<apiType>,
    default: () => Promise<IResponse<TableResponse<TableData>>>
  },
  columnsTableChild: {
    type: Array as PropType<TableColumn[]>,
    default: () => []
  },
  titleButtons: {
    type: String,
    default: ''
  },
  removeDrawer: {
    type: Boolean,
    default: false
  },
  customOperatorChildren: {
    type: Boolean,
    default: true
  }
})

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
    props.paginationType
      ? (paginationObj.value = {
          total: tableObject.total
        })
      : (paginationObj.value = undefined)
    emit('TotalRecord', tableObject.tableList.length)
  },
  {
    immediate: true
  }
)
const ColumnsHaveHeaderFilter = props.fullColumns.filter((col) => col.headerFilter)
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
// operation colum toggle
const { setColumn } = methods
function operatorColumnToggle(param) {
  setColumn([
    {
      field: props.customOperatorChildren ? 'operator' : '',
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

onBeforeMount(() => {
  dynamicApi.value = props.api
  dynamicColumns.value = props.fullColumns
  if (props.customOperator === 2 && props.customOperatorChildren == true)
    addOperatorColumn(dynamicColumns.value)
})
</script>
<template>
  <ContentWrap class="relative">
    <Table
      ref="tableRef"
      :expand="expand"
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :pagination="undefined"
      :showOverflowTooltip="false"
      :maxHeight="maxHeight"
      @mouseenter="operatorColumnToggle('right')"
      @mouseleave="operatorColumnToggle(false)"
      @select="getTableSelected"
      @select-all="getTableSelected"
      @register="register"
      @filter-change="filterChange"
      :selection="selection"
    >
      <template v-if="props.customOperatorChildren" #operator>
        <ElButton type="primary" plain>
          {{ t('reuse.fix') }}
        </ElButton>
        <ElButton type="danger">
          {{ t('reuse.delete') }}
        </ElButton>
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
  margin: auto;
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
#price-information {
  max-width: 70vw;
  position: relative;
  left: 11vw;
}
</style>
