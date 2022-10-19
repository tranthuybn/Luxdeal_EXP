<script setup lang="ts">
import { onBeforeMount, reactive, ref, unref } from 'vue'
import {
  getProductsList,
  getCollaboratorsInOrderList,
  getAllCustomer,
  addNewSpaOrders
} from '@/api/Business'
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
  ElForm,
  ElFormItem,
  ElDatePicker,
  FormInstance,
  FormRules
} from 'element-plus'
import type { UploadFile } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { FORM_IMAGES } from '@/utils/format'
import { getCity, getDistrict, getWard } from '@/utils/Get_Address'

import { Collapse } from '../../Components/Type'
import moment from 'moment'

const { t } = useI18n()
const viewIcon = useIcon({ icon: 'uil:search' })
const deleteIcon = useIcon({ icon: 'uil:trash-alt' })

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
const percentIcon = useIcon({ icon: 'material-symbols:percent' })

// Call api danh sách cộng tác viên
// const collaboratorsValue = ref()
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
// const customersValue = ref('')
const optionsCustomerApi = ref<Array<any>>([])
let optionCallCustomerAPi = 0
const callCustomersApi = async () => {
  if (optionCallCustomerAPi == 0) {
    const res = await getAllCustomer({ PageIndex: 1, PageSize: 20 })
    const getCustomerResult = res.data
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
const dialogFormVisible = ref(false)
const valueProvince = ref('')
const valueDistrict = ref('')
const valueCommune = ref('')
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

const dialogAddQuick = ref(false)

let checkValidateForm = ref(false)
const submitForm = async (formEl: FormInstance | undefined, formEl2: FormInstance | undefined) => {
  console.log('ruleForm:', ruleForm)
  if (!formEl || !formEl2) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
  await formEl2.validate((valid, fields) => {
    if (valid) {
      checkValidateForm.value = true
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}
const district = ref()
const ward = ref()
const street = ref()
const cities = ref()
const callApiCity = async () => {
  cities.value = await getCity()
}

const CityChange = async (value) => {
  district.value = await getDistrict(value)
}

const districtChange = async (value) => {
  ward.value = await getWard(value)
}

const postData = () => {
  // let productPayment = reactive<
  //   Array<{
  //     productPropertyId: number | string
  //     quantity: Number
  //     ProductPrice: Number
  //     SoldPrice: Number
  //     warehouseId: Number
  //     isPaid: Boolean
  //     accessory: String
  //   }>
  // >([])
  submitForm(ruleFormRef.value, ruleFormRef2.value)
  if (checkValidateForm.value) {
    const productPayment = JSON.stringify([
      {
        ProductPropertyId: 2,
        Quantity: 1,
        ProductPrice: 10000,
        SoldPrice: 10000,
        WarehouseId: 1,
        IsPaid: true,
        Accessory: 'Accessory1'
      },
      {
        ProductPropertyId: 3,
        Quantity: 1,
        ProductPrice: 90000,
        SoldPrice: 80000,
        WarehouseId: 1,
        IsPaid: true,
        Accessory: 'Accessory2'
      }
    ])
    // if (ListOfProductsForSale.length > 0) {
    // ListOfProductsForSale.forEach((element) => {
    // if (element && Array.isArray(element) && element.length > 0)
    // element.forEach(() => {
    // productPayment.push(
    //   // {
    //   //   ProductPropertyId: 2,
    //   //   Quantity: 1,
    //   //   ProductPrice: 10000,
    //   //   SoldPrice: 10000,
    //   //   WarehouseId: 1,
    //   //   IsPaid: true,
    //   //   Accessory: 'Accessory1'
    //   // },
    //   {
    //     ProductPropertyId: 3,
    //     Quantity: 1,
    //     ProductPrice: 90000,
    //     SoldPrice: 80000,
    //     WarehouseId: 1,
    //     IsPaid: true,
    //     Accessory: 'Accessory2'
    //   }
    // )
    // })
    // })
    // }

    const payload = {
      ServiceType: 1,
      OrderCode: ruleForm.orderCode,
      PromotionCode: 'AA12',
      CollaboratorId: ruleForm.collaborators,
      CollaboratorCommission: ruleForm.collaboratorCommission,
      Description: ruleForm.orderNotes,
      CustomerId: 2,
      DeliveryOptionId: 1,
      ProvinceId: 1,
      DistrictId: 1,
      WardId: 1,
      Address: 'trieu khuc',
      OrderDetail: productPayment,
      CampaignId: 2,
      VAT: 1,
      Status: 1
    }
    const formDataPayLoad = FORM_IMAGES(payload)
    console.log('postData', payload)
    addNewSpaOrders(formDataPayLoad)
  }
}

const ruleFormRef = ref<FormInstance>()
const ruleFormRef2 = ref<FormInstance>()

const ruleForm = reactive({
  orderCode: 'DHB039423',
  collaborators: '',
  dateOfReturn: '',
  collaboratorCommission: '',
  orderNotes: '',
  customersValue: '',
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
  collaboratorCommission: [
    {
      required: true,
      message: 'Please select Activity count',
      trigger: 'blur'
    }
  ],
  dateOfReturn: [
    {
      type: 'date',
      required: true,
      message: 'Please pick a date',
      trigger: 'change'
    }
  ],
  orderNotes: [{ required: true, message: 'Please input order note', trigger: 'blur' }],
  customersValue: [{ required: true, message: 'Please select Customer', trigger: 'change' }],
  delivery: [
    {
      required: true,
      message: 'Please select activity resource',
      trigger: 'change'
    }
  ]
})

const checkDisabled = ref(false)

const enterdetailAddress = ref([])

onBeforeMount(() => {
  callApiCollaborators()
  callCustomersApi()
  callApiCity()
  callApiProductList()
})
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
      <!-- Dialog thêm nhanh khách hàng -->
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
                >{{ t('formDemo.classify') }} <span class="text-red-500">*</span></label
              >
              <div class="w-[80%] flex gap-2">
                <div class="w-[50%] fix-full-width">
                  <el-select v-model="valueClassify" placeholder="Select">
                    <el-option
                      v-for="item in optionsClassify"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>
                <div class="w-[50%] fix-full-width">
                  <el-select v-model="valueSelectCustomer" placeholder="Select">
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
                >{{ t('formDemo.companyName') }} <span class="text-red-500">*</span></label
              >
              <el-input style="width: 100%" :placeholder="`${t('formDemo.enterCompanyName')}`" />
            </div>
            <div class="flex gap-4 pt-4 pb-4">
              <label class="w-[30%] text-right"
                >{{ t('formDemo.taxCode') }} <span class="text-red-500">*</span></label
              >
              <el-input style="width: 100%" :placeholder="`${t('formDemo.enterTaxCode')}`" />
            </div>
            <div class="flex gap-4 pt-4 pb-4">
              <label class="w-[30%] text-right">{{ t('formDemo.representative') }}</label>
              <el-input style="width: 100%" :placeholder="`${t('formDemo.enterRepresentative')}`" />
            </div>
            <div class="flex gap-4 pt-4 pb-4">
              <label class="w-[30%] text-right"
                >{{ t('reuse.phoneNumber') }} <span class="text-red-500">*</span></label
              >
              <el-input style="width: 100%" :placeholder="`${t('formDemo.enterPhoneNumber')}`" />
            </div>
            <div class="flex gap-4 pt-4 pb-4">
              <label class="w-[30%] text-right">{{ t('reuse.email') }}</label>
              <el-input style="width: 100%" :placeholder="`${t('formDemo.enterEmail')}`" />
            </div>
          </div>
        </div>
        <div v-else>
          <el-divider />
          <div>
            <div class="flex gap-4 pt-4 pb-4 items-center">
              <label class="w-[30%] text-right max-w-[162.73px]"
                >{{ t('formDemo.classify') }} <span class="text-red-500">*</span></label
              >
              <div class="w-[80%] flex gap-2">
                <div class="w-[50%] fix-full-width">
                  <el-select v-model="valueClassify" placeholder="Select">
                    <el-option
                      v-for="item in optionsClassify"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>
                <div class="w-[50%] fix-full-width">
                  <el-select v-model="valueSelectCustomer" placeholder="Select">
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
                >{{ t('reuse.customerName') }} <span class="text-red-500">*</span></label
              >
              <el-input style="width: 100%" :placeholder="`${t('formDemo.enterCustomerName')}`" />
            </div>

            <div class="flex gap-4 pt-4 pb-4">
              <label class="w-[30%] text-right"
                >{{ t('reuse.phoneNumber') }} <span class="text-red-500">*</span></label
              >
              <el-input style="width: 100%" :placeholder="`${t('formDemo.enterPhoneNumber')}`" />
            </div>
            <div class="flex gap-4 pt-4 pb-4">
              <label class="w-[30%] text-right">{{ t('reuse.email') }}</label>
              <el-input style="width: 100%" :placeholder="`${t('formDemo.enterEmail')}`" />
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
            <el-button class="w-[150px]" @click.stop.prevent="dialogAddQuick = false">{{
              t('reuse.exit')
            }}</el-button>
          </span>
        </template>
      </el-dialog>
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
              <el-divider content-position="left">{{ t('formDemo.orderInformation') }}</el-divider>
              <el-form-item :label="t('formDemo.orderCode')" prop="orderCode">
                <el-input
                  v-model="ruleForm.orderCode"
                  style="width: 100%"
                  :placeholder="t('formDemo.enterOrderCode')"
                />
              </el-form-item>

              <el-form-item :label="t('formDemo.deliveryDate')" prop="dateOfReturn" required>
                <div class="custom-date">
                  <el-date-picker
                    v-model="ruleForm.dateOfReturn"
                    type="date"
                    format="DD/MM/YYYY"
                    :placeholder="t('formDemo.returnDate')"
                    style="width: 100%"
                  />
                </div>
              </el-form-item>

              <el-form-item :label="t('formDemo.collaborators')" prop="collaborators">
                <div class="flex gap-2">
                  <el-form-item style="flex: 1">
                    <el-select
                      v-model="ruleForm.collaborators"
                      :placeholder="t('formDemo.selectOrEnterTheCollaboratorCode')"
                      filterable
                    >
                      <el-option
                        v-for="(item, index) in optionsCollaborators"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>

                  <el-form-item prop="collaboratorCommission" style="flex: 1">
                    <el-input
                      v-model="ruleForm.collaboratorCommission"
                      type="text"
                      :placeholder="`${t('formDemo.enterDiscount')}`"
                      style="width: 100%"
                      :suffix-icon="percentIcon"
                    />
                  </el-form-item>
                </div>
              </el-form-item>

              <el-form-item :label="t('formDemo.orderNotes')" prop="orderNotes">
                <el-input
                  v-model="ruleForm.orderNotes"
                  style="width: 100%"
                  type="text"
                  :placeholder="`${t('formDemo.addNotes')}`"
                />
              </el-form-item>
            </el-form>
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
                  <strong>+ {{ t('formDemo.addPhotosOrFiles') }}</strong>
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
            <el-form
              ref="ruleFormRef2"
              :model="ruleForm"
              status-icon
              :rules="rules"
              label-width="170px"
              class="demo-ruleForm"
            >
              <div class="flex w-[100%] gap-8">
                <el-divider content-position="left">{{ t('formDemo.customer') }}</el-divider>
                <el-divider content-position="left">{{ t('formDemo.delivery') }}</el-divider>
              </div>
              <div class="flex">
                <div class="flex-1">
                  <div class="flex fix-width">
                    <div class="w-[20%] max-w-[170px] text-right pr-[12px] leading-5">
                      <label>{{ t('formDemo.chooseCustomer') }}</label>
                      <p class="text-[#FECB80] italic">{{ t('formDemo.represent') }}</p>
                    </div>
                    <el-form-item label-width="0" prop="customerName" width="80%">
                      <div class="flex items-center gap-4">
                        <div class="flex w-[100%] gap-2 bg-transparent">
                          <el-select
                            :disabled="checkDisabled"
                            v-model="ruleForm.customersValue"
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
                          <el-button :disabled="checkDisabled" @click="dialogAddQuick = true"
                            >+ {{ t('button.add') }}</el-button
                          >
                        </div>
                      </div>
                    </el-form-item>
                  </div>
                </div>
                <div class="flex-1">
                  <el-form-item label-width="0" prop="delivery">
                    <div class="flex w-[100%] max-h-[42px] gap-2 items-center">
                      <label class="w-[170px] text-[#828387] text-right">{{
                        t('formDemo.chooseShipping')
                      }}</label>
                      <div class="flex w-[80%] gap-4">
                        <el-select
                          :disabled="checkDisabled"
                          v-model="ruleForm.delivery"
                          class="fix-full-width"
                          :placeholder="`${t('formDemo.choseDeliveryMethod')}`"
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
                  </el-form-item>
                </div>
              </div>
              <div class="flex w-[100%] gap-6">
                <div class="w-[50%]">
                  <el-form-item>
                    <p
                      v-if="ruleForm.customersValue !== ''"
                      class="bg-[#F4F8FD] pl-2 text-blue-500 dark:bg-[#3B3B3B]"
                      >{{ t('formDemo.noDebt') }}</p
                    >
                  </el-form-item>
                </div>
                <div class="flex w-[50%] gap-2 items-center" v-if="ruleForm.customersValue !== ''">
                  <p class="w-[150px] ml-2 text-[#828387] text-right">{{
                    t('formDemo.deliveryAddress')
                  }}</p>
                  <p>{{ customerAddress }}</p>
                  <p>
                    <el-button
                      class="hover:bg-transparent; focus:bg-transparent"
                      text
                      @click="dialogFormVisible = true"
                      ><span class="text-blue-500">+ {{ t('formDemo.changeTheAddress') }}</span>
                    </el-button>
                    <el-dialog
                      v-model="dialogFormVisible"
                      width="40%"
                      align-center
                      title="Địa chỉ nhận hàng"
                    >
                      <el-divider />
                      <div>
                        <div class="flex w-[100%] gap-4 items-center">
                          <label class="w-[25%] text-right"
                            >{{ t('formDemo.provinceOrCity') }}
                            <span class="text-red-500">*</span></label
                          >
                          <el-select
                            v-model="valueProvince"
                            style="width: 96%"
                            class="m-2 fix-full-width"
                            placeholder="Select"
                            @change="(data) => CityChange(data)"
                          >
                            <el-option
                              v-for="item in cities"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            />
                          </el-select>
                        </div>
                        <div class="flex w-[100%] gap-4 items-center">
                          <label class="w-[25%] text-right"
                            >{{ t('formDemo.countyOrDistrict') }}
                            <span class="text-red-500">*</span></label
                          >
                          <el-select
                            v-model="valueDistrict"
                            style="width: 96%"
                            class="m-2 fix-full-width"
                            placeholder="Select"
                            @change="(data) => districtChange(data)"
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
                          <label class="w-[25%] text-right"
                            >{{ t('formDemo.wardOrCommune') }}
                            <span class="text-red-500">*</span></label
                          >
                          <el-select
                            v-model="valueCommune"
                            style="width: 96%"
                            class="m-2 fix-full-width"
                            placeholder="Select"
                          >
                            <el-option
                              v-for="item in ward"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            />
                          </el-select>
                        </div>
                        <div class="flex w-[100%] gap-4 items-center">
                          <label class="w-[25%] text-right"
                            >{{ t('formDemo.detailedAddress') }}
                            <span class="text-red-500">*</span></label
                          >
                          <el-select
                            v-model="enterdetailAddress"
                            style="width: 96%"
                            class="m-2 fix-full-width"
                            placeholder="Select"
                            clearable
                            filterable
                            allow-create
                          >
                            <el-option
                              v-for="item in street"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            />
                          </el-select>
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
              <el-form-item
                v-if="ruleForm.customersValue !== ''"
                class="poi-self"
                :label="t('reuse.customerInfo')"
              >
                <div class="flex">
                  <div class="leading-6 mt-2">
                    <div>{{ infoCompany.name }}</div>
                    <div v-if="infoCompany.taxCode !== null">
                      Mã số thuế: {{ infoCompany.taxCode }}</div
                    >
                    <div>{{ infoCompany.phone }}</div>
                    <div>{{ infoCompany.email }}</div>
                  </div>
                </div>
              </el-form-item>
            </el-form>
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
            <el-select v-model="value2" class="m-2">
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
            <el-select v-model="dramValue" class="m-2">
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
            <el-select v-model="value2" class="m-2">
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
            <el-select v-model="dramValue" class="m-2">
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
            <el-select class="m-2" v-model="value" placeholder="Select">
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
            <el-button @click="postData" type="primary" class="min-w-42 min-h-11">{{
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
              <el-select v-model="value" class="m-2">
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
              <el-select v-model="dramValue" class="m-2">
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
  width: 100%;
  height: fit-content;
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

::v-deep(.el-select .el-input) {
  width: 100% !important;
}

::v-deep(.el-button--large) {
  padding: 12px 18px;
}

.fix-label-color > .el-radio {
  color: transparent;
}

::v-deep(.fix-label-color > .el-radio > .el-radio__label) {
  color: transparent;
}

.fix-width > .el-form-item {
  width: 80%;
}

::v-deep(.poi-self > .el-form-item__label) {
  margin-top: 2px;
  align-self: start;
}

::v-deep(.el-input__wrapper) {
  width: 100%;
}
</style>
