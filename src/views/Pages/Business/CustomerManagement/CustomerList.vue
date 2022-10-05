<script setup lang="ts">
import { getCustomerList } from '@/api/Business'
import TableType01 from '../../Components/TableDataBase.vue'

import { CustomerList } from './CustomerManagement'
import { onBeforeMount, provide } from 'vue'
const params = { PageIndex: 1, PageSize: 10 }
provide('parameters', {
  params
})
onBeforeMount(() => {
  getCustomerList
})
</script>

<template>
  <TableType01 :columns="CustomerList" :api="getCustomerList" />
</template>
