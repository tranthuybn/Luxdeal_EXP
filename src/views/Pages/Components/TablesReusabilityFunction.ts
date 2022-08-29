import { ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
import { apiType } from './Type'
import { useRoute } from 'vue-router'

// Add operation column for table
const operatorColumn: TableColumn = {
  field: 'operator',
  label: t('reuse.operator'),
  minWidth: '200',
  fixed: false
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
//get utility route
const route = useRoute()
const utilityRoute = () => {
  return route
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
  addOperatorColumn,
  utilityRoute
}
