<script setup lang="ts">
import productCategoryTable from '../../Components/TabsBase.vue'
import {
  colorCategories,
  sizeCategories,
  materialCategories,
  statusCategories,
  genderCategories
} from './CategoryManagement'
import { Tab } from '../../Components/Type'
import { useI18n } from '@/hooks/web/useI18n'
import { provide, reactive } from 'vue'
import { PRODUCTS_AND_SERVICES } from '@/utils/API.Variables'
import { getCategories, deleteCategory } from '@/api/LibraryAndSetting'
let params = reactive({ TypeName: 'mausac' })
provide('parameters', {
  params
})
const { t } = useI18n()
const tabs: Array<Tab> = [
  {
    name: PRODUCTS_AND_SERVICES[1].key,
    label: t('reuse.color'),
    api: getCategories,
    column: colorCategories,
    delApi: deleteCategory
  },
  {
    name: PRODUCTS_AND_SERVICES[2].key,
    label: t('reuse.size'),
    api: getCategories,
    column: sizeCategories,
    delApi: deleteCategory
  },
  {
    name: PRODUCTS_AND_SERVICES[3].key,
    label: t('reuse.material'),
    api: getCategories,
    column: materialCategories,
    delApi: deleteCategory
  },
  {
    name: PRODUCTS_AND_SERVICES[4].key,
    label: t('reuse.status'),
    api: getCategories,
    column: statusCategories,
    delApi: deleteCategory
  },
  {
    name: PRODUCTS_AND_SERVICES[5].key,
    label: t('reuse.gender'),
    api: getCategories,
    column: genderCategories,
    delApi: deleteCategory
  }
]

const changeParam = (val = '') => {
  if (val.length > 0) params.TypeName = val
  provide('parameters', {
    params
  })
}
</script>
<template>
  <productCategoryTable
    :titleAdd="'reuse.addNewCharacteristic'"
    :tabs="tabs"
    @tab-change-event="changeParam"
/></template>
