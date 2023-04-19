<script setup lang="ts">
import { dateTimeFormat } from '@/utils/format'
import { useIcon } from '@/hooks/web/useIcon'
import { Collapse } from '../../Components/Type'
import { h, onBeforeMount, reactive, ref, unref, watch } from 'vue'
import { useForm } from '@/hooks/web/useForm'
import { useI18n } from '@/hooks/web/useI18n'
import {
  getCommissionPaymentByIdList,
  addNewPaymentRequest,
  updateCommissionPayment,
  getCollaboratorsList,
  getPaymentList,
  getReceiptPaymentList,
  getReceiptsExpendituresList
} from '@/api/Business'
import { useRouter } from 'vue-router'
import { API_URL } from '@/utils/API_URL'
import {
  ElCollapse,
  ElCollapseItem,
  ElUpload,
  ElSelect,
  ElOption,
  ElButton,
  ElDivider,
  ElCheckbox,
  ElNotification,
  UploadProps,
  ElMessageBox,
  UploadUserFile,
  ElForm,
  ElFormItem,
  ElMessage,
} from 'element-plus'
import { FORM_IMAGES } from '@/utils/format'
import type { FormInstance, FormRules } from 'element-plus'
import InputPrice from '@/components/CurrencyInputComponent.vue'
import { changeMoney, formartDate } from '@/utils/tsxHelper'
import InfinitOptions from '@/components/Select/InfinitOptions.vue'

const pageIndex = ref(1)
const { t } = useI18n()
const showInputPricePlaceholder = ref(true)
const doCloseOnClickModal = ref(false)
const { push } = useRouter()
const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })
const escape = useIcon({ icon: 'quill:escape' })
const collapse: Array<Collapse> = [
  {
    icon: minusIcon,
    name: 'information',
    title: t('router.detailPaymentRequest')
  }
]
const dialogVisible = ref(false)
// const disabled = ref(false)
const disabledTable = ref(false)
var curDate = 'HH' + Date.now()
let requestCode = ref('')
const collapseChangeEvent = (val) => {
  if (val) {
    collapse.forEach((el) => {
      if (val.includes(el.title)) el.icon = minusIcon
      else if (el.icon == minusIcon) el.icon = plusIcon
    })
  } else
    collapse.forEach((el) => {
      el.icon = plusIcon
    })
}
let customerAddress = ref('')
// Call api danh sách khách hàng

