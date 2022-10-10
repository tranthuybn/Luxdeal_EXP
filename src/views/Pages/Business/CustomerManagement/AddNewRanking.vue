<script setup lang="ts">
import { addCustomerRatings } from '@/api/Business'
import { getCustomerRatingsById, updateCustomerRatings, deleteCustomerRating } from '@/api/Business'
import { useValidator } from '@/hooks/web/useValidator'
import { FORM_IMAGES } from '@/utils/format'
import { ElNotification } from 'element-plus'
import { h, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import TableOperator from '../../Components/TableBase/src/TableOperator.vue'
import { API_URL } from '@/utils/API_URL'

const { t } = useI18n()
const schema = reactive<FormSchema[]>([
  {
    field: 'field1',
    label: t('reuse.generalInformation'),
    component: 'Divider'
  },
  {
    field: 'name',
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
    field: 'rating',
    label: t('customerList.ratings'),
    component: 'Select',
    colProps: {
      span: 12
    },
    value: 1,
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
    field: 'sales',
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
    field: 'isActive',
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
  name: [
    required(),
    { validator: notSpecialCharacters },
    { validator: ValidService.checkNameLength.validator }
  ],
  rating: [required()],
  sales: [
    required(),
    { validator: ValidService.checkPositiveNumber.validator },
    { validator: notSpace }
  ]
  // isActive: [required()]
})
// get data from router
const router = useRouter()
const title = router.currentRoute.value.meta.title
const id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)

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
const formDataCustomize = ref()
const customizeData = async (formData) => {
  console.log('formData', formData)
  formDataCustomize.value = formData
  formData.isActive == true
    ? (formDataCustomize.value.isActive = [1])
    : (formDataCustomize.value.isActive = [])
  formDataCustomize.value.imageurl = `${API_URL}${formData.imageUrl}`
}
type FormDataUpdate = {
  Id: number
  Name: string
  Rating: number
  Sales: number
  isActive: boolean
  Image: any
  ImageUrl: any
}
const customUpdateData = (data) => {
  console.log(data)
  const customUpdate = {} as FormDataUpdate
  customUpdate.Id = data.id
  customUpdate.Name = data.name
  customUpdate.Rating = data.rating
  customUpdate.Sales = data.sales
  customUpdate.ImageUrl = data.imageurl.replace(`${API_URL}`, '')
  customUpdate.Image = data.Image
  data.isActive.includes(1) ? (customUpdate.isActive = true) : (customUpdate.isActive = false)
  return customUpdate
}
const editData = async (data) => {
  data = customUpdateData(data)
  await updateCustomerRatings(FORM_IMAGES(data))
    .then(() =>
      ElNotification({
        message: t('reuse.updateSuccess'),
        type: 'success'
      })
    )
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
    ref="formRef"
    :schema="schema"
    :type="type"
    :id="id"
    :title="title"
    @post-data="postData"
    :rules="rules"
    :apiId="getCustomerRatingsById"
    @customize-form-data="customizeData"
    @edit-data="editData"
    :formDataCustomize="formDataCustomize"
    :delApi="deleteCustomerRating"
    :backButton="true"
    :multiple-images="false"
  />
</template>
