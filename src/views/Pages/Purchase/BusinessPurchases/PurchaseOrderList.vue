<script setup lang="ts">
import { getPurchaseOrderList } from '@/api/Purchase'
import { PurchaseOrderColumn } from './PurchaseOrder'
import TableType01 from '../../Components/TableDataBase.vue'
import { provide, reactive } from 'vue'

let params = reactive({ ServiceType: 6 })
provide('parameters', {
  params
})
</script>
<template>
  <TableType01 :columns="PurchaseOrderColumn" :api="getPurchaseOrderList" />
</template>
