<script setup lang="ts">
import { getOriginCategories } from '@/api/LibraryAndSetting'
import { originCategories } from './CategoryManagement'
import TableType01 from '../../Components/tableType01-datetimefilter-basic.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
var nameRouter = String(router.currentRoute.value.name)
nameRouter = `${nameRouter}Utility`
</script>
<template>
  <TableType01
    :columns="originCategories"
    :api="getOriginCategories"
    :selection="false"
    :nameRouter="nameRouter"
  />
</template>
