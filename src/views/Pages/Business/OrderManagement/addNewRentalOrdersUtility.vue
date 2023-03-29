<script setup lang="ts">
import { reactive, ref, onBeforeMount, unref, watch } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import {
  ElCollapse,
  ElCollapseItem,
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
  // ElDropdown,
  // ElDropdownMenu,
  // ElDropdownItem,
  ElDatePicker,
  ElDialog,
  ElForm,
  ElFormItem,
  ElNotification,
  UploadUserFile,
  ElMessage,
  ElTooltip
} from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { Collapse } from '../../Components/Type'
import moment from 'moment'
import { formatOrderReturnReason, FORM_IMAGES } from '@/utils/format'
import { getCity, getDistrict, getWard } from '@/utils/Get_Address'
import { STATUS_ORDER_RENTAL } from '@/utils/API.Variables'
import { dateTimeFormat, postDateTime } from '@/utils/format'
import {
  getCollaboratorsInOrderList,
  getAllCustomer,
  getPromotionsList,
  getProductsList,
  addNewOrderList,
  getOrderList,
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
  updateOrderTransaction,
  updateStatusTransaction,
  GetPaymentRequestDetail,
  getCodePaymentRequest,
  getListWareHouse,
  postAutomaticWarehouse,
  GetProductPropertyInventory,
  updateOrderInfo,
  finishStatusOrder,
  updateStatusOrder,
  approvalOrder,
  cancelOrder,
  getReturnRequestForOrder,
  cancelReturnOrder,
  getAllStaffList,
  finishReturnOrder,
createTicketFromReturnOrder,
GenerateCodeOrder
} from '@/api/Business'
import MultipleOptionsBox from '@/components/MultipleOptionsBox.vue'
import CurrencyInputComponent from '@/components/CurrencyInputComponent.vue'
import paymentOrderPrint from '../../Components/formPrint/src/paymentOrderPrint.vue'
import billPrint from '../../Components/formPrint/src/billPrint.vue'
import receiptsPaymentPrint from '../../Components/formPrint/src/receiptsPaymentPrint.vue'

import type { FormInstance, FormRules } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import ReturnOrder from './ReturnOrder.vue'
import LeaseExtension from './LeaseExtension.vue'
import Qrcode from '@/components/Qrcode/src/Qrcode.vue'
import { API_URL } from '@/utils/API_URL'
import { appModules } from '@/config/app'
import { deleteTempCode } from '@/api/common'
import { changeMoney } from '@/utils/tsxHelper'
import * as orderUtility from './OrderFixbug'
import UploadMultipleImages from './UploadMultipleImages.vue'

const { utility } = appModules
const { t } = useI18n()
const doCloseOnClickModal = ref(false)

const ruleFormRef = ref<FormInstance>()
const ruleFormRef2 = ref<FormInstance>()
const ruleFormAddress = ref<FormInstance>()

interface IRuleForm { 
  orderCode: 'DHB039423'
  leaseTerm: number
  rentalPeriod: any
  rentalPaymentPeriod: number
  collaborators: string
  discount: number
  orderNotes: string
  customerName: string
  warehouse: string
  delivery: number
}

const ruleForm = reactive({
  orderCode: 'DHB039423',
  leaseTerm: 30,
  rentalPaymentPeriod: 4,
  delivery: 0 
} as IRuleForm)

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
  discount: [
    {
      validator: orderUtility.checkPercent,
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

let statusOrder = ref(2)

// var curDate = 'DCT' + moment().format('hhmmss')
var autoCustomerCode = 'KH' + moment().format('hhmmss')
var autoRentalOrderCode = 'T' + moment().format('hmmss')
var autoCodeExpenditures = 'PC' + moment().format('hmmss')
var autoCodeReturnRequest = 'DT' + moment().format('hms')

// const codeReturnRequest = ref()
const rentalOrderCode = ref()
const codeReceipts = ref()
const codeExpenditures = ref()
const codePaymentRequest = ref()

let checkValidateForm = ref(false)

const submitForm = async (
  formEl: FormInstance | undefined,
  formEl2: FormInstance | undefined,
  pushBack: boolean
) => {
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
      postData(pushBack)
      doubleDisabled.value = false
    } else {
      ElMessage.error(t('reuse.notFillAllInformation'))
      checkValidateForm.value = false
    }
  })
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

interface typeWarehouse {
  value: any
  label: any
}
const chooseWarehouse = reactive<Array<typeWarehouse>>([])

const radio1 = ref('')
const percentageIcon = useIcon({ icon: 'material-symbols:percent' })

const input = ref('')

interface tableRentalProduct {
  productPropertyId: string
  productName: string
  productPropertyName?: string
  productPropertyCode?: string
  productCode?: string
  accessory: string
  dateRange: any
  fromDate: any
  toDate: any
  quantity: string
  unitPrice: number
  hirePrice: number
  depositePrice: number
  warehouseId: number
  warehouseName: string
  totalPrice: number
  unitName: string
  intoARentalDeposit: string
  warehouseTotal?: number
  originalPrice?: number
  priceChange?: boolean
  id: string
}

const tableData = ref<Array<tableRentalProduct>>([])

const productForSale = reactive<tableRentalProduct>({
  productPropertyId: '',
  productName: '',
  accessory: '',
  dateRange: '',
  fromDate: '',
  toDate: '',
  quantity: '1',
  unitPrice: 0,
  hirePrice: 0,
  depositePrice: 0,
  warehouseId: 0,
  warehouseName: '',
  totalPrice: 0,
  unitName: t('formDemo.psc'),
  intoARentalDeposit: '',
  id: ''
})

interface tableDataType {
  initializationDate: string
  content: string
  receiptOrPaymentVoucherId: number | undefined
  receiptOrPaymentVoucherCode: string
  paymentRequestId: string | undefined
  paymentRequestCode: string
  quantity: number
  unitPrice: string
  intoMoney: string
  collected: string
  spent: string
  receiveMoney: string
  paidMoney: string
  rentalFeeDebt: string
  kindOfMoney: string
  paymentProposal: string
  payment: string
  alreadyPaidForTt: boolean
  statusAccountingEntry: string
  typeOfAccountingEntry?: number
  isReceiptedMoney?: boolean
  id?: number
}

let debtTable = ref<Array<tableDataType>>([])
let newTable = ref()
const disabledPTAccountingEntry = ref(true)
const disabledPCAccountingEntry = ref(true)
const disabledDNTTAccountingEntry = ref(true)
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

  moneyReceipts.value = val.reduce((total, value) => {
    total += parseInt(value.receiveMoney)
    return total
  }, 0)
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
    id: 1,
    label: t('formDemo.company')
  },
  {
    value: false,
    id: 2,
    label: t('formDemo.individual')
  }
]

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

// Tạm thời bỏ VAT 21/02/2023
// const radioVAT = ref(t('formDemo.doesNotIncludeVAT'))
const dialogFormVisible = ref(false)

const openDialogChoosePromotion = ref(false)

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
      value: collaborator.id,
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
  pageIndexCollaborator.value++
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
  quantity = 1,
  period = 1
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
  totalPriceOrder.value = 0
  tableData.value.map((val) => {
    if (val.totalPrice) totalPriceOrder.value += val.totalPrice
    if (val.depositePrice) totalDeposit.value += val.depositePrice
  })

  promoCash.value != 0
    ? (totalFinalOrder.value = totalPriceOrder.value - promoCash.value + totalDeposit.value)
    : (totalFinalOrder.value =
        totalPriceOrder.value -
        (totalPriceOrder.value * promoValue.value) / 100 +
        totalDeposit.value)

  /* Tạm thời bỏ VAT 21/02/2023
  if (radioVAT.value.length < 4) {
    VAT.value = true
    valueVAT.value = radioVAT.value.substring(0, radioVAT.value.length - 1)
    if (totalFinalOrder.value) {
      totalFinalOrder.value += (totalFinalOrder.value * parseInt(valueVAT.value)) / 100
    }
  }
  */
}

// Call api danh sách sản phẩm
const listProductsTable = ref()

