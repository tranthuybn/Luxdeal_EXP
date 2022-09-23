<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import {
  ElCollapse,
  ElCollapseItem,
  ElUpload,
  ElSelect,
  ElOption,
  ElCheckbox,
  ElButton,
  ElDivider,
  ElTable,
  ElTableColumn,
  ElInput,
  ElRadioGroup,
  ElRadio,
  ElDialog,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElDatePicker
} from 'element-plus'
import type { UploadFile } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { useForm } from '@/hooks/web/useForm'
import { Form } from '@/components/Form'
import { Collapse } from '../../Components/Type'
import moment from 'moment'
import { getProductsList } from '@/api/Business'
// import MultipleOptionsBox from './MultipleOptionsBox.vue'
// import { PRODUCTS_AND_SERVICES } from '@/utils/API.Variables'
// import { getCategories } from '@/api/LibraryAndSetting'
// let rank1SelectOptions = reactive([])
// const getProductList = async () => {
//   await getCategories({ TypeName: PRODUCTS_AND_SERVICES[7].key })
//     .then((res) => {
//       if (res.data) {
//         rank1SelectOptions = res.data.map((index) => ({
//           label: index.name,
//           value: index.id
//         }))
//       }
//     })
//     .catch((err) => {
//       console.error(err)
//     })
// }
// console.log('rank1', rank1SelectOptions)
const { t } = useI18n()

const schema = reactive<FormSchema[]>([
  {
    field: 'orderInformation',
    label: t('formDemo.orderInformation'),
    component: 'Divider',
    colProps: {
      span: 12
    }
  },
  {
    field: 'orderCode',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('formDemo.enterOrderCode')
    }
  },
  {
    field: 'collaborators',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('formDemo.selectOrEnterTheCollaboratorCode')
    }
  },
  {
    field: 'orderNotes',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('formDemo.addNotes')
    }
  }
])

const newList = reactive<FormSchema[]>([
  {
    field: 'customer',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'customerName',
    component: 'Select',
    colProps: {
      span: 24
    }
  },
  {
    field: 'debtAndAddress',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'companyInformation',
    component: 'Input',
    colProps: {
      span: 12
    }
  }
])

const { register } = useForm()

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

const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })

