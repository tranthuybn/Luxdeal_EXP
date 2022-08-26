<script setup lang="ts">
import { TableData } from '@/api/table/types'
import { ContentWrap } from '@/components/ContentWrap'
import { Table, TableExpose } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { onBeforeMount, PropType, ref, unref, watch } from 'vue'
import { apiType, TableResponse } from '../../Type'
import { ElImage } from 'element-plus'
import { InputMoneyRange, InputDateRange, InputNumberRange, InputName } from '../index'
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
  getData
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
//get array of headerFilter in column (if there is a headerFilter)
const headerFilter = props.fullColumns.filter((col) => col.headerFilter)
</script>
<template>
  <ContentWrap>
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
      <template v-for="header in headerFilter" :key="header.field" #[`${header.field}-header`]>
        {{ header.label }}
        <InputMoneyRange
          v-if="header.headerFilter == 'Money'"
          :field="header.field"
          @confirm="confirm"
          @cancel="cancel"
        />
        <InputDateRange
          v-if="header.headerFilter == 'Date'"
          :field="header.field"
          @confirm="confirm"
          @cancel="cancel"
        />
        <InputNumberRange
          v-if="header.headerFilter == 'Number'"
          :field="header.field"
          @confirm="confirm"
          @cancel="cancel"
        />
        <InputName
          v-if="header.headerFilter == 'Name'"
          :field="header.field"
          @filter-select="filterSelect"
        />
      </template>
    </Table>
  </ContentWrap>
</template>
