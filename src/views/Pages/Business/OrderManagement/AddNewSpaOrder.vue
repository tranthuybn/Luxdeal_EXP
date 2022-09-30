<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
// import { getProductsList, getSpaList, getListCollaborator } from '@/api/Business'

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
  ElDialog,
  ElIcon,
  ElDatePicker,
  ElDropdown,
  ElDropdownItem,
  ElRadio,
  ElRadioGroup,
  ElDropdownMenu,
  ElForm
} from 'element-plus'
import type { UploadFile } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { useForm } from '@/hooks/web/useForm'
import { Form } from '@/components/Form'
import { Collapse } from '../../Components/Type'
import moment from 'moment'
const { t } = useI18n()

interface User {
  date: string
  name: string
  address: string
}

const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<User[]>([])
const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val
}

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
    field: 'deliveryDate',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placehoder: 'nhập ngày'
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

const tableDataSettingSpa = [
  {
    name: 'Kiểm tra',
    service: '00'
  },
  {
    name: 'Vệ sinh',
    service: '50,000'
  },
  {
    name: 'Sơn',
    service: '500,000'
  },
  {
    name: 'Đánh bóng',
    service: '500,000'
  }
]

const deleteRowDebtTable = (index: number) => {
  debtTable.value.splice(index, 1)
}

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

const tableFormSelectWarehouse = [
  {
    name: 'Kho Hà Nội',
    inventory: 20,
    unit: 'Chiếc'
  },
  {
    name: 'Kho Hồ Chí Minh',
    inventory: 10,
    unit: 'Cái'
  }
]

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
    component: 'Input',
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

//api list san pham
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
// api Spa

const listServicesSpa = ref()
const optionsApiServicesSpa = ref()
let optionCallAPiServicesSpa = 0
const callApiServicesSpa = async () => {
  if (optionCallAPi == 0) {
    const res = await getSpaList('')
    listProducts.value = res.data
    optionsApi.value = listProducts.value.map((product) => ({
      label: product.id,
      value: product.id,
      name: product.name
    }))
    optionCallAPi++
  }
}

//call api cong tac vien
const collaboratorsValue = ref()
const listCollaborators = ref()
const optionsCollaborators = ref()
let optionCallAPiCollaborator = 0

const callApiCollaborator = async () => {
  if (optionCallAPiCollaborator == 0) {
    const res = await getListCollaborator({ Keyword: 0 })
    listCollaborators.value = res.data
    optionsCollaborators.value = listCollaborators.value.map((product) => ({
      label: product.name,
      value: product.name
    }))
    optionCallAPiCollaborator++
  }
}

const selectItem = () => {
  console.log(name)
}

const { register } = useForm()

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)
const customersValue = ref('')

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
    name: 'consignmentReturnHistoryForCustomers',
    title: t('formDemo.spaDeliveryHistory'),
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

const dialogAddQuick = ref(false)
const dialogFormSettingServiceSpa = ref(false)
const dialogFormSelectWarehouse = ref(false)
const openDialogChoosePromotion = ref(false)
const checkDiscount = ref(false)
const input = ref('')

const form = reactive({
  name: '',
  typea: '',
  phoneNumber: '',
  email: ''
})

const value = ref('')
const value2 = ref(t('formDemo.receiveGoodsAtCustomerAddress'))

const options1 = [
  {
    value: 'cashPayment',
    label: t('formDemo.cashPayment')
  },
  {
    value: 'cardPayment',
    label: t('formDemo.cardPayment')
  }
]

const options2 = [
  {
    value: 'deliveryAtTheCounter',
    label: 'Nhận hàng  tại quầy'
  },
  {
    value: 'deliveryAtCustomerAddress',
    label: 'Nhận hàng ký tại địa chỉ khách hàng'
  }
]

const dram = [
  {
    dramValue: 'psc',
    label: t('formDemo.psc')
  }
]
const checked1 = ref(true)
const checked2 = ref(false)
const checked3 = ref(false)
const checked4 = ref(false)
const checked5 = ref(false)
const inputPhuKien = ref('')
const radioVAT = ref(3)

const tableData2 = [
  {
    name: '',
    quantity: '',
    unitPrice: '',
    intoMoney: ''
  }
]

// const debtTable = [
//   {
//     dateOfPayment: t('formDemo.dateOfPayment'),
//     col: 'Thanh toán tiền mua hàng',
//     date: '02/07/2022',
//     quantity: '',
//     unitPrice: '',
//     intoMoney: ''
//   }
// ]

