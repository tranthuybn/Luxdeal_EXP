<script setup lang="ts">
import { TableData } from '@/api/table/types'
import { useTable } from '@/hooks/web/useTable'
import { h, onBeforeMount, watch, reactive, ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ContentWrap } from '@/components/ContentWrap'
import { Table, TableExpose } from '@/components/Table'
import { ElButton, ElRow, ElCol } from 'element-plus'
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
    minWidth: '100'
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
      />
    </ContentWrap>
  </section>
</template>
