<script setup lang="ts">
import { reactive, ref, onBeforeMount, unref } from 'vue'
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
  ElInput,
  ElRadioGroup,
  ElRadio,
  ElCheckbox,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElDatePicker,
  ElDialog,
  ElForm,
  ElFormItem
} from 'element-plus'
import type { UploadFile } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { Collapse } from '../../Components/Type'
import moment from 'moment'
import { FORM_IMAGES } from '@/utils/format'
import { getCity, getDistrict, getWard } from '@/utils/Get_Address'
import {
  getCollaboratorsInOrderList,
  getAllCustomer,
  getPromotionsList,
  getProductsList,
  addNewOrderList
} from '@/api/Business'
import MultipleOptionsBox from '@/components/MultipleOptionsBox.vue'
import type { FormInstance, FormRules } from 'element-plus'

const { t } = useI18n()

const ruleFormRef = ref<FormInstance>()
const ruleFormRef2 = ref<FormInstance>()
const ruleForm = reactive({
  orderCode: 'DHB039423',
  leaseTerm: t('reuse.byMonth'),
  rentalPeriod: '',
  rentalPaymentPeriod: t('reuse.byMonth'),
  collaborators: '',
  discount: '',
  orderNotes: '',
  customerName: '',
  delivery: ''
})

const rules = reactive<FormRules>({
  orderCode: [{ required: true, message: 'Please input order code', trigger: 'blur' }],
  leaseTerm: [
    {
      required: true,
      message: 'Please select Activity zone',
      trigger: 'change'
    }
  ],
  // rentalPeriod: [
  //   {
  //     type: 'daterange',
  //     required: true,
  //     message: 'Please pick a date',
  //     trigger: 'change'
  //   }
  // ],
  rentalPaymentPeriod: [
    {
      required: true,
      message: 'Please select Activity zone',
      trigger: 'change'
    }
  ],
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
  orderNotes: [{ required: true, message: 'Please input order note', trigger: 'blur' }],
  customerName: [{ required: true, message: 'Please select Customer', trigger: 'change' }],
  delivery: [
    {
      required: true,
      message: 'Please select activity resource',
      trigger: 'change'
    }
  ]
})

let checkValidate = ref(false)

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
      console.log('submit!')
      checkValidate.value = true
    } else {
      console.log('error submit!', fields)
    }
  })
}

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
    name: 'rentalImportReturnHistory',
    title: t('formDemo.rentalImportReturnHistory'),
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

const deliveryMethod = ref(chooseDelivery[0].value)

const codeProducts = [
  {
    value: '1',
    label: 'SPB34653'
  }
]

const dram = [
  {
    dramValue: 'psc',
    label: t('formDemo.psc')
  }
]
const radio1 = ref('')
const percentageIcon = useIcon({ icon: 'material-symbols:percent' })

const input = ref('')

const tableData = [
  {
    name: 'LV Flourine red X monogam bag da sần - Lage(.5.5 - 40.5)-Gently used / Đỏ; không quai',
    quantity: '2',
    rentalUnitPrice: '2,000,000 đ',
    rentalFee: '4,000,000 đ',
    returned: '',
    intoARentalDeposit: '15,000,000 đ'
  }
]

const tableData2 = [
  {
    name: '',
    quantity: '',
    unitPrice: '',
    intoMoney: ''
  }
]

interface tableDataType {
  dateOfPayment: string
  content: string
  quantity: number
  unitPrice: string
  intoMoney: string
  collected: string
  rentalFeeDebt: boolean
  kindOfMoney: string
  choosePayment: string
  alreadyPaidForTt: boolean
}
const debtTable = ref<Array<tableDataType>>([
  {
    dateOfPayment: moment().format('L').toString(),
    content: '',
    quantity: 0,
    unitPrice: '',
    intoMoney: '',
    collected: '',
    rentalFeeDebt: true,
    kindOfMoney: '',
    choosePayment: t('formDemo.cashPayment'),
    alreadyPaidForTt: false
  }
])

