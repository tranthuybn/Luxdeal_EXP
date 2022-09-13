<script setup lang="ts">
import { getCategory } from '@/api/LibraryAndSetting'
import { originCategories } from './CategoryManagement'
import TableType01 from '../../Components/TableDataBase.vue'
import { provide } from 'vue'
import { PRODUCTS_AND_SERVICES_CATEGORY } from '@/utils/API.Variables'
const params = { TypeName: PRODUCTS_AND_SERVICES_CATEGORY.ORIGIN }
provide('parameters', {
  params
})
</script>
<template>
  <TableType01 :columns="originCategories" :api="getCategory" :selection="false" />
</template>
