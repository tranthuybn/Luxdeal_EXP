<script setup lang="ts">
import { getSpaLibrary } from '@/api/LibraryAndSetting'
import { businessProductLibrary } from './ProductLibraryManagement'
import TableType01 from '../../Components/tableType01-datetimefilter-basic.vue'
</script>
<template>
  <TableType01 :columns="businessProductLibrary" :api="getSpaLibrary" />
</template>
