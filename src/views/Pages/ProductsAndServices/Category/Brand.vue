<script setup lang="ts">
import { getCategory } from '@/api/LibraryAndSetting'
import { brandCategories } from './CategoryManagement'
import TableType01 from '../../Components/TableDataBase.vue'
import { provide } from 'vue'
import { PRODUCTS_AND_SERVICES_CATEGORY } from '@/utils/API.Variables'
const params = { TypeName: PRODUCTS_AND_SERVICES_CATEGORY.BRAND }
provide('parameters', {
  params
})
</script>
<template>
  <TableType01 :columns="brandCategories" :api="getCategory" :selection="false" />
</template>
