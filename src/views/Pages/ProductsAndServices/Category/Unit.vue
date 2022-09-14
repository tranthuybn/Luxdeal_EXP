<script setup lang="ts">
import { getCategories } from '@/api/LibraryAndSetting'
import { unitCategories } from './CategoryManagement'
import TableType01 from '../../Components/TableDataBase.vue'
import { PRODUCTS_AND_SERVICES } from '@/utils/API.Variables'
import { provide } from 'vue'
const params = { TypeName: PRODUCTS_AND_SERVICES[7].key }
provide('parameters', {
  params
})
</script>
<template>
  <TableType01 :columns="unitCategories" :api="getCategories" :selection="false" />
</template>
