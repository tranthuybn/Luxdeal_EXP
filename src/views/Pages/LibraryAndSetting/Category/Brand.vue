<script setup lang="ts">
import { getBrandCategories } from '@/api/LibraryAndSetting'
import { brandCategories } from './CategoryManagement'
import TableType01 from '../../Components/tableType01-datetimefilter-basic.vue'
</script>
<template>
  <TableType01 :columns="brandCategories" :api="getBrandCategories" :selection="false"
/></template>
