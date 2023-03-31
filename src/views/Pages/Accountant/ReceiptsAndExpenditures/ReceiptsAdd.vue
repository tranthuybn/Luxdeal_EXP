<script setup lang="ts">
import { h, reactive, ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import TableOperatorAccountant from '../TableOperatorAccountant.vue'
import { useRouter, useRoute } from 'vue-router'
import { updateReceiptOrPayment, postNewReceiptOrPayment, deleteReceiptOrPayment, getDetailReceiptPayment } from '@/api/Accountant'
import { useValidator } from '@/hooks/web/useValidator'
import { ElNotification, ElCollapse, ElCollapseItem, ElButton } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import moment from 'moment'
import { FORM_IMAGES } from '@/utils/format'
import { FormDataPostAndEdit, FormData } from '../types/ReceiptsAndExpenditures'
import { Collapse } from '../types'
import { formartDate } from '@/utils/tsxHelper'
const { required } = useValidator()
const { t } = useI18n()
const minusIcon = useIcon({ icon: 'akar-icons:minus' })
const router = useRouter()
const id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type) === ':type' ? 'add' : String(router.currentRoute.value.params.type)
const { push } = useRouter()
const route = useRoute()
const escape = useIcon({ icon: 'quill:escape' })
const activeName = ref('receiptsAddDetails')
const setFormData = reactive({} as FormData)


const test = String(route.query.approvalId)
console.log(test)
const back = async () => {
  push({
    name: 'accountant.receipts-expenditures.receipts-expenditures-list'
  })
}
const rules = reactive({
  createdBy: [required()],
  description: [required()],
  totalMoney: [required()],
  enterMoney: [required()],
  typeOfPayment: [required()],
})

//random field code
const curDate = 'PT' + moment().format('hhmmss')
const schema = reactive<FormSchema[]>([
  {
    field: 'generalServiceInformation',
    label: t('formDemo.informationReceipts'),
    component: 'Divider'
  },
  {
    field: 'code',
    label: t('formDemo.receiptsCode'),
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
    label: t('formDemo.reasonCollectingMoney'),
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
    label: t('formDemo.amountCollect'),
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
    field: 'accountNumber',
    label: t('reuse.accountingAccount'),
    component: 'Select',
    colProps: {
      span: 24
    },
    componentProps: {
      style: 'width: 100%',
    }
  },
  {
    field: 'paid',
    label: t('reuse.payment'),
    component: 'Radio',
    value: false,
    colProps: {
      span: 18
    },
    componentProps: {
      options: [
        {
          label: t('reuse.collectedMoney'),
          value: true
        }
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
  setFormData.createdBy = `${data.createdByObject?.name} | ${data.createdByObject?.value}` || ''
  setFormData.createdAt = formartDate(data.createdAt)
  setFormData.peopleType = `${data.peopleObject?.name} | ${data.peopleObject?.value}` || ''
  setFormData.enterMoney = data.enterMoney
  setFormData.typeOfPayment = data.typeOfPayment
  setFormData.accountNumber = data.fundID
  setFormData.paid = data.transacted
}

const customData = (data) => {
  const customData = {} as FormDataPostAndEdit
  customData.Code = data.code
  customData.CreatedBy = data.createdById
  customData.CreateAt = data.createdAt
  customData.Description = data.description
  customData.PeopleId = data.peopleId
  customData.PeopleType = 1
  customData.TotalMoney = data.totalMoney
  customData.EnterMoney = data.enterMoney
  customData.TypeOfPayment = data.typeOfPayment
  customData.FundID = data.accountNumber
  customData.Transacted = data.paid
  customData.Type = 1
  customData.Status = 1
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
          name: 'accountant.receipts-expenditures.receipts-expenditures-list',
          params: { backRoute: 'accountant.receipts-expenditures.receipts-expenditures-list' }
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
  data = customData(data)
  await postNewReceiptOrPayment(FORM_IMAGES(data))
    .then(() => {
      ElNotification({
        message: t('reuse.addSuccess'),
        type: 'success'
      }),
        push({
          name: 'accountant.receipts-expenditures.receipts-expenditures-list',
          params: { backRoute: 'accountant.receipts-expenditures.receipts-expenditures-list' }
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
    name: 'receiptsAddDetails',
    title: t('reuse.receiptsAddDetails'),
    columns: schema
  }
]
const currentCollapse = ref<string>(collapse[0].name)

</script>

<template>
  <div class="demo-collapse">
    <el-collapse v-model="activeName" :collapse="collapse">
      <el-collapse-item
        v-for="(item, index) in collapse"
        :key="index"
        :name="item.name"
        v-model="currentCollapse"
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
