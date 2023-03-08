<script setup lang="ts">
import { reactive, ref, watch, unref, onBeforeMount, computed } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import CurrencyInputComponent from '@/components/CurrencyInputComponent.vue'
import { moneyFormat } from '@/utils/format'
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
  // ElDropdown,
  // ElDropdownMenu,
  // ElDropdownItem,
  ElDatePicker,
  ElForm,
  ElFormItem,
  ElMessage,
  ElNotification,
  UploadProps,
  UploadUserFile
} from 'element-plus'
// import { ORDER_STYTE } from '@/utils/API.Variables' 
import { useIcon } from '@/hooks/web/useIcon'
import { Collapse } from '../../Components/Type'
import { useRoute, useRouter } from 'vue-router'
import moment from 'moment'
import { dateTimeFormat } from '@/utils/format'
import MultipleOptionsBox from '@/components/MultipleOptionsBox.vue'
import { STATUS_ORDER_SELL } from '@/utils/API.Variables'
import type { UploadFile } from 'element-plus'
import {
  getProductsList,
  getCollaboratorsInOrderList,
  getPromotionsList,
  getAllCustomer,
  addNewOrderList,
  getOrderList,
  addQuickCustomer,
  getPriceOfSpecificProduct,
  getOrderTransaction,
  addTPV,
  createReturnRequest,
  getReturnRequest,
  getReturnRequestForOrder,
  getReceiptPaymentVoucher,
  getDetailReceiptPaymentVoucher,
  getCodePaymentRequest,
  GetPaymentRequestDetail,
  addDNTT,
  addOrderStransaction,
  updateOrderTransaction,
  getDetailAccountingEntryById,
  postAutomaticWarehouse,
  GetProductPropertyInventory,
  getListWareHouse,
  updateOrderInfo,
  finishStatusOrder,
  updateStatusOrder,
  approvalOrder,
  cancelOrder,
  createTicketFromReturnOrder,
  GetWarehouseTransaction,
  getAllStaffList,
  cancelReturnOrder,
  updateStatusTransaction,
  finishReturnOrder,
GenerateCodeOrder
} from '@/api/Business'
import { FORM_IMAGES } from '@/utils/format'
import { UpdateStatusTicketFromOrder } from '@/api/Warehouse'
import { getCity, getDistrict, getWard } from '@/utils/Get_Address'
import type { FormInstance, FormRules } from 'element-plus'
import paymentOrderPrint from '../../Components/formPrint/src/paymentOrderPrint.vue'
import billPrint from '../../Components/formPrint/src/billPrint.vue'
import receiptsPaymentPrint from '../../Components/formPrint/src/receiptsPaymentPrint.vue'
import Qrcode from '@/components/Qrcode/src/Qrcode.vue'
import { API_URL } from '@/utils/API_URL'
import { appModules } from '@/config/app'
import { deleteTempCode } from '@/api/common'
const { utility } = appModules
const { t } = useI18n()

const changeMoney = new Intl.NumberFormat('vi', {
  style: 'currency',
  currency: 'vnd',
  minimumFractionDigits: 0
})

const checkPercent = (_rule: any, value: any, callback: any) => {
  if (/\s/g.test(value)) callback(new Error(t('reuse.notSpace')))
  else if (isNaN(value)) callback(new Error(t('reuse.numberFormat')))
  else if (value < 0) callback(new Error(t('reuse.positiveNumber')))
  else if (value < 0 || value > 100) callback(new Error(t('formDemo.validatePercentNum')))
  callback()
}

const ruleFormRef = ref<FormInstance>()
const ruleFormRef2 = ref<FormInstance>()
const ruleFormAddress = ref<FormInstance>()
// var curDate = 'DHB' + moment().format('hhmmss')
var autoCustomerCode = 'KH' + moment().format('hhmmss')
var autoCodeSellOrder = 'BH' + moment().format('hmmss')
var autoCodePaymentRequest = 'DNTT' + moment().format('hhmmss')
var autoCodeReturnRequest = 'DT' + moment().format('hms')
const codeReturnRequest = ref()
const sellOrderCode = ref()
const codeReceipts = ref()
const codeExpenditures = ref()
const codePaymentRequest = ref()
const ruleForm = reactive({
  orderCode: '',
  collaborators: '',
  discount: '',
  orderNotes: '',
  customerName: '',
  warehouse: '',
  delivery: 1,
  orderFiles: []
})

const condition = ref(false)

const rules = reactive<FormRules>({
  orderCode: [{ required: true, message: t('formDemo.pleaseInputOrderCode'), trigger: 'blur' }],
  discount: [
    {
      validator: checkPercent,
      trigger: 'blur'
    }
  ],
  customerName: [
    { required: true, message: t('formDemo.pleaseSelectCustomerName'), trigger: 'change' }
  ],
  warehouse: [
    {
      required: true,
      message: t('formDemo.pleaseSelectWarehouse'),
      trigger: 'change'
    }
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
      message: 'Tỉnh/thành phố không được để trống ',
      trigger: 'change'
    }
  ],
  district: [
    {
      required: true,
      message: 'Quận/huyện kkhông được để trống ',
      trigger: 'blur'
    }
  ],
  wardCommune: [
    {
      required: true,
      message: 'Phường/Xã không được để trống ',
      trigger: 'blur'
    }
  ],
  detailedAddress: [
    { required: true, message: 'Địa chỉ chi tiết không được để trống ', trigger: 'blur' }
  ]
})

let checkValidateForm = ref(false)

const submitForm = async (
  formEl: any,
  formEl2: any,
  pushBack: boolean
) => {
  if (!formEl || !formEl2) return
  await formEl.validate((valid, _fields) => {
    if (valid) {
      checkValidateForm.value = true
    } else {
      checkValidateForm.value = false
    }
  })
  await formEl2.validate((valid, _fields) => {
    if (valid && checkValidateForm.value) {
      postData(pushBack)
      doubleDisabled.value = false
    } else {
      ElMessage.error(t('reuse.notFillAllInformation'))
      checkValidateForm.value = false
    }
  })
}

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

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.warning(
    `${t('reuse.limitUploadImages')}. ${t('reuse.imagesYouChoose')}: ${files.length}. ${t(
      'reuse.total'
    )}${files.length + uploadFiles.length}`
  )
}

const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })
const percentageIcon = useIcon({ icon: 'material-symbols:percent' })

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
    name: 'productImportHistory',
    title: t('formDemo.importExportHistoryExchange'),
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

interface typeWarehouse {
  value: any
  label: any
}
const chooseWarehouse = reactive<Array<typeWarehouse>>([])

const radio1 = ref('')

const input = ref('')

interface ListOfProductsForSaleType {
  name: string
  productCode: string
  productName: string
  productPropertyCode: string
  productPropertyName: string
  id: string
  productPropertyId: string | number | any
  quantity: string
  accessory: string | undefined
  unitName: string
  unitPrice: string | number | undefined
  originalPrice?: number
  totalPrice: string
  paymentType: string
  warehouseId: number | undefined
  warehouseTotal?: number | any
  warehouseName: string
  priceChange?: boolean
}
const productForSale = reactive<ListOfProductsForSaleType>({
  name: '',
  productCode: '',
  productName: '',
  productPropertyCode: '',
  productPropertyName: '',
  id: '',
  productPropertyId: undefined,
  quantity: '1',
  accessory: '',
  unitName: '',
  unitPrice: 0,
  totalPrice: '',
  paymentType: '',
  warehouseId: undefined,
  warehouseName: ''
})

let ListOfProductsForSale = ref<Array<ListOfProductsForSaleType>>([])

