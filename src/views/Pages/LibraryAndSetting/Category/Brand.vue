<script setup lang="ts">
import { getBrandCategories } from '@/api/LibraryAndSetting'
import { brandCategories } from './CategoryManagement'
import apipropTable from '../../Components/apiprop-table.vue'
</script>
<template>
  <apipropTable :columns="brandCategories" :api="getBrandCategories" />
</template>
