<script setup lang="ts">
import { getPurchaseOrderList } from '@/api/Purchase'
import { PurchaseOrderColumn } from './PurchaseOrder'
import TableType01 from '../../Components/tableType01-datetimefilter-basic.vue'
</script>
<template>
  <TableType01 :columns="PurchaseOrderColumn" :api="getPurchaseOrderList" />
</template>
