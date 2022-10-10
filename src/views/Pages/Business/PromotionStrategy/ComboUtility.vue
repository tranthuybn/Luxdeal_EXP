<script setup lang="ts">
import { reactive, ref, onBeforeMount } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import {
  ElCollapse,
  ElCollapseItem,
  ElUpload,
  ElSelect,
  ElOption,
  ElButton,
  ElDivider,
  ElTable,
  ElTableColumn,
  ElRadioGroup,
  ElRadio,
  ElDialog,
  ElDatePicker,
  ElInput,
  ElCheckbox,
  ElForm,
  ElFormItem
} from 'element-plus'
import type { UploadFile } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { Collapse } from '../../Components/Type'
import MultipleOptionsBox from '@/components/MultipleOptionsBox.vue'
import type { FormInstance, FormRules } from 'element-plus'
import { getProductsList } from '@/api/Business'

const { t } = useI18n()

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  orderCode: 'CB3452323',
  collaborators: '',
  duration: '',
  discount: '',
  shortDescription: '',
  customerName: '',
  delivery: ''
})

const rules = reactive<FormRules>({
  orderCode: [{ required: true, message: 'Please input order code', trigger: 'blur' }],
  collaborators: [
    {
      required: true,
      message: 'Please select Activity zone',
      trigger: 'change'
    }
  ],
  discount: [
    {
      required: true,
      message: 'Please select Activity count',
      trigger: 'blur'
    }
  ],
  shortDescription: [{ required: true, message: 'Please input order note', trigger: 'blur' }],
  customerName: [{ required: true, message: 'Please select Customer', trigger: 'change' }],
  delivery: [
    {
      required: true,
      message: 'Please select activity resource',
      trigger: 'change'
    }
  ]
})

// let checkValidate = ref(false)

// const submitForm = async (formEl: FormInstance | undefined) => {
//   console.log('ruleForm:', ruleForm)
//   if (!formEl) return
//   await formEl.validate((valid, fields) => {
//     if (valid) {
//       console.log('submit!')
//     } else {
//       console.log('error submit!', fields)
//     }
//   })
// }
// upload image
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

// collapse

const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })

const collapse: Array<Collapse> = [
  {
    icon: minusIcon,
    name: 'comboDetail',
    title: t('formDemo.comboDetail'),
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
  } else {
    collapse.forEach((el) => {
      el.icon = plusIcon
    })
  }
}
const activeName = ref(collapse[0].name)

// Value date
// const pickdate = ref('')

const forceRemove = ref(false)
// remove row table
const removeListProductsSale = (index) => {
  if (ListOfProductsForSale[ListOfProductsForSale.length - 1].selfImportAccessories == undefined) {
    forceRemove.value = true
    console.log('index:', index)
    ListOfProductsForSale.splice(index, 1)
  }
}

// Table data
interface ListOfProductsForSaleType {
  name: string
  productCode: string
  id: string
  code: string
  quantity: number | undefined
  selfImportAccessories: string | undefined
  dram: string
  unitPrice: string
  intoMoney: string
  paymentType: string
  alreadyPaidForTt: string
  edited: boolean
}

const ListOfProductsForSale = reactive<Array<ListOfProductsForSaleType>>([
  {
    name: '',
    productCode: '',
    id: '',
    code: '',
    quantity: 1,
    selfImportAccessories: '',
    dram: t('formDemo.psc'),
    unitPrice: 'đ',
    intoMoney: 'đ',
    paymentType: '',
    alreadyPaidForTt: '',
    edited: true
  }
])

// Call api danh sách sản phẩm
let listProductsTable = ref()
const listProducts = ref()
const optionsApi = ref()

let optionCallAPi = 0
const callApiProductList = async () => {
  if (optionCallAPi == 0) {
    const res = await getProductsList({ ProductId: 1 })
    listProducts.value = res.data
    optionsApi.value = listProducts.value.map((product) => ({
      label: product.id.toString(),
      value: product.id.toString(),
      name: product.name,
      price: product.price.toString()
    }))
    optionCallAPi++
    listProductsTable.value = optionsApi.value
  }
}
// select MSP đổi tên thông tin sản phẩm
const changeName = (optionID, scope) => {
  const option = optionsApi.value.find((option) => option.name == optionID)
  scope.row.name = option.name
  scope.row.unitPrice = option.price
  scope.row.intoMoney = (parseInt(scope.row.quantity) * parseInt(scope.row.unitPrice)).toString()
}

// combo sending settings
const checkboxSending = ref(false)

// check button save or edit
const checkButton = ref(false)

// open or close change combo dialog
const openChangeComboDialog = ref(false)

// table change combo
const tableChangeCombo = [
  {
    radioComboTable: '1',
    condition: 'Combo nhận miễn phí',
    enterCondition: ''
  },
  {
    radioComboTable: '2',
    condition: 'Đổi bằng điểm',
    enterCondition: '500 điểm'
  },
  {
    radioComboTable: '3',
    condition: 'Mua bằng tiền ảo',
    enterCondition: '200,000 đ'
  }
]

