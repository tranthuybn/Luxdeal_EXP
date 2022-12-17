<script setup lang="ts">
import { onBeforeMount, onMounted, reactive, ref, unref, watch } from 'vue'
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
  ElDatePicker,
  FormRules,
  ElForm,
  ElTreeSelect,
  ElFormItem,
  FormInstance,
  UploadUserFile,
  ElNotification
} from 'element-plus'
import MultipleOptionsBox from '@/components/MultipleOptionsBox.vue'
import billLoanConfirmation from '../../Components/formPrint/src/billLoanConfirmation.vue'
import type { UploadFile } from 'element-plus'
import { dateTimeFormat, formatOrderReturnReason } from '@/utils/format'
import ReturnOrder from './ReturnOrder.vue'
import { FORM_IMAGES } from '@/utils/format'

import ProductAttribute from '../../ProductsAndServices/ProductLibrary/ProductAttribute.vue'
import {
  getProductsList,
  getCollaboratorsInOrderList,
  getAllCustomer,
  addNewSpaOrders,
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
  GetProductPropertyInventory
} from '@/api/Business'
import { useIcon } from '@/hooks/web/useIcon'
import { Collapse } from '../../Components/Type'
import moment from 'moment'
import { useRoute, useRouter } from 'vue-router'
import { PRODUCTS_AND_SERVICES } from '@/utils/API.Variables'
import CurrencyInputComponent from '@/components/CurrencyInputComponent.vue'

import { getCategories } from '@/api/LibraryAndSetting'
const { t } = useI18n()

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)

// const props = defineProps({
//   tabSelect: {
//     type: String,
//     default: ''
//   }
// })

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

const options = [
  {
    value: 'Option1',
    label: 'Option1'
  },
  {
    value: 'Option2',
    label: 'Option2'
  }
]

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
const id = Number(router.currentRoute.value.params.id)
const route = useRoute()
const type = String(route.params.type)

