<script setup lang="ts">
import { useI18n } from '@/hooks/web/useI18n'
import { useRouter } from 'vue-router'
import { ElButton } from 'element-plus'
import { appModules } from '@/config/app'
import { computed, h, reactive } from 'vue'
import { collaborators, userAccount } from './tables'
import { listApprovalCollab, listApprovalUserAccount } from '@/api/Approval'
import TableType01 from '../../Components/TableDataBase.vue'
import { ContentWrap } from '@/components/ContentWrap'

const { utility } = appModules
const { currentRoute } = useRouter()
const { t } = useI18n()
const { push } = useRouter()
const type = currentRoute.value.meta.title

const operatorColumn = reactive<TableColumn>({
    field: 'operator',
    label: t('reuse.operator'),
    minWidth: '130',
    formatter: (row: Recordable, __: TableColumn, _cellValue: boolean) => {
    return h('div', { class: 'btn-detail_Approval' }, [
        h(ElButton, { type: 'primary', onClick: () => action(row, 'detail') }, t('formDemo.BrowseDetails')),
        h('span', { class: 'arrowRight' })
    ])
    }
})

const tableColumns = computed(():Array<TableColumn> => {
  switch(type) {
    case 'router.userAccount':
      return setTableColumn(userAccount)
    case 'router.collaboratorAccount':
      return setTableColumn(collaborators)
    default:
      return setTableColumn([])
 }
})

const setTableColumn = (arr:Array<TableColumn>) => { 
 return [...arr, operatorColumn].slice()
} 

const action = (scope: any, _type: string) => {
  if (type === 'router.userAccount') {
    push({
      name: `business.customer-management.customerAdd.${utility}`,
      params: {
        type: 'approval-cus',
        id: scope.targetId,
        approvalId: scope.id
      }
    })
  } else {
    push({
      name: `business.collaborators.collaboratorsList.${utility}`,
      params: {
        type: 'approval-collab',
        id: scope.targetId,
        approvalId: scope.id
      }
    })
  }
}
const getTitle = () => {
  switch(type) {
    case 'router.userAccount':
      return t('reuse.approveUserAccount');
    case 'router.collaboratorAccount':
      return t('reuse.approveCollaborator');
    default:
      return ''
  }
}

const getAPI = () => {
  switch(type) {
    case 'router.userAccount':
      return listApprovalUserAccount
    case 'router.collaboratorAccount':
      return listApprovalCollab
    default:
      return ''
  }
}
</script>
<template>
  <ContentWrap
    class="relative"
    :title="getTitle()"
  >
    <TableType01
      :columns="tableColumns"
      :api="getAPI()"
      isOperatorColumnCustomize
      :selection="false"
      :customOperator="3"
      :removeButtonAdd="true"
    />
  </ContentWrap>

</template>


<style scoped>
::v-deep(.arrowRight) {
  position: relative;
  top: 12px;
  right: 20px;
  height: 0;
}

::v-deep(.btn-detail_Approval) {
  display: flex;
  justify-content: center;
}

::v-deep(.btn-detail_Approval > button) {
  padding: 8px 24px 8px 10px;
}
</style>

<style></style>