// Call api danh sách sản phẩm
let listReceiptPaymentRequest = ref()
let listPaymentRequest = ref()
const listPayments = ref()
let optionsPaymentApi = ref()
let optionsReceiptPaymentApi = ref()
let optionCallAPi = 0
const callAPiPaymentRequest = async (id) => {

  if (optionCallAPi == 0) {
    const res = await getPaymentList({ PeopleId: id })
    listPayments.value = res.data
    optionsPaymentApi.value = listPayments.value.map((payment) => ({
      code: payment.code,
      paymentType: payment.paymentType ? 'Thu' : 'Chi',
      totalMoney: payment.totalMoney,
      createdAt: dateTimeFormat(payment.createdAt),
      createdBy: payment.createdBy
    }))
    optionCallAPi++
    listPaymentRequest.value = optionsPaymentApi.value
  }
}
let optionReceiptPaymentCallAPi = 0
const callAPiReceiptPaymentRequest = async () => {
  if (optionReceiptPaymentCallAPi == 0) {
    const res = await getReceiptPaymentList({})
    listPayments.value = res.data
    optionsReceiptPaymentApi.value = listPayments.value.map((payment) => ({
      code: payment.code,
      paymentType: payment.type == 1 ? 'Thu' : 'Chi',
      totalMoney: changeMoney.format(parseInt(payment.totalMoney)),
      createdAt: dateTimeFormat(payment.createdAt),
      createdBy: payment.createdBy
    }))
    optionReceiptPaymentCallAPi++
    listReceiptPaymentRequest.value = optionsReceiptPaymentApi.value
  }
}
const changeNameReceiptPayment = (_value, obj, _scope) => {
  FormData.ReceiptOrPaymentVoucherId = Number(obj.id)
}
const changeNamePayment = (_value, obj, _scope) => {
  FormData.PaymentOrder = Number(obj.id)
}
// const changeNameReceiptPayment = (optionID, scope) => {
//   const option = optionsReceiptPaymentApi.value.find((option) => option.code == optionID)
//   scope.row.code = option.code
//   scope.row.typeOfPayment = option.typeOfPayment
//   scope.row.totalMoney = option.totalMoney
//   scope.row.createdAt = option.createdAt
//   scope.row.createdBy = option.createdBy
// }
// const changeNamePayment = (optionID, scope) => {
//   const option = optionsPaymentApi.value.find((option) => option.code == optionID)
//   scope.row.code = option.code
//   scope.row.paymentType = option.paymentType
//   scope.row.totalMoney = option.totalMoney
//   scope.row.createdAt = option.createdAt
//   scope.row.createdBy = option.createdBy
// }
const optionsCustomerApi = ref<Array<any>>([])
let optionCallCustomerAPi = 0
const callCustomersApi = async () => {
  if (optionCallCustomerAPi == 0) {
    const res = await getCollaboratorsList({ PageIndex: 1, PageSize: 1000 })
    const getCustomerResult = res.data
    if (Array.isArray(unref(getCustomerResult)) && getCustomerResult?.length > 0) {
      optionsCustomerApi.value = getCustomerResult.map((collaborator) => ({
        label: collaborator.code + ' | ' + collaborator.accountName,
        value: collaborator.code,
        id: collaborator.customerId,
        code: collaborator.code,
        accountName: collaborator.accountName,
        taxCode: collaborator.customer?.taxCode,
        representative: collaborator.customer?.representative,
        phonenumber: collaborator.customer?.phonenumber,
        email: collaborator.customer?.email,
        address: collaborator.customer?.address,
        bankId: collaborator.bankId,
        accountNumber: collaborator.customer?.accountNumber,
        bankName: collaborator.bank?.name,
        CollaboratorId: collaborator.id,
        cccd: collaborator.customer?.cccd,
        cccdCreateAt: collaborator.customer?.cccdCreateAt,
        cccdPlaceOfGrant: collaborator.customer?.cccdPlaceOfGrant,
        sex: collaborator.customer?.sex,
        doB: collaborator.customer?.doB
      }))
    }
    profileCustomer.value = getCustomerResult
  }
  optionCallCustomerAPi++
}
let profileCustomer = ref()
let infoCompany = reactive({
  code: '',
  name: '',
  taxCode: '',
  phone: '',
  email: '',
  representative: '',
  phonenumber: '',
  address: '',
  accountName: '',
  accountNumber: '',
  bankName: '',
  CollaboratorId: '',
  cccd: '',
  cccdCreateAt: '',
  cccdPlaceOfGrant: '',
  sex: '',
  doB: ''
})
const changeAddressCustomer = (data) => {
  if (data) {
    // customerAddress.value = optionsCustomerApi.value.find((e) => e.value == data)?.address ?? ''
    const result = optionsCustomerApi.value.find((e) => e.value == data)

    customerAddress.value = optionsCustomerApi.value.find((e) => e.value == data)?.address ?? ''
    infoCompany.code = result.code
    infoCompany.accountNumber = result.accountNumber
    infoCompany.taxCode = result.taxCode
    infoCompany.email = result.email
    infoCompany.representative = result.representative
    infoCompany.phonenumber = result.phonenumber
    infoCompany.address = result.address
    infoCompany.accountName = result.accountName
    infoCompany.accountNumber = result.accountNumber
    infoCompany.CollaboratorId = result.CollaboratorId
    infoCompany.bankName = result.bankName
    infoCompany.cccd = result.cccd
    infoCompany.cccdCreateAt = result.cccdCreateAt
    infoCompany.cccdPlaceOfGrant = result.cccdPlaceOfGrant
    infoCompany.sex = result.sex
    infoCompany.doB = result.doB
    callAPiPaymentRequest(result.id)
    callAPiReceiptPaymentRequest()
  }
}
const ruleFormRef = ref<FormInstance>()
// eslint-disable-next-line vue/no-setup-props-destructure
const { register, methods, elFormRef } = useForm({
  ruleFormRef
})
let formValue = ref()
const getTableValue = async () => {
  if (!isNaN(id)) {
    const res = await getCommissionPaymentByIdList({ id: id })
    if (res && res.data) {
      formValue.value = res.data
      await setFormValue()
    } else {
      ElNotification({
        message: t('reuse.cantGetData'),
        type: 'warning'
      })
    }
  }
}

