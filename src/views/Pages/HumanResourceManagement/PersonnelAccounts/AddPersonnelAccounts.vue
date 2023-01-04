<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Collapse } from '../../Components/Type'
import { useIcon } from '@/hooks/web/useIcon'
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
  ElDialog,
  ElMessage,
  UploadFile,
  UploadProps,
  UploadUserFile
} from 'element-plus'
import moment from 'moment'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

//random mã
const curDate = 'DXDI' + moment().format('hhmmss')
const viewIcon = useIcon({ icon: 'uil:search' })
const deleteIcon = useIcon({ icon: 'uil:trash-alt' })
const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })
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

// const router = useRouter()
// const id = Number(router.currentRoute.value.params.id)
// const type = String(router.currentRoute.value.params.type)
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  staffCode: curDate,
  phoneNumber: '',
  name: 'Hello',
  region: '',
  doB: '',
  sex: true,
  count: '',
  link: '',
  cccd: '',
  cccdCreateAt: '',
  cccdPlaceOfGrant: '',
  email: '',
  delivery: false,
  type: [],
  resource: '',
  desc: ''
})

const rules = reactive<FormRules>({
  name: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
    { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
  ],
  region: [
    {
      required: true,
      message: 'Please select Activity zone',
      trigger: 'change'
    }
  ],
  count: [
    {
      required: true,
      message: 'Please select Activity count',
      trigger: 'change'
    }
  ],
  date1: [
    {
      type: 'date',
      required: true,
      message: 'Please pick a date',
      trigger: 'change'
    }
  ],
  date2: [
    {
      type: 'date',
      required: true,
      message: 'Please pick a time',
      trigger: 'change'
    }
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

const disabledDate = (time: Date) => {
  return time.getTime() > Date.now()
}

const formatDate = () => {
  console.log(ruleForm.doB)
}

const size = ref<'' | 'large' | 'small'>('')

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
const dialogVisible = ref(false)
const disabled = ref(false)
const dialogImageUrl = ref('')

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}

let Files = reactive({})
const validImageType = ['jpeg', 'png']
const beforeAvatarUpload = (rawFile, type: string) => {
  if (rawFile) {
    //nếu là 1 ảnh
    if (type === 'single') {
      if (rawFile.raw && rawFile.raw['type'].split('/')[0] !== 'image') {
        ElMessage.error(t('reuse.notImageFile'))
        return false
      } else if (rawFile.raw && !validImageType.includes(rawFile.raw['type'].split('/')[1])) {
        ElMessage.error(t('reuse.onlyAcceptValidImageType'))
        return false
      } else if (rawFile.raw?.size / 1024 / 1024 > 4) {
        ElMessage.error(t('reuse.imageOver4MB'))
        return false
      } else if (rawFile.name?.split('.')[0].length > 100) {
        ElMessage.error(t('reuse.checkNameImageLength'))
        return false
      }
    }
    //nếu là 1 list ảnh
    if (type === 'list') {
      let inValid = true
      rawFile.map((file) => {
        if (file.raw && file.raw['type'].split('/')[0] !== 'image') {
          ElMessage.error(t('reuse.notImageFile'))
          inValid = false
        } else if (file.raw && !validImageType.includes(file.raw['type'].split('/')[1])) {
          ElMessage.error(t('reuse.onlyAcceptValidImageType'))
          inValid = false
          return false
        } else if (file.size / 1024 / 1024 > 4) {
          ElMessage.error(t('reuse.imageOver4MB'))
          inValid = false
        } else if (file.name?.split('.')[0].length > 100) {
          ElMessage.error(t('reuse.checkNameImageLength'))
          inValid = false
          return false
        }
      })
      return inValid
    }
    return true
  }
  // else {
  //   //báo lỗi nếu ko có ảnh
  //   if (type === 'list' && fileList.value.length > 0) {
  //     return true
  //   }
  //   if (type === 'single' && (rawUploadFile.value != undefined || imageUrl.value != undefined)) {
  //     return true
  //   } else {
  //     ElMessage.warning(t('reuse.notHaveImage'))
  //     return false
  //   }
  // }
}

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.warning(
    `${t('reuse.limitUploadImages')}. ${t('reuse.imagesYouChoose')}: ${files.length}. ${t(
      'reuse.total'
    )}${files.length + uploadFiles.length}`
  )
}
const handleRemove = (file: UploadFile) => {
  return file
}
const ListFileUpload = ref()
const handleChange: UploadProps['onChange'] = async (_uploadFile, uploadFiles) => {
  ListFileUpload.value = uploadFiles
  uploadFiles.map((file) => {
    beforeAvatarUpload(file, 'single') ? '' : file.raw ? handleRemove(file) : ''
  })
  Files = ListFileUpload.value.map((el) => el?.raw)
}
const fileList = ref<UploadUserFile[]>([])
</script>

<template>
  <div class="demo-collapse dark:bg-[#141414]">
    <el-collapse v-model="activeName" @change="collapseChangeEvent">
      <el-collapse-item :name="collapse[0].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[0].icon" link />
          <span class="text-center text-xl">{{ collapse[0].title }}</span>
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
                  <el-input v-model="ruleForm.staffCode" />
                </el-form-item>

                <el-form-item label="Tên nhân viên" prop="name" placeholder="Họ và tên">
                  <el-input v-model="ruleForm.name" />
                </el-form-item>

                <el-form-item :label="t('reuse.phoneNumber')" prop="phoneNumber">
                  <el-input
                    v-model="ruleForm.phoneNumber"
                    type="text"
                    :placeholder="t('reuse.enterPhoneNumber')"
                  />
                </el-form-item>

                <el-form-item label="Email" prop="email" placeholder="Nhập email">
                  <el-input v-model="ruleForm.email" />
                </el-form-item>

                <el-form-item :label="t('reuse.cmnd')" prop="cccd">
                  <div class="flex gap-2 w-[100%] cccd">
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
                      :editable="false"
                      format="DD/MM/YYYY"
                      value-format="YYYY-MM-DD"
                      class="w-[25%] min-w-[203px] cccd-createAt outline-none pl-2 dark:bg-transparent"
                    />
                    <el-input
                      prop="cccdPlaceOfGrant"
                      v-model="ruleForm.cccdPlaceOfGrant"
                      class="w-[25%] outline-none pl-2 dark:bg-transparent"
                      type="text"
                      :placeholder="t('formDemo.supplyAddress')"
                    />
                  </div>
                </el-form-item>

                <el-form-item
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
                </el-form-item>

                <el-form-item :label="t('reuse.link')" prop="link">
                  <el-input
                    prop="link"
                    v-model="ruleForm.link"
                    class="w-[80%] outline-none pl-2 dark:bg-transparent"
                    type="text"
                    :placeholder="t('reuse.enterFacebookZaloLink')"
                    :formatter="(value) => value.replace(/^\s+$/gm, '')"
                  />
                </el-form-item>

                <el-divider content-position="left">Vị trí việc làm</el-divider>
                //btn save
                <el-form-item>
                  <el-button type="primary" @click="submitForm(ruleFormRef)"> Create </el-button>
                  <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="w-[50%]">
              <div class="text-sm text-[#303133] font-medium p pl-4 dark:text-[#fff]">
                <el-divider content-position="left">{{ t('formDemo.attachments') }}</el-divider>
              </div>
              <div class="flex">
                <div class="pl-5">
                  <div class="text-right">{{ t('formDemo.addPhotosOrFiles') }}</div>
                  <div class="text-right text-[#FECB80] italic">{{
                    t('formDemo.lessThanTenProfiles')
                  }}</div>
                </div>
                <div class="pl-4">
                  <el-upload
                    action="#"
                    list-type="picture-card"
                    v-model:file-list="fileList"
                    :multiple="true"
                    :auto-upload="false"
                    :limit="10"
                    :on-exceed="handleExceed"
                    class="relative"
                    :on-change="handleChange"
                  >
                    <!-- <ElButton :icon="addIcon" class="avatar-uploader-icon" /> -->
                    <strong>+ {{ t('formDemo.addPhotosOrFiles') }}</strong>
                    <template #file="{ file }">
                      <div>
                        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                        <span class="el-upload-list__item-actions">
                          <span
                            class="el-upload-list__item-preview"
                            @click="handlePictureCardPreview(file)"
                          >
                            <ElButton :icon="viewIcon" />
                          </span>
                          <span v-if="!disabled" class="el-upload-list__item-delete"> </span>
                          <span
                            v-if="!disabled"
                            class="el-upload-list__item-delete"
                            @click="handleRemove(file)"
                          >
                            <ElButton :icon="deleteIcon" />
                          </span>
                        </span>
                      </div>
                    </template>
                    <el-dialog v-model="dialogVisible" class="absolute">
                      <div class="text-[#303133] font-medium dark:text-[#fff]"
                        >+ {{ t('formDemo.addPhotosOrFiles') }}
                      </div>
                    </el-dialog>
                  </el-upload>
                </div>
              </div>
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
</style>
