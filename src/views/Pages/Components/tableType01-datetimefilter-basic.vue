<script setup lang="ts">
import { TableData } from '@/api/table/types'
import { useIcon } from '@/hooks/web/useIcon'
import { ElButton } from 'element-plus'
import { PropType, ref, unref, onBeforeMount, onUnmounted } from 'vue'
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
  }
})

const createIcon = useIcon({ icon: 'uil:create-dashboard' })

const tableBase01 = ref<ComponentRef<typeof TableType01>>()

const getData = () => {
  unref(tableBase01)?.getData()
}
onBeforeMount(() => {
  dynamicApi.value = props.api
  dynamicColumns.value = props.columns
  if (dynamicColumns.value.length > 0) dynamicColumns.value.push(operatorColumn)
})
onUnmounted(() => {
  if (dynamicColumns.value && dynamicColumns.value.length > 0) dynamicColumns.value.pop()
})
</script>
<template>
  <section>
    <HeaderFiler @get-data="getData" @refresh-data="getData">
      <template #headerFilterSlot>
        <el-button type="primary" :icon="createIcon"> Khởi tạo mới </el-button>
      </template>
    </HeaderFiler>
    <TableExtension :totalRecord="getTotalRecord" :selectedRecord="getSelectedRecord" />
    <TableType01
      ref="tableBase01"
      :api="dynamicApi"
      :fullColumns="dynamicColumns"
      @total-record="fnGetTotalRecord"
      @selected-record="fnGetSelectedRecord"
    />
  </section>
</template>
