<script setup lang="ts">
import { getBrandCategories } from '@/api/LibraryAndSetting'
import { brandCategories } from './CategoryManagement'
import TableType01 from '../../Components/tableType01-datetimefilter-basic.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
var nameRouter = String(router.currentRoute.value.name)
nameRouter = `${nameRouter}Utility`
</script>
<template>
  <TableType01
    :columns="brandCategories"
    :api="getBrandCategories"
    :selection="false"
    :nameRouter="nameRouter"
  />
</template>
