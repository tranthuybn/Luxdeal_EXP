<script setup lang="ts">
import { TableData } from '@/api/table/types'
import { useIcon } from '@/hooks/web/useIcon'
import { ElButton } from 'element-plus'
import { PropType, ref, unref, onBeforeMount } from 'vue'
import { HeaderFiler } from './HeaderFilter/index'
import { TableExtension, TableBase } from './TableBase/index'
import { TableResponse, apiType } from './Type'
import { addOperatorColumn, dynamicApi, dynamicColumns } from './TablesReusabilityFunction'
import { useRouter } from 'vue-router'
import { useI18n } from '@/hooks/web/useI18n'
import { useAppStore } from '@/store/modules/app'
import moment from 'moment'
import { ElNotification } from 'element-plus'
import { excelParser } from './excel-parser'
const { currentRoute } = useRouter()
const { t } = useI18n()
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
    type: Function as PropType<any>,
    default: () => Promise<IResponse<TableResponse<TableData>>>
  },
  delApi: {
    type: Function as PropType<any>,
    default: () => Promise<IResponse<TableResponse<TableData>>>
  },
  selection: {
    type: Boolean,
    default: true
  },
  expand: {
    type: Boolean,
    default: false
  },
  titleButtons: {
    type: String,
    default: ''
  },
  titleAdd: {
    type: String,
    default: 'reuse.newInitialization'
  },
  titleChilden: {
    type: String,
    default: ''
  },
  apiTableChild: {
    type: Function as PropType<apiType>,
    default: () => Promise<IResponse<TableResponse<TableData>>>
  },
  columnsTableChild: {
    type: Array as PropType<TableColumn[]>,
    default: () => []
  },
  customOperator: {
    type: Number,
    default: 1
  },
  pagination: {
    type: Boolean,
    default: true
  },
  removeDrawer: {
    type: Boolean,
    default: false
  },
  removeHeaderFilter: {
    type: Boolean,
    default: false
  },
  deleteTitle: {
    type: String,
    default: 'Warning'
  },
  removeHeaderFilterSlot: {
    type: Boolean,
    default: false
  },
  typeButton: {
    type: String,
    default: ''
  },
  removeButtonAdd: {
    type: Boolean,
    default: false
  },
  apiHasPagination: {
    type: Boolean,
    default: false,
  },
  apiToFilter: {
    type: Object,
    default: () => {}
  },
  showSummary: {
    type: Boolean,
    default: false
  },
  getSummaries: {
    type: Function,
    default: () => []
  }
})
const createIcon = useIcon({ icon: 'uil:create-dashboard' })
const tableBase01 = ref<ComponentRef<typeof TableBase>>()

const getData = (data) => {
  unref(tableBase01)!.getData(data)
}

//add operator for every table
onBeforeMount(() => {
  dynamicApi.value = props.api
  dynamicColumns.value = props.columns
  if (!props.isOperatorColumnCustomize) addOperatorColumn(dynamicColumns.value)
})


const appStore = useAppStore()
const Utility = appStore.getUtility

const { push } = useRouter()
const router = useRouter()
const pushAdd = () => {
  push({
    name: `${String(router.currentRoute.value.name)}.${Utility}`,
    params: { type: 'add', backRoute: String(router.currentRoute.value.name) }
  })
}

//declare variables here (not from file) so it will reset when change pages
const getTotalRecord = ref(0)
const getSelectedRecord = ref<Array<any>>([])
function fnGetTotalRecord(val) {
  getTotalRecord.value = val ?? 0
}
function fnGetSelectedRecord(val) {
  getSelectedRecord.value = val ?? []
}

const ExportExcelEvent = () => {
  if (
    unref(tableBase01)!.tableObject.tableList &&
    unref(tableBase01)!.tableObject.tableList.length > 0
  ) {
    const exportData = unref(tableBase01)!.tableObject.tableList.map((el) => initMappingObject(el))
    excelParser().exportDataFromJSON(
      exportData,
      'DDA.' + currentRoute.value.path + moment().format('yMMDDhmmss'),
      null
    )
  } else
    return ElNotification({
      message: t('reuse.exportExcelFailed'),
      type: 'error'
    })
}
const initMappingObject = (el) => {
  // map array element iteam to object key
  if (dynamicColumns.value && dynamicColumns.value.length > 0) {
    const dictionaryObject = dynamicColumns.value.reduce(function (map, obj) {
      map[obj.label] = el[obj.field]
      return map
    }, {})
    return dictionaryObject
  }
  return []
}

</script>
<template>
  <section>
    <HeaderFiler @get-data="getData" @refrsesh-data="getData" v-if="!removeHeaderFilter" :removeButtonAdd="props.removeButtonAdd">
        <template #headerFilterSlot v-if="!removeHeaderFilterSlot">
          <el-button v-if="!removeButtonAdd" type="primary" :icon="createIcon" @click="pushAdd">
            {{ t(`${props.titleAdd}`) }}
          </el-button>
        </template>
    </HeaderFiler>
    <TableExtension
      v-if="selection" :totalRecord="getTotalRecord" :selectedRecord="getSelectedRecord"
      @export-excel-event="ExportExcelEvent" />
    <TableBase
      :removeDrawer="removeDrawer" 
      :expand="expand" 
      :titleButtons="props.titleButtons"
      :typeButton="props.typeButton" 
      :customOperator="customOperator" 
      :apiTableChild="apiTableChild" 
      :delApi="delApi"
      :deleteTitle="deleteTitle" 
      :columnsTableChild="columnsTableChild" 
      :paginationType="pagination" 
      ref="tableBase01" 
      :apiHasPagination="props.apiHasPagination"
      :api="dynamicApi" 
      :maxHeight="'69vh'" 
      :fullColumns="dynamicColumns" 
      @total-record="fnGetTotalRecord" 
      @selected-record="fnGetSelectedRecord" 
      :selection="selection" 
      :showSummary="props.showSummary"
      :getSummaries="getSummaries"
      :apiToFilter="props.apiToFilter"
      :titleChilden="props.titleChilden">
      <template #expand>
        <slot name="expand"></slot>
      </template>
      <template #sumInBalanceSheet>
        <slot name="sumInBalanceSheet"></slot>
      </template>
    </TableBase>
  </section>
</template>
