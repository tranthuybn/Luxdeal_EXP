<script setup lang="ts">
import { onBeforeMount, reactive, ref, unref, watch } from 'vue'
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
  ElRadio,
  ElTableColumn,
  ElInput,
  ElDialog,
  ElRadioGroup,
  ElDatePicker,
  FormRules,
  ElForm,
  ElTreeSelect,
  ElFormItem,
  FormInstance,
  UploadUserFile,
  ElNotification,
  ElMessage,
  UploadProps
} from 'element-plus'
import MultipleOptionsBox from '@/components/MultipleOptionsBox.vue'
import { appModules } from '@/config/app'

import billLoanConfirmation from '../../Components/formPrint/src/billLoanConfirmation.vue'
import type { UploadFile } from 'element-plus'
import { dateTimeFormat, formatOrderReturnReason, postDateTime } from '@/utils/format'
import ReturnOrder from './ReturnOrder.vue'
import { FORM_IMAGES } from '@/utils/format'
import Qrcode from '@/components/Qrcode/src/Qrcode.vue'

import ProductAttribute from '../../ProductsAndServices/ProductLibrary/ProductAttribute.vue'
import {
  getProductsList,
  getCollaboratorsInOrderList,
  getAllCustomer,
  getCustomerById,
  addNewOrderList,
  getOrderList,
  getOrderTransaction,
  createQuickProduct,
  getproductId,
  getCheckProduct,
  getCodePaymentRequest,
  addDNTT,
  addTPV,
  getReceiptPaymentVoucher,
  getDetailReceiptPaymentVoucher,
  addOrderStransaction,
  createReturnRequest,
  getReturnRequest,
  addQuickCustomer,
  getDetailAccountingEntryById,
  GetProductPropertyInventory,
  getListWareHouse,
  updateStatusOrder,
  updateOrderInfo,
  approvalOrder,
  GetPaymentRequestDetail,
  cancelOrder,
  finishStatusOrder,
  updateOrderTransaction,
  postAutomaticWarehouse
} from '@/api/Business'
import { useIcon } from '@/hooks/web/useIcon'
import { Collapse } from '../../Components/Type'
import moment from 'moment'
import { useRoute, useRouter } from 'vue-router'
import { PRODUCTS_AND_SERVICES, STATUS_ORDER_PAWN } from '@/utils/API.Variables'
import CurrencyInputComponent from '@/components/CurrencyInputComponent.vue'

import { getCategories } from '@/api/LibraryAndSetting'
const { t } = useI18n()
const { utility } = appModules

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

const changeMoney = new Intl.NumberFormat('vi', {
  style: 'currency',
  currency: 'vnd',
  minimumFractionDigits: 0
})

const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })
const percentIcon = useIcon({ icon: 'material-symbols:percent' })
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
    name: 'consignmentReturnHistoryForCustomers',
    title: t('reuse.internalPawnReturnAndRetentionHistoryForCustomers'),
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
const router = useRouter()
const route = useRoute()

const id = Number(router.currentRoute.value.params.id)
const tab = String(router.currentRoute.value.params.tab)
const approvalId = String(route.params.approvalId)

const type = String(route.params.type)

interface ListOfProductsForSaleType {
  name: string
  productCode: string
  productName: string
  productPropertyCode: string
  productPropertyName: string
  id: string
  productPropertyId: string | number | any
  spaServices: string
  warehouseTotal?: number | any
  amountSpa: number
  quantity: string
  businessSetup: string
  businessSetupName: string
  accessory: string | undefined
  code: string | undefined
  description: string | undefined
  warehouseInfo: {}
  unitName: string
  unitPrice: string | number | undefined
  interestMoney: string | number | undefined
  TotalPrice: number
  price: string | number | undefined
  finalPrice: string
  paymentType: string
  edited: boolean
  warehouseId: number | undefined
  warehouseName: string
}

const productForSale = reactive<ListOfProductsForSaleType>({
  name: '',
  productCode: '',
  productName: '',
  productPropertyCode: '',
  productPropertyName: '',
  id: '',
  spaServices: '',
  amountSpa: 2,
  productPropertyId: undefined,
  quantity: '1',
  accessory: '',
  code: '',
  description: '',
  businessSetup: '',
  businessSetupName: '',
  warehouseInfo: {},
  unitName: '',
  unitPrice: 0,
  interestMoney: 0,
  TotalPrice: 0,
  price: '',
  finalPrice: '',
  paymentType: '',
  edited: true,
  warehouseId: undefined,
  warehouseName: ''
})

let ListOfProductsForSale = ref<Array<ListOfProductsForSaleType>>([])

const addLastIndexSellTable = () => {
  ListOfProductsForSale.value.push({ ...productForSale })
}

let tablePawnSlip = ref<any[]>([{}])
// const tableData = ref<Array<ListOfProductsForSaleType>>([])

// debtTable
interface tableDataType {
  [x: string]: any
  id: number
  createdAt: string | Date
  content: string
  receiptOrPaymentVoucherId: number | undefined
  paymentRequestId: string | undefined
  moneyType: number
  receiveMoney: string
  paidMoney: string
  debt: string
  typeOfPayment: string | number
  paymentMethods: number
  status: number
  alreadyPaidForTt: boolean
  statusAccountingEntry: string
}

let debtTable = ref<Array<tableDataType>>([])

const forceRemove = ref(false)

//add row to the end of table if fill all table
watch(
  () => ListOfProductsForSale.value[ListOfProductsForSale.value.length - 1],
  () => {
    if (
      ListOfProductsForSale.value[ListOfProductsForSale.value.length - 1].productPropertyId &&
      forceRemove.value == false &&
      type !== 'detail'
    ) {
      addLastIndexSellTable()
    }
  },
  { deep: true }
)
// total order
let totalOrder = ref(0)
let dataEdit = ref()

const removeListProductsSale = (index) => {
  if (!ListOfProductsForSale[ListOfProductsForSale.value.length - 1]) {
    ListOfProductsForSale.value.splice(index, 1)
  }
}

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

