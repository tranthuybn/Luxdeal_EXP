<script setup lang="ts">
import { h, reactive, ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import TableOperatorAccountant from '../TableOperatorAccountant.vue'
import { useRouter } from 'vue-router'
import { updateReceiptOrPayment, postNewReceiOrPayment, deleteReceiptOrPayment, getDetailReceiptPayment } from '@/api/Accountant'
import { useValidator } from '@/hooks/web/useValidator'
import { ElNotification, ElCollapse, ElCollapseItem, ElButton } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import moment from 'moment'
import { FORM_IMAGES } from '@/utils/format'
import { FormDataPostAndEdit, FormData } from '../types/ReceiptsAndExpenditures'
import { Collapse } from '../types'
const { required } = useValidator()
const { t } = useI18n()
const minusIcon = useIcon({ icon: 'akar-icons:minus' })
const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const router = useRouter()
const id = Number(router.currentRoute.value.params.id)
const type = 'add'
const { push } = useRouter()
const escape = useIcon({ icon: 'quill:escape' })
const setFormData = reactive({} as FormData)
const back = async () => {
  push({
    name: 'accountant.payment-proposal.payment-proposal-list'
  })
}
const rules = reactive({
  createdBy: [required()],
  description: [required()],
  totalMoney: [required()],
  enterMoney: [required()],
  paymentMethod: [required()],
})

//random field code
const curDate = 'DNTT' + moment().format('hhmmss')
const schema = reactive<FormSchema[]>([
  {
    field: 'generalServiceInformation',
    label: t('reuse.paymentRequestInfo'),
    component: 'Divider'
  },
  {
    field: 'code',
    label: t('formDemo.formCode'),
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      readonly: true,
      class: 'readonly-info',
    },
    value: curDate
  },
  {
    field: 'createdAt',
    label: t('reuse.createDate'),
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      readonly: true,
      class: 'readonly-info',
    },
    value: moment().format('DD/MM/YYYY')
  },
  {
    field: 'createdBy',
    label: t('reuse.petitioner'),
    component: 'Select',
    colProps: {
      span: 24
    }
  },
  {
    field: 'description',
    label: t('formDemo.reasonsSpendMoney'),
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('formDemo.enterDescription'),
    }
  },
  {
    field: 'generalServiceInformation',
    label: t('reuse.subject'),
    component: 'Divider'
  },
  {
    field: 'peopleType',
    label: t('reuse.selectObject'),
    component: 'Select',
    colProps: {
      span: 24
    },
    componentProps: {
      style: 'width: 100%',
      placeholder: '',
    }
  },
  {
    field: 'generalServiceInformation',
    label: t('formDemo.billingInformation'),
    component: 'Divider'
  },
  {
    field: 'totalMoney',
    label: t('formDemo.amountSpent'),
    component: 'InputPrice',
    value: '',
    colProps: {
      span: 24
    },
    componentProps: {
      showCurrency: false,
      placeholder: t('reuse.placeholderMoney'),
      suffixIcon: h('div', 'đ'),
    }
  },
  {
    field: 'enterMoney',
    label: t('formDemo.writtenWords'),
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('formDemo.writtenWords'),
    }
  },
  {
    field: 'typeOfPayment',
    label: t('formDemo.formPayment'),
    component: 'Select',
    value: 1,
    colProps: {
      span: 24
    },
    componentProps: {
      style: 'width: 100%',
      options: [
      { label: t('reuse.payThroughMoney'), value: 1 },
      { label: t('reuse.payThroughCard'), value: 2 },
      ]
    }
  },
  {
    field: 'statusHistory',
    label: t('reuse.status'),
    colProps: {
      span: 24
    },
    componentProps : {
      readonly: true,
    }
  }
])

const customizeData = async (data) => {
  setFormData.code = data.code
  setFormData.description = data.description
  setFormData.totalMoney = data.totalMoney
  setFormData.createdBy = data.createdBy
  setFormData.createAt = data.createAt
  setFormData.peopleType = data.peopleType
  setFormData.enterMoney = data.enterMoney
  setFormData.typeOfPayment = data.typeOfPayment
}

const customData = (data) => {
  const customData = {} as FormDataPostAndEdit
  customData.Code = data.code
  customData.CreatedBy = data.createdBy
  customData.CreateAt = data.createAt
  customData.Description = data.description
  customData.PeopleType = data.peopleType
  customData.TotalMoney = data.totalMoney
  customData.EnterMoney = data.enterMoney
  customData.TypeOfPayment = data.typeOfPayment
  return customData
}

const editData = async (data) => {
  data = customData(data)
  await updateReceiptOrPayment(data)
    .then(() => {
      ElNotification({
        message: t('reuse.updateSuccess'),
        type: 'success'
      }),
        push({
          name: 'accountant.payment-proposal.payment-proposal-list',
          params: { backRoute: 'accountant.payment-proposal.payment-proposal-list' }
        })
    })
    .catch(() =>
      ElNotification({
        message: t('reuse.updateFail'),
        type: 'warning'
      })
    )
}

const postData = async (data) => {
  console.log(data)
  data = customData(data)
  await postNewReceiOrPayment(FORM_IMAGES(data))
    .then(() => {
      ElNotification({
        message: t('reuse.addSuccess'),
        type: 'success'
      }),
        push({
          name: 'accountant.payment-proposal.payment-proposal-list',
          params: { backRoute: 'accountant.payment-proposal.payment-proposal-list' }
        })
    })
    .catch((res) =>
      ElNotification({
        message: res.response.data.message,
        type: 'warning'
      })
    )
}
const collapse: Array<Collapse> = [
  {
    icon: minusIcon,
    name: 'paymentProposalDetails',
    title: t('formDemo.detailsOfPaymentRequest'),
    columns: schema
  },
  // {
  //   icon: plusIcon,
  //   name: 'detailedStatementOfExpenses',
  //   title: t('formDemo.detailedListExpenses'),
  //   columns: []
  // },
]
const currentCollapse = ref<string>(collapse[0].name)
const collapseChangeEvent = (val) => {
  if (val) {
    collapse.forEach((el) => {
      if (val.includes(el.name)) el.icon = minusIcon
      else if (el.icon == minusIcon) el.icon = plusIcon
    })
  } else
    collapse.forEach((el) => {
      el.icon = plusIcon
    })
}

</script>

<template>
  <div class="demo-collapse">
    <el-collapse v-model="currentCollapse" :collapse="collapse" @change="collapseChangeEvent">
      <el-collapse-item
        v-for="(item, index) in collapse"
        :key="index"
        :name="item.name"
      >
        <template #title>
            <div class="flex w-full justify-between">
              <div class="before">
                <el-button class="header-icon" :icon="collapse[0].icon" link />
                <span class="text-center text-xl ml-3">{{ collapse[0].title }}</span>
              </div>
              <div @click="back()" class="after">
                <span class="text-center text-xl">{{ t('reuse.exit') }}</span>
                <el-button class="header-icon" :icon="escape" link />
              </div>
            </div>
        </template>
        <TableOperatorAccountant
          :apiId="getDetailReceiptPayment"
          :schema="schema"
          :type="type"
          :id="id"
          @post-data="postData"
          :rules="!(type === 'detail') ? rules : {}"
          @customize-form-data="customizeData"
          @edit-data="editData"
          :formDataCustomize="setFormData"
          :delApi="deleteReceiptOrPayment"
          :hasImage="false"
          :hasAttachDocument="true"
        />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<style lang="less" scoped>

  ::v-deep(.btn-wrap) {
    margin-left: 150px;
  }

  ::v-deep(.el-select) {
    width: 100%;
  }

</style>
