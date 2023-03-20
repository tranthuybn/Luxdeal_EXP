<script setup lang="ts">
import { reactive, h} from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../../Components/TableDataBase.vue'
import { getEmployeeRatingList } from '@/api/Business'
import {
  filterStatusRatingEmployee,
} from '@/utils/filters'
import {
      getBranchList,
      getDepartmentList,
      getRankList,
      getTypePersonnelList
} from '@/api/HumanResourceManagement'
import { formatStatusRatingEmployee } from '@/utils/format'
import { ElButton } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { useAppStore } from '@/store/modules/app'
import { useRouter } from 'vue-router'

// Key must be the same as name filed in columns
const apiToFilter = {
  ['branch'] : getBranchList,
  ['department'] : getDepartmentList,
  ['rankEmployee'] : getRankList,
  ['typeEmployee'] : getTypePersonnelList,
}

const eyeIcon = useIcon({ icon: 'emojione-monotone:eye-in-speech-bubble' })
const { t } = useI18n()
const { push } = useRouter()
const router = useRouter()
const appStore = useAppStore()
const Utility = appStore.getUtility

const action = (row: any, type: string) => {
  if (type === 'detail' || !type) {
    push({
      name: `${String(router.currentRoute.value.name)}.${Utility}`,
      params: { id: row.staffId, type: type }
    })
  }
}

const changeMoney = new Intl.NumberFormat('vi', {
  style: 'currency',
  currency: 'vnd',
  minimumFractionDigits: 0
})

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
    headerFilter: 'Search',
    headerAlign: 'left',
  },
  {
    field: 'department',
    label: t('reuse.department'),
    minWidth: '110',
    headerAlign: 'left',
    headerFilter: 'Search',
  },
  {
    field: 'rankEmployee',
    label: t('reuse.rank'),
    minWidth: '110',
    headerFilter: 'Search',
    headerAlign: 'left',
  },
  {
    field: 'typeEmployee',
    label: t('reuse.type'),
    minWidth: '110',
    headerAlign: 'left',
    headerFilter: 'Search',
  },
  {
    field: 'sales',
    label: t('customerList.sales'),
    minWidth: '120',
    align: 'right',
    sortable: true,
    headerAlign: 'left',
    formatter: (row, _column, _cellValue) => {
      const x = changeMoney.format(parseInt(row.sales))
      return x
    }
  },
  {
    field: 'statusRatingEmployee',
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
    minWidth: '70',
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
  :api="getEmployeeRatingList"
  :customOperator="3" 
  :apiToFilter="apiToFilter"
  />
</template>


