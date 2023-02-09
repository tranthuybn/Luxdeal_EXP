<script setup lang="ts">
import { useIcon } from '@/hooks/web/useIcon'
import { Collapse } from '../../Components/Type'
import { dateTimeFormat, moneyFormat } from '@/utils/format'

import { h, onBeforeMount, provide, reactive, ref, unref, watch } from 'vue'
import { useForm } from '@/hooks/web/useForm'
import { useI18n } from '@/hooks/web/useI18n'
import {
  getCollaboratorsById,
  getGenCodeCollaborators,
  addNewCollaborators,
  updateCollaborators,
  cancelCustomerCollabolator,
  GetOrderByCollabolatorId,
  getCommissionPaymentByCollaboratorId,
approvalOrder
} from '@/api/Business'
import { useValidator } from '@/hooks/web/useValidator'
import { useRouter } from 'vue-router'
import { getAllCustomer } from '@/api/Business'
import { API_URL } from '@/utils/API_URL'
import {
  ElCollapse,
  ElCollapseItem,
  ElUpload,
  ElSelect,
  ElOption,
  ElButton,
  ElDivider,
  ElInput,
  ElCheckbox,
  ElNotification,
  UploadProps,
  ElMessageBox,
  UploadUserFile,
  ElForm,
  ElFormItem,
  ElMessage,
  ElTable,
  ElTableColumn,
  ElDialog
} from 'element-plus'
import { FORM_IMAGES } from '@/utils/format'
import type { FormInstance, FormRules } from 'element-plus'
import moment from 'moment'
const { required } = useValidator()

const { t } = useI18n()

const { push } = useRouter()
const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })
const escape = useIcon({ icon: 'quill:escape' })
const collapse: Array<Collapse> = [
  {
    icon: minusIcon,
    name: 'customerInfo',
    title: t('formDemo.detailCollaborator')
  },
  {
    icon: plusIcon,
    name: 'ManageSalesHistoryAndCommissionPayments',
    title: t('reuse.ManageSalesHistoryAndCommissionPayments')
  }
]
// const disabled = ref(false)
const disabledTable = ref(false)

let CollaboratorId = ref()
const getGenCodeCollaborator = async () => {
  await getGenCodeCollaborators({})
    .then((res) => {
      CollaboratorId.value = res
    })
    .catch((err) => {
      console.error(err)
    })
}
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
let customerAddress = ref('')
// Call api danh sách khách hàng

