<script setup lang="ts">
import { TableData } from '@/api/table/types'
import { ContentWrap } from '@/components/ContentWrap'
import { Table, TableExpose } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { onBeforeMount, PropType, ref, unref, watch } from 'vue'
import { apiType, TableResponse } from '../../Type'
import { ElButton } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { useRouter } from 'vue-router'
import { addOperatorColumn, dynamicApi, dynamicColumns } from '../../TablesReusabilityFunction'
import { InputMoneyRange, InputDateRange, InputNumberRange, InputName } from '../index'
import { usePermission } from '@/utils/tsxHelper'
const { t } = useI18n()
let paginationObj = ref<Pagination>()
const tableRef = ref<TableExpose>()
const { currentRoute } = useRouter()
const userPermission = usePermission(currentRoute.value)
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

const operatorPermission = userPermission?.addable || userPermission?.deletable || userPermission?.editable
onBeforeMount(() => {
  dynamicApi.value = props.api
  dynamicColumns.value = props.fullColumns
  if (props.customOperator === 2 && props.customOperatorChildren == true && operatorPermission)
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
    height: 10px; /* height of horizontal scrollbar ← You're missing this */
    background-color: var(--top-tool-border-color);
  }

  &::-webkit-scrollbar-thumb {
    width: 4px;
    background-color: var(--el-color-primary);
    border-radius: 10px;
  }

  ::-webkit-scrollbar-track {
    background-color: var(--el-color-primary);
    box-shadow: inset 0 0 1px var(--el-color-info);
  }
}

::v-deep(.el-drawer__header) {
  padding: 0;
  margin-bottom: 0;
}

::v-deep(.el-checkbox-group) {
  display: flex;
  width: max-content;
  margin: auto;
  justify-content: center;
  align-items: flex-start;
}

#rabbit-ear {
  top: -10px;
  right: calc(50% - 66px);
  z-index: 28;
  width: 132px;
  height: 24px;
  text-align: center;
  background-color: var(--logo-title-text-color);
  border: 1px solid var(--tags-view-border-color);
  border-radius: 0 0 5px 5px;
  box-shadow: 0 0 2px 1px var(--left-menu-text-color);

  &:hover {
    top: 0;
    color: var(--el-color-primary);
    border: 0 1px 1px 1px solid var(--el-color-primary);
    box-shadow: 0 0 2px 1px var(--el-color-primary);
  }
}

#price-information {
  position: relative;
  left: 11vw;
  max-width: 70vw;
}
</style>