// const customizeData = async () => {
// formDataCustomize.value.collaboratorFiles = `${API_URL}${formValue.value.collaboratorFiles}`
// FormData.Discount = formValue.value.code
// }
let checkValidate = ref(false)

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, _fields) => {
    if (valid) {
      checkValidate.value = true
    } else {
      ElMessage.error(t('reuse.notFillAllInformation'))
    }
  })
}
// get data from router
const router = useRouter()
const id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)
//Lấy dữ liệu từ bảng khi ấn nút detail hoặc edit
const disabledForm = ref(false)
watch(
  () => type,
  () => {
    if (type === 'detail') {
      disabledForm.value = true
      disabledTable.value = true
    }
    if (type === 'detail' || type === 'edit') {
      getTableValue()
      disabledTable.value = true
    }
    if (type === 'add' || !type) {
      disabledTable.value = true
    }
  },
  {
    deep: true,
    immediate: true
  }
)
watch(
  () => checkValidate.value,
  () => {
    if (checkValidate.value === true) {
      save()
    }
  }
)
defineExpose({
  elFormRef,
  getFormData: methods.getFormData
})

type FormDataInput = {
  CollaboratorStatus: boolean
  Price: number
  collaboratorValue: any
  Code: string
  ReceiptOrPaymentVoucherId: number
  PaymentOrder: number
}
type FormDataPost = {
  CollaboratorId: string
  Code: string
  Status?: number
  Price: number
  ReceiptOrPaymentVoucherId: number
  PaymentOrder: number
  Files?: any
}

const cancel = async () => {
  push({
    name: 'business.collaborators.paymentRequest',
    params: { backRoute: 'business.collaborators.paymentRequest' }
  })
}

// const cancel = () => {
//   go(-1)
// }
const ListFileUpload:any = ref<UploadUserFile[]>([])
const handleChange: UploadProps['onChange'] = async (_uploadFile, uploadFiles) => {
  ListFileUpload.value = uploadFiles
}
onBeforeMount(() => {
  callCustomersApi()
  if (type === 'add') {
    requestCode.value = curDate
  }
})
let FileDeleteIds: any = []
const beforeRemove : any = (uploadFile) => {
  return ElMessageBox.confirm(`Cancel the transfert of ${uploadFile.name} ?`, {
    confirmButtonText: 'OK',
    cancelButtonText: 'Hủy',
    type: 'warning',
    draggable: true
  })
    .then(() => {
      ElMessage({
        type: 'success',
        message: 'Delete completed'
      })
      let imageRemove = uploadFile.id
      FileDeleteIds.push(imageRemove)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled'
      })
    })
}
const setFormValue = async () => {
  const { setValues } = methods
  if (formValue.value) {
    FormData.Price = formValue.value.price
    FormData.Code = formValue.value.code
    requestCode.value = formValue.value.code
    infoCompany.CollaboratorId = formValue.value.collaboratorId
    infoCompany.code = formValue.value.collaborator?.code
    infoCompany.name = formValue.value.collaborator?.customer?.name
    infoCompany.accountName = formValue.value.collaborator?.customer?.accountName
    infoCompany.taxCode = formValue.value.collaborator?.customer?.taxCode
    infoCompany.representative = formValue.value.collaborator?.customer?.representative
    infoCompany.phonenumber = formValue.value.collaborator?.customer?.phonenumber
    infoCompany.email = formValue.value.collaborator?.customer?.email
    infoCompany.address = formValue.value.collaborator?.customer?.address
    infoCompany.accountNumber = formValue.value.collaborator?.customer?.accountNumber
    infoCompany.bankName = formValue.value.collaborator?.customer?.bank?.name
    infoCompany.cccd = formValue.value.collaborator?.customer?.cccd
    infoCompany.cccdCreateAt = formValue.value.collaborator?.customer?.cccdCreateAt
    infoCompany.cccdPlaceOfGrant = formValue.value.collaborator?.customer?.cccdPlaceOfGrant
    infoCompany.sex = formValue.value.collaborator?.customer?.sex
    infoCompany.doB = formValue.value.collaborator?.customer?.doB
    FormData.ReceiptOrPaymentVoucherId = formValue.value.receiptOrPaymentVoucherId
    FormData.PaymentOrder = formValue.value.paymentOrder
    if (formValue.value.status === 2) {
      FormData.CollaboratorStatus = true
    } else if (formValue.value.status === 1) {
      FormData.CollaboratorStatus = false
    }
    FormData.collaboratorValue = {
      label: formValue.value.collaborator?.code + ' | ' + formValue.value.collaborator?.accountName,
      value: formValue.value.id
    }
    formValue.value?.commissionPaymentFiles.map((element) => {
      if (element.file !== null) {
        ListFileUpload.value.push({
          url: `${API_URL}${element?.file?.path}`,
          name: element?.file?.fileName,
          id: element?.file?.id
        })
      }
    })
    setValues(formValue.value)
  } else {
    setValues(formValue.value)
  }
}

