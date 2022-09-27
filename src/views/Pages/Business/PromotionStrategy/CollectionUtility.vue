<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Collapse } from '../../Components/Type'
import { useIcon } from '@/hooks/web/useIcon'
import { Form } from '@/components/Form'
import { useI18n } from '@/hooks/web/useI18n'
import {
  ElCollapse,
  ElCollapseItem,
  UploadFile,
  ElDivider,
  ElRadio,
  ElRadioGroup,
  ElTable,
  ElTableColumn,
  ElButton,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu
} from 'element-plus'
import { useForm } from '@/hooks/web/useForm'
const { t } = useI18n()

const schema = reactive<FormSchema[]>([
  {
    field: 'collectionInfo',
    label: 'Thông tin chung',
    component: 'Divider',
    colProps: {
      span: 12
    }
  },
  {
    field: 'discountCode',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'promotion',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'duration',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'desc',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: 'mô tả'
    }
  },
  {
    field: 'applicableObject',
    component: 'Input',
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
  }
])

const { register } = useForm()

const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })

const collapse: Array<Collapse> = [
  {
    icon: minusIcon,
    name: 'generalInformation',
    title: 'Chi tiết chương trình bộ sưu tập',
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

const collectionCode = ref('FS3452323')
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)
const handleRemove = (file: UploadFile) => {
  console.log(file)
}

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}

const handleDownload = (file: UploadFile) => {
  console.log(file)
}

const tableData = [
  {
    idCustomer: 1,
    codeCustomer: 'KH012',
    nameCustomer: 'Kat'
  },
  {
    idCustomer: 2,
    codeCustomer: 'KH012',
    nameCustomer: 'Kat'
  },
  {
    idCustomer: 3,
    codeCustomer: 'KH012',
    nameCustomer: 'Kat'
  },
  {
    idCustomer: 4,
    codeCustomer: 'KH012',
    nameCustomer: 'Kat'
  }
]