interface ListOfProductsForSaleType {
  name: string
  productCode: string
  productName: string
  productPropertyCode: string
  productPropertyName: string
  id: string
  productPropertyId: string
  spaServices: string
  amountSpa: number
  quantity: string
  businessManagement: {}
  accessory: string | undefined
  warehouseInfo: {}
  unitName: string
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
  productPropertyId: '',
  quantity: '1',
  accessory: '',
  businessManagement: {},
  warehouseInfo: {},
  unitName: 'Cái',
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

// debtTable
interface tableDataType {
  [x: string]: any
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

const ListFileUpload = ref<UploadUserFile[]>([])
const removeListProductsSale = (index) => {
  if (!ListOfProductsForSale[ListOfProductsForSale.value.length - 1]) {
    ListOfProductsForSale.value.splice(index, 1)
  }
}

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
    value: 'deliveryAtTheCounter',
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
const quickManagementCode = ref()
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
    productPropertyCode: quickManagementCode.value,
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

const checked2 = ref(false)
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

const newCodePaymentRequest = async () => {
  codePaymentRequest.value = await getCodePaymentRequest()
}

// Call api danh sách sản phẩm
const listProducts = ref()

const pageIndexProducts = ref(1)
const callAPIProduct = async () => {
  const res = await getProductsList({ PageIndex: pageIndexProducts.value, PageSize: 20 })
  if (res.data && res.data?.length > 0) {
    listProducts.value = res.data.map((product) => ({
      productCode: product.code,
      value: product.productCode,
      name: product.name ?? '',
      price: product.price.toString(),
      productPropertyId: product.id.toString(),
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

const getValueOfSelected = (_value, obj, scope) => {
  scope.row.productPropertyId = obj.productPropertyId
  scope.row.productCode = obj.value
  scope.row.productName = obj.name
  scope.row.price = obj.price
  scope.row.finalPrice = (parseInt(scope.row.quantity) * parseInt(scope.row.price)).toString()
}

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
  await formEl.validate((valid, fields) => {
    if (valid) {
      return 'submit'
    } else {
      return fields
    }
  })
  await formEl2.validate((valid, fields) => {
    if (valid) {
      checkValidateForm.value = true
      return 'submit!'
    } else {
      return fields
    }
  })
}

const dialogInformationReceipts = ref(false)
const dialogPaymentVoucher = ref(false)
const dialogIPRForm = ref(false)
const valueProvince = ref('')
const valueCommune = ref('')

const ruleFormRef = ref<FormInstance>()
const ruleFormRef2 = ref<FormInstance>()

const ruleForm = reactive({
  orderCode: 'DHB039423',
  collaborators: '',
  pawnTerm: '',
  paymentPeriod: 10,
  collaboratorCommission: '',
  orderNotes: '',
  customerName: '',
  delivery: ''
})
const inputDeposit = ref(0)

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
  paymentPeriod: [
    {
      required: true,
      message: 'Nhập kỳ thanh toán ',
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
const valueDistrict = ref('')

const enterdetailAddress = ref('')

const valueSelectCustomer = ref(t('formDemo.customer'))
const optionsCustomer = [
  {
    value: 'customer',
    label: t('formDemo.customer')
  }
]
let orderDetailsTable = reactive([{}])
// tạo đơn hàng
const { push } = useRouter()
const checkDisabled = ref(false)
const postData = async () => {
  submitForm(ruleFormRef.value, ruleFormRef2.value)
  if (checkValidateForm.value) {
    orderDetailsTable = ListOfProductsForSale.value.map((val) => ({
      ProductPropertyId: parseInt(val.productPropertyId),
      Quantity: parseInt(val.quantity),
      ProductPrice: val.price,
      SoldPrice: val.finalPrice,
      WarehouseId: 1,
      IsPaid: true,
      Accessory: val.accessory
    }))
    orderDetailsTable.pop()
    const productPayment = JSON.stringify([...orderDetailsTable])

    const payload = {
      ServiceType: 4,
      OrderCode: ruleForm.orderCode,
      PromotionCode: 'AA12',
      CollaboratorId: ruleForm.collaborators,
      CollaboratorCommission: ruleForm.collaboratorCommission,
      Description: ruleForm.orderNotes,
      CustomerId: 2,
      DeliveryOptionId: ruleForm.delivery,
      ProvinceId: valueProvince.value ?? 1,
      DistrictId: valueDistrict.value ?? 1,
      WardId: valueCommune.value ?? 1,
      Address: enterdetailAddress.value,
      OrderDetail: productPayment,
      CampaignId: 2,
      VAT: 1,
      Status: 1
    }
    const formDataPayLoad = FORM_IMAGES(payload)
    await addNewSpaOrders(formDataPayLoad)
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
  }
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

const changeMoney = new Intl.NumberFormat('vi', {
  style: 'currency',
  currency: 'vnd',
  minimumFractionDigits: 0
})

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
  dialogFeePaymentSlip.value = !dialogFeePaymentSlip.value
  nameDialog.value = 'deposit'
}
const dialogPawnCouponInfomation = ref(false)
function openBillPawnDialog() {
  dialogPawnCouponInfomation.value = !dialogPawnCouponInfomation.value
  nameDialog.value = 'billPawn'
}

function openReceiptDialog() {
  dialogInformationReceipts.value = !dialogInformationReceipts.value
  nameDialog.value = 'Phiếu thu'
}

function openPaymentDialog() {
  dialogPaymentVoucher.value = !dialogPaymentVoucher.value
  nameDialog.value = 'Phiếu chi'
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

// Dialog trả hàng trước hạn
const changeReturnGoods = ref(false)
const dutHang = ref(false)
const giaHan = ref(false)

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

const getOrderStransactionList = async () => {
  const transaction = await getOrderTransaction({ id: id })
  debtTable.value = transaction.data
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
    collected: '',
    spent: '',
    intoMoney: ''
  }
])
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
var autoCodeReturnRequest = 'DT' + moment().format('hms')
const codeReturnRequest = ref()

let childrenTable = ref()
let objOrderStransaction = ref()
let idStransaction = ref()
// Thêm bút toán cho đơn hàng
const postOrderStransaction = async (index: number) => {
  childrenTable.value = ListOfProductsForSale.value.map((val) => ({
    merchadiseTobePayforId: parseInt(val.productPropertyId),
    quantity: parseInt(val.quantity)
  }))

  childrenTable.value.pop()
  codeReturnRequest.value = autoCodeReturnRequest
  const payload = {
    orderId: id,
    content:
      index == 1
        ? t('formDemo.billPawn')
        : index == 2
        ? t('formDemo.feePaymentSlip')
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

// Lý do thu tiền
const inputReasonCollectMoney = ref()

let objidPT = ref()
let idPT = ref()
// Thêm mới phiếu thu
const postPT = async () => {
  const payload = {
    Code: codeReceipts.value,
    TotalMoney: 21325465,
    TypeOfPayment: 1,
    status: 1,
    PeopleType: 1,
    PeopleId: 2,
    OrderId: 117,
    Type: 0,
    Description: inputReasonCollectMoney.value,
    AccountingEntryId: undefined
  }
  const formDataPayLoad = FORM_IMAGES(payload)
  objidPT.value = await addTPV(formDataPayLoad)
  idPT.value = objidPT.value.receiptAndpaymentVoucherId
}

let objidPC = ref()
let idPC = ref()
// Thêm mới phiếu chi
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

const openDialogChooseWarehouse = ref(false)
const dialogbusinessManagement = ref(false)

const tableWarehouse = ref([])

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
  tableWarehouse.value = res.data.map((val) => ({
    warehouseCheckbox: val.id,
    name: val.name,
    inventory: val.inventory
  }))
}

const showIdWarehouse = (scope) => {
  radioWarehouseId.value = scope.row.warehouseCheckbox
  ListOfProductsForSale.value[indexRowWarehouse.value].warehouseId = radioWarehouseId.value
  ListOfProductsForSale.value[indexRowWarehouse.value].warehouseName = scope.row.name
}

const formBusuness = reactive({
  id: 1,
  check: '',
  applyExport: ''
})

const listApplyExport = [
  {
    id: 1,
    check: true,
    applyExport: 'Ký gửi bán'
  },
  {
    id: 2,
    check: true,
    applyExport: 'Ký gửi cho thuê'
  },
  {
    id: 3,
    check: true,
    applyExport: 'spa'
  }
]
const indexRow = ref()

let newTable = ref()
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const handleSelectionChange = (val: tableDataType[]) => {
  newTable.value = val
}
const handleSelectionbusinessManagement = (val: tableDataType[]) => {
  ListOfProductsForSale.value[indexRow.value].businessManagement = val.map((e) => ({
    label: e.applyExport,
    value: e.id
  }))
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

const optionsFeePaymentTime = [
  {
    value: 'Option1',
    label: 'Option1'
  },
  {
    value: 'Option2',
    label: 'Option2'
  },
  {
    value: 'Option3',
    label: 'Option3'
  }
]

let formData = reactive({})
const handle = () => {
  formData = {
    customerName: ruleForm.customerName,
    date: new Date(),
    priceBillPawn: priceintoMoneyPawnGOC.value,
    phone: 1212321
  }
}

const editData = async () => {
  if (type == 'detail') checkDisabled.value = true
  if (type == 'edit' || type == 'detail') {
    const res = await getOrderList({ Id: id, ServiceType: 4 })
    const transaction = await getOrderTransaction({ id: id })
    if (debtTable.value.length > 0) debtTable.value.splice(0, debtTable.value.length - 1)
    debtTable.value = transaction.data

    getReturnRequestTable()

    const orderObj = { ...res.data[0] }
    dataEdit.value = orderObj
    if (res.data) {
      ruleForm.orderCode = orderObj.code
      ruleForm.collaborators = orderObj.collaboratorCode
      ruleForm.collaboratorCommission = orderObj.CollaboratorCommission
      ruleForm.customerName = orderObj.customer.isOrganization
        ? orderObj.customer.representative + ' | ' + orderObj.customer.taxCode
        : orderObj.customer.name + ' | ' + orderObj.customer.phonenumber
      ruleForm.orderNotes = orderObj.description

      totalOrder.value = orderObj.totalPrice
      if (ListOfProductsForSale.value.length > 0)
        ListOfProductsForSale.value.splice(0, ListOfProductsForSale.value.length - 1)
      ListOfProductsForSale.value = orderObj.orderDetails
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

const getReceiptCode = async () => {
  codeReceipts.value = await getReceiptPaymentVoucher()
}

const getcodeExpenditures = async () => {
  codeExpenditures.value = await getReceiptPaymentVoucher()
}
let formDetailPaymentReceipt = ref()
// Lấy chi tiết phiếu thu chi
const getDetailPayment = () => {
  openReceiptDialog()
}
const dialogAccountingEntryAdditional = ref(false)

// xem chi tiết lịch sử công nợ theo id
let tableSalesSlip = ref()
let formAccountingId = ref()
const getAccountingEntry = async (index, num) => {
  const res = await getDetailAccountingEntryById({ id: index })
  formAccountingId.value = { ...res.data }
  tableSalesSlip.value = formAccountingId.value.paidMerchandises
  tableAccountingEntry.value = formAccountingId.value.accountingEntry

  if (num == 1) {
    dialogPawnCouponInfomation.value = true
  } else if (num == 2) {
    dialogFeePaymentSlip.value = true
  } else {
    dialogAccountingEntryAdditional.value = true
  }
}

const priceintoMoneyPawnGOC = ref(0)
const priceintoMoneyByday = ref(0)

const valueFeePaymentTime = ref(optionsFeePaymentTime[0])

const codeReceipts = ref()
const codeExpenditures = ref()
const codePaymentRequest = ref()
// Bút toán bổ sung
const alreadyPaidForTt = ref(true)

const activeName = ref(collapse[0].name)
var curDate = 'CD' + moment().format('hhmmss')
var autoCodePawnOrder = 'CD' + moment().format('hmmss')
var autoCodeReceipts = 'PT' + moment().format('hmmss')
var autoCodeExpenditures = 'PC' + moment().format('hmmss')
var autoCodePaymentRequest = 'DNTT' + moment().format('hhmmss')
const dialogBillLiquidation = ref(false)
onBeforeMount(() => {
  callCustomersApi()
  callApiCollaborators()
  callAPIProduct()

  if (type == 'add') {
    ruleForm.orderCode = curDate
    pawnOrderCode.value = autoCodePawnOrder
    codeReceipts.value = autoCodeReceipts
    codeExpenditures.value = autoCodeExpenditures
    codePaymentRequest.value = autoCodePaymentRequest
  }
})

onMounted(async () => {
  await editData()
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
                  v-model="ruleForm.orderCode"
                  style="width: 100%"
                  :placeholder="t('formDemo.enterOrderCode')"
                />
              </el-form-item>

              <el-form-item :label="t('formDemo.pawnTerm')" prop="pawnTerm">
                <el-date-picker
                  v-model="ruleForm.pawnTerm"
                  type="daterange"
                  :start-placeholder="t('formDemo.startDay')"
                  :end-placeholder="t('formDemo.endDay')"
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
                    style="width: 100%"
                    :placeholder="t('reuse.byDay')"
                  />
                </el-form-item>
                <p class="text-right text-[#FECB80] w-[165px]">{{
                  t('formDemo.atLeastTenDays')
                }}</p>
              </div>
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
                width="650px"
                :items="listProducts"
                valueKey="productPropertyId"
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
          <el-table-column prop="accessory" :label="t('reuse.accessory')" width="180">
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
          <el-table-column prop="quantity" :label="t('reuse.pawnNumber')" align="center" width="90">
            <template #default="data">
              <el-input
                v-model="data.row.quantity"
                @change="handleTotal(data)"
                v-if="data.row.edited"
                style="width: 100%"
              />
            </template>
          </el-table-column>

          <el-table-column prop="unitName" :label="t('reuse.dram')" align="center" width="120" />
          <el-table-column
            :label="t('formDemo.businessManagement')"
            width="200"
            prop="businessManagement"
          >
            <template #default="data">
              <div class="flex w-[100%]">
                <div class="flex-1 limit-text">
                  <span v-for="item in data.row.businessManagement" :key="item.value">{{
                    item.label
                  }}</span>
                </div>
                <div class="flex-1 text-right">
                  <el-button
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

          <el-table-column prop="warehouseName" :label="t('reuse.importWarehouse')" width="200">
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

          <el-table-column :label="t('formDemo.manipulation')" align="center" min-width="90">
            <template #default="scope">
              <div class="flex gap-2">
                <el-button @click.prevent="removeListProductsSale(scope.$index)" type="danger">{{
                  t('reuse.delete')
                }}</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-button class="ml-4 mt-4" @click="addLastIndexSellTable"
          >+ {{ t('formDemo.add') }}</el-button
        >

        <div class="flex justify-end pt-4">
          <div class="w-50">
            <div class="text-black font-bold dark:text-[#fff]"
              >{{ t('formDemo.intoMoneyPawnGOC') }} <span class="text-red-500">*</span></div
            >
          </div>

          <div class="w-30"> <CurrencyInputComponent v-model="priceintoMoneyPawnGOC" /> </div>

          <div class="w-60 pl-2">
            <div class="dark:text-[#fff] text-transparent dark:text-transparent">s</div>

            <div class="dark:text-[#fff] text-transparent dark:text-transparent">s</div>
          </div>
        </div>

        <div class="flex justify-end pt-4">
          <div class="w-50">
            <div class="text-black font-bold dark:text-[#fff]"
              >{{ t('reuse.intoMoneyByday') }} <span class="text-red-500">*</span></div
            >
          </div>

          <div class="w-30"> <CurrencyInputComponent v-model="priceintoMoneyByday" /> </div>

          <div class="w-60 pl-2">
            <div class="dark:text-[#fff] text-transparent dark:text-transparent">s</div>

            <div class="dark:text-[#fff] text-transparent dark:text-transparent">s</div>
          </div>
        </div>

        <div class="w-[100%]">
          <el-divider content-position="left">{{ t('formDemo.statusAndManipulation') }}</el-divider>
        </div>
        <div class="flex gap-4 w-[100%] ml-1 items-center pb-3">
          <label class="w-[9%] text-right">{{ t('formDemo.orderStatus') }}</label>
          <div class="w-[84%] pl-1">
            <el-checkbox v-model="checked2" :label="t('reuse.closedTheOrder')" size="large" />
          </div>
        </div>
        <div class="flex w-[100%] ml-1 items-center pb-3">
          <label class="w-[11%] text-right">{{ t('formDemo.orderStatus') }}</label>
          <div class="w-[89%] pl-1">
            <span
              class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-black dark:bg-transparent"
            ></span>
            <span class="box box_1 text-yellow-500 dark:text-black">
              Đang duyệt

              <span class="triangle-right right_1"> </span>
            </span>
          </div>
        </div>
        <div class="w-[100%] flex gap-4">
          <div class="ml-[10%] w-[100%] flex ml-1 gap-4">
            <el-button class="min-w-42 min-h-11" @click="openBillPawnDialog">{{
              t('formDemo.billPawn')
            }}</el-button>

            <el-button class="min-w-42 min-h-11" @click="openDepositDialog">{{
              t('formDemo.feePaymentSlip')
            }}</el-button>
            <el-button @click="postData" type="primary" class="min-w-42 min-h-11">{{
              t('formDemo.saveAndPending')
            }}</el-button>
            <el-button type="danger" class="min-w-42 min-h-11">{{
              t('button.cancelOrder')
            }}</el-button>
            <el-button
              @click="
                () => {
                  changeReturnGoods = true
                  setDataForReturnOrder()
                }
              "
              type="warning"
              class="min-w-42 min-h-11"
              >Chuộc hàng trước hạn</el-button
            >
            <el-button
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
              @click="
                () => {
                  giaHan = true
                  setDataForReturnOrder()
                }
              "
              class="min-w-42 min-h-11 !border-red-500"
              ><p class="text-red-500">Gia hạn cầm đồ</p></el-button
            >
            <el-button @click="() => {}" type="warning" class="min-w-42 min-h-11"
              >Hoàn thành đơn hàng</el-button
            >
          </div>
        </div>
      </el-collapse-item>

      <!-- phieu in -->
      <div id="billPawn">
        <slot>
          <billLoanConfirmation
            v-if="ruleForm.customerName"
            :formData="formData"
            :priceBillPawn="priceintoMoneyPawnGOC"
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
                v-if="formData"
                :formData="formData"
                :priceBillPawn="priceintoMoneyPawnGOC"
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
          <el-table-column label="" width="50">
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
            <div class="flex">
              <span class="flex-1">20</span>
              <span class="flex-1 text-right">Chiếc</span>
            </div> </el-table-column
          >>
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

      <el-collapse-item :name="collapse[2].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[2].icon" link />
          <span class="text-center text-xl">{{ collapse[2].title }}</span>
        </template>
        <el-button :disabled="checkDisabled" text @click="dialogAccountingEntryAdditional = true"
          >+ Thêm bút toán</el-button
        >
        <el-button
          @click="
            () => {
              getReceiptCode()
              openReceiptDialog()
            }
          "
          text
          >+ Thêm phiếu thu</el-button
        >
        <el-button
          @click="
            () => {
              getcodeExpenditures()
              openPaymentDialog()
            }
          "
          text
          >+ Thêm phiếu chi</el-button
        >
        <el-button
          @click="
            () => {
              newCodePaymentRequest()
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
            :label="t('formDemo.certificateInformationAndServiceArising')"
            width="240"
          />
          <el-table-column
            prop="receiptOrPaymentVoucherId"
            :label="t('formDemo.receiptOrPayment')"
            min-width="120"
            align="left"
          >
            <template #default="data">
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

          <el-table-column
            prop="paymentRequestId"
            :label="t('formDemo.paymentOrder')"
            align="left"
            min-width="150"
          >
            <template #default="props">
              <div @click="dialogIPRForm = true" class="cursor-pointer text-blue-500">{{
                props.row.paymentRequestId
              }}</div>
            </template>
          </el-table-column>

          <el-table-column :label="t('formDemo.kindOfMoney')">đ</el-table-column>

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
            align="center"
            min-width="80"
          >
            <template #default="scope">
              <el-checkbox :disabled="checkDisabled" v-model="scope.row.alreadyPaidForTt" />
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
                props.row.status == 0 ? t('formDemo.recorded') : t('formDemo.cancelled')
              }}</div>
            </template>
          </el-table-column>
          <el-table-column :label="t('formDemo.manipulation')" align="center">
            <template #default="data">
              <div class="flex">
                <button
                  @click="
                    data.row.content.includes('Phiếu cầm đồ')
                      ? getAccountingEntry(data.row.id, 1)
                      : data.row.content.includes('Phiếu thanh toán phí')
                      ? getAccountingEntry(data.row.id, 2)
                      : data.row.content.includes('Thu tiền gốc cầm đồ')
                      ? getAccountingEntry(data.row.id, 3)
                      : (changeReturnGoods = true)
                  "
                  v-if="type != 'detail'"
                  class="border-1 border-blue-500 pt-2 pb-2 pl-4 pr-4 dark:text-[#fff] rounded"
                >
                  {{ t('reuse.detail') }}
                </button>
                <div v-else>{{ t('reuse.detail') }}</div>
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
                <div class="text-xl">20/20/2022</div>
              </div>
              <div class="flex gap-4 pb-4 items-center">
                <label class="text-right w-[170px]"
                  >{{ t('formDemo.pawnFeePaymentTime') }}<span class="text-red-500">*</span></label
                >
                <div class="text-xl">
                  <el-select v-model="valueFeePaymentTime" placeholder="Select">
                    <el-option
                      v-for="item in optionsFeePaymentTime"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>
              </div>
            </div>

            <div class="flex-right"> Mã QR đơn hàng </div>
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
            <span class="w-[25%] text-base font-bold break-w">{{
              t('formDemo.productInformationSale')
            }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
        </div>
        <div class="pt-2 pb-2">
          <el-table ref="singleTableRef" :data="ListOfProductsForSale" border style="width: 100%">
            <el-table-column label="STT" type="index" width="60" align="center" />
            <el-table-column prop="productName" :label="t('formDemo.commodityName')" width="300" />

            <el-table-column prop="productName" :label="t('reuse.accessory')" width="120" />

            <el-table-column prop="quantity" :label="t('reuse.pawnNumber')" width="150" />
            <el-table-column prop="unit" :label="t('reuse.unit')" />
          </el-table>
          <div class="flex justify-end">
            <div class="w-[145px] text-right">
              <p class="text-black font-bold dark:text-white">{{ t('reuse.totalPawnMoney') }} </p>
            </div>
            <div class="w-[145px] text-right">
              <p class="pr-2 text-black font-bold dark:text-white">{{ priceintoMoneyPawnGOC }} đ</p>
            </div>
          </div>

          <div class="flex justify-end mt-2">
            <div class="w-[145px] text-right">
              <p class="text-black font-bold dark:text-white">{{ t('reuse.intoMoneyByday') }} </p>
            </div>
            <div class="w-[145px] text-right">
              <p class="pr-2 text-black font-bold dark:text-white">{{ priceintoMoneyByday }} đ</p>
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
            <el-button
              class="min-w-42 min-h-11"
              @click="
                () => {
                  handle()
                  dialogBillLiquidation = true
                }
              "
              >{{ t('formDemo.printLiquidationContract') }}</el-button
            >
            <div>
              <span class="dialog-footer">
                <el-button
                  class="min-w-42 min-h-11"
                  type="primary"
                  @click="
                    () => {
                      dialogPawnCouponInfomation = false
                      postOrderStransaction(1)
                    }
                  "
                  >{{ t('formDemo.saveRecordDebts') }}</el-button
                >
                <el-button class="min-w-42 min-h-11" @click="dialogPawnCouponInfomation = false">{{
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
                <div class="text-xl">20/20/2022</div>
              </div>
              <div class="flex gap-4 pb-4 items-center">
                <label class="text-right w-[170px]"
                  >{{ t('formDemo.pawnFeePaymentTime') }}<span class="text-red-500">*</span></label
                >
                <div class="text-xl">
                  <el-select v-model="valueFeePaymentTime" placeholder="Select">
                    <el-option
                      v-for="item in optionsFeePaymentTime"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>
              </div>
            </div>

            <div class="flex-right"> Mã QR đơn hàng </div>
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
              t('formDemo.productInformationSale')
            }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
        </div>
        <div class="pt-2 pb-2">
          <el-table ref="singleTableRef" :data="ListOfProductsForSale" border style="width: 100%">
            <el-table-column label="STT" type="index" width="60" align="center" />
            <el-table-column prop="productName" :label="t('formDemo.commodityName')" width="280" />
            <el-table-column prop="quantity" :label="t('reuse.quantity')" width="90" />
            <el-table-column prop="price" :label="t('reuse.unitPrices')">
              <template #default="props">
                <div class="text-right">{{ changeMoney.format(props.row.price) }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="finalPrice" :label="t('formDemo.intoMoney')">
              <template #default="props">
                <div class="text-right">{{ changeMoney.format(props.row.finalPrice) }}</div>
              </template>
            </el-table-column>
          </el-table>
          <div class="flex justify-end">
            <div class="w-[145px] text-right">
              <p class="text-black font-bold dark:text-white">{{ t('formDemo.intoMoneyPawn') }}</p>
            </div>
            <div class="w-[145px] text-right">
              <p class="pr-2 text-black font-bold dark:text-white">{{ '0 đ' }}</p>
            </div>
          </div>
        </div>
        <div class="flex items-center">
          <span class="w-[35%] text-base font-bold">{{ t('formDemo.pawnFeePayment') }}</span>
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
          <span class="dialog-footer">
            <el-button
              type="primary"
              class="min-w-42 min-h-11"
              @click="
                () => {
                  dialogFeePaymentSlip = false
                  postOrderStransaction(2)
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
          <div class="flex gap-4 py-2 items-center justify-between">
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

            <div class="flex-right"> Mã QR đơn hàng </div>
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
            <el-table-column prop="content" :label="t('reuse.content')" width="250" />
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
                <div>{{ props.row.collected }} đ</div>
              </template>
            </el-table-column>
            <el-table-column prop="spent" :label="t('formDemo.spent')">
              <template #default="props">
                <div class="text-right">{{ props.row.spent }} đ</div>
              </template>
            </el-table-column>
            <el-table-column prop="moneyType" :label="t('formDemo.intoMoney')">
              <template #default="props">
                <div class="text-right">{{ props.row.moneyType }} đ</div>
              </template>
            </el-table-column>
          </el-table>
          <div class="flex justify-end">
            <div class="w-[145px] text-right">
              <p class="text-black font-bold dark:text-white">Tổng thanh toán</p>
            </div>
            <div class="w-[145px] text-right">
              <p class="pr-2 text-black font-bold dark:text-white">10,000,000 đ</p>
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
                    postOrderStransaction(3)
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
        :title="t('formDemo.informationPawn')"
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
            <div class="w-[100%] text-xl">{{ pawnOrderCode }}</div>
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
              <el-select v-model="value" placeholder="Select">
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
            <label class="w-[30%] text-right">Số tiền thu</label>
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
            <div class="w-[100%] text-xl">{{ pawnOrderCode }}</div>
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
              <el-select v-model="value" placeholder="Select">
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
            <label class="w-[30%] text-right">Số tiền chi</label>
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
            <!-- <el-button @click="printPage('recpPaymentPrint')">{{ t('button.print') }}</el-button> -->
            <el-button>In phiếu</el-button>
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
            <span class="w-[25%] text-base font-bold">{{ t('formDemo.documentsAttached') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
            <!-- <button @click="testDialog = true">Test</button> -->
          </div>
          <div class="flex gap-4 pt-4 pb-4 items-center">
            <label class="w-[30%] text-right">{{ t('formDemo.orderCode') }}</label>
            <div class="w-[100%] text-xl">{{ pawnOrderCode }}</div>
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
              <el-select v-model="value" placeholder="Chọn người đề nghị">
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
          <el-divider content-position="left">{{ t('formDemo.importTrackingTable') }}</el-divider>
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
              prop="invoiceGoodsEnteringWarehouse"
              :label="t('formDemo.deliveryNotesExportWarehouse')"
              align="left"
              width="200"
            >
              <template #default="props">
                <div v-if="props.row.invoiceGoodsEnteringWarehouse == 0" class="text-blue-500">
                  <!-- @click="informationWarehouseReceipt = true" -->
                  NK3424
                </div>
                <div v-else class="text-blue-500">
                  <!-- @click="invoiceForGoodsEntering = true" -->
                  NK3424
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="inventoryStatus" :label="t('formDemo.status')" align="center" />
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
</style>
