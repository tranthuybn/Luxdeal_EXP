<script setup lang="ts">
import { reactive, h } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import {
  deleteDepartment,
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
import { dateTimeFormat } from '@/utils/format'
import { ElButton, ElMessageBox, ElNotification } from 'element-plus'
import { useAppStore } from '@/store/modules/app'

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
    field: 'staffNumber',
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
    filters: filterDepartment
  },
  {
    field: 'operator',
    label: t('reuse.operator'),
    minWidth: '200',
    formatter: (row: Recordable, __: TableColumn, _cellValue: boolean) => {
      return h('div', { style: 'display:flex;justify-content: center;' }, [
        h(ElButton, { icon: eyeIcon, onClick: () => action(row, 'detail') }),
        h(ElButton, { icon: editIcon, onClick: () => action(row, 'edit') }),
        h(ElButton, { icon: deleteIcon, onClick: () => action(row, 'delete') })
      ])
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
    field: 'staffNumber',
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
    filters: filterDepartment
  },
  {
    field: 'operator',
    label: t('reuse.operator'),
    minWidth: '200',
    formatter: (row: Recordable, __: TableColumn, _cellValue: boolean) => {
      return h('div', { style: 'display:flex;justify-content: center;' }, [
        h(ElButton, { icon: eyeIcon, onClick: () => actionDepartment(row, 'detail') }),
        h(ElButton, { icon: editIcon, onClick: () => actionDepartment(row, 'edit') }),
        h(ElButton, { icon: deleteIcon, onClick: () => deleteDepart(row) })
      ])
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
const eyeIcon = useIcon({ icon: 'emojione-monotone:eye-in-speech-bubble' })
const editIcon = useIcon({ icon: 'akar-icons:chat-edit' })
const deleteIcon = useIcon({ icon: 'uil:trash-alt' })

const collapse: Array<Collapse> = [
  {
    icon: minusIcon,
    name: 'branch',
    title: 'Chi nhánh',
    columns: columnsBranch,
    api: getDepartmentList,
    typeForm: 'table',
    pagination: false,
    selection: false,
    customOperator: 3,
    removeHeaderFilter: true,
    removeDrawer: true,
    buttonAdd: 'Thêm chi nhánh',
    typeButton: 'branch'
  },
  {
    icon: plusIcon,
    name: 'department',
    title: 'Phòng ban',
    columns: columnsDepartment,
    api: getDepartmentList,
    typeForm: 'table',
    pagination: false,
    selection: false,
    customOperator: 3,
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
const appStore = useAppStore()
const utility = appStore.getUtility
const { push } = useRouter()
const id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)
const tab = String(router.currentRoute.value.params.tab)
const action = (row: any, type: string) => {
  push({
    name: `human-resource-management.department-directory.${utility}`,
    params: {
      backRoute: 'human-resource-management.department-directory',
      tab: 'branch',
      id: row.id,
      type: type
    }
  })
}
// department
const actionDepartment = (row: any, type: string) => {
  push({
    name: `human-resource-management.department-directory.${utility}`,
    params: {
      backRoute: 'human-resource-management.department-directory',
      tab: 'department',
      id: row.id,
      type: type
    }
  })
}
const deleteDepart = (row: any) => {
  {
    ElMessageBox.confirm(`${t('reuse.deleteWarning')}`, 'xoa', {
      confirmButtonText: t('reuse.delete'),
      cancelButtonText: t('reuse.exit'),
      type: 'warning',
      confirmButtonClass: 'ElButton--danger'
    })
      .then(async () => {
        const res = await deleteDepartment({ Id: row.id })
        if (res) {
          ElNotification({
            message: t('reuse.deleteSuccess'),
            type: 'success'
          })
        } else {
          ElNotification({
            message: t('reuse.deleteFail'),
            type: 'warning'
          })
        }
      })
      .catch(() => {
        ElNotification({
          type: 'info',
          message: t('reuse.deleteCancel')
        })
      })
  }
}
</script>
<template>
  <CollapseBase :collapse="collapse" :type="type" :tabs="tab" :default="'branch'" :id="id" />
</template>
