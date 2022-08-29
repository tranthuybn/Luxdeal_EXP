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
import { useRouter } from 'vue-router'
const { t } = useI18n()
const tabs: Array<Tab> = [
  {
    name: 'productCategories',
    label: t('reuse.businessProduct'),
    api: getProductCategories,
    column: productCategories
  },
  {
    name: 'spaProductStep2',
    label: t('reuse.spaProduct'),
    api: getSpaProductCategories,
    column: spaProductCategories
  },
  {
    name: 'propertyProductStep2',
    label: t('reuse.propertyProduct'),
    api: getPropertyProductCategories,
    column: propertyProductCategories
  }
]
const router = useRouter()
var nameRouter = String(router.currentRoute.value.name)
nameRouter = `${nameRouter}Utility`
</script>
<template>
  <productCategoryTable :tabs="tabs" :nameRouter="nameRouter" />
</template>
