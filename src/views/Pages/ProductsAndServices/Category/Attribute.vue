<script setup lang="ts">
import productCategoryTable from '../../Components/TabsBase.vue'
import { getCategories } from '@/api/LibraryAndSetting'
import {
  colorCategories,
  sizeCategories,
  materialCategories,
  statusCategories,
  genderCategories
} from './CategoryManagement'
import { Tab } from '../../Components/Type'
import { useI18n } from '@/hooks/web/useI18n'
import { provide } from 'vue'
import { PRODUCTS_AND_SERVICES } from '@/utils/API.Variables'

const { t } = useI18n()
const tabs: Array<Tab> = [
  {
    name: 'colorCategories',
    label: t('reuse.color'),
    api: getCategories,
    column: colorCategories
  },
  {
    name: 'sizeCategories',
    label: t('reuse.size'),
    api: getCategories,
    column: sizeCategories
  },
  {
    name: 'materialCategories',
    label: t('reuse.material'),
    api: getCategories,
    column: materialCategories
  },
  {
    name: 'statusCategories',
    label: t('reuse.status'),
    api: getCategories,
    column: statusCategories
  },
  {
    name: 'genderCategories',
    label: t('reuse.gender'),
    api: getCategories,
    column: genderCategories
  }
]
let params = { TypeName: tabs[].params }
provide('parameters', {
  params
})
const changeParam = (...val) => {
  console.log(val)
}
</script>
<template> <productCategoryTable :tabs="tabs" @change-param="changeParam" /></template>
