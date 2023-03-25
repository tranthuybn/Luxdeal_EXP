<script setup lang="ts">
import { reactive, onBeforeMount, ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import TableOperatorAccountant from './TableOperatorAccountant.vue'
import { useRouter } from 'vue-router'
import { getBadgeAccountList } from '@/utils/get_filterList'
import { getAccountantList,getAccountantById, addNewAccountant, updateAccountant, deleteAccountant } from '@/api/Business'
import { useValidator } from '@/hooks/web/useValidator'
import { ElNotification } from 'element-plus'
import { FormDataPostAndEdit, FormData } from './types/BalanceSheet.d'

const allBadgeAccount = ref([])
const badgeAccount1List = ref()
const badgeAccount2List = ref()
const { t } = useI18n()
const router = useRouter()
const { push } = useRouter()
const id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)
const currentRoute = String(router.currentRoute.value.params.backRoute)
const title = router.currentRoute.value.meta.title
const setFormData = reactive({} as FormData)
const disabledCancelBtn = ref(false)
const currentType = ref('')


onBeforeMount(async() => {
  badgeAccount1List.value = await getBadgeAccountList(getAccountantList,'1', t('reuse.cantBadgeAccount1List'))
  badgeAccount2List.value = await getBadgeAccountList(getAccountantList, '2', t('reuse.cantBadgeAccount1List'))
  allBadgeAccount.value = allBadgeAccount.value.concat(badgeAccount1List.value, badgeAccount2List.value)
})

const { checkNumber, checkLength, checkDuplicate} = useValidator()
const rules = reactive({
  accountNumber1: [
    { validator: checkNumber }, 
    { validator: (...config) =>  checkLength(config, undefined, 5) },
    { validator: (...config) => {
        if(currentType.value === '1') {
          checkDuplicate(config, allBadgeAccount.value, t('reuse.accountanceDuplicated'), type, id)
        }
        else {
          config[2]()
        }
      } 
    }
  ],
  accountNumber2: [
    { validator: checkNumber }, 
    { validator: (...config) =>  checkLength(config, undefined, 5) },
    { validator: (...config) =>
      {
        if(currentType.value === '2') {
          checkDuplicate(config, allBadgeAccount.value, t('reuse.accountanceDuplicated'), type, id)
        }
        else {
          config[2]()
        }
      } 
    }
  ],
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
    value: false,
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

const changeValueClassify = (data) => {
  if(data === '2') {
    schema[3].component= 'Select'
    if(schema[3].componentProps) schema[3].componentProps.options= badgeAccount1List.value
    schema[4].hidden = false
    schema[5].hidden = true
    schema[6].hidden = false
    currentType.value = '2'
    return
  } 
  currentType.value = '1'
  schema[3].component= 'Input'
  schema[4].hidden = true
  schema[5].hidden = false
  schema[6].hidden = true
}


// Custom data before post or edit
const customData = (data) => {
  const customData = {} as FormDataPostAndEdit
  if(data.typeAccount == '1') {
    customData.AccountNumber = Number(data.accountNumber1)
    customData.ParentId = null
  } else {
    customData.AccountNumber = data.accountNumber2
    const id = badgeAccount1List.value.find(item => item.value == Number(data.accountNumber1)).id
    customData.ParentId = id
  }
  customData.AccountName = data.accountName
  customData.Status = data.status

  return customData
}

const postData = async (data) => {
  const typeBtn = data.typeBtn
  data = customData(data)
  await addNewAccountant(data)
  .then(() => {
      ElNotification({
        message: t('reuse.addSuccess'),
        type: 'success'
      })
      !typeBtn ? push({
        name: 'accountant.balanceSheet',
        params: { backRoute: 'accountant.balanceSheet' }
      }) : null
    })
  .catch(() =>
    ElNotification({
      message: t('reuse.addFail'),
      type: 'warning'
    })
  )
}

const editData = async (data) => {
  if(data.status) {
    schema[1].disabled = true
    schema[3].disabled = true
    schema[4].disabled = true
    schema[8].disabled = true
    disabledCancelBtn.value = true
  }
  data = customData(data)
  console.log('data', data)
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


// Assign value for form
const customizeData = async (data) => {
  setFormData.accountName = data.accountName
  setFormData.status = data.isActive
  setFormData.id = data.id

  if(!data.parentId) {
    setFormData.accountNumber1 = data.accountNumber
    setFormData.typeAccount = '1'
    changeValueClassify('1')
  } else {
    changeValueClassify('2')
    schema[4].hidden = false
    setFormData.accountNumber1 = badgeAccount1List.value.find(item => item.id == data.parentId).label
    setFormData.accountNumber2 = data.accountNumber
    setFormData.typeAccount = '2'
  }
  return 
}
</script>

<template>
  <TableOperatorAccountant 
    :schema="schema" 
    :nameBack="currentRoute" 
    :title="title"
    :rules="rules"
    :type="type"
    :id="id"
    :apiId="getAccountantById"
    :hasImage="false"
    @post-data="postData"
    @edit-data="editData"
    @customize-form-data="customizeData"
    :formDataCustomize="setFormData"
    :delApi="deleteAccountant"
    :disabledCancelBtn="disabledCancelBtn"
    :customAddBtn="2"
  />
</template>