const optionsCustomerApi = ref<Array<any>>([])
let optionCallCustomerAPi = 0
const callCustomersApi = async () => {
  if (optionCallCustomerAPi == 0) {
    const res = await getAllCustomer({ PageIndex: 1, PageSize: 1000 })
    const getCustomerResult = res.data
    if (Array.isArray(unref(getCustomerResult)) && getCustomerResult?.length > 0) {
      optionsCustomerApi.value = getCustomerResult.map((product) => ({
        label: product.code + ' | ' + product.name,
        value: product.code,
        address: product.address,
        isOrganization: product.isOrganization,
        name: product.name,
        taxCode: product.taxCode,
        phonenumber: product.phonenumber,
        email: product.email,
        representative: product.representative,
        bankId: product.bankId,
        accountName: product.accountName,
        accountNumber: product.accountNumber,
        bankName: product.bank?.name,
        CustomerId: product.id,
        cccd: product.cccd,
        cccdCreateAt: product.cccdCreateAt,
        cccdPlaceOfGrant: product.cccdPlaceOfGrant,
        sex: product.sex,
        doB: product.doB
      }))
    }
    profileCustomer.value = getCustomerResult
  }
  optionCallCustomerAPi++
}
let profileCustomer = ref()
let infoCompany = reactive({
  name: '',
  taxCode: '',
  phone: '',
  email: '',
  representative: '',
  phonenumber: '',
  address: '',
  bankId: '',
  accountName: '',
  accountNumber: '',
  bankName: '',
  CustomerId: '',
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
    infoCompany.name = result.name
    infoCompany.taxCode = result.taxCode
    infoCompany.email = result.email
    infoCompany.representative = result.representative
    infoCompany.phonenumber = result.phonenumber
    infoCompany.address = result.address
    infoCompany.bankId = result.bankId
    infoCompany.accountName = result.accountName
    infoCompany.accountNumber = result.accountNumber
    infoCompany.bankName = result.bankName
    infoCompany.CustomerId = result.CustomerId
    infoCompany.cccd = result.cccd
    infoCompany.cccdCreateAt = result.cccdCreateAt
    infoCompany.cccdPlaceOfGrant = result.cccdPlaceOfGrant
    infoCompany.sex = result.sex
    infoCompany.doB = result.doB
    if (!infoCompany.bankId) {
      ElNotification({
        message: t('reuse.CustomersDoNotBankAccount'),
        type: 'warning'
      })
    }
  } else {
    customerAddress.value = ''
  }
}
const ruleFormRef = ref<FormInstance>()
// eslint-disable-next-line vue/no-setup-props-destructure
const { register, methods, elFormRef } = useForm({
  ruleFormRef
})
let formValue = ref()
const getTableValue = async () => {
  if (!isNaN(id) && type != 'add') {
    const res = await getCollaboratorsById({ id: id })
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
const approvalId = String(router.currentRoute.value.params.approvalId)
//Lấy dữ liệu từ bảng khi ấn nút detail hoặc edit
const disabledForm = ref(false)

const centerDialogCancelAccount = ref(false)

//hủy tài khoản cộng tác viên
const cancelAccountCollabolator = async () => {
  const payload = {
    Id: id
  }
  const formDataPayLoad = FORM_IMAGES(payload)
  await cancelCustomerCollabolator(formDataPayLoad)
    .then(() => {
      ElNotification({
        message: 'Gửi yêu cầu hủy tài khoản thành công, đợi duyệt!',
        type: 'success'
      }),
      push({
          name: 'business.collaborators.collaboratorsList',
          params: { backRoute: 'business.collaborators.collaboratorsList' }
         })
    })
    .catch(() => {
      ElNotification({
        message: 'Hủy tài khoản thất bại',
        type: 'warning'
      })
    })
}

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
  Discount: number
  customersValue: any
  isActive?: boolean
  status?: string
}
type FormDataPost = {
  CustomerId: number
  Code: string
  Status: number
  Discount: number
  AccountNumber: string
  AccountName: string
  BankId: number | null
  Files?: any
}
const EmptyCustomData = {} as FormDataInput
let FormData = reactive(EmptyCustomData)
const customPostData = (FormData) => {
  const customData = {} as FormDataPost
  customData.Status = 0
  customData.CustomerId = parseInt(infoCompany.CustomerId)
  customData.Code = CollaboratorId.value
  customData.Discount = parseInt(FormData.Discount)
  customData.AccountNumber = infoCompany.accountNumber
  customData.AccountName = infoCompany.accountName
  customData.BankId = infoCompany.bankId ? parseInt(infoCompany.bankId) : null
  customData.Files = ListFileUpload.value
    .map((file) => file.raw)
    .filter((file) => file !== undefined)
  FormData.CollaboratorStatus ? (customData.Status = 1) : (customData.Status = 0)
  return customData
}
const cancel = async () => {
  push({
    name: 'business.collaborators.collaboratorsList',
    params: { backRoute: 'business.collaborators.collaboratorsList' }
  })
}
interface statusCollabType {
  name: string
  isActive?: boolean
  approveAt?: string
}

let arrayStatusCollab = ref(Array<statusCollabType>())
let statusCollab = ref('Khởi tạo mới')
const duplicateStatusButton = ref(false)

const ListFileUpload = ref<UploadUserFile[]>([])

const setFormValue = async () => {
  const { setValues } = methods
  if (formValue.value) {
    formValue.value?.collaboratorFiles.map((element) => {
      if (element.file !== null) {
        ListFileUpload.value.push({
          url: `${API_URL}${element?.file?.path}`,
          name: element?.file?.fileName
        })
      }
    })

    arrayStatusCollab.value = formValue.value.statusHistory
    
    if (arrayStatusCollab.value?.length) {
      arrayStatusCollab.value[arrayStatusCollab.value?.length - 1].isActive = true
      if (type != 'approval-collab')
      statusCollab.value = arrayStatusCollab.value[arrayStatusCollab.value?.length - 1]?.name
      else statusCollab.value = 'Duyệt khởi tạo tài khoản'
      if (arrayStatusCollab.value[arrayStatusCollab.value?.length - 1].approveAt)
        duplicateStatusButton.value = true
      else duplicateStatusButton.value = false
    }
    

    FormData.Discount = formValue.value.discount
    FormData.isActive = formValue.value.isActive
    FormData.status = formValue.value.status
    CollaboratorId.value = formValue.value.code
    infoCompany.name = formValue.value.accountName

    infoCompany.taxCode = formValue.value.customer?.taxCode
    infoCompany.representative = formValue.value.customer?.representative
    infoCompany.phonenumber = formValue.value.customer?.phonenumber
    infoCompany.email = formValue.value.customer?.email
    infoCompany.address = formValue.value.customer?.address
    infoCompany.accountName = formValue.value.accountName
    infoCompany.accountNumber = formValue.value.accountNumber
    infoCompany.bankName = formValue.value.bank?.name
    infoCompany.bankId = formValue.value.bankId
    infoCompany.CustomerId = formValue.value.customerId
    infoCompany.cccd = formValue.value.customer?.cccd
    infoCompany.cccdCreateAt = formValue.value.customer?.cccdCreateAt
    infoCompany.cccdPlaceOfGrant = formValue.value.customer?.cccdPlaceOfGrant
    infoCompany.sex = formValue.value.customer?.sex
    infoCompany.doB = formValue.value.customer?.doB
    if (formValue.value.status === 1) {
      FormData.CollaboratorStatus = true
    } else if (formValue.value.status === 0) {
      FormData.CollaboratorStatus = false
    }
    FormData.customersValue = {
      label: formValue.value.code + ' | ' + formValue.value.accountName,
      value: formValue.value.code
    }
    setValues(formValue.value)
  } else {
    setValues(formValue.value)
  }
}
const handleChange: UploadProps['onChange'] = async (_uploadFile, uploadFiles) => {
  ListFileUpload.value = uploadFiles
}

let FileDeleteIds: any = []
const beforeRemove = (uploadFile) => {
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
const rules = reactive<FormRules>({
  Discount: [
    required(),
    {
      validator: (_rule: any, value: any, callback: any) => {
        if (value > 100) {
          callback(new Error(t('reuse.checkDiscount')))
        }
        callback()
      },
      required: false,
      trigger: 'change'
    }
  ],
  customersValue: [required()]
})
const clear = async () => {
  ;(infoCompany.name = ''),
    (infoCompany.taxCode = ''),
    (infoCompany.phone = ''),
    (infoCompany.email = ''),
    (infoCompany.representative = ''),
    (infoCompany.phonenumber = ''),
    (infoCompany.address = ''),
    (infoCompany.bankId = ''),
    (infoCompany.accountName = ''),
    (infoCompany.accountNumber = ''),
    (infoCompany.bankName = ''),
    (infoCompany.CustomerId = '')
}
const buttonApproval = ref(false)
watch(
  () => type,
  () => {
    if (type === 'detail') {
      disabledForm.value = true
      disabledTable.value = true
    }
    if (type === 'detail' || type === 'edit' || type === 'approval-collab' ) {
      disabledTable.value = true
      getTableValue()
      buttonApproval.value = true
    }
    if (type === 'add' || type == ':type') {
      getGenCodeCollaborator()
      buttonApproval.value = false
      disabledTable.value = true
      FormData.CollaboratorStatus = false
    }
  },
  {
    deep: true,
    immediate: true
  }
)

if (type == 'add' || type == ':type')
  arrayStatusCollab.value.push({
    name: 'Khởi tạo mới',
    isActive: true,
    approveAt: moment().format('DD/MM/YYYY')
  })

const approvalFunction = async (checkApproved) => {
  const payload = { ItemType: 4, Id: parseInt(approvalId), IsApprove: checkApproved }
  await approvalOrder(FORM_IMAGES(payload))
  push({
    name: `approve.accounts-approval.collaborator-account`
  })
}

const approvalFunctionCancel = async (checkApproved) => {
  const payload = { ItemType: 4, Id: parseInt(approvalId), IsApprove: checkApproved }
  await approvalOrder(FORM_IMAGES(payload))
  .then(() => {
      ElNotification({
        message: 'Hủy tài khoản thành công!',
        type: 'success'
      }),
      push({
      name: `approve.accounts-approval.collaborator-account`
  })
    })
    .catch(() => {
      ElNotification({
        message: 'Hủy tài khoản thất bại',
        type: 'warning'
      })
    })
}

const save = async () => {
  submitForm(ruleFormRef.value)
  if (checkValidate.value) {
    const data = customPostData(FormData)
    if (data.BankId) {
      if (type === 'edit') {
        const payload = {
          id: id,
          FileDeleteIds: FileDeleteIds == '' ? null : FileDeleteIds,
          Files: data.Files.filter((file) => file !== undefined)
        }
        await updateCollaborators({ ...payload, ...data })
          .then(() => {
            ElNotification({
              message: t('reuse.updateSuccess'),
              type: 'success'
            }),
              push({
                name: 'business.collaborators.collaboratorsList',
                params: { backRoute: 'business.collaborators.collaboratorsList' }
              })
          })
          .catch(() =>
            ElNotification({
              message: t('reuse.updateFail'),
              type: 'warning'
            })
          )
      } else {
        await addNewCollaborators(FORM_IMAGES(data))
          .then(() => {
            ElNotification({
              message: t('reuse.addSuccess'),
              type: 'success'
            }),
              push({
                name: 'business.collaborators.collaboratorsList',
                params: { backRoute: 'business.collaborators.collaboratorsList' }
              })
          })
          .catch((error) =>
            ElNotification({
              message: error,
              type: 'warning'
            })
          )
      }
    } else {
      ElMessage.error(t('reuse.pleaseAddBankAccount'))
    }
  }
}
const utility = 'Utility'
const fix = async () => {
  push({
    name: `business.collaborators.collaboratorsList.${utility}`,
    params: { id: id, type: 'edit' }
  })
}
const activeName = ref(collapse[0].name)

const tableData = ref<Array<any>>([])
const orderList = ref<Array<any>>([])
const commissionPaymentList = ref<Array<any>>([])
const totalFinalPrice = ref(0)
const totalPriceCumulativeCom = ref(0)
const totalReceivePrice = ref(0)
const totalCumulativeCom = ref(0)

const getOrderByCollaborator = async () => {
  const res = await GetOrderByCollabolatorId({ Id: id })
  const obj = [...res?.data.data]
  if (obj) {
    orderList.value = [
      ...obj.map((val) => ({
        date: val.createdAt,
        code: val.code,
        commission: val.collaboratorCommission,
        totalPrice: val.totalPrice,
        paidMoney: val.paidMoney,
        cumulativeCom: 0
      }))
    ]
    getCommissionPaymentByCollaborator()
  }
}

const getCommissionPaymentByCollaborator = async () => {
  const res = await getCommissionPaymentByCollaboratorId({ Id: id })
  const obj = [...res?.data]
  if (obj) {
    commissionPaymentList.value = [
      ...obj.map((val) => ({
        date: val.createdAt,
        code: val.code,
        commission: formValue.value.discount,
        totalPrice: val.price,
        paidMoney: 0,
        cumulativeCom: 0
      }))
    ]
    tableData.value = orderList.value.concat(commissionPaymentList.value)
    tableData.value.sort(function (a, b) {
      var c: any = new Date(a.date)
      var d: any = new Date(b.date)
      return c - d
    })

    tableData.value.map((val) => {
      if (val.totalPrice) {
        totalFinalPrice.value += val.totalPrice
        totalPriceCumulativeCom.value += (val.commission * val.totalPrice) / 100
        totalReceivePrice.value += val.paidMoney
      }
    })
  }
}

onBeforeMount(() => {
  callCustomersApi()
  if (type == 'edit' || type == 'detail') {
    getOrderByCollaborator()
  }
})

const params = { id: id }
provide('parameters', {
  params
})
</script>
<template>
  <div class="demo-collapse dark:bg-[#141414]">
    <el-collapse v-model="activeName" @change="collapseChangeEvent">
      <el-collapse-item :icon="false" :name="collapse[0].name">
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
              hide-required-asterisk
              label-width="170px"
              @register="register"
              status-icon
            >
              <el-divider content-position="left">{{
                t('formDemo.profileCollaborator')
              }}</el-divider>

              <ElFormItem :label="t('formDemo.CollaboratorCode')" prop="CollaboratorId">
                <div class="ml-5">{{ CollaboratorId }}</div>
              </ElFormItem>
              <ElFormItem class="mb-7" :label="t('formDemo.discountCollaborator')" prop="Discount">
                <div class="flex">
                  <label><span class="text-red-600"> *</span></label>
                  <ElInput
                    v-model="FormData.Discount"
                    size="default"
                    :placeholder="t('formDemo.enterCommissionCalculatedOnOrderSales')"
                    :suffixIcon="h('div', '%')"
                    @change="(data) => (FormData.Discount = Number(data))"
                  />
                </div>
              </ElFormItem>
              <el-divider class="mt-10" content-position="left">{{
                t('reuse.customerInfo')
              }}</el-divider>
              <ElFormItem class="mt-5" :label="t('formDemo.chooseACustomer')" prop="customersValue">
                <div class="flex">
                  <label><span class="text-red-600"> *</span></label>
                  <ElSelect
                    v-model="FormData.customersValue"
                    filterable
                    @clear="clear()"
                    :clearable="false"
                    size="default"
                    :placeholder="t('formDemo.chooseACustomer')"
                    @change="changeAddressCustomer"
                  >
                    <ElOption
                      v-for="item in optionsCustomerApi"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </ElSelect>
                </div>
              </ElFormItem>
              <ElFormItem :label="t('formDemo.customerName')" v-if="infoCompany.name">
                <div class="leading-4">
                  <div class="ml-5">{{ infoCompany.name }}</div>
                </div>
              </ElFormItem>
              <ElFormItem :label="t('formDemo.taxCode')" v-if="infoCompany.taxCode">
                <div class="leading-4">
                  <div class="ml-5">{{ infoCompany.taxCode }}</div>
                </div>
              </ElFormItem>
              <ElFormItem :label="t('formDemo.represent')" v-if="infoCompany.representative">
                <div class="leading-4">
                  <div class="ml-5">{{ infoCompany.representative }}</div>
                </div>
              </ElFormItem>
              <ElFormItem
                class="w-[33%]"
                style="display: inline-block"
                :label="t('reuse.phoneNumber')"
                v-if="infoCompany.phonenumber"
              >
                <div class="leading-4">
                  <div class="ml-5">{{ infoCompany.phonenumber }}</div>
                </div>
              </ElFormItem>
              <ElFormItem
                class="w-[50%]"
                style="display: inline-block"
                :label="t('reuse.email')"
                v-if="infoCompany.email"
              >
                <div class="leading-4">
                  <div class="ml-5">{{ infoCompany.email }}</div>
                </div>
              </ElFormItem>
              <ElFormItem
                class="w-[35%]"
                style="display: inline-block"
                :label="t('reuse.citizenIdentificationNumber')"
                v-if="infoCompany.cccd"
              >
                <div class="leading-4">
                  <div class="ml-5">{{ infoCompany.cccd }}</div>
                </div>
              </ElFormItem>
              <ElFormItem
                style="display: inline-block"
                :label="t('formDemo.supplyDate')"
                v-if="infoCompany.cccdCreateAt"
              >
                <div class="leading-4">
                  <div class="ml-5">{{ dateTimeFormat(infoCompany.cccdCreateAt) }}</div>
                </div>
              </ElFormItem>
              <ElFormItem
                style="display: inline-block"
                :label="t('formDemo.supplyAddress')"
                v-if="infoCompany.cccdPlaceOfGrant"
              >
                <div class="leading-4">
                  <div class="ml-5">{{ infoCompany.cccdPlaceOfGrant }}</div>
                </div>
              </ElFormItem>
              <ElFormItem
                class="w-[33%]"
                style="display: inline-block"
                :label="t('reuse.dateOfBirth')"
                v-if="infoCompany.doB"
              >
                <div class="leading-4">
                  <div class="ml-5">{{ dateTimeFormat(infoCompany.doB) }}</div>
                </div>
              </ElFormItem>
              <ElFormItem
                style="display: inline-block"
                :label="t('reuse.gender')"
                v-if="infoCompany.taxCode"
              >
                <div class="leading-4">
                  <div class="ml-5">{{
                    infoCompany.sex ? t('reuse.male') : t('reuse.female')
                  }}</div>
                </div>
              </ElFormItem>
              <ElFormItem :label="t('formDemo.address')" v-if="infoCompany.address">
                <div class="leading-4">
                  <div class="ml-5">{{ infoCompany.address }}</div>
                </div>
              </ElFormItem>
              <ElFormItem
                style="align-items: flex-start"
                :label="t('reuse.accountBank')"
                v-if="infoCompany.bankId"
              >
                <div class="leading-4">
                  <div class="ml-5">{{ infoCompany.accountName }}</div>
                  <div class="ml-5">{{ infoCompany.accountNumber }}</div>
                  <div class="ml-5">{{ infoCompany.bankName }}</div>
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
                  class="upload-demo"
                  action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                  :limit="10"
                  :on-change="handleChange"
                  @before-remove="beforeRemove"
                  :auto-upload="false"
                  :multiple="true"
                  v-model:fileList="ListFileUpload"
                  :disabled="disabledForm"
                >
                  <el-button class="text-[#303133] font-medium dark:text-[#fff]"
                    >+ {{ t('formDemo.addPhotosOrFiles') }}</el-button
                  >
                </el-upload>
              </div>
            </div>
          </div>
        </div>

        <el-divider content-position="left">{{ t('reuse.statusAndAccount') }}</el-divider>

        <div class="flex gap-4 w-[100%] ml-1 items-center pb-3">
          <label class="ml-10">{{ t('formDemo.statusActive') }}</label>
          <div class="w-[75%] pl-1">
          <ElCheckbox
                  class="ml-5"
                  v-model="FormData.CollaboratorStatus"
                  :label="t('formDemo.isActive')"
                  size="large"
                  :disabled="type === 'add' || type == ':type'"
                />
          </div>
        </div>

        <div class="flex gap-4 w-[100%] ml-1 pb-3 mb-2">
          <label class="ml-10">{{ t('formDemo.statusAccount') }}</label>
          <div class="w-[75%]">
          <div class="flex items-center w-[100%]">
            <div
              class="duplicate-status"
              v-for="item in arrayStatusCollab"
              :key="item.name"
            >
              <div
                v-if="
                  item.name == 'Duyệt khởi tạo tài khoản' || item.name == 'Duyệt hủy tài khoản'
                "
              >
                
                <span
                  class="box box_1 custom-after text-yellow-500 dark:text-divck"
                  :class="{ active: item.isActive }"
                >
                  {{ item.name }}

                  <span class="triangle-right right_1"> </span>
                </span>
                <p v-if="item?.approveAt">{{
                  item?.approveAt ? dateTimeFormat(item?.approveAt) : ''
                }}</p>
                <p v-else class="text-transparent">s</p>
              </div>
              <div
                v-else-if="item.name == 'Khởi tạo mới'"
              >
                
                <span
                  class="box box_2 custom-after text-blue-500 dark:text-black"
                  :class="{ active: item.isActive }"
                >
                  {{ item.name }}
                  <span class="triangle-right right_2"> </span>
                </span>
                <p v-if="item?.approveAt">{{
                  item?.approveAt ? dateTimeFormat(item?.approveAt) : ''
                }}</p>
                <p v-else class="text-transparent">s</p>
              </div>
              <div v-else-if="item.name == 'Hủy tài khoản'">
                
                <span
                  class="box box_4 custom-after text-rose-500 dark:text-black"
                  :class="{ active: item.isActive }"
                >
                  {{ item.name }}
                  <span class="triangle-right right_4"> </span>
                </span>
                <p v-if="item?.approveAt">{{
                  item?.approveAt ? dateTimeFormat(item?.approveAt) : ''
                }}</p>
                <p v-else class="text-transparent">s</p>
              </div>
            </div>
          </div>
          </div>
        </div>

        <div class="edit-collab btn-type" v-if="type === 'edit'">
          <ElButton class="min-w-42" type="primary" plain @click="save()">
            {{ t('reuse.save') }}
          </ElButton>

          <ElButton class="min-w-42" plain @click="router.go(-1)">
            {{ t('reuse.cancel') }}
          </ElButton>
        </div>

        <div v-if="type === 'detail' && statusCollab =='Duyệt khởi tạo tài khoản' && duplicateStatusButton" class="flex btn-type">
          
          <ElButton class="min-w-42" type="primary" plain @click="fix()">
            {{ t('reuse.fix') }}
          </ElButton>
          <ElButton @click="centerDialogCancelAccount = true" type="danger" class="min-w-42">
            {{ t('formDemo.cancelAccount') }}
          </ElButton>
          <el-dialog
            v-model="centerDialogCancelAccount"
            :title="t('formDemo.cancelAccount')"
            width="30%"
            align-center
            class="font-semibold"
          >
            <div class="text-red-600">
              {{ t('reuse.cancelAccountCheck') }}
            </div>
            <template #footer>
              <span class="dialog-footer">
                <el-button
                  type="danger"
                  @click="
                    () => {
                      cancelAccountCollabolator()
                      centerDialogCancelAccount = false
                    }
                  "
                  class="min-w-36 min-h-10"
                  >{{ t('formDemo.cancelAccount') }}</el-button
                >
                <el-button @click="centerDialogCancelAccount = false" class="min-w-36 min-h-10">{{
                  t('reuse.exit')
                }}</el-button>
              </span>
            </template>
          </el-dialog>
        </div>
       
        <div v-else-if="type === 'approval-collab' && statusCollab    =='Duyệt khởi tạo tài khoản'" class="w-[100%] flex ml-50 gap-4">
            <el-button @click="approvalFunction(true)" type="warning" class="min-w-42 min-h-11">{{
              t('router.approve')
            }}</el-button>
            <el-button @click="approvalFunction(false)" class="min-w-42 min-h-11 rounded font-bold">{{
              t('router.notApproval')
            }}</el-button>
          </div>

          <div v-else-if="type === 'approval-collab' && statusCollab =='Duyệt hủy tài khoản'" class="w-[100%] flex ml-50 gap-4">
            <el-button @click="approvalFunctionCancel(true)" type="warning" class="min-w-42 min-h-11">{{
              t('router.approve')
            }}</el-button>
            <el-button @click="approvalFunction(false)" class="min-w-42 min-h-11 rounded font-bold">{{
              t('router.notApproval')
            }}</el-button>
          </div>

          <div v-else-if="type === 'add'" class="flex btn-type">
          <ElButton class="min-w-42" type="primary" @click="save()">
            {{ t('reuse.saveAndPending') }}
          </ElButton>
          <ElButton class="min-w-42" @click="cancel()"> {{ t('reuse.cancel') }} </ElButton>
        </div>
        
      </el-collapse-item>
      <el-collapse-item :name="collapse[1].title">
        <template #title>
          <el-button class="header-icon" :icon="collapse[1].icon" link />
          <span class="text-center text-xl">{{ collapse[1].title }}</span>
        </template>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="date" :label="t('reuse.date')" width="180">
            <template #default="data">
              {{ dateTimeFormat(data.row.date) }}
            </template>
          </el-table-column>
          <el-table-column prop="code" :label="t('reuse.orderCodepaymentCode')" width="300" />
          <el-table-column prop="commission" :label="t('reuse.percentDiscount')">
            <template #default="data">
              {{ data.row.commission + ' %' }}
            </template>
          </el-table-column>
          <el-table-column prop="totalPrice" :label="t('reuse.orderSales')" align="right">
            <template #default="data">
              {{ moneyFormat(data.row.totalPrice) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="priceCommission"
            :label="t('formDemo.intoDiscountComMoney')"
            align="right"
          >
            <template #default="data">
              {{ moneyFormat((data.row.totalPrice * data.row.commission) / 100) }}
            </template>
          </el-table-column>
          <el-table-column prop="paidMoney" :label="t('formDemo.spent')" align="right">
            <template #default="data">
              {{ moneyFormat(data.row.paidMoney) }}
            </template>
          </el-table-column>
          <el-table-column prop="cumulativeCom" :label="t('formDemo.cumulativeCom')" align="right">
            <template #default="data">
              {{ moneyFormat(data.row.cumulativeCom) }}
            </template>
          </el-table-column>
        </el-table>
        <div class="flex justify-end">
          <div v-if="totalFinalPrice > 0" class="font-bold">{{ moneyFormat(totalFinalPrice) }}</div>
          <div v-if="totalPriceCumulativeCom > 0" class="font-bold pl-3">{{
            moneyFormat(totalPriceCumulativeCom)
          }}</div>
          <div v-if="totalReceivePrice > 0" class="font-bold pl-3">{{
            moneyFormat(totalReceivePrice)
          }}</div>
          <div v-if="totalCumulativeCom > 0" class="font-bold pl-3">{{
            moneyFormat(totalCumulativeCom)
          }}</div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style scoped>
::v-deep(.el-select) {
  width: 100%;
}

.box {
  padding: 0 10px 0 20px;
  position: relative;
  display: flex;
  width: fit-content;
  align-items: center;
  border: 1px solid #ccc;
  background-color: #ccc;
  opacity: 0.6;
}

.box_1 {
  border: 1px solid #fff0d9;
  background-color: #fff0d9;
}

.box_2 {
  border: 1px solid #f4f8fd;
  background-color: #f4f8fd;
}

.box_3 {
  border: 1px solid #d9d9d9;
  background-color: #d9d9d9;
}

.box_4 {
  border: 1px solid #fce5e1;
  background-color: #fce5e1;
}
.duplicate-status + .duplicate-status {
  margin-left: 10px;
}
.active {
  opacity: 1 !important;
}
.right_1 {
  border-left: 11px solid #fff0d9 !important;
}
.right_2 {
  border-left: 11px solid #f4f8fd !important;
}

.right_3 {
  border-left: 11px solid #d9d9d9 !important;
}

.right_4 {
  border-left: 11px solid #fce5e1 !important;
}
.triangle-right {
  position: absolute;
  right: -12px;
  width: 0;
  height: 0;
  border-top: 13px solid transparent;
  border-bottom: 12px solid transparent;
  border-left: 11px solid #ccc;
}

.custom-after::after {
  content: '';
  position: absolute;
  z-index: 1998;
  width: 11px;
  border-style: solid;
  height: 100%;
  left: -1px;
  border-bottom-width: 12px;
  border-left-width: 10px;
  border-top-width: 12px;
  border-bottom-color: transparent;border-top-color: transparent;
  --tw-border-opacity: 1;
  border-left-color: rgba(255, 255, 255, var(--tw-border-opacity));
}
.dark .dark\:border-l-black {
  --tw-border-opacity: 1;
  border-left-color: rgba(0, 0, 0, var(--tw-border-opacity));
}

.dark .dark\:bg-transparent {
  background-color: transparent;
}

::v-deep(.el-textarea__inner) {
  box-shadow: none;
  padding: 5px 0;
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
  margin: 40px 0 24px 0;
}
::v-deep(.el-input) {
  width: auto;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}

::v-deep(.el-table th.el-table__cell) {
  padding: 0 !important;
}

::v-deep(.el-input) {
  width: 100%;
}

.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
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
::v-deep(.el-input__wrapper) {
  margin-left: 15px;
}
::v-deep(.el-form-item__error) {
  margin-left: 20px;
}

::v-deep(.el-dialog__header) {
  border-bottom: 1px solid rgb(214, 209, 209);
  margin-right: 0;
}

.header-icon {
  margin-right: 10px;
}
::v-deep(.el-form-item__label) {
  padding: 0;
}
.after {
  display: flex;
  align-items: center;
}

.btn-type {
  margin-left: 190px;
}
</style>
