<script setup lang="ts">
import { useI18n } from '@/hooks/web/useI18n'
import { getApproveManagementList } from '@/api/Approval'
import TableBase from '@/views/Pages/Components/TableBase/src/TableBase.vue'
import { ContentWrap } from '@/components/ContentWrap'
import { h, ref, unref } from 'vue'
const { t } = useI18n()
const tableBase01 = ref<ComponentRef<typeof TableBase>>()

const seeDetail = (...param) => {
  const array = Array.isArray(unref(tableBase01)?.tableObject.tableList)
    ? unref(tableBase01)?.tableObject.tableList
    : []
  if (array && array.length > 0) {
    array.forEach((el) => {
      if (el.id === param[0].id) el['approveOrNot'] = !param[2]
    })
  }
}
const unitCategories = [
  { field: '', width: '50' },
  {
    field: 'categoryInfo',
    label: t('reuse.categoriesInfor'),
    minWidth: '700'
  },

  {
    field: 'condition',
    label: t('reuse.approveCondition'),
    minWidth: '200'
  },
  {
    field: 'approveOrNot',
    label: t('reuse.approveOrNot'),
    minWidth: '100',
    fixed: false,
    align: 'center',
    formatter: (record: Recordable, column: TableColumn, cellValue: TableSlotDefault) => {
      return h('ElSwitch', {
        style: { margin: 'auto' },
        modelValue: record.approveOrNot,
        onClick: () => seeDetail(record, column, cellValue)
      })
    }
  }
]
</script>
<template>
  <ContentWrap :title="t('reuse.approvalManagement')">
    <TableBase
      ref="tableBase01"
      :fullColumns="unitCategories"
      :api="getApproveManagementList"
      :selection="false"
    />
  </ContentWrap>
</template>
