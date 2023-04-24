<script setup lang="ts">
import { getBusinessProductLibrary, deleteProduct } from '@/api/LibraryAndSetting'
import { businessProductLibrary, getCategory } from './ProductLibraryManagement'
import TableType01 from '../../Components/TableDataBase.vue'

Promise.all([getCategory()])
</script>
<template>
  <TableType01
    :columns="businessProductLibrary"
    :api="getBusinessProductLibrary"
    :delApi="deleteProduct"
  />
</template>
