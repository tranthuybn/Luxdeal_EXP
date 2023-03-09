<script setup lang="ts">
import productCategoryTable from '../../Components/TabsBase.vue'
import { getCategories, deleteCategory } from '@/api/LibraryAndSetting'
import { productCategories } from './CategoryManagement'
import { Tab } from '../../Components/Type'
import { PRODUCTS_AND_SERVICES } from '@/utils/API.Variables'
import { provide } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
const params = { TypeName: PRODUCTS_AND_SERVICES[0].key }
provide('parameters', {
  params
})
const tabs: Array<Tab> = [
  {
    name: PRODUCTS_AND_SERVICES[0].key,
    label: t('reuse.businessProduct'),
    api: getCategories,
    column: productCategories,
    delApi: deleteCategory,
    titleAdd: 'reuse.addCategory'
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
  <productCategoryTable :tabs="tabs" @tab-change-event="changeParam" />
</template>
<style scoped>
::v-deep(.custom-empty > .el-empty) {
  padding: 5px 0;
}

::v-deep(.custom-empty .el-empty > .el-empty__description) {
  margin-top: 5px;
}

::v-deep(.el-table__row--level-1 > td > .cell > .custom-empty) {
  padding-left: 5rem;
}
</style>