// radio condition combo
const radioCondition = ref(false)

// select option
const selectSpaService = ref([])
const optionsSpaService = [
  {
    name: 'SP3542',
    value: 'Kiểm tra',
    label: 'Kiểm tra'
  },
  {
    name: 'SP35423',
    value: 'Vệ sinh',
    label: 'Vệ sinh'
  },
  {
    name: 'SP35424',
    value: 'Khử mùi nano',
    label: 'Khử mùi nano'
  }
]

const addIcon = useIcon({ icon: 'uil:plus' })
const viewIcon = useIcon({ icon: 'uil:search' })
const deleteIcon = useIcon({ icon: 'uil:trash-alt' })

const checkDisabled = ref(false)

onBeforeMount(() => {
  callApiProductList()
})
</script>
<template>
  <el-collapse
    v-model="activeName"
    @change="collapseChangeEvent"
    :class="[
      'bg-[var(--el-color-white)] dark:(bg-[var(--el-color-black)] border-[var(--el-border-color)] border-1px)'
    ]"
  >
    <el-collapse-item :name="collapse[0].name">
      <template #title>
        <el-button class="header-icon" :icon="collapse[0].icon" link />
        <span class="text-center text-xl">{{ collapse[0].title }}</span>
      </template>
      <div class="flex w-[100%] gap-6">
        <div class="w-[50%]">
          <el-form
            ref="ruleFormRef"
            :model="ruleForm"
            :rules="rules"
            label-width="170px"
            class="demo-ruleForm"
            status-icon
          >
            <el-form-item :label="t('formDemo.orderCode')" prop="orderCode">
              <el-input
                :disabled="checkDisabled"
                style="width: 100%; border: none"
                v-model="ruleForm.orderCode"
              />
            </el-form-item>
            <el-form-item :label="t('formDemo.duration')" prop="duration">
              <el-date-picker
                v-model="ruleForm.duration"
                type="daterange"
                :start-placeholder="t('formDemo.startDay')"
                :end-placeholder="t('formDemo.endDay')"
                format="DD/MM/YYYY"
              />
            </el-form-item>
            <el-form-item :label="t('formDemo.shortDescription')" prop="shortDescription">
              <el-input
                v-model="ruleForm.shortDescription"
                :placeholder="t('formDemo.enterShortDescription')"
              />
            </el-form-item>
            <el-form-item :label="t('formDemo.condition')">
              <div class="flex gap-2 w-[100%]">
                <el-input :placeholder="t('formDemo.comboGetFree')" />
                <el-button @click="openChangeComboDialog = true" style="padding: 8px 34px">{{
                  t('formDemo.change')
                }}</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div class="w-[50%]">
          <div class="text-sm text-[#303133] font-medium p pl-4 dark:text-[#fff]">
            <el-divider content-position="left">{{ t('formDemo.attachments') }}</el-divider>
          </div>
          <div class="flex">
            <div class="pl-4">
              <el-upload action="#" list-type="picture-card" :auto-upload="false">
                <ElButton :icon="addIcon" class="avatar-uploader-icon border-none" />
                <template #file="{ file }">
                  <div>
                    <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                    <span class="el-upload-list__item-actions">
                      <span
                        class="el-upload-list__item-preview"
                        @click="handlePictureCardPreview(file)"
                      >
                        <ElButton :icon="viewIcon" class="avatar-uploader-icon border-none" />
                      </span>
                      <span
                        v-if="!disabled"
                        class="el-upload-list__item-delete"
                        @click="handleDownload(file)"
                      >
                      </span>
                      <span
                        v-if="!disabled"
                        class="el-upload-list__item-delete"
                        @click="handleRemove(file)"
                      >
                        <ElButton :icon="deleteIcon" class="avatar-uploader-icon border-none" />
                      </span>
                    </span>
                  </div>
                </template>
              </el-upload>
            </div>
          </div>
        </div>
      </div>
      <div class="flex w-[100%] gap-6">
        <div class="w-[50%] pl-2">
          <el-divider content-position="left">{{
            t('formDemo.ApplicableSpaProductsServices')
          }}</el-divider>
          <el-table
            :data="ListOfProductsForSale"
            border
            :class="[
              'bg-[var(--el-color-white)] dark:(bg-[var(--el-color-black)] border-[var(--el-border-color)] border-1px)'
            ]"
          >
            <el-table-column
              :label="`${t('formDemo.productManagementCode')}`"
              width="120"
              prop="code"
            >
              <template #default="props">
                <MultipleOptionsBox
                  :fields="[
                    t('reuse.productCode'),
                    t('reuse.managementCode'),
                    t('formDemo.productInformation')
                  ]"
                  filterable
                  :items="listProductsTable"
                  :valueKey="'name'"
                  :labelKey="'id'"
                  :hiddenKey="['id']"
                  :placeHolder="'Chọn mã sản phẩm'"
                  :clearable="false"
                  @change="(option) => changeName(option, props)"
                />
              </template>
            </el-table-column>
            <el-table-column prop="name" :label="t('formDemo.productInformation')" width="320" />
            <el-table-column
              prop="selfImportAccessories"
              :label="t('reuse.spaService')"
              width="320"
            >
              <template #default>
                <el-select
                  v-model="selectSpaService"
                  multiple
                  placeholder="Select"
                  style="width: 300px"
                >
                  <div class="flex gap-4">
                    <div class="flex-1 font-bold pl-5 h-[34px]">Mã dịch vụ</div>
                    <div class="flex-1 font-bold pl-5 h-[34px]">Thông tin dịch vụ</div>
                  </div>
                  <el-option
                    v-for="item in optionsSpaService"
                    :key="item.value"
                    :label="item.label"
                    :name="item.name"
                    :value="item.name"
                    class="fix-padding"
                  >
                    <div class="flex gap-4">
                      <div class="flex-1 pl-5">{{ item.name }}</div>
                      <div class="flex-1 pl-5">{{ item.value }}</div>
                    </div>
                  </el-option>
                </el-select>
              </template>
            </el-table-column>

            <el-table-column :label="`${t('formDemo.manipulation')}`" align="center" min-width="90">
              <template #default="scope">
                <button
                  @click.prevent="removeListProductsSale(scope.$index)"
                  class="bg-[#EA4F37] pt-2 pb-2 pl-4 pr-4 text-[#fff]"
                  >Xóa</button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="w-[50%]"> </div>
      </div>
      <div class="flex w-[100%] gap-6">
        <div class="w-[50%] pl-2">
          <el-divider content-position="left">{{ t('formDemo.status') }}</el-divider>
          <div class="flex gap-4 items-center">
            <label class="w-[16%] text-right">{{ t('formDemo.comboSendingSettings') }}</label>
            <el-checkbox v-model="checkboxSending" />
            <div class="text-[#303133] font-normal dark:text-white">{{
              t('formDemo.sentImmediatelyAfterBrowsing')
            }}</div>
            <span class="text-[#FECB80]">({{ t('formDemo.sendingDetail') }})</span>
          </div>
          <div class="flex gap-4 items-center pt-4 pb-6">
            <label class="w-[16%] text-right">{{ t('formDemo.status') }}</label>
            <span class="border-1 bg-[#FD9800] text-light-50 pl-2 pr-22 dark:border-transparent">{{
              t('formDemo.pending')
            }}</span>
          </div>
          <div class="flex gap-4 items-center h-12">
            <span class="w-[16%]"></span>
            <div v-if="checkButton">
              <el-button
                class="min-w-[142px]"
                @click.prevent="
                  () => {
                    checkButton = !checkButton
                  }
                "
                type="primary"
                >{{ t('button.saveAndWaitApproval') }}</el-button
              >
              <el-button class="min-w-[142px]">{{ t('button.cancel') }}</el-button>
            </div>
            <div v-else>
              <el-button class="min-w-[142px]" @click.prevent="checkButton = !checkButton">{{
                t('button.edit')
              }}</el-button>
              <el-button class="min-w-[142px]" type="danger">{{
                t('button.cancelVoucher')
              }}</el-button>
            </div>
          </div>
        </div>
        <div class="w-[50%]"></div>
      </div>
    </el-collapse-item>
  </el-collapse>

  <!-- Dialog change combo -->
  <el-dialog
    v-model="openChangeComboDialog"
    :title="t('formDemo.inventoryInformation')"
    width="35%"
    align-center
    class="z-50"
  >
    <el-divider />
    <el-table :data="tableChangeCombo" border>
      <el-table-column prop="radioComboTable" width="90" align="center">
        <template #default="props">
          <el-radio-group v-model="radioCondition" class="ml-4">
            <el-radio :label="props.row.radioComboTable" />
          </el-radio-group>
        </template>
      </el-table-column>
      <el-table-column prop="condition" :label="t('formDemo.condition')" width="360" />
      <el-table-column prop="enterCondition" :label="t('formDemo.enterCondition')" />
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button class="w-[150px]" type="primary" @click="openChangeComboDialog = false"
          >{{ t('reuse.save') }}
        </el-button>
        <el-button class="w-[150px]" @click="openChangeComboDialog = false">{{
          t('reuse.exit')
        }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
::v-deep(.el-divider__text.is-left) {
  font-size: 16px !important;
}

::v-deep(.el-radio.el-radio--large .el-radio__label) {
  color: transparent;
}

.fix-padding {
  padding: 0;
}
::v-deep(.cell) {
  word-break: break-word;
}
</style>
