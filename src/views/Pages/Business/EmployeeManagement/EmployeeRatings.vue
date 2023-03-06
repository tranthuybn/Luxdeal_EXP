<script setup lang="ts">
import { reactive, h } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../../Components/TableDataBase.vue'
import { getStaffList } from '@/api/Business'
import {
  filterStatusCustomer,
  filterBranch,
  filterDepartment,
  filterRankEmployee,
  filterTypeEmployee
} from '@/utils/filters'
import { ElButton } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { useAppStore } from '@/store/modules/app'
import { useRouter } from 'vue-router'


const eyeIcon = useIcon({ icon: 'emojione-monotone:eye-in-speech-bubble' })
const { t } = useI18n()
const { push } = useRouter()
const router = useRouter()
const appStore = useAppStore()
const Utility = appStore.getUtility

// Xem detail
const action = (row: any, type: string) => {
  console.log('router 1',`${String(router.currentRoute.value.name)}.${Utility}`)
  if (type === 'detail' || !type) {
    console.log('router 2',`${String(router.currentRoute.value.name)}.${Utility}`)
    push({
      name: `${String(router.currentRoute.value.name)}.${Utility}`,
      params: { id: row.id, type: type, tab: row.voucherType }
    })
  }
}


const columns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    minWidth: '86',
    align: 'center',
  },
  {
    field: 'employeeCode',
    label: t('reuse.employeeCode'),
    minWidth: '250',
    headerAlign: 'left',
  },
  {
    field: 'employeeName',
    label: t('reuse.employeeName'),
    minWidth: '150',
    headerAlign: 'left'
  },
  {
    field: 'phoneNumber',
    label: t('reuse.phoneNumber'),
    minWidth: '100',
    headerAlign: 'left'
  },
  {
    field: 'email',
    label: t('reuse.email'),
    minWidth: '100',
    align: 'center',
    sortable: true,
    headerAlign: 'left'
  },
  {
    field: 'branch',
    label: t('reuse.branch'),
    minWidth: '200',
    filters: filterBranch,
    headerAlign: 'left'
  },
  {
    field: 'department',
    label: t('reuse.department'),
    minWidth: '200',
    filters: filterDepartment,
    headerAlign: 'left'
  },
  {
    field: 'rank',
    label: t('reuse.rank'),
    minWidth: '200',
    filters: filterRankEmployee,
    headerAlign: 'left'
  },
  {
    field: 'type',
    label: t('reuse.type'),
    minWidth: '150',
    filters: filterTypeEmployee,
    headerAlign: 'left'
  },
  {
    field: 'monthlySales',
    label: t('customerList.monthlyRevenue'),
    minWidth: '100',
    headerAlign: 'left'
  },
  {
    field: 'quarterlySales',
    label: t('customerList.quarterlySales'),
    minWidth: '150',
    align: 'center',
    sortable: true,
    headerAlign: 'left'
  },
  {
    field: 'annualSales',
    label: t('customerList.salesYear'),
    minWidth: '150',
    headerFilter: 'Name',
    headerAlign: 'left'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '120',
    filters: filterStatusCustomer,
    headerAlign: 'left'
  },
  {
    field: 'operator',
    label: t('reuse.operator'),
    minWidth: '150',
    headerAlign: 'left',
    formatter: (row: Recordable, __: TableColumn, _cellValue: boolean) => {
      return h('div', { style: 'display:flex;justify-content: center;' }, [
        h(ElButton, { icon: eyeIcon, onClick: () => action(row, 'detail') })
      ])
    }
  }
])


</script>
<template>
  <tableDatetimeFilterBasicVue 
  :columns="columns" 
  :api="getStaffList" 
  :customOperator=4
  />
</template>
