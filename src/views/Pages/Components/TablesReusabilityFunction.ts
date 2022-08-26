import { useIcon } from '@/hooks/web/useIcon'
import { ElButton, ElCol, ElRow } from 'element-plus'
import { h, ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
import { apiType } from './Type'
// declare
const eyeIcon = useIcon({ icon: 'emojione-monotone:eye-in-speech-bubble' })
const editIcon = useIcon({ icon: 'akar-icons:chat-edit' })
const trashIcon = useIcon({ icon: 'fluent:delete-12-filled' })
// Add operation column for table
const operatorColumn: TableColumn = {
  field: 'operator',
  label: t('reuse.operator'),
  minWidth: '180',
  fixed: false,
  formatter: (record: Recordable, __: TableColumn, cellValue: TableSlotDefault) => {
    return h(ElRow, { gutter: 20, justify: 'space-around' }, () => [
      h(ElCol, { span: 8 }, () =>
        h(ElButton, { icon: eyeIcon, onClick: () => addingEvent(record, cellValue) })
      ),
      h(ElCol, { span: 8 }, () => h(ElButton, { icon: editIcon })),
      h(ElCol, { span: 8 }, () => h(ElButton, { icon: trashIcon }))
    ])
  }
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

const addingEvent = (record: Recordable, data: TableSlotDefault) => {
  console.log(record, data)
}
// table selection
const getTotalRecord = ref(0)
const getSelectedRecord = ref<Array<any>>([])
function fnGetTotalRecord(val) {
  getTotalRecord.value = val ?? 0
}
function fnGetSelectedRecord(val) {
  getSelectedRecord.value = val ?? []
}
// columns and api
const dynamicApi = ref<apiType>()
const dynamicColumns = ref<TableColumn[]>()
const resetTable = () => {
  if (Array.isArray(dynamicColumns.value) && dynamicColumns.value?.length > 0)
    dynamicColumns.value?.splice(0, dynamicColumns.value.length)
  dynamicApi.value = undefined
}
export {
  operatorColumn,
  addingEvent,
  getTotalRecord,
  getSelectedRecord,
  fnGetTotalRecord,
  fnGetSelectedRecord,
  dynamicApi,
  dynamicColumns,
  resetTable,
  addOperatorColumn
}
