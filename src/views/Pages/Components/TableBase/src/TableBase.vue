<script setup lang="ts">
import { TableData } from '@/api/table/types'
import { ContentWrap } from '@/components/ContentWrap'
import { Table, TableExpose } from '@/components/Table'
import { onBeforeMount, PropType, ref, unref, watch } from 'vue'
import { TableResponse } from '../../Type'
import {
  ElButton,
  ElDrawer,
  ElCheckboxGroup,
  ElCheckboxButton,
  ElMessageBox,
  ElSwitch,
  ElNotification
} from 'element-plus'
import { InputMoneyRange, InputDateRange, InputNumberRange, InputName } from '../index'
import { useIcon } from '@/hooks/web/useIcon'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from '@/hooks/web/useI18n'
import { useAppStore } from '@/store/modules/app'
import { useTable } from '@/hooks/web/useTable'
import { inject } from 'vue'
//provide from main component
const { params }: any = inject('parameters', {})
const { t } = useI18n()
const route = useRoute()
const tableRef = ref<TableExpose>()
const props = defineProps({
  api: {
    type: Function as PropType<any>,
    default: () => Promise<IResponse<TableResponse<TableData>>>,
    description: 'Api lấy danh sách dữ liệu của bảng '
  },
  delApi: {
    type: Function as PropType<any>,
    default: () => Promise<IResponse<TableResponse<TableData>>>,
    description: 'Api xóa dữ liệu trong bảng'
  },
  fullColumns: {
    type: Array as PropType<TableColumn[]>,
    default: () => [],
    description: 'Các cột trong bảng'
  },
  selection: { type: Boolean, default: true },
  maxHeight: {
    type: String || Number,
    default: '69vh',
    description: 'Chiều cao của bảng danh sách'
  },
  customOperator: {
    type: Number,
    default: 1,
    validator: (value: number) => {
      // The value must match one of these strings
      return [1, 2, 3, 4, 5].includes(value)
    },
    descriptions:
      'cột thao tác( 1: thêm, sửa, xóa| 2 :sửa, xóa| 3:không có cột thao tác| 4: xem| 5: xem, sửa (icon))'
  },
  tabs: {
    type: String,
    default: ''
  },
  paginationType: {
    type: Boolean,
    default: true
  },
  expand: {
    type: Boolean,
    default: false
  },
  removeDrawer: {
    type: Boolean,
    default: false,
    Description: 'Bỏ lọc cột '
  },
  titleButtons: {
    type: String,
    default: ''
  },
  deleteTitle: {
    type: String,
    default: 'Warning',
    description: 'Tiêu đề thông báo khi ấn nút xóa'
  },
  typeButton: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['TotalRecord', 'SelectedRecord'])
// using table's function
const temporaryColumn = ref<any>(props.fullColumns)
const { register, tableObject, methods } = useTable<TableData>({
  getListApi: props.api,
  response: {
    list: '',
    total: 'count'
  },
  props: {
    columns: temporaryColumn,
    headerAlign: 'center'
  }
})
// get api
let paginationObj = ref<Pagination>()

const getData = (data = {}) => {
  methods.setSearchParams({ ...unref(params), ...data })
}
onBeforeMount(() => {
  getData()
})
// execute pagination
watch(
  //watch multiple variables (total: run 1 after load page, pageSize/length when click change size)
  () => [tableObject.total, tableObject.pageSize, tableObject?.tableList?.length],
  () => {
    props.paginationType
      ? (paginationObj.value = {
          total: tableObject.total
        })
      : (paginationObj.value = undefined)
    emit('TotalRecord', tableObject?.tableList?.length ?? 0)
  },
  {
    immediate: true
  }
)
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
      emit('SelectedRecord', res)
    })
    .catch(() => {})
}
defineExpose({
  getData,
  tableObject
})
//call api when filter in header change
const { setSearchParams, clearSearchParams } = methods
const filterChange = (filterValue) => {
  if (filterValue && typeof unref(filterValue) === 'object')
    for (let key in filterValue) {
      if (typeof unref(filterValue[key]) === 'object')
        filterValue[key] = Object.values(filterValue[key]).toString()
    }
  setSearchParams(filterValue)
}
const utility = 'Utility'

const handleClickAdd = () => {
  push({
    name: `human-resource-management.department-directory.${utility}`,
    params: {
      backRoute: 'human-resource-management.department-directory',
      tab: props.typeButton,
      type: 'add'
    }
  })

  console.log('router', router)
}
const sortValue = ref()
const sortObj = {}
const sortChange = (column) => {
  //value of sort : true/false
  if (column.order == 'ascending') {
    sortValue.value = true
  }
  if (column.order == 'descending') {
    sortValue.value = false
  }
  if (column.order == null) {
    sortValue.value = null
  }
  //sort 1 column at a time
  //remove search params by making it value = null
  // if (column.prop !== null) {
  //   sortField.value = column.prop
  //   sortObj[`${sortField.value}Sort`] = sortValue.value
  //   if (lastSort.value && lastSort.value !== `${sortField.value}Sort`) {
  //     sortObj[lastSort.value] = null
  //   }
  //   lastSort.value = `${sortField.value}Sort`
  // } else {
  //   sortObj[lastSort.value] = null
  // }
  // console.log('sort:', sortObj)
  sortObj[column.prop] = sortValue
  setSearchParams({ ...sortObj })
}
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
const { push } = useRouter()
const router = useRouter()
const appStore = useAppStore()
const Utility = appStore.getUtility
let buttonShow = true

