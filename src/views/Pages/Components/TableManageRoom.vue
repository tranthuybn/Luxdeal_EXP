<script setup lang="ts">
import { TableData } from '@/api/table/types'
import { PropType, ref, onBeforeMount } from 'vue'
import { TableType01 } from './TableBase/index2'
import { TableResponse, apiType } from './Type'
import {
  addOperatorColumn,
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
  isOperatorColumnCustomize: {
    type: Boolean,
    default: false
  },
  api: {
    type: Function as PropType<apiType>,
    default: () => Promise<IResponse<TableResponse<TableData>>>
  },
  selection: {
    type: Boolean,
    default: true
  }
})
const tableBase01 = ref<ComponentRef<typeof TableType01>>()

onBeforeMount(() => {
  dynamicApi.value = props.api
  dynamicColumns.value = props.columns
  if (!props.isOperatorColumnCustomize) addOperatorColumn(dynamicColumns.value)
})
</script>
<template>
  <section>
    <TableType01
      ref="tableBase01"
      :api="dynamicApi"
      :maxHeight="'69vh'"
      :fullColumns="dynamicColumns"
      @total-record="fnGetTotalRecord"
      @selected-record="fnGetSelectedRecord"
      :selection="selection"
    />
  </section>
</template>
