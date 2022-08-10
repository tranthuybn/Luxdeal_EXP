<script setup lang="ts">
import { TableData } from '@/api/table/types'
import { useTable } from '@/hooks/web/useTable'
import { h, reactive, ref, watch } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ContentWrap } from '@/components/ContentWrap'
import { Table, TableExpose } from '@/components/Table'
import { ElButton, ElRow, ElCol } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { HeaderFiler } from '@/views/Pages/Components/HeaderFilter'
import { getSellOrderList } from '@/api/Business'
const { t } = useI18n()
const columns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'createDate',
    label: t('reuse.createDate'),
    minWidth: '150'
  },
  {
    field: 'orderCode',
    label: t('reuse.customerName') + ' ' + t('reuse.representative'),
    minWidth: '150'
  },
  {
    field: 'creator',
    label: t('reuse.creator'),
    minWidth: '250'
  },
  {
    field: 'customer',
    label: t('reuse.customerName'),
    minWidth: '100'
  },
  {
    field: 'description',
    label: t('reuse.descriptions'),
    minWidth: '100'
  },
  {
    field: 'saleNumber',
    label: t('reuse.saleNumber'),
    minWidth: '200'
  },
  {
    field: 'totalMoney',
    label: t('reuse.totaMoney'),
    minWidth: '150'
  },
  {
    field: 'debitTotal',
    label: t('reuse.debt'),
    minWidth: '100'
  },
  {
    field: 'receiptAndExpenditure',
    label: t('reuse.haveToCollect') + '/' + t('reuse.havetoPay'),
    minWidth: '100'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '100'
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
const showPagination = (show: boolean) => {
  if (show) {
    paginationObj.value = {
      total: tableObject.total
    }
  } else {
    paginationObj.value = undefined
  }
}
const acitonFn = (record: Recordable, data: TableSlotDefault) => {
  console.log(record, data)
}
const { register, tableObject, methods } = useTable<TableData>({
  getListApi: getSellOrderList,
  response: {
    list: 'list',
    total: 'total'
  },
  props: {
    columns: columns,
    headerAlign: 'center'
  }
})
const { getList } = methods
getList(),
  watch(
    () => tableObject.tableList,
    () => {
      showPagination(true)
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
        @register="register"
      />
    </ContentWrap>
  </section>
</template>
