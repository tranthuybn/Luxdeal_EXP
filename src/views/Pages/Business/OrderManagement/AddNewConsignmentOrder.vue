<script setup lang="ts">
import { onBeforeMount, reactive, ref, unref } from 'vue'
import { getProductsList, getCollaboratorsInOrderList, getAllCustomer } from '@/api/Business'
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
  ElDialog,
  ElDatePicker
} from 'element-plus'
import type { UploadFile } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { useForm } from '@/hooks/web/useForm'
import { Form } from '@/components/Form'
import { Collapse } from '../../Components/Type'
import moment from 'moment'

const { t } = useI18n()
const viewIcon = useIcon({ icon: 'uil:search' })
const deleteIcon = useIcon({ icon: 'uil:trash-alt' })

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
    field: 'depositTerm',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placehoder: t('formDemo.enterDates')
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

// Call api danh sách cộng tác viên
const collaboratorsValue = ref()
const listCollaborators = ref()
const optionsCollaborators = ref()
let optionCallCollaborators = 0
const callApiCollaborators = async () => {
  if (optionCallCollaborators == 0) {
    const res = await getCollaboratorsInOrderList('')
    listCollaborators.value = res.data
    optionsCollaborators.value = listCollaborators.value.map((product) => ({
      label: product.name,
      value: product.id
    }))
  }
  optionCallCollaborators++
}

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

// Call api danh sách khách hàng
const customersValue = ref('')
const optionsCustomerApi = ref<Array<any>>([])
let optionCallCustomerAPi = 0
const callCustomersApi = async () => {
  if (optionCallCustomerAPi == 0) {
    const res = await getAllCustomer({ PageIndex: 1, PageSize: 20 })
    const getCustomerResult = res.data
    console.log('getCustomerResult', getCustomerResult)
    if (Array.isArray(unref(getCustomerResult)) && getCustomerResult?.length > 0) {
      optionsCustomerApi.value = getCustomerResult.map((product) => ({
        label: product.representative
          ? product.representative + ' | MST ' + product.taxCode
          : product.name + ' | ' + product.phonenumber,
        value: product.code,
        address: product.address,
        isOrganization: product.isOrganization,
        name: product.name,
        taxCode: product.taxCode,
        phone: product.phonenumber,
        email: product.email
      }))
    }
  }
  optionCallCustomerAPi++
}

const valueClassify = ref('individual')
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
  alreadyPaidForTt: boolean
}

let customerAddress = ref('')

let infoCompany = reactive({
  name: '',
  taxCode: '',
  phone: '',
  email: ''
})

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
const deliveryMethod = ref(chooseDelivery[0].value)

const changeAddressCustomer = (data) => {
  if (data) {
    // customerAddress.value = optionsCustomerApi.value.find((e) => e.value == data)?.address ?? ''
    const result = optionsCustomerApi.value.find((e) => e.value == data)
    console.log('result: ', result)
    if (result.isOrganization) {
      customerAddress.value = optionsCustomerApi.value.find((e) => e.value == data)?.address ?? ''
      infoCompany.name = result.name
      infoCompany.taxCode = result.taxCode
      infoCompany.phone = 'Số điện thoại: ' + result.phone
      infoCompany.email = 'Email: ' + result.email
    } else {
      customerAddress.value = optionsCustomerApi.value.find((e) => e.value == data)?.address ?? ''
      infoCompany.name = result.name
      infoCompany.taxCode = result.taxCode
      infoCompany.phone = 'Số điện thoại: ' + result.phone
      infoCompany.email = 'Email: ' + result.email
    }
  } else {
    customerAddress.value = ''
    deliveryMethod.value = ''
  }
  console.log('infoCompany: ', typeof infoCompany.taxCode)
}
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
    title: t('formDemo.consignmentReturnHistoryForCustomers'),
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

const value = ref('')
const value2 = ref('')

const options1 = [
  {
    value: 'SP4330f',
    label: 'SP4335'
  }
]

