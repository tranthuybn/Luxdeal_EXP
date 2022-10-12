<script setup lang="ts">
import { dateTimeFormat } from '@/utils/format'

import { useIcon } from '@/hooks/web/useIcon'
import { Collapse } from '../../Components/Type'
import { h, onBeforeMount, reactive, ref, unref, watch } from 'vue'
import { useForm } from '@/hooks/web/useForm'
import MultipleOptionsBox from '@/components/MultipleOptionsBox.vue'
import { useI18n } from '@/hooks/web/useI18n'
import {
  getCommissionPaymentByIdList,
  getGenCodeCollaborators,
  addNewPaymentRequest,
  updateCollaborators,
  getCollaboratorsList,
  getPaymentList,
  getReceiptPaymentList
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
  ElInput,
  ElCheckbox,
  ElNotification,
  UploadProps,
  ElMessageBox,
  UploadUserFile,
  ElForm,
  ElFormItem,
  ElMessage
} from 'element-plus'
import { FORM_IMAGES } from '@/utils/format'
import type { FormInstance, FormRules } from 'element-plus'
const { t } = useI18n()

const { push } = useRouter()
const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })
const escape = useIcon({ icon: 'quill:escape' })
const collapse: Array<Collapse> = [
  {
    icon: minusIcon,
    name: 'information',
    title: t('reuse.customerInfo')
  }
]
const dialogVisible = ref(false)
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
  CollaboratorId
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

// Call api danh sách sản phẩm
let listReceiptPaymentRequest = ref()
let listPaymentRequest = ref()
const listPayments = ref()
let optionsPaymentApi = ref()
let optionsReceiptPaymentApi = ref()

