<script setup lang="ts">
import { getBusinessProductLibrary } from '@/api/LibraryAndSetting'
import { businessProductLibrary } from './ProductLibraryManagement'
import apipropTable from '../../Components/apiprop-table.vue'
</script>
<template>
  <apipropTable
    :selection="true"
    :columns="businessProductLibrary"
    :api="getBusinessProductLibrary"
  />
</template>
