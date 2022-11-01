<script setup lang="ts">
import { useIcon } from '@/hooks/web/useIcon'
import { Collapse } from '../../Components/Type'
import { onBeforeMount, reactive, ref, unref, watch } from 'vue'
import { useForm } from '@/hooks/web/useForm'
import { useI18n } from '@/hooks/web/useI18n'
import {
  getCollaboratorsById,
  getProductsList,
  getGenCodeCollaborators,
  addNewCollaborators,
  updateCollaborators,
  addQuickCustomer
} from '@/api/Business'
import { useValidator } from '@/hooks/web/useValidator'
import { useRouter } from 'vue-router'
import { getAllCustomer } from '@/api/Business'
import { API_URL } from '@/utils/API_URL'
import {
  ElCollapse,
  ElCollapseItem,
  ElSelect,
  ElOption,
  ElButton,
  ElDivider,
  ElInput,
  ElNotification,
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
const { required } = useValidator()

const { t } = useI18n()

const { push } = useRouter()
const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })
const escape = useIcon({ icon: 'quill:escape' })
const collapse: Array<Collapse> = [
  {
    icon: minusIcon,
    name: 'profileWareHouse',
    title: t('reuse.profileWareHouse')
  },
  {
    icon: plusIcon,
    name: 'importedProductsWareHouse',
    title: t('reuse.importedProductsWareHouse')
  }
]
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
interface ListOfProductsForSaleType {
  name: string
  productCode: string
  productName: string
  productPropertyCode: string
  productPropertyName: string
  id: string
  productPropertyId: string
  quantity: number | undefined
  accessory: string | undefined
  unitName: string
  price: string | number | undefined
  finalPrice: string
  paymentType: string
  edited: boolean
}
let ListOfProductsForSale = ref<Array<ListOfProductsForSaleType>>([])
// Call api danh sách sản phẩm
let listProductsTable = ref()
let optionCallAPi = 0
const callApiProductList = async () => {
  if (optionCallAPi == 0) {
    const res = await getProductsList()
    if (Array.isArray(res.data) && res.data.length > 0) {
      listProductsTable.value = res.data.map((product) => ({
        productCode: product.code,
        value: product.productCode,
        name: product.name ?? '',
        price: product.price.toString(),
        productPropertyId: product.id.toString(),
        productPropertyCode: product.productPropertyCode
      }))
      optionCallAPi++
    }
  }
}
const tableWarehouse = [
  {
    warehouseCheckbox: '',
    name: 'Kho Hà Nội',
    address: ''
  },
  {
    warehouseCheckbox: '',
    name: 'Kho Hồ Chí Minh',
    address: ''
  }
]
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
let dialogAddQuick = ref(false)
const valueClassify = ref(false)
const optionsClassify = [
  {
    value: true,
    label: t('formDemo.company')
  },
  {
    value: false,
    label: t('formDemo.individual')
  }
]
// select khách hàng
const valueSelectCustomer = ref(1)
const optionsCustomer = [
  {
    value: 1,
    label: t('formDemo.customer')
  },
  {
    value: 2,
    label: t('reuse.supplier')
  },
  {
    value: 3,
    label: t('formDemo.joint')
  }
]
// form add quick customer
const addQuickCustomerName = ref()
const quickTaxCode = ref()
const quickRepresentative = ref()
const quickPhoneNumber = ref()
const quickEmail = ref()
// Thêm nhanh khách hàng
const createQuickCustomer = async () => {
  const payload = {
    IsOrganization: valueClassify.value,
    Name: addQuickCustomerName.value,
    TaxCode: quickTaxCode.value,
    Representative: quickRepresentative.value,
    Phonenumber: quickPhoneNumber.value,
    Email: quickEmail.value,
    DistrictId: 1,
    WardId: 1,
    Address: 1,
    CustomerType: valueSelectCustomer.value
  }
  const formCustomerPayLoad = FORM_IMAGES(payload)
  await addQuickCustomer(formCustomerPayLoad)
    .then(() =>
      ElNotification({
        message: t('reuse.addSuccess'),
        type: 'success'
      })
    )
    .catch(() =>
      ElNotification({
        message: t('reuse.addFail'),
        type: 'warning'
      })
    )
}
const getValueOfSelected = (_value, obj, scope) => {
  scope.row.productPropertyId = obj.productPropertyId
  scope.row.productCode = obj.value
  scope.row.productName = obj.name
  scope.row.price = obj.price
  scope.row.finalPrice = (parseInt(scope.row.quantity) * parseInt(scope.row.price)).toString()
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
const openDialogChooseWarehouse = ref(false)
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

onBeforeMount(async () => {
  callCustomersApi()
  await callApiProductList()
})
let FileDeleteIds: any = []

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
    }
    if (type === 'detail' || type === 'edit') {
      getTableValue()
    }
    if (type === 'add' || type == ':type') {
      getGenCodeCollaborator()
      FormData.CollaboratorStatus = true
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
</script>
<template>
  <div class="demo-collapse dark:bg-[#141414]">
    <el-collapse v-model="activeName" @change="collapseChangeEvent">
      <!-- Dialog Thêm nhanh khách hàng -->
      <el-dialog
        v-model="dialogAddQuick"
        width="40%"
        align-center
        :title="t('formDemo.QuicklyAddCustomers')"
      >
        <div v-if="valueClassify == true">
          <el-divider />
          <div>
            <div class="flex gap-4 pt-4 pb-4 items-center">
              <label class="w-[30%] text-right max-w-[162.73px]"
                >{{ t('formDemo.classify') }} <span class="text-red-500">*</span></label
              >
              <div class="w-[80%] flex gap-2">
                <div class="w-[50%] fix-full-width">
                  <el-select v-model="valueClassify" placeholder="Select">
                    <el-option
                      v-for="item in optionsClassify"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>
                <div class="w-[50%] fix-full-width">
                  <el-select v-model="valueSelectCustomer" placeholder="Select">
                    <el-option
                      v-for="item in optionsCustomer"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>
              </div>
            </div>
            <div class="flex gap-4 pt-4 pb-4">
              <label class="w-[30%] text-right"
                >{{ t('formDemo.companyName') }} <span class="text-red-500">*</span></label
              >
              <el-input
                v-model="addQuickCustomerName"
                style="width: 100%"
                :placeholder="t('formDemo.enterCompanyName')"
              />
            </div>
            <div class="flex gap-4 pt-4 pb-4">
              <label class="w-[30%] text-right"
                >{{ t('formDemo.taxCode') }} <span class="text-red-500">*</span></label
              >
              <el-input
                v-model="quickTaxCode"
                style="width: 100%"
                :placeholder="t('formDemo.enterTaxCode')"
              />
            </div>
            <div class="flex gap-4 pt-4 pb-4">
              <label class="w-[30%] text-right">{{ t('formDemo.representative') }}</label>
              <el-input
                v-model="quickRepresentative"
                style="width: 100%"
                :placeholder="t('formDemo.enterRepresentative')"
              />
            </div>
            <div class="flex gap-4 pt-4 pb-4">
              <label class="w-[30%] text-right"
                >{{ t('reuse.phoneNumber') }} <span class="text-red-500">*</span></label
              >
              <el-input
                v-model="quickPhoneNumber"
                style="width: 100%"
                :placeholder="t('formDemo.enterPhoneNumber')"
              />
            </div>
            <div class="flex gap-4 pt-4 pb-4">
              <label class="w-[30%] text-right">{{ t('reuse.email') }}</label>
              <el-input
                v-model="quickEmail"
                style="width: 100%"
                :placeholder="`${t('formDemo.enterEmail')}`"
              />
            </div>
          </div>
        </div>
        <div v-else>
          <el-divider />
          <div>
            <div class="flex gap-4 pt-4 pb-4 items-center">
              <label class="w-[30%] text-right max-w-[162.73px]"
                >{{ t('formDemo.classify') }} <span class="text-red-500">*</span></label
              >
              <div class="w-[80%] flex gap-2">
                <div class="w-[50%] fix-full-width">
                  <el-select v-model="valueClassify" placeholder="Select">
                    <el-option
                      v-for="item in optionsClassify"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>
                <div class="w-[50%] fix-full-width">
                  <el-select v-model="valueSelectCustomer" placeholder="Select">
                    <el-option
                      v-for="item in optionsCustomer"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>
              </div>
            </div>

            <div class="flex gap-4 pt-4 pb-4">
              <label class="w-[30%] text-right"
                >{{ t('reuse.customerName') }} <span class="text-red-500">*</span></label
              >
              <el-input
                v-model="addQuickCustomerName"
                style="width: 100%"
                :placeholder="t('formDemo.enterCustomerName')"
              />
            </div>

            <div class="flex gap-4 pt-4 pb-4">
              <label class="w-[30%] text-right"
                >{{ t('reuse.phoneNumber') }} <span class="text-red-500">*</span></label
              >
              <el-input
                v-model="quickPhoneNumber"
                style="width: 100%"
                :placeholder="t('formDemo.enterPhoneNumber')"
              />
            </div>
            <div class="flex gap-4 pt-4 pb-4">
              <label class="w-[30%] text-right">{{ t('reuse.email') }}</label>
              <el-input
                v-model="quickEmail"
                style="width: 100%"
                :placeholder="t('formDemo.enterEmail')"
              />
            </div>
          </div>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button
              type="primary"
              class="w-[150px]"
              @click.stop.prevent="
                () => {
                  dialogAddQuick = false
                  createQuickCustomer()
                }
              "
              >{{ t('reuse.save') }}</el-button
            >
            <el-button class="w-[150px]" @click.stop.prevent="dialogAddQuick = false">{{
              t('reuse.exit')
            }}</el-button>
          </span>
        </template>
      </el-dialog>
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
              <el-divider content-position="left">{{ t('reuse.profileWareHouse') }}</el-divider>

              <ElFormItem :label="t('reuse.formCode')" prop="CollaboratorId">
                <div class="ml-5">{{ CollaboratorId }}</div>
              </ElFormItem>
              <ElFormItem :label="t('reuse.createDate')" prop="CollaboratorId">
                <div class="ml-5"> 20/03/2022 </div>
              </ElFormItem>
              <ElFormItem class="mt-5" :label="t('reuse.petitioner')" prop="customersValue">
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
              <ElFormItem class="mb-7" :label="t('reuse.note')" prop="Discount">
                <div class="flex">
                  <label><span class="text-red-600"> *</span></label>
                  <ElInput
                    v-model="FormData.Discount"
                    size="default"
                    :placeholder="t('reuse.enterNote')"
                    :formatter="(value) => value.replace(/^\s+|\s+$/gm, '')"
                  />
                </div>
              </ElFormItem>
              <el-divider class="mt-10" content-position="left">{{
                t('reuse.subject')
              }}</el-divider>
              <ElFormItem class="mt-5" :label="t('reuse.selectObject')" prop="customersValue">
                <div class="flex">
                  <label><span class="text-red-600"> *</span></label>
                  <ElSelect
                    class="w-[76%] mr-1"
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
                  <el-button
                    @click="dialogAddQuick = true"
                    :icon="plusIcon"
                    style="padding: 8px 30px"
                    >{{ t('button.add') }}</el-button
                  >
                </div>
              </ElFormItem>
              <ElFormItem :label="t('formDemo.customerName')" v-if="infoCompany.name">
                <div class="leading-4">
                  <div class="ml-5">{{ infoCompany.name }}</div>
                </div>
              </ElFormItem>
              <ElFormItem
                class="w-[100%]"
                style="display: inline-block"
                :label="t('reuse.phoneNumber')"
                v-if="infoCompany.phonenumber"
              >
                <div class="leading-4">
                  <div class="ml-5">{{ infoCompany.phonenumber }}</div>
                </div>
              </ElFormItem>
              <ElFormItem
                class="w-[100%]"
                style="display: inline-block"
                :label="t('reuse.email')"
                v-if="infoCompany.email"
              >
                <div class="leading-4">
                  <div class="ml-5">{{ infoCompany.email }}</div>
                </div>
              </ElFormItem>
            </ElForm>
          </div>
          <div class="w-[50%]">
            <div class="text-sm text-[#303133] font-medium p pl-4 dark:text-[#fff]">
              <el-divider content-position="left">{{ t('formDemo.documentsAttached') }}</el-divider>
            </div>
            <ElFormItem
              class="w-[100%]"
              style="display: inline-block"
              :label="t('reuse.orderCode')"
              v-if="infoCompany.email"
            />
          </div>
        </div>
      </el-collapse-item>
      <el-dialog
        v-model="openDialogChooseWarehouse"
        :title="t('formDemo.inventoryInformation')"
        width="35%"
        align-center
        class="z-50"
      >
        <el-divider />
        <el-table :data="tableWarehouse" border>
          <el-table-column prop="warehouseCheckbox" width="90" align="center">
            <template #default="props">
              <el-checkbox v-model="props.row.warehouseCheckbox" />
            </template>
          </el-table-column>
          <el-table-column prop="name" :label="t('formDemo.warehouseInformation')" width="360" />
          <el-table-column :label="t('reuse.inventory')">
            <div class="flex">
              <span class="flex-1">20</span>
              <span class="flex-1 text-right">Chiếc</span>
            </div>
          </el-table-column>
        </el-table>
        <template #footer>
          <span class="dialog-footer">
            <el-button class="w-[150px]" type="primary" @click="openDialogChooseWarehouse = false"
              >{{ t('reuse.save') }}
            </el-button>
            <el-button class="w-[150px]" @click="openDialogChooseWarehouse = false">{{
              t('reuse.exit')
            }}</el-button>
          </span>
        </template>
      </el-dialog>
      <el-collapse-item :name="collapse[1].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[1].icon" link />
          <span class="text-center text-xl">{{ collapse[1].title }}</span>
        </template>
        <el-table
          :data="ListOfProductsForSale"
          border
          :class="[
            'bg-[var(--el-color-white)] dark:(text-white-800) border-[var(--el-border-color)] border-1px)'
          ]"
        >
          <el-table-column :label="t('reuse.productType')" min-width="200" prop="productType" />
          <el-table-column
            :label="t('formDemo.productManagementCode')"
            min-width="200"
            prop="productPropertyId"
          >
            <template #default="props">
              <div v-if="type == 'detail'">
                {{ props.row.productPropertyId }}
              </div>
              <MultipleOptionsBox
                :fields="[
                  t('reuse.productCode'),
                  t('reuse.managementCode'),
                  t('formDemo.productInformation')
                ]"
                v-else
                filterable
                :items="listProductsTable"
                valueKey="productPropertyId"
                labelKey="productCode"
                :hiddenKey="['id']"
                :placeHolder="'Chọn mã sản phẩm'"
                :defaultValue="props.row.productPropertyCode"
                :clearable="false"
                @update-value="(value, obj) => getValueOfSelected(value, obj, props)"
                ><template #underButton>
                  <div class="sticky z-999 bottom-0 bg-white dark:bg-black h-10">
                    <div class="block h-1 w-[100%] border-top-1 pb-2"></div>
                    <div class="text-base text-blue-400 cursor-pointer pl-2"
                      >+ {{ t('formDemo.quicklyAddProducts') }}</div
                    >
                  </div>
                </template></MultipleOptionsBox
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="productName"
            :label="t('formDemo.productInformation')"
            min-width="620"
          />
          <el-table-column prop="accessory" :label="t('reuse.accessory')" width="180">
            <template #default="data">
              <div v-if="type === 'detail'">{{ data.row.accessory }}</div>
              <el-input
                v-else
                class="max-w-[150px]"
                v-model="data.row.accessory"
                :placeholder="`/${t('formDemo.selfImportAccessories')}/`"
              />
            </template>
          </el-table-column>
          <el-table-column prop="quantity" :label="t('formDemo.amount')" align="center" width="90">
            <template #default="data">
              <div v-if="type == 'detail'">
                {{ data.row.quantity }}
              </div>
              <el-input v-else v-model="data.row.quantity" style="width: 100%" />
            </template>
          </el-table-column>
          <el-table-column
            prop="unitName"
            :label="t('reuse.dram')"
            align="center"
            min-width="100"
          />
          <el-table-column
            prop="price"
            :label="t('formDemo.unitPriceWarehouse')"
            align="right"
            width="180"
          >
            <template #default="props">
              <el-input v-if="type != 'detail'" v-model="props.row.price" />
            </template>
          </el-table-column>
          <el-table-column
            prop="finalPrice"
            :label="t('formDemo.intoMoneyWarehouse')"
            align="right"
            width="180"
          />
          <el-table-column :label="t('reuse.importWarehouse')" min-width="200">
            <div class="flex w-[100%] items-center">
              <div class="w-[40%]">Còn hàng</div>
              <div class="w-[60%]">
                <el-button text @click="openDialogChooseWarehouse = true">
                  <span class="text-blue-500"> + {{ t('formDemo.chooseWarehouse') }}</span>
                </el-button>
              </div>
            </div>
          </el-table-column>
          <el-table-column
            prop="quantity"
            :label="t('reuse.conditionProducts')"
            align="center"
            width="90"
          >
            <template #default="data">
              <div v-if="type == 'detail'">
                {{ data.row.quantity }}
              </div>
              <el-input v-else v-model="data.row.quantity" style="width: 100%" />
            </template>
          </el-table-column>
          <el-table-column :label="t('formDemo.manipulation')" align="center" min-width="90">
            <button class="bg-[#F56C6C] pt-2 pb-2 pl-4 pr-4 text-[#fff] rounded">{{
              t('reuse.delete')
            }}</button>
          </el-table-column>
        </el-table>
        <div class="w-[100%]">
          <el-divider content-position="left">{{ t('formDemo.statusAndManipulation') }}</el-divider>
        </div>
        <div class="flex gap-4 w-[100%] ml-1 items-center pb-3">
          <label class="w-[9%] text-right">{{ t('reuse.receiptStatus') }}</label>
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

