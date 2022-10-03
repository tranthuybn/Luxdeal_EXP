<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  ElCollapse,
  ElCollapseItem,
  ElUpload,
  ElDivider,
  ElSwitch,
  ElRadio,
  ElRadioGroup,
  ElTable,
  ElTableColumn,
  ElButton,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu
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
    field: 'information',
    label: t('router.analysis'),
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
      placeholder: t('reuse.descriptions')
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
const addIcon = useIcon({ icon: 'uil:plus' })
const viewIcon = useIcon({ icon: 'uil:search' })
const deleteIcon = useIcon({ icon: 'uil:trash-alt' })

const collapse: Array<Collapse> = [
  {
    icon: minusIcon,
    name: 'generalInformation',
    title: t('formDemo.detailsOfFlashSaleProgram'),
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

const discountCode = ref('FS3452323')
//upload image
const handleRemove = (file: UploadFile) => {
  console.log(file)
}

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
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

const radioOptionCustomer = ref('2')

const radioOptionPromotion = ref(t('formDemo.decreaseByPercent'))
const valueSwitch = ref(true)
const awesome = ref(true)
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
                    >{{ t('formDemo.flashSaleCode') }} <strong>{{ discountCode }}</strong></p
                  >
                </div>
              </template>
              <template #promotion>
                <div class="flex items-center w-[100%] gap-4">
                  <label class="w-[15%] leading-5 text-right" for=""
                    >{{ t('formDemo.promotions') }} <span style="color: red">*</span>
                  </label>

                  <div class="flex w-[80%] gap-2">
                    <div class="w-[50%] items-center border-1 rounded">
                      <el-dropdown trigger="click" class="w-[100%] h-[100%]">
                        <div class="flex justify-between w-[100%] items-center black-color">
                          <span
                            class="el-dropdown-link text-blue-500 cursor-pointer w-[100%] font-bold dark:text-light-50 ml-2"
                          >
                            {{ radioOptionPromotion }}
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
                              <el-radio-group v-model="radioOptionPromotion" class="flex-col">
                                <div style="width: 100%">
                                  <el-radio
                                    class="text-left"
                                    style="color: blue"
                                    :label="t('formDemo.decreaseByPercent')"
                                    size="large"
                                    >{{ t('formDemo.decreaseByPercent') }}</el-radio
                                  >
                                </div>
                                <div style="width: 100%">
                                  <el-radio
                                    class="text-left"
                                    style="color: blue"
                                    :label="t('formDemo.decreaseByAmount')"
                                    size="large"
                                    >{{ t('formDemo.decreaseByAmount') }}</el-radio
                                  >
                                </div>
                                <div style="width: 100%">
                                  <el-radio
                                    class="text-left"
                                    style="color: blue"
                                    :label="t('formDemo.noPromotion')"
                                    size="large"
                                    >{{ t('formDemo.noPromotion') }}</el-radio
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
                        :placeholder="t('formDemo.enterPercent')"
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
                    >{{ t('formDemo.shortDescription') }}<span style="color: red">*</span>
                  </label>
                  <input
                    class="w-[80%] border-1 outline-none pl-2"
                    type="text"
                    :placeholder="t('formDemo.enterDescription')"
                  />
                </div>
              </template>

              <template #applicableObject>
                <div class="flex w-[100%]">
                  <el-divider content-position="left">{{
                    t('reuse.subjectsOfApplication')
                  }}</el-divider>
                </div>
              </template>
              <template #selectObject>
                <div class="my-2 flex items-center text-sm">
                  <el-radio-group v-model="radioOptionCustomer" class="ml-4">
                    <el-radio label="1">{{ t('reuse.allCustomer') }}</el-radio>
                    <el-radio label="2">{{ t('formDemo.chooseCustomerDetail') }}</el-radio>
                  </el-radio-group>
                </div>

                <el-table
                  v-if="radioOptionCustomer == '2'"
                  :data="tableData"
                  border
                  stripe
                  style="width: 100%"
                >
                  <el-table-column
                    prop="codeCustomer"
                    :label="t('reuse.customerCode')"
                    width="150"
                  />
                  <el-table-column
                    prop="nameCustomer"
                    :label="t('reuse.customerName')"
                    width="600"
                  />
                  <el-table-column :label="t('formDemo.manipulation')" align="center" width="auto">
                    <el-button type="danger">{{ t('reuse.delete') }}</el-button>
                  </el-table-column>
                </el-table>

                <el-divider content-position="left">{{
                  t('formDemo.applicableProducts')
                }}</el-divider>

                <el-table :data="tableData" border stripe style="width: 100%">
                  <el-table-column
                    prop="codeCustomer"
                    :label="t('formDemo.productManagementCode')"
                    width="150"
                  />
                  <el-table-column
                    prop="nameCustomer"
                    :label="t('formDemo.productInfomation')"
                    width="500"
                  />
                  <el-table-column prop="valueSw" :label="t('formDemo.joinTheProgram')" width="100">
                    <el-switch
                      v-model="valueSwitch"
                      inline-prompt
                      size="large"
                      width="50px"
                      active-text="ON"
                      inactive-text="OFF"
                    />
                  </el-table-column>
                  <el-table-column :label="t('formDemo.manipulation')" align="center" width="auto">
                    <el-button type="danger">{{ t('reuse.delete') }}</el-button>
                  </el-table-column>
                </el-table>

                <el-divider content-position="left">{{ t('formDemo.status') }}</el-divider>

                <p class="option-select text-center"
                  >{{ t('formDemo.status') }}
                  <span v-if="awesome" class="option-1 ml-2">{{
                    t('formDemo.theProgramIsRunning')
                  }}</span>
                  <span v-else class="option-2">{{ t('formDemo.pending') }}</span>
                </p>

                <div class="option-page mt-5">
                  <div v-if="awesome" class="flex justify-center option-1">
                    <el-button
                      type="primary"
                      @click="awesome = !awesome"
                      class="min-w-42 min-h-11"
                      >{{ t('formDemo.saveAndPending') }}</el-button
                    >
                    <el-button class="min-w-42 min-h-11">{{ t('reuse.cancel') }}</el-button>
                  </div>
                  <div class="flex justify-center option-2" v-else>
                    <el-button @click="awesome = !awesome" plain class="min-w-42 min-h-11">{{
                      t('reuse.fix')
                    }}</el-button>
                    <el-button type="danger" class="min-w-42 min-h-11">{{
                      t('formDemo.cancelTheProgram')
                    }}</el-button>
                  </div>
                </div>
              </template>
            </Form>
          </div>
          <div class="w-[50%]">
            <div class="text-sm text-[#303133] font-medium p pl-4 dark:text-[#fff]">
              <el-divider content-position="left">{{ t('reuse.picture') }}</el-divider>
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
