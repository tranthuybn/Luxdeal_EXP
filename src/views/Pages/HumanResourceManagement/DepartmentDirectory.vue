<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '@/views/Pages/Components/TableManageRoom.vue'
import {
  getBranchList,
  getDepartmentList,
  getRankList,
  getTypePersonnelList
} from '@/api/HumanResourceManagement'
import { filterGender, filterDepartment } from '@/utils/filters'
import { useIcon } from '@/hooks/web/useIcon'
import { ElCollapse, ElCollapseItem, ElButton } from 'element-plus'
import { RendererElement, RendererNode, VNode } from 'vue'
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
interface Collapse {
  icon: VNode<RendererNode, RendererElement, { [key: string]: any }>
  name: string
  title: string
  columns: TableColumn[]
  api: <T = any>(option: any) => Promise<IResponse<T>>
  buttonAdd: string
}
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
let currentCollapse = ref<string>(collapse[0].name)
const collapseChangeEvent = (val) => {
  if (val) {
    collapse.forEach((el) => {
      if (val.includes(el.name)) el.icon = minusIcon
      else if (el.icon == minusIcon) el.icon = plusIcon
    })
  } else
    collapse.forEach((el) => {
      el.icon = plusIcon
    })
}
const activeName = ref('branch')

const { push } = useRouter()
const router = useRouter()
const pushAdd = (val) => {
  switch (val) {
    case 0:
      push({
        name: `${String(router.currentRoute.value.name)}.Utility`,
        params: { backRoute: String(router.currentRoute.value.name) }
      })
      break
    case 1:
      push({
        name: `${String(router.currentRoute.value.name)}.Utility`,
        params: { backRoute: String(router.currentRoute.value.name) }
      })
      break
    case 2:
      push({
        name: `${String(router.currentRoute.value.name)}.Utility`,
        params: { backRoute: String(router.currentRoute.value.name) }
      })
      break
    case 3:
      push({
        name: `${String(router.currentRoute.value.name)}.Utility`,
        params: { backRoute: String(router.currentRoute.value.name) }
      })
      break
    default:
  }
}
</script>
<template>
  <div class="demo-collapse">
    <el-collapse v-model="activeName" :collapse="collapse" @change="collapseChangeEvent">
      <el-collapse-item
        v-for="(item, index) in collapse"
        :key="index"
        :name="item.name"
        v-model="currentCollapse"
      >
        <template #title>
          <el-button class="header-icon" :icon="item.icon" link />
          <span class="text-center">{{ item.title }}</span>
        </template>
        <tableDatetimeFilterBasicVue :columns="item.columns" :api="item.api" :key="index" />
        <el-button :icon="plusIcon" @click="pushAdd(index)"> {{ item.buttonAdd }} </el-button>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<style>
.header-icon {
  margin: 10px;
}
.text-center {
  font-size: 20px;
}
</style>
