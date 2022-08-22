<script setup lang="ts">
import { getBrandCategories } from '@/api/LibraryAndSetting'
import { brandCategories } from './CategoryManagement'
import ApiPropTable from '../../Components/apiprop-table.vue'
</script>
<template>
  <api-prop-table :columns="brandCategories" :api="getBrandCategories" />
</template>
