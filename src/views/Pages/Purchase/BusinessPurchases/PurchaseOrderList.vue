<script setup lang="ts">
import { getBusinessProductLibrary } from '@/api/LibraryAndSetting'
import { PurchaseOrderColumn } from './PurchaseOrder'
import TableType01 from '../../Components/tableType01-datetimefilter-basic.vue'
</script>
<template>
  <TableType01 :columns="PurchaseOrderColumn" :api="getBusinessProductLibrary" />
</template>
