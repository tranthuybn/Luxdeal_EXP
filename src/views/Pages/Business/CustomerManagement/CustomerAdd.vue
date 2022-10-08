<script setup lang="ts">
import { onBeforeMount, reactive, ref, watch } from 'vue'
import {
  ElCollapse,
  ElCollapseItem,
  ElUpload,
  ElDivider,
  ElButton,
  ElCheckbox,
  ElDialog,
  ElOption,
  ElSelect,
  ElDatePicker,
  ElNotification,
  ElInput
} from 'element-plus'
import type { UploadFile } from 'element-plus'
import { Collapse } from '../../Components/Type'
import { useIcon } from '@/hooks/web/useIcon'
import { Form } from '@/components/Form'
import { useI18n } from '@/hooks/web/useI18n'
import { useForm } from '@/hooks/web/useForm'
import Qrcode from '@/components/Qrcode/src/Qrcode.vue'
import router from '@/router'
import { getCustomerById } from '@/api/Business'
import { useRouter } from 'vue-router'

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)
const { t } = useI18n()
const value1 = ref('')
const value2 = ref('')
const size = ref<'' | 'large' | 'small'>('')
const disabledDate = (time: Date) => {
  return time.getTime() > Date.now()
}
const id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)

const schema = reactive<FormSchema[]>([
  {
    field: 'customerCode',
    label: 'Mã khách hàng',
    component: 'Divider',
    colProps: {
      span: 12
    }
  },
  {
    field: 'customerCode',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'referralCode',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'information',
    label: t('router.analysis'),
    component: 'Divider',
    colProps: {
      span: 12
    }
  },
  {
    field: 'classify',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'companyInfo',
    colProps: {
      span: 24
    }
  },

  {
    field: 'customerName',
    colProps: {
      span: 24
    }
  },

  {
    field: 'selectObject',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'userInfo',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'password',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'confirmPassword',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'optionForm',
    colProps: {
      span: 24
    }
  }
])

const schema2 = reactive<FormSchema[]>([
  {
    field: 'placeCustomer',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'placeCustomer2',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'placeCustomer3',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'placeCustomer4',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'bankAccount',
    label: t('reuse.accountBank'),
    component: 'Divider',
    colProps: {
      span: 24
    }
  },

  {
    field: 'referralCode',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'referralCode2',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'referralCode3',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'information',
    label: t('formDemo.codeQR'),
    component: 'Divider',
    colProps: {
      span: 12
    }
  },
  {
    field: 'QRcode',
    component: 'Input',
    colProps: {
      span: 12
    }
  }
])
const formValue = ref()
//get data from table
const getTableValue = async () => {
  if (!isNaN(id)) {
    const res = await getCustomerById({ id: id })
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
}
const { push } = useRouter()
const editPage = async () => {
  push({
    name: `${String(router.currentRoute.value.name)}`,
    params: { id: id, type: 'edit' }
  })
}
const { register } = useForm()

const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })
const addIcon = useIcon({ icon: 'uil:plus' })
const viewIcon = useIcon({ icon: 'uil:search' })
const deleteIcon = useIcon({ icon: 'uil:trash-alt' })

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

const customerCode = ref('KH3452323')
//upload image
const handleRemove = (file: UploadFile) => {
  console.log(file)
}

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}

const businessClassification = ref('Cá nhân')
const customerClassification = ref('Khách hàng')
const statusActive = ref(true)
const value = ref('Nam')
const valueProvince = ref('')
const valueDistrict = ref('')

const options = [
  {
    value: 'Nam',
    label: 'Nam'
  },
  {
    value: 'Nữ',
    label: 'Nữ'
  },
  {
    value: 'Khác',
    label: 'Khác'
  }
]
const province = [
  {
    value: 'HN',
    label: 'HN'
  },
  {
    value: 'TP.HCM',
    label: 'TP.HCM'
  },
  {
    value: 'ĐN',
    label: 'ĐN'
  },
  {
    value: 'Vinh',
    label: 'Vinh'
  },
  {
    value: 'Nha Trang',
    label: 'Nha Trang'
  }
]
const district = [
  {
    value: 'Thanh Xuan',
    label: 'Thanh Xuan'
  },
  {
    value: 'Hai Ba Trung',
    label: 'Hai Ba Trung'
  },
  {
    value: 'Dong Da',
    label: 'Dong Da'
  },
  {
    value: 'Vinh',
    label: 'Vinh'
  },
  {
    value: 'Nha Trang',
    label: 'Nha Trang'
  }
]

