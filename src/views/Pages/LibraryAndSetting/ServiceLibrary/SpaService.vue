<script setup lang="ts">
import { getBusinessProductLibrary } from '@/api/LibraryAndSetting'
import { businessProductLibrary } from './ProductLibraryManagement'
import ApiPropTable from '../../Components/apiprop-table.vue'
</script>
<template>
  <api-prop-table
    :selection="true"
    :columns="businessProductLibrary"
    :api="getBusinessProductLibrary"
  />
</template>