const collapse: Array<Collapse> = [
  {
    icon: minusIcon,
    name: 'generalInformation',
    title: t('formDemo.generalInformation'),
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
    name: 'productAndPayment',
    title: t('formDemo.productAndPayment'),
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
    name: 'productImportHistory',
    title: t('formDemo.productImportHistory'),
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

const value2 = ref(t('formDemo.selfDelivery'))

const choosePayment = [
  {
    value: 'cashPayment',
    label: t('formDemo.cashPayment')
  },
  {
    value: 'cardPayment',
    label: t('formDemo.cardPayment')
  }
]

const chooseDelivery = [
  {
    value: 'deliveryAtTheCounter',
    label: t('formDemo.selfDelivery')
  },
  {
    value: 'deliveryToYourPlace',
    label: t('formDemo.deliveryToYourPlace')
  }
]

const radio1 = ref('')

// const alreadyPaidForTt = ref(true)
const doThis = () => {
  console.log('sas')
}

const input = ref('')

interface ListOfProductsForSaleType {
  name: string
  productCode: string
  id: string
  code: string
  quantity: number
  dram: string
  unitPrice: string
  intoMoney: string
  paymentType: string
  alreadyPaidForTt: string
  edited: boolean
}

const ListOfProductsForSale = ref<Array<ListOfProductsForSaleType>>([
  {
    name: '',
    productCode: '',
    id: '',
    code: '',
    quantity: 1,
    dram: t('formDemo.psc'),
    unitPrice: 'đ',
    intoMoney: 'đ',
    paymentType: '',
    alreadyPaidForTt: '',
    edited: true
  }
])
const tableData2 = [
  {
    name: '',
    quantity: '',
    unitPrice: '',
    intoMoney: ''
  }
]

const historyTable = ref([
  {
    name: 'Droplist & chỉ lấy sản phẩm trong danh sách sản phẩm bán của đơn này',
    quantity: '',
    unit: t('formDemo.psc')
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

//add row table
const deleteRowDebtTable = (index: number) => {
  debtTable.value.splice(index, 1)
}

const onAddHistoryTableItem = () => {
  historyTable.value.push({
    name: '',
    quantity: '',
    unit: t('formDemo.psc')
  })
}
const deleteRow = (index: number) => {
  historyTable.value.splice(index, 1)
}
// Dialog change address

const dialogFormVisible = ref(false)
const dialogAddQuick = ref(false)
const openDialogChooseWarehouse = ref(false)
const openDialogChoosePromotion = ref(false)
const valueProvince = ref('')
const valueDistrict = ref('')
const valueCommune = ref('')
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
const enterdetailAddress = ref('')
const tableWarehouse = [
  {
    warehouseCheckbox: '',
    name: 'Kho Hà Nội',
    address: ''
  },
  {
    warehouseCheckbox: '',
    name: 'Kho Hồ Chí Minh',
    address: ''
  }
]
// const test = ref(false)

// promo table
const promoTable = [
  {
    radioSelect: '',
    name: `FGD3443D
    Giảm giá 60% đơn hàng...
    Áp dụng cho đơn hàng từ 300`,
    discount: '50%'
  },
  {
    radioSelect: '',
    name: `FGD3443D\nGiảm giá 60% đơn hàng...\nÁp dụng cho đơn hàng từ 300`,
    discount: '50%'
  },
  {
    radioSelect: '',
    name: `FGD3443D\nGiảm giá 60% đơn hàng...\nÁp dụng cho đơn hàng từ 300`,
    discount: '50%'
  },
  {
    radioSelect: '',
    name: `FGD3443D\nGiảm giá 60% đơn hàng...\nÁp dụng cho đơn hàng từ 300`,
    discount: '50%'
  },
  {
    radioSelect: '',
    name: `FGD3443D\nGiảm giá 60% đơn hàng...\nÁp dụng cho đơn hàng từ 300`,
    discount: '50%'
  }
]
const checkDiscount = ref(false)

// handle input
interface tableDataType {
  dateOfPayment: string
  col: number
  content: string
  collected: string
  spent: string
  salesDebt: string
  edited: boolean
  paymentType: string
}
const debtTable = ref<Array<tableDataType>>([
  {
    dateOfPayment: moment().format('L').toString(),
    col: 1,
    content: '',
    collected: '',
    spent: '',
    salesDebt: '',
    edited: true,
    paymentType: ''
  }
])

const onAddDebtTableItem = () => {
  debtTable.value.push({
    dateOfPayment: moment().format('L').toString(),
    col: 1,
    content: '',
    collected: '',
    spent: '',
    salesDebt: '',
    edited: true,
    paymentType: ''
  })
}
const customerInput = ref('')

const customerList = ref([
  {
    value: 'Option1',
    label: 'Option1'
  },
  {
    value: 'Option2',
    label: 'Option2'
  }
])

const radioVAT = ref(false)
const listProducts = ref()
const optionsApi = ref()
let optionCallAPi = 0
const callApi = async () => {
  if (optionCallAPi == 0) {
    const res = await getProductsList('')
    listProducts.value = res.data
    optionsApi.value = listProducts.value.map((product) => ({
      label: product.id,
      value: product.id,
      name: product.name,
      price: product.price
    }))
    optionCallAPi++
  }
}
const changeName = (optionID, scope) => {
  const option = optionsApi.value.find((option) => option.value == optionID)
  scope.row.name = option.name
  scope.row.unitPrice = option.price
  scope.row.intoMoney = scope.row.unitPrice * scope.row.quantity
  console.log(option)
}

const handleTotal = (scope) => {
  console.log('scope:', scope)
}

const collaboratorsValue = ref('')
// phân loại khách hàng: 1: công ty, 2: cá nhân
const valueClassify = ref('company')
const optionsClassify = [
  {
    value: 'company',
    label: t('formDemo.company')
  },
  {
    value: 'individual',
    label: t('formDemo.individual')
  }
]
// select khách hàng
const valueSelectCustomer = ref(t('formDemo.customer'))
const optionsCustomer = [
  {
    value: 'customer',
    label: t('formDemo.customer')
  }
]
</script>

<template>
  <div class="demo-collapse dark:bg-[#141414]">
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
              class="flex border-1 border-[var(--el-border-color)] border-none rounded-3xl box-shadow-blue bg-white dark:bg-[#141414]"
              @register="register"
            >
              <template #orderCode>
                <div class="flex items-center w-[100%] gap-4">
                  <label class="w-[16%] text-right" for="">{{ t('formDemo.orderCode') }}</label>
                  <input
                    class="w-[80%] border-1 w-[100%] outline-none pl-2 bg-transparent"
                    type="text"
                    :placeholder="`${t('formDemo.orderCode')}`"
                  />
                </div>
              </template>
              <template #collaborators>
                <div class="flex items-center w-[100%] gap-4">
                  <label class="w-[16%] text-right" for="">{{ t('formDemo.collaborators') }}</label>
                  <div class="flex w-[80%] gap-2">
                    <div class="w-[50%] input-width">
                      <el-select
                        v-model="collaboratorsValue"
                        :placeholder="t('formDemo.selectOrEnterTheCollaboratorCode')"
                        filterable
                        size="large"
                        @focus="callApi()"
                      >
                        <el-option
                          v-for="(item, index) in optionsApi"
                          :key="index"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </div>
                    <div class="flex items-center w-[50%] border-1 rounded">
                      <input
                        class="w-[100%] border-none outline-none pl-2 bg-transparent"
                        type="text"
                        :placeholder="`${t('formDemo.enterDiscount')}`"
                      />
                      <Icon class="mr-3" icon="material-symbols:percent" :size="16" />
                    </div>
                  </div>
                </div>
              </template>
              <template #orderNotes>
                <div class="flex items-center w-[100%] gap-4">
                  <label class="w-[16%] text-right" for="">{{ t('formDemo.orderNotes') }}</label>
                  <input
                    class="w-[80%] border-1 outline-none pl-2 bg-transparent"
                    type="text"
                    :placeholder="`${t('formDemo.addNotes')}`"
                  />
                </div>
              </template>
              <template #customerName>
                <div class="flex items-center w-[100%] gap-4">
                  <label class="w-[16%] text-right">{{ t('formDemo.customerName') }}</label>
                  <div class="flex w-[84%] gap-2 bg-transparent">
                    <el-select v-model="customerInput" filterable placeholder="Select">
                      <el-option
                        v-for="item in customerList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                    <button @click.stop.prevent="doThis" class="border-1 pl-3 pr-3 border-[#2C6DDA]"
                      >+ {{ t('button.add') }}</button
                    >
                  </div>
                </div>
              </template>

              <template #debt>
                <div class="flex items-center w-[100%]">
                  <div class="ml-[17%] w-[80%] bg-[#f4f8fd] dark:bg-[#3B3B3B] text-blue-500">
                    <p class="ml-2">{{ t('formDemo.noDebt') }}</p>
                  </div>
                </div>
              </template>
            </Form>
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
                  :auto-upload="false"
                  class="relative"
                >
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
                      >+ {{ t('formDemo.addPhotosOrFiles') }}</div
                    >
                  </el-dialog>
                </el-upload>
              </div>
            </div>
          </div>
        </div>
        <div class="flex w-[100%]">
          <div class="w-[100%]">
            <Form
              :schema="newList"
              label-position="top"
              hide-required-asterisk
              size="large"
              @register="register"
            >
              <template #customer>
                <div class="flex w-[100%] gap-8">
                  <el-divider content-position="left">{{ t('formDemo.customer') }}</el-divider>
                  <el-divider content-position="left">{{ t('formDemo.delivery') }}</el-divider>
                </div>
              </template>
              <template #customerName>
                <div class="flex gap-4">
                  <div class="flex w-[50%]">
                    <div class="flex w-[100%] gap-4">
                      <div class="w-[15%] text-right ml-2 leading-5">
                        <label>{{ t('formDemo.customerName') }}</label>
                        <p class="text-[#FECB80] italic">{{ t('formDemo.represent') }}</p>
                      </div>
                      <input
                        class="w-[62%] border-1 outline-none pl-2"
                        type="text"
                        :placeholder="`${t('formDemo.chooseACustomer')}`"
                      />
                      <div class="border-1 border-blue-500">
                        <el-button text @click="dialogAddQuick = true"
                          >+ {{ t('button.add') }}</el-button
                        >
                      </div>
                      <el-dialog
                        v-model="dialogAddQuick"
                        width="40%"
                        align-center
                        :title="`${t('formDemo.QuicklyAddCustomers')}`"
                        v-if="valueClassify == 'company'"
                      >
                        <el-divider />
                        <div>
                          <div class="flex gap-4 pt-4 pb-4 items-center">
                            <label class="w-[30%] text-right max-w-[162.73px]">{{
                              t('formDemo.classify')
                            }}</label>
                            <div class="w-[80%] flex gap-2">
                              <div class="w-[50%] fix-full-width">
                                <el-select
                                  v-model="valueClassify"
                                  placeholder="Select"
                                  size="large"
                                >
                                  <el-option
                                    v-for="item in optionsClassify"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                  />
                                </el-select>
                              </div>
                              <div class="w-[50%] fix-full-width">
                                <el-select
                                  v-model="valueSelectCustomer"
                                  placeholder="Select"
                                  size="large"
                                >
                                  <el-option
                                    v-for="item in optionsCustomer"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                  />
                                </el-select>
                              </div>
                            </div>
                          </div>

                          <div class="flex gap-4 pt-4 pb-4">
                            <label class="w-[30%] text-right">{{
                              t('formDemo.companyName')
                            }}</label>
                            <el-input
                              style="width: 100%"
                              :placeholder="`${t('formDemo.enterCompanyName')}`"
                            />
                          </div>
                          <div class="flex gap-4 pt-4 pb-4">
                            <label class="w-[30%] text-right">{{ t('formDemo.taxCode') }}</label>
                            <el-input
                              style="width: 100%"
                              :placeholder="`${t('formDemo.enterTaxCode')}`"
                            />
                          </div>
                          <div class="flex gap-4 pt-4 pb-4">
                            <label class="w-[30%] text-right">{{
                              t('formDemo.representative')
                            }}</label>
                            <el-input
                              style="width: 100%"
                              :placeholder="`${t('formDemo.enterRepresentative')}`"
                            />
                          </div>
                          <div class="flex gap-4 pt-4 pb-4">
                            <label class="w-[30%] text-right">{{ t('reuse.phoneNumber') }}</label>
                            <el-input
                              style="width: 100%"
                              :placeholder="`${t('formDemo.enterPhoneNumber')}`"
                            />
                          </div>
                          <div class="flex gap-4 pt-4 pb-4">
                            <label class="w-[30%] text-right">{{ t('reuse.email') }}</label>
                            <el-input
                              style="width: 100%"
                              :placeholder="`${t('formDemo.enterEmail')}`"
                            />
                          </div>
                        </div>
                        <template #footer>
                          <span class="dialog-footer">
                            <el-button
                              type="primary"
                              class="w-[150px]"
                              @click.stop.prevent="dialogAddQuick = false"
                              >{{ t('reuse.save') }}</el-button
                            >
                            <el-button
                              class="w-[150px]"
                              @click.stop.prevent="dialogAddQuick = false"
                              >{{ t('reuse.exit') }}</el-button
                            >
                          </span>
                        </template>
                      </el-dialog>
                      <el-dialog
                        v-model="dialogAddQuick"
                        v-else
                        width="40%"
                        align-center
                        :title="`${t('formDemo.QuicklyAddCustomers')}`"
                      >
                        <el-divider />
                        <div>
                          <div class="flex gap-4 pt-4 pb-4 items-center">
                            <label class="w-[30%] text-right max-w-[162.73px]">{{
                              t('formDemo.classify')
                            }}</label>
                            <div class="w-[80%] flex gap-2">
                              <div class="w-[50%] fix-full-width">
                                <el-select
                                  v-model="valueClassify"
                                  placeholder="Select"
                                  size="large"
                                >
                                  <el-option
                                    v-for="item in optionsClassify"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                  />
                                </el-select>
                              </div>
                              <div class="w-[50%] fix-full-width">
                                <el-select
                                  v-model="valueSelectCustomer"
                                  placeholder="Select"
                                  size="large"
                                >
                                  <el-option
                                    v-for="item in optionsCustomer"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                  />
                                </el-select>
                              </div>
                            </div>
                          </div>

                          <div class="flex gap-4 pt-4 pb-4">
                            <label class="w-[30%] text-right">{{
                              t('formDemo.companyName')
                            }}</label>
                            <el-input
                              style="width: 100%"
                              :placeholder="`${t('formDemo.enterCompanyName')}`"
                            />
                          </div>

                          <div class="flex gap-4 pt-4 pb-4">
                            <label class="w-[30%] text-right">{{ t('reuse.phoneNumber') }}</label>
                            <el-input
                              style="width: 100%"
                              :placeholder="`${t('formDemo.enterPhoneNumber')}`"
                            />
                          </div>
                          <div class="flex gap-4 pt-4 pb-4">
                            <label class="w-[30%] text-right">{{ t('reuse.email') }}</label>
                            <el-input
                              style="width: 100%"
                              :placeholder="`${t('formDemo.enterEmail')}`"
                            />
                          </div>
                        </div>
                        <template #footer>
                          <span class="dialog-footer">
                            <el-button
                              type="primary"
                              class="w-[150px]"
                              @click.stop.prevent="dialogAddQuick = false"
                              >{{ t('reuse.save') }}</el-button
                            >
                            <el-button
                              class="w-[150px]"
                              @click.stop.prevent="dialogAddQuick = false"
                              >{{ t('reuse.exit') }}</el-button
                            >
                          </span>
                        </template>
                      </el-dialog>
                    </div>
                  </div>
                  <div class="flex w-[50%] max-h-[42px]">
                    <div class="flex w-[100%] gap-4">
                      <label class="w-[20%] text-right ml-2">{{
                        t('formDemo.chooseShipping')
                      }}</label>
                      <el-select
                        v-model="value2"
                        class="fix-full-width"
                        :placeholder="`${t('formDemo.selfDelivery')}`"
                        size="large"
                      >
                        <el-option
                          v-for="i in chooseDelivery"
                          :key="i.value"
                          :label="i.label"
                          :value="i.value"
                        />
                      </el-select>
                    </div>
                  </div>
                </div>
              </template>
              <template #debtAndAddress>
                <div class="flex w-[100%] gap-6">
                  <div class="w-[50%] pl-[8%]">
                    <p class="max-w-[94%] bg-[#F4F8FD] ml-3 pl-2 text-blue-500 dark:bg-[#3B3B3B]">{{
                      t('formDemo.noDebt')
                    }}</p>
                  </div>
                  <div class="flex w-[50%] gap-4">
                    <p class="w-[16%] ml-2 text-[#828387] text-right">{{
                      t('formDemo.deliveryAddress')
                    }}</p>
                    <p>79 Khúc Thừa Dụ, phường Dịch Vọng, quận Cầu Giấy, Hà Nội</p>
                    <p>
                      <el-button
                        class="hover:bg-transparent; focus:bg-transparent"
                        text
                        @click="dialogFormVisible = true"
                        ><span class="text-blue-500">+ {{ t('formDemo.changeTheAddress') }}</span>
                      </el-button>
                      <el-dialog
                        v-model="dialogFormVisible"
                        width="35%"
                        align-center
                        title="Địa chỉ nhận hàng"
                      >
                        <el-divider />
                        <div>
                          <div class="flex w-[100%] gap-4 items-center">
                            <label class="w-[25%] text-right">{{
                              t('formDemo.provinceOrCity')
                            }}</label>
                            <el-select
                              v-model="valueProvince"
                              style="width: 96%"
                              class="m-2"
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
                          <div class="flex w-[100%] gap-4 items-center">
                            <label class="w-[25%] text-right">{{
                              t('formDemo.countyOrDistrict')
                            }}</label>
                            <el-select
                              v-model="valueDistrict"
                              style="width: 96%"
                              class="m-2"
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
                          <div class="flex w-[100%] gap-4 items-center">
                            <label class="w-[25%] text-right">{{
                              t('formDemo.wardOrCommune')
                            }}</label>
                            <el-select
                              v-model="valueCommune"
                              style="width: 96%"
                              class="m-2"
                              placeholder="Select"
                            >
                              <el-option
                                v-for="item in choosePayment"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                              />
                            </el-select>
                          </div>
                          <div class="flex w-[100%] gap-4 items-center">
                            <label class="w-[25%] text-right">{{
                              t('formDemo.detailedAddress')
                            }}</label>
                            <el-input
                              v-model="enterdetailAddress"
                              class="m-2"
                              style="width: 96%"
                              placeholder="Please input"
                            />
                          </div>
                        </div>
                        <template #footer>
                          <span class="dialog-footer">
                            <el-button
                              class="w-[150px]"
                              type="primary"
                              @click="dialogFormVisible = false"
                              >{{ t('reuse.save') }}</el-button
                            >
                            <el-button class="w-[150px]" @click="dialogFormVisible = false">{{
                              t('reuse.exit')
                            }}</el-button>
                          </span>
                        </template>
                      </el-dialog>
                    </p>
                  </div>
                </div>
              </template>
              <template #companyInformation>
                <div class="flex gap-4 w-[100%]">
                  <label class="w-[16%] text-right">{{ t('formDemo.companyInformation') }}</label>
                  <div class="leading-6 mt-2">
                    <div>Công ty cổ phần Bắc Á</div>
                    <div>Mã số thuế: 0994563243</div>
                    <div>Số điện thoại: 094345355</div>
                    <div>Email: info@baca.com</div>
                  </div>
                </div>
              </template>
            </Form>
          </div>
        </div>
      </el-collapse-item>

      <!-- DialogChooseWarehouse -->
      <el-dialog
        v-model="openDialogChooseWarehouse"
        :title="t('formDemo.inventoryInformation')"
        width="35%"
        align-center
        class="z-50"
      >
        <el-divider />
        <el-table :data="tableWarehouse" border>
          <el-table-column prop="warehouseCheckbox" width="90" align="center">
            <template #default="props">
              <el-checkbox v-model="props.row.warehouseCheckbox" size="large" />
            </template>
          </el-table-column>
          <el-table-column prop="name" :label="t('formDemo.warehouseInformation')" width="360" />
          <el-table-column :label="t('reuse.inventory')">
            <div class="flex">
              <span class="flex-1">20</span>
              <span class="flex-1 text-right">Chiếc</span>
            </div> </el-table-column
          >>
        </el-table>
        <template #footer>
          <span class="dialog-footer">
            <el-button
              class="w-[150px]"
              type="primary"
              @click="openDialogChooseWarehouse = false"
              >{{ t('reuse.save') }}</el-button
            >
            <el-button class="w-[150px]" @click="openDialogChooseWarehouse = false">{{
              t('reuse.exit')
            }}</el-button>
          </span>
        </template>
      </el-dialog>

      <!-- DialogPromotion -->
      <el-dialog
        v-model="openDialogChoosePromotion"
        title="Warning"
        width="35%"
        align-center
        class="z-50"
      >
        <el-divider />
        <div>
          <div class="flex items-center gap-3">
            <el-input
              style="width: 100%"
              v-model="input"
              :placeholder="t('formDemo.enterPromoCode')"
            />
            <el-button class="w-[150px] border-1 border-blue-500" plain>{{
              t('formDemo.apply')
            }}</el-button>
          </div>
          <div class="bg-[#F4F8FD] mt-2 mb-4">
            <div class="ml-2 text-blue-500">FGF3443D</div>
            <div class="ml-2 text-blue-500">Giảm giá 60% đơn hàng ...</div>
            <div class="ml-2 text-blue-500">Áp dụng cho đơn hàng từ 300k</div>
          </div>
          <div class="flex items-center">
            <h2 class="font-bold text-base w-[40%]">Hoặc chọn mã có sẵn</h2>
            <el-divider />
          </div>
          <el-table :data="promoTable" border>
            <el-table-column
              v-model="checkDiscount"
              width="50"
              prop="radioSelect"
              label-class-name="noHeader"
              align="center"
            >
              <template #default="props">
                <el-radio v-model="props.row.discount" size="large" />
              </template>
            </el-table-column>
            <el-table-column label="Name" prop="name">
              <template #header> </template>
            </el-table-column>
            <el-table-column prop="discount" width="120" align="left" />
          </el-table>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button
              class="w-[150px]"
              type="primary"
              @click="openDialogChoosePromotion = false"
              >{{ t('reuse.save') }}</el-button
            >
            <el-button class="w-[150px]" @click="openDialogChoosePromotion = false">{{
              t('reuse.exit')
            }}</el-button>
          </span>
        </template>
      </el-dialog>

      <el-collapse-item :name="collapse[1].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[1].icon" link />
          <span class="text-center text-xl">{{ collapse[1].title }}</span>
        </template>
        <el-divider content-position="left">{{ t('formDemo.ListOfProductsForSale') }}</el-divider>
        <el-table
          :data="ListOfProductsForSale"
          border
          :class="[
            'bg-[var(--el-color-white)] dark:(bg-[var(--el-color-black)] border-[var(--el-border-color)] border-1px)'
          ]"
        >
          <el-table-column
            :label="`${t('formDemo.productManagementCode')}`"
            min-width="250"
            prop="code"
          >
            <template #default="props">
              <el-select
                v-model="props.row.productCode"
                filterable
                class="m-2"
                size="large"
                @focus="callApi()"
                @change="(option) => changeName(option, props)"
              >
                <el-option
                  v-for="(item, index) in optionsApi"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
            <!-- <MultipleOptionsBox
              :fields="warehouseFields"
              :items="wareHouseList"
              :valueKey="'id'"
              :labelKey="'name'"
              :hiddenKey="['id', 'isSpa']"
              :placeHolder="'Chọn kho hàng'"
              @updateValue="emitWareHouseEvent"
              :defaultValue="warehouseSelected"
              :disabled="actionsType === 1"
              :clearable="false"
            /> -->
          </el-table-column>
          <el-table-column prop="name" :label="t('formDemo.productInformation')" min-width="680" />
          <el-table-column :label="t('reuse.accessory')" width="180">
            <el-input
              class="max-w-[150px]"
              v-model="input"
              :placeholder="`/${t('formDemo.selfImportAccessories')}/`"
            />
          </el-table-column>
          <el-table-column
            prop="quantity"
            :label="`${t('formDemo.amount')}`"
            align="center"
            width="90"
            @change="handleTotal($data)"
          >
            <template #default="data">
              <el-input v-model="data.row.quantity" v-if="data.row.edited" style="width: 100%" />
            </template>
          </el-table-column>
          <el-table-column
            prop="dram"
            :label="`${t('reuse.dram')}`"
            align="center"
            min-width="100"
          />
          <el-table-column
            prop="unitPrice"
            :label="`${t('reuse.unitPrice')}`"
            align="right"
            width="180"
          />

          <el-table-column
            prop="intoMoney"
            :label="`${t('formDemo.intoMoney')}`"
            align="right"
            width="180"
          />
          <el-table-column :label="`${t('formDemo.exportWarehouse')}`" min-width="200">
            <div class="flex w-[100%] items-center">
              <div class="w-[40%]">Còn hàng</div>
              <div class="w-[60%]">
                <el-button text @click="openDialogChooseWarehouse = true">
                  <span class="text-blue-500"> + {{ t('formDemo.chooseWarehouse') }}</span>
                </el-button>
              </div>
            </div>
          </el-table-column>
          <el-table-column
            prop="alreadyPaidForTt"
            :label="`${t('formDemo.alreadyPaidForTt')}`"
            align="center"
            min-width="90"
          >
            <template #default="props">
              <el-checkbox v-model="props.row.alreadyPaidForTt" size="large" />
            </template>
          </el-table-column>
          <el-table-column :label="`${t('formDemo.manipulation')}`" align="center" min-width="90">
            <button class="bg-[#EA4F37] pt-2 pb-2 pl-4 pr-4 text-[#fff]">Xóa</button>
          </el-table-column>
        </el-table>
        <el-table :data="tableData2" class="pl-4 dark:text-[#fff]">
          <el-table-column min-width="250" />
          <el-table-column min-width="680" />
          <el-table-column min-width="180" />
          <el-table-column min-width="90" />
          <el-table-column min-width="100" />
          <el-table-column align="right" min-width="180">
            <div class="dark:text-[#fff]">{{ t('formDemo.intoMoney') }}</div>
            <div class="text-blue-500 cursor-pointer">
              <el-button text @click="openDialogChoosePromotion = true" style="padding: 0">
                <span class="text-blue-500"> + {{ t('formDemo.choosePromotion') }}</span>
              </el-button>
            </div>
            <!-- <div class="text-blue-500 cursor-pointer"> -->
            <el-dropdown trigger="click">
              <span class="el-dropdown-link text-blue-500 cursor-pointer flex items-center">
                {{ t('formDemo.doesNotIncludeVAT') }}
                <Icon icon="material-symbols:keyboard-arrow-down" :size="16" />
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    ><el-radio-group v-model="radioVAT" class="flex-col">
                      <div style="width: 100%">
                        <el-radio class="text-left" style="color: blue" label="1" size="large">{{
                          t('formDemo.VATNotIncluded')
                        }}</el-radio>
                      </div>
                      <div style="width: 100%">
                        <el-radio class="text-left" style="color: blue" label="2" size="large"
                          >VAT 10%</el-radio
                        >
                      </div>
                      <div style="width: 100%">
                        <el-radio class="text-left" style="color: blue" label="3" size="large"
                          >VAT 8%</el-radio
                        >
                      </div>
                      <div style="width: 100%">
                        <el-radio class="text-left" style="color: blue" label="4" size="large"
                          >VAT 5%</el-radio
                        >
                      </div>
                      <div style="width: 100%">
                        <el-radio class="text-left" style="color: blue" label="5" size="large"
                          >VAT 0%</el-radio
                        >
                      </div>
                    </el-radio-group></el-dropdown-item
                  >
                  <el-dropdown-item divided>
                    <div style="width: 100%; text-align: center"> Confirm </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <!-- </div> -->

            <div class="dark:text-[#fff]">{{ t('formDemo.totalAmountReceivable') }}</div>
          </el-table-column>
          <el-table-column align="right" min-width="180">
            <div class="dark:text-[#fff]">190,000,000 đ</div>
            <div class="dark:text-[#fff]">-95,000,000 đ</div>
            <div class="dark:text-[#fff] text-transparent dark:text-transparent">s</div>
            <div class="dark:text-[#fff]">95,000,000 đ</div>
          </el-table-column>
          <el-table-column min-width="200" align="right">
            <div class="text-blue-500 cursor-pointer">FGF343D | Giảm giá 60% ... </div>
            <div class="dark:text-[#fff] text-transparent dark:text-transparent">s</div>
          </el-table-column>
          <el-table-column align="center" min-width="90" />
          <el-table-column min-width="90" />
        </el-table>
        <el-divider content-position="left">{{ t('formDemo.debtTrackingSheet') }}</el-divider>
        <el-table :data="debtTable" border>
          <el-table-column
            prop="dateOfPayment"
            :label="`${t('formDemo.dateOfPayment')}`"
            min-width="150"
            align="center"
          >
            <template #default="data">
              <!-- <el-input v-model="data.row.dateOfPayment" v-if="data.row.edited" /> -->
              <el-date-picker
                v-model="data.row.dateOfPayment"
                type="date"
                placeholder="Pick a day"
                format="DD/MM/YYYY"
              />
              <!-- <div v-else>{{ data.row.lastContent }}</div> -->
            </template>
          </el-table-column>
          <el-table-column prop="content" :label="`${t('reuse.content')}`" min-width="240">
            <template #default="data">
              <el-input v-model="data.row.content" v-if="data.row.edited" style="width: 100%" />
            </template>
          </el-table-column>
          <el-table-column
            :label="`${t('formDemo.receiptOrPayment')}`"
            min-width="120"
            align="right"
          >
            <div class="text-blue-500">+{{ t('formDemo.receiptOrPayment') }}</div>
          </el-table-column>
          <el-table-column :label="`${t('formDemo.paymentOrder')}`" align="right">
            <div class="text-blue-500">+{{ t('formDemo.paymentOrder') }}</div>
          </el-table-column>
          <el-table-column :label="`${t('formDemo.collected')}`" align="left" min-width="150">
            <template #default="data">
              <el-input
                v-model="data.row.collected"
                v-if="data.row.edited"
                style="width: 100%; border: none; outline: none"
              />
            </template>
          </el-table-column>
          <el-table-column :label="`${t('formDemo.spent')}`" min-width="150">
            <template #default="data">
              <el-input
                v-model="data.row.spent"
                v-if="data.row.edited"
                style="width: 100%; border: none; outline: none"
              />
            </template>
          </el-table-column>
          <el-table-column :label="`${t('formDemo.salesDebt')}`" min-width="150">
            <template #default="data">
              <el-input
                v-model="data.row.salesDebt"
                v-if="data.row.edited"
                style="width: 100%; border: none; outline: none"
              />
            </template>
          </el-table-column>
          <el-table-column :label="`${t('formDemo.receivableOrPayable')}`" min-width="120">
            <div>Phải thu</div>
          </el-table-column>
          <el-table-column
            prop="paymentType"
            :label="`${t('formDemo.choosePayment')}`"
            min-width="180"
          >
            <template #default="props">
              <el-select v-model="props.row.paymentType" class="m-2">
                <el-option
                  v-for="(item, index) in choosePayment"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column :label="`${t('formDemo.manipulation')}`" min-width="90" align="center">
            <template #default="scope">
              <button
                class="border-1 bg-[#F78F8F] pt-2 pb-2 pl-4 pr-4 text-[#fff]"
                @click.prevent="deleteRowDebtTable(scope.$index)"
              >
                Xóa
              </button>
            </template>
          </el-table-column>
        </el-table>
        <el-button class="ml-4 mt-4" @click="onAddDebtTableItem"
          >+ {{ t('formDemo.add') }}</el-button
        >
        <div class="w-[100%]">
          <el-divider content-position="left">{{ t('formDemo.statusAndManipulation') }}</el-divider>
        </div>
        <div class="flex gap-4 w-[100%] ml-1 items-center pb-3">
          <label class="w-[9%] text-right">{{ t('formDemo.orderStatus') }}</label>
          <div class="w-[84%] pl-1">
            <el-radio-group v-model="radio1" class="ml-4">
              <el-radio label="1" size="large">{{ t('reuse.closedTheOrder') }}</el-radio>
              <el-radio label="2" size="large">{{ t('reuse.delivery') }}</el-radio>
              <el-radio label="3" size="large">{{ t('reuse.successfulDelivery') }}</el-radio>
              <el-radio label="4" size="large">{{ t('reuse.deliveryFailed') }}</el-radio>
              <el-radio label="5" size="large">{{ t('reuse.paying') }}</el-radio>
              <el-radio label="6" size="large">{{ t('common.doneLabel') }}</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="flex gap-2 pb-8">
          <div class="w-[11%]"></div>
          <div class="w-[89%]"
            ><span class="pl-2 pr-2 bg-[#FFF0D9] text-[#FEB951] leading-5 dark:bg-transparent">{{
              t('formDemo.changedUnitPriceIsWaitingForPriceApproval')
            }}</span>
          </div>
        </div>

        <div class="w-[100%] flex gap-2">
          <div class="w-[12%]"></div>
          <div class="w-[100%] flex ml-1 gap-4">
            <el-button class="min-w-42 min-h-11">{{ t('formDemo.printSalesSlip') }}</el-button>
            <el-button class="min-w-42 min-h-11">{{ t('formDemo.temporaryStorage') }}</el-button>
            <el-button type="primary" class="min-w-42 min-h-11">{{
              t('formDemo.complete')
            }}</el-button>
            <el-button type="danger" class="min-w-42 min-h-11">{{ t('reuse.cancel') }}</el-button>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item :name="collapse[2].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[2].icon" link />
          <span class="text-center text-xl">{{ collapse[2].title }}</span>
        </template>
        <div>
          <el-divider content-position="left">Bảng theo dõi nhập hàng</el-divider>
          <el-table :data="historyTable" border class="pl-4 dark:text-[#fff]">
            <el-table-column :label="`${t('formDemo.productManagementCode')}`" width="150" />
            <el-table-column
              prop="name"
              :label="`${t('formDemo.productInformation')}`"
              width="720"
            />
            <el-table-column :label="`${t('reuse.accessory')}`" width="180">
              <el-input
                :v-model="input"
                :placeholder="`/${t('formDemo.selfImportAccessories')}/`"
              />
            </el-table-column>

            <el-table-column prop="quantity" :label="`${t('formDemo.amount')}`" width="120" />
            <el-table-column prop="dram" :label="`${t('reuse.dram')}`" align="center" width="120" />

            <el-table-column
              :label="`${t('formDemo.invoiceForGoodsEnteringTheWarehouse')}`"
              align="right"
              width="200"
              class="text-blue-500"
            >
              +{{ t('formDemo.invoice') }}
            </el-table-column>
            <el-table-column :label="`${t('formDemo.manipulation')}`" align="center" width="180">
              <template #default="scope">
                <div class="flex gap-4 justify-center">
                  <button class="border-1 bg-[#2C6DDA] pt-2 pb-2 pl-4 pr-4 text-[#fff]">
                    Lưu
                  </button>

                  <button
                    class="border-1 bg-[#F78F8F] pt-2 pb-2 pl-4 pr-4 text-[#fff]"
                    @click.prevent="deleteRow(scope.$index)"
                  >
                    Xóa
                  </button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-button class="ml-4 mt-4" @click="onAddHistoryTableItem"
            >+ {{ t('formDemo.add') }}</el-button
          >
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<style scoped>
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
.el-button--text {
  margin-right: 15px;
}

::v-deep(.el-input) {
  width: auto;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}

::v-deep(.el-dialog__body) {
  padding-top: 0;
}
::v-deep(.el-dialog__header) {
  padding-bottom: 0;
}
::v-deep(.el-table th.el-table__cell) {
  padding: 0 !important;
}
::v-deep(.el-input) {
  width: fit-content;
}
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
::v-deep(.el-dropdown-menu__item) {
  padding: 5px 30px;
}

::v-deep(.el-table .cell) {
  word-break: break-word;
}

::v-deep(.input-width > .el-select .el-input) {
  width: 100%;
}

::v-deep(.fix-full-width > .el-input) {
  width: 100%;
}

::v-deep(.fix-full-width > .el-select .el-input) {
  width: 100% !important;
}
</style>
