<script setup lang="ts">
import { onBeforeMount, reactive, ref, watch, unref } from 'vue'
import {
  ElCollapse,
  ElCollapseItem,
  ElUpload,
  ElDivider,
  ElButton,
  ElDialog,
  ElOption,
  ElSelect,
  ElDatePicker,
  ElNotification,
  ElInput,
  ElFormItem,
  ElForm,
  ElMessage,
  UploadProps,
  ElMessageBox,
  UploadUserFile,
  ElCheckbox,
} from 'element-plus'
import moment from 'moment'
import { dateTimeFormat } from '@/utils/format'
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
  addNewAuthRegister,
  updatedCustomer,
  cancelCustomerAccount,
approvalOrder,
getCustomerList
} from '@/api/Business'
import { updatePasswordApi } from '@/api/login/index'
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
const approvalId = Number(router.currentRoute.value.params.approvalId)

const customerClassification = ref('Khách hàng')

const escape = useIcon({ icon: 'quill:escape' })

const { ValidService, notSpace, removeVietnameseTones } = useValidator()

const ruleFormRef = ref<FormInstance>()
const ruleFormRef2 = ref<FormInstance>()
const rules = reactive<FormRules>({
  //referralCode: [
  //{ required: false }
  //   { validator: ValidService.checkNameLength.validator },
  //   { validator: notSpecialCharacters }
  //],
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
  email: [ValidService.checkEmail],
  link: [ValidService.checkLink],
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
  confirmPassword: [
    {
      required: true,
      message: t('common.required'),
      trigger: 'blur'
    },
    {
      validator: (_rule: any, value: any, callback: any) => {
        if (value !== ruleForm.password) {
          callback(new Error(t('reuse.confirmPasswordError')))
        }
        callback()
      },
      required: true,
      trigger: 'blur'
    }
  ],
  cccd: [
    {
      validator: (_rule: any, value: any, callback: any) => {
        if (isNaN(value)) callback(new Error(t('reuse.numberFormat')))
        else if (value < 0) callback(new Error(t('reuse.positiveNumber')))
        callback()
      },
      required: true,
      trigger: 'blur'
    },
    ValidService.checkCCCD
  ],
  cccdCreateAt: [
    {
      type: 'date',
      required: false,
      message: 'Vui lòng chọn ngày cấp',
      trigger: 'change'
    }
  ],
  cccdPlaceOfGrant: [{ required: false }]
})

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
  confirmPassword: '',
  ProvinceId: '',
  DistrictId: '',
  WardId: '',
  Address: ''
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

