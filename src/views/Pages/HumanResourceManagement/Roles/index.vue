<script setup lang="ts">
import { h, reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../../Components/TableDataBase.vue'
import { getRoleList, deleteStaffRole } from '@/api/HumanResourceManagement'
import { filterStatusSettingPoint } from '@/utils/filters'
import { ElTag } from 'element-plus'

const { t } = useI18n()
const columns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'name',
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
    field: 'active',
    label: t('reuse.roleStatus'),
    minWidth: '120',
    filters: filterStatusSettingPoint,
    formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
      return h(
        ElTag,
        {
          type: cellValue === filterStatusSettingPoint[0].value ? 'success' : cellValue === filterStatusSettingPoint[1].value ? 'danger':'warning'
        },
        () =>filterStatusSettingPoint.find((el)=>el.value === cellValue)?.text ?? ''
      )
    }
  },
  {
    field: 'employee',
    label: t('formDemo.numberPersonnel'),
    minWidth: '100',
    align: 'center'
  },
])
</script>
<template>
  <tableDatetimeFilterBasicVue :columns="columns" :api="getRoleList" :delApi="deleteStaffRole" />
</template>
