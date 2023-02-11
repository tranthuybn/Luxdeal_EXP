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
import { useValidator } from '@/hooks/web/useValidator'
import { API_URL } from '@/utils/API_URL'
const { t } = useI18n()
const router = useRouter()
const currentRoute = String(router.currentRoute.value.params.backRoute)
// const title = router.currentRoute.value.meta.title\
const id = Number(router.currentRoute.value.params.id)
let disableCheckBox = ref(false)

const tab = router.currentRoute.value.params.tab
const type = String(router.currentRoute.value.params.type)
const { required } = useValidator()

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

const rules = reactive({
  name: [
    required()
  ],
  code: [
    required()
  ]
})

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
const checkTrungCode = ref(false)
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

  if (data.isActive == true) {
    formDataCustomize.value['status'] = 1
  }else{
    formDataCustomize.value['status'] = 2
  }
  formDataCustomize.value.imageurl = `${API_URL}${data.path}`
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
  getData.Image = data.Image
  return getData
}

const postDataDepartment = async (data) => {
    if (data.status == 1) {
    data.IsActive = true
  } else if (data.status == 2) {
    data.IsActive = false
    data.isDelete = false
  }
  data.CreateAt = moment().format('YYYY / MM / DD')
  data.Image = data.Image
  
  await addNewDepartment(data)
    .then(() => 
      ElNotification({
        message: t('reuse.addSuccess'),
        type: 'success'
      })        
    )
    .catch(() =>
      ElNotification({
        message: t('reuse.addFail') + ', ' + t('reuse.codeExist'),
        type: 'warning'
      })
    )
    if (data.backRouter == true && checkTrungCode.value === true) {
    push({
          name: 'human-resource-management.department-directory',
          params: { backRoute: 'human-resource-management.department-directory' }
        })
  }
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
        message: t('reuse.updateFail') + ', ' + t('reuse.codeExist'),
        type: 'warning'
      })
    )
}

// BRANCH
const postDataBranch = async (data) => {
  if (data.status == 1) {
    data.IsActive = true
  } else if (data.status == 2) {
    data.IsActive = false
    data.isDelete = false
  }
  data.CreateAt = moment().format('YYYY / MM / DD')
  data.Image = data.Image
  
  await addNewBranch(data)
    .then(() => {
      ElNotification({
        message: t('reuse.addSuccess'),
        type: 'success'
      }),
      checkTrungCode.value = true        
})
    .catch(() =>
      ElNotification({
        message: t('reuse.addFail') + ', ' + t('reuse.codeExist'),
        type: 'warning'
      })
    )
  if (data.backRouter == true && checkTrungCode.value === true) {
    push({
          name: 'human-resource-management.department-directory',
          params: { backRoute: 'human-resource-management.department-directory' }
        })
  }
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
  getData.Image = data.Image
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
        message: t('reuse.updateFail')+ ', ' + t('reuse.codeExist'),
        type: 'warning'
      })
    )
}

// POSITION
const postDataPositon = async (data) => {
    if (data.status == 1) {
    data.IsActive = true
  } else if (data.status == 2) {
    data.IsActive = false
    data.isDelete = false
  }
  data.CreateAt = moment().format('YYYY / MM / DD')
  data.Image = data.Image
  
  await addNewPosition(data)
    .then(() => 
      ElNotification({
        message: t('reuse.addSuccess'),
        type: 'success'
      })        
    )
    .catch(() =>
      ElNotification({
        message: t('reuse.addFail') + ', ' + t('reuse.codeExist'),
        type: 'warning'
      })
    )
    if (data.backRouter == true && checkTrungCode.value === true) {
    push({
          name: 'human-resource-management.department-directory',
          params: { backRoute: 'human-resource-management.department-directory' }
        })
  }
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
  getData.Image = data.Image
  getData.Code = data.code
  getData.Name = data.name
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
        message: t('reuse.updateFail')+ ', ' + t('reuse.codeExist'),
        type: 'warning'
      })
    )
}

// TYPE OF STAFF
const postDataStaff = async (data) => {
    if (data.status == 1) {
    data.IsActive = true
  } else if (data.status == 2) {
    data.IsActive = false
    data.isDelete = false
  }
  data.CreateAt = moment().format('YYYY / MM / DD')
  data.Image = data.Image
  
  await addNewTypeOfStaff(data)
    .then(() => 
      ElNotification({
        message: t('reuse.addSuccess'),
        type: 'success'
      })        
    )
    .catch(() =>
      ElNotification({
        message: t('reuse.addFail') + ', ' + t('reuse.codeExist'),
        type: 'warning'
      })
    )
    if (data.backRouter == true && checkTrungCode.value === true) {
    push({
          name: 'human-resource-management.department-directory',
          params: { backRoute: 'human-resource-management.department-directory' }
        })
  }
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
  getData.Image = data.Image
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
        message: t('reuse.updateFail')+ ', ' + t('reuse.codeExist'),
        type: 'warning'
      })
    )
}
</script>

<template>
  <TableOperator
    v-if="tab == 'Branch'"
    :schema="schema"
    :nameBack="currentRoute"
    :title="t('reuse.addNewBranch')"
    :apiId="getBranchByID"
    :id="id"
    :tab="tab"
    :type="type"
    @customize-form-data="customizeData"
    :multipleImages="false"
    :rules="rules"
    @post-data="postDataBranch"
    @edit-data="editDataBranch"
    :delApi="deleteBranch"
    :formDataCustomize="formDataCustomize"
  />
  <TableOperator
    v-if="tab == 'Department'"
    :schema="schema2"
    :id="id"
    :tab="tab"
    :type="type"
    :nameBack="currentRoute"
    :title="t('reuse.addNewDepartment')"
    :rules="rules"
    @post-data="postDataDepartment"
    @edit-data="editDataDepartment"
    @customize-form-data="customizeData"
    :multipleImages="false"
    :apiId="getDepartmentByID"
    :delApi="deleteDepartment"
    :formDataCustomize="formDataCustomize"
  />
  <TableOperator
    v-if="tab == 'Position'"
    :schema="schema3"
    :type="type"
    :id="id"
    :tab="tab"
    :nameBack="currentRoute"
    :title="t('reuse.addNewRank')"
    :rules="rules"
    @post-data="postDataPositon"
    @edit-data="editDataPosition"
    @customize-form-data="customizeData"
    :apiId="getPositionByID"
    :multipleImages="false"
    :delApi="deletePosition"
    :formDataCustomize="formDataCustomize"
  />
  <TableOperator
    v-if="tab == 'TypeOfStaff'"
    :schema="schema4"
    :type="type"
    :id="id"
    :tab="tab"
    :nameBack="currentRoute"
    :title="t('reuse.addNewTypePersonnel')"
    :rules="rules"
    @post-data="postDataStaff"
    @edit-data="editDataStaff"
    @customize-form-data="customizeData"
    :multipleImages="false"
    :apiId="getTypeOfStaffByID"
    :delApi="deleteTypeOfStaff"
    :formDataCustomize="formDataCustomize"
  />
</template>
