<script setup lang="ts">
import { onBeforeMount, reactive, ref, watch } from 'vue'
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
  getTypePersonnelList
} from '@/api/HumanResourceManagement'
import { useValidator } from '@/hooks/web/useValidator'
import { getEmployeeById } from '@/api/Accountant'
import { API_URL } from '@/utils/API_URL'
const { t } = useI18n()

//random mã
const curDate = 'DXDI' + moment().format('hhmmss')
const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })
const escape = useIcon({ icon: 'quill:escape' })
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

const ruleForm = reactive({
  staffCode: curDate,
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
  isActive: true
})

const rules = reactive<FormRules>({
  name: [
    { required: true, message: 'Vui lòng nhập tên', trigger: 'blur' },
    { min: 1, max: 30, message: 'Độ dài phải lớn hơn 1 và nhỏ hơn 30', trigger: 'blur' }
  ],
  email: [ValidService.checkEmail],
  branch: [{ required: true, message: t('common.required'), trigger: 'change' }],
  sex: [{ required: true, message: t('common.required'), trigger: 'change' }],
  jobPosition: [{ required: true, message: t('common.required'), trigger: 'change' }],
  typeOfEmployee: [{ required: true, message: t('common.required'), trigger: 'change' }],
  department: [{ required: true, message: t('common.required'), trigger: 'change' }],
  phoneNumber: [
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
  cccdCreateAt: [
    {
      type: 'date',
      required: true,
      message: 'Vui lòng chọn ngày cấp',
      trigger: 'change'
    }
  ],
  doB: [
    {
      type: 'date',
      required: true,
      message: 'Vui lòng chọn ngày sinh',
      trigger: 'change'
    }
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
    ValidService.checkCCCD
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

const alwayShowAdd = ref(false)
watch(
  () => type,
  () => {
    if (type === 'add') {
      alwayShowAdd.value = true
    }
    if (type === 'detail' || type === 'edit') {
      alwayShowAdd.value = false
    }
  },
  {
    deep: true,
    immediate: true
  }
)
const { register } = useForm()
let disableData = ref(false)

const listBranchs = ref()
const CallApiBranch = async () => {
  const res = await getBranchList()
  if (res) {
    listBranchs.value = res.data.map((branchs) => ({ label: branchs.name, value: branchs.id }))
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

const CityChange = async (value) => {
  ruleForm.ProvinceId = value
  district.value = await getDistrict(value)
  valueCommune.value = ''
  valueDistrict.value = ''
  ruleForm.Address = ''
}

const districtChange = async (value) => {
  ruleForm.DistrictId = value
  ward.value = await getWard(value)
}
const wardChange = async (value) => {
  ruleForm.WardId = value
}

const disabledDate = (time: Date) => {
  return time.getTime() > Date.now()
}

const formatDate = () => {
  console.log(ruleForm.doB)
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
    name: 'business.customer-management.customerList',
    params: { backRoute: 'business.customer-management.customerList' }
  })
}

// const resetForm = (formEl: FormInstance | undefined) => {
//   if (!formEl) return
//   formEl.resetFields()
// }
const disabledForm = ref(false)

let FileDeleteIds: any = []

const beforeRemove = (uploadFile) => {
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

const optionsRole = [
  {
    id: 1,
    label: 'admin',
    value: 1
  },
  {
    id: 2,
    label: 'Cus',
    value: 2
  },
  {
    id: 3,
    label: 'Tester',
    value: 3
  }
]

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.warning(
    `${t('reuse.limitUploadImages')}. ${t('reuse.imagesYouChoose')}: ${files.length}. ${t(
      'reuse.total'
    )}${files.length + uploadFiles.length}`
  )
}

const ListFileUpload = ref()
const handleChange: UploadProps['onChange'] = async (_uploadFile, uploadFiles) => {
  ListFileUpload.value = uploadFiles
}
const centerDialogCancelAccount = ref(false)

const { push } = useRouter()
const editPage = async () => {
  push({
    name: `${String(router.currentRoute.value.name)}`,
    params: { id: id, type: 'edit' }
  })
}

let checkValidate = ref(false)
let checkValidateForm = ref(false)

const postData = async (typebtn) => {
  console.log('typebtn: ', typebtn)
  await submitForm(ruleFormRef.value, ruleFormRef2.value)
  if (checkValidate.value) {
    const payload = {
      Code: ruleForm.staffCode,
      Name: ruleForm.name,
      Email: ruleForm.email,
      Phone: ruleForm.phoneNumber,
      CCCD: ruleForm.cccd,
      NgayCap: ruleForm.cccdCreateAt,
      NoiCap: ruleForm.cccdPlaceOfGrant,
      Gender: ruleForm.sex,
      BirthDay: ruleForm.doB,
      Contact: ruleForm.link,
      BranchId: ruleForm.branch,
      DepartmentId: ruleForm.department,
      PositionId: ruleForm.jobPosition,
      TypeOfStaff: ruleForm.typeOfEmployee,
      AddressProvinceId: valueProvince.value,
      AddressDistrictId: valueDistrict.value,
      Address: ruleForm.Address,
      BankAccountName: ruleForm.accountName,
      WardId: valueCommune.value,
      BankAccountNumber: ruleForm.accountNumber,
      BankId: ruleForm.bankName,
      IsActive: true
    }
    console.log(payload)

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
          message: error,
          type: 'warning'
        })
      )
    // clear()
  }
  // resetForm(ruleFormRef)
}

const formValue = ref()
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
    ruleForm.name = formValue.value.name
    ruleForm.accountName = formValue.value.accountName
    ruleForm.cccd = formValue.value.cccd
    ruleForm.cccdCreateAt = formValue.value.cccdNgayCap
    ruleForm.cccdPlaceOfGrant = formValue.value.cccdNoiCap
    ruleForm.email = formValue.value.email
    ruleForm.phoneNumber = formValue.value.phone
    ruleForm.link = formValue.value.link
    ruleForm.bankName = formValue.value.bank?.name
    ruleForm.accountNumber = formValue.value.accountNumber
    ruleForm.doB = formValue.value.birthday
    ruleForm.userName = formValue.value.userName
    ruleForm.Address = formValue.value.address
    ruleForm.ProvinceId = formValue.value.provinceId
    ruleForm.DistrictId = formValue.value.districtId
    ruleForm.WardId = formValue.value.wardId
    ruleForm.branch = formValue.value.branchId
    ruleForm.department = formValue.value.departmentId
    ruleForm.jobPosition = formValue.value.positionId
    ruleForm.typeOfEmployee = formValue.value.typeStaffId
    ruleForm.Address = formValue.value.address
    valueCommune.value = formValue.value.addressDistrictId
    valueProvince.value = formValue.value.addressProvinceId
    valueDistrict.value = formValue.value.addressDistrictId
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

onBeforeMount(() => {
  getTableValue()

  callApiCity()
  CallApiBranch()
  CallApiDepartment()
  CallApiPosition()
  CallApiStaff()
})
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
        <div class="contai-full-w">
          <div class="flex gap-8">
            <div class="w-[50%]">
              <el-divider content-position="left">{{ t('formDemo.orderInformation') }}</el-divider>
              <el-form
                ref="ruleFormRef"
                :model="ruleForm"
                :rules="rules"
                label-width="170px"
                class="demo-ruleForm"
                status-icon
              >
                <el-form-item label="Mã nhân viên" prop="staffCode">
                  <!-- <el-input v-model="ruleForm.staffCode" /> -->
                  <span class="pl-2">
                    {{ ruleForm.staffCode }}
                  </span>
                </el-form-item>

                <el-form-item label="Tên nhân viên" prop="name">
                  <el-input v-model="ruleForm.name" placeholder="Họ và tên" />
                </el-form-item>

                <el-form-item :label="t('reuse.phoneNumber')" prop="phoneNumber">
                  <el-input
                    v-model="ruleForm.phoneNumber"
                    type="text"
                    :placeholder="t('reuse.enterPhoneNumber')"
                  />
                </el-form-item>

                <el-form-item label="Email" prop="email">
                  <el-input v-model="ruleForm.email" placeholder="Nhập email" />
                </el-form-item>

                <el-form-item :label="t('reuse.cmnd')">
                  <div class="flex gap-2 w-[100%] cccd-format">
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
                          @change="formatDate"
                        />
                      </el-form-item>
                    </div>
                    <div class="flex-1">
                      <el-form-item prop="sex">
                        <el-select v-model="ruleForm.sex" clearable placeholder="Chọn giới tính">
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
                  />
                </el-form-item>

                <el-divider content-position="left">Vị trí việc làm</el-divider>

                <el-form-item
                  class="flex items-center w-[100%] mt-5 custom-select-w38"
                  label="Chi nhánh/phòng ban"
                >
                  <div class="flex gap-2 w-[100%]">
                    <div class="flex-1 fix-width">
                      <el-form-item prop="branch">
                        <el-select v-model="ruleForm.branch" clearable placeholder="Chọn chi nhánh">
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
                          placeholder="Chọn phòng ban"
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
                  label="Vị trí/loại hình"
                >
                  <div class="flex gap-2 w-[100%]">
                    <div class="flex-1 fix-width">
                      <el-form-item prop="jobPosition">
                        <el-select
                          v-model="ruleForm.jobPosition"
                          clearable
                          placeholder="Chọn vị trí làm việc"
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
                    <div class="flex-1 mb-5">
                      <el-form-item prop="typeOfEmployee">
                        <el-select
                          v-model="ruleForm.typeOfEmployee"
                          clearable
                          placeholder="Chọn loại hình nhân viên"
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

                <el-divider content-position="left">Tài khoản & phân quyền</el-divider>

                <el-form-item label="Tên đăng nhập" prop="userName">
                  <el-input v-model="ruleForm.userName" placeholder="Nhập tên đăng nhập" />
                </el-form-item>

                <el-form-item label="Phân quyền" prop="decentralization" placeholder="Họ và tên">
                  <el-select
                    v-model="ruleForm.roleAcces"
                    clearable
                    placeholder="Chọn quyền"
                    prop="role"
                  >
                    <el-option
                      v-for="item in optionsRole"
                      :key="item.id"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="Mật khẩu" prop="password">
                  <el-input v-model="ruleForm.password" placeholder="Nhập mật khẩu" />
                </el-form-item>

                <el-form-item label="Nhập lại mật khẩu" prop="confirmPassword">
                  <el-input
                    v-model="ruleForm.confirmPassword"
                    placeholder="Xác nhận lại mật khẩu"
                  />
                </el-form-item>

                <ElFormItem class="flex items-center w-[100%]" :label="t('formDemo.statusActive')">
                  <el-checkbox class="ml-4" :disabled="alwayShowAdd" v-model="ruleForm.isActive">{{
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
                      ><label style="font-style: italic; font-size: 13px">
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
                    <el-button @click="postData('save')" type="primary" class="min-w-42 min-h-11">{{
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
                    :on-exceed="handleExceed"
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
                  <ElFormItem
                    class="flex w-[100%] items-center"
                    :label="t('formDemo.wardOrCommune')"
                  >
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
                  <Qrcode :text="'Katsuke'" />
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
  width: 178px;
  height: 178px;
  display: block;
}

::v-deep(.custom-select-w38 > .el-select) {
  width: 38%;
}

::v-deep(.cccd-format .fix-width .el-form-item__content > .el-input) {
  width: 100% !important;
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
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
.day-updated {
  position: relative;
  padding-left: 20px;
  width: fit-content;
  color: var(--el-color-primary);
  background: rgba(44, 109, 218, 0.05);
}

.day-updated::after {
  content: '';
  position: absolute;
  top: 0;
  right: -12px;
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 12px solid transparent;
  border-left: 12px solid rgba(44, 109, 218, 0.05);
}

.day-updated::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 12px solid white;
}
</style>
