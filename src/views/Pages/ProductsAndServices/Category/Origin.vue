<script setup lang="ts">
import { getCategories, deleteCategory } from '@/api/LibraryAndSetting'
import { originCategories } from './CategoryManagement'
import TableType01 from '../../Components/TableDataBase.vue'
import { provide } from 'vue'
import { PRODUCTS_AND_SERVICES } from '@/utils/API.Variables'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
const params = { TypeName: PRODUCTS_AND_SERVICES[8].key }
provide('parameters', {
  params
})
const deleteOrigin = t('reuse.deleteOrigin')
</script>
<template>
  <TableType01
    :columns="originCategories"
    :api="getCategories"
    :selection="false"
    :delApi="deleteCategory"
    :deleteTitle="deleteOrigin"
  />
</template>
