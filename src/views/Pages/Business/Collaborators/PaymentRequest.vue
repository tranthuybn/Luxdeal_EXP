<script setup lang="ts">
import { h, onBeforeMount, reactive, ref, unref, watch } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import {
  commissionPaymentStatusTransferToText,
  dateTimeFormat,
  isFileTransferToText,
} from '@/utils/format'
import { HeaderFiler } from '../../Components/HeaderFilter'
import { TableExtension } from '../../Components/TableBase'
import { getCommissionPaymentList } from '@/api/Business'
import { filterStatusCustomer, filterYesOrNo, filterPaymentCheckbox } from '@/utils/filters'
import { useIcon } from '@/hooks/web/useIcon'
import { useAppStore } from '@/store/modules/app'
import { useRouter, useRoute } from 'vue-router'
import {
  dynamicApi,
  dynamicColumns,
  addOperatorColumn,
  getTotalRecord,
  getSelectedRecord,
  fnGetTotalRecord,
  fnGetSelectedRecord
} from '../../Components/TablesReusabilityFunction'
import { TableData } from '@/api/table/types'
import { useTable } from '@/hooks/web/useTable'
import { usePermission, filterHandler, changeMoney } from '@/utils/tsxHelper'
import { ElDrawer, ElButton, ElCheckboxGroup, ElCheckboxButton } from 'element-plus'
import { InputSearch } from '@/views/Pages/Components/TableBase/index'


const { currentRoute } = useRouter()
const userPermission = usePermission(currentRoute.value)
const { t } = useI18n()
const columns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center',
  },
  {
    field: 'collaborator.code',
    label: t('reuse.collaboratorsCode'),
    minWidth: '120',
    headerAlign: 'left'
  },
  {
    field: 'collaborator.accountName',
    label: t('reuse.collaboratorsName'),
    minWidth: '290',
    headerAlign: 'left'
  },

  {
    field: 'price',
    label: t('reuse.amountOfMoney'),
    minWidth: '120',
    align: 'right',
    sortable: true,
    headerAlign: 'left',
    formatter: (_: Recordable, __: TableColumn, cellValue) => changeMoney.format(parseInt(cellValue))
  },
  {
    field: 'code',
    label: t('reuse.codeRequest'),
    minWidth: '120',
    headerAlign: 'left',
    headerFilter: 'Search'
  },
  {
    field: 'isFile',
    label: t('formDemo.attachments'),
    minWidth: '150',
    headerAlign: 'left',
    filters: filterYesOrNo,
    filterMethod: filterHandler,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return t(`${isFileTransferToText(cellValue)}`)
    }
  },
  {
    field: 'receiptOrPaymentVoucherId',
    label: t('router.receiptsAndExpenditures'),
    minWidth: '150',
    align: 'right',
    headerAlign: 'left',
    headerFilter: 'Search'
  },
  {
    field: 'paymentOrder',
    label: t('router.paymentProposal'),
    minWidth: '150',
    headerAlign: 'left',
    headerFilter: 'Search'
  },
  {
    field: 'paid',
    label: t('reuse.alreadyPaid'),
    minWidth: '150',
    formatter: (record: Recordable, __: TableColumn, _cellValue: boolean) => {
      return h('input', {type: 'checkbox', checked: record.paid, disabled: true})
    },
    filters: filterPaymentCheckbox,
    filterMethod: filterHandler,
    align: 'center',
    headerAlign: 'left'
  },
  {
    field: 'createdAt',
    label: t('reuse.createDate'),
    minWidth: '150',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    },
    headerAlign: 'left'
  },
  {
    field: 'createdBy',
    label: t('reuse.creator'),
    minWidth: '150',
    headerAlign: 'left'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '150',
    filters: filterStatusCustomer,
    filterMethod: filterHandler,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return t(`${commissionPaymentStatusTransferToText(cellValue)}`)
    },
    headerAlign: 'left'
  }
])

const apiToFilter = [

]
const createIcon = useIcon({ icon: 'uil:create-dashboard' })
const eyeIcon = useIcon({ icon: 'emojione-monotone:eye-in-speech-bubble' })
const editIcon = useIcon({ icon: 'akar-icons:chat-edit' })

// using table's function
const { register, tableObject, methods } = useTable<TableData>({
  getListApi: getCommissionPaymentList,
  response: {
    list: '',
    total: 'count'
  },
  props: {
    columns: columns,
    headerAlign: 'center'
  }
})
//add operator for every table
onBeforeMount(() => {
  dynamicApi.value = getCommissionPaymentList
  dynamicColumns.value = columns
  if(userPermission) addOperatorColumn(dynamicColumns.value)
  getData()
})
const appStore = useAppStore()
const Utility = appStore.getUtility
const route = useRoute()
const { push } = useRouter()
// get data from router
const router = useRouter()

