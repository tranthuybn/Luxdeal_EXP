<script setup lang="ts">
import { reactive, ref, onBeforeMount } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import {
  ElUpload,
  ElButton,
  ElDivider,
  ElTable,
  ElTableColumn,
  ElRadioGroup,
  ElRadio,
  ElDialog,
  UploadUserFile,
  ElDatePicker
} from 'element-plus'
import type { UploadFile } from 'element-plus'
import { useForm } from '@/hooks/web/useForm'
import { Form } from '@/components/Form'
import MultipleOptionsBox from '@/components/MultipleOptionsBox.vue'
import { useIcon } from '@/hooks/web/useIcon'
import { getProductsList } from '@/api/Business'

const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const viewIcon = useIcon({ icon: 'uil:search' })
const deleteIcon = useIcon({ icon: 'uil:trash-alt' })
const { t } = useI18n()
const { register } = useForm()
// upload image
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)
const radio1 = ref('1')
let fileList = ref<UploadUserFile[]>([])
const ListFileUpload = ref()
const handleRemove = (file: UploadFile) => {
  fileList.value = fileList.value.filter((image) => image.url !== file.url)
  ListFileUpload.value = ListFileUpload.value.filter((image) => image.url !== file.url)
}

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}

const schema = reactive<FormSchema[]>([
  {
    field: 'generalInformation',
    label: t('formDemo.generalInformation'),
    component: 'Divider',
    colProps: {
      span: 12
    }
  },
  {
    field: 'packageAccumulatePointsCode',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'type',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('formDemo.addNotes')
    }
  },
  {
    field: 'points',
    component: 'Input',
    colProps: {
      span: 12
    }
  },
  {
    field: 'duration',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('formDemo.selectOrEnterTheCollaboratorCode')
    }
  },
  {
    field: 'shortDescription',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('formDemo.addNotes')
    }
  }
])

// Value date
const pickdate = ref('')

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

onBeforeMount(() => {
  callApiProductList()
})
</script>
<template>
  <div class="flex w-[100%] gap-6">
    <div class="w-[50%]">
      <Form
        :schema="schema"
        label-position="top"
        hide-required-asterisk
        size="large"
        class="flex border-1 border-[var(--el-border-color)] border-none rounded-3xl box-shadow-blue text-base"
        @register="register"
      >
        <template #packageAccumulatePointsCode>
          <div class="flex items-center w-[100%] gap-4">
            <label class="w-[16%] text-right" for="">{{
              t('router.packageAccumulatePointsCode')
            }}</label>
            <div class="font-bold">CB3452323</div>
          </div>
        </template>
        <template #duration>
          <div class="flex items-center w-[100%] gap-4">
            <label class="w-[16%] text-right">{{ t('formDemo.duration') }}</label>
            <div class="flex w-[80%] gap-2 demo-date-picker">
              <el-date-picker
                v-model="pickdate"
                type="daterange"
                start-placeholder="Start date"
                end-placeholder="End date"
                format="DD/MM/YYYY"
              />
            </div>
          </div>
        </template>
        <template #points>
          <div class="flex gap-4 w-[100%]">
            <label class="w-[33%] text-right">{{ t('reuse.Points') }}</label>
            <div class="leading-6 mt-2 ml-2">
              <div>500 Điểm</div>
            </div>
          </div>
          <div class="flex gap-4 w-[100%]"
            ><label class="w-[33%] text-right">{{ t('reuse.exchangedMoney') }}</label>
            <div class="leading-6 ml-2 mt-2">
              <div>300,000 đ</div>
            </div></div
          >
        </template>
        <template #shortDescription>
          <div class="flex items-center w-[100%] gap-4">
            <label class="w-[16%] text-right" for="">{{ t('formDemo.shortDescription') }}</label>
            <input
              class="w-[80%] border-1 outline-none pl-2 bg-transparent rounded dark:border-"
              type="text"
              :placeholder="`${t('formDemo.enterShortDescription')}`"
            />
          </div>
        </template>

        <template #type>
          <div class="flex items-center w-[100%] gap-4">
            <label class="w-[16%] text-right">{{ t('reuse.type') }}</label>
            <div class="w-[80%] bg-transparent flex items-center gap-4">
              <input
                type="text"
                class="border-1 w-[80%] outline-none rounded bg-transparent pl-2"
                :placeholder="`${t('router.buyPointsPackage')}`"
              />
              <el-button
                @click="openChangeComboDialog = true"
                :icon="plusIcon"
                style="padding: 8px 34px"
                >{{ t('formDemo.change') }}</el-button
              >
            </div>
          </div>
        </template>
      </Form>
    </div>
    <div class="w-[50%]">
      <div class="text-sm text-[#303133] font-medium p pl-4 dark:text-[#fff]">
        <el-divider content-position="left">{{ t('reuse.picture') }}</el-divider>
      </div>
      <div class="flex">
        <div class="pl-4">
          <el-upload
            :icon="plusIcon"
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :limit="1"
            class="relative"
          >
            <ElButton :icon="plusIcon" />
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
          <el-dialog width="80%" v-model="dialogVisible">
            <img class="w-full" :src="dialogImageUrl" alt="Preview Image" />
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
  <div class="flex w-[100%] gap-6">
    <div class="w-[50%] pl-2">
      <el-divider content-position="left">{{ t('reuse.subjectsOfApplication') }}</el-divider>
      <div class="mb-2 flex items-center text-sm">
        <el-radio-group v-model="radio1" class="ml-4">
          <el-radio label="1" size="large">
            <div class="text-[#303133] font-normal dark:text-white">{{
              t('reuse.allCustomer')
            }}</div></el-radio
          >
          <el-radio label="2" size="large"
            ><div class="text-[#303133] font-normal dark:text-white">{{
              t('formDemo.chooseCustomerDetail')
            }}</div></el-radio
          >
        </el-radio-group>
      </div>
      <el-table
        :data="ListOfProductsForSale"
        border
        :class="[
          'bg-[var(--el-color-white)] dark:(bg-[var(--el-color-black)] border-[var(--el-border-color)] border-1px)'
        ]"
      >
        <el-table-column :label="`${t('reuse.customerCode')}`" min-width="150" prop="code">
          <template #default="props">
            <MultipleOptionsBox
              :fields="[
                t('reuse.customerCode'),
                t('reuse.phoneNumber'),
                t('formDemo.customerName')
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
        <el-table-column prop="name" :label="t('formDemo.customerName')" min-width="480" />
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
            @click.prevent="checkButton = !checkButton"
            type="primary"
            size="large"
            >{{ t('button.saveAndWaitApproval') }}</el-button
          >
          <el-button class="min-w-[142px]" size="large">{{ t('button.cancel') }}</el-button>
        </div>
        <div v-else>
          <el-button
            class="min-w-[142px]"
            size="large"
            @click.prevent="checkButton = !checkButton"
            >{{ t('button.edit') }}</el-button
          >
          <el-button class="min-w-[142px]" size="large" type="danger">{{
            t('button.cancelVoucher')
          }}</el-button>
        </div>
      </div>
    </div>
    <div class="w-[50%]"></div>
  </div>

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
            <el-radio :label="props.row.radioComboTable" size="large" />
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
/* ::v-deep(.el-select-dropdown__item) {
    padding: 0 !important;
  } */
</style>
