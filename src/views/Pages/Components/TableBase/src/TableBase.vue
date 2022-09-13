<script setup lang="ts">
import { TableData } from '@/api/table/types'
import { ContentWrap } from '@/components/ContentWrap'
import { Table, TableExpose } from '@/components/Table'
import { onBeforeMount, PropType, ref, unref, watch } from 'vue'
import { TableResponse } from '../../Type'
import {
  ElImage,
  ElButton,
  ElDrawer,
  ElCheckboxGroup,
  ElCheckboxButton,
  ElMessage,
  ElMessageBox,
  ElSwitch
} from 'element-plus'
import { InputMoneyRange, InputDateRange, InputNumberRange, InputName } from '../index'
import { useIcon } from '@/hooks/web/useIcon'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from '@/hooks/web/useI18n'
import { useAppStore } from '@/store/modules/app'
import { useTable } from '@/hooks/web/useTable'
import { inject } from 'vue'
//provide from main component
const params: any = inject('parameters', {})
const { t } = useI18n()
const route = useRoute()
let paginationObj = ref<Pagination>()
const tableRef = ref<TableExpose>()
const props = defineProps({
  api: {
    type: Function as PropType<any>,
    default: () => Promise<IResponse<TableResponse<TableData>>>
  },
  delApi: {
    type: Function as PropType<any>,
    default: () => Promise<IResponse<TableResponse<TableData>>>
  },
  fullColumns: {
    type: Array as PropType<TableColumn[]>,
    default: () => []
  },
  selection: { type: Boolean, default: true },
  maxHeight: {
    type: String || Number,
    default: '69vh'
  },
  customOperator: {
    type: Number,
    default: 1,
    validator(value: number) {
      // The value must match one of these strings
      return [1, 2, 3].includes(value)
    },
    Descriptions: 'cột thao tác( 1: thêm, sửa, xóa| 2 :sửa, xóa| 3:không có cột thao tác)'
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
    default: false
  },
  titleButtons: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['TotalRecord', 'SelectedRecord'])
// using table's function
const { register, tableObject, methods } = useTable<TableData>({
  getListApi: props.api,
  response: {
    list: 'list',
    total: 'total'
  },
  props: {
    columns: props.fullColumns,
    headerAlign: 'center'
  }
})
// get api
const getData = (data = {}) => {
  methods.setSearchParams({ ...params.params, ...data })
}
onBeforeMount(() => {
  getData()
})
// execute pagination
watch(
  () => tableObject.tableList,
  () => {
    props.paginationType
      ? (paginationObj.value = {
          total: tableObject.total
        })
      : (paginationObj.value = undefined)
    emit('TotalRecord', tableObject.tableList.length)
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
      params: { id: row.id, type: type }
    })
  } else {
    console.log(type)
    if (buttonShow === true) {
      buttonShow = false
    } else {
      buttonShow = true
    }
  }
}

const delData = async (row: TableData | null, multiple: boolean) => {
  {
    ElMessageBox.confirm('proxy will permanently delete the file. Continue?', 'Warning', {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning'
    })
      .then(() => {
        console.log('row', row, multiple)
        if (row !== null) {
          props.delApi({ Id: row.id })
        }
        ElMessage({
          type: 'success',
          message: 'Delete completed'
        })
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: 'Delete canceled'
        })
      })
      .finally(() => {
        getData()
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

const localeChange = (show: boolean) => {
  console.log(show)
}
const showingColumn =
  props.fullColumns.length > 0
    ? props.fullColumns
        .map((el) => ({ value: el.field, label: el.label }))
        ?.filter((el) => el.value)
    : []
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
    <ElDrawer v-model="drawer" direction="ttb" size="10%">
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
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :pagination="paginationObj"
      :showOverflowTooltip="false"
      :maxHeight="maxHeight"
      @mouseenter="operatorColumnToggle('right')"
      @mouseleave="operatorColumnToggle(false)"
      @select="getTableSelected"
      @select-all="getTableSelected"
      @register="register"
      @filter-change="filterChange"
      :selection="selection"
    >
      <template #imgTitle="data">
        <div class="imageTitle" style="display: flex; align-items: center">
          <div style="padding-right: 20px">
            <el-image style="width: 100px; height: 100px" :src="data.row.image" />
          </div>
          <div>{{ data.row.title }}</div>
        </div>
      </template>
      <template #image="data">
        <div>
          <el-image style="width: 100px; height: 100px" :src="data.row.image" />
        </div>
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
          </ElButton></div
        >
      </template>
      <template #switch="data">
        <ElSwitch v-model="data.row.switch" @change="localeChange" />
      </template>
      <template #expand>
        <slot name="expand"></slot>
      </template>
    </Table>
    <ElButton v-if="!(props.titleButtons === '')" id="bt-add" :icon="plusIcon" class="mx-12">
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
