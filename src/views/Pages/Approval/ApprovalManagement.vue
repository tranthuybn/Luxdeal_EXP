<script setup lang="ts">
import { useI18n } from '@/hooks/web/useI18n'
import { getApproveManagementList, approvalSettings } from '@/api/Approval'
import TableBase from '@/views/Pages/Components/TableBase/src/TableBase.vue'
import { ContentWrap } from '@/components/ContentWrap'
import { h, ref, unref } from 'vue'
import { ElMessageBox, ElNotification, ElSwitch } from 'element-plus'
const { t } = useI18n()
const tableBase01 = ref<ComponentRef<typeof TableBase>>()

let idApprove = 0

const ApprovalTable = [
  { field: '', width: '50' },
  {
    field: 'name',
    label: t('reuse.categoriesInfor'),
    minWidth: '700'
  },

  {
    field: 'description',
    label: t('reuse.approveCondition'),
    minWidth: '200'
  },
  {
    field: 'isActive',
    label: t('reuse.approveOrNot'),
    minWidth: '100',
    fixed: false,
    align: 'center',
    formatter: (record: Recordable, column: TableColumn, cellValue: TableSlotDefault) => {
      if(record.children){
        return ''
      }
      else{
        return h(ElSwitch, {
          style: { margin: 'auto' },
          modelValue: record.isActive,
          onClick: () => changeActive(record, column, cellValue)
        })
      } 
    }
  }
]

const changeActive = (...param) => {
  idApprove = param[0].id

  const payload = {
    Id: idApprove,
    IsActive:  !param[2]
  }

  ElMessageBox.confirm('Bạn có muốn thay đổi trạng thái?','Thay đổi trạng thái', {
    confirmButtonText: t('reuse.yes'),
    cancelButtonText: t('reuse.no')
  }).then(async () => {

    await approvalSettings(payload)
      .then(() => {
        const array = Array.isArray(unref(tableBase01)?.tableObject.tableList)
      ? unref(tableBase01)?.tableObject.tableList
      : []
        if (array && array.length > 0) {
          array.forEach((row) => {
            row?.children.forEach((child)=>{
              if(child?.id == idApprove){
                child.isActive = !param[2]
              }
            })
          })
        }
        ElNotification({
          message: t('reuse.updateStatusSuccess'),
          type: 'success'
        })
      }
      )
      .catch(() =>
        ElNotification({
          message: t('reuse.updateStatusFail'),
          type: 'error'
        })
      )
  })
} 
</script>


<template>
  <ContentWrap :title="t('reuse.approvalManagement')" :message="t('reuse.approvalManagement')">
    <TableBase
      ref="tableBase01"
      :fullColumns="ApprovalTable"
      :api="getApproveManagementList"
      :selection="false"
    />
  </ContentWrap>
</template>
<style scoped>
::v-deep(.el-table__row--level-1 > td:nth-child(2) > .cell) {
  padding-left: 4rem;
}
::v-deep(.custom-empty .el-empty > .el-empty__description) {
  margin-top: 5px;
}
</style>