let FormData = reactive({} as FormDataInput)
const customPostData = (FormData) => {
  const customData = {} as FormDataPost
  customData.CollaboratorId = infoCompany.CollaboratorId
  customData.Code = requestCode.value
  customData.Status = FormData.CollaboratorStatus ? 2 : 1
  customData.Price = parseInt(FormData.Price)
  customData.ReceiptOrPaymentVoucherId = FormData.ReceiptOrPaymentVoucherId
  customData.PaymentOrder = FormData.PaymentOrder
  customData.Files = ListFileUpload.value.map((file) => file.raw)
  return customData
}
const rules = reactive<FormRules>({
  Price: [
    {
      required: true,
      message: t('common.required'),
      trigger: 'blur'
    },
    {
      validator: (_rule: any, value: any, callback: any) => {
        if (isNaN(value)) callback(new Error(t('reuse.numberFormat')))
        else if (value < 0) callback(new Error(t('reuse.positiveNumber')))
        callback()
      },
      required: true,
      trigger: 'blur'
    }
  ],
  collaboratorValue: [
    {
      required: true,
      message: t('common.selectText'),
      trigger: 'blur'
    }
  ]
})
const clear = async () => {
  ;(infoCompany.accountName = ''),
    (infoCompany.taxCode = ''),
    (infoCompany.phone = ''),
    (infoCompany.email = ''),
    (infoCompany.representative = ''),
    (infoCompany.phonenumber = ''),
    (infoCompany.address = ''),
    (infoCompany.accountName = ''),
    (infoCompany.accountNumber = ''),
    (infoCompany.bankName = ''),
    (requestCode.value = '')
}
const save = async () => {
  submitForm(ruleFormRef.value)
  if (checkValidate.value) {
    const data = customPostData(FormData)
    if (type == 'edit') {
      const payload = {
        id: id,
        FileDeleteIds: FileDeleteIds == '' ? null : FileDeleteIds,
        Files: data.Files.filter((file) => file !== undefined)
      }
      await updateCommissionPayment({ ...payload, ...data })
        .then(() => {
          ElNotification({
            message: t('reuse.updateSuccess'),
            type: 'success'
          }),
            push({
              name: `business.collaborators.paymentRequest`
            })
        })
        .catch(() =>
          ElNotification({
            message: t('reuse.updateFail'),
            type: 'warning'
          })
        )
    } else {
      await addNewPaymentRequest(FORM_IMAGES(data))
        .then(() => {
          ElNotification({
            message: t('reuse.addSuccess'),
            type: 'success'
          }),
            push({
              name: `business.collaborators.paymentRequest`
            })
        })
        .catch((error) =>
          ElNotification({
            message: error,
            type: 'warning'
          })
        )
    }
  }
}
const fix = async () => {
  push({
    name: `${String(router.currentRoute.value.name)}`,
    params: { id: id, type: 'edit' }
  })
}
const activeName = ref(collapse[0].title)
const getMapData = ({code, type,totalMoney, createdBy, createdAt, id}) => ({label: code, type: type == 1 ? t('reuse.get') : t('reuse.spend') , totalMoney, createdBy, createdAt: formartDate(createdAt), id  })


