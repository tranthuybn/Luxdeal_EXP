<script setup lang="ts">
import { getUnitCategories } from '@/api/LibraryAndSetting'
import { unitCategories } from './CategoryManagement'
import TableType01 from '../../Components/TableDataBase.vue'
</script>
<template>
  <TableType01 :columns="unitCategories" :api="getUnitCategories" :selection="false" />
</template>