const action = (row: TableData, type: string) => {
  if (type === 'detail' || type === 'edit' || !type) {
    push({
      name: `${String(router.currentRoute.value.name)}.${Utility}`,
      params: { id: row.id, type: type, tab: props.tabs }
    })
  } else {
    if (buttonShow === true) {
      buttonShow = false
    } else {
      buttonShow = true
    }
  }
}

const delData = async (row: TableData | null, _multiple: boolean) => {
  {
    console.log('row', row)
    ElMessageBox.confirm(`${t('reuse.deleteWarning')}`, props.deleteTitle, {
      confirmButtonText: t('reuse.delete'),
      cancelButtonText: t('reuse.exit'),
      type: 'warning',
      confirmButtonClass: 'el-button--danger'
    })
      .then(async () => {
        if (row !== null) {
          // change this to delApi
          await props
            .delApi({ Id: row.id })
            .then(() =>
              ElNotification({
                message: t('reuse.deleteSuccess'),
                type: 'success'
              })
            )
            .catch(() =>
              ElNotification({
                message: t('reuse.deleteFail'),
                type: 'error'
              })
            )
            .finally(() => getData())
        }
      })
      .catch((error) => {
        if (error == 'cancel') {
          ElNotification({
            type: 'info',
            message: t('reuse.deleteCancel')
          })
        } else {
          ElNotification({
            message: t('reuse.deleteFail'),
            type: 'error'
          })
        }
      })
  }
}

//get array of headerFilter in column (if there is a headerFilter)
const ColumnsHaveHeaderFilter = props.fullColumns.filter((col) => col.headerFilter)
const eyeIcon = useIcon({ icon: 'emojione-monotone:eye-in-speech-bubble' })
const editIcon = useIcon({ icon: 'akar-icons:chat-edit' })
const trashIcon = useIcon({ icon: 'fluent:delete-12-filled' })
const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const drawer = ref(false)
const showingColumnList = ref<Array<string>>(
  props.fullColumns.length > 0 ? props.fullColumns.map((el) => el.field)?.filter((el) => el) : []
)

const localeChange = (_show: boolean) => {
  //console.log(show)
}
const showingColumn =
  props.fullColumns.length > 0
    ? props.fullColumns
        .map((el) => ({ value: el.field, label: el.label }))
        ?.filter((el) => el.value)
    : []

//pagination
const handleSizeChange = (size) => {
  tableObject.pageSize = size
}
const handleCurrentChange = (current: number) => {
  tableObject.currentPage = current
}
const updateTableColumn = () => {
  temporaryColumn.value = props.fullColumns.filter((el) =>
    showingColumnList.value.includes(el.field)
  )
}
</script>
<template>
  <ContentWrap class="relative">
    <div
      v-if="!removeDrawer"
      class="dark:(bg-dark-600 opacity-25 text-red-800) absolute"
      id="rabbit-ear"
      @click="drawer = !drawer"
    >
      <Icon icon="ic:baseline-keyboard-double-arrow-down" />
    </div>
    <ElDrawer v-model="drawer" direction="ttb" size="15%" @close="updateTableColumn">
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
      :expand="expand"
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      row-key="id"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :pagination="paginationObj"
      :showOverflowTooltip="false"
      reserveIndex
      :maxHeight="maxHeight"
      @mouseenter="operatorColumnToggle('right')"
      @mouseleave="operatorColumnToggle(false)"
      @select="getTableSelected"
      @select-all="getTableSelected"
      @register="register"
      @filter-change="filterChange"
      @sort-change="sortChange"
      :selection="selection"
      @update:page-size="handleSizeChange"
      @update:current-page="handleCurrentChange"
    >
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
      <template v-if="!(customOperator === 3)" #operator="{ row }">
        <div v-if="customOperator === 1">
          <ElButton @click="action(row, 'detail')" :icon="eyeIcon" />
          <ElButton @click="action(row, 'edit')" :icon="editIcon" />
          <ElButton @click="delData(row, false)" :icon="trashIcon" />
        </div>
        <div v-if="customOperator === 2">
          <ElButton v-if="buttonShow" type="primary" @click="action(row, 'editRow')" plain>
            {{ t('reuse.fix') }}
          </ElButton>
          <ElButton v-if="!buttonShow" type="primary" @click="action(row, 'saveRow')">
            {{ t('reuse.save') }}
          </ElButton>
          <ElButton type="danger" @click="action(row, 'delete')">
            {{ t('reuse.delete') }}
          </ElButton>
        </div>
        <div v-if="customOperator === 4">
          <ElButton @click="action(row, 'detail')" :icon="eyeIcon" />
        </div>
        <div v-if="customOperator === 5">
          <ElButton @click="action(row, 'detail')" :icon="eyeIcon" />
          <ElButton @click="action(row, 'edit')" :icon="editIcon" />
        </div>
      </template>
      <template #switch="data">
        <ElSwitch v-model="data.row.switch" @change="localeChange" />
      </template>
      <template #expand>
        <slot name="expand"></slot>
      </template>
    </Table>
    <ElButton
      v-if="!(props.titleButtons === '')"
      @click="handleClickAdd"
      id="bt-add"
      :icon="plusIcon"
      class="mx-12"
    >
      {{ props.titleButtons }}</ElButton
    >
  </ContentWrap>
</template>
<style lang="less" scoped>
#bt-add {
  margin-top: 20px;
}

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

#price-information {
  max-width: 70vw;
  position: relative;
  left: 11vw;
}
</style>