const deleteRowDebtTable = (index: number) => {
  debtTable.value.splice(index, 1)
}

const onAddDebtTableItem = () => {
  debtTable.value.push({
    dateOfPayment: moment().format('L').toString(),
    content: '',
    quantity: 0,
    unitPrice: '',
    intoMoney: '',
    collected: '',
    rentalFeeDebt: true,
    kindOfMoney: '',
    choosePayment: '',
    alreadyPaidForTt: false
  })
}

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
  } else {
    collapse.forEach((el) => {
      el.icon = plusIcon
    })
  }
}
const activeName = ref(collapse[0].name)
// Select kỳ hạn thuê
const alreadyPaidForTt = ref(true)

// Select loại tiền
const kindOfMoney = [
  {
    value: 'deposit',
    label: t('formDemo.deposit')
  },
  {
    value: 'fee',
    label: t('formDemo.fee')
  }
]

const dialogAddQuick = ref(false)
// phân loại khách hàng: 1: công ty, 2: cá nhân
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
// select khách hàng
const valueSelectCustomer = ref(t('formDemo.customer'))
const optionsCustomer = [
  {
    value: 'customer',
    label: t('formDemo.customer')
  }
]
// start date and end date
// const dateTime = ref('')

// const openDialogChoosePromotion = ref(false)
const radioVAT = ref(false)
const dialogFormVisible = ref(false)
const valueProvince = ref('')
const valueDistrict = ref('')
const valueCommune = ref('')

const openDialogChoosePromotion = ref(false)

// const checkDiscount = ref(false)
// Chọn kỳ thanh toán phí thuê
// const chooseRentalPaymentPeriod = ref(t('reuse.byMonth'))

// Call api danh sách cộng tác viên
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

let customerAddress = ref('')

let infoCompany = reactive({
  name: '',
  taxCode: '',
  phone: '',
  email: ''
})
// Call api danh sách khách hàng
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

// Call api promo list
const initialRadio = ref(false)
let promoTable = ref()
const promoLoading = ref(true)
const listPromotions = ref()
const optionPromotions = ref()
let optionCallPromoAPi = 0
const callPromoApi = async () => {
  if (optionCallPromoAPi == 0) {
    const res = await getPromotionsList('')
    let count = 0
    listPromotions.value = res.data
    optionPromotions.value = listPromotions.value.map((product) => ({
      radio: count++,
      label: product.code,
      value: product.name,
      name: product.description,
      discount: product.reduce,
      min: product.minimumPriceToGetReduce,
      max: product.maximumReduce
    }))
    optionCallPromoAPi++
    promoTable.value = optionPromotions.value
  }
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

const changeName = (optionID, scope) => {
  const option = optionsApi.value.find((option) => option.name == optionID)
  scope.row.name = option.name
  scope.row.unitPrice = option.price
  scope.row.intoMoney = (parseInt(scope.row.quantity) * parseInt(scope.row.unitPrice)).toString()
}

// call api province
const cities = ref()
const district = ref()
const ward = ref()
const street = ref()
const enterdetailAddress = ref([])

const callApiCity = async () => {
  cities.value = await getCity()
}

const CityChange = async (value) => {
  district.value = await getDistrict(value)
}

const districtChange = async (value) => {
  ward.value = await getWard(value)
}

// tạo đơn hàng

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
  if (checkValidate.value) {
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
      rentalPeriod: ruleForm.rentalPeriod,
      PromotionCode: 'AA12',
      CollaboratorId: ruleForm.collaborators,
      CollaboratorCommission: ruleForm.discount,
      Description: ruleForm.orderNotes,
      CustomerId: ruleForm.customerName,
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
    addNewOrderList(formDataPayLoad)
  }
}