@media screen {
  #recpPaymentPrint {
    display: none;
  }
  #billDepositPrint {
    display: none;
  }
}

@media print {
  #printPage {
    display: block; /* Hidden by default */
    position: fixed; /* Stay in place */
    z-index: 10; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: white;
  }
}

::v-deep(label) {
  color: #828387;
}

::v-deep(.el-divider__text) {
  font-size: 16px;
}

.el-button--text {
  margin-right: 15px;
}

::v-deep(.el-input) {
  width: 100%;
  height: fit-content;
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

::v-deep(.el-select .el-input) {
  width: 100% !important;
}

::v-deep(.el-button--large) {
  padding: 12px 18px;
}

.fix-label-color > .el-radio {
  color: transparent;
}

::v-deep(.fix-label-color > .el-radio > .el-radio__label) {
  color: transparent;
}

.fix-width > .el-form-item {
  width: 80%;
}

::v-deep(.poi-self > .el-form-item__label) {
  margin-top: 2px;
  align-self: start;
}

::v-deep(.el-dialog__title) {
  font-weight: bold;
}

.btn {
  width: 150px;
}

.break-w {
  word-break: break-word;
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

.triangle-left {
  position: absolute;
  z-index: 1998;
  width: 0;
  height: 0;
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

::v-deep(.el-table td.el-table__cell div) {
  width: 100%;
}

::v-deep(.el-table) {
  z-index: 0;
}

.duplicate-status + .duplicate-status {
  margin-left: 10px;
}
.active {
  opacity: 1 !important;
}
</style>
