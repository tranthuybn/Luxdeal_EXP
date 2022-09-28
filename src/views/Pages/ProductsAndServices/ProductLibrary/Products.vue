<script setup lang="ts">
import { getBusinessProductLibrary, deleteProduct } from '@/api/LibraryAndSetting'
import { businessProductLibrary } from './ProductLibraryManagement'
import TableType01 from '../../Components/TableDataBase.vue'
</script>
<template>
  <TableType01
    :columns="businessProductLibrary"
    :api="getBusinessProductLibrary"
    :delApi="deleteProduct"
  />
</template>
