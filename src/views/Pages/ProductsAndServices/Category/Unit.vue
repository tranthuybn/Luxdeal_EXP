<script setup lang="ts">
import { getUnitCategories } from '@/api/LibraryAndSetting'
import { unitCategories } from './CategoryManagement'
import TableType01 from '../../Components/TableDataBase.vue'
import { provide } from 'vue'
import { PRODUCTS_AND_SERVICES } from '@/utils/API.Variables'
const params = { TypeName: PRODUCTS_AND_SERVICES[6].key }
provide('parameters', {
  params
})
</script>
<template>
  <TableType01 :columns="unitCategories" :api="getUnitCategories" :selection="false" />
</template>
