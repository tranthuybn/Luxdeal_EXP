<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import {
deleteBranch,
  deleteDepartment,
  deletePosition,
  deleteTypeOfStaff,
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
import { dateTimeFormat, statusBranch } from '@/utils/format'

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
    field: 'code',
    label: t('reuse.managementCode'),
    minWidth: '250',
    sortable: true
  },
  {
    field: 'name',
    label: t('reuse.branchName'),
    minWidth: '200',
    sortable: true
  },
  {
    field: 'counts',
    label: t('formDemo.numberPersonnel'),
    minWidth: '200'
  },
  {
    field: 'createAt',
    label: t('reuse.createDate'),
    minWidth: '200',
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'createBy',
    label: t('reuse.creator'),
    minWidth: '200'
  },
  {
    field: 'isActive',
    label: t('reuse.status'),
    minWidth: '150',
    filters: filterDepartment,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return t(`${statusBranch(cellValue)}`)
    }
  }
])
const columnsDepartment = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'code',
    label: t('reuse.managementCode'),
    minWidth: '250',
    sortable: true
  },
  {
    field: 'name',
    label: t('reuse.DepartmentName'),
    minWidth: '200',
    sortable: true
  },
  {
    field: 'counts',
    label: t('formDemo.numberPersonnel'),
    minWidth: '200'
  },
  {
    field: 'createAt',
    label: t('reuse.createDate'),
    minWidth: '200',
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'createBy',
    label: t('reuse.creator'),
    minWidth: '200'
  },
  {
    field: 'isActive',
    label: t('reuse.status'),
    minWidth: '150',
    filters: filterDepartment,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return t(`${statusBranch(cellValue)}`)
    }
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
    field: 'code',
    label: 'Mã cấp bậc',
    minWidth: '250',
    sortable: true
  },
  {
    field: 'name',
    label: 'Tên cấp bậc',
    minWidth: '200',
    sortable: true
  },
  {
    field: 'counts',
    label: t('formDemo.numberPersonnel'),
    minWidth: '200'
  },
  {
    field: 'createAt',
    label: t('reuse.createDate'),
    minWidth: '200',
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'createBy',
    label: t('reuse.creator'),
    minWidth: '200'
  },
  {
    field: 'isActive',
    label: t('reuse.status'),
    minWidth: '150',
    filters: filterDepartment,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return t(`${statusBranch(cellValue)}`)
    }
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
    field: 'code',
    label: t('reuse.managementCode'),
    minWidth: '250',
    sortable: true
  },
  {
    field: 'name',
    label: 'Tên cấp bậc',
    minWidth: '200',
    sortable: true
  },
  {
    field: 'counts',
    label: t('formDemo.numberPersonnel'),
    minWidth: '200'
  },
  {
    field: 'createAt',
    label: t('reuse.createDate'),
    minWidth: '200',
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'createdBy',
    label: t('reuse.creator'),
    minWidth: '200'
  },
  {
    field: 'isActive',
    label: t('reuse.status'),
    minWidth: '150',
    filters: filterDepartment,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return t(`${statusBranch(cellValue)}`)
    }
  }
])

const collapse: Array<Collapse> = [
  {
    icon: minusIcon,
    name: 'Branch',
    title: 'Chi nhánh',
    columns: columnsBranch,
    api: getBranchList,
    delApi: deleteBranch,
    typeForm: 'table',
    pagination: false,
    selection: false,
    removeHeaderFilter: true,
    removeDrawer: true,
    buttonAdd: 'Thêm chi nhánh',
    typeButton: 'Branch'
  },
  {
    icon: plusIcon,
    name: 'Department',
    title: 'Phòng ban',
    columns: columnsDepartment,
    api: getDepartmentList,
    typeForm: 'table',
    pagination: false,
    delApi: deleteDepartment,
    selection: false,
    removeHeaderFilter: true,
    removeDrawer: true,
    buttonAdd: 'Thêm Phòng ban',
    typeButton: 'Department'
  },
  {
    icon: plusIcon,
    name: 'Position',
    title: 'Cấp bậc',
    columns: columnsRank,
    api: getRankList,
    delApi: deletePosition,
    typeForm: 'table',
    pagination: false,
    selection: false,
    removeHeaderFilter: true,
    removeDrawer: true,
    buttonAdd: 'Thêm cấp bậc',
    typeButton: 'Position'
  },
  {
    icon: plusIcon,
    name: 'TypeOfStaff',
    title: 'Loại hình nhân sự',
    columns: columnsTypePersonnel,
    api: getTypePersonnelList,
    delApi: deleteTypeOfStaff,
    typeForm: 'table',
    pagination: false,
    selection: false,
    removeHeaderFilter: true,
    removeDrawer: true,
    buttonAdd: 'Thêm loại hình',
    typeButton: 'TypeOfStaff'
  }
]
const router = useRouter()


const id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)
const tab = String(router.currentRoute.value.params.tab)

</script>
<template>
  <CollapseBase :collapse="collapse" :type="type" :tabs="tab" :default="'Branch'" :id="id" />
</template>
