<script setup lang="ts">
import { getPurchaseOrderList } from '@/api/Purchase'
import { PurchaseOrderColumn } from './PurchaseOrder'
import TableType01 from '../../Components/TableDataBase.vue'
import { provide, reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()
let params = reactive({ ServiceType: 6 })
provide('parameters', {
  params
})
</script>
<template>
  <TableType01
    :title-add="t('formDemo.addNewPurchaseOrders')"
    :columns="PurchaseOrderColumn"
    :api="getPurchaseOrderList"
    :customOperator="5"
  />
</template>
