<script setup lang="ts">
import { TableData } from '@/api/table/types'
import { useIcon } from '@/hooks/web/useIcon'
import { ElButton } from 'element-plus'
import { PropType, ref, unref, onBeforeMount } from 'vue'
import { HeaderFiler } from './HeaderFilter/index'
import { TableExtension, TableType01 } from './TableBase/index'
import { TableResponse, apiType } from './Type'
import {
  operatorColumn,
  getTotalRecord,
  getSelectedRecord,
  fnGetTotalRecord,
  fnGetSelectedRecord,
  dynamicApi,
  dynamicColumns
} from './TablesReusabilityFunction'
const props = defineProps({
  columns: {
    type: Array as PropType<TableColumn[]>,
    default: () => []
  },
  api: {
    type: Function as PropType<apiType>,
    default: () => Promise<IResponse<TableResponse<TableData>>>
  },
  selection: {
    type: Boolean,
    default: false
  }
})

const createIcon = useIcon({ icon: 'uil:create-dashboard' })

const tableBase01 = ref<ComponentRef<typeof TableType01>>()

const getData = () => {
  unref(tableBase01)?.getData()
}
// add operator column at the end if dynamicColumns doesnt have
const addOperatorColumn = (dynamicColumns) => {
  let hasOperator = false
  dynamicColumns.map((col) => {
    if (col.field === operatorColumn.field) {
      hasOperator = true
    }
  })
  if (!hasOperator) dynamicColumns?.push(operatorColumn)
}
onBeforeMount(() => {
  dynamicApi.value = props.api
  dynamicColumns.value = props.columns
  addOperatorColumn(dynamicColumns.value)
})
</script>
<template>
  <section>
    <HeaderFiler @get-data="getData" @refresh-data="getData">
      <template #headerFilterSlot>
        <el-button type="primary" :icon="createIcon"> Khởi tạo mới </el-button>
      </template>
    </HeaderFiler>
    <TableExtension
      v-if="selection"
      :totalRecord="getTotalRecord"
      :selectedRecord="getSelectedRecord"
    />
    <TableType01
      ref="tableBase01"
      :api="dynamicApi"
      :fullColumns="dynamicColumns"
      @total-record="fnGetTotalRecord"
      @selected-record="fnGetSelectedRecord"
      :selection="selection"
    />
  </section>
</template>