const valueSelectCustomer = ref(t('formDemo.customer'))
const optionsCustomer = [
  {
    value: 'customer',
    label: t('formDemo.customer')
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
const checked7 = ref(false)
const dateTime = ref('')
const input = ref('')

const tableData = [
  {
    name: 'LV Flourine red X monogam bag da sần - Lage(.5.5 - 40.5)-Gently used / Đỏ; không quai',
    quantity: '2',
    unitPrice: '10,000,000 đ',
    intoMoney: '20,000,000 đ'
  },
  {
    name: 'LV Flourine red X monogam bag da sần - Lage(.5.5 - 40.5)-Gently used / Đỏ; có quai',
    quantity: '2',
    unitPrice: '10,000,000 đ',
    intoMoney: '20,000,000 đ'
  },
  {
    name: 'Vòng cổ ngọc trai kim cương',
    quantity: '1',
    unitPrice: '150,000,000 đ',
    intoMoney: '150,000,000 đ'
  },
  {
    name: '',
    quantity: '',
    unitPrice: '',
    intoMoney: ''
  }
]
const debtTable = ref<Array<tableDataType>>([
  {
    dateOfPayment: moment().format('L').toString(),
    col: 1,
    content: '',
    collected: '',
    spent: '',
    salesDebt: '',
    edited: true,
    paymentType: '',
    alreadyPaidForTt: false
  }
])

const codeProducts = [
  {
    value: '1',
    label: 'SPB34653'
  }
]
const historyTable = [
  {
    name: 'Droplist & chỉ lấy sản phẩm trong danh sách sản phẩm bán của đơn này',
    quantity: '//',
    unitPrice: '//',
    intoMoney: '//'
  }
]
const dramValue = ref('Chiếc')

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

onBeforeMount(() => {
  callApiCollaborators()
  callCustomersApi()

  callApiProductList()
})
const inputCode = ref('DHB039423')
const dialogAddQuick = ref(false)
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
                    v-model="inputCode"
                    class="w-[80%] border-1 w-[100%] outline-none pl-2"
                    type="text"
                    :placeholder="`${t('formDemo.enterOrderCode')}`"
                  />
                </div>
              </template>
              <template #depositTerm>
                <div class="flex items-center w-[100%] gap-4">
                  <div class="w-[15%] ml-2 text-right leading-5">
                    <label class="w-[15%] leading-5" for="">{{ t('formDemo.depositTerm') }}</label>
                    <p class="text-[#FECB80]">{{ t('formDemo.atLeast14Days') }}</p>
                  </div>

                  <div class="flex w-[80%] gap-2">
                    <el-date-picker
                      v-model="dateTime"
                      type="daterange"
                      :start-placeholder="t('formDemo.startDay')"
                      :end-placeholder="t('formDemo.endDay')"
                      format="DD/MM/YYYY"
                    />
                  </div>
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
              <template #customerName>
                <div class="flex items-center w-[100%] gap-4">
                  <label class="w-[16%] text-right" for="">{{ t('formDemo.customerName') }}</label>
                  <div class="flex w-[84%] gap-2">
                    <input class="w-[80%] border-1 outline-none pl-2" type="text" />
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
                <div class="text-right text-[#FECB80]">{{ t('formDemo.lessThanTenProfiles') }}</div>
              </div>
              <div class="pl-4">
                <el-upload
                  action="#"
                  list-type="picture-card"
                  :auto-upload="false"
                  class="relative"
                >
                  <strong>+ Thêm ảnh hoặc file</strong>
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
                          @click="handleDownload(file)"
                        >
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
                  <el-dialog v-model="dialogVisible" class="absolute">
                    <div class="text-[#303133] font-medium dark:text-[#fff]"
                      >+ {{ t('formDemo.addPhotosOrFiles') }}</div
                    >
                  </el-dialog>
                </el-upload>

                <el-dialog v-model="dialogVisible">
                  <img w-full :src="dialogImageUrl" alt="Preview Image" />
                </el-dialog>
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
                    t('reuse.receiveConsignment')
                  }}</el-divider>
                </div>
              </template>
              <template #customerName>
                <div class="flex gap-4">
                  <div class="flex w-[50%]">
                    <div class="flex w-[100%] gap-4 items-center">
                      <label class="w-[15%] text-right ml-2 leading-5">{{
                        t('formDemo.chooseACustomer')
                      }}</label>

                      <div class="flex items-center w-[80%] max-w-[698.39px] gap-4">
                        <div class="flex w-[100%] gap-2 bg-transparent">
                          <el-select
                            v-model="customersValue"
                            filterable
                            :clearable="true"
                            placeholder="Select"
                            @change="changeAddressCustomer"
                          >
                            <el-option
                              v-for="item in optionsCustomerApi"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            />
                          </el-select>
                          <el-button @click="dialogAddQuick = true"
                            >+ {{ t('button.add') }}</el-button
                          >
                        </div>
                      </div>

                      <el-dialog
                        v-model="dialogAddQuick"
                        width="40%"
                        align-center
                        :title="`${t('formDemo.QuicklyAddCustomers')}`"
                      >
                        <div v-if="valueClassify == 'company'">
                          <el-divider />
                          <div>
                            <div class="flex gap-4 pt-4 pb-4 items-center">
                              <label class="w-[30%] text-right max-w-[162.73px]"
                                >{{ t('formDemo.classify') }}
                                <span class="text-red-500">*</span></label
                              >
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
                              <label class="w-[30%] text-right"
                                >{{ t('formDemo.companyName') }}
                                <span class="text-red-500">*</span></label
                              >
                              <el-input
                                style="width: 100%"
                                :placeholder="`${t('formDemo.enterCompanyName')}`"
                              />
                            </div>
                            <div class="flex gap-4 pt-4 pb-4">
                              <label class="w-[30%] text-right"
                                >{{ t('formDemo.taxCode') }}
                                <span class="text-red-500">*</span></label
                              >
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
                              <label class="w-[30%] text-right"
                                >{{ t('reuse.phoneNumber') }}
                                <span class="text-red-500">*</span></label
                              >
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
                        </div>
                        <div v-else>
                          <el-divider />
                          <div>
                            <div class="flex gap-4 pt-4 pb-4 items-center">
                              <label class="w-[30%] text-right max-w-[162.73px]"
                                >{{ t('formDemo.classify') }}
                                <span class="text-red-500">*</span></label
                              >
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
                              <label class="w-[30%] text-right"
                                >{{ t('reuse.customerName') }}
                                <span class="text-red-500">*</span></label
                              >
                              <el-input
                                style="width: 100%"
                                :placeholder="`${t('formDemo.enterCustomerName')}`"
                              />
                            </div>

                            <div class="flex gap-4 pt-4 pb-4">
                              <label class="w-[30%] text-right"
                                >{{ t('reuse.phoneNumber') }}
                                <span class="text-red-500">*</span></label
                              >
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
                        v-model="deliveryMethod"
                        :placeholder="`${t('formDemo.choseDeliveryMethod')}`"
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
                </div>
              </template>
              <template #companyInformation>
                <!-- <div class="flex gap-4 w-[100%]">
                  <label class="w-[16%] text-right">{{ t('formDemo.customerName') }}</label>
                  <div class="leading-6 mt-2">
                    <div>Nguyễn Phương Linh</div>
                    <div>Số điện thoại: 094345355</div>
                  </div>
                </div> -->
                <div class="flex gap-4 w-[100%]">
                  <label class="w-[16%] text-right">{{ t('formDemo.companyInformation') }}</label>
                  <div class="leading-6 mt-2">
                    <div>Công ty cổ phần Bắc Á</div>
                    <div>Mã số thuế: 0994563243</div>
                    <div>Địa chỉ: 79 Khúc Thừa Dụ, phường Dịch Vọng, quận Cầu Giấy, Hà Nội</div>
                    <div>Email: info@baca.com</div>
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
        <el-divider content-position="left">{{
          t('formDemo.listOfConsignmentProducts')
        }}</el-divider>
        <el-table :data="tableData" border class="pl-4 dark:text-[#fff]">
          <el-table-column :label="`${t('formDemo.productManagementCode')}`" width="150">
            <el-select v-model="value2" class="m-2" size="large">
              <el-option
                v-for="item in codeProducts"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-table-column>
          <el-table-column prop="name" :label="`${t('reuse.productInformation')}`" width="680" />
          <el-table-column :label="`${t('reuse.accessory')}`" width="180">
            <el-input v-model="input" :placeholder="`/${t('formDemo.selfImportAccessories')}/`" />
          </el-table-column>
          <el-table-column
            prop="quantity"
            :label="`${t('reuse.depositNumber')}`"
            align="center"
            width="90"
          />
          <el-table-column :label="`${t('reuse.quantitySold')}`" align="center" width="90" />
          <el-table-column
            :label="`${t('reuse.numberOfTimesRented')}`"
            align="center"
            width="100"
          />
          <el-table-column :label="`${t('reuse.numberOfTimesSpa')}`" align="center" width="100" />
          <el-table-column :label="`${t('reuse.currentlyLeased')}`" align="center" width="100" />
          <el-table-column :label="`${t('reuse.returnedNumber')}`" align="center" width="100" />
          <el-table-column :label="`${t('reuse.dram')}`" align="center" width="150">
            <el-select v-model="dramValue" class="m-2" size="large">
              <el-option
                v-for="item in dram"
                :key="item.dramValue"
                :label="item.label"
                :value="item.dramValue"
              />
            </el-select>
          </el-table-column>
          <el-table-column :label="`${t('reuse.businessManagement')}`" width="200">
            <div class="flex w-[100%]">
              <div class="flex-1">{{ t('reuse.sell') }} {{ t('workplace.lease') }}</div>
              <div class="flex-1 text-right text-blue-500 cursor-pointer"
                >+ {{ t('router.business') }}</div
              >
            </div>
          </el-table-column>

          <el-table-column :label="t('reuse.importWarehouse')" width="200">
            <div class="flex w-[100%]">
              <div class="flex-1">{{ t('reuse.stocking') }}</div>
              <div class="flex-1 text-right text-blue-500 cursor-pointer"
                >+ {{ t('formDemo.chooseWarehouse') }}</div
              >
            </div>
          </el-table-column>

          <el-table-column :label="`${t('formDemo.manipulation')}`" align="center" width="90">
            <el-button type="danger">{{ t('reuse.delete') }}</el-button>
          </el-table-column>
        </el-table>
        <el-divider content-position="left">{{ t('formDemo.serviceTrackingTable') }}</el-divider>
        <el-table :data="tableData" border class="pl-4 dark:text-[#fff]">
          <el-table-column :label="`${t('formDemo.productManagementCode')}`" width="150">
            <el-select v-model="value2" class="m-2" size="large">
              <el-option
                v-for="item in codeProducts"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-table-column>
          <el-table-column prop="name" :label="`${t('reuse.productInformation')}`" width="680" />
          <el-table-column :label="`${t('reuse.accessory')}`" width="200">
            <el-input v-model="input" :placeholder="`lấy dữ liệu từ đơn hàng`" />
          </el-table-column>
          <el-table-column
            prop="quantity"
            :label="`${t('reuse.quantity')}`"
            align="center"
            width="90"
          />
          <el-table-column :label="`${t('reuse.dram')}`" align="center" width="150">
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
            prop="unitPrice"
            :label="`${t('formDemo.orderValue')}`"
            align="center"
            width="90"
          />
          <el-table-column :label="`${t('formDemo.negotiablePrice')}`" align="center" width="100" />
          <el-table-column :label="`${t('formDemo.depositFee')}`" width="200">
            <div class="flex w-[100%]">
              <div class="flex-1">20%</div>
              <div class="flex-1 text-right text-blue-500 cursor-pointer"
                >+ {{ t('reuse.fix') }}</div
              >
            </div>
          </el-table-column>
          <el-table-column :label="`${t('formDemo.payableFees')}`" align="center" width="100" />
          <el-table-column :label="`${t('reuse.singleType')}`" align="center" width="100" />
          <el-table-column :label="`${t('reuse.orderCode')}`" width="100" />

          <el-table-column :label="`${t('formDemo.manipulation')}`" align="center" width="90">
            <el-button type="danger">{{ t('reuse.delete') }}</el-button>
          </el-table-column>
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
              <el-date-picker
                v-model="data.row.dateOfPayment"
                type="date"
                placeholder="Pick a day"
                format="DD/MM/YYYY"
              />
            </template>
          </el-table-column>
          <el-table-column prop="col" :label="`${t('reuse.content')}`" width="240" />
          <el-table-column :label="`${t('formDemo.receiptOrPayment')}`">
            <div class="text-blue-500">+{{ t('formDemo.receiptOrPayment') }}</div>
          </el-table-column>
          <el-table-column :label="`${t('formDemo.paymentOrder')}`">
            <div class="text-blue-500">+{{ t('formDemo.paymentOrder') }}</div>
          </el-table-column>
          <el-table-column :label="`${t('formDemo.collected')}`">
            <div>+ 95,000,000 đ</div>
          </el-table-column>
          <el-table-column :label="`${t('formDemo.spent')}`" />
          <el-table-column :label="`${t('reuse.outstandingDebt')}`">
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
          <el-table-column :label="`${t('formDemo.alreadyPaidForTt')}`" width="90" align="center">
            <el-checkbox v-model="checked1" label="" size="large" />
          </el-table-column>
          <el-table-column :label="`${t('formDemo.manipulation')}`" width="90" align="center">
            <el-button type="danger">{{ t('reuse.delete') }}</el-button>
          </el-table-column>
        </el-table>
        <button class="bg-none border-1 pt-2 pb-2 pl-4 pr-4 mt-2 text-[#cccccc]">+ Thêm</button>
        <div class="w-[100%]">
          <el-divider content-position="left">{{ t('formDemo.statusAndManipulation') }}</el-divider>
        </div>
        <div class="flex gap-4 w-[100%] ml-1 items-center pb-3">
          <label class="w-[9%] text-right">{{ t('formDemo.orderStatus') }}</label>
          <div class="w-[84%] pl-1">
            <el-checkbox v-model="checked2" :label="`${t('reuse.closedTheOrder')}`" size="large" />
            <el-checkbox v-model="checked3" :label="`${t('formDemo.depositing')}`" size="large" />
            <el-checkbox
              v-model="checked4"
              :label="`${t('formDemo.renewingConsignment')}`"
              size="large"
            />

            <el-checkbox v-model="checked7" :label="`${t('common.doneLabel')}`" size="large" />
          </div>
        </div>
        <div class="w-[100%] flex gap-4">
          <div class="ml-[10%] w-[100%] flex ml-1 gap-4">
            <el-button class="min-w-42 min-h-11">{{ t('formDemo.printSalesSlip') }}</el-button>
            <el-button class="min-w-42 min-h-11">{{ t('formDemo.temporaryStorage') }}</el-button>
            <el-button type="primary" class="min-w-42 min-h-11">{{
              t('formDemo.complete')
            }}</el-button>
            <el-button type="danger" class="min-w-42 min-h-11">{{
              t('button.cancelOrder')
            }}</el-button>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item :name="collapse[2].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[2].icon" link />
          <span class="text-center text-xl">{{ collapse[2].title }}</span>
        </template>
        <div>
          <el-divider content-position="left">{{ t('formDemo.importTrackingTable') }}</el-divider>
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
                :v-model="input"
                :placeholder="`/${t('formDemo.selfImportAccessories')}/`"
              />
            </el-table-column>

            <el-table-column prop="quantity" :label="`${t('formDemo.amount')}`" width="120" />
            <el-table-column :label="`${t('reuse.dram')}`" align="center" width="150">
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
              :label="`${t('formDemo.deliveryNotes')}`"
              align="right"
              width="200"
              class="text-blue-500"
            >
              <div class="flex w-[100%]">
                <div class="flex-1 text-blue-500">XJDFAW43</div>
                <div class="flex-1 text-right text-blue-500 cursor-pointer"
                  >+ {{ t('reuse.fix') }}</div
                >
              </div>
            </el-table-column>
            <el-table-column :label="`${t('formDemo.manipulation')}`" align="center" width="180">
              <div class="flex gap-4">
                <el-button type="primary">{{ t('reuse.save') }}</el-button>
                <el-button type="danger">{{ t('reuse.delete') }}</el-button>
              </div>
            </el-table-column>
          </el-table>
          <button class="bg-none border-1 pt-2 pb-2 pl-4 pr-4 mt-2 text-[#cccccc]">+ Thêm</button>
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
::v-deep(.el-table .cell) {
  word-break: break-word;
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
