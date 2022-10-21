<script setup lang="ts">
import { onBeforeMount, reactive, ref, watch } from 'vue'
import {
  ElCollapse,
  ElCollapseItem,
  ElUpload,
  ElDivider,
  ElButton,
  ElRadio,
  ElDialog,
  ElOption,
  ElSelect,
  ElDatePicker,
  ElNotification,
  ElInput,
  ElFormItem,
  ElForm,
  ElRadioGroup,
  ElMessage,
  UploadProps,
  ElMessageBox,
  UploadUserFile
} from 'element-plus'
import { FORM_IMAGES } from '@/utils/format'
import { Collapse } from '../../Components/Type'
import { useIcon } from '@/hooks/web/useIcon'
// import { Form } from '@/components/Form'
import { getCity, getDistrict, getWard } from '@/utils/Get_Address'
import { useI18n } from '@/hooks/web/useI18n'
import { useForm } from '@/hooks/web/useForm'
// import Qrcode from '@/components/Qrcode/src/Qrcode.vue'
import router from '@/router'
import {
  getCustomerById,
  addNewCustomer,
  getGenCodeCustomers,
  addNewAuthRegister
} from '@/api/Business'
import { useRouter } from 'vue-router'
import Qrcode from '@/components/Qrcode/src/Qrcode.vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
import { API_URL } from '@/utils/API_URL'
const { t } = useI18n()
const size = ref<'' | 'large' | 'small'>('')
const disabledDate = (time: Date) => {
  return time.getTime() > Date.now()
}
const id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)
const customerClassification = ref('Khách hàng')
const valueProvince = ref('')
const valueDistrict = ref('')
const { ValidService, notSpace } = useValidator()
const ruleFormRef = ref<FormInstance>()
const ruleFormRef2 = ref<FormInstance>()
const rules = reactive<FormRules>({
  name: [{ required: true, message: t('common.required'), trigger: 'blur' }],
  businessClassification: [
    {
      required: true,
      message: 'Please select businessClassification ',
      trigger: 'change'
    }
  ],
  taxCode: [
    {
      required: true,
      message: 'Please select Activity count',
      trigger: 'blur'
    }
  ],
  phonenumber: [
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
    ValidService.checkPhone
  ],
  userName: [
    { required: true, message: t('common.required'), trigger: 'blur' },
    { validator: notSpace }
  ],
  password: [{ required: true, message: t('common.required'), trigger: 'blur' }],
  confirmPassword: [{ required: true, message: t('common.required'), trigger: 'blur' }]
})

let checkValidate = ref(false)
let checkValidateForm = ref(false)

const submitForm = async (formEl: FormInstance | undefined, formEl2: FormInstance | undefined) => {
  if (!formEl || !formEl2) return
  await formEl.validate((valid, _fields) => {
    if (valid) {
      checkValidateForm.value = true
    } else {
      checkValidateForm.value = false
    }
  })
  await formEl2.validate((valid, _fields) => {
    if (valid && checkValidateForm.value) {
      ElMessage.success(t('reuse.addSuccess'))
      checkValidate.value = true
    } else {
      ElMessage.error(t('reuse.notFillAllInformation'))
      checkValidateForm.value = false
    }
  })
}

const options = [
  {
    value: true,
    label: 'Nam'
  },
  {
    value: false,
    label: 'Nữ'
  }
]

const classify = [
  {
    value: false,
    label: 'Cá nhân'
  },
  {
    value: true,
    label: 'Doanh nghiệp'
  }
]

const classify2 = [
  {
    value: 'Khách hàng',
    label: 'Khách hàng'
  },
  {
    value: 'Nhà cung cấp',
    label: 'Nhà cung cấp'
  },
  {
    value: 'Chung',
    label: 'Chung'
  }
]

const bankList = [
  {
    value: 499,
    label: 'Ngân hàng đầu tư và phát triển Việt Nam'
  },
  {
    value: 500,
    label: 'Ngân hàng công thương Việt Nam'
  },
  {
    value: 501,
    label: 'Ngân hàng quốc tế'
  }
]

