<script setup lang="ts">
import { TableData } from '@/api/table/types'
import { ContentWrap } from '@/components/ContentWrap'
import { Table, TableExpose } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { onBeforeMount, PropType, ref, watch } from 'vue'
import { apiType, TableResponse } from '../../Type'
import { ElImage } from 'element-plus'
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
  selection: { type: Boolean, default: true }
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
const getData = () => {
  methods.getList()
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
      @cell-mouse-enter="operatorColumnToggle('right')"
      @cell-mouse-leave="operatorColumnToggle(false)"
      @select="getTableSelected"
      @select-all="getTableSelected"
      @register="register"
      :selection="selection"
    >
      <template #title="data">
        <div class="imageTitle" style="display: flex; align-items: center">
          <div style="padding-right: 20px">
            <el-image style="width: 100px; height: 100px" :src="data.row.image"
          /></div>
          <div>{{ data.row.title }}</div>
        </div>
      </template>
      <template #image="data">
        <div> <el-image style="width: 100px; height: 100px" :src="data.row.image" /></div>
      </template>
    </Table>
  </ContentWrap>
</template>
