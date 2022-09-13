<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { TableOperator } from '../../Components/TableBase'
import { useRouter } from 'vue-router'
import { getOriginCategories } from '@/api/LibraryAndSetting'
const { t } = useI18n()

let rank1SelectOptions = reactive([])
let timesCallAPI = 0
const schema = reactive<FormSchema[]>([
  {
    field: 'field13',
    label: t('reuse.typeCategory'),
    component: 'Divider'
  },
  {
    field: 'rankCategory',
    label: t('reuse.chooseRankCategory'),
    component: 'Select',
    componentProps: {
      options: [
        {
          label: t('reuse.rank1Category'),
          value: 1
        },
        {
          label: t('reuse.rank2Category'),
          value: 2
        }
      ],
      onChange: (value) => {
        if (value == 1 || value == '') {
          removeFormSchema()
        }
        if (value == 2) {
          addFormSchema(timesCallAPI)
          timesCallAPI++
        }
      }
    },
    colProps: {
      span: 13
    }
  },
  {
    field: 'field1',
    label: t('reuse.generalInformation'),
    component: 'Divider'
  },
  {
    field: 'rank1Category',
    label: t('reuse.nameRank1Category'),
    component: 'Input',
    colProps: {
      span: 13
    },
    hidden: false
  },
  {
    field: 'parentid',
    label: t('reuse.nameRank1Category'),
    component: 'Select',
    componentProps: {
      options: []
    },
    hidden: true
  },
  {
    field: 'selectRank2',
    label: t('reuse.nameRank2Category'),
    component: 'Input',
    colProps: {
      span: 13
    },
    hidden: true
  },
  {
    field: 'count',
    label: t('reuse.displayPosition'),
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
          value: 1
        },
        {
          label: t('reuse.stopShowAppWeb'),
          value: 2
        }
      ]
    }
  }
])
const getRank1SelectOptions = async () => {
  await getOriginCategories()
    .then((res) => {
      if (res.data) {
        rank1SelectOptions = res.data.map((index) => ({
          label: index.name,
          value: index.id
        }))
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

const removeFormSchema = () => {
  schema[3].hidden = false
  schema[4].hidden = true
  schema[5].hidden = true
}
const addFormSchema = async (timesCallAPI) => {
  if (timesCallAPI == 0) {
    await getRank1SelectOptions()
    if (schema[4].componentProps?.options != undefined) {
      schema[4].componentProps.options = rank1SelectOptions
    }
  }
  schema[3].hidden = true
  schema[4].hidden = false
  schema[5].hidden = false
}
const postData = (data) => {
  console.log('data', data)
}

const router = useRouter()
const currentRoute = String(router.currentRoute.value.params.backRoute)
const title = router.currentRoute.value.meta.title
const id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)
</script>

<template>
  <TableOperator
    ref="formRef"
    :schema="schema"
    :nameBack="currentRoute"
    :title="title"
    :type="type"
    :id="id"
    @post-data="postData"
  />
</template>