</script>
<template>
  <div class="demo-collapse dark:bg-[#141414]">
    <el-collapse v-model="activeName" @change="collapseChangeEvent">
      <el-collapse-item :icon="false" :name="collapse[0].title">
        <template #title>
          <div class="flex w-[100%] justify-between">
            <div class="before">
              <el-button class="header-icon" :icon="collapse[0].icon" link />
              <span class="text-center text-xl">{{ collapse[0].title }}</span>
            </div>
            <div @click="cancel()" class="after">
              <span class="text-center text-xl">{{ t('reuse.exit') }}</span>
              <el-button class="header-icon" :icon="escape" link />
            </div>
          </div>
        </template>
        <div class="flex w-[100%]">
          <div class="w-[50%]">
            <ElForm
              ref="ruleFormRef"
              :model="FormData"
              :disabled="disabledForm"
              :rules="rules"
              label-width="170px"
              @register="register"
              status-icon
            >
              <el-divider content-position="left">{{
                t('formDemo.profileCollaborator')
              }}</el-divider>
              <ElFormItem
                class="mb-4"
                :label="t('reuse.collaboratorsSelect')"
                prop="collaboratorValue"
              >
                <ElSelect
                  v-model="FormData.collaboratorValue"
                  filterable
                  @clear="clear()"
                  :clearable="true"
                  size="default"
                  :placeholder="t('reuse.collaboratorsSelect')"
                  @change="changeAddressCustomer"
                >
                  <ElOption
                    v-for="item in optionsCustomerApi"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </ElSelect>
              </ElFormItem>
              <div class="infoCTV">
                <ElFormItem :label="t('reuse.collaboratorsCode')" v-if="infoCompany.code">
                  <div class="font-bold">{{ infoCompany.code }}</div>
                </ElFormItem>
                <ElFormItem :label="t('reuse.collaboratorsName')" v-if="infoCompany.accountName">
                  <div>{{ infoCompany.accountName }}</div>
                </ElFormItem>
                <ElFormItem :label="t('formDemo.taxCode')" v-if="infoCompany.taxCode">
                  <div class="">
                    <div>{{ infoCompany.taxCode }}</div>
                  </div>
                </ElFormItem>
                <ElFormItem
                  class="w-[33%]"
                  style="display: inline-block"
                  :label="t('reuse.phoneNumber')"
                  v-if="infoCompany.phonenumber"
                >
                  <div class="leading-4">
                    <div>{{ infoCompany.phonenumber }}</div>
                  </div>
                </ElFormItem>
                <ElFormItem
                  class="w-[50%]"
                  style="display: inline-block"
                  :label="`${t('reuse.email')} :`"
                  v-if="infoCompany.email"
                >
                  {{ infoCompany.email }}
                </ElFormItem>
                <ElFormItem
                  class="w-[33%]"
                  style="display: inline-block"
                  :label="t('reuse.citizenIdentificationNumber')"
                  v-if="infoCompany.cccd"
                >
                  <div class="leading-4">
                    <div>{{ infoCompany.cccd }}</div>
                  </div>
                </ElFormItem>
                <ElFormItem
                  style="display: inline-block"
                  :label="`${t('formDemo.supplyDate')} :`"
                  v-if="infoCompany.cccdCreateAt"
                >
                  <div class="leading-4">
                    <div>{{ dateTimeFormat(infoCompany.cccdCreateAt) }}</div>
                  </div>
                </ElFormItem>
                <ElFormItem
                  style="display: inline-block"
                  :label="`${t('formDemo.supplyAddress')} :`"
                  v-if="infoCompany.cccdPlaceOfGrant"
                >
                  <div class="leading-4">
                    <div>{{ infoCompany.cccdPlaceOfGrant }}</div>
                  </div>
                </ElFormItem>
                <ElFormItem
                  class="w-[33%]"
                  style="display: inline-block"
                  :label="t('reuse.dateOfBirth')"
                  v-if="infoCompany.doB"
                >
                  <div class="leading-4">
                    <div>{{ dateTimeFormat(infoCompany.doB) }}</div>
                  </div>
                </ElFormItem>
                <ElFormItem
                  style="display: inline-block"
                  :label="`${t('reuse.gender')} :`"
                  v-if="infoCompany.sex"
                >
                <div>{{ infoCompany.sex ? t('reuse.male') : t('reuse.female') }}</div>
                </ElFormItem>
                <ElFormItem :label="t('formDemo.address')" v-if="infoCompany.address">
                  <div>{{ infoCompany.address }}</div>
                </ElFormItem>
                <ElFormItem
                  style="align-items: flex-start"
                  :label="t('reuse.accountBank')"
                  v-if="infoCompany.taxCode"
                >
                  <div class="leading-6 mt-1">
                    <div>{{ infoCompany.accountName }}</div>
                    <div>{{ infoCompany.accountNumber }}</div>
                    <div>{{ infoCompany.bankName }}</div>
                  </div>
                </ElFormItem>

              </div>
              <el-divider content-position="left">{{ t('router.paymentRequests') }}</el-divider>
              <ElFormItem :label="t('reuse.codeRequest')" prop="requestCode">
                <div>{{ requestCode }}</div>
              </ElFormItem>
              <ElFormItem :label="t('reuse.amountOfMoney')" prop="Price">
                <InputPrice 
                  v-model="FormData.Price"
                  size="default"
                  :placeholder="t('reuse.placeholderMoney')"
                  :suffixIcon="h('div', 'đ')"
                  :showCurrency="false"
                  :showPlaceholder="showInputPricePlaceholder"
                  @update:modelValue="showInputPricePlaceholder = false"
                />
              </ElFormItem>
              <ElFormItem :label="t('router.receiptsAndExpenditures')">
                <div class="flex justify-between gap-4">
                  <InfinitOptions
                    :fields="[
                      t('reuse.proposalCode'),
                      t('reuse.receiptAndPayment'),
                      t('reuse.amountOfMoney'),
                      t('reuse.creator'),
                      t('reuse.createDate'),
                    ]"
                    filterable
                    valueKey="id"
                    labelKey="label"
                    :hiddenKey="['id']"
                    :placeHolder="t('reuse.chooseReceiptAndPayment')"
                    :defaultValue="FormData.ReceiptOrPaymentVoucherId"
                    :pageIndex="pageIndex"
                    :type="type"
                    :api="getReceiptsExpendituresList"
                    :mapFunction="getMapData"
                    :clearable="false"
                    @update-value="(value, obj) => changeNameReceiptPayment(value, obj, $props)"
                  />
                  <el-button :icon="plusIcon" style="padding: 8px 34px">{{t('reuse.createNew')}}</el-button>
                </div>
              </ElFormItem>
              <ElFormItem :label="t('router.paymentProposal')">
                <template #default="props">
                  <div class="flex justify-between gap-4">
                    <InfinitOptions
                      :fields="[
                        t('reuse.proposalCode'),
                        t('reuse.amountOfMoney'),
                        t('reuse.createDate'),
                        t('reuse.creator')
                      ]"
                      filterable
                      :items="listPaymentRequest"
                      valueKey="id"
                      labelKey="label"
                      :hiddenKey="['id', 'type']"
                      :placeHolder="t('reuse.choosePaymentProposal')"
                      :defaultValue="FormData.PaymentOrder"
                      :pageIndex="pageIndex"
                      :type="type"
                      :api="getPaymentList"
                      :mapFunction="getMapData"
                      :clearable="false"
                      @update-value="(value, obj) => changeNamePayment(value, obj, props)"
                    />
                    <el-button :icon="plusIcon" style="padding: 8px 34px">{{t('reuse.createNew')}}</el-button>
                  </div>
                </template>
              </ElFormItem>
              <ElFormItem :label="t('formDemo.statusPayment')" style="align-items: flex-start">
                <div class="block items-center w-[100%] gap-4">
                  <ElCheckbox
                    v-model="FormData.CollaboratorStatus"
                    :label="t('formDemo.alreadyPaidForTt')"
                    size="large"
                    :disabled="type === 'add' || type == ':type'"
                  />
                </div>
                <div class="block gap-2 pb-8">
                  <div class="w-[100%]"
                    ><span class="pr-2 bg-[#FFF0D9] text-[#FEB951] leading-5 dark:bg-transparent">{{
                      t('reuse.approval')
                    }}</span>
                  </div>
                </div>
              </ElFormItem>
            </ElForm>
          </div>
          <div class="w-[50%]">
            <div class="text-sm text-[#303133] font-medium p pl-4 dark:text-[#fff]">
              <el-divider content-position="left">{{ t('formDemo.attachments') }}</el-divider>
            </div>
            <div class="flex">
              <div class="pl-5">
                <div class="text-right">{{ t('formDemo.addPhotosOrFiles') }}</div>
                <div class="text-right text-[#FECB80] italic">Dưới 10 hồ sơ</div>
              </div>
              <div class="pl-4">
                <el-upload
                  ref="upload"
                  action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                  :disabled="disabledForm"
                  :auto-upload="false"
                  v-model:fileList="ListFileUpload"
                  :limit="10"
                  :on-change="handleChange"
                  :multiple="true"
                  :before-remove="beforeRemove"
                  class="upload-demo"
                >
                  <el-dialog :close-on-click-modal="doCloseOnClickModal" v-model="dialogVisible">
                    <div class="text-[#303133] font-medium dark:text-[#fff]"
                      >+ {{ t('formDemo.addPhotosOrFiles') }}
                    </div>
                  </el-dialog>
                </el-upload>
              </div>
            </div>
          </div>
        </div>

        <div v-if="type === 'edit'" class="flex btn-type">
          <ElButton class="min-w-42" type="primary" plain @click="save()">
            {{ t('reuse.fix') }}
          </ElButton>
          <ElButton type="danger" class="min-w-42" @click="cancel()">
            {{ t('formDemo.cancelRequest') }}
          </ElButton>
        </div>
        <div v-else-if="type === 'detail'" class="flex btn-type">
          <ElButton class="min-w-42" type="primary" plain @click="fix()">
            {{ t('reuse.fix') }}
          </ElButton>
        </div>
        <div v-else class="flex btn-type">
          <ElButton class="min-w-42" type="primary" @click="save()">
            {{ t('reuse.save') }}
          </ElButton>
          <ElButton class="min-w-42" @click="cancel()"> {{ t('reuse.cancel') }} </ElButton>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style lang="scss" scoped>
