<script setup lang="ts">
import { onBeforeMount, reactive, ref, unref, watch } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import { HeaderFiler } from '../../Components/HeaderFilter'
import {
  TableExtension,
  InputMoneyRange,
  InputDateRange,
  InputNumberRange,
  InputName
} from '../../Components/TableBase'
import { getPotentialCustomerList } from '@/api/Business'
import {
  filterStatus,
  filterPotentialCustomerStatus,
  filterService,
  filterSource,
  filterApproaching,
  filterTransactionStatus,
  filterTransaction
} from '@/utils/filters'
import {
  dateTimeFormat,
  formatPotentialCustomerStatusIdToText,
  formatServiceIdToText,
  onlineToText
} from '@/utils/format'
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
import {
  ElMessageBox,
  ElNotification,
  ElDrawer,
  ElButton,
  ElCheckboxGroup,
  ElCheckboxButton
} from 'element-plus'
const { t } = useI18n()
const columns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'potentialCustomerHistorys[0].staffName',
    label: t('reuse.sale'),
    minWidth: '150',
    headerFilter: 'Name'
  },
  {
    field: 'customerInfo',
    label: t('reuse.customerInfo'),
    minWidth: '250'
  },
  {
    field: 'historyTransactionName',
    label: t('reuse.transaction'),
    minWidth: '200',
    filters: filterTransaction
  },
  {
    field: 'isOnline',
    label: t('reuse.transactionStatus'),
    minWidth: '100',
    filters: filterTransactionStatus,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return onlineToText(cellValue)
    }
  },
  {
    field: 'accessChannelName',
    label: t('reuse.approachingChannel'),
    minWidth: '100',
    filters: filterApproaching
  },
  {
    field: 'note',
    label: t('reuse.note'),
    minWidth: '150'
  },
  {
    field: 'sourceName',
    label: t('reuse.originated'),
    minWidth: '100',
    filters: filterSource
  },
  {
    field: 'service',
    label: t('reuse.service'),
    minWidth: '100',
    filters: filterService,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return formatServiceIdToText(cellValue)
    }
  },
  {
    field: 'serviceDetail',
    label: t('reuse.serviceDetail'),
    minWidth: '200'
  },
  {
    field: 'potentialCustomerHistorys[0].content',
    label: t('reuse.potentialCustomerHistory'),
    minWidth: '200'
  },
  {
    field: 'order',
    label: t('reuse.order'),
    minWidth: '150'
  },
  {
    field: 'feedback',
    label: t('reuse.feedBack'),
    minWidth: '180',
    filters: filterStatus
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
    minWidth: '150',
    headerFilter: 'Name'
  },
  {
    field: 'statusId',
    label: t('reuse.status'),
    minWidth: '180',
    filters: filterPotentialCustomerStatus,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return formatPotentialCustomerStatusIdToText(cellValue)
    }
  }
])

const createIcon = useIcon({ icon: 'uil:create-dashboard' })
const eyeIcon = useIcon({ icon: 'emojione-monotone:eye-in-speech-bubble' })
const editIcon = useIcon({ icon: 'akar-icons:chat-edit' })
const trashIcon = useIcon({ icon: 'fluent:delete-12-filled' })

// using table's function
const { register, tableObject, methods } = useTable<TableData>({
  getListApi: getPotentialCustomerList,
  response: {
    list: 'list',
    total: 'total'
  },
  props: {
    columns: columns,
    headerAlign: 'center'
  }
})
//add operator for every table
onBeforeMount(() => {
  dynamicApi.value = getPotentialCustomerList
  dynamicColumns.value = columns
  addOperatorColumn(dynamicColumns.value)
  getData()
})
const appStore = useAppStore()
const Utility = appStore.getUtility
const route = useRoute()
const { push } = useRouter()
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
const delData = async (row: TableData | null, multiple: boolean) => {
  {
    ElMessageBox.confirm(`${t('reuse.deleteWarning')}`, 'Xóa', {
      confirmButtonText: t('reuse.delete'),
      cancelButtonText: t('reuse.exit'),
      type: 'warning',
      confirmButtonClass: 'el-button--danger'
    })
      .then(async () => {
        console.log('row', row, multiple)
        if (row !== null && row.children.length == 0) {
          // change this to delApi
          const res = await getPotentialCustomerList({ Id: row.id })
            .then(() =>
              ElNotification({
                message: t('reuse.deleteSuccess'),
                type: 'success'
              })
            )
            .catch((error) =>
              ElNotification({
                message: error,
                type: 'warning'
              })
            )
          if (res) {
            getData()
          }
        } else {
          ElNotification({
            message: t('reuse.deleteFail'),
            type: 'warning'
          })
        }
      })
      .catch(() => {
        ElNotification({
          type: 'info',
          message: t('reuse.deleteCancel')
        })
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
const ColumnsHaveHeaderFilter = columns.filter((col) => col.headerFilter)
//value is an object, get called when filter range(to-from) value
const confirm = (value) => {
  setSearchParams(value)
}
const cancel = (field) => {
  clearSearchParams(field)
}
const filterSelect = (value) => {
  setSearchParams(value)
}
</script>
<template>
  <HeaderFiler @get-data="getData" @refresh-data="getData">
    <template #headerFilterSlot>
      <el-button type="primary" :icon="createIcon" @click="pushAdd">
        {{ t('reuse.addCategory') }}</el-button
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
      <template #customerInfo="data">
        <div>{{ data.row.name }}</div>
        <div>{{ t('reuse.phoneNumber') }}: {{ data.row.phonenumber }}</div>
        <div>Email: {{ data.row.email }}</div>
        <div>Link: {{ data.row.link }}</div>
      </template>
      <template #feedback="data">
        <div>{{ t('reuse.date') }}: {{ dateTimeFormat(data.row.feedbackDate) }}</div>
        <div>{{ t('reuse.rating') }}: {{ data.row.feedbackStar }}</div>
        <div>{{ t('reuse.content') }}: {{ data.row.feedbackContent }}</div>
      </template>
      <template #order="data">
        <div>{{ t('reuse.orderCode') }}: {{ data.row.orderCode }}</div>
      </template>
      <template #operator="{ row }">
        <ElButton @click="action(row, 'detail')" :icon="eyeIcon" />
        <ElButton @click="action(row, 'edit')" :icon="editIcon" />
        <ElButton @click="delData(row, false)" :icon="trashIcon" />
      </template>
      <template
        v-for="(header, index) in ColumnsHaveHeaderFilter"
        #[`${header.field}-header`]
        :key="index"
      >
        {{ header.label }}
        <InputMoneyRange
          v-if="header.headerFilter === 'Money'"
          :field="header.field"
          @confirm="confirm"
          @cancel="cancel"
        />
        <InputDateRange
          v-if="header.headerFilter === 'Date'"
          :field="header.field"
          @confirm="confirm"
          @cancel="cancel"
        />
        <InputNumberRange
          v-if="header.headerFilter === 'Number'"
          :field="header.field"
          @confirm="confirm"
          @cancel="cancel"
        />
        <InputName
          v-if="header.headerFilter === 'Name'"
          :field="header.field"
          @filter-select="filterSelect"
          @cancel="cancel"
        />
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
