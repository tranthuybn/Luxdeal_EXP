<script setup lang="ts">
import { useIcon } from '@/hooks/web/useIcon'
import { Collapse } from '../../Components/Type'
import { dateTimeFormat } from '@/utils/format'

import { h, onBeforeMount, provide, reactive, ref, unref, watch } from 'vue'
import { useForm } from '@/hooks/web/useForm'
import { TableBase } from '../../Components/TableBase/index'
import { useI18n } from '@/hooks/web/useI18n'
import {
  getCollaboratorsById,
  getGenCodeCollaborators,
  addNewCollaborators,
  updateCollaborators
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
  ElMessage
} from 'element-plus'
import { FORM_IMAGES } from '@/utils/format'
import type { FormInstance, FormRules } from 'element-plus'
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
const tableColumn = reactive<TableColumn[]>([
  {
    field: 'date',
    label: t('reuse.date'),
    minWidth: '150'
  },
  {
    field: 'code',
    label: t('reuse.orderCode') + '/' + t('formDemo.withdrawalRequestCode'),
    minWidth: '350'
  },
  {
    field: 'discount',
    label: '%' + t('formDemo.discount'),
    minWidth: '150'
  },
  {
    field: 'orderSales',
    label: t('reuse.orderSales'),
    minWidth: '150',
    align: 'right'
  },
  {
    field: 'intoDiscountComMoney',
    label: t('formDemo.intoDiscountComMoney'),
    minWidth: '150',
    align: 'center'
  },
  {
    field: 'spent',
    label: t('formDemo.spent'),
    minWidth: '150',
    align: 'center'
  },
  {
    field: 'cumulativeCom',
    label: t('formDemo.cumulativeCom'),
    minWidth: '150',
    align: 'center'
  }
])
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
//Lấy dữ liệu từ bảng khi ấn nút detail hoặc edit
const disabledForm = ref(false)

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
  Discount: string
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
// const cancel = () => {
//   go(-1)
// }
const ListFileUpload = ref<UploadUserFile[]>([])

const setFormValue = async () => {
  const { setValues } = methods
  if (formValue.value) {
    formValue.value?.collaboratorFiles.map((element) => {
      if (element.file !== null) {
        ListFileUpload.value.push({
          url: `${API_URL}${element?.file?.path}`,
          name: element?.file?.fileName,
          id: element?.file?.id
        })
      }
    })
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
onBeforeMount(() => {
  callCustomersApi()
})
let FileDeleteIds: any = []
const beforeRemove: UploadProps['beforeRemove'] = (uploadFile) => {
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
watch(
  () => type,
  () => {
    if (type === 'detail') {
      disabledForm.value = true
      disabledTable.value = true
    }
    if (type === 'detail' || type === 'edit') {
      // getTableValue()
      disabledTable.value = true
      getTableValue()
    }
    if (type === 'add' || type == ':type') {
      getGenCodeCollaborator()
      disabledTable.value = true
      FormData.CollaboratorStatus = false
    }
  },
  {
    deep: true,
    immediate: true
  }
)
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
                    :formatter="(value) => value.replace(/^[^0-9,]*$/gm, '')"
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
              <el-divider content-position="left">{{ t('reuse.statusAndAccount') }}</el-divider>

              <ElFormItem :label="t('reuse.status')" style="align-items: flex-start">
                <div class="flex items-center w-[80%] gap-4">
                  <ElCheckbox
                    class="ml-5"
                    v-model="FormData.CollaboratorStatus"
                    :label="t('formDemo.isActive')"
                    size="large"
                    :disabled="type === 'add' || type == ':type'"
                  />
                </div>
                <div class="flex gap-2 pb-8">
                  <div
                    v-if="type === 'add' || type === ':type' || FormData.isActive == false"
                    class="w-[80%]"
                    ><span
                      class="pl-4 ml-5 pr-6 bg-[#FFF0D9] text-[#FEB951] leading-5 dark:bg-transparent"
                      >{{ t('reuse.approval') }}</span
                    >
                  </div>
                  <div v-else class="w-[80%]"
                    ><span
                      class="bg-[#1C6DD0] pl-4 pr-6 text-[#FFFFFF] leading-5 dark:bg-transparent"
                      >{{ t('reuse.confirmed') }}</span
                    >
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
                  <el-button class="text-[#303133] font-medium dark:text-[#fff]"
                    >+ {{ t('formDemo.addPhotosOrFiles') }}</el-button
                  >
                </el-upload>
              </div>
            </div>
          </div>
        </div>

        <div v-if="type === 'edit'" class="flex btn-type">
          <ElButton class="min-w-42" type="primary" plain @click="save()">
            {{ t('reuse.fix') }}
          </ElButton>
          <ElButton type="danger" class="min-w-42"> {{ t('formDemo.cancelAccount') }} </ElButton>
        </div>
        <div v-else-if="type === 'detail'" class="flex btn-type">
          <ElButton class="min-w-42" type="primary" plain @click="fix()">
            {{ t('reuse.fix') }}
          </ElButton>
        </div>
        <div v-else class="flex btn-type">
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
        <TableBase
          :removeDrawer="false"
          :expand="false"
          :customOperator="1"
          :paginationType="false"
          ref="tableBase01"
          :api="getCollaboratorsById"
          :maxHeight="'69vh'"
          :fullColumns="tableColumn"
          :selection="false"
        />
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
::v-deep(.el-input__wrapper) {
  margin-left: 15px;
}
::v-deep(.el-form-item__error) {
  margin-left: 20px;
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
