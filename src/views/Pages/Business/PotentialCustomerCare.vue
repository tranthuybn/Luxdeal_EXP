<script setup lang="ts">
import { TableData } from '@/api/table/types'
import { useTable } from '@/hooks/web/useTable'
import { h, onBeforeMount, watch, reactive, ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ContentWrap } from '@/components/ContentWrap'
import { Table, TableExpose } from '@/components/Table'
import { ElButton, ElRow, ElCol, ElSelect, ElOption } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { HeaderFiler } from '../Components/HeaderFilter'
import { getPotentialCustomerList } from '@/api/Business/'
const { t } = useI18n()
const columns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'receivedDate',
    label: t('reuse.receivedDate'),
    minWidth: '150',
    align: 'center',
    sortable: true
  },
  {
    field: 'sale',
    label: t('reuse.sale'),
    minWidth: '150',
    sortable: true
  },
  {
    field: 'customerInfo',
    label: t('reuse.customerInfo'),
    minWidth: '250'
  },
  {
    field: 'transaction',
    label: t('reuse.transaction'),
    minWidth: '200'
  },
  {
    field: 'transactionStatus',
    label: t('reuse.transactionStatus'),
    minWidth: '100'
  },
  {
    field: 'approachingChannel',
    label: t('reuse.approachingChannel'),
    minWidth: '100'
  },
  {
    field: 'note',
    label: t('reuse.note'),
    minWidth: '150'
  },
  {
    field: 'originated',
    label: t('reuse.originated'),
    minWidth: '100'
  },
  {
    field: 'service',
    label: t('reuse.service'),
    minWidth: '100'
  },
  {
    field: 'serviceDetail',
    label: t('reuse.serviceDetail'),
    minWidth: '200'
  },
  {
    field: 'statusTag',
    label: t('reuse.statusTag'),
    minWidth: '150'
  },
  {
    field: 'result',
    label: t('reuse.result'),
    minWidth: '150'
  },
  {
    field: 'order',
    label: t('reuse.order'),
    minWidth: '150'
  },
  {
    field: 'feedBack',
    label: t('reuse.feedBack'),
    minWidth: '180'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '180'
  },
  {
    field: 'operator',
    label: t('reuse.operator'),
    minWidth: '180',
    fixed: 'right',
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
])
const paginationObj = ref<Pagination>()
const tableRef = ref<TableExpose>()
const eyeIcon = useIcon({ icon: 'emojione-monotone:eye-in-speech-bubble' })
const editIcon = useIcon({ icon: 'akar-icons:chat-edit' })
const trashIcon = useIcon({ icon: 'fluent:delete-12-filled' })
const createIcon = useIcon({ icon: 'uil:create-dashboard' })

const acitonFn = (record: Recordable, data: TableSlotDefault) => {
  console.log(record, data)
}
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

onBeforeMount(() => {
  methods.getList()
})
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
var value1 = ref('')
const options = [
  {
    value: 'Option1',
    label: 'Option1'
  },
  {
    value: 'Option2',
    label: 'Option2'
  },
  {
    value: 'Option3',
    label: 'Option3'
  },
  {
    value: 'Option4',
    label: 'Option4'
  },
  {
    value: 'Option5',
    label: 'Option5'
  }
]

const updatevalue = (event) => {
  console.log(event)
  value1.value = event
}
</script>
<template>
  <section>
    <HeaderFiler>
      <template #headerFilterSlot>
        <el-button type="primary" :icon="createIcon"> Khởi tạo mới </el-button>
      </template>
    </HeaderFiler>
    <ContentWrap>
      <Table
        ref="tableRef"
        v-model:pageSize="tableObject.pageSize"
        v-model:currentPage="tableObject.currentPage"
        :data="tableObject.tableList"
        :loading="tableObject.loading"
        :pagination="paginationObj"
        :showOverflowTooltip="false"
        @register="register"
      >
        <template #transaction-header>
          <div>{{ t('reuse.transaction') }} </div>
          <el-select
            :model-value="value1"
            class="m-2"
            placeholder="Select"
            size="large"
            @change="updatevalue($event)"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </Table>
    </ContentWrap>
  </section>
</template>