// let customerCode = ref()
let ruleForm = reactive({
  customerCode: '',
  referralCode: '',
  businessClassification: false,
  name: '',
  customerName: '',
  representative: '',
  accountName: '',
  accountNumber: '',
  bankName: '',
  cccd: '',
  cccdCreateAt: '',
  cccdPlaceOfGrant: '',
  email: '',
  link: '',
  phonenumber: '',
  sex: true,
  taxCode: '',
  doB: '',
  userName: '',
  isActive: true,
  password: '',
  confirmPassword: ''
})
const formValue = ref()
//get data from table
const getTableValue = async () => {
  if (!isNaN(id)) {
    const res = await getCustomerById({ Id: id })
    if (res) {
      if (res.data?.list !== undefined) {
        formValue.value = res.data.list[0]
      } else {
        formValue.value = res.data
      }
    } else {
      ElNotification({
        message: t('reuse.cantGetData'),
        type: 'warning'
      })
    }
  }
  if (type == 'detail' || type == 'edit') {
    ruleForm.isActive = formValue.value.isActive
    ruleForm.customerCode = formValue.value.code
    ruleForm.referralCode = formValue.value.referralCode
    if (formValue.value.isOrganization) {
      ruleForm.businessClassification = true
    } else {
      ruleForm.businessClassification = false
    }
    if (formValue.value.sex) {
      ruleForm.sex = true
    } else {
      ruleForm.sex = false
    }
    formValue.value?.customerFiles?.map((element) => {
      if (element.file !== null) {
        ListFileUpload.value.push({
          url: `${API_URL}${element?.file?.path}`,
          name: element?.file?.fileName,
          id: element?.file?.id
        })
      }
    })
    ruleForm.name = formValue.value.name
    ruleForm.representative = formValue.value.representative
    ruleForm.accountName = formValue.value.accountName
    ruleForm.cccd = formValue.value.cccd
    ruleForm.cccdCreateAt = formValue.value.cccdCreateAt
    ruleForm.cccdPlaceOfGrant = formValue.value.cccdPlaceOfGrant
    ruleForm.email = formValue.value.email
    ruleForm.phonenumber = formValue.value.phonenumber
    ruleForm.link = formValue.value.link
    ruleForm.bankName = formValue.value.bank.name
    ruleForm.accountNumber = formValue.value.accountNumber
    ruleForm.doB = formValue.value.doB
    ruleForm.taxCode = formValue.value.taxCode
    ruleForm.userName = formValue.value.userName
  }
}

const { push } = useRouter()
const editPage = async () => {
  push({
    name: `${String(router.currentRoute.value.name)}`,
    params: { id: id, type: 'edit' }
  })
}

const cancel = async () => {
  push({
    name: 'business.customer-management.customerList',
    params: { backRoute: 'business.customer-management.customerList' }
  })
}
const { register } = useForm()

const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })

const collapse: Array<Collapse> = [
  {
    icon: minusIcon,
    name: 'generalInformation',
    title: 'Thông tin khách hàng',
    columns: [],
    api: undefined,
    buttonAdd: '',
    typeForm: 'form',
    typeButton: 'form01',
    expand: false,
    apiTableChild: undefined,
    columnsTableChild: undefined,
    pagination: false,
    removeHeaderFilter: true,
    removeDrawer: true,
    selection: false,
    customOperator: 3
  }
]

