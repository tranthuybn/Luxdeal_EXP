<script setup lang="ts">
import { GETCATEGORY } from '@/api/LibraryAndSetting'
import { brandCategories } from './CategoryManagement'
import TableType01 from '../../Components/TableDataBase.vue'
import { provide } from 'vue'
const params = { TypeName: 'thuonghieu' }
provide('parameters', {
  params
})
</script>
<template>
  <TableType01 :columns="brandCategories" :api="GETCATEGORY" :selection="false" />
</template>
