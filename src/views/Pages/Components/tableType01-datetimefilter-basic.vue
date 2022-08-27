<script setup lang="ts">
import { TableData } from '@/api/table/types'
import { useIcon } from '@/hooks/web/useIcon'
import { ElButton } from 'element-plus'
import { PropType, ref, unref, onBeforeMount } from 'vue'
import { HeaderFiler } from './HeaderFilter/index'
import { TableExtension, TableType01 } from './TableBase/index'
import { TableResponse, apiType } from './Type'
import {
  addOperatorColumn,
  getTotalRecord,
  getSelectedRecord,
  fnGetTotalRecord,
  fnGetSelectedRecord,
  dynamicApi,
  dynamicColumns
} from './TablesReusabilityFunction'
import { useRouter } from 'vue-router'
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
  },
  nameRouter: {
    type: String,
    default: ''
  }
})

const createIcon = useIcon({ icon: 'uil:create-dashboard' })

const tableBase01 = ref<ComponentRef<typeof TableType01>>()

const getData = (data) => {
  unref(tableBase01)?.getData(data)
}
onBeforeMount(() => {
  dynamicApi.value = props.api
  dynamicColumns.value = props.columns
  if (!props.isOperatorColumnCustomize) addOperatorColumn(dynamicColumns.value)
})
const { push } = useRouter()
const pushAdd = () => {
  console.log('name:', props.nameRouter)
  push({ name: props.nameRouter })
}
</script>
<template>
  <section>
    <HeaderFiler @get-data="getData" @refresh-data="getData">
      <template #headerFilterSlot>
        <el-button type="primary" :icon="createIcon" @click="pushAdd"> Khởi tạo mới </el-button>
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
      :maxHeight="'69vh'"
      :fullColumns="dynamicColumns"
      @total-record="fnGetTotalRecord"
      @selected-record="fnGetSelectedRecord"
      :selection="selection"
    />
  </section>
</template>