const getGenCodeCustomer = async () => {
  await getGenCodeCustomers({})
    .then((res) => {
      ruleForm.customerCode = res.toString()
    })
    .catch((err) => {
      console.error(err)
    })
  ruleForm.customerCode
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
const activeName = ref(collapse[0].name)

const cities = ref()
const district = ref()
const ward = ref()
const valueCommune = ref('')
const enterdetailAddress = ref([])
const callApiCity = async () => {
  cities.value = await getCity()
}

const CityChange = async (value) => {
  district.value = await getDistrict(value)
}

const districtChange = async (value) => {
  ward.value = await getWard(value)
}

const clear = async () => {
  ;(ruleForm.customerCode = ''),
    (ruleForm.referralCode = ''),
    (ruleForm.name = ''),
    (ruleForm.taxCode = ''),
    (ruleForm.businessClassification = false),
    (ruleForm.representative = ''),
    (ruleForm.phonenumber = ''),
    (ruleForm.email = ''),
    (ruleForm.doB = ''),
    (ruleForm.cccd = ''),
    (ruleForm.cccdCreateAt = ''),
    (ruleForm.cccdPlaceOfGrant = ''),
    (ruleForm.sex = true),
    (ruleForm.link = ''),
    (ruleForm.accountName = ''),
    (ruleForm.accountNumber = ''),
    (ruleForm.bankName = '')
}

const postCustomer = async () => {
  const payload = {
    UserName: ruleForm.userName,
    Code: ruleForm.customerCode,
    ReferralCode: ruleForm.referralCode,
    Name: ruleForm.name,
    TaxCode: ruleForm.taxCode,
    IsOrganization: ruleForm.businessClassification,
    Representative: ruleForm.representative,
    Phonenumber: ruleForm.phonenumber,
    Email: ruleForm.email,
    DoB: ruleForm.doB,
    DistrictId: 1,
    WardId: 1,
    Address: 'trieu khuc',
    CCCD: ruleForm.cccd,
    CCCDCreateAt: ruleForm.cccdCreateAt,
    CCCDPlaceOfGrant: ruleForm.cccdPlaceOfGrant,
    Sex: ruleForm.sex,
    Link: ruleForm.link,
    ImageId: 1,
    isActive: true,
    CustomerType: 1,
    AccountName: ruleForm.accountName,
    AccountNumber: ruleForm.accountNumber,
    BankId: ruleForm.bankName,
    Files: ListFileUpload.value.map((file) => file.raw).filter((file) => file !== undefined)
  }
  const formDataPayLoad = FORM_IMAGES(payload)
  await addNewCustomer(formDataPayLoad)
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
  clear()
}
const postData = async (typebtn) => {
  await submitForm(ruleFormRef.value, ruleFormRef2.value)
  if (checkValidate.value) {
    const payloadAcc = {
      fullName: ruleForm.name,
      email: ruleForm.email,
      password: ruleForm.password,
      confirmPassword: ruleForm.confirmPassword,
      userName: ruleForm.userName,
      phoneNumber: ruleForm.phonenumber
    }
    await addNewAuthRegister(JSON.stringify(payloadAcc))
      .then(() => {
        postCustomer()
      })
      .catch(() =>
        ElNotification({
          message: t('reuse.failCreateAccount'),
          type: 'success'
        })
      )
  }
  if (typebtn === 'save') {
    push({
      name: 'business.customer-management.customerList',
      params: { backRoute: 'business.customer-management.customerList' }
    })
  }
}
const centerDialogVisible = ref(false)
const centerDialogCancelAccount = ref(false)

let disableData = false
watch(
  () => type,
  () => {
    if (type === 'detail') {
      disableData = true
    }
    if (type === 'detail' || type === 'edit') {
      getTableValue()
    }
  },
  {
    deep: true,
    immediate: true
  }
)
const change = () => {
  if (type == 'detail') {
    disableData = true
  }
}
const ListFileUpload = ref<UploadUserFile[]>([])
const disabledForm = ref(false)
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
    }
  },
  {
    deep: true,
    immediate: true
  }
)
const handleChange: UploadProps['onChange'] = async (_uploadFile, uploadFiles) => {
  ListFileUpload.value = uploadFiles
}
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
onBeforeMount(() => {
  change()
  callApiCity()
  getTableValue()
  getGenCodeCustomer()
})
</script>

