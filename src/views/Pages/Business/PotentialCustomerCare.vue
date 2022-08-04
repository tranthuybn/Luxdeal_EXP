<script setup lang="ts">
import { TableData } from '@/api/table/types'
import { useTable } from '@/hooks/web/useTable'
import { onMounted, reactive, ref } from 'vue'
import { getTableListApi } from '@/api/table'
import { useI18n } from '@/hooks/web/useI18n'
import { ContentWrap } from '@/components/ContentWrap'
import { Table, TableExpose } from '@/components/Table'
import { ElButton, ElRow, ElCol } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { HeaderFiler } from '../Components/HeaderFilter'
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
    minWidth: '150'
  },
  {
    field: 'sale',
    label: t('reuse.sale'),
    minWidth: '150'
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
    minWidth: '100'
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
    fixed: 'right'
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
const acitonFn = (data: TableSlotDefault) => {
  console.log(data)
}
const { register, tableObject, methods } = useTable<TableData>({
  getListApi: getTableListApi,
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
  onMounted(() => {
    showPagination(true)
  })
</script>
<template>
  <ContentWrap>
    <HeaderFiler>
      <template #headerFilterSlot>
        <el-button type="primary" :icon="createIcon"> Khởi tạo mới </el-button>
      </template>
    </HeaderFiler>
  </ContentWrap>
  <ContentWrap>
    <Table
      ref="tableRef"
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :pagination="paginationObj"
      @register="register"
    >
      <template #operator="data">
        <el-row :gutter="20" justify="space-around">
          <el-col :span="8">
            <el-button :icon="eyeIcon" @click="acitonFn(data as TableSlotDefault)" />
          </el-col>
          <el-col :span="8">
            <el-button :icon="editIcon" />
          </el-col>
          <el-col :span="8">
            <el-button :icon="trashIcon" />
          </el-col>
        </el-row>
      </template>
    </Table>
  </ContentWrap>
</template>
