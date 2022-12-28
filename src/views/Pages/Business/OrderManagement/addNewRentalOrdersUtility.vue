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
  ElFormItem,
  ElNotification,
  UploadUserFile,
  ElTreeSelect,
  UploadProps,
  ElMessage
} from 'element-plus'
import type { UploadFile } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { Collapse } from '../../Components/Type'
import moment from 'moment'
import { formatOrderReturnReason, FORM_IMAGES } from '@/utils/format'
import { getCity, getDistrict, getWard } from '@/utils/Get_Address'
import { PRODUCTS_AND_SERVICES } from '@/utils/API.Variables'
import { dateTimeFormat, postDateTime } from '@/utils/format'
import {
  getCollaboratorsInOrderList,
  getAllCustomer,
  getPromotionsList,
  getProductsList,
  addNewOrderList,
  getOrderList,
  createQuickProduct,
  getCheckProduct,
  getproductId,
  addQuickCustomer,
  getPriceOfSpecificProduct,
  addTPV,
  getReturnRequest,
  getDetailReceiptPaymentVoucher,
  addDNTT,
  addOrderStransaction,
  getOrderTransaction,
  createReturnRequest,
  getReceiptPaymentVoucher,
  getDetailAccountingEntryById,
  postAutomaticWarehouse,
  GetProductPropertyInventory
} from '@/api/Business'
import { getCategories } from '@/api/LibraryAndSetting'
import MultipleOptionsBox from '@/components/MultipleOptionsBox.vue'
import CurrencyInputComponent from '@/components/CurrencyInputComponent.vue'
import paymentOrderPrint from '../../Components/formPrint/src/paymentOrderPrint.vue'
import billPrint from '../../Components/formPrint/src/billPrint.vue'
import receiptsPaymentPrint from '../../Components/formPrint/src/receiptsPaymentPrint.vue'

import type { FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'
import ReturnOrder from './ReturnOrder.vue'

const { t } = useI18n()

const changeMoney = new Intl.NumberFormat('vi', {
  style: 'currency',
  currency: 'vnd',
  minimumFractionDigits: 0
})

const ruleFormRef = ref<FormInstance>()
const ruleFormRef2 = ref<FormInstance>()
const ruleFormAddress = ref<FormInstance>()

const ruleForm = reactive({
  orderCode: 'DHB039423',
  leaseTerm: 30,
  rentalPeriod: [],
  rentalPaymentPeriod: 5,
  collaborators: '',
  discount: '',
  orderNotes: '',
  customerName: '',
  delivery: 0
})

const rules = reactive<FormRules>({
  orderCode: [{ required: true, message: t('formDemo.pleaseEnterOrderCode'), trigger: 'blur' }],
  leaseTerm: [
    {
      required: true,
      message: t('formDemo.pleaseSelectARentalTerm'),
      trigger: 'change'
    }
  ],
  rentalPaymentPeriod: [
    {
      required: true,
      message: t('formDemo.pleaseSelectRentalPaymentPeriod'),
      trigger: 'change'
    }
  ],
  collaborators: [
    {
      required: true,
      message: t('formDemo.pleaseSelectCollaboratorCode'),
      trigger: 'change'
    }
  ],
  discount: [
    {
      required: true,
      message: t('formDemo.pleaseInputDiscount'),
      trigger: 'blur'
    }
  ],
  orderNotes: [{ required: true, message: t('formDemo.pleaseEnterANote'), trigger: 'blur' }],
  customerName: [
    { required: true, message: t('formDemo.pleaseSelectCustomerName'), trigger: 'change' }
  ],
  delivery: [
    {
      required: true,
      message: t('formDemo.pleaseChooseDelivery'),
      trigger: 'change'
    }
  ]
})

const formAddress = reactive({
  province: '',
  district: '',
  wardCommune: '',
  detailedAddress: ''
})
const rulesAddress = reactive<FormRules>({
  province: [
    {
      required: true,
      message: 'Không được để trống Tỉnh/thành phố',
      trigger: 'change'
    }
  ],
  district: [
    {
      required: true,
      message: 'Không được để trống Quận/huyện',
      trigger: 'change'
    }
  ],
  wardCommune: [
    {
      required: true,
      message: 'Không được để trống Phường/Xã',
      trigger: 'change'
    }
  ],
  detailedAddress: [
    { required: true, message: 'Không được để trống Địa chỉ chi tiết', trigger: 'blur' }
  ]
})

const submitFormAddress = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, _fields) => {
    if (valid) {
      autoChangeAddress()
      dialogFormVisible.value = false
    } else {
    }
  })
}

var curDate = 'DCT' + moment().format('hhmmss')
var autoRentalOrderCode = 'T' + moment().format('hmmss')
var autoCodeExpenditures = 'PC' + moment().format('hmmss')
var autoCodePaymentRequest = 'DNTT' + moment().format('hhmmss')
var autoCodeReturnRequest = 'DT' + moment().format('hms')

const codeReturnRequest = ref()
const rentalOrderCode = ref()
const codeReceipts = ref()
const codeExpenditures = ref()
const codePaymentRequest = ref()

let checkValidateForm = ref(false)

const submitForm = async (formEl: FormInstance | undefined, formEl2: FormInstance | undefined) => {
  if (!formEl || !formEl2) return
  await formEl.validate((valid, _fields) => {
    if (valid) {
      checkValidateForm.value = true
    } else {
      checkValidateForm.value = true
    }
  })
  await formEl2.validate((valid, _fields) => {
    if (valid && checkValidateForm.value) {
      postData()
      statusOrder.value = 2
      changeStatus(3)
      doubleDisabled.value = false
    } else {
      ElMessage.error(t('reuse.notFillAllInformation'))
      checkValidateForm.value = false
    }
  })
}

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)

const handleRemove = (file: UploadFile) => {
  return file
}

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}