let optionCallAPi = 0
const callAPiPaymentRequest = async () => {
  if (optionCallAPi == 0) {
    const res = await getPaymentList({})
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
      paymentType: payment.paymentType ? 'Thu' : 'Chi',
      totalMoney: payment.totalMoney,
      createdAt: dateTimeFormat(payment.createdAt),
      createdBy: payment.createdBy
    }))
    optionReceiptPaymentCallAPi++
    listReceiptPaymentRequest.value = optionsReceiptPaymentApi.value
  }
}
const ReceiptOrPaymentId = ref()
const changeNameReceiptPayment = (_value, obj, _scope) => {
  ReceiptOrPaymentId.value = obj.code
}
const PaymentId = ref()
const changeNamePayment = (_value, obj, _scope) => {
  PaymentId.value = obj.code
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
        CollaboratorId: collaborator.id
      }))
    }
    profileCustomer.value = getCustomerResult
  }
  optionCallCustomerAPi++
}
let profileCustomer = ref()
let infoCompany = reactive({
  code: '',
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
  CollaboratorId: ''
})
const changeAddressCustomer = (data) => {
  if (data) {
    // customerAddress.value = optionsCustomerApi.value.find((e) => e.value == data)?.address ?? ''
    const result = optionsCustomerApi.value.find((e) => e.value == data)
    if (result.isOrganization) {
      customerAddress.value = optionsCustomerApi.value.find((e) => e.value == data)?.address ?? ''
      infoCompany.accountNumber = result.accountNumber
      infoCompany.taxCode = result.taxCode
      infoCompany.email = result.email
      infoCompany.representative = result.representative
      infoCompany.phonenumber = result.phonenumber
      infoCompany.address = result.address
      infoCompany.bankId = result.bankId
      infoCompany.accountName = result.accountName
      infoCompany.accountNumber = result.accountNumber
      infoCompany.bankName = result.bankName
      infoCompany.CollaboratorId = result.CollaboratorId
    } else {
      customerAddress.value = optionsCustomerApi.value.find((e) => e.value == data)?.address ?? ''
      infoCompany.accountNumber = result.accountNumber
      infoCompany.taxCode = result.taxCode
      infoCompany.email = result.email
      infoCompany.representative = result.representative
      infoCompany.phonenumber = result.phonenumber
      infoCompany.address = result.address
      infoCompany.bankId = result.bankId
      infoCompany.accountName = result.accountName
      infoCompany.accountNumber = result.accountNumber
      infoCompany.bankName = result.bankName
      infoCompany.CollaboratorId = result.CollaboratorId
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
      console.log('submit!')
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
    if (type === 'add') {
      getGenCodeCollaborator()

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
      save('add')
    }
  }
)
defineExpose({
  elFormRef,
  getFormData: methods.getFormData
})

type FormDataInput = {
  CollaboratorStatus: boolean
  Price: string
  collaboratorValue: any
}
type FormDataPost = {
  CollaboratorId: number
  Code: string
  Status?: number
  Price: number
  ReceiptOrPaymentVoucherId: string
  PaymentOrder: string
  Files?: any
}
const EmptyCustomData = {} as FormDataInput
let FormData = reactive(EmptyCustomData)
const customPostData = (FormData) => {
  const customData = {} as FormDataPost
  customData.CollaboratorId = parseInt(infoCompany.CollaboratorId)
  customData.Code = CollaboratorId.value
  customData.Price = parseInt(FormData.Price)
  customData.ReceiptOrPaymentVoucherId = ReceiptOrPaymentId.value
  customData.PaymentOrder = PaymentId.value
  customData.Files = ListFileUpload.value.map((file) => file.raw)
  return customData
}
const cancel = async () => {
  push({
    name: 'business.collaborators.collaboratorsList',
    params: { backRoute: 'business.collaborators.collaboratorsList' }
  })
}

// const cancel = () => {
//   go(-1)
// }
const ListFileUpload = ref<UploadUserFile[]>([])
const handleChange: UploadProps['onChange'] = async (_uploadFile, uploadFiles) => {
  ListFileUpload.value = uploadFiles
}
onBeforeMount(() => {
  callCustomersApi()
  callAPiPaymentRequest()
  callAPiReceiptPaymentRequest()
  getGenCodeCollaborator()
})
const beforeRemove: UploadProps['beforeRemove'] = (uploadFile) => {
  return ElMessageBox.confirm(`Cancel the transfert of ${uploadFile.name} ?`).then(
    () => true,
    () => false
  )
}
const setFormValue = async () => {
  const { setValues } = methods
  console.log('formValue', formValue.value)
  if (formValue.value) {
    FormData.Price = formValue.value.price
    infoCompany.code = formValue.value.code
    infoCompany.accountNumber = formValue.value.accountName
    infoCompany.taxCode = formValue.value.customer?.taxCode
    infoCompany.representative = formValue.value.customer?.representative
    infoCompany.phonenumber = formValue.value.customer?.phonenumber
    infoCompany.email = formValue.value.customer?.email
    infoCompany.address = formValue.value.customer?.address
    infoCompany.accountName = formValue.value.accountName
    infoCompany.accountNumber = formValue.value.accountNumber
    infoCompany.bankName = formValue.value.bank?.name
    infoCompany.bankId = formValue.value.bankId
    infoCompany.CollaboratorId = formValue.value.CollaboratorId
    console.log('ListFileUpload', ListFileUpload.value)
    if (formValue.value.status === 1) {
      FormData.CollaboratorStatus = true
    } else if (formValue.value.status === 0) {
      FormData.CollaboratorStatus = false
    }
    FormData.collaboratorValue = {
      label: formValue.value.accountName + ' | MST ' + formValue.value.customer?.taxCode,
      value: formValue.value.id
    }
    formValue.value?.collaboratorFiles.map((element) => {
      if (element.file !== null) {
        ListFileUpload.value.push({
          url: `${API_URL}${element?.file?.path}`,
          name: element?.file?.fileName
        })
      }
    })
    setValues(formValue.value)
  } else {
    console.log('FormData', FormData)
    setValues(formValue.value)
  }
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
    (infoCompany.bankId = ''),
    (infoCompany.accountName = ''),
    (infoCompany.accountNumber = ''),
    (infoCompany.bankName = ''),
    (infoCompany.CollaboratorId = '')
}
const save = async (typebtn) => {
  submitForm(ruleFormRef.value)
  if (checkValidate.value) {
    const data = customPostData(FormData)
    console.log('type', typebtn)
    if (typebtn === 'add') {
      await addNewPaymentRequest(FORM_IMAGES(data))
        .then(() =>
          ElNotification({
            message: t('reuse.addSuccess'),
            type: 'success'
          })
        )
        .catch((error) =>
          ElNotification({
            message: error,
            type: 'warning'
          })
        )
    } else if (typebtn === 'edit') {
      await updateCollaborators(FORM_IMAGES(data))
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
    push({
      name: `${String(router.currentRoute)}`
    })
  }
}
const fix = async () => {
  push({
    name: `${String(router.currentRoute.value.name)}`,
    params: { id: id, type: 'edit' }
  })
}
const activeName = ref('1')
</script>
<template>
  <div class="demo-collapse dark:bg-[#141414]">
    <el-collapse v-model="activeName" @change="collapseChangeEvent">
      <el-collapse-item :icon="false" name="1">
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
              <ElFormItem :label="t('reuse.collaboratorsCode')" v-if="infoCompany.code !== ''">
                <div class="leading-6 mt-2">
                  <div>{{ infoCompany.code }}</div>
                </div>
              </ElFormItem>
              <ElFormItem
                :label="t('reuse.collaboratorsName')"
                v-if="infoCompany.accountName !== ''"
              >
                <div class="leading-6 mt-2">
                  <div>{{ infoCompany.accountName }}</div>
                </div>
              </ElFormItem>
              <ElFormItem :label="t('formDemo.taxCode')" v-if="infoCompany.taxCode !== ''">
                <div class="leading-6 mt-2">
                  <div>{{ infoCompany.taxCode }}</div>
                </div>
              </ElFormItem>
              <ElFormItem :label="t('formDemo.represent')" v-if="infoCompany.representative !== ''">
                <div class="leading-6 mt-2">
                  <div>{{ infoCompany.representative }}</div>
                </div>
              </ElFormItem>
              <ElFormItem :label="t('reuse.phoneNumber')" v-if="infoCompany.phonenumber !== ''">
                <div class="leading-6 mt-2">
                  <div>{{ infoCompany.phonenumber }}</div>
                </div>
              </ElFormItem>
              <ElFormItem :label="t('reuse.email')" v-if="infoCompany.email !== ''">
                <div class="leading-6 mt-2">
                  <div>{{ infoCompany.email }}</div>
                </div>
              </ElFormItem>
              <ElFormItem :label="t('formDemo.address')" v-if="infoCompany.address !== ''">
                <div class="leading-6 mt-2">
                  <div>{{ infoCompany.address }}</div>
                </div>
              </ElFormItem>
              <ElFormItem
                style="align-items: flex-start"
                :label="t('reuse.accountBank')"
                v-if="infoCompany.taxCode !== ''"
              >
                <div class="leading-6 mt-2">
                  <div>{{ infoCompany.accountName }}</div>
                  <div>{{ infoCompany.accountNumber }}</div>
                  <div>{{ infoCompany.bankName }}</div>
                </div>
              </ElFormItem>
              <el-divider content-position="left">{{ t('router.paymentRequests') }}</el-divider>
              <ElFormItem :label="t('reuse.codeRequest')" prop="CollaboratorId">
                <div>{{ CollaboratorId }}</div>
              </ElFormItem>
              <ElFormItem :label="t('reuse.amountOfMoney')" prop="Price">
                <ElInput
                  v-model="FormData.Price"
                  size="default"
                  :placeholder="t('reuse.placeholderMoney')"
                  :suffixIcon="h('div', 'đ')"
                />
              </ElFormItem>
              <ElFormItem :label="t('router.receiptsAndExpenditures')">
                <MultipleOptionsBox
                  style="width: 78%; margin-right: 2%"
                  :fields="[
                    t('reuse.proposalCode'),
                    t('reuse.receiptAndPayment'),
                    t('reuse.amountOfMoney'),
                    t('reuse.createDate'),
                    t('reuse.creator')
                  ]"
                  filterable
                  :items="listReceiptPaymentRequest"
                  valueKey="code"
                  labelKey="code"
                  :hiddenKey="['id']"
                  :placeHolder="'Chọn mã sản phẩm'"
                  @focus="callAPiReceiptPaymentRequest()"
                  :clearable="false"
                  @update-value="(value, obj) => changeNameReceiptPayment(value, obj, $props)"
                />
                <el-button :icon="plusIcon" style="padding: 8px 34px">{{
                  t('reuse.createNew')
                }}</el-button>
              </ElFormItem>
              <ElFormItem :label="t('router.paymentProposal')">
                <template #default="props">
                  <MultipleOptionsBox
                    style="width: 78%; margin-right: 2%"
                    :fields="[
                      t('reuse.proposalCode'),
                      t('reuse.receiptAndPayment'),
                      t('reuse.amountOfMoney'),
                      t('reuse.createDate'),
                      t('reuse.creator')
                    ]"
                    filterable
                    :items="listPaymentRequest"
                    valueKey="code"
                    labelKey="code"
                    :hiddenKey="['id']"
                    :placeHolder="'Chọn mã sản phẩm'"
                    @focus="callAPiPaymentRequest()"
                    :clearable="false"
                    @update-value="(value, obj) => changeNamePayment(value, obj, props)"
                  />
                  <el-button :icon="plusIcon" style="padding: 8px 34px">{{
                    t('reuse.createNew')
                  }}</el-button>
                </template>
                <!-- <el-select
                  v-model="value"
                  :placeholder="t('reuse.choosePaymentProposal')"
                  style="width: 78%; margin-right: 2%"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select> -->
              </ElFormItem>
              <ElFormItem :label="t('formDemo.statusPayment')" style="align-items: flex-start">
                <div class="block items-center w-[100%] gap-4">
                  <ElCheckbox
                    v-model="FormData.CollaboratorStatus"
                    :label="t('formDemo.alreadyPaidForTt')"
                    size="large"
                    :disabled="type === 'add' || type === ''"
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
                  class="upload-demo"
                  action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                  :limit="10"
                  :on-change="handleChange"
                  :before-remove="beforeRemove"
                  :auto-upload="false"
                  :multiple="true"
                  v-model:fileList="ListFileUpload"
                  :disabled="disabledForm"
                >
                  <el-dialog v-model="dialogVisible">
                    <div class="text-[#303133] font-medium dark:text-[#fff]"
                      >+ {{ t('formDemo.addPhotosOrFiles') }}</div
                    >
                  </el-dialog>
                </el-upload>
              </div>
            </div>
          </div>
        </div>

        <div v-if="type === 'edit'" class="flex justify-center">
          <ElButton class="min-w-42" type="primary" plain @click="save('edit')">
            {{ t('reuse.fix') }}
          </ElButton>
          <ElButton type="danger" class="min-w-42"> {{ t('formDemo.cancelAccount') }} </ElButton>
        </div>
        <div v-else-if="type === 'detail'" class="flex justify-center">
          <ElButton class="min-w-42" type="primary" plain @click="fix()">
            {{ t('reuse.fix') }}
          </ElButton>
        </div>
        <div v-else class="flex justify-center">
          <ElButton class="min-w-42" type="primary" @click="save('add')">
            {{ t('reuse.save') }}
          </ElButton>
          <ElButton class="min-w-42" @click="cancel()"> {{ t('reuse.cancel') }} </ElButton>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style scoped>
::v-deep(.el-select) {
  width: 100%;
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
.header-icon {
  margin-right: 10px;
}
.after {
  display: flex;
  align-items: center;
}
</style>
