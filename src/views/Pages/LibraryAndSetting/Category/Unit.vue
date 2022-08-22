<script setup lang="ts">
import { getUnitCategories } from '@/api/LibraryAndSetting'
import { unitCategories } from './CategoryManagement'
import apipropTable from '../../Components/apiprop-table.vue'
</script>
<template>
  <apipropTable :columns="unitCategories" :api="getUnitCategories" />
</template>