const handleDownload = (file: UploadFile) => {
  return file
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
    icon: minusIcon,
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
    name: 'debtHistory',
    title: t('formDemo.debtHistory'),
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

const chooseDelivery = [
  {
    value: 0,
    label: t('formDemo.selfDelivery')
  },
  {
    value: 1,
    label: t('formDemo.deliveryToYourPlace')
  }
]

const radio1 = ref('')
const percentageIcon = useIcon({ icon: 'material-symbols:percent' })

const input = ref('')

interface tableRentalProduct {
  productPropertyId: string
  productName: string
  accessory: string
  fromDate: any
  toDate: any
  quantity: number
  unitPrice: number
  hirePrice: string
  depositePrice: string
  warehouseId: number
  warehouseName: string
  totalPrice: string
  unitName: string
  intoARentalDeposit: string
}

const tableData = ref<Array<tableRentalProduct>>([])

const productForSale = reactive<tableRentalProduct>({
  productPropertyId: '',
  productName: '',
  accessory: '',
  fromDate: '',
  toDate: '',
  quantity: 1,
  unitPrice: 0,
  hirePrice: '',
  depositePrice: '',
  warehouseId: 0,
  warehouseName: '',
  totalPrice: '',
  unitName: t('formDemo.psc'),
  intoARentalDeposit: ''
})

interface tableDataType {
  initializationDate: string
  content: string
  receiptOrPaymentVoucherId: string
  quantity: number
  unitPrice: string
  intoMoney: string
  collected: string
  spent: string
  rentalFeeDebt: string
  kindOfMoney: string
  paymentProposal: string
  payment: string
  alreadyPaidForTt: boolean
  statusAccountingEntry: string
}

let debtTable = ref<Array<tableDataType>>([])
let newTable = ref()
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const handleSelectionChange = (val: tableDataType[]) => {
  newTable.value = val
}

const onAddDebtTableDeposit = () => {
  debtTable.value.push({
    initializationDate: moment().format('L').toString(),
    content: feePaymentPeriod.value,
    receiptOrPaymentVoucherId: '',
    quantity: 0,
    unitPrice: '',
    intoMoney: '',
    collected: '',
    spent: '',
    rentalFeeDebt: '',
    kindOfMoney: '',
    paymentProposal: '',
    payment: '',
    alreadyPaidForTt: false,
    statusAccountingEntry: ''
  })
}

const historyTable = ref<Array<any>>([])

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
const activeName = ref([collapse[0].name, collapse[1].name])

const dialogAddQuick = ref(false)
const valueClassify = ref(false)
const optionsClassify = [
  {
    value: true,
    label: t('formDemo.company')
  },
  {
    value: false,
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

const radioVAT = ref(t('formDemo.doesNotIncludeVAT'))
const dialogFormVisible = ref(false)

const openDialogChoosePromotion = ref(false)

// Call api danh sách cộng tác viên
const listCollaborators = ref()
const optionsCollaborators = ref()
let optionCallCollaborators = 0
const callApiCollaborators = async () => {
  if (optionCallCollaborators == 0) {
    const res = await getCollaboratorsInOrderList('')
    listCollaborators.value = res.data
    optionsCollaborators.value = listCollaborators.value.map((collaborator) => ({
      label: collaborator.name,
      value: collaborator.id,
      collaboratorCommission: collaborator.collaboratorCommission
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

let customerID = ref()
const getValueOfCustomerSelected = (value, obj) => {
  changeAddressCustomer(value)
  customerID.value = value
  valueProvince.value = obj.provinceId
  valueDistrict.value = obj.districtId
  valueCommune.value = obj.wardId
  enterdetailAddress.value = obj.address
  ruleForm.customerName = obj.label
}

// Call api danh sách khách hàng
const optionsCustomerApi = ref<Array<any>>([])
let optionCallCustomerAPi = 0
const callCustomersApi = async () => {
  if (optionCallCustomerAPi == 0) {
    const res = await getAllCustomer({ PageIndex: 1, PageSize: 20 })
    const getCustomerResult = res.data
    if (Array.isArray(unref(getCustomerResult)) && getCustomerResult?.length > 0) {
      optionsCustomerApi.value = getCustomerResult.map((customer) => ({
        code: customer.code,
        label: customer.isOrganization
          ? customer.name + ' | MST ' + customer.taxCode
          : customer.name + ' | ' + customer.phonenumber,
        address: customer.address,
        name: customer.name,
        value: customer.id.toString(),
        isOrganization: customer.isOrganization,
        taxCode: customer.taxCode,
        phone: customer.phonenumber,
        email: customer.email,
        id: customer.id.toString()
      }))
    }
  }
  optionCallCustomerAPi++
}

// Call api danh sách mã giảm giá
let promoTable = ref()
const promoLoading = ref(true)
const listPromotions = ref()
let optionCallPromoAPi = 0
const callPromoApi = async () => {
  if (optionCallPromoAPi == 0) {
    const res = await getPromotionsList({ ServiceType: 1, CustomerId: customerIdPromo.value })
    listPromotions.value = res.data
    promoTable.value = listPromotions.value.map((product) => ({
      id: product.id,
      label: product.code,
      value: product.name,
      description: product.description,
      reducePercent: product.reducePercent,
      reduceCash: product.reduceCash,
      discount: product.reduce,
      voucherConditionType: product.voucherConditionType,
      voucherConditionTypeName:
        product.voucherConditionType == 1
          ? 'Nhận voucher miễn phí'
          : product.voucherConditionType == 2
          ? 'Affilate'
          : product.voucherConditionType == 3
          ? `Đổi voucher ${product.exchangeValue} điểm, điểm đang có `
          : `Mua voucher ${product.exchangeValue} đ Ví đang có  `,
      exchangeValue: product.exchangeValue,
      toDate: dateTimeFormat(product.toDate),
      min: product.minimumPriceToGetReduce,
      max: product.maximumReduce,
      isAvailable: product.isAvailable
    }))
    optionCallPromoAPi++
  }
}

const currentRow = ref()

let checkPromo = ref(false)
let promo = ref()
let promoCode = ref()
let promoDescription = ref()
let promoMin = ref()
let promoDate = ref()
let promoName = ref()
let promoActive = ref()
let campaignId = ref()
let isActivePromo = ref()

const handleCurrentChange = (val: undefined) => {
  promoCash.value = 0
  promoValue.value = 0
  currentRow.value = val
  promo.value = val
  promo.value?.reduceCash != 0
    ? (promoCash.value = promo.value.reduceCash)
    : (promoValue.value = promo.value?.reducePercent)
  changeRowPromo()
  checkPromo.value = true
}

const changeRowPromo = () => {
  promoCode.value = currentRow.value.label
  promoDescription.value = currentRow.value.description
  promoMin.value = currentRow.value.min
  promoDate.value = currentRow.value.toDate
  if (currentRow.value.voucherConditionType == 1) {
    promoName.value = 'Nhận voucher miễn phí'
  } else if (currentRow.value.voucherConditionType == 2) {
    promoName.value = 'Affilate'
  } else if (currentRow.value.voucherConditionType == 3) {
    promoName.value = `Đổi voucher ${currentRow.value.exchangeValue} điểm, điểm đang có `
  } else {
    promoName.value = `Mua voucher ${currentRow.value.exchangeValue} đ Ví đang có  `
  }
  promoActive.value = `${promoCode.value} | ${promoDescription.value}`
  campaignId.value = currentRow.value.id
  isActivePromo.value = currentRow.value.isActive
}

const handleChangePromo = (data) => {
  promoCash.value = 0
  promoValue.value = 0
  promo.value = promoTable.value.find((e) => e.value == data)
  promo.value?.reduceCash != 0
    ? (promoCash.value = promo.value.reduceCash)
    : (promoValue.value = promo.value?.reducePercent)
  changeNamePromo()
  checkPromo.value = true
}

const changeNamePromo = () => {
  promoCode.value = promo.value.label
  promoDescription.value = promo.value.description
  promoMin.value = promo.value.min
  promoDate.value = promo.value.toDate
  if (promo.value.voucherConditionType == 1) {
    promoName.value = 'Nhận voucher miễn phí'
  } else if (promo.value.voucherConditionType == 2) {
    promoName.value = 'Affilate'
  } else if (promo.value.voucherConditionType == 3) {
    promoName.value = `Đổi voucher ${promo.value.exchangeValue} điểm, điểm đang có `
  } else {
    promoName.value = `Mua voucher ${promo.value.exchangeValue} đ Ví đang có  `
  }
  promoActive.value = `${promoCode.value} | ${promoDescription.value}`
  campaignId.value = promo.value.id
  isActivePromo.value = promo.value.isActive
}

const changeAddressCustomer = (data) => {
  if (data) {
    const result = optionsCustomerApi.value.find((e) => e.value == data)
    optionCallPromoAPi = 0
    customerIdPromo.value = result.id
    callPromoApi()
    if (result.isOrganization) {
      customerAddress.value = optionsCustomerApi.value.find((e) => e.value == data)?.address ?? ''
      infoCompany.name = result.name
      infoCompany.taxCode = result.taxCode
      infoCompany.phone = result.phone
      infoCompany.email = 'Email: ' + result.email
    } else {
      customerAddress.value = optionsCustomerApi.value.find((e) => e.value == data)?.address ?? ''
      infoCompany.name = result.name
      infoCompany.taxCode = result.taxCode
      infoCompany.phone = result.phone
      infoCompany.email = 'Email: ' + result.email
    }
  } else {
    customerAddress.value = ''
  }
}

let totalPriceOrder = ref()
let totalFinalOrder = ref()
let promoValue = ref(0)
let promoCash = ref(0)
let totalDeposit = ref(0)

// Total order
const getProductPropertyPrice = async (
  productPropertyId = 0,
  serviceType = 3,
  quantity: 1,
  period: 1
): Promise<any> => {
  const getPricePayload = {
    Id: productPropertyId,
    serviceType: serviceType,
    Quantity: quantity,
    Period: period
  }
  // lấy giá tiền của một sản phẩm
  const res = await getPriceOfSpecificProduct(getPricePayload)
  const objPrice = res.data
  return objPrice
}

const autoCalculateOrder = () => {
  totalPriceOrder.value = 0
  totalFinalOrder.value = 0
  totalDeposit.value = 0
  tableData.value.map((val) => {
    if (val.hirePrice) totalPriceOrder.value += parseInt(val.hirePrice)
    if (val.depositePrice) totalDeposit.value += parseInt(val.depositePrice)
  })

  promoCash.value != 0
    ? (totalFinalOrder.value = totalPriceOrder.value - promoCash.value + totalDeposit.value)
    : (totalFinalOrder.value =
        totalPriceOrder.value -
        (totalPriceOrder.value * promoValue.value) / 100 +
        totalDeposit.value)

  if (radioVAT.value.length < 4) {
    VAT.value = true
    valueVAT.value = radioVAT.value.substring(0, radioVAT.value.length - 1)
    if (totalFinalOrder.value) {
      totalFinalOrder.value += (totalFinalOrder.value * parseInt(valueVAT.value)) / 100
    }
  }
}

// Call api danh sách sản phẩm
const listProductsTable = ref()

const pageIndexProducts = ref(1)
const callApiProductList = async () => {
  const res = await getProductsList({
    ServiceType: 3,
    PageIndex: pageIndexProducts.value,
    PageSize: 20
  })
  if (res.data && res.data?.length > 0) {
    listProductsTable.value = res.data.map((product) => ({
      productCode: product.code,
      value: product.productCode,
      name: product.name ?? '',
      price: product.price.toString(),
      productPropertyId: product.id.toString(),
      productPropertyCode: product.productPropertyCode,
      hirePrice: product.hirePrice,
      finalPrice: product.finalPrice,
      depositePrice: product.depositePrice
    }))
  }
}

const scrollProductTop = ref(false)
const scrollProductBottom = ref(false)

const ScrollProductTop = () => {
  scrollProductTop.value = true
}
const noMoreProductData = ref(false)

const ScrollProductBottom = () => {
  scrollProductBottom.value = true
  pageIndexProducts.value++
  noMoreProductData.value
    ? ''
    : getProductsList({ PageIndex: pageIndexProducts.value, PageSize: 20 })
        .then((res) => {
          res.data.length == 0
            ? (noMoreProductData.value = true)
            : res.data.map((product) =>
                listProductsTable.value.push({
                  productCode: product.code,
                  value: product.productCode,
                  name: product.name ?? '',
                  price: product.price.toString(),
                  productPropertyId: product.id.toString(),
                  productPropertyCode: product.productPropertyCode
                })
              )
        })
        .catch(() => {
          noMoreProductData.value = true
        })
}

// api địa chỉ
const valueProvince = ref('')
const valueDistrict = ref('')
const valueCommune = ref('')
const enterdetailAddress = ref()

const cities = ref()
const district = ref()
const ward = ref()

const callApiCity = async () => {
  cities.value = await getCity()
}

const CityChange = async (value) => {
  district.value = await getDistrict(value)
}

const districtChange = async (value) => {
  ward.value = await getWard(value)
}

const ListFileUpload = ref<UploadUserFile[]>([])
const Files = ListFileUpload.value.map((file) => file.raw).filter((file) => file !== undefined)

const { push } = useRouter()
let idOrderPost = ref()

// tạo đơn hàng
let postTable = ref()
const postData = async () => {
  postTable.value = tableData.value.map((e) => ({
    ProductPropertyId: e.productPropertyId,
    Accessory: e.accessory,
    Description: null,
    Quantity: e.quantity,
    UnitPrice: 0,
    HirePrice: e.unitPrice,
    DepositePrice: e.depositePrice,
    TotalPrice: e.totalPrice,
    ConsignmentSellPrice: 0,
    ConsignmentHirePrice: 0,
    SpaServiceIds: null,
    WarehouseId: null,
    PriceChange: false
  }))
  postTable.value.pop()
  const productPayment = JSON.stringify([...postTable.value])
  const payload = {
    ServiceType: 3,
    OrderCode: ruleForm.orderCode,
    PromotionCode: 'TEST',
    CollaboratorId: ruleForm.collaborators,
    CollaboratorCommission: ruleForm.discount,
    Description: ruleForm.orderNotes,
    CustomerId: customerID.value,
    fromDate: postDateTime(ruleForm.rentalPeriod[0]),
    toDate: postDateTime(ruleForm.rentalPeriod[1]),
    TotalPrice: totalPriceOrder.value,
    DepositePrice: totalDeposit.value,
    DiscountMoney:
      promoCash.value != 0
        ? promoCash.value
        : promoValue.value != 0
        ? (totalPriceOrder.value * promoValue.value) / 100
        : 0,
    InterestMoney: 0,
    Files: Files,
    DeliveryOptionId: ruleForm.delivery,
    ProvinceId: formAddress.province ?? 1,
    DistrictId: formAddress.district ?? 1,
    WardId: formAddress.wardCommune ?? 1,
    Address: formAddress.detailedAddress,
    OrderDetail: productPayment,
    CampaignId: 2,
    VAT: 1,
    Status: 2,
    Days: ruleForm.leaseTerm,
    PaymentPeriod: 1
  }

  const formDataPayLoad = FORM_IMAGES(payload)
  idOrderPost.value = await addNewOrderList(formDataPayLoad)
    .then(
      () =>
        ElNotification({
          message: t('reuse.addSuccess'),
          type: 'success'
        }),
      () =>
        push({
          name: 'business.order-management.order-list',
          params: { backRoute: String(router.currentRoute.value.name) }
        })
    )
    .catch(() =>
      ElNotification({
        message: t('reuse.addFail'),
        type: 'warning'
      })
    )

  automaticCouponWareHouse(2)
}

// Phiếu xuất kho tự động
const automaticCouponWareHouse = async (index) => {
  const payload = {
    OrderId: idOrderPost.value.data,
    Type: index
  }

  await postAutomaticWarehouse(payload)
}

const hirePeriod = [
  {
    value: 1,
    label: t('reuse.byDay')
  },
  {
    value: 7,
    label: t('reuse.byWeek')
  },
  {
    value: 30,
    label: t('reuse.byMonth')
  }
]

let week = ref()
let month = ref()
const periodicallyDuringWeek = [
  {
    value: 2,
    label: 'Thứ 2'
  },
  {
    value: 3,
    label: 'Thứ 3'
  },
  {
    value: 4,
    label: 'Thứ 4'
  },
  {
    value: 5,
    label: 'Thứ 5'
  },
  {
    value: 6,
    label: 'Thứ 6'
  },
  {
    value: 7,
    label: 'Thứ 7'
  },
  {
    value: 8,
    label: 'Chủ nhật'
  }
]

const periodicallyInMonth = [
  {
    value: 1,
    label: 1
  },
  {
    value: 2,
    label: 2
  },
  {
    value: 3,
    label: 3
  },
  {
    value: 4,
    label: 4
  },
  {
    value: 5,
    label: 5
  },
  {
    value: 6,
    label: 6
  },
  {
    value: 7,
    label: 7
  },
  {
    value: 8,
    label: 8
  },
  {
    value: 9,
    label: 9
  },
  {
    value: 10,
    label: 10
  },
  {
    value: 11,
    label: 11
  },
  {
    value: 12,
    label: 12
  },
  {
    value: 13,
    label: 13
  },
  {
    value: 14,
    label: 14
  },
  {
    value: 15,
    label: 15
  },
  {
    value: 16,
    label: 16
  },
  {
    value: 17,
    label: 17
  },
  {
    value: 18,
    label: 18
  },
  {
    value: 19,
    label: 19
  },
  {
    value: 20,
    label: 20
  },
  {
    value: 21,
    label: 21
  },
  {
    value: 22,
    label: 22
  },
  {
    value: 23,
    label: 23
  },
  {
    value: 24,
    label: 24
  },
  {
    value: 25,
    label: 25
  },
  {
    value: 26,
    label: 26
  },
  {
    value: 27,
    label: 27
  },
  {
    value: 28,
    label: 28
  },
  {
    value: 29,
    label: 29
  },
  {
    value: 30,
    label: 30
  }
]

const options = [
  {
    value: 1,
    label: t('reuse.byDay')
  },
  {
    value: 7,
    label: t('reuse.byWeek')
  },
  {
    value: 30,
    label: t('reuse.byMonth')
  }
]

const optionsRentalPaymentPeriod = [
  {
    value: 1,
    label: t('formDemo.onetimePaymentInAdvance')
  },
  {
    value: 2,
    label: t('formDemo.payAfterOneTime')
  },
  {
    value: 3,
    label: t('reuse.byDay')
  },
  {
    value: 4,
    label: t('reuse.byWeek')
  },
  {
    value: 5,
    label: t('reuse.byMonth')
  }
]

const checkDisabled = ref(false)

const router = useRouter()
const id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)

let totalOrder = ref(0)
let customerIdPromo = ref()
const editData = async () => {
  console.log('id1: ', id)

  if (type == 'detail') checkDisabled.value = true
  console.log('id2: ', id)

  if (type == 'edit' || type == 'detail') {
    console.log('id3: ', id)
    disabledEdit.value = true
    const res = await getOrderList({ Id: id, ServiceType: 3 })
    const orderObj = { ...res.data[0] }
    const transaction = await getOrderTransaction({ id: id })
    if (debtTable.value.length > 0) debtTable.value.splice(0, debtTable.value.length - 1)
    debtTable.value = transaction.data
    getReturnRequestTable()

    dataEdit.value = orderObj

    if (res.data) {
      ruleForm.orderCode = orderObj.code
      ruleForm.collaborators = orderObj.collaboratorId
      ruleForm.discount = orderObj.CollaboratorCommission
      ruleForm.leaseTerm = orderObj.days
      ruleForm.rentalPeriod = [orderObj.fromDate, orderObj.toDate]
      ruleForm.rentalPaymentPeriod = orderObj.paymentPeriod
      ruleForm.customerName = orderObj.customer.isOrganization
        ? orderObj.customer.representative + ' | ' + orderObj.customer.taxCode
        : orderObj.customer.name + ' | ' + orderObj.customer.phonenumber
      ruleForm.orderNotes = orderObj.description

      totalOrder.value = orderObj.totalPrice
      if (orderObj.discountMoney != 0) {
        showPromo.value = true
        promoCash.value = orderObj.discountMoney
      }
      if (tableData.value.length > 0) tableData.value.splice(0, tableData.value.length - 1)
      tableData.value = orderObj.orderDetails
      customerAddress.value = orderObj.address
      ruleForm.delivery = orderObj.deliveryOptionName
      customerIdPromo.value = orderObj.customerId
      if (orderObj.customer.isOrganization) {
        infoCompany.name = orderObj.customer.name
        infoCompany.taxCode = orderObj.customer.taxCode
        infoCompany.phone = orderObj.customer.phone
        infoCompany.email = 'Email: ' + orderObj.customer.email
      } else {
        infoCompany.name = orderObj.customer.name + ' | ' + orderObj.customer.taxCode
        infoCompany.taxCode = orderObj.customer.taxCode
        infoCompany.phone = orderObj.customer.phone
        infoCompany.email = 'Email: ' + orderObj.customer.email
      }
    }
    orderObj.orderFiles.map((element) => {
      if (element !== null) {
        ListFileUpload.value.push({
          url: `${element?.domainUrl}${element?.path}`,
          name: element?.fileId,
          uid: element?.id
        })
      }
    })
  } else if (type == 'add' || !type) {
    tableData.value.push({ ...productForSale })
  }
}

const duplicateProduct = ref()
const duplicateProductMessage = () => {
  ElMessage.error('Sản phẩm đã được chọn, vui lòng tăng số lượng hoặc chọn sản phẩm khác')
}
const getValueOfSelected = async (value, obj, scope) => {
  const data = scope.row
  duplicateProduct.value = undefined
  duplicateProduct.value = tableData.value.find((val) => val.productPropertyId == value)

  if (duplicateProduct.value) {
    duplicateProductMessage()
  } else {
    data.productPropertyId = obj.productPropertyId
    data.productCode = obj.value
    data.productName = obj.name
    if (data.fromDate && data.toDate) {
      totalPriceOrder.value = 0
      totalFinalOrder.value = 0
      totalDeposit.value = 0

      let newDate = new Date(data.toDate - data.fromDate)
      let days = newDate.getDate()
      let objPrice = await getProductPropertyPrice(
        data.productPropertyId,
        3,
        parseInt(data.quantity),
        ruleForm.leaseTerm
      )
      data.unitPrice = objPrice.price
      data.depositePrice = objPrice.deposite
      data.hirePrice = data.unitPrice * data.quantity * days
      tableData.value.map((val) => {
        if (val.hirePrice) totalPriceOrder.value += parseInt(val.hirePrice)
        if (val.depositePrice) totalDeposit.value += parseInt(val.depositePrice)
      })
      promoCash.value != 0
        ? (totalFinalOrder.value = totalPriceOrder.value - promoCash.value + totalDeposit.value)
        : (totalFinalOrder.value =
            totalPriceOrder.value -
            (totalPriceOrder.value * promoValue.value) / 100 +
            totalDeposit.value)

      if (radioVAT.value.length < 4) {
        VAT.value = true
        valueVAT.value = radioVAT.value.substring(0, radioVAT.value.length - 1)
        if (totalFinalOrder.value) {
          totalFinalOrder.value += (totalFinalOrder.value * parseInt(valueVAT.value)) / 100
        }
      }
      // add new row
      if (scope.$index == tableData.value.length - 1) {
        tableData.value.push({ ...productForSale })
      }
    } else {
      if (scope.$index == tableData.value.length - 1) {
        tableData.value.push({ ...productForSale })
      }
    }
  }
}

// chọn ngày thì ra giá tiền
const handleGetTotal = async (_value, props) => {
  const data = props.row
  if (data.fromDate && data.toDate) {
    totalPriceOrder.value = 0
    totalFinalOrder.value = 0
    totalDeposit.value = 0
    let newDate = new Date(data.toDate - data.fromDate)
    let days = newDate.getDate()
    let objPrice = await getProductPropertyPrice(
      data.productPropertyId,
      3,
      parseInt(data.quantity),
      ruleForm.leaseTerm
    )
    data.unitPrice = objPrice.price
    data.depositePrice = objPrice.deposite
    data.hirePrice = data.unitPrice * data.quantity * days
    tableData.value.map((val) => {
      if (val.hirePrice) totalPriceOrder.value += parseInt(val.hirePrice)
      if (val.depositePrice) totalDeposit.value += parseInt(val.depositePrice)
    })
    promoCash.value != 0
      ? (totalFinalOrder.value = totalPriceOrder.value - promoCash.value + totalDeposit.value)
      : (totalFinalOrder.value =
          totalPriceOrder.value -
          (totalPriceOrder.value * promoValue.value) / 100 +
          totalDeposit.value)
  }
}

// Xóa sản phẩm trong table sản phẩm và thanh toán
const removeTableData = (index) => {
  tableData.value.splice(index, 1)
}

const dialogAddProduct = ref(false)
const addnewproduct = () => {
  dialogAddProduct.value = true
  getBrandSelectOptions()
  getUnitSelectOptions()
  getOriginSelectOptions()
  getCategory()
}

const quickProductCode = ref()
const quickManagementCode = ref()
const quickProductName = ref()
const quickDescription = ref()
const productCharacteristics = ref()
const chooseOrigin = ref()

// Danh mục brand unit origin api
const chooseCategory = ref()
let categorySelect = ref()
let optionsCategory = ref()
let callCategoryAPI = 0
const getCategory = async () => {
  if (callCategoryAPI == 0) {
    const res = await getCategories({
      TypeName: PRODUCTS_AND_SERVICES[0].key,
      pageSize: 100,
      pageIndex: 1
    })
    categorySelect.value = res.data
    optionsCategory.value = categorySelect.value.map((product) => ({
      label: product.name,
      value: product.id,
      id: product.id,
      children: product.children.map((child) => ({
        value: child.name,
        label: child.name,
        id: child.id
      }))
    }))
  }
  callCategoryAPI++
}
const chooseBrand = ref()
let brandSelect = ref()
let optionsBrand = ref()
let callBrandAPI = 0
const getBrandSelectOptions = async () => {
  if (callBrandAPI == 0) {
    const res = await getCategories({
      TypeName: PRODUCTS_AND_SERVICES[7].key,
      pageSize: 100,
      pageIndex: 1
    })
    brandSelect.value = res.data
    optionsBrand.value = brandSelect.value.map((product) => ({
      label: product.name,
      value: product.id
    }))
  }
  callUnitAPI++
}

const chooseUnit = ref()
let unitSelect = ref()
let optionsUnit = ref()
let callUnitAPI = 0
const getUnitSelectOptions = async () => {
  if (callUnitAPI == 0) {
    const res = await getCategories({
      TypeName: PRODUCTS_AND_SERVICES[6].key,
      pageSize: 100,
      pageIndex: 1
    })
    unitSelect.value = res.data
    optionsUnit.value = unitSelect.value.map((product) => ({
      label: product.name,
      value: product.id
    }))
  }
  callUnitAPI++
}

let originSelect = ref()
let optionsOrigin = ref()
let callOriginAPI = 0
const getOriginSelectOptions = async () => {
  if (callOriginAPI == 0) {
    const res = await getCategories({
      TypeName: PRODUCTS_AND_SERVICES[8].key,
      pageSize: 100,
      pageIndex: 1
    })
    originSelect.value = res.data
    optionsOrigin.value = originSelect.value.map((product) => ({
      label: product.name,
      value: product.id
    }))
  }
  callOriginAPI++
}

const postQuickCustomer = async () => {
  const payload = {
    serviceType: 1,
    productCode: quickProductCode.value,
    productPropertyCode: quickManagementCode.value,
    name: quickProductName.value,
    shortDescription: quickDescription.value,
    productTypeId: 9,
    brandId: 49,
    originId: 123,
    unitId: 121,
    categories: [
      {
        id: 0,
        key: 'string',
        value: 'string'
      }
    ]
  }
  await createQuickProduct(payload)
}

const handleChangeQuickAddProduct = async (data) => {
  const dataSelectedObj = listProductsTable.value.find(
    (product) => product.productPropertyId == data
  )

  // call API checkProduct
  let codeCheckProduct = ref()
  let checkProductAPI = 0
  if (checkProductAPI == 0) {
    const res = await getCheckProduct({ keyWord: dataSelectedObj.value })
    codeCheckProduct.value = res.data[0]
  }
  checkProductAPI++

  // call API getProductId
  let formProductData = ref()
  let getProductIdAPI = 0
  if (getProductIdAPI == 0) {
    const res = await getproductId({ Id: codeCheckProduct.value.id })
    formProductData.value = res.data[0]
  }
  getProductIdAPI++

  // fill data
  quickProductName.value = formProductData.value.name
  quickDescription.value = formProductData.value.shortDescription
  chooseBrand.value = formProductData.value.categories[0]?.id
  chooseCategory.value = formProductData.value.categories[1]?.value
  chooseUnit.value = formProductData.value.categories[2]?.id
  chooseOrigin.value = formProductData.value.categories[3]?.id
}

const optionsCharacteristic = [
  {
    value: 'Màu đỏ',
    label: 'Màu đỏ'
  },
  {
    value: 'Size L',
    label: 'Size L'
  },
  {
    value: 'Da bò',
    label: 'Da bò'
  },
  {
    value: 'Like new',
    label: 'Like new'
  }
]

// form add quick customer
const addQuickCustomerName = ref()
const quickTaxCode = ref()
const quickRepresentative = ref()
const quickPhoneNumber = ref()
const quickEmail = ref()

// Thêm nhanh khách hàng
const createQuickCustomer = async () => {
  const payload = {
    IsOrganization: valueClassify.value,
    Name: addQuickCustomerName.value,
    TaxCode: quickTaxCode.value,
    Representative: quickRepresentative.value,
    Phonenumber: quickPhoneNumber.value,
    Email: quickEmail.value,
    DistrictId: 1,
    WardId: 1,
    Address: 1,
    CustomerType: valueSelectCustomer.value
  }
  const formCustomerPayLoad = FORM_IMAGES(payload)
  await addQuickCustomer(formCustomerPayLoad)
    .then(() =>
      ElNotification({
        message: t('reuse.addSuccess'),
        type: 'success'
      })
    )
    .catch(() =>
      ElNotification({
        message: t('reuse.addFail'),
        type: 'warning'
      })
    )
}

const choosePayment = [
  {
    value: 0,
    label: t('formDemo.cashPayment')
  },
  {
    value: 1,
    label: t('formDemo.cardPayment')
  }
]

const inputDeposit = ref('10,000,000 đ')
const payment = ref(choosePayment[0].value)
// Thông tin phiếu thu
const dialogInformationReceipts = ref(false)

// Thông tin phiếu đề nghị thanh toán
const dialogIPRForm = ref(false)

// Thông tin phiếu chi
const dialogPaymentVoucher = ref(false)

const detailedListExpenses = [
  {
    numberVouchers: '',
    dayVouchers: '',
    spendFor: '',
    quantity: '',
    unitPrices: 'đ',
    intoMoney: 'đ',
    note: ''
  },
  {
    numberVouchers: '',
    dayVouchers: '',
    spendFor: '',
    quantity: '',
    unitPrices: 'đ',
    intoMoney: 'đ',
    note: ''
  }
]

const alreadyPaidForTt = ref(true)

// Thông tin phiếu bán hàng
const dialogRentalPaymentInformation = ref(false)
const singleTableRef = ref<InstanceType<typeof ElTable>>()

const feePaymentPeriod = ref('Kỳ thanh toán phí thuê theo tháng/Ngày 22/02/2022/ Tháng thứ 2')

// Thông tin phiếu thanh toán tiền cọc thuê
const dialogDepositSlip = ref(false)

// Thông tin phiếu nhập kho trả hàng cho thuê
const dialogWarehouseRentalPayment = ref(false)

const tableWarehouse = [
  {
    commodityName:
      'LV Flourine red X monogam bag da sần - Lage(35.5-40.5)-Gently used / Đỏ; không quai',
    accessory: '',
    quantity: '01',
    unitPriceWarehouse: '2,000,000 đ',
    intoMoneyWarehouse: '5,000,000 đ',
    conditionProducts: 'Đa hỏng mất linh kiện'
  }
]

const tableChooseWarehouse = ref([])

//add row to the end of table if fill all table
const addLastIndexSellTable = () => {
  tableData.value.push({ ...productForSale })
}

let autoChangeCommune = ref()
let autoChangeDistrict = ref()
let autoChangeProvince = ref()
const autoChangeAddress = () => {
  autoChangeProvince.value = cities.value.find((e) => e.value == formAddress.province)
  autoChangeDistrict.value = district.value.find((e) => e.value == formAddress.district)
  autoChangeCommune.value = ward.value.find((e) => e.value == formAddress.wardCommune)
  customerAddress.value =
    formAddress.detailedAddress +
    ', ' +
    autoChangeCommune.value.label +
    ', ' +
    autoChangeDistrict.value.label +
    ', ' +
    autoChangeProvince.value.label
}

let statusOrder = ref(1)
const changeStatus = (index) => {
  setTimeout(() => {
    statusOrder.value = index
  }, 4000)
}

const addStatusDelay = (index) => {
  setTimeout(() => {
    addStatusOrder(index)
  }, 4000)
}

// fake trạng thái đơn hàng cho thuê

const priceChangeOrders = ref(false)
let countPriceChange = 0
const changePriceRowTable = (props) => {
  if (props.row.rentalUnitPrice != props.row.rentalFee && countPriceChange == 0 && type == 'add') {
    countPriceChange++
    priceChangeOrders.value = true
    arrayStatusOrder.value.splice(0, arrayStatusOrder.value.length)
    arrayStatusOrder.value.push({
      label: 'Duyệt giá thay đổi',
      value: 1,
      isActive: true
    })
  }
}

interface statusOrderType {
  label: string
  value: number
  isActive?: boolean
}
let arrayStatusOrder = ref(Array<statusOrderType>())
arrayStatusOrder.value.pop()
if (type == 'add' && priceChangeOrders.value == false)
  arrayStatusOrder.value.push({
    label: 'Chốt đơn hàng',
    value: 2,
    isActive: true
  })

const addStatusOrder = (index) => {
  switch (index) {
    case 1:
      arrayStatusOrder.value.push({
        label: 'Duyệt giá thay đổi',
        value: 1
      })
      break
    case 2:
      ;(arrayStatusOrder.value[arrayStatusOrder.value.length - 1].isActive = false),
        arrayStatusOrder.value.push({
          label: 'Chốt đơn hàng',
          value: 2,
          isActive: true
        })
      break
    case 3:
      ;(arrayStatusOrder.value[arrayStatusOrder.value.length - 1].isActive = false),
        arrayStatusOrder.value.push({
          label: 'Bắt đầu thuê',
          value: 3,
          isActive: true
        })
      break
    case 4:
      ;(arrayStatusOrder.value[arrayStatusOrder.value.length - 1].isActive = false),
        arrayStatusOrder.value.push({
          label: 'Hết hạn thuê',
          value: 4,
          isActive: true
        })
      break
    case 5:
      ;(arrayStatusOrder.value[arrayStatusOrder.value.length - 1].isActive = false),
        arrayStatusOrder.value.push({
          label: 'Duyệt trả hàng trước hạn',
          value: 5,
          isActive: true
        })
      break
    case 6:
      ;(arrayStatusOrder.value[arrayStatusOrder.value.length - 1].isActive = false),
        arrayStatusOrder.value.push({
          label: 'Đối soát & kết thúc',
          value: 6,
          isActive: true
        })
      break
    case 7:
      ;(arrayStatusOrder.value[arrayStatusOrder.value.length - 1].isActive = false),
        arrayStatusOrder.value.push({
          label: 'Trả hàng hết hạn',
          value: 7,
          isActive: true
        })
      break

    case 8:
      ;(arrayStatusOrder.value[arrayStatusOrder.value.length - 1].isActive = false),
        arrayStatusOrder.value.push({
          label: 'Bắt đầu gia hạn thuê',
          value: 8,
          isActive: true
        })
      break
    case 9:
      ;(arrayStatusOrder.value[arrayStatusOrder.value.length - 1].isActive = false),
        arrayStatusOrder.value.push({
          label: 'Kết thúc gia hạn thuê',
          value: 9,
          isActive: true
        })
      break
    case 10:
      if (arrayStatusOrder.value.length > 0) {
        arrayStatusOrder.value[arrayStatusOrder.value.length - 1].isActive = false
        arrayStatusOrder.value.push({
          label: 'Hủy đơn hàng',
          value: 10,
          isActive: true
        })
      } else {
        arrayStatusOrder.value.push({
          label: 'Hủy đơn hàng',
          value: 10,
          isActive: true
        })
      }
      break
  }
}

// Bút toán bổ sung
const dialogAccountingEntryAdditional = ref(false)
const tableAccountingEntry = ref([
  {
    content: 'Trả lại tiền cọc cho khách',
    collected: '',
    spent: '10,000,000 đ',
    intoMoney: '10,000,000 đ'
  }
])

let dataEdit = ref()
const nameDialog = ref('')

function openBillDialog() {
  dialogRentalPaymentInformation.value = !dialogRentalPaymentInformation.value
  nameDialog.value = 'bill'
}

function openDepositDialog() {
  dialogDepositSlip.value = !dialogDepositSlip.value
  nameDialog.value = 'deposit'
}

function openReceiptDialog() {
  getReceiptCode()
  dialogInformationReceipts.value = !dialogInformationReceipts.value
  nameDialog.value = 'Phiếu thu'
}

function printPage(id: string) {
  const prtHtml = document.getElementById(id)?.innerHTML
  let stylesHtml = ''
  for (const node of [...document.querySelectorAll('link[rel="stylesheet"], style')]) {
    stylesHtml += node.outerHTML
  }
  const WinPrint = window.open(
    '',
    '',
    'left=0,top=0,width=1000,height=1100,toolbar=0,scrollbars=0,status=0'
  )
  WinPrint?.document.write(`<!DOCTYPE html>
                <html>
                  <head>
                    ${stylesHtml}
                  </head>
                  <body>
                    ${prtHtml}
                  </body>
                </html>`)

  WinPrint?.document.close()
  WinPrint?.focus()
  setTimeout(() => {
    WinPrint?.print()
    WinPrint?.close()
  }, 500)
}

const recharger = ref('Trần Hữu Dương | 0998844533')
// Lý do thu tiền
const inputReasonCollectMoney = ref()

const getOrderStransactionList = async () => {
  const transaction = await getOrderTransaction({ id: id })
  debtTable.value = transaction.data
}

// Thêm mã phiếu thu vào debtTable
const handleChangeReceipts = () => {
  if (newTable.value?.length) {
    newTable.value.forEach((val) => {
      debtTable.value.forEach((e) => {
        if (e.content == val.content) {
          e.receiptOrPaymentVoucherId = codeReceipts.value
        }
      })
    })
  }
}

// Thêm mã phiếu chi vào debtTable
const handleChangeExpenditures = () => {
  if (newTable.value?.length) {
    newTable.value.forEach((val) => {
      debtTable.value.forEach((e) => {
        if (e.content == val.content) {
          e.receiptOrPaymentVoucherId = codeExpenditures.value
        }
      })
    })
  }
}

// Thêm mã phiếu đề nghị thanh toán vào debtTable
const handleChangePaymentRequest = () => {
  if (newTable.value?.length) {
    newTable.value.forEach((val) => {
      debtTable.value.forEach((e) => {
        if (e.content == val.content) {
          e.paymentProposal = codePaymentRequest.value
        }
      })
    })
  }
}

// input nhập tiền viết bằng chữ
const enterMoney = ref()
const formReceipts = ref()
const moneyReceipts = ref(105000000)
const inputRecharger = ref()

const getFormReceipts = () => {
  if (enterMoney.value) {
    formReceipts.value = {
      sellOrderCode: ruleForm.orderCode,
      codeReceipts: codeReceipts.value,
      recharger: inputRecharger.value,
      moneyReceipts: moneyReceipts.value,
      reasonCollectingMoney: inputReasonCollectMoney.value,
      enterMoney: enterMoney.value,
      payment: payment.value == 0 ? 'Tiền mặt' : 'Tiền thẻ'
    }
  } else {
    ElMessage({
      showClose: true,
      message: 'Vui lòng nhập tiền bằng chữ',
      type: 'error'
    })
  }
}

// Lấy bảng lịch sử nhập xuất đổi trả
const getReturnRequestTable = async () => {
  const res = await getReturnRequest({ CustomerOrderId: id })
  const optionsReturnRequest = res.data
  if (Array.isArray(unref(optionsReturnRequest)) && optionsReturnRequest?.length > 0) {
    historyTable.value = optionsReturnRequest.map((e) => ({
      createdAt: e.returnRequestInfo?.createdAt ?? '',
      productPropertyId: e.productPropertyId,
      productPropertyName: e.productPropertyName,
      accessory: e.accessory,
      quantity: e.quantity,
      unitName: e.unitName,
      returnDetailType: e.returnDetailType,
      returnDetailTypeName: e.returnDetailTypeName,
      returnDetailStatusName: e.returnDetailStatusName
    }))
  }
}

// Thêm mới phiếu thu
let objidPT = ref()
let idPT = ref()
const postPT = async () => {
  const payload = {
    Code: codeReceipts.value,
    TotalMoney: 21325465,
    TypeOfPayment: 1,
    status: 1,
    PeopleType: 1,
    PeopleId: 2,
    OrderId: id,
    Type: 0,
    Description: inputReasonCollectMoney.value,
    AccountingEntryId: undefined
  }
  const formDataPayLoad = FORM_IMAGES(payload)
  objidPT.value = await addTPV(formDataPayLoad)
  idPT.value = objidPT.value.receiptAndpaymentVoucherId
}

// Thêm mới phiếu chi
let objidPC = ref()
let idPC = ref()
const postPC = async () => {
  const payload = {
    Code: codeReceipts.value,
    TotalMoney: 21325465,
    TypeOfPayment: 1,
    status: 1,
    PeopleType: 1,
    PeopleId: 2,
    OrderId: 117,
    Type: 1,
    Description: inputReasonCollectMoney.value,
    AccountingEntryId: undefined
  }
  const formDataPayLoad = FORM_IMAGES(payload)
  objidPC.value = await addTPV(formDataPayLoad)
  idPC.value = objidPC.value.receiptAndpaymentVoucherId
}

// Lấy chi tiết phiếu thu chi
let formDetailPaymentReceipt = ref()
const getDetailPayment = () => {
  openReceiptDialog()
}

// Thêm mới phiếu đề nghị thanh toán
let objIdPayment = ref()
let idPayment = ref()
const postPaymentRequest = async () => {
  const payload = {
    Code: codePaymentRequest.value,
    TotalMoney: 121325,
    PaymentType: 0,
    PeopleId: 2,
    status: 0,
    PeopleType: 1,
    OrderId: id,
    Description: '',
    Document: undefined,
    AccountingEntryId: undefined
  }
  const formDataPayLoad = FORM_IMAGES(payload)
  objIdPayment.value = await addDNTT(formDataPayLoad)
  idPayment.value = objIdPayment.value.paymentRequestId
}

// Thêm bút toán cho đơn hàng
let childrenTable = ref()
let idStransaction = ref()
let objOrderStransaction = ref()
const postOrderStransaction = async (index: number) => {
  childrenTable.value = tableData.value.map((val) => ({
    merchadiseTobePayforId: parseInt(val.productPropertyId),
    quantity: val.quantity
  }))
  childrenTable.value.pop()
  codeReturnRequest.value = autoCodeReturnRequest
  codeReturnRequest.value = autoCodeReturnRequest
  const payload = {
    orderId: id,
    content:
      index == 1
        ? t('formDemo.collectRentalDeposit')
        : index == 2
        ? feePaymentPeriod.value
        : tableAccountingEntry.value[0].content,
    paymentRequestId: null,
    receiptOrPaymentVoucherId: null,
    receiveMoney: tableAccountingEntry.value[0].collected
      ? parseInt(tableAccountingEntry.value[0].collected)
      : 0,
    paidMoney: tableAccountingEntry.value[0].spent
      ? parseInt(tableAccountingEntry.value[0].spent)
      : 0,
    deibt: 0,
    typeOfPayment: 0,
    paymentMethods: 1,
    status: 0,
    isReceiptedMoney: 0,
    typeOfMoney: 1,
    merchadiseTobePayfor: childrenTable.value
  }

  objOrderStransaction.value = await addOrderStransaction(payload)
  idStransaction.value = objOrderStransaction.value.paymentRequestId
  getOrderStransactionList()
}
// Call api chi tiết bút toán theo id
let formAccountingId = ref()
let tableSalesSlip = ref()
const getAccountingEntry = async (index, num) => {
  const res = await getDetailAccountingEntryById({ id: index })
  formAccountingId.value = { ...res.data }
  tableSalesSlip.value = formAccountingId.value.paidMerchandises
  tableAccountingEntry.value = formAccountingId.value.accountingEntry
  if (num == 1) dialogRentalPaymentInformation.value = true
  else if (num == 2) dialogDepositSlip.value = true
  else if (num == 3) dialogAccountingEntryAdditional.value = true
}

// Dialog trả hàng trước hạn
const dialogReturnAheadOfTime = ref(false)

// Dialog trả hàng hết hạn
const dialogReturnExpired = ref(false)

const getReceiptCode = async () => {
  codeReceipts.value = await getReceiptPaymentVoucher()
}

//TruongNgo
const rentReturnOrder = ref({} as any)
let productArray: any = []
const listOfOrderProduct = ref()
const setDataForReturnOrder = () => {
  productArray = tableData.value.map((row) => row.productPropertyId)
  listOfOrderProduct.value = listProductsTable.value.filter((item) => {
    return productArray.includes(item.productPropertyId)
  })
  rentReturnOrder.value.orderCode = curDate
  rentReturnOrder.value.leaseTerm = ruleForm.leaseTerm
  rentReturnOrder.value.period = ruleForm.rentalPeriod
  rentReturnOrder.value.name = infoCompany.name
  rentReturnOrder.value.customerAddress = customerAddress
  rentReturnOrder.value.phone = infoCompany.phone
  rentReturnOrder.value.tableData = tableData.value
}
// Tạo mới yêu cầu đổi trả
const postReturnRequest = async (reason) => {
  let tableReturnPost = [{}]
  if (rentReturnOrder.value.tableData.length < 2) {
    return
  }
  rentReturnOrder.value.tableData.pop()
  tableReturnPost = rentReturnOrder.value.tableData.map((e) => ({
    productPropertyId: parseInt(e.productPropertyId),
    quantity: e.quantity,
    accessory: e.accessory
  }))

  const payload = {
    customerOrderId: id,
    code: autoCodeReturnRequest,
    name: 'Đổi trả đơn hàng',
    description: formatOrderReturnReason(reason),
    returnRequestType: 1,
    details: tableReturnPost
  }
  await createReturnRequest(payload)
}

const radioWarehouseId = ref()
const indexRowWarehouse = ref()
// Lấy danh sách kho theo mã sản phẩm và sericeType
const callApiWarehouse = async (scope) => {
  const data = scope.row
  indexRowWarehouse.value = scope.$index

  const res = await GetProductPropertyInventory({
    ProductPropertyId: data.productPropertyId,
    ServiceType: 1
  })
  tableChooseWarehouse.value = res.data.map((val) => ({
    warehouseCheckbox: val.id,
    name: val.name,
    inventory: val.inventory
  }))
}

const openDialogChooseWarehouse = ref(false)
const showIdWarehouse = (scope) => {
  radioWarehouseId.value = scope.row.warehouseCheckbox
  tableData.value[indexRowWarehouse.value].warehouseId = radioWarehouseId.value
  tableData.value[indexRowWarehouse.value].warehouseName = scope.row.name
}

const addRow = () => {
  rentReturnOrder.value.tableData.push({ ...productForSale })
}
const removeRow = (index) => {
  rentReturnOrder.value.tableData.splice(index, 1)
}

const doubleDisabled = ref(false)
const showPromo = ref(false)

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.warning(
    `${t('reuse.limitUploadImages')}. ${t('reuse.imagesYouChoose')}: ${files.length}. ${t(
      'reuse.total'
    )}${files.length + uploadFiles.length}`
  )
}

// Cập nhật lại giá tiền khi thay đổi VAT
const valueVAT = ref()
const VAT = ref(false)
const changePriceVAT = () => {
  autoCalculateOrder()
}

// check disabled
const disabledEdit = ref(false)

const autoCollaboratorCommission = (index) => {
  optionsCollaborators.value.map((val) => {
    if (val.value == index) ruleForm.discount = val.collaboratorCommission
  })
}

onBeforeMount(() => {
  callApiCollaborators()
  callCustomersApi()
  callApiProductList()
  editData()
  if (type == 'add') {
    doubleDisabled.value = true
    ruleForm.orderCode = curDate
    rentalOrderCode.value = autoRentalOrderCode
    codeExpenditures.value = autoCodeExpenditures
    codePaymentRequest.value = autoCodePaymentRequest
  }
})
</script>

<template>
  <div class="demo-collapse dark:bg-[#141414]">
    <el-collapse v-model="activeName" @change="collapseChangeEvent">
      <!-- phieu in -->
      <div id="billDepositPrint">
        <slot>
          <billPrint :nameDialog="nameDialog" />
        </slot>
      </div>

      <div id="recpPaymentPrint">
        <slot>
          <receiptsPaymentPrint
            v-if="getFormReceipts"
            :dataEdit="getFormReceipts"
            :nameDialog="nameDialog"
          />
        </slot>
      </div>

      <div id="IPRFormPrint">
        <slot>
          <!-- <el-dialog v-model="testDialog" width="40%" align-center> -->
          <paymentOrderPrint />
          <!-- </el-dialog> -->
        </slot>
      </div>

      <!-- Dialog Thêm nhanh khách hàng -->
      <el-dialog
        v-model="dialogAddQuick"
        class="font-bold"
        width="40%"
        align-center
        :title="t('formDemo.QuicklyAddCustomers')"
      >
        <div v-if="valueClassify == true">
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
              <el-input
                v-model="addQuickCustomerName"
                style="width: 100%"
                :placeholder="t('formDemo.enterCompanyName')"
              />
            </div>
            <div class="flex gap-4 pt-4 pb-4">
              <label class="w-[30%] text-right"
                >{{ t('formDemo.taxCode') }} <span class="text-red-500">*</span></label
              >
              <el-input
                v-model="quickTaxCode"
                style="width: 100%"
                :placeholder="t('formDemo.enterTaxCode')"
              />
            </div>
            <div class="flex gap-4 pt-4 pb-4">
              <label class="w-[30%] text-right">{{ t('formDemo.representative') }}</label>
              <el-input
                v-model="quickRepresentative"
                style="width: 100%"
                :placeholder="t('formDemo.enterRepresentative')"
              />
            </div>
            <div class="flex gap-4 pt-4 pb-4">
              <label class="w-[30%] text-right"
                >{{ t('reuse.phoneNumber') }} <span class="text-red-500">*</span></label
              >
              <el-input
                v-model="quickPhoneNumber"
                style="width: 100%"
                :placeholder="t('formDemo.enterPhoneNumber')"
              />
            </div>
            <div class="flex gap-4 pt-4 pb-4">
              <label class="w-[30%] text-right">{{ t('reuse.email') }}</label>
              <el-input
                v-model="quickEmail"
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
              <el-input
                v-model="addQuickCustomerName"
                style="width: 100%"
                :placeholder="t('formDemo.enterCustomerName')"
              />
            </div>

            <div class="flex gap-4 pt-4 pb-4">
              <label class="w-[30%] text-right"
                >{{ t('reuse.phoneNumber') }} <span class="text-red-500">*</span></label
              >
              <el-input
                v-model="quickPhoneNumber"
                style="width: 100%"
                :placeholder="t('formDemo.enterPhoneNumber')"
              />
            </div>
            <div class="flex gap-4 pt-4 pb-4">
              <label class="w-[30%] text-right">{{ t('reuse.email') }}</label>
              <el-input
                v-model="quickEmail"
                style="width: 100%"
                :placeholder="t('formDemo.enterEmail')"
              />
            </div>
          </div>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button
              type="primary"
              class="w-[150px]"
              @click.stop.prevent="
                () => {
                  dialogAddQuick = false
                  createQuickCustomer()
                }
              "
              >{{ t('reuse.save') }}</el-button
            >
            <el-button class="w-[150px]" @click.stop.prevent="dialogAddQuick = false">{{
              t('reuse.exit')
            }}</el-button>
          </span>
        </template>
      </el-dialog>

      <!-- Dialog Thêm nhanh sản phẩm -->
      <el-dialog
        v-model="dialogAddProduct"
        :title="t('formDemo.quicklyAddProducts')"
        class="font-bold"
        width="40%"
        align-center
      >
        <div>
          <el-divider />
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{
              t('router.productCategoryProducts')
            }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
          <div>
            <div class="flex gap-4 pt-4 pb-4 items-center">
              <label class="w-[30%] text-right"
                >{{ t('reuse.selectCategory') }} <span class="text-red-500">*</span></label
              >
              <el-tree-select
                v-model="chooseCategory"
                :data="optionsCategory"
                :placeholder="t('reuse.selectCategory')"
              />
            </div>
            <div class="flex gap-4 pt-4 pb-4 items-center">
              <label class="w-[30%] text-right">{{ t('router.productCategoryBrand') }} </label>
              <el-select v-model="chooseBrand" :placeholder="t('reuse.chooseBrand')">
                <el-option
                  v-for="item in optionsBrand"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div class="flex gap-4 pt-4 pb-4 items-center">
              <label class="w-[30%] text-right"
                >{{ t('router.productCategoryUnit') }} <span class="text-red-500">*</span></label
              >
              <el-select v-model="chooseUnit" :placeholder="t('reuse.chooseUnit')">
                <el-option
                  v-for="item in optionsUnit"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div class="flex gap-4 pt-4 pb-4 items-center">
              <label class="w-[30%] text-right">{{ t('router.productCategoryOrigin') }}</label>
              <el-select v-model="chooseOrigin" :placeholder="t('reuse.chooseOrigin')">
                <el-option
                  v-for="item in optionsOrigin"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </div>
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('formDemo.productInfomation') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
        </div>
        <div>
          <div class="flex gap-4 pt-4 pb-4 items-center">
            <label class="w-[30%] text-right"
              >{{ t('reuse.productCode') }} <span class="text-red-500">*</span></label
            >
            <el-select
              filterable
              allow-create
              v-model="quickProductCode"
              :placeholder="t('formDemo.AddSelectProductCode')"
              @change="(data) => handleChangeQuickAddProduct(data)"
            >
              <el-option
                v-for="item in listProductsTable"
                :key="item.productPropertyId"
                :label="item.productCode"
                :value="item.productPropertyId"
              />
            </el-select>
          </div>
          <div class="flex gap-4 pt-4 pb-4 items-center">
            <label class="w-[30%] text-right"
              >{{ t('reuse.managementCode') }} <span class="text-red-500">*</span></label
            >
            <el-input
              v-model="quickManagementCode"
              style="width: 100%"
              :placeholder="t('formDemo.addManagementCode')"
            />
          </div>
          <div class="flex gap-4 pt-4 pb-4 items-center">
            <label class="w-[30%] text-right"
              >{{ t('reuse.productName') }} <span class="text-red-500">*</span></label
            >
            <el-input
              v-model="quickProductName"
              style="width: 100%"
              :placeholder="t('formDemo.EnterNameDescription')"
            />
          </div>
          <div class="flex gap-4 pt-4 pb-4 items-center">
            <label class="w-[30%] text-right">{{ t('formDemo.shortDescription') }}</label>
            <el-input
              v-model="quickDescription"
              style="width: 100%"
              :placeholder="t('formDemo.EnterNameDescription')"
            />
          </div>
          <div class="flex gap-4 pt-4 pb-4 items-center">
            <label class="w-[30%] text-right">{{ t('formDemo.productCharacteristics') }}</label>
            <el-select
              v-model="productCharacteristics"
              multiple
              :placeholder="t('formDemo.selectFeature')"
            >
              <el-option
                v-for="item in optionsCharacteristic"
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
              class="btn"
              type="primary"
              @click="
                () => {
                  dialogAddProduct = false
                  postQuickCustomer()
                }
              "
              >{{ t('reuse.save') }}</el-button
            >
            <el-button class="btn" @click="dialogAddProduct = false">{{
              t('reuse.exit')
            }}</el-button>
          </span>
        </template>
      </el-dialog>

      <!-- Dialog Thông tin phiếu thu -->
      <el-dialog
        v-model="dialogInformationReceipts"
        :title="t('formDemo.informationReceipts')"
        class="font-bold"
        width="40%"
        align-center
      >
        <div>
          <el-divider />
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('formDemo.documentsAttached') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
          <div class="flex gap-4 pt-4 pb-4 items-center">
            <label class="w-[30%] text-right">{{ t('formDemo.orderCode') }}</label>
            <div class="w-[100%] text-xl">{{ ruleForm.orderCode }}</div>
          </div>
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('formDemo.generalInformation') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
          <div>
            <div class="flex gap-4 pt-4 items-center">
              <label class="w-[30%] text-right">{{ t('formDemo.receiptsCode') }}</label>
              <div class="w-[100%] text-xl">{{ codeReceipts }}</div>
            </div>
            <div class="flex gap-4 pt-4 items-center">
              <label class="w-[30%] text-right"
                >{{ t('formDemo.recharger') }} <span class="text-red-500">*</span></label
              >
              <el-select v-model="recharger" placeholder="Select">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div class="flex gap-4 pt-4 pb-6 items-center">
              <label class="w-[30%] text-right"
                >{{ t('formDemo.reasonCollectingMoney') }}
                <span class="text-red-500">*</span></label
              >
              <el-input
                style="width: 100%"
                :placeholder="t('formDemo.enterReasonCollectingMoney')"
              />
            </div>
          </div>
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('formDemo.billingInformation') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
        </div>
        <div>
          <div class="flex gap-4 pt-2 items-center">
            <label class="w-[30%] text-right">Mã phiếu thu</label>
            <div class="w-[100%] text-xl">105,000,000 đ</div>
          </div>
          <div class="flex gap-4 pt-4 items-center">
            <label class="w-[30%] text-right"
              >{{ t('formDemo.writtenWords') }} <span class="text-red-500">*</span></label
            >
            <el-input style="width: 100%" :placeholder="t('formDemo.writtenWords')" />
          </div>
          <div class="flex gap-4 pt-4 items-center">
            <label class="w-[30%] text-right">{{ t('formDemo.formPayment') }}</label>
            <el-select v-model="payment" placeholder="Select">
              <el-option
                v-for="item in choosePayment"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="flex gap-4 pt-4 items-center">
            <label class="w-[30%] text-right">Trạng thái</label>
            <div class="flex items-center w-[100%]">
              <span
                class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-neutral-900 dark:bg-transparent"
              ></span>
              <span class="box dark:text-black">
                Khởi tạo & ghi sổ
                <span class="triangle-right"> </span>
              </span>
            </div>
          </div>
        </div>
        <template #footer>
          <div class="flex justify-between">
            <el-button @click="dialogInformationReceipts = false">{{
              t('button.print')
            }}</el-button>
            <div>
              <span class="dialog-footer">
                <el-button
                  type="primary"
                  @click="
                    () => {
                      dialogInformationReceipts = false
                      postPT()
                      handleChangeReceipts()
                    }
                  "
                  >{{ t('formDemo.saveRecordDebts') }}</el-button
                >
                <el-button @click="dialogInformationReceipts = false">{{
                  t('reuse.exit')
                }}</el-button>
              </span>
            </div>
          </div>
        </template>
      </el-dialog>

      <!-- Dialog Thông tin phiếu chi -->
      <el-dialog
        v-model="dialogPaymentVoucher"
        class="font-bold"
        :title="t('formDemo.paymentVoucherInformation')"
        width="40%"
        align-center
      >
        <div>
          <el-divider />
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('formDemo.documentsAttached') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
          <div class="flex gap-4 pt-4 pb-4 items-center">
            <label class="w-[30%] text-right">{{ t('formDemo.orderCode') }}</label>
            <div class="w-[100%] text-xl">{{ rentalOrderCode }}</div>
          </div>
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('formDemo.generalInformation') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
          <div>
            <div class="flex gap-4 pt-4 items-center">
              <label class="w-[30%] text-right">{{ t('formDemo.codePayment') }}</label>
              <div class="w-[100%] text-xl">{{ codeExpenditures }}</div>
            </div>
            <div class="flex gap-4 pt-4 items-center">
              <label class="w-[30%] text-right"
                >{{ t('formDemo.recharger') }} <span class="text-red-500">*</span></label
              >
              <el-select v-model="recharger" placeholder="Select">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div class="flex gap-4 pt-4 pb-6 items-center">
              <label class="w-[30%] text-right"
                >{{ t('formDemo.reasonCollectingMoney') }}
                <span class="text-red-500">*</span></label
              >
              <el-input
                style="width: 100%"
                :placeholder="t('formDemo.enterReasonCollectingMoney')"
              />
            </div>
          </div>
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('formDemo.billingInformation') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
        </div>
        <div>
          <div class="flex gap-4 pt-2 items-center">
            <label class="w-[30%] text-right">Mã phiếu thu</label>
            <div class="w-[100%] text-xl">105,000,000 đ</div>
          </div>
          <div class="flex gap-4 pt-4 items-center">
            <label class="w-[30%] text-right"
              >{{ t('formDemo.writtenWords') }} <span class="text-red-500">*</span></label
            >
            <el-input style="width: 100%" :placeholder="t('formDemo.writtenWords')" />
          </div>
          <div class="flex gap-4 pt-4 items-center">
            <label class="w-[30%] text-right">{{ t('formDemo.formPayment') }}</label>
            <el-select v-model="payment" placeholder="Select">
              <el-option
                v-for="item in choosePayment"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="flex gap-4 pt-4 items-center">
            <label class="w-[30%] text-right">Trạng thái</label>
            <div class="flex items-center w-[100%]">
              <span
                class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-neutral-900 dark:bg-transparent"
              ></span>
              <span class="box dark:text-black">
                Khởi tạo & ghi sổ
                <span class="triangle-right"> </span>
              </span>
            </div>
          </div>
        </div>
        <template #footer>
          <div class="flex justify-between">
            <el-button @click="dialogPaymentVoucher = false">{{ t('button.print') }}</el-button>
            <div>
              <span class="dialog-footer">
                <el-button
                  type="primary"
                  @click="
                    () => {
                      dialogPaymentVoucher = false
                      handleChangeExpenditures()
                      postPC()
                    }
                  "
                  >{{ t('formDemo.saveRecordDebts') }}</el-button
                >
                <el-button @click="dialogPaymentVoucher = false">{{ t('reuse.exit') }}</el-button>
              </span>
            </div>
          </div>
        </template>
      </el-dialog>

      <!-- Dialog Thông tin phiếu đề nghị thanh toán -->
      <el-dialog
        v-model="dialogIPRForm"
        class="font-bold"
        :title="t('formDemo.informationPaymentRequestForm')"
        width="40%"
        align-center
      >
        <div>
          <el-divider />
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('formDemo.documentsAttached') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
          <div class="flex gap-4 pt-4 pb-4 items-center">
            <label class="w-[30%] text-right">{{ t('formDemo.orderCode') }}</label>
            <div class="w-[100%] text-xl">{{ rentalOrderCode }}</div>
          </div>
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('router.analysis') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
          <div>
            <div class="flex gap-4 pt-4 items-center">
              <label class="w-[30%] text-right">{{ t('formDemo.PaymentRequestCode') }}</label>
              <div class="w-[100%] text-xl text-black dark:text-light-50">{{
                codePaymentRequest
              }}</div>
            </div>
            <div class="flex gap-4 pt-4 items-center">
              <label class="w-[30%] text-right"
                >{{ t('formDemo.proponent') }} <span class="text-red-500">*</span></label
              >
              <el-select v-model="recharger" placeholder="Select">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div class="flex gap-4 pt-4 pb-4 items-center">
              <label class="w-[30%] text-right"
                >{{ t('formDemo.reasonsSpendMoney') }} <span class="text-red-500">*</span></label
              >
              <el-input
                style="width: 100%"
                :placeholder="t('formDemo.enterReasonPaymentRequest')"
              />
            </div>
          </div>
          <div class="flex items-center">
            <span class="w-[50%] text-base font-bold">{{
              t('formDemo.detailedListExpenses')
            }}</span>
            <span class="block h-1 w-[50%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
          <div class="pt-2 pb-2">
            <el-table ref="singleTableRef" :data="detailedListExpenses" border style="width: 100%">
              <el-table-column label="STT" type="index" width="60" align="center" />
              <el-table-column
                prop="numberVouchers"
                :label="t('formDemo.numberVouchers')"
                width="80"
              />
              <el-table-column prop="dayVouchers" :label="t('formDemo.dayVouchers')" width="80" />
              <el-table-column prop="spendFor" :label="t('formDemo.spendFor')" width="120" />
              <el-table-column prop="quantity" :label="t('formDemo.sl')" width="50" />
              <el-table-column prop="unitPrices" :label="t('reuse.unitPrices')">
                <template #default="props">
                  <div class="text-right">{{ props.row.unitPrices }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="intoMoney" :label="t('formDemo.intoMoney')">
                <template #default="props">
                  <div class="text-right">{{ props.row.intoMoney }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="note" :label="t('reuse.note')" width="90" />
            </el-table>
          </div>
          <div class="flex justify-end mr-[90px]">
            <div class="w-[145px] text-right">
              <p class="text-black font-bold dark:text-white">Tổng tiền</p>
            </div>
            <div class="w-[145px] text-right">
              <p class="pr-2 text-black font-bold dark:text-white">đ</p>
            </div>
          </div>
          <span
            class="block h-1 float-right w-[45%] border-t-1 dark:border-[#4c4d4f] mt-2 mb-2"
          ></span>
          <div class="flex w-[100%] justify-end">
            <div class="w-[145px] text-right">
              <p class="mb-2">Đặt cọc</p>
              <p class="text-red-600">Còn lại</p>
            </div>
            <div class="w-[145px] text-right">
              <input
                v-model="inputDeposit"
                class="pr-2 w-[130px] text-right border-1 outline-none rounded mb-2"
              />
              <p class="pr-2 text-red-600">đ</p>
            </div>
            <div class="w-[90px]"></div>
          </div>
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('formDemo.billingInformation') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
        </div>
        <div>
          <div class="flex gap-4 pt-4 items-center">
            <label class="w-[30%] text-right">{{ t('formDemo.amountSpent') }}</label>
            <div class="w-[100%] text-xl">10,000,000 đ</div>
          </div>
          <div class="flex gap-4 pt-4 items-center">
            <label class="w-[30%] text-right"
              >{{ t('formDemo.writtenWords') }} <span class="text-red-500">*</span></label
            >
            <el-input style="width: 100%" :placeholder="t('formDemo.writtenWords')" />
          </div>
          <div class="flex gap-4 pt-4 items-center">
            <label class="w-[30%] text-right"
              >{{ t('formDemo.formPayment') }} <span class="text-red-500">*</span></label
            >
            <el-select v-model="payment" placeholder="Select">
              <el-option
                v-for="item in choosePayment"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="flex gap-4 pt-4 pb-4 items-center">
            <label class="w-[30%] text-right">Trạng thái</label>
            <div class="flex items-center w-[100%]">
              <span
                class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-neutral-900 dark:bg-transparent"
              ></span>
              <span class="box dark:text-black">
                Khởi tạo & ghi sổ
                <span class="triangle-right"> </span>
              </span>
            </div>
          </div>
        </div>
        <template #footer>
          <div class="flex justify-between">
            <el-button @click="dialogIPRForm = false">{{ t('button.print') }}</el-button>
            <div>
              <span class="dialog-footer">
                <el-button
                  type="primary"
                  @click="
                    () => {
                      dialogIPRForm = false
                      handleChangePaymentRequest()
                      postPaymentRequest()
                    }
                  "
                  >{{ t('formDemo.saveRecordDebts') }}</el-button
                >
                <el-button @click="dialogIPRForm = false">{{ t('reuse.exit') }}</el-button>
              </span>
            </div>
          </div>
        </template>
      </el-dialog>

      <!-- Thông tin phiếu thanh toán tiền phí thuê -->
      <el-dialog
        v-model="dialogRentalPaymentInformation"
        class="font-bold"
        :title="t('formDemo.rentalFeePaymentSlipInformation')"
        width="40%"
        align-center
      >
        <div>
          <el-divider />
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('formDemo.orderInformation') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
          <div class="flex pt-4 pb-4 items-center">
            <div class="flex-1">
              <div class="flex gap-4">
                <label class="w-[40%] text-right">{{ t('formDemo.orderCode') }}</label>
                <div class="w-[60%] text-xl text-black font-bold dark:text-light-50">{{
                  rentalOrderCode
                }}</div>
              </div>
              <div class="flex gap-4">
                <label class="w-[40%] text-right">{{ t('reuse.rentalTerm') }}</label>
                <div class="w-[60%] text-black dark:text-light-50">{{
                  ruleForm.leaseTerm == 1
                    ? 'Theo ngày'
                    : ruleForm.leaseTerm == 7
                    ? 'Theo tuần'
                    : 'Theo tháng'
                }}</div>
              </div>
              <div class="flex gap-4">
                <label class="w-[40%] text-right">{{ t('formDemo.rentalPeriod') }}</label>
                <div class="w-[60%] text-black dark:text-light-50"
                  >{{ dateTimeFormat(ruleForm.rentalPeriod[0]) }} đến
                  {{ dateTimeFormat(ruleForm.rentalPeriod[1]) }}</div
                >
              </div>
            </div>

            <div class="flex-1"> QRCode </div>
          </div>
          <div class="flex gap-4 items-center pb-4">
            <label class="w-[20%] text-right">{{ t('formDemo.feePaymentPeriod') }}</label>
            <div class="w-[80%]">
              <el-select v-model="feePaymentPeriod" placeholder="Select">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </div>
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('reuse.customerInfo') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
          <div>
            <div class="flex gap-4 items-center">
              <label class="w-[30%] text-right">{{ t('reuse.customerName') }}</label>
              <div class="w-[100%] text-black dark:text-light-50">{{ infoCompany.name }}</div>
            </div>
            <div class="flex gap-4 items-center">
              <label class="w-[30%] text-right">{{ t('formDemo.address') }}</label>
              <div class="w-[100%] text-black dark:text-light-50">{{ customerAddress }}</div>
            </div>
            <div class="flex gap-4 pb-4 items-center">
              <label class="w-[30%] text-right">{{ t('reuse.phoneNumber') }}</label>
              <div class="w-[100%] text-black dark:text-light-50">{{ infoCompany.phone }}</div>
            </div>
          </div>
          <div class="flex items-center">
            <span class="w-[30%] text-base font-bold break-w">{{
              t('formDemo.rentalProductInformation')
            }}</span>
            <span class="block h-1 w-[70%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
        </div>
        <div class="pt-2 pb-2">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column label="STT" type="index" width="60" align="center" />
            <el-table-column prop="productName" :label="t('formDemo.commodityName')" width="280" />
            <el-table-column prop="quantity" :label="t('reuse.quantity')" width="90" />
            <el-table-column prop="price" :label="t('formDemo.rentalUnitPrice')">
              <template #default="props">
                <div class="text-right">{{ props.row.price }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="hirePrice" :label="t('formDemo.rentalFee')">
              <template #default="props">
                <div class="text-right">{{ props.row.hirePrice }}</div>
              </template>
            </el-table-column>
          </el-table>
          <div class="flex justify-end">
            <div class="w-[145px] text-right">
              <p>{{ t('formDemo.rentalFee') }}</p>
              <p>Khuyến mại</p>
              <p class="text-black font-bold dark:text-white">{{ t('formDemo.totalRentalFee') }}</p>
            </div>
            <div class="w-[145px] text-right">
              <p class="pr-2">{{
                totalPriceOrder != undefined ? changeMoney.format(totalPriceOrder) : '0 đ'
              }}</p>
              <p class="pr-2">đ</p>
              <p class="pr-2 text-black font-bold dark:text-white">{{
                totalPriceOrder != undefined ? changeMoney.format(totalPriceOrder) : '0 đ'
              }}</p>
            </div>
          </div>
        </div>
        <div class="flex items-center">
          <span class="w-[25%] text-base font-bold">{{ t('formDemo.billingInformation') }}</span>
          <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
        </div>
        <div>
          <div class="flex gap-4 pt-2 items-center">
            <label class="w-[30%] text-right">Thanh toán</label>
            <div class="w-[100%]">
              <el-checkbox
                v-model="alreadyPaidForTt"
                :label="t('formDemo.alreadyPaidForTt')"
                size="large"
              />
            </div>
          </div>
          <div class="flex gap-4 pt-2 pb-4 items-center">
            <label class="w-[30%] text-right">{{ t('formDemo.formPayment') }}</label>
            <el-select v-model="payment" placeholder="Select">
              <el-option
                v-for="item in choosePayment"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="flex gap-4 pb-2 items-center">
            <label class="w-[30%] text-right">Trạng thái</label>
            <div class="flex items-center w-[100%]">
              <span
                class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-neutral-900 dark:bg-transparent"
              ></span>
              <span class="box dark:text-black">
                Khởi tạo & ghi sổ
                <span class="triangle-right"> </span>
              </span>
            </div>
          </div>
        </div>
        <template #footer>
          <div class="flex justify-between">
            <el-button @click="printPage('recpPaymentPrint')">{{ t('button.print') }}</el-button>
            <div>
              <span class="dialog-footer">
                <el-button
                  type="primary"
                  @click="
                    () => {
                      dialogRentalPaymentInformation = false
                      postOrderStransaction(2)
                    }
                  "
                  >{{ t('formDemo.saveRecordDebts') }}</el-button
                >
                <el-button @click="dialogRentalPaymentInformation = false">{{
                  t('reuse.exit')
                }}</el-button>
              </span>
            </div>
          </div>
        </template>
      </el-dialog>

      <!-- Thông tin phiếu thanh toán tiền cọc thuê -->
      <el-dialog
        v-model="dialogDepositSlip"
        :title="t('formDemo.depositSlipInformation')"
        width="40%"
        align-center
      >
        <div>
          <el-divider />
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('formDemo.orderInformation') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
          <div class="flex pt-4 pb-4 items-center">
            <div class="flex-1">
              <div class="flex gap-4">
                <label class="w-[40%] text-right">{{ t('formDemo.orderCode') }}</label>
                <div class="w-[60%] text-xl text-black font-bold dark:text-light-50">{{
                  rentalOrderCode
                }}</div>
              </div>
              <div class="flex gap-4">
                <label class="w-[40%] text-right">{{ t('reuse.rentalTerm') }}</label>
                <div class="w-[60%] text-black dark:text-light-50">{{
                  ruleForm.leaseTerm == 1
                    ? 'Theo ngày'
                    : ruleForm.leaseTerm == 7
                    ? 'Theo tuần'
                    : 'Theo tháng'
                }}</div>
              </div>
              <div class="flex gap-4">
                <label class="w-[40%] text-right">{{ t('formDemo.rentalPeriod') }}</label>
                <div class="w-[60%] text-black dark:text-light-50"
                  >{{ dateTimeFormat(ruleForm.rentalPeriod[0]) }} đến
                  {{ dateTimeFormat(ruleForm.rentalPeriod[1]) }}</div
                >
              </div>
            </div>

            <div class="flex-1"> QRCode </div>
          </div>
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('reuse.customerInfo') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
          <div>
            <div class="flex gap-4 items-center">
              <label class="w-[30%] text-right">{{ t('reuse.customerName') }}</label>
              <div class="w-[100%] text-black dark:text-light-50">{{ infoCompany.name }}</div>
            </div>
            <div class="flex gap-4 items-center">
              <label class="w-[30%] text-right">{{ t('formDemo.address') }}</label>
              <div class="w-[100%] text-black dark:text-light-50">{{ customerAddress }}</div>
            </div>
            <div class="flex gap-4 pb-4 items-center">
              <label class="w-[30%] text-right">{{ t('reuse.phoneNumber') }}</label>
              <div class="w-[100%] text-black dark:text-light-50">{{ infoCompany.phone }}</div>
            </div>
          </div>
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold break-w">{{
              t('formDemo.rentalProductInformation')
            }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
        </div>
        <div class="pt-2 pb-2">
          <el-table ref="singleTableRef" :data="tableData" border style="width: 100%">
            <el-table-column label="STT" type="index" width="60" align="center" />
            <el-table-column prop="productName" :label="t('formDemo.commodityName')" width="420" />
            <el-table-column prop="quantity" :label="t('reuse.quantity')" width="90" />
            <el-table-column prop="depositePrice" :label="t('formDemo.intoARentalDeposit')">
              <template #default="props">
                <div class="text-right">{{ changeMoney.format(props.row.depositePrice) }}</div>
              </template>
            </el-table-column>
          </el-table>
          <div class="flex justify-end">
            <div class="w-[145px] text-right">
              <p class="text-black font-bold dark:text-white pt-4">{{
                t('formDemo.totalDeposit')
              }}</p>
            </div>
            <div class="w-[145px] text-right pt-4">
              <p class="pr-2 text-black font-bold dark:text-white">{{
                totalDeposit ? changeMoney.format(totalDeposit) : '0 đ'
              }}</p>
            </div>
          </div>
        </div>
        <div class="flex items-center">
          <span class="w-[25%] text-base font-bold">{{ t('formDemo.billingInformation') }}</span>
          <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
        </div>
        <div>
          <div class="flex gap-4 pt-2 items-center">
            <label class="w-[30%] text-right">{{ t('formDemo.depositPayment') }}</label>
            <div class="w-[100%]">
              <el-checkbox
                v-model="alreadyPaidForTt"
                :label="t('formDemo.alreadyPaidForTt')"
                size="large"
              />
            </div>
          </div>
          <div class="flex gap-4 pt-2 pb-4 items-center">
            <label class="w-[30%] text-right">{{ t('formDemo.formPayment') }}</label>
            <el-select v-model="payment" placeholder="Select">
              <el-option
                v-for="item in choosePayment"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="flex gap-4 pb-2 items-center">
            <label class="w-[30%] text-right">Trạng thái</label>
            <div class="flex items-center w-[100%]">
              <span
                class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-neutral-900 dark:bg-transparent"
              ></span>
              <span class="box dark:text-black">
                Khởi tạo & ghi sổ
                <span class="triangle-right"> </span>
              </span>
            </div>
          </div>
        </div>
        <template #footer>
          <div class="flex justify-between">
            <el-button @click="printPage('billDepositPrint')">{{ t('button.print') }}</el-button>
            <div>
              <span class="dialog-footer">
                <el-button
                  type="primary"
                  @click="
                    () => {
                      dialogDepositSlip = false
                      postOrderStransaction(1)
                    }
                  "
                  >{{ t('formDemo.saveRecordDebts') }}</el-button
                >
                <el-button @click="dialogDepositSlip = false">{{ t('reuse.exit') }}</el-button>
              </span>
            </div>
          </div>
        </template>
      </el-dialog>

      <!-- Thông tin phiếu nhập kho trả hàng cho thuê -->
      <el-dialog
        v-model="dialogWarehouseRentalPayment"
        class="font-bold"
        :title="t('formDemo.informationWarehouseReceiptRentalPayment')"
        width="50%"
        align-center
      >
        <div>
          <el-divider />
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('formDemo.documentsAttached') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
          <div>
            <div class="flex gap-4 items-center">
              <label class="w-[30%] text-right">{{ t('formDemo.orderCode') }}</label>
              <div class="w-[100%] text-xl text-black font-bold dark:text-light-50">BH24354</div>
            </div>
            <div class="flex gap-4 items-center">
              <label class="w-[30%] text-right">{{ t('reuse.rentalTerm') }}</label>
              <div class="w-[100%] text-black dark:text-light-50">Theo tháng</div>
            </div>
            <div class="flex gap-4 items-center pb-4">
              <label class="w-[30%] text-right">{{ t('formDemo.rentalPeriod') }}</label>
              <div class="w-[100%] text-black dark:text-light-50">20/02/2022 đến 20/04/2022</div>
            </div>
          </div>
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('router.analysis') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
          <div>
            <div class="flex gap-4 pt-4 items-center">
              <label class="w-[30%] text-right">{{ t('formDemo.receiptCode') }}</label>
              <div class="w-[100%] text-xl text-black font-bold dark:text-light-50">NK345654</div>
            </div>
            <div class="flex gap-4 pt-4 items-center">
              <label class="w-[30%] text-right"
                >{{ t('formDemo.warehouser') }} <span class="text-red-500">*</span></label
              >
              <el-select v-model="recharger" placeholder="Select">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div class="flex gap-4 pt-4 pb-4 items-center">
              <label class="w-[30%] text-right">{{ t('formDemo.returnReason') }}</label>
              <span class="w-[100%]">Trả hàng trước hạn</span>
            </div>
          </div>
          <div class="flex items-center">
            <span class="w-[30%] text-base font-bold break-w">{{
              t('formDemo.rentalProductInformation')
            }}</span>
            <span class="block h-1 w-[70%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
        </div>
        <div class="pt-2 pb-2">
          <el-table ref="singleTableRef" :data="tableWarehouse" border style="width: 100%">
            <el-table-column label="STT" type="index" width="60" align="center" />
            <el-table-column
              prop="commodityName"
              :label="t('formDemo.commodityName')"
              width="280"
            />
            <el-table-column prop="accessory" :label="t('reuse.accessory')" width="90" />
            <el-table-column prop="quantity" :label="t('reuse.quantity')" width="90" />
            <el-table-column
              prop="unitPriceWarehouse"
              :label="t('formDemo.unitPriceWarehouse')"
              width="200"
            >
              <template #default="props">
                <div class="text-right">{{ props.row.unitPriceWarehouse }}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="intoMoneyWarehouse"
              :label="t('formDemo.intoMoneyWarehouse')"
              width="200"
            >
              <template #default="props">
                <div class="text-right">{{ props.row.intoMoneyWarehouse }}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="conditionProducts"
              :label="t('formDemo.conditionProducts')"
              width="150"
            />
          </el-table>
          <div class="flex justify-end">
            <div class="w-[145px] text-right">
              <p class="text-black font-bold dark:text-white">{{
                t('formDemo.totalAmountStock')
              }}</p>
            </div>
            <div class="w-[145px] text-right">
              <p class="pr-2 text-black font-bold dark:text-white">5,000,000 đ</p>
            </div>
          </div>
        </div>
        <div class="flex items-center">
          <span class="w-[25%] text-base font-bold">{{ t('formDemo.status') }}</span>
          <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
        </div>
        <div>
          <div class="flex gap-4 pb-2 items-center pt-4">
            <label class="w-[30%] text-right">Trạng thái</label>
            <div class="flex items-center w-[100%]">
              <span
                class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-neutral-900 dark:bg-transparent"
              ></span>
              <span class="box dark:text-black">
                Khởi tạo & ghi sổ
                <span class="triangle-right"> </span>
              </span>
            </div>
          </div>
        </div>
        <template #footer>
          <div class="flex justify-between">
            <el-button @click="dialogWarehouseRentalPayment = false">{{
              t('button.print')
            }}</el-button>
            <div>
              <span class="dialog-footer">
                <el-button type="primary" @click="dialogWarehouseRentalPayment = false">{{
                  t('formDemo.saveRecordDebts')
                }}</el-button>
                <el-button @click="dialogWarehouseRentalPayment = false">{{
                  t('reuse.exit')
                }}</el-button>
              </span>
            </div>
          </div>
        </template>
      </el-dialog>

      <!-- Thông tin trả hàng trước hạn -->
      <ReturnOrder
        v-model="dialogReturnAheadOfTime"
        :orderId="id"
        :orderData="rentReturnOrder"
        :listProductsTable="listOfOrderProduct"
        @add-row="addRow"
        @remove-row="removeRow"
        @post-return-request="postReturnRequest"
        :orderStatusType="2"
        :type="2"
      />

      <!-- Thông tin trả hàng hết hạn -->
      <ReturnOrder
        v-model="dialogReturnExpired"
        :orderId="id"
        :orderData="rentReturnOrder"
        :listProductsTable="listOfOrderProduct"
        @add-row="addRow"
        @post-return-request="postReturnRequest"
        :orderStatusType="3"
        :type="2"
      />

      <!-- Dialog Địa chỉ nhận hàng -->
      <el-dialog v-model="dialogFormVisible" width="40%" align-center title="Địa chỉ nhận hàng">
        <el-divider />
        <el-form
          ref="ruleFormAddress"
          :model="formAddress"
          :rules="rulesAddress"
          label-width="150px"
          class="demo-ruleForm"
          status-icon
        >
          <el-form-item :label="t('formDemo.provinceAndCity')" prop="province">
            <el-select
              v-model="formAddress.province"
              style="width: 96%"
              class="fix-full-width"
              :placeholder="t('formDemo.selectProvinceCity')"
              @change="(data) => CityChange(data)"
            >
              <el-option
                v-for="item in cities"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('formDemo.countyAndDistrict')" prop="district">
            <el-select
              v-model="formAddress.district"
              style="width: 96%"
              class="fix-full-width"
              :placeholder="t('formDemo.selectDistrict')"
              @change="(data) => districtChange(data)"
            >
              <el-option
                v-for="item in district"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('formDemo.wardOrCommune')" prop="wardCommune">
            <el-select
              v-model="formAddress.wardCommune"
              style="width: 96%"
              class="fix-full-width"
              :placeholder="t('formDemo.chooseWard')"
            >
              <el-option
                v-for="item in ward"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('formDemo.detailedAddress')" prop="detailedAddress">
            <el-input
              v-model="formAddress.detailedAddress"
              style="width: 96%"
              class="fix-full-width"
              :placeholder="t('formDemo.detailedAddress')"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button
              class="w-[150px]"
              type="primary"
              @click="
                () => {
                  submitFormAddress(ruleFormAddress)
                }
              "
              >{{ t('reuse.save') }}</el-button
            >
            <el-button class="w-[150px]" @click="dialogFormVisible = false">{{
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
                    v-for="item in hirePeriod"
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
                  unlink-panels
                  :start-placeholder="t('formDemo.startDay')"
                  :end-placeholder="t('formDemo.endDay')"
                  format="DD/MM/YYYY"
                />
              </el-form-item>
              <el-form-item :label="t('formDemo.rentalPaymentPeriod')" prop="rentalPaymentPeriod">
                <div class="flex gap-2">
                  <el-select v-model="ruleForm.rentalPaymentPeriod">
                    <el-option
                      v-for="item in optionsRentalPaymentPeriod"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                  <el-select
                    v-if="ruleForm.rentalPaymentPeriod == 4"
                    v-model="week"
                    :placeholder="t('formDemo.ChooseADayWeek')"
                  >
                    <el-option
                      v-for="item in periodicallyDuringWeek"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                  <el-select
                    v-if="ruleForm.rentalPaymentPeriod == 5"
                    v-model="month"
                    :placeholder="t('formDemo.selectRecurringDayMonth')"
                  >
                    <el-option
                      v-for="item in periodicallyInMonth"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>
              </el-form-item>
              <div class="flex gap-2 items-center">
                <div class="w-[60%] max-w-[528px]">
                  <el-form-item :label="t('formDemo.collaborators')" prop="collaborators">
                    <el-select
                      v-model="ruleForm.collaborators"
                      :placeholder="t('formDemo.selectOrEnterTheCollaboratorCode')"
                      @change="(data) => autoCollaboratorCommission(data)"
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
                        class="w-[100%] border-none outline-none bg-transparent"
                        :placeholder="t('formDemo.enterDiscount')"
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
                  :limit="10"
                  :on-exceed="handleExceed"
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
                    <div class="w-[20%] max-w-[170px] text-right pr-[12px]">
                      <label>{{ t('formDemo.chooseCustomer') }}</label>
                    </div>
                    <el-form-item label-width="0" prop="customerName" width="100%">
                      <div class="flex items-center gap-4">
                        <div class="flex w-[100%] gap-2 bg-transparent">
                          <MultipleOptionsBox
                            :fields="[
                              t('reuse.customerCode'),
                              t('reuse.customerName'),
                              t('reuse.customerInfo')
                            ]"
                            filterable
                            width="700px"
                            :items="optionsCustomerApi"
                            valueKey="value"
                            labelKey="label"
                            :hiddenKey="['id']"
                            :placeHolder="'Chọn khách hàng'"
                            :defaultValue="ruleForm.customerName"
                            :clearable="false"
                            @update-value="(value, obj) => getValueOfCustomerSelected(value, obj)"
                          />
                          <el-button :disabled="checkDisabled" @click="dialogAddQuick = true"
                            >+ {{ t('button.add') }}</el-button
                          >
                        </div>
                      </div>
                    </el-form-item>
                  </div>
                </div>
                <div class="flex-1">
                  <el-form-item class="fix-err" label-width="0" prop="delivery">
                    <div class="flex w-[100%] max-h-[42px] gap-2 items-center">
                      <label class="w-[170px] text-[#828387] text-right">{{
                        t('formDemo.chooseShipping')
                      }}</label>
                      <div class="flex w-[80%] gap-4">
                        <el-select
                          :disabled="checkDisabled"
                          v-model="ruleForm.delivery"
                          class="fix-full-width"
                          :placeholder="t('formDemo.choseDeliveryMethod')"
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
                      :disabled="checkDisabled"
                      class="hover:bg-transparent; focus:bg-transparent"
                      text
                      @click="
                        () => {
                          dialogFormVisible = true
                          callApiCity()
                        }
                      "
                      ><span class="text-blue-500">+ {{ t('formDemo.changeTheAddress') }}</span>
                    </el-button>
                  </p>
                </div>
              </div>
              <el-form-item
                v-if="ruleForm.customerName !== ''"
                class="poi-self"
                :label="t('reuse.customerInfo')"
              >
                <div class="flex">
                  <div class="leading-6 mt-2">
                    <div>{{ infoCompany.name }}</div>
                    <div v-if="infoCompany.taxCode !== null">
                      Mã số thuế: {{ infoCompany.taxCode }}</div
                    >
                    <div>Số điện thoại: {{ infoCompany.phone }}</div>
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
        :title="t('formDemo.choosePromotion')"
        width="40%"
        align-center
        class="z-50"
      >
        <el-divider />
        <div>
          <div class="flex items-center gap-3">
            <el-select
              v-model="input"
              filterable
              :placeholder="t('formDemo.enterPromoCode')"
              @change="(data) => handleChangePromo(data)"
            >
              <el-option
                v-for="item in promoTable"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-button
              @click="
                () => {
                  autoCalculateOrder()
                  showPromo = true
                  openDialogChoosePromotion = false
                }
              "
              class="w-[150px] border-1 border-blue-500"
              plain
              >{{ t('formDemo.apply') }}</el-button
            >
          </div>
          <div
            v-if="checkPromo"
            class="flex bg-[#F4F8FD] items-center mt-2 mb-4 p-2 dark:bg-transparent dark:border-1"
          >
            <div class="flex-1">
              <div class="ml-2">{{ promoCode }}</div>
              <div class="ml-2">{{ promoDescription }}</div>
              <div class="ml-2">Áp dụng cho đơn hàng từ {{ promoMin }}</div>
            </div>
            <div class="flex flex-1 justify-center">Hết hạn {{ promoDate }}</div>
            <div v-if="isActivePromo" class="flex-1 text-blue-500">{{ promoName }}</div>
            <div v-else class="text-[#FDB240]">{{ promoName }}</div>
          </div>
          <div class="flex items-center">
            <h2 class="font-bold text-base w-[40%]">Hoặc chọn mã có sẵn</h2>
            <el-divider />
          </div>
          <el-table
            ref="singleTableRef"
            :data="promoTable"
            highlight-current-row
            :loading="promoLoading"
            @current-change="handleCurrentChange"
          >
            <el-table-column prop="label" min-width="360">
              <template #default="props">
                <div>{{ props.row.label }}</div>
                <div>{{ props.row.description }}</div>
                <div>Áp dụng cho đơn hàng từ {{ props.row.min }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="toDate" width="180" align="left">
              <template #default="props">
                <div>Hết hạn {{ props.row.toDate }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="voucherConditionTypeName" width="180" align="left">
              <template #default="props">
                <div v-if="props.row.isAvailable" class="text-blue-500">{{
                  props.row.voucherConditionTypeName
                }}</div>
                <div v-else class="text-[#FDB240]">{{ props.row.voucherConditionTypeName }}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button class="w-[150px]" @click="openDialogChoosePromotion = false">{{
              t('reuse.exit')
            }}</el-button>
          </span>
        </template>
      </el-dialog>

      <!-- DialogChooseWarehouse -->
      <el-dialog
        v-model="openDialogChooseWarehouse"
        :title="t('formDemo.inventoryInformation')"
        width="35%"
        align-center
        class="z-50"
      >
        <el-divider />
        <el-table :data="tableChooseWarehouse" border>
          <el-table-column prop="warehouseCheckbox" width="90" align="center">
            <template #default="props">
              <el-radio
                v-model="radioWarehouseId"
                @change="() => showIdWarehouse(props)"
                :label="props.row.warehouseCheckbox"
                style="color: #fff; margin-right: -25px"
                ><span></span
              ></el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="name" :label="t('formDemo.warehouseInformation')" width="360" />
          <el-table-column prop="inventory" :label="t('reuse.inventory')">
            <template #default="props">
              <div class="flex">
                <span class="flex-1">{{ props.row.inventory }}</span>
                <span class="flex-1 text-right">Chiếc</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <template #footer>
          <span class="dialog-footer">
            <el-button class="w-[150px]" type="primary" @click="openDialogChooseWarehouse = false"
              >{{ t('reuse.save') }}
            </el-button>
            <el-button class="w-[150px]" @click="openDialogChooseWarehouse = false">{{
              t('reuse.exit')
            }}</el-button>
          </span>
        </template>
      </el-dialog>

      <!-- Bút toán bổ sung -->
      <el-dialog
        v-model="dialogAccountingEntryAdditional"
        :title="t('formDemo.accountingEntryAdditional')"
        width="40%"
        align-center
      >
        <div>
          <el-divider />
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('formDemo.orderInformation') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
          <div class="flex gap-4 pt-4 pb-4 items-center">
            <label class="w-[30%] text-right">{{ t('formDemo.orderCode') }}</label>
            <div class="w-[100%] text-xl">{{ rentalOrderCode }}</div>
          </div>
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('reuse.customerInfo') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
          <div>
            <div class="flex gap-4 pt-4 items-center">
              <label class="w-[30%] text-right">{{ t('reuse.customerName') }}</label>
              <div class="w-[100%]">{{ infoCompany.name }}</div>
            </div>
            <div class="flex gap-4 pt-4 items-center">
              <label class="w-[30%] text-right">{{ t('formDemo.address') }}</label>
              <div class="w-[100%]">{{ customerAddress }}</div>
            </div>
            <div class="flex gap-4 pt-4 pb-4 items-center">
              <label class="w-[30%] text-right">{{ t('reuse.phoneNumber') }}</label>
              <div class="w-[100%]">{{ infoCompany.phone }}</div>
            </div>
          </div>
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold break-w">{{
              t('formDemo.certificateInformation')
            }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
        </div>
        <div class="pt-2 pb-2">
          <el-table ref="singleTableRef" :data="tableAccountingEntry" border style="width: 100%">
            <el-table-column label="STT" type="index" width="60" align="center" />
            <el-table-column prop="content" :label="t('reuse.content')" width="280">
              <template #default="props">
                <el-input v-model="props.row.content" />
              </template>
            </el-table-column>
            <el-table-column prop="collected" :label="t('formDemo.collected')" width="90">
              <template #default="props">
                <CurrencyInputComponent class="handle-fix" v-model="props.row.collected" />
              </template>
            </el-table-column>
            <el-table-column prop="spent" :label="t('formDemo.spent')">
              <template #default="props">
                <CurrencyInputComponent class="handle-fix" v-model="props.row.spent" />
              </template>
            </el-table-column>
            <el-table-column prop="intoMoney" :label="t('formDemo.intoMoney')">
              <template #default="props">
                <CurrencyInputComponent class="handle-fix" v-model="props.row.intoMoney" />
              </template>
            </el-table-column>
          </el-table>
          <div class="flex justify-end">
            <div class="w-[145px] text-right">
              <p class="text-black font-bold dark:text-white">Tổng thanh toán</p>
            </div>
            <div class="w-[145px] text-right">
              <p class="pr-2 text-black font-bold dark:text-white">0 đ</p>
            </div>
          </div>
        </div>
        <div class="flex items-center">
          <span class="w-[25%] text-base font-bold">{{ t('formDemo.billingInformation') }}</span>
          <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
        </div>
        <div>
          <div class="flex gap-4 pt-2 items-center">
            <label class="w-[30%] text-right">Thanh toán</label>
            <div class="w-[100%]">
              <el-checkbox
                v-model="alreadyPaidForTt"
                :label="t('formDemo.alreadyPaidForTt')"
                size="large"
              />
            </div>
          </div>
          <div class="flex gap-4 pt-2 pb-4 items-center">
            <label class="w-[30%] text-right">{{ t('formDemo.formPayment') }}</label>
            <el-select v-model="payment" placeholder="Select">
              <el-option
                v-for="item in choosePayment"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="flex gap-4 pb-2 items-center">
            <label class="w-[30%] text-right">Trạng thái</label>
            <div class="flex items-center w-[100%]">
              <span
                class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-neutral-900 dark:bg-transparent"
              ></span>
              <span class="box dark:text-black">
                Khởi tạo & ghi sổ
                <span class="triangle-right"> </span>
              </span>
            </div>
          </div>
        </div>
        <template #footer>
          <div class="float-right pb-10">
            <span class="dialog-footer">
              <el-button
                type="primary"
                @click="
                  () => {
                    postOrderStransaction(3)
                    getOrderStransactionList()
                    dialogAccountingEntryAdditional = false
                  }
                "
                >{{ t('formDemo.saveRecordDebts') }}</el-button
              >
              <el-button @click="dialogAccountingEntryAdditional = false">{{
                t('reuse.exit')
              }}</el-button>
            </span>
          </div>
        </template>
      </el-dialog>

      <el-collapse-item :name="collapse[1].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[1].icon" link />
          <span class="text-center text-xl">{{ collapse[1].title }}</span>
        </template>
        <el-divider content-position="left">{{ t('formDemo.rentalProductList') }}</el-divider>
        <el-table :data="tableData" border class="pl-4 dark:text-[#fff]">
          <el-table-column
            prop="productPropertyId"
            :label="t('formDemo.productManagementCode')"
            width="150"
          >
            <template #default="props">
              <div v-if="type == 'detail'">
                {{ props.row.productPropertyId }}
              </div>
              <MultipleOptionsBox
                :fields="[
                  t('reuse.productCode'),
                  t('reuse.managementCode'),
                  t('formDemo.productInformation')
                ]"
                v-else
                filterable
                :disabled="disabledEdit"
                :items="listProductsTable"
                valueKey="productPropertyId"
                labelKey="productCode"
                :hiddenKey="['id']"
                :placeHolder="'Chọn mã sản phẩm'"
                :defaultValue="props.row.productPropertyId"
                @scroll-top="ScrollProductTop"
                @scroll-bottom="ScrollProductBottom"
                :clearable="false"
                @update-value="(value, obj) => getValueOfSelected(value, obj, props)"
                ><template #underButton>
                  <div class="sticky z-999 bottom-0 bg-white dark:bg-black h-10">
                    <div class="block h-1 w-[100%] border-top-1 pb-2"></div>
                    <div class="text-base text-blue-400 cursor-pointer pl-2" @click="addnewproduct"
                      >+ {{ t('formDemo.quicklyAddProducts') }}</div
                    >
                  </div>
                </template></MultipleOptionsBox
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="productName"
            :label="t('formDemo.productInformation')"
            width="380"
          />
          <el-table-column prop="accessory" :label="t('reuse.accessory')" width="180">
            <template #default="props">
              <el-input
                v-if="type != 'detail'"
                :disabled="disabledEdit"
                v-model="props.row.accessory"
                :placeholder="`/${t('formDemo.selfImportAccessories')}/`"
              />
              <div v-else>{{ props.row.accessory }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="fromDate" :label="t('formDemo.rentalStartDate')" width="120">
            <template #default="scope">
              <div v-if="type == 'detail'">
                {{ dateTimeFormat(scope.row.fromDate) }}
              </div>
              <el-date-picker
                v-else
                v-model="scope.row.fromDate"
                :disabled="disabledEdit"
                @change="(data) => handleGetTotal(data, scope)"
                type="date"
                placeholder="Chọn ngày"
                format="DD/MM/YYYY"
              />
            </template>
          </el-table-column>
          <el-table-column prop="toDate" :label="t('formDemo.rentalEndDate')" width="120">
            <template #default="scope">
              <div v-if="type == 'detail'">
                {{ dateTimeFormat(scope.row.toDate) }}
              </div>
              <el-date-picker
                v-else
                v-model="scope.row.toDate"
                :disabled="disabledEdit"
                @change="(data) => handleGetTotal(data, scope)"
                type="date"
                placeholder="Chọn ngày"
                format="DD/MM/YYYY"
              />
            </template>
          </el-table-column>
          <el-table-column prop="quantity" :label="t('formDemo.rentalQuantity')" width="90">
            <template #default="scope">
              <div v-if="type == 'detail'">
                {{ scope.row.quantity }}
              </div>
              <el-input
                v-else
                :disabled="disabledEdit"
                @change="
                  (data) => {
                    handleGetTotal(data, scope)
                    autoCalculateOrder()
                  }
                "
                v-model="scope.row.quantity"
                style="width: 100%"
              />
            </template>
          </el-table-column>
          <el-table-column prop="unitName" :label="t('reuse.dram')" width="100" />
          <el-table-column prop="unitPrice" :label="t('formDemo.rentalUnitPrice')" width="180">
            <template #default="props">
              <CurrencyInputComponent
                v-model="props.row.unitPrice"
                :disabled="disabledEdit"
                v-if="type != 'detail'"
                @change="changePriceRowTable"
              />
              <div v-else>{{
                props.row.unitPrice != ''
                  ? changeMoney.format(parseInt(props.row.unitPrice))
                  : '0 đ'
              }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="hirePrice" :label="t('formDemo.rentalFee')" width="180">
            <template #default="props">
              <div class="text-right">
                {{
                  props.row.hirePrice != ''
                    ? changeMoney.format(parseInt(props.row.hirePrice))
                    : '0 đ'
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="depositePrice"
            :label="t('formDemo.intoARentalDeposit')"
            width="180"
          >
            <template #default="props">
              <div class="text-right">
                {{
                  props.row.depositePrice != ''
                    ? changeMoney.format(parseInt(props.row.depositePrice))
                    : '0 đ'
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="t('formDemo.exportWarehouse')" width="200">
            <template #default="props">
              <div class="flex w-[100%] items-center">
                <div class="w-[40%]">{{ props.row.warehouseName }}</div>
                <div class="w-[60%]">
                  <el-button
                    text
                    @click="
                      () => {
                        callApiWarehouse(props)
                        openDialogChooseWarehouse = true
                      }
                    "
                  >
                    <span class="text-blue-500"> + {{ t('formDemo.chooseWarehouse') }}</span>
                  </el-button>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="t('formDemo.manipulation')" align="center" width="90">
            <template #default="scope">
              <button
                @click="removeTableData(scope.$index)"
                class="bg-[#F56C6C] pt-2 pb-2 pl-4 pr-4 text-[#fff] rounded"
                >{{ t('reuse.delete') }}</button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-button class="ml-4 mt-4" @click="addLastIndexSellTable"
          >+ {{ t('formDemo.add') }}</el-button
        >
        <div class="flex justify-end pt-4">
          <div class="w-50">
            <div class="dark:text-[#fff]">{{ t('formDemo.rentalFee') }}</div>
            <div class="text-blue-500 cursor-pointer">
              <el-button text @click="openDialogChoosePromotion = true" style="padding: 0">
                <span class="text-blue-500"> + {{ t('formDemo.choosePromotion') }}</span>
              </el-button>
            </div>
            <div class="text-blue-500 cursor-pointer">
              <el-dropdown class="flex justify-end" trigger="click">
                <span class="el-dropdown-link text-blue-500 cursor-pointer flex items-center">
                  {{ radioVAT }}
                  <Icon icon="material-symbols:keyboard-arrow-down" :size="16" />
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>
                      <el-radio-group @change="changePriceVAT" v-model="radioVAT" class="flex-col">
                        <div style="width: 100%">
                          <el-radio
                            class="text-left"
                            style="color: blue"
                            :label="t('formDemo.doesNotIncludeVAT')"
                            >{{ t('formDemo.VATNotIncluded') }}</el-radio
                          >
                        </div>
                        <div style="width: 100%">
                          <el-radio class="text-left" style="color: blue" label="10%"
                            >VAT 10%</el-radio
                          >
                        </div>
                        <div style="width: 100%">
                          <el-radio class="text-left" style="color: blue" label="8%"
                            >VAT 8%</el-radio
                          >
                        </div>
                        <div style="width: 100%">
                          <el-radio class="text-left" style="color: blue" label="5%"
                            >VAT 5%</el-radio
                          >
                        </div>
                        <div style="width: 100%">
                          <el-radio class="text-left" style="color: blue" label="0%"
                            >VAT 0%</el-radio
                          >
                        </div>
                      </el-radio-group>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <div class="text-black font-bold dark:text-[#fff]">{{
              t('formDemo.totalFeePayable')
            }}</div>
            <div class="text-black font-bold dark:text-[#fff]">{{
              t('formDemo.totalDeposit')
            }}</div>
          </div>

          <div class="w-30">
            <div class="text-right dark:text-[#fff]">{{
              totalPriceOrder != undefined ? changeMoney.format(totalPriceOrder) : '0 đ'
            }}</div>
            <div class="h-[32px] text-right dark:text-[#fff]">
              <div v-if="showPromo">{{
                promoValue == 0 ? changeMoney.format(promoCash) : `${promoValue} %`
              }}</div>
              <div v-else class="text-transparent :dark:text-transparent">s</div>
            </div>
            <div v-if="VAT" class="text-right dark:text-[#fff]">{{
              VAT ? (totalPriceOrder * parseInt(valueVAT)) / 100 : ''
            }}</div>
            <div v-else class="text-transparent :dark:text-transparent">s</div>
            <div class="text-right dark:text-[#fff]">{{
              totalFinalOrder != undefined ? changeMoney.format(totalFinalOrder) : '0 đ'
            }}</div>
            <div class="text-right dark:text-[#fff]">{{
              totalDeposit != undefined ? changeMoney.format(totalDeposit) : '0 đ'
            }}</div>
          </div>

          <div class="w-60 pl-2">
            <div class="dark:text-[#fff] text-transparent dark:text-transparent">s</div>
            <div v-if="showPromo" class="text-blue-500 cursor-pointer bg-[#F4F8FD]">
              {{ promoActive }}
            </div>
            <div class="dark:text-[#fff] text-transparent dark:text-transparent">s</div>
          </div>
        </div>

        <div class="w-[100%]">
          <el-divider content-position="left">{{ t('formDemo.statusAndManipulation') }}</el-divider>
        </div>
        <div class="flex gap-4 w-[100%] ml-1 items-center pb-3">
          <label class="w-[9%] text-right">{{ t('formDemo.orderStatus') }}</label>
          <div class="w-[84%] pl-1">
            <el-radio-group v-model="radio1" class="ml-4">
              <el-radio :disabled="checkDisabled" label="1">{{
                t('formDemo.waitingDelivery')
              }}</el-radio>
              <el-radio :disabled="checkDisabled" label="2">{{ t('reuse.delivery') }}</el-radio>
              <el-radio :disabled="checkDisabled" label="3">{{
                t('reuse.successfulDelivery')
              }}</el-radio>
              <el-radio :disabled="checkDisabled" label="4">{{
                t('reuse.deliveryFailed')
              }}</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="flex gap-2 pb-8">
          <div class="w-[11%]"></div>
          <div class="w-[89%]">
            <div class="flex items-center w-[100%] flex-wrap">
              <div
                @click="
                  () => {
                    statusOrder = 9
                    addStatusOrder(4)
                  }
                "
                class="duplicate-status"
                v-for="item in arrayStatusOrder"
                :key="item.value"
              >
                <div v-if="item.value == 1 || item.value == 5 || item.value == 7">
                  <span
                    class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-black dark:bg-transparent"
                  ></span>
                  <span
                    class="box box_1 text-yellow-500 dark:text-black"
                    :class="{ active: item.isActive }"
                  >
                    {{ item.label }}
                    <span class="triangle-right right_1"> </span>
                  </span>
                </div>
                <div v-else-if="item.value == 2 || item.value == 3 || item.value == 4">
                  <span
                    class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-black dark:bg-transparent"
                  ></span>
                  <span
                    class="box box_2 text-blue-500 dark:text-black"
                    :class="{ active: item.isActive }"
                  >
                    {{ item.label }}
                    <span class="triangle-right right_2"> </span>
                  </span>
                </div>
                <div v-else-if="item.value == 6">
                  <span
                    class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-black dark:bg-transparent"
                  ></span>
                  <span
                    class="box box_3 text-black dark:text-black"
                    :class="{ active: item.isActive }"
                  >
                    {{ item.label }}
                    <span class="triangle-right right_3"> </span>
                  </span>
                </div>
                <div v-else-if="item.value == 8 || item.value == 9 || item.value == 10">
                  <span
                    class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-black dark:bg-transparent"
                  ></span>
                  <span
                    class="box box_4 text-rose-500 dark:text-black"
                    :class="{ active: item.isActive }"
                  >
                    {{ item.label }}
                    <span class="triangle-right right_4"> </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="w-[100%] flex gap-2">
          <div class="w-[12%]"></div>
          <!-- Không thay đổi giá -->
          <div
            v-if="statusOrder == 1 && priceChangeOrders == false"
            class="w-[100%] flex ml-1 gap-4"
          >
            <el-button
              :disabled="doubleDisabled"
              @click="openBillDialog"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.rentalVoucher') }}</el-button
            >
            <el-button
              @click="openDepositDialog"
              :disabled="doubleDisabled"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.depositSlip') }}</el-button
            >
            <el-button
              :disabled="checkDisabled"
              @click="
                () => {
                  submitForm(ruleFormRef, ruleFormRef2)
                }
              "
              type="primary"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.saveCloseOrder') }}</el-button
            >
            <el-button
              :disabled="checkDisabled"
              @click="
                () => {
                  postData()
                  statusOrder = 5
                  addStatusOrder(3)
                }
              "
              type="primary"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.startRentingTerm') }}</el-button
            >
            <el-button
              @click="
                () => {
                  arrayStatusOrder.splice(0, arrayStatusOrder.length)
                  statusOrder = 12
                  addStatusOrder(10)
                }
              "
              :disabled="checkDisabled"
              type="danger"
              class="min-w-42 min-h-11"
              >{{ t('button.cancelOrder') }}</el-button
            >
          </div>
          <!-- Có thay đổi giá -->
          <div
            v-if="statusOrder == 1 && priceChangeOrders == true"
            class="w-[100%] flex ml-1 gap-4"
          >
            <el-button
              :disabled="doubleDisabled"
              @click="openBillDialog"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.rentalVoucher') }}</el-button
            >
            <el-button
              @click="openDepositDialog"
              :disabled="doubleDisabled"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.depositSlip') }}</el-button
            >
            <el-button
              :disabled="checkDisabled"
              @click="
                () => {
                  postData()
                  statusOrder = 2
                  changeStatus(3)
                  addStatusDelay(2)
                }
              "
              type="primary"
              class="min-w-42 min-h-11"
              >{{ t('button.saveAndWaitApproval') }}</el-button
            >
            <el-button
              @click="
                () => {
                  arrayStatusOrder.splice(0, arrayStatusOrder.length)
                  addStatusOrder(10)
                  statusOrder = 9
                }
              "
              :disabled="checkDisabled"
              type="danger"
              class="min-w-42 min-h-11"
              >{{ t('button.cancelOrder') }}</el-button
            >
          </div>

          <div
            v-else-if="statusOrder == 2 && priceChangeOrders == true"
            class="w-[100%] flex ml-1 gap-4"
          >
            <el-button
              @click="
                () => {
                  statusOrder = 9
                  arrayStatusOrder.splice(0, arrayStatusOrder.length)
                  addStatusOrder(10)
                }
              "
              :disabled="checkDisabled"
              type="danger"
              class="min-w-42 min-h-11"
              >{{ t('button.cancelOrder') }}</el-button
            >
          </div>
          <!-- Không thay đổi giá -->
          <div v-else-if="statusOrder == 3" class="w-[100%] flex ml-1 gap-4">
            <el-button
              :disabled="doubleDisabled"
              @click="openBillDialog"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.rentalVoucher') }}</el-button
            >
            <el-button
              @click="openDepositDialog"
              :disabled="doubleDisabled"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.depositSlip') }}</el-button
            >
            <el-button
              :disabled="checkDisabled"
              @click="
                () => {
                  addStatusOrder(3)
                  statusOrder = 5
                }
              "
              type="primary"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.startRentingTerm') }}</el-button
            >
            <el-button
              @click="statusOrder = 4"
              :disabled="checkDisabled"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.editOrder') }}</el-button
            >
            <el-button
              @click="
                () => {
                  statusOrder = 9
                  addStatusOrder(10)
                  addStatusDelay(7)
                }
              "
              :disabled="checkDisabled"
              type="danger"
              class="min-w-42 min-h-11"
              >{{ t('button.cancelOrder') }}</el-button
            >
          </div>

          <div v-if="statusOrder == 4" class="w-[100%] flex ml-1 gap-4">
            <el-button
              :disabled="checkDisabled"
              @click="
                () => {
                  statusOrder = 3
                }
              "
              type="primary"
              class="min-w-42 min-h-11"
              >{{ t('reuse.save') }}</el-button
            >
            <el-button
              @click="statusOrder = 3"
              :disabled="checkDisabled"
              type="danger"
              class="min-w-42 min-h-11"
              >{{ t('button.cancel') }}</el-button
            >
          </div>
          <div v-else-if="statusOrder == 5" class="w-[100%] flex ml-1 gap-4">
            <el-button
              :disabled="doubleDisabled"
              @click="openBillDialog"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.rentalVoucher') }}</el-button
            >
            <el-button
              @click="openDepositDialog"
              :disabled="doubleDisabled"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.depositSlip') }}</el-button
            >
            <button
              :disabled="checkDisabled"
              @click="
                () => {
                  statusOrder = 6
                  setDataForReturnOrder()
                  addStatusOrder(5)
                  changeStatus(7)
                  dialogReturnAheadOfTime = true
                }
              "
              class="min-w-42 min-h-11 bg-[#FFF0D9] text-[#FD9800] rounded font-bold"
              >{{ t('formDemo.durationPrepayment') }}</button
            >
          </div>
          <div v-else-if="statusOrder == 6" class="w-[100%] flex ml-1 gap-4">
            <el-button
              @click="statusOrder = 5"
              :disabled="checkDisabled"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.cancelReturns') }}</el-button
            >
          </div>
          <div v-else-if="statusOrder == 7" class="w-[100%] flex ml-1 gap-4">
            <button
              :disabled="checkDisabled"
              @click="
                () => {
                  onAddDebtTableDeposit()
                  getReturnRequestTable()
                  statusOrder = 8
                }
              "
              class="min-w-42 min-h-11 bg-[#FFF0D9] text-[#FD9800] rounded font-bold"
              >{{ t('formDemo.completePayment') }}</button
            >
            <el-button
              @click="statusOrder = 5"
              :disabled="checkDisabled"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.cancelReturns') }}</el-button
            >
          </div>
          <div v-else-if="statusOrder == 8" class="w-[100%] flex ml-1 gap-4">
            <el-button
              :disabled="doubleDisabled"
              @click="openBillDialog"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.rentalVoucher') }}</el-button
            >
            <el-button
              @click="openDepositDialog"
              :disabled="doubleDisabled"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.depositSlip') }}</el-button
            >
            <button
              :disabled="checkDisabled"
              @click="
                () => {
                  statusOrder = 12
                  addStatusOrder(6)
                }
              "
              class="min-w-42 min-h-11 bg-[#D9D9D9] rounded font-bold"
              >{{ t('formDemo.checkFinish') }}</button
            >
          </div>
          <div v-else-if="statusOrder == 9" class="w-[100%] flex ml-1 gap-4">
            <el-button
              :disabled="doubleDisabled"
              @click="openBillDialog"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.rentalVoucher') }}</el-button
            >
            <el-button
              @click="openDepositDialog"
              :disabled="doubleDisabled"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.depositSlip') }}</el-button
            >
            <button
              :disabled="checkDisabled"
              @click="
                () => {
                  statusOrder = 9
                  addStatusOrder(8)
                  addStatusDelay(9)
                }
              "
              class="min-w-42 min-h-11 border-1 border-red-500 text-red-500 rounded font-bold"
              >{{ t('formDemo.leaseExtension') }}</button
            >
            <button
              :disabled="checkDisabled"
              @click="
                () => {
                  statusOrder = 8
                  addStatusOrder(7)
                  setDataForReturnOrder()
                  dialogReturnExpired = !dialogReturnExpired
                }
              "
              class="min-w-42 min-h-11 bg-[#FFF0D9] text-[#FD9800] rounded font-bold"
              >{{ t('formDemo.returnsExpired') }}</button
            >
          </div>
          <div v-else-if="statusOrder == 10" class="w-[100%] flex ml-1 gap-4">
            <el-button
              :disabled="doubleDisabled"
              @click="openBillDialog"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.rentalVoucher') }}</el-button
            >
            <el-button
              @click="openDepositDialog"
              :disabled="doubleDisabled"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.depositSlip') }}</el-button
            >
            <button
              :disabled="checkDisabled"
              @click="
                () => {
                  statusOrder = 9
                  addStatusOrder(7)
                }
              "
              class="min-w-42 min-h-11 bg-[#D9D9D9] rounded font-bold"
              >{{ t('formDemo.leaseExtension') }}</button
            >
            <button
              :disabled="checkDisabled"
              @click="
                () => {
                  statusOrder = 8
                  setDataForReturnOrder()
                  addStatusOrder(7)
                }
              "
              class="min-w-42 min-h-11 bg-[#FFF0D9] text-[#FD9800] rounded font-bold"
              >{{ t('formDemo.aheadTimeReturns') }}</button
            >
          </div>
        </div>
      </el-collapse-item>

      <el-collapse-item :name="collapse[2].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[2].icon" link />
          <span class="text-center text-xl">{{ collapse[2].title }}</span>
        </template>
        <el-button @click="dialogAccountingEntryAdditional = true" text>+ Thêm bút toán</el-button>
        <el-button
          @click="
            () => {
              dialogInformationReceipts = true
              getReceiptCode()
            }
          "
          text
          >+ Thêm phiếu thu</el-button
        >
        <el-button @click="dialogPaymentVoucher = true" text>+ Thêm phiếu chi</el-button>
        <el-button @click="dialogIPRForm = true" text>+ Thêm đề nghị thanh toán</el-button>
        <el-table
          ref="multipleTableRef"
          :data="debtTable"
          @selection-change="handleSelectionChange"
          border
        >
          <el-table-column type="selection" width="40" />
          <el-table-column
            prop="createdAt"
            :label="t('formDemo.initializationDate')"
            width="150"
            align="center"
          >
            <template #default="data">
              <el-date-picker
                v-model="data.row.createdAt"
                v-if="type != 'detail'"
                type="date"
                placeholder="Pick a day"
                format="DD/MM/YYYY"
              />
              <div v-else>{{ data.row.createdAt }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="content"
            :label="t('formDemo.certificateInformation')"
            width="240"
          />
          <el-table-column
            prop="receiptOrPaymentVoucherId"
            :label="t('formDemo.receiptOrPayment')"
            align="right"
          >
            <template #default="data">
              <!-- <div
                @click="
                  data.row.receiptOrPayment.includes('PT')
                    ? openReceiptDialog()
                    : openPaymentDialog()
                "
                class="cursor-pointer text-blue-500"
                >{{ data.row.receiptOrPayment }}</div
              > -->
              <div
                @click="
                  () => {
                    formDetailPaymentReceipt.value = getDetailReceiptPaymentVoucher({
                      id: data.row.idPTC
                    })
                    getDetailPayment()
                  }
                "
                class="cursor-pointer text-blue-500"
              >
                {{ data.row.receiptOrPaymentVoucherId }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="paymentProposal" :label="t('router.paymentProposal')">
            <template #default="props">
              <div @click="dialogIPRForm = true" class="text-blue-500">{{
                props.row.paymentProposal
              }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="typeOfMoney" :label="t('formDemo.kindOfMoney')">
            <template #default="props">
              <div>{{ props.row.typeOfMoney }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="collected" :label="t('formDemo.collected')">
            <template #default="props">
              <el-input v-model="props.row.collected" />
            </template>
          </el-table-column>
          <el-table-column prop="spent" :label="t('formDemo.spent')">
            <template #default="props">
              <el-input v-model="props.row.spent" />
            </template>
          </el-table-column>
          <el-table-column
            prop="rentalFeeDebt"
            width="140"
            :label="t('formDemo.rentalFeeDebt')"
            align="right"
          />
          <el-table-column :label="t('formDemo.receivableOrPayable')" width="100">
            <div>Phải thu</div>
          </el-table-column>
          <el-table-column :label="t('formDemo.choosePayment')" prop="payment" width="180">
            <template #default="props">
              <div>{{ props.row.payment }}</div>
            </template>
          </el-table-column>
          <el-table-column :label="t('formDemo.alreadyPaidForTt')" align="center" width="90">
            <template #default="props">
              <el-checkbox v-model="props.row.alreadyPaidForTt" />
            </template>
          </el-table-column>
          <el-table-column
            :label="t('formDemo.statusAccountingEntry')"
            prop="statusAccountingEntry"
            min-width="120"
          />
          <el-table-column :label="t('formDemo.manipulation')" width="90" align="center">
            <template #default="data">
              <el-button
                @click="
                  data.row.certificateInformation.includes(feePaymentPeriod)
                    ? getAccountingEntry(data.row.id, 1)
                    : data.row.certificateInformation.includes('Thu tiền cọc thuê')
                    ? getAccountingEntry(data.row.id, 2)
                    : getAccountingEntry(data.row.id, 3)
                "
                >{{ t('reuse.detail') }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>

      <el-collapse-item :name="collapse[3].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[3].icon" link />
          <span class="text-center text-xl">{{ collapse[3].title }}</span>
        </template>
        <div>
          <el-divider content-position="left">{{
            t('formDemo.completeEntryTrackingSheet')
          }}</el-divider>
          <el-table :data="historyTable" border class="pl-4 dark:text-[#fff]">
            <el-table-column prop="createdAt" :label="t('formDemo.initializationDate')" width="150">
              <template #default="props">
                {{ dateTimeFormat(props.row.createdAt) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="productPropertyId"
              :label="t('formDemo.productManagementCode')"
              width="150"
            />
            <el-table-column
              prop="productPropertyName"
              :label="t('formDemo.productInformation')"
              width="680"
            />
            <el-table-column prop="accessory" :label="t('reuse.accessory')" width="180" />

            <el-table-column prop="quantity" :label="t('formDemo.amount')" width="120" />
            <el-table-column prop="unitName" :label="t('reuse.dram')" width="90" />
            <el-table-column
              prop="invoiceForGoodsEnteringTheWarehouse"
              :label="t('formDemo.invoiceForGoodsEnteringTheWarehouse')"
              width="180"
            >
              <template #default="props">
                <div
                  @click="dialogWarehouseRentalPayment = true"
                  class="text-blue-500 cursor-pointer"
                  >{{ props.row.invoiceForGoodsEnteringTheWarehouse }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="inventoryStatus"
              :label="t('formDemo.inventoryStatus')"
              width="180"
            />
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

.box {
  padding: 0 10px 0 20px;
  position: relative;
  display: flex;
  width: fit-content;
  align-items: center;
  border: 1px solid #ccc;
  background-color: #ccc;
  opacity: 0.6;
}
.box_1 {
  border: 1px solid #fff0d9;
  background-color: #fff0d9;
}

.box_2 {
  border: 1px solid #f4f8fd;
  background-color: #f4f8fd;
}

.box_3 {
  border: 1px solid #d9d9d9;
  background-color: #d9d9d9;
}

.box_4 {
  border: 1px solid #fce5e1;
  background-color: #fce5e1;
}

.right_1 {
  border-left: 11px solid #fff0d9 !important;
}
.right_2 {
  border-left: 11px solid #f4f8fd !important;
}

.right_3 {
  border-left: 11px solid #d9d9d9 !important;
}

.right_4 {
  border-left: 11px solid #fce5e1 !important;
}

.triangle-left {
  position: absolute;
  z-index: 1998;
  width: 0;
  height: 0;
}
.triangle-right {
  position: absolute;
  right: -12px;
  width: 0;
  height: 0;
  border-top: 13px solid transparent;
  border-bottom: 12px solid transparent;
  border-left: 11px solid #ccc;
}
::v-deep(.el-table td.el-table__cell div) {
  width: 100%;
}

::v-deep(.el-table) {
  z-index: 0;
}

::v-deep(.el-dialog.is-align-center) {
  font-weight: 400;
}

::v-deep(.el-dialog__title) {
  font-weight: bold;
}

.duplicate-status {
  margin-bottom: 10px;
}

.duplicate-status + .duplicate-status {
  margin-left: 10px;
}
.active {
  opacity: 1 !important;
}
@media screen {
  #recpPaymentPrint {
    display: none;
  }
  #billDepositPrint {
    display: none;
  }
  #IPRFormPrint {
    display: none;
  }
}

@media print {
  #printPage {
    display: block; /* Hidden by default */
    position: fixed; /* Stay in place */
    z-index: 10; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: white;
  }
}

::v-deep(.handle-fix > .el-input > .el-input__wrapper > .el-input__inner) {
  text-align: right;
}

::v-deep(.fix-err > .el-form-item__content > .el-form-item__error) {
  margin-left: 178px;
}
</style>
