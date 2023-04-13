<script setup lang="ts">
import { getCustomerList } from '@/api/Business'
import TableType01 from '../../Components/TableDataBase.vue'
import { CustomerList } from './CustomerManagement'

const apiToFilter = {
  ['name'] : getCustomerList,
}

</script>

<template>
  <TableType01
    :customOperator="5"
    :titleAdd="'router.customerAdd'"
    :columns="CustomerList"
    :apiToFilter="apiToFilter"
    :api="getCustomerList"
  />
</template>
