<script setup lang="ts">
import { getSpaLibrary, deleteSpa } from '@/api/LibraryAndSetting'
import { businessProductLibrary } from './ProductLibraryManagement'
import TableType01 from '../../Components/TableDataBase.vue'
import { provide } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
const params = { IsActive: null, IsApproved: null }
provide('parameters', {
  params
})
const deleteOrigin = t('reuse.deleteService')
</script>
<template>
  <TableType01
    :columns="businessProductLibrary"
    :delApi="deleteSpa"
    :deleteTitle="deleteOrigin"
    :selection="true"
    :api="getSpaLibrary"
  />
</template>
