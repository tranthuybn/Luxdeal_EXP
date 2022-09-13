<script setup lang="ts">
import { getCategories } from '@/api/LibraryAndSetting'
import { originCategories } from './CategoryManagement'
import TableType01 from '../../Components/TableDataBase.vue'
import { provide, reactive } from 'vue'
import { PRODUCTS_AND_SERVICES } from '@/utils/API.Variables'
const params = { TypeName: PRODUCTS_AND_SERVICES[8].key }
provide('parameters', params)
</script>
<template>
  <TableType01 :columns="originCategories" :api="getCategories" :selection="false" />
</template>
