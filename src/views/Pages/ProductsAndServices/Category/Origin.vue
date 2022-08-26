<script setup lang="ts">
import { getOriginCategories } from '@/api/LibraryAndSetting'
import { originCategories } from './CategoryManagement'
import TableType01 from '../../Components/tableType01-datetimefilter-basic.vue'
</script>
<template>
  <TableType01 :columns="originCategories" :api="getOriginCategories" :selection="false" />
</template>
