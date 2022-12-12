<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import {
  getBranchList,
  getDepartmentList,
  getRankList,
  getTypePersonnelList
} from '@/api/HumanResourceManagement'
import { filterDepartment } from '@/utils/filters'
import { useIcon } from '@/hooks/web/useIcon'
import CollapseBase from '@/views/Pages/Components/CollapseBase.vue'
import { Collapse } from '../Components/Type'
import { useRouter } from 'vue-router'

const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })

const { t } = useI18n()

const columnsBranch = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'managementCode',
    label: t('reuse.managementCode'),
    minWidth: '250',
    sortable: true
  },
  {
    field: 'branchName',
    label: t('reuse.branchName'),
    minWidth: '200',
    sortable: true
  },
  {
    field: 'numberPersonnel',
    label: t('formDemo.numberPersonnel'),
    minWidth: '200'
  },
  {
    field: 'createDate',
    label: t('reuse.createDate'),
    minWidth: '200'
  },
  {
    field: 'creator',
    label: t('reuse.creator'),
    minWidth: '200'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '150',
    filters: filterDepartment
  }
])
const columnsBDepartment = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'managementCode',
    label: t('reuse.managementCode'),
    minWidth: '250',
    sortable: true
  },
  {
    field: 'DepartmentName',
    label: t('reuse.DepartmentName'),
    minWidth: '200',
    sortable: true
  },
  {
    field: 'numberPersonnel',
    label: t('formDemo.numberPersonnel'),
    minWidth: '200'
  },
  {
    field: 'createDate',
    label: t('reuse.createDate'),
    minWidth: '200'
  },
  {
    field: 'creator',
    label: t('reuse.creator'),
    minWidth: '200'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '150',
    filters: filterDepartment
  }
])
const columnsRank = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'managementCode',
    label: t('reuse.managementCode'),
    minWidth: '250',
    sortable: true
  },
  {
    field: 'RankName',
    label: t('reuse.DepartmentName'),
    minWidth: '200',
    sortable: true
  },
  {
    field: 'numberPersonnel',
    label: t('formDemo.numberPersonnel'),
    minWidth: '200'
  },
  {
    field: 'createDate',
    label: t('reuse.createDate'),
    minWidth: '200'
  },
  {
    field: 'creator',
    label: t('reuse.creator'),
    minWidth: '200'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '150',
    filters: filterDepartment
  }
])
const columnsTypePersonnel = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'managementCode',
    label: t('reuse.managementCode'),
    minWidth: '250',
    sortable: true
  },
  {
    field: 'TypePersonnelName',
    label: t('reuse.DepartmentName'),
    minWidth: '200',
    sortable: true
  },
  {
    field: 'numberPersonnel',
    label: t('formDemo.numberPersonnel'),
    minWidth: '200'
  },
  {
    field: 'createDate',
    label: t('reuse.createDate'),
    minWidth: '200'
  },
  {
    field: 'creator',
    label: t('reuse.creator'),
    minWidth: '200'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '150',
    filters: filterDepartment
  }
])

const collapse: Array<Collapse> = [
  {
    icon: minusIcon,
    name: 'branch',
    title: 'Chi nhánh',
    columns: columnsBranch,
    api: getBranchList,
    typeForm: 'table',
    pagination: false,
    selection: false,
    customOperator: 1,
    removeHeaderFilter: true,
    removeDrawer: true,
    buttonAdd: 'Thêm chi nhánh',
    typeButton: 'branch'
  },
  {
    icon: plusIcon,
    name: 'department',
    title: 'Phòng ban',
    columns: columnsBDepartment,
    api: getDepartmentList,
    typeForm: 'table',
    pagination: false,
    selection: false,
    customOperator: 1,
    removeHeaderFilter: true,
    removeDrawer: true,
    buttonAdd: 'Thêm Phòng ban',
    typeButton: 'department'
  },
  {
    icon: plusIcon,
    name: 'hierarchical ',
    title: 'Cấp bậc',
    columns: columnsRank,
    api: getRankList,
    typeForm: 'table',
    pagination: false,
    selection: false,
    customOperator: 1,
    removeHeaderFilter: true,
    removeDrawer: true,
    buttonAdd: 'Thêm cấp bậc',
    typeButton: 'rank'
  },
  {
    icon: plusIcon,
    name: 'type',
    title: 'Loại hình nhân sự',
    columns: columnsTypePersonnel,
    api: getTypePersonnelList,
    typeForm: 'table',
    pagination: false,
    selection: false,
    customOperator: 1,
    removeHeaderFilter: true,
    removeDrawer: true,
    buttonAdd: 'Thêm loại hình',
    typeButton: 'tyOfPersonel'
  }
]
const router = useRouter()
const id = String(router.currentRoute.value.params.id)
</script>
<template>
  <CollapseBase :collapse="collapse" :default="'branch'" :id="id" />
</template>
