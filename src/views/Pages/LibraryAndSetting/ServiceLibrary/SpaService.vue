<script setup lang="ts">
import { getBusinessProductLibrary } from '@/api/LibraryAndSetting'
import { businessProductLibrary } from './ProductLibraryManagement'
import tableType01 from '../../Components/tableType01-datetimefilter-basic.vue'
</script>
<template>
  <tableType01 :columns="businessProductLibrary" :api="getBusinessProductLibrary" />
</template>
