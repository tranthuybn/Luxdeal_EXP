<script setup lang="ts">
import { GETCATEGORY } from '@/api/LibraryAndSetting'
import { originCategories } from './CategoryManagement'
import TableType01 from '../../Components/TableDataBase.vue'
import { provide } from 'vue'
const params = { TypeName: 'xuatxu' }
provide('parameters', {
  params
})
</script>
<template>
  <TableType01 :columns="originCategories" :api="GETCATEGORY" :selection="false" />
</template>
