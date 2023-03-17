<script setup lang="ts">
import { reactive, onBeforeMount, ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { TableOperator } from '../Components/TableBase'
import { useRouter } from 'vue-router'
import { getBadgeAccount1List } from '@/utils/get_filterList'
import { getBalanceList } from '@/api/Business'
import { useValidator } from '@/hooks/web/useValidator'

const { t } = useI18n()
const router = useRouter()

const id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)
console.log(type)
const { checkNumber, checkLength5, checkLength255 } = useValidator()
const rules = reactive({
  accountNumber: [
    { validator: checkNumber }, 
    { validator: checkLength5 }
  ],
  accountName: [
  { validator: checkLength255 }
  ]
})


const schema = reactive<FormSchema[]>([
  {
    field: 'typeAccount',
    label: t('reuse.typeAccount'),
    component: 'Divider'
  },
  {
    field: 'chooseRankAccount',
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
    component: 'Divider'
  },
  {
    field: 'accountNumber',
    label: t('reuse.badgeAccount1'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'accountNumber',
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
    field: 'statusAndFunction',
    label: t('reuse.statusAndFunction'),
    component: 'Divider'
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
          value: '1'
        }
      ]
    }
  }
])
const badgeAccount1List = ref()
onBeforeMount(async() => {
  badgeAccount1List.value = await getBadgeAccount1List(getBalanceList, t('reuse.cantBadgeAccount1List'))
})
const changeValueClassify = (data) => {
  if(data === '2') {
    schema[3].component= 'Select'
    if(schema[3].componentProps) schema[3].componentProps.options= badgeAccount1List.value
    schema[4].hidden = false
    return
  } 
  schema[3].component= 'Input'
  schema[4].hidden = true
}
const currentRoute = String(router.currentRoute.value.params.backRoute)
const title = router.currentRoute.value.meta.title
const postData = (data) => {
  console.log(data)
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
    @post-data="postData"
/></template>