const pageIndexProducts = ref(1)
const callApiProductList = async () => {
  const res = await getProductsList({
    ServiceType: 3,
    PageIndex: pageIndexProducts.value,
    PageSize: 20,
    IsApprove: true
  })
  if (res.data && res.data?.length > 0) {
    listProductsTable.value = res.data?.map((product) => ({
      productCode: product?.productCode,
      value: product?.code,
      name: product?.name ?? '',
      inventory:product.tonKho ?? 0,
      price: product?.price.toString(),
      productPropertyId: product?.id,
      productPropertyCode: product?.productPropertyCode,
      hirePrice: product?.hirePrice,
      finalPrice: product?.finalPrice,
      depositePrice: product?.depositePrice
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
    : getProductsList({ PageIndex: pageIndexProducts.value, PageSize: 20, ServiceType: 3, IsApprove: true })
        .then((res) => {
          res.data.length == 0
            ? (noMoreProductData.value = true)
            : res.data.map((product) =>
                listProductsTable.value?.push({
                  productCode: product?.productCode,
                  value: product?.code,
                  name: product?.name ?? '',
                  inventory: product.tonKho ?? 0,
                  price: product?.price.toString(),
                  productPropertyId: product?.id,
                  productPropertyCode: product?.productPropertyCode
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

let idOrderPost = ref()

// tạo đơn hàng
let postTable = ref()
const postData = async (pushBack: boolean) => {
  postTable.value = tableData.value
  .filter((row)=>row.productPropertyId && row.productPropertyId !== '' && row.productPropertyId != null)
  .map((e) => ({
    ProductPropertyId: e.productPropertyId,
    Accessory: e.accessory,
    Description: null,
    Quantity: e.quantity,
    UnitPrice: 0,
    HirePrice: e.hirePrice,
    DepositePrice: e.depositePrice,
    TotalPrice: e.totalPrice,
    ConsignmentSellPrice: 0,
    ConsignmentHirePrice: 0,
    SpaServiceIds: null,
    WarehouseId: null,
    PriceChange: priceChangeOrders.value,
    FromDate: postDateTime(ruleForm.rentalPeriod[0]),
    ToDate: postDateTime(ruleForm.rentalPeriod[1])
  }))

  if(orderUtility.ValidatePostData(tableData.value) == false){
      return
    }

  const productPayment = JSON.stringify([...postTable.value])

  const invalidArrayLength = postTable.value.filter(item => !item.ProductPropertyId).length

  if(invalidArrayLength || postTable.value.length < 1) {
    ElMessage.error('Vui lòng chọn mã sản phẩm')
    return 
  }

  const payload = {
    ServiceType: 3,
    OrderCode: ruleForm.orderCode,
    PromotionCode: promoCode.value ?? '',
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
    // VATMoney: valueVAT.value ? (totalFinalOrder.value * parseInt(valueVAT.value)) / 100 : 0,
    VATMoney: 0,
    Files: Files.value,
    DeliveryOptionId: ruleForm.delivery,
    ProvinceId: formAddress.province ?? 1,
    DistrictId: formAddress.district ?? 1,
    WardId: formAddress.wardCommune ?? 1,
    Address: customerAddress.value,
    OrderDetail: productPayment,
    CampaignId: campaignId.value ?? '',
    VAT: 0,
    Status: 2,
    Days: ruleForm.leaseTerm,
    PaymentPeriod: ruleForm.rentalPaymentPeriod,
    HirePeriodDay: ruleForm.rentalPaymentPeriod == 3 ? week.value : ruleForm.rentalPaymentPeriod == 4 ? month.value : '',
    warehouseId: ruleForm.warehouse
  }

  const formDataPayLoad = FORM_IMAGES(payload)
  const res = await addNewOrderList(formDataPayLoad)
  if (res) {
    ElNotification({
      message: t('reuse.addSuccess'),
      type: 'success'
    })
    if (pushBack == false) {
      router.push({
        name: 'business.order-management.order-list',
        params: { backRoute: String(router.currentRoute.value.name), tab: 'orderRental' }
      })
    } else {
      const id = Number(res)
      router.push({
        name: `business.order-management.order-list.${utility}`,
        params: {
          backRoute: 'business.order-management.order-list',
          type: 'detail',
          tab: 'orderRental',
          id: id
        }
      })
      orderCompletion(res)
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
const automaticCouponWareHouse = async (index, idOrder) => {
  const payload = {
    OrderId: idOrder,
    Type: index
  }

  await postAutomaticWarehouse(payload)
}

const hirePeriod = [
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
    label: t('reuse.byWeek')
  },
  {
    value: 4,
    label: t('reuse.byMonth')
  }
]

const checkDisabled = ref(false)

const router = useRouter()
const id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)

// options loại tiền bút toán bổ sung
const optionsKindOfMoney = [
  {
    value: 1,
    label: 'Tiền cọc(Không tính vào Công nợ phí thuê)'
  },
  {
    value: 2,
    label: 'Tiền phí(Tính vào Công nợ phí thuê)'
  },
  {
    value: 3,
    label: 'Tiền khác(Không tính vào Công nợ phí thuê)'
  }
]

const valueMoneyAccoungtingEntry = ref(0)
const autoChangeMoneyAccountingEntry = (_val, scope) => {
  valueMoneyAccoungtingEntry.value = 0
  const data = scope.row
  data.intoMoney = Math.abs(parseInt(data.receiveMoney) - parseInt(data.paidMoney))

  tableAccountingEntry.value.map((val) => {
    if (val.intoMoney) valueMoneyAccoungtingEntry.value += val.intoMoney
  })
}

// let totalOrder = ref(0)
let customerIdPromo = ref()
let duplicateStatusButton = ref(false)
const disabledDeleteRow = ref(false)

interface statusOrderType {
  orderStatusName: string
  orderStatus: number
  isActive?: boolean
  createdAt?: string
  approvedAt?: string
}
let arrayStatusOrder = ref(Array<statusOrderType>())
const isPartialReturn = ref()
const transaction = ref()
const disabledPhieuDatCoc = ref(false)
// Check trạng thái đơn hàng có đang ở chốt đơn hàng k để sinh bút toán tự động
const automaticEntry = ref(false)
const editData = async () => {
  await orderUtility.getStatusWarehouse(id)

  if (type == 'detail') checkDisabled.value = true
  if (type == 'edit' || type == 'detail' || type == 'approval-order') {
    disabledEdit.value = true
    disabledDeleteRow.value = true
    const res = await getOrderList({ Id: id, ServiceType: 3 })
    const orderObj = { ...res.data[0] }
    arrayStatusOrder.value = orderObj?.statusHistory
    if (arrayStatusOrder.value[arrayStatusOrder.value.length-1].orderStatus == STATUS_ORDER_RENTAL[5].orderStatus) {
      automaticEntry.value = true
    } else automaticEntry.value = false
    if (arrayStatusOrder.value?.length) {
      arrayStatusOrder.value[arrayStatusOrder.value?.length - 1].isActive = true
      if (type != 'approval-order')
        statusOrder.value = arrayStatusOrder.value[arrayStatusOrder.value?.length - 1]?.orderStatus
      else statusOrder.value = 200
      if (arrayStatusOrder.value[arrayStatusOrder.value?.length - 1].approvedAt)
        duplicateStatusButton.value = true
      else duplicateStatusButton.value = false
    }
    transaction.value = await getOrderTransaction({ id: id })
    if (debtTable.value.length > 0) debtTable.value.splice(0, debtTable.value.length - 1)
    debtTable.value = transaction.value.data

    debtTable.value.forEach((row)=>{
      if(row.typeOfAccountingEntry == 2){
        disabledPhieuDatCoc.value = true
      }
    })

    isPartialReturn.value = orderObj.isPartialReturn
    getReturnRequestTable()

    dataEdit.value = orderObj

    if (res.data) {
      ruleForm.orderCode = orderObj.code
      rentalOrderCode.value = orderObj.code
      ruleForm.collaborators = orderObj.collaboratorId
      ruleForm.discount = orderObj.collaboratorCommission
      ruleForm.leaseTerm = orderObj.days
      ruleForm.rentalPeriod = [orderObj.fromDate, orderObj.toDate]
      ruleForm.rentalPaymentPeriod = orderObj.paymentPeriod
      if (ruleForm.rentalPaymentPeriod == 3) week.value = orderObj.hirePeriodDay
      else if (ruleForm.rentalPaymentPeriod == 4) month.value = orderObj.hirePeriodDay
      if (tableData.value.length > 0) tableData.value.splice(0, tableData.value.length - 1)
      tableData.value = orderObj.orderDetails
      
      ruleForm.customerName = orderObj.customer.id
      ruleForm.orderNotes = orderObj.description
      ruleForm.warehouse = orderObj.warehouseId

      totalPriceOrder.value = orderObj.totalPrice
      totalDeposit.value = orderObj.depositePrice
      totalFinalOrder.value = totalPriceOrder.value + totalDeposit.value
      if (orderObj.discountMoney != 0) {
        showPromo.value = true
        promoCash.value = orderObj.discountMoney
      }
      
      if (orderObj.promotionCode) {
        showPromo.value = true
        promoActive.value = orderObj.promotionCode + ' | ' + orderObj.promotionCodeInfo
      }
      // Sinh bút toán tự động
      automaticAcountingEntry()

      getTotalWarehouse()
      changeDateRange(ruleForm.rentalPeriod)
      customerAddress.value = orderObj.address
      ruleForm.delivery = orderObj.deliveryOption
      customerIdPromo.value = orderObj.customerId
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
    Files.value = orderObj.orderFiles.map((element) => ({
          url: `${API_URL}${element?.path}`,
          name: element?.fileId
      })
      )
  } else if (type == 'add' || type == ':type') {
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
  if (duplicateProduct.value ) {    
    duplicateProductMessage()
  } else if (!dateRangePrice.value) ElMessage.error('Vui lòng chọn thời gian thuê trước')
   else if (!duplicateProduct.value && dateRangePrice.value) {
    data.productPropertyId = obj.productPropertyId
    data.productCode = obj.value
    data.productName = obj.name
    data.priceChange = false
    getTotalWarehouse()
    if (data.fromDate && data.toDate) {
      totalPriceOrder.value = 0
      totalFinalOrder.value = 0
      totalDeposit.value = 0

      let objPrice = await getProductPropertyPrice(
        data.productPropertyId,
        3,
        !Number.isNaN(data.quantity) ? parseInt(data.quantity) : data.quantity,
        ruleForm.leaseTerm
      )
      data.hirePrice = objPrice.price
      data.originalPrice = objPrice.price
      data.depositePrice = objPrice.deposite * data.quantity
      data.totalPrice = data.hirePrice * parseInt(data.quantity) * dateRangePrice.value
      
      changePriceRowTable(scope, true)
      // add new row
      if (scope.$index == tableData.value.length - 1) {
        addLastIndexSellTable()
      }
    } else {
      if (scope.$index == tableData.value.length - 1) {
        addLastIndexSellTable()
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

    let objPrice = await getProductPropertyPrice(
      data.productPropertyId,
      3,
      !Number.isNaN(data.quantity) ? parseInt(data.quantity) : data.quantity,
      ruleForm.leaseTerm
    )
    data.hirePrice = objPrice.price
    data.originalPrice = objPrice.price
    data.priceChange = false
    data.depositePrice = objPrice.deposite * data.quantity
    data.totalPrice = data.hirePrice * data.quantity * dateRangePrice.value
    tableData.value.map((val) => {
      if (val.totalPrice) totalPriceOrder.value += val.totalPrice
      if (val.depositePrice) totalDeposit.value += val.depositePrice
    })
    promoCash.value != 0
      ? (totalFinalOrder.value = totalPriceOrder.value - promoCash.value + totalDeposit.value)
      : (totalFinalOrder.value =
          totalPriceOrder.value -
          (totalPriceOrder.value * promoValue.value) / 100 +
          totalDeposit.value)
  }
}

const recalculatePrice = (data) => {
  tableData.value = []
  tableData.value.push({...productForSale})
  if (data == 7) {
    ruleForm.rentalPaymentPeriod = 3
  } else if (data == 30) {
    ruleForm.rentalPaymentPeriod = 4
  }
}

// Xóa sản phẩm trong table sản phẩm và thanh toán
const removeTableData = (index) => {
  tableData.value.splice(index, 1)
}

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

const inputDeposit = ref(0)
const payment = ref(choosePayment[0].value)
// Thông tin phiếu thu
const dialogInformationReceipts = ref(false)

// Thông tin phiếu đề nghị thanh toán
const dialogIPRForm = ref(false)

// Thông tin phiếu chi
const dialogPaymentVoucher = ref(false)

const alreadyPaidForTt = ref(true)

// Thông tin phiếu bán hàng
const dialogRentalPaymentInformation = ref(false)
const singleTableRef = ref<InstanceType<typeof ElTable>>()

const feePaymentPeriod = ref('')

// Thông tin phiếu thanh toán tiền cọc thuê
const dialogDepositSlip = ref(false)

// Thông tin phiếu nhập kho trả hàng cho thuê
const dialogWarehouseRentalPayment = ref(false)

const tableChooseWarehouse = ref([])

//add row to the end of table if fill all table
const addLastIndexSellTable = () => {
  tableData.value.push({ ...productForSale })
  changeDateRange(ruleForm.rentalPeriod)
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

// Trạng thái đơn hàng cho thuê
let countProductChangePrice = ref(0)
const priceChangeOrders = ref(false)
const changePriceRowTable = (props, checkRechangeProduct) => {
  const data = props.row
  data.totalPrice = data.hirePrice * data.quantity * dateRangePrice.value
  if (checkRechangeProduct) data.priceChange = true

  if (data.originalPrice != data.hirePrice && !data.priceChange ) {
    priceChangeOrders.value = true
    data.priceChange = true
    countProductChangePrice.value++
    if (type == 'add' || type == ':type') {
      arrayStatusOrder.value.splice(0, arrayStatusOrder.value.length)
      arrayStatusOrder.value.push({
        orderStatusName: 'Duyệt giá thay đổi',
        orderStatus: STATUS_ORDER_RENTAL[1].orderStatus,
        isActive: true
      })
    }
    doubleDisabled.value = true
    statusOrder.value = STATUS_ORDER_RENTAL[1].orderStatus
  } else if (data.originalPrice == data.hirePrice && data.priceChange ) {    
    if (!checkRechangeProduct || (checkRechangeProduct && countProductChangePrice.value == 1)) countProductChangePrice.value--
    if (countProductChangePrice.value == 0 ) {
      priceChangeOrders.value = false
      data.priceChange = false
      if (type == 'add' || type == ':type') {
        arrayStatusOrder.value.splice(0, arrayStatusOrder.value.length)
        arrayStatusOrder.value.push({
          orderStatusName: 'Chốt đơn hàng',
          orderStatus: STATUS_ORDER_RENTAL[2].orderStatus,
          isActive: true
        })
      }
      doubleDisabled.value = !doubleDisabled.value
      statusOrder.value = STATUS_ORDER_RENTAL[2].orderStatus
    }    
  }
  
  autoCalculateOrder()
}

arrayStatusOrder.value.pop()
if (type == 'add' && priceChangeOrders.value == false || type == ':type' && priceChangeOrders.value == false)
  arrayStatusOrder.value.push({
    orderStatusName: 'Chốt đơn hàng',
    orderStatus: 2,
    isActive: true
  })

// Bút toán bổ sung
const dialogAccountingEntryAdditional = ref(false)
const tableAccountingEntry = ref([
  {
    content: '',
    typeOfMoney: '',
    receiveMoney: 0,
    paidMoney: 0,
    intoMoney: 0
  }
])

// Gán lại data bảng bút toán và tính tổng tiền để điền vào phiếu thanh toán phí thuê
const assignTableRentalProducts = () => {
  totalRentalProduct.value = 0
  tableRentalProducts.value = tableData.value.map((el) => ({
    id: el.id,
    productName: el.productName,
    quantity: el.quantity,
    hirePrice: el.hirePrice,
    totalPrice: el.hirePrice * parseInt(el.quantity)
  }))
  tableRentalProducts.value.forEach((el) => {
    if (el.productName) totalRentalProduct.value += el.totalPrice
  })
}

let dataEdit = ref()
const nameDialog = ref('')
const tableRentalProducts = ref()
const totalRentalProduct = ref(0)

// function openBillDialog() {
//   assignTableRentalProducts()

//   nameDialog.value = 'bill'
//   dialogRentalPaymentInformation.value = !dialogRentalPaymentInformation.value
// }

function openDepositDialog() {
  createStatusAcountingEntry()
  showCreatedOrUpdateButton.value = true
  showCancelAcountingEntry.value = false
  updateDetailAcountingEntry.value = false
  dialogDepositSlip.value = !dialogDepositSlip.value
  nameDialog.value = 'deposit'
}

// function openReceiptDialog() {
//   getReceiptCode()
//   dialogInformationReceipts.value = !dialogInformationReceipts.value
//   nameDialog.value = 'Phiếu thu'
// }

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
  // Cập nhật lại bảng lịch sử công nợ
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
        status: 1,
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

  if (res.data) {
    formDetailPaymentReceipt.value = res.data

    nameDialog.value = 'Phiếu thu'
    codeReceipts.value = formDetailPaymentReceipt.value?.code
    codeExpenditures.value = formDetailPaymentReceipt.value?.code
    inputReasonCollectMoney.value = formDetailPaymentReceipt.value?.description
    moneyReceipts.value = formDetailPaymentReceipt.value?.totalMoney
    payment.value = formDetailPaymentReceipt.value?.typeOfPayment
    inputRecharger.value = formDetailPaymentReceipt.value?.peopleId ?? 1
    dialogInformationReceipts.value = true
  }
}

// input nhập tiền viết bằng chữ
const enterMoney = ref()
const formReceipts = ref()
const moneyReceipts = ref(0)
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
  const res = await getReturnRequestForOrder({ CustomerOrderId: id })
  const optionsReturnRequest = res.data

  if (Array.isArray(unref(optionsReturnRequest)) && optionsReturnRequest?.length > 0) {
    historyTable.value = optionsReturnRequest.map((e) => ({
      createdAt: e?.returnRequestInfo?.createdAt ?? '',
      productPropertyId: e?.productPropertyId,
      productPropertyName: e?.productPropertyName,
      accessory: e?.accessory,
      quantity: e?.quantity,
      unitName: e?.unitName,
      returnDetailType: e?.returnDetailType,
      returnDetailTypeName: e?.returnDetailTypeName,
      returnDetailStatusName: e?.returnDetailStatusName,
      warehouseTicketCode: e?.warehouseTicketCode,
      warehouseTicketId: e?.warehouseTicketId,
      warehouseTicketStatusName: e?.warehouseTicketStatusName
    }))
    orderUtility.checkStatusReturnRequestInWarehouse(historyTable.value[0]?.warehouseTicketStatus)
  }
}

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
    Code: codeReceipts.value,
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

// table đề nghị thanh toán
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

const getReceiptCode = async () => {
  codeReceipts.value = await getReceiptPaymentVoucher()
}

const getcodeExpenditures = async () => {
  codeExpenditures.value = await getReceiptPaymentVoucher()
}

const newCodePaymentRequest = async () => {
  codePaymentRequest.value = await getCodePaymentRequest()
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

// Thêm mới mã phiếu đề nghị thanh toán vào debtTable
const handleChangePaymentOrder = async () => {
  if (newTable.value?.length) {
    newTable.value.forEach((val, index, arr) => {
      const payload = {
        accountingEntryId: val.id,
        paymentRequestId: idPayment.value,
        receiptOrPaymentVoucherId: 0,
        isReceiptedMoney: true,
        status: 1,
        paymentMethods: 1
      }
      updateOrderTransaction(payload).then(() => {
        if (index == arr.length - 1) getOrderStransactionList()
      })
    })
  }
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

// Lấy chi tiết phiếu đề nghị thanh toán
const getDetailPaymentRequest = async (_index, scope) => {
  const res = await GetPaymentRequestDetail({
    id: scope.row.paymentRequestId
  })
  if (res.data) {
    formDetailPaymentReceipt.value = res.data
    codeReceipts.value = formDetailPaymentReceipt.value.code
    // Người nộp tiền
    inputRecharger.value = formDetailPaymentReceipt.value.paymentRequest.peopleId
    totalPayment.value = formDetailPaymentReceipt.value.paymentRequest.totalPrice
    moneyReceipts.value = formDetailPaymentReceipt.value.paymentRequest.totalMoney
    depositePayment.value = formDetailPaymentReceipt.value.paymentRequest.depositeMoney
    debtPayment.value = formDetailPaymentReceipt.value.paymentRequest.debtMoney
    inputReasonCollectMoney.value = formDetailPaymentReceipt.value.paymentRequest.reasonCollectMoney
    enterMoney.value = formDetailPaymentReceipt.value.paymentRequest.enterMoney

    detailedListExpenses.value = formDetailPaymentReceipt.value.paymentRequestDetail
    dialogIPRForm.value = true
  }
}

// Thêm bút toán cho đơn hàng
let childrenTable = ref()
let idStransaction = ref()
let objOrderStransaction = ref()
const postOrderStransaction = async (index: number) => {
  if (index != 1) {
    tableRentalProducts.value = tableData.value
  }
  childrenTable.value = tableRentalProducts.value?.map((val) => ({
    merchadiseTobePayforId: parseInt(val.id),
    quantity: parseInt(val.quantity)
  }))
  const payload = {
    orderId: id,
    content:
      index == 1
        ? feePaymentPeriod.value
        : index == 2
        ? 'Thu tiền cọc thuê'
        : index == 3
        ? 'Trả hàng trước hạn'
        : tableAccountingEntry.value[0].content,
    paymentRequestId: null,
    receiptOrPaymentVoucherId: null,
    receiveMoney:
      index == 1
        ? totalRentalProduct.value
        : index == 2
        ? totalDeposit.value
        : index == 4
        ? tableAccountingEntry.value[0].receiveMoney
        : 0,
    paidMoney:
      index == 1 || index == 2
        ? 0
        : index == 4 ? tableAccountingEntry.value[0].paidMoney
        : 0
        ,
    deibt: 0,
    typeOfPayment: index == 1 ? 1 : index == 2 ? 1 : 0,
    typeOfAccountingEntry: index,
    paymentMethods: 1,
    status: 1,
    isReceiptedMoney: alreadyPaidForTt.value ? 1 : 0,
    typeOfMoney: 1,
    merchadiseTobePayfor: childrenTable.value
  }
  objOrderStransaction.value = await addOrderStransaction(payload)
  idStransaction.value = objOrderStransaction.value.paymentRequestId
  getOrderStransactionList()
}

// Call api chi tiết bút toán theo id
let tableSalesSlip = ref()
let formAccountingId = ref()
const openDialogAcountingEntry = (scope) => {
  updateDetailAcountingEntry.value = true
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

const idAcountingEntry = ref()
const showCreatedOrUpdateButton = ref(false)
const showCancelAcountingEntry = ref(true)

const updateDetailAcountingEntry = ref(false)
const updateInfoAcountingEntry = (index) => {
  if (updateDetailAcountingEntry.value) {
    updateOrderStransaction()
  }else {
    postOrderStransaction(index)
  }
}

const checkEditAcountingEntryPaymentType = ref(false)
const openAcountingEntryDialog = async (index, num) => {
  idAcountingEntry.value = index
  const res = await getDetailAccountingEntryById({ id: index })
  formAccountingId.value = { ...res.data }
  tableSalesSlip.value = formAccountingId.value?.paidMerchandises
  tableSalesSlip.value.forEach((e) => {
    e.totalPrice = e.unitPrice * e.quantity
  })
  inputDeposit.value = formAccountingId.value.accountingEntry?.receiveMoney
  // moneyDeposit.value = formAccountingId.value.accountingEntry?.deibt
  // paidMoney.value = formAccountingId.value?.paidMoney
  tableAccountingEntry.value[0] = formAccountingId.value.accountingEntry
  tableAccountingEntry.value.forEach((el) => {
    el.intoMoney = Math.abs(el.paidMoney - el.receiveMoney)
  })
  assignTableRentalProducts()
  feePaymentPeriod.value = formAccountingId.value.accountingEntry.content
  valueMoneyAccoungtingEntry.value = 0
  tableAccountingEntry.value.map((val) => {
    if (val.intoMoney) valueMoneyAccoungtingEntry.value += val.intoMoney
  })
  alreadyPaidForTt.value = formAccountingId.value.accountingEntry?.isReceiptedMoney
  
  statusAccountingEntry.value = formAccountingId.value.statusHistorys
  statusAccountingEntry.value[statusAccountingEntry.value.length-1].isActive = true
  if (statusAccountingEntry.value[statusAccountingEntry.value.length-1].transactionStatus == 0) {
    showCreatedOrUpdateButton.value = false
    showCancelAcountingEntry.value = false
  } else {
    showCreatedOrUpdateButton.value = true
    showCancelAcountingEntry.value = true
  }
  checkEditAcountingEntryPaymentType.value = true
  if (num == 1) {    
    dialogRentalPaymentInformation.value = true
  } else if (num == 2) {
    dialogDepositSlip.value = true
  } else if (num == 4) {
    dialogAccountingEntryAdditional.value = true
  } else if (num == 3) {
    // tableReturnFullyIntegrated.value = formAccountingId.value?.paidMerchandises
    // tableProductInformationExportChange.value = formAccountingId.value?.paidMerchandises
    // changeReturnGoods.value = true
  }
}

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

// Lấy chi tiết bút toán theo id bút toán
const optionAcountingEntry = ref<Array<typeOptionAcountingEntry>>([])
const callApiDetailAccountingEntry = async(index) => {
  idAcountingEntry.value = index
  const res = await getDetailAccountingEntryById({ id: index })
  formAccountingId.value = { ...res.data }
  totalRentalProduct.value = 0
  tableRentalProducts.value = formAccountingId.value.paidMerchandises.map((el) => ({
    id: el.id,
    productName: el.productName,
    quantity: el.quantity,
    hirePrice: el.hirePrice,
    totalPrice: el.hirePrice * parseInt(el.quantity)
  }))
  tableRentalProducts.value.forEach((el) => {
    if (el.productName) totalRentalProduct.value += el.totalPrice
  })
  statusAccountingEntry.value = formAccountingId.value.statusHistorys
  statusAccountingEntry.value[statusAccountingEntry.value.length-1].isActive = true
  if (statusAccountingEntry.value[statusAccountingEntry.value.length-1].transactionStatus == 0) {
    showCreatedOrUpdateButton.value = false
    showCancelAcountingEntry.value = false
  } else {
    showCreatedOrUpdateButton.value = true
    showCancelAcountingEntry.value = true
  }
}

interface typeOptionAcountingEntry {
  value: any
  label: string
}

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

// Xem chi tiết phiếu thanh toán tiền phí thuê
let countApi = ref(0)
const openDetailRentalPaymentBill = () => {
  optionAcountingEntry.value = []
  nameDialog.value = 'bill'
  debtTable.value?.map((el) => {
    if (el?.typeOfAccountingEntry == 1 && !el?.isReceiptedMoney) {
      optionAcountingEntry.value.push({        
        value: el.id,
        label: el.content
      })
    }
  })
  
  feePaymentPeriod.value = optionAcountingEntry.value[0].value
  if (countApi.value == 0) callApiDetailAccountingEntry(feePaymentPeriod.value)
  countApi.value++
  
  dialogRentalPaymentInformation.value = true
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

// Cập nhật trạng thái bút toán
const UpdateStatusTransaction = async() => {
  const payload = {
    AccountingEntryId: idAcountingEntry.value,
    OrderTransactionStatus: 0
  }

  updateStatusTransaction(FORM_IMAGES(payload))
    // Cập nhật lại bảng lịch sử công nợ
    getOrderStransactionList()
  editData()
}

const listOfOrderProduct = ref()
// Dialog trả hàng trước hạn
const dialogReturnAheadOfTime = ref(false)

// call api bảng trả hàng trước hạn và hết hạn
const objReturnRequestInfo = ref()
const callApiReturnRequestForOrder = async() => {
  const res = await getReturnRequestForOrder({CustomerOrderId: id})
  objReturnRequestInfo.value = res?.data[res?.data.length-1].returnRequestInfo
  await callApiDetailReturnExpand()
}

const detailExpand = ref()
const doneExpand = ref(false)
const cancelExpend = ref(false)
const callApiDetailReturnExpand = async() => {
  const res = await getReturnRequest({ CustomerOrderId: id, ReturnRequestId: objReturnRequestInfo.value.id})
  detailExpand.value = res.data[0].nhapDetails
}

// Hủy trả hàng trước hạn
const cancelExpendReturn = async() => {
  cancelExpend.value = false
  detailExpand.value = false
  doneExpand.value = false
  const payload = {
    OrderId: id
  }
  await cancelReturnOrder(FORM_IMAGES(payload))
  reloadStatusOrder()
  getReturnRequestTable()
}
// Dialog trả hàng hết hạn
const dialogReturnExpired = ref(false)

// Trả hàng trước hạn
const updateStatusReturnAheadOfTime = (index) => {
  statusOrder.value = index
}

const openDialogReturnAheadOfTime = () => {
  setDataForReturnOrder()
  dialogReturnAheadOfTime.value = true
}

// Hoàn thành trẩ hàng
const openDialogReturnAheadTime = () => {
  doneExpand.value = true
  setDataForReturnOrder()
  callApiReturnRequestForOrder()
  dialogReturnAheadOfTime.value = true
}

// Hủy trả hàng
const openDialogCancelReturn = () => {
  cancelExpend.value = true
  setDataForReturnOrder()
  callApiReturnRequestForOrder()
  dialogReturnAheadOfTime.value = true
}

// Gia hạn thuê
const openDialogLeaseExtension = () => {
  setDataForReturnOrder()
  dialogLeaseExtension.value = true
}

//TruongNgo
const rentReturnOrder = ref({} as any)
const getListProduct = ref()
let productArray: any = []
const setDataForReturnOrder = () => {
  productArray = tableData.value?.map((row) => row?.productPropertyId)
  listOfOrderProduct.value = listProductsTable.value?.filter((item) => {
    return productArray.includes(item?.productPropertyId)
  })
  getListProduct.value = tableData.value.map((el) => ({
    productCode: el.productCode,
    productPropertyCode: el.productPropertyCode,
    name: el.productName + ' ' + el.productPropertyName,
    productPropertyId: el.productPropertyId,
    depositePrice: el.depositePrice,
    finalPrice: el.totalPrice,
    hirePrice: el.hirePrice,
    price: el.hirePrice,    
    maximumQuantity: el.quantity,
    value: el?.productCode
  }))
  rentReturnOrder.value.orderCode = ruleForm.orderCode
  rentReturnOrder.value.leaseTerm = ruleForm?.leaseTerm
  rentReturnOrder.value.period = ruleForm?.rentalPeriod
  rentReturnOrder.value.name = infoCompany?.name
  rentReturnOrder.value.customerAddress = customerAddress
  rentReturnOrder.value.phone = infoCompany?.phone
  rentReturnOrder.value.tableData = tableData?.value
}
// Tạo mới yêu cầu đổi trả
const postTableExpand = ref()
const postReturnRequest = async (reason, scope, dateTime, tableExpand) => {
  let tableReturnPost = [{}]
  if (reason == 3 || reason == 5) {
    scope?.pop()
    tableReturnPost = scope?.map((e) => ({
    productPropertyId: parseInt(e?.productPropertyId),
    quantity: parseInt(e?.quantity),
    accessory: e?.accessory,
    returnDetailType: reason,
    description: e.conditionProducts
  }))
  }  

  if (reason == 4) {
    tableReturnPost = rentReturnOrder.value.tableData.map((e) => ({
    productPropertyId: parseInt(e.productPropertyId),
    quantity: e.quantity,
    accessory: e.accessory,
    returnDetailType: reason,
    description: e.description
  }))
  }
  
  if (reason == 5) {
    postTableExpand.value = tableExpand.map((val) => ({
      productPropertyId: val.productPropertyId,
      quantity: val.quantity,
      accessory: val.accessory,
      unitPrice: val.hirePrice,
      totalPrice: val.totalPrice,
      returnDetailType: reason,
      isSpa: true,
      description: val.description
    }))
  }
  const payload = {
    customerOrderId: id,
    code: autoCodeReturnRequest,
    name: 'Đổi trả đơn hàng',
    description: formatOrderReturnReason(reason),
    returnRequestType: reason,
    targetDate: dateTime,
    tienBan: 0,
    tienHoan: 0,
    totalPrice: 0,
    giaHanDetails: reason == 5 ? postTableExpand.value : [],
    nhapDetails: tableReturnPost,
    xuatDetails: [],
    isPaid: true
  }
  await createReturnRequest(payload).then(async (res)=>{
    idReturnRequest.value = res
    await createTicketFromReturnOrders()
    reloadStatusOrder()
    getReturnRequestTable()
    ElNotification({
      message: 'Đổi trả đơn hàng thành công',
      type: 'success'
    })
  }).catch((error) => {
    statusOrder.value = 400
    ElNotification({
      message: error?.response?.data?.message || 'Đơn hàng chưa được xuất kho',
      type: 'warning'
    })
  })
}
const idReturnRequest = ref()
// Tạo phiếu cho đơn đổi trả
const createTicketFromReturnOrders = async () => {
  const payload = {
    orderId: id,
    returnRequestId: idReturnRequest.value
  }
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
}

// open dialog bút toán bổ sung
const openDialogAdditional = () => {
  createStatusAcountingEntry()
  showCreatedOrUpdateButton.value = true
  showCancelAcountingEntry.value = false
  updateDetailAcountingEntry.value = false

  dialogAccountingEntryAdditional.value = true
}

const indexRowWarehouse = ref()

const openDialogChooseWarehouse = ref(false)

const addRow = () => {
  rentReturnOrder.value.tableData.push({ ...productForSale })
  changeDateRange(ruleForm.rentalPeriod)
}
const removeRow = (index) => {
  rentReturnOrder.value.tableData.splice(index, 1)
}

const doubleDisabled = ref(false)
const showPromo = ref(false)

// import and show image
const Files = ref<UploadUserFile[]>([])

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

const dateRangePrice = ref()
const changeDateRange = (data) => {
  if(data){
  tableData.value.forEach((el) => {
    el.fromDate = data[0]
    el.toDate = data[1]
  })
  if (tableData.value?.length) {
      let start = moment(ruleForm.rentalPeriod[0], 'YYYY-MM-DD')
      let end = moment(ruleForm.rentalPeriod[1], 'YYYY-MM-DD')

      //Difference in number of days
      let day = moment.duration(start.diff(end)).asDays() * -1
      let days = Math.ceil(day / ruleForm.leaseTerm)

      dateRangePrice.value = days
      tableData.value.map((val) => {
        val.totalPrice = val.hirePrice * parseInt(val.quantity) * days
      })
      autoCalculateOrder()
  }}
  else{
    startDate.value = null
  }
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
  const res = await getOrderList({ Id: id, ServiceType: 3 })

  const orderObj = { ...res?.data[0] }
  isPartialReturn.value = orderObj.isPartialReturn
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
    Files: Files.value,
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

// Cập nhật trạng thái đơn hàng
const updateStatusOrders = async (typeState, idOrder) => {
  if (typeState == STATUS_ORDER_RENTAL[0].orderStatus) {
    let payload = {
      OrderId: idOrder
    }
    await cancelOrder(FORM_IMAGES(payload))
    reloadStatusOrder()
  } else if (typeState == STATUS_ORDER_RENTAL[10].orderStatus) {
    let payload = {
      OrderId: idOrder
    }
    await finishStatusOrder(FORM_IMAGES(payload))
    reloadStatusOrder()
  } else {
    if (type == 'add' || type == ':type') {
      let payload = {
        OrderId: idOrder ? idOrder : idOrderPost.value,
        ServiceType: 3,
        OrderStatus: typeState
      }
      // @ts-ignore
      submitForm(ruleFormRef, ruleFormRef2)
      updateStatusOrder(FORM_IMAGES(payload))
    } else {
      let payload = { OrderId: idOrder, ServiceType: 3, OrderStatus: typeState }
      await updateStatusOrder(FORM_IMAGES(payload))
      reloadStatusOrder()
    }
  }
}

const route = useRoute()
const { push } = useRouter()
const approvalId = String(route.params.approvalId)
const tab = String(route.params.tab)

const approvalFunction = async (checkApproved) => {
  const payload = { ItemType: 2, Id: parseInt(approvalId), IsApprove: checkApproved }
  await approvalOrder(FORM_IMAGES(payload))
  push({
    name: `approve.orders-approval.orders-new`
  })
}

const totalWarehouse = ref()
const tableWarehouse = ref()

const callApiWarehouseTotal = async (productPropertyId = 0, serviceType = 3) => {
  const getTotalPayload = {
    ProductPropertyId: productPropertyId,
    ServiceType: serviceType
  }
  const res = await GetProductPropertyInventory(getTotalPayload)
  const total = res?.total
  return total
}

const getTotalWarehouse = () => {
  tableData.value.forEach(async (el) => {
    if (el.productPropertyId)
      el.warehouseTotal = await callApiWarehouseTotal(parseInt(el.productPropertyId), 3)
  })
}

// Lấy danh sách kho theo mã sản phẩm và sericeType
const callApiWarehouse = async (scope) => {
  const data = scope.row
  indexRowWarehouse.value = scope.$index

  const res = await GetProductPropertyInventory({
    ProductPropertyId: data.productPropertyId,
    ServiceType: 3
  })

  data.warehouseTotal = res.total
  totalWarehouse.value = res.total
  tableWarehouse.value = res.inventoryDetails.map((val) => ({
    warehouseCheckbox: val.id,
    name: val.name,
    inventory: val.inventory
  }))
}

const buttonDuplicate = ref(false)
const statusButtonDetail = ref(false)
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

// Gia hạn thuê
const dialogLeaseExtension = ref(false)

// Hủy tạo đơn hàng -> back ra màn danh sách đơn hàng
const backToListOrder = () => {
  deleteTempCode(ruleForm.orderCode)
  router.push({
    name: 'business.order-management.order-list',
    params: { backRoute: String(router.currentRoute.value.name), tab: tab }
  })
  
}

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

// Hoàn thành trả hàng trước hạn
const doneReturnGoods = async () => {
  const payload = {
    OrderId: id
  }
  const formDataPayLoad = FORM_IMAGES(payload)
  await finishReturnOrder(formDataPayLoad)
  reloadStatusOrder()
  getReturnRequestTable()
}

const automaticAcountingEntry = async() => {
  let start = moment(ruleForm.rentalPeriod[0], 'YYYY-MM-DD')
      let end = moment(ruleForm.rentalPeriod[1], 'YYYY-MM-DD')

      //Difference in number of days
      let day = moment.duration(start.diff(end)).asDays() * -1
      let days = Math.ceil(day / ruleForm.leaseTerm)

      dateRangePrice.value = days
      const dateAfter = transaction.value.data.findLast((el) => el.typeOfAccountingEntry == 1)
      let lastPaymentDate
      if (!dateAfter?.createdAt) lastPaymentDate = start
      else lastPaymentDate = moment(dateAfter?.createdAt, 'YYYY-MM-DD')
      let countPostPayment = moment.duration(lastPaymentDate.diff(end)).asDays()* - 1
      // Số bút toán tự động cần tạo
      let postPayment = Math.ceil(countPostPayment / ruleForm.leaseTerm)   
      // currentDateTime là thời gian hiện tại
      // const currentDateTime = moment(new Date(), 'YYYY-MM-DD')
      // numPayments để lấy chênh lệch thời gian từ ngày tạo bút toán cuối cùng đến ngày hiện tại
      // const numPayments = moment.duration(lastPaymentDate.diff(currentDateTime)).asDays()* - 1
      // numPayment là số bút toán tự động cần tạo
      // let numPayment = Math.ceil(numPayments / ruleForm.leaseTerm)

      const paymentPeriods = moment.duration(start.diff(lastPaymentDate)).asDays()* - 1
      let paymentPeriod = Math.ceil(paymentPeriods / ruleForm.leaseTerm) 
      const curMonth = ruleForm.rentalPeriod[0].slice(5,7)
      if (postPayment > 0 && debtTable.value.length == 0 && automaticEntry.value) {
        alreadyPaidForTt.value = false
        for (let i = 0; i < postPayment; i++) {
          if (month.value) {
            feePaymentPeriod.value = `Kỳ tanh toán phí thuê theo tháng/ Ngày ${month.value}/${curMonth}/2022/ Tháng thứ ${paymentPeriod + i + 1}`
          } else if (week.value){
            feePaymentPeriod.value = `Kỳ tanh toán phí thuê theo tuần/ Thứ ${week.value}/ Tuần thứ ${paymentPeriod + i + 1}`
          }
          assignTableRentalProducts()
          await postOrderStransaction(1)
        }
      }
}

// Bắt đầu thuê theo kỳ hạn -> call api phiếu nhập kho tự động
const orderCompletion = async(idOrder) => {
  automaticCouponWareHouse(2, idOrder)
  await updateStatusOrders(STATUS_ORDER_RENTAL[5].orderStatus, idOrder)
  editData()

  // đang bị lỗi bất đồng bộ dùng hàm automaticAcountingEntry() nó k chạy, k có thời gian fix nên dev sau thấy cái này thì fix hộ vs ạ
  let start = moment(ruleForm.rentalPeriod[0], 'YYYY-MM-DD')
  let end = moment(ruleForm.rentalPeriod[1], 'YYYY-MM-DD')

  //Difference in number of days
  let day = moment.duration(start.diff(end)).asDays() * -1
  let days = Math.ceil(day / ruleForm.leaseTerm)

  dateRangePrice.value = days
  const dateAfter = transaction.value.data.findLast((el) => el.typeOfAccountingEntry == 1)
  let lastPaymentDate
  if (!dateAfter?.createdAt) lastPaymentDate = start
  else lastPaymentDate = moment(dateAfter?.createdAt, 'YYYY-MM-DD')
  let countPostPayment = moment.duration(lastPaymentDate.diff(end)).asDays()* - 1
  // Số bút toán tự động cần tạo
  let postPayment = Math.ceil(countPostPayment / ruleForm.leaseTerm)   
  // currentDateTime là thời gian hiện tại
  // const currentDateTime = moment(new Date(), 'YYYY-MM-DD')
  // numPayments để lấy chênh lệch thời gian từ ngày tạo bút toán cuối cùng đến ngày hiện tại
  // const numPayments = moment.duration(lastPaymentDate.diff(currentDateTime)).asDays()* - 1
  // numPayment là số bút toán tự động cần tạo
  // let numPayment = Math.ceil(numPayments / ruleForm.leaseTerm)

  const paymentPeriods = moment.duration(start.diff(lastPaymentDate)).asDays()* - 1
  let paymentPeriod = Math.ceil(paymentPeriods / ruleForm.leaseTerm) 
  const curMonth = ruleForm.rentalPeriod[0].slice(5,7)
  if (postPayment > 0 && debtTable.value.length == 0 && automaticEntry.value) {
    alreadyPaidForTt.value = false
    for (let i = 0; i < postPayment; i++) {
      if (month.value) {
        feePaymentPeriod.value = `Kỳ tanh toán phí thuê theo tháng/ Ngày ${month.value}/${curMonth}/2022/ Tháng thứ ${paymentPeriod + i + 1}`
      } else if (week.value){
        feePaymentPeriod.value = `Kỳ tanh toán phí thuê theo tuần/ Thứ ${week.value}/ Tuần thứ ${paymentPeriod + i + 1}`
      }
      assignTableRentalProducts()
      await postOrderStransaction(1)
    }
  }
}

onBeforeMount(async() => {
  callApiCollaborators()
  callCustomersApi()
  callApiProductList()
  editData()
  callApiWarehouseList()
  if (type == 'add' || type == ':type') {
    await GenerateCodeOrder({CodeType:5,ServiceType:3})
    .then((res) => {
      ruleForm.orderCode = res.data
    })
    // ruleForm.orderCode = curDate
    rentalOrderCode.value = autoRentalOrderCode
    codeExpenditures.value = autoCodeExpenditures
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
const startDate = ref()
const disabledDate = (time: Date) => {
  if(startDate.value){
    const day = moment(time)
    const firstDate = moment(startDate.value).format()
    const endDate = moment(startDate.value).add(ruleForm.leaseTerm, "days").format()

    return day.isBefore(firstDate) || day.isAfter(endDate)
  }
  return false //ko disable
}
const changeDateRanges = (dates) =>{
  startDate.value = dates[0]
}
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
          <!-- <el-dialog :close-on-click-modal="doCloseOnClickModal" v-model="testDialog" width="40%" align-center> -->
          <paymentOrderPrint />
          <!-- </el-dialog> -->
        </slot>
      </div>

      <!-- Dialog Thêm nhanh khách hàng -->
      <el-dialog
:close-on-click-modal="doCloseOnClickModal"
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
              <label class="w-[30%] text-right">{{ t('reuse.email') }}<span class="text-red-500">*</span></label>
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
            <el-button class="w-[150px]" @click.stop.prevent="openDialogAddQuickCustomer">{{
              t('reuse.exit')
            }}</el-button>
          </span>
        </template>
      </el-dialog>

      <!-- Dialog Thông tin phiếu thu -->
      <el-dialog
:close-on-click-modal="doCloseOnClickModal"
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
            <label class="w-[30%] text-right">{{ t('reuse.moneyReceipts') }}</label>
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
:close-on-click-modal="doCloseOnClickModal"
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
            <el-button @click="dialogPaymentVoucher = false">{{ t('button.print') }}</el-button>
            <div>
              <span class="dialog-footer">
                <el-button
                  type="primary"
                  @click="
                    () => {
                      dialogPaymentVoucher = false
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
:close-on-click-modal="doCloseOnClickModal"
        v-model="dialogIPRForm"
        :title="t('formDemo.informationPaymentRequestForm')"
        width="50%"
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
              <p class="text-blue-400 leading-8">{{ t('formDemo.deposit') }} <span class="text-red-500">*</span></p>
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

      <!-- Thông tin phiếu thanh toán tiền phí thuê -->
      <el-dialog
:close-on-click-modal="doCloseOnClickModal"
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
          <div class="flex pt-4 pb-2 items-center">
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
                    : t('formDemo.byMonth')
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

            <div class="flex-1 flex gap-4">
              <span>
                <div class="text-right">{{ t('formDemo.qrCodePurchaseOrder') }}</div>
                <span class="text-yellow-400">{{ t('formDemo.paymentByApp') }}</span>
              </span>

              <span class="border"><Qrcode :width="100" :text="rentalOrderCode" /></span>
            </div>
          </div>
          <div class="flex gap-4 items-center pb-4">
            <label class="w-[20%] text-right">{{ t('formDemo.feePaymentPeriod') }}</label>
            <div class="w-[80%]">
              <el-select v-model="feePaymentPeriod" @change="callApiDetailAccountingEntry" placeholder="Kỳ thanh toán phí thuê">
              <el-option
                v-for="item in optionAcountingEntry"
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
          <el-table :data="tableRentalProducts" border style="width: 100%">
            <el-table-column label="STT" type="index" width="60" align="center" />
            <el-table-column prop="productName" :label="t('formDemo.commodityName')" width="270" />
            <el-table-column prop="quantity" :label="t('reuse.quantity')" width="80" />
            <el-table-column prop="hirePrice" :label="t('formDemo.rentalUnitPrice')">
              <template #default="props">
                <div class="text-right">{{ changeMoney.format(props.row.hirePrice) }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="totalPrice" :label="t('formDemo.rentalFee')" width="180">
              <template #default="props">
                <div class="text-right">
                  {{
                    props.row.totalPrice != ''
                      ? changeMoney.format(parseInt(props.row.totalPrice))
                      : '0 đ'
                  }}
                </div>
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
                totalRentalProduct != undefined ? changeMoney.format(totalRentalProduct) : '0 đ'
              }}</p>
              <p class="pr-2">đ</p>
              <p class="pr-2 text-black font-bold dark:text-white">{{
                totalRentalProduct != undefined ? changeMoney.format(totalRentalProduct) : '0 đ'
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
            <el-button @click="printPage('recpPaymentPrint')">{{ t('button.print') }}</el-button>
            <div>
              <span class="dialog-footer">
                <el-button
                  type="primary"
                  v-if="showCreatedOrUpdateButton"
                  @click="
                    () => {
                      dialogRentalPaymentInformation = false
                      updateOrderStransaction()
                    }
                  "
                  >
                  {{ t('formDemo.saveRecordDebts') }}
                  </el-button
                >
                <el-button
                  v-if="showCancelAcountingEntry"
                  type="danger"
                  @click="
                    () => {
                      UpdateStatusTransaction()
                      dialogRentalPaymentInformation = false
                    }
                  "
                > 
                  {{ t('formDemo.cancelAccountingEntry') }}
                </el-button>
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
:close-on-click-modal="doCloseOnClickModal"
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
                    : t('formDemo.byMonth')
                }}</div>
              </div>
              <div class="flex gap-4">
                <label class="w-[40%] text-right">{{ t('formDemo.rentalPeriod') }}</label>
                <div class="w-[60%] text-black dark:text-light-50"
                  >{{ dateTimeFormat(ruleForm.rentalPeriod[0]) }} đến
                  {{ dateTimeFormat(ruleForm.rentalPeriod[1]) }}</div>
              </div>
            </div>

            <div class="flex-1 flex gap-4">
              <span>
                <div class="text-right">{{ t('formDemo.qrCodePurchaseOrder') }}</div>
                <span class="text-yellow-400">{{ t('formDemo.paymentByApp') }}</span>
              </span>

              <span class="border"><Qrcode :width="100" :text="rentalOrderCode" /></span>
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
                  v-if="showCreatedOrUpdateButton"
                  type="primary"
                  @click="
                    () => {
                      updateInfoAcountingEntry(2)
                      dialogDepositSlip = false
                    }
                  "
                  >{{ t('formDemo.saveRecordDebts') }}</el-button>
                <el-button
                  v-if="showCancelAcountingEntry"
                  type="danger"
                  @click="
                    () => {
                      UpdateStatusTransaction()
                      dialogDepositSlip = false
                    }
                  "
                >                   
                  {{ t('formDemo.cancelAccountingEntry') }}
                </el-button>
                <el-button @click="dialogDepositSlip = false">{{ t('reuse.exit') }}</el-button>
              </span>
            </div>
          </div>
        </template>
      </el-dialog>

      <!-- Thông tin phiếu nhập kho trả hàng cho thuê -->
      <el-dialog
:close-on-click-modal="doCloseOnClickModal"
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
              <div class="w-[100%] text-black dark:text-light-50">{{ t('formDemo.byMonth') }}</div>
            </div>
            <div class="flex gap-4 items-center pb-4">
              <label class="w-[30%] text-right">{{ t('formDemo.rentalPeriod') }}</label>
              <div class="w-[60%] text-black dark:text-light-50"
                  >{{ dateTimeFormat(ruleForm.rentalPeriod[0]) }} đến
                  {{ dateTimeFormat(ruleForm.rentalPeriod[1]) }}</div>
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
              <span class="w-[100%]">{{ t('formDemo.aheadTimeReturns') }}</span>
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
          <el-table ref="singleTableRef" :data="tableChooseWarehouse" border style="width: 100%">
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
        v-if="dialogReturnAheadOfTime"
        :orderId="id"
        :orderData="rentReturnOrder"
        :detailExpand="detailExpand"
        :listProductsTable="getListProduct"
        :statusApproval="arrayStatusOrder[arrayStatusOrder.length - 1]?.orderStatus"
        :dateApproval="arrayStatusOrder[arrayStatusOrder.length - 1]?.approvedAt"
        :doneExpand="doneExpand"
        @done-payment-request="doneReturnGoods"
        :cancelExpend="cancelExpend"
        @cancel-expend="cancelExpendReturn"
        @add-row="addRow"
        @remove-row="removeRow"
        @post-return-request="postReturnRequest"
        @update-status="updateStatusReturnAheadOfTime"
        :orderStatusType="3"
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
        :orderStatusType="4"
        :type="2"
      />

      <!-- Gia hạn thuê -->
      <LeaseExtension
        v-model="dialogLeaseExtension"
        v-if="listOfOrderProduct"
        :orderId="id"
        :orderData="rentReturnOrder"
        :listProductsTable="getListProduct"
        @post-return-request="postReturnRequest"
        :orderStatusType="2"
        :type="2"
      />

      <!-- Dialog Địa chỉ nhận hàng -->
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
              <div class="text-sm text-[#303133] font-medium pb-4 pl-4 dark:text-[#fff]">
                <el-divider content-position="left">{{
                  t('formDemo.orderInformation')
                }}</el-divider>
              </div>
              <el-form-item :label="t('formDemo.orderCode')" prop="orderCode">
                <el-input :disabled="true" style="width: 100%" v-model="ruleForm.orderCode" />
              </el-form-item>
              <el-form-item :label="t('formDemo.leaseTerm')">
                <el-select
                  v-model="ruleForm.leaseTerm"
                  :disabled="disabledEdit"
                  @change="recalculatePrice"
                  placeholder="Select"
                  clearable
                >
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
                  :disabled="disabledEdit"
                  type="daterange"
                  unlink-panels
                  @change="changeDateRange"
                  @calendar-change="changeDateRanges"
                  :start-placeholder="t('formDemo.startDay')"
                  :end-placeholder="t('formDemo.endDay')"
                  format="DD/MM/YYYY"
                  :disabled-date="disabledDate"
                />
              </el-form-item>
              <el-form-item :label="t('formDemo.rentalPaymentPeriod')" prop="rentalPaymentPeriod">
                <div class="flex gap-2">
                  <el-select v-model="ruleForm.rentalPaymentPeriod" :disabled="checkDisabled">
                    <el-option
                      v-for="item in optionsRentalPaymentPeriod"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                  <el-select
                    v-if="ruleForm.rentalPaymentPeriod == 3"
                    :disabled="checkDisabled"
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
                    v-if="ruleForm.rentalPaymentPeriod == 4"
                    :disabled="checkDisabled"
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
                  <el-form-item prop="discount" label-width="0">
                    <div class="flex items-center">
                      <el-input
                        :disabled="checkDisabled"
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
                <el-input
                  v-model="ruleForm.orderNotes"
                  :disabled="checkDisabled"
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
                <div class="text-right text-[#FECB80] italic">{{ t('formDemo.lessThanTenProfiles') }}</div>
              </div>
              <div class="pl-4">
                <UploadMultipleImages v-model="Files" :disabled="disabledEdit" />
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
                          <el-button :disabled="checkDisabled" @click="dialogAddQuick = true"
                            >+ {{ t('button.add') }}</el-button
                          >
                        </div>
                      </div>
                    </el-form-item>
                  </div>
                </div>
                <div class="flex-1">
                  <el-form-item class="fix-err" label-width="0" prop="warehouse">
                    <div class="flex w-[100%] max-h-[42px] gap-2 items-center">
                      <label class="w-[170px] text-[#828387] text-right">{{
                        t('formDemo.selectExportWarehouse')
                      }}</label>
                      <div class="flex w-[80%] gap-4">
                        <el-select
                          :disabled="disabledEdit"
                          v-model="ruleForm.warehouse"
                          class="fix-full-width"
                          :placeholder="t('formDemo.choseDeliveryMethod')"
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
                      {{t('formDemo.taxCode')}}: {{ infoCompany.taxCode }}</div
                    >
                    <div>{{t('reuse.phoneNumber')}}: {{ infoCompany.phone }}</div>
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
              <div class="ml-2">{{t('formDemo.appliesToOrdersFrom')}} {{ promoMin }}</div>
            </div>
            <div class="flex flex-1 justify-center">{{t('formDemo.expired')}} {{ promoDate }}</div>
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
                <div>{{t('formDemo.appliesToOrdersFrom')}} {{ props.row.min }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="toDate" width="180" align="left">
              <template #default="props">
                <div>{{t('formDemo.expired')}} {{ props.row.toDate }}</div>
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
            <el-button class="w-[150px]" @click="openDialogChooseWarehouse = false">{{
              t('reuse.exit')
            }}</el-button>
          </span>
        </template>
      </el-dialog>

      <!-- Bút toán bổ sung -->
      <el-dialog
:close-on-click-modal="doCloseOnClickModal"
        v-model="dialogAccountingEntryAdditional"
        :title="t('formDemo.accountingEntryAdditional')"
        width="50%"
        align-center
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
                rentalOrderCode
              }}</div>
            </div>
            <div class="flex-1 flex items-start gap-4">
              <span>
                <div>{{ t('formDemo.qrCodePurchaseOrder') }}</div>
              </span>

              <span class="border"><Qrcode :width="100" :text="rentalOrderCode" /></span>
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
            <el-table-column prop="typeOfMoney" :label="t('formDemo.kindOfMoney')" width="150">
              <template #default="props">
                <el-select v-model="props.row.typeOfMoney" class="m-2">
                  <el-option
                    v-for="item in optionsKindOfMoney"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
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
              <p class="text-black font-bold dark:text-white">{{t('reuse.totalPayment')}}</p>
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
          <div class="float-right pb-10">
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
                >{{ t('formDemo.saveRecordDebts') }}</el-button>
                <el-button
                  type="danger"
                  size="large"
                  v-if="showCancelAcountingEntry"
                  @click="
                    () => {
                      UpdateStatusTransaction()
                      dialogAccountingEntryAdditional = false
                    }
                  "
                > 
                  Hủy bút toán
                </el-button>
              <el-button size="large" @click="dialogAccountingEntryAdditional = false">{{
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
            width="180"
          >
            <template #default="props">
              <MultipleOptionsBox
                :fields="[
                  t('reuse.productCode'),
                  t('reuse.managementCode'),
                  t('formDemo.productInformation'),
                  t('reuse.inventory'),
                ]"
                filterable
                :disabled="disabledEdit"
                :items="listProductsTable"
                valueKey="productPropertyId"
                labelKey="value"
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
              {{ scope.row.fromDate ? dateTimeFormat(scope.row.fromDate) : '' }}
            </template>
          </el-table-column>
          <el-table-column prop="toDate" :label="t('formDemo.rentalEndDate')" width="120">
            <template #default="scope">
              {{ scope.row.fromDate ? dateTimeFormat(scope.row.toDate) : '' }}
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
                :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                :clearable="true"
              />
            </template>
          </el-table-column>
          <el-table-column prop="unitName" :label="t('reuse.dram')" width="100" />
          <el-table-column prop="hirePrice" :label="t('formDemo.rentalUnitPrice')" width="180">
            <template #default="props">
              <CurrencyInputComponent
                v-model="props.row.hirePrice"
                :disabled="disabledEdit"
                v-if="type != 'detail'"
                @change="() => changePriceRowTable(props, false)"
              />
              <div v-else>{{
                props.row.hirePrice != ''
                  ? changeMoney.format(parseInt(props.row.hirePrice))
                  : '0 đ'
              }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="totalPrice" :label="t('formDemo.rentalFee')" width="180">
            <template #default="props">
              <div class="text-right">
                {{
                  props.row.totalPrice != ''
                    ? changeMoney.format(parseInt(props.row.totalPrice))
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
              <CurrencyInputComponent
                v-model="props.row.depositePrice"
                :disabled="disabledEdit"
                v-if="type != 'detail'"
                @change="() => changePriceRowTable(props, false)"
              />
              <div v-else>{{
                props.row.depositePrice != ''
                  ? changeMoney.format(parseInt(props.row.depositePrice))
                  : '0 đ'
              }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="c" :label="t('reuse.inventory')" width="200">
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
                  <span v-if="props.row.warehouseTotal != 0" class="text-blue-500">
                    {{ props.row.warehouseTotal }}
                  </span>
                  <span v-else class="text-yellow-500">{{t('reuse.outOfStock')}}</span>
                </el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="t('formDemo.manipulation')" align="center" width="90">
            <template #default="scope">
              <el-button
                :disabled="disabledDeleteRow"
                @click="removeTableData(scope.$index)"
                type="danger"
                >{{ t('reuse.delete') }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-button v-if="type == 'add' || type == ':type'" class="ml-4 mt-4" @click="addLastIndexSellTable"
          >+ {{ t('formDemo.add') }}</el-button
        >
        <div class="flex justify-end pt-4">
          <div class="w-50">
            <div class="dark:text-[#fff]">{{ t('formDemo.rentalFee') }}</div>
            <div class="text-blue-500 cursor-pointer">
              <el-button
                :disabled="disabledEdit"
                text
                @click="openDialogChoosePromotion = true"
                style="padding: 0"
              >
                <span class="text-blue-500"> + {{ t('formDemo.choosePromotion') }}</span>
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
              <div v-if="showPromo">
                {{promoValue == 0 ? changeMoney.format(promoCash) : `${promoValue} %`}}
              </div>
              <div v-else class="text-transparent :dark:text-transparent">s</div>
            </div>
            <!-- Tạm thời bỏ VAT 21/02/2023 -->
            <!-- <div v-if="VAT" class="text-right dark:text-[#fff]">
              {{VAT ? (totalPriceOrder * parseInt(valueVAT)) / 100 : ''}}
            </div>
            <div v-else class="text-transparent :dark:text-transparent">s</div> -->
            <div class="text-right dark:text-[#fff]">
              {{totalFinalOrder != undefined ? changeMoney.format(totalFinalOrder) : '0 đ'}}
            </div>
            <div class="text-right dark:text-[#fff]">
              {{totalDeposit != undefined ? changeMoney.format(totalDeposit) : '0 đ'}}
            </div>
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
          <div class="w-[11%] text-right pr-8">{{ t('formDemo.orderStatus') }}</div>
          <div class="w-[89%]">
            <div class="flex items-center w-[100%] flex-wrap">
              <div
                class="duplicate-status"
                v-for="item in arrayStatusOrder"
                :key="item.orderStatus"
              >
              <div
                  v-if="
                    item.orderStatus == STATUS_ORDER_RENTAL[3].orderStatus ||
                    item.orderStatus == STATUS_ORDER_RENTAL[7].orderStatus ||
                    item.orderStatus == STATUS_ORDER_RENTAL[1].orderStatus ||
                    item.orderStatus == STATUS_ORDER_RENTAL[4].orderStatus ||
                    item.orderStatus == STATUS_ORDER_RENTAL[11].orderStatus
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
                    item.orderStatus == STATUS_ORDER_RENTAL[2].orderStatus ||
                    item.orderStatus == STATUS_ORDER_RENTAL[5].orderStatus ||
                    item.orderStatus == STATUS_ORDER_RENTAL[6].orderStatus
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
                <div v-else-if="item.orderStatus == STATUS_ORDER_RENTAL[10].orderStatus">
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
                <div
                  v-else-if="
                    item.orderStatus == STATUS_ORDER_RENTAL[8].orderStatus ||
                    item.orderStatus == STATUS_ORDER_RENTAL[9].orderStatus ||
                    item.orderStatus == STATUS_ORDER_RENTAL[0].orderStatus
                  "
                >
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
              statusOrder == STATUS_ORDER_RENTAL[2].orderStatus &&
              !priceChangeOrders &&
              type == 'add' ||
              statusOrder == STATUS_ORDER_RENTAL[2].orderStatus &&
              !priceChangeOrders &&
              type == ':type'
            "
            class="w-[100%] flex ml-1 gap-4"
          >
            <el-button
              :disabled="doubleDisabled || disabledPhieu"
              @click="openDetailRentalPaymentBill"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.rentalFeePaymentSlip') }}</el-button
            >
            <el-button
              @click="openDepositDialog"
              :disabled="doubleDisabled || disabledPhieu"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.depositSlip') }}</el-button
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
              >{{ t('formDemo.startRentingTerm') }}</el-button
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
            v-if="
              statusOrder == STATUS_ORDER_RENTAL[1].orderStatus &&
              priceChangeOrders &&
              type == 'add' || 
              statusOrder == STATUS_ORDER_RENTAL[1].orderStatus &&
              priceChangeOrders &&
              type == ':type'
            "
            class="w-[100%] flex ml-1 gap-4"
          >
            <el-button
              :disabled="doubleDisabled"
              @click="openDetailRentalPaymentBill"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.rentalFeePaymentSlip') }}</el-button
            >
            <el-button
              @click="openDepositDialog"
              :disabled="doubleDisabled"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.depositSlip') }}</el-button
            >
            <el-button
              :disabled="statusButtonDetail"
              @click="
                () => {
                  submitForm(ruleFormRef, ruleFormRef2, false)
                }
              "
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
            v-else-if="statusOrder == STATUS_ORDER_RENTAL[1].orderStatus && !duplicateStatusButton"
            class="w-[100%] flex ml-1 gap-4"
          >
            <el-button
              @click="updateStatusOrders(STATUS_ORDER_RENTAL[0].orderStatus, id)"
              :disabled="statusButtonDetail"
              type="danger"
              class="min-w-42 min-h-11"
              >{{ t('button.cancelOrder') }}</el-button
            >
          </div>
          <!-- Không thay đổi giá -->
          <div
            v-else-if="
              statusOrder == STATUS_ORDER_RENTAL[2].orderStatus &&
              duplicateStatusButton &&
              buttonDuplicate
            "
            class="w-[100%] flex ml-1 gap-4"
          >
            <el-button
              :disabled="doubleDisabled"
              @click="openDetailRentalPaymentBill"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.rentalFeePaymentSlip') }}</el-button
            >
            <el-button
              @click="openDepositDialog"
              :disabled="doubleDisabled"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.depositSlip') }}</el-button
            >
            <el-button
              :disabled="statusButtonDetail"
              @click="orderCompletion(id)"
              type="primary"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.startRentingTerm') }}</el-button
            >
            <el-button
              @click="editOrder"
              :disabled="statusButtonDetail"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.editOrder') }}</el-button
            >
            <el-button
              @click="updateStatusOrders(STATUS_ORDER_RENTAL[0].orderStatus, id)"
              :disabled="statusButtonDetail"
              type="danger"
              class="min-w-42 min-h-11"
              >{{ t('button.cancelOrder') }}</el-button
            >
          </div>

          <div
            v-if="
              statusOrder == STATUS_ORDER_RENTAL[2].orderStatus &&
              type == 'edit' &&
              !buttonDuplicate
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
                  statusOrder = STATUS_ORDER_RENTAL[2].orderStatus
                  buttonDuplicate = !buttonDuplicate
                }
              "
              :disabled="statusButtonDetail"
              type="danger"
              class="min-w-42 min-h-11"
              >{{ t('button.cancel') }}</el-button
            >
          </div>
          <div
          v-else-if="statusOrder == STATUS_ORDER_RENTAL[5].orderStatus || (statusOrder == STATUS_ORDER_RENTAL[4].orderStatus && isPartialReturn && duplicateStatusButton) || statusOrder == 400"
            class="w-[100%] flex ml-1 gap-4"
          >
            <el-button
              :disabled="doubleDisabled"
              @click="openDetailRentalPaymentBill"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.rentalFeePaymentSlip') }}</el-button
            >
            <el-button
              @click="openDepositDialog"
              :disabled="doubleDisabled"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.depositSlip') }}</el-button
            >
            <el-tooltip :disabled="!unref(orderUtility.disableStatusWarehouse)">
              <template #content>
                <span>{{t('reuse.orderStillInWarehouse')}}</span>
              </template>
              <div>
            <el-button
              :disabled="statusButtonDetail || unref(orderUtility.disableStatusWarehouse)"
              @click="openDialogReturnAheadOfTime"
              class="min-w-42 min-h-11 bg-[#FFF0D9] text-[#FD9800] rounded font-bold"
              >{{ t('formDemo.durationPrepayment') }}</el-button
            >
          </div>
            </el-tooltip>
          </div>
          <div
            v-else-if="statusOrder == STATUS_ORDER_RENTAL[4].orderStatus && !duplicateStatusButton"
            class="w-[100%] flex ml-1 gap-4"
          >
            <el-button
              @click="() => {
                getReturnRequestTable()                  
                openDialogCancelReturn()
              }"
              :disabled="statusButtonDetail"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.cancelReturns') }}</el-button
            >
          </div>
          <div
            v-else-if="statusOrder == STATUS_ORDER_RENTAL[4].orderStatus && duplicateStatusButton"
            class="w-[100%] flex ml-1 gap-4"
          >
            <button
              :disabled="statusButtonDetail"
              @click="
                () => {
                  getReturnRequestTable()                  
                  openDialogReturnAheadTime()
                }
              "
              class="min-w-42 min-h-11 bg-[#FFF0D9] text-[#FD9800] rounded font-bold"
              >{{ t('formDemo.completePayment') }}</button
            >
            <el-button
              @click="() => {
                getReturnRequestTable()                  
                openDialogCancelReturn()
              }"
              :disabled="statusButtonDetail"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.cancelReturns') }}</el-button
            >
          </div>
          <div v-else-if="statusOrder == STATUS_ORDER_RENTAL[7].orderStatus || statusOrder == STATUS_ORDER_RENTAL[11].orderStatus" class="w-[100%] flex ml-1 gap-4">
            <el-button
              :disabled="doubleDisabled"
              @click="openDetailRentalPaymentBill"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.rentalFeePaymentSlip') }}</el-button
            >
            <el-button
              @click="openDepositDialog"
              :disabled="doubleDisabled"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.depositSlip') }}</el-button
            >
            <el-tooltip :disabled="!unref(orderUtility.disableStatusWarehouse)">
              <template #content>
                <span>{{t('reuse.orderStillInWarehouse')}}</span>
              </template>
              <div>
            <el-button
              :disabled="statusButtonDetail || unref(orderUtility.disableStatusWarehouse)"
              @click="updateStatusOrders(STATUS_ORDER_RENTAL[10].orderStatus, id)"
              class="min-w-42 min-h-11 bg-[#D9D9D9] rounded font-bold"
              >{{ t('formDemo.checkFinish') }}</el-button
            >
            </div>
            </el-tooltip>
          </div>
          <div
            v-else-if="statusOrder == STATUS_ORDER_RENTAL[8].orderStatus"
            class="w-[100%] flex ml-1 gap-4"
          >
            <el-button
              :disabled="doubleDisabled"
              @click="openDetailRentalPaymentBill"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.rentalFeePaymentSlip') }}</el-button
            >
            <el-button
              @click="openDepositDialog"
              :disabled="doubleDisabled"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.depositSlip') }}</el-button
            >
            <el-tooltip :disabled="!unref(orderUtility.disableStatusWarehouse)">
              <template #content>
                <span>{{t('reuse.orderStillInWarehouse')}}</span>
              </template>
              <div>
            <el-button
              :disabled="statusButtonDetail || unref(orderUtility.disableStatusWarehouse)"
              @click="openDialogReturnAheadOfTime"
              class="min-w-42 min-h-11 bg-[#FFF0D9] text-[#FD9800] rounded font-bold"
              >{{ t('formDemo.aheadTimeReturns') }}</el-button
            >
          </div>
            </el-tooltip>
          </div>
          <div
            v-else-if="
              statusOrder == STATUS_ORDER_RENTAL[9].orderStatus ||
              statusOrder == STATUS_ORDER_RENTAL[6].orderStatus ||
              statusOrder == 400
            "
            class="w-[100%] flex ml-1 gap-4"
          >
            <el-button
              :disabled="doubleDisabled"
              @click="openDetailRentalPaymentBill"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.rentalFeePaymentSlip') }}</el-button
            >
            <el-button
              @click="openDepositDialog"
              :disabled="doubleDisabled"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.depositSlip') }}</el-button
            >
            <button
              :disabled="statusButtonDetail"
              @click="openDialogLeaseExtension"
              class="min-w-42 min-h-11 border-1 border-red-500 text-red-500 rounded font-bold"
              >{{ t('formDemo.leaseExtension') }}</button
            >
            <el-tooltip :disabled="!unref(orderUtility.disableStatusWarehouse)">
              <template #content>
                <span>{{t('reuse.orderStillInWarehouse')}}</span>
              </template>
              <div>
            <el-button
              :disabled="statusButtonDetail || unref(orderUtility.disableStatusWarehouse)"
              @click="
                () => {
                  setDataForReturnOrder()
                  dialogReturnExpired = !dialogReturnExpired
                }
              "
              class="min-w-42 min-h-11 bg-[#FFF0D9] text-[#FD9800] rounded font-bold"
              >{{ t('formDemo.returnsExpired') }}</el-button
            >
          </div>
            </el-tooltip>
          </div>
          <div v-else-if="statusOrder == 200" class="w-[100%] flex ml-1 gap-4">
            <button
              :disabled="statusButtonDetail"
              @click="approvalFunction(true)"
              class="min-w-42 min-h-11 bg-[#FFF0D9] text-[#FD9800] rounded font-bold"
              >{{t('router.approve')}}</button
            >
            <el-button
              @click="approvalFunction(false)"
              :disabled="statusButtonDetail"
              class="min-w-42 min-h-11"
              >{{t('router.notApproval')}}</el-button
            >
          </div>
        </div>
      </el-collapse-item>

      <el-collapse-item :name="collapse[2].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[2].icon" link />
          <span class="text-center text-xl">{{ collapse[2].title }}</span>
        </template>
        <el-button @click="openDialogAdditional" text>+ {{ t('reuse.addAccountingEntry') }}</el-button>
        <el-button
          :disabled="disabledPTAccountingEntry"
          @click="
            () => {
              clearData()
              getReceiptCode()
              dialogInformationReceipts = true
            }
          "
          text
          >+ {{ t('reuse.addReceiptBill') }}</el-button
        >
        <el-button
          :disabled="disabledPCAccountingEntry"
          @click="
            () => {
              clearData()
              getcodeExpenditures()
              dialogPaymentVoucher = true
            }
          "
          text
          >+ {{ t('reuse.addPaymentBill') }}</el-button
        >
        <el-button
          :disabled="disabledDNTTAccountingEntry"
          @click="
            () => {
              newCodePaymentRequest()
              clearData()
              dialogIPRForm = true
            }
          "
          text
          >+ {{ t('reuse.addPaymentRequestBill') }}</el-button
        >
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
              {{ dateTimeFormat(data.row.createdAt) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="content"
            :label="t('formDemo.certificateInformation')"
            width="240"
          />
          <el-table-column
            prop="receiptOrPaymentVoucherCode"
            :label="t('formDemo.receiptOrPayment')"
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
          <el-table-column prop="paymentRequestCode" :label="t('router.paymentProposal')">
            <template #default="props">
              <div
                @click="(index) => getDetailPaymentRequest(index, props)"
                class="text-blue-500"
                >{{ props.row.paymentRequestCode }}</div
              >
            </template>
          </el-table-column>
          <el-table-column prop="typeOfMoney" :label="t('formDemo.kindOfMoney')">
            <template #default="props">
              <div>{{ props.row.typeOfMoney }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="receiveMoney" :label="t('formDemo.collected')"/>
          <el-table-column prop="paidMoney" :label="t('formDemo.spent')"/>
          <el-table-column
            prop="deibt"
            width="140"
            :label="t('formDemo.rentalFeeDebt')"
            align="right"
          >
            <template #default="data">
              {{ changeMoney.format(data.row.deibt) ?? '0 đ' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="typeOfPayment"
            :label="t('formDemo.receivableOrPayable')"
            width="100"
          >
            <template #default="props">
              <div v-if="props.row.typeOfPayment == 1" class="text-blue-500"> {{ t('reuse.haveToCollect') }} </div>
              <div v-else-if="props.row.typeOfPayment == 0" class="text-red-500"> {{ t('reuse.havetoPay') }} </div>
            </template>
          </el-table-column>
          <el-table-column :label="t('formDemo.choosePayment')" prop="payment" width="180">
            <template #default="props">
              <div>{{ props.row.payment }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="isReceiptedMoney"
            :label="t('formDemo.alreadyPaidForTt')"
            align="center"
            width="90"
          >
            <template #default="scope">
              <el-checkbox :disabled="true" v-model="scope.row.isReceiptedMoney" />
            </template>
          </el-table-column>
          <el-table-column
            :label="t('formDemo.statusAccountingEntry')"
            prop="status"
            min-width="120"
          >
            <template #default="props">
              {{ props.row.status == 1 ? 'Đã ghi sổ' : 'Đã hủy'}}
            </template>
          </el-table-column>
          <el-table-column :label="t('formDemo.manipulation')" width="120" align="center">
            <template #default="data">
              <div class="flex">
                <button
                  @click="() => openDialogAcountingEntry(data)"
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
              prop="warehouseTicketCode"
              :label="t('formDemo.invoiceForGoodsEnteringTheWarehouse')"
              width="180"
            >
              <template #default="props">
                <div
                  @click="dialogWarehouseRentalPayment = true"
                  class="text-blue-500 cursor-pointer"
                  >{{ props.row.warehouseTicketCode }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="warehouseTicketStatusName"
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

::v-deep(.el-range-editor.el-input__wrapper) {
  width: 100%;
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

::v-deep(.handle-fix > .el-input > .el-input__wrapper > .el-input__inner) {
  text-align: right;
}

::v-deep(.fix-err > .el-form-item__content > .el-form-item__error) {
  margin-left: 178px;
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
