<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  ElCollapse,
  ElCollapseItem,
  ElUpload,
  ElDivider,
  ElRadio,
  ElRadioGroup,
  ElButton,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElCheckbox,
  ElDialog,
  ElOption,
  ElSelect
} from 'element-plus'
import type { UploadFile } from 'element-plus'
import { Collapse } from '../../Components/Type'
import { useIcon } from '@/hooks/web/useIcon'
import { Form } from '@/components/Form'
import { useI18n } from '@/hooks/web/useI18n'
import { useForm } from '@/hooks/web/useForm'

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)
const { t } = useI18n()

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
  }
])

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
const awesome = ref(true)
const fix = ref(false)
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
</script>

<template>
  <div class="demo-collapse dark:bg-[#141414]">
    <el-collapse v-model="activeName" @change="collapseChangeEvent">
      <el-collapse-item :name="collapse[0].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[0].icon" link />
          <span class="text-center text-xl">{{ collapse[0].title }}</span>
        </template>

        <div class="flex w-[100%] gap-6">
          <div class="w-[50%]">
            <Form
              :schema="schema"
              label-position="top"
              hide-required-asterisk
              size="large"
              class="flex border-1 border-[var(--el-border-color)] border-none rounded-3xl box-shadow-blue bg-white dark:bg-[#141414]"
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
                  <input
                    class="w-[80%] border-1 outline-none pl-2"
                    type="text"
                    :placeholder="t('reuse.referralCode')"
                  />
                </div>
              </template>

              <template #classify>
                <div class="flex items-center w-[100%] gap-4">
                  <label class="w-[15%] leading-5 text-right" for=""
                    >{{ t('formDemo.classify') }}<span style="color: red">*</span>
                  </label>

                  <div class="flex w-[80%] gap-2">
                    <div class="w-[50%] items-center border-1 rounded">
                      <el-dropdown trigger="click" class="w-[100%] h-[100%]">
                        <div class="flex justify-between w-[100%] items-center black-color">
                          <span
                            class="el-dropdown-link cursor-pointer w-[100%] font-bold dark:text-light-50 ml-2"
                          >
                            {{ businessClassification }}
                          </span>
                          <Icon
                            icon="material-symbols:keyboard-arrow-down"
                            :size="16"
                            class="mr-2"
                          />
                        </div>
                        <template #dropdown>
                          <el-dropdown-menu>
                            <el-dropdown-item>
                              <el-radio-group v-model="businessClassification" class="flex-col">
                                <div style="width: 100%">
                                  <el-radio
                                    class="text-left"
                                    style="color: blue"
                                    :label="`Cá nhân`"
                                    size="large"
                                    >Cá nhân</el-radio
                                  >
                                </div>
                                <div style="width: 100%">
                                  <el-radio
                                    class="text-left"
                                    style="color: blue"
                                    :label="`Doanh nghiệp`"
                                    size="large"
                                    >Doanh nghiệp</el-radio
                                  >
                                </div>
                              </el-radio-group>
                            </el-dropdown-item>
                            <el-dropdown-item divided>
                              <div style="width: 100%; text-align: center"> Confirm </div>
                            </el-dropdown-item>
                          </el-dropdown-menu>
                        </template>
                      </el-dropdown>
                    </div>
                    <div class="w-[50%] items-center border-1 rounded">
                      <el-dropdown trigger="click" class="w-[100%] h-[100%]">
                        <div class="flex justify-between w-[100%] items-center black-color">
                          <span
                            class="el-dropdown-link cursor-pointer w-[100%] font-bold dark:text-light-50 ml-2"
                          >
                            {{ customerClassification }}
                          </span>
                          <Icon
                            icon="material-symbols:keyboard-arrow-down"
                            :size="16"
                            class="mr-2"
                          />
                        </div>
                        <template #dropdown>
                          <el-dropdown-menu>
                            <el-dropdown-item>
                              <el-radio-group v-model="customerClassification" class="flex-col">
                                <div style="width: 100%">
                                  <el-radio
                                    class="text-left"
                                    style="color: blue"
                                    :label="` Khách hàng`"
                                    size="large"
                                    >Khách hàng</el-radio
                                  >
                                </div>
                                <div style="width: 100%">
                                  <el-radio
                                    class="text-left"
                                    style="color: blue"
                                    :label="` Nhà cung cấp`"
                                    size="large"
                                    >Nhà cung cấp</el-radio
                                  >
                                </div>
                                <div style="width: 100%">
                                  <el-radio
                                    class="text-left"
                                    style="color: blue"
                                    :label="`Chung`"
                                    size="large"
                                    >Chung</el-radio
                                  >
                                </div>
                              </el-radio-group>
                            </el-dropdown-item>
                            <el-dropdown-item divided>
                              <div style="width: 100%; text-align: center"> Confirm </div>
                            </el-dropdown-item>
                          </el-dropdown-menu>
                        </template>
                      </el-dropdown>
                    </div>
                  </div>
                </div>
              </template>

              <template #customerName v-if="businessClassification == 'Cá nhân'">
                <div class="flex items-center w-[100%] gap-4">
                  <label class="w-[15%] text-right leading-5" for=""
                    >{{ t('formDemo.customerName') }}<span style="color: red"> *</span>
                  </label>
                  <input
                    class="w-[80%] border-1 outline-none pl-2"
                    type="text"
                    :placeholder="t('formDemo.enterCustomerName')"
                  />
                </div>

                <div class="flex items-center w-[100%] gap-4 mt-5">
                  <label class="w-[15%] text-right leading-5" for=""
                    >{{ t('reuse.phoneNumber') }}<span style="color: red"> *</span>
                  </label>
                  <input
                    class="w-[80%] border-1 outline-none pl-2"
                    type="text"
                    :placeholder="t('reuse.enterPhoneNumber')"
                  />
                </div>

                <div class="flex items-center w-[100%] gap-4 mt-5">
                  <label class="w-[15%] text-right leading-5" for="">{{ t('reuse.email') }} </label>
                  <input
                    class="w-[80%] border-1 outline-none pl-2"
                    type="text"
                    :placeholder="t('formDemo.enterEmail')"
                  />
                </div>

                <div class="flex items-center w-[100%] gap-4 mt-5">
                  <label class="w-[15%] text-right leading-5" for="">CCCD/CMND </label>
                  <input
                    class="w-[25%] border-1 outline-none pl-2"
                    type="text"
                    :placeholder="t('formDemo.enterCCCD')"
                  />
                  <input
                    class="w-[26%] border-1 outline-none pl-2"
                    type="text"
                    :placeholder="t('formDemo.supplyDate')"
                  />
                  <input
                    class="w-[25%] border-1 outline-none pl-2"
                    type="text"
                    :placeholder="t('formDemo.supplyAddress')"
                  />
                </div>

                <div class="flex items-center w-[100%] gap-4 mt-5 custom-select-w38">
                  <label class="w-[15%] text-right leading-5" for="">{{
                    t('reuse.dateOfBirthAnGender')
                  }}</label>

                  <input
                    class="w-[40%] border-1 outline-none pl-2"
                    type="text"
                    :placeholder="t('reuse.dateOfBirth')"
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
                  <label class="w-[15%] text-right leading-5" for="">Link </label>
                  <input
                    class="w-[80%] border-1 outline-none pl-2"
                    type="text"
                    :placeholder="`Thêm link facebook/zalo ...`"
                  />
                </div>
              </template>

              <template #companyInfo v-if="businessClassification == 'Doanh nghiệp'">
                <div class="flex items-center w-[100%] gap-4 mt-5">
                  <label class="w-[15%] text-right leading-5" for=""
                    >{{ t('reuse.companyName') }}<span style="color: red"> *</span>
                  </label>
                  <input
                    class="w-[80%] border-1 outline-none pl-2"
                    type="text"
                    :placeholder="t('formDemo.enterDescription')"
                  />
                </div>

                <div class="flex items-center w-[100%] gap-4 mt-5">
                  <label class="w-[15%] text-right leading-5" for=""
                    >{{ t('reuse.taxCode') }}<span style="color: red"> *</span>
                  </label>
                  <input
                    class="w-[80%] border-1 outline-none pl-2"
                    type="text"
                    :placeholder="t('formDemo.enterTaxCode')"
                  />
                </div>

                <div class="flex items-center w-[100%] gap-4 mt-5">
                  <label class="w-[15%] text-right leading-5" for=""
                    >{{ t('formDemo.representative') }}
                  </label>
                  <input
                    class="w-[80%] border-1 outline-none pl-2"
                    type="text"
                    :placeholder="`Nhập tên người đai diện`"
                  />
                </div>

                <div class="flex items-center w-[100%] gap-4 mt-5">
                  <label class="w-[15%] text-right leading-5" for=""
                    >{{ t('reuse.phoneNumber') }}<span style="color: red">*</span>
                  </label>
                  <input
                    class="w-[80%] border-1 outline-none pl-2"
                    type="text"
                    :placeholder="t('reuse.enterPhoneNumber')"
                  />
                </div>

                <div class="flex items-center w-[100%] gap-4 mt-5">
                  <label class="w-[15%] text-right leading-5" for="">Email</label>
                  <input
                    class="w-[80%] border-1 outline-none pl-2"
                    type="text"
                    :placeholder="t('formDemo.enterEmail')"
                  />
                </div>

                <div class="flex items-center w-[100%] gap-4 mt-5">
                  <label class="w-[15%] text-right leading-5" for="">Link</label>
                  <input
                    class="w-[80%] border-1 outline-none pl-2"
                    type="text"
                    :placeholder="`Nhập link Fb, zalo`"
                  />
                </div>
              </template>

              <template #selectObject>
                <el-divider content-position="left">Tài khoản và trạng thái</el-divider>
              </template>

              <template #userInfo>
                <div class="flex items-center w-[100%] gap-4">
                  <label class="w-[15%] text-right leading-5" for=""
                    >Tên đăng nhập<span style="color: red">*</span>
                  </label>
                  <input
                    class="w-[80%] border-1 outline-none pl-2"
                    type="text"
                    :placeholder="`nhập tên đăng nhập`"
                  />
                </div>
              </template>

              <template #password>
                <div class="flex items-center w-[100%] gap-4">
                  <label class="w-[15%] text-right leading-5" for=""
                    >mật khẩu<span style="color: red">*</span>
                  </label>
                  <input
                    class="w-[80%] border-1 outline-none pl-2"
                    type="text"
                    :placeholder="`nhập mật khẩu`"
                  />
                </div>
              </template>

              <template #confirmPassword>
                <div class="flex items-center w-[100%] gap-4">
                  <label class="w-[15%] text-right leading-5" for=""
                    >Nhập lại mật khẩu<span style="color: red">*</span>
                  </label>
                  <input
                    class="w-[80%] border-1 outline-none pl-2"
                    type="text"
                    :placeholder="`Xác nhận lại mật khẩu`"
                  />
                </div>
              </template>

              <template #optionForm>
                <div class="flex items-center w-[100%] gap-4">
                  <p class="option-select text-center w-[15%] text-right leading-5"
                    >{{ t('formDemo.status') }}
                  </p>
                  <el-checkbox v-model="statusActive" label="Đang hoạt động" size="large" />
                </div>

                <div class="option-page mt-5">
                  <div v-if="awesome" class="flex justify-center option-1">
                    <el-button type="primary" @click="awesome = !awesome" class="min-w-42 min-h-11"
                      >Lưu</el-button
                    >
                    <el-button type="primary" class="min-w-42 min-h-11">Lưu & thêm mới</el-button>

                    <el-button type="danger" class="min-w-42 min-h-11">{{
                      t('reuse.cancel')
                    }}</el-button>
                  </div>
                  <div v-else class="flex justify-center option-1">
                    <el-button @click="fix = !fix" type="primary" class="min-w-42 min-h-11"
                      >Sửa</el-button
                    >
                    <el-button type="danger" class="min-w-42 min-h-11">Hủy tài khoản</el-button>
                  </div>

                  <div v-if="fix" class="flex justify-center option-1">
                    <el-button type="primary" class="min-w-42 min-h-11">Lưu</el-button>
                    <el-button type="danger" class="min-w-42 min-h-11">{{
                      t('reuse.cancel')
                    }}</el-button>
                  </div>
                </div>
              </template>
            </Form>
          </div>
          <div class="w-[50%]">
            <div class="text-sm text-[#303133] font-medium p pl-4 dark:text-[#fff]">
              <el-divider content-position="left">{{ t('reuse.picture') }}</el-divider>
              <div class="flex gap-4">
                <div class="about-image">
                  <p>Thêm ảnh hoặc file</p>
                  <p style="color: orange">Dưới 10 hồ sơ</p>
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
                :schema="schema2"
                label-position="top"
                hide-required-asterisk
                size="large"
                class="flex border-1 border-[var(--el-border-color)] border-none rounded-3xl box-shadow-blue bg-white dark:bg-[#141414]"
                @register="register"
              >
                <template #placeCustomer>
                  <div class="flex items-center w-[100%] gap-4">
                    <label class="w-[14%] text-right leading-5" for="">Tỉnh/thành phố </label>
                    <el-select
                      v-model="valueProvince"
                      style="width: 80%"
                      class="m-2 fix-full-width"
                      placeholder="Select"
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
                    <label class="w-[14%] text-right leading-5" for="">Quận/huyện </label>
                    <el-select
                      v-model="valueDistrict"
                      style="width: 80%"
                      class="m-2 fix-full-width"
                      placeholder="Select"
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
                    <label class="w-[15%] text-right leading-5" for="">Phường/xã </label>
                    <input
                      class="w-[80%] border-1 outline-none pl-2"
                      type="text"
                      :placeholder="`Chọn Phường/xã `"
                    />
                  </div>
                </template>
                <template #placeCustomer4>
                  <div class="flex items-center w-[100%] gap-4">
                    <label class="w-[15%] text-right leading-5" for="">Địa chỉ chi tiết </label>
                    <input
                      class="w-[80%] border-1 outline-none pl-2"
                      type="text"
                      :placeholder="` nhập Địa chỉ chi tiết`"
                    />
                  </div>
                </template>

                <template #referralCode>
                  <div class="flex items-center w-[100%] gap-4">
                    <label class="w-[15%] text-right leading-5" for="">Tên tài khoản </label>
                    <input
                      class="w-[80%] border-1 outline-none pl-2"
                      type="text"
                      :placeholder="`nhập tên tài khoản`"
                    />
                  </div>
                </template>
                <template #referralCode2>
                  <div class="flex items-center w-[100%] gap-4">
                    <label class="w-[15%] text-right leading-5" for="">Số tài khoản </label>
                    <input
                      class="w-[80%] border-1 outline-none pl-2"
                      type="text"
                      :placeholder="`nhập số tài khoản`"
                    />
                  </div>
                </template>
                <template #referralCode3>
                  <div class="flex items-center w-[100%] gap-4">
                    <label class="w-[15%] text-right leading-5" for="">Ngân hàng</label>
                    <input
                      class="w-[80%] border-1 outline-none pl-2"
                      type="text"
                      :placeholder="`chọn ngân hàng`"
                    />
                  </div>
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
</style>
