<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { TableOperator } from '../Components/TableBase'
import { useRouter } from 'vue-router'
import {
  addNewDepartment,
  getDepartmentByID,
  updateDepartment,
  deleteDepartment,
  deletePosition,
  addNewBranch,
  updateBranch,
  deleteBranch,
  addNewPosition,
  deleteTypeOfStaff,
  updatePosition,
  updateTypeOfStaff,getBranchByID,getPositionByID,getTypeOfStaffByID,
  addNewTypeOfStaff
} from '@/api/HumanResourceManagement'
// import moment from 'moment'
import { ElNotification } from 'element-plus'
import moment from 'moment'
import { API_URL } from '@/utils/API_URL'
const { t } = useI18n()
const router = useRouter()
const currentRoute = String(router.currentRoute.value.params.backRoute)
// const title = router.currentRoute.value.meta.title\
const id = Number(router.currentRoute.value.params.id)
let disableCheckBox = ref(false)

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
    component: 'Radio',
    colProps: {
      span: 12
    },
    componentProps: {
      disabled: disableCheckBox,
      options: [
        {
          label: t('reuse.active'),
          value: 1
        }
      ]
    }
  },
  {
    field: 'status',
    component: 'Radio',
    colProps: {
      span: 12
    },
    componentProps: {
      disabled: disableCheckBox,
      options: [
        {
          label: t('reuse.stopShowAppWeb'),
          value: 2
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
    component: 'Radio',
    colProps: {
      span: 12
    },
    componentProps: {
      disabled: disableCheckBox,
      options: [
        {
          label: t('reuse.active'),
          value: 1
        }
      ]
    }
  },
  {
    field: 'status',
    component: 'Radio',
    colProps: {
      span: 12
    },
    componentProps: {
      disabled: disableCheckBox,
      options: [
        {
          label: t('reuse.stopShowAppWeb'),
          value: 2
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
    field: 'code',
    label: t('formDemo.rankCode'),
    component: 'Input',
    colProps: {
      span: 13
    }
  },
  {
    field: 'name',
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
    component: 'Radio',
    colProps: {
      span: 12
    },
    componentProps: {
      disabled: disableCheckBox,
      options: [
        {
          label: t('reuse.active'),
          value: 1
        }
      ]
    }
  },
  {
    field: 'status',
    component: 'Radio',
    colProps: {
      span: 12
    },
    componentProps: {
      disabled: disableCheckBox,
      options: [
        {
          label: t('reuse.stopShowAppWeb'),
          value: 2
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
    field: 'code',
    label: t('formDemo.typeCode'),
    component: 'Input',
    colProps: {
      span: 13
    }
  },
  {
    field: 'name',
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
    component: 'Radio',
    colProps: {
      span: 12
    },
    componentProps: {
      disabled: disableCheckBox,
      options: [
        {
          label: t('reuse.active'),
          value: 1
        }
      ]
    }
  },
  {
    field: 'status',
    component: 'Radio',
    colProps: {
      span: 12
    },
    componentProps: {
      disabled: disableCheckBox,
      options: [
        {
          label: t('reuse.stopShowAppWeb'),
          value: 2
        }
      ]
    }
  }
])

watch(
  () => type,
  () => {
    if (type === 'add') {
      disableCheckBox.value = true
      schema[4].value = 1
      schema2[4].value = 1
      schema3[4].value = 1
      schema4[4].value = 1
    }
  },
  {
    deep: true,
    immediate: true
  }
)
const { push } = useRouter()
// custom api form post
type FormDataPost = {
  Name: string
  Code: string
  IsActive?: boolean
  isDelete: boolean
  CreateAt?: any
  CreateBy?: string
  Image?: any
  ImageID?: any
}
// custom api form edit
type FormDataEdit = {
  Id: number
  Code?: string
  Name: string
  UpdateAt: any
  IsActive?: boolean
  isDelete: boolean
  UpdateBy: string
  ImageID?: any
  Image?: any
  imageurl?: string
}

//Derpartment
const formDataCustomize = ref()

const customizeData = async (data) => { 
  formDataCustomize.value = data
  formDataCustomize.value.Image = data.path
  formDataCustomize.value.imageurl = `${API_URL}${data.path}`

  if (data.isActive == true) {
    formDataCustomize.value['status'] = 1
  }else{
    formDataCustomize.value['status'] = 2
  }

}

const customPostDataDerpartment = (data) => {
  const customData = {} as FormDataPost
  
  customData.Code = data.code
  customData.Name = data.name
  if (data.status == 1) {
    customData.IsActive = true
  } else if (data.status == 2) {
    customData.IsActive = false
    customData.isDelete = false
  }
  customData.CreateAt = moment().format('YYYY / MM / DD')

  return customData
}

const customEditDataDepartment = (data) => {
  const getData = {} as FormDataEdit
  getData.Id = id
  getData.Code = data.code
  getData.Name = data.name
  if (data.status == 1) {
    getData.IsActive = true
  } else if (data.status == 2) {
    getData.IsActive = false
    getData.isDelete = false
  }
  return getData
}

const postDataDepartment = async (data) => {
  data = customPostDataDerpartment(data)
  await addNewDepartment(data)
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
const editDataDepartment = async (data) => {
  data = customEditDataDepartment(data)

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

// BRANCH
const customPostDataBranch = (data) => {
  const customData = {} as FormDataPost

  customData.Code = data.code
  customData.Name = data.name
  if (data.status == 1) {
    customData.IsActive = true
  } else if (data.status == 2) {
    customData.IsActive = false
    customData.isDelete = false
  }
  customData.CreateAt = moment().format('YYYY / MM / DD')

  return customData
}

const postDataBranch = async (data) => {
  data = customPostDataBranch(data)
  await addNewBranch(data)
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
const customEditBranch = (data) => {
  const getData = {} as FormDataEdit
  getData.Id = id
  getData.Code = data.code
  if (data.status == 1) {
    getData.IsActive = true
  } else if (data.status == 2) {
    getData.IsActive = false
    getData.isDelete = false
  }
  getData.Name = data.name
  return getData
}
const editDataBranch = async (data) => {
  data = customEditBranch(data)

  await updateBranch(data)
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

// POSITION
const customPostDataPosition = (data) => {
  const customData = {} as FormDataPost

  customData.Code = data.code
  customData.Name = data.name
  if (data.status == 1) {
    customData.IsActive = true
  } else if (data.status == 2) {
    customData.IsActive = false
    customData.isDelete = false
  }
  customData.CreateAt = moment().format('YYYY / MM / DD')
  customData.Image = data.Image

  return customData
}

const postDataPositon = async (data) => {
  data = customPostDataPosition(data)
  await addNewPosition(data)
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
const customEditPosition = (data) => {
  const getData = {} as FormDataEdit
  getData.Id = id
  if (data.status == 1) {
    getData.IsActive = true
  } else if (data.status == 2) {
    getData.IsActive = false
    getData.isDelete = false
  }
  getData.Code = data.code
  getData.Name = data.name
  console.log('data2', getData)
  return getData
}
const editDataPosition = async (data) => {
  data = customEditPosition(data)

  await updatePosition(data)
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

// TYPE OF STAFF
const customPostDataStaff = (data) => {
  const customData = {} as FormDataPost

  customData.Code = data.code
  customData.Name = data.name
  if (data.status == 1) {
    customData.IsActive = true
  } else if (data.status == 2) {
    customData.IsActive = false
    customData.isDelete = false
  }
  customData.CreateAt = moment().format('YYYY / MM / DD')

  return customData
}

const postDataStaff = async (data) => {
  data = customPostDataStaff(data)
  await addNewTypeOfStaff(data)
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
const customEditStaff = (data) => {
  const getData = {} as FormDataEdit
  getData.Id = id
  getData.Code = data.code
  if (data.status == 1) {
    getData.IsActive = true
  } else if (data.status == 2) {
    getData.IsActive = false
    getData.isDelete = false
  }
  getData.Name = data.name
  return getData
}
const editDataStaff = async (data) => {
  data = customEditStaff(data)

  await updateTypeOfStaff(data)
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
</script>

<template>
  <TableOperator
    v-if="tab == 'branch'"
    :schema="schema"
    :nameBack="currentRoute"
    :title="t('reuse.addNewBranch')"
    :apiId="getBranchByID"
    :id="id"
    :tab="tab"
    :type="type"
    @customize-form-data="customizeData"
    :multipleImages="false"
    @post-data="postDataBranch"
    @edit-data="editDataBranch"
    :delApi="deleteBranch"
  />
  <TableOperator
    v-if="tab == 'department'"
    :schema="schema2"
    :id="id"
    :tab="tab"
    :type="type"
    :nameBack="currentRoute"
    :title="t('reuse.addNewDepartment')"
    @post-data="postDataDepartment"
    @edit-data="editDataDepartment"
    @customize-form-data="customizeData"
    :multipleImages="false"
    :apiId="getDepartmentByID"
    :delApi="deleteDepartment"
  />
  <TableOperator
    v-if="tab == 'rank'"
    :schema="schema3"
    :type="type"
    :id="id"
    :tab="tab"
    :nameBack="currentRoute"
    :title="t('reuse.addNewRank')"
    @post-data="postDataPositon"
    @edit-data="editDataPosition"
    @customize-form-data="customizeData"
    :apiId="getPositionByID"
    :multipleImages="false"
    :delApi="deletePosition"
  />
  <TableOperator
    v-if="tab == 'tyOfPersonel'"
    :schema="schema4"
    :type="type"
    :id="id"
    :tab="tab"
    :nameBack="currentRoute"
    :title="t('reuse.addNewTypePersonnel')"
    @post-data="postDataStaff"
    @edit-data="editDataStaff"
    @customize-form-data="customizeData"
    :multipleImages="false"
    :apiId="getTypeOfStaffByID"
    :delApi="deleteTypeOfStaff"
  />
</template>
