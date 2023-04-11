<script setup lang="ts">
import { useI18n } from '@/hooks/web/useI18n'
import { useRouter, useRoute } from 'vue-router'
import { ElButton } from 'element-plus'
import { appModules } from '@/config/app'
import { computed, h, reactive,provide } from 'vue'
import { recepitAndPayment, paymentProposal } from './table'
import { getOrderPayments } from '@/api/Approval'
import TableType01 from '../../Components/TableDataBase.vue'
import { ContentWrap } from '@/components/ContentWrap'

const { utility } = appModules
const { currentRoute } = useRouter()

const { t } = useI18n()
const { push } = useRouter()
const route = useRoute()

let nameRoute = route.name?.toString()
const type = nameRoute?.slice(25, nameRoute.length)
const operatorColumn = reactive<TableColumn>({
  field: 'operator',
  label: t('reuse.operator'),
  minWidth: '200',
  formatter: (row: Recordable, __: TableColumn, _cellValue: boolean) => {
  return h('div', { class: 'btn-detail_Approval' }, [
      h(ElButton, { type: 'primary', onClick: () => action(row, 'detail') }, 'Duyệt chi tiết '),
      h('span', { class: 'arrowRight' })
  ])
  }
})
const params = { IsPayment: type !== 'proposal' }
provide('parameters', {
  params
})
 

const tableColumns = computed(():Array<TableColumn> => {
  switch (currentRoute.value.meta.title) {
    case 'router.receiptsAndExpenditures':
     return setTableColumn(recepitAndPayment)   
    case 'router.paymentProposal':
     return setTableColumn(paymentProposal)     
    default:
      return setTableColumn([])
  }
})

const setTableColumn = (arr:Array<TableColumn>) => { 
 return [...arr, operatorColumn].slice()
} 

const action = (scope: any, _type: string) => {
  if (type != 'proposal') {
    push({
      name: `accountant.receipts-expenditures.receipts-expenditures-list.${utility}`,
      params: { type: 'approval', id: scope.targetId},
      query: { approvalId: scope.id }
    })
  } else {
    push({
      name: `approve.payment-approval.proposal.${utility}`,
      params: { type: 'approval', id: scope.targetId},
      query: { approvalId: scope.id }
    })
  }
}

</script>
<template>
  <ContentWrap
    class="relative"
    :title="t(currentRoute?.meta?.title ? currentRoute?.meta?.title?.toString() : '')"
    :message="t(currentRoute?.meta?.title ? currentRoute?.meta?.title?.toString() : '')"
  >
    <TableType01
      :columns="tableColumns"
      :api="getOrderPayments"
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