const formValue = ref()
//get data from table
const getTableValue = async () => {
  if (!isNaN(id)) {
    const res = await getCustomerById({ Id: id })
    if (res) {
      if (res.data?.list !== undefined) {
        formValue.value = res.data?.list[0]
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
  if (type == 'detail' || type == 'edit' || type === 'approval-collab') {
    ruleForm.isActive = formValue.value?.isActive
    ruleForm.customerCode = formValue.value?.code
    ruleForm.referralCode = formValue.value?.referralCode
    if (formValue.value?.isOrganization) {
      ruleForm.businessClassification = true
    } else {
      ruleForm.businessClassification = false
    }
    if (formValue.value?.sex) {
      ruleForm.sex = true
    } else {
      ruleForm.sex = false
    }
    formValue.value?.customerFiles?.map((element) => {
      if (element.file !== null) {
        ListFileUpload.value.push({
          url: `${API_URL}${element?.file?.path}`,
          name: element?.file?.fileName
          // id: element?.file?.id
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
    ruleForm.bankName = formValue.value.bank?.id
    ruleForm.accountNumber = formValue.value.accountNumber
    ruleForm.doB = formValue.value.doB
    ruleForm.taxCode = formValue.value.taxCode
    ruleForm.userName = formValue.value.userName
    ruleForm.Address = formValue.value.address
    ruleForm.ProvinceId = formValue.value.provinceId
    ruleForm.DistrictId = formValue.value.districtId
    ruleForm.WardId = formValue.value.wardId

    await callApiCity()
    await CityChange(formValue.value.provinceId)
    await districtChange(formValue.value.districtId)
    const result1 = cities.value.find((e) => e.value == formValue.value.provinceId)
    valueProvince.value = result1?.label
    const result2 = district.value.find((e) => e.value == formValue.value.districtId)
    valueDistrict.value = result2?.label

    const result3 = ward.value.find((e) => e.value == formValue.value.wardId)
    valueCommune.value = result3?.label
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

const updateCustomer = async () => {
  const payload = {
    Id: id,
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
    ProvinceId: ruleForm.ProvinceId,
    DistrictId: ruleForm.DistrictId,
    WardId: ruleForm.WardId,
    Address: ruleForm.Address,
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
  await updatedCustomer(formDataPayLoad)
    .then(() => {
      ElNotification({
        message: t('reuse.updateSuccess'),
        type: 'success'
      })
      push({
        name: 'business.customer-management.customerList',
        params: { backRoute: 'business.customer-management.customerList' }
      })
    })
    .catch((error) => {
      ElNotification({
        message: error,
        type: 'warning'
      })
    })
}

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
const wardName = ref()
const districtName = ref()
const provinceName = ref()
const valueCommune = ref('')
const valueProvince = ref('')
const valueDistrict = ref('')
const callApiCity = async () => {
  cities.value = await getCity()
  cities.value
}

const CityChange = async (value) => {
  ruleForm.ProvinceId = value
  district.value = await getDistrict(value)
  provinceName.value = cities.value.find(e => e.value == value)
}

const districtChange = async (value) => {
  ruleForm.DistrictId = value
  ward.value = await getWard(value)
  districtName.value = district.value.find(e => e.value == value)
}
const wardChange = async (value) => {
  ruleForm.WardId = value
  wardName.value = ward.value.find(e => e.value == value)
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

const postCustomer = async (typebtn) => {
  const address = ruleForm.Address + ', '
    + wardName.value?.label + ', ' + districtName.value?.label +
    ', ' + provinceName.value?.label
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
    ProvinceId: ruleForm.ProvinceId,
    DistrictId: ruleForm.DistrictId,
    WardId: ruleForm.WardId,
    Address: address,
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
    .then(() => {
      ElNotification({
        message: t('reuse.addSuccess'),
        type: 'success'
      })
      if (typebtn === 'save') {
        push({
          name: 'business.customer-management.customerList',
          params: { backRoute: 'business.customer-management.customerList' }
        })
      }
      if (typebtn == 'saveAndAdd') {
          unref(ruleFormRef)!.resetFields()
          unref(ruleFormRef2)!.resetFields()
        }
    })
    .catch(() => 
       ElNotification({
        message: 'Trùng thông tin, vui lòng kiểm tra tên/mã/email/sđt ...',
        type: 'error'
      })
     )
  clear()
}

const postData = async (typebtn) => {
  await submitForm(ruleFormRef.value, ruleFormRef2.value)
  if (checkValidate.value) {
    await addNewAuthRegister({
      FullName: ruleForm.name,
      Email: ruleForm.email,
      Password: ruleForm.password,
      ConfirmPassword: ruleForm.password,
      UserName: ruleForm.userName,
      PhoneNumber: ruleForm.phonenumber
    })
      .then(() => {
        postCustomer(typebtn)
      })
      .catch((res) =>{
        ElNotification({
        message: res.response.data.message,
        type: 'error'
      })
     } )
  }
}
const centerDialogVisible = ref(false)
const centerDialogCancelAccount = ref(false)

interface statusCollabType {
  name: string
  isActive?: boolean
  approveAt?: any
}

let arrayStatusCollab = ref(Array<statusCollabType>())
// let statusCollab = ref('Khởi tạo mới')

//hủy tài khoản khách hàng
const cancelAccountCustomer = async () => {
  const payload = {
    Id: id
  }
  const formDataPayLoad = FORM_IMAGES(payload)
  await cancelCustomerAccount(formDataPayLoad)
    .then(() => {
      ElNotification({
        message: 'Hủy tài khoản thành công',
        type: 'success'
      }),
        push({
          name: 'business.customer-management.customerList',
          params: { backRoute: 'business.customer-management.customerList' }
        })
    })
    .catch(() => {
      ElNotification({
        message: 'Hủy tài khoản thất bại',
        type: 'warning'
      })
    })
}

let disableData = ref(false)
watch(
  () => type,
  () => {
    if (type === 'detail') {
      disableData.value = true
    }
    if (type === 'detail' || type === 'edit' || type === 'approval-collab') {
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
    disableData.value = true
  }
}

const formatDate = () => {
  console.log(ruleForm.doB)
}

interface typeCustomer {
  value: any
  label: any
}
const chooseCustomer = reactive<Array<typeCustomer>>([])

// call api customer
const pageIndexCustomer = ref(1)
const scrollCustomerTop = ref(false)
const scrollCustomerBottom = ref(false)

const noMoreCustomerData = ref(false)
const callAPICustomer = async () => {
 const res =  await getCustomerList({pageSize:10,pageIndex:pageIndexCustomer.value})
  if(res?.data && res.data?.length > 0){
    res?.data.map((el) => {
        chooseCustomer.push({
          value: el.id,
          label: el.code
        })
    })
  }
}

const ScrollCustomerBottom = () => {
  scrollCustomerBottom.value = true
  pageIndexCustomer.value++
  noMoreCustomerData.value
    ? ''
    : getCustomerList({ PageIndex: pageIndexCustomer.value, PageSize: 10 })
        .then((res) => {
          res.data.length == 0
            ? (noMoreCustomerData.value = true)
            : res.data.map((el) =>
               chooseCustomer.push({
                value: el.id,
                label: el.code
                })
              )
        })
        .catch(() => {
          noMoreCustomerData.value = true
        })
}

const scrolling = (e) => {
  const clientHeight = e.target.clientHeight
  const scrollHeight = e.target.scrollHeight
  const scrollTop = e.target.scrollTop
  if (scrollTop == 0) {
    scrollCustomerTop.value = true
  }
  if (scrollTop + clientHeight >= scrollHeight) {
    ScrollCustomerBottom()
  }
}

const ListFileUpload = ref<UploadUserFile[]>([])
const disabledForm = ref(false)
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

const approvalFunction = async () => {
  const payload = { ItemType: 3, Id: approvalId, IsApprove: true }
  await approvalOrder(FORM_IMAGES(payload))
  push({
    name: `approve.accounts-approval.user-account`
  })
}

const updatePassword = async () => {
  centerDialogVisible.value = false
  const payload = {
    userName: formValue.value?.userName !== null ? formValue.value?.userName : null,
    email: formValue.value?.userName == null ? formValue.value?.email : null,
    newPassword: ruleForm.password,
    confirmPassword: ruleForm.confirmPassword
  }
  await updatePasswordApi(payload)
    .then(() => {
      ElMessage({
        type: 'success',
        message: 'Đổi mật khẩu thành công'
      })
    })
    .catch(() => {
      ElMessage({
        type: 'success',
        message: 'Đổi mật khẩu thất bại'
      })
    })
}

onBeforeMount(() => {
  callAPICustomer()
  change()
  callApiCity()
  if(type === 'add' || type === ':type'){
    getGenCodeCustomer()
    arrayStatusCollab.value.push({
    name: 'Khởi tạo mới',
    isActive: true,
    approveAt: moment()
  })
  }
  if (type === 'detail') {
    disabledForm.value = true
  }
  if (type === 'detail' || type === 'edit' || type === 'approval-collab') {
    getTableValue()
  }
})
</script>

<template>
  <div class="demo-collapse dark:bg-[#141414]">
    <el-collapse v-model="activeName" @change="collapseChangeEvent">
      <el-collapse-item :name="collapse[0].name" :disabled="disableData">
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

        <div class="flex w-[100%] gap-6">
          <div class="w-[50%]">
            <ElForm
              ref="ruleFormRef"
              :model="ruleForm"
              :rules="rules"
              label-width="170px"
              require-asterisk-position="right"
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

              <ElFormItem class="flex items-center w-[100%]" label-width="0" prop="referralCode">
                <div class="flex">
                  <label class="min-w-[170px] pr-2 text-right">{{ t('reuse.referralCode') }}</label>
                  <div class="w-[84%]">
                    <!-- <el-input
                      v-model="ruleForm.referralCode"
                      class="w-[80%] outline-none pl-2 dark:bg-transparent"
                      type="text"
                      :placeholder="t('reuse.enterReferralCode')"
                      :formatter="
                        (value) =>
                          value
                            .normalize('NFD')
                            .replace(/[\u0300-\u036f]/g, '')
                            .replace(/đ/g, 'd')
                            .replace(/Đ/g, 'D')
                            .trim()
                      "
                    /> -->
                    
                    <el-select
                      class="w-full"
                      v-model="ruleForm.referralCode"
                      :placeholder="t('reuse.enterReferralCode')"
                      filterable
                      >
                      <div @scroll="scrolling" id="content">
                        <el-option
                            v-for="item in chooseCustomer"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </div>
                    </el-select>
                    
                  </div>
                </div>
              </ElFormItem>
              <el-divider content-position="left">{{
                t('formDemo.generalInformation')
              }}</el-divider>
              <ElFormItem :label="t('formDemo.classify')" class="flex items-center w-[100%]">
                <div class="flex">
                  <div class="flex w-[100%]">
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
                <ElFormItem
                  class="flex items-center w-[100%]"
                  :label="t('formDemo.customerName')"
                  prop="name"
                >
                  <el-input
                    v-model="ruleForm.name"
                    class="w-[80%] outline-none pl-2 dark:bg-transparent"
                    type="text"
                    :placeholder="t('formDemo.enterCustomerName')"
                    :formatter="(value) => value.replace(/^\s+$/gm, '')"
                  />
                </ElFormItem>

                <ElFormItem
                  class="flex items-center w-[100%] mt-5"
                  :label="t('reuse.phoneNumber')"
                  prop="phonenumber"
                >
                  <el-input
                    v-model="ruleForm.phonenumber"
                    class="w-[80%] outline-none pl-2 dark:bg-transparent"
                    type="text"
                    :placeholder="t('reuse.enterPhoneNumber')"
                  />
                </ElFormItem>

                <el-form-item
                  class="flex items-center w-[100%] mt-5"
                  :label="t('reuse.email')"
                  prop="email"
                >
                  <el-input
                    v-model="ruleForm.email"
                    class="w-[80%] outline-none pl-2 dark:bg-transparent"
                    type="text"
                    :placeholder="t('formDemo.enterEmail')"
                    :formatter="(value) => removeVietnameseTones(value)"
                  />
                </el-form-item>

                <el-form-item :label="t('reuse.cmnd')">
                  <div class="flex gap-2 pl-2 w-[100%] cccd-format">
                    <div class="flex-1 fix-width">
                      <el-form-item prop="cccd">
                        <el-input
                          v-model="ruleForm.cccd"
                          class="w-[25%] outline-none dark:bg-transparent"
                          type="text"
                          :placeholder="t('formDemo.enterCCCD')"
                        />
                      </el-form-item>
                    </div>

                    <div class="flex-1 fix-width">
                      <el-form-item prop="cccdCreateAt">
                        <el-date-picker
                          v-model="ruleForm.cccdCreateAt"
                          type="date"
                          :placeholder="t('formDemo.supplyDate')"
                          :disabled-date="disabledDate"
                          :size="size"
                          :editable="false"
                          format="DD/MM/YYYY"
                          value-format="YYYY-MM-DD"
                          class="w-[25%] min-w-[203px] cccd-createAt outline-none dark:bg-transparent"
                        />
                      </el-form-item>
                    </div>

                    <div class="flex-1 fix-width">
                      <el-form-item prop="cccdPlaceOfGrant">
                        <el-input
                          v-model="ruleForm.cccdPlaceOfGrant"
                          class="w-[25%] outline-none dark:bg-transparent"
                          type="text"
                          :placeholder="t('formDemo.supplyAddress')"
                        />
                      </el-form-item>
                    </div>
                  </div>
                </el-form-item>

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
                        :editable="false"
                        format="DD/MM/YYYY"
                        value-format="YYYY-MM-DD"
                        @change="formatDate"
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

                <ElFormItem
                  class="flex items-center w-[100%] mt-5"
                  :label="t('reuse.link')"
                  prop="link"
                >
                  <el-input
                    prop="link"
                    v-model="ruleForm.link"
                    class="w-[80%] outline-none pl-2 dark:bg-transparent"
                    type="text"
                    :placeholder="t('reuse.enterFacebookZaloLink')"
                    :formatter="(value) => value.replace(/^\s+$/gm, '')"
                  />
                </ElFormItem>
              </div>

              <div v-if="ruleForm.businessClassification === true">
                <ElFormItem
                  class="flex items-center w-[100%]"
                  :label="t('reuse.companyName')"
                  prop="name"
                >
                  <el-input
                    v-model="ruleForm.name"
                    class="w-[80%] outline-none pl-2 dark:bg-transparent"
                    type="text"
                    :placeholder="t('formDemo.enterCompanyName')"
                    :formatter="(value) => value.replace(/^\s+$/gm, '')"
                  />
                </ElFormItem>

                <ElFormItem
                  class="flex items-center w-[100%]"
                  :label="t('reuse.taxCode')"
                  prop="taxCode"
                >
                  <el-input
                    v-model="ruleForm.taxCode"
                    class="w-[80%] outline-none pl-2 dark:bg-transparent"
                    type="text"
                    :placeholder="t('formDemo.enterTaxCode')"
                    :formatter="(value) => value.replace(/^\s+$/gm, '')"
                  />
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
                    :formatter="(value) => value.replace(/^\s+$/gm, '')"
                  />
                </ElFormItem>

                <ElFormItem
                  class="flex items-center w-[100%] mt-5"
                  :label="t('reuse.phoneNumber')"
                  prop="phonenumber"
                >
                  <el-input
                    v-model="ruleForm.phonenumber"
                    class="w-[80%] outline-none pl-2 dark:bg-transparent"
                    type="text"
                    :placeholder="t('reuse.enterPhoneNumber')"
                    :formatter="(value) => value.replace(/^\s+$/gm, '')"
                  />
                </ElFormItem>

                <ElFormItem
                  class="flex items-center w-[100%]"
                  :label="t('reuse.email')"
                  prop="email"
                >
                  <el-input
                    v-model="ruleForm.email"
                    class="w-[80%] outline-none pl-2 dark:bg-transparent"
                    type="text"
                    :placeholder="t('formDemo.enterEmail')"
                    :formatter="(value) => value.replace(/^\s+$/gm, '')"
                  />
                </ElFormItem>

                <ElFormItem class="flex items-center w-[100%] mt-5" :label="t('reuse.link')">
                  <el-input
                    prop="link"
                    v-model="ruleForm.link"
                    class="w-[80%] outline-none pl-2 dark:bg-transparent"
                    type="text"
                    :placeholder="t('reuse.enterFacebookZaloLink')"
                    :formatter="(value) => value.replace(/^\s+$/gm, '')"
                  />
                </ElFormItem>
              </div>

              <el-divider content-position="left">{{ t('formDemo.accountAndStatus') }}</el-divider>
              <div>
                <ElFormItem class="flex items-center w-[100%]" prop="userName">
                  <template #label>
                    <div>
                      <div class="text-right">{{ t('formDemo.userName') }}</div>
                      <div style="color: orange" class="text-xs">{{
                        t('reuse.loginAppWebUser')
                      }}</div>
                    </div>
                  </template>
                  <el-input
                    v-model="ruleForm.userName"
                    class="w-[80%] outline-none pl-2 dark:bg-transparent"
                    type="text"
                    :placeholder="t('formDemo.enterUserName')"
                    :formatter="(value) => value.replace(/^\s+$/gm, '')"
                  />
                </ElFormItem>
              </div>

              <div v-if="type == 'detail' || type == 'edit'">
                <ElFormItem
                  class="flex items-center w-[100%]"
                  prop="password"
                  :label="t('login.password')"
                >
                  <div class="flex">
                    <el-input
                      v-model="ruleForm.password"
                      class="w-[50%] outline-none pl-2 dark:bg-transparent"
                      type="password"
                      :placeholder="t('formDemo.enterPassword')"
                      :formatter="(value) => value.replace(/^\s+$/gm, '')"
                    />

                    <el-button
                      @click="centerDialogVisible = true"
                      class="w-[50%] outline-none min-h-9 pl-2 ml-3 dark:bg-transparent"
                      >{{ t('reuse.changePassword') }}
                    </el-button>
                  </div>
                  <el-dialog
                    v-model="centerDialogVisible"
                    :title="t('reuse.changePassword')"
                    width="30%"
                    align-center
                    class="font-semibold"
                  >
                    <ElFormItem
                      class="flex items-center w-[100%] mb-3 font-normal"
                      :label="t('reuse.newPassword')"
                      prop="password"
                    >
                      <el-input
                        v-model="ruleForm.password"
                        class="w-[80%] outline-none pl-2 dark:bg-transparent"
                        type="password"
                        :placeholder="t('reuse.enterNewPassword')"
                        :formatter="(value) => value.replace(/^\s+$/gm, '')"
                      />
                    </ElFormItem>

                    <ElFormItem
                      class="flex items-center w-[100%] font-normal mt-5"
                      :label="t('reuse.confirmPassword')"
                      prop="confirmPassword"
                    >
                      <el-input
                        v-model="ruleForm.confirmPassword"
                        class="w-[80%] outline-none pl-2 dark:bg-transparent"
                        type="password"
                        :placeholder="t('reuse.confirmPassword')"
                        :formatter="(value) => value.replace(/^\s+$/gm, '')"
                      />
                    </ElFormItem>
                    <template #footer>
                      <span class="dialog-footer">
                        <el-button
                          type="primary"
                          @click="updatePassword"
                          class="min-w-36 min-h-10"
                          >{{ t('reuse.save') }}</el-button
                        >
                        <el-button @click="centerDialogVisible = false" class="min-w-36 min-h-10">{{
                          t('reuse.exit')
                        }}</el-button>
                      </span>
                    </template>
                  </el-dialog>
                </ElFormItem>
              </div>
              <div class="w-[100%]" v-else>
                <ElFormItem
                  prop="password"
                  class="flex items-center w-[100%]"
                  :label="t('login.password')"
                >
                  <el-input
                    v-model="ruleForm.password"
                    class="w-[80%] outline-none pl-2 dark:bg-transparent"
                    type="text"
                    :placeholder="t('formDemo.enterPassword')"
                    :formatter="(value) => value.replace(/^\s+$/gm, '')"
                  />
                </ElFormItem>

                <ElFormItem
                  class="flex items-center w-[100%]"
                  :label="t('reuse.confirmPassword')"
                  prop="confirmPassword"
                >
                  <el-input
                    v-model="ruleForm.confirmPassword"
                    class="w-[80%] outline-none pl-2 dark:bg-transparent"
                    type="text"
                    :placeholder="t('reuse.confirmPassword')"
                    :formatter="(value) => value.replace(/^\s+$/gm, '')"
                  />
                </ElFormItem>
              </div>
              <ElFormItem class="flex items-center w-[100%]" :label="t('formDemo.statusActive')">
                <el-checkbox class="ml-4" v-model="ruleForm.isActive">{{
                  t('formDemo.isActive')
                }}</el-checkbox>
              </ElFormItem>
            </ElForm>

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
                  item.name == 'Duyệt khởi tạo tài khoản' || item.name == 'Duyệt hủy tài khoản'">
                
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


            <div class="option-page mt-5">
              <div v-if="type === 'detail'" class="flex" style="margin-left: 11rem">
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
                        @click="
                          () => {
                            cancelAccountCustomer()
                            centerDialogCancelAccount = false
                          }
                        "
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
              <div v-else-if="type === 'edit'" class="flex" style="margin-left: 11rem">
                <el-button @click="updateCustomer" type="primary" class="min-w-42 min-h-11">{{
                  t('reuse.save')
                }}</el-button>
                <el-button @click="cancel()" type="danger" class="min-w-42 min-h-11">{{
                  t('reuse.cancel')
                }}</el-button>
              </div>
              <div v-else-if="type === 'approval-collab'" class="w-[100%] flex ml-50 gap-4">
            <el-button @click="approvalFunction" type="warning" class="min-w-42 min-h-11">{{
              t('router.approve')
            }}</el-button>
            <el-button class="min-w-42 min-h-11 rounded font-bold">{{
              t('router.notApproval')
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
                    @change="(data) => wardChange(data)"
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
                    v-model="ruleForm.Address"
                    style="width: 96%"
                    class="m-2 fix-full-width"
                    :placeholder="t('reuse.enterDetailedAddress')"
                    :formatter="(value) => value.replace(/^\s+$/gm, '')"
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
                    :formatter="(value) => value.replace(/^\s+$/gm, '')"
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
                    :formatter="(value) => value.replace(/^\s+$/gm, '')"
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

::v-deep(.fix-err > .el-form-item__content > .el-form-item__error) {
  padding-left: 8px !important;
}

::v-deep(.el-dialog__header) {
  border-bottom: 1px solid rgb(214, 209, 209);
  margin-right: 0;
}

::v-deep(.align-items-start) {
  align-items: flex-start !important;
}

@media (max-width: 1366px) {
  .cccd {
    display: grid !important;
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  ::v-deep(.el-date-editor.el-input),
  .cccd-createAt {
    width: 100% !important;
  }
}

::v-deep(.cccd-format .fix-width .el-form-item__content > .el-input) {
  width: 100% !important;
}

#content {
  height: 200px;
  overflow: auto;
  padding: 0 10px;
}
</style>
