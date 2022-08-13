<script setup lang="ts">
import { TableData } from '@/api/table/types'
import { ContentWrap } from '@/components/ContentWrap'
import { Table, TableExpose } from '@/components/Table'
import { useI18n } from '@/hooks/web/useI18n'
import { useIcon } from '@/hooks/web/useIcon'
import { useTable } from '@/hooks/web/useTable'
import { ElButton, ElCol, ElRow } from 'element-plus'
import { onBeforeMount, PropType, h, ref, unref, reactive, watch, computed } from 'vue'
import { HeaderFiler } from './HeaderFilter/index'
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
const paginationObj = ref<Pagination>()
const tableRef = ref<TableExpose>()
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
const fullColumns: TableColumn[] = reactive(props.columns)

fullColumns.push(operatorColumn)

const acitonFn = (record: Recordable, data: TableSlotDefault) => {
  console.log(record, data)
}
// using table's function
const { register, tableObject, methods } = useTable<TableData>({
  getListApi: props.api,
  response: {
    list: 'list',
    total: 'total'
  },
  props: {
    columns: fullColumns,
    headerAlign: 'center'
  }
})
// get api
function getData() {
  methods.getList()
}
onBeforeMount(() => {
  getData()
})
// execute pagination
watch(
  () => tableObject.tableList,
  () => {
    paginationObj.value = {
      total: tableObject.total
    }
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
let SelectedRecord = ref()
const { getSelections } = methods
async function getTableSelected() {
  await getSelections()
    .then((res) => {
      SelectedRecord.value = unref(res)
    })
    .catch(() => {
      if (SelectedRecord.value.length > 0)
        SelectedRecord.value.splice(0, SelectedRecord.value.length)
    })
}
const selectedNumber = computed(() =>
  Array.isArray(SelectedRecord) ? SelectedRecord.value.length : 0
)
</script>
<template>
  <section>
    <HeaderFiler @get-data="getData" @refresh-data="getData">
      <template #headerFilterSlot>
        <el-button type="primary" :icon="createIcon"> Khởi tạo mới </el-button>
      </template>
    </HeaderFiler>
    <el-row class="mb-2">
      <el-col :xl="6" :lg="12" :xs="24">
        <div class="extension-function">
          <p>
            <span>{{ t('reuse.choose') }}</span>
            <span>
              ({{ Array.isArray(SelectedRecord) ? SelectedRecord.length : 0 }}/{{
                tableObject.tableList.length
              }})
            </span>
          </p>
          <p
            ><span :class="selectedNumber > 0 ? '' : 'opacity-20'">{{
              t('reuse.exportExcel')
            }}</span
            ><span>
              <Icon
                icon="file-icons:microsoft-excel"
                :about="16"
                color="var(--el-color-primary)"
                class="ml-2px relative top-1px"
              />
            </span>
          </p>
          <p>
            <span :class="selectedNumber > 0 ? '' : 'opacity-20'">{{ t('reuse.duplicate') }}</span>
            <span>
              <Icon
                icon="ion:duplicate"
                :size="16"
                color="var(--el-color-primary)"
                class="ml-2px relative top-1px"
              />
            </span>
          </p>
          <p>
            <span :class="selectedNumber > 0 ? '' : 'opacity-20'">{{ t('reuse.delete') }}</span>
            <span>
              <Icon
                icon="fluent:delete-12-regular"
                :size="16"
                color="var(--el-color-primary)"
                class="ml-2px relative top-1px"
              />
            </span>
          </p>
        </div>
      </el-col>
    </el-row>
    <ContentWrap>
      <Table
        ref="tableRef"
        v-model:pageSize="tableObject.pageSize"
        v-model:currentPage="tableObject.currentPage"
        :data="tableObject.tableList"
        :loading="tableObject.loading"
        :pagination="paginationObj"
        :showOverflowTooltip="false"
        @cell-mouse-enter="operatorColumnToggle('right')"
        @cell-mouse-leave="operatorColumnToggle(false)"
        @select="getTableSelected"
        @select-all="getTableSelected"
        @register="register"
      />
    </ContentWrap>
  </section>
</template>
<style lang="scss" scoped>
@mixin d-flex {
  display: flex;
  align-items: center;
}
.extension-function {
  @include d-flex;
  justify-content: space-between;

  p {
    border-bottom: 2px solid var(--app-contnet-bg-color);
    @include d-flex;
    justify-content: flex-start;
    box-sizing: border-box;
    cursor: pointer;
    width: fit-content;
    span {
      width: fit-content;
      font-weight: 500;
    }
    &:hover {
      border-bottom: 2px solid var(--el-color-primary);
    }
  }
}
</style>