<template>
  <div class="demo-collapse dark:bg-[#141414]">
    <el-collapse v-model="activeName" @change="collapseChangeEvent">
      <el-collapse-item :name="collapse[0].name" :disabled="disableData">
        <template #title>
          <el-button class="header-icon" :icon="collapse[0].icon" link />
          <span class="text-center text-xl">{{ collapse[0].title }}</span>
        </template>

        <div class="flex w-[100%] gap-6">
          <div class="w-[50%]">
            <ElForm
              ref="ruleFormRef"
              :model="ruleForm"
              :rules="rules"
              hide-required-asterisk
              label-width="170px"
              @register="register"
              status-icon
              :disabled="disableData"
            >
              <el-divider content-position="left">{{ t('reuse.customerCode') }}</el-divider>
              <ElFormItem
                class="w-[80%] outline-none dark:bg-transparent"
                label-width="0"
                prop="customerCode"
              >
                <div class="flex">
                  <label class="w-[170px] pr-2 text-right">{{ t('reuse.customerCode') }}</label>
                  <div class="flex items-center gap-2">
                    <span class="pl-2">
                      {{ ruleForm.customerCode }}
                    </span>
                    <p style="color: orange" class="text-sm">{{ t('reuse.useToReferralCode') }}</p>
                  </div>
                </div>
              </ElFormItem>

              <ElFormItem :label="t('reuse.referralCode')" prop="referralCode">
                <el-input
                  v-model="ruleForm.referralCode"
                  class="w-[80%] outline-none pl-2 dark:bg-transparent"
                  type="text"
                  :placeholder="t('reuse.enterReferralCode')"
                />
              </ElFormItem>

              <el-divider content-position="left">{{
                t('formDemo.generalInformation')
              }}</el-divider>
              <ElFormItem label-width="0" class="flex items-center w-[100%]">
                <div class="flex">
                  <label class="min-w-[170px] pr-2 text-right"
                    >{{ t('formDemo.classify') }} <span class="text-red-600">*</span></label
                  >
                  <div class="flex w-[84%]">
                    <div class="flex gap-2 pl-2 w-[100%]">
                      <div class="w-[50%] items-center outline-none">
                        <el-select
                          prop="IsOrganization"
                          v-model="ruleForm.businessClassification"
                          class="min-h-[34px] cursor-pointer w-[100%] font-bold"
                          placeholder="Select"
                        >
                          <el-option
                            v-for="item in classify"
                            :key="item.label"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </div>
                      <div class="w-[50%] items-center">
                        <el-select
                          prop="CustomerType"
                          v-model="customerClassification"
                          class="min-h-[34px] cursor-pointer w-[100%] font-bold"
                          placeholder="Select"
                        >
                          <el-option
                            v-for="item in classify2"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </div>
                    </div>
                  </div>
                </div>
              </ElFormItem>

              <div v-if="ruleForm.businessClassification === false">
                <ElFormItem class="flex items-center w-[100%]" label-width="0" prop="name">
                  <div class="flex">
                    <label class="min-w-[170px] pr-2 text-right"
                      >{{ t('formDemo.customerName') }} <span class="text-red-600">*</span></label
                    >
                    <div class="w-[84%]">
                      <el-input
                        v-model="ruleForm.name"
                        class="w-[80%] outline-none pl-2 dark:bg-transparent"
                        type="text"
                        :placeholder="t('formDemo.enterCustomerName')"
                      />
                    </div>
                  </div>
                </ElFormItem>

                <ElFormItem
                  class="flex items-center w-[100%] mt-5"
                  label-width="0"
                  prop="phonenumber"
                >
                  <div class="flex">
                    <label class="min-w-[170px] pr-2 text-right"
                      >{{ t('reuse.phoneNumber') }} <span class="text-red-600">*</span></label
                    >
                    <el-input
                      v-model="ruleForm.phonenumber"
                      class="w-[80%] outline-none pl-2 dark:bg-transparent"
                      type="text"
                      :placeholder="t('reuse.enterPhoneNumber')"
                    />
                  </div>
                </ElFormItem>

                <ElFormItem
                  class="flex items-center w-[100%] mt-5"
                  :label="t('reuse.email')"
                  prop="email"
                >
                  <el-input
                    v-model="ruleForm.email"
                    class="w-[80%] outline-none pl-2 dark:bg-transparent"
                    type="text"
                    :placeholder="t('formDemo.enterEmail')"
                  />
                </ElFormItem>

                <ElFormItem
                  class="flex items-center w-[100%] mt-5"
                  :label="t('reuse.cmnd')"
                  prop="cccd"
                >
                  <div class="flex gap-2 w-[100%]">
                    <el-input
                      v-model="ruleForm.cccd"
                      class="w-[25%] outline-none pl-2 dark:bg-transparent"
                      type="text"
                      :placeholder="t('formDemo.enterCCCD')"
                    />
                    <el-date-picker
                      prop="cccdCreateAt"
                      v-model="ruleForm.cccdCreateAt"
                      type="date"
                      :placeholder="t('formDemo.supplyDate')"
                      :disabled-date="disabledDate"
                      :size="size"
                      format="DD/MM/YYYY"
                      value-format="YYYY-MM-DD"
                      class="w-[25%] min-w-[203px] outline-none pl-2 dark:bg-transparent"
                    />
                    <el-input
                      prop="cccdPlaceOfGrant"
                      v-model="ruleForm.cccdPlaceOfGrant"
                      class="w-[25%] outline-none pl-2 dark:bg-transparent"
                      type="text"
                      :placeholder="t('formDemo.supplyAddress')"
                    />
                  </div>
                </ElFormItem>

                <ElFormItem
                  class="flex items-center w-[100%] mt-5 custom-select-w38"
                  :label="t('reuse.dateOfBirthAnGender')"
                >
                  <div class="flex gap-2 w-[100%]">
                    <div class="flex-1 pl-2 fix-width">
                      <el-date-picker
                        prop="doB"
                        v-model="ruleForm.doB"
                        type="date"
                        :placeholder="t('reuse.dateOfBirth')"
                        :disabled-date="disabledDate"
                        :size="size"
                        format="DD/MM/YYYY"
                        value-format="YYYY-MM-DD"
                      />
                    </div>
                    <div class="flex-1">
                      <el-select v-model="ruleForm.sex" clearable placeholder="Select" prop="sex">
                        <el-option
                          v-for="item in options"
                          :key="item.label"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </div>
                  </div>
                </ElFormItem>

                <ElFormItem class="flex items-center w-[100%] mt-5" :label="t('reuse.link')">
                  <el-input
                    prop="link"
                    v-model="ruleForm.link"
                    class="w-[80%] outline-none pl-2 dark:bg-transparent"
                    type="text"
                    :placeholder="t('reuse.enterFacebookZaloLink')"
                  />
                </ElFormItem>
              </div>

              <div v-if="ruleForm.businessClassification === true">
                <ElFormItem class="flex items-center w-[100%]" label-width="0" prop="name">
                  <div class="flex">
                    <label class="min-w-[170px] pr-2 text-right"
                      >{{ t('reuse.companyName') }} <span class="text-red-600">*</span></label
                    >
                    <div class="w-[84%]">
                      <el-input
                        v-model="ruleForm.name"
                        class="w-[80%] outline-none pl-2 dark:bg-transparent"
                        type="text"
                        :placeholder="t('formDemo.enterCompanyName')"
                      />
                    </div>
                  </div>
                </ElFormItem>

                <ElFormItem class="flex items-center w-[100%]" label-width="0" prop="taxCode">
                  <div class="flex">
                    <label class="min-w-[170px] pr-2 text-right"
                      >{{ t('reuse.taxCode') }} <span class="text-red-600">*</span></label
                    >
                    <div class="w-[84%]">
                      <el-input
                        v-model="ruleForm.taxCode"
                        class="w-[80%] outline-none pl-2 dark:bg-transparent"
                        type="text"
                        :placeholder="t('formDemo.enterTaxCode')"
                      />
                    </div>
                  </div>
                </ElFormItem>

                <ElFormItem
                  class="flex items-center w-[100%] mt-5"
                  :label="t('formDemo.representative')"
                  prop="representative"
                >
                  <el-input
                    v-model="ruleForm.representative"
                    class="w-[80%] outline-none pl-2 dark:bg-transparent"
                    type="text"
                    :placeholder="t('reuse.enterRepresentativeName')"
                  />
                </ElFormItem>

                <ElFormItem
                  class="flex items-center w-[100%] mt-5"
                  label-width="0"
                  prop="phonenumber"
                >
                  <div class="flex">
                    <label class="min-w-[170px] pr-2 text-right"
                      >{{ t('reuse.phoneNumber') }} <span class="text-red-600">*</span></label
                    >
                    <el-input
                      v-model="ruleForm.phonenumber"
                      class="w-[80%] outline-none pl-2 dark:bg-transparent"
                      type="text"
                      :placeholder="t('reuse.enterPhoneNumber')"
                    />
                  </div>
                </ElFormItem>

                <ElFormItem class="flex items-center w-[100%] mt-5" :label="t('reuse.email')">
                  <el-input
                    prop="email"
                    v-model="ruleForm.email"
                    class="w-[80%] outline-none pl-2 dark:bg-transparent"
                    type="text"
                    :placeholder="t('formDemo.enterEmail')"
                  />
                </ElFormItem>

                <ElFormItem class="flex items-center w-[100%] mt-5" :label="t('reuse.link')">
                  <el-input
                    prop="link"
                    v-model="ruleForm.link"
                    class="w-[80%] outline-none pl-2 dark:bg-transparent"
                    type="text"
                    :placeholder="t('reuse.enterFacebookZaloLink')"
                  />
                </ElFormItem>
              </div>

              <el-divider content-position="left">{{ t('formDemo.accountAndStatus') }}</el-divider>
              <div>
                <ElFormItem class="flex items-center w-[100%]" label-width="0" prop="userName">
                  <div class="flex items-center">
                    <label class="w-[20%] min-w-[170px] text-right leading-5 pr-3">
                      {{ t('formDemo.userName') }} <span class="text-red-600">*</span>
                      <p style="color: orange" class="text-xs">{{ t('reuse.loginAppWebUser') }}</p>
                    </label>
                    <el-input
                      v-model="ruleForm.userName"
                      class="w-[80%] outline-none pl-2 dark:bg-transparent"
                      type="text"
                      :placeholder="t('formDemo.enterUserName')"
                    />
                  </div>
                </ElFormItem>
              </div>

              <div v-if="type == 'detail' || type == 'edit'">
                <ElFormItem class="flex items-center w-[100%]" label-width="0">
                  <div class="flex">
                    <label class="w-[20%] min-w-[170px] text-right leading-5 pr-3">
                      {{ t('login.password') }} <span class="text-red-600">*</span>
                    </label>
                    <el-input
                      class="w-[50%] outline-none pl-2 dark:bg-transparent"
                      type="text"
                      :placeholder="t('formDemo.enterPassword')"
                    />

                    <el-button
                      @click="centerDialogVisible = true"
                      class="w-[50%] outline-none min-h-9 pl-2 ml-3 dark:bg-transparent"
                      >{{ t('reuse.changePassword') }}
                    </el-button>
                    <el-dialog
                      v-model="centerDialogVisible"
                      :title="t('reuse.changePassword')"
                      width="30%"
                      align-center
                      class="font-semibold"
                    >
                      <ElFormItem
                        class="flex items-center w-[100%] mb-3 font-normal"
                        label-width="0"
                        prop="password"
                      >
                        <div class="flex">
                          <label class="w-[20%] min-w-[170px] text-right leading-5 pr-3">
                            {{ t('reuse.newPassword') }} <span class="text-red-600">*</span>
                          </label>
                          <el-input
                            class="w-[80%] outline-none pl-2 dark:bg-transparent"
                            type="text"
                            :placeholder="t('reuse.enterNewPassword')"
                          />
                        </div>
                      </ElFormItem>

                      <ElFormItem
                        class="flex items-center w-[100%] font-normal mt-5"
                        label-width="0"
                        prop="confirmPassword"
                      >
                        <div class="flex">
                          <label class="w-[20%] min-w-[170px] text-right leading-5 pr-3">
                            {{ t('reuse.confirmPassword') }} <span class="text-red-600">*</span>
                          </label>
                          <el-input
                            class="w-[80%] outline-none pl-2 dark:bg-transparent"
                            type="text"
                            :placeholder="t('reuse.confirmPassword')"
                          />
                        </div>
                      </ElFormItem>
                      <template #footer>
                        <span class="dialog-footer">
                          <el-button
                            type="primary"
                            @click="centerDialogVisible = false"
                            class="min-w-36 min-h-10"
                            >{{ t('reuse.save') }}</el-button
                          >
                          <el-button
                            @click="centerDialogVisible = false"
                            class="min-w-36 min-h-10"
                            >{{ t('reuse.exit') }}</el-button
                          >
                        </span>
                      </template>
                    </el-dialog>
                  </div>
                </ElFormItem>
              </div>
              <div class="w-[100%]" v-else>
                <ElFormItem prop="password" class="flex items-center w-[100%]" label-width="0">
                  <div class="flex">
                    <label class="w-[20%] min-w-[170px] text-right leading-5 pr-3">
                      {{ t('login.password') }} <span class="text-red-600">*</span>
                    </label>
                    <el-input
                      v-model="ruleForm.password"
                      class="w-[80%] outline-none pl-2 dark:bg-transparent"
                      type="text"
                      :placeholder="t('formDemo.enterPassword')"
                    />
                  </div>
                </ElFormItem>

                <ElFormItem
                  class="flex items-center w-[100%]"
                  label-width="0"
                  prop="confirmPassword"
                >
                  <div class="flex">
                    <label class="w-[20%] min-w-[170px] text-right leading-5 pr-3">
                      {{ t('reuse.confirmPassword') }} <span class="text-red-600">*</span>
                    </label>
                    <el-input
                      v-model="ruleForm.confirmPassword"
                      class="w-[80%] outline-none pl-2 dark:bg-transparent"
                      type="text"
                      :placeholder="t('reuse.confirmPassword')"
                    />
                  </div>
                </ElFormItem>
              </div>
              <ElFormItem class="flex items-center w-[100%]" :label="t('formDemo.status')">
                <el-radio-group v-model="ruleForm.isActive" class="ml-4">
                  <el-radio :label="true" class="pl-2">{{ t('formDemo.isActive') }}</el-radio>
                </el-radio-group>
              </ElFormItem>
            </ElForm>
            <div class="option-page mt-5">
              <div v-if="type === 'detail'" class="flex justify-center">
                <el-button @click="editPage()" type="primary" class="min-w-42 min-h-11">{{
                  t('reuse.fix')
                }}</el-button>
                <el-button
                  type="danger"
                  class="min-w-42 min-h-11"
                  @click="centerDialogCancelAccount = true"
                  >{{ t('formDemo.cancelAccount') }}</el-button
                >
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
                        @click="centerDialogCancelAccount = false"
                        class="min-w-36 min-h-10"
                        >{{ t('formDemo.cancelAccount') }}</el-button
                      >
                      <el-button
                        @click="centerDialogCancelAccount = false"
                        class="min-w-36 min-h-10"
                        >{{ t('reuse.exit') }}</el-button
                      >
                    </span>
                  </template>
                </el-dialog>
              </div>
              <div v-else-if="type === 'edit'" class="flex justify-center">
                <el-button type="primary" class="min-w-42 min-h-11">{{
                  t('reuse.save')
                }}</el-button>
                <el-button @click="cancel()" type="danger" class="min-w-42 min-h-11">{{
                  t('reuse.cancel')
                }}</el-button>
              </div>
              <div v-else class="flex justify-center">
                <el-button @click="postData('save')" type="primary" class="min-w-42 min-h-11">{{
                  t('reuse.save')
                }}</el-button>
                <el-button
                  @click="postData('saveAndAdd')"
                  type="primary"
                  class="min-w-42 min-h-11"
                  >{{ t('reuse.saveAndAdd') }}</el-button
                >

                <el-button @click="cancel()" class="min-w-42 min-h-11">{{
                  t('reuse.cancel')
                }}</el-button>
              </div>
            </div>
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
                  action="#"
                  :limit="10"
                  :on-change="handleChange"
                  :before-remove="beforeRemove"
                  :auto-upload="false"
                  :multiple="true"
                  v-model:fileList="ListFileUpload"
                  :disabled="disabledForm"
                >
                  <el-button class="text-[#303133] font-medium dark:text-[#fff]"
                    >+ {{ t('formDemo.addPhotosOrFiles') }}
                  </el-button>
                </el-upload>
              </div>
            </div>
            <ElForm
              ref="ruleFormRef2"
              :model="ruleForm"
              :rules="rules"
              hide-required-asterisk
              label-width="170px"
              @register="register"
              status-icon
              :disabled="disableData"
            >
              <div class="text-sm text-[#303133] font-medium p pl-4 dark:text-[#fff] mt-28">
                <el-divider content-position="left">{{ t('formDemo.address') }}</el-divider>

                <ElFormItem
                  class="flex w-[100%] items-center"
                  :label="t('formDemo.provinceOrCity')"
                >
                  <el-select
                    v-model="valueProvince"
                    style="width: 96%"
                    class="m-2 fix-full-width"
                    :placeholder="t('reuse.selectProvinceCity')"
                    @change="(data) => CityChange(data)"
                  >
                    <el-option
                      v-for="item in cities"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </ElFormItem>
                <ElFormItem
                  class="flex w-[100%] items-center"
                  :label="t('formDemo.countyOrDistrict')"
                >
                  <el-select
                    v-model="valueDistrict"
                    style="width: 96%"
                    class="m-2 fix-full-width"
                    :placeholder="t('reuse.selectCountyOrDistrict')"
                    @change="(data) => districtChange(data)"
                  >
                    <el-option
                      v-for="item in district"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </ElFormItem>
                <ElFormItem class="flex w-[100%] items-center" :label="t('formDemo.wardOrCommune')">
                  <el-select
                    v-model="valueCommune"
                    style="width: 96%"
                    class="m-2 fix-full-width"
                    :placeholder="t('reuse.selectWardOrCommune')"
                  >
                    <el-option
                      v-for="item in ward"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </ElFormItem>
                <ElFormItem
                  class="flex w-[100%] items-center"
                  :label="t('formDemo.detailedAddress')"
                >
                  <el-input
                    v-model="enterdetailAddress"
                    style="width: 96%"
                    class="m-2 fix-full-width"
                    :placeholder="t('reuse.enterDetailedAddress')"
                    clearable
                    filterable
                    allow-create
                  />
                </ElFormItem>
              </div>
              <div class="text-sm text-[#303133] font-medium p pl-4 dark:text-[#fff] mt-14">
                <el-divider content-position="left">{{ t('reuse.accountBank') }}</el-divider>

                <ElFormItem
                  class="flex items-center w-[98%]"
                  :label="t('userDemo.username')"
                  prop="accountName"
                >
                  <el-input
                    v-model="ruleForm.accountName"
                    class="w-[80%] outline-none pl-2 dark:bg-transparent"
                    type="text"
                    :placeholder="t('formDemo.enterAccountName')"
                  />
                </ElFormItem>

                <ElFormItem
                  class="flex items-center w-[98%]"
                  :label="t('userDemo.accountNumber')"
                  prop="accountNumber"
                >
                  <el-input
                    v-model="ruleForm.accountNumber"
                    class="w-[80%] outline-none pl-2 dark:bg-transparent"
                    type="text"
                    :placeholder="t('formDemo.enterAccountNumber')"
                  />
                </ElFormItem>

                <ElFormItem
                  class="flex items-center w-[98%]"
                  :label="t('reuse.bank')"
                  prop="bankName"
                >
                  <el-select
                    v-model="ruleForm.bankName"
                    class="w-[80%] outline-none pl-2 dark:bg-transparent"
                    type="text"
                    :placeholder="t('reuse.selectBank')"
                  >
                    <el-option
                      v-for="item in bankList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </ElFormItem>
              </div>
              <div class="text-sm text-[#303133] font-medium p pl-4 dark:text-[#fff] mt-14">
                <el-divider content-position="left">{{ t('formDemo.codeQR') }}</el-divider>
                <Qrcode :text="ruleForm.customerCode" />
              </div>
            </ElForm>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style scoped>
