<script setup lang="ts">
import { reactive, h } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../../Components/TableDataBase.vue'
import { getStaffList } from '@/api/Business'
import {
  filterStatusRatingEmployee,
  filterBranch,
  filterDepartment,
  filterRankEmployee,
  filterTypeEmployee
} from '@/utils/filters'
import { formatStatusRatingEmployee } from '@/utils/format'
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
  if (type === 'detail' || !type) {
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
    minWidth: '100',
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
    minWidth: '130',
    headerAlign: 'left'
  },
  {
    field: 'email',
    label: t('reuse.email'),
    minWidth: '150',
    headerAlign: 'left'
  },
  {
    field: 'branch',
    label: t('reuse.branch'),
    minWidth: '110',
    filters: filterBranch,
    headerAlign: 'left'
  },
  {
    field: 'department',
    label: t('reuse.department'),
    minWidth: '110',
    filters: filterDepartment,
    headerAlign: 'left'
  },
  {
    field: 'rank',
    label: t('reuse.rank'),
    minWidth: '110',
    filters: filterRankEmployee,
    headerAlign: 'left'
  },
  {
    field: 'type',
    label: t('reuse.type'),
    minWidth: '110',
    filters: filterTypeEmployee,
    headerAlign: 'left'
  },
  {
    field: 'sales',
    label: t('customerList.sales'),
    minWidth: '120',
    align: 'right',
    sortable: true,
    headerAlign: 'left'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '110',
    filters: filterStatusRatingEmployee,
    headerAlign: 'left',
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return formatStatusRatingEmployee(cellValue)
    }
  },
  {
    field: 'operator',
    label: t('reuse.operator'),
    minWidth: '110',
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
  :removeButtonAdd="true" 
  :columns="columns" 
  :api="getStaffList" 
  :customOperator=4
  />
</template>