const pushAdd = () => {
  push({
    name: `${String(router.currentRoute.value.name)}.${Utility}`,
    params: { type: 'add', backRoute: String(router.currentRoute.value.name) }
  })
}
const showingColumnList = ref<Array<string>>(
  columns.length > 0 ? columns.map((el) => el.field)?.filter((el) => el) : []
)
const showingColumn =
  columns.length > 0
    ? columns.map((el) => ({ value: el.field, label: el.label }))?.filter((el) => el.value)
    : []
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
      fnGetSelectedRecord(res)
    })
    .catch(() => {})
}
const { setSearchParams, clearSearchParams } = methods
const filterChange = (filterValue) => {
  if (filterValue && typeof unref(filterValue) === 'object')
    for (let key in filterValue) {
      if (typeof unref(filterValue[key]) === 'object')
        filterValue[key] = Object.values(filterValue[key]).toString()
    }
  setSearchParams(filterValue)
}
const action = (row: TableData, type: string) => {
  if (type === 'detail' || type === 'edit' || !type) {
    push({
      name: `${String(router.currentRoute.value.name)}.${Utility}`,
      params: { id: row.id, type: type }
    })
  }
}
const cancel = (field) => {
  clearSearchParams(field)
}
const filterSelect = (value) => {
  setSearchParams(value)
}
const getData = (data = {}) => {
  methods.setSearchParams({ ...data })
}
const drawer = ref(false)
// execute pagination
let paginationObj = ref<Pagination>()
watch(
  () => tableObject.tableList,
  () => {
    paginationObj.value = {
      total: tableObject.total
    }
    fnGetTotalRecord(tableObject.tableList.length)
  },
  {
    immediate: true
  }
)
const ColumnsHaveHeaderFilter = columns.filter((col) => col.headerFilter)

</script>
<template>
  <HeaderFiler @get-data="getData" @refresh-data="getData">
    <template #headerFilterSlot>
      <el-button type="primary" :icon="createIcon" @click="pushAdd">
        {{ t('reuse.newInitialization') }}</el-button
      >
    </template>
  </HeaderFiler>
  <TableExtension :totalRecord="getTotalRecord" :selectedRecord="getSelectedRecord" />
  <ContentWrap class="relative">
    <div
      class="dark:(bg-dark-600 opacity-25 text-red-800) absolute"
      id="rabbit-ear"
      @click="drawer = !drawer"
    >
      <Icon icon="ic:baseline-keyboard-double-arrow-down" />
    </div>
    <ElDrawer v-model="drawer" direction="ttb" size="30%">
      <template #header>
        <h3 class="text-center text-[var(--el-color-primary)]">{{ t(`${route.meta.title}`) }}</h3>
      </template>
      <template #default>
        <ElCheckboxGroup v-model="showingColumnList" fill="var(--el-color-primary)">
          <ElCheckboxButton
            v-for="(item, index) in showingColumn"
            :key="index"
            :label="item.value"
            size="small"
            >{{ item.label }}</ElCheckboxButton
          >
        </ElCheckboxGroup>
      </template>
    </ElDrawer>
    <Table
      ref="tableRef"
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :pagination="paginationObj"
      :showOverflowTooltip="false"
      maxHeight="69vh"
      @total-record="fnGetTotalRecord"
      @selected-record="fnGetSelectedRecord"
      @mouseenter="operatorColumnToggle('right')"
      @mouseleave="operatorColumnToggle(false)"
      @select="getTableSelected"
      @select-all="getTableSelected"
      @register="register"
      @filter-change="filterChange"
    >
      <template #operator="{ row }">
        <ElButton @click="action(row, 'detail')" :icon="eyeIcon" />
        <ElButton @click="action(row, 'edit')" :icon="editIcon" />
      </template>
      <template v-for="(header, index) in ColumnsHaveHeaderFilter" #[`${header.field}-header`] :key="index">
        {{ header.label }}
        <InputSearch
            v-if="header.headerFilter === 'Search'" :apiToFilter="apiToFilter[header.field]" :field="header.field" @filter-select="filterSelect"
            @cancel="cancel" />
      </template>
    </Table>
  </ContentWrap>
</template>
<style lang="less" scoped>
::v-deep(.el-overlay) {
  position: absolute !important;
}

::v-deep(.el-drawer__body) {
  padding: 3px !important;

  &::-webkit-scrollbar {
    display: block;
    width: 10px;
    height: 10px;

    /* width of vertical scrollbar */
    background-color: var(--top-tool-border-color);

    /* height of horizontal scrollbar ← You're missing this */
  }

  &::-webkit-scrollbar-thumb {
    width: 4px;
    background-color: var(--el-color-primary);
    border-radius: 10px;
  }

  ::-webkit-scrollbar-track {
    background-color: var(--el-color-primary);
    box-shadow: inset 0 0 1px var(--el-color-info);
  }
}

::v-deep(.el-drawer__header) {
  padding: 0;
  margin-bottom: 0;
}

::v-deep(.el-checkbox-group) {
  display: flex;
  width: max-content;
  margin: auto;
  justify-content: center;
  align-items: flex-start;
}

#rabbit-ear {
  top: -10px;
  right: calc(50% - 66px);
  z-index: 28;
  width: 132px;
  height: 24px;
  text-align: center;
  background-color: var(--logo-title-text-color);
  border: 1px solid var(--tags-view-border-color);
  border-radius: 0 0 5px 5px;
  box-shadow: 0 0 2px 1px var(--left-menu-text-color);

  &:hover {
    top: 0;
    color: var(--el-color-primary);
    border: 0 1px 1px 1px solid var(--el-color-primary);
    box-shadow: 0 0 2px 1px var(--el-color-primary);
  }
}
</style>
