<script setup lang="ts">
import { useI18n } from '@/hooks/web/useI18n'
import { ElSwitch } from 'element-plus'
const { t } = useI18n()
import { getApproveManagementList } from '@/api/Approval'
import TableType01 from '@/views/Pages/Components/TableBase/src/TableType01.vue'
import { ContentWrap } from '@/components/ContentWrap'

import { h } from 'vue'

const seeDetail = (record: Recordable, data: TableSlotDefault) => {
  console.log(record, data)
}
const unitCategories = [
  { field: 'void', width: '50' },
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
    formatter: (record: Recordable, __: TableColumn, cellValue: TableSlotDefault) => {
      return h(ElSwitch, {
        style: { margin: 'auto' },
        onClick: () => seeDetail(record, cellValue)
      })
    }
  }
]
</script>
<template>
  <ContentWrap :title="t('reuse.approvalManagement')">
    <TableType01 :fullColumns="unitCategories" :api="getApproveManagementList" :selection="false" />
  </ContentWrap>
</template>
<style></style>
