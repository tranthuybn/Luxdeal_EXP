<script setup lang="ts">
import { getCategories, deleteCategory } from '@/api/LibraryAndSetting'
import { brandCategories } from './CategoryManagement'
import TableType01 from '../../Components/TableDataBase.vue'
import { provide } from 'vue'
import { PRODUCTS_AND_SERVICES } from '@/utils/API.Variables'
import { t } from '@/hooks/web/useI18n'
const params = { TypeName: PRODUCTS_AND_SERVICES[7].key }
provide('parameters', {
  params
})
const deleteBrand = t('formDemo.deleteBrand')
</script>
<template>
  <TableType01
    :columns="brandCategories"
    :api="getCategories"
    :selection="false"
    :delApi="deleteCategory"
    :deleteTitle="deleteBrand"
    :titleAdd="'reuse.addNewBrand'"
  />
</template>
<style scoped>
::v-deep(.custom-empty > .el-empty) {
  padding: 5px 0;
}
::v-deep(.custom-empty .el-empty > .el-empty__description) {
  margin-top: 5px;
}
</style>
