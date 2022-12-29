<script setup lang="ts">
import { reactive, ref, watch, unref, onBeforeMount, onMounted, computed } from 'vue'
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
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElDatePicker,
  ElForm,
  ElFormItem,
  ElMessage,
  ElNotification,
  ElTreeSelect,
  UploadUserFile,
  UploadProps,
  ElMessageBox
} from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { Collapse } from '../../Components/Type'
import { useRoute, useRouter } from 'vue-router'
import moment from 'moment'
import { dateTimeFormat } from '@/utils/format'
import MultipleOptionsBox from '@/components/MultipleOptionsBox.vue'
import { PRODUCTS_AND_SERVICES } from '@/utils/API.Variables'
import {
  getProductsList,
  getCollaboratorsInOrderList,
  getAllCustomer,
  getCustomerById,
  addNewOrderList,
  getOrderList,
  createQuickProduct,
  getCheckProduct,
  getproductId,
  addQuickCustomer,
  getOrderTransaction,
  addTPV,
  createReturnRequest,
  getReturnRequest,
  getReceiptPaymentVoucher,
  getDetailReceiptPaymentVoucher,
  getCodePaymentRequest,
  addDNTT,
  updateOrderTransaction,
  updateOrderInfo,
  updateOrderStatus,
  addOrderStransaction,
  cancelOrder,
  getDetailAccountingEntryById
} from '@/api/Business'
import { getWarehouseLot } from '@/api/Warehouse'
import { FORM_IMAGES } from '@/utils/format'
import { STATUS_ORDER_PURCHASE } from '@/utils/API.Variables'
import { getCity, getDistrict, getWard } from '@/utils/Get_Address'
import type { FormInstance, FormRules } from 'element-plus'
import { getCategories } from '@/api/LibraryAndSetting'
import paymentOrderPrint from '../../Components/formPrint/src/paymentOrderPrint.vue'
import billPrint from '../../Components/formPrint/src/billPrint.vue'
import liquidationPurchaseContractPrint from '../../Components/formPrint/src/liquidationPurchaseContractPrint.vue'
import receiptsPaymentPrint from '../../Components/formPrint/src/receiptsPaymentPrint.vue'
import ProductAttribute from '../../ProductsAndServices/ProductLibrary/ProductAttribute.vue'
import Qrcode from '@/components/Qrcode/src/Qrcode.vue'

const { t } = useI18n()

//lay du lieu tu router
const router = useRouter()
const id = Number(router.currentRoute.value.params.id)
const route = useRoute()
const type = String(route.params.type)

const changeMoney = new Intl.NumberFormat('vi', {
  style: 'currency',
  currency: 'vnd',
  minimumFractionDigits: 0
})

const ruleFormRef = ref<FormInstance>()
const ruleFormRef2 = ref<FormInstance>()
const ruleFormAddress = ref<FormInstance>()
var curDate = 'MH' + moment().format('hhmmss')
var autoCodeSellOrder = 'MH' + moment().format('hmmss')
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
  delivery: '',
  warehouse: '',
  orderFiles: []
})

const rules = reactive<FormRules>({
  orderCode: [{ required: true, message: t('formDemo.pleaseInputOrderCode'), trigger: 'blur' }],
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
  ],
  warehouse: [
    {
      required: false,
      message: t('formDemo.pleaseChooseWarehouse'),
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

const customerData = reactive({
  customerId: '',
  userName: '',
  code: '',
  address: '',
  cccd: '',
  phoneNumber: '',
  bank: ''
})

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

const handleChange: UploadProps['onChange'] = async (_uploadFile, uploadFiles) => {
  ListFileUpload.value = uploadFiles
}

let FileDeleteIds: any = []
const beforeRemove = (uploadFile) => {
  return ElMessageBox.confirm(`Cancel the transfert of ${uploadFile.name} ?`, {
    confirmButtonText: 'OK',
    cancelButtonText: 'Hủy',
    type: 'warning',
    draggable: true
  })
    .then(() => {
      ElMessage({
        type: 'success',
        message: 'Delete completed'
      })
      let imageRemove = uploadFile?.uid

      FileDeleteIds.push(imageRemove)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled'
      })
    })
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
    label: t('formDemo.buyDelivery')
  },
  {
    value: 1,
    label: t('formDemo.sellDelivery')
  }
]

const radio1 = ref('')

const input = ref('')

interface ListOfProductsForSaleType {
  name: string
  productCode: string
  productName: string
  productPropertyCode: string
  productPropertyName: string
  id: string
  productPropertyId: string
  quantity: number
  businessManagement: {}
  accessory: string | undefined
  code: string | undefined
  unitName: string
  unitPrice: string | number | undefined
  totalPrice: string
  paymentType: string
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
  productPropertyId: '',
  quantity: 0,
  businessManagement: {},
  code: undefined,
  accessory: '',
  unitName: 'Chiếc',
  unitPrice: 0,
  totalPrice: '',
  paymentType: '',
  warehouseId: undefined,
  warehouseName: ''
})

let ListOfProductsForSale = ref<Array<ListOfProductsForSaleType>>([])

interface historyTableType {
  createdAt: string
  productPropertyId: string
  productPropertyName: string | undefined
  accessory?: string
  conditionProducts: string
  quantity: number
  unit?: string
  refundUnitPrice?: number
  intoUnitPrice?: number
  invoiceGoodsEnteringWarehouse?: number
  inventoryStatus?: string
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
  [x: string]: any
  createdAt: string | Date
  content: string
  receiptOrPaymentVoucherId: number | undefined
  paymentRequestId: string | undefined
  receiveMoney: string
  paidMoney: string
  debt: string
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
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const handleSelectionChange = (val: tableDataType[]) => {
  newTable.value = val
}

// Dialog change address

const dialogFormVisible = ref(false)
let dialogAddQuick = ref(false)
const openDialogChooseWarehouse = ref(false)
const dialogbusinessManagement = ref(false)

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

const radioVAT = ref(t('formDemo.doesNotIncludeVAT'))
let infoCompany = reactive({
  name: '',
  taxCode: '',
  phone: '',
  email: ''
})

let customerAddress = ref('')
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
      value: customer.id.toString(),
      isOrganization: customer.isOrganization,
      taxCode: customer.taxCode,
      phone: customer.phonenumber,
      email: customer.email,
      id: customer.id.toString()
    }))
  }
}

// Call api danh sách sản phẩm
const listProductsTable = ref()

