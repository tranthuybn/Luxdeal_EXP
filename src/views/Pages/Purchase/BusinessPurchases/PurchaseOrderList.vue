<script setup lang="ts">
import { getPurchaseOrderList } from '@/api/Purchase'
import { PurchaseOrderColumn } from './PurchaseOrder'
import TableType01 from '../../Components/TableDataBase.vue'
</script>
<template>
  <TableType01 :columns="PurchaseOrderColumn" :api="getPurchaseOrderList" />
</template>
