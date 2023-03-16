<script setup lang="ts">
import { reactive, onBeforeMount, ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { TableOperator } from '../Components/TableBase'
import { useRouter } from 'vue-router'
import { getBadgeAccount1List } from '@/utils/get_filterList'
import { getAccountantList,getAccountantById, addNewAccountant, updateAccountant, deleteAccountant } from '@/api/Business'
import { useValidator } from '@/hooks/web/useValidator'
import { ElNotification } from 'element-plus'

const { t } = useI18n()
const router = useRouter()
const { push } = useRouter()

const id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)
const { checkNumber, checkLength5, checkLength255 } = useValidator()
const rules = reactive({
  accountNumber1: [
    { validator: checkNumber }, 
    { validator: checkLength5 }
  ],
  accountNumber2: [
    { validator: checkNumber }, 
    { validator: checkLength5 }
  ],
  accountName: [
  { validator: checkLength255 }
  ]
})

const schema = reactive<FormSchema[]>([
  {
    field: 'typeAccountLabel',
    label: t('reuse.typeAccount'),
    component: 'Divider',
    colProps: {
      span: 24
    }
  },
  {
    field: 'typeAccount',
    label: t('reuse.chooseRankAccount'),
    component: 'Select',
    componentProps: {
      onChange: (data) => {
        changeValueClassify(data)
      },
      style: 'width: 100%',
      options: [
        {
          label: t('reuse.rank1Account'),
          value: '1'
        },
        {
          label: t('reuse.rank2Account'),
          value: '2'
        }
      ]
    },
      colProps: {
      span: 24
    }
  },
  {
    field: 'generalInformation',
    label: t('reuse.generalInformation'),
    component: 'Divider',
    colProps: {
      span: 24
    }
  },
  {
    field: 'accountNumber1',
    label: t('reuse.badgeAccount1'),
    component: 'Input',
    componentProps: {
      style: 'width: 100%',
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'accountNumber2',
    label: t('reuse.badgeAccount2'),
    component: 'Input',
    hidden: true,
    colProps: {
      span: 24
    }
  },
  {
    field: 'accountName',
    label: t('reuse.nameAccount1'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'accountName',
    label: t('reuse.nameAccount2'),
    component: 'Input',
    hidden: true,
    colProps: {
      span: 24
    }
  },
  {
    field: 'statusAndFunction',
    label: t('reuse.statusAndFunction'),
    component: 'Divider',
    colProps: {
      span: 12
    }
  },
  {
    field: 'status',
    label: t('reuse.status'),
    component: 'Radio',
    value: [],
    colProps: {
      span: 24
    },
    componentProps: {
      options: [
        {
          label: t('reuse.active'),
          value: true
        }
      ]
    }
  }
  
])
const badgeAccount1List = ref()
onBeforeMount(async() => {
  badgeAccount1List.value = await getBadgeAccount1List(getAccountantList, t('reuse.cantBadgeAccount1List'))
})
const changeValueClassify = (data) => {
  if(data === '2') {
    schema[3].component= 'Select'
    if(schema[3].componentProps) schema[3].componentProps.options= badgeAccount1List.value
    schema[4].hidden = false
    schema[5].hidden = true
    schema[6].hidden = false
    return
  } 
  schema[3].component= 'Input'
  schema[4].hidden = true
  schema[5].hidden = false
  schema[6].hidden = true
}
const currentRoute = String(router.currentRoute.value.params.backRoute)
const title = router.currentRoute.value.meta.title

interface FormDataPostAndEdit {
  ParentId: number | null
  AccountNumber: number
  AccountNumber2? : number
  AccountName: string
  Status: 0 | 1
  Id?: number
}

// Custom data before post or edit
const customData = (data) => {
  const customData = {} as FormDataPostAndEdit
  if(data.typeAccount == '1') {
    customData.AccountNumber = Number(data.accountNumber1)
    customData.ParentId = null
  } else {
    customData.AccountNumber = data.accountNumber2
    customData.ParentId = data.accountNumber1
  }
  customData.AccountName = data.accountName
  customData.Status = data.status
  customData.Id = Number(data.id)
  return customData
}

const postData = async (data) => {
  data = customData(data)
  await addNewAccountant(data)
  .then(() => {
      ElNotification({
        message: t('reuse.addSuccess'),
        type: 'success'
      }),
        push({
          name: 'accountant.balanceSheet',
          params: { backRoute: 'accountant.balanceSheet' }
        })
    })
  .catch(() =>
    ElNotification({
      message: t('reuse.addFail'),
      type: 'warning'
    })
  )
}
const disabledCancelBtn = ref(false)
const editData = async (data) => {
  if(data.status) {
    schema[1].disabled = true
    schema[3].disabled = true
    schema[4].disabled = true
    schema[8].disabled = true
    disabledCancelBtn.value = true
  }
  data = customData(data)
  await updateAccountant(data)
  .then(() => {
    ElNotification({
      message: t('reuse.updateSuccess'),
      type: 'success'
    }),
      push({
        name: 'accountant.balanceSheet',
        params: { backRoute: 'accountant.balanceSheet' }
      })
  })
  .catch(() =>
    ElNotification({
      message: t('reuse.updateFail'),
      type: 'warning'
    })
  )
}

interface FormData {
  typeAccount: null | 1
  accountNumber2?: number
  accountNumber1: number
  accountName: string
  status: boolean
}

// Đợi api trả về từ back end
const setFormData = reactive({} as FormData)
const customizeData = async (data) => {
  setFormData.typeAccount = data.typeAccount
}
</script>

<template>
  <TableOperator 
    :schema="schema" 
    :nameBack="currentRoute" 
    :title="title"
    :rules="rules"
    :type="type"
    :id="id"
    :apiId="getAccountantById"
    :hasImage="false"
    :showSaveAndAddBtnOnTypeEdit="true"
    @post-data="postData"
    @edit-data="editData"
    @customize-form-data="customizeData"
    :formDataCustomize="setFormData"
    :delApi="deleteAccountant"
    :disabledCancelBtn="disabledCancelBtn"
/></template>
