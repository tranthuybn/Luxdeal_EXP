<script setup lang="ts">
import { onBeforeMount, reactive, ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { TableOperator } from '../Components/TableBase'
import { useRouter } from 'vue-router'
import {
  addNewDepartment,
  getBranchList,
  updateDepartment,
  deleteDepartment,
  getDepartmentList
} from '@/api/HumanResourceManagement'
// import moment from 'moment'
import { ElNotification } from 'element-plus'
const { t } = useI18n()
const router = useRouter()
const currentRoute = String(router.currentRoute.value.params.backRoute)
// const title = router.currentRoute.value.meta.title\
const id = Number(router.currentRoute.value.params.id)

const tab = router.currentRoute.value.params.tab
const type = String(router.currentRoute.value.params.type)
const schema = reactive<FormSchema[]>([
  {
    field: 'field1',
    label: t('reuse.generalInformation'),
    component: 'Divider'
  },
  {
    field: 'code',
    label: t('reuse.branchCode'),
    component: 'Input',
    colProps: {
      span: 13
    }
  },
  {
    field: 'name',
    label: t('reuse.branchName'),
    component: 'Input',
    colProps: {
      span: 13
    }
  },
  {
    field: 'statusAndFunction',
    label: t('reuse.statusAndFunction'),
    component: 'Divider'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    component: 'Checkbox',
    value: [],
    colProps: {
      span: 24
    },
    componentProps: {
      options: [
        {
          label: t('reuse.active'),
          value: '1'
        },
        {
          label: t('reuse.stopActive'),
          value: '2'
        }
      ]
    }
  }
])
const schema2 = reactive<FormSchema[]>([
  {
    field: 'field1',
    label: t('reuse.generalInformation'),
    component: 'Divider'
  },
  {
    field: 'code',
    label: t('formDemo.departmentCode'),
    component: 'Input',
    colProps: {
      span: 13
    }
  },
  {
    field: 'name',
    label: t('reuse.DepartmentName'),
    component: 'Input',
    colProps: {
      span: 13
    }
  },
  {
    field: 'statusAndFunction',
    label: t('reuse.statusAndFunction'),
    component: 'Divider'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    component: 'Checkbox',
    value: [],
    colProps: {
      span: 24
    },
    componentProps: {
      options: [
        {
          label: t('reuse.active'),
          value: '1'
        },
        {
          label: t('reuse.stopActive'),
          value: '2'
        }
      ]
    }
  }
])
const schema3 = reactive<FormSchema[]>([
  {
    field: 'field1',
    label: t('reuse.generalInformation'),
    component: 'Divider'
  },
  {
    field: 'rankCode',
    label: t('formDemo.rankCode'),
    component: 'Input',
    colProps: {
      span: 13
    }
  },
  {
    field: 'rankName',
    label: t('formDemo.rankName'),
    component: 'Input',
    colProps: {
      span: 13
    }
  },
  {
    field: 'statusAndFunction',
    label: t('reuse.statusAndFunction'),
    component: 'Divider'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    component: 'Checkbox',
    value: [],
    colProps: {
      span: 24
    },
    componentProps: {
      options: [
        {
          label: t('reuse.active'),
          value: '1'
        },
        {
          label: t('reuse.stopActive'),
          value: '2'
        }
      ]
    }
  }
])

const schema4 = reactive<FormSchema[]>([
  {
    field: 'field1',
    label: t('reuse.generalInformation'),
    component: 'Divider'
  },
  {
    field: 'typeCode',
    label: t('formDemo.typeCode'),
    component: 'Input',
    colProps: {
      span: 13
    }
  },
  {
    field: 'typeName',
    label: t('formDemo.typeName'),
    component: 'Input',
    colProps: {
      span: 13
    }
  },
  {
    field: 'statusAndFunction',
    label: t('reuse.statusAndFunction'),
    component: 'Divider'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    component: 'Checkbox',
    value: [],
    colProps: {
      span: 24
    },
    componentProps: {
      options: [
        {
          label: t('reuse.active'),
          value: '1'
        },
        {
          label: t('reuse.stopActive'),
          value: '2'
        }
      ]
    }
  }
])
const { push } = useRouter()
const postData = async (data) => {
  console.log('data: ', data)
  const payload = {
    Code: data.branchCode,
    Name: data.branchName,
    isActive: true,
    isDelete: false,
    CreateBy: 'string'
  }

  await addNewDepartment(payload)
    .then(() => {
      ElNotification({
        message: t('reuse.addSuccess'),
        type: 'success'
      }),
        push({
          name: 'human-resource-management.department-directory',
          params: { backRoute: 'human-resource-management.department-directory' }
        })
    })
    .catch(() =>
      ElNotification({
        message: t('reuse.addFail'),
        type: 'warning'
      })
    )
}
// custom api form post
// type FormDataPost = {
//   Name: string
//   Code: string
//   isActive: boolean
//   isDelete: boolean
//   CreateAt: any
//   CreateBy: string
// }
// const customPostDataDerpartment = (data) => {
//   const customData = {} as FormDataPost

//   customData.Code = data.departmentCode
//   customData.Name = data.DepartmentName
//   customData.isActive = true
//   customData.isDelete = false
//   customData.CreateAt = moment().format('YYYY / MM / DD')

//   return customData
// }
// chua co api get theo id
// const customizeData = (data) => {
//   console.log('data', data)
// }

// custom api form edit
type FormDataEdit = {
  Id: number
  Code?: string
  Name: string
  UpdateAt: any
  UpdateBy: string
}
const customEditDataDepartment = (data) => {
  const getData = {} as FormDataEdit
  getData.Id = id
  getData.Code = data.departmentCode
  getData.Name = data.DepartmentName
  console.log('data', data)
  return getData
}

// const postDataDepartment = async (data) => {
//   data = customPostDataDerpartment(data)

//   console.log('data', data)

//   await addNewDepartment(data)
//     .then(() => {
//       ElNotification({
//         message: t('reuse.addSuccess'),
//         type: 'success'
//       }),
//         push({
//           name: 'human-resource-management.department-directory',
//           params: { backRoute: 'human-resource-management.department-directory' }
//         })
//     })
//     .catch(() =>
//       ElNotification({
//         message: t('reuse.addFail'),
//         type: 'warning'
//       })
//     )
// }
const editDataDepartment = async (data) => {
  data = customEditDataDepartment(data)
  console.log('data', data)

  await updateDepartment(data)
    .then(() => {
      ElNotification({
        message: t('reuse.updateSuccess'),
        type: 'success'
      }),
        push({
          name: 'human-resource-management.department-directory',
          params: { backRoute: 'human-resource-management.department-directory' }
        })
    })
    .catch(() =>
      ElNotification({
        message: t('reuse.updateFail'),
        type: 'warning'
      })
    )
}

const putData = async (data) => {
  console.log('putData: ', data)
  const payload = {
    Id: data.Id,
    Code: data.code,
    Name: data.name
  }

  await updateDepartment(payload)
    .then(() => {
      ElNotification({
        message: t('reuse.updateSuccess'),
        type: 'success'
      }),
        push({
          name: 'human-resource-management.department-directory',
          params: { backRoute: 'human-resource-management.department-directory' }
        })
    })
    .catch(() =>
      ElNotification({
        message: t('reuse.updateFail'),
        type: 'warning'
      })
    )
}

const formDataCustomize = ref()
const customizeData = async (formData) => {
  formDataCustomize.value = formData
  console.log('formDataCustomize: ', formDataCustomize.value)
}
const editData = async () => {
  if (type != 'add') {
    const res = await getDepartmentList()
    const dataId = res.data.find((val) => val.id == id)
    customizeData(dataId)
    console.log('schema[0]: ', schema)
  }
}

onBeforeMount(() => {
  editData()
})
</script>

<template>
  <TableOperator
    v-if="tab == 'branch'"
    :schema="schema"
    :nameBack="currentRoute"
    :title="t('reuse.addNewBranch')"
    :apiId="getBranchList"
    :id="id"
    :tab="tab"
    :type="type"
    @post-data="postData"
    @edit-data="putData"
    :formDataCustomize="formDataCustomize"
  />
  <TableOperator
    v-if="tab == 'department'"
    :schema="schema2"
    :type="type"
    :nameBack="currentRoute"
    :title="t('reuse.addNewDepartment')"
    @post-data="postData"
    @edit-data="editDataDepartment"
    :delApi="deleteDepartment"
  />
  <TableOperator
    v-if="tab == 'rank'"
    :schema="schema3"
    :type="type"
    :nameBack="currentRoute"
    :title="t('reuse.addNewRank')"
    @post-data="postData"
  />
  <TableOperator
    v-if="tab == 'tyOfPersonel'"
    :schema="schema4"
    :type="type"
    :nameBack="currentRoute"
    :title="t('reuse.addNewTypePersonnel')"
    @post-data="postData"
  />
</template>