interface historyTableType {
  createdAt: string
  productPropertyId: string | any
  productCode?: string
  productPropertyName?: string
  productName?: string
  productPropertyCode?: string
  accessory?: string
  conditionProducts?: string
  quantity: number
  unit?: string
  refundUnitPrice?: number
  intoUnitPrice?: number
  invoiceGoodsEnteringWarehouse?: number
  inventoryStatus?: string
  unitPrice?: number
  totalPrice?: number
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

// debtTable
interface tableDataType {
  createdAt: string | Date
  content: string
  receiptOrPaymentVoucherId: number | undefined
  receiptOrPaymentVoucherCode: string
  paymentRequestId: string | undefined
  paymentRequestCode: string
  receiveMoney: string
  paidMoney: string
  deibt: number
  typeOfPayment: string | number | undefined
  paymentMethods: number
  status: number
  alreadyPaidForTt: boolean
  isReceiptedMoney: boolean
  idPTC?: number
  statusAccountingEntry: string
}

let debtTable = ref<Array<tableDataType>>([])
let newTable = ref()
let countExisted = ref(0)
let countExistedDNTT = ref(0)
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const handleSelectionChange = (val: tableDataType[]) => {
  if(val.length ==0){
    disabledPTAccountingEntry.value = true
      disabledPCAccountingEntry.value = true
      disabledDNTTAccountingEntry.value = true
    return
  }
  newTable.value = val
  countExisted.value = 0
  countExistedDNTT.value = 0
  newTable.value.map((el) => {
    if (el.receiptOrPaymentVoucherId) {
      countExisted.value++
      disabledPTAccountingEntry.value = true
      disabledPCAccountingEntry.value = true
    } else {
      if (countExisted.value == 0) {
        disabledPTAccountingEntry.value = false
        disabledPCAccountingEntry.value = false
      }
    }

    if (el.paymentRequestId) {
      countExistedDNTT.value++
      disabledDNTTAccountingEntry.value = true
    } else {
      if (countExistedDNTT.value == 0) {
        disabledDNTTAccountingEntry.value = false
      }
    }
  })
  // moneyReceipts.value = val.reduce((total, value) => {
  //   total += parseInt(value.receiveMoney)
  //   return total
  // }, 0)
}

// Dialog change address

const dialogFormVisible = ref(false)
let dialogAddQuick = ref(false)
const openDialogChooseWarehouse = ref(false)
const openDialogChoosePromotion = ref(false)

const cities = ref()
const district = ref()
const ward = ref()

const callApiCity = async () => {
  cities.value = await getCity()
}

const CityChange = async (value) => {
  formAddress.district = ''
  formAddress.wardCommune = ''
  formAddress.detailedAddress = ''
  district.value = await getDistrict(value)
}

const districtChange = async (value) => {
  ward.value = await getWard(value)
}

const tableWarehouse = ref([])

// const radioVAT = ref(t('formDemo.doesNotIncludeVAT'))
let infoCompany = reactive({
  name: '',
  taxCode: '',
  phone: '',
  email: ''
})

let customerAddress = ref('')
// Call api danh sách khách hàng
// infinity scroll KH
const pageIndexCustomer = ref(1)
const optionsCustomerApi = ref<Array<any>>([])
const callCustomersApi = async () => {
  const res = await getAllCustomer({
    PageIndex: pageIndexCustomer.value,
    PageSize: 20
  })
  const getCustomerResult = res.data
  if (res.data && res.data?.length > 0) {
    optionsCustomerApi.value = getCustomerResult.map((customer) => ({
      code: customer.code,
      label: customer.isOrganization
        ? customer.name + ' | MST ' + customer.taxCode
        : customer.name + ' | ' + customer.phonenumber,
      address: customer.address,
      name: customer.name,
      value: customer.id,
      isOrganization: customer.isOrganization,
      taxCode: customer.taxCode,
      phone: customer.phonenumber,
      email: customer.email,
      id: customer.id
    }))
  }  
}

const ScrollCustomerTop = () => {
  scrollCustomerTop.value = true
}

const scrollCustomerTop = ref(false)
const scrollCustomerBottom = ref(false)

const noMoreCustomerData = ref(false)

const ScrollCustomerBottom = () => {
  scrollCustomerBottom.value = true
  pageIndexCustomer.value++
  noMoreCustomerData.value
    ? ''
    : getAllCustomer({ PageIndex: pageIndexCustomer.value, PageSize: 20 })
    .then((res) => {
      res.data.length == 0
      ? (noMoreCustomerData.value = true)
      : res.data.map((customer) =>
      optionsCustomerApi.value.push({
        code: customer.code,
        label: customer.isOrganization
          ? customer.name + ' | MST ' + customer.taxCode
          : customer.name + ' | ' + customer.phonenumber,
        address: customer.address,
        name: customer.name,
        value: customer.id,
        isOrganization: customer.isOrganization,
        taxCode: customer.taxCode,
        phone: customer.phonenumber,
        email: customer.email,
        id: customer.id
        })
      )
    })
    .catch(() => {
      noMoreCustomerData.value = true
    })
}

// const scrollingCustomer = (e) => {
//   const clientHeight = e.target.clientHeight
//   const scrollHeight = e.target.scrollHeight
//   const scrollTop = e.target.scrollTop
//   if (scrollTop == 0) {
//     scrollCustomerTop.value = true
//   }
//   if (scrollTop + clientHeight >= scrollHeight) {
//     ScrollCustomerBottom()
//   }
// }

// Call api danh sách sản phẩm
const listProductsTable = ref()

const pageIndexProducts = ref(1)
const callApiProductList = async () => {
  const res = await getProductsList({ PageIndex: pageIndexProducts.value, PageSize: 20,  ServiceType: 1, IsApprove: true})
  if (res.data && res.data?.length > 0) {
    listProductsTable.value = res.data.map((product) => ({
      productCode: product.code,
      value: product.productCode,
      name: product.name ?? '',
      inventory:product.tonKho ?? 0,
      unit: product.unitName,
      price: product.price.toString(),
      productPropertyId: product.id,
      productPropertyCode: product.productPropertyCode
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
    : getProductsList({ PageIndex: pageIndexProducts.value, PageSize: 20, ServiceType: 1, IsApprove: true })
        .then((res) => {
          res.data.length == 0
            ? (noMoreProductData.value = true)
            : res.data.map((product) =>
                listProductsTable.value.push({
                  productCode: product.code,
                  value: product.productCode,
                  name: product.name ?? '',
                  inventory:product.tonKho ?? 0,
                  unit: product.unitName,
                  price: product.price.toString(),
                  productPropertyId: product.id,
                  productPropertyCode: product.productPropertyCode
                })
              )
        })
        .catch(() => {
          noMoreProductData.value = true
        })
}

let totalPriceOrder = ref(0)
let totalFinalOrder = ref(0)
let promoValue = ref(0)
let promoCash = ref(0)
const duplicateProduct = ref()

const duplicateProductMessage = () => {
  ElMessage.error('Sản phẩm đã được chọn, vui lòng tăng số lượng hoặc chọn sản phẩm khác')
}

// const radioWarehouseId = ref()
const indexRowWarehouse = ref()

const callApiWarehouseTotal = async (productPropertyId = 0, serviceType = 1) => {
  const getTotalPayload = {
    ProductPropertyId: productPropertyId,
    ServiceType: serviceType
  }
  const res = await GetProductPropertyInventory(getTotalPayload)
  const total = res?.total
  return total
}

const getTotalWarehouse = () => {
  ListOfProductsForSale.value.forEach(async (el) => {
    if (el.productPropertyId)
      el.warehouseTotal = await callApiWarehouseTotal(parseInt(el.productPropertyId), 1)
  })
}

// Lấy danh sách kho theo mã sản phẩm và sericeType
const callApiWarehouse = async (scope) => {
  const data = scope.row
  indexRowWarehouse.value = scope.$index

  const res = await GetProductPropertyInventory({
    ProductPropertyId: data.productPropertyId,
    ServiceType: 1
  })

  data.warehouseTotal = res.total
  totalWarehouse.value = res.total
  tableWarehouse.value = res.inventoryDetails.map((val) => ({
    warehouseCheckbox: val.id,
    name: val.name,
    inventory: val.inventory
  }))
}

const getValueOfSelected = async (_value, obj, scope) => {
  const data = scope.row
  duplicateProduct.value = undefined
  duplicateProduct.value = ListOfProductsForSale.value.find(
    (val) => val?.productPropertyId == _value
  )
  if (duplicateProduct.value) {
    duplicateProductMessage()
  } else {
    data.priceChange = false
    data.productPropertyId = obj?.productPropertyId
    data.productCode = obj.value
    data.productName = obj.name
    getTotalWarehouse()
    //TODO
    data.unitPrice = await getProductPropertyPrice(data?.productPropertyId, 1, data.quantity)
    data.originalPrice = data.unitPrice
    data.totalPrice = data.unitPrice * parseInt(data.quantity)
    changePriceRowTable(scope, true)
    // add new row
    if (scope.$index == ListOfProductsForSale.value.length - 1) {
      ListOfProductsForSale.value.push({ ...productForSale })
    }
  }
}

const handleGetTotal = async (_index, props) => {
  const data = props.row
  totalPriceOrder.value = 0
  totalFinalOrder.value = 0
  data.unitPrice = await getProductPropertyPrice(data?.productPropertyId, 1, data.quantity)
  data.totalPrice = data.unitPrice * data.quantity
  ListOfProductsForSale.value.map((val) => {
    if (val.totalPrice) totalPriceOrder.value += parseInt(val.totalPrice)
  })
  promoCash.value != 0
    ? (totalFinalOrder.value = totalPriceOrder.value - promoCash.value)
    : (totalFinalOrder.value =
        totalPriceOrder.value - (totalPriceOrder.value * promoValue.value) / 100)

  /* Tạm thời bỏ VAT ngày cmt 21/02/2023
  if (radioVAT.value.length < 4) {
    VAT.value = true
    valueVAT.value = radioVAT.value.substring(0, radioVAT.value.length - 1)
    if (totalFinalOrder.value) {
      totalFinalOrder.value += (totalFinalOrder.value * parseInt(valueVAT.value)) / 100
    }
  }
  */
}

const duplicateProductChildren = ref()
const updatePrice = (_value, obj, scope) => {
  const data = scope.row
  duplicateProductChildren.value = undefined
  duplicateProductChildren.value = tableReturnFullyIntegrated.value?.find(
    (val) => val?.productPropertyId == _value
  )
  if (duplicateProductChildren.value) {
    duplicateProductMessage()
  } else {
    data.productPropertyId = obj?.productPropertyId
    data.productCode = obj.productCode
    data.productPropertyName = obj.productPropertyName
    data.unitPrice = Number(obj.unitPrice)
    data.totalPrice = Number(obj.unitPrice) * data.quantity
    data.maximumQuantity = obj.maximumQuantity
  }
}
const updateExchangePrice = (_value, obj, scope) => {
  const data = scope.row
  duplicateProductChildren.value = undefined
  duplicateProductChildren.value = tableProductInformationExportChange.value?.find(
    (val) => val?.productPropertyId == _value
  )
  if (duplicateProductChildren.value) {
    duplicateProductMessage()
  } else {
    data.productPropertyId = obj?.productPropertyId
    data.productCode = obj.productCode
    data.productPropertyName = obj.productPropertyName
    data.unitPrice = Number(obj.unitPrice)
    data.totalPrice = Number(obj.unitPrice) * data.quantity
    data.maximumQuantity = obj.maximumQuantity
  }
}

let customerID = ref()

const getValueOfCustomerSelected = (value, obj) => {
  changeAddressCustomer(value)
  customerID.value = value
  formAddress.province = obj.provinceId
  formAddress.district = obj.districtId
  formAddress.wardCommune = obj.wardId
  formAddress.detailedAddress = obj.address
  ruleForm.customerName = obj.label
}

// phân loại khách hàng: 1: công ty, 2: cá nhân
const valueClassify = ref(false)
const optionsClassify = [
  {
    value: true,
    id: 1,
    label: t('formDemo.company')
  },
  {
    value: false,
    id: 2,
    label: t('formDemo.individual')
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
    Code: autoCustomerCode,
    IsOrganization: valueClassify.value,
    Name: addQuickCustomerName.value,
    TaxCode: quickTaxCode.value,
    Representative: quickRepresentative.value,
    Phonenumber: quickPhoneNumber.value,
    Email: quickEmail.value,
    CustomerType: valueSelectCustomer.value
  }
  const formCustomerPayLoad = FORM_IMAGES(payload)
  const res = await addQuickCustomer(formCustomerPayLoad)
  if (res) {
    ElNotification({
        message: t('reuse.addSuccess'),
        type: 'success'
      })
    callCustomersApi()

  } else {
    ElNotification({
        message: t('reuse.addFail'),
        type: 'warning'
      })
  }  
}

// select khách hàng
const valueSelectCustomer = ref(1)
const optionsCustomer = [
  {
    value: 1,
    label: t('formDemo.customer')
  },
  {
    value: 2,
    label: t('reuse.supplier')
  },
  {
    value: 3,
    label: t('formDemo.joint')
  }
]

const addLastIndexSellTable = () => {
  ListOfProductsForSale.value.push({ ...productForSale })
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

// Total order
const getProductPropertyPrice = async (
  productPropertyId = 0,
  serviceType = 1,
  quantity: 1
): Promise<number> => {
  const getPricePayload = {
    id: productPropertyId,
    serviceType: serviceType,
    Quantity: quantity
  }
  // lấy giá tiền của một sản phẩm
  const res = await getPriceOfSpecificProduct(getPricePayload)
  const price = res.data.price ?? 0

  return price
}
const autoCalculateOrder = () => {
  totalPriceOrder.value = 0
  totalFinalOrder.value = 0
  ListOfProductsForSale.value.map((val) => {
    if (val.totalPrice) totalPriceOrder.value += parseInt(val.totalPrice)
  })

  promoCash.value != 0
    ? (totalFinalOrder.value = totalPriceOrder.value - promoCash.value)
    : (totalFinalOrder.value =
        totalPriceOrder.value - (totalPriceOrder.value * promoValue.value) / 100)

  /* Tạm thời bỏ VAT ngày cmt 21/02/2023
  // if (radioVAT.value.length < 4) {
  //   VAT.value = true
  //   valueVAT.value = radioVAT.value.substring(0, radioVAT.value.length - 1)
  //   if (totalFinalOrder.value) {
  //     totalFinalOrder.value += (totalFinalOrder.value * parseInt(valueVAT.value)) / 100
  //   }
  // }
  */
}

// change address
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

const inputDeposit = ref(0)

watch(
  () => inputDeposit.value,
  () => {
    moneyDeposit.value = totalPriceOrder.value - inputDeposit.value
  }
)

let customerIdPromo = ref()

const removeListProductsSale = (index) => {
  ListOfProductsForSale.value.splice(index, 1)
}

const checkDisabled = ref(false)

let orderDetailsTable = reactive([{}])

let idOrderPost = ref()
// Tạo đơn hàng
const postData = async (pushBack: boolean) => {
  orderDetailsTable = ListOfProductsForSale.value.map((val) => ({
    ProductPropertyId:
      typeof val?.productPropertyId != 'number'
        ? parseInt(val?.productPropertyId)
        : val?.productPropertyId,
    Accessory: val.accessory,
    Description: null,
    Quantity: parseInt(val.quantity),
    UnitPrice: val.unitPrice,
    HirePrice: 0,
    DepositePrice: 0,
    TotalPrice: val.totalPrice,
    ConsignmentSellPrice: 0,
    ConsignmentHirePrice: 0,
    SpaServiceIds: null,
    WarehouseId: null,
    PriceChange: priceChangeOrders.value
  }))
  orderDetailsTable.pop()
  const productPayment = JSON.stringify([...orderDetailsTable])
  const payload = {
    ServiceType: 1,
    OrderCode: ruleForm.orderCode,
    PromotionCode: promoCode.value ?? '',
    CollaboratorId: ruleForm.collaborators,
    CollaboratorCommission: ruleForm.discount,
    Description: ruleForm.orderNotes,
    CustomerId: customerID.value,
    TotalPrice: totalPriceOrder.value,
    DepositePrice: 0,
    DiscountMoney:
      promoCash.value != 0
        ? promoCash.value
        : promoValue.value != 0
        ? (totalPriceOrder.value * promoValue.value) / 100
        : 0,
    InterestMoney: 0,
    // VATMoney: valueVAT.value ? (totalFinalOrder.value * parseInt(valueVAT.value)) / 100 : 0,
    VATMoney: 0,
    Files: Files,
    DeliveryOptionId: ruleForm.delivery,
    ProvinceId: formAddress.province ?? 1,
    DistrictId: formAddress.district ?? 1,
    WardId: formAddress.wardCommune ?? 1,
    Address: customerAddress.value,
    OrderDetail: productPayment,
    CampaignId: campaignId.value ?? '',
    VAT: 0,
    Status: 2,
    WarehouseId: ruleForm.warehouse
  }
  const formDataPayLoad = FORM_IMAGES(payload)
  const res = await addNewOrderList(formDataPayLoad)
  if (res) {
    id = res
    // updateStatusOrders(STATUS_ORDER_SELL[3].orderStatus)
    // reloadStatusOrder()
    ElNotification({
      message: t('reuse.addSuccess'),
      type: 'success'
    })
    if (pushBack == false) {
      router.push({
        name: 'business.order-management.order-list',
        params: { backRoute: String(router.currentRoute.value.name), tab: tab }
      })
    }
  disabledPhieu.value = false
  } else {
    ElNotification({
      message: t('reuse.addFail'),
      type: 'warning'
    })
  }
}

// Phiếu xuất kho tự động
const automaticCouponWareHouse = async (index) => {
  const payload = {
    OrderId: id,
    Type: index
  }

  await postAutomaticWarehouse(payload)
}

// Hủy tạo đơn hàng -> back ra màn danh sách đơn hàng
const backToListOrder = () => {
  router.push({
    name: 'business.order-management.order-list',
    params: { backRoute: String(router.currentRoute.value.name), tab: tab }
  })
  deleteTempCode({
     Code:ruleForm.orderCode
   })
}

// total order
let totalOrder = ref(0)

//lay du lieu tu router
const router = useRouter()
let id: any = Number(router.currentRoute.value.params.id)
const route = useRoute()
const tab = String(route.params.tab)
let type = String(route.params.type)
const approvalId = String(route.params.approvalId)

let dataEdit = ref()

const getOrderStransactionList = async () => {
  const transaction = await getOrderTransaction({ id: id })
  debtTable.value = transaction.data
}
const doCloseOnClickModal = ref(false)
const isKeepDeposite = ref(false)
const disabledDeleteRow = ref(false)
const duplicateStatusButton = ref(false)
const editData = async () => {
  if (type == 'detail') checkDisabled.value = true
  if (type == 'edit' || type == 'detail' || type == 'approval-order') {
    disabledEdit.value = true
    disabledDeleteRow.value = true
    const transaction = await getOrderTransaction({ id: id })
    const res = await getOrderList({ Id: id, ServiceType: 1 })
    if (debtTable.value?.length > 0) debtTable.value?.splice(0, debtTable.value?.length - 1)
    debtTable.value = transaction.data
    getReturnRequestTable()
    const orderObj = { ...res?.data[0] }
    isKeepDeposite.value = orderObj.isKeepDeposite
    arrayStatusOrder.value = orderObj?.statusHistory
    if (arrayStatusOrder.value?.length) {
      arrayStatusOrder.value[arrayStatusOrder.value?.length - 1].isActive = true
      if (type != 'approval-order')
        statusOrder.value = arrayStatusOrder.value[arrayStatusOrder.value?.length - 1]?.orderStatus
      else statusOrder.value = 200
      if (arrayStatusOrder.value[arrayStatusOrder.value?.length - 1].approvedAt)
        duplicateStatusButton.value = true
      else duplicateStatusButton.value = false
    }
    dataEdit.value = orderObj
    Files = orderObj.orderFiles
    if (res.data) {
      ruleForm.orderCode = orderObj.code
      sellOrderCode.value = ruleForm.orderCode
      ruleForm.collaborators = orderObj?.collaborator?.id
      ruleForm.discount = orderObj.collaboratorCommission
      customerID.value = orderObj.customer.id
      ruleForm.customerName = orderObj.customer.id
      ruleForm.orderNotes = orderObj.description
      ruleForm.warehouse = orderObj.warehouseId

      totalPriceOrder.value = orderObj.totalPrice
      totalFinalOrder.value = orderObj.totalPrice

      totalOrder.value = orderObj.totalPrice
      if (orderObj.discountMoney != 0) {
        showPromo.value = true
        promoCash.value = orderObj.discountMoney
      }
      ListOfProductsForSale.value = orderObj.orderDetails

      if (orderObj.promotionCode) {
        showPromo.value = true
        promoActive.value = orderObj.promotionCode + ' | ' + orderObj.promotionCodeInfo
      }
      getTotalWarehouse()
      customerAddress.value = orderObj.address
      ruleForm.delivery = orderObj.deliveryOption
      customerIdPromo.value = orderObj.customerId

      totalFinalOrder.value = orderObj.totalPrice - orderObj.discountMoney
      if (orderObj.customer?.isOrganization) {
        infoCompany.name = orderObj.customer?.name
        infoCompany.taxCode = orderObj.customer?.taxCode
        infoCompany.phone = orderObj.customer?.phonenumber
        infoCompany.email = 'Email: ' + orderObj.customer?.email
      } else {
        infoCompany.name = orderObj.customer?.name + ' | ' + orderObj.customer?.taxCode
        infoCompany.taxCode = orderObj.customer?.taxCode
        infoCompany.phone = orderObj.customer?.phonenumber
        infoCompany.email = 'Email: ' + orderObj.customer?.email
      }
    }
    orderObj.orderFiles.map((element) => {
      fileList.value?.push({
        url: `${API_URL}${element?.path}`,
        name: element?.fileId
      })
    })
  } else if (type == 'add' || type == ':type') {
    ListOfProductsForSale.value.push({ ...productForSale })
  }
}

// Call api chi tiết bút toán theo id
let tableSalesSlip = ref<any[]>([{}])
let formAccountingId = ref()
const idAcountingEntry = ref()
// Chi tiết bút toán
const openDialogAcountingEntry = (scope,isDisable) => {
  condition.value=isDisable;
  const data = scope.row
  switch (data.typeOfAccountingEntry) {
    case 1:
      openAcountingEntryDialog(data.id, 1)
      break
    case 2:
      openAcountingEntryDialog(data.id, 2)
      break
    case 3:
      openAcountingEntryDialog(data.id, 3)
      break
    case 4:
      openAcountingEntryDialog(data.id, 4)
      break
    default:
      console.log(`Sorry, we are out of ${data.typeOfAccountingEntry}.`)
  }
}

// Trạng thái bút toán
interface typeStatusAccountingEntry {
  transactionStatus: any
  transactionStatusName: any
  approvedAt: any
  createdAt: any
  isActive?: boolean
}
const statusAccountingEntry = ref<Array<typeStatusAccountingEntry>>([])
statusAccountingEntry.value.push({
  transactionStatus: 1,
  transactionStatusName: t('formDemo.initializationBookkeeping'),
  approvedAt: '',
  createdAt: '',
  isActive: true
})

const createStatusAcountingEntry = () => {
  statusAccountingEntry.value = []
  statusAccountingEntry.value.push({
  transactionStatus: 1,
  transactionStatusName: t('formDemo.initializationBookkeeping'),
  approvedAt: '',
  createdAt: '',
  isActive: true
})
}

const updateDetailAcountingEntry = ref(false)
const updateInfoAcountingEntry = async(index) => {
  if (updateDetailAcountingEntry.value) {
    updateOrderStransaction()
  }else {
    postOrderStransaction(index)
    if (index == 2 && keepGoodsOnDeposit.value) {
      const payload = {
        orderId: id,
        status: 5
      }
      await automaticCouponWareHouse(2)
      await UpdateStatusTicketFromOrder(payload)
    }
  }
}

// cập nhật bút toán
const updateOrderStransaction = async() => {
  const payload = {
    accountingEntryId: idAcountingEntry.value,
    isReceiptedMoney: alreadyPaidForTt.value,
    paymentMethods: 1
  }
  await updateOrderTransaction(payload)
  getOrderStransactionList()
}

const checkEditAcountingEntryPaymentType = ref(false)
const openAcountingEntryDialog = async (index, num) => {
  idAcountingEntry.value = index
  updateDetailAcountingEntry.value = true
  const res = await getDetailAccountingEntryById({ id: index })
  formAccountingId.value = { ...res.data }
  tableSalesSlip.value = formAccountingId.value?.paidMerchandises
  tableSalesSlip.value.forEach((e) => {
    e.totalPrice = e.unitPrice * e.quantity
  })
  inputDeposit.value = formAccountingId.value.accountingEntry?.receiveMoney
  moneyDeposit.value = formAccountingId.value.accountingEntry?.deibt
  // paidMoney.value = formAccountingId.value?.paidMoney
  tableAccountingEntry.value[0] = formAccountingId.value.accountingEntry
  tableAccountingEntry.value.forEach((el) => {
    el.intoMoney = Math.abs(el.paidMoney - el.receiveMoney)
  })
  valueMoneyAccoungtingEntry.value = 0
  tableAccountingEntry.value.map((val) => {
    if (val.intoMoney) valueMoneyAccoungtingEntry.value += val.intoMoney
  })
  alreadyPaidForTt.value = formAccountingId.value.accountingEntry?.isReceiptedMoney
  statusAccountingEntry.value = formAccountingId.value.statusHistorys
  statusAccountingEntry.value[statusAccountingEntry.value.length-1].isActive = true
  if (statusAccountingEntry.value[statusAccountingEntry.value.length-1].transactionStatus == 0) {
    showCancelAcountingEntry.value = false
    showCreatedOrUpdateButton.value = false

  } else {
    showCancelAcountingEntry.value = true
    showCreatedOrUpdateButton.value = true
  }
  checkEditAcountingEntryPaymentType.value = true

  getReturnOrder()
  if (num == 1) {
    dialogSalesSlipInfomation.value = true
  } else if (num == 2) {
    totalOutstandingDebt()
    dialogDepositSlipAdvance.value = true
  } else if (num == 4) {
    dialogAccountingEntryAdditional.value = true
  } else if (num == 3) {
    const res = await getReturnRequest({ CustomerOrderId: id })
    const optionsReturnRequest = res.data
    if (optionsReturnRequest[0]?.nhapDetails)
      tableReturnFullyIntegrated.value = optionsReturnRequest[0].nhapDetails
    if (optionsReturnRequest[0]?.xuatDetails)
      tableProductInformationExportChange.value = optionsReturnRequest[0].xuatDetails
    inputReasonReturn.value = optionsReturnRequest[0].description
    changeReturnGoods.value = true
  }
}

// disabled thêm mới phiếu thu chi, phiếu đề nghị thanh toán
const disabledPTAccountingEntry = ref(true)
const disabledPCAccountingEntry = ref(true)
const disabledDNTTAccountingEntry = ref(true)

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

const infoCustomerId = ref()
const changeAddressCustomer = (data) => {
  infoCustomerId.value = optionsCustomerApi.value.find((e) => e.value == data)
  if (infoCustomerId.value.isOrganization) {
    customerAddress.value = optionsCustomerApi.value?.find((e) => e.value == data)?.address ?? ''
    infoCompany.name = infoCustomerId.value.name
    infoCompany.taxCode = infoCustomerId.value.taxCode
    infoCompany.phone = infoCustomerId.value.phone
    infoCompany.email = 'Email: ' + infoCustomerId.value.email
  } else {
    customerAddress.value = optionsCustomerApi.value?.find((e) => e.value == data)?.address ?? ''
    infoCompany.name = infoCustomerId.value.name
    infoCompany.taxCode = infoCustomerId.value.taxCode
    infoCompany.phone = infoCustomerId.value.phone
    infoCompany.email = 'Email: ' + infoCustomerId.value.email
  }
  optionCallPromoAPi = 0
  customerIdPromo.value = infoCustomerId.value.id
  callPromoApi()
}

// Thông tin phiếu thu
const dialogInformationReceipts = ref(false)

// Thông tin phiếu đề nghị thanh toán
const dialogIPRForm = ref(false)

const detailedListExpenses = ref([
  {
    numberVouchers: '',
    dayVouchers: '',
    spentFor: '',
    quantity: 0,
    unitPrice: 0,
    totalPrice: 0,
    note: ''
  }
])

const addRowDetailedListExpoenses = () => {
  detailedListExpenses.value.push({
    numberVouchers: '',
    dayVouchers: '',
    spentFor: '',
    quantity: 0,
    unitPrice: 0,
    totalPrice: 0,
    note: ''
  })
}

watch(
  () => detailedListExpenses.value[detailedListExpenses.value.length - 1],
  () => {
    if (
      detailedListExpenses.value[detailedListExpenses.value.length - 1].numberVouchers &&
      detailedListExpenses.value[detailedListExpenses.value.length - 1].dayVouchers &&
      detailedListExpenses.value[detailedListExpenses.value.length - 1].spentFor &&
      detailedListExpenses.value[detailedListExpenses.value.length - 1].quantity &&
      detailedListExpenses.value[detailedListExpenses.value.length - 1].unitPrice &&
      detailedListExpenses.value[detailedListExpenses.value.length - 1].note
    )
      addRowDetailedListExpoenses()
  },
  {
    deep: true
  }
)

// Thông tin phiếu đặt cọc/tạm ứng
const dialogDepositSlipAdvance = ref(false)

// Thông tin phiếu chi
const dialogPaymentVoucher = ref(false)

// Thông tin phiếu nhập kho hoàn hàng đổi/trả
const informationWarehouseReceipt = ref(false)
const tableFullyIntegrated = ref()
const totalPriceWarehouse = ref(0)

const warehouseTicketCode = ref()
const staffId = ref()
const openDetailFullyIntegrated = async (props) => {
  totalPriceWarehouse.value = 0
  const res = await GetWarehouseTransaction({ Id: parseInt(props.row.warehouseTicketId) })
  warehouseTicketCode.value = res.data[0].transactionCode
  staffId.value = res.data[0].staffId
  tableFullyIntegrated.value = res.data[0].transactionDetails
  tableFullyIntegrated.value.forEach((el) => {
    if (el.importPrice) {
      el.intoMoneyWarehouse = el.importPrice * el.quantity
      totalPriceWarehouse.value += el.intoMoneyWarehouse
    }
  })

  informationWarehouseReceipt.value = true
}

// Thông tin phiếu nhập hoàn
const invoiceForGoodsEntering = ref(false)
const tableInvoice = [
  {
    commodityName:
      'LV Flourine red X monogam bag da sần - Lage(35.5-40.5)-Gently used / Đỏ; không quai',
    accessory: '',
    quantity: '2',
    unitPriceWarehouse: '5,000,000 đ',
    intoMoneyWarehouse: '5,000,000 đ'
  }
]

// Thông tin phiếu bán hàng
const dialogSalesSlipInfomation = ref(false)
const singleTableRef = ref<InstanceType<typeof ElTable>>()

// Thông tin đổi/trả hàng
const changeReturnGoods = ref(false)
const inputReasonReturn = ref('')

const tableReturnFullyIntegrated = ref<Array<historyTableType>>([])
const tableProductInformationExportChange = ref<Array<historyTableType>>([])

const addRowReturnFullyIntegrated = () => {
  tableReturnFullyIntegrated.value.push({
    createdAt: '',
    productPropertyId: undefined,
    productPropertyName: '',
    productCode: '',
    productName: '',
    productPropertyCode: '',
    accessory: '',
    conditionProducts: '',
    quantity: 1,
    unit: '',
    unitPrice: 0,
    totalPrice: 0,
    invoiceGoodsEnteringWarehouse: 0,
    inventoryStatus: ''
  })
}

const addProductInformationExportChange = () => {
  tableProductInformationExportChange.value.push({
    createdAt: '',
    productPropertyId: undefined,
    productPropertyName: '',
    productCode: '',
    productName: '',
    productPropertyCode: '',
    accessory: '',
    conditionProducts: '',
    quantity: 1,
    unit: '',
    unitPrice: 0,
    totalPrice: 0,
    invoiceGoodsEnteringWarehouse: 0,
    inventoryStatus: ''
  })
}

if (tableReturnFullyIntegrated.value?.length == 0) addRowReturnFullyIntegrated()
if (tableProductInformationExportChange.value?.length == 0) addProductInformationExportChange()

watch(
  () => tableReturnFullyIntegrated.value,
  () => {
    if (checkCreate.value) {
    if (
      tableReturnFullyIntegrated.value[tableReturnFullyIntegrated.value.length - 1]
        ?.productPropertyId &&
      tableReturnFullyIntegrated.value[tableReturnFullyIntegrated.value.length - 1].quantity &&
      tableReturnFullyIntegrated.value[tableReturnFullyIntegrated.value.length - 1].unitPrice &&
      tableReturnFullyIntegrated.value[tableReturnFullyIntegrated.value.length - 1].totalPrice
    )
      addRowReturnFullyIntegrated()
    }
  },
  {
    deep: true
  }
)

watch(
  () => tableProductInformationExportChange.value,
  () => {
    if (checkCreate.value) {
    if (
      tableProductInformationExportChange.value[
        tableProductInformationExportChange.value.length - 1
      ]?.productPropertyId &&
      tableProductInformationExportChange.value[
        tableProductInformationExportChange.value.length - 1
      ].quantity &&
      tableProductInformationExportChange.value[
        tableProductInformationExportChange.value.length - 1
      ].unitPrice &&
      tableProductInformationExportChange.value[
        tableProductInformationExportChange.value.length - 1
      ].totalPrice
    )
      addProductInformationExportChange()
    }
  },
  {
    deep: true
  }
)

// Lấy bảng lịch sử nhập xuất đổi trả
const getReturnRequestTable = async () => {
  const res = await getReturnRequestForOrder({ CustomerOrderId: id })
  const optionsReturnRequest = res.data
  if (Array.isArray(unref(optionsReturnRequest)) && optionsReturnRequest?.length > 0) {
    historyTable.value = optionsReturnRequest?.map((e) => ({
      createdAt: e.returnRequestInfo?.createdAt ?? '',
      productPropertyId: e?.productPropertyId,
      productPropertyCode: e?.productPropertyCode,
      productPropertyName: e?.productPropertyName,
      accessory: e?.accessory,
      quantity: e?.quantity,
      unitName: e?.unitName,
      returnDetailType: e?.returnDetailType,
      returnDetailTypeName: e?.returnDetailTypeName,
      returnDetailStatusName: e?.returnDetailStatusName,
      value: e?.productPropertyId,
      warehouseTicketCode: e.warehouseTicketCode,
      warehouseTicketId: e.warehouseTicketId,
      warehouseTicketStatusName: e.warehouseTicketStatusName
    }))
  }
}

// Tạo phiếu cho đơn đổi trả
const createTicketFromReturnOrders = async () => {
  const payload = {
    orderId: id,
    returnRequestId: idReturnRequest.value
  }

  const res = await GetWarehouseTransaction({OrderId: id})
  if (res.data[0].status == 4) {
    await createTicketFromReturnOrder(payload).then(() => {
      ElNotification({
        message: 'Tạo phiếu đổi trả thành công',
        type: 'success'
      })
    })
    .catch(() =>
      ElNotification({
        message: 'Tạo phiếu đổi trả thất bại',
        type: 'warning'
      })
    )
  } else ElNotification({
        message: 'Đơn hàng chưa được xuất kho',
        type: 'warning'
      })
  
}

const alreadyPaidForTt = ref(false)

// Bút toán bổ sung
const dialogAccountingEntryAdditional = ref(false)

const tableAccountingEntry = ref([
  {
    content: '',
    kindOfMoney: '',
    receiveMoney: 0,
    paidMoney: 0,
    intoMoney: 0
  }
])

// fake tạm option thêm nhanh sản phẩm
const choosePayment = [
  {
    value: 1,
    label: t('formDemo.cashPayment')
  },
  {
    value: 0,
    label: t('formDemo.cardPayment')
  }
]
let payment = ref(choosePayment[1].value)

// Danh sách nhân viên
const currentCreator = ref()
const getStaffList = ref()
const callApiStaffList = async () => {
  const res = await getAllStaffList({ PageIndex: 1, PageSize: 40 })
  getStaffList.value = res.data.map((el) => ({
    value: el.id,
    label: el.name + ' | ' + el.contact
  }))
  getStaffList.value.push(
    {
      value: currentCreator.value.id,
      label: currentCreator.value.name + ' | ' + currentCreator.value.contact
    }
  )
}

let statusOrder = ref(2)

// fake trạng thái đơn hàng
// bắt thay đổi đơn hàng
let countProductChangePrice = ref(0)
const priceChangeOrders = ref(false)
const changePriceRowTable = (props, checkRechangeProduct) => {
  const data = props.row
  data.totalPrice = data.unitPrice * parseInt(data.quantity)
  if (checkRechangeProduct) data.priceChange = true
  if (data.originalPrice != data.unitPrice && !data.priceChange) {
    priceChangeOrders.value = true
    data.priceChange = true
    countProductChangePrice.value++
    if (type == 'add' || type == ':type') {
      arrayStatusOrder.value.splice(0, arrayStatusOrder.value.length)
      arrayStatusOrder.value.push({
        orderStatusName: 'Duyệt giá thay đổi',
        orderStatus: STATUS_ORDER_SELL[1].orderStatus,
        isActive: true
      })
    }
    doubleDisabled.value = true
    statusOrder.value = STATUS_ORDER_SELL[1].orderStatus
  } else if (data.originalPrice == data.unitPrice && data.priceChange) {    
    if (!checkRechangeProduct || (checkRechangeProduct && countProductChangePrice.value == 1)) countProductChangePrice.value--
    if (countProductChangePrice.value == 0 ) {
      priceChangeOrders.value = false
      data.priceChange = false
      if (type == 'add' || type == ':type') {
        arrayStatusOrder.value.splice(0, arrayStatusOrder.value.length)
        arrayStatusOrder.value.push({
          orderStatusName: 'Chốt đơn hàng',
          orderStatus: STATUS_ORDER_SELL[2].orderStatus,
          isActive: true
        })
      }
      doubleDisabled.value = !doubleDisabled.value
      statusOrder.value = STATUS_ORDER_SELL[2].orderStatus
    }    
  }  
  autoCalculateOrder()
}

interface statusOrderType {
  orderStatusName: string
  orderStatus: number
  isActive?: boolean
  createdAt?: string
  approvedAt?: string
}
let arrayStatusOrder = ref(Array<statusOrderType>())
arrayStatusOrder.value.pop()
if (type == 'add' && priceChangeOrders.value == false || type == ':type' && priceChangeOrders.value == false)
  arrayStatusOrder.value.push({
    orderStatusName: 'Chốt đơn hàng',
    orderStatus: 2,
    isActive: true
  })

// dialog print
const nameDialog = ref('')
// const testDialog = ref(false)

// Đúng thì hiển thị button Lưu và ghi sổ và hủy bút toán
const showCreatedOrUpdateButton = ref (false)
const showCancelAcountingEntry = ref(true)

// Tạo mới phiếu thanh toán
function openBillDialog() {
  showCreatedOrUpdateButton.value = true
  showCancelAcountingEntry.value = false
  updateDetailAcountingEntry.value = false
  createStatusAcountingEntry()
  alreadyPaidForTt.value = true
  checkEditAcountingEntryPaymentType.value = false
  dialogSalesSlipInfomation.value = !dialogSalesSlipInfomation.value
  tableSalesSlip.value = ListOfProductsForSale.value
  nameDialog.value = 'bill'
}

const outstandingDebt = ref(0)
const totalOutstandingDebt = () => {
  outstandingDebt.value = 0
  debtTable.value?.forEach((val) =>  {
    if (val.deibt != 0) {
      outstandingDebt.value += val?.deibt
    }
  })
}
// Tạo mới phiếu đặt cọc
function openDepositDialog() {
  showCreatedOrUpdateButton.value = true
  showCancelAcountingEntry.value = false
  updateDetailAcountingEntry.value = false
  totalOutstandingDebt()
  createStatusAcountingEntry()
  alreadyPaidForTt.value = true
  dialogDepositSlipAdvance.value = !dialogDepositSlipAdvance.value
  tableSalesSlip.value = ListOfProductsForSale.value
  nameDialog.value = 'deposit'
}

// Thêm mới bút toán bổ sung
const openAdditionalDialog = () => {
  showCreatedOrUpdateButton.value = true
  showCancelAcountingEntry.value = false
  updateDetailAcountingEntry.value = false
  createStatusAcountingEntry()

  dialogAccountingEntryAdditional.value = true
}

function openReceiptDialog() {
  getReceiptCode()
  clearData()
  moneyReceipts.value = newTable.value.reduce((total, value) => {
    total += parseInt(value.receiveMoney)
    return total
  }, 0)
  dialogInformationReceipts.value = true
  nameDialog.value = 'Phiếu thu'
}

function openPaymentDialog() {
  getcodeExpenditures()
  clearData()
  moneyReceipts.value = newTable.value.reduce((total, value) => {
    total += parseInt(value.paidMoney)
    return total
  }, 0)
  dialogPaymentVoucher.value = !dialogPaymentVoucher.value
  nameDialog.value = 'Phiếu chi'
}

const openPaymentRequest = () => {
  newCodePaymentRequest()
  clearData()
  moneyReceipts.value = newTable.value.reduce((total, value) => {
    total += parseInt(value.paidMoney)
    return total
  }, 0)
  dialogIPRForm.value = true
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
    'left=0,top=0,width=800px,height=1123px,toolbar=0,scrollbars=0,status=0'
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

let childrenTable = ref()
let objOrderStransaction = ref()
let idStransaction = ref()

const checkPTC = ref(0)

// Thêm bút toán cho đơn hàng
const postOrderStransaction = async (index: number) => {
  childrenTable.value = ListOfProductsForSale.value.map((val) => ({
    merchadiseTobePayforId: parseInt(val.id),
    quantity: parseInt(val.quantity)
  }))

  if (index == 3) {
    exportPrice.value - refundPrice.value > 0 ? (checkPTC.value = 1) : (checkPTC.value = 0)
  }
  if (index == 4) {
    tableAccountingEntry.value[0].receiveMoney > tableAccountingEntry.value[0].paidMoney
      ? (checkPTC.value = 1)
      : (checkPTC.value = 0)
  }
  const payload = {
    orderId: id,
    content:
      index == 1
        ? t('formDemo.bill')
        : index == 2
        ? t('formDemo.depositSlipAdvance')
        : index == 3
        ? 'Đổi/trả hàng'
        : tableAccountingEntry.value[0].content,
    paymentRequestId: null,
    receiptOrPaymentVoucherId: null,
    receiveMoney:
      index == 1
        ? totalFinalOrder.value
        : index == 2
        ? inputDeposit.value
        : index == 3 && checkPTC.value == 0
        ? exchangePrice.value
        : index == 3 && checkPTC.value == 1
        ? 0
        : tableAccountingEntry.value[0].receiveMoney,
    paidMoney:
      index == 1 || index == 2
        ? 0
        : index == 3 && checkPTC.value == 0
        ? exchangePrice.value
        : index == 3 && checkPTC.value == 1
        ? 0
        : tableAccountingEntry.value[0].paidMoney,
    deibt: index == 1 || index == 3 || index == 4 ? 0 : moneyDeposit.value,
    typeOfPayment: index == 1 || index == 2 ? 1 : index == 3 || index == 4 ? checkPTC.value : 0,
    paymentMethods: 1,
    status: 1,
    isReceiptedMoney: alreadyPaidForTt.value ? 1 : 0,
    isKeepDeposite: keepGoodsOnDeposit.value,
    typeOfMoney: 1,
    merchadiseTobePayfor: childrenTable.value,
    typeOfAccountingEntry: index,
    returnRequestId: idReturnRequest.value
  }

  objOrderStransaction.value = await addOrderStransaction(payload)
  idStransaction.value = objOrderStransaction.value.paymentRequestId
  getOrderStransactionList()
}

// Tạo mới yêu cầu đổi trả
const idReturnRequest = ref()
const postReturnRequest = async () => {
  codeReturnRequest.value = autoCodeReturnRequest
  const tableImportPost = ref()
  const tableExportPost = ref()
  if (
    !tableReturnFullyIntegrated.value[tableReturnFullyIntegrated.value.length - 1]
      ?.productPropertyId
  )
    tableReturnFullyIntegrated.value.pop()
  if (
    !tableProductInformationExportChange.value[tableProductInformationExportChange.value.length - 1]
      ?.productPropertyId
  )
    tableProductInformationExportChange.value.pop()
  if (tableReturnFullyIntegrated.value?.length)
    tableImportPost.value = tableReturnFullyIntegrated.value?.map((el) => ({
      productPropertyId: el?.productPropertyId,
      quantity: typeof el.quantity == 'string' ? parseInt(el.quantity) : el.quantity,
      accessory: '',
      returnDetailType: 1,
      unitPrice: el.unitPrice,
      totalPrice: el.totalPrice
    }))
  if (tableProductInformationExportChange.value?.length)
    tableExportPost.value = tableProductInformationExportChange.value?.map((el) => ({
      productPropertyId: el?.productPropertyId,
      quantity: typeof el.quantity == 'string' ? parseInt(el.quantity) : el.quantity,
      accessory: '',
      returnDetailType: 2,
      unitPrice: el.unitPrice,
      totalPrice: el.totalPrice
    }))
  const payload = {
    customerOrderId: id,
    code: codeReturnRequest.value,
    name: 'Đổi trả đơn hàng ',
    description: inputReasonReturn.value ?? '',
    returnRequestType: 1,
    tienBan: refundPrice.value ?? 0,
    tienHoan: exportPrice.value ?? 0,
    totalPrice: exchangePrice.value ?? 0,
    nhapDetails: tableImportPost.value ?? [],
    xuatDetails: tableExportPost.value ?? [],
    giaHanDetails: [],
    isPaid: alreadyPaidForTt.value
  }
  idReturnRequest.value = await createReturnRequest(payload)
  postOrderStransaction(3)
  createTicketFromReturnOrders()
  getReturnRequestTable()
  reloadStatusOrder()
}

const getReceiptCode = async () => {
  codeReceipts.value = await getReceiptPaymentVoucher()
}

const getcodeExpenditures = async () => {
  codeExpenditures.value = await getReceiptPaymentVoucher()
}

const newCodePaymentRequest = async () => {
  codePaymentRequest.value = await getCodePaymentRequest()
}

let moneyDeposit = ref(0)

const inputRecharger = ref()

const PrintReceipts = ref(false)

// Lý do thu tiền
const inputReasonCollectMoney = ref()

// Thêm mới phiếu thu
let objidPT = ref()
let idPT = ref()
const postPT = async () => {
  const payload = {
    Code: codeReceipts.value,
    TotalMoney: moneyReceipts.value,
    TypeOfPayment: 1,
    status: 1,
    PeopleType: 1,
    PeopleId: inputRecharger.value,
    OrderId: id,
    Type: 0,
    Description: inputReasonCollectMoney.value,
    AccountingEntryId: null,
    EnterMoney: enterMoney.value
  }
  const formDataPayLoad = FORM_IMAGES(payload)
  objidPT.value = await addTPV(formDataPayLoad)
  idPT.value = objidPT.value.receiptAndpaymentVoucherId
  handleChangeReceipts()
}

// Thêm mới phiếu chi
let objidPC = ref()
let idPC = ref()
const postPC = async () => {
  const payload = {
    Code: codeExpenditures.value,
    TotalMoney: moneyReceipts.value,
    TypeOfPayment: 1,
    status: 1,
    PeopleType: 1,
    PeopleId: inputRecharger.value,
    OrderId: id,
    Type: 1,
    Description: inputReasonCollectMoney.value,
    AccountingEntryId: null,
    EnterMoney: enterMoney.value
  }
  const formDataPayLoad = FORM_IMAGES(payload)
  objidPC.value = await addTPV(formDataPayLoad)
  idPC.value = objidPC.value.receiptAndpaymentVoucherId
  handleChangeReceipts()
}

// Thêm mã phiếu thu/chi vào debtTable
const handleChangeReceipts = async () => {
  if (newTable.value?.length) {
    newTable.value.forEach((val, index, arr) => {
      const payload = {
        accountingEntryId: val.id,
        paymentRequestId: 0,
        receiptOrPaymentVoucherId: idPT.value ?? idPC.value,
        isReceiptedMoney: true,
        status: 0,
        paymentMethods: 1
      }
      updateOrderTransaction(payload).then(() => {
        if (index == arr.length - 1) getOrderStransactionList()
      })
    })
  }
  await getOrderStransactionList()
}

// Lấy chi tiết phiếu thu chi
let formDetailPaymentReceipt = ref()
const getDetailPayment = async (_index, scope) => {
  const res = await getDetailReceiptPaymentVoucher({
    id: scope.row.receiptOrPaymentVoucherId
  })
  formDetailPaymentReceipt.value = res.data
  nameDialog.value = 'Phiếu thu'
  codeReceipts.value = formDetailPaymentReceipt.value?.code
  codeExpenditures.value = formDetailPaymentReceipt.value?.code
  inputReasonCollectMoney.value = formDetailPaymentReceipt.value?.description
  moneyReceipts.value = formDetailPaymentReceipt.value?.totalMoney
  payment.value = formDetailPaymentReceipt.value?.typeOfPayment
  inputRecharger.value = formDetailPaymentReceipt.value?.peopleId ?? 1
  enterMoney.value = formDetailPaymentReceipt.value?.enterMoney
  dialogInformationReceipts.value = true
}

// Lấy chi tiết phiếu đề nghị thanh toán
const getDetailPaymentRequest = async (_index, scope) => {
  const res = await GetPaymentRequestDetail({
    id: scope.row.paymentRequestId
  })
  
  if (res.data) {
    formDetailPaymentReceipt.value = res.data

    totalPayment.value = formDetailPaymentReceipt.value.paymentRequest.totalPrice
    moneyReceipts.value = formDetailPaymentReceipt.value.paymentRequest.totalMoney
    depositePayment.value = formDetailPaymentReceipt.value.paymentRequest.depositeMoney
    debtPayment.value = formDetailPaymentReceipt.value.paymentRequest.debtMoney
    inputReasonCollectMoney.value = formDetailPaymentReceipt.value.paymentRequest.reasonCollectMoney
    enterMoney.value = formDetailPaymentReceipt.value.paymentRequest.enterMoney
    inputRecharger.value = formDetailPaymentReceipt.value.paymentRequest.peopleId

    detailedListExpenses.value = formDetailPaymentReceipt.value.paymentRequestDetail
    dialogIPRForm.value = true
  }
}

const clearData = () => {
  totalPayment.value = 0
  depositePayment.value = 0
  debtPayment.value = 0
  inputReasonCollectMoney.value = ''
  enterMoney.value = ''
  inputRecharger.value = currentCreator.value.id

  detailedListExpenses.value.splice(0, detailedListExpenses.value.length - 1)
  addRowDetailedListExpoenses()
}

// Bật dialog thêm nhanh khách hàng
const openDialogAddQuickCustomer = () => {
  clearFormPostCustomer()

  dialogAddQuick.value = true
}

// clear form thêm nhanh khách hàng
const clearFormPostCustomer = () => {
  addQuickCustomerName.value = ''
  quickTaxCode.value = ''
  quickTaxCode.value = ''
  quickRepresentative.value = ''
  quickPhoneNumber.value = ''
  quickEmail.value = ''
}

// Thêm mới phiếu đề nghị thanh toán
let objIdPayment = ref()
let idPayment = ref()
const postPaymentRequest = async () => {
  if (!detailedListExpenses.value[detailedListExpenses.value.length - 1].numberVouchers)
    detailedListExpenses.value.pop()
  const payload = {
    Code: codePaymentRequest.value,
    TotalMoney: moneyReceipts.value,
    PaymentType: payment.value,
    PeopleId: inputRecharger.value,
    status: 0,
    PeopleType: 1,
    OrderId: id,
    Description: '',
    Document: null,
    AccountingEntryId: null,
    ReasonCollectMoney: inputReasonCollectMoney.value,
    EnterMoney: enterMoney.value,
    ExpensesDetail: JSON.stringify(detailedListExpenses.value),
    DepositeMoney: depositePayment.value,
    DebtMoney: debtPayment.value,
    TotalPrice: totalPayment.value
  }

  const formDataPayLoad = FORM_IMAGES(payload)
  objIdPayment.value = await addDNTT(formDataPayLoad)
  idPayment.value = objIdPayment.value.paymentRequestId
  handleChangePaymentOrder()
}

// Tổng tiền table phiếu đề nghị thanh toán nếu có
const totalPayment = ref(0)
const depositePayment = ref(0)
const debtPayment = ref(0)

const autoChangeDepositePayment = () => {
  debtPayment.value = totalPayment.value - depositePayment.value
}

const autoCalculateMoneyPayment = () => {
  totalPayment.value = 0
  detailedListExpenses.value.map((el) => {
    if (el.unitPrice && el.quantity) {
      el.totalPrice = el.unitPrice * el.quantity
      totalPayment.value += el.totalPrice
    }
  })
  autoChangeDepositePayment()
}

// form phiếu thu
const formReceipts = ref()
const moneyReceipts = ref(0)

const getFormReceipts = () => {
  if (enterMoney.value) {
    formReceipts.value = {
      sellOrderCode: sellOrderCode.value,
      codeReceipts: codeReceipts.value,
      recharger: inputRecharger.value,
      moneyReceipts: moneyReceipts.value,
      reasonCollectingMoney: inputReasonCollectMoney.value,
      enterMoney: enterMoney.value,
      payment: payment.value == 0 ? 'Tiền mặt' : 'Tiền thẻ'
    }

    PrintReceipts.value = !PrintReceipts.value
  } else {
    ElMessage({
      showClose: true,
      message: 'Vui lòng nhập tiền bằng chữ',
      type: 'error'
    })
  }
}

// Thêm mới mã phiếu đề nghị thanh toán vào debtTable
const handleChangePaymentOrder = async () => {
  if (newTable.value?.length) {
    newTable.value.forEach((val, index, arr) => {
      const payload = {
        accountingEntryId: val.id,
        paymentRequestId: idPayment.value,
        receiptOrPaymentVoucherId: 0,
        isReceiptedMoney: true,
        status: 0,
        paymentMethods: 1
      }
      updateOrderTransaction(payload).then(() => {
        if (index == arr.length - 1) getOrderStransactionList()
      })
    })
  }
}

// input nhập tiền viết bằng chữ
const enterMoney = ref()
const totalWarehouse = ref()

// const showIdWarehouse = (scope) => {
//   radioWarehouseId.value = scope.row.warehouseCheckbox
//   ListOfProductsForSale.value[indexRowWarehouse.value].warehouseId = radioWarehouseId.value
//   ListOfProductsForSale.value[indexRowWarehouse.value].warehouseName = scope.row.name
// }

//TruongNgo
const refundPrice = computed(() => {
  return getRefundPrice()
})
const exportPrice = computed(() => {
  return getExportPrice()
})
const exchangePrice = computed(() => {
  return refundPrice.value - exportPrice.value
})
const getRefundPrice = () => {
  let price = 0
  tableReturnFullyIntegrated.value.map((item) => {
    item.totalPrice !== undefined ? (price += item.totalPrice) : ''
  })
  return price
}
const getExportPrice = () => {
  let money = 0
  tableProductInformationExportChange.value.map((item) => {
    item.totalPrice !== undefined ? (money += item.totalPrice) : ''
  })
  return money
}

const listOfOrderProduct = ref()
const getReturnOrder = () => {
  listOfOrderProduct.value = ListOfProductsForSale.value?.map((el) => ({
    productCode: el?.productCode,
    productPropertyCode: el?.productPropertyCode,
    productPropertyName: el?.productPropertyName,
    productPropertyId: el?.productPropertyId,
    unitPrice: el?.unitPrice,
    totalPrice: el?.totalPrice,
    maximumQuantity: el?.quantity
  }))
}

const showErrorMessage = (num) => {
  ElMessage.error(`Vui lòng nhập số lượng bé hơn hoặc bằng ${num}`)
}
const checkMaximunQuantity = (scope) => {
  const data = scope.row
  if (data.quantity > data.maximumQuantity) showErrorMessage(data.maximumQuantity)
}

// disabled phiếu thanh toán và phiếu đặt cọc tạm ứng
const doubleDisabled = ref(false)
const showPromo = ref(false)

const valueMoneyAccoungtingEntry = ref(0)
const autoChangeMoneyAccountingEntry = (_val, scope) => {
  valueMoneyAccoungtingEntry.value = 0
  const data = scope.row
  data.intoMoney = Math.abs(parseInt(data.paidMoney) - parseInt(data.receiveMoney))

  tableAccountingEntry.value.map((val) => {
    if (val.intoMoney) valueMoneyAccoungtingEntry.value += val.intoMoney
  })
}

/* Tạm thời bỏ VAT 21/02/2023
// Cập nhật lại giá tiền khi thay đổi VAT
  const valueVAT = ref()
  const VAT = ref(false)
  const changePriceVAT = (val) => {
    if (val == 'Không bao gồm VAT') VAT.value = false
    autoCalculateOrder()
  }
*/

// check disabled
const disabledEdit = ref(false)

const autoCollaboratorCommission = (index) => {
  optionsCollaborators.value.map((val) => {
    if (val.value == index) ruleForm.discount = val.collaboratorCommission
  })
}

let Files = reactive({})
const validImageType = ['jpeg', 'png']
//cái này validate file chỉ cho ảnh tí a sửa lại nhé
const beforeAvatarUpload = (rawFile, type: string) => {
  if (rawFile) {
    //nếu là 1 ảnh
    if (type === 'single') {
      if (rawFile.raw && rawFile.raw['type'].split('/')[0] !== 'image') {
        ElMessage.error(t('reuse.notImageFile'))
        return false
      } else if (rawFile.raw && !validImageType.includes(rawFile.raw['type'].split('/')[1])) {
        ElMessage.error(t('reuse.onlyAcceptValidImageType'))
        return false
      } else if (rawFile.raw?.size / 1024 / 1024 > 4) {
        ElMessage.error(t('reuse.imageOver4MB'))
        return false
      } 
      // else if (rawFile.name?.split('.')[0].length > 100) {
      //   ElMessage.error(t('reuse.checkNameImageLength'))
      //   return false
      // }
    }
    //nếu là 1 list ảnh
    if (type === 'list') {
      let inValid = true
      rawFile.map((file) => {
        if (file.raw && file.raw['type'].split('/')[0] !== 'image') {
          ElMessage.error(t('reuse.notImageFile'))
          inValid = false
        } else if (file.raw && !validImageType.includes(file.raw['type'].split('/')[1])) {
          ElMessage.error(t('reuse.onlyAcceptValidImageType'))
          inValid = false
          return false
        } else if (file.size / 1024 / 1024 > 4) {
          ElMessage.error(t('reuse.imageOver4MB'))
          inValid = false
        } else if (file.name?.split('.')[0].length > 100) {
          ElMessage.error(t('reuse.checkNameImageLength'))
          inValid = false
          return false
        }
      })
      return inValid
    }
    return true
  }
  // else {
  //   //báo lỗi nếu ko có ảnh
  //   if (type === 'list' && fileList.value.length > 0) {
  //     return true
  //   }
  //   if (type === 'single' && (rawUploadFile.value != undefined || imageUrl.value != undefined)) {
  //     return true
  //   } else {
  //     ElMessage.warning(t('reuse.notHaveImage'))
  //     return false
  //   }
  // }
}
const ListFileUpload = ref()
const handleChange: UploadProps['onChange'] = async (_uploadFile, uploadFiles) => {
  ListFileUpload.value = uploadFiles
  uploadFiles.map((file) => {
    beforeAvatarUpload(file, 'single') ? '' : file.raw ? handleRemove(file) : ''
  })
  Files = [...ListFileUpload.value.map((el) => el?.raw)]
}
const fileList = ref<UploadUserFile[]>([])

// infinity scroll CTV
// Call api danh sách cộng tác viên
const optionsCollaborators = ref()

const pageIndexCollaborator = ref(1)
const callApiCollaborators = async () => {
  const res = await getCollaboratorsInOrderList({
    PageIndex: pageIndexCollaborator.value,
    PageSize: 20
  })
  if (res.data && res.data?.length > 0) {
    optionsCollaborators.value = res.data.map((collaborator) => ({
      label: collaborator.code + ' | ' + collaborator.accountName,
      value: collaborator.id, // cdetailollaborator
      collaboratorCommission: collaborator.discount,
      phone: collaborator.accountNumber
    }))
  }
}

const scrollCollaboratorTop = ref(false)
const scrollCollaboratorBottom = ref(false)

const noMoreCollaboratorData = ref(false)

const ScrollCollaboratorBottom = () => {
  scrollCollaboratorBottom.value = true
  pageIndexCollaborator.value++
  noMoreCollaboratorData.value
    ? ''
    : getCollaboratorsInOrderList({ PageIndex: pageIndexCollaborator.value, PageSize: 20 })
        .then((res) => {
          res.data.length == 0
            ? (noMoreCollaboratorData.value = true)
            : res.data.map((el) =>
                optionsCollaborators.value.push({
                  label: el.code + ' | ' + el.accountName,
                  value: el.id,
                  collaboratorCommission: el.discount,
                  phone: el.accountNumber
                })
              )
        })
        .catch(() => {
          noMoreCollaboratorData.value = true
        })
}

const scrolling = (e) => {
  const clientHeight = e.target.clientHeight
  const scrollHeight = e.target.scrollHeight
  const scrollTop = e.target.scrollTop
  if (scrollTop == 0) {
    scrollCollaboratorTop.value = true
  }
  if (scrollTop + clientHeight >= scrollHeight) {
    ScrollCollaboratorBottom()
  }
}

// Lấy danh sách kho
const callApiWarehouseList = async () => {
  const res = await getListWareHouse('')
  if (res?.data) {
    res?.data.map((el) => {
      if (el.children) {
        chooseWarehouse.push({
          value: el.id,
          label: el.name
        })
      }
    })
  }
}

// load lại trạng thái đơn hàng
const reloadStatusOrder = async () => {
  const res = await getOrderList({ Id: id, ServiceType: 1 })

  const orderObj = { ...res?.data[0] }
  arrayStatusOrder.value = orderObj?.statusHistory
  if (arrayStatusOrder.value?.length) {
    arrayStatusOrder.value[arrayStatusOrder.value?.length - 1].isActive = true
    statusOrder.value = arrayStatusOrder.value[arrayStatusOrder.value?.length - 1].orderStatus
    if (arrayStatusOrder.value[arrayStatusOrder.value?.length - 1].approvedAt)
      duplicateStatusButton.value = true
    else duplicateStatusButton.value = false
  }
}

// Sửa thông tin đơn hàng
const updateOrderInfomation = async () => {
  const payload = {
    Id: id,
    CollaboratorId: ruleForm.collaborators,
    CollaboratorCommission: ruleForm.discount,
    Description: ruleForm.orderNotes,
    DeleteFileIds: '',
    Files: Files,
    DeliveryOptionId: ruleForm.delivery,
    ProvinceId: formAddress.province ?? null,
    DistrictId: formAddress.district ?? null,
    WardId: formAddress.wardCommune ?? null,
    Address: customerAddress.value ?? null
  }
  const formUpdateOrder = FORM_IMAGES(payload)
  await updateOrderInfo(formUpdateOrder)
    .then(() => {
      ElNotification({
        message: 'Sửa thành công',
        type: 'success'
      })
    })
    .catch(() =>
      ElNotification({
        message: 'Sửa thất bại',
        type: 'warning'
      })
    )
}

const { push } = useRouter()
// Cập nhật trạng thái đơn hàng
const updateStatusOrders = async (typeState) => {
  if (typeState == STATUS_ORDER_SELL[0].orderStatus) {
    let payload = {
      OrderId: id
    }
    await cancelOrder(FORM_IMAGES(payload))
    reloadStatusOrder()
  } else if (typeState == STATUS_ORDER_SELL[4].orderStatus) {
    let payload = {
      OrderId: id
    }
    await finishStatusOrder(FORM_IMAGES(payload))
    reloadStatusOrder()
  } else {
    if (type == 'add' || type == ':type') {
      let payload = {
        OrderId: idOrderPost.value,
        ServiceType: 1,
        OrderStatus: typeState
      }
      submitForm(ruleFormRef, ruleFormRef2, true)
      updateStatusOrder(FORM_IMAGES(payload))
    } else {
      let paylpad = { OrderId: id, ServiceType: 1, OrderStatus: typeState }
      await updateStatusOrder(FORM_IMAGES(paylpad))
      reloadStatusOrder()
    }
  }
}

// Duyệt đơn hàng
const approvalFunction = async (checkApproved) => {
  const payload = { ItemType: 2, Id: parseInt(approvalId), IsApprove: checkApproved }
  await approvalOrder(FORM_IMAGES(payload))
  push({
    name: `approve.orders-approval.orders-new`
  })
}

const editOrder = () => {
  if (type == 'detail') {
    push({
      name: `business.order-management.order-list.${utility}`,
      params: {
        backRoute: String(router.currentRoute.value.name),
        type: 'edit',
        tab: tab,
        id: id
      }
    })
  } else {
    buttonDuplicate.value = !buttonDuplicate.value
  }
}

// Api hủy đổi trả
const cancelExpendReturn = async() => {
  const payload = {
    OrderId: id
  }
  await cancelReturnOrder(FORM_IMAGES(payload))
  reloadStatusOrder()
}

// call api chi tiết đổi trả
const objReturnRequestInfo = ref()
const callApiReturnRequestForOrder = async() => {
  const res = await getReturnRequestForOrder({CustomerOrderId: id})
  objReturnRequestInfo.value = res?.data[res?.data.length-1].returnRequestInfo
  await getDetailReturnRequest()
}
const getDetailReturnRequest = async() => {
  const res = await getReturnRequest({ CustomerOrderId: id, ReturnRequestId: objReturnRequestInfo.value.id})
  inputReasonReturn.value = res.data[0].description
  tableReturnFullyIntegrated.value = res.data[0]?.nhapDetails
  tableProductInformationExportChange.value = res.data[0]?.xuatDetails
  // alreadyPaidForTt.value =
}

// check created hoặc finish/cancel đổi trả
const checkCreate = ref(true)
const checkCancel = ref(false)

// Hủy đổi trả
const openCancelExpendReturn = () => {
  checkCreate.value = false
  checkCancel.value = true
  changeReturnGoods.value = true
  callApiReturnRequestForOrder()
  // statusOrder == STATUS_ORDER_SELL[3].orderStatus
}

// Hoàn thành đổi trả
const openFinishedExpendReturn = () => {
  checkCreate.value = false
  checkCancel.value = false
  changeReturnGoods.value = true
  // statusOrder.value = 150
  callApiReturnRequestForOrder()
  getReturnRequestTable()
}

// Hoàn thành đổi trả api
const doneReturnGoods = async () => {
  const payload = {
    OrderId: id
  }
  const formDataPayLoad = FORM_IMAGES(payload)
  await finishReturnOrder(formDataPayLoad)
  reloadStatusOrder()
  getReturnRequestTable()
}

// create đổi trả hàng
const createdExpendReturn = () => {
  checkCreate.value = true
  checkCancel.value = false
  getReturnOrder()

  inputReasonReturn.value = ''
  tableReturnFullyIntegrated.value = []
  addRowReturnFullyIntegrated()
  tableProductInformationExportChange.value = []
  addProductInformationExportChange()
  changeReturnGoods.value = true
}

// disabled button type detail
let statusButtonDetail = ref(false)
let buttonDuplicate = ref(false)

// Cập nhật trạng thái bút toán
const UpdateStatusTransaction = async() => {
  const payload = {
    AccountingEntryId: idAcountingEntry.value,
    OrderTransactionStatus: 0
  }

  updateStatusTransaction(FORM_IMAGES(payload))
  // Cập nhật lại bảng lịch sử công nợ
  getOrderStransactionList()
}

// Giữ hàng đang đặt cọc
const keepGoodsOnDeposit = ref(false)

// Hoàn thành đơn hàng -> call api phiếu nhập kho tự động
const orderCompletion = () => {
  automaticCouponWareHouse(2)
  updateStatusOrders(STATUS_ORDER_SELL[3].orderStatus)
}

onBeforeMount(async () => {
  await editData()
  await callApiWarehouseList()
  callCustomersApi()
  callApiCollaborators()
  await callApiProductList()
  callApiCity()

  if (type == 'add' || type == ':type') {
    await GenerateCodeOrder({CodeType:5,ServiceType:1})
    .then((res)=>{
      ruleForm.orderCode = res.data
    })
    sellOrderCode.value = autoCodeSellOrder
    codePaymentRequest.value = autoCodePaymentRequest
    disabledPhieu.value = true
  }
  if (type == 'detail') buttonDuplicate.value = true

  if ( typeof(Storage) !== "undefined") {

  var data:any = localStorage.getItem('STAFF_INFO');
  const datas = JSON.parse(data)
  currentCreator.value = JSON.parse(datas.v)
  } else {
    alert('LocalStorage không hỗ trợ trên trình duyệt này!!')
  }
  await callApiStaffList()
})

const disabledPhieu = ref(false)
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
      <!-- phieu in -->
      <div id="billDepositPrint">
        <slot>
          <billPrint
            class="w-[796px] h-[1123px]"
            v-if="dataEdit"
            :dataEdit="dataEdit"
            :nameDialog="nameDialog"
          />
        </slot>
      </div>

      <div id="recpPaymentPrint">
        <slot>
          <receiptsPaymentPrint
            v-if="formReceipts"
            :dataEdit="formReceipts"
            :nameDialog="nameDialog"
          />
        </slot>
      </div>

      <!-- Dialog In phiếu thu chi -->
      <el-dialog :close-on-click-modal="doCloseOnClickModal" v-model="PrintReceipts" class="font-bold" width="40%" align-center >
        <div class="section-bill">
          <div class="flex gap-3 justify-end">
            <el-button @click="printPage('recpPaymentPrint')">{{ t('button.print') }}</el-button>

            <el-button class="btn" @click="PrintReceipts = false">{{ t('reuse.exit') }}</el-button>
          </div>
          <div class="dialog-content">
            <slot>
              <receiptsPaymentPrint
                v-if="formReceipts"
                :dataEdit="formReceipts"
                :nameDialog="nameDialog"
              />
            </slot>
          </div>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button class="btn" @click="PrintReceipts = false">{{ t('reuse.exit') }}</el-button>
          </span>
        </template>
      </el-dialog>

      <div id="IPRFormPrint">
        <slot>
          <paymentOrderPrint v-if="dataEdit" :dataEdit="dataEdit" />
        </slot>
      </div>

      <!-- Dialog Thêm nhanh khách hàng -->
      <el-dialog
        :close-on-click-modal="doCloseOnClickModal"
        v-model="dialogAddQuick"
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
                      :key="item.id"
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
                :placeholder="t('formDemo.enterEmail')"
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
                      :key="item.id"
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
                  callCustomersApi()
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

      <!-- Dialog Thông tin phiếu thu -->
      <el-dialog
        v-model="dialogInformationReceipts"
        :title="t('formDemo.informationReceipts')"
        width="40%"
        align-center
        :close-on-click-modal="doCloseOnClickModal"
      >
        <div>
          <el-divider />
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('formDemo.documentsAttached') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
          <div class="flex gap-4 pt-4 pb-4 items-center">
            <label class="w-[30%] text-right">{{ t('formDemo.orderCode') }}</label>
            <div class="w-[100%] text-xl">{{ sellOrderCode }}</div>
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
              <el-select v-model="inputRecharger" placeholder="Select">
                <div >
                  <!-- @scroll="scrollingCustomer" id="content" -->
                  <el-option
                    v-for="item in getStaffList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </div>
              </el-select>
            </div>
            <div class="flex gap-4 pt-4 pb-6 items-center">
              <label class="w-[30%] text-right"
                >{{ t('formDemo.reasonCollectingMoney') }}
                <span class="text-red-500">*</span></label
              >
              <el-input
                v-model="inputReasonCollectMoney"
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
            <label class="w-[30%] text-right">{{t('formDemo.amountCollect')}}</label>
            <div class="w-[100%] text-xl">{{ changeMoney.format(moneyReceipts) }}</div>
          </div>
          <div class="flex gap-4 pt-4 items-center">
            <label class="w-[30%] text-right"
              >{{ t('formDemo.writtenWords') }} <span class="text-red-500">*</span></label
            >
            <el-input
              v-model="enterMoney"
              style="width: 100%"
              :placeholder="t('formDemo.writtenWords')"
            />
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
            <label class="w-[30%] text-right">{{ t('formDemo.status') }}</label>
            <div class="flex items-center w-[100%]">
              <span
                class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-neutral-900 dark:bg-transparent"
              ></span>
              <span class="box dark:text-black">
                {{ t('formDemo.initializationBookkeeping') }}
                <span class="triangle-right"> </span>
              </span>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-between">
            <el-button @click="getFormReceipts()">{{ t('button.print') }}</el-button>
            <div>
              <span class="dialog-footer">
                <el-button
                  type="primary"
                  size="large"
                  @click="
                    () => {
                      dialogInformationReceipts = false
                      postPT()
                    }
                  "
                  >{{ t('formDemo.saveRecordDebts') }}</el-button
                >
                <el-button size="large" @click="dialogInformationReceipts = false">{{
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
        :title="t('formDemo.paymentVoucherInformation')"
        width="40%"
        align-center
        :close-on-click-modal="doCloseOnClickModal"
      >
        <div>
          <el-divider />
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('formDemo.documentsAttached') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
          <div class="flex gap-4 pt-4 pb-4 items-center">
            <label class="w-[30%] text-right">{{ t('formDemo.orderCode') }}</label>
            <div class="w-[100%] text-xl">{{ sellOrderCode }}</div>
          </div>
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('formDemo.generalInformation') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
          <div>
            <div class="flex gap-4 pt-4 items-center">
              <label class="w-[30%] text-right">{{ t('formDemo.receiptsCode') }}</label>
              <div class="w-[100%] text-xl">{{ codeExpenditures }}</div>
            </div>
            <div class="flex gap-4 pt-4 items-center">
              <label class="w-[30%] text-right"
                >{{ t('formDemo.recharger') }} <span class="text-red-500">*</span></label
              >
              <el-select v-model="inputRecharger" placeholder="Select">
                <div >
                  <!-- @scroll="scrollingCustomer" id="content" -->
                  <el-option
                    v-for="item in getStaffList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </div>
              </el-select>
            </div>
            <div class="flex gap-4 pt-4 pb-6 items-center">
              <label class="w-[30%] text-right"
                >{{ t('formDemo.reasonCollectingMoney') }}
                <span class="text-red-500">*</span></label
              >
              <el-input
                v-model="inputReasonCollectMoney"
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
            <label class="w-[30%] text-right">{{t('formDemo.amountSpent')}}</label>
            <div class="w-[100%] text-xl">{{ changeMoney.format(moneyReceipts) }}</div>
          </div>
          <div class="flex gap-4 pt-4 items-center">
            <label class="w-[30%] text-right"
              >{{ t('formDemo.writtenWords') }} <span class="text-red-500">*</span></label
            >
            <el-input
              v-model="enterMoney"
              style="width: 100%"
              :placeholder="t('formDemo.writtenWords')"
            />
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
            <label class="w-[30%] text-right">{{ t('formDemo.status') }}</label>
            <div class="flex items-center w-[100%]">
              <span
                class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-neutral-900 dark:bg-transparent"
              ></span>
              <span class="box dark:text-black">
                {{ t('formDemo.initializationBookkeeping') }}
                <span class="triangle-right"> </span>
              </span>
            </div>
          </div>
        </div>
        <template #footer>
          <div class="flex justify-between">
            <el-button @click="getFormReceipts()">{{ t('button.print') }}</el-button>
            <div>
              <span class="dialog-footer">
                <el-button
                  type="primary"
                  size="large"
                  @click="
                    () => {
                      dialogPaymentVoucher = false
                      postPC()
                    }
                  "
                  >{{ t('formDemo.saveRecordDebts') }}</el-button
                >
                <el-button size="large" @click="dialogPaymentVoucher = false">{{
                  t('reuse.exit')
                }}</el-button>
              </span>
            </div>
          </div>
        </template>
      </el-dialog>

      <!-- Dialog Thông tin phiếu đề nghị thanh toán -->
      <el-dialog
        v-model="dialogIPRForm"
        :title="t('formDemo.informationPaymentRequestForm')"
        width="50%"
        align-center
        :close-on-click-modal="doCloseOnClickModal"
      >
        <div>
          <el-divider />
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('formDemo.documentsAttached') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
          <div class="flex gap-4 pt-4 pb-4 items-center">
            <label class="w-[30%] text-right">{{ t('formDemo.orderCode') }}</label>
            <div class="w-[100%] text-xl">{{ sellOrderCode }}</div>
          </div>
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('router.analysis') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
          <div>
            <div class="flex gap-4 pt-4 items-center">
              <label class="w-[30%] text-right">{{ t('formDemo.PaymentRequestCode') }}</label>
              <div class="w-[100%] text-xl">{{ codePaymentRequest }}</div>
            </div>
            <div class="flex gap-4 pt-4 items-center">
              <label class="w-[30%] text-right"
                >{{ t('formDemo.proponent') }} <span class="text-red-500">*</span></label
              >
              <el-select v-model="inputRecharger" placeholder="Select">
                <div >
                  <!-- @scroll="scrollingCustomer" id="content" -->
                  <el-option
                    v-for="item in getStaffList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </div>
              </el-select>
            </div>
            <div class="flex gap-4 pt-4 pb-4 items-center">
              <label class="w-[30%] text-right"
                >{{ t('formDemo.reasonsSpendMoney') }} <span class="text-red-500">*</span></label
              >
              <el-input
                style="width: 100%"
                v-model="inputReasonCollectMoney"
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
              >
                <template #default="props">
                  <el-input v-model="props.row.numberVouchers" />
                </template>
              </el-table-column>
              <el-table-column prop="dayVouchers" :label="t('formDemo.dayVouchers')" width="150">
                <template #default="props">
                  <el-date-picker
                    v-model="props.row.dayVouchers"
                    type="date"
                    placeholder="Pick a day"
                    format="DD/MM/YYYY"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="spentFor" :label="t('formDemo.spendFor')" width="120">
                <template #default="props">
                  <el-input v-model="props.row.spentFor" />
                </template>
              </el-table-column>
              <el-table-column prop="quantity" :label="t('formDemo.sl')" width="100">
                <template #default="props">
                  <el-input @change="autoCalculateMoneyPayment" v-model="props.row.quantity" />
                </template>
              </el-table-column>
              <el-table-column prop="unitPrice" :label="t('reuse.unitPrices')">
                <template #default="props">
                  <CurrencyInputComponent
                    @change="autoCalculateMoneyPayment"
                    class="handle-fix"
                    v-model="props.row.unitPrice"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="totalPrice" :label="t('formDemo.intoMoney')">
                <template #default="props">
                  <div class="text-right">{{ changeMoney.format(props.row.totalPrice) }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="note" :label="t('reuse.note')" width="90">
                <template #default="props">
                  <el-input v-model="props.row.note" />
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="flex justify-end mr-[90px]">
            <div class="w-[145px] text-right">
              <p class="text-black font-bold dark:text-white">{{ t('formDemo.total') }}</p>
            </div>
            <div class="w-[145px] text-right">
              <p class="pr-2 text-black font-bold dark:text-white">{{
                changeMoney.format(totalPayment)
              }}</p>
            </div>
          </div>
          <span
            class="block h-1 float-right w-[45%] border-t-1 dark:border-[#4c4d4f] mt-2 mb-2"
          ></span>
          <div class="flex w-[100%] justify-end">
            <div class="w-[145px] items-center text-right">
              <p class="text-blue-400 leading-8">{{ t('formDemo.deposit') }}<span class="text-red-500">*</span></p>
              <p class="text-red-600 leading-8">{{ t('reuse.remaining') }}</p>
            </div>
            <div class="w-[145px] text-right">
              <CurrencyInputComponent
                v-model="depositePayment"
                @change="autoChangeDepositePayment"
                class="text-right outline-none mb-2 handle-fix"
              />
              <p class="pr-2 text-red-600">{{
                debtPayment ? changeMoney.format(debtPayment) : '0 đ'
              }}</p>
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
            <div class="w-[100%] text-xl">{{ changeMoney.format(moneyReceipts) }}</div>
          </div>
          <div class="flex gap-4 pt-4 items-center">
            <label class="w-[30%] text-right"
              >{{ t('formDemo.writtenWords') }} <span class="text-red-500">*</span></label
            >
            <el-input
              v-model="enterMoney"
              style="width: 100%"
              :placeholder="t('formDemo.writtenWords')"
            />
          </div>
          <div class="flex gap-4 pt-4 items-center">
            <label class="w-[30%] text-right"
              >{{ t('formDemo.formPayment') }} <span class="text-red-500">*</span></label
            >
            <el-select :disabled="checkEditAcountingEntryPaymentType" v-model="payment" placeholder="Select">
              <el-option
                v-for="item in choosePayment"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="flex gap-4 pt-2 pb-4">
            <label class="w-[30%] text-right">{{ t('formDemo.status') }}</label>
            <div class="w-[100%]">
              <div class="flex items-center w-[100%] flex-wrap">
                <div
                  class="duplicate-status"
                  v-for="item in statusAccountingEntry"
                  :key="item.transactionStatus"
                >
                  <div
                    v-if="item.transactionStatus == 1"
                  >
                    <span
                      class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-black dark:bg-transparent"
                    ></span>
                    <span
                      class="box box_2 text-blue-500 dark:text-black"
                      :class="{ active: item.isActive }"
                    >
                      {{ item.transactionStatusName }}
                      <span class="triangle-right right_2"> </span>
                    </span>
                    <p v-if="item.createdAt">{{
                      item.createdAt ? dateTimeFormat(item.createdAt) : ''
                    }}</p>
                    <p v-else class="text-transparent">s</p>
                  </div>
                  <div
                    v-else-if="item.transactionStatus == 0"
                  >
                    <span
                      class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-black dark:bg-transparent"
                    ></span>
                    <span
                    class="box box_4 text-rose-500 dark:text-black"
                      :class="{ active: item.isActive }"
                    >
                      {{ item.transactionStatusName }}
                      <span class="triangle-right right_4"> </span>
                    </span>
                    <p v-if="item?.createdAt">{{
                      item?.createdAt ? dateTimeFormat(item?.createdAt) : ''
                    }}</p>
                    <p v-else class="text-transparent">s</p>
                  </div>
                </div>
              </div>
          </div>
          </div>
        </div>
        <template #footer>
          <div class="flex justify-between">
            <el-button size="large" @click="printPage('IPRFormPrint')">{{
              t('button.print')
            }}</el-button>
            <div>
              <span class="dialog-footer">
                <el-button
                  type="primary"
                  size="large"
                  @click="
                    () => {
                      dialogIPRForm = false
                      postPaymentRequest()
                    }
                  "
                  >{{ t('formDemo.saveRecordDebts') }}</el-button
                >
                <el-button size="large" @click="dialogIPRForm = false">{{
                  t('reuse.exit')
                }}</el-button>
              </span>
            </div>
          </div>
        </template>
      </el-dialog>

      <!-- Thông tin phiếu thanh toán -->
      <el-dialog
        v-model="dialogSalesSlipInfomation"
        :title="t('formDemo.salesSlipInformation')"
        width="40%"
        align-center
        :close-on-click-modal="doCloseOnClickModal"
      >
        <div>
          <el-divider />
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('formDemo.orderInformation') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
          <div class="flex gap-4 pt-4 pb-4">
            <div class="flex-1 flex gap-4">
              <label class="w-[50%] min-w-[162.73px] text-right">{{
                t('formDemo.orderCode')
              }}</label>
              <div class="w-[70%] text-xl text-bold text-black dark:text-light">{{
                sellOrderCode
              }}</div>
            </div>
            <div class="flex-1 flex items-start gap-4">
              <span>
                <div class="text-right">{{ t('formDemo.qrCodePurchaseOrder') }}</div>
                <span class="text-yellow-400">{{ t('formDemo.paymentByApp') }}</span>
              </span>

              <span class="border"><Qrcode :width="100" :text="sellOrderCode" /></span>
            </div>
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
            <span class="w-[30%] text-base font-bold break-w">{{
              t('formDemo.productInformationSale')
            }}</span>
            <span class="block h-1 w-[70%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
        </div>
        <div class="pt-2 pb-2">
          <el-table ref="singleTableRef" :data="tableSalesSlip" border style="width: 100%">
            <el-table-column label="STT" type="index" width="60" align="center" />
            <el-table-column prop="productName" :label="t('formDemo.commodityName')" width="280" />
            <el-table-column prop="quantity" :label="t('reuse.quantity')" width="90" />
            <el-table-column prop="unitPrice" :label="t('reuse.unitPrices')">
              <template #default="props">
                <div class="text-right">{{ changeMoney.format(props.row.unitPrice) }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="totalPrice" :label="t('formDemo.intoMoney')">
              <template #default="props">
                <div class="text-right">{{ changeMoney.format(props.row.totalPrice) }}</div>
              </template>
            </el-table-column>
          </el-table>
          <div class="flex justify-end">
            <div class="w-[145px] text-right">
              <p>Thành tiền</p>
              <p>Khuyến mại</p>
              <p class="text-black font-bold dark:text-white">{{ t('reuse.totalPayment') }}</p>
            </div>
            <div class="w-[145px] text-right">
              <p class="pr-2">{{
                totalPriceOrder != undefined ? changeMoney.format(totalPriceOrder) : '0 đ'
              }}</p>
              <p class="pr-2">{{ promoValue == 0 ? changeMoney.format(promoCash) : promoValue }}</p>
              <p class="pr-2 text-black font-bold dark:text-white">{{
                totalPriceOrder != undefined ? changeMoney.format(totalFinalOrder) : '0 đ'
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
            <label class="w-[30%] text-right">{{ t('router.payments') }}</label>
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
            <el-select :disabled="checkEditAcountingEntryPaymentType" v-model="payment" placeholder="Select">
              <el-option
                v-for="item in choosePayment"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="flex gap-4 pt-2 pb-4">
            <label class="w-[30%] text-right">{{ t('formDemo.status') }}</label>
            <div class="w-[100%]">
              <div class="flex items-center w-[100%] flex-wrap">
                <div
                  class="duplicate-status"
                  v-for="item in statusAccountingEntry"
                  :key="item.transactionStatus"
                >
                  <div
                    v-if="item.transactionStatus == 1"
                  >
                    <span
                      class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-black dark:bg-transparent"
                    ></span>
                    <span
                      class="box box_2 text-blue-500 dark:text-black"
                      :class="{ active: item.isActive }"
                    >
                      {{ item.transactionStatusName }}
                      <span class="triangle-right right_2"> </span>
                    </span>
                    <p v-if="item.createdAt">{{
                      item.createdAt ? dateTimeFormat(item.createdAt) : ''
                    }}</p>
                    <p v-else class="text-transparent">s</p>
                  </div>
                  <div
                    v-else-if="item.transactionStatus == 0"
                  >
                    <span
                      class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-black dark:bg-transparent"
                    ></span>
                    <span
                    class="box box_4 text-rose-500 dark:text-black"
                      :class="{ active: item.isActive }"
                    >
                      {{ item.transactionStatusName }}
                      <span class="triangle-right right_4"> </span>
                    </span>
                    <p v-if="item?.createdAt">{{
                      item?.createdAt ? dateTimeFormat(item?.createdAt) : ''
                    }}</p>
                    <p v-else class="text-transparent">s</p>
                  </div>
                </div>
              </div>
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
                  v-if="showCreatedOrUpdateButton"
                  @click="
                    () => {
                      dialogSalesSlipInfomation = false
                      updateInfoAcountingEntry(1)
                    }
                  "
                  >
                  {{ t('formDemo.saveRecordDebts') }}
                  </el-button
                >
                <el-button
                  type="danger"
                  v-if="showCancelAcountingEntry"
                  @click="
                    () => {
                      UpdateStatusTransaction()
                      dialogSalesSlipInfomation = false
                    }
                  "
                > 
                  {{t('formDemo.cancelAccountingEntry')}}
                </el-button>
                <el-button @click="dialogSalesSlipInfomation = false">{{
                  t('reuse.exit')
                }}</el-button>
              </span>
            </div>
          </div>
        </template>
      </el-dialog>

      <!-- Thông tin phiếu đặt cọc/tạm ứng -->
      <el-dialog
        v-model="dialogDepositSlipAdvance"
        :title="t('formDemo.depositSlipAdvanceinformation')"
        width="40%"
        align-center
        :close-on-click-modal="doCloseOnClickModal"
      >
        <div>
          <el-divider />
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('formDemo.orderInformation') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
          <div class="flex gap-4 pt-4 pb-4">
            <div class="flex-1 flex gap-4">
              <label class="w-[50%] min-w-[162.73px] text-right">{{
                t('formDemo.orderCode')
              }}</label>
              <div class="w-[70%] text-xl text-bold text-black dark:text-light">{{
                sellOrderCode
              }}</div>
            </div>
            <div class="flex-1 flex items-start gap-4">
              <span>
                <div class="text-right">{{ t('formDemo.qrCodePurchaseOrder') }}</div>
                <span class="text-yellow-400">{{ t('formDemo.paymentByApp') }}</span>
              </span>

              <span class="border"><Qrcode :width="100" :text="sellOrderCode" /></span>
            </div>
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
            <span class="w-[30%] text-base font-bold break-w">{{
              t('formDemo.productInformationSale')
            }}</span>
            <span class="block h-1 w-[70%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
        </div>
        <div class="pt-2 pb-2">
          <el-table ref="singleTableRef" :data="tableSalesSlip" border style="width: 100%">
            <el-table-column label="STT" type="index" width="60" align="center" />
            <el-table-column prop="productName" :label="t('formDemo.commodityName')" width="280" />
            <el-table-column prop="quantity" :label="t('reuse.quantity')" width="90" />
            <el-table-column prop="unitPrice" :label="t('reuse.unitPrices')">
              <template #default="props">
                <div class="text-right">{{ changeMoney.format(props.row.unitPrice) }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="totalPrice" :label="t('formDemo.intoMoney')">
              <template #default="props">
                <div class="text-right">{{ changeMoney.format(props.row.totalPrice) }}</div>
              </template>
            </el-table-column>
          </el-table>
          <div class="flex justify-end">
            <div class="w-[145px] text-right">
              <p>Thành tiền</p>
              <p>Khuyến mại</p>
              <p class="text-black font-bold dark:text-white">{{ t('reuse.totalPayment') }}</p>
            </div>
            <div class="w-[145px] text-right">
              <p class="pr-2">{{
                totalPriceOrder != undefined ? changeMoney.format(totalPriceOrder) : '0 đ'
              }}</p>
              <p class="pr-2">{{
                totalPriceOrder != undefined
                  ? changeMoney.format(totalPriceOrder - totalFinalOrder)
                  : '0 đ'
              }}</p>
              <p class="pr-2 text-black font-bold dark:text-white">{{
                totalPriceOrder != undefined ? changeMoney.format(totalFinalOrder) : '0 đ'
              }}</p>
            </div>
          </div>
          <span
            class="block h-1 float-right w-[45%] border-t-1 dark:border-[#4c4d4f] mt-2 mb-2"
          ></span>
          <div class="flex w-[100%] justify-end">
            <div class="w-[145px] text-right pr-2">
              <p>{{ t('formDemo.unpaidDebt') }}</p>
              <p class="text-blue-400 h-[30px]">{{ t('formDemo.deposit') }} <span class="text-red-500">*</span></p>

              <p class="text-red-600 pt-2">{{ t('reuse.remaining') }}</p>
            </div>
            <div class="w-[145px] text-right">
              <p class="pr-2">
                {{ totalPriceOrder != undefined ? changeMoney.format(totalFinalOrder) : '0 đ' }}
              </p>
              <CurrencyInputComponent class="handle-fix" v-model="inputDeposit" :disabled="condition"/>
              <p class="pr-2 text-red-600 pt-2">
                {{ inputDeposit ? changeMoney.format(totalFinalOrder - inputDeposit) : '0 đ' }}</p>
            </div>
          </div>
        </div>
        <div class="flex items-center">
          <span class="w-[25%] text-base font-bold">{{ t('formDemo.billingInformation') }}</span>
          <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
        </div>
        <div>
          <div class="flex gap-4 pt-2 items-center">
            <label class="w-[30%] text-right">{{ t('formDemo.delivery') }}</label>
            <div class="w-[100%]">
              <el-checkbox
                :disabled="isKeepDeposite"
                v-model="keepGoodsOnDeposit"
                :label="t('formDemo.keepGoodsOnDeposit')"
                size="large"
              />
            </div>
          </div>
          <div class="flex gap-4 pt-2 items-center">
            <label class="w-[30%] text-right">{{ t('router.payments') }}</label>
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
            <el-select :disabled="checkEditAcountingEntryPaymentType" v-model="payment" placeholder="Select">
              <el-option
                v-for="item in choosePayment"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="flex gap-4 pt-2 pb-4">
            <label class="w-[30%] text-right">{{ t('formDemo.status') }}</label>
            <div class="w-[100%]">
              <div class="flex items-center w-[100%] flex-wrap">
                <div
                  class="duplicate-status"
                  v-for="item in statusAccountingEntry"
                  :key="item.transactionStatus"
                >
                <div
                  v-if="item.transactionStatus == 1"
                >
                  <span
                    class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-black dark:bg-transparent"
                  ></span>
                  <span
                    class="box box_2 text-blue-500 dark:text-black"
                    :class="{ active: item.isActive }"
                  >
                    {{ item.transactionStatusName }}
                    <span class="triangle-right right_2"> </span>
                  </span>
                  <p v-if="item.createdAt">{{
                    item.createdAt ? dateTimeFormat(item.createdAt) : ''
                  }}</p>
                  <p v-else class="text-transparent">s</p>
                </div>
                <div
                  v-else-if="item.transactionStatus == 0"
                >
                  <span
                    class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-black dark:bg-transparent"
                  ></span>
                  <span
                  class="box box_4 text-rose-500 dark:text-black"
                    :class="{ active: item.isActive }"
                  >
                    {{ item.transactionStatusName }}
                    <span class="triangle-right right_4"> </span>
                  </span>
                  <p v-if="item?.createdAt">{{
                    item?.createdAt ? dateTimeFormat(item?.createdAt) : ''
                  }}</p>
                  <p v-else class="text-transparent">s</p>
                </div>
              </div>
            </div>
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
                  v-if="showCreatedOrUpdateButton"
                  @click="
                    () => {
                      dialogDepositSlipAdvance = false
                      updateInfoAcountingEntry(2)
                    }
                  "
                  >
                  {{ t('formDemo.saveRecordDebts') }}
                  </el-button
                >
                <el-button
                  type="danger"
                  v-if="showCancelAcountingEntry"
                  @click="
                    () => {
                      UpdateStatusTransaction()
                      dialogDepositSlipAdvance = false
                    }
                  "
                > 
                  {{t('formDemo.cancelAccountingEntry')}}
                </el-button>
                <el-button @click="dialogDepositSlipAdvance = false">{{
                  t('reuse.exit')
                }}</el-button>
              </span>
            </div>
          </div>
        </template>
      </el-dialog>

      <!-- Thông tin phiếu xuất đổi -->
      <el-dialog
        v-model="informationWarehouseReceipt"
        :title="t('formDemo.infoCouponExportExchange')"
        width="50%"
        align-center
        :close-on-click-modal="doCloseOnClickModal"
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
            <span class="w-[25%] text-base font-bold">{{ t('reuse.generalInformation') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
          <div>
            <div class="flex gap-4 pt-4 items-center">
              <label class="w-[30%] text-right">{{ t('formDemo.receiptCode') }}</label>
              <div class="w-[100%]">{{ warehouseTicketCode }}</div>
            </div>
            <div class="flex gap-4 pt-4 items-center">
              <label class="w-[30%] text-right"
                >{{ t('formDemo.warehouser') }} <span class="text-red-500">*</span></label
              >
              <el-select v-model="staffId" placeholder="Trần Hữu Dương | 0998844533">
                <el-option
                  v-for="item in getStaffList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div class="flex gap-4 pt-4 pb-4 items-center">
              <label class="w-[30%] text-right">{{ t('formDemo.ReasonExchangeReturn') }}</label>
              <el-input v-if="checkCreate" v-model="inputReasonReturn" class="w-[100%]" />
            </div>
          </div>
          <div class="flex items-center">
            <span class="w-[45%] text-base font-bold break-w">{{
              t('formDemo.productInformationExportChange')
            }}</span>
            <span class="block h-1 w-[55%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
        </div>
        <div class="pt-2 pb-2">
          <el-table ref="singleTableRef" :data="tableFullyIntegrated" border style="width: 100%">
            <el-table-column label="STT" type="index" width="60" align="center" />
            <el-table-column
              prop="productPropertyName"
              :label="t('formDemo.commodityName')"
              width="280"
            />
            <el-table-column prop="accessory" :label="t('reuse.accessory')" width="90" />
            <el-table-column prop="quantity" :label="t('reuse.quantity')" width="90" />
            <el-table-column prop="importPrice" :label="t('formDemo.unitPriceWarehouse')">
              <template #default="props">
                <div class="text-right">{{ changeMoney.format(props.row.importPrice) }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="intoMoneyWarehouse" :label="t('formDemo.intoMoneyWarehouse')">
              <template #default="props">
                <div class="text-right">{{ changeMoney.format(props.row.intoMoneyWarehouse) }}</div>
              </template>
            </el-table-column>
          </el-table>
          <div class="flex justify-end pt-2">
            <div class="w-[145px] text-right">
              <p class="text-black font-bold dark:text-white">{{ t('formDemo.totalAmountStock') }}</p>
            </div>
            <div class="w-[100px] text-right">
              <p class="pr-2 text-black font-bold dark:text-white">{{
                changeMoney.format(totalPriceWarehouse)
              }}</p>
            </div>
          </div>
        </div>
        <div class="flex items-center">
          <span class="w-[25%] text-base font-bold">{{ t('formDemo.status') }}</span>
          <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
        </div>
        <div>
          <div class="flex gap-4 pt-4 pb-2 items-center">
            <label class="w-[30%] text-right">{{ t('formDemo.status') }}</label>
            <div class="flex items-center w-[100%]">
              <span
                class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-neutral-900 dark:bg-transparent"
              ></span>
              <span class="box dark:text-black">
                {{ t('formDemo.initializationBookkeeping') }}
                <span class="triangle-right"> </span>
              </span>
            </div>
          </div>
        </div>
        <template #footer>
          <div class="flex justify-between">
            <el-button @click="informationWarehouseReceipt = false">{{
              t('button.print')
            }}</el-button>
            <div>
              <span class="dialog-footer">
                <el-button @click="informationWarehouseReceipt = false">{{
                  t('reuse.exit')
                }}</el-button>
              </span>
            </div>
          </div>
        </template>
      </el-dialog>

      <!-- Thông tin phiếu nhập hoàn -->
      <el-dialog
        v-model="invoiceForGoodsEntering"
        :title="t('formDemo.invoiceForGoodsEntering')"
        width="40%"
        align-center
        :close-on-click-modal="doCloseOnClickModal"
      >
        <div>
          <el-divider />
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('formDemo.documentsAttached') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
          <div class="flex gap-4 pt-4 pb-4 items-center">
            <label class="w-[30%] text-right">{{ t('formDemo.orderCode') }}</label>
            <div class="w-[100%] text-xl">BH24354</div>
          </div>
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('reuse.generalInformation') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
          <div>
            <div class="flex gap-4 pt-4 items-center">
              <label class="w-[30%] text-right">{{ t('formDemo.receiptCode') }}</label>
              <div class="w-[100%]">NK345654</div>
            </div>
            <div class="flex gap-4 pt-4 items-center">
              <label class="w-[30%] text-right"
                >{{ t('formDemo.warehouser') }} <span class="text-red-500">*</span></label
              >
              <el-select v-model="staffId" placeholder="Trần Hữu Dương | 0998844533">
                <el-option
                  v-for="item in getStaffList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div class="flex gap-4 pt-4 pb-4 items-center">
              <label class="w-[30%] text-right">{{ t('formDemo.ReasonExchangeReturn') }}</label>
              <el-input v-if="checkCreate" v-model="inputReasonReturn" class="w-[100%]" />
            </div>
          </div>
          <div class="flex items-center">
            <span class="w-[45%] text-base font-bold break-w">{{
              t('formDemo.fullyIntegrated')
            }}</span>
            <span class="block h-1 w-[55%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
        </div>
        <div class="pt-2 pb-2">
          <el-table ref="singleTableRef" :data="tableInvoice" border style="width: 100%">
            <el-table-column label="STT" type="index" width="60" align="center" />
            <el-table-column
              prop="commodityName"
              :label="t('formDemo.commodityName')"
              width="280"
            />
            <el-table-column prop="accessory" :label="t('reuse.accessory')" width="90" />
            <el-table-column prop="quantity" :label="t('reuse.quantity')" width="90" />
            <el-table-column prop="unitPriceWarehouse" :label="t('formDemo.unitPriceWarehouse')">
              <template #default="props">
                <div class="text-right">{{ props.row.unitPriceWarehouse }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="intoMoneyWarehouse" :label="t('formDemo.intoMoneyWarehouse')">
              <template #default="props">
                <div class="text-right">{{ props.row.intoMoneyWarehouse }}</div>
              </template>
            </el-table-column>
          </el-table>
          <div class="flex justify-end pt-2">
            <div class="w-[145px] text-right">
              <p class="text-black font-bold dark:text-white">{{ t('formDemo.totalAmountStock') }}</p>
            </div>
            <div class="w-[100px] text-right">
              <p class="pr-2 text-black font-bold dark:text-white">5,000,000 đ</p>
            </div>
          </div>
        </div>
        <div class="flex items-center">
          <span class="w-[25%] text-base font-bold">{{ t('formDemo.status') }}</span>
          <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
        </div>
        <div>
          <div class="flex gap-4 pt-4 pb-2 items-center">
            <label class="w-[30%] text-right">{{ t('formDemo.status') }}</label>
            <div class="flex items-center w-[100%]">
              <span
                class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-neutral-900 dark:bg-transparent"
              ></span>
              <span class="box dark:text-black">
                {{ t('formDemo.initializationBookkeeping') }}
                <span class="triangle-right"> </span>
              </span>
            </div>
          </div>
        </div>
        <template #footer>
          <div class="flex justify-between">
            <el-button @click="invoiceForGoodsEntering = false">{{ t('button.print') }}</el-button>
            <div>
              <span class="dialog-footer">
                <el-button @click="invoiceForGoodsEntering = false">{{
                  t('reuse.exit')
                }}</el-button>
              </span>
            </div>
          </div>
        </template>
      </el-dialog>

      <!-- Bút toán bổ sung -->
      <el-dialog 
        v-model="dialogAccountingEntryAdditional"
        :title="t('formDemo.accountingEntryAdditional')"
        width="50%"
        align-center
        :close-on-click-modal="doCloseOnClickModal"
      >
        <div>
          <el-divider />
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('formDemo.orderInformation') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
          <div class="flex gap-4 pt-4 pb-4">
            <div class="flex-1 flex gap-4">
              <label class="w-[50%] min-w-[162.73px] text-right pt-1">{{
                t('formDemo.orderCode')
              }}</label>
              <div class="w-[70%] text-xl text-bold text-black dark:text-light">{{
                sellOrderCode
              }}</div>
            </div>
            <div class="flex-1 flex items-start gap-4">
              <span>
                <div class="text-right">{{ t('formDemo.qrCodePurchaseOrder') }}</div>
                <span class="text-yellow-400">{{ t('formDemo.paymentByApp') }}</span>
              </span>

              <span class="border"><Qrcode :width="100" :text="sellOrderCode" /></span>
            </div>
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
            <el-table-column prop="content" :label="t('reuse.content')" width="240">
              <template #default="props">
                <el-input v-model="props.row.content" />
              </template>
            </el-table-column>
            <el-table-column prop="receiveMoney" :label="t('formDemo.collected')">
              <template #default="props">
                <CurrencyInputComponent
                  @change="(data) => autoChangeMoneyAccountingEntry(data, props)"
                  class="handle-fix"
                  v-model="props.row.receiveMoney"
                />
              </template>
            </el-table-column>
            <el-table-column prop="paidMoney" :label="t('formDemo.spent')">
              <template #default="props">
                <CurrencyInputComponent
                  @change="(data) => autoChangeMoneyAccountingEntry(data, props)"
                  class="handle-fix"
                  v-model="props.row.paidMoney"
                />
              </template>
            </el-table-column>
            <el-table-column prop="intoMoney" :label="t('formDemo.intoMoney')">
              <template #default="props">
                <div class="text-right">{{ changeMoney.format(props.row.intoMoney) }}</div>
              </template>
            </el-table-column>
          </el-table>
          <div class="flex justify-end">
            <div class="w-[145px] text-right">
              <p class="text-black font-bold dark:text-white">{{ t('reuse.totalPayment') }}</p>
            </div>
            <div class="w-[145px] text-right">
              <p class="pr-2 text-black font-bold dark:text-white">{{
                changeMoney.format(valueMoneyAccoungtingEntry)
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
            <label class="w-[30%] text-right">{{ t('router.payments') }}</label>
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
            <el-select :disabled="checkEditAcountingEntryPaymentType" v-model="payment" placeholder="Select">
              <el-option
                v-for="item in choosePayment"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="flex gap-4 pt-2 pb-4">
            <label class="w-[30%] text-right">{{ t('formDemo.status') }}</label>
            <div class="w-[100%]">
              <div class="flex items-center w-[100%] flex-wrap">
                <div
                  class="duplicate-status"
                  v-for="item in statusAccountingEntry"
                  :key="item.transactionStatus"
                >
                  <div
                    v-if="item.transactionStatus == 1"
                  >
                    <span
                      class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-black dark:bg-transparent"
                    ></span>
                    <span
                      class="box box_2 text-blue-500 dark:text-black"
                      :class="{ active: item.isActive }"
                    >
                      {{ item.transactionStatusName }}
                      <span class="triangle-right right_2"> </span>
                    </span>
                    <p v-if="item.createdAt">{{
                      item.createdAt ? dateTimeFormat(item.createdAt) : ''
                    }}</p>
                    <p v-else class="text-transparent">s</p>
                  </div>
                  <div
                    v-else-if="item.transactionStatus == 0"
                  >
                    <span
                      class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-black dark:bg-transparent"
                    ></span>
                    <span
                    class="box box_4 text-rose-500 dark:text-black"
                      :class="{ active: item.isActive }"
                    >
                      {{ item.transactionStatusName }}
                      <span class="triangle-right right_4"> </span>
                    </span>
                    <p v-if="item?.createdAt">{{
                      item?.createdAt ? dateTimeFormat(item?.createdAt) : ''
                    }}</p>
                    <p v-else class="text-transparent">s</p>
                  </div>
                </div>
              </div>
          </div>
          </div>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button
              size="large"
              type="primary"
              v-if="showCreatedOrUpdateButton"
              @click="
                () => {
                  updateInfoAcountingEntry(4)
                  dialogAccountingEntryAdditional = false
                }
              "
              >
              {{ t('formDemo.saveRecordDebts') }}
            </el-button>
            <el-button
              type="danger"
              v-if="showCancelAcountingEntry"
              @click="
                () => {
                  UpdateStatusTransaction()
                  dialogAccountingEntryAdditional = false
                }
              "
                > 
                 {{t('formDemo.cancelAccountingEntry')}}
              </el-button>
            <el-button size="large" @click="dialogAccountingEntryAdditional = false">{{
              t('reuse.exit')
            }}</el-button>
          </span>
        </template>
      </el-dialog>

      <!-- Địa chỉ nhận hàng -->
      <el-dialog :close-on-click-modal="doCloseOnClickModal" v-model="dialogFormVisible" width="40%" align-center title="Địa chỉ nhận hàng">
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
              <div class="text-sm text-[#303133] font-medium pb-4 dark:text-[#fff]">
                <el-divider content-position="left">{{
                  t('formDemo.orderInformation')
                }}</el-divider>
              </div>
              <el-form-item :label="t('formDemo.orderCode')" prop="orderCode">
                <el-input
                :disabled="true"
                style="width: 100%"
                  v-model="ruleForm.orderCode"
                />
              </el-form-item>
              <div class="flex gap-2 items-center">
                <div class="w-[60%] max-w-[531.5px]">
                  <el-form-item :label="t('formDemo.collaborators')" prop="collaborators">
                    <el-select
                      :disabled="checkDisabled"
                      v-model="ruleForm.collaborators"
                      @change="(data) => autoCollaboratorCommission(data)"
                      :placeholder="t('formDemo.selectOrEnterTheCollaboratorCode')"
                      filterable
                    >
                      <div @scroll="scrolling" id="content">
                        <el-option
                          v-for="(item, index) in optionsCollaborators"
                          :key="index"
                          :label="item.label"
                          :value="item.value"
                        />
                      </div>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="w-[40%]">
                  <el-form-item prop="discount" class="fix-err" label-width="0">
                    <div class="flex items-center">
                      <el-input
                        :disabled="checkDisabled"
                        v-model="ruleForm.discount"
                        class="w-[100%] border-none outline-none pl-2 bg-transparent"
                        :placeholder="t('formDemo.enterDiscount')"
                        :suffix-icon="percentageIcon"
                      />
                    </div>
                  </el-form-item>
                </div>
              </div>
              <el-form-item :label="t('formDemo.orderNotes')" prop="orderNotes">
                <el-input
                  :disabled="checkDisabled"
                  v-model="ruleForm.orderNotes"
                  :placeholder="t('formDemo.addNotes')"
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
                <div class="text-right text-[#FECB80] italic">{{
                  t('formDemo.lessThanTenProfiles')
                }}</div>
              </div>
              <div class="pl-4">
                <el-upload
                  action="#"
                  v-model:file-list="fileList"
                  :multiple="true"
                  list-type="picture-card"
                  :limit="10"
                  :on-exceed="handleExceed"
                  :auto-upload="false"
                  :on-change="handleChange"
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
                  <el-dialog :close-on-click-modal="doCloseOnClickModal" v-model="dialogVisible" class="absolute" />
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
              <div class="flex w-[100%] gap-6">
                <div class="flex-1"
                  ><el-divider content-position="left">{{
                    t('formDemo.customer')
                  }}</el-divider></div
                >
                <div class="flex-1"
                  ><el-divider content-position="left">{{
                    t('formDemo.delivery')
                  }}</el-divider></div
                >
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
                          <MultipleOptionsBox
                            :fields="[
                              t('reuse.customerCode'),
                              t('reuse.customerName'),
                              t('reuse.customerInfo')
                            ]"
                            filterable
                            :disabled="checkDisabled"
                            width="700px"
                            :items="optionsCustomerApi"
                            valueKey="value"
                            labelKey="label"
                            :hiddenKey="['id']"
                            :placeHolder="'Chọn khách hàng'"
                            :defaultValue="ruleForm.customerName"
                            @scroll-top="ScrollCustomerTop"
                            @scroll-bottom="ScrollCustomerBottom"
                            :clearable="false"
                            @update-value="(value, obj) => getValueOfCustomerSelected(value, obj)"
                          />
                          <el-button :disabled="checkDisabled" @click="openDialogAddQuickCustomer"
                            >+ {{ t('button.add') }}</el-button
                          >
                        </div>
                      </div>
                    </el-form-item>
                  </div>
                </div>
                <div class="flex-1">
                  <el-form-item :label="t('formDemo.selectExportWarehouse')" prop="warehouse">
                    <div class="flex w-[100%] max-h-[42px] gap-2 items-center">
                      <div class="flex w-[80%] gap-4">
                        <el-select
                          :disabled="disabledEdit"
                          v-model="ruleForm.warehouse"
                          class="fix-full-width"
                          :placeholder="t('formDemo.selectAWarehouse')"
                        >
                          <el-option
                            v-for="i in chooseWarehouse"
                            :key="i.value"
                            :label="i.label"
                            :value="i.value"
                          />
                        </el-select>
                      </div>
                    </div>
                  </el-form-item>
                  <el-form-item :label="t('formDemo.chooseShipping')" prop="delivery">
                    <div class="flex w-[100%] max-h-[42px] gap-2 items-center">
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
                      :disabled="checkDisabled"
                      text
                      @click="dialogFormVisible = true"
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

      <!-- DialogChooseWarehouse -->
      <el-dialog
      :close-on-click-modal="doCloseOnClickModal"
        v-model="openDialogChooseWarehouse"
        :title="t('formDemo.inventoryInformation')"
        width="35%"
        align-center
        class="z-50"
      >
        <el-divider />
        <el-table :data="tableWarehouse" border>
          <el-table-column prop="name" :label="t('formDemo.warehouseInformation')" />
          <el-table-column prop="inventory" :label="t('reuse.inventory')" width="180">
            <template #default="props">
              <div class="flex">
                <span class="flex-1">{{ props.row.inventory }}</span>
                <span class="flex-1 text-right">Chiếc</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="flex justify-end mr-[156px] text-right font-medium">{{ totalWarehouse }}</div>
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

      <!-- DialogPromotion -->
      <el-dialog
      :close-on-click-modal="doCloseOnClickModal"
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
              <div class="ml-2">{{ t('formDemo.appliesToOrdersFrom') }} {{ promoMin }}</div>
            </div>
            <div class="flex flex-1 justify-center">{{ t('formDemo.expired') }} {{ promoDate }}</div>
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
                <div>{{ t('formDemo.appliesToOrdersFrom') }} {{ props.row.min }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="toDate" width="180" align="left">
              <template #default="props">
                <div>{{ t('formDemo.expired') }} {{ props.row.toDate }}</div>
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

      <!-- Thông tin đổi/trả hàng -->
      <el-dialog
      :close-on-click-modal="doCloseOnClickModal"
        v-model="changeReturnGoods"
        :title="t('formDemo.InformationChangeReturnGoods')"
        width="50%"
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
            <div class="w-[100%] text-xl">{{ sellOrderCode }}</div>
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
            <div class="flex gap-4 pt-4 items-center">
              <label class="w-[30%] text-right">{{ t('reuse.phoneNumber') }}</label>
              <div class="w-[100%]">{{ infoCompany.phone }}</div>
            </div>
            <div class="flex gap-4 pt-4 pb-4 items-center">
              <label class="w-[30%] text-right">{{ t('formDemo.ReasonExchangeReturn') }}</label>
              <el-input v-if="checkCreate" v-model="inputReasonReturn" class="w-[100%]" />
              <div v-else>{{ inputReasonReturn }}</div>
            </div>
          </div>
        </div>
        <div class="flex items-center">
          <span class="w-[35%] text-base font-bold break-w">{{
            t('formDemo.fullyIntegrated')
          }}</span>
          <span class="block h-1 w-[65%] border-t-1 dark:border-[#4c4d4f]"></span>
        </div>
        <div class="pt-2 pb-2">
          <el-table
            ref="singleTableRef"
            :data="tableReturnFullyIntegrated"
            border
            style="width: 100%"
          >
            <el-table-column label="STT" type="index" width="60" align="center" />
            <el-table-column
              prop="productPropertyName"
              :label="t('formDemo.commodityName')"
              width="280"
            >
              <template #default="props">
                <MultipleOptionsBox
                  :defaultValue="props.row.productPropertyId"
                  :fields="[
                    t('reuse.productCode'),
                    t('reuse.managementCode'),
                    t('formDemo.productInformation'),
                    t('reuse.inventory')
                  ]"
                  v-if="checkCreate"
                  filterable
                  :items="listOfOrderProduct"
                  valueKey="productPropertyId"
                  labelKey="productCode"
                  :hiddenKey="['id']"
                  :placeHolder="'Chọn mã sản phẩm'"
                  @scroll-top="ScrollProductTop"
                  @scroll-bottom="ScrollProductBottom"
                  :clearable="false"
                  @update-value="(value, obj) => updatePrice(value, obj, props)"
                />
                <div v-else>{{ props.row.productCode }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="accessory" :label="t('reuse.accessory')" width="150">
              <template #default="props">
                <el-input v-if="checkCreate" v-model="props.row.accessory" />
                <div v-else>{{ props.row.accessory }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="quantity" :label="t('reuse.quantity')" width="90">
              <template #default="props">
                <el-input
                  v-if="checkCreate"
                  @change="() => checkMaximunQuantity(props)"
                  v-model="props.row.quantity"
                />
                <div v-else>{{ props.row.quantity }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="unitPrice" :label="t('reuse.returnOrderPrice')">
              <template #default="props">
                <CurrencyInputComponent v-if="checkCreate" v-model="props.row.unitPrice" class="text-right" />
                <div v-else>{{ props.row.unitPrice }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="totalPrice" :label="t('formDemo.intoMoney')">
              <template #default="props">
                <div class="text-right">{{
                  moneyFormat((props.row.totalPrice = props.row.quantity * props.row.unitPrice))
                }}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="flex items-center pt-4">
          <span class="w-[35%] text-base font-bold break-w">{{
            t('formDemo.productInformationExportChange')
          }}</span>
          <span class="block h-1 w-[65%] border-t-1 dark:border-[#4c4d4f]"></span>
        </div>
        <div class="pt-2 pb-2">
          <el-table
            ref="singleTableRef"
            :data="tableProductInformationExportChange"
            border
            style="width: 100%"
          >
            <el-table-column label="STT" type="index" width="60" align="center" />
            <el-table-column
              prop="productPropertyName"
              :label="t('formDemo.commodityName')"
              width="280"
            >
              <template #default="props">
                <MultipleOptionsBox
                  :defaultValue="props.row.productPropertyId"
                  :fields="[
                    t('reuse.productCode'),
                    t('reuse.managementCode'),
                    t('formDemo.productInformation'),
                    t('reuse.inventory')
                  ]"
                  v-if="checkCreate"
                  filterable
                  :items="listOfOrderProduct"
                  valueKey="productPropertyId"
                  labelKey="productCode"
                  :hiddenKey="['id']"
                  :placeHolder="'Chọn mã sản phẩm'"
                  @scroll-top="ScrollProductTop"
                  @scroll-bottom="ScrollProductBottom"
                  :clearable="false"
                  @update-value="(value, obj) => updateExchangePrice(value, obj, props)"
                />
                <div v-else>{{ props.row.productCode }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="accessory" :label="t('reuse.accessory')" width="150">
              <template #default="props">
                <el-input v-if="checkCreate" v-model="props.row.accessory" />
                <div v-else>{{ props.row.accessory }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="quantity" :label="t('reuse.quantity')" width="90">
              <template #default="props">
                <el-input
                  v-if="checkCreate"
                  @change="() => checkMaximunQuantity(props)"
                  v-model="props.row.quantity"
                />
                <div v-else>{{ props.row.quantity }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="unitPrice" :label="t('reuse.unitPrices')">
              <template #default="props">
                <CurrencyInputComponent v-if="checkCreate" v-model="props.row.unitPrice" class="text-right" />
                <div v-else>{{ props.row.unitPrice }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="totalPrice" :label="t('formDemo.intoMoney')">
              <template #default="props">
                <div class="text-right">{{
                  moneyFormat((props.row.totalPrice = props.row.quantity * props.row.unitPrice))
                }}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="flex justify-end">
          <div class="w-[145px] text-right">
            <p>{{ t('reuse.totalSellMoney') }}</p>
            <p>{{ t('reuse.totalReturnMoney') }}</p>
            <p class="text-black font-bold dark:text-white">{{ t('reuse.totalDiffMoney') }}</p>
          </div>
          <div class="w-[145px] text-right">
            <p class="pr-2">{{ moneyFormat(exportPrice) }}</p>
            <p class="pr-2">{{ moneyFormat(refundPrice) }}</p>
            <p class="pr-2 text-black font-bold dark:text-white">{{
              moneyFormat(Math.abs(exchangePrice))
            }}</p>
            <p class="pr-2" v-if="exchangePrice > 0">{{ t('reuse.havetoPay') }}</p>
            <p class="pr-2" v-else-if="exchangePrice == 0"></p>
            <p class="pr-2" v-else>{{ t('reuse.haveToCollect') }}</p>
          </div>
        </div>
        <div class="flex items-center">
          <span class="w-[25%] text-base font-bold">{{ t('formDemo.billingInformation') }}</span>
          <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
        </div>
        <div>
          <div class="flex gap-4 pt-2 items-center">
            <label class="w-[30%] text-right">{{ t('router.payments') }}</label>
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
            <el-select :disabled="checkEditAcountingEntryPaymentType" v-model="payment" placeholder="Select">
              <el-option
                v-for="item in choosePayment"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="flex gap-4 pt-2 pb-4">
            <label class="w-[30%] text-right">{{ t('formDemo.status') }}</label>
            <div class="w-[100%]">
              <div class="flex items-center w-[100%] flex-wrap">
                <div
                  class="duplicate-status"
                  v-for="item in statusAccountingEntry"
                  :key="item.transactionStatus"
                >
                  <div
                    v-if="item.transactionStatus == 1"
                  >
                    <span
                      class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-black dark:bg-transparent"
                    ></span>
                    <span
                      class="box box_2 text-blue-500 dark:text-black"
                      :class="{ active: item.isActive }"
                    >
                      {{ item.transactionStatusName }}
                      <span class="triangle-right right_2"> </span>
                    </span>
                    <p v-if="item.createdAt">{{
                      item.createdAt ? dateTimeFormat(item.createdAt) : ''
                    }}</p>
                    <p v-else class="text-transparent">s</p>
                  </div>
                  <div
                    v-else-if="item.transactionStatus == 0"
                  >
                    <span
                      class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-black dark:bg-transparent"
                    ></span>
                    <span
                    class="box box_4 text-rose-500 dark:text-black"
                      :class="{ active: item.isActive }"
                    >
                      {{ item.transactionStatusName }}
                      <span class="triangle-right right_4"> </span>
                    </span>
                    <p v-if="item?.createdAt">{{
                      item?.createdAt ? dateTimeFormat(item?.createdAt) : ''
                    }}</p>
                    <p v-else class="text-transparent">s</p>
                  </div>
                </div>
              </div>
          </div>
          </div>
        </div>
        <template #footer>
          <div class="flex justify-between">
            <el-button @click="changeReturnGoods = false">{{ t('button.print') }}</el-button>
            <div>
              <span class="dialog-footer">
                <el-button
                  v-if="!checkCancel && checkCreate"
                  type="primary"
                  @click="
                    () => {
                      changeReturnGoods = false
                      postReturnRequest()
                    }
                  "
                  >{{ t('formDemo.saveRecordDebts') }}</el-button
                >
                <el-button
                  v-else-if="!checkCreate && !checkCancel"
                  type="warning"
                  @click="
                    () => {
                      doneReturnGoods()
                      changeReturnGoods = false
                    }
                  "
                  >{{ t('formDemo.completeExchangeReturn') }}</el-button
                >
                <el-button
                v-else-if="!checkCreate && checkCancel"
                  @click="
                    () => {
                      cancelExpendReturn()
                      changeReturnGoods = false
                    }
                  "
                  >{{ t('formDemo.cancellationReturn') }}</el-button
                >
                <el-button @click="changeReturnGoods = false">{{ t('reuse.exit') }}</el-button>
              </span>
            </div>
          </div>
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
            'bg-[var(--el-color-white)] dark:(text-white-800) border-[var(--el-border-color)] border-1px)'
          ]"
        >
          <el-table-column
            :label="t('formDemo.productManagementCode')"
            min-width="200"
            prop="productPropertyId"
          >
            <template #default="props">
              <MultipleOptionsBox
                :fields="[
                  t('reuse.productCode'),
                  t('reuse.managementCode'),
                  t('formDemo.productInformation'),
                  t('reuse.inventory')

                ]"
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
                />
            </template>
          </el-table-column>
          <el-table-column
            prop="productName"
            :label="t('formDemo.productInformation')"
            min-width="620"
          />
          <el-table-column prop="accessory" :label="t('reuse.accessory')" width="180">
            <template #default="data">
              <el-input
                :disabled="disabledEdit"
                v-model="data.row.accessory"
                :placeholder="`/${t('formDemo.selfImportAccessories')}/`"
              />
            </template>
          </el-table-column>
          <el-table-column prop="quantity" :label="t('formDemo.amount')" align="center" width="90">
            <template #default="props">
              <div v-if="type == 'detail'">
                {{ props.row.quantity }}
              </div>
              <el-input
                v-else
                :disabled="disabledEdit"
                v-model="props.row.quantity"
                @change="(data) => handleGetTotal(data, props)"
                style="width: 100%"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="unitName"
            :label="t('reuse.dram')"
            align="center"
            min-width="100"
          />
          <el-table-column prop="unitPrice" :label="t('reuse.unitPrice')" align="right" width="180">
            <template #default="props">
              <CurrencyInputComponent
                v-model="props.row.unitPrice"
                :disabled="disabledEdit"
                v-if="type != 'detail'"
                @change="
                  () => {
                    changePriceRowTable(props, false)
                    autoCalculateOrder()
                  }
                "
              />
              <div v-else>{{
                props.row.unitPrice != ''
                  ? changeMoney.format(parseInt(props.row.unitPrice))
                  : '0 đ'
              }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="totalPrice"
            :label="t('formDemo.intoMoney')"
            align="right"
            width="180"
          >
            <template #default="props">
              {{ changeMoney.format(props.row.totalPrice) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="warehouseTotal"
            :label="t('reuse.inventory')"
            min-width="200"
          >
            <template #default="props">
              <div class="flex w-[100%] items-center">
                <el-button
                  text
                  :disabled="disabledEdit"
                  @click="
                    () => {
                      callApiWarehouse(props)
                      openDialogChooseWarehouse = true
                    }
                  "
                >
                  <span v-if="props.row.warehouseTotal != 0" class="text-blue-500">{{
                    props.row.warehouseTotal
                  }}</span>
                  <span v-else class="text-yellow-500">Hết hàng</span>
                </el-button>
              </div>
            </template>
          </el-table-column>

          <el-table-column :label="t('formDemo.manipulation')" align="center" min-width="90">
            <template #default="scope">
              <el-button
                :disabled="disabledDeleteRow"
                @click.prevent="removeListProductsSale(scope.$index)"
                type="danger"
                >{{ t('reuse.delete') }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-button class="ml-4 mt-4" v-if="type == 'add' || type == ':type'" @click="addLastIndexSellTable"
          >+ {{ t('formDemo.add') }}</el-button
        >
        <div class="flex justify-end">
          <div class="w-50">
            <div class="dark:text-[#fff]">{{ t('formDemo.intoMoney') }}</div>
            <div class="text-blue-500 cursor-pointer">
              <el-button
                text
                :disabled="disabledEdit"
                @click="
                  () => {
                    openDialogChoosePromotion = true
                  }
                "
                style="padding: 0"
              >
                <span class="font-normal text-blue-500">
                  + {{ t('formDemo.choosePromotion') }}</span
                >
              </el-button>
            </div>
            <!-- Tạm thời bỏ VAT 21/02/2023 -->
            <!-- <div class="text-blue-500 cursor-pointer">
              <el-dropdown class="flex justify-end" trigger="click">
                <span class="el-dropdown-link text-blue-500 cursor-pointer flex items-center">
                  {{ radioVAT }}
                  <Icon icon="material-symbols:keyboard-arrow-down" :size="16" />
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>
                      <el-radio-group
                        :disabled="disabledEdit"
                        @change="changePriceVAT"
                        v-model="radioVAT"
                        class="flex-col"
                      >
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
            </div> -->
            <div class="text-black font-bold dark:text-[#fff]">{{
              t('formDemo.totalAmountReceivable')
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
            <!-- Tạm thời bỏ VAT 21/02/2023 -->
            <!-- <div v-if="VAT" class="text-right dark:text-[#fff]">{{
              VAT ? (totalPriceOrder * parseInt(valueVAT)) / 100 : ''
            }}</div>
            <div v-else class="text-transparent :dark:text-transparent">s</div> -->
            <div class="text-right dark:text-[#fff]">{{
              totalPriceOrder != undefined ? changeMoney.format(totalFinalOrder) : '0 đ'
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
          <label class="w-[9%] text-right">Tracking đơn hàng</label>
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
          <label class="w-[11%] text-right pr-8">{{ t('formDemo.orderStatus') }}</label>
          <div class="w-[89%]">
            <div class="flex items-center flex-wrap w-[100%]">
              <div
                class="duplicate-status"
                v-for="item in arrayStatusOrder"
                :key="item.orderStatus"
              >
              <div
                  v-if="
                    item.orderStatus == STATUS_ORDER_SELL[1].orderStatus ||
                    item.orderStatus == STATUS_ORDER_SELL[5].orderStatus ||
                    item.orderStatus == STATUS_ORDER_SELL[6].orderStatus ||
                    item.orderStatus == STATUS_ORDER_SELL[7].orderStatus ||
                    item.orderStatus == STATUS_ORDER_SELL[8].orderStatus
                  "
                >
                  <span
                    class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-black dark:bg-transparent"
                  ></span>
                  <span
                    class="box box_1 text-yellow-500 dark:text-black"
                    :class="{ active: item.isActive }"
                  >
                    {{ item.orderStatusName }}

                    <span class="triangle-right right_1"> </span>
                  </span>
                  <p v-if="item?.approvedAt">{{
                    item?.approvedAt ? dateTimeFormat(item?.approvedAt) : ''
                  }}</p>
                  <p v-else class="text-transparent">s</p>
                </div>
                <div
                  v-else-if="
                    item.orderStatus == STATUS_ORDER_SELL[2].orderStatus ||
                    item.orderStatus == STATUS_ORDER_SELL[3].orderStatus  || 
                    item.orderStatus == STATUS_ORDER_SELL[8].orderStatus
                  "
                >
                  <span
                    class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-black dark:bg-transparent"
                  ></span>
                  <span
                    class="box box_2 text-blue-500 dark:text-black"
                    :class="{ active: item.isActive }"
                  >
                    {{ item.orderStatusName }}
                    <span class="triangle-right right_2"> </span>
                  </span>
                  <p v-if="item?.approvedAt">{{
                    item?.approvedAt ? dateTimeFormat(item?.approvedAt) : ''
                  }}</p>
                  <p v-else class="text-transparent">s</p>
                </div>
                <div v-else-if="item.orderStatus == STATUS_ORDER_SELL[4].orderStatus">
                  <span
                    class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-black dark:bg-transparent"
                  ></span>
                  <span
                    class="box box_3 text-black dark:text-black"
                    :class="{ active: item.isActive }"
                  >
                    {{ item.orderStatusName }}
                    <span class="triangle-right right_3"> </span>
                  </span>
                  <p v-if="item?.approvedAt">{{
                    item?.approvedAt ? dateTimeFormat(item?.approvedAt) : ''
                  }}</p>
                  <p v-else class="text-transparent">s</p>
                </div>
                <div v-else-if="item.orderStatus == STATUS_ORDER_SELL[0].orderStatus">
                  <span
                    class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-black dark:bg-transparent"
                  ></span>
                  <span
                    class="box box_4 text-rose-500 dark:text-black"
                    :class="{ active: item.isActive }"
                  >
                    {{ item.orderStatusName }}
                    <span class="triangle-right right_4"> </span>
                  </span>
                  <p v-if="item?.approvedAt">{{
                    item?.approvedAt ? dateTimeFormat(item?.approvedAt) : ''
                  }}</p>
                  <p v-else class="text-transparent">s</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="w-[100%] flex gap-2">
          <div class="w-[12%]"></div>
          <!-- Không thay đổi giá -->
          <div
            v-if="
              statusOrder == STATUS_ORDER_SELL[2].orderStatus && !priceChangeOrders && type == 'add' || STATUS_ORDER_SELL[2].orderStatus && !priceChangeOrders && type == ':type'
            "
            class="w-[100%] flex ml-1 gap-4"
          >
            <el-button
              :disabled="doubleDisabled || disabledPhieu"
              @click="openBillDialog"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.paymentSlip') }}</el-button
            >
            <el-button
              @click="openDepositDialog"
              :disabled="doubleDisabled || disabledPhieu"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.depositSlipAdvance') }}</el-button
            >
            <el-button
              :disabled="statusButtonDetail"
              @click="submitForm(ruleFormRef, ruleFormRef2, false)"
              type="primary"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.saveCloseOrder') }}</el-button
            >
            <el-button
              :disabled="statusButtonDetail"
              @click="submitForm(ruleFormRef, ruleFormRef2, true)"
              type="primary"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.completeOrder') }}</el-button
            >
            <el-button
              @click="backToListOrder"
              :disabled="statusButtonDetail"
              type="danger"
              class="min-w-42 min-h-11"
              >{{ t('button.cancelOrder') }}</el-button
            >
          </div>

          <!-- Có thay đổi giá -->
          <div
            v-else-if="
              statusOrder == STATUS_ORDER_SELL[1].orderStatus && priceChangeOrders && type == 'add' || STATUS_ORDER_SELL[1].orderStatus && priceChangeOrders && type == ':type'
            "
            class="w-[100%] flex ml-1 gap-4"
          >
            <el-button
              @click="openBillDialog"
              :disabled="doubleDisabled"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.paymentSlip') }}</el-button
            >
            <el-button
              @click="openDepositDialog"
              :disabled="doubleDisabled"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.depositSlipAdvance') }}</el-button
            >
            <el-button
              :disabled="statusButtonDetail"
              @click="submitForm(ruleFormRef, ruleFormRef2, false)"
              type="primary"
              class="min-w-42 min-h-11"
              >{{ t('button.saveAndWaitApproval') }}</el-button
            >
            <el-button
              @click="backToListOrder"
              :disabled="statusButtonDetail"
              type="danger"
              class="min-w-42 min-h-11"
              >{{ t('button.cancelOrder') }}</el-button
            >
          </div>
          <div
            v-else-if="
              statusOrder == STATUS_ORDER_SELL[1].orderStatus &&
              !duplicateStatusButton &&
              type != 'add'
            "
            class="w-[100%] flex ml-1 gap-4"
          >
            <el-button
              @click="
                () => {
                  updateStatusOrders(STATUS_ORDER_SELL[0].orderStatus)
                }
              "
              :disabled="statusButtonDetail"
              type="danger"
              class="min-w-42 min-h-11"
              >{{ t('button.cancelOrder') }}</el-button
            >
          </div>
          <div
            v-else-if="
              statusOrder == STATUS_ORDER_SELL[2].orderStatus &&
              duplicateStatusButton &&
              buttonDuplicate
            "
            class="w-[100%] flex ml-1 gap-4"
          >
            <el-button @click="openBillDialog" class="min-w-42 min-h-11">{{
              t('formDemo.paymentSlip')
            }}</el-button>
            <el-button @click="openDepositDialog" class="min-w-42 min-h-11">{{
              t('formDemo.depositSlipAdvance')
            }}</el-button>
            <el-button
              :disabled="statusButtonDetail"
              @click="orderCompletion"
              type="primary"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.completeOrder') }}</el-button
            >
            <el-button
              @click="editOrder"
              :disabled="statusButtonDetail"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.editOrder') }}</el-button
            >
            <el-button
              @click="updateStatusOrders(STATUS_ORDER_SELL[0].orderStatus)"
              :disabled="statusButtonDetail"
              type="danger"
              class="min-w-42 min-h-11"
              >{{ t('button.cancelOrder') }}</el-button
            >
          </div>
          <div
            v-if="
              statusOrder == STATUS_ORDER_SELL[2].orderStatus && type == 'edit' && !buttonDuplicate
            "
            class="w-[100%] flex ml-1 gap-4"
          >
            <el-button
              :disabled="statusButtonDetail"
              @click="updateOrderInfomation()"
              type="primary"
              class="min-w-42 min-h-11"
              >{{ t('reuse.save') }}</el-button
            >
            <el-button
              @click="
                () => {
                  statusOrder = STATUS_ORDER_SELL[2].orderStatus
                  buttonDuplicate = true
                }
              "
              :disabled="statusButtonDetail"
              type="danger"
              class="min-w-42 min-h-11"
              >{{ t('button.cancel') }}</el-button
            >
          </div>
          <div
            v-else-if="statusOrder == STATUS_ORDER_SELL[3].orderStatus  || statusOrder == STATUS_ORDER_SELL[8].orderStatus"
            class="w-[100%] flex ml-1 gap-4"
          >
            <el-button @click="openBillDialog" class="min-w-42 min-h-11">{{
              t('formDemo.paymentSlip')
            }}</el-button>
            <el-button
              @click="openDepositDialog"
              :disabled="statusButtonDetail"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.depositSlipAdvance') }}</el-button
            >
            <button
              :disabled="statusButtonDetail"
              @click="createdExpendReturn"
              class="min-w-42 min-h-11 bg-[#FFF0D9] text-[#FD9800] rounded font-bold"
              >{{ t('formDemo.exchangeReturnGoods') }}</button
            >
            <el-button
              :disabled="statusButtonDetail"
              @click="
                () => {
                  updateStatusOrders(STATUS_ORDER_SELL[4].orderStatus)
                }
              "
              class="min-w-42 min-h-11 bg-[#D9D9D9]"
              >{{ t('formDemo.checkFinish') }}</el-button
            >
          </div>
          <div
            v-else-if="statusOrder == STATUS_ORDER_SELL[5].orderStatus && !duplicateStatusButton"
            class="w-[100%] flex ml-1 gap-4"
          >
            <el-button
              @click="openCancelExpendReturn"
              :disabled="statusButtonDetail"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.cancellationReturn') }}</el-button
            >
          </div>
          <div
            v-else-if="statusOrder == STATUS_ORDER_SELL[5].orderStatus && duplicateStatusButton"
            class="w-[100%] flex ml-1 gap-4"
          >
            <button
              :disabled="statusButtonDetail"
              @click="openFinishedExpendReturn"
              class="min-w-42 min-h-11 bg-[#FFF0D9] text-[#FD9800] rounded font-bold"
              >{{ t('formDemo.completeExchangeReturn') }}</button
            >
            <el-button
              @click="openCancelExpendReturn"
              :disabled="statusButtonDetail"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.cancellationReturn') }}</el-button
            >
          </div>
          <div v-else-if="statusOrder ==  STATUS_ORDER_SELL[7].orderStatus" class="w-[100%] flex ml-1 gap-4">
            <el-button @click="openBillDialog" class="min-w-42 min-h-11">{{
              t('formDemo.paymentSlip')
            }}</el-button>
            <el-button @click="openDepositDialog" class="min-w-42 min-h-11">{{
              t('formDemo.depositSlipAdvance')
            }}</el-button>
            <button
              @click="updateStatusOrders(STATUS_ORDER_SELL[4].orderStatus)"
              :disabled="checkDisabled"
              class="min-w-42 min-h-11 bg-[#D9D9D9] rounded font-bold"
              >{{ t('formDemo.checkFinish') }}</button
            >
          </div>
          <div v-else-if="statusOrder == 200" class="w-[100%] flex ml-1 gap-4">
            <el-button @click="approvalFunction(true)" type="warning" class="min-w-42 min-h-11">{{
              t('router.approve')
            }}</el-button>
            <el-button @click="approvalFunction(false)" class="min-w-42 min-h-11 rounded font-bold">{{
              t('router.notApproval')
            }}</el-button>
          </div>
        </div>
      </el-collapse-item>

      <el-collapse-item :name="collapse[2].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[2].icon" link />
          <span class="text-center text-xl">{{ collapse[2].title }}</span>
        </template>
        <el-button text @click="openAdditionalDialog">+ {{ t('reuse.addAccountingEntry') }}</el-button>
        <el-button :disabled="disabledPTAccountingEntry" @click="openReceiptDialog" text
          >+ {{ t('reuse.addReceiptBill') }}</el-button
        >
        <el-button :disabled="disabledPCAccountingEntry" @click="openPaymentDialog" text
          >+ {{ t('reuse.addPaymentBill') }}</el-button
        >
        <el-button :disabled="disabledDNTTAccountingEntry" @click="openPaymentRequest" text
          >+ {{ t('reuse.addPaymentRequestBill') }}</el-button
        >
        <el-table
          ref="multipleTableRef"
          :data="debtTable"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="40" align="center" />
          <el-table-column
            prop="createdAt"
            :label="t('formDemo.initializationDate')"
            min-width="150"
            align="center"
          >
            <template #default="data">
              {{ dateTimeFormat(data.row.createdAt) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="content"
            :label="t('formDemo.certificateInformation')"
            min-width="240"
          />
          <el-table-column
            prop="receiptOrPaymentVoucherCode"
            :label="t('formDemo.receiptOrPayment')"
            min-width="120"
            align="left"
          >
            <template #default="data">
              <div
                @click="(index) => getDetailPayment(index, data)"
                class="cursor-pointer text-blue-500"
              >
                {{ data.row.receiptOrPaymentVoucherCode }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="paymentRequestCode"
            :label="t('formDemo.paymentOrder')"
            align="left"
            min-width="150"
          >
            <template #default="props">
              <div
                @click="(index) => getDetailPaymentRequest(index, props)"
                class="cursor-pointer text-blue-500"
                >{{ props.row.paymentRequestCode }}</div
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="receiveMoney"
            :label="t('formDemo.collected')"
            align="left"
            min-width="150"
          />
          <el-table-column prop="paidMoney" :label="t('formDemo.spent')" min-width="150"/>
          <el-table-column prop="deibt" :label="t('formDemo.salesDebt')" min-width="150">
            <template #default="data">
              {{ changeMoney.format(data.row.deibt) ?? '0 đ' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="typeOfPayment"
            :label="t('formDemo.receivableOrPayable')"
            min-width="120"
          >
            <template #default="props">
              <div v-if="props.row.typeOfPayment == 1" class="text-blue-500"> {{ t('reuse.haveToCollect') }} </div>
              <div v-else-if="props.row.typeOfPayment == 0" class="text-red-500"> {{ t('reuse.havetoPay') }} </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="paymentMethods"
            :label="t('formDemo.choosePayment')"
            min-width="180"
          >
            <template #default="props">
              <div>{{
                props.row.paymentMethods == 0
                  ? t('formDemo.cashPayment')
                  : t('formDemo.cardPayment')
              }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="isReceiptedMoney"
            :label="t('formDemo.alreadyPaidForTt')"
            align="center"
            min-width="70"
          >
            <template #default="scope">
              <el-checkbox :disabled="true" v-model="scope.row.isReceiptedMoney" />
            </template>
          </el-table-column>
          <el-table-column
            :label="t('formDemo.statusAccountingEntry')"
            prop="status"
            align="center"
            min-width="120"
          >
            <template #default="props">
              <div>{{
                props.row.status == 1 ? t('formDemo.recorded') : t('formDemo.cancelled')
              }}</div>
            </template>
          </el-table-column>

          <el-table-column :label="t('formDemo.manipulation')" min-width="120" align="center">
            <template #default="data">
              <div class="flex">
                <button
                  @click="openDialogAcountingEntry(data,true)"
                  class="border-1 border-blue-500 pt-2 pb-2 pl-4 pr-4 dark:text-[#fff] rounded"
                >
                  {{ t('reuse.detail') }}
                </button>
              </div>
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
          <el-table :data="historyTable" border class="pl-4 dark:text-[#fff]">
            <el-table-column
              prop="createdAt"
              :label="t('formDemo.initializationDate')"
              min-width="150"
            >
              <template #default="props">
                {{ dateTimeFormat(props.row.createdAt) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="productPropertyCode"
              :label="t('formDemo.productManagementCode')"
              width="150"
            />
            <el-table-column
              prop="productPropertyName"
              :label="t('formDemo.productInformation')"
              min-width="720"
            />
            <el-table-column prop="accessory" :label="t('reuse.accessory')" width="180">
              <template #default="data">
                <el-input
                  :v-model="data.row.accessory"
                  v-if="type != 'detail'"
                  :placeholder="`/${t('formDemo.selfImportAccessories')}/`"
                />
                <div v-else>{{ data.row.accessory }}</div>
              </template>
            </el-table-column>

            <el-table-column prop="quantity" :label="t('formDemo.amount')" width="150" />
            <el-table-column prop="unitName" :label="t('reuse.dram')" align="center" width="120" />

            <el-table-column
              prop="warehouseTicketCode"
              :label="t('formDemo.importExportWarehouse')"
              align="left"
              width="200"
            >
              <template #default="props">
                <div @click="() => openDetailFullyIntegrated(props)" class="text-blue-500">
                  {{ props.row.warehouseTicketCode }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="warehouseTicketStatusName"
              :label="t('formDemo.status')"
              align="left"
              width="200"
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

::v-deep(.el-icon svg) {
  font-size: 20px;
}

::v-deep(.el-button.is-link) {
  padding: 20px;
}

::v-deep(.el-textarea__inner) {
  padding: 5px 0;
  box-shadow: none;
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

  .dialog-content {
    display: block;
  }
}

@media print {
  #printPage {
    position: fixed; /* Stay in place */
    top: 0;
    left: 0;
    z-index: 10; /* Sit on top */
    display: block; /* Hidden by default */
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: white;
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

::v-deep(.el-dialog__header) {
  padding-bottom: 0;
}

::v-deep(.el-table th.el-table__cell) {
  padding: 0 !important;
}

.example-showcase .el-dropdown-link {
  display: flex;
  color: var(--el-color-primary);
  cursor: pointer;
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

::v-deep(.el-dialog__title) {
  font-weight: bold;
}

.btn {
  width: 150px;
}

.break-w {
  word-break: break-word;
}

.box {
  position: relative;
  display: flex;
  width: fit-content;
  padding: 0 10px 0 20px;
  background-color: #ccc;
  border: 1px solid #ccc;
  opacity: 0.6;
  align-items: center;
}

.box_1 {
  background-color: #fff0d9;
  border: 1px solid #fff0d9;
}

.box_2 {
  background-color: #f4f8fd;
  border: 1px solid #f4f8fd;
}

.box_3 {
  background-color: #d9d9d9;
  border: 1px solid #d9d9d9;
}

.box_4 {
  background-color: #fce5e1;
  border: 1px solid #fce5e1;
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

.duplicate-status + .duplicate-status {
  margin-left: 10px;
}

.active {
  opacity: 1 !important;
}

::v-deep(.handle-fix > .el-input > .el-input__wrapper > .el-input__inner) {
  text-align: right;
}

::v-deep(.fix-err > .el-form-item__content > .el-form-item__error) {
  padding-left: 8px;
}

#content {
  height: 200px;
  padding: 0 10px;
  overflow: auto;
}

::v-deep(.el-overlay-dialog) {
  overflow-y: initial;
}

::v-deep(.el-dialog__body) {
  max-height: 80vh;
  padding-top: 0;
  overflow-y: auto;
}

::v-deep(.el-dialog) {
  position: absolute;
  top: 50%;
  left: 50%;
  margin: 0;
  transform: translate(-50%, -50%);
}
</style>
