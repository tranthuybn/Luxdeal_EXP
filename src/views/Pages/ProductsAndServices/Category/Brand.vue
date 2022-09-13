<script setup lang="ts">
import { getCategories } from '@/api/LibraryAndSetting'
import { brandCategories } from './CategoryManagement'
import TableType01 from '../../Components/TableDataBase.vue'
import { provide } from 'vue'
import { PRODUCTS_AND_SERVICES } from '@/utils/API.Variables'
const params = { TypeName: PRODUCTS_AND_SERVICES[9].key }
provide('parameters', {
  params
})
</script>
<template>
  <TableType01 :columns="brandCategories" :api="getCategories" :selection="false" />
</template>
