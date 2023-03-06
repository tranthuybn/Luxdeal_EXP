<script setup lang="ts">
import { getCategories, deleteCategory } from '@/api/LibraryAndSetting'
import { unitCategories } from './CategoryManagement'
import TableType01 from '../../Components/TableDataBase.vue'
import { PRODUCTS_AND_SERVICES } from '@/utils/API.Variables'
import { provide } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
const params = { TypeName: PRODUCTS_AND_SERVICES[6].key }
provide('parameters', {
  params
})
const deleteUnit = t('reuse.deleteUnit')
</script>
<template>
  <TableType01
    :titleAdd="'reuse.addNewUnit'"
    :delApi="deleteCategory"
    :deleteTitle="deleteUnit"
    :columns="unitCategories"
    :selection="false"
    :api="getCategories"
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
