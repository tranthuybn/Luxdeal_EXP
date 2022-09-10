<script setup lang="ts">
import CollapseBase from '@/views/Pages/Components/CollapseBase.vue'
import { getBranchList } from '@/api/HumanResourceManagement'
import { getImportAndExportHistory } from '@/api/LibraryAndSetting'
import { getaddNewPotenialCustomerList } from '@/api/Business'
import { useIcon } from '@/hooks/web/useIcon'
import { Collapse } from '../../Components/Type'
import {
  columnProfileCustomer,
  saleHistoryCustomerCare,
  columnsImportExportHistory
} from './PotentialCustomerManagement'
import { useRouter } from 'vue-router'
const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })
const collapse: Array<Collapse> = [
  {
    icon: minusIcon,
    name: 'information',
    title: 'Thông tin khách hàng',
    columns: columnProfileCustomer,
    api: getBranchList,
    buttonAdd: '',
    type: 'form'
  },
  {
    icon: plusIcon,
    name: 'priceCharacteristics',
    title: 'Sale & lịch sử chăm sóc khách hàng',
    columns: saleHistoryCustomerCare,
    api: getaddNewPotenialCustomerList,
    buttonAdd: 'Thêm đặc tính và giá bán',
    type: 'table',
    expand: true,
    apiTableChild: getImportAndExportHistory,
    columnsTableChild: columnsImportExportHistory,
    pagination: false,
    removeHeaderFilter: true,
    removeDrawer: false,
    selection: false
  }
]
//lay du lieu tu router
const router = useRouter()
const type = String(router.currentRoute.value.params.type)
const id = String(router.currentRoute.value.params.id)
</script>
<template> <CollapseBase :collapse="collapse" :id="id" :type="type" /></template>
<style scoped>
.header-icon {
  margin: 10px;
}
.text-center {
  font-size: 20px;
}
</style>