::v-deep(.el-select) {
  width: 100%;
}

::v-deep(.el-textarea__inner) {
  padding: 5px 0;
  box-shadow: none;
}

::v-deep(.el-form-item) {
  display: flex;
  align-items: center;
}

::v-deep(.el-upload--picture-card) {
  width: 160px;
  height: 40px;
  border: 1px solid #409eff;
}

::v-deep(.d-block > .el-row) {
  display: block;
}

::v-deep(.el-form-item__content) {
  display: inline-block;
}

@media only screen and (min-width: 1920px) {
  ::v-deep(.el-col-xl-12) {
    max-width: 100%;
  }
}

::v-deep(label) {
  color: #828387;
}

::v-deep(.cell) {
  color: #303133;
}

::v-deep(.el-divider__text) {
  font-size: 16px;
}

.el-button--text {
  margin-right: 15px;
}

::v-deep(.el-divider--horizontal) {
  margin: 40px 0 24px;
}

::v-deep(.el-input) {
  width: auto;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}

::v-deep(.el-dialog__body) {
  padding-top: 0;
}

::v-deep(.el-dialog__header) {
  padding-bottom: 0;
}

::v-deep(.el-table th.el-table__cell) {
  padding: 0 !important;
}

::v-deep(.el-input) {
  width: 100%;
}

.example-showcase .el-dropdown-link {
  display: flex;
  color: var(--el-color-primary);
  cursor: pointer;
  align-items: center;
}

::v-deep(.el-dropdown-menu__item) {
  padding: 5px 30px;
}

::v-deep(.el-table .cell) {
  word-break: break-word;
}

::v-deep(.input-width > .el-select .el-input) {
  width: 100%;
}

::v-deep(.fix-full-width > .el-input) {
  width: 100%;
}

::v-deep(.fix-full-width > .el-select .el-input) {
  width: 100% !important;
}
::v-deep(.infoCTV) {
  .el-form-item {
    margin: 0;
  }
}
.header-icon {
  margin-right: 10px;
}

.after {
  display: flex;
  align-items: center;
}

.btn-type {
  margin-left: 170px;
}

</style>
