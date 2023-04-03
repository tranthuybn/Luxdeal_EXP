<script setup lang="ts">
import { reactive, provide, ref, h} from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../../Components/TableDataBase.vue'
import { getEmployeeRatingList } from '@/api/Business'
import {
  filterStatusRatingEmployee,
} from '@/utils/filters'
import {
      getBranchs,
      getDepartments,
      getRanks,
      getTypePersonnels
} from '@/api/HumanResourceManagement'
import { formatStatusRatingEmployee } from '@/utils/format'
import { changeMoney } from '@/utils/tsxHelper'
import moment from 'moment'
import { useRouter } from 'vue-router'
import { ElButton } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { useAppStore } from '@/store/modules/app'

// Key must be the same as name filed in columns
const apiToFilter = {
  ['branch'] : getBranchs,
  ['department'] : getDepartments,
  ['rankEmployee'] : getRanks,
  ['typeEmployee'] : getTypePersonnels,
}
const { t } = useI18n()
const dateDefault = {
  startDate : moment().startOf('month').format('YYYY-MM-DD%20HH:mm:ss'), 
  endDate: moment().endOf('day').format('YYYY-MM-DD%20HH:mm:ss')
}
const startDateDef = moment().startOf('month').format('YYYY-MM-DD%20HH:mm:ss')
const endDateDef = moment().endOf('day').format('YYYY-MM-DD%20HH:mm:ss')
const startDate = ref(startDateDef)
const endDate = ref(endDateDef)
const params = {startDate: startDate.value, endDate: endDate.value}
const { push } = useRouter()
const router = useRouter()
const appStore = useAppStore()
const Utility = appStore.getUtility
const eyeIcon = useIcon({ icon: 'emojione-monotone:eye-in-speech-bubble' })
provide('parameters', {params})

const action = (row: any, type: string) => {
  push({
    name: `${String(router.currentRoute.value.name)}.${Utility}`,
    params: {id: row.id, type: type, tab: row.voucherType},
    query: {startDate: startDate.value, endDate: endDate.value}
  })
}
const columns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    minWidth: '86',
    headerAlign: 'center',
    align: 'center',
  },
  {
    field: 'employeeCode',
    label: t('reuse.employeeCode'),
    minWidth: '100',
  },
  {
    field: 'employeeName',
    label: t('reuse.employeeName'),
    minWidth: '150',
    headerAlign: 'left'
  },
  {
    field: 'phonenumber',
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
  },
  {
    field: 'department',
    label: t('reuse.department'),
    minWidth: '110',
    headerFilter: 'Search',
  },
  {
    field: 'rankEmployee',
    label: t('reuse.rank'),
    minWidth: '110',
    headerFilter: 'Search',
  },
  {
    field: 'typeEmployee',
    label: t('reuse.type'),
    minWidth: '110',
    headerFilter: 'Search',
  },
  {
    field: 'sales',
    label: t('customerList.sales'),
    minWidth: '120',
    align: 'right',
    sortable: true,
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
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return t(`${formatStatusRatingEmployee(cellValue)}`)
    }
  },
  {
    field: 'operator',
    label: t('reuse.operator'),
    minWidth: '70',
    align: 'center',
    formatter: (row: Recordable, __: TableColumn, _cellValue: boolean) => {
      return h('div', { style: 'display:flex;justify-content: center;' }, [
        h(ElButton, { icon: eyeIcon, onClick: () => action(row, 'detail') }),
      ])
    }
  }
  
])

// Get date from header filter
const getDate = (date) => {
  if(date.startDate && date.endDate) {
    startDate.value = date.startDate
    endDate.value = date.endDate
  }
  startDate.value = date.startDate || startDateDef
  endDate.value = date.endDate || endDateDef
}

</script>
<template>
  <tableDatetimeFilterBasicVue 
  :removeButtonAdd="true" 
  :columns="columns" 
  :api="getEmployeeRatingList"
  :customOperator="3" 
  :apiToFilter="apiToFilter"
  :apiHasDateParams="true"
  :dateDefault="dateDefault"
  @get-date="getDate"
  />
</template>


