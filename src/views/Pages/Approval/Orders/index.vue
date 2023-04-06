<script setup lang="ts">
import { useI18n } from '@/hooks/web/useI18n'
import { useRouter } from 'vue-router'
import { ElButton } from 'element-plus'
import { appModules } from '@/config/app'
import { computed, h, reactive,provide } from 'vue'
import { ordersColumn } from './tables'
import { getOrderApproval } from '@/api/Approval'
import TableType01 from '../../Components/TableDataBase.vue'
import { ContentWrap } from '@/components/ContentWrap'
import { API_ORDER } from '@/utils/API.Variables'

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

const getApproveActionType = () => {
  switch(type) {
    case 'router.odersCancel':
      return 0;
    case 'router.odersNew':
      return 1;
    case 'router.odersEdit':
      return 2;
    default:
      return -1; 
  }
}

const params = { ApproveActionType: getApproveActionType() }
provide('parameters', {params})

const tableColumns = computed(():Array<TableColumn> => {
  if(ordersColumn.length > 0)  return setTableColumn(ordersColumn)
  return setTableColumn([])
})

const setTableColumn = (arr:Array<TableColumn>) => { 
 return [...arr, operatorColumn].slice()
} 

const action = (scope: any, _type: string) => {
  const typeServiceOrder = API_ORDER.find((e) => e.key == scope.serviceType)
  if (typeServiceOrder?.key == 6) {
    push({
      name: `purchase.business-purchases.purchase-order-list.${utility}`,
      params: {
        type: 'approval-order',
        id: scope.targetId,
        approvalId: scope.id
      }
    })
  } else {
    push({
      name: `business.order-management.order-list.${utility}`,
      params: {
        type: 'approval-order',
        tab: typeServiceOrder?.label,
        id: scope.targetId,
        approvalId: scope.id
      }
    })
  }
}
const getTitle = () => {
  switch(type) {
    case 'router.odersCancel':
      return t('formDemo.BrowseCanceledOrders');
    case 'router.odersNew':
      return t('formDemo.BrowseNewlyCreatedOrders');
    case 'router.odersEdit':
      return t('formDemo.BrowseEditOrders')
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
      :api="getOrderApproval"
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
