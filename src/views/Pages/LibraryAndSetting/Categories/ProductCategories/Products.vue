<script setup lang="ts">
import TableType02 from '../../../Components/tableType02-datetimefilter-basic.vue'
import { getProductCategories } from '@/api/LibraryAndSetting'
import { productCategories } from './CategoryManagement'

import { Tab } from '../../../Components/Type'
const tabs: Array<Tab> = [
  {
    name: 'productCategories',
    label: 'sản phẩm kinh doanh',
    api: getProductCategories,
    column: productCategories
  }
]
</script>
<template>
  <TableType02 title="productCategories" :tabs="tabs" />
</template>
