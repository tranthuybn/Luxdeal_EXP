<script setup lang="ts">
import { h, onBeforeMount, reactive, ref, unref, watch } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import { collaboratorStatusTransferToText, dateTimeFormat } from '@/utils/format'
import { HeaderFiler } from '../../Components/HeaderFilter'
import { TableExtension } from '../../Components/TableBase'
import { getCollaboratorsList } from '@/api/Business'
import { filterStatusCustomer } from '@/utils/filters'
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
import { ElDrawer, ElButton, ElCheckboxGroup, ElCheckboxButton } from 'element-plus'
const { t } = useI18n()
const columns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'code',
    label: t('reuse.collaboratorsCode'),
    minWidth: '100'
  },
  {
    field: 'accountName',
    label: t('reuse.collaboratorsName'),
    minWidth: '150'
  },

  {
    field: 'contact',
    label: t('reuse.contact'),
    minWidth: '250'
  },
  {
    field: 'account',
    label: t('reuse.account'),
    minWidth: '200'
  },
  {
    field: 'totalMoney',
    label: t('reuse.totalMoney'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'createdAt',
    label: t('reuse.createDate'),
    minWidth: '150',
    align: 'center',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'createdBy',
    label: t('reuse.creator'),
    minWidth: '130',
    headerFilter: 'Name'
  },
  {
    field: 'status',
    label: t('reuse.accountStatus'),
    minWidth: '200',
    filters: filterStatusCustomer,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return h('div', collaboratorStatusTransferToText(cellValue))
    }
  }
])

const createIcon = useIcon({ icon: 'uil:create-dashboard' })
const eyeIcon = useIcon({ icon: 'emojione-monotone:eye-in-speech-bubble' })
const editIcon = useIcon({ icon: 'akar-icons:chat-edit' })

// using table's function
const { register, tableObject, methods } = useTable<TableData>({
  getListApi: getCollaboratorsList,
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
  dynamicApi.value = getCollaboratorsList
  dynamicColumns.value = columns
  addOperatorColumn(dynamicColumns.value)
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
const { setSearchParams } = methods
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
</script>
<template>
  <HeaderFiler @get-data="getData" @refresh-data="getData">
    <template #headerFilterSlot>
      <el-button type="primary" :icon="createIcon" @click="pushAdd">
        {{ t('router.collaboratorsAdd') }}</el-button
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
      <template #contact="data">
        <div v-if="data.row.customer?.taxCode">Mst: {{ data.row.customer?.taxCode }}</div>
        <div v-if="data.row.customer?.phonenumber"
          >{{ t('reuse.phoneNumber') }}: {{ data.row.customer?.phonenumber }}</div
        >
        <div v-if="data.row.customer?.email">Email: {{ data.row.customer?.email }}</div>
        <div v-if="data.row.customer?.address">Địa chỉ: {{ data.row.customer?.address }}</div>
      </template>
      <template #account="data">
        <div v-if="data.row.accountNumber">STK: {{ data.row.accountNumber }}</div>
        <div v-if="data.row.accountName">Tên TK: {{ data.row.accountName }}</div>
        <div v-if="data.row.bank.name">NH: {{ data.row.bank.name }}</div>
      </template>
      <template #operator="{ row }">
        <ElButton @click="action(row, 'detail')" :icon="eyeIcon" />
        <ElButton @click="action(row, 'edit')" :icon="editIcon" />
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
    /* width of vertical scrollbar */
    background-color: var(--top-tool-border-color);
    height: 10px;
    /* height of horizontal scrollbar ← You're missing this */
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: var(--el-color-primary);
    width: 4px;
  }

  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0px 0px 1px var(--el-color-info);
    box-shadow: inset 0px 0px 1px var(--el-color-info);
    background-color: var(--el-color-primary);
  }
}

::v-deep(.el-drawer__header) {
  margin-bottom: 0;
  padding: 0;
}

::v-deep(.el-checkbox-group) {
  margin: auto;
  display: flex;
  width: max-content;
  justify-content: center;
  align-items: flex-start;
}

#rabbit-ear {
  width: 132px;
  text-align: center;
  z-index: 28;
  border-radius: 0 0 5px 5px;
  border: 1px solid var(--tags-view-border-color);
  background-color: var(--logo-title-text-color);
  box-shadow: 0px 0px 2px 1px var(--left-menu-text-color);
  top: -10px;
  height: 24px;
  right: calc(50% - 66px);

  &:hover {
    top: 0;
    border: 0px 1px 1px 1px solid var(--el-color-primary);
    box-shadow: 0px 0px 2px 1px var(--el-color-primary);
    color: var(--el-color-primary);
  }
}
</style>
