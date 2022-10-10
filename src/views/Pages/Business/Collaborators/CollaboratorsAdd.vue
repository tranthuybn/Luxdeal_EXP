<script setup lang="ts">
import { useIcon } from '@/hooks/web/useIcon'
import { Collapse } from '../../Components/Type'
import { h, onBeforeMount, reactive, ref, unref, watch } from 'vue'
import { useForm } from '@/hooks/web/useForm'
import { TableBase } from '../../Components/TableBase/index'
import { useI18n } from '@/hooks/web/useI18n'
import {
  getCollaboratorsById,
  getGenCodeCollaborators,
  addNewCollaborators,
  updateCollaborators
} from '@/api/Business'
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
  },
  {
    icon: plusIcon,
    name: 'information',
    title: t('reuse.ManageSalesHistoryAndCommissionPayments')
  }
]
const tableColumn = [
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

const optionsCustomerApi = ref<Array<any>>([])
let optionCallCustomerAPi = 0
const callCustomersApi = async () => {
  if (optionCallCustomerAPi == 0) {
    const res = await getAllCustomer({ PageIndex: 1, PageSize: 1000 })
    const getCustomerResult = res.data
    if (Array.isArray(unref(getCustomerResult)) && getCustomerResult?.length > 0) {
      optionsCustomerApi.value = getCustomerResult.map((product) => ({
        label: product.representative
          ? product.representative + ' | MST ' + product.taxCode
          : product.name + ' | ' + product.phonenumber,
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
        bankName: product.bank.name,
        CustomerId: product.id
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
  CustomerId: ''
})
const changeAddressCustomer = (data) => {
  if (data) {
    // customerAddress.value = optionsCustomerApi.value.find((e) => e.value == data)?.address ?? ''
    const result = optionsCustomerApi.value.find((e) => e.value == data)
    if (result.isOrganization) {
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
    } else {
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
}
type FormDataPost = {
  CustomerId: number
  Code: string
  Status: number
  Discount: number
  AccountNumber: string
  AccountName: string
  BankId: number
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
  customData.BankId = parseInt(infoCompany.bankId)
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
    if (formValue.value.status === 1) {
      FormData.CollaboratorStatus = true
    } else if (formValue.value.status === 0) {
      FormData.CollaboratorStatus = false
    }
    FormData.customersValue = {
      label: formValue.value.accountName + ' | MST ' + formValue.value.customer?.taxCode,
      value: formValue.value.id
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
    },
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
  customersValue: [
    {
      required: true,
      message: t('common.selectText'),
      trigger: 'blur'
    }
  ]
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
const save = async () => {
  submitForm(ruleFormRef.value)
  if (checkValidate.value) {
    const data = customPostData(FormData)
    if (type === 'edit') {
      const payload = {
        id: id,
        FileDeleteIds: FileDeleteIds == '' ? null : FileDeleteIds,
        Files: data.Files.filter((file) => file !== undefined)
      }
      await updateCollaborators({ ...payload, ...data })
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
    } else {
      await addNewCollaborators(FORM_IMAGES(data))
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
    }
    push({
      name: 'business.collaborators.collaboratorsList',
      params: { backRoute: 'business.collaborators.collaboratorsList' }
    })
  }
}
const utility = 'Utility'
const fix = async () => {
  push({
    name: `business.collaborators.collaboratorsList.${utility}`,
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

              <ElFormItem :label="t('formDemo.CollaboratorCode')" prop="CollaboratorId">
                <div>{{ CollaboratorId }}</div>
              </ElFormItem>
              <ElFormItem :label="t('formDemo.discountCollaborator')" prop="Discount">
                <ElInput
                  v-model="FormData.Discount"
                  size="default"
                  :placeholder="t('formDemo.enterCommissionCalculatedOnOrderSales')"
                  :suffixIcon="h('div', '%')"
                />
              </ElFormItem>
              <ElFormItem class="mb-4" :label="t('formDemo.chooseACustomer')" prop="customersValue">
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
              </ElFormItem>
              <ElFormItem :label="t('formDemo.customerName')" v-if="infoCompany.name !== ''">
                <div class="leading-6 mt-2">
                  <div>{{ infoCompany.name }}</div>
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
              <el-divider content-position="left">{{ t('reuse.statusAndAccount') }}</el-divider>

              <ElFormItem :label="t('reuse.status')" style="align-items: flex-start">
                <div class="flex items-center w-[80%] gap-4">
                  <ElCheckbox
                    v-model="FormData.CollaboratorStatus"
                    :label="t('formDemo.isActive')"
                    size="large"
                    :disabled="type === 'add' || type === ''"
                  />
                </div>
                <div class="flex gap-2 pb-8">
                  <div class="w-[80%]"
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
          <ElButton class="min-w-42" type="primary" plain @click="save()">
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
          <ElButton class="min-w-42" type="primary" @click="save()">
            {{ t('reuse.saveAndPending') }}
          </ElButton>
          <ElButton class="min-w-42" @click="cancel()"> {{ t('reuse.cancel') }} </ElButton>
        </div>
      </el-collapse-item>
      <el-collapse-item :disabled="disabledTable" name="2">
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
          :api="''"
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
