<script setup lang="ts">
import { computed, onBeforeMount, reactive, ref, watch } from 'vue'
import { Collapse } from '../../Components/Type'
import { useIcon } from '@/hooks/web/useIcon'
import { dateTimeFormat } from '@/utils/format'
import {
  ElCollapse,
  ElCollapseItem,
  ElButton,
  ElDivider,
  FormInstance,
  FormRules,
  ElForm,
  ElFormItem,
  ElInput,
  ElDatePicker,
  ElOption,
  ElSelect,
  ElUpload,
  ElMessage,
  UploadProps,
  ElCheckbox,
  ElRow,
  ElCol,
  ElMessageBox,
  ElDialog,
  ElNotification
} from 'element-plus'
import moment from 'moment'
import { useI18n } from 'vue-i18n'
import { useForm } from '@/hooks/web/useForm'
import { getCity, getDistrict, getWard } from '@/utils/Get_Address'
import Qrcode from '@/components/Qrcode/src/Qrcode.vue'
import { useRouter } from 'vue-router'
import { FORM_IMAGES } from '@/utils/format'
import {
  addNewStaff,
  getBranchList,
  getDepartmentList,
  getRankList,
  getTypePersonnelList,
  getRoleList,
  updeteStaffAccount,
  deleteStaffAccount
} from '@/api/HumanResourceManagement'
import { useValidator } from '@/hooks/web/useValidator'
import { getEmployeeById } from '@/api/Accountant'
import { API_URL } from '@/utils/API_URL'
import InfinitOptions from '@/components/Select/InfinitOptions.vue'
import { getCategories } from '@/api/LibraryAndSetting'
import { systemCode } from '@/utils/status'

const disableUserName = ref(false)
const centerDialogCancelAccount = ref(false)
const getMapData = ({id, name, logo}) => ({logo: logo, label: name, value: id,}) 
const { push } = useRouter()
const { t } = useI18n()
const doCloseOnClickModal = ref(false)
const showPassword = ref(true)
//random mã
const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })
const escape = useIcon({ icon: 'quill:escape' })
const pageIndex = ref(1)
const collapse: Array<Collapse> = [
  {
    icon: minusIcon,
    name: 'generalInformation',
    title: 'Thông tin nhân sự',
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

//upload image

const activeName = ref(collapse[0].name)

const router = useRouter()
const id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)
const ruleFormRef = ref<FormInstance>()
const ruleFormRef2 = ref<FormInstance>()
const { ValidService, notSpace } = useValidator()
type branchType = {
  value: number,
  code: string,
  label:string,
}
const listBranchs = ref<branchType[]>()
const branchCode = computed(():string => { 
  if (listBranchs?.value && listBranchs?.value.length > 0 && ruleForm.branch) {
    const obj = listBranchs.value.find(el => el.value === parseInt(ruleForm.branch))
    return obj ? obj.code : ''
  }  
  return ''
})
const ruleForm = reactive({
  staffCode: '',
  phoneNumber: '',
  name: '',
  accountName: '',
  bankName: '',
  customerCode: '',
  accountNumber: '',
  doB: '',
  sex: true,
  branch: '',
  link: '',
  cccd: '',
  cccdCreateAt: '',
  cccdPlaceOfGrant: '',
  email: '',
  delivery: false,
  type: [],
  resource: '',
  department: '',
  jobPosition: '',
  typeOfEmployee: '',
  userName: '',
  decentralization: '',
  confirmPassword: '',
  ProvinceId: '',
  DistrictId: '',
  WardId: '',
  roleAcces: '',
  Address: '',
  password: '',
  city: '',
  district: '',
  ward: '',
  isActive: true
})
const rules = reactive<FormRules>({
  name: [
    { required: true, message: 'Vui lòng nhập tên', trigger: 'blur' },
    { min: 1, max: 30, message: 'Độ dài phải lớn hơn 1 và nhỏ hơn 30', trigger: 'change' }
  ],
  email: [ValidService.required, ValidService.checkEmail],
  branch: [ValidService.required],
  sex: [ValidService.required],
  jobPosition: [ValidService.required],
  ProvinceId: [ValidService.required],
  DistrictId: [ValidService.required],
  typeOfEmployee: [ValidService.required],
  department: [ValidService.required],
  city: [ValidService.required],
  ward: [ValidService.required],
  district: [ValidService.required],
  phoneNumber: [
    {
      required: true,
      message: t('common.required'),
      trigger: 'change'
    },
    {
      validator: (_rule: any, value: any, callback: any) => {
        if (isNaN(value)) callback(new Error(t('reuse.numberFormat')))
        else if (value < 0) callback(new Error(t('reuse.positiveNumber')))
        callback()
      },
      required: true,
      trigger: 'change'
    },
    ValidService.checkPhone
  ],
  cccdCreateAt: [
  { required: true, message: t('common.required'), trigger: 'change', type: 'date' }
  ],
  Address: [ValidService.required],
  doB: [
    {
      type: 'date',
      required: true,
      message: t('reuse.chooseBirthday'),
      trigger: 'change'
    }
  ],
  userName: [
    { validator: notSpace }
  ],
  confirmPassword: [
    {
      validator: (_rule: any, value: any, callback: any) => {
        if (value !== ruleForm.password) {
          callback(new Error(t('reuse.confirmPasswordError')))
        }
        callback()
      },
      trigger: 'blur'
    }
  ],
  cccdPlaceOfGrant: [{ required: true, message: t('common.required'), trigger: 'blur' }],
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
    ValidService.checkCCCD,
  ],
  type: [
    {
      type: 'array',
      required: true,
      message: 'Please select at least one activity type',
      trigger: 'change'
    }
  ],
  resource: [
    {
      required: true,
      message: 'Please select activity resource',
      trigger: 'change'
    }
  ],
  desc: [{ required: true, message: 'Please input activity form', trigger: 'blur' }]
})