const radioSelectObject = ref(1)
const radioVAT = ref(false)
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
              <template #discountCode>
                <div class="discountCode">
                  <p
                    >Mã chương trình BST <strong>{{ collectionCode }}</strong></p
                  >
                </div>
              </template>
              <template #promotion>
                <div class="flex items-center w-[100%] gap-4">
                  <label class="w-[15%] leading-5 text-right" for=""
                    >Khuyễn mại <span style="color: red">*</span>
                  </label>

                  <div class="flex w-[80%] gap-2">
                    <!-- <input
                        class="w-[50%] border-1 outline-none pl-2"
                        type="text"
                        :placeholder="`Giảm theo %`"
                      /> -->
                    <div class="w-[50%] items-center border-1 rounded">
                      <el-dropdown trigger="click" class="w-[100%] h-[100%]">
                        <div class="flex justify-between w-[100%] items-center black-color">
                          <span
                            class="el-dropdown-link text-blue-500 cursor-pointer w-[100%] font-bold text-current ml-2"
                          >
                            Giảm theo %
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
                              <el-radio-group v-model="radioVAT" class="flex-col">
                                <div style="width: 100%">
                                  <el-radio
                                    class="text-left"
                                    style="color: blue"
                                    label="1"
                                    size="large"
                                    >Giảm theo %</el-radio
                                  >
                                </div>
                                <div style="width: 100%">
                                  <el-radio
                                    class="text-left"
                                    style="color: blue"
                                    label="2"
                                    size="large"
                                    >Giảm theo số tiền</el-radio
                                  >
                                </div>
                                <div style="width: 100%">
                                  <el-radio
                                    class="text-left"
                                    style="color: blue"
                                    label="3"
                                    size="large"
                                    >Không khuyến mãi</el-radio
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
                    <div class="flex items-center w-[50%] border-1 rounded">
                      <input
                        class="w-[100%] border-none outline-none pl-2 bg-transparent"
                        type="text"
                        :placeholder="`nhập số %`"
                      />
                      <Icon class="mr-3" icon="material-symbols:percent" :size="16" />
                    </div>
                  </div>
                </div>
              </template>
              <template #duration>
                <div class="flex items-center w-[100%] gap-4">
                  <label class="w-[15%] leading-5 text-right" for=""
                    >Thời hạn <span style="color: red">*</span>
                  </label>

                  <div class="flex w-[80%] gap-2">
                    <input
                      class="w-[50%] border-1 outline-none pl-2"
                      type="text"
                      :placeholder="`${t('reuse.startDate')}`"
                    />
                    <input
                      class="w-[50%] border-1 outline-none pl-2"
                      type="text"
                      :placeholder="`${t('reuse.endDate')}`"
                    />
                  </div>
                </div>
              </template>
              <template #desc>
                <div class="flex items-center w-[100%] gap-4">
                  <label class="w-[15%] text-right leading-5" for=""
                    >Mô tả ngắn<span style="color: red">*</span>
                  </label>
                  <input
                    class="w-[80%] border-1 outline-none pl-2"
                    type="text"
                    :placeholder="`nhập mô tả ngắn`"
                  />
                </div>
              </template>

              <template #applicableObject>
                <div class="flex w-[100%]">
                  <el-divider content-position="left">Đối tượng áp dụng</el-divider>
                </div>
              </template>
              <template #selectObject>
                <div class="my-2 flex items-center text-sm">
                  <el-radio-group v-model="radioSelectObject" class="ml-4">
                    <el-radio label="1">Tất cả khách hàng</el-radio>
                    <el-radio label="2">Chọn khách hàng chi tiết</el-radio>
                  </el-radio-group>
                </div>

                <el-table :data="tableData" border stripe style="width: 100%">
                  <el-table-column prop="codeCustomer" label="Mã khách hàng" width="150" />
                  <el-table-column prop="nameCustomer" label="Tên khách hàng" width="600" />
                  <el-table-column :label="t('formDemo.manipulation')" align="center" width="auto">
                    <button class="bg-[#EA4F37] pt-2 pb-2 pl-4 pr-4 text-[#fff]">Xóa</button>
                  </el-table-column>
                </el-table>

                <el-divider content-position="left">Sản phẩm áp dụng</el-divider>

                <el-table :data="tableData" border stripe style="width: 100%">
                  <el-table-column prop="codeCustomer" label="Mã quản lý sản phẩm" width="150" />
                  <el-table-column prop="nameCustomer" label="Thông tin sản phẩm" width="500" />
                  <el-table-column prop="nameCustomer" label="Tham gia chương trình" width="100" />
                  <el-table-column :label="t('formDemo.manipulation')" align="center" width="auto">
                    <button class="bg-[#EA4F37] pt-2 pb-2 pl-4 pr-4 text-[#fff]">Xóa</button>
                  </el-table-column>
                </el-table>

                <el-divider content-position="left">Trạng thái</el-divider>

                <p class="option-select"
                  >Trạng thái
                  <span class="option-1">Đang chạy chương trình</span>
                  <span class="option-2">Chờ duyệt</span>
                  <i class="ml-3" style="color: red"
                    >Chương trình Flasher tạo mới/chỉnh sửa phải có SA duyệt ở module duyệt
                  </i>
                </p>

                <div class="option-page">
                  <div class="flex justify-center option-1">
                    <el-button type="primary" class="min-w-42 min-h-11">Lưu & chờ duyệt</el-button>
                    <el-button class="min-w-42 min-h-11">{{ t('reuse.cancel') }}</el-button>
                  </div>
                  <div class="flex justify-center option-2">
                    <el-button plain class="min-w-42 min-h-11">Sửa</el-button>
                    <el-button type="danger" class="min-w-42 min-h-11">Hủy chương trình</el-button>
                  </div>
                </div>
              </template>
            </Form>
          </div>
          <div class="w-[50%]">
            <div class="text-sm text-[#303133] font-medium p pl-4 dark:text-[#fff]">
              <el-divider content-position="left">hình ảnh</el-divider>
              <div class="flex">
                <div class="pl-4"> Thêm ảnh </div>
              </div>
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
</style>
