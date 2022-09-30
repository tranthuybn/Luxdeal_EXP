<script setup lang="ts">
import { reactive, ref, onBeforeMount } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import {
  ElCollapse,
  ElCollapseItem,
  ElUpload,
  ElButton,
  ElDivider,
  ElTable,
  ElTableColumn,
  ElRadioGroup,
  ElRadio,
  ElDialog,
  ElDatePicker,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElSwitch
} from 'element-plus'
import type { UploadFile } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { Collapse } from '../../Components/Type'
import { useForm } from '@/hooks/web/useForm'
import { Form } from '@/components/Form'
import MultipleOptionsBox from '@/components/MultipleOptionsBox.vue'

import { getProductsList } from '@/api/Business'

const { t } = useI18n()
const { register } = useForm()
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
    name: 'auctionProgramDetails',
    title: t('formDemo.auctionProgramDetails'),
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
  },
  {
    icon: plusIcon,
    name: 'auctionHistoryResults',
    title: t('formDemo.auctionHistoryResults'),
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

const schema = reactive<FormSchema[]>([
  {
    field: 'auctionInformation',
    label: t('formDemo.auctionInformation'),
    component: 'Divider',
    colProps: {
      span: 12
    }
  },
  {
    field: 'auctionCode',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'floorPriceSettingPriceStep',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'auctionDeadline',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('formDemo.selectOrEnterTheCollaboratorCode')
    }
  },
  {
    field: 'purchaseTime',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('formDemo.addNotes')
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

// setPriceFloor radio
const setPriceFloor = ref(false)

// check button huy
let countCancel = 1

// table history auction
const tableData = ref([
  {
    customerCode: '2016-05-03',
    customerName: 'Tom',
    highest: 'No. 189, Grove St, Los Angeles',
    paymentTime: '23135',
    purchaseTime: '131554',
    orderCode: '',
    status: 'Quá hạn mua hàng',
    permissionPurchase: false
  },
  {
    customerCode: '2016-05-02',
    customerName: 'Tom',
    highest: 'No. 189, Grove St, Los Angeles',
    paymentTime: '23135',
    purchaseTime: '131554',
    orderCode: '',
    status: '',
    permissionPurchase: true
  },
  {
    customerCode: '2016-05-04',
    customerName: 'Tom',
    highest: 'No. 189, Grove St, Los Angeles',
    paymentTime: '23135',
    purchaseTime: '131554',
    orderCode: '',
    status: 'Đã hủy kết quả',
    permissionPurchase: true
  },
  {
    customerCode: '2016-05-01',
    customerName: 'Tom',
    highest: 'No. 189, Grove St, Los Angeles',
    paymentTime: '23135',
    purchaseTime: '131554',
    orderCode: '',
    status: 'Quá hạn mua hàng',
    permissionPurchase: false
  }
])
// delete row table
const deleteRow = (index: number) => {
  tableData.value.splice(index, 1)
}

// check cho phép mua hàng
// const checkPermissionPurchase = ref()

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
          <Form
            :schema="schema"
            label-position="top"
            hide-required-asterisk
            size="large"
            class="flex border-1 border-[var(--el-border-color)] border-none rounded-3xl box-shadow-blue text-base"
            @register="register"
          >
            <template #auctionCode>
              <div class="flex items-center w-[100%] gap-4">
                <label class="w-[16%] text-right" for="">{{ t('formDemo.auctionCode') }}</label>
                <div class="font-bold">CB3452323</div>
              </div>
            </template>
            <template #floorPriceSettingPriceStep>
              <div class="flex items-center w-[100%] gap-4">
                <label class="w-[16%] text-right leading-5">{{
                  t('formDemo.floorPriceSettingPriceStep')
                }}</label>
                <div class="flex w-[80%] gap-4">
                  <div class="w-[50%] border-1 flex items-center">
                    <el-dropdown trigger="click" class="w-[100%]">
                      <span class="el-dropdown-link pl-2">
                        {{ t('formDemo.setPriceFloor')
                        }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
                      </span>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item>
                            <el-radio-group v-model="setPriceFloor">
                              <el-radio label="1" size="large" />
                            </el-radio-group>
                            Giảm theo %
                          </el-dropdown-item>
                          <el-dropdown-item>
                            <el-radio-group v-model="setPriceFloor">
                              <el-radio label="2" size="large" />
                            </el-radio-group>
                            Giảm theo số tiền
                          </el-dropdown-item>
                          <el-dropdown-item>
                            <el-radio-group v-model="setPriceFloor">
                              <el-radio label="3" size="large" />
                            </el-radio-group>
                            Không khuyến mại
                          </el-dropdown-item>
                          <el-dropdown-item divided>Confirm</el-dropdown-item>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                  </div>
                  <div class="flex w-[50%] border-1">
                    <input
                      class="w-[100%] outline-none pl-2 bg-transparent"
                      type="text"
                      :placeholder="t('formDemo.setPriceStepUp')"
                    />
                    <span class="pr-2">đ</span>
                  </div>
                </div>
              </div>
            </template>
            <template #auctionDeadline>
              <div class="flex items-center w-[100%] gap-4">
                <label class="w-[16%] text-right">{{ t('formDemo.auctionDeadline') }}</label>
                <div class="flex w-[80%] gap-2 demo-date-picker">
                  <el-date-picker
                    v-model="pickdate"
                    type="daterange"
                    :start-placeholder="t('formDemo.startDay')"
                    :end-placeholder="t('formDemo.endDay')"
                    format="DD/MM/YYYY"
                  />
                </div>
              </div>
            </template>
            <template #purchaseTime>
              <div class="flex items-center w-[100%] gap-4">
                <label class="w-[16%] text-right leading-5">{{ t('formDemo.purchaseTime') }}</label>
                <input
                  class="w-[80%] border-1 outline-none pl-2 bg-transparent rounded dark:border-"
                  type="text"
                  :placeholder="`${t('formDemo.enterNumberDays')}`"
                />
              </div>
            </template>
            <template #shortDescription>
              <div class="flex items-center w-[100%] gap-4">
                <label class="w-[16%] text-right" for="">{{
                  t('formDemo.shortDescription')
                }}</label>
                <input
                  class="w-[80%] border-1 outline-none pl-2 bg-transparent rounded dark:border-"
                  type="text"
                  :placeholder="`${t('formDemo.enterShortDescription')}`"
                />
              </div>
            </template>
          </Form>
        </div>
        <div class="w-[50%]">
          <div class="text-sm text-[#303133] font-medium p pl-4 dark:text-[#fff]">
            <el-divider content-position="left">{{ t('formDemo.attachments') }}</el-divider>
          </div>
          <div class="flex">
            <div class="pl-4">
              <el-upload action="#" list-type="picture-card" :auto-upload="false" class="relative">
                <template #file="{ file }">
                  <div>
                    <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                    <span class="el-upload-list__item-actions">
                      <span
                        class="el-upload-list__item-preview"
                        @click="handlePictureCardPreview(file)"
                      >
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
      <div class="flex w-[100%] gap-6">
        <div class="w-[50%] pl-2">
          <el-divider content-position="left">{{ t('formDemo.applicationProduct') }}</el-divider>
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
            <el-table-column prop="name" :label="t('formDemo.productInformation')" width="680" />

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
            <span
              v-if="!checkButton"
              class="border-1 bg-[#FD9800] w-[240px] text-light-50 pl-2 pr-22 dark:border-transparent"
              >{{ t('formDemo.pending') }}</span
            >
            <span
              v-else
              class="border-1 bg-[#409EFF] w-[240px] text-light-50 pl-2 pr-22 dark:border-transparent"
              >{{ t('formDemo.runningProgram') }}</span
            >
          </div>
          <div class="flex gap-4 items-center h-12">
            <span class="w-[16%]"></span>
            <div v-if="checkButton">
              <el-button
                class="min-w-[142px]"
                @click.prevent="
                  () => {
                    checkButton = !checkButton
                    countCancel++
                  }
                "
                type="primary"
                size="large"
                >{{ t('button.saveAndWaitApproval') }}</el-button
              >
              <el-button v-if="countCancel !== 1" class="min-w-[142px]" size="large">{{
                t('button.cancel')
              }}</el-button>
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
    </el-collapse-item>
    <el-collapse-item :name="collapse[1].name">
      <template #title>
        <el-button class="header-icon" :icon="collapse[1].icon" link />
        <span class="text-center text-xl">{{ collapse[1].title }}</span>
      </template>
      <el-table :data="tableData" border>
        <el-table-column prop="customerCode" :label="t('reuse.customerCode')" width="180" />
        <el-table-column prop="customerName" :label="t('formDemo.customerName')" width="180" />
        <el-table-column prop="highest" :label="t('formDemo.highestBid')" />
        <el-table-column prop="paymentTime" :label="t('formDemo.paymentTime')" />
        <el-table-column prop="purchaseTime" :label="t('formDemo.purchaseTime')" />
        <el-table-column prop="orderCode" :label="t('formDemo.orderCode')" />
        <el-table-column prop="status" :label="t('formDemo.status')" />
        <el-table-column prop="permissionPurchase" :label="t('formDemo.permissionPurchase')">
          <template #default="props">
            <el-switch
              v-model="props.row.permissionPurchase"
              inline-prompt
              active-text="ON"
              inactive-text="OFF"
            />
          </template>
        </el-table-column>
        <el-table-column fixed="right" :label="t('reuse.operator')" width="120">
          <template #default="scope">
            <el-button type="danger" size="large" @click.prevent="deleteRow(scope.$index)">
              {{ t('button.cancelResult') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-collapse-item>
  </el-collapse>
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
