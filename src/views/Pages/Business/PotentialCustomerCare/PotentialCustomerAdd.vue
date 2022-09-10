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
import { useValidator } from '@/hooks/web/useValidator'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/hooks/web/useI18n'

const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })
const { required, ValidService } = useValidator()
const { t } = useI18n()
const rules = reactive({
  customerInfo: [required()],
  customerName: [required()],
  phoneNumber: [ValidService.checkPhone],
  email: [required()],
  link: [required()],
  transactionHistory: [required()]
})

const collapse: Array<Collapse> = [
  {
    icon: minusIcon,
    name: 'information',
    title: t('reuse.customerInfo'),
    columns: columnProfileCustomer,
    api: getBranchList,
    buttonAdd: '',
    hasImage: false,
    rules: rules,
    typeForm: 'form'
  },
  {
    icon: plusIcon,
    name: 'priceCharacteristics',
    title: t('reuse.saleHistoryCustomerCare'),
    columns: saleHistoryCustomerCare,
    api: getaddNewPotenialCustomerList,
    buttonAdd: t('reuse.addSale'),
    expand: true,
    customOperator: 2,
    apiTableChild: getImportAndExportHistory,
    columnsTableChild: columnsImportExportHistory,
    pagination: false,
    removeHeaderFilter: true,
    removeDrawer: false,
    selection: false,
    typeForm: 'table',
    titleChilden: t('reuse.historySaleCustomerCare')
  }
]
//lay du lieu tu router
const router = useRouter()
const id = String(router.currentRoute.value.params.id)
</script>
<template> <CollapseBase :collapse="collapse" :id="id" :default="'information'" /></template>
<style scoped>
.header-icon {
  margin: 10px;
}
.text-center {
  font-size: 20px;
}
</style>
