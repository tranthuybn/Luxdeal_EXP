<script setup lang="ts">
import productCategoryTable from '../../Components/productCategory-table.vue'
import {
  getProductCategories,
  getSpaProductCategories,
  getPropertyProductCategories
} from '@/api/LibraryAndSetting'
import {
  productCategories,
  spaProductCategories,
  propertyProductCategories
} from './CategoryManagement'
import { Tab } from '../../Components/Type'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
const tabs: Array<Tab> = [
  {
    name: 'productCategories',
    label: t('reuse.businessProduct'),
    api: getProductCategories,
    column: productCategories
  },
  {
    name: 'Spa',
    label: t('reuse.spaProduct'),
    api: getSpaProductCategories,
    column: spaProductCategories
  },
  {
    name: 'Property',
    label: t('reuse.propertyProduct'),
    api: getPropertyProductCategories,
    column: propertyProductCategories
  }
]
</script>
<template>
  <productCategoryTable :tabs="tabs" />
</template>