const optionsGender = [
  {
    value: true,
    label: 'Nam'
  },
  {
    value: false,
    label: 'Nữ'
  }
]

const alwayShowAdd = ref(false)

const { register } = useForm()
let disableData = ref(false)
const CallApiBranch = async () => {
  const res = await getBranchList()
  if (res) {
    listBranchs.value = res.data.map((branch) => ({ label: branch.name,code:branch.code, value: branch.id }))
    return listBranchs.value
  } else {
    ElMessage({
      message: t('reuse.cantGetData'),
      type: 'error'
    })
    return
  }
}
const listPosition = ref()
const CallApiPosition = async () => {
  const res = await getRankList()
  if (res) {
    listPosition.value = res.data.map((position) => ({
      label: position.name,
      value: position.id
    }))
    return listPosition.value
  } else {
    ElMessage({
      message: t('reuse.cantGetData'),
      type: 'error'
    })
    return
  }
}

const listDepartments = ref()
const CallApiDepartment = async () => {
  const res = await getDepartmentList()
  if (res) {
    listDepartments.value = res.data.map((department) => ({
      label: department.name,
      value: department.id
    }))
    return listDepartments.value
  } else {
    ElMessage({
      message: t('reuse.cantGetData'),
      type: 'error'
    })
    return
  }
}

// const listViTris = ref()
// const CallApiViTri = async () => {
//   const res = await getBranchList()
//   if (res) {
//     listViTris.value = res.data.map((vitri) => ({ label: vitri.name, value: vitri.id }))
//     return listViTris.value
//   } else {
//     ElMessage({
//       message: t('reuse.cantGetData'),
//       type: 'error'
//     })
//     return
//   }
// }

const listTypeOfStaff = ref()
const CallApiStaff = async () => {
  const res = await getTypePersonnelList()
  if (res) {
    listTypeOfStaff.value = res.data.map((staff) => ({ label: staff.name, value: staff.id }))
    return listTypeOfStaff.value
  } else {
    ElMessage({
      message: t('reuse.cantGetData'),
      type: 'error'
    })
    return
  }
}
const cities = ref()
const district = ref()
const ward = ref()
const valueCommune = ref('')
const valueProvince = ref('')
const valueDistrict = ref('')
const callApiCity = async () => {
  cities.value = await getCity()
}

