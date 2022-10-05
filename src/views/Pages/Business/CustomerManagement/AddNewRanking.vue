<script setup lang="ts">
import { addCustomerRatings } from '@/api/Business'
import { getCategoryById, deleteCategory } from '@/api/LibraryAndSetting'
import { useValidator } from '@/hooks/web/useValidator'
import { FORM_IMAGES } from '@/utils/format'
import { ElNotification } from 'element-plus'
import { h, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import TableOperator from '../../Components/TableBase/src/TableOperator.vue'

const { t } = useI18n()
const schema = reactive<FormSchema[]>([
  {
    field: 'field1',
    label: t('reuse.generalInformation'),
    component: 'Divider'
  },
  {
    field: 'Name',
    label: t('customerList.rankName'),
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      style: 'width: 100%',
      placeholder: t('customerList.enterNameRanking')
    },
    hidden: false
  },
  {
    field: 'Rating',
    label: t('customerList.ratings'),
    component: 'Select',
    colProps: {
      span: 12
    },
    componentProps: {
      options: [
        {
          label: t('reuse.byMonth'),
          value: 1
        },
        {
          label: t('customerList.byQuarter'),
          value: 2
        },
        {
          label: t('customerList.byYear'),
          value: 3
        }
      ],
      disabled: false,
      style: 'width: 100%'
    }
  },
  {
    field: 'Sales',
    component: 'Input',
    colProps: {
      span: 12
    },
    formItemProps: {
      labelWidth: '0px'
    },
    componentProps: {
      placeholder: t('customerList.enterSales'),
      suffixIcon: h('div', 'đ')
    }
  },
  {
    field: 'field41',
    label: t('reuse.status'),
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
        }
      ]
    }
  }
])
const { required, ValidService, notSpecialCharacters, notSpace } = useValidator()
const rules = reactive({
  Name: [
    required(),
    { validator: notSpecialCharacters },
    { validator: ValidService.checkNameLength.validator }
  ],
  Rating: [required()],
  Sales: [{ validator: ValidService.checkPositiveNumber.validator }, { validator: notSpace }],
  status: [required()]
})
// get data from router
const router = useRouter()
const title = router.currentRoute.value.meta.title
const id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)

const formDataCustomize = ref()
const customPostData = (data) => {
  const postCustomerRatings = ref()
  postCustomerRatings.value = data
  data.status.length > 0
    ? (postCustomerRatings.value.isActive = true)
    : (postCustomerRatings.value.isActive = false)
  return postCustomerRatings.value
}
const postData = async (data) => {
  data = customPostData(data)
  console.log('data post', data)
  await addCustomerRatings(FORM_IMAGES(data))
    .then(() =>
      ElNotification({
        message: t('reuse.addSuccess'),
        type: 'success'
      })
    )
    .catch(() =>
      ElNotification({
        message: t('reuse.addFail'),
        type: 'error'
      })
    )
}
const customizeData = () => {}
const editData = () => {}
</script>
<template>
  <TableOperator
    ref="formRef"
    :schema="schema"
    :type="type"
    :id="id"
    :title="title"
    @post-data="postData"
    :rules="rules"
    :apiId="getCategoryById"
    @customize-form-data="customizeData"
    @edit-data="editData"
    :formDataCustomize="formDataCustomize"
    :delApi="deleteCategory"
    :backButton="true"
    :multiple-images="false"
  />
</template>
