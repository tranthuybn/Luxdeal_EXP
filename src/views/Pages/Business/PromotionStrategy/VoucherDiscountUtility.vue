<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Collapse } from '../../Components/Type'
import { useIcon } from '@/hooks/web/useIcon'
import { Form } from '@/components/Form'
import { useI18n } from '@/hooks/web/useI18n'
import {
  ElCollapse,
  ElCollapseItem,
  ElUpload,
  ElDivider,
  ElRadio,
  ElRadioGroup,
  ElTable,
  ElTableColumn,
  ElButton,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElDialog,
  ElCheckbox
} from 'element-plus'
import type { UploadFile } from 'element-plus'
import { useForm } from '@/hooks/web/useForm'
const { t } = useI18n()

const schema = reactive<FormSchema[]>([
  {
    field: 'newProductInfo',
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
    field: 'oderApply',
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
    field: 'condition',
    component: 'Input',
    colProps: {
      span: 24
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
    title: t('formDemo.voucherDetails'),
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
const handleRemove = (file: UploadFile) => {
  console.log(file)
}

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}

const activeName = ref(collapse[0].name)

const voucherCode = ref('FS3452323')
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)

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

const gridData = [
  {
    radioComboTable: '1',
    name: 'Voucher nhận miễn phí',
    address: ''
  },
  {
    radioComboTable: '2',
    name: 'Voucher Affiliate',
    address: ''
  },
  {
    radioComboTable: '3',
    name: 'Đổi bảng điểm',
    address: '500 đ '
  },
  {
    radioComboTable: '4',
    name: 'Mua bằng tiền ảo',
    address: '200,000 đ'
  }
]
const checked1 = ref(false)
const radioOptionCustomer = ref('2')
const radioOptionPromotionList = [
  t('formDemo.decreaseByPercent'),
  t('formDemo.decreaseByAmount'),
  t('formDemo.noPromotion')
]
const radioOptionPromotion = ref(radioOptionPromotionList[0])
const awesome = ref(true)
const input = ref('')
const openDialogChoosePromotion = ref(false)

const radioOrderApplyList = [
  t('reuse.sellOrderList'),
  t('reuse.leaseOrderList'),
  t('reuse.spaOrderList')
]
const radioOrderApply = ref(radioOrderApplyList[0])
const radioCondition = ref(false)
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
                    >{{ t('formDemo.voucherCode') }} <strong>{{ voucherCode }}</strong></p
                  >
                </div>
              </template>
              <template #promotion>
                <div class="flex items-center w-[100%] gap-4">
                  <label class="w-[15%] leading-5 text-right" for=""
                    >{{ t('formDemo.promotions') }} <span style="color: red">*</span>
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

              <template #oderApply>
                <div class="flex items-center w-[100%] gap-4">
                  <label class="w-[15%] leading-5 text-right" for=""
                    >{{ t('formDemo.odersApply') }} <span style="color: red">*</span>
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
                            {{ radioOrderApply }}
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
                              <el-radio-group v-model="radioOrderApply" class="flex-col">
                                <div style="width: 100%">
                                  <el-radio
                                    class="text-left"
                                    style="color: blue"
                                    :label="t('reuse.sellOrderList')"
                                    size="large"
                                    >{{ t('reuse.sellOrderList') }}</el-radio
                                  >
                                </div>

                                <div style="width: 100%">
                                  <el-radio
                                    class="text-left"
                                    style="color: blue"
                                    :label="t('reuse.leaseOrderList')"
                                    size="large"
                                    >{{ t('reuse.leaseOrderList') }}</el-radio
                                  >
                                </div>
                                <div style="width: 100%">
                                  <el-radio
                                    class="text-left"
                                    style="color: blue"
                                    :label="t('reuse.spaOrderList')"
                                    size="large"
                                    >{{ t('reuse.spaOrderList') }}</el-radio
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
                        :placeholder="t('formDemo.appliesToOrdersFrom')"
                      />
                      <span class="mr-5">đ</span>
                    </div>
                  </div>
                </div>
              </template>
              <template #duration>
                <div class="flex items-center w-[100%] gap-4">
                  <label class="w-[15%] leading-5 text-right" for=""
                    >{{ t('formDemo.duration') }} <span style="color: red">*</span>
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
              .

              <template #condition>
                <div class="flex items-center w-[100%] gap-4">
                  <label class="w-[15%] text-right leading-5" for=""
                    >{{ t('formDemo.condition') }}
                  </label>
                  <input
                    class="w-[63%] border-1 outline-none pl-2"
                    type="text"
                    :placeholder="`Voucher nhận miễn phí`"
                  />
                  <el-button
                    text
                    @click="
                      () => {
                        openDialogChoosePromotion = true
                      }
                    "
                    style="width: 15%; border: 1px solid"
                  >
                    + {{ t('formDemo.change') }}
                  </el-button>
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
                  width="100%"
                  style="width: 100%"
                  stripe
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

                <el-divider content-position="left">{{ t('formDemo.status') }}</el-divider>

                <div class="setting-sent-voucher text-center">
                  <span>{{ t('formDemo.voucherSendingSettings') }}</span>
                  <span class="mx-2"
                    ><el-checkbox
                      v-model="checked1"
                      :label="t('formDemo.sendImmediatelyAfterBrowsing')"
                      size="large"
                    />
                  </span>
                </div>

                <div class="option-select text-center"
                  >{{ t('formDemo.status') }}
                  <span v-if="awesome" class="option-1 ml-2">{{
                    t('formDemo.theProgramIsRunning')
                  }}</span>
                  <span v-else class="option-2">{{ t('formDemo.pending') }}</span>
                </div>

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

    <!-- DialogPromotion -->
    <el-dialog v-model="openDialogChoosePromotion" width="35%" align-center class="z-50">
      <div>
        <p>{{ t('formDemo.setConditionsToReceiveVoucher') }}</p>
        <el-divider />

        <el-table :data="gridData" border>
          <el-table-column prop="radioComboTable" width="90" align="center">
            <template #default="props">
              <el-radio-group v-model="radioCondition" class="ml-4">
                <el-radio :label="props.row.radioComboTable" size="large" />
              </el-radio-group>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="name" />
          <el-table-column prop="discount" width="120" align="left" /> -->

          <el-table-column property="name" label="Điều kiện" width="400" />
          <el-table-column property="address" label="Nhập điều kiện" />
        </el-table>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="w-[150px]" type="primary" @click="openDialogChoosePromotion = false"
            >{{ t('reuse.save') }}
          </el-button>
          <el-button class="w-[150px]" @click="openDialogChoosePromotion = false">{{
            t('reuse.exit')
          }}</el-button>
        </span>
      </template>
    </el-dialog>
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

::v-deep(.el-table .cell) {
  word-break: break-word;
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

::v-deep(.el-radio.el-radio--large .el-radio__label) {
  color: transparent;
}
</style>
