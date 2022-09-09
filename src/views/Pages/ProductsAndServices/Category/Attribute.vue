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

const { t } = useI18n()
const tabs: Array<Tab> = [
  {
    name: 'colorCategories',
    label: t('reuse.color'),
    api: getColorCategories,
    column: colorCategories
  },
  {
    name: 'sizeCategories',
    label: t('reuse.size'),
    api: getSizeCategories,
    column: sizeCategories
  },
  {
    name: 'materialCategories',
    label: t('reuse.material'),
    api: getMaterialCategories,
    column: materialCategories
  },
  {
    name: 'statusCategories',
    label: t('reuse.status'),
    api: getStatusCategories,
    column: statusCategories
  },
  {
    name: 'genderCategories',
    label: t('reuse.gender'),
    api: getGenderCategories,
    column: genderCategories
  }
]
</script>
<template>
  <productCategoryTable :tabs="tabs" />
</template>
