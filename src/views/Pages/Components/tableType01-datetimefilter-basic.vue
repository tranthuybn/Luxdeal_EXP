<script setup lang="ts">
import { TableData } from '@/api/table/types'
import { useI18n } from '@/hooks/web/useI18n'
import { useIcon } from '@/hooks/web/useIcon'
import { ElButton, ElCol, ElRow } from 'element-plus'
import { PropType, h, reactive, ref } from 'vue'
import { HeaderFiler } from './HeaderFilter/index'
import { TableExtension, TableType01 } from './TableBase/index'
const { t } = useI18n()

interface TableResponse<T = any> {
  total: number
  list: T[]
  pageNumber: number
  pageSize: number
}
type apiType = <T = any>(option: any) => Promise<IResponse<TableResponse<T>>>
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
const acitonFn = (record: Recordable, data: TableSlotDefault) => {
  console.log(record, data)
}
const fullColumns: TableColumn[] = reactive(props.columns)
fullColumns.push(operatorColumn)
const getTotalRecord = ref(0)
const getSelectedRecord = ref<Array<any>>([])
function fnGetTotalRecord(val) {
  getTotalRecord.value = val ?? 0
}
function fnGetSelectedRecord(val) {
  getSelectedRecord.value = val ?? []
}
const tableBase01 = ref(null)
const getData = () => {
  // tableBase01.value?.abndsad('adsfa')
}
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
      :api="api"
      :fullColumns="fullColumns"
      @total-record="fnGetTotalRecord"
      @selected-record="fnGetSelectedRecord"
    />
  </section>
</template>
