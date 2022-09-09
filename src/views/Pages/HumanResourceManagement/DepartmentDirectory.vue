<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import {
  getBranchList,
  getDepartmentList,
  getRankList,
  getTypePersonnelList
} from '@/api/HumanResourceManagement'
import { filterGender, filterDepartment } from '@/utils/filters'
import { useIcon } from '@/hooks/web/useIcon'
import CollapseBase from '@/views/Pages/Components/CollapseBase.vue'
import { Collapse } from '../Components/Type'

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
    field: 'numberOfEmployees',
    label: t('reuse.gender'),
    minWidth: '200',
    filters: filterGender
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
    field: 'numberOfEmployees',
    label: t('reuse.gender'),
    minWidth: '200',
    filters: filterGender
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
    field: 'numberOfEmployees',
    label: t('reuse.gender'),
    minWidth: '200',
    filters: filterGender
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
    field: 'numberOfEmployees',
    label: t('reuse.gender'),
    minWidth: '200',
    filters: filterGender
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
    buttonAdd: 'Thêm chi nhánh'
  },
  {
    icon: plusIcon,
    name: 'department',
    title: 'Phòng ban',
    columns: columnsBDepartment,
    api: getDepartmentList,
    buttonAdd: 'Thêm Phòng ban'
  },
  {
    icon: plusIcon,
    name: 'hierarchical ',
    title: 'Cấp bậc',
    columns: columnsRank,
    api: getRankList,
    buttonAdd: 'Thêm cấp bậc'
  },
  {
    icon: plusIcon,
    name: 'type',
    title: 'Loại hình nhân sự',
    columns: columnsTypePersonnel,
    api: getTypePersonnelList,
    buttonAdd: 'Thêm loại hình'
  }
]
</script>
<template>
  <div class="demo-collapse">
    <CollapseBase :collapse="collapse" />
  </div>
</template>
<style scoped>
.header-icon {
  margin: 10px;
}
.text-center {
  font-size: 20px;
}
</style>