const classify = [
  {
    value: 'Cá nhân',
    label: 'Cá nhân'
  },
  {
    value: 'Doanh nghiệp',
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
  console.log('type: ', type)
  if (type == 'detail') {
    disableData = true
  }
}
onBeforeMount(() => {
  change()
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
            <Form
              :disabled="disableData"
              :schema="schema"
              label-position="top"
              hide-required-asterisk
              class="flex border-[var(--el-border-color)] border-none rounded-3xl box-shadow-blue bg-white dark:bg-[#141414]"
              @register="register"
            >
              <template #customerCode>
                <div class="customerCode flex items-center w-[100%] gap-4">
                  <label class="w-[15%] text-right leading-5" for="">{{
                    t('reuse.customerCode')
                  }}</label>
                  <strong>{{ customerCode }}</strong>
                </div>
              </template>

              <template #referralCode>
                <div class="flex items-center w-[100%] gap-4">
                  <label class="w-[15%] text-right leading-5" for="">{{
                    t('reuse.referralCode')
                  }}</label>
                  <el-input
                    class="w-[80%] outline-none pl-2 dark:bg-transparent"
                    type="text"
                    :placeholder="t('reuse.referralCode')"
                  />
                </div>
              </template>

              <template #classify>
                <div class="flex items-center w-[100%] gap-4">
                  <label class="w-[15%] leading-5 text-right max-w-[119.63px]"
                    >{{ t('formDemo.classify') }}<span style="color: red">*</span>
                  </label>

                  <div class="flex w-[85%] gap-4">
                    <div class="w-[50%] items-center outline-none">
                      <el-select
                        v-model="businessClassification"
                        class="min-h-[34px] cursor-pointer w-[100%] font-bold"
                        placeholder="Select"
                      >
                        <el-option
                          v-for="item in classify"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </div>
                    <div class="w-[50%] items-center">
                      <el-select
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
              </template>

              <template #customerName v-if="businessClassification == 'Cá nhân'">
                <div class="flex items-center w-[100%] gap-4">
                  <label class="w-[15%] text-right leading-5" for=""
                    >{{ t('formDemo.customerName') }}<span style="color: red"> *</span>
                  </label>
                  <el-input
                    class="w-[80%] outline-none pl-2 dark:bg-transparent"
                    type="text"
                    :placeholder="t('formDemo.enterCustomerName')"
                  />
                </div>

                <div class="flex items-center w-[100%] gap-4 mt-5">
                  <label class="w-[15%] text-right leading-5" for=""
                    >{{ t('reuse.phoneNumber') }}<span style="color: red"> *</span>
                  </label>
                  <el-input
                    class="w-[80%] outline-none pl-2 dark:bg-transparent"
                    type="text"
                    :placeholder="t('reuse.enterPhoneNumber')"
                  />
                </div>

                <div class="flex items-center w-[100%] gap-4 mt-5">
                  <label class="w-[15%] text-right leading-5" for="">{{ t('reuse.email') }} </label>
                  <el-input
                    class="w-[80%] outline-none pl-2 dark:bg-transparent"
                    type="text"
                    :placeholder="t('formDemo.enterEmail')"
                  />
                </div>

                <div class="flex items-center w-[100%] gap-4 mt-5">
                  <label class="w-[15%] max-w-[111.63px] text-right leading-5">CCCD/CMND </label>
                  <div class="flex gap-2 w-[85%]">
                    <el-input
                      class="w-[25%] outline-none pl-2 dark:bg-transparent"
                      type="text"
                      :placeholder="t('formDemo.enterCCCD')"
                    />
                    <el-date-picker
                      v-model="value2"
                      type="date"
                      :placeholder="t('formDemo.supplyDate')"
                      :disabled-date="disabledDate"
                      :size="size"
                      format="DD/MM/YYYY"
                      value-format="YYYY-MM-DD"
                      class="w-[25%] min-w-[203px] outline-none pl-2 dark:bg-transparent"
                    />
                    <el-input
                      class="w-[25%] outline-none pl-2 dark:bg-transparent"
                      type="text"
                      :placeholder="t('formDemo.supplyAddress')"
                    />
                  </div>
                </div>

                <div class="flex items-center w-[100%] gap-4 mt-5 custom-select-w38">
                  <label class="w-[15%] max-w-[111.63px] text-right leading-5" for="">{{
                    t('reuse.dateOfBirthAnGender')
                  }}</label>
                  <el-date-picker
                    v-model="value1"
                    type="date"
                    :placeholder="t('reuse.dateOfBirth')"
                    :disabled-date="disabledDate"
                    :size="size"
                    format="DD/MM/YYYY"
                    value-format="YYYY-MM-DD"
                    class="ml-4"
                  />
                  <el-select v-model="value" class="w-[38%]" clearable placeholder="Select">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>

                <div class="flex items-center w-[100%] gap-4 mt-5">
                  <label class="w-[15%] text-right leading-5" for="">{{ t('reuse.link') }} </label>
                  <el-input
                    class="w-[80%] outline-none pl-2 dark:bg-transparent"
                    type="text"
                    :placeholder="t('reuse.enterFacebookZaloLink')"
                  />
                </div>
              </template>

              <template #companyInfo v-if="businessClassification == 'Doanh nghiệp'">
                <div class="flex items-center w-[100%] gap-4 mt-5">
                  <label class="w-[15%] text-right leading-5" for=""
                    >{{ t('reuse.companyName') }}<span style="color: red"> *</span>
                  </label>
                  <el-input
                    class="w-[80%] outline-none pl-2 dark:bg-transparent"
                    type="text"
                    :placeholder="t('formDemo.enterDescription')"
                  />
                </div>

                <div class="flex items-center w-[100%] gap-4 mt-5">
                  <label class="w-[15%] text-right leading-5" for=""
                    >{{ t('reuse.taxCode') }}<span style="color: red"> *</span>
                  </label>
                  <el-input
                    class="w-[80%] outline-none pl-2 dark:bg-transparent"
                    type="text"
                    :placeholder="t('formDemo.enterTaxCode')"
                  />
                </div>

                <div class="flex items-center w-[100%] gap-4 mt-5">
                  <label class="w-[15%] text-right leading-5" for=""
                    >{{ t('formDemo.representative') }}
                  </label>
                  <el-input
                    class="w-[80%] outline-none pl-2 dark:bg-transparent"
                    type="text"
                    :placeholder="t('reuse.enterRepresentativeName')"
                  />
                </div>

                <div class="flex items-center w-[100%] gap-4 mt-5">
                  <label class="w-[15%] text-right leading-5" for=""
                    >{{ t('reuse.phoneNumber') }}<span style="color: red">*</span>
                  </label>
                  <el-input
                    class="w-[80%] outline-none pl-2 dark:bg-transparent"
                    type="text"
                    :placeholder="t('reuse.enterPhoneNumber')"
                  />
                </div>

                <div class="flex items-center w-[100%] gap-4 mt-5">
                  <label class="w-[15%] text-right leading-5" for=""> {{ t('reuse.email') }}</label>
                  <el-input
                    class="w-[80%] outline-none pl-2 dark:bg-transparent"
                    type="text"
                    :placeholder="t('formDemo.enterEmail')"
                  />
                </div>

                <div class="flex items-center w-[100%] gap-4 mt-5">
                  <label class="w-[15%] text-right leading-5" for="">{{ t('reuse.link') }}</label>
                  <el-input
                    class="w-[80%] outline-none pl-2 dark:bg-transparent"
                    type="text"
                    :placeholder="t('reuse.enterFacebookZaloLink')"
                  />
                </div>
              </template>

              <template #selectObject>
                <el-divider content-position="left">{{
                  t('formDemo.accountAndStatus')
                }}</el-divider>
              </template>

              <template #userInfo>
                <div class="flex items-center w-[100%] gap-4">
                  <label class="w-[15%] text-right leading-5" for=""
                    >{{ t('formDemo.userName') }}<span style="color: red">*</span>
                  </label>
                  <el-input
                    class="w-[80%] outline-none pl-2 dark:bg-transparent"
                    type="text"
                    :placeholder="t('formDemo.enterUserName')"
                  />
                </div>
              </template>

              <template #password>
                <div class="flex items-center w-[100%] gap-4">
                  <label class="w-[15%] text-right leading-5" for=""
                    >{{ t('login.password') }}<span style="color: red">*</span>
                  </label>
                  <el-input
                    class="w-[80%] outline-none pl-2 dark:bg-transparent"
                    type="text"
                    :placeholder="t('formDemo.enterPassword')"
                  />
                </div>
              </template>

              <template #confirmPassword>
                <div class="flex items-center w-[100%] gap-4">
                  <label class="w-[15%] text-right leading-5" for=""
                    >{{ t('formDemo.confirmPassword') }}<span style="color: red">*</span>
                  </label>
                  <el-input
                    class="w-[80%] outline-none pl-2 dark:bg-transparent"
                    type="text"
                    :placeholder="t('formDemo.confirmPassword')"
                  />
                </div>
              </template>

              <template #optionForm>
                <div class="flex items-center w-[100%] gap-4">
                  <p class="option-select text-center w-[15%] text-right leading-5"
                    >{{ t('formDemo.status') }}
                  </p>
                  <el-checkbox v-model="statusActive" :label="t('formDemo.isActive')" />
                </div>
              </template>
            </Form>
            <div class="option-page mt-5">
              <div v-if="type === 'detail'" class="flex justify-center">
                <el-button @click="editPage()" type="primary" class="min-w-42 min-h-11">{{
                  t('reuse.fix')
                }}</el-button>
                <el-button type="danger" class="min-w-42 min-h-11">{{
                  t('formDemo.cancelAccount')
                }}</el-button>
              </div>
              <div v-else-if="type === 'edit'" class="flex justify-center">
                <el-button type="primary" class="min-w-42 min-h-11">{{
                  t('reuse.save')
                }}</el-button>
                <el-button type="danger" class="min-w-42 min-h-11">{{
                  t('reuse.cancel')
                }}</el-button>
              </div>
              <div v-else class="flex justify-center">
                <el-button type="primary" class="min-w-42 min-h-11">{{
                  t('reuse.save')
                }}</el-button>
                <el-button type="primary" class="min-w-42 min-h-11">{{
                  t('reuse.saveAndAdd')
                }}</el-button>

                <el-button class="min-w-42 min-h-11">{{ t('reuse.cancel') }}</el-button>
              </div>
              <!-- <div v-if="awesome" class="flex justify-center option-1">
                <el-button type="primary" @click="awesome = !awesome" class="min-w-42 min-h-11"
                  >Lưu</el-button
                >
                <el-button type="primary" class="min-w-42 min-h-11">{{
                  t('reuse.saveAndAdd')
                }}</el-button>

                <el-button type="danger" class="min-w-42 min-h-11">{{
                  t('reuse.cancel')
                }}</el-button>
              </div>
              <div v-else class="flex justify-center option-1">
                <el-button @click="fix = !fix" type="primary" class="min-w-42 min-h-11"
                  >Sửa</el-button
                >
                <el-button type="danger" class="min-w-42 min-h-11">{{
                  t('formDemo.cancelAccount')
                }}</el-button>
              </div>

              <div v-if="fix" class="flex justify-center option-1">
                <el-button type="primary" class="min-w-42 min-h-11">{{
                  t('reuse.save')
                }}</el-button>
                <el-button type="danger" class="min-w-42 min-h-11">{{
                  t('reuse.cancel')
                }}</el-button>
              </div> -->
            </div>
          </div>
          <div class="w-[50%]">
            <div class="text-sm text-[#303133] font-medium p pl-4 dark:text-[#fff]">
              <el-divider content-position="left">{{ t('reuse.picture') }}</el-divider>
              <div class="flex gap-4">
                <div class="about-image">
                  <p>{{ t('formDemo.addPhotosOrFiles') }}</p>
                  <p style="color: orange">{{ t('formDemo.lessThanTenProfiles') }}</p>
                </div>
                <div class="upload-image">
                  <el-upload action="#" list-type="picture-card" :auto-upload="false">
                    <ElButton :icon="addIcon" class="avatar-uploader-icon" />

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
                  </el-upload>

                  <el-dialog v-model="dialogVisible">
                    <img w-full :src="dialogImageUrl" />
                  </el-dialog>
                </div>
              </div>
            </div>

            <div class="text-sm text-[#303133] font-medium p pl-4 dark:text-[#fff] mt-28">
              <el-divider content-position="left">{{ t('formDemo.address') }}</el-divider>

              <Form
                :disabled="disableData"
                :schema="schema2"
                label-position="top"
                hide-required-asterisk
                class="flex border-[var(--el-border-color)] border-none rounded-3xl box-shadow-blue bg-white dark:bg-[#141414]"
                @register="register"
              >
                <template #placeCustomer>
                  <div class="flex items-center w-[100%] gap-4">
                    <label class="w-[14%] text-right leading-5" for="">{{
                      t('formDemo.provinceAndCity')
                    }}</label>
                    <el-select
                      v-model="valueProvince"
                      style="width: 80%"
                      class="m-2 fix-full-width"
                      placeholder="Chọn tỉnh/thành phố"
                    >
                      <el-option
                        v-for="item in province"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </div>
                </template>
                <template #placeCustomer2>
                  <div class="flex items-center w-[100%] gap-4">
                    <label class="w-[14%] text-right leading-5" for="">{{
                      t('formDemo.countyAndDistrict')
                    }}</label>
                    <el-select
                      v-model="valueDistrict"
                      style="width: 80%"
                      class="m-2 fix-full-width"
                      placeholder="Chọn quận/huyện"
                    >
                      <el-option
                        v-for="item in district"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </div>
                </template>
                <template #placeCustomer3>
                  <div class="flex items-center w-[100%] gap-4">
                    <label class="w-[15%] text-right leading-5" for=""
                      >{{ t('formDemo.wards') }}
                    </label>
                    <input
                      class="w-[80%] outline-none pl-2"
                      type="text"
                      :placeholder="`Chọn Phường/xã `"
                    />
                  </div>
                </template>
                <template #placeCustomer4>
                  <div class="flex items-center w-[100%] gap-4">
                    <label class="w-[15%] text-right leading-5" for="">{{
                      t('formDemo.detailedAddress')
                    }}</label>
                    <input
                      class="w-[80%] outline-none pl-2"
                      type="text"
                      :placeholder="t('formDemo.enterDetailAddress')"
                    />
                  </div>
                </template>

                <template #referralCode>
                  <div class="flex items-center w-[100%] gap-4">
                    <label class="w-[15%] text-right leading-5" for="">{{
                      t('userDemo.username')
                    }}</label>
                    <el-input
                      class="w-[80%] outline-none pl-2 dark:bg-transparent"
                      type="text"
                      :placeholder="t('formDemo.enterAccountName')"
                    />
                  </div>
                </template>
                <template #referralCode2>
                  <div class="flex items-center w-[100%] gap-4">
                    <label class="w-[15%] text-right leading-5" for=""
                      >{{ t('userDemo.accountNumber') }}
                    </label>
                    <el-input
                      class="w-[80%] outline-none pl-2 dark:bg-transparent"
                      type="text"
                      :placeholder="t('formDemo.enterAccountNumber')"
                    />
                  </div>
                </template>
                <template #referralCode3>
                  <div class="flex items-center w-[100%] gap-4">
                    <label class="w-[15%] text-right leading-5" for="">{{ t('reuse.bank') }}</label>
                    <el-input
                      class="w-[80%] outline-none pl-2 dark:bg-transparent"
                      type="text"
                      :placeholder="t('reuse.selectBank')"
                    />
                  </div>
                </template>
                <template #QRcode>
                  <Qrcode />
                </template>
              </Form>
            </div>
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
::v-deep(.el-upload--picture-card) {
  width: 160px;
  height: 40px;
}
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

::v-deep(.custom-select-w38 > .el-select) {
  width: 38%;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
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
  height: 34px;
}
</style>