const historyTable = [
  {
    name: 'Droplist & chỉ lấy sản phẩm trong danh sách sản phẩm bán của đơn này',
    quantity: '//',
    unitPrice: '//',
    intoMoney: '//'
  }
]
const dramValue = ref('Chiếc')
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
              <template #orderCode>
                <div class="flex items-center w-[100%] gap-4">
                  <label class="w-[16%] text-right" for="">{{ t('formDemo.orderCode') }}</label>
                  <input
                    class="w-[80%] border-1 w-[100%] outline-none pl-2"
                    type="text"
                    :placeholder="`${t('formDemo.enterOrderCode')}`"
                  />
                </div>
              </template>
              <template #deliveryDate>
                <div class="flex items-center w-[100%] gap-4">
                  <label class="w-[16%] leading-5 text-right" for="">
                    {{ t('formDemo.deliveryDate') }}
                  </label>

                  <input
                    class="w-[80%] border-1 outline-none pl-2"
                    type="text"
                    :placeholder="t('formDemo.deliveryDate')"
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
                        @focus="callApiCollaborator()"
                      >
                        <el-option
                          v-for="(item, index) in optionsCollaborators"
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
                  <label class="w-[16%] text-right leading-5" for="">{{
                    t('formDemo.orderNotes')
                  }}</label>
                  <input
                    class="w-[80%] border-1 outline-none pl-2"
                    type="text"
                    :placeholder="`${t('formDemo.addNotes')}`"
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
              <div class="pl-5">
                <div class="text-right">{{ t('formDemo.addPhotosOrFiles') }}</div>
                <div class="text-right text-[#FECB80]">{{ t('formDemo.lessThanTenProfiles') }}</div>
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
                  <el-divider content-position="left">{{
                    t('formDemo.methodOfDeliverySpa')
                  }}</el-divider>
                </div>
              </template>
              <template #customerName>
                <div class="flex gap-4">
                  <div class="flex w-[50%]">
                    <div class="flex w-[100%] gap-4">
                      <label class="w-[24%] text-right">{{ t('formDemo.chooseACustomer') }}</label>
                      <el-select
                        v-model="customersValue"
                        :placeholder="t('formDemo.chooseACustomer')"
                        filterable
                        size="large"
                      >
                        <el-option
                          v-for="(item, index) in optionsApi"
                          :key="index"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>

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
                            <label class="w-[30%] text-right">{{ t('reuse.phoneNumber') }}</label>
                            <el-input
                              style="width: 100%"
                              :placeholder="`${t('formDemo.enterPhoneNumber')}`"
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
                        :placeholder="t('formDemo.receiveGoodsAtCustomerAddress')"
                        size="large"
                      >
                        <el-option
                          v-for="i in options2"
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
                    <p class="text-blue-500 cursor-pointer"
                      >+ {{ t('formDemo.changeTheAddress') }}</p
                    >
                  </div>
                </div>
              </template>
              <template #companyInformation>
                <div class="flex gap-4 w-[100%]">
                  <label class="w-[16%] text-right">{{ t('formDemo.customerName') }}</label>
                  <div class="leading-6 mt-2">
                    <div>Nguyễn Phương Linh</div>
                    <div>Số điện thoại: 094345355</div>
                    <div>Email: info@gmail.ccom</div>
                  </div>
                </div>
              </template>
            </Form>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item :name="collapse[1].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[1].icon" link />
          <span class="text-center text-xl">{{ collapse[1].title }}</span>
        </template>
        <el-divider content-position="left">{{ t('formDemo.listProductSpa') }}</el-divider>
        <el-table :data="tableData2" border class="pl-4 dark:text-[#fff]">
          <el-table-column prop="id" :label="`${t('formDemo.productManagementCode')}`" width="170">
            <template #default="props">
              <el-select
                v-model="props.row.id"
                filterable
                class="m-2"
                size="large"
                @focus="callApi()"
                @change="selectItem()"
              >
                <el-option
                  v-for="(item, index) in optionsApi"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="name" :label="`${t('reuse.productInformation')}`" width="650">
            <template #default="scope">
              <ElButton>
                <span>{{ scope.row.name }}</span>
                <ElIcon class="el-icon--right" />
              </ElButton>
            </template>
          </el-table-column>
          <el-table-column :label="`${t('reuse.accessory')}`" width="180">
            <el-input
              v-model="inputPhuKien"
              :placeholder="`/${t('formDemo.selfImportAccessories')}/`"
            />
          </el-table-column>
          <el-table-column :label="t('router.ServiceLibrarySpaService')" width="230">
            <div class="flex w-[100%]">
              <div class="flex-1">Kiểm tra</div>
              <div class="flex-1 text-right text-blue-500 cursor-pointer">
                <el-button text border @click="dialogFormSettingServiceSpa = true"
                  >+ {{ t('reuse.selectService') }}</el-button
                ></div
              >
            </div>
          </el-table-column>

          <el-table-column
            prop="quantity"
            :label="t('reuse.spaNumberInput')"
            align="center"
            width="90"
          />
          <el-table-column :label="t('formDemo.testOrSpa')" align="center" width="90" />
          <el-table-column :label="t('reuse.returnedNumber')" align="center" width="100" />

          <el-table-column :label="`${t('reuse.dram')}`" align="center" width="100">
            <el-select v-model="dramValue" class="m-2" size="large">
              <el-option
                v-for="item in dram"
                :key="item.dramValue"
                :label="item.label"
                :value="item.dramValue"
              />
            </el-select>
          </el-table-column>

          <el-table-column :label="t('formDemo.spaFeePayment')" align="center" width="150" />

          <el-table-column :label="`Kho nhập`" width="200">
            <div class="flex w-[100%]">
              <div class="flex-1">{{ t('reuse.stocking') }}</div>
              <div class="flex-1 text-right text-blue-500 cursor-pointer">
                <el-button text border @click="dialogFormSelectWarehouse = true"
                  >+ {{ t('formDemo.chooseWarehouse') }}</el-button
                >
              </div>
            </div>
          </el-table-column>

          <el-table-column :label="`${t('formDemo.manipulation')}`" align="center" width="90">
            <button class="bg-[#EA4F37] pt-2 pb-2 pl-4 pr-4 text-[#fff]">{{
              t('reuse.delete')
            }}</button>
          </el-table-column>
        </el-table>

        <el-table :data="tableData2" class="pl-4 dark:text-[#fff]">
          <el-table-column width="150" />
          <el-table-column width="680" />
          <el-table-column width="180" />
          <el-table-column width="90" />
          <el-table-column width="100" />
          <el-table-column align="right" width="180">
            <div class="dark:text-[#fff]">{{ t('formDemo.spaFeePayment') }}</div>
            <div class="text-blue-500 cursor-pointer">
              <el-button text @click="openDialogChoosePromotion = true" style="padding: 0">
                <span class="text-blue-500"> + {{ t('formDemo.choosePromotion') }}</span>
              </el-button>
            </div>
            <div class="text-blue-500 cursor-pointer">
              <el-dropdown trigger="click">
                <span class="demonstration"
                  >{{ t('formDemo.doesNotIncludeVAT') }}
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
                      </el-radio-group>
                    </el-dropdown-item>
                    <el-dropdown-item divided>
                      <div style="width: 100%; text-align: center"> Confirm </div>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <div class="dark:text-[#fff]">{{ t('formDemo.total') }}</div>
          </el-table-column>
          <el-table-column align="right" width="180">
            <div class="dark:text-[#fff]">1,200,000 đ</div>
            <div class="dark:text-[#fff] text-transparent dark:text-transparent">s</div>
            <div class="dark:text-[#fff]">0 đ</div>
            <div class="dark:text-[#fff]">1,200,000 đ</div>
          </el-table-column>
          <el-table-column width="200" align="right">
            <div class="dark:text-[#fff] text-transparent dark:text-transparent">s</div>
            <div class="text-blue-500 cursor-pointer hidden">FGF343D | Giảm giá 60% ... </div>
          </el-table-column>
          <el-table-column align="center" width="90" />
          <el-table-column width="90" />
        </el-table>

        <el-divider content-position="left">{{ t('formDemo.debtTrackingSheet') }}</el-divider>
        <el-table :data="debtTable" border>
          <el-table-column
            prop="dateOfPayment"
            :label="t('formDemo.dateOfPayment')"
            width="150"
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
          <el-table-column prop="content" :label="t('reuse.content')" min-width="240">
            <template #default="data">
              <el-input v-model="data.row.content" v-if="data.row.edited" style="width: 100%" />
            </template>
          </el-table-column>
          <el-table-column :label="t('formDemo.receiptOrPayment')" min-width="120" align="right">
            <div class="text-blue-500">+{{ t('formDemo.receiptOrPayment') }}</div>
          </el-table-column>
          <el-table-column :label="`${t('formDemo.paymentOrder')}`" align="right">
            <div class="text-blue-500">+{{ t('formDemo.paymentOrder') }}</div>
          </el-table-column>
          <el-table-column :label="`${t('formDemo.collected')}`" lign="left" min-width="150">
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
          <el-table-column :label="t('formDemo.spaFeeDebt')">
            <div>0 đ</div>
          </el-table-column>
          <el-table-column :label="`${t('formDemo.receivableOrPayable')}`" width="120">
            <div>Phải thu</div>
          </el-table-column>
          <el-table-column :label="`${t('formDemo.choosePayment')}`">
            <el-select class="m-2" v-model="value" placeholder="Select" size="large">
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-table-column>
          <el-table-column :label="t('formDemo.alreadyPaidForTt')" width="90" align="center">
            <el-checkbox v-model="checked1" label="" size="large" />
          </el-table-column>
          <el-table-column :label="`${t('formDemo.manipulation')}`" width="90" align="center">
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
            <el-checkbox v-model="checked2" :label="`${t('reuse.closedTheOrder')}`" size="large" />
            <el-checkbox v-model="checked3" :label="`Đang Spa`" size="large" />
            <el-checkbox v-model="checked4" :label="t('formDemo.renewingTheSpa')" size="large" />
            <el-checkbox v-model="checked5" :label="`${t('common.doneLabel')}`" size="large" />
          </div>
        </div>
        <div class="w-[100%] flex gap-4">
          <div class="ml-[10%] w-[100%] flex ml-1 gap-4">
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
          <el-divider content-position="left">Bảng theo dõi xuất trả hàng Spa</el-divider>
          <el-table :data="historyTable" border class="pl-4 dark:text-[#fff]">
            <el-table-column :label="`${t('formDemo.productManagementCode')}`" width="150">
              <el-select v-model="value" class="m-2" size="large">
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-table-column>
            <el-table-column prop="name" :label="`${t('reuse.productInformation')}`" width="720" />
            <el-table-column :label="`${t('reuse.accessory')}`" width="180">
              <el-input
                :v-model="inputPhuKien"
                :placeholder="`/${t('formDemo.selfImportAccessories')}/`"
              />
            </el-table-column>

            <el-table-column prop="quantity" :label="`${t('formDemo.amount')}`" width="120" />
            <el-table-column :label="`${t('reuse.dram')}`" align="center" width="120">
              <el-select v-model="dramValue" class="m-2" size="large">
                <el-option
                  v-for="item in dram"
                  :key="item.dramValue"
                  :label="item.label"
                  :value="item.dramValue"
                />
              </el-select>
            </el-table-column>

            <el-table-column
              :label="`Phiếu xuất trả hàng`"
              align="right"
              width="200"
              class="text-blue-500"
            >
              + Sửa
            </el-table-column>
            <el-table-column :label="`${t('formDemo.manipulation')}`" align="center" width="180">
              <div class="flex gap-4">
                <button class="flex-1 bg-[#EA4F37] pt-2 pb-2 pl-4 pr-4 text-[#fff]">{{
                  t('reuse.delete')
                }}</button>
              </div>
            </el-table-column>
          </el-table>
          <button class="bg-none border-1 pt-2 pb-2 pl-4 pr-4 mt-2 text-[#cccccc]">+ Thêm</button>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
  <!-- dialog2 -->
  <el-dialog
    v-model="dialogFormSettingServiceSpa"
    title="Cài đặt phí dịch vụ Spa"
    width="30%"
    align-center
  >
    <el-form :model="form">
      <el-table
        ref="multipleTableRef"
        border
        :data="tableDataSettingSpa"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column property="name" label="Thông tin dịch vụ Spa" width="320" />
        <el-table-column property="service" label="Bảng giá" width="auto" show-overflow-tooltip />
      </el-table>
    </el-form>
    <div class="flex justify-between px-3 mt-2">
      <strong>Thành tiền phí dịch vụ Spa</strong>
      <p class="price font-medium">50000</p>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="dialogFormSettingServiceSpa = false">{{
          t('reuse.save')
        }}</el-button>
        <el-button @click="dialogFormSettingServiceSpa = false">{{ t('reuse.exit') }}</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- end dialog 2 -->

  <!-- dialog3 -->
  <el-dialog v-model="dialogFormSelectWarehouse" title="Thông tin tồn kho" width="30%" align-center>
    <el-form :model="form">
      <el-table
        ref="multipleTableRef"
        border
        :data="tableFormSelectWarehouse"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column property="name" label="Thông tin kho" width="320" />
        <el-table-column label="Tồn kho" width="auto" show-overflow-tooltip>
          <div class="flex justify-between">
            <el-table-column property="inventory" />
            <el-table-column property="unit" />
          </div>
        </el-table-column>
      </el-table>
    </el-form>
    <div class="text-right mr-2">
      <p class="price font-medium">50000</p>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="dialogFormSelectWarehouse = false">{{
          t('reuse.save')
        }}</el-button>
        <el-button @click="dialogFormSelectWarehouse = false">{{ t('reuse.exit') }}</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- end dialog 3 -->

  <!-- open dialog  -->
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
        <el-input style="width: 100%" v-model="input" :placeholder="t('formDemo.enterPromoCode')" />
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
        <el-button class="w-[150px]" type="primary" @click="openDialogChoosePromotion = false"
          >{{ t('reuse.save') }}
        </el-button>
        <el-button class="w-[150px]" @click="openDialogChoosePromotion = false">{{
          t('reuse.exit')
        }}</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- end dialog -->
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

::v-deep(.el-table .cell) {
  word-break: break-word;
}

::v-deep(.el-table td.el-table__cell div) {
  width: 100%;
}

.el-button--text {
  margin-right: 15px;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
