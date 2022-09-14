<script setup lang="ts">
import productCategoryTable from '../../Components/TabsBase.vue'
import {
  getColorCategories,
  getSizeCategories,
  getMaterialCategories,
  getStatusCategories,
  getGenderCategories
} from '@/api/LibraryAndSetting'
import {
  colorCategories,
  sizeCategories,
  materialCategories,
  statusCategories,
  genderCategories
} from './CategoryManagement'
import { Tab } from '../../Components/Type'
import { useI18n } from '@/hooks/web/useI18n'
import { PRODUCTS_AND_SERVICES } from '@/utils/API.Variables'
const { t } = useI18n()
const tabs: Array<Tab> = [
  {
    name: 'colorCategories',
    label: t('reuse.color'),
    api: getColorCategories,
    column: colorCategories,
    params: { TypeName: PRODUCTS_AND_SERVICES[6].key }
  },
  {
    name: 'sizeCategories',
    label: t('reuse.size'),
    api: getSizeCategories,
    column: sizeCategories,
    params: { TypeName: PRODUCTS_AND_SERVICES[6].key }
  },
  {
    name: 'materialCategories',
    label: t('reuse.material'),
    api: getMaterialCategories,
    column: materialCategories,
    params: { TypeName: PRODUCTS_AND_SERVICES[6].key }
  },
  {
    name: 'statusCategories',
    label: t('reuse.status'),
    api: getStatusCategories,
    column: statusCategories,
    params: { TypeName: PRODUCTS_AND_SERVICES[6].key }
  },
  {
    name: 'genderCategories',
    label: t('reuse.gender'),
    api: getGenderCategories,
    column: genderCategories,
    params: { TypeName: PRODUCTS_AND_SERVICES[6].key }
  }
]
</script>
<template>
  <productCategoryTable :tabs="tabs" />
</template>
