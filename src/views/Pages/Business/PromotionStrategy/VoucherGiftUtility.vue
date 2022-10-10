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
  ElSelect,
  ElRadio,
  ElRadioGroup,
  ElTable,
  ElTableColumn,
  ElButton,
  ElDialog,
  ElOption,
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
const value1 = ref([])

const options = [
  {
    value: 'SP1234',
    label: 'Kiểm tra'
  },
  {
    value: 'SP2345',
    label: 'Vệ sinh'
  },
  {
    value: 'SP3456',
    label: 'Sửa'
  },
  {
    value: 'SP4567',
    label: 'Khử mùi'
  },
  {
    value: 'SP5678',
    label: 'Thay mới'
  }
]

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

const tableData = ref([
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
])

const gridData = ref([
  {
    date: '2016-05-02',
    name: 'John Smith',
    address: 'No.1518,  Jinshajiang Road, Putuo District'
  },
  {
    date: '2016-05-04',
    name: 'John Smith',
    address: 'No.1518,  Jinshajiang Road, Putuo District'
  },
  {
    date: '2016-05-01',
    name: 'John Smith',
    address: 'No.1518,  Jinshajiang Road, Putuo District'
  },
  {
    date: '2016-05-03',
    name: 'John Smith',
    address: 'No.1518,  Jinshajiang Road, Putuo District'
  }
])

const deleteRow = (index: number) => {
  tableData.value.splice(index, 1)
}

const deleteRowSpaApply = (index: number) => {
  gridData.value.splice(index, 1)
}

const checked1 = ref(false)
const radioOptionCustomer = ref('2')
const awesome = ref(true)
const input = ref('')
const openDialogChoosePromotion = ref(false)
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

              <template #duration>
                <div class="flex items-center w-[100%] gap-4">
                  <label class="w-[15%] leading-5 text-right" for=""
                    >{{ t('formDemo.duration') }}<span style="color: red"> *</span>
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
                    >{{ t('formDemo.shortDescription') }}<span style="color: red"> *</span>
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
                    type="primary"
                    plain
                    text
                    @click="
                      () => {
                        openDialogChoosePromotion = true
                      }
                    "
                    style="padding: 0"
                  >
                    <span class="text-blue-500"> + {{ t('formDemo.change') }}</span>
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

                <el-table v-if="radioOptionCustomer == '2'" :data="tableData" border stripe>
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
                  <el-table-column fixed="right" label="Operations" width="120">
                    <template #default="scope">
                      <el-button
                        type="danger"
                        size="large"
                        @click.prevent="deleteRow(scope.$index)"
                      >
                        {{ t('reuse.delete') }}
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-divider content-position="left">{{
                  t('formDemo.applicableProductsAndSpaApply')
                }}</el-divider>

                <el-table :data="tableData" border stripe>
                  <el-table-column
                    prop="codeCustomer"
                    :label="t('formDemo.productManagementCode')"
                    width="150"
                  />
                  <el-table-column
                    prop="nameCustomer"
                    :label="t('formDemo.productInfomation')"
                    width="300"
                  />
                  <el-table-column prop="valueSw" :label="t('formDemo.joinTheProgram')" width="300">
                    <div style="display: inline-block">
                      <el-select
                        v-model="value1"
                        multiple
                        placeholder="Select"
                        style="width: 240px"
                      >
                        <div class="flex gap-2 font-bold justify-around">
                          <p>{{ t('formDemo.serviceCode') }}</p>
                          <p>{{ t('reuse.informationServices') }}</p>
                        </div>
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                          style="padding: 0"
                        >
                          <div class="flex gap-2 justify-around">
                            <p class="flex-1 ml-5">{{ item.value }}</p>
                            <p class="flex-1">{{ item.label }}</p>
                          </div>
                        </el-option>
                        <div class="confirm-option align-center custom-confirm">
                          <el-button class="btn-confirm" border="false">Confirm</el-button>
                        </div>
                      </el-select>
                    </div>
                  </el-table-column>

                  <el-table-column fixed="right" :label="t('formDemo.manipulation')" width="120">
                    <template #default="scope">
                      <el-button
                        type="danger"
                        size="large"
                        @click.prevent="deleteRowSpaApply(scope.$index)"
                      >
                        {{ t('reuse.delete') }}
                      </el-button>
                    </template>
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
        <p>Cài đặt điều kiện nhận Voucher</p>
        <el-divider />

        <el-table :data="gridData" border>
          <el-table-column width="50" property="value" label-class-name="noHeader" align="center">
            <template #default="data">
              <el-radio-group v-model="data.row.radio" class="ml-4">
                <el-radio label="1" size="large" />
              </el-radio-group>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="name" />
            <el-table-column prop="discount" width="120" align="left" /> -->

          <el-table-column property="date" label="Date" width="150" />
          <el-table-column property="name" label="Name" width="200" />
          <el-table-column property="address" label="Address" />
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
.black-color {
  color: #000000;
}

.custom-confirm {
  text-align: center;
  border-top: 1px solid #ccc;
  margin: 5px 15px 0 15px;
}

.custom-confirm > .btn-confirm {
  border: none;
  width: 100%;
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

::v-deep(.el-divider__text) {
  font-size: 16px;
}
</style>
