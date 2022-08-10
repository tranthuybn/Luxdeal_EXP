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
import { getCustomerList } from '@/api/Business/'
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
    field: 'collaboratorsName',
    label: t('reuse.collaboratorsName'),
    minWidth: '150'
  },
  {
    field: 'collaboratorsCode',
    label: t('reuse.collaboratorsCode'),
    minWidth: '100'
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
    minWidth: '150'
  },
  {
    field: 'debt',
    label: t('reuse.debtCom'),
    minWidth: '150'
  },
  {
    field: 'withdrawalRequest',
    label: t('reuse.withdrawalRequest'),
    minWidth: '150'
  },
  {
    field: 'requestDate',
    label: t('reuse.requestDate'),
    minWidth: '150'
  },
  {
    field: 'requestStatus',
    label: t('reuse.requestStatus'),
    minWidth: '150'
  },
  {
    field: 'accountStatus',
    label: t('reuse.accountStatus'),
    minWidth: '200'
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
  getListApi: getCustomerList,
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