watch(() => valueProvince.value, async val => {
  ruleForm.city = val
  if (val) {
    district.value = await getDistrict(val)
    // valueCommune.value = ''
    // valueDistrict.value = ''
  }
})

watch(() => valueDistrict.value, async val => {
  ruleForm.district = val
  if (val) {
    ward.value = await getWard(val)
    // valueCommune.value = ''
  }
})
watch(() => valueCommune.value, async val => {
  ruleForm.ward = val
})

const disabledDate = (time: Date) => {
  return time.getTime() > Date.now()
}

const size = ref<'' | 'large' | 'small'>('')

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

const cancel = async () => {
  push({
    name: 'human-resource-management.personnel-accounts',
    params: { backRoute: 'human-resource-management.personnel-accounts' }
  })
}

let FileDeleteIds: any = []

const beforeRemove : any = (uploadFile) => {
  return ElMessageBox.confirm(`Bạn muốn xóa ${uploadFile.name} ?`, {
    confirmButtonText: 'OK',
    cancelButtonText: 'Hủy',
    type: 'warning',
    draggable: true
  })
    .then(() => {
      ElMessage({
        type: 'success',
        message: 'Đã xóa'
      })
      let imageRemove = uploadFile.id
      FileDeleteIds.push(imageRemove)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Hủy xóa'
      })
    })
}

const optionsRole = ref()

const callApiGetRoleList = async () => {
  const params = {
    Keyword: '',
    PageIndex: 1,
    PageSize: 99999,
    isActive: true,
  }
  const res = await getRoleList(params)
  if (res) {
    optionsRole.value = res.data.map((el) => ({ label: el.name, value: el.id }))
    return optionsRole.value
  } else {
    ElMessage({
      message: t('reuse.cantGetData'),
      type: 'error'
    })
    return
  }
}
const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.warning(
    `${t('reuse.limitUploadImages')}. ${t('reuse.imagesYouChoose')}: ${files.length}. ${t(
      'reuse.total'
    )} ${files.length + uploadFiles.length}`
  )
}

const ListFileUpload = ref()
const handleChange: UploadProps['onChange'] = async (_uploadFile, uploadFiles) => {
  ListFileUpload.value = uploadFiles
}
const editPage = async () => {
  push({
    name: `${String(router.currentRoute.value.name)}`,
    params: { id: id, type: 'edit' }
  })
}

let checkValidate = ref(false)
let checkValidateForm = ref(false)

