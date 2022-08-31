<script setup lang="ts">
import productCategoryTable from '../../Components/productCategory-table.vue'
import { getProductCategories } from '@/api/LibraryAndSetting'
import { productCategories } from './CategoryManagement'
import { Tab } from '../../Components/Type'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
const tabs: Array<Tab> = [
  {
    name: 'productCategories',
    label: t('reuse.businessProduct'),
    api: getProductCategories,
    column: productCategories
  }
]
</script>
<template>
  <productCategoryTable :tabs="tabs" />
</template>