const pageIndexProducts = ref(1)
const callApiProductList = async () => {
  const res = await getProductsList({ PageIndex: pageIndexProducts.value, PageSize: 20 })
  if (res.data && res.data?.length > 0) {
    listProductsTable.value = res.data.map((product) => ({
      value: product.productCode,
      productCode: product.productCode,
      name: product.name ?? '',
      unitPrice: product.unitPrice,
      unit: product.unitName,
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
                listProductsTable.value.push({
                  productCode: product.productCode,
                  value: product.productCode,
                  name: product.name ?? '',
                  unitPrice: product.unitPrice.toString(),
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

const getValueOfSelected = async (_value, obj, scope) => {
  const data = scope.row
  duplicateProduct.value = undefined
  duplicateProduct.value = ListOfProductsForSale.value.find(
    (val) => val.productPropertyId == _value
  )
  if (duplicateProduct.value) {
    duplicateProductMessage()
  } else {
    totalPriceOrder.value = 0
    totalFinalOrder.value = 0
    data.productPropertyId = obj.productPropertyId
    data.productCode = obj.value
    data.productName = obj.name

    //TODO
    // data.price = await getProductPropertyPrice(data.productPropertyId, 1, 1)
    data.totalPrice = data.unitPrice * data.quantity
    ListOfProductsForSale.value.map((val) => {
      if (val.totalPrice) totalPriceOrder.value += parseInt(val.totalPrice)
    })
    promoCash.value != 0
      ? (totalFinalOrder.value = totalPriceOrder.value - promoCash.value)
      : (totalFinalOrder.value =
          totalPriceOrder.value - (totalPriceOrder.value * promoValue.value) / 100)
    changePriceVAT()
    // add new row
    if (scope.$index == ListOfProductsForSale.value.length - 1) {
      ListOfProductsForSale.value.push({ ...productForSale })
    }
  }
}

const updatePrice = (_value, obj, scope) => {
  scope.row.productPropertyId = obj.productPropertyId
  scope.row.refundUnitPrice = Number(obj.price)
}
const updateExchangePrice = (_value, obj, scope) => {
  scope.row.productPropertyId = obj.productPropertyId
  scope.row.unitPrices = Number(obj.price)
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
      value: collaborator.id
    }))
  }
  optionCallCollaborators++
}

// phân loại khách hàng: 1: công ty, 2: cá nhân
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

let statusOrder = ref(STATUS_ORDER_PURCHASE[1].orderStatus)
interface statusOrderType {
  orderStatusName: string
  orderStatus: number
  createdAt: string | Date
  isActive?: boolean
}

let arrayStatusOrder = ref(Array<statusOrderType>())
arrayStatusOrder.value.pop()

if (type == 'add') {
  arrayStatusOrder.value.push(STATUS_ORDER_PURCHASE[1])
}

const updateStatusOrder = async (status: number, idOrder: number) => {
  const payload = {
    OrderId: id ?? idOrder,
    ServiceType: 6,
    OrderStatus: status
  }
  const formDataPayLoad = FORM_IMAGES(payload)
  await updateOrderStatus(formDataPayLoad)
  await getOrderList({ Id: id, ServiceType: 6 })
}

const addStatusOrder = (index) => {
  arrayStatusOrder.value.push(STATUS_ORDER_PURCHASE[index])
  updateStatusOrder(STATUS_ORDER_PURCHASE[index].orderStatus, id)
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
  if (radioVAT.value.length < 4) {
    VAT.value = true
    const valueVAT = radioVAT.value.substring(0, radioVAT.value.length - 1)
    moneyVAT.value = (totalPriceOrder.value * parseInt(valueVAT)) / 100
    if (totalFinalOrder.value) {
      totalFinalOrder.value += (totalFinalOrder.value * parseInt(valueVAT)) / 100
    }
  }
}

const autoCalculateReturnExportChange = () => {
  tableInvoiceExport.value[0].finalPrice = 0
  tableInvoiceExport.value.map((val) => {
    if (val.totalPrice) tableInvoiceExport.value[0].finalPrice += val.totalPrice
  })
  intoMoneyReturn.value =
    tableInvoiceImport.value[0].finalPrice - tableInvoiceExport.value[0].finalPrice
}

const autoCalculateReturnImportChange = () => {
  tableInvoiceImport.value[0].finalPrice = 0
  tableInvoiceImport.value.map((val) => {
    if (val.totalPrice) tableInvoiceImport.value[0].finalPrice += val.totalPrice
  })
  intoMoneyReturn.value =
    tableInvoiceImport.value[0].finalPrice - tableInvoiceExport.value[0].finalPrice
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
    moneyDeposit.value = totalFinalOrder.value - inputDeposit.value
  }
)

let customerIdPromo = ref()

const removeListProductsSale = (index) => {
  ListOfProductsForSale.value.splice(index, 1)
}

const checkDisabled = ref(false)

const dialogAddProduct = ref(false)

const addnewproduct = () => {
  dialogAddProduct.value = true
}

// Thêm nhanh sản phẩm
const quickProductCode = ref()
const quickManagementCode = ref()
const quickProductName = ref()
const quickDescription = ref()
// const productCharacteristics = ref()
const valueCharacteristics = ref()
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

const postQuickProduct = async () => {
  const characteristics = valueCharacteristics.value.map((val) => ({
    id: val
  }))

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
    categories: characteristics
  }
  await createQuickProduct(payload)
  callApiProductList()
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

const ListFileUpload = ref<UploadUserFile[]>([])
const Files = ListFileUpload.value.map((file) => file.raw).filter((file) => file !== undefined)

let orderDetailsTable = reactive([{}]) as any[]

let idOrderPost = ref()
// Tạo đơn hàng
const postData = async () => {
  orderDetailsTable = ListOfProductsForSale.value.map((val) => ({
    ProductPropertyId: parseInt(val.productPropertyId),
    Quantity: val.quantity,
    UnitPrice: val.unitPrice,
    TotalPrice: val.totalPrice,
    DepositePrice: 0,
    DiscountMoney: 0,
    InterestMoney: 0,
    WarehouseId: 1,
    IsPaid: true,
    Accessory: val.accessory
  }))
  orderDetailsTable.pop()
  const productPayment = JSON.stringify([...orderDetailsTable])
  const payload = {
    ServiceType: 6,
    OrderCode: ruleForm.orderCode,
    PromotionCode: 'AA12',
    CollaboratorId: ruleForm.collaborators,
    CollaboratorCommission: ruleForm.discount,
    Description: ruleForm.orderNotes,
    CustomerId: customerID.value,
    Files: Files,
    DeliveryOptionId: ruleForm.delivery,
    WarehouseOptionId: ruleForm.warehouse,
    ProvinceId: formAddress.province ?? 1,
    DistrictId: formAddress.district ?? 1,
    WardId: formAddress.wardCommune ?? 1,
    Address: formAddress.detailedAddress,
    OrderDetail: productPayment,
    CampaignId: 2,
    TotalPrice: totalFinalOrder.value,
    DepositePrice: 0,
    DiscountMoney: 0,
    InterestMoney: 0,
    VAT: 1,
    orderStatus: 1
  }
  const formDataPayLoad = FORM_IMAGES(payload)
  idOrderPost.value = await addNewOrderList(formDataPayLoad)
    .then(() => {
      ElNotification({
        message: t('reuse.addSuccess'),
        type: 'success'
      })
      router.push({
        name: 'purchase.business-purchases.purchase-order-list',
        params: { backRoute: String(router.currentRoute.value.name) }
      })
    })
    .catch(() =>
      ElNotification({
        message: t('reuse.addFail'),
        type: 'warning'
      })
    )

  // automaticCouponWareHouse(2)
}

// Phiếu xuất kho tự động
// const automaticCouponWareHouse = async (index) => {
//   const payload = {
//     OrderId: idOrderPost.value.data,
//     Type: index
//   }

//   await postAutomaticWarehouse(payload)
// }

// total order
let totalOrder = ref(0)

let dataEdit = ref()

const getOrderStransactionList = async () => {
  const transaction = await getOrderTransaction({ id: id })
  debtTable.value = transaction.data
}

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

let tableInvoiceExport = ref([
  {
    id: 0,
    productCode: '',
    productName: '',
    accessory: '',
    quantity: 0,
    unitPrice: 0,
    totalPrice: 0,
    finalPrice: 0
  }
])
let tableInvoiceImport = ref([
  {
    id: 0,
    productCode: '',
    productName: '',
    accessory: '',
    quantity: 0,
    unitPrice: 0,
    totalPrice: 0,
    finalPrice: 0
  }
])
let intoMoneyReturn = ref()

const editData = async () => {
  if (type == 'detail') checkDisabled.value = true
  if (type == 'edit' || type == 'detail') {
    const res = await getOrderList({ Id: id, ServiceType: 6 })
    const transaction = await getOrderTransaction({ id: id })
    if (debtTable.value?.length > 0) debtTable.value.splice(0, debtTable.value.length - 1)
    debtTable.value = transaction.data
    getReturnRequestTable()

    const orderObj = { ...res?.data[0] }
    dataEdit.value = orderObj
    arrayStatusOrder.value = orderObj?.statusHistory
    if (arrayStatusOrder.value?.length) {
      arrayStatusOrder.value[arrayStatusOrder.value?.length - 1].isActive = true
      statusOrder.value = arrayStatusOrder.value[arrayStatusOrder.value?.length - 1].orderStatus
    }

    if (res.data) {
      customerData.customerId = orderObj.customerId
      await getCustomerInfo(customerData.customerId)

      ruleForm.orderCode = orderObj.code
      sellOrderCode.value = ruleForm.orderCode
      ruleForm.collaborators = orderObj.collaborator.id
      ruleForm.discount = orderObj.collaboratorCommission
      ruleForm.customerName = orderObj.customer.isOrganization
        ? orderObj.customer.representative + ' | ' + orderObj.customer.taxCode
        : orderObj.customer.name + ' | ' + orderObj.customer.phonenumber
      ruleForm.orderNotes = orderObj.description
      totalPriceOrder.value = orderObj.totalPrice
      totalFinalOrder.value = orderObj.totalPrice

      totalOrder.value = orderObj.totalPrice
      if (ListOfProductsForSale.value?.length > 0)
        ListOfProductsForSale.value.splice(0, ListOfProductsForSale.value.length - 1)
      ListOfProductsForSale.value = orderObj.orderDetails
      tableInvoiceExport.value = orderObj.orderDetails.map((order) => ({
        id: order.id,
        productCode: order.productCode,
        productName: order.productName,
        accessory: order.accessory,
        quantity: order.quantity,
        unitPrice: order.unitPrice,
        totalPrice: order.totalPrice
      }))
      tableInvoiceImport.value = orderObj.orderDetails.map((order) => ({
        id: order.id,
        productCode: order.productCode,
        productName: order.productName,
        accessory: order.accessory,
        quantity: order.quantity,
        unitPrice: order.unitPrice,
        totalPrice: order.totalPrice
      }))
      tableInvoiceExport.value[0].finalPrice = orderObj.totalPrice
      tableInvoiceImport.value[0].finalPrice = orderObj.totalPrice
      customerAddress.value = orderObj.address
      ruleForm.delivery = orderObj.deliveryOptionName
      customerIdPromo.value = orderObj.customerId
      if (orderObj.customer.isOrganization) {
        infoCompany.name = orderObj.customer.name
        infoCompany.taxCode = orderObj.customer.taxCode
        infoCompany.phone = orderObj.customer.phonenumber
        infoCompany.email = 'Email: ' + orderObj.customer.email
      } else {
        infoCompany.name = orderObj.customer.name + ' | ' + orderObj.customer.taxCode
        infoCompany.taxCode = orderObj.customer.taxCode
        infoCompany.phone = orderObj.customer.phonenumber
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

// Call api chi tiết bút toán theo id
let formAccountingId = ref()
const getAccountingEntry = (_index, scope) => {
  const data = scope.row
  data.content?.indexOf('Phiếu thanh toán') != 1
    ? openAcountingEntryDialog(data.id, 1)
    : data.content?.indexOf('Phiếu đặt cọc/Tạm ứng') != 1
    ? openAcountingEntryDialog(data.id, 2)
    : data.content?.indexOf('Trả lại tiền cọc cho khách') != 1
    ? openAcountingEntryDialog(data.id, 3)
    : openAcountingEntryDialog(data.id, 4)
}

const openAcountingEntryDialog = async (index, num) => {
  const res = await getDetailAccountingEntryById({ id: index })
  formAccountingId.value = { ...res.data }
  tableSalesSlip.value = formAccountingId.value?.paidMerchandises
  tableSalesSlip.value.forEach((e) => {
    e.totalPrice = e.unitPrice * e.quantity
  })
  tableAccountingEntry.value = formAccountingId.value?.accountingEntry
  inputDeposit.value = formAccountingId.value?.accountingEntry.paidMoney
  moneyDeposit.value = formAccountingId.value?.accountingEntry.deibt
  if (num == 1) {
    openBillDialog()
  } else if (num == 2) {
    dialogDepositSlipAdvance.value = true
  } else if (num == 3) {
    dialogAccountingEntryAdditional.value = true
  } else if (num == 4) changeReturnGoods.value = true
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
}

// Thông tin phiếu thu
const dialogInformationReceipts = ref(false)

// Thông tin phiếu đề nghị thanh toán
const dialogIPRForm = ref(false)

interface ListOfDetailExpenses {
  numberVouchers: string
  dayVouchers: string | Date
  spendFor: string
  quantity: string
  unitPrices: string | number | undefined
  intoMoney: string
  note: string
}
const detailExpenses = reactive<ListOfDetailExpenses>({
  numberVouchers: '',
  dayVouchers: '',
  spendFor: '',
  quantity: '',
  unitPrices: '',
  intoMoney: '',
  note: ''
})
let detailedListExpenses = ref<Array<ListOfDetailExpenses>>([])

const addNewRow = () => {
  detailedListExpenses.value.push({ ...detailExpenses })
}

// Thông tin phiếu đặt cọc/tạm ứng
const dialogDepositSlipAdvance = ref(false)

// Thông tin phiếu chi
const dialogPaymentVoucher = ref(false)

// Thông tin phiếu nhập kho hoàn hàng đổi/trả
const informationWarehouseReceipt = ref(false)
const tableFullyIntegrated = [
  {
    commodityName:
      'LV Flourine red X monogam bag da sần - Lage(35.5-40.5)-Gently used / Đỏ; không quai',
    accessory: '',
    quantity: '2',
    unitPriceWarehouse: '5,000,000 đ',
    intoMoneyWarehouse: '5,000,000 đ'
  }
]

//Thông tin phiếu đổi/trả
const dialogInvoiceReturn = ref(false)

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
const dialogBillLiquidation = ref(false)
const singleTableRef = ref<InstanceType<typeof ElTable>>()

// Thông tin đổi/trả hàng
const changeReturnGoods = ref(false)
const inputReasonReturn = ref('')

const tableReturnFullyIntegrated = ref<Array<historyTableType>>([])

if (tableReturnFullyIntegrated.value.length == 0)
  tableReturnFullyIntegrated.value.push({
    createdAt: '',
    productPropertyId: '',
    productPropertyName: '',
    accessory: '0',
    conditionProducts: '',
    quantity: 1,
    unit: '',
    refundUnitPrice: 0,
    intoUnitPrice: 0,
    invoiceGoodsEnteringWarehouse: 0,
    inventoryStatus: ''
  })

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

const tableProductInformationExportChange = ref([
  {
    productPropertyId: 0,
    commodityName: '',
    accessory: '',
    quantity: 1,
    unitPrices: 0,
    intoMoney: 0
  }
])

const alreadyPaidForTt = ref(true)

// Bút toán bổ sung
const dialogAccountingEntryAdditional = ref(false)

const tableAccountingEntry = ref([
  {
    content: '',
    kindOfMoney: '',
    collected: '',
    spent: '',
    intoMoney: ''
  }
])

// fake tạm option thêm nhanh sản phẩm
const choosePayment = [
  {
    value: 1,
    label: t('formDemo.cashPayment')
  },
  {
    value: 2,
    label: t('formDemo.cardPayment')
  }
]
let payment = ref(choosePayment[0].value)

const listApplyExport = [
  {
    id: 1,
    check: true,
    applyExport: 'Bán'
  },
  {
    id: 2,
    check: true,
    applyExport: 'Cho thuê'
  },
  {
    id: 3,
    check: true,
    applyExport: 'Spa'
  }
]

const formBusuness = reactive({
  id: 1,
  check: '',
  applyExport: ''
})

// dialog print
const nameDialog = ref('')
let tableSalesSlip = ref()

function openBillDialog() {
  dialogSalesSlipInfomation.value = !dialogSalesSlipInfomation.value
  tableSalesSlip.value = ListOfProductsForSale.value
  nameDialog.value = 'bill'
}

function openReceiptDialog() {
  moneyReceipts.value = 0
  getReceiptCode()
  if (newTable.value?.length) {
    newTable.value.forEach((e) => {
      moneyReceipts.value += e.receiveMoney
    })
  }
  dialogInformationReceipts.value = !dialogInformationReceipts.value
  nameDialog.value = 'Phiếu thu'
}

function openPaymentDialog() {
  moneyPaid.value = 0
  getcodeExpenditures()
  if (newTable.value?.length) {
    newTable.value.forEach((e) => {
      moneyPaid.value += e.paidMoney
    })
  }
  dialogPaymentVoucher.value = !dialogPaymentVoucher.value
  nameDialog.value = 'Phiếu chi'
}

function openPaymentRequestDialog() {
  moneyDeibt.value = 0
  newCodePaymentRequest()
  if (newTable.value?.length) {
    newTable.value.forEach((e) => {
      moneyDeibt.value += e.deibt
    })
  }
  inputDeposit.value = 0
  inputReasonCollectMoney.value = ''
  dialogIPRForm.value = !dialogIPRForm.value
  nameDialog.value = 'Phiếu đề nghị thanh toán'
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

function printPageLiquidation(id: string, { url, title, w, h }) {
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

const productAttributeValue = (data) => {
  return data
}

// input nhập tiền viết bằng chữ
const enterMoney = ref()

// Lý do thu tiền
const inputReasonCollectMoney = ref()

// Thêm mới phiếu thu
let objidPT = ref()
let idPT = ref()
const postPT = async () => {
  const payload = {
    Code: codeReceipts.value,
    TotalMoney: moneyPaid.value,
    TypeOfPayment: payment.value,
    status: 1,
    PeopleType: 1,
    PeopleId: inputRecharger.value,
    OrderId: id,
    Type: 0,
    Description: inputReasonCollectMoney.value,
    AccountingEntryId: undefined
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
    TotalMoney: moneyPaid.value,
    TypeOfPayment: payment.value,
    status: 1,
    PeopleType: 1,
    PeopleId: inputRecharger.value,
    OrderId: id,
    Type: 1,
    Description: inputReasonCollectMoney.value,
    AccountingEntryId: undefined
  }
  const formDataPayLoad = FORM_IMAGES(payload)
  objidPC.value = await addTPV(formDataPayLoad)
  idPC.value = objidPC.value.receiptAndpaymentVoucherId
  handleChangeReceipts()
}

// Thêm mã phiếu thu vào debtTable
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
const moneyPaid = ref()
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

// Thêm mới phiếu đề nghị thanh toán
let objIdPayment = ref()
let idPayment = ref()
const moneyDeibt = ref()
const postPaymentRequest = async () => {
  const payload = {
    Code: codePaymentRequest.value,
    TotalMoney: moneyDeibt.value,
    PaymentType: payment.value,
    PeopleId: inputRecharger.value,
    status: 0,
    PeopleType: 1,
    OrderId: id,
    Description: inputReasonCollectMoney.value,
    Document: undefined,
    AccountingEntryId: undefined
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
        status: 0,
        paymentMethods: 1
      }
      updateOrderTransaction(payload).then(() => {
        if (index == arr.length - 1) getOrderStransactionList()
      })
    })
  }
}

const editButton = ref(false)

let childrenTable = ref()
let objOrderStransaction = ref()
let idStransaction = ref()

// Thêm bút toán cho đơn hàng
const postOrderStransaction = async (index: number) => {
  childrenTable.value = ListOfProductsForSale.value.map((val) => ({
    merchadiseTobePayforId: parseInt(val.id),
    quantity: val.quantity
  }))

  // childrenTable.value.pop()
  codeReturnRequest.value = autoCodeReturnRequest
  const payload = {
    orderId: id,
    content:
      index == 1
        ? t('formDemo.bill')
        : index == 2
        ? t('formDemo.depositSlipAdvance')
        : tableAccountingEntry.value[0].content,
    paymentRequestId: null,
    receiptOrPaymentVoucherId: null,
    receiveMoney: tableAccountingEntry.value[0].collected
      ? parseInt(tableAccountingEntry.value[0].collected)
      : 0,
    paidMoney: index == 1 ? inputDeposit.value : parseInt(tableAccountingEntry.value[0].spent),
    deibt: index !== 1 ? 0 : moneyDeposit.value,
    typeOfPayment: payment.value,
    paymentMethods: 1,
    status: 0,
    isReceiptedMoney: alreadyPaidForTt.value !== true ? 0 : 1,
    typeOfMoney: 1,
    merchadiseTobePayfor: childrenTable.value
  }
  objOrderStransaction.value = await addOrderStransaction(payload)
  idStransaction.value = objOrderStransaction.value.paymentRequestId
  getOrderStransactionList()
}

// Tạo mới yêu cầu đổi trả
const postReturnRequest = async () => {
  codeReturnRequest.value = autoCodeReturnRequest
  const tableReturnPost = ref()
  if (tableReturnFullyIntegrated.value.length < 2) {
    return
  }
  if (tableProductInformationExportChange.value.length < 2) {
    return
  }
  tableReturnFullyIntegrated.value.pop()
  tableProductInformationExportChange.value.pop()
  tableReturnPost.value.push(
    tableReturnFullyIntegrated.value.map((e) => ({
      productPropertyId: parseInt(e.productPropertyId),
      quantity: e.quantity,
      accessory: e.accessory
    }))
  )
  tableReturnPost.value.push(
    tableProductInformationExportChange.value.map((e) => ({
      productPropertyId: e.productPropertyId,
      quantity: e.quantity,
      accessory: e.accessory
    }))
  )
  const payload = {
    customerOrderId: id,
    code: codeReturnRequest.value,
    name: 'Đổi trả đơn hàng',
    description: inputReasonReturn.value,
    returnRequestType: 1,
    details: tableReturnPost.value
  }
  await createReturnRequest(payload)
  getReturnRequestTable()
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

let moneyDeposit = ref()

const inputRecharger = ref()

const PrintReceipts = ref(false)

// form phiếu thu
const formReceipts = ref()
const moneyReceipts = ref()

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

const radioWarehouseId = ref()
const indexRowWarehouse = ref()
const indexRow = ref()
// Lấy danh sách kho theo mã sản phẩm và sericeType
const callApiWarehouse = async (scope) => {
  const data = scope.row
  indexRowWarehouse.value = scope.$index

  const res = await getWarehouseLot({
    ProductPropertyId: data.productPropertyId
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

const handleSelectionbusinessManagement = (val: tableDataType[]) => {
  ListOfProductsForSale.value[indexRow.value].businessManagement = val.map((e) => ({
    label: e.applyExport,
    value: e.id
  }))
}

const ckeckChooseProduct = (scope) => {
  if (!scope.row.productPropertyId) {
    ElNotification({
      message: 'Bạn phải chọn sản phẩm trước',
      type: 'info'
    })
  } else {
    dialogbusinessManagement.value = true
  }
}
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
    item.intoUnitPrice !== undefined ? (price += item.intoUnitPrice) : ''
  })
  return price
}
const getExportPrice = () => {
  let money = 0
  tableProductInformationExportChange.value.map((item) => {
    money += item.intoMoney
  })
  return money
}
let productArray: any = []
const listOfOrderProduct = ref()
const getReturnOrder = () => {
  productArray = ListOfProductsForSale.value.map((row) => row.productPropertyId)
  listOfOrderProduct.value = listProductsTable.value.filter((item) => {
    return productArray.includes(item.productPropertyId)
  })
}

// disabled in hợp đồng thanh lý và phiếu thanh toán / đặt cọc / tạm ứng
const doubleDisabled = ref(false)
const moneyVAT = ref()
const VAT = ref(false)
// Cập nhật lại giá tiền khi thay đổi VAT
const changePriceVAT = () => {
  autoCalculateOrder()
}

//hủy đơn hàng
const cancelOrderPurchase = async () => {
  const payload = {
    OrderId: id,
    ServiceType: 6
  }

  await cancelOrder(payload)
}

const editOrderInfo = async () => {
  const payload = {
    Id: id,
    CollaboratorId: ruleForm.collaborators,
    CollaboratorCommission: parseFloat(ruleForm.discount),
    Description: ruleForm.orderNotes,
    Files: Files,
    DeleteFileIds: '',
    DeliveryOptionId: dataEdit.value?.deliveryOption ?? ruleForm.delivery,
    ProvinceId: dataEdit.value?.provinceId ?? formAddress.province,
    DistrictId: dataEdit.value?.districtId ?? formAddress.district,
    WardId: dataEdit.value?.wardId ?? formAddress.wardCommune,
    Address: dataEdit.value?.address ?? formAddress.detailedAddress
  }
  const formDataPayLoad = FORM_IMAGES(payload)
  await updateOrderInfo(formDataPayLoad)
    .then(() => {
      ElNotification({
        message: t('reuse.updateSuccess'),
        type: 'success'
      })
    })
    .catch(() => {
      ElNotification({
        message: t('reuse.updateFail'),
        type: 'success'
      })
    })
}

onBeforeMount(async () => {
  callCustomersApi()
  callApiCollaborators()
  await callApiProductList()
  callApiCity()

  if (type == 'add' || type == ':type') {
    doubleDisabled.value = true
    ruleForm.orderCode = curDate
    sellOrderCode.value = autoCodeSellOrder
    codePaymentRequest.value = autoCodePaymentRequest
  }
})
onMounted(async () => {
  await editData()
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

      <!-- phiếu thanh lý hợp đồng -->
      <div id="billLiquidationContract">
        <slot>
          <liquidationPurchaseContractPrint :data-customer="customerData" />
        </slot>
      </div>

      <!-- Dialog In phiếu thu chi -->
      <el-dialog v-model="PrintReceipts" class="font-bold" width="40%" align-center>
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

      <!-- Dialog Thêm nhanh nhà cung cấp -->
      <el-dialog
        v-model="dialogAddQuick"
        width="40%"
        align-center
        :title="t('formDemo.QuicklyAddSupplier')"
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
                      v-for="(item, index) in optionsClassify"
                      :key="index"
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
                      v-for="(item, index) in optionsClassify"
                      :key="index"
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
            <ProductAttribute
              v-model="valueCharacteristics"
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
                  postQuickProduct()
                  dialogAddProduct = false
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
            <div class="w-[100%] text-xl">{{ moneyReceipts }}</div>
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
            <el-button @click="getFormReceipts()">{{ t('button.print') }}</el-button>
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
            <label class="w-[30%] text-right">Số tiền chi</label>
            <div class="w-[100%] text-xl">{{ moneyPaid }}</div>
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
            <el-button @click="getFormReceipts()">{{ t('button.print') }}</el-button>
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
              <el-table-column label="STT" type="index" width="40" align="center" />
              <el-table-column
                prop="numberVouchers"
                :label="t('formDemo.numberVouchers')"
                width="80"
              >
                <template #default="data">
                  <el-input type="text" @change="addNewRow" v-model="data.row.numberVouchers" />
                </template>
              </el-table-column>
              <el-table-column prop="dayVouchers" :label="t('formDemo.dayVouchers')" width="80">
                <template #default="data">
                  <el-date-picker
                    v-model="data.row.dayVouchers"
                    v-if="type != 'detail'"
                    type="date"
                    placeholder="Pick a day"
                    format="DD/MM/YYYY"
                  />
                  <div v-else>{{ data.row.createdAt }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="spendFor" :label="t('formDemo.spendFor')" width="120">
                <template #default="data">
                  <el-input type="text" v-model="data.row.spendFor" />
                </template>
              </el-table-column>
              <el-table-column prop="quantity" :label="t('formDemo.sl')" width="60">
                <template #default="data">
                  <el-input type="number" v-model="data.row.quantity" />
                </template>
              </el-table-column>
              <el-table-column prop="unitPrices" :label="t('reuse.unitPrices')">
                <template #default="data">
                  <el-input type="text" v-model="data.row.unitPrices" />
                </template>
              </el-table-column>
              <el-table-column prop="intoMoney" :label="t('formDemo.intoMoney')">
                <template #default="props">
                  <div class="text-right">{{ props.row.intoMoney }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="note" :label="t('reuse.note')" width="90">
                <template #default="data">
                  <el-input type="text" v-model="data.row.note" />
                </template>
              </el-table-column>
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
            <div class="w-[100%] text-xl">{{ moneyDeibt }}</div>
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
            <el-button @click="printPage('IPRFormPrint')">{{ t('button.print') }}</el-button>
            <div>
              <span class="dialog-footer">
                <el-button
                  type="primary"
                  @click="
                    () => {
                      dialogIPRForm = false
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

      <!-- Dialog thông tin hợp đồng thanh lý-->
      <el-dialog v-model="dialogBillLiquidation" class="font-bold" width="40%" align-center>
        <div class="section-bill">
          <div class="flex gap-3 justify-end">
            <el-button
              @click="
                printPageLiquidation('billLiquidationContract', {
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
              <liquidationPurchaseContractPrint :data-customer="customerData" />
            </slot>
          </div>
        </div>
      </el-dialog>

      <!-- Thông tin phiếu thanh toán mua hàng -->
      <el-dialog
        v-model="dialogSalesSlipInfomation"
        :title="t('formDemo.buySlipInformation')"
        width="40%"
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
                sellOrderCode
              }}</div>
            </div>
            <div class="flex-1 flex items-start gap-4">
              <span class="text-right">
                <div>Mã QR đơn hàng</div>
              </span>

              <span class="border">
                <Qrcode :width="100" :text="sellOrderCode" />
              </span>
            </div>
          </div>
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('reuse.purchaseInfo') }}</span>
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
              t('formDemo.productInformationBuy')
            }}</span>
            <span class="block h-1 w-[70%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
        </div>
        <div class="pt-2 pb-2">
          <el-table ref="singleTableRef" :data="tableSalesSlip" border style="width: 100%">
            <el-table-column label="STT" type="index" width="60" align="center" />
            <el-table-column prop="productName" :label="t('formDemo.commodityName')" width="280" />
            <el-table-column prop="quantity" :label="t('reuse.quantity')" width="90" />
            <el-table-column prop="unitPrice" :label="t('reuse.purchaseUnitPrices')">
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
              <p class="text-black font-bold dark:text-white">Tổng thanh toán</p>
            </div>
            <div class="w-[145px] text-right">
              <p class="pr-2">{{
                totalPriceOrder != undefined ? changeMoney.format(totalPriceOrder) : '0 đ'
              }}</p>
              <p class="pr-2 text-black font-bold dark:text-white">{{
                totalPriceOrder != undefined ? changeMoney.format(totalFinalOrder) : '0 đ'
              }}</p>
            </div>
          </div>
          <span
            class="block h-1 float-right w-[45%] border-t-1 dark:border-[#4c4d4f] mt-2 mb-2"
          ></span>
          <div class="flex w-[100%] align-middle justify-end">
            <div class="w-[145px] text-right pr-2">
              <p class="pt-2">Công nợ tồn</p>
              <p class="text-blue-400 pt-2">Thanh toán <span class="text-red-500">*</span></p>

              <p class="text-red-600 pt-2">Còn lại</p>
            </div>
            <div class="w-[145px] text-right">
              <p class="pr-2 pt-2">{{ moneyDeposit ? changeMoney.format(moneyDeposit) : '0 đ' }}</p>
              <CurrencyInputComponent
                :isReadOnly="false"
                v-model="inputDeposit"
                class="handle-fix"
              />
              <p class="pr-2 text-red-600 pt-2">{{
                moneyDeposit ? changeMoney.format(moneyDeposit) : '0 đ'
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
          <div class="flex justify-end">
            <div>
              <span class="dialog-footer">
                <el-button
                  type="primary"
                  @click="
                    () => {
                      dialogSalesSlipInfomation = false
                      postOrderStransaction(1)
                    }
                  "
                  >{{ t('formDemo.saveRecordDebts') }}</el-button
                >
                <el-button @click="dialogSalesSlipInfomation = false">{{
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
            <div class="w-[100%] text-xl">{{ sellOrderCode }}</div>
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
              <el-select v-model="inputRecharger" placeholder="Trần Hữu Dương | 0998844533">
                <el-option
                  v-for="item in optionsCustomerApi"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div class="flex gap-4 pt-4 pb-4 items-center">
              <label class="w-[30%] text-right">{{ t('formDemo.ReasonExchangeReturn') }}</label>
              <div class="w-[100%]">Hàng bị rách góc</div>
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
              <p class="text-black font-bold dark:text-white">Tổng tiền nhập kho</p>
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
              <el-select v-model="inputRecharger" placeholder="Trần Hữu Dương | 0998844533">
                <el-option
                  v-for="item in optionsCustomerApi"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div class="flex gap-4 pt-4 pb-4 items-center">
              <label class="w-[30%] text-right">{{ t('formDemo.ReasonExchangeReturn') }}</label>
              <div class="w-[100%]">Hàng bị rách góc</div>
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
              <p class="text-black font-bold dark:text-white">Tổng tiền nhập kho</p>
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

      <!-- Thông tin phiếu thanh toán đổi/trả hàng -->
      <el-dialog
        v-model="dialogInvoiceReturn"
        :title="t('formDemo.informationOnExchangeAndReturnPaymentVouchers')"
        width="40%"
        @opened="alreadyPaidForTt = false"
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
                sellOrderCode
              }}</div>
            </div>
            <div class="flex-1 flex items-start gap-4">
              <span>
                <div>Mã QR đơn hàng</div>
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
          <div>
            <div class="flex gap-4 pb-4 items-center">
              <label class="w-[30%] text-right">{{ t('formDemo.ReasonExchangeReturn') }}</label>
              <div class="w-[100%]">
                <el-input :placeholder="t('formDemo.enterReasonReturnPayment')" />
              </div>
            </div>
          </div>
          <div class="flex items-center">
            <span class="w-[45%] text-base font-bold break-w">{{
              t('reuse.informationReturnExportProduct')
            }}</span>
            <span class="block h-1 w-[100%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
        </div>
        <div class="pt-2 pb-2">
          <el-table ref="singleTableRef" :data="tableInvoiceExport" border style="width: 100%">
            <el-table-column label="STT" type="index" width="60" align="center" />
            <el-table-column prop="productName" :label="t('formDemo.commodityName')" width="280" />
            <el-table-column prop="accessory" :label="t('reuse.accessory')" width="90">
              <template #default="data">
                <el-input
                  :disabled="checkDisabled"
                  v-model="data.row.accessory"
                  :placeholder="`/${t('formDemo.selfImportAccessories')}/`"
                />
              </template>
            </el-table-column>
            <el-table-column prop="quantity" :label="t('reuse.quantity')" width="90">
              <template #default="data">
                <div v-if="type == 'detail'">
                  {{ data.row.quantity }}
                </div>
                <el-input
                  v-else
                  :disabled="checkDisabled"
                  @change="
                    () => {
                      data.row.finalPrice = data.row.unitPrice * data.row.quantity
                      autoCalculateReturnExportChange()
                    }
                  "
                  v-model="data.row.quantity"
                  style="width: 100%"
                />
              </template>
            </el-table-column>
            <el-table-column prop="unitPrice" :label="t('reuse.returnOrderPrice')">
              <template #default="props">
                <CurrencyInputComponent
                  v-model="props.row.unitPrice"
                  :disabled="checkDisabled"
                  v-if="type != 'detail'"
                  @change="
                    () => {
                      props.row.totalPrice = props.row.unitPrice * props.row.quantity
                      autoCalculateReturnExportChange()
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
            <el-table-column prop="totalPrice" :label="t('reuse.totalReturnMoney')">
              <template #default="props">
                {{ changeMoney.format(props.row.totalPrice) }}
              </template>
            </el-table-column>
          </el-table>
          <div class="flex items-center pt-4 pb-4">
            <span class="w-[45%] text-base font-bold break-w">{{
              t('reuse.informationReturnImportProduct')
            }}</span>
            <span class="block h-1 w-[100%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
          <el-table ref="singleTableRef" :data="tableInvoiceImport" border style="width: 100%">
            <el-table-column label="STT" type="index" width="60" align="center" />
            <el-table-column prop="productName" :label="t('formDemo.commodityName')" width="280" />
            <el-table-column prop="accessory" :label="t('reuse.accessory')" width="90">
              <template #default="data">
                <el-input
                  :disabled="checkDisabled"
                  v-model="data.row.accessory"
                  :placeholder="`/${t('formDemo.selfImportAccessories')}/`"
                />
              </template>
            </el-table-column>
            <el-table-column prop="quantity" :label="t('reuse.quantity')" width="90">
              <template #default="data">
                <div v-if="type == 'detail'">
                  {{ data.row.quantity }}
                </div>
                <el-input
                  v-else
                  :disabled="checkDisabled"
                  @change="
                    () => {
                      data.row.finalPrice = data.row.unitPrice * data.row.quantity
                      autoCalculateReturnImportChange()
                    }
                  "
                  v-model="data.row.quantity"
                  style="width: 100%"
                />
              </template>
            </el-table-column>
            <el-table-column prop="unitPrice" :label="t('reuse.purchaseUnitPrices')">
              <template #default="props">
                <CurrencyInputComponent
                  v-model="props.row.unitPrice"
                  :disabled="checkDisabled"
                  v-if="type != 'detail'"
                  @change="
                    () => {
                      props.row.totalPrice = props.row.unitPrice * props.row.quantity
                      autoCalculateReturnImportChange()
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
            <el-table-column prop="totalPrice" :label="t('reuse.totalReturnMoney')">
              <template #default="props">
                {{ changeMoney.format(props.row.totalPrice) }}
              </template>
            </el-table-column>
          </el-table>
          <div class="flex justify-end pt-2">
            <div class="w-[145px] text-right">
              <p class="text-black dark:text-white">Thành tiền mua</p>
            </div>
            <div class="w-[100px] text-right">
              <p class="pr-2 text-black dark:text-white">{{
                changeMoney.format(tableInvoiceImport[0].finalPrice)
              }}</p>
            </div>
          </div>
          <div class="flex justify-end pt-2">
            <div class="w-[145px] text-right">
              <p class="text-black dark:text-white">Thành tiền hoàn</p>
            </div>
            <div class="w-[100px] text-right">
              <p class="pr-2 text-black dark:text-white">{{
                changeMoney.format(tableInvoiceExport[0].finalPrice)
              }}</p>
            </div>
          </div>
          <div class="flex justify-end pt-2">
            <div class="w-[145px] text-right">
              <p class="text-black font-bold dark:text-white">Thành tiền chênh lệch</p>
            </div>
            <div class="w-[100px] text-right">
              <p class="pr-2 text-black font-bold dark:text-white">{{
                changeMoney.format(intoMoneyReturn)
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
          <div class="flex justify-end">
            <div>
              <span class="dialog-footer">
                <el-button
                  type="primary"
                  size="large"
                  @click="
                    () => {
                      invoiceForGoodsEntering = false
                      if (intoMoneyReturn > 0) postPC()
                      else postPT()
                    }
                  "
                  >{{ t('formDemo.saveRecordDebts') }}</el-button
                >
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
            <div class="flex-1 flex gap-4">
              <label class="w-[50%] min-w-[162.73px] text-right">{{
                t('formDemo.orderCode')
              }}</label>
              <div class="w-[70%] text-xl text-bold text-black dark:text-light">{{
                sellOrderCode
              }}</div>
            </div>
            <div class="flex-1 flex items-start gap-4">
              <span class="text-right">
                <div>Mã QR đơn hàng</div>
                <span class="text-yellow-400">Thanh toán thông qua app Luxdeal</span>
              </span>

              <span class="border">
                <Qrcode :width="100" :text="sellOrderCode" />
              </span>
            </div>
          </div>
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('reuse.purchaseInfo') }}</span>
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
            <el-table-column prop="collected" :label="t('formDemo.collected')" width="90">
              <template #default="props">
                <el-input class="text-right" v-model="props.row.collected" />
              </template>
            </el-table-column>
            <el-table-column prop="spent" :label="t('formDemo.spent')">
              <template #default="props">
                <el-input class="text-right" v-model="props.row.spent" />
              </template>
            </el-table-column>
            <el-table-column prop="intoMoney" :label="t('formDemo.intoMoney')">
              <template #default="props">
                <div class="text-right">{{ props.row.intoMoney }} đ</div>
              </template>
            </el-table-column>
          </el-table>
          <div class="flex justify-end">
            <div class="w-[145px] text-right">
              <p class="text-black font-bold dark:text-white">Tổng thanh toán</p>
            </div>
            <div class="w-[145px] text-right">
              <p class="pr-2 text-black font-bold dark:text-white"></p>
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

      <!-- Địa chỉ nhận hàng -->
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
              <div class="text-sm text-[#303133] font-medium pb-4 dark:text-[#fff]">
                <el-divider content-position="left">{{
                  t('formDemo.orderInformation')
                }}</el-divider>
              </div>
              <el-form-item :label="t('formDemo.orderCode')" prop="orderCode">
                <el-input
                  :disabled="checkDisabled"
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
                  ref="upload"
                  class="upload-demo"
                  action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                  :limit="10"
                  :on-change="handleChange"
                  :before-remove="beforeRemove"
                  :auto-upload="false"
                  :multiple="true"
                  v-model:fileList="ListFileUpload"
                  :disabled="checkDisabled"
                >
                  <el-button>+ {{ t('formDemo.addPhotosOrFiles') }}</el-button>
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
                  ><el-divider content-position="left">{{ t('reuse.supplier') }}</el-divider></div
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
                      <label>{{ t('formDemo.chooseASeller') }}</label>
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
                            :placeHolder="'Chọn người bán'"
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
                  <el-form-item :label="t('reuse.chooseImportWarehouse')" prop="warehouse">
                    <div class="flex w-[100%] max-h-[42px] gap-2 items-center">
                      <div class="flex w-[80%] gap-4"> </div>
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
                    <div>Số điện thoại: {{ infoCompany.phone }}</div>
                    <div>{{ infoCompany.email }}</div>
                  </div>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-collapse-item>

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

      <!-- Thông tin đổi/trả hàng -->
      <el-dialog
        v-model="changeReturnGoods"
        :title="t('formDemo.InformationChangeReturnGoods')"
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
              <el-input v-model="inputReasonReturn" class="w-[100%]" />
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
                    t('formDemo.productInformation')
                  ]"
                  filterable
                  :items="listOfOrderProduct"
                  valueKey="productPropertyId"
                  labelKey="name"
                  :hiddenKey="['id']"
                  :placeHolder="'Chọn mã sản phẩm'"
                  @scroll-top="ScrollProductTop"
                  @scroll-bottom="ScrollProductBottom"
                  :clearable="false"
                  @update-value="(value, obj) => updatePrice(value, obj, props)"
                />
              </template>
            </el-table-column>
            <el-table-column prop="quantity" :label="t('reuse.quantity')" width="90">
              <template #default="props">
                <el-input v-model="props.row.quantity" />
              </template>
            </el-table-column>
            <el-table-column prop="refundUnitPrice" :label="t('reuse.unitPrices')">
              <template #default="props">
                <CurrencyInputComponent v-model="props.row.refundUnitPrice" class="text-right" />
              </template>
            </el-table-column>
            <el-table-column prop="intoUnitPrice" :label="t('formDemo.intoMoney')">
              <template #default="props">
                <div class="text-right">{{
                  moneyFormat(
                    (props.row.intoUnitPrice = props.row.quantity * props.row.refundUnitPrice)
                  )
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
                    t('formDemo.productInformation')
                  ]"
                  filterable
                  :items="listOfOrderProduct"
                  valueKey="productPropertyId"
                  labelKey="name"
                  :hiddenKey="['id']"
                  :placeHolder="'Chọn mã sản phẩm'"
                  @scroll-top="ScrollProductTop"
                  @scroll-bottom="ScrollProductBottom"
                  :clearable="false"
                  @update-value="(value, obj) => updateExchangePrice(value, obj, props)"
                />
              </template>
            </el-table-column>
            <el-table-column prop="quantity" :label="t('reuse.quantity')" width="90">
              <template #default="props">
                <el-input v-model="props.row.quantity" />
              </template>
            </el-table-column>
            <el-table-column prop="unitPrices" :label="t('reuse.returnOrderPrice')">
              <template #default="props">
                <CurrencyInputComponent v-model="props.row.unitPrices" class="text-right" />
              </template>
            </el-table-column>
            <el-table-column prop="intoMoney" :label="t('formDemo.intoMoney')">
              <template #default="props">
                <div class="text-right">{{
                  moneyFormat((props.row.intoMoney = props.row.quantity * props.row.unitPrices))
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
            <p class="pr-2">{{ moneyFormat(refundPrice) }}</p>
            <p class="pr-2">{{ moneyFormat(exportPrice) }}</p>
            <p class="pr-2 text-black font-bold dark:text-white">{{
              moneyFormat(exchangePrice)
            }}</p>
            <p class="pr-2" v-if="exchangePrice > 0">{{ t('reuse.haveToCollect') }}</p>
            <p class="pr-2" v-else>{{ t('reuse.havetoPay') }}</p>
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
            <el-button @click="changeReturnGoods = false">{{ t('button.print') }}</el-button>
            <div>
              <span class="dialog-footer">
                <el-button
                  type="primary"
                  @click="
                    () => {
                      changeReturnGoods = false
                      postReturnRequest()
                    }
                  "
                  >{{ t('formDemo.saveRecordDebts') }}</el-button
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
                :disabled="type == 'edit' ? true : false"
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
              <el-input
                :disabled="type == 'edit' ? true : false"
                v-model="data.row.accessory"
                :placeholder="`/${t('formDemo.selfImportAccessories')}/`"
              />
            </template>
          </el-table-column>

          <el-table-column prop="code" :label="t('formDemo.code')" width="180">
            <template #default="data">
              <el-input
                :disabled="type == 'edit' ? true : false"
                v-model="data.row.code"
                :placeholder="`/${t('formDemo.selfImportCode')}/`"
              />
            </template>
          </el-table-column>

          <el-table-column
            prop="quantity"
            :label="t('formDemo.amountBuy')"
            align="center"
            width="90"
          >
            <template #default="data">
              <div v-if="type == 'detail'">
                {{ data.row.quantity }}
              </div>
              <el-input
                v-else
                :disabled="type == 'edit' ? true : false"
                type="number"
                @change="
                  () => {
                    data.row.totalPrice = data.row.unitPrice * data.row.quantity
                    autoCalculateOrder()
                  }
                "
                v-model="data.row.quantity"
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
                :disabled="type == 'edit' ? true : false"
                :isReadOnly="type == 'detail' || type == 'edit' ? true : false"
                v-if="type != 'detail'"
                @change="
                  () => {
                    props.row.totalPrice = props.row.unitPrice * props.row.quantity
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
            align="left"
            width="180"
          >
            <template #default="props">
              {{ changeMoney.format(props.row.totalPrice) }}
            </template>
          </el-table-column>

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
                    :disabled="type == 'edit' ? true : false"
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

          <el-table-column prop="warehouseName" :label="t('reuse.importWarehouse')" min-width="200">
            <template #default="props">
              <div class="flex w-[100%] items-center">
                <div class="w-[40%]">{{ props.row.warehouseName }}</div>
                <div class="w-[60%]">
                  <el-button
                    text
                    :disabled="type == 'edit' ? true : false"
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
              <el-button
                :disabled="type == 'edit' ? true : false"
                @click.prevent="removeListProductsSale(scope.$index)"
                class="bg-[#F56C6C] pt-2 pb-2 pl-4 pr-4 text-[#fff] rounded"
                >{{ t('reuse.delete') }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-button
          class="ml-4 mt-4"
          v-if="type != 'detail'"
          :disabled="type == 'edit' ? true : false"
          @click="addLastIndexSellTable"
          >+ {{ t('formDemo.add') }}</el-button
        >
        <div class="flex justify-end pt-4">
          <div class="w-50">
            <div class="dark:text-[#fff]">{{ t('formDemo.intoMoney') }}</div>
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
                          <el-radio class="text-left" style="color: blue" label="0">{{
                            t('formDemo.VATNotIncluded')
                          }}</el-radio>
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
              t('formDemo.totalAmountReceivable')
            }}</div>
          </div>

          <div class="w-30">
            <div class="text-right dark:text-[#fff]">{{
              totalPriceOrder != undefined ? changeMoney.format(totalPriceOrder) : '0 đ'
            }}</div>
            <div class="h-[32px] text-right dark:text-[#fff]">
              <div v-if="VAT">{{ changeMoney.format(moneyVAT) }}</div>
              <div v-else class="text-transparent :dark:text-transparent">s</div>
            </div>

            <div class="text-right dark:text-[#fff]">{{
              totalPriceOrder != undefined ? changeMoney.format(totalFinalOrder) : '0 đ'
            }}</div>
          </div>
        </div>
        <div class="w-[100%]">
          <el-divider content-position="left">{{ t('formDemo.statusAndManipulation') }}</el-divider>
        </div>
        <div class="flex gap-4 w-[100%] ml-1 items-center pb-3">
          <label class="w-[9%] text-right">{{ t('formDemo.orderStatus_Tracking') }}</label>
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
          <label class="w-[9%] text-right">{{ t('formDemo.orderStatus') }}</label>
          <div class="w-[84%] pl-1">
            <div class="flex items-center w-[100%]">
              <div
                class="duplicate-status"
                v-for="item in arrayStatusOrder"
                :key="item.orderStatus"
              >
                <div
                  v-if="
                    item.orderStatus == STATUS_ORDER_PURCHASE[1].orderStatus ||
                    item.orderStatus == STATUS_ORDER_PURCHASE[6].orderStatus ||
                    item.orderStatus == STATUS_ORDER_PURCHASE[7].orderStatus
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
                  <i class="text-gray-300">{{ dateTimeFormat(item.createdAt) }}</i>
                </div>
                <div
                  v-else-if="
                    item.orderStatus == STATUS_ORDER_PURCHASE[2].orderStatus ||
                    item.orderStatus == STATUS_ORDER_PURCHASE[3].orderStatus ||
                    item.orderStatus == STATUS_ORDER_PURCHASE[4].orderStatus
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
                  <i class="text-gray-300">{{ dateTimeFormat(item.createdAt) }}</i>
                </div>
                <div v-else-if="item.orderStatus == STATUS_ORDER_PURCHASE[5].orderStatus">
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
                  <i class="text-gray-300">{{ dateTimeFormat(item.createdAt) }}</i>
                </div>
                <div v-else-if="item.orderStatus == STATUS_ORDER_PURCHASE[8].orderStatus">
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
                  <i class="text-gray-300">{{ dateTimeFormat(item.createdAt) }}</i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="w-[100%] flex gap-2">
          <div class="w-[12%]"></div>
          <div v-if="editButton" class="w-[100%] flex ml-1 gap-4">
            <el-button
              :disabled="checkDisabled"
              @click="
                () => {
                  editOrderInfo()
                  editButton = false
                }
              "
              type="primary"
              class="min-w-42 min-h-11"
              >{{ t('reuse.save') }}</el-button
            >
            <el-button
              @click="
                () => {
                  editButton = false
                  statusOrder = 2
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
                statusOrder == STATUS_ORDER_PURCHASE[1].orderStatus ||
                statusOrder == STATUS_ORDER_PURCHASE[2].orderStatus ||
                statusOrder == STATUS_ORDER_PURCHASE[3].orderStatus ||
                statusOrder == STATUS_ORDER_PURCHASE[4].orderStatus ||
                statusOrder == STATUS_ORDER_PURCHASE[7].orderStatus
              "
              :disabled="doubleDisabled"
              @click="dialogBillLiquidation = true"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.printLiquidationContract') }}</el-button
            >
            <el-button
              @click="openBillDialog"
              v-if="
                statusOrder == STATUS_ORDER_PURCHASE[1].orderStatus ||
                statusOrder == STATUS_ORDER_PURCHASE[2].orderStatus ||
                statusOrder == STATUS_ORDER_PURCHASE[3].orderStatus ||
                statusOrder == STATUS_ORDER_PURCHASE[4].orderStatus
              "
              :disabled="doubleDisabled"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.paymentDepositSlipAdvance') }}</el-button
            >
            <el-button
              v-if="statusOrder == STATUS_ORDER_PURCHASE[2].orderStatus"
              :disabled="checkDisabled"
              @click="editButton = true"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.editOrder') }}</el-button
            >
            <el-button
              type="primary"
              @click="
                () => {
                  statusOrder = 3
                  addStatusOrder(3)
                }
              "
              v-if="statusOrder == STATUS_ORDER_PURCHASE[2].orderStatus"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.orderSuccess') }}</el-button
            >
            <el-button
              type="primary"
              @click="
                () => {
                  statusOrder = 4
                  addStatusOrder(4)
                }
              "
              v-if="
                statusOrder == STATUS_ORDER_PURCHASE[2].orderStatus ||
                statusOrder == STATUS_ORDER_PURCHASE[3].orderStatus
              "
              class="min-w-42 min-h-11"
              >{{ t('formDemo.purchaseSuccess') }}</el-button
            >
            <el-button
              :disabled="checkDisabled"
              @click="
                () => {
                  statusOrder = 6
                  addStatusOrder(6)
                }
              "
              v-if="statusOrder == STATUS_ORDER_PURCHASE[4].orderStatus"
              type="warning"
              class="min-w-42 min-h-11 bg-[#FFF0D9] text-[#FD9800] rounded font-bold"
              >{{ t('formDemo.exchangeReturnGoods') }}</el-button
            >
            <el-button
              @click="
                () => {
                  statusOrder = 7
                  dialogInvoiceReturn = true
                }
              "
              class="min-w-42 min-h-11 bg-[#FFF0D9] text-[#FD9800] rounded font-bold"
            >
              {{ t('formDemo.exchangeReturnGoods') }}
            </el-button>
            <el-button
              :disabled="checkDisabled"
              @click="statusOrder = 8"
              v-if="statusOrder == STATUS_ORDER_PURCHASE[7].orderStatus"
              class="min-w-42 min-h-11 bg-[#FFF0D9] text-[#FD9800] rounded font-bold"
              >{{ t('formDemo.completeExchangeReturn') }}</el-button
            >

            <el-button
              :disabled="checkDisabled"
              @click="statusOrder = 9"
              v-if="
                statusOrder == STATUS_ORDER_PURCHASE[4].orderStatus ||
                statusOrder == STATUS_ORDER_PURCHASE[7].orderStatus
              "
              class="min-w-42 min-h-11 bg-[#D9D9D9]"
              >{{ t('formDemo.checkFinish') }}</el-button
            >
            <el-button
              v-if="statusOrder == STATUS_ORDER_PURCHASE[6].orderStatus"
              :disabled="checkDisabled"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.cancellationReturn') }}</el-button
            >
            <el-button
              :disabled="checkDisabled"
              v-if="statusOrder == STATUS_ORDER_PURCHASE[1].orderStatus"
              @click="
                () => {
                  submitForm(ruleFormRef, ruleFormRef2)
                  statusOrder = 2
                }
              "
              type="primary"
              class="min-w-42 min-h-11"
              >{{ t('reuse.saveAndPending') }}</el-button
            >
            <el-button
              v-if="
                statusOrder == STATUS_ORDER_PURCHASE[1].orderStatus ||
                statusOrder == STATUS_ORDER_PURCHASE[2].orderStatus ||
                statusOrder == STATUS_ORDER_PURCHASE[3].orderStatus
              "
              @click="
                () => {
                  statusOrder = 8
                  addStatusOrder(8)
                  cancelOrderPurchase()
                }
              "
              :disabled="checkDisabled"
              type="danger"
              class="min-w-42 min-h-11"
              >{{ t('button.cancelOrder') }}</el-button
            >
          </div>
        </div>
      </el-collapse-item>

      <el-collapse-item :name="collapse[2].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[2].icon" link />
          <span class="text-center text-xl">{{ collapse[2].title }}</span>
        </template>
        <el-button :disabled="checkDisabled" text @click="dialogAccountingEntryAdditional = true"
          >+ Thêm bút toán</el-button
        >
        <el-button @click="openReceiptDialog" text>+ Thêm phiếu thu</el-button>
        <el-button @click="openPaymentDialog" text>+ Thêm phiếu chi</el-button>
        <el-button @click="openPaymentRequestDialog" text>+ Thêm đề nghị thanh toán</el-button>
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
              <div>{{ dateTimeFormat(data.row.createdAt) }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="content"
            :label="t('formDemo.certificateInformation')"
            min-width="240"
          >
            <template #default="data">
              <div>{{ data.row.content }}</div>
            </template>
          </el-table-column>
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
              <div @click="dialogIPRForm = true" class="cursor-pointer text-blue-500">{{
                props.row.paymentRequestCode
              }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="receiveMoney"
            :label="t('formDemo.collected')"
            align="left"
            min-width="150"
          >
            <template #default="data">
              <div class="text-right">{{ data.row.receiveMoney }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="paidMoney" :label="t('formDemo.spent')" min-width="150">
            <template #default="data">
              <div class="text-right">{{ data.row.paidMoney }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="deibt" :label="t('formDemo.buysDebt')" min-width="150">
            <template #default="data">
              <div class="text-right">
                {{ data.row.deibt }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="typeOfPayment"
            :label="t('formDemo.receivableOrPayable')"
            min-width="120"
          >
            <template #default="props">
              <div v-if="props.row.deibt < 0" class="text-blue-500"> Phải thu </div>
              <div v-else-if="props.row.deibt > 0" class="text-red-500"> Phải chi </div>
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
                props.row.status == 0 ? t('formDemo.recorded') : t('formDemo.cancelled')
              }}</div>
            </template>
          </el-table-column>

          <el-table-column :label="t('formDemo.manipulation')" min-width="120" align="center">
            <template #default="data">
              <div class="flex">
                <button
                  @click="(index) => getAccountingEntry(index, data)"
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
              prop="productPropertyId"
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
              prop="invoiceGoodsEnteringWarehouse"
              :label="t('formDemo.importExportWarehouse')"
              align="left"
              width="200"
            >
              <template #default="props">
                <div
                  v-if="props.row.invoiceGoodsEnteringWarehouse == 0"
                  @click="informationWarehouseReceipt = true"
                  class="text-blue-500"
                >
                  NK3424
                </div>
                <div v-else @click="invoiceForGoodsEntering = true" class="text-blue-500">
                  NK3424
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="inventoryStatus"
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

  #billLiquidationContract {
    display: none;
  }
}

@media print {
  #printPage {
    display: block;
    /* Hidden by default */
    position: fixed;
    /* Stay in place */
    z-index: 10;
    /* Sit on top */
    left: 0;
    top: 0;
    width: 100%;
    /* Full width */
    height: 100%;
    /* Full height */
    overflow: auto;
    /* Enable scroll if needed */
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
</style>
