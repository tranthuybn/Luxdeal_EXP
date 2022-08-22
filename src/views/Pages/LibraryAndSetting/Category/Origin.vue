<script setup lang="ts">
import { getOriginCategories } from '@/api/LibraryAndSetting'
import { originCategories } from './CategoryManagement'
import apipropTable from '../../Components/apiprop-table.vue'
</script>
<template>
  <apipropTable :columns="originCategories" :api="getOriginCategories" />
</template>
