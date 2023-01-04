<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../../Components/TableDataBase.vue'
import { getEmployeeList } from '@/api/Business'
import { filterStatusSettingPoint } from '@/utils/filters'

const { t } = useI18n()
const columns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'role',
    label: t('reuse.setRole'),
    minWidth: '250'
  },
  {
    field: 'description',
    label: t('reuse.description'),
    minWidth: '150'
  },

  {
    field: 'createDate',
    label: t('reuse.createDate'),
    minWidth: '150',
    sortable: true
  },
  {
    field: 'creator',
    label: t('reuse.creator'),
    minWidth: '150',
    headerFilter: 'Name'
  },
  {
    field: 'status',
    label: t('reuse.roleStatus'),
    minWidth: '120',
    filters: filterStatusSettingPoint
  }
])
</script>
<template>
  <tableDatetimeFilterBasicVue :columns="columns" :api="getEmployeeList" />
</template>