const options = [
  {
    value: t('reuse.byDay'),
    label: t('reuse.byDay')
  },
  {
    value: t('reuse.byWeek'),
    label: t('reuse.byWeek')
  },
  {
    value: t('reuse.byMonth'),
    label: t('reuse.byMonth')
  }
]

const optionsRentalPaymentPeriod = [
  {
    value: t('formDemo.onetimePaymentInAdvance'),
    label: t('formDemo.onetimePaymentInAdvance')
  },
  {
    value: t('formDemo.payAfterOneTime'),
    label: t('formDemo.payAfterOneTime')
  },
  {
    value: t('reuse.byDay'),
    label: t('reuse.byDay')
  },
  {
    value: t('reuse.byWeek'),
    label: t('reuse.byWeek')
  },
  {
    value: t('reuse.byMonth'),
    label: t('reuse.byMonth')
  }
]

onBeforeMount(() => {
  callApiCollaborators()
  callCustomersApi()
  callPromoApi()
  callApiProductList()
  callApiCity()
})
</script>

<template>
  <div class="demo-collapse dark:bg-[#141414]">
    <el-collapse v-model="activeName" @change="collapseChangeEvent">
      <el-collapse-item :name="collapse[0].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[0].icon" link />
          <span class="text-center text-xl">{{ collapse[0].title }}</span>
        </template>
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
                <el-input
                  style="width: 100%"
                  :placeholder="`${t('formDemo.enterRepresentative')}`"
                />
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
              <div class="text-sm text-[#303133] font-medium pb-4 pl-4 dark:text-[#fff]">
                <el-divider content-position="left">{{
                  t('formDemo.orderInformation')
                }}</el-divider>
              </div>
              <el-form-item :label="t('formDemo.orderCode')" prop="orderCode">
                <el-input style="width: 100%" v-model="ruleForm.orderCode" />
              </el-form-item>
              <el-form-item :label="t('formDemo.leaseTerm')">
                <el-select v-model="ruleForm.leaseTerm" placeholder="Select" clearable>
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item :label="t('formDemo.rentalPeriod')" prop="rentalPeriod">
                <el-date-picker
                  v-model="ruleForm.rentalPeriod"
                  type="daterange"
                  :start-placeholder="t('formDemo.startDay')"
                  :end-placeholder="t('formDemo.endDay')"
                  format="DD/MM/YYYY"
                />
              </el-form-item>
              <el-form-item :label="t('formDemo.rentalPaymentPeriod')" prop="rentalPaymentPeriod">
                <el-select v-model="ruleForm.rentalPaymentPeriod" placeholder="Select">
                  <el-option
                    v-for="item in optionsRentalPaymentPeriod"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <div class="flex gap-2 items-center">
                <div class="w-[60%] max-w-[531.5px]">
                  <el-form-item :label="t('formDemo.collaborators')" prop="collaborators">
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
                </div>
                <div class="w-[40%]">
                  <el-form-item prop="discount" label-width="0">
                    <div class="flex items-center">
                      <el-input
                        v-model="ruleForm.discount"
                        class="w-[100%] border-none outline-none pl-2 bg-transparent"
                        :placeholder="`${t('formDemo.enterDiscount')}`"
                        :suffix-icon="percentageIcon"
                      />
                    </div>
                  </el-form-item>
                </div>
              </div>
              <el-form-item :label="t('formDemo.orderNotes')" prop="orderNotes">
                <el-input v-model="ruleForm.orderNotes" :placeholder="t('formDemo.addNotes')" />
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
                <div class="text-right text-[#FECB80] italic">Dưới 10 hồ sơ</div>
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
                  <el-dialog v-model="dialogVisible" class="absolute" />
                  <div class="text-[#303133] font-medium dark:text-[#fff]"
                    >+ {{ t('formDemo.addPhotosOrFiles') }}</div
                  >
                </el-upload>
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
                    <el-form-item label-width="0" prop="customerName" width="100%">
                      <div class="flex items-center gap-4">
                        <div class="flex w-[100%] gap-2 bg-transparent">
                          <el-select
                            v-model="ruleForm.customerName"
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
                    </el-form-item>
                  </div>
                </div>
                <div class="flex-1">
                  <!-- <el-form-item :label="t('formDemo.chooseShipping')" prop="region" width="100%"> -->

                  <el-form-item label-width="0" prop="delivery">
                    <div class="flex w-[100%] max-h-[42px] gap-2 items-center">
                      <label class="w-[170px] text-[#828387] text-right">{{
                        t('formDemo.chooseShipping')
                      }}</label>
                      <div class="flex w-[80%] gap-4">
                        <el-select
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
                  <!-- </el-form-item> -->
                </div>
              </div>
              <div class="flex w-[100%] gap-6">
                <div class="w-[50%]">
                  <el-form-item>
                    <p
                      v-if="ruleForm.customerName !== ''"
                      class="bg-[#F4F8FD] pl-2 text-blue-500 dark:bg-[#3B3B3B]"
                      >{{ t('formDemo.noDebt') }}</p
                    >
                  </el-form-item>
                </div>
                <div class="flex w-[50%] gap-2 items-center" v-if="ruleForm.customerName !== ''">
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
              <el-form-item class="poi-self" :label="t('reuse.customerInfo')">
                <div class="flex" v-if="ruleForm.customerName !== ''">
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
          <el-table :data="promoTable" border :loading="promoLoading">
            <el-table-column prop="radio" width="90" align="center">
              <template #default="props">
                <el-radio-group v-model="initialRadio" class="ml-4 fix-label-color">
                  <el-radio :label="props.row.radio" />
                </el-radio-group>
              </template>
            </el-table-column>
            <el-table-column prop="name" />
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
      <el-collapse-item :name="collapse[1].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[1].icon" link />
          <span class="text-center text-xl">{{ collapse[1].title }}</span>
        </template>
        <el-divider content-position="left">{{ t('formDemo.rentalProductList') }}</el-divider>
        <el-table :data="tableData" border class="pl-4 dark:text-[#fff]">
          <el-table-column :label="`${t('formDemo.productManagementCode')}`" width="150">
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
          <el-table-column prop="name" :label="`${t('formDemo.productInformation')}`" width="680" />
          <el-table-column :label="`${t('reuse.accessory')}`" width="180">
            <el-input v-model="input" :placeholder="`/${t('formDemo.selfImportAccessories')}/`" />
          </el-table-column>
          <el-table-column
            prop="quantity"
            :label="`${t('formDemo.rentalQuantity')}`"
            align="center"
            width="90"
          />
          <el-table-column
            prop="returned"
            :label="`${t('reuse.returned')}`"
            align="left"
            width="120"
          />
          <el-table-column :label="`${t('reuse.dram')}`" align="center" width="100">
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
            prop="rentalUnitPrice"
            :label="`${t('formDemo.rentalUnitPrice')}`"
            align="right"
            width="180"
          />
          <el-table-column
            prop="rentalFee"
            :label="`${t('formDemo.rentalFee')}`"
            align="right"
            width="180"
          />
          <el-table-column
            prop="intoARentalDeposit"
            :label="`${t('formDemo.intoARentalDeposit')}`"
            align="right"
            width="180"
          />
          <el-table-column :label="`${t('formDemo.exportWarehouse')}`" width="200">
            <div class="flex w-[100%]">
              <div class="flex-1">Còn hàng</div>
              <div class="flex-1 text-right text-blue-500 cursor-pointer"
                >+ {{ t('formDemo.chooseWarehouse') }}</div
              >
            </div>
          </el-table-column>
          <el-table-column :label="`${t('formDemo.manipulation')}`" align="center" width="90">
            <button class="bg-[#F56C6C] pt-2 pb-2 pl-4 pr-4 text-[#fff] rounded">{{
              t('reuse.delete')
            }}</button>
          </el-table-column>
        </el-table>
        <el-table :data="tableData2" class="pl-4 dark:text-[#fff]">
          <el-table-column width="250" />
          <el-table-column width="200" />
          <el-table-column width="220" />
          <el-table-column width="550" />
          <el-table-column align="right" width="180">
            <div class="dark:text-[#fff]">{{ t('formDemo.intoMoney') }}</div>
            <div class="text-blue-500 cursor-pointer">
              <el-button text @click="openDialogChoosePromotion = true" style="padding: 0">
                <span class="text-blue-500"> + {{ t('formDemo.choosePromotion') }}</span>
              </el-button>
            </div>
            <div class="text-blue-500 cursor-pointer">
              <el-dropdown trigger="click">
                <span class="el-dropdown-link text-blue-500 cursor-pointer flex items-center">
                  {{ t('formDemo.doesNotIncludeVAT') }}
                  <Icon icon="material-symbols:keyboard-arrow-down" :size="16" />
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>
                      <el-radio-group v-model="radioVAT" class="flex-col">
                        <div style="width: 100%">
                          <el-radio class="text-left" style="color: blue" label="1">{{
                            t('formDemo.VATNotIncluded')
                          }}</el-radio>
                        </div>
                        <div style="width: 100%">
                          <el-radio class="text-left" style="color: blue" label="2"
                            >VAT 10%</el-radio
                          >
                        </div>
                        <div style="width: 100%">
                          <el-radio class="text-left" style="color: blue" label="3"
                            >VAT 8%</el-radio
                          >
                        </div>
                        <div style="width: 100%">
                          <el-radio class="text-left" style="color: blue" label="4"
                            >VAT 5%</el-radio
                          >
                        </div>
                        <div style="width: 100%">
                          <el-radio class="text-left" style="color: blue" label="5"
                            >VAT 0%</el-radio
                          >
                        </div>
                      </el-radio-group>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <div class="dark:text-[#fff]">{{ t('formDemo.totalFeePayable') }}</div>
            <div class="dark:text-[#fff]">{{ t('formDemo.totalDeposit') }}</div>
          </el-table-column>
          <el-table-column align="right" width="180">
            <div class="dark:text-[#fff]">4,000,000 đ</div>
            <div class="dark:text-[#fff]">-400,000 đ</div>
            <div class="dark:text-[#fff] text-transparent dark:text-transparent">s</div>
            <div class="dark:text-[#fff]">3,600,000 đ</div>
            <div class="dark:text-[#fff]">15,000,000 đ</div>
          </el-table-column>
          <el-table-column width="200" align="right">
            <div class="dark:text-[#fff] text-transparent dark:text-transparent">s</div>
            <div class="text-blue-500 cursor-pointer">FGF3443D | Giảm giá thuê 10% ... </div>
            <div class="dark:text-[#fff] text-transparent dark:text-transparent">s</div>
          </el-table-column>
        </el-table>
        <el-divider content-position="left">{{ t('formDemo.debtTrackingSheet') }}</el-divider>
        <el-table :data="debtTable" border>
          <el-table-column
            prop="date"
            :label="`${t('formDemo.dateOfPayment')}`"
            width="150"
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
          <el-table-column prop="content" :label="`${t('reuse.content')}`" width="240">
            <template #default="data">
              <el-input v-model="data.row.content" style="width: 100%" />
            </template>
          </el-table-column>
          <el-table-column :label="`${t('formDemo.receiptOrPayment')}`" align="right">
            <div class="text-blue-500">+{{ t('formDemo.receiptOrPayment') }}</div>
          </el-table-column>
          <el-table-column :label="`${t('router.paymentProposal')}`" align="right">
            <div class="text-blue-500">+{{ t('formDemo.paymentOrder') }}</div>
          </el-table-column>
          <el-table-column :label="`${t('formDemo.kindOfMoney')}`" align="right" prop="kindOfMoney">
            <template #default="props">
              <el-select v-model="props.row.kindOfMoney" class="m-2">
                <el-option
                  v-for="(item, index) in kindOfMoney"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="collected" :label="`${t('formDemo.collected')}`" align="right" />
          <el-table-column :label="`${t('formDemo.spent')}`" align="right">đ</el-table-column>
          <el-table-column
            prop="rentalFeeDebt"
            :label="`${t('formDemo.rentalFeeDebt')}`"
            align="right"
          />
          <el-table-column :label="`${t('formDemo.receivableOrPayable')}`" width="120">
            <div>Phải thu</div>
          </el-table-column>
          <el-table-column :label="`${t('formDemo.choosePayment')}`" prop="choosePayment">
            <template #default="props">
              <el-select v-model="props.row.choosepayment" class="m-2">
                <el-option
                  v-for="(item, index) in choosePayment"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column :label="`${t('formDemo.alreadyPaidForTt')}`" align="center" width="90">
            <el-checkbox v-model="alreadyPaidForTt" />
          </el-table-column>
          <el-table-column :label="`${t('formDemo.manipulation')}`" width="90" align="center">
            <template #default="scope">
              <button
                @click.prevent="deleteRowDebtTable(scope.$index)"
                class="bg-[#F56C6C] pt-2 pb-2 pl-4 pr-4 text-[#fff] rounded"
                >{{ t('reuse.delete') }}</button
              >
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
              <el-radio label="1">{{ t('reuse.closedTheOrder') }}</el-radio>
              <el-radio label="2">{{ t('reuse.delivery') }}</el-radio>
              <el-radio label="3">{{ t('reuse.deliveryFailed') }}</el-radio>
              <el-radio label="4">{{ t('formDemo.leaseExtensionIsInProgress') }}</el-radio>
              <el-radio label="5">{{ t('common.doneLabel') }}</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="flex gap-2 pb-8">
          <div class="w-[11%]"></div>
          <div class="w-[89%]"
            ><span class="pl-2 pr-2 bg-[#FFF0D9] text-[#FEB951] leading-5 dark:bg-transparent"
              >Đơn giá thay đổi, đang chờ duyệt giá</span
            >
          </div>
        </div>

        <div class="w-[100%] flex gap-2">
          <div class="w-[12%]"></div>
          <div class="w-[100%] flex ml-1 gap-4">
            <el-button class="min-w-42 min-h-11">{{ t('formDemo.printSalesSlip') }}</el-button>
            <el-button class="min-w-42 min-h-11">{{ t('formDemo.temporaryStorage') }}</el-button>
            <el-button @click="postData" type="primary" class="min-w-42 min-h-11">{{
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
          <el-divider content-position="left">{{
            t('formDemo.completeEntryTrackingSheet')
          }}</el-divider>
          <el-table :data="historyTable" border class="pl-4 dark:text-[#fff]">
            <el-table-column :label="`${t('formDemo.productManagementCode')}`" width="150">
              <el-select v-model="value" class="m-2">
                <el-option
                  v-for="item in codeProducts"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-table-column>
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
            <el-table-column :label="`${t('reuse.dram')}`" align="center" width="120">
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
              :label="`${t('formDemo.invoiceForGoodsEnteringTheWarehouse')}`"
              align="right"
              width="200"
            >
              <div class="text-blue-500 cursor-pointer"> +{{ t('formDemo.invoice') }} </div>
            </el-table-column>
            <el-table-column :label="`${t('formDemo.manipulation')}`" align="center" width="180">
              <div class="flex gap-4">
                <button class="flex-1 bg-[#F56C6C] pt-2 pb-2 pl-4 pr-4 text-[#fff] rounded">{{
                  t('reuse.delete')
                }}</button>
              </div>
            </el-table-column>
          </el-table>
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

::v-deep(.el-range-editor.el-input__wrapper) {
  width: 100%;
}
</style>