.option-select > .option-1 {
  background-color: #409eff;
  color: #ffffff;
  padding: 5px;
}

.option-select > .option-2 {
  background-color: #f56918;
  color: #ffffff;
  padding: 5px;
}

.black-color {
  color: #000000;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

::v-deep(.custom-select-w38 > .el-select) {
  width: 38%;
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

::v-deep(.el-select) {
  width: 100%;
}

::v-deep(.el-table .cell) {
  word-break: break-word;
}

::v-deep(.el-textarea__inner) {
  box-shadow: none;
  padding: 5px 0;
}

::v-deep(.el-form-item) {
  display: flex;
  align-items: center;
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

::v-deep(.el-divider__text) {
  font-size: 16px;
}

.demo-date-picker {
  display: flex;
  width: 100%;
  padding: 0;
  flex-wrap: wrap;
}

.demo-date-picker .block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}

.demo-date-picker .block:last-child {
  border-right: none;
}

.demo-date-picker .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}

::v-deep(.el-input__wrapper) {
  width: 100%;
  height: 34px;
}

::v-deep(.fix-width > .el-input) {
  width: 100%;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}

::v-deep(.el-form-item--default .el-form-item__error) {
  padding-left: 179px;
}

::v-deep(.el-dialog__header) {
  border-bottom: 1px solid rgb(214, 209, 209);
  margin-right: 0;
}
</style>
