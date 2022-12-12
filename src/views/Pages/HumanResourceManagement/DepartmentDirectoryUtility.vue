<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { TableOperator } from '../Components/TableBase'
import { useRouter } from 'vue-router'

const { t } = useI18n()

const schema = reactive<FormSchema[]>([
  {
    field: 'field1',
    label: t('reuse.generalInformation'),
    component: 'Divider'
  },
  {
    field: 'Machinhanh',
    label: t('reuse.branchCode'),
    component: 'Input',
    colProps: {
      span: 13
    }
  },
  {
    field: 'TenChinhanh',
    label: t('reuse.branchName'),
    component: 'Input',
    colProps: {
      span: 13
    }
  },
  {
    field: 'statusAnd',
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
    field: 'field2',
    label: t('reuse.branchCode'),
    component: 'Input',
    colProps: {
      span: 13
    }
  },
  {
    field: 'field3',
    label: t('reuse.branchName'),
    component: 'Input',
    colProps: {
      span: 13
    }
  },
  {
    field: 'field41',
    label: t('reuse.statusAndFunction'),
    component: 'Divider'
  },
  {
    field: 'field42',
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
    field: 'field2',
    label: t('reuse.branchCode'),
    component: 'Input',
    colProps: {
      span: 13
    }
  },
  {
    field: 'field3',
    label: t('reuse.branchName'),
    component: 'Input',
    colProps: {
      span: 13
    }
  },
  {
    field: 'field41',
    label: t('reuse.statusAndFunction'),
    component: 'Divider'
  },
  {
    field: 'field42',
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
    field: 'field2',
    label: t('reuse.branchCode'),
    component: 'Input',
    colProps: {
      span: 13
    }
  },
  {
    field: 'field3',
    label: t('reuse.branchName'),
    component: 'Input',
    colProps: {
      span: 13
    }
  },
  {
    field: 'field41',
    label: t('reuse.statusAndFunction'),
    component: 'Divider'
  },
  {
    field: 'field42',
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
const router = useRouter()
const currentRoute = String(router.currentRoute.value.params.backRoute)
const title = router.currentRoute.value.meta.title
const tab = router.currentRoute.value.params.tab
const id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)

// custom api form post
type FormDataPost = {
  MachiNhanh?: string
  NameChiNhanh?: string
  status?: string
}
const customPostDataBranch = (data) => {
  const customData = {} as FormDataPost

  customData.MachiNhanh = data.Machinhanh
  customData.NameChiNhanh = data.TenChinhanh
  customData.status = data.status

  return customData
}

// custom api form edit
type FormDataEdit = {
  MachiNhanh?: string
  NameChiNhanh?: string
  status?: string
}
const customEditDataBranch = (data) => {
  const getData = {} as FormDataEdit

  getData.MachiNhanh = data.Machinhanh
  getData.NameChiNhanh = data.TenChinhanh
  getData.status = data.status

  return getData
}
// const { push } = useRouter()
const postData = (data) => {
  data = customPostDataBranch(data)
  console.log('data post', data)

  // await API_POST_BRANCH(FORM_IMAGES(data))
  // .then(() => {
  //   ElNotification({
  //     message: t('reuse.addSuccess'),
  //     type: 'success'
  //   }),
  //     push({
  //       name: 'human-resource-management.department-directory'
  //     })
  // })
  // .catch(() =>
  //   ElNotification({
  //     message: t('reuse.addFail'),
  //     type: 'warning'
  //   })
  // )
}

const editData = (data) => {
  data = customEditDataBranch(data)
}
//fill dữ liệu từ data ra...
type SetFormData = {
  MachiNhanh: string
}
const emptyFormData = {} as SetFormData
const setFormData = reactive(emptyFormData)
const customizeData = (data) => {
  setFormData.MachiNhanh = data.aa
}
</script>

<template>
  <TableOperator
    v-if="tab == 'branch'"
    :schema="schema"
    :nameBack="currentRoute"
    :id="id"
    :title="title"
    @customize-form-data="customizeData"
    @edit-data="editData"
    :type="type"
    :tab="tab"
    @post-data="postData"
  />
  <TableOperator
    v-if="tab == 'department'"
    :schema="schema2"
    :nameBack="currentRoute"
    :title="title"
  />
  <TableOperator v-if="tab == 'rank'" :schema="schema3" :nameBack="currentRoute" :title="title" />
  <TableOperator
    v-if="tab == 'tyOfPersonel'"
    :schema="schema4"
    :nameBack="currentRoute"
    :title="title"
  />
</template>