// Call api danh sách khách hàng
const optionsCustomerApi = ref<Array<any>>([])
const callCustomersApi = async () => {
  const res = await getAllCustomer({ PageIndex: 1, PageSize: 30 })
  const getCustomerResult = res.data
  if (Array.isArray(unref(getCustomerResult)) && getCustomerResult?.length > 0) {
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

const valueMoneyAccoungtingEntry = ref(0)

const autoChangeMoneyAccountingEntry = (_val, scope) => {
  valueMoneyAccoungtingEntry.value = 0
  const data = scope.row
  data.intoMoney = Math.abs(parseInt(data.spent) - parseInt(data.collected))

  tableAccountingEntry.value.map((val) => {
    if (val.intoMoney) valueMoneyAccoungtingEntry.value += val.intoMoney
  })
}

const addQuickCustomerName = ref()
const quickTaxCode = ref()
const quickRepresentative = ref()
const quickPhoneNumber = ref()
const quickEmail = ref()

let customerAddress = ref('')

let infoCompany = reactive({
  name: '',
  taxCode: '',
  phone: '',
  email: ''
})

const chooseDelivery = [
  {
    value: 1,
    label: t('reuse.receivePawnGoodsAtCounter')
  }
]

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
}

// Call api danh sách cộng tác viên
const pageIndexCollaborator = ref(1)

const optionsCollaborators = ref()
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

let objIdPayment = ref()
let idPayment = ref()
// Thêm mới phiếu đề nghị thanh toán
const postPaymentRequest = async () => {
  const payload = {
    Code: codePaymentRequest.value,
    TotalMoney: 121325,
    PaymentType: 0,
    PeopleId: 2,
    status: 0,
    PeopleType: 1,
    OrderId: 117,
    Description: '',
    Document: undefined,
    AccountingEntryId: undefined
  }
  const formDataPayLoad = FORM_IMAGES(payload)
  objIdPayment.value = await addDNTT(formDataPayLoad)
  idPayment.value = objIdPayment.value.paymentRequestId
}
//thêm nahnh sp

const quickProductCode = ref()
const quickManagementCode = `SP${Date.now()}`
const quickProductName = ref()
const quickDescription = ref()
const productCharacteristics = ref()
const chooseOrigin = ref()

const dialogAddProduct = ref(false)
const addnewproduct = () => {
  dialogAddProduct.value = true
}
//end thêm nhanh sp
const postQuickCustomer = async () => {
  const payload = {
    serviceType: 1,
    productCode: quickProductCode.value,
    productPropertyCode: quickManagementCode,
    name: quickProductName.value,
    shortDescription: quickDescription.value,
    productTypeId: 9,
    brandId: 49,
    originId: 123,
    unitId: 121,
    categories: [
      {
        id: 0
      }
    ]
  }
  await createQuickProduct(payload)
}

const dialogAddQuick = ref(false)
const historyTable = ref<Array<any>>([])

const input = ref('')

const tableReturnFullyIntegrated = ref<Array<historyTableType>>([])
if (tableReturnFullyIntegrated.value.length == 0)
  tableReturnFullyIntegrated.value.push({
    createdAt: '',
    productPropertyId: '',
    productPropertyName: '',
    accessory: '0',
    conditionProducts: '',
    quantity: '1',
    unit: '',
    refundUnitPrice: 0,
    intoUnitPrice: 0,
    invoiceGoodsEnteringWarehouse: 0,
    inventoryStatus: ''
  })

interface historyTableType {
  createdAt: string
  productPropertyId: string
  productPropertyName: string | undefined
  accessory?: string
  conditionProducts?: string
  quantity: string
  unit?: string
  refundUnitPrice?: number
  intoUnitPrice?: number
  invoiceGoodsEnteringWarehouse?: number
  inventoryStatus?: string
}

const pawnOrderCode = ref()

function printPage(id: string, { url, title, w, h }) {
  let stylesHtml = ''
  for (const node of [...document.querySelectorAll('link[rel="stylesheet"], style')]) {
    stylesHtml += node.outerHTML
  }
  const printContents = document.getElementById(id)?.innerHTML
  const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX
  const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY

  const width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth
    ? document.documentElement.clientWidth
    : screen.width
  const height = window.innerHeight
    ? window.innerHeight
    : document.documentElement.clientHeight
    ? document.documentElement.clientHeight
    : screen.height

  const systemZoom = width / window.screen.availWidth
  const left = (width - w) / 2 / systemZoom + dualScreenLeft
  const top = (height - h) / 2 / systemZoom + dualScreenTop
  const newWindow = window.open(
    url,
    title,
    `
				scrollbars=yes,
				width=${w / systemZoom},
				height=${h / systemZoom},
				top=${top},
				left=${left}      `
  )
  newWindow?.document.write(`<!DOCTYPE html>
                <html>
                  <head>
                    ${stylesHtml}
                  </head>
                  <body>
                    ${printContents}
                  </body>
                </html>`)

  newWindow?.document.close()
  newWindow?.focus()
  setTimeout(() => {
    newWindow?.print()
    newWindow?.close()
  }, 500)
}
const radioTracking = ref('2')

const newCodePaymentRequest = async () => {
  codePaymentRequest.value = await getCodePaymentRequest()
}

// Call api danh sách sản phẩm
const listProducts = ref()

const pageIndexProducts = ref(1)
const callAPIProduct = async () => {
  const res = await getProductsList({ PageIndex: pageIndexProducts.value, PageSize: 20,  ServiceType: 4, IsApprove: true })
  if (res.data && res.data?.length > 0) {
    listProducts.value = res.data.map((product) => ({
      productCode: product.code,
      value: product.productCode,
      name: product.name ?? '',
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
    : getProductsList({ PageIndex: pageIndexProducts.value, PageSize: 20 })
        .then((res) => {
          res.data.length == 0
            ? (noMoreProductData.value = true)
            : res.data.map((product) =>
                listProducts.value.push({
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

const duplicateProductMessage = () => {
  ElMessage.error('Sản phẩm đã được chọn, vui lòng tăng số lượng hoặc chọn sản phẩm khác')
}
const duplicateProduct = ref()

const getValueOfSelected = (_value, obj, scope) => {
  const data = scope.row

  duplicateProduct.value = undefined
  duplicateProduct.value = ListOfProductsForSale.value.find(
    (val) => val.productPropertyId == _value
  )
  if (duplicateProduct.value) {
    duplicateProductMessage()
  } else {
    data.productPropertyId = obj?.productPropertyId
    data.productCode = obj.value
    data.productName = obj.name
    data.unitName = obj.unit
    data.price = obj.price
    callApiWarehouse(scope)
  }
}

// disabled thêm mới phiếu thu chi, phiếu đề nghị thanh toán
const disabledPTAccountingEntry = ref(false)
const disabledPCAccountingEntry = ref(false)
const disabledDNTTAccountingEntry = ref(false)

// check disabled
const disabledEdit = ref(false)

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

let checkValidateForm = ref(false)
const submitForm = async (formEl: FormInstance | undefined, formEl2: FormInstance | undefined) => {
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
      postData()
      // doubleDisabled.value = false
    } else {
      ElMessage.error(t('reuse.notFillAllInformation'))
      checkValidateForm.value = false
    }
  })
}

const checkPercent = (_rule: any, value: any, callback: any) => {
  if (value === '') callback(new Error(t('formDemo.pleaseInputDiscount')))
  else if (/\s/g.test(value)) callback(new Error(t('reuse.notSpace')))
  else if (isNaN(value)) callback(new Error(t('reuse.numberFormat')))
  else if (value < 0) callback(new Error(t('reuse.positiveNumber')))
  else if (value < 0 || value > 100) callback(new Error(t('formDemo.validatePercentNum')))
  callback()
}

const dialogInformationReceipts = ref(false)
const dialogPaymentVoucher = ref(false)
const dialogIPRForm = ref(false)
const valueProvince = ref('')
const valueCommune = ref('')

const ruleFormRef = ref<FormInstance>()
const ruleFormRef2 = ref<FormInstance>()

const ruleForm = reactive({
  orderCode: '',
  collaborators: '',
  pawnTerm: '',
  paymentPeriod: 10,
  collaboratorCommission: '',
  orderNotes: '',
  customerName: '',
  delivery: 1,
  warehouse: '',
  orderFiles: []
})
const inputDeposit = ref(0)

const rules = reactive<FormRules>({
  orderCode: [{ required: true, message: t('formDemo.pleaseInputOrderCode'), trigger: 'blur' }],
  collaborators: [
    {
      required: true,
      message: t('formDemo.pleaseSelectCollaboratorCode'),
      trigger: 'change'
    }
  ],
  warehouse: [
    {
      required: true,
      message: t('formDemo.pleaseSelectWarehouse'),
      trigger: 'change'
    }
  ],
  collaboratorCommission: [
    {
      validator: checkPercent,
      trigger: 'blur'
    }
  ],
  paymentPeriod: [
    {
      required: true,
      message: t('common.required'),
      trigger: 'blur'
    }
  ],
  orderNotes: [{ required: true, message: t('formDemo.pleaseInputOrderNote'), trigger: 'blur' }],
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
const valueDistrict = ref('')

const enterdetailAddress = ref('')
const autoCollaboratorCommission = (index) => {
  optionsCollaborators.value.map((val) => {
    if (val.value == index) ruleForm.collaboratorCommission = val.collaboratorCommission
  })
}
const valueSelectCustomer = ref(t('formDemo.customer'))
const optionsCustomer = [
  {
    value: 'customer',
    label: t('formDemo.customer')
  }
]
let orderDetailsTable = reactive([{}])
const disableEditData = ref(false)
// tạo đơn hàng
const checkDisabled = ref(false)
let idOrderPost = ref()

const postData = async () => {
  orderDetailsTable = ListOfProductsForSale.value.map((val) => ({
    ProductPropertyId: parseInt(val.productPropertyId),
    Quantity: parseInt(val.quantity),
    ProductPrice: 0,
    UnitPrice: val.unitPrice,
    HirePrice: 0,
    DepositePrice: 0,
    InterestMoney: val.interestMoney,
    TotalPrice: 0,
    BusinessSetup: val.businessSetup,
    ConsignmentSellPrice: 0,
    ConsignmentHirePrice: 0,
    Accessory: val.accessory,
    Code: val.code,
    Description: val.description
  }))
  orderDetailsTable.pop()
  const productPayment = JSON.stringify([...orderDetailsTable])

  const payload = {
    ServiceType: 4,
    OrderCode: ruleForm.orderCode,
    PromotionCode: 'DEAL1212',
    CollaboratorId: ruleForm.collaborators,
    CollaboratorCommission: ruleForm.collaboratorCommission,
    Description: ruleForm.orderNotes,
    CustomerId: customerID.value,
    DeliveryOptionId: ruleForm.delivery,
    ProvinceId: valueProvince.value ?? 1,
    DistrictId: valueDistrict.value ?? 1,
    WardId: valueCommune.value ?? 1,
    Files: Files,
    Address: enterdetailAddress.value,
    OrderDetail: productPayment,
    fromDate: postDateTime(ruleForm.pawnTerm[0]),
    toDate: postDateTime(ruleForm.pawnTerm[1]),
    CampaignId: 2,
    VAT: 1,
    WarehouseId: ruleForm.warehouse,
    Days: ruleForm.paymentPeriod,
    TotalPrice: priceintoMoneyPawnGOC.value,
    DepositePrice: 0,
    DiscountMoney: 0,
    InterestMoney: priceintoMoneyByday.value,
    Status: 4
  }
  const formDataPayLoad = FORM_IMAGES(payload)
  const res = await addNewOrderList(formDataPayLoad)
  if (res) {
    ElNotification({
      message: t('reuse.addSuccess'),
      type: 'success'
    })
    router.push({
      name: 'business.order-management.order-list',
      params: { backRoute: String(router.currentRoute.value.name), tab: tab }
    })
  } else {
    ElNotification({
      message: t('reuse.addFail'),
      type: 'warning'
    })
  }
  idOrderPost.value = res
  automaticCouponWareHouse(1)
}

// Phiếu nhap kho tự động
const automaticCouponWareHouse = async (index) => {
  const payload = {
    OrderId: idOrderPost.value,
    Type: index
  }

  await postAutomaticWarehouse(JSON.stringify(payload))
}

const duplicateStatusButton = ref(false)
// load lại trạng thái đơn hàng
const reloadStatusOrder = async () => {
  const res = await getOrderList({ Id: id, ServiceType: 4 })

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

const approvalFunction = async () => {
  const payload = { ItemType: 2, Id: parseInt(approvalId), IsApprove: true }
  await approvalOrder(FORM_IMAGES(payload))
  push({
    name: `approve.orders-approval.orders-new`
  })
}

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

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.warning(
    `${t('reuse.limitUploadImages')}. ${t('reuse.imagesYouChoose')}: ${files.length}. ${t(
      'reuse.total'
    )}${files.length + uploadFiles.length}`
  )
}

const handleChangeQuickAddProduct = async (data) => {
  const dataSelectedObj = listProducts.value.find((product) => product.productPropertyId == data)

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
const handleTotal = (scope) => {
  scope.row.intoMoney = (parseInt(scope.row.quantity) * parseInt(scope.row.unitPrice)).toString()
}

const customerData = reactive({
  customerId: '',
  userName: '',
  code: '',
  address: '',
  cccd: '',
  phoneNumber: '',
  bank: ''
})
const getCustomerInfo = async (id: string) => {
  const res = await getCustomerById({ Id: id })
  const orderObj = { ...res?.data }
  customerData.userName = orderObj.name
  customerData.code = orderObj.code
  customerData.cccd = orderObj.cccd
  customerData.phoneNumber = orderObj.phonenumber
  customerData.bank = orderObj.bank
  customerData.address = orderObj.address
}

const productAttributeValue = (data) => {
  return data
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
let payment = ref(choosePayment[0].value)

const nameDialog = ref('')

const dialogFeePaymentSlip = ref(false)
function openDepositDialog() {
  alreadyPaidForTt.value = true
  dialogFeePaymentSlip.value = !dialogFeePaymentSlip.value
  tablePawnSlip.value = ListOfProductsForSale.value
  nameDialog.value = 'deposit'
}
const dialogPawnCouponInfomation = ref(false)
function openBillPawnDialog() {
  alreadyPaidForTt.value = true
  dialogPawnCouponInfomation.value = !dialogPawnCouponInfomation.value
  nameDialog.value = 'billPawn'
  tablePawnSlip.value = ListOfProductsForSale.value
}
// Tạo mới yêu cầu đổi trả
const postReturnRequest = async (reason) => {
  let tableReturnPost = [{}]
  if (rentReturnOrder.value.tableData.length < 2) {
    return
  }
  rentReturnOrder.value.tableData.pop()
  tableReturnPost = rentReturnOrder.value.tableData.map((e) => ({
    productPropertyId: Number(e.productPropertyId),
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
const extendDate = (date) => {
  rentReturnOrder.value.extendDate = date
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

// Dialog trả hàng trước hạn
const changeReturnGoods = ref(false)
const earlyEedemption = ref(false)
const dutHang = ref(false)
const giaHan = ref(false)

const getOrderStransactionList = async () => {
  const transaction = await getOrderTransaction({ id: id })
  debtTable.value = transaction.data
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

// Thêm mã phiếu đề nghị thanh toán vào debtTable
const handleChangePaymentRequest = () => {
  if (newTable.value?.length) {
    newTable.value.forEach((val) => {
      debtTable.value.forEach((e) => {
        if (e.content == val.content) {
          e.paymentRequestId = codePaymentRequest.value
        }
      })
    })
  }
}
const inputReasonReturn = ref('Hàng bị rách góc')
const tableAccountingEntry = ref([
  {
    content: 'Thu tiền gốc cầm đồ',
    kindOfMoney: '',
    collected: 0,
    spent: 0,
    intoMoney: 0
  }
])

var autoCodeReturnRequest = 'DT' + moment().format('hms')

let childrenTable = ref()
let objOrderStransaction = ref()
let idStransaction = ref()
// Thêm bút toán cho đơn hàng
const postOrderStransaction = async (index: number) => {
  childrenTable.value = ListOfProductsForSale.value.map((val) => ({
    merchadiseTobePayforId: parseInt(val.productPropertyId),
    quantity: parseInt(val.quantity)
  }))

  const payload = {
    orderId: id,
    content:
      index == 1
        ? t('formDemo.feePaymentSlip')
        : index == 2
        ? t('formDemo.billPawn')
        : tableAccountingEntry.value[0].content,
    paymentRequestId: null,
    receiptOrPaymentVoucherId: null,
    receiveMoney: 0,
    paidMoney: 0,
    deibt: 0,
    typeOfPayment: 0,
    paymentMethods: 1,
    status: 0,
    isReceiptedMoney: alreadyPaidForTt.value ? 0 : 1,
    typeOfMoney: 1,
    merchadiseTobePayfor: childrenTable.value
  }

  objOrderStransaction.value = await addOrderStransaction(payload)
  idStransaction.value = objOrderStransaction.value.paymentRequestId
  getOrderStransactionList()
}

// Lý do thu tiền
const inputReasonCollectMoney = ref()

let objidPT = ref()
let idPT = ref()
// Thêm mới phiếu thu
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
    AccountingEntryId: undefined,
    EnterMoney: enterMoney.value
  }
  const formDataPayLoad = FORM_IMAGES(payload)
  objidPT.value = await addTPV(formDataPayLoad)
  idPT.value = objidPT.value.receiptAndpaymentVoucherId
  handleChangeReceipts()
}

let objidPC = ref()
let idPC = ref()
// Thêm mới phiếu chi
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
    AccountingEntryId: undefined,
    EnterMoney: enterMoney.value
  }
  const formDataPayLoad = FORM_IMAGES(payload)
  objidPC.value = await addTPV(formDataPayLoad)
  idPC.value = objidPC.value.receiptAndpaymentVoucherId
  handleChangeReceipts()
}

const openDialogChooseWarehouse = ref(false)
const dialogbusinessManagement = ref(false)

const tableWarehouse = ref([])

const indexRowWarehouse = ref()
const totalProductInWarehouse = ref()
const totalWarehouse = ref()
// Lấy danh sách kho theo mã sản phẩm và sericeType
const callApiWarehouse = async (scope) => {
  const data = scope.row
  indexRowWarehouse.value = scope.$index

  const res = await GetProductPropertyInventory({
    ProductPropertyId: data.productPropertyId
  })
  tableWarehouse.value = res?.inventoryDetails.map((val) => ({
    warehouseCheckbox: val.id,
    name: val.name,
    inventory: val.inventory
  }))
  totalProductInWarehouse.value = res.total
  data.warehouseTotal = res.total
  totalWarehouse.value = res.total
}

const callApiWarehouseTotal = async (productPropertyId = 0) => {
  const getTotalPayload = {
    ProductPropertyId: productPropertyId
  }
  // lấy giá tiền của một sản phẩm
  const res = await GetProductPropertyInventory(getTotalPayload)
  const total = res?.total ?? 'Hết hàng'

  return total
}

const getTotalWarehouse = () => {
  ListOfProductsForSale.value.forEach(async (el) => {
    el.warehouseTotal = await callApiWarehouseTotal(parseInt(el.productPropertyId))
  })
}

const formBusuness = reactive({
  id: 1,
  check: '',
  applyExport: ''
})
const { push } = useRouter()
let changeButtonEdit = ref(false)
const changeEditInDetail = () => {
  if (type == 'detail') {
    push({
      name: `business.order-management.order-list.${utility}`,
      params: {
        backRoute: String(router.currentRoute.value.name),
        type: 'edit',
        tab: tab,
        id: id
        // approvalId: data.id
      }
    })
  }
}

const editButton = ref(false)
const editOrderInfo = async () => {
  const payload = {
    Id: id,
    CollaboratorId: ruleForm.collaborators,
    CollaboratorCommission: parseFloat(ruleForm.collaboratorCommission),
    Description: ruleForm.orderNotes,
    // Files: Files,
    DeleteFileIds: '',
    DeliveryOptionId: dataEdit.value?.deliveryOption ?? ruleForm.delivery
  }
  const formDataPayLoad = FORM_IMAGES(payload)
  await updateOrderInfo(formDataPayLoad)
    .then(() => {
      ElNotification({
        message: t('reuse.updateSuccess'),
        type: 'success'
      }),
        router.go(-1)
    })
    .catch(() => {
      ElNotification({
        message: t('reuse.updateFail'),
        type: 'success'
      })
    })
}

const listApplyExport = [
  {
    id: 1,
    check: true,
    applyExport: 'Bán'
  },
  {
    id: 3,
    check: true,
    applyExport: 'Cho thuê'
  },
  {
    id: 5,
    check: true,
    applyExport: 'Spa'
  }
]
const indexRow = ref()
const moneyReceipts = ref(0)

let newTable = ref()
let countExisted = ref(0)
let countExistedDNTT = ref(0)
const multipleTableRef = ref<InstanceType<typeof ElTable>>()

const handleSelectionChange = (val: tableDataType[]) => {
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
const handleSelectionbusinessManagement = (val: tableDataType[]) => {
  const label = val.map((e) => e.applyExport)
  const x = val.map((e) => e.id)
  ListOfProductsForSale.value[indexRow.value].businessSetup = x.join(', ')
  ListOfProductsForSale.value[indexRow.value].businessSetupName = label.join(', ')
}

const optionsChooseMoneyType = [
  {
    value: 1,
    label: 'Tiền gốc cầm đồ'
  },
  {
    value: 2,
    label: 'Tiền phí cầm đồ'
  },
  {
    value: 3,
    label: 'Tiền giá đàm phán'
  },
  {
    value: 4,
    label: 'Tiền phí spa'
  },
  {
    value: 5,
    label: 'Tiền khác'
  }
]
const ckeckChooseProduct = (scope) => {
  if (!scope.row.productPropertyId) {
    ElNotification({
      message: 'Ban phai chon san pham truoc',
      type: 'info'
    })
  } else {
    dialogbusinessManagement.value = true
  }
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
      } else if (rawFile.name?.split('.')[0].length > 100) {
        ElMessage.error(t('reuse.checkNameImageLength'))
        return false
      }
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
  Files = ListFileUpload.value.map((el) => el?.raw)
}
const fileList = ref<UploadUserFile[]>([])

const disableCreateOrder = ref(false)
const disabledDate = (time: Date) => {
  return time.getTime() <= Date.now()
}
const priceintoMoneyPawnGOC = ref(0)
const priceintoMoneyByday = ref(0)
const editData = async () => {
  if (type == 'detail') checkDisabled.value = true
  disableEditData.value = true
  if (type == 'edit' || type == 'detail' || type == 'approval-order') {
    disabledEdit.value = true
    disableCreateOrder.value = true
    const res = await getOrderList({ Id: id, ServiceType: 4 })
    const transaction = await getOrderTransaction({ id: id })
    if (debtTable.value.length > 0) debtTable.value.splice(0, debtTable.value.length - 1)
    debtTable.value = transaction.data

    getReturnRequestTable()

    const orderObj = { ...res.data[0] }

    dataEdit.value = orderObj
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

    if (statusOrder.value == 2 && type == 'edit') {
      disableEditData.value = true
      editButton.value = true
    }

    Files = orderObj.orderFiles

    if (res.data) {
      customerData.customerId = orderObj.customerId
      await getCustomerInfo(customerData.customerId)
      ruleForm.orderCode = orderObj.code
      // @ts-ignore
      ruleForm.pawnTerm = [orderObj.fromDate, orderObj.toDate]
      pawnOrderCode.value = ruleForm.orderCode
      priceintoMoneyPawnGOC.value = orderObj.totalPrice
      ruleForm.paymentPeriod = orderObj.days
      priceintoMoneyByday.value = orderObj.interestMoney
      customerID.value = orderObj.customer.id
      ruleForm.collaborators = orderObj?.collaborator?.id
      ruleForm.collaboratorCommission = orderObj.collaboratorCommission
      ruleForm.customerName = orderObj.customer.id
      ruleForm.orderNotes = orderObj.description
      ruleForm.warehouse = orderObj?.warehouseId

      totalOrder.value = orderObj.totalPrice
      if (ListOfProductsForSale.value.length > 0)
        ListOfProductsForSale.value.splice(0, ListOfProductsForSale.value.length - 1)
      ListOfProductsForSale.value = orderObj.orderDetails
      getTotalWarehouse()

      customerAddress.value = orderObj.address
      ruleForm.delivery = orderObj.deliveryOptionName

      if (orderObj.customer.isOrganization) {
        infoCompany.name = orderObj.customer.name
        infoCompany.taxCode = orderObj.customer.taxCode
        infoCompany.phone = 'Số điện thoại: ' + orderObj.customer.phone
        infoCompany.email = 'Email: ' + orderObj.customer.email
      } else {
        infoCompany.name = orderObj.customer.name + ' | ' + orderObj.customer.taxCode
        infoCompany.taxCode = orderObj.customer.taxCode
        infoCompany.phone = 'Số điện thoại: ' + orderObj.customer.phone
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
    ListOfProductsForSale.value.push({ ...productForSale })
  }
}

interface typeWarehouse {
  value: any
  label: any
}
const chooseWarehouse = reactive<Array<typeWarehouse>>([])

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
// input nhập tiền viết bằng chữ
const enterMoney = ref()
const inputRecharger = ref()

// Tổng tiền table phiếu đề nghị thanh toán nếu có
const totalPayment = ref(0)
const depositePayment = ref(0)
const debtPayment = ref(0)

const clearData = () => {
  totalPayment.value = 0
  depositePayment.value = 0
  debtPayment.value = 0
  inputReasonCollectMoney.value = ''
  enterMoney.value = ''
  inputRecharger.value = undefined

  detailedListExpenses.value.splice(0, detailedListExpenses.value.length - 1)
  addRowDetailedListExpoenses()
}

function openReceiptDialog() {
  getReceiptCode()
  clearData()
  inputRecharger.value = staffItem?.name + ' | ' + staffItem?.phone
  dialogInformationReceipts.value = true
  nameDialog.value = 'Phiếu thu'
}

function openPaymentDialog() {
  getcodeExpenditures()
  clearData()
  inputRecharger.value = staffItem?.name + ' | ' + staffItem?.phone
  dialogPaymentVoucher.value = !dialogPaymentVoucher.value
  nameDialog.value = 'Phiếu chi'
}

const getReceiptCode = async () => {
  codeReceipts.value = await getReceiptPaymentVoucher()
}

const getcodeExpenditures = async () => {
  codeExpenditures.value = await getReceiptPaymentVoucher()
}

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

// Lấy chi tiết phiếu thu chi
let formDetailPaymentReceipt = ref()
const getDetailPayment = async (_index, scope) => {
  formDetailPaymentReceipt.value = await getDetailReceiptPaymentVoucher({
    id: scope.row.receiptOrPaymentVoucherId
  })
  nameDialog.value = 'Phiếu thu'
  codeReceipts.value = formDetailPaymentReceipt.value.data?.code
  codeExpenditures.value = formDetailPaymentReceipt.value.data?.code
  inputReasonCollectMoney.value = formDetailPaymentReceipt.value.data?.description
  moneyReceipts.value = formDetailPaymentReceipt.value.data?.totalMoney
  payment.value = formDetailPaymentReceipt.value.data?.typeOfPayment
  inputRecharger.value = formDetailPaymentReceipt.value.data?.peopleId ?? 1
  dialogInformationReceipts.value = true
}

const dialogAccountingEntryAdditional = ref(false)
const idAccounting = ref()

// xem chi tiết lịch sử công nợ theo id
let formAccountingId = ref()
const openDialogAcountingEntry = (scope) => {
  const data = scope.row
  idAccounting.value = data.id
  switch (data.typeOfAccountingEntry) {
    case 1:
      getAccountingEntry(data.id, 1)
      break
    case 2:
      getAccountingEntry(data.id, 2)
      break
    case 3:
      getAccountingEntry(data.id, 3)
      break
    case 4:
      getAccountingEntry(data.id, 4)
      break
    case 5:
      openAccountingEntry(data.id, data.orderTypeBTSpa)
      break
  }
}
const negotiablePrice = ref(0)
const changePriceNegotiable = (scope) => {
  const data = scope.row
  if (typeDialog.value == 3) {
    data.totatlPricesRental = data.negotiablePrice
    negotiablePrice.value = parseInt(data.totatlPricesRental)
  }
  else if (typeDialog.value == 1) {
    data.totatlPriceSale = data.negotiablePrice
    negotiablePrice.value = parseInt(data.totatlPriceSale)
  } else {
    negotiablePrice.value = parseInt(data.totalPriceSpa)
  }
}

const updateAccount = async () => {
  const payload = {
    accountingEntryId: idAccounting.value,
    paymentRequestId: 0,
    receiptOrPaymentVoucherId: 0,
    isReceiptedMoney: alreadyPaidForTt.value,
    status: 0,
    paymentMethods: 1,
    paidMoney: typeDialog.value == 1 || typeDialog.value == 3 ? negotiablePrice.value : 0,
    deibt: negotiablePrice.value,
    receiveMoney: typeDialog.value == 5 ? negotiablePrice.value : 0,
    negotiatePrice: negotiablePrice.value
  }
  await updateOrderTransaction(payload).then(() => {
    getOrderStransactionList()
    dialogDepositSlip.value = false
  })
}

const dialogDepositSlip = ref(false)
const typeDialog = ref(1)
const typeTable = ref<Array<any>>([])
const tablePaymentSlip = ref()
const openAccountingEntry = async (id, type) => {
  typeDialog.value = type
  const res = await getDetailAccountingEntryById({ id: id })
  typeTable.value[0] = res?.data?.accountingEntry

  if (type == 1) {
    tablePaymentSlip.value = typeTable?.value.map((val) => ({
      productCode: val?.productCode,
      productName: val?.productName,
      createdAt: val?.createdAt,
      unitPrice: val?.unitPrice ?? 0,
      consignmentPrice: val?.consignmentPrice ?? 0,
      negotiablePrice: val?.negotiatePrice ?? 0,
      totatlPriceSale: val?.totatlPriceSale ?? 0
    }))
  } else if (type == 3) {
    tablePaymentSlip.value = typeTable?.value.map((val) => ({
      productCode: val?.productCode,
      productName: val?.productName,
      createdAt: val?.createdAt,
      unitPrice: val?.unitPrice ?? 0,
      consignmentPrice: val?.consignmentPrice ?? 0,
      negotiablePrice: val?.negotiatePrice ?? 0,
      totatlPriceRental: val?.totatlPriceRental ?? 0,
      totatlPricesRental: val?.totatlPriceRental ?? 0
    }))
  } else if (type == 5) {
    tablePaymentSlip.value = typeTable?.value.map((val) => ({
      productCode: val?.productCode,
      productName: val?.productName,
      createdAt: val?.createdAt,
      unitPrice: val?.unitPrice ?? 0,
      spaService: val?.spaService,
      negotiablePrice: val?.totalPriceSpa ?? 0,
      totalPriceSpa: val?.totalPriceSpa ?? 0
    }))
  }
}

const getAccountingEntry = async (index, num) => {
  const res = await getDetailAccountingEntryById({ id: index })
  formAccountingId.value = { ...res.data }
  tablePawnSlip.value = formAccountingId.value.paidMerchandises
  tableAccountingEntry.value = formAccountingId.value.accountingEntry

  if (num == 1) {
    dialogFeePaymentSlip.value = true
  } else if (num == 2) {
    dialogPawnCouponInfomation.value = true
  } else if (num == 3) {

  } else if (num == 4) {
    dialogAccountingEntryAdditional.value = true
  }
}

let statusOrder = ref(STATUS_ORDER_PAWN[3].orderStatus)
interface statusOrderType {
  orderStatusName: string
  orderStatus: number
  createdAt?: string
  isActive?: boolean
  approvedAt?: string
}
let arrayStatusOrder = ref(Array<statusOrderType>())
arrayStatusOrder.value.pop()

if (type == 'add')
  arrayStatusOrder.value.push({
    orderStatusName: 'Duyệt đơn hàng',
    orderStatus: 4,
    isActive: true
  })

const updateOrderStatus = async (status: number, idOrder: any) => {
  const payload = {
    OrderId: idOrder ? idOrder : id,
    ServiceType: 4,
    OrderStatus: status
  }
  const formDataPayLoad = FORM_IMAGES(payload)
  await updateStatusOrder(formDataPayLoad)
  statusOrder.value = status
}

const addStatusOrder = (index) => {
  arrayStatusOrder.value[arrayStatusOrder.value.length - 1].isActive = false
  arrayStatusOrder.value.push(STATUS_ORDER_PAWN[index])
  statusOrder.value = STATUS_ORDER_PAWN[index].orderStatus
  arrayStatusOrder.value[arrayStatusOrder.value.length - 1].isActive = true
  updateOrderStatus(STATUS_ORDER_PAWN[index].orderStatus, id)
  reloadStatusOrder()
}

// Cập nhật trạng thái đơn hàng
const updateStatusOrders = async (typeState) => {
  // 13 hoàn thành đơn hàng
  if (typeState == STATUS_ORDER_PAWN[0].orderStatus) {
    let payload = {
      OrderId: id
    }
    await cancelOrder(FORM_IMAGES(payload))
    reloadStatusOrder()
  } else if (typeState == STATUS_ORDER_PAWN[2].orderStatus) {
    let payload = {
      OrderId: id
    }
    await finishStatusOrder(FORM_IMAGES(payload))
    reloadStatusOrder()
  } else {
    let paylpad = { OrderId: id, ServiceType: 4, OrderStatus: typeState }
    await updateStatusOrder(FORM_IMAGES(paylpad))
    reloadStatusOrder()
  }
}

const codeReceipts = ref()
const codeExpenditures = ref()
const codePaymentRequest = ref()
// Bút toán bổ sung
const alreadyPaidForTt = ref(false)

const activeName = ref([collapse[0].name, collapse[1].name])

var curDate = 'CD' + moment().format('hhmmss')
var autoCodePawnOrder = 'CD' + moment().format('hmmss')
var autoCodeReceipts = 'PT' + moment().format('hmmss')
var autoCodeExpenditures = 'PC' + moment().format('hmmss')
var autoCodePaymentRequest = 'DNTT' + moment().format('hhmmss')
const dialogBillLiquidation = ref(false)

const staff = localStorage.getItem('STAFF_INFO')?.toString() || ''
const staffInfo = JSON.parse(staff) || ''
const staffItem = JSON.parse(staffInfo?.v) || ''
inputRecharger.value = staffItem?.id

onBeforeMount(async () => {
  await editData()
  await callAPIProduct()
  await callApiWarehouseList()

  callCustomersApi()
  callApiCollaborators()

  if (type == 'add') {
    disableCreateOrder.value = true

    disableEditData.value = false
    ruleForm.orderCode = curDate
    pawnOrderCode.value = autoCodePawnOrder
    codeReceipts.value = autoCodeReceipts
    codeExpenditures.value = autoCodeExpenditures
    codePaymentRequest.value = autoCodePaymentRequest
  }
})

//TruongNgo
const rentReturnOrder = ref({} as any)
let productArray: any = []
const listOfOrderProduct = ref()
const setDataForReturnOrder = () => {
  productArray = ListOfProductsForSale.value.map((row) => row.productPropertyId)
  listOfOrderProduct.value = listProducts.value.filter((item) => {
    return productArray.includes(item.productPropertyId)
  })
  rentReturnOrder.value.orderCode = ruleForm.orderCode
  rentReturnOrder.value.period = ruleForm.pawnTerm
  rentReturnOrder.value.extendDate = ''
  rentReturnOrder.value.name = infoCompany.name
  rentReturnOrder.value.customerAddress = customerAddress
  rentReturnOrder.value.phone = infoCompany.phone
  rentReturnOrder.value.inputReturnReason = inputReasonReturn
  rentReturnOrder.value.tableData = ListOfProductsForSale
}
const addRow = () => {
  rentReturnOrder.value.tableData.push({ ...productForSale })
}
const removeRow = (index) => {
  rentReturnOrder.value.tableData.splice(index, 1)
}
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
              label-width="181px"
              class="demo-ruleForm"
              status-icon
            >
              <el-divider content-position="left">{{ t('formDemo.orderInformation') }}</el-divider>

              <el-form-item :label="t('formDemo.orderCode')" prop="orderCode">
                <el-input
                  :disabled="disableCreateOrder"
                  v-model="ruleForm.orderCode"
                  style="width: 100%"
                  :placeholder="t('formDemo.enterOrderCode')"
                />
              </el-form-item>

              <el-form-item :label="t('formDemo.pawnTerm')" prop="pawnTerm">
                <el-date-picker
                  :disabled="disableEditData"
                  v-model="ruleForm.pawnTerm"
                  type="daterange"
                  :start-placeholder="t('formDemo.startDay')"
                  :end-placeholder="t('formDemo.endDay')"
                  :disabled-date="disabledDate"
                  format="DD/MM/YYYY"
                />
              </el-form-item>

              <div class="css-form_has-child mb-2">
                <el-form-item
                  :label="t('formDemo.pawnFeePaymentTime')"
                  prop="paymentPeriod"
                  class="m-0"
                >
                  <el-input
                    v-model="ruleForm.paymentPeriod"
                    :disabled="checkDisabled"
                    style="width: 100%"
                    :placeholder="t('reuse.byDay')"
                  />
                </el-form-item>
                <p class="text-right text-[#FECB80] w-[165px]">{{
                  t('formDemo.atLeastTenDays')
                }}</p>
              </div>
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
                  <el-form-item prop="collaboratorCommission" class="fix-err" label-width="0">
                    <div class="flex items-center">
                      <el-input
                        :disabled="checkDisabled"
                        v-model="ruleForm.collaboratorCommission"
                        class="w-[100%] border-none outline-none pl-2 bg-transparent"
                        :placeholder="t('formDemo.enterDiscount')"
                        :suffix-icon="percentIcon"
                      />
                    </div>
                  </el-form-item>
                </div>
              </div>

              <el-form-item :label="t('formDemo.orderNotes')" prop="orderNotes">
                <el-input
                  v-model="ruleForm.orderNotes"
                  :disabled="checkDisabled"
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
                  :limit="10"
                  :on-exceed="handleExceed"
                  :multiple="true"
                  :auto-upload="false"
                  class="relative"
                  :on-change="handleChange"
                  v-model:file-list="fileList"
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
            <el-form
              ref="ruleFormRef2"
              :model="ruleForm"
              status-icon
              :rules="rules"
              label-width="180px"
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
                            :disabled="checkDisabled"
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
                  <el-form-item :label="t('formDemo.selectExportWarehouse')" prop="warehouse">
                    <div class="flex w-[100%] max-h-[42px] gap-2 items-center">
                      <div class="flex w-[80%] gap-4">
                        <el-select
                          :disabled="checkDisabled"
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
                      v-if="ruleForm.customerName !== ''"
                      class="bg-[#F4F8FD] pl-2 text-blue-500 dark:bg-[#3B3B3B]"
                      >{{ t('formDemo.noDebt') }}</p
                    >
                  </el-form-item>
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
                    <div>{{ infoCompany.phone }}</div>
                    <div>{{ infoCompany.email }}</div>
                  </div>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-collapse-item>

      <!-- Dialog Thêm nhanh sản phẩm -->
      <el-dialog
        v-model="dialogAddProduct"
        :title="t('formDemo.quicklyAddProducts')"
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
                v-for="item in listProducts"
                :key="item.productPropertyId"
                :label="item.value"
                :value="item.productPropertyId"
              />
            </el-select>
          </div>
          <div class="flex gap-4 pt-4 pb-4 items-center">
            <label class="w-[30%] text-right"
              >{{ t('reuse.managementCode') }} <span class="text-red-500">*</span></label
            >
            <el-input
              :modelValue="quickManagementCode"
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
            <ProductAttribute
              :value="productCharacteristics"
              @change-value="productAttributeValue"
            />
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

      <el-collapse-item :name="collapse[1].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[1].icon" link />
          <span class="text-center text-xl">{{ collapse[1].title }}</span>
        </template>
        <el-divider content-position="left">{{ t('formDemo.listOfPawnProducts') }}</el-divider>
        <el-table
          :data="ListOfProductsForSale"
          border
          :class="[
            'bg-[var(--el-color-white)] dark:(bg-[var(--el-color-black)] border-[var(--el-border-color)] border-1px)'
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
                  t('formDemo.productInformation')
                ]"
                filterable
                width="650px"
                :items="listProducts"
                valueKey="productPropertyId"
                :disabled="disabledEdit"
                labelKey="productCode"
                :hiddenKey="['id']"
                :placeHolder="t('reuse.chooseProductCode')"
                :defaultValue="props.row.productPropertyId"
                :clearable="false"
                @scroll-top="ScrollProductTop"
                @scroll-bottom="ScrollProductBottom"
                @update-value="(value, obj) => getValueOfSelected(value, obj, props)"
                ><template #underButton>
                  <div class="sticky z-999 bottom-0 bg-white dark:bg-black h-10">
                    <div class="block h-1 w-[100%] border-top-1 pb-2"></div>
                    <div
                      class="text-base text-blue-400 cursor-pointer pl-2"
                      @click="
                        () => {
                          addnewproduct()
                          getBrandSelectOptions()
                          getUnitSelectOptions()
                          getOriginSelectOptions()
                          getCategory()
                        }
                      "
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
            min-width="620"
          />
          <el-table-column
            :disabled="disabledEdit"
            prop="accessory"
            :label="t('reuse.accessory')"
            width="180"
          >
            <template #default="data">
              <div v-if="type === 'detail'">{{ data.row.accessory }}</div>
              <el-input
                v-else
                class="max-w-[150px]"
                v-model="data.row.accessory"
                :placeholder="`/${t('formDemo.selfImportAccessories')}/`"
              />
            </template>
          </el-table-column>

          <el-table-column prop="code" :label="t('formDemo.code')" width="180">
            <template #default="data">
              <div v-if="type == 'detail'">
                {{ data.row.code }}
              </div>
              <el-input
                v-else 
                :disabled="disabledEdit" 
                v-model="data.row.code"
                :placeholder="`/${t('formDemo.selfImportCode')}/`" />
            </template>
          </el-table-column>

          <el-table-column prop="description" :label="t('formDemo.descriptionProduct')" width="180">
            <template #default="data">
              <div v-if="type == 'detail'">
                {{ data.row.description }}
              </div>
              <el-input
                v-else 
                :disabled="disabledEdit" 
                v-model="data.row.description"
                :placeholder="`/${t('formDemo.selfImportDescription')}/`" />
            </template>
          </el-table-column>

          <el-table-column prop="quantity" :label="t('reuse.pawnNumber')" width="90">
            <template #default="data">
              <div v-if="type === 'detail'">{{ data.row.quantity }}</div>
              <el-input
                v-else 
                v-model="data.row.quantity" 
                :disabled="disabledEdit" @change="handleTotal(data)"
                style="width: 100%" />
            </template>
          </el-table-column>

          <el-table-column prop="unitName" :label="t('reuse.dram')" width="120" />

          <el-table-column prop="interestMoney" :label="t('reuse.intoMoneyByday')" width="150">
            <template #default="data">
              <div v-if="type === 'detail'">{{ changeMoney.format(data.row.interestMoney) }}</div>
              <el-input
                v-else 
                v-model="data.row.interestMoney" 
                :disabled="disabledEdit"
                style="width: 100%" />
            </template>
          </el-table-column>

          <el-table-column prop="unitPrice" :label="t('formDemo.moneyPawnGOC')" width="150">
            <template #default="data">
              <div v-if="type === 'detail'">{{ changeMoney.format(data.row.unitPrice) }}</div>
              <el-input 
                v-else 
                v-model="data.row.unitPrice" 
                :disabled="disabledEdit"
                style="width: 100%" />
            </template>
          </el-table-column>

          <el-table-column
            :label="t('formDemo.businessManagement')"
            width="200"
            prop="businessSetupName"
          >
            <template #default="data">
              <div class="flex w-[100%]">
                <div class="flex-1 limit-text">
                  <span>{{ data.row.businessSetupName }}</span>
                </div>
                <div class="flex-1 text-right">
                  <el-button
                    :disabled="disabledEdit"
                    text
                    border
                    class="text-blue-500"
                    @click="
                      () => {
                        indexRow = data.$index
                        ckeckChooseProduct(data)
                      }
                    "
                  >
                    <span class="text-blue-500">+ {{ t('router.business') }}</span></el-button
                  >
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="warehouseTotal" :label="t('reuse.iventoryy')" width="200">
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
              <div class="flex gap-2">
                <el-button
                  :disabled="disabledEdit"
                  @click.prevent="removeListProductsSale(scope.$index)"
                  type="danger"
                  >{{ t('reuse.delete') }}</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-button class="ml-4 mt-4" @click="addLastIndexSellTable" :disabled="disabledEdit"
          >+ {{ t('formDemo.add') }}</el-button
        >

        <div class="flex justify-end pt-4">
          <div class="w-50">
            <div class="text-black font-bold dark:text-[#fff]"
              >{{ t('formDemo.intoMoneyPawnGOC') }} <span class="text-red-500">*</span></div
            >
          </div>
          <div class="w-30"> {{ changeMoney.format(priceintoMoneyPawnGOC) }} </div>

          <div class="w-60 pl-2">
            <div class="dark:text-[#fff] text-transparent dark:text-transparent">s</div>

            <div class="dark:text-[#fff] text-transparent dark:text-transparent">s</div>
          </div>
        </div>

        <div class="w-[100%]">
          <el-divider content-position="left">{{ t('formDemo.statusAndManipulation') }}</el-divider>
        </div>
        <div class="flex gap-4 w-[100%] ml-1 items-center pb-3">
          <label class="w-[11%] text-right">{{ t('formDemo.orderTrackingStatus') }}</label>
          <div class="w-[84%] pl-1">
            <el-radio-group v-model="radioTracking" class="ml-4">
              <el-radio label="2" value="2" size="large">{{
                t('formDemo.receivedDelivery')
              }}</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="flex w-[100%] ml-1 items-center pb-3 mb-2">
          <label class="w-[11%] text-right">{{ t('formDemo.orderStatus') }}</label>
          <div class="w-[89%]">
            <div class="flex items-center w-[100%]">
              <div
                class="duplicate-status"
                v-for="item in arrayStatusOrder"
                :key="item.orderStatus"
              >
                <div
                  v-if="
                    item.orderStatus == STATUS_ORDER_PAWN[10].orderStatus ||
                    item.orderStatus == STATUS_ORDER_PAWN[3].orderStatus ||
                    item.orderStatus == STATUS_ORDER_PAWN[4].orderStatus ||
                    item.orderStatus == STATUS_ORDER_PAWN[6].orderStatus ||
                    item.orderStatus == STATUS_ORDER_PAWN[7].orderStatus
                  "
                >
                  <span
                    class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-black dark:bg-transparent"
                  ></span>
                  <span
                    class="box box_1 text-yellow-500 dark:text-divck"
                    :class="{ active: item.isActive }"
                  >
                    {{ item.orderStatusName }}

                    <span class="triangle-right right_1"> </span>
                  </span>
                  <i class="text-gray-300">{{
                    item.createdAt !== '' ? dateTimeFormat(item.createdAt) : ''
                  }}</i>
                </div>
                <div
                  v-else-if="
                    item.orderStatus == STATUS_ORDER_PAWN[1].orderStatus ||
                    item.orderStatus == STATUS_ORDER_PAWN[5].orderStatus
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
                  <i class="text-gray-300">{{
                    item.createdAt !== '' ? dateTimeFormat(item.createdAt) : ''
                  }}</i>
                </div>
                <div v-else-if="item.orderStatus == STATUS_ORDER_PAWN[2].orderStatus">
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
                  <i class="text-gray-300">{{
                    item.createdAt !== '' ? dateTimeFormat(item.createdAt) : ''
                  }}</i>
                </div>
                <div
                  v-else-if="
                    item.orderStatus == STATUS_ORDER_PAWN[8].orderStatus ||
                    item.orderStatus == STATUS_ORDER_PAWN[0].orderStatus
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
                  <i class="text-gray-300">{{
                    item.createdAt !== '' ? dateTimeFormat(item.createdAt) : ''
                  }}</i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="w-[100%] flex gap-4 mt-2">
          <div class="w-[12%]"></div>
          <!-- edit -->
          <div v-if="editButton" class="w-[100%] flex ml-1 gap-4">
            <el-button
              :disabled="checkDisabled"
              @click="
                () => {
                  editOrderInfo()
                  changeButtonEdit = false
                }
              "
              type="primary"
              class="min-w-42 min-h-11"
              >{{ t('reuse.save') }}</el-button
            >
            <el-button
              @click="
                () => {
                  router.go(-1)
                }
              "
              :disabled="checkDisabled"
              type="danger"
              class="min-w-42 min-h-11"
              >{{ t('button.cancel') }}</el-button
            >
          </div>

          <div class="w-[100%] flex ml-1 gap-4" v-if="!editButton">
            <el-button
              v-if="
                statusOrder == STATUS_ORDER_PAWN[1].orderStatus ||
                statusOrder == STATUS_ORDER_PAWN[5].orderStatus ||
                statusOrder == STATUS_ORDER_PAWN[7].orderStatus ||
                statusOrder == STATUS_ORDER_PAWN[9].orderStatus ||
                statusOrder == STATUS_ORDER_PAWN[8].orderStatus ||
                statusOrder == STATUS_ORDER_PAWN[11].orderStatus ||
                (statusOrder == STATUS_ORDER_PAWN[3].orderStatus && type == 'add')
              "
              class="min-w-42 min-h-11"
              @click="openBillPawnDialog"
              >{{ t('formDemo.billPawn') }}</el-button
            >

            <el-button
              v-if="
                statusOrder == STATUS_ORDER_PAWN[1].orderStatus ||
                statusOrder == STATUS_ORDER_PAWN[5].orderStatus ||
                statusOrder == STATUS_ORDER_PAWN[7].orderStatus ||
                statusOrder == STATUS_ORDER_PAWN[9].orderStatus ||
                statusOrder == STATUS_ORDER_PAWN[8].orderStatus ||
                statusOrder == STATUS_ORDER_PAWN[11].orderStatus ||
                (statusOrder == STATUS_ORDER_PAWN[3].orderStatus && type == 'add')
              "
              class="min-w-42 min-h-11"
              @click="openDepositDialog"
              >{{ t('formDemo.bill') }}</el-button
            >

            <el-button
              v-if="
                statusOrder == STATUS_ORDER_PAWN[1].orderStatus ||
                statusOrder == STATUS_ORDER_PAWN[2].orderStatus
              "
              type="primary"
              @click="
                () => {
                  // addStatusOrder(3)
                  addStatusOrder(5)
                }
              "
              class="min-w-43 min-h-11"
              >Bắt đầu cầm đồ theo kỳ hạn</el-button
            >
            <el-button
              v-if="statusOrder == STATUS_ORDER_PAWN[1].orderStatus"
              @click="changeEditInDetail"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.editOrder') }}</el-button
            >
            <el-button
              v-if="statusOrder == STATUS_ORDER_PAWN[3].orderStatus && type == 'add'"
              @click="
                () => {
                  submitForm(ruleFormRef, ruleFormRef2)
                }
              "
              type="primary"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.saveAndPending') }}</el-button
            >
            <el-button
              v-if="
                statusOrder == STATUS_ORDER_PAWN[3].orderStatus ||
                statusOrder == STATUS_ORDER_PAWN[1].orderStatus ||
                (statusOrder == STATUS_ORDER_PAWN[1].orderStatus &&
                  !duplicateStatusButton &&
                  type != 'add')
              "
              @click="
                () => {
                  updateStatusOrders(STATUS_ORDER_PAWN[0].orderStatus)
                }
              "
              type="danger"
              class="min-w-42 min-h-11"
              >{{ t('button.cancelOrder') }}</el-button
            >
            <el-button
              v-if="statusOrder == STATUS_ORDER_PAWN[5].orderStatus"
              @click="
                () => {
                  changeReturnGoods = true
                  earlyEedemption = true
                  addStatusOrder(8)
                  setDataForReturnOrder()
                }
              "
              type="warning"
              class="min-w-42 min-h-11"
              >Chuộc hàng trước hạn</el-button
            >
            <div v-if="earlyEedemption == true">
              <el-button
                v-if="statusOrder == STATUS_ORDER_PAWN[5].orderStatus"
                type="warning"
                class="min-w-42 min-h-11"
                >Hoàn thành chuộc hàng</el-button
              >
              <el-button
                v-if="statusOrder == STATUS_ORDER_PAWN[5].orderStatus"
                @click="
                  () => {
                    earlyEedemption == false
                  }
                "
                type="warning"
                class="min-w-42 min-h-11"
                >Hủy chuộc hàng</el-button
              >
            </div>
            <el-button
              v-if="statusOrder == STATUS_ORDER_PAWN[9].orderStatus"
              @click="() => {}"
              type="warning"
              class="min-w-42 min-h-11"
              >Hủy đứt hàng</el-button
            >
            <el-button
              v-if="statusOrder == STATUS_ORDER_PAWN[9].orderStatus"
              @click="() => {}"
              type="warning"
              class="min-w-42 min-h-11"
              >Hoàn thành đứt hàng</el-button
            >
            <el-button
              v-if="
                statusOrder == STATUS_ORDER_PAWN[6].orderStatus ||
                statusOrder == STATUS_ORDER_PAWN[8].orderStatus ||
                statusOrder == STATUS_ORDER_PAWN[9].orderStatus
              "
              @click="
                () => {
                  addStatusOrder(-1)
                  // setDataForReturnOrder()
                }
              "
              type="warning"
              class="min-w-42 min-h-11"
              >Đối soát & kết thúc</el-button
            >
            <el-button
              v-if="
                statusOrder == STATUS_ORDER_PAWN[7].orderStatus ||
                statusOrder == STATUS_ORDER_PAWN[11].orderStatus
              "
              @click="
                () => {
                  changeReturnGoods = true
                  setDataForReturnOrder()
                }
              "
              type="warning"
              class="min-w-42 min-h-11"
              >Chuộc hàng hết hạn</el-button
            >
            <el-button
              v-if="
                statusOrder == STATUS_ORDER_PAWN[11].orderStatus ||
                statusOrder == STATUS_ORDER_PAWN[7].orderStatus
              "
              @click="
                () => {
                  dutHang = true
                  setDataForReturnOrder()
                }
              "
              type="warning"
              class="min-w-42 min-h-11"
              >Đứt hàng hết hạn</el-button
            >
            <el-button
              v-if="
                statusOrder == STATUS_ORDER_PAWN[11].orderStatus ||
                statusOrder == STATUS_ORDER_PAWN[7].orderStatus
              "
              @click="
                () => {
                  giaHan = true
                  setDataForReturnOrder()
                }
              "
              class="min-w-42 min-h-11 !border-red-500"
              ><p class="text-red-500">Gia hạn cầm đồ</p></el-button
            >
            <div v-if="statusOrder == 200" class="w-[100%] flex ml-1 gap-4">
              <el-button @click="approvalFunction" type="warning" class="min-w-42 min-h-11">{{
                t('router.approve')
              }}</el-button>
              <el-button class="min-w-42 min-h-11 rounded font-bold">{{
                t('router.notApproval')
              }}</el-button>
            </div>
          </div>
        </div>
      </el-collapse-item>

      <!-- phieu in -->
      <div id="billPawn">
        <slot>
          <billLoanConfirmation
            v-if="dataEdit"
            :dataCustomer="customerData"
            :dataEdit="dataEdit"
            :priceBillPawn="priceintoMoneyPawnGOC"
            :dayPayment="ruleForm.paymentPeriod"
          />
        </slot>
      </div>

      <!-- Dialog thông tin hợp đồng thanh lý-->
      <el-dialog
        v-model="dialogBillLiquidation"
        title="Thông tin hợp đồng thanh lý"
        width="40%"
        align-center
      >
        <div class="section-bill">
          <div class="flex gap-3 justify-end">
            <el-button
              @click="
                printPage('billPawn', {
                  url: '',
                  title: 'In vé',
                  w: 800,
                  h: 920
                })
              "
              >{{ t('button.print') }}</el-button
            >

            <el-button class="btn" @click="dialogBillLiquidation = false">{{
              t('reuse.exit')
            }}</el-button>
          </div>
          <div class="dialog-content">
            <slot>
              <billLoanConfirmation
                v-if="dataEdit"
                :dataCustomer="customerData"
                :dataEdit="dataEdit"
                :priceBillPawn="priceintoMoneyPawnGOC"
                :dayPayment="ruleForm.paymentPeriod"
              />
            </slot>
          </div>
        </div>
      </el-dialog>

      <!-- dialog quản lý kinh doanh -->
      <el-dialog
        v-model="dialogbusinessManagement"
        :title="t('formDemo.businessManagement')"
        width="40%"
        align-center
      >
        <el-divider />
        <el-form :model="formBusuness">
          <el-table
            ref="multipleTableRef"
            border
            :data="listApplyExport"
            @selection-change="handleSelectionbusinessManagement"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column class="font-normal" prop="applyExport" label="Cho phép xuất hàng" />
          </el-table>
        </el-form>

        <template #footer>
          <span class="dialog-footer">
            <el-button
              type="primary"
              @click="
                () => {
                  dialogbusinessManagement = false
                }
              "
              >{{ t('reuse.save') }}</el-button
            >
            <el-button @click="dialogbusinessManagement = false">{{ t('reuse.exit') }}</el-button>
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
        <el-table :data="tableWarehouse" border>
          <el-table-column prop="name" :label="t('formDemo.warehouseInformation')" width="360" />
          <el-table-column prop="inventory" :label="t('reuse.inventory')">
            <template #default="props">
              <div class="flex">
                <span class="flex-1" v-if="props.row.inventory > 0">{{ props.row.inventory }}</span>
                <span v-else class="text-yellow-500">Hết hàng</span>
                <span class="flex-1 text-right">Chiếc</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="flex justify-end">
          <div class="flex">
            <span class="font-bold">{{ totalWarehouse }}</span>
            <span class="">Chiếc</span>
          </div>
        </div>
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

      <el-collapse-item :name="collapse[2].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[2].icon" link />
          <span class="text-center text-xl">{{ collapse[2].title }}</span>
        </template>
        <el-button text @click="dialogAccountingEntryAdditional = true">+ Thêm bút toán</el-button>
        <el-button :disabled="disabledPTAccountingEntry" @click="openReceiptDialog" text
          >+ Thêm phiếu thu</el-button
        >
        <el-button :disabled="disabledPCAccountingEntry" @click="openPaymentDialog" text
          >+ Thêm phiếu chi</el-button
        >
        <el-button
          :disabled="disabledDNTTAccountingEntry"
          @click="
            () => {
              newCodePaymentRequest()
              clearData()
              inputRecharger = staffItem?.name + ' | ' + staffItem?.phone
              dialogIPRForm = true
            }
          "
          text
          >+ Thêm đề nghị thanh toán</el-button
        >
        <el-table
          ref="multipleTableRef"
          :data="debtTable"
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="40" />
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
          >
            <template #default="data">
              <el-input
                v-model="data.row.receiveMoney"
                v-if="type != 'detail'"
                style="width: 100%; border: none; outline: none"
              />
              <div v-else>{{ data.row.receiveMoney }}</div>
            </template>
          </el-table-column>

          <el-table-column prop="paidMoney" :label="t('formDemo.spent')" min-width="150">
            <template #default="data">
              <el-input
                v-model="data.row.paidMoney"
                v-if="type != 'detail'"
                style="width: 100%; border: none; outline: none"
              />
              <div v-else>{{ data.row.paidMoney }}</div>
            </template>
          </el-table-column>

          <el-table-column prop="deibt" :label="t('formDemo.pawnFeeDebt')" min-width="150">
            <template #default="data">
              <el-input
                v-model="data.row.deibt"
                v-if="type != 'detail'"
                style="width: 100%; border: none; outline: none"
              />
              <div v-else class="text-right">
                {{ data.row.deibt }}
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="typeOfPayment"
            :label="t('formDemo.receivableOrPayable')"
            min-width="100"
          >
            <template #default="props">
              <div>{{ props.row.typeOfPayment == 1 ? 'Phải thu' : 'Phải chi' }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="paymentMethods"
            :label="t('formDemo.choosePayment')"
            min-width="160"
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
            prop="alreadyPaidForTt"
            :label="t('formDemo.alreadyPaidForTt')"
            min-width="80"
          >
            <template #default="scope">
              <el-checkbox :disabled="checkDisabled" v-model="scope.row.alreadyPaidForTt" />
            </template>
          </el-table-column>
          <el-table-column
            :label="t('formDemo.statusAccountingEntry')"
            prop="status"
            min-width="120"
          >
            <template #default="props">
              <div>{{
                props.row.status == 0 ? t('formDemo.recorded') : t('formDemo.cancelled')
              }}</div>
            </template>
          </el-table-column>
          <el-table-column :label="t('formDemo.manipulation')" align="center">
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

      <!-- Thông tin phiếu cầm đồ -->
      <el-dialog
        v-model="dialogPawnCouponInfomation"
        :title="t('formDemo.informationPawn')"
        width="40%"
        align-center
      >
        <div>
          <!-- <Qrcode :text="'abc'" /> -->
          <el-divider />
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('formDemo.orderInformation') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
          <div class="flex gap-2 justify-between">
            <div class="flex-left">
              <div class="flex gap-4 pt-4 items-center">
                <label class="text-right w-[170px]">{{ t('formDemo.orderCode') }}</label>
                <div class="text-xl">{{ pawnOrderCode }}</div>
              </div>
              <div class="flex gap-4 py-2 items-center">
                <label class="text-right w-[170px]">{{ t('formDemo.pawnTime') }}</label>
                <div class="w-[60%] text-black dark:text-light-50"
                  >{{ dateTimeFormat(ruleForm.pawnTerm[0]) }} đến
                  {{ dateTimeFormat(ruleForm.pawnTerm[1]) }}</div
                >
              </div>
              <div class="flex gap-4 pb-4 items-center">
                <label class="text-right w-[170px]"
                  >{{ t('formDemo.pawnFeePaymentTime') }}<span class="text-red-500">*</span></label
                >
                <div class=""> {{ ruleForm.paymentPeriod }} {{ t('formDemo.day') }} </div>
              </div>
            </div>

            <div class="flex-right">
              <div class="flex-1 flex items-start gap-4">
                <span>
                  <div>Mã QR đơn hàng</div>
                </span>

                <span class="border"><Qrcode :width="100" :text="'QR'" /></span>
              </div>
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
            <div class="flex gap-4 mt-2 pitems-center">
              <label class="w-[30%] text-right">{{ t('formDemo.address') }}</label>
              <div class="w-[100%]">{{ customerAddress }}</div>
            </div>
            <div class="flex gap-4 mt-2 pb-4 items-center">
              <label class="w-[30%] text-right">{{ t('reuse.phoneNumber') }}</label>
              <div class="w-[100%]">{{ infoCompany.phone }}</div>
            </div>
          </div>
          <div class="flex items-center">
            <span class="w-[35%] text-base font-bold break-w">{{
              t('formDemo.productInformationPawn')
            }}</span>
            <span class="block h-1 w-[65%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
        </div>
        <div class="pt-2 pb-2">
          <el-table ref="singleTableRef" :data="tablePawnSlip" border style="width: 100%">
            <el-table-column label="STT" type="index" width="60" align="center" />
            <el-table-column prop="productCode" :label="t('reuse.productCode')" width="120" />
            <el-table-column prop="productName" :label="t('formDemo.commodityName')" width="280" />

            <el-table-column prop="accessory" :label="t('reuse.accessory')" width="100" />
            <el-table-column prop="code" :label="t('formDemo.code')" width="100" />

            <el-table-column prop="quantity" :label="t('reuse.pawnNumber')" width="100" />
            <el-table-column prop="unitName" :label="t('reuse.unit')" />
            <el-table-column prop="priceintoMoneyByday" :label="t('reuse.intoMoneyByday')" min-width="150">
              <template #default="data">
                {{ changeMoney.format(data.row.priceintoMoneyByday) }}
              </template>
            </el-table-column>
            <el-table-column prop="priceintoMoneyPawnGOC" min-width="150" :label="t('formDemo.moneyPawnGOC')">
              <template #default="data">
                {{ changeMoney.format(data.row.priceintoMoneyPawnGOC) }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="flex items-center">
          <span class="w-[25%] text-base font-bold">{{ t('formDemo.billingInformation') }}</span>
          <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
        </div>
        <div>
          <div class="flex gap-4 pt-2 items-center">
            <label class="w-[30%] text-right">{{ t('formDemo.intoMoneyPawnGOC') }}</label>
            <div class="w-[100%]">
              {{ changeMoney.format(0) }}
            </div>
          </div>
          <div class="flex gap-4 pt-2 items-center">
            <label class="w-[30%] text-right">{{ t('formDemo.paymentSpa') }}</label>
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
            <el-button
              class="min-w-42 min-h-11"
              @click="
                () => {
                  dialogBillLiquidation = true
                }
              "
              >{{ t('button.print') }}</el-button
            >
            <div>
              <span class="dialog-footer">
                <el-button
                  class="min-w-42 min-h-11"
                  type="primary"
                  @click="
                    () => {
                      dialogPawnCouponInfomation = false
                      postOrderStransaction(2)
                    }
                  "
                  >{{ t('formDemo.saveRecordDebts') }}</el-button
                >
                <el-button class="min-w-32 min-h-11" @click="dialogPawnCouponInfomation = false">{{
                  t('reuse.exit')
                }}</el-button>
              </span>
            </div>
          </div>
        </template>
      </el-dialog>

      <!-- Thông tin phiếu thanh toán phí cầm đồ -->
      <el-dialog
        v-model="dialogFeePaymentSlip"
        :title="t('formDemo.pawnFeePaymentInformation')"
        width="40%"
        align-center
      >
        <div>
          <el-divider />
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('formDemo.orderInformation') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
          <div class="flex gap-2 justify-between">
            <div class="flex-left">
              <div class="flex gap-4 pt-4 items-center">
                <label class="text-right w-[170px]">{{ t('formDemo.orderCode') }}</label>
                <div class="text-xl">{{ pawnOrderCode }}</div>
              </div>
              <div class="flex gap-4 py-2 items-center">
                <label class="text-right w-[170px]">{{ t('formDemo.pawnTime') }}</label>
                <div class="w-[60%] text-black dark:text-light-50"
                  >{{ dateTimeFormat(ruleForm.pawnTerm[0]) }} đến
                  {{ dateTimeFormat(ruleForm.pawnTerm[1]) }}</div
                >
              </div>
              <div class="flex gap-4 pb-4 items-center">
                <label class="text-right w-[170px]"
                  >{{ t('formDemo.pawnFeePaymentTime') }}<span class="text-red-500">*</span></label
                >

                <div class="">
                  <div class=""> {{ ruleForm.paymentPeriod }} {{ t('formDemo.day') }} </div>
                </div>
              </div>
            </div>

            <div class="flex-right">
              <div class="flex-1 flex items-start gap-4">
                <span>
                  <div>Mã QR đơn hàng</div>
                </span>

                <span class="border"><Qrcode :width="100" :text="'QR'" /></span> </div
            ></div>
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
            <span class="w-[28%] text-base font-bold break-w">{{
              t('formDemo.productInformationPawn')
            }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
        </div>
        <div class="pt-2 pb-2">
          <el-table ref="singleTableRef" :data="tablePawnSlip" border style="width: 100%">
            <el-table-column label="STT" type="index" width="60" align="center" />
            <el-table-column prop="productCode" :label="t('reuse.productCode')" width="120" />
            <el-table-column prop="productName" :label="t('formDemo.commodityName')" width="280" />

            <el-table-column prop="accessory" :label="t('reuse.accessory')" width="100" />
            <el-table-column prop="code" :label="t('formDemo.code')" width="100" />

            <el-table-column prop="quantity" :label="t('reuse.pawnNumber')" width="100" />
            <el-table-column prop="unitName" :label="t('reuse.unit')" />
          </el-table>

          <div class="flex justify-end">
            <div class="w-[80%] text-right">
              <p class="-white">Tổng dư nợ gốc cầm đồ</p>
            </div>
            <div class="w-[20%] text-right">
              <p class="pr-2 text-black dark:text-white">{{ '0 đ' }}</p>
            </div>
          </div>

          <div class="flex justify-end">
            <div class="w-[80%] text-right">
              <p class="text-black dark:text-white">Tiền phí cầm đồ/1tr/ngày</p>
            </div>
            <div class="w-[20%] text-right">
              <p class="pr-2 text-black dark:text-white">{{ '0 đ' }}</p>
            </div>
          </div>

          <div class="flex justify-end">
            <div class="w-[80%] text-right">
              <p class="text-black dark:text-white">Số ngày cầm đồ thực tế</p>
            </div>
            <div class="w-[20%] text-right">
              <p class="pr-2 text-black dark:text-white">{{ '0 đ' }}</p>
            </div>
          </div>

          <div class="flex justify-end">
            <div class="w-[80%] text-right">
              <p class="text-black font-bold dark:text-white">{{ t('formDemo.intoMoneyPawn') }}</p>
            </div>
            <div class="w-[20%] text-right">
              <p class="pr-2 text-black font-bold dark:text-white">{{ '0 đ' }}</p>
            </div>
          </div>
        </div>
        <div class="flex items-center">
          <span class="w-[25%] text-base font-bold">{{ t('formDemo.billingInformation') }}</span>
          <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
        </div>
        <div>
          <div class="flex gap-4 pt-2 items-center">
            <label class="w-[30%] text-right">{{ t('formDemo.paymentOfPawnPrincipal') }}</label>
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
          <span class="dialog-footer">
            <el-button
              type="primary"
              class="min-w-42 min-h-11"
              @click="
                () => {
                  dialogFeePaymentSlip = false
                  postOrderStransaction(1)
                }
              "
              >{{ t('formDemo.saveRecordDebts') }}</el-button
            >
            <el-button class="min-w-42 min-h-11" @click="dialogFeePaymentSlip = false">{{
              t('reuse.exit')
            }}</el-button>
          </span>
        </template>
      </el-dialog>

      <!-- Thông tin phiếu thanh toán tiền đàm phán -->
      <el-dialog v-model="dialogDepositSlip" :title="t('formDemo.negotiatedPaymentInformation')" width="40%" align-center>
        <div>
          <el-divider />
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('formDemo.orderInformation') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
          <div class="flex gap-2 justify-around">
            <div class="flex-left">
              <div class="flex gap-4 pt-4 pb-4 items-center">
                <label class="text-right">{{ t('formDemo.orderCode') }}</label>
                <p class="font-bold text-xl">{{ pawnOrderCode }}</p>
              </div>
              <div class="flex gap-4 pb-4 items-center">
                <label class="text-right w-[170px]"
                  >{{ t('formDemo.pawnTime') }}<span class="text-red-500">*</span></label
                >
                <div class="w-[60%] text-black dark:text-light-50">
                  {{ dateTimeFormat(ruleForm.pawnTerm[0]) }} đến
                  {{ dateTimeFormat(ruleForm.pawnTerm[1]) }}
                </div>
              </div>
            </div>
            <div class="flex-right">
              <div class="flex-1 flex items-start gap-4">
                <span>
                  <div>Mã QR đơn hàng</div>
                </span>
      
                <span class="border">
                  <Qrcode :width="100" :text="'QR'" />
                </span>
              </div>
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
            <span v-if="typeDialog == 1" class="w-[35%] text-base font-bold break-w">{{
            t('formDemo.productInformationSaleConsign')
            }}</span>
            <span v-else-if="typeDialog == 3" class="w-[35%] text-base font-bold break-w">{{
            t('formDemo.productInformationSaleRental')
            }}</span>
            <span v-else class="w-[35%] text-base font-bold break-w">{{
            t('formDemo.productInformationSaleSpa')
            }}</span>
            <span class="block h-1 w-[60%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
        </div>
        <div class="pt-2 pb-2">
          <el-table v-if="typeDialog == 1" ref="singleTableRef" :data="tablePaymentSlip" border style="width: 100%">
            <el-table-column label="STT" type="index" width="60" align="center" />
            <el-table-column prop="productCode" :label="t('reuse.productCode')" min-width="180" />
            <el-table-column prop="productName" :label="t('formDemo.commodityName')" min-width="280" />
      
            <el-table-column prop="createdAt" :label="t('formDemo.saleDate')" min-width="150">
              <template #default="data">
                <div>{{ dateTimeFormat(data.row.createdAt) }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="unitPrice" label="Giá bán" min-width="100">
              <template #default="props">
                {{ changeMoney.format(props.row.unitPrice) }}
              </template>
            </el-table-column>
            <el-table-column prop="consignmentPrice" :label="t('formDemo.consignmentPriceForSale')" min-width="150">
              <template #default="props">
                {{ changeMoney.format(props.row.consignmentPrice) }}
              </template>
            </el-table-column>
            <el-table-column prop="negotiablePrice" :label="t('formDemo.negotiablePrice')" min-width="150">
              <template #default="data">
                <CurrencyInputComponent v-model="data.row.negotiablePrice" @change="changePriceNegotiable(data)" />
              </template>
            </el-table-column>
            <el-table-column prop="totatlPriceSale" :label="t('formDemo.payment')" min-width="150">
              <template #default="props">
                {{ changeMoney.format(props.row.totatlPriceSale) }}
              </template>
            </el-table-column>
            <div>
              <div>
                <span></span>
                <span></span>
              </div>
            </div>
          </el-table>
      
          <el-table v-else-if="typeDialog == 3" ref="singleTableRef" :data="tablePaymentSlip" border style="width: 100%">
            <el-table-column label="STT" type="index" width="60" align="center" />
            <el-table-column prop="productCode" :label="t('reuse.productCode')" min-width="180" />
            <el-table-column prop="productName" :label="t('formDemo.commodityName')" min-width="280" />
      
            <el-table-column prop="createdAt" :label="t('formDemo.rentalDate')" min-width="150">
              <template #default="data">
                <div>{{ dateTimeFormat(data.row.createdAt) }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="totatlPriceRental" :label="t('formDemo.rentalPayment')" min-width="100">
              <template #default="props">
                {{ changeMoney.format(props.row.totatlPriceRental) }}
              </template>
            </el-table-column>
            <el-table-column prop="consignmentPrice" :label="t('formDemo.depositpriceForRental')" min-width="150">
              <template #default="props">
                {{ changeMoney.format(props.row.consignmentPrice) }}
              </template>
            </el-table-column>
            <el-table-column prop="negotiablePrice" :label="t('formDemo.negotiablePrice')" min-width="150">
              <template #default="data">
                <CurrencyInputComponent v-model="data.row.negotiablePrice" @change="changePriceNegotiable(data)" />
              </template>
            </el-table-column>
            <el-table-column prop="totatlPricesRental" :label="t('formDemo.payment')" min-width="150">
              <template #default="props">
                {{ changeMoney.format(props.row.totatlPricesRental) }}
              </template>
            </el-table-column>
          </el-table>
      
          <el-table v-else ref="singleTableRef" :data="tablePaymentSlip" border style="width: 100%">
            <el-table-column label="STT" type="index" width="60" align="center" />
            <el-table-column prop="productCode" :label="t('reuse.productCode')" min-width="180" />
            <el-table-column prop="productName" :label="t('formDemo.commodityName')" min-width="280" />
      
            <el-table-column prop="createdAt" :label="t('formDemo.spaDate')" min-width="150">
              <template #default="data">
                <div>{{ dateTimeFormat(data.row.createdAt) }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="spaService" :label="t('formDemo.spaService')" min-width="150" />
            <el-table-column prop="totalPriceSpa" :label="t('formDemo.spaFeePayment')" min-width="150">
              <template #default="props">
                {{ changeMoney.format(props.row.totalPriceSpa) }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div>
          <div class="flex gap-4 pt-2 items-center">
            <label class="w-[30%] text-right">Thanh toán</label>
            <div class="w-[100%]">
              <el-checkbox v-model="alreadyPaidForTt" :label="t('formDemo.alreadyPaidForTt')" size="large" />
            </div>
          </div>
          <div class="flex gap-4 pt-2 pb-4 items-center">
            <label class="w-[30%] text-right">{{ t('formDemo.formPayment') }}</label>
            <el-select v-model="payment" placeholder="Select">
              <el-option v-for="item in choosePayment" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
          <div class="flex gap-4 pb-2 items-center">
            <label class="w-[30%] text-right">Trạng thái</label>
            <div class="flex items-center w-[100%]">
              <span
                class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-neutral-900 dark:bg-transparent"></span>
              <span class="box dark:text-black">
                Khởi tạo & ghi sổ
                <span class="triangle-right"> </span>
              </span>
            </div>
          </div>
        </div>
        <template #footer>
          <div class="flex justify-end">
            <div>
              <span class="dialog-footer">
                <el-button class="min-w-42 min-h-11" type="primary" @click="updateAccount">
                  {{ t('formDemo.saveRecordDebts') }}
                </el-button>
                <el-button class="min-w-42 min-h-11 pl-2" @click="dialogDepositSlip = false">{{
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
        width="40%"
        align-center
      >
        <div>
          <el-divider />
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('formDemo.orderInformation') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>

          <div class="flex gap-4 pt-4 pb-4 items-center justify-between">
            <div class="flex-left">
              <div class="flex gap-4 py-2 items-center">
                <label class="text-right w-[170px]">{{ t('formDemo.orderCode') }}</label>
                <div class="text-xl">{{ pawnOrderCode }}</div>
              </div>
              <div class="flex gap-4 pb-4 items-center">
                <label class="text-right w-[170px]"
                  >{{ t('formDemo.pawnTime') }}<span class="text-red-500">*</span></label
                >
                <div class="text-xl">20/20/2022</div>
              </div>
            </div>

            <div class="flex-right">
              <div class="flex-1 flex items-start gap-4">
                <span>
                  <div>Mã QR đơn hàng</div>
                </span>

                <span class="border"><Qrcode :width="100" :text="'QR'" /></span>
              </div>
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
              t('formDemo.certificateInformationAndServiceArising')
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
            <el-table-column prop="content" :label="t('formDemo.kindOfMoney')" width="120">
              <el-select v-model="value" class="m-2" placeholder="Select">
                <el-option
                  v-for="item in optionsChooseMoneyType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-table-column>
            <el-table-column prop="collected" :label="t('formDemo.collected')" width="90">
              <template #default="props">
                <CurrencyInputComponent
                  @change="(data) => autoChangeMoneyAccountingEntry(data, props)"
                  class="handle-fix"
                  v-model="props.row.collected"
                />
              </template>
            </el-table-column>
            <el-table-column prop="spent" :label="t('formDemo.spent')">
              <template #default="props">
                <CurrencyInputComponent
                  @change="(data) => autoChangeMoneyAccountingEntry(data, props)"
                  class="handle-fix"
                  v-model="props.row.spent"
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
              <p class="text-black font-bold dark:text-white">Tổng thanh toán</p>
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
          <div class="btn-save">
            <span class="dialog-footer">
              <el-button
                type="primary"
                @click="
                  () => {
                    postOrderStransaction(4)
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

      <!-- Dialog Thông tin phiếu thu -->
      <el-dialog
        v-model="dialogInformationReceipts"
        :title="t('formDemo.informationReceipts')"
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
            <div class="w-[100%] text-xl font-bold">{{ pawnOrderCode }}</div>
          </div>
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('formDemo.generalInformation') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
          <div>
            <div class="flex gap-4 pt-4 items-center">
              <label class="w-[30%] text-right">{{ t('formDemo.receiptsCode') }}</label>
              <div class="w-[100%] text-xl font-bold">{{ codeReceipts }}</div>
            </div>
            <div class="flex gap-4 pt-4 items-center">
              <label class="w-[30%] text-right"
                >{{ t('formDemo.recharger') }} <span class="text-red-500">*</span></label
              >
              <el-select v-model="inputRecharger" placeholder="Chọn người nộp tiền">
                <el-option
                  v-for="item in optionsCustomerApi"
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
            <label class="w-[30%] text-right">Số tiền thu</label>
            <div class="w-[100%] text-xl">{{ changeMoney.format(moneyReceipts) }}</div>
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
            <!-- <el-button @click="printPage('recpPaymentPrint')">{{ t('button.print') }}</el-button> -->
            <el-button>In phiếu</el-button>
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
        v-model="dialogPaymentVoucher"
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
            <div class="w-[100%] text-xl font-bold">{{ pawnOrderCode }}</div>
          </div>
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('formDemo.generalInformation') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
          <div>
            <div class="flex gap-4 pt-4 items-center">
              <label class="w-[30%] text-right">{{ t('formDemo.codePayment') }}</label>
              <div class="w-[100%] text-xl font-bold">{{ codeExpenditures }}</div>
            </div>
            <div class="flex gap-4 pt-4 items-center">
              <label class="w-[30%] text-right"
                >{{ t('formDemo.moneyReceiver') }} <span class="text-red-500">*</span></label
              >
              <el-select v-model="inputRecharger" placeholder="Chọn người nhận tiền">
                <el-option
                  v-for="item in optionsCustomerApi"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div class="flex gap-4 pt-4 pb-6 items-center">
              <label class="w-[30%] text-right"
                >{{ t('formDemo.reasonsSpendMoney') }} <span class="text-red-500">*</span></label
              >
              <el-input
                v-model="inputReasonCollectMoney"
                style="width: 100%"
                :placeholder="t('formDemo.enterReasonForThePayment')"
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
            <label class="w-[30%] text-right">Số tiền chi</label>
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
            <!-- <el-button @click="printPage('recpPaymentPrint')">{{ t('button.print') }}</el-button> -->
            <el-button>In phiếu</el-button>
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

      <!-- Thông tin chuộc hàng trước thời hạn-->
      <ReturnOrder
        v-model="changeReturnGoods"
        :orderId="id"
        :orderData="rentReturnOrder"
        :listProductsTable="listOfOrderProduct"
        @add-row="addRow"
        @remove-row="removeRow"
        @post-return-request="postReturnRequest"
        :orderStatusType="4"
        :type="4"
      />
      <ReturnOrder
        v-model="changeReturnGoods"
        :orderId="id"
        :orderData="rentReturnOrder"
        :listProductsTable="listOfOrderProduct"
        @add-row="addRow"
        @post-return-request="postReturnRequest"
        :orderStatusType="5"
        :type="4"
      />
      <ReturnOrder
        v-model="dutHang"
        :orderId="id"
        :orderData="rentReturnOrder"
        :listProductsTable="listOfOrderProduct"
        @add-row="addRow"
        @post-return-request="postReturnRequest"
        :orderStatusType="6"
        :type="4"
      />
      <ReturnOrder
        v-model="giaHan"
        :orderId="id"
        :orderData="rentReturnOrder"
        :listProductsTable="listProducts"
        @add-row="addRow"
        @post-return-request="postReturnRequest"
        :orderStatusType="7"
        @extend-date="extendDate"
        :type="4"
      />

      <!-- Dialog Thông tin phiếu đề nghị thanh toán -->
      <el-dialog
        v-model="dialogIPRForm"
        :title="t('formDemo.informationPaymentRequestForm')"
        width="40%"
        align-center
      >
        <div>
          <el-divider />
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('formDemo.orderInformation') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
            <!-- <button @click="testDialog = true">Test</button> -->
          </div>
          <div class="flex gap-4 pt-4 pb-4 items-center justify-between">
            <div class="flex gap-4 py-2 items-center">
              <label class="text-right w-[170px] font-bold">{{ t('formDemo.orderCode') }}</label>
              <div class="text-xl">{{ pawnOrderCode }}</div>
            </div>
          </div>
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('router.analysis') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
          <div>
            <div class="flex gap-4 pt-4 items-center">
              <label class="w-[30%] text-right">{{ t('formDemo.PaymentRequestCode') }}</label>
              <div class="w-[100%] text-xl font-bold">{{ codePaymentRequest }}</div>
            </div>
            <div class="flex gap-4 pt-4 items-center">
              <label class="w-[30%] text-right"
                >{{ t('formDemo.proponent') }} <span class="text-red-500">*</span></label
              >
              <el-select v-model="inputRecharger" placeholder="Chọn người đề nghị">
                <el-option
                  v-for="item in optionsCustomerApi"
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
              <el-table-column prop="unitPrices" :label="t('reuse.unitPrice')">
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
              <p class="text-blue-400 mb-2">Đặt cọc <span class="text-red-500">*</span></p>
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
            <!-- <el-button @click="printPage('IPRFormPrint')">{{ t('button.print') }}</el-button> -->
            <el-button>In phiếu</el-button>
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

      <el-collapse-item :name="collapse[3].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[3].icon" link />
          <span class="text-center text-xl">{{ collapse[3].title }}</span>
        </template>
        <div>
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
              min-width="600"
            />
            <el-table-column prop="accessory" :label="t('reuse.accessory')" width="180">
              <template #default="data">
                <div>{{ data.row.accessory }}</div>
              </template>
            </el-table-column>

            <el-table-column prop="quantity" :label="t('formDemo.amount')" width="150" />
            <el-table-column prop="unitName" :label="t('reuse.dram')" width="120" />

            <el-table-column
              prop="invoiceGoodsEnteringWarehouse"
              :label="t('formDemo.deliveryNotesExportWarehouse')"
              align="left"
              width="200"
            >
              <template #default="props">
                <div class="text-blue-500">
                  {{ props.row.warehouseTicketCode }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="returnDetailStatusName" :label="t('formDemo.status')" />
          </el-table>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<style scoped>
@media screen {
  #billPawn {
    display: none;
  }
  .dialog-content {
    display: block;
  }
}

.css-form_has-child > .el-form-item {
  margin: 0;
}
::v-deep(.el-select) {
  width: 100%;
}
::v-deep(.el-range-editor.el-input__wrapper) {
  width: 100%;
}
::v-deep(.el-textarea__inner) {
  box-shadow: none;
  padding: 5px 0;
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

::v-deep(.el-overlay-dialog) {
  overflow-y: initial;
}

::v-deep(.el-dialog__body) {
  max-height: 80vh;
  overflow-y: auto;
}

::v-deep(.el-dialog) {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
.duplicate-status + .duplicate-status {
  margin-left: 10px;
}
.active {
  opacity: 1 !important;
}
.limit-text {
  white-space: nowrap;
  width: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
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

::v-deep(.el-form-item) {
  display: flex;
  align-items: center;
}

::v-deep(.el-upload--picture-card) {
  width: 160px;
  height: 40px;
  border: 1px solid #409eff;
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
::v-deep(.d-block > .el-row) {
  display: block;
}
::v-deep(.el-dialog__title) {
  font-weight: bold;
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
::v-deep(.el-select .el-input) {
  width: 100% !important;
}

#content {
  height: 200px;
  overflow: auto;
  padding: 0 10px;
}
</style>
