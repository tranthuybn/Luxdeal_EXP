<script setup lang="ts">
import { useIcon } from '@/hooks/web/useIcon'
import { Collapse } from '../../Components/Type'
import { h, onBeforeMount, reactive, ref, unref, watch } from 'vue'
import { useForm } from '@/hooks/web/useForm'
import { TableBase } from '../../Components/TableBase/index'
import { useI18n } from '@/hooks/web/useI18n'
import { useValidator } from '@/hooks/web/useValidator'
import {
  getCollaboratorsById,
  getGenCodeCollaborators,
  addNewCollaborators,
  updateCollaborators
} from '@/api/Business'
import { useRouter } from 'vue-router'
import { getAllCustomer } from '@/api/Business'
import { Form } from '@/components/Form'
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
  UploadUserFile
} from 'element-plus'
import { FORM_IMAGES } from '@/utils/format'
const { required, ValidService, notSpecialCharacters } = useValidator()
const { t } = useI18n()
const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })
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
const newList = reactive<FormSchema[]>([
  {
    field: 'profileCollaborator',
    label: t('formDemo.profileCollaborator'),
    component: 'Divider'
  },
  {
    field: 'codeCollaborator',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'discountCollaborator',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('formDemo.enterDiscount')
    }
  },
  {
    field: 'customerInfo',
    label: t('reuse.customerInfo'),
    component: 'Divider'
  },
  {
    field: 'chooseACustomer',
    component: 'Select',
    colProps: {
      span: 24
    }
  },
  {
    field: 'companyInformation',
    component: 'Input',
    colProps: {
      span: 12
    }
  },
  {
    field: 'statusAndAccount',
    label: t('reuse.statusAndAccount'),
    component: 'Divider'
  },
  {
    field: 'status',
    component: 'Checkbox',
    value: [],
    colProps: {
      span: 24
    }
  }
])
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
// eslint-disable-next-line vue/no-setup-props-destructure
const { register, methods, elFormRef } = useForm({
  newList
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

// get data from router
const router = useRouter()
const id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)
//Lấy dữ liệu từ bảng khi ấn nút detail hoặc edit
watch(
  () => type,
  () => {
    if (type === 'detail') {
      const { setProps } = methods
      setProps({
        disabled: true
      })
    }
    if (type === 'detail' || type === 'edit') {
      getTableValue()
    }
    if (type === 'add') {
      getGenCodeCollaborator()
      const { setProps } = methods
      setProps({
        disabledTable: true
      })
    }
  },
  {
    deep: true,
    immediate: true
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
let customersValue = ref()
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
  customData.Files = ListFileUpload.value.map((file) => file.raw)
  FormData.CollaboratorStatus ? (customData.Status = 1) : (customData.Status = 0)
  return customData
}
const { go } = useRouter()
const save = async (typebtn) => {
  const data = customPostData(FormData)
  if (typebtn === 'save') {
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
    if (type === 'add') {
      go(-1)
    } else {
      FormData.CollaboratorStatus = false
      FormData.Discount = ''
      infoCompany.name = ''
      infoCompany.taxCode = ''
      infoCompany.representative = ''
      infoCompany.phonenumber = ''
      infoCompany.email = ''
      infoCompany.address = ''
      customersValue = ref()
      ListFileUpload.value = []
    }
  } else if (type === 'fix') {
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
    console.log('1', formValue.value)
    console.log('FormData', FormData)
    FormData.Discount = formValue.value.discount
    console.log('FormData', FormData)
    CollaboratorId.value = formValue.value.code
    infoCompany.name = formValue.value.accountName
    infoCompany.taxCode = formValue.value.customer.taxCode
    infoCompany.representative = formValue.value.customer.representative
    infoCompany.phonenumber = formValue.value.customer.phonenumber
    infoCompany.email = formValue.value.customer.email
    infoCompany.address = formValue.value.customer.address
    infoCompany.accountName = formValue.value.accountName
    infoCompany.accountNumber = formValue.value.accountNumber
    infoCompany.bankName = formValue.value.customer.bankName
    formValue.value?.collaboratorFiles.map((element) => {
      if (element.file !== null) {
        ListFileUpload.value.push({
          url: `${API_URL}${element?.file?.path}`,
          name: element?.file?.fileName
        })
      }
    })
    console.log('ListFileUpload', ListFileUpload.value)
    if (formValue.value.status === 1) {
      FormData.CollaboratorStatus = true
    } else if (formValue.value.status === 0) {
      FormData.CollaboratorStatus = false
    }
    customersValue.value = {
      label: formValue.value.customer.accountName + ' | MST ' + formValue.value.customer.taxCode,
      value: formValue.value.customer.id
    }
    setValues(formValue.value)
  } else {
    console.log('FormData', FormData)
    setValues(formValue.value)
  }
}
const rules = reactive({
  Discount: [required()],
  name: [
    { validator: notSpecialCharacters },
    { validator: ValidService.checkNameServiceLength.validator },
    { validator: ValidService.checkSpace.validator },
    required()
  ]
})
const activeName = ref('1')
</script>
<template>
  <div class="demo-collapse dark:bg-[#141414]">
    <el-collapse v-model="activeName" @change="collapseChangeEvent">
      <el-collapse-item name="1">
        <template #title>
          <el-button class="header-icon" :icon="collapse[0].icon" link />
          <span class="text-center text-xl">{{ collapse[0].title }}</span>
        </template>
        <div class="flex w-[100%]">
          <div class="w-[50%]">
            <Form
              :rules="rules"
              :schema="newList"
              label-position="top"
              hide-required-asterisk
              size="large"
              class="flex border-1 border-[var(--el-border-color)] border-none rounded-3xl box-shadow-blue bg-white dark:bg-[#141414]"
              @register="register"
            >
              <template #codeCollaborator>
                <div class="flex items-center w-[100%] gap-4">
                  <label class="w-[16%] text-right">{{ t('formDemo.CollaboratorCode') }}</label>
                  <div class="w-[80%] w-[100%] outline-none pl-2 bg-transparent">
                    <!-- <div v-if="formDataCustomize.value !== ''">{{
                        formDataCustomize.value?.code
                      }}</div> -->
                    <div>{{ CollaboratorId }}</div>
                  </div>
                </div>
              </template>
              <template #discountCollaborator>
                <div class="flex items-center w-[100%] gap-4">
                  <label class="w-[16%] text-right">{{ t('formDemo.discountCollaborator') }}</label>
                  <div class="w-[80%] w-[100%] outline-none pl-2 bg-transparent">
                    <ElInput
                      v-model="FormData.Discount"
                      :placeholder="t('formDemo.enterCommissionCalculatedOnOrderSales')"
                      :suffixIcon="h('div', '%')"
                    />
                  </div>
                </div>
              </template>
              <template #chooseACustomer>
                <div class="flex items-center w-[100%] gap-4">
                  <label class="w-[16%] text-right">{{ t('formDemo.chooseACustomer') }}</label>
                  <div class="flex items-center w-[80%] gap-4">
                    <div class="w-[100%] outline-none pl-2 bg-transparent">
                      <ElSelect
                        v-model="customersValue"
                        filterable
                        :clearable="true"
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
                  </div>
                </div>
              </template>
              <template #companyInformation>
                <div class="flex gap-4 w-[100%]" v-if="infoCompany.name !== ''">
                  <label class="w-[33%] text-right">{{ t('formDemo.customerName') }}</label>
                  <div class="leading-6 mt-2 ml-2">
                    <div>{{ infoCompany.name }}</div>
                  </div>
                </div>
                <div class="flex gap-4 w-[100%]" v-if="infoCompany.taxCode !== ''"
                  ><label class="w-[33%] text-right">{{ t('formDemo.taxCode') }}</label>
                  <div class="leading-6 ml-2 mt-2">
                    <div>{{ infoCompany.taxCode }}</div>
                  </div></div
                >
                <div class="flex gap-4 w-[100%]" v-if="infoCompany.representative !== ''"
                  ><label class="w-[33%] text-right">{{ t('formDemo.represent') }}</label>
                  <div class="leading-6 ml-2 mt-2">
                    <div>{{ infoCompany.representative }}</div>
                  </div></div
                >
                <div class="flex gap-4 w-[100%]" v-if="infoCompany.phonenumber !== ''"
                  ><label class="w-[33%] text-right">{{ t('reuse.phoneNumber') }}</label>
                  <div class="leading-6 ml-2 mt-2">
                    <div>{{ infoCompany.phonenumber }}</div>
                  </div></div
                >
                <div class="flex gap-4 w-[100%]" v-if="infoCompany.email !== ''"
                  ><label class="w-[33%] text-right">{{ t('reuse.email') }}</label>
                  <div class="leading-6 ml-2 mt-2">
                    <div>{{ infoCompany.email }}</div>
                  </div></div
                >
                <div class="flex gap-4 w-[100%]" v-if="infoCompany.address !== ''"
                  ><label class="w-[33%] text-right">{{ t('formDemo.address') }}</label>
                  <div class="leading-6 ml-2 mt-2">
                    <div>{{ infoCompany.address }}</div>
                  </div></div
                >
                <div class="flex gap-4 w-[100%]" v-if="infoCompany.taxCode !== ''"
                  ><label class="w-[33%] text-right">{{ t('reuse.accountBank') }}</label>
                  <div class="leading-6 ml-2 mt-2">
                    <div>{{ infoCompany.accountName }}</div>
                    <div>{{ infoCompany.accountNumber }}</div>
                    <div>{{ infoCompany.bankName }}</div>
                  </div></div
                >
              </template>
              <template #status>
                <div class="flex items-center w-[100%] gap-4">
                  <label class="w-[16%] text-right">{{ t('reuse.status') }}</label>
                  <div class="flex items-center ml-2 w-[80%] gap-4">
                    <ElCheckbox
                      v-model="FormData.CollaboratorStatus"
                      :label="t('formDemo.isActive')"
                      size="large"
                      :disabled="type === 'add' || type === ''"
                    />
                  </div>
                </div>
                <div class="flex gap-2 pb-8">
                  <div class="w-[18%]"></div>
                  <div class="w-[80%]"
                    ><span
                      class="pl-2 pr-2 bg-[#FFF0D9] text-[#FEB951] leading-5 dark:bg-transparent"
                      >{{ t('reuse.approval') }}</span
                    >
                  </div>
                </div>
              </template>
            </Form>
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
        <div v-if="type === 'add' || !type" class="flex justify-center">
          <ElButton class="min-w-42" type="primary" @click="save('save')">
            {{ t('reuse.saveAndPending') }}
          </ElButton>
          <ElButton class="min-w-42"> {{ t('reuse.cancel') }} </ElButton>
        </div>
        <div v-if="type === 'edit'" class="flex justify-center">
          <ElButton class="min-w-42" type="primary" plain @click="save('fix')">
            {{ t('reuse.fix') }}
          </ElButton>
          <ElButton type="danger" class="min-w-42"> {{ t('formDemo.cancelAccount') }} </ElButton>
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
</style>