const postData = async (typebtn) => {
  await submitForm(ruleFormRef.value, ruleFormRef2.value)
  if (checkValidate.value) {
    const payload = {
      Code: ruleForm.staffCode,
      Name: ruleForm.name,
      PhoneNumber: ruleForm.phoneNumber,
      Email: ruleForm.email,
      CCCD: ruleForm.cccd,
      LicenseDate: moment(ruleForm.cccdCreateAt).format('YYYY/MM/DD'),
      LicensePlace: ruleForm.cccdPlaceOfGrant,
      Birthday: moment(ruleForm.doB).format('YYYY/MM/DD'),
      IsActive: true,
      Gender: ruleForm.sex,
      Contact: ruleForm.link,
      FileId: ListFileUpload.value || [],
      BranchId: ruleForm.branch,
      DepartmentId: ruleForm.department,
      PositionId: ruleForm.jobPosition,
      TypeOfStaff: ruleForm.typeOfEmployee,
      AddressProvinceId: valueProvince.value,
      AddressDistrictId: valueDistrict.value,
      WardId: valueCommune.value,
      Address: ruleForm.Address,
      BankAccountName: ruleForm.accountName,
      BankAccountNumber: ruleForm.accountNumber,
      BankId: ruleForm.bankName,
      User: ruleForm.userName,
      Password: ruleForm.password,
      ConfirmPassword: ruleForm.confirmPassword,
      RoleId: ruleForm.roleAcces || 0,
    }
    const formDataPayLoad = FORM_IMAGES(payload)
    await addNewStaff(formDataPayLoad)
      .then(() => {
        ElNotification({
          message: t('reuse.addSuccess'),
          type: 'success'
        })
        if (typebtn === 'save') {
          push({
            name: 'human-resource-management.personnel-accounts',
            params: { backRoute: 'human-resource-management.personnel-accounts' }
          })
        }
      })
      .catch((error) =>
        ElNotification({
            message: error.response.data.message,
            type: 'warning'
        })
      )
  }
}
const formValue = ref()
const isDisable = ref(false)
//get data from table
const getTableValue = async () => {
  if (!isNaN(id)) {
    const res = await getEmployeeById({ Id: id })
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
  if (type == 'detail' || type == 'edit') {
    isDisable.value = type === 'detail'
    showPassword.value = false
    ruleForm.isActive = formValue.value?.isActive
    ruleForm.customerCode = formValue.value?.code
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
    ruleForm.staffCode = formValue.value.code
    ruleForm.name = formValue.value.name
    ruleForm.phoneNumber = formValue.value.phonenumber
    ruleForm.email = formValue.value.email
    ruleForm.cccd = formValue.value.cccd
    ruleForm.cccdCreateAt = formValue.value.cccdNgayCap
    ruleForm.cccdPlaceOfGrant = formValue.value.cccdNoiCap
    ruleForm.doB = formValue.value.doB
    ruleForm.sex = formValue.value.gender
    ruleForm.link = formValue.value.contact
    ruleForm.accountName = formValue.value.bankAccountName
    ruleForm.bankName = formValue.value.bankId
    ruleForm.accountNumber = formValue.value.bankAccountNumber
    ruleForm.Address = formValue.value.address
    ruleForm.ProvinceId = formValue.value.provinceId
    ruleForm.DistrictId = formValue.value.districtId
    ruleForm.WardId = formValue.value.wardId
    ruleForm.branch = formValue.value.branchId
    ruleForm.department = formValue.value.departmentId
    ruleForm.jobPosition = formValue.value.positionId
    ruleForm.typeOfEmployee = formValue.value.typeStaffId
    valueProvince.value = formValue.value.addressProvinceId
    valueDistrict.value = formValue.value.addressDistrictId
    valueCommune.value = formValue.value.wardId
    ruleForm.Address = formValue.value.address
    ruleForm.userName = formValue.value.username
    ruleForm.roleAcces = formValue.value.roleId

    disableUserName.value = !!formValue.value.username
    // ListFileUpload.value = formValue.value.fieldId
  }
}


const editData = async (typebtn) => {
  await submitForm(ruleFormRef.value, ruleFormRef2.value)
  if (checkValidate.value) {
    const payload :any = {
      Id: formValue.value.id,
      Code: ruleForm.staffCode,
      Name: ruleForm.name,
      PhoneNumber: ruleForm.phoneNumber,
      Email: ruleForm.email,
      Birthday: moment(ruleForm.doB).format('YYYY/MM/DD'),
      CCCD: ruleForm.cccd,
      LicenseDate: moment(ruleForm.cccdCreateAt).format('DD/MM/YYYY'),
      LicensePlace: ruleForm.cccdPlaceOfGrant,
      Gender: ruleForm.sex,
      Contact: ruleForm.link,
      FileId: ListFileUpload.value || [],
      IsActive: true,
      BranchId: ruleForm.branch,
      DepartmentId: ruleForm.department,
      PositionId: ruleForm.jobPosition,
      TypeOfStaffId: ruleForm.typeOfEmployee,
      AddressProvinceId: valueProvince.value,
      AddressDistrictId: valueDistrict.value,
      WardId: valueCommune.value,
      Address: ruleForm.Address,
      BankAccountName: ruleForm.accountName,
      BankAccountNumber: ruleForm.accountNumber,
      BankId: ruleForm.bankName,
      RoleId: ruleForm.roleAcces,
      OldPassword: ruleForm.userName,
    }
    if(ruleForm.password && ruleForm.confirmPassword) {
      payload.Password = ruleForm.password
      payload.ConfirmPassword = ruleForm.confirmPassword
    }

    const formDataPayLoad = FORM_IMAGES(payload)
    await updeteStaffAccount(formDataPayLoad)
      .then(() => {
        ElNotification({
          message: t('reuse.updateSuccess'),
          type: 'success'
        })
        if (typebtn === 'save') {
          push({
            name: 'human-resource-management.personnel-accounts',
            params: { backRoute: 'human-resource-management.personnel-accounts' }
          })
        }
      })
      .catch((error) =>
        ElNotification({
            message: error.message || t('reuse.updateFail'),
            type: 'warning'
          })
        )
  }
}
const generateStaffCode = () => { 
  ruleForm.staffCode = systemCode.NHAN_VIEN + branchCode.value + ruleForm.cccd
}
 
onBeforeMount(() => {
  if (type != 'add') {
    getTableValue()
    generateStaffCode()
  }
  
  callApiCity()
  CallApiBranch()
  CallApiDepartment()
  CallApiPosition()
  CallApiStaff()
  callApiGetRoleList()
})
watch(
  () => type,
  () => {
    if (type === 'detail' || type === 'edit') {
      getTableValue()
      alwayShowAdd.value = false
    }
  },
  {
    deep: true,
    immediate: true
  }
)

const handleChangeOptions = (option) => {
  ruleForm.bankName = option.value
}

const deleteAccount = async () => {
  await deleteStaffAccount({ Id: id })
  .then((res) => {
    if(res?.succeeded) {
      ElNotification({
        message: t('reuse.deleteSuccess'),
        type: 'success'
      })
      push({
        name: 'human-resource-management.personnel-accounts',
      })
    }
  })
  .catch(() =>
    ElNotification({
      message: t('reuse.deleteFail'),
      type: 'error'
    })
  )
}

const showCancelEditPassword = ref(false)
const editPassword = () => {
  showPassword.value = true
  showCancelEditPassword.value = true
}
const cancelEditPassword = () => {
  showPassword.value = false
  showCancelEditPassword.value = false
}

</script>

<template>
  <div class="demo-collapse dark:bg-[#141414]">
    <el-collapse v-model="activeName" @change="collapseChangeEvent">
      <el-collapse-item :name="collapse[0].name">
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
          <div class="contain-full-w">
              <div class="flex gap-8">
                <div class="w-[50%]">
                  <el-divider content-position="left">{{
                    t('formDemo.generalInformation')
                  }}</el-divider>
                  <el-form
                    :loading="true"
                    ref="ruleFormRef"
                    :model="ruleForm"
                    :rules="rules"
                    label-width="170px"
                    class="demo-ruleForm"
                    status-icon
                  >
                    <el-form-item :label="t('reuse.employeeCode')" prop="staffCode">
                      <!-- <el-input v-model="ruleForm.staffCode" /> -->
                      <span class="pl-2">
                        {{ ruleForm.staffCode }}
                      </span>
                    </el-form-item>

                    <el-form-item :label="t('reuse.employeeName')" prop="name">
                      <el-input v-model="ruleForm.name" :placeholder="t('reuse.fullName')" :disabled="isDisable" @change="generateStaffCode" />
                    </el-form-item>

                    <el-form-item :label="t('reuse.phoneNumber')" prop="phoneNumber">
                      <el-input
                        v-model="ruleForm.phoneNumber"
                        type="text"
                        :placeholder="t('reuse.enterPhoneNumber')"
                        :disabled="isDisable"
                      />
                    </el-form-item>

                    <el-form-item :label="t('reuse.email')" prop="email">
                      <el-input v-model="ruleForm.email" :placeholder="t('reuse.enterEmail')" :disabled="isDisable" />
                    </el-form-item>

                    <el-form-item :label="t('reuse.cmnd')">
                      <div class="flex gap-2 w-[100%] cccd-format">
                        <div class="flex-1 fix-width">
                          <el-form-item prop="cccd" >
                            <el-input
                              v-model="ruleForm.cccd"
                              class="w-[25%] outline-none dark:bg-transparent"
                              type="text"
                              :placeholder="t('formDemo.enterCCCD')"
                              :disabled="isDisable"
                              @input="generateStaffCode"
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
                              :disabled="isDisable"
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
                              :disabled="isDisable"
                            />
                          </el-form-item>
                        </div>
                      </div>
                    </el-form-item>

                    <el-form-item
                      class="flex items-center w-[100%] mt-5 custom-select-w38"
                      :label="t('reuse.dateOfBirthAnGender')"
                    >
                      <div class="flex gap-2 w-[100%] cccd-format">
                        <div class="flex-1 fix-width">
                          <el-form-item prop="doB">
                            <el-date-picker
                              v-model="ruleForm.doB"
                              type="date"
                              :placeholder="t('reuse.dateOfBirth')"
                              :disabled-date="disabledDate"
                              :size="size"
                              :editable="false"
                              format="DD/MM/YYYY"
                              value-format="YYYY-MM-DD"
                              :disabled="isDisable"
                            />
                          </el-form-item>
                        </div>
                        <div class="flex-1">
                          <el-form-item prop="sex">
                            <el-select v-model="ruleForm.sex" clearable :placeholder="t('reuse.chooseGender')" :disabled="isDisable">
                              <el-option
                                v-for="item in optionsGender"
                                :key="item.label"
                                :label="item.label"
                                :value="item.value"
                              />
                            </el-select>
                          </el-form-item>
                        </div>
                      </div>
                    </el-form-item>

                    <el-form-item :label="t('reuse.link')" prop="link">
                      <el-input
                        prop="link"
                        v-model="ruleForm.link"
                        class="w-[80%] outline-none dark:bg-transparent"
                        type="text"
                        :placeholder="t('reuse.enterFacebookZaloLink')"
                        :formatter="(value) => value.replace(/^\s+$/gm, '')"
                        :disabled="isDisable"
                      />
                    </el-form-item>

                    <el-divider content-position="left">{{t('formDemo.jobPosition')}}</el-divider>

                    <el-form-item
                      class="flex items-center w-[100%] mt-5 custom-select-w38"
                      :label="t('reuse.brandAndDepartment')"
                    >
                      <div class="flex gap-2 w-[100%]">
                        <div class="flex-1 fix-width">
                          <el-form-item prop="branch">
                            <el-select v-model="ruleForm.branch" clearable :placeholder="t('reuse.chooseBranch')" :disabled="isDisable" @change="generateStaffCode">
                              <el-option
                                v-for="item in listBranchs"
                                :key="item.label"
                                :label="item.label"
                                :value="item.value"
                              />
                            </el-select>
                          </el-form-item>
                        </div>
                        <div class="flex-1">
                          <el-form-item prop="department">
                            <el-select
                              v-model="ruleForm.department"
                              clearable
                              :placeholder="t('reuse.chooseDepartment')"
                              :disabled="isDisable"
                            >
                              <el-option
                                v-for="item in listDepartments"
                                :key="item.label"
                                :label="item.label"
                                :value="item.value"
                              />
                            </el-select>
                          </el-form-item>
                        </div>
                      </div>
                    </el-form-item>

                    <el-form-item
                      class="flex items-center w-[100%] mt-5 custom-select-w38"
                      :label="t('reuse.rankAndType')"
                    >
                      <div class="flex gap-2 w-[100%]">
                        <div class="flex-1 fix-width">
                          <el-form-item prop="jobPosition">
                            <el-select
                              v-model="ruleForm.jobPosition"
                              clearable
                              :placeholder="t('reuse.chooseWorkLevel')"
                              :disabled="isDisable"
                            >
                              <el-option
                                v-for="item in listPosition"
                                :key="item.label"
                                :label="item.label"
                                :value="item.value"
                              />
                            </el-select>
                          </el-form-item>
                        </div>
                        <div class="flex-1">
                          <el-form-item prop="typeOfEmployee">
                            <el-select
                              v-model="ruleForm.typeOfEmployee"
                              clearable
                              :placeholder="t('reuse.chooseTypeAccount')"
                              :disabled="isDisable"
                            >
                              <el-option
                                v-for="item in listTypeOfStaff"
                                :key="item.label"
                                :label="item.label"
                                :value="item.value"
                              />
                            </el-select>
                          </el-form-item>
                        </div>
                      </div>
                    </el-form-item>

                    <el-divider content-position="left">{{ t('reuse.accountsAndPermissions') }}</el-divider>

                    <el-form-item :label="t('formDemo.userName')" prop="userName">
                      <el-input v-model="ruleForm.userName" :placeholder="t('formDemo.enterUserName')" :disabled="isDisable || disableUserName" />
                    </el-form-item>

                  <el-form-item :label="t('reuse.setRole')" :placeholder="t('reuse.fullName')">
                      <el-select
                        v-model="ruleForm.roleAcces"
                        clearable
                        :placeholder="t('reuse.choosePermission')"
                        :disabled="isDisable"
                      >
                        <el-option
                          v-for="item in optionsRole"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item> 

                    <el-form-item v-if="showPassword" :label="t('reuse.password')" prop="password">
                      <el-input v-model="ruleForm.password" :placeholder="t('formDemo.enterPassword')" :disabled="isDisable" />
                    </el-form-item>

                    <el-form-item v-if="showPassword" :label="t('formDemo.confirmPassword')" prop="confirmPassword">
                      <el-input
                        v-model="ruleForm.confirmPassword"
                        :placeholder="t('reuse.confirmPasswordAgain')"
                        :disabled="isDisable"
                      />
                    </el-form-item>
                    <el-form-item v-if="type == 'edit'">
                      <el-button @click="editPassword">{{ t('reuse.editPassword') }}</el-button>
                      <el-button v-if="showCancelEditPassword" @click="cancelEditPassword">{{ t('reuse.cancelEditPassword') }}</el-button>
                    </el-form-item>

                    <ElFormItem class="flex items-center w-[100%]" :label="t('formDemo.statusActive')">
                      <el-checkbox class="ml-4" :disabled="alwayShowAdd || isDisable" v-model="ruleForm.isActive">{{
                        t('formDemo.isActive')
                      }}</el-checkbox>
                    </ElFormItem>
                    <ElFormItem
                      class="flex align-items-start w-[100%]"
                      :label="t('formDemo.statusAccount')"
                    >
                      <ElRow class="ml-2">
                        <ElCol>
                          <span class="day-updated">
                            {{ t('formDemo.isNewAccount') }}
                          </span>
                        </ElCol>
                        <ElCol
                          ><label style=" font-size: 13px;font-style: italic">
                            {{ dateTimeFormat(moment()) }}</label
                          >
                        </ElCol>
                      </ElRow>
                    </ElFormItem>

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
                          :close-on-click-modal="doCloseOnClickModal"
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
                                @click="deleteAccount"
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
                        <el-button @click="editData('save')" type="primary" class="min-w-42 min-h-11">{{
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
                      </div>
                    </div>
                  </el-form>
                </div>

                <div class="w-[50%]">
                  <div class="text-sm text-[#303133] font-medium p pl-4 dark:text-[#fff]">
                    <el-divider content-position="left">{{ t('formDemo.attachments') }}</el-divider>
                  </div>
                  <div class="flex">
                    <div class="pl-5">
                      <div class="text-right">{{ t('formDemo.addPhotosOrFiles') }}</div>
                      <div class="text-right text-[#FECB80] italic">{{ t('formDemo.lessThanTenProfiles') }}</div>
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
                        :on-exceed="handleExceed"
                        :multiple="true"
                        v-model:fileList="ListFileUpload"
                        :disabled="isDisable"
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
                        prop="city"
                      >
                        <el-select
                          v-model="valueProvince"
                          style="width: 96%"
                          class="m-2 fix-full-width"
                          :placeholder="t('reuse.selectProvinceCity')"
                          :disabled="isDisable"
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
                        prop="district"
                      >
                        <el-select
                          v-model="valueDistrict"
                          style="width: 96%"
                          class="m-2 fix-full-width"
                          :placeholder="t('reuse.selectCountyOrDistrict')"
                          :disabled="isDisable"
                        >
                          <el-option
                            v-for="item in district"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </ElFormItem>
                      <ElFormItem
                        class="flex w-[100%] items-center"
                        :label="t('formDemo.wardOrCommune')"
                        prop="ward"
                      >
                        <el-select
                          v-model="valueCommune"
                          style="width: 96%"
                          class="m-2 fix-full-width"
                          :placeholder="t('reuse.selectWardOrCommune')"
                          :disabled="isDisable"
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
                        prop="Address"
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
                          :disabled="isDisable"
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
                          :disabled="isDisable"
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
                          :disabled="isDisable"
                        />
                      </ElFormItem>

                      <ElFormItem
                        class="flex items-center w-[98%] pl-2"
                        :label="t('reuse.bank')"
                        prop="bankName"
                      >
                        <InfinitOptions 
                          :placeholder="t('reuse.selectBank')"
                          valueKey="value" 
                          labelKey="label"
                          :disabled="isDisable"
                          :hiddenKey="['value']"
                          :clearable="false"
                          :pageIndex="pageIndex"
                          :params="{TypeName: 'nganhang'}"
                          :api="getCategories"
                          :mapFunction="getMapData"
                          :defaultValue="ruleForm.bankName"
                          :getMoreAPI="false"
                          @update-value="(_value, option) => handleChangeOptions(option)"
                        />
                      </ElFormItem>
                    </div>
                    <div class="text-sm text-[#303133] font-medium p pl-4 dark:text-[#fff] mt-14">
                      <el-divider content-position="left">{{ t('formDemo.codeQR') }}</el-divider>
                      <Qrcode :text="ruleForm.staffCode" />
                    </div>
                  </ElForm>
                </div>
              </div>
          </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style scoped>
.avatar-uploader .avatar {
  display: block;
  width: 178px;
  height: 178px;
}

::v-deep(.custom-select-w38 > .el-select) {
  width: 38%;
}

::v-deep(.cccd-format .fix-width .el-form-item__content > .el-input) {
  width: 100% !important;
}

.el-icon.avatar-uploader-icon {
  width: 178px;
  height: 178px;
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}

::v-deep(label) {
  color: #828387;
}

::v-deep(.d-block > .el-row) {
  display: block;
}

::v-deep(.el-form-item) {
  display: flex;
  align-items: center;
}

::v-deep(.el-form-item__content) {
  display: block;
}

::v-deep(.el-divider__text) {
  font-size: 16px;
}

::v-deep(.el-select) {
  width: 100%;
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
  margin-bottom: 20px;
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

::v-deep(.el-input__wrapper) {
  width: 100%;
  height: 34px;
}

::v-deep(.fix-width > .el-input) {
  width: 100%;
}

.day-updated {
  position: relative;
  width: fit-content;
  padding-left: 20px;
  color: var(--el-color-primary);
  background: rgb(44 109 218 / 5%);
}

.day-updated::after {
  position: absolute;
  top: 0;
  right: -12px;
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 12px solid transparent;
  border-left: 12px solid rgb(44 109 218 / 5%);
  content: '';
}

.day-updated::before {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 12px solid white;
  content: '';
}
</style>
