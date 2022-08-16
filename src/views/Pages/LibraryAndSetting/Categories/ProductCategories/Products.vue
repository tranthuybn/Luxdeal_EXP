<script setup lang="ts">
import productCategoryTable from '../../../Components/productCategory-table.vue'
import { getProductCategories } from '@/api/LibraryAndSetting'
import { productCategories } from './CategoryManagement'
import { Tab } from '../../../Components/Type'
const tabs: Array<Tab> = [
  {
    name: 'productCategories',
    label: 'Sản phẩm kinh doanh',
    api: getProductCategories,
    column: productCategories
  },
  {
    name: 'Spa',
    label: 'Vật tư spa(Step2)',
    api: getProductCategories,
    column: productCategories
  },
  {
    name: 'Property',
    label: 'Tài sản(Step2)',
    api: getProductCategories,
    column: productCategories
  }
]
</script>
<template>
  <productCategoryTable title="productCategories" :tabs="tabs" />
</template>
