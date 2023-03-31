<script setup lang="ts">
import { onBeforeMount, reactive, ref, unref, watch } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import {
  ElCollapse,
  ElCollapseItem,
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
  ElFormItem,
  FormInstance,
  UploadUserFile,
  ElNotification,
  ElMessage,
  ElTooltip} from 'element-plus'
import MultipleOptionsBox from '@/components/MultipleOptionsBox.vue'
import { appModules } from '@/config/app'

import billLoanConfirmation from '../../Components/formPrint/src/billLoanConfirmation.vue'
import { dateTimeFormat, moneyFormat, formatOrderReturnReason, postDateTime } from '@/utils/format'
import ReturnOrder from './ReturnOrder.vue'
import { FORM_IMAGES } from '@/utils/format'
import Qrcode from '@/components/Qrcode/src/Qrcode.vue'

import {
  getProductsList,
  getCollaboratorsInOrderList,
  getAllCustomer,
  getCustomerById,
  addNewOrderList,
  getOrderList,
  getOrderTransaction,
  getCodePaymentRequest,
  addDNTT,
  addTPV,
  getReceiptPaymentVoucher,
  getDetailReceiptPaymentVoucher,
  addOrderStransaction,
  createReturnRequest,
  getReturnRequestForOrder,
  addQuickCustomer,
  getDetailAccountingEntryById,
  GetProductPropertyInventory,
  getListWareHouse,
  updateOrderInfo,
  approvalOrder,
  GetPaymentRequestDetail,
  updateOrderTransaction,
createTicketFromReturnOrder,
GenerateCodeOrder,
cancelReturnOrder,
finishReturnOrder,
GetWarehouseTransaction,
updateStatusTransaction,
GetMoneyAndDatePayment
} from '@/api/Business'
import { useIcon } from '@/hooks/web/useIcon'
import { Collapse } from '../../Components/Type'
import moment from 'moment'
import { useRoute, useRouter } from 'vue-router'
import { STATUS_ORDER_PAWN } from '@/utils/API.Variables'
import CurrencyInputComponent from '@/components/CurrencyInputComponent.vue'
//them nhanh sp
import { getBrandSelectOptions, getUnitSelectOptions, getOriginSelectOptions, getCategory } from '@/views/Pages/ProductsAndServices/ProductLibrary/ProductLibraryManagement'
import { deleteProductProperty } from '@/api/LibraryAndSetting'
import AddQuickProduct from './AddQuickProduct.vue'
import StatusWarehouse from '@/views/Pages/Warehouse/BusinessProductWarehouse/StatusWarehouse.vue'

import UploadMultipleImages from './UploadMultipleImages.vue'
import { API_URL } from '@/utils/API_URL'
import * as orderUtility from './OrderFixbug'
import { TicketType } from '../../Warehouse/BusinessProductWarehouse/TicketEnum'
import { deleteTempCode } from '@/api/common'
import { changeMoney } from '@/utils/tsxHelper'

const { t } = useI18n()
const { utility } = appModules

const doCloseOnClickModal = ref(false)

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
    title: t('formDemo.listOfPawnProducts') ,
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
  quantity: number
  businessSetup: string
  businessSetupName: string
  accessory: string | undefined
  code: string | undefined
  description: string | undefined
  warehouseInfo: {}
  unitName: string
  interestMoney: number
  TotalPrice: number
  price: string | number | undefined
  finalPrice: string
  paymentType: string
  edited: boolean
  warehouseId: number | undefined
  warehouseName: string
  newProduct: Boolean
  principalMoney: number
  principalDebt: number
  returnedQuantity: number
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
  quantity: 1,
  accessory: '',
  code: '',
  description: '',
  businessSetup: '',
  businessSetupName: '',
  warehouseInfo: {},
  unitName: '',
  principalMoney: 0,
  principalDebt: 0,
  interestMoney: 0,
  TotalPrice: 0,
  price: '',
  finalPrice: '',
  paymentType: '',
  edited: true,
  warehouseId: undefined,
  warehouseName: '',
  newProduct:false,
  returnedQuantity: 0
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

const removeListProductsSale = async (index) => {
  if (!ListOfProductsForSale[ListOfProductsForSale.value.length - 1]) {

    if(ListOfProductsForSale.value[index].newProduct == true){
      listProducts.value.splice(listProducts.value.findIndex(product => product.productPropertyId == ListOfProductsForSale.value[index].productPropertyId),1)
      await deleteProductProperty({Id: ListOfProductsForSale.value[index].productPropertyId})
    }

    ListOfProductsForSale.value.splice(index, 1)
  }
  if(ListOfProductsForSale.value.length == 0){
    addLastIndexSellTable()
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

// IsOrganization: valueClassify.value,
//     Name: addQuickCustomerName.value,
//     TaxCode: quickTaxCode.value,
//     Representative: quickRepresentative.value,
//     Phonenumber: quickPhoneNumber.value,
//     Email: quickEmail.value,
//     DistrictId: 1,
//     WardId: 1,
//     Address: 1,
//     CustomerType: valueSelectCustomer.value
var autoCustomerCode = 'KH' + moment().format('hhmmss')
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
  const res =  await addQuickCustomer(formCustomerPayLoad)
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

const valueMoneyAccoungtingEntry = ref(0)

const autoChangeMoneyAccountingEntry = (_val, scope) => {
  valueMoneyAccoungtingEntry.value = 0
  const data = scope.row
  data.intoMoney = Math.abs(parseInt(data.paidMoney) - parseInt(data.receiveMoney))

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
  optionsCollaborators.value.push(
    {
      value: currentCreator.value.id,
      label: currentCreator.value.name + ' | ' + currentCreator.value.contact
    }
  )
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

let idPayment = ref()
// Thêm mới phiếu đề nghị thanh toán
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
  await addDNTT(formDataPayLoad)
  .then((res)=>{
    idPayment.value = res.paymentRequestId
    ElNotification({
      message: t('reuse.addSuccess'),
      type: 'success'
    })})
  .catch(()=>{
    ElNotification({
      message: t('reuse.addFail'),
      type: 'error'
    })})
  handleChangePaymentRequest()
}

//thêm nahnh sp
const dialogAddProduct = ref(false)
let callProductApi = 0
const currentNewProductRow = ref(-1)
const addnewproduct = (currentRow) => {
  currentNewProductRow.value = currentRow
  dialogAddProduct.value = true
  if(callProductApi == 0){
    Promise.all([getBrandSelectOptions(),getUnitSelectOptions(),getOriginSelectOptions(),getCategory()])
  }
  callProductApi++
}

const postQuickProduct = (product,productId)=>{
  listProducts.value?.unshift({
      productCode: product.productCode,
      value: product.code,
      name: product.name ?? '',
      unit: '',
      price: 0,
      productPropertyId: productId,
      productPropertyCode: product.productPropertyCode
    })

    //Change productpropertyId of currentNewProductRow
    ListOfProductsForSale.value[currentNewProductRow.value].productPropertyId = productId
    ListOfProductsForSale.value[currentNewProductRow.value].productName = product.name
    //set value like newProduct:true
    ListOfProductsForSale.value[currentNewProductRow.value].newProduct = true
    //when remove row check newProduct if(true){call api remove proudct(id), shift listProducts}
}
//end thêm nhanh sp

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
      productCode: product.productCode,
      value: product.code,
      name: product.name ?? '',
      inventory:product.tonKho??0,
      unit: product.unitName,
      price: product.price,
      productPropertyId: product.id,
      productPropertyCode: product.productPropertyCode
    }))
  }
  if(disabledEdit.value){
    ListOfProductsForSale.value.forEach((row)=>{
      const found = listProducts.value.find((product)=>product.productPropertyId == row.productPropertyId)
      if(!found){
        getProductsList({ Keyword: row.productPropertyCode, ServiceType: 2, IsApprove: true })
        .then((res)=>{
          listProducts.value?.unshift({
            productCode: res.data[0].productCode,
            value: res.data[0].code,
            name: res.data[0].name ?? '',
            inventory:res.data[0].tonKho?? 0,
            unit: res.data[0].unitName,
            price: res.data[0].price,
            productPropertyId: res.data[0].id,
            productPropertyCode: res.data[0].productPropertyCode
          })
        })
        .catch(()=>{
          ElNotification({
            message: t('reuse.cantFindProduct'),
            type: 'error'
          })
        })
      }
    })
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
                  productCode: product.productCode,
                  value: product.code,
                  name: product.name ?? '',
                  inventory:product.tonKho??0,
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
const disabledPTAccountingEntry = ref(true)
const disabledPCAccountingEntry = ref(true)
const disabledDNTTAccountingEntry = ref(true)

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


const dialogInformationReceipts = ref(false)
const dialogPaymentVoucher = ref(false)
const dialogIPRForm = ref(false)
const valueProvince = ref('')
const valueCommune = ref('')

const ruleFormRef = ref<FormInstance>()
const ruleFormRef2 = ref<FormInstance>()


interface IRuleForm {
  orderCode: string
  collaborators: string
  pawnTerm: any
  paymentPeriod: number
  collaboratorCommission: string
  orderNotes: string
  customerName: string
  delivery: number
  warehouse: string
  orderFiles: Array<any>
}

const ruleForm = reactive({paymentPeriod: 10, delivery: 1} as IRuleForm )
const inputDeposit = ref(0)

const rules = reactive<FormRules>({
  orderCode: [{ required: true, message: t('formDemo.pleaseInputOrderCode'), trigger: 'blur' }],
  warehouse: [
    {
      required: true,
      message: t('formDemo.pleaseSelectWarehouse'),
      trigger: 'change'
    }
  ],
  collaboratorCommission: [
    {
      validator: orderUtility.checkPercent,
      trigger: 'blur'
    }
  ],
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
let orderDetailsTable = reactive([{}])
const disableEditData = ref(false)
// tạo đơn hàng
const checkDisabled = ref(false)
let idOrderPost = ref()

const postData = async () => {
  orderDetailsTable = ListOfProductsForSale.value
  .filter((row)=>row.productPropertyId && row.productPropertyId !== '' && row.productPropertyId != null)
  .map((val) => ({
    ProductPropertyId: parseInt(val.productPropertyId),
    Quantity: val.quantity,
    ProductPrice: 0,
    UnitPrice: 0,
    HirePrice: 0,
    DepositePrice: 0,
    InterestMoney: val.interestMoney,
    TotalPrice: 0,
    BusinessSetup: val.businessSetup,
    ConsignmentSellPrice: 0,
    ConsignmentHirePrice: 0,
    Accessory: val.accessory,
    Code: val.code,
    Description: val.description,
    PrincipalMoney: val.principalMoney,
    PrincipalDebt: val.principalDebt
  }))

  if(orderUtility.ValidatePostData(ListOfProductsForSale.value) == false){
      return
    }
    
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
    Files: Files.value,
    Address: enterdetailAddress.value,
    OrderDetail: productPayment,
    fromDate: postDateTime(ruleForm.pawnTerm[0]),
    toDate: postDateTime(ruleForm.pawnTerm[1]),
    CampaignId: 2,
    VAT: 1,
    WarehouseId: ruleForm.warehouse,
    Days: ruleForm.paymentPeriod,
    TotalPrice: totalPrincipalMoney.value,
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

    let arrayLength = arrayStatusOrder.value?.length
          while(statusOrder.value == 49 /*Trả 1 phần*/){
            arrayLength -= 2
            statusOrder.value = arrayStatusOrder.value[arrayLength - 1]?.orderStatus
          }
  }
}

const approvalFunction = async (isApprove) => {
  const payload = { ItemType: 2, Id: parseInt(approvalId), IsApprove: isApprove }
  await approvalOrder(FORM_IMAGES(payload))
  push({
    name: `approve.orders-approval.orders-new`
  })
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

const nameDialog = ref('')

const dialogFeePaymentSlip = ref(false)
const initDataTablePawnSlip = () =>{
  ListOfProductsForSale.value.forEach(async (row,index)=>{
    if(index ==0){//Can only show 1 product
      await GetMoneyAndDatePayment({CustomerOrderId: id, ProductPropertyId:row.productPropertyId})
      .then((res)=>{
        tablePawnSlip.value[index].id = row.id
        tablePawnSlip.value[index].productPropertyId = row.productPropertyId
        tablePawnSlip.value[index].productName = row.productName
        tablePawnSlip.value[index].productCode = row.productCode
        tablePawnSlip.value[index].quantity = row.quantity
        tablePawnSlip.value[index].interestMoney = row.interestMoney
        tablePawnSlip.value[index].principalDebt = res.data.principalDebt
        tablePawnSlip.value[index].lastPaymentDate = res.data.lastPaymentDate
        tablePawnSlip.value[index].nextPaymentDate = moment().isBefore(moment(res.data.lastPaymentDate), 'day') ? moment(res.data.lastPaymentDate).format() : moment().format()
      })}
  })
}

function openDepositDialog() {
  showCreatedOrUpdateButton.value = true
  showCancelAcountingEntry.value = false
  initDataTablePawnSlip()
  alreadyPaidForTt.value = true
  dialogFeePaymentSlip.value = !dialogFeePaymentSlip.value
  nameDialog.value = 'deposit'
  updateDetailAcountingEntry.value = false
}
const dialogPawnCouponInfomation = ref(false)
function openBillPawnDialog() {
  alreadyPaidForTt.value = true
  showCreatedOrUpdateButton.value = true
  showCancelAcountingEntry.value = false
  dialogPawnCouponInfomation.value = !dialogPawnCouponInfomation.value
  nameDialog.value = 'billPawn'
  tablePawnSlip.value = ListOfProductsForSale.value
}
// Tạo mới yêu cầu đổi trả
const postReturnRequest = async (reason) => {
  let tableReturnPost = [{}]
  // if (rentReturnOrder.value.tableData.length < 2) {
  //   return
  // }
  // rentReturnOrder.value.tableData.pop()
  tableReturnPost = rentReturnOrder.value.tableData.map((e) => ({
    productPropertyId: Number(e.productPropertyId),
    quantity: Number(e.quantity),
    accessory: e.accessory
  }))
  const payload = {
    customerOrderId: id,
    code: autoCodeReturnRequest,
    name: formatOrderReturnReason(reason),
    description: formatOrderReturnReason(reason),
    returnRequestType: reason,
    targetDate: reason == 5 ? rentReturnOrder.value.extendDate : null,
    giaHanDetails: reason == 5 ? tableReturnPost :[],
    nhapDetails: [],
    xuatDetails: reason != 5 ? tableReturnPost : [],
  }
  await createReturnRequest(payload).then(async (res)=>{
    idReturnRequest.value = res
    if(reason != 5) {await createTicketFromReturnOrders()}
    getReturnRequestTable()
    editData()
  })
  .catch((err) => {
      ElNotification({
      message: err?.response?.data?.message || 'Đơn hàng chưa được xuất kho',
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

const extendDate = (date) => {
  rentReturnOrder.value.extendDate = date
}
// Lấy bảng lịch sử nhập xuất đổi trả
const getReturnRequestTable = async () => {
  const res = await getReturnRequestForOrder({ CustomerOrderId: id })
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
      returnDetailStatusName: e.returnDetailStatusName,
      warehouseTicketStatusName: e.warehouseTicketStatusName,
      warehouseTicketCode: e.warehouseTicketCode,
      warehouseTicketId: e.warehouseTicketId,
      warehouseTicketStatus: e.warehouseTicketStatus
    }))
    orderUtility.checkStatusReturnRequestInWarehouse(historyTable.value[0]?.warehouseTicketStatus)
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
    
    if(scope.row.typeOfAccountingEntry == 5){
      openAccountingEntry(scope.row.id, scope.row.orderTypeBTSpa)
      paymentRequestFromAnotherOrder.value = true
    }
    else{
    dialogIPRForm.value = true
    }
  }
}

// Dialog trả hàng trước hạn
const chuocTruocHan = ref(false)
const chuocHetHan = ref(false)

const earlyEedemption = ref(false)
const dutHang = ref(false)
const giaHan = ref(false)

const getOrderStransactionList = async () => {
  const transaction = await getOrderTransaction({ id: id })
  debtTable.value = transaction.data
  
  if(transaction.data.length > 0){
      DoiPhieuCamDo.value = false
    }
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
// const handleChangePaymentRequest = () => {
//   if (newTable.value?.length) {
//     newTable.value.forEach((val) => {
//       debtTable.value.forEach((e) => {
//         if (e.content == val.content) {
//           e.paymentRequestId = codePaymentRequest.value
//         }
//       })
//     })
//   }
// }

// Thêm mới mã phiếu đề nghị thanh toán vào debtTable
const handleChangePaymentRequest = async () => {
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

const inputReasonReturn = ref('Hàng bị rách góc')
const tableAccountingEntry = ref([
  {
    content: '',
    kindOfMoney: '',
    receiveMoney: 0,
    paidMoney: 0,
    intoMoney: 0
  }
])

var autoCodeReturnRequest = 'DT' + moment().format('hms')

let childrenTable = ref()
let objOrderStransaction = ref()
const checkPTC = ref(0)
let moneyDeposit = ref(0)

const updateDetailAcountingEntry = ref(false)
const updateInfoAcountingEntry = async(index) => {
  if (updateDetailAcountingEntry.value) {
    updateOrderStransaction()
  }else {
    postOrderStransaction(index)
  }
}

// cập nhật bút toán
const updateOrderStransaction = async() => {
  const payload = {
    accountingEntryId: idAccounting.value,
    isReceiptedMoney: alreadyPaidForTt.value,
    paymentMethods: payment.value
  }
  await updateOrderTransaction(payload)
  .then(()=>{
    ElNotification({
        message: t('reuse.addSuccess'),
        type: 'success'
      })
  })
  .catch(()=>{
    ElNotification({
        message: t('reuse.addFail'),
        type: 'error'
      })
  })
  getOrderStransactionList()
}

// Thêm bút toán cho đơn hàng
const moneyToText = ref('')
const postOrderStransaction = async (index: number) => {
  childrenTable.value = tablePawnSlip.value.map((val) => ({
    merchadiseTobePayforId: parseInt(val.id),
    quantity: val.quantity,
    price: val.pawnPrice,
    principalDebt: val.principalDebt,
    lastPaymentDate: val.lastPaymentDate,
    nextPaymentDate: val.nextPaymentDate
  }))
  let deibtPawnFee = 0
  if(paymentType.value == 4){
    moment().isBefore(moment(tablePawnSlip.value[0]?.lastPaymentDate), 'day') 
    ? deibtPawnFee = 0 - tablePawnSlip.value[0]?.pawnPrice
    : deibtPawnFee =  daysDiff(tablePawnSlip.value[0]?.lastPaymentDate,moment().format()) * (tablePawnSlip.value[0]?.interestMoney) * (tablePawnSlip.value[0]?.principalDebt/ 1000000) - tablePawnSlip.value[0]?.pawnPrice
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
        : tableAccountingEntry.value[0].content,
    paymentRequestId: null,
    receiptOrPaymentVoucherId: null,
    receiveMoney:
      index == 1
        ? tablePawnSlip.value[0].pawnPrice
        : index == 2
        ? 0
        : tableAccountingEntry.value[0].receiveMoney,
    paidMoney:
      index == 1 
        ? 0
        : 
      index == 2
        ? totalPrincipalMoney.value
        : tableAccountingEntry.value[0].paidMoney,
    deibt: index == 1 ? deibtPawnFee : index == 2 || index == 3 || index == 4 ? 0 : moneyDeposit.value,
    typeOfPayment: index == 1 || index == 2 ? 1 : index == 3 || index == 4 ? checkPTC.value : 0,
    paymentMethods: payment.value,
    status: 1,
    isReceiptedMoney: alreadyPaidForTt.value ? 1 : 0,
    typeOfMoney: paymentType.value,
    merchadiseTobePayfor: childrenTable.value,
    typeOfAccountingEntry: index,
    returnRequestId: idReturnRequest.value
  }
  objOrderStransaction.value = await addOrderStransaction(payload)
  .then(()=>{
    ElNotification({
        message: t('reuse.addSuccess'),
        type: 'success'
      })
  })
  .catch(()=>{
    ElNotification({
        message: t('reuse.addFail'),
        type: 'error'
      })
  })
  inputDeposit.value = 0
  getOrderStransactionList()
}

// Cập nhật trạng thái bút toán
const UpdateStatusTransaction = async() => {
  const payload = {
    AccountingEntryId: idAccounting.value,
    OrderTransactionStatus: 0
  }

  await updateStatusTransaction(FORM_IMAGES(payload))
  .then(()=>{
    ElNotification({
        message: t('reuse.cancelSuccess'),
        type: 'success'
      })
  })
  .catch(()=>{
    ElNotification({
        message: t('reuse.cancelFail'),
        type: 'error'
      })
  })
  // Cập nhật lại bảng lịch sử công nợ
  await getOrderStransactionList()
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
const handleSelectionbusinessManagement = (val: tableDataType[]) => {
  const label = val.map((e) => e.applyExport)
  const x = val.map((e) => e.id)
  ListOfProductsForSale.value[indexRow.value].businessSetup = x.join(', ')
  ListOfProductsForSale.value[indexRow.value].businessSetupName = label.join(', ')
}

const optionsChooseMoneyType = [
  {
    value: 4,
    label: 'Phí cầm đồ'
  },
  {
    value: 0,
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
const Files = ref<UploadUserFile[]>([])

const disableCreateOrder = ref(false)
const disabledDate = (_time: Date) => {
  return false
  // return time.getTime() <= Date.now() - 86400000
}
const totalPrincipalMoney = ref(0)
const totalPrincipalDebt = ref(0)
const priceintoMoneyByday = ref(0)
const editData = async () => {
  await orderUtility.getStatusWarehouse(id)

  if (type == 'detail') checkDisabled.value = true
  disableEditData.value = true
  if (type == 'approval-order') {
    statusOrder.value = 200
    checkDisabled.value = true
  }
  if (type == 'edit' || type == 'detail' || type == 'approval-order') {


    disabledEdit.value = true
    disableCreateOrder.value = true
    const res = await getOrderList({ Id: id, ServiceType: 4 })
    const transaction = await getOrderTransaction({ id: id })
    if (debtTable.value.length > 0) debtTable.value.splice(0, debtTable.value.length - 1)
    debtTable.value = transaction.data

    if(transaction.data.length > 0){
      DoiPhieuCamDo.value = false
    }
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
    //sửa trạng thái trả hàng
    let arrayLength = arrayStatusOrder.value?.length
          while(statusOrder.value == 49 /*Trả 1 phần*/){
            arrayLength -= 2
            statusOrder.value = arrayStatusOrder.value[arrayLength - 1]?.orderStatus
          }

    //để render button
    if(statusOrder.value == 46){
      statusOrder.value = 41
    }
    if(statusOrder.value == 47){
      statusOrder.value = 43
    }

    if (statusOrder.value == 2 && type == 'edit') {
      disableEditData.value = true
      editButton.value = true
    }

    if (res.data) {
      customerData.customerId = orderObj.customerId
      await getCustomerInfo(customerData.customerId)
      ruleForm.orderCode = orderObj.code
      ruleForm.pawnTerm = [orderObj.fromDate, orderObj.toDate]
      pawnOrderCode.value = ruleForm.orderCode
      totalPrincipalMoney.value = orderObj.totalPrice
      ruleForm.paymentPeriod = orderObj.days
      priceintoMoneyByday.value = orderObj.interestMoney
      customerID.value = orderObj?.customer?.id
      ruleForm.collaborators = orderObj?.collaborator?.id
      ruleForm.collaboratorCommission = orderObj.collaboratorCommission
      ruleForm.customerName = orderObj.customer?.id
      ruleForm.orderNotes = orderObj.description
      ruleForm.warehouse = orderObj?.warehouseId

      totalOrder.value = orderObj.totalPrice
      if (ListOfProductsForSale.value.length > 0)
        ListOfProductsForSale.value.splice(0, ListOfProductsForSale.value.length - 1)
      ListOfProductsForSale.value = orderObj.orderDetails
      totalPrincipalMoney.value = orderObj?.principalMoney
      totalPrincipalDebt.value = orderObj?.principalDebt

      totalPawnFee.value = ListOfProductsForSale.value.reduce(function (acc, {interestMoney}) { 
        return acc +  interestMoney * daysDiff(ruleForm.pawnTerm[0],ruleForm.pawnTerm[1]); }
        , 0)

      getTotalWarehouse()

      customerAddress.value = orderObj.address
      ruleForm.delivery = orderObj.deliveryOptionName
      if(orderObj.customer != null){
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
    }
    Files.value = orderObj.orderFiles.map((element) => ({
          url: `${API_URL}${element?.path}`,
          name: element?.fileId
      })
    )
  } else if (type == 'add' || !type) {
    disabledTypeAdd.value = true
    ListOfProductsForSale.value.push({ ...productForSale })
  }
}
const disabledTypeAdd = ref(false)

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
  inputRecharger.value = currentCreator.value.id

  detailedListExpenses.value.splice(0, detailedListExpenses.value.length - 1)
  addRowDetailedListExpoenses()
}

function openReceiptDialog() {
  getReceiptCode()
  clearData()
  dialogInformationReceipts.value = true
  nameDialog.value = 'Phiếu thu'
}

const paymentRequestFromAnotherOrder = ref()
function openPaymentDialog() {
  getcodeExpenditures()
  clearData()
  dialogPaymentVoucher.value = !dialogPaymentVoucher.value
  nameDialog.value = 'Phiếu chi'
}
const openPaymentRequest = () => {
  newCodePaymentRequest()
  clearData()
  if(newTable.value[0].typeOfAccountingEntry == 5){
    openAccountingEntry(newTable.value[0].id, newTable.value[0].orderTypeBTSpa)
    paymentRequestFromAnotherOrder.value = true
  }
  else{
    dialogIPRForm.value = true
  }
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
  enterMoney.value = formDetailPaymentReceipt.value.data.enterMoney
  dialogInformationReceipts.value = true
}

const dialogAccountingEntryAdditional = ref(false)
const idAccounting = ref()

// xem chi tiết lịch sử công nợ theo id
let formAccountingId = ref()
const openDialogAcountingEntry = (scope) => {
  const data = scope.row
  idAccounting.value = data.id
  updateDetailAcountingEntry.value = true
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
    dialogDepositSlip.value = true
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
const tablePaymentSlip = ref([{}])
const openAccountingEntry = async (id, type) => {
  typeDialog.value = type
  const res = await getDetailAccountingEntryById({ id: id })
  typeTable.value[0] = res?.data?.accountingEntry
  if (type == 1) {
    tablePaymentSlip.value = typeTable?.value.map((val) => ({
      productCode: res.data?.paidMerchandises[0]?.productCode,
      productName: res.data?.paidMerchandises[0]?.productName,
      createdAt: val?.createdAt,
      unitPrice: val?.unitPrice ?? 0,
      consignmentPrice: val?.consignmentPrice ?? 0,
      negotiablePrice: val?.negotiatePrice ?? 0,
      totatlPriceSale: val?.totatlPriceSale ?? 0
    }))
    totalPayment.value = typeTable.value[0].totatlPriceSale
  } else if (type == 3) {
    tablePaymentSlip.value = typeTable?.value.map((val) => ({
      productCode: res.data?.paidMerchandises[0]?.productCode,
      productName: res.data?.paidMerchandises[0]?.productName,
      createdAt: val?.createdAt,
      unitPrice: val?.unitPrice ?? 0,
      consignmentPrice: val?.consignmentPrice ?? 0,
      negotiablePrice: val?.negotiatePrice ?? 0,
      totatlPriceRental: val?.totatlPriceRental ?? 0,
      totatlPricesRental: val?.totatlPriceRental ?? 0
    }))
    totalPayment.value = typeTable.value[0].totatlPriceRental
  } else if (type == 5) {
    tablePaymentSlip.value = typeTable?.value.map((val) => ({
      productCode: res.data?.paidMerchandises[0]?.productCode,
      productName: res.data?.paidMerchandises[0]?.productName,
      createdAt: val?.createdAt,
      unitPrice: val?.unitPrice ?? 0,
      spaService: val?.spaService,
      negotiablePrice: val?.totalPriceSpa ?? 0,
      totalPriceSpa: val?.totalPriceSpa ?? 0
    }))
    totalPayment.value = typeTable.value[0].totalPriceSpa
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

const typeButToan = ref('')
const getAccountingEntry = async (index, num) => {
  typeButToan.value = 'detail'
  const res = await getDetailAccountingEntryById({ id: index })
  formAccountingId.value = { ...res.data }
  paymentType.value = formAccountingId.value.accountingEntry?.typeOfMoney
  tablePawnSlip.value = formAccountingId.value.paidMerchandises.map(
    (row)=>({
      productPropertyId: row.productPropertyId,
      productCode: row.productPropertyCode,
      productName: row.productName,
      quantity: row.quantity,
      principalDebt: row.currentPrincipalDebt,
      pawnPrice: row.pawnPrice,
      nextPaymentDate: row.nextPaymentDate,
      lastPaymentDate: row.lastPaymentDate,
      interestMoney: row.interestMoney
    })
  )
  inputDeposit.value = formAccountingId.value.accountingEntry?.receiveMoney
  moneyDeposit.value = formAccountingId.value.accountingEntry?.deibt
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

  if (num == 1) {
    dialogFeePaymentSlip.value = true
  } else if (num == 2) {
    dialogPawnCouponInfomation.value = true
  } else if (num == 3) {

  } else if (num == 4) {
    dialogAccountingEntryAdditional.value = true
  }
}
const checkEditAcountingEntryPaymentType = ref(false)
// Đúng thì hiển thị button Lưu và ghi sổ và hủy bút toán
const showCreatedOrUpdateButton = ref (false)
const showCancelAcountingEntry = ref(true)
const openAdditionalDialog = () => {

  tableAccountingEntry.value = [
  {
    content: '',
    kindOfMoney: '',
    receiveMoney: 0,
    paidMoney: 0,
    intoMoney: 0
  }
]
  showCreatedOrUpdateButton.value = true
  showCancelAcountingEntry.value = false
  updateDetailAcountingEntry.value = false
  createStatusAcountingEntry()

  dialogAccountingEntryAdditional.value = true
}

// Thêm mới bút toán bổ sung
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

if (type == 'add' || type == ':type')
  arrayStatusOrder.value.push({
    orderStatusName: 'Duyệt đơn hàng',
    orderStatus: 4,
    isActive: true
  })



const codeReceipts = ref()
const codeExpenditures = ref()
const codePaymentRequest = ref()
// Bút toán bổ sung
const alreadyPaidForTt = ref(false)

const activeName = ref([collapse[0].name, collapse[1].name])

// var curDate = 'CD' + moment().format('hhmmss')
var autoCodePawnOrder = 'CD' + moment().format('hmmss')
var autoCodeReceipts = 'PT' + moment().format('hmmss')
var autoCodeExpenditures = 'PC' + moment().format('hmmss')
var autoCodePaymentRequest = 'DNTT' + moment().format('hhmmss')
const dialogBillLiquidation = ref(false)

const staff = localStorage.getItem('STAFF_INFO')?.toString() || ''
const staffInfo = JSON.parse(staff) || ''
const staffItem = JSON.parse(staffInfo?.v) || ''
inputRecharger.value = staffItem?.id
const currentCreator = ref()

onBeforeMount(async () => {
  await editData()
  await callAPIProduct()
  await callApiWarehouseList()

  callCustomersApi()

  if (type == 'add' || type == ':type') {
    disableCreateOrder.value = true
    disabledPhieu.value = true
    disableEditData.value = false
    await GenerateCodeOrder ({CodeType:5,ServiceType:5}).then((res) =>{
      ruleForm.orderCode = res.data
    })
    pawnOrderCode.value = autoCodePawnOrder
    codeReceipts.value = autoCodeReceipts
    codeExpenditures.value = autoCodeExpenditures
    codePaymentRequest.value = autoCodePaymentRequest
  }

  if ( typeof(Storage) !== "undefined") {

  var data:any = localStorage.getItem('STAFF_INFO');
  const datas = JSON.parse(data)
  currentCreator.value = JSON.parse(datas.v)
  } else {
    alert('LocalStorage không hỗ trợ trên trình duyệt này!!')
  }
  await callApiCollaborators()

  productArray = ListOfProductsForSale.value.map((row) => row.productPropertyId)
  listOfOrderProduct.value = listProducts.value.filter((item) => {
    return productArray.includes(item.productPropertyId)
  })
})

//TruongNgo
const rentReturnOrder = ref({} as any)
let productArray: any = []
const listOfOrderProduct = ref()
const setDataForReturnOrder = () => {


  rentReturnOrder.value.orderCode = ruleForm.orderCode
  rentReturnOrder.value.period = ruleForm.pawnTerm
  rentReturnOrder.value.extendDate = '16/01/2001'
  rentReturnOrder.value.name = infoCompany.name
  rentReturnOrder.value.customerAddress = customerAddress
  rentReturnOrder.value.phone = infoCompany.phone
  rentReturnOrder.value.inputReturnReason = inputReasonReturn
  rentReturnOrder.value.tableData = [{
    productPropertyId : '',
    accessory : '',
    quantity : '',
    maxQuantity : '',
    productPropertyCode : '',
    description : '',
    code : '',
    importWarehousePrice: ''
  }]
  ListOfProductsForSale.value.forEach(async (row,index)=>{

    if(dutHang.value){
      await GetMoneyAndDatePayment({CustomerOrderId: id, ProductPropertyId: row.productPropertyId})
      .then((res)=>{
        rentReturnOrder.value.tableData[index].importWarehousePrice = res.data.principalDebt - res.data.principalFeeDebt
      })
    }

    rentReturnOrder.value.tableData[index].productPropertyId =row.productPropertyId,
    rentReturnOrder.value.tableData[index].accessory =row.accessory,
    rentReturnOrder.value.tableData[index].quantity =row.quantity,
    rentReturnOrder.value.tableData[index].maxQuantity = row.quantity - row.returnedQuantity,
    rentReturnOrder.value.tableData[index].productPropertyCode = row.productPropertyCode,
    rentReturnOrder.value.tableData[index].description = row.description,
    rentReturnOrder.value.tableData[index].code = row.code
  })
}
const addRow = () => {
  rentReturnOrder.value.tableData.push({ ...productForSale })
}
const removeRow = (index) => {
  rentReturnOrder.value.tableData.splice(index, 1)
}

const disabledPhieu = ref(false)

const cancelReturnRequest = async () =>{
    const res = await cancelReturnOrder(FORM_IMAGES({OrderId:id}))
    .then(() =>
      ElNotification({
        message: t('reuse.success'),
        type: 'success'
      })
    )
    .catch(() =>
      ElNotification({
        message: t('reuse.fail'),
        type: 'warning'
      })
    )
    if(res) await editData()
  }
  const finishReturnRequest = async () =>{
    await finishReturnOrder(FORM_IMAGES({OrderId:id}))
    .then(() =>
      ElNotification({
        message: t('reuse.success'),
        type: 'success'
      })
    )
    .catch(() =>
      ElNotification({
        message: t('reuse.fail'),
        type: 'warning'
      })
    )
    await reloadStatusOrder()

  }

const changePrincipalMoney = () =>{
  totalPrincipalMoney.value = ListOfProductsForSale.value.reduce( ( sum, { principalMoney } ) => sum + principalMoney , 0)
}
const warehouseTicketCode = ref()
const arrayStatusWH = ref()
const staffId = ref()
const warehouseTicketData = ref()
const informationWarehouseReceipt = ref(false)
const openDetailFullyIntegrated = async (props) => {
  const res = await GetWarehouseTransaction({ Id: parseInt(props.row.warehouseTicketId) })
  warehouseTicketCode.value = res.data[0].transactionCode
  staffId.value = res.data[0].staffId
  warehouseTicketData.value = res.data[0].transactionDetails.map((row)=>({
    productPropertyName: row.productPropertyName,
    productPropertyCode: row.productPropertyCode,
    accessory:props.row.accessory,
    code:props.row.code,
    description: props.row.description,
    quantity: props.row.quantity
  }))
      arrayStatusWH.value = res.data[0]?.statusHistory
      if (arrayStatusWH.value?.length) {
        arrayStatusWH.value[arrayStatusWH.value?.length - 1].isActive = true
      }
  informationWarehouseReceipt.value = true
}
const paymentType = ref(3)
const paymentTypeOptions = ref([
  {
    label:'Thanh toán tiền gốc',
    value: 3
  },
  {
    label:'Thanh toán tiền phí',
    value: 4
  }
])
const calculateTotalMoney = () =>{
  intoMoneyPawnGOC.value = tablePawnSlip.value.reduce( ( sum, { principalDebt, pawnPrice } ) => sum + principalDebt - pawnPrice , 0)
  return intoMoneyPawnGOC.value
}
const intoMoneyPawnGOC = ref(0)

const changeValueTablePawnSlip = async (value, obj, scope) =>{
  await GetMoneyAndDatePayment({CustomerOrderId: id, ProductPropertyId: scope.row.productPropertyId})
  .then((res)=>{
    scope.row.id = value
    scope.row.principalDebt = res.data.principalDebt
    scope.row.lastPaymentDate = dateTimeFormat(res.data.lastPaymentDate)
    scope.row.productPropertyId = obj?.productPropertyId
    scope.row.productCode = obj.value
    scope.row.productName = obj.name
  })
}

//Difference in number of days
const daysDiff = (startDate, endDate)=>{
  var start = moment(moment(startDate).format('YYYY-MM-DD'), "YYYY-MM-DD");
  var end = moment(moment(endDate).format('YYYY-MM-DD'), "YYYY-MM-DD");
  var days = Math.abs(start.diff(end, 'days'))
  if(days == 0){
    days = 1
  }
  return days
}

const calculatePaidMoney = (row) =>{
  const days = daysDiff(row.lastPaymentDate,row.nextPaymentDate)
  row.pawnPrice = row.interestMoney * (row.principalDebt / 1000000) * days;
  return row.pawnPrice
}

const disabledDatePawnFee= (time : Date,row) =>{
  if(moment(time) >= moment(row.lastPaymentDate) && moment(time) <= moment(ruleForm.pawnTerm[1])){
    return false
  }
  return true
}
const DoiPhieuCamDo = ref(true)
const totalPawnFee = ref(0)

const startOrder = async () =>{
  await orderUtility.automaticCouponWareHouse(TicketType.NhapKho,id)
    await orderUtility.startOrder(id,orderUtility.ServiceType.CamDo)
    await reloadStatusOrder()
}
const cancelOrder = async () =>{
  const res = await orderUtility.cancelOrderAPI(id, orderUtility.ServiceType.CamDo)
   if(res){
    await deleteTempCode({
     Code:ruleForm.orderCode
      })
    }
    await reloadStatusOrder()
}
const finishOrder = async () =>{
  await orderUtility.finishOrderAPI(id)
  await reloadStatusOrder()
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
                <!-- :disabled="disableCreateOrder" -->
              </el-form-item>

              <div class="css-form_has-child mb-2">
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
                <template #label>
                  <div style="translate: 0px -10px">
                  <div class="text-right h-15px">{{t('formDemo.pawnTerm')}}</div>
                    <div class="text-right text-[#FECB80] w-[165px]">{{
                    t('formDemo.atLeastTenDays')
                  }}</div>
                  </div>
                </template>
              </el-form-item>

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
                  <div class="flex w-[100%] gap-6">
                <div>
                  <el-form-item>
                    <p
                      v-if="ruleForm.customerName !== ''"
                      class="bg-[#F4F8FD] pl-2 text-blue-500 dark:bg-[#3B3B3B]"
                      >{{ t('formDemo.noDebt') }}</p
                    >
                  </el-form-item>
                </div>
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

              <el-form-item
                v-if="ruleForm.customerName !== ''"
                class="poi-self"
                :label="t('reuse.customerInfo')"
              >
                <div class="flex">
                  <div class="leading-6 mt-2">
                    <div>{{ infoCompany.name }}</div>
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
      <AddQuickProduct :list-products="listProducts" v-model="dialogAddProduct" @save="postQuickProduct" v-if="dialogAddProduct"/>


      <el-collapse-item :name="collapse[1].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[1].icon" link />
          <span class="text-center text-xl">{{ collapse[1].title }}</span>
        </template>
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
                  t('formDemo.productInformation'),
                  t('reuse.inventory')
                ]"
                filterable
                width="650px"
                :items="listProducts"
                valueKey="productPropertyId"
                :disabled="disabledEdit || props.row.newProduct"
                labelKey="value"
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
                          addnewproduct(props.$index)
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
            prop="productPropertyName"
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
              <div v-if="disabledEdit">{{ data.row.accessory }}</div>
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
              <CurrencyInputComponent
                v-else 
                v-model="data.row.interestMoney" 
                :disabled="disabledEdit"
                style="width: 100%" />
            </template>
          </el-table-column>

          <el-table-column prop="principalMoney" :label="t('formDemo.moneyPawnGOC')" width="150">
            <template #default="data">
              <div v-if="type === 'detail'">{{ changeMoney.format(data.row.principalMoney) }}</div>
              <CurrencyInputComponent 
                v-else 
                @change="changePrincipalMoney"
                v-model="data.row.principalMoney" 
                :disabled="disabledEdit"
                style="width: 100%" />
            </template>
          </el-table-column>

          <el-table-column prop="principalDebt" :label="t('reuse.originalDebtMoney')" width="150">
            <template #default="data">
              <div>{{ changeMoney.format(data.row.principalDebt) }}</div>
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

          <el-table-column prop="warehouseTotal" :label="t('reuse.inventory')" width="200">
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
          <div>
            <div class="flex justify-between">
              <div class="text-black font-bold dark:text-[#fff]"
                >{{ t('formDemo.intoMoneyPawnGOC') }}</div
              >
              <div class="pl-20px"> {{ changeMoney.format(totalPrincipalMoney) }} </div>
            </div>
            <div class="flex justify-between">
              <div class="text-black font-bold dark:text-[#fff]"
                >{{ t('reuse.totalPrincipalDebt') }}</div
              >
            <div class="pl-20px"> {{ changeMoney.format(totalPrincipalDebt) }} </div>

            </div>
          </div>
          <div class="w-60px pl-2">
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
          <div class="w-[89%] pl-15px">
            <div class="flex items-center w-[100%] flex-wrap">
              <div
                class="duplicate-status"
                v-for="item in arrayStatusOrder"
                :key="item.orderStatus"
              >
                <div
                  v-if="
                    item.orderStatus == STATUS_ORDER_PAWN[3].orderStatus ||
                    item.orderStatus == STATUS_ORDER_PAWN[4].orderStatus ||
                    item.orderStatus == STATUS_ORDER_PAWN[6].orderStatus ||
                    item.orderStatus == STATUS_ORDER_PAWN[12].orderStatus ||
                    item.orderStatus == STATUS_ORDER_PAWN[8].orderStatus ||
                    item.orderStatus == STATUS_ORDER_PAWN[9].orderStatus ||
                    item.orderStatus == STATUS_ORDER_PAWN[13].orderStatus 
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
                   <p v-if="item?.approvedAt">{{
                    item?.approvedAt ? dateTimeFormat(item?.approvedAt) : ''
                  }}</p>
                  <p v-else class="text-transparent">s</p>
                </div>
                <div
                  v-else-if="
                    item.orderStatus == STATUS_ORDER_PAWN[1].orderStatus ||
                    item.orderStatus == STATUS_ORDER_PAWN[5].orderStatus ||
                    item.orderStatus == STATUS_ORDER_PAWN[7].orderStatus
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
                   <p v-if="item?.approvedAt">{{
                    item?.approvedAt ? dateTimeFormat(item?.approvedAt) : ''
                  }}</p>
                  <p v-else class="text-transparent">s</p>
                </div>
                <div
                  v-else-if="
                    item.orderStatus == STATUS_ORDER_PAWN[0].orderStatus ||
                    item.orderStatus == STATUS_ORDER_PAWN[11].orderStatus ||
                    item.orderStatus == STATUS_ORDER_PAWN[10].orderStatus 

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
                statusOrder == STATUS_ORDER_PAWN[11].orderStatus ||
                statusOrder == STATUS_ORDER_PAWN[12].orderStatus ||
                (statusOrder == STATUS_ORDER_PAWN[3].orderStatus && (type == 'add' || type == ':type'))
              "
              class="min-w-42 min-h-11"
              @click="openBillPawnDialog"
              :disabled="disabledPhieu"
              >{{ t('formDemo.billPawn') }}</el-button
            >

            <el-button
              v-if="
                statusOrder == STATUS_ORDER_PAWN[1].orderStatus ||
                statusOrder == STATUS_ORDER_PAWN[5].orderStatus ||
                statusOrder == STATUS_ORDER_PAWN[7].orderStatus ||
                statusOrder == STATUS_ORDER_PAWN[11].orderStatus ||
                statusOrder == STATUS_ORDER_PAWN[12].orderStatus ||
                (statusOrder == STATUS_ORDER_PAWN[3].orderStatus && (type == 'add' || type == ':type'))
              "
              class="min-w-42 min-h-11"
              @click="openDepositDialog"
              :disabled="disabledPhieu || DoiPhieuCamDo"
              >{{ t('formDemo.bill') }}</el-button
            >

            <el-button
              v-if="
                statusOrder == STATUS_ORDER_PAWN[1].orderStatus
              "
              type="primary"
              @click="startOrder"
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
              v-if="statusOrder == STATUS_ORDER_PAWN[3].orderStatus && (type == 'add' || type == ':type')"
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
              @click="cancelOrder"
              type="danger"
              class="min-w-42 min-h-11"
              >{{ t('button.cancelOrder') }}</el-button
            >

            <el-tooltip :disabled="!unref(orderUtility.disableStatusWarehouse)">
              <template #content>
                <span>{{t('reuse.orderStillInWarehouse')}}</span>
              </template>
              <div>
            <el-button
              v-if="statusOrder == STATUS_ORDER_PAWN[5].orderStatus"
              @click="
                () => {
                  chuocTruocHan = true
                  earlyEedemption = true
                  setDataForReturnOrder()
                }
              "
              :disabled="unref(orderUtility.disableStatusWarehouse)"
              type="warning"
              class="min-w-42 min-h-11"
              >Chuộc hàng trước hạn</el-button
            >
            </div>
            </el-tooltip>

            <div v-if="statusOrder == STATUS_ORDER_PAWN[6].orderStatus || statusOrder == STATUS_ORDER_PAWN[8].orderStatus">
              <el-button
                v-if="duplicateStatusButton"
                @click="finishReturnRequest"
                type="warning"
                class="min-w-42 min-h-11"
                >Hoàn thành chuộc hàng</el-button
              >
              <el-button
                @click="cancelReturnRequest"
                class="min-w-42 min-h-11"
                >Hủy chuộc hàng</el-button
              >
            </div>
            <el-button
              v-if="statusOrder == STATUS_ORDER_PAWN[9].orderStatus"
              @click="finishReturnRequest"
              type="warning"
              class="min-w-42 min-h-11"
              >Hoàn thành đứt hàng</el-button
            >
            <el-button
              v-if="statusOrder == STATUS_ORDER_PAWN[9].orderStatus"
              @click="cancelReturnRequest"
              class="min-w-42 min-h-11"
              >Hủy đứt hàng</el-button
            >
            <el-tooltip :disabled="!unref(orderUtility.disableStatusWarehouse)">
              <template #content>
                <span>{{t('reuse.orderStillInWarehouse')}}</span>
              </template>
              <div>
            <el-button
            :disabled="unref(orderUtility.disableStatusWarehouse)"
              v-if="
                statusOrder == STATUS_ORDER_PAWN[12].orderStatus
              "
              @click="
                () => {
                  finishOrder()
                }
              "
              type="info"
              class="min-w-42 min-h-11"
              >Đối soát & kết thúc</el-button
            >
              </div>
              </el-tooltip>
            <el-tooltip :disabled="!unref(orderUtility.disableStatusWarehouse)">
              <template #content>
                <span>{{t('reuse.orderStillInWarehouse')}}</span>
              </template>
              <div>
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
              :disabled="unref(orderUtility.disableStatusWarehouse)"
              class="min-w-42 min-h-11 !border-red-500"
              ><p class="text-red-500">Gia hạn cầm đồ</p></el-button
            >
            </div>
            </el-tooltip>

            <el-tooltip :disabled="!unref(orderUtility.disableStatusWarehouse)">
              <template #content>
                <span>{{t('reuse.orderStillInWarehouse')}}</span>
              </template>
              <div>
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
              :disabled="unref(orderUtility.disableStatusWarehouse)"
              type="warning"
              class="min-w-42 min-h-11"
              >Đứt hàng hết hạn</el-button
            >
            </div>
            </el-tooltip>
            
            <el-tooltip :disabled="!unref(orderUtility.disableStatusWarehouse)">
              <template #content>
                <span>{{t('reuse.orderStillInWarehouse')}}</span>
              </template>
              <div>
            <el-button
              v-if="
                statusOrder == STATUS_ORDER_PAWN[7].orderStatus ||
                statusOrder == STATUS_ORDER_PAWN[11].orderStatus
              "
              :disabled="unref(orderUtility.disableStatusWarehouse)"
              @click="
                () => {
                  chuocHetHan = true
                  setDataForReturnOrder()
                }
              "
              type="warning"
              class="min-w-42 min-h-11"
              >Chuộc hàng hết hạn</el-button
            >
            </div>
            </el-tooltip>

            <div v-if="statusOrder == 200" class="w-[100%] flex ml-1 gap-4">
              <el-button @click="approvalFunction(true)" type="warning" class="min-w-42 min-h-11">{{
                t('router.approve')
              }}</el-button>
              <el-button @click="approvalFunction(false)" class="min-w-42 min-h-11 rounded font-bold">{{
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
            :priceBillPawn="totalPrincipalMoney"
            :dayPayment="ruleForm.paymentPeriod"
          />
        </slot>
      </div>

      <!-- Dialog thông tin hợp đồng thanh lý-->
      <el-dialog
      :close-on-click-modal="doCloseOnClickModal"
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
                :priceBillPawn="totalPrincipalMoney"
                :dayPayment="ruleForm.paymentPeriod"
              />
            </slot>
          </div>
        </div>
      </el-dialog>

      <!-- dialog quản lý kinh doanh -->
      <el-dialog
      :close-on-click-modal="doCloseOnClickModal"
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
      :close-on-click-modal="doCloseOnClickModal"
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
        <el-button text @click="openAdditionalDialog" :disabled="disabledTypeAdd">+ {{ t('reuse.addAccountingEntry') }}</el-button>
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
            prop="kindOfMoney"
            :label="t('formDemo.kindOfMoney')"
            align="left"
            min-width="150"
          >
          <template #default="props">
              <div>{{ props.row.paidMoney == 0 ? moneyFormat(props.row.receiveMoney) : moneyFormat(props.row.paidMoney) }}</div>
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
              <div v-else>{{ moneyFormat(data.row.receiveMoney) }}</div>
            </template>
          </el-table-column>

          <el-table-column prop="paidMoney" :label="t('formDemo.spent')" min-width="150">
            <template #default="data">
              <el-input
                v-model="data.row.paidMoney"
                v-if="type != 'detail'"
                style="width: 100%; border: none; outline: none"
              />
              <div v-else>{{ moneyFormat(data.row.paidMoney) }}</div>
            </template>
          </el-table-column>

          <el-table-column prop="deibt" :label="t('formDemo.pawnFeeDebt')" min-width="150">
            <template #default="data">
              <div>
                {{ moneyFormat(data.row.currentDebt) }}
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
            prop="isReceiptedMoney"
            :label="t('formDemo.alreadyPaidForTt')"
            min-width="80"
          >
            <template #default="scope">
              <el-checkbox :disabled="checkDisabled" v-model="scope.row.isReceiptedMoney" />
            </template>
          </el-table-column>
          <el-table-column
            :label="t('formDemo.statusAccountingEntry')"
            prop="status"
            min-width="120"
          >
            <template #default="props">
              <div>{{
                props.row.status == 1 ? t('formDemo.recorded') : t('formDemo.cancelled')
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


        <div class="flex justify-center pt-4">
          <div>
            <div class="flex justify-between">
              <div class="text-black font-bold dark:text-[#fff]"
                >{{ t('reuse.totalPawnFee') }}</div
              >
              <div class="pl-20px font-bold"> {{ changeMoney.format(totalPawnFee) }} </div>
            </div>
          </div>
        </div>
      </el-collapse-item>

      <!-- Thông tin phiếu cầm đồ -->
      <el-dialog
      :close-on-click-modal="doCloseOnClickModal"
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
            <el-table-column
            :label="t('formDemo.productManagementCode')"
            min-width="200"
            prop="productCode"
          />
            <el-table-column prop="productName" :label="t('formDemo.commodityName')" width="280" />
            <el-table-column prop="accessory" :label="t('reuse.accessory')" width="100" />
            <el-table-column prop="quantity" :label="t('reuse.pawnNumber')" width="100" />
            <el-table-column prop="unitName" :label="t('reuse.unit')" />
            <el-table-column prop="interestMoney" :label="t('reuse.intoMoneyByday')" min-width="150">
              <template #default="data">
                {{ changeMoney.format(data.row.interestMoney) }}
              </template>
            </el-table-column>
            <el-table-column prop="principalMoney" min-width="150" :label="t('formDemo.moneyPawnGOC')">
              <template #default="data">
                {{ changeMoney.format(data.row.totalPrincipalMoney) }}
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
              {{ changeMoney.format(totalPrincipalMoney) }}
            </div>
          </div>
          <div class="flex gap-4 pt-2 items-center">
            <label class="w-[30%] text-right">{{ t('reuse.moneyToText') }}</label>
            <div class="w-[100%]">
              <el-input v-model="moneyToText" />
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
                  v-if="showCreatedOrUpdateButton"
                  @click="
                    () => {
                      dialogPawnCouponInfomation = false
                      updateInfoAcountingEntry(2)
                    }
                  "
                  >{{ t('formDemo.saveRecordDebts') }}</el-button
                >
                <el-button
                  type="danger"
                  class="min-w-42 min-h-11"
                  v-if="showCancelAcountingEntry"
                  @click="
                    () => {
                      UpdateStatusTransaction()
                      dialogPawnCouponInfomation = false
                    }
                  "
                > 
                  {{t('formDemo.cancelAccountingEntry')}}
                </el-button>
                <el-button class="min-w-32 min-h-11" @click="dialogPawnCouponInfomation = false">{{
                  t('reuse.exit')
                }}</el-button>
              </span>
            </div>
          </div>
        </template>
      </el-dialog>

      
      <!-- Thông tin phiếu thanh toán cầm đồ -->
      <el-dialog
      :close-on-click-modal="doCloseOnClickModal"
        v-model="dialogFeePaymentSlip"
        :title="t('reuse.pawnPaymentInformation')"
        width="50%"
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
                <label class="text-right w-[170px]">{{ t('formDemo.pawnTerm') }}</label>
                <div class=" text-black dark:text-light-50"
                  >{{ dateTimeFormat(ruleForm.pawnTerm[0]) }} đến
                  {{ dateTimeFormat(ruleForm.pawnTerm[1]) }}</div
                >
              </div>
              <div class="flex gap-4 pb-4 items-center">
                <label class="text-right w-[170px]"
                  >{{ t('reuse.paymentType') }}<span class="text-red-500">*</span></label
                >

                <div class="">
                  <el-select v-model="paymentType" :disabled="typeButToan == 'detail'" class="m-2" placeholder="Select" size="large">
                    <el-option
                      v-for="item in paymentTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
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
                ]"
                filterable
                width="650px"
                :items="listOfOrderProduct"
                valueKey="productPropertyId"
                labelKey="productCode"
                :hiddenKey="['id']"
                :placeHolder="t('reuse.chooseProductCode')"
                :defaultValue="props.row.productPropertyId"
                :clearable="false"
                @scroll-top="ScrollProductTop"
                @scroll-bottom="ScrollProductBottom"
                @update-value="(value, obj) => changeValueTablePawnSlip(value, obj, props)"
                />
            </template>
          </el-table-column>
            <el-table-column prop="productName" :label="t('formDemo.commodityName')" width="280" />
            <el-table-column prop="quantity" :label="t('reuse.pawnNumber')" width="100" />
            <el-table-column v-if="paymentType == 4" prop="lastDatePaid" :label="t('reuse.lastDatePaid')" width="100" >
              <template #default="scope">
                  {{dateTimeFormat(scope.row.lastPaymentDate)}}
              </template>  
            </el-table-column>
            <el-table-column v-if="paymentType == 4" prop="nextPaymentDate" :label="t('reuse.nextDatePaid')" width="100" >
              <template #default="scope">
                <el-date-picker
                  v-model="scope.row.nextPaymentDate"
                  type="date"
                  placeholder="Pick a day"
                  format="DD/MM/YYYY"
                  value-format="YYYY-MM-DD"
                  :disabled-date="(time)=>disabledDatePawnFee(time,scope.row)"
                />  
              </template>  
            </el-table-column>
            <el-table-column v-if="paymentType == 4" prop="interestMoney" :label="t('reuse.intoMoneyByday')" width="100" />
            <el-table-column prop="principalDebt" :label="t('reuse.originalDebt')" width="100"/>
            <el-table-column prop="pawnPrice" :label="t('reuse.paidMoney')" width="100">
              <template #default="scope">
                <CurrencyInputComponent v-model="scope.row.pawnPrice" v-if="paymentType == 3"/>
                <div v-if="paymentType == 4">
                  {{calculatePaidMoney(scope.row)}}
                </div>
              </template>
            </el-table-column>
          </el-table>

          <div class="flex justify-end" v-if="paymentType == 3">
            <div class="w-[80%] text-right">
              <p class="text-black font-bold dark:text-white">{{ t('reuse.totalPawnMoneyPaid') }}</p>
            </div>
            <div class="w-[20%] text-right">
              <p class="pr-2 text-black font-bold dark:text-white">{{ moneyFormat(calculateTotalMoney()) }}</p>
            </div>
          </div>
          <div class="flex justify-end" v-if="paymentType == 4">
            <div class="w-[80%] text-right">
              <p class="text-black font-bold dark:text-white">{{ t('reuse.totalPawnMoneyPaid') }}</p>
            </div>
            <div class="w-[20%] text-right">
              <p class="pr-2 text-black font-bold dark:text-white">{{ moneyFormat(tablePawnSlip[0]?.pawnPrice) }}</p>
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
              type="primary"
              class="min-w-42 min-h-11"
              v-if="showCreatedOrUpdateButton"
              @click="
                () => {
                  dialogFeePaymentSlip = false
                  updateInfoAcountingEntry(1)
                }
              "
              >{{ t('formDemo.saveRecordDebts') }}</el-button
            >
            <el-button
                class="min-w-42 min-h-11"
                  type="danger"
                  v-if="showCancelAcountingEntry"
                  @click="
                    () => {
                      UpdateStatusTransaction()
                      dialogFeePaymentSlip = false
                    }
                  "
                > 
                  {{t('formDemo.cancelAccountingEntry')}}
                </el-button>
            <el-button class="min-w-42 min-h-11" @click="dialogFeePaymentSlip = false">{{
              t('reuse.exit')
            }}</el-button>
          </span>
        </template>
      </el-dialog>

      <el-dialog 
        :close-on-click-modal="doCloseOnClickModal" 
        v-model="paymentRequestFromAnotherOrder" 
        :title="t('reuse.paymentRequestInformationTicket')" 
        width="40%" 
        align-center>
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
            </div>
          </div>
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('reuse.customerInfo') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
          <div>
            <div class="flex gap-4 pt-4 items-center">
              <label class="w-[30%] text-right">{{ t('formDemo.PaymentRequestCode') }}</label>
              <div class="w-[100%]">{{ infoCompany.name }}</div>
            </div>
            <div class="flex gap-4 pt-4 items-center">
              <label class="w-[30%] text-right">{{ t('formDemo.proponent') }}</label>
              <div class="w-[100%]">
                <el-select v-model="inputRecharger" placeholder="Chọn người nộp tiền">
                  <el-option
                    v-for="item in optionsCollaborators"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
            </div>
            <div class="flex gap-4 pt-4 pb-4 items-center">
              <label class="w-[30%] text-right">{{ t('formDemo.reasonsSpendMoney') }}</label>
              <div class="w-[100%]">
                <el-input
                v-model="inputReasonCollectMoney"
                style="width: 100%"
                :placeholder="t('formDemo.enterReasonCollectingMoney')"
              />
              </div>
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
                <div> {{changeMoney.format(data.row.negotiablePrice)}} </div>
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
                <div> {{changeMoney.format(data.row.negotiablePrice)}} </div>
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
          <div class="flex justify-end">
              {{changeMoney.format(totalPayment)}}
            </div>
            
        </div>
        <div>
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('formDemo.billingInformation') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
          <div class="flex gap-4 pt-2 items-center">
            <label class="w-[30%] text-right">{{t('formDemo.amountSpent')}}</label>
            <div class="w-[100%]">
              {{changeMoney.format(totalPayment)}}
            </div>
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
          <div class="flex gap-4 pt-2 pb-4 items-center">
            <label class="w-[30%] text-right">{{ t('formDemo.formPayment') }}</label>
            <el-select :disabled="checkEditAcountingEntryPaymentType" v-model="payment" placeholder="Select">
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
                <el-button
class="min-w-42 min-h-11" type="primary" 
                @click="()=>{
                  postPaymentRequest
                  paymentRequestFromAnotherOrder = false
                }">
                  {{ t('formDemo.saveRecordDebts') }}
                </el-button>
                <el-button class="min-w-42 min-h-11 pl-2" @click="paymentRequestFromAnotherOrder = false">{{
                t('reuse.exit')
                }}</el-button>
              </span>
            </div>
          </div>
        </template>
      </el-dialog>

      <!-- Thông tin phiếu thanh toán tiền đàm phán -->
      <el-dialog :close-on-click-modal="doCloseOnClickModal" v-model="dialogDepositSlip" :title="t('formDemo.negotiatedPaymentInformation')" width="40%" align-center>
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
            <el-select :disabled="checkEditAcountingEntryPaymentType" v-model="payment" placeholder="Select">
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
      :close-on-click-modal="doCloseOnClickModal"
        v-model="dialogAccountingEntryAdditional"
        :title="t('formDemo.accountingEntryAdditional')"
        width="60%"
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
                  >{{ t('formDemo.pawnTime') }}</label
                >
                <div class="w-[60%] text-black dark:text-light-50"
              >{{ dateTimeFormat(ruleForm?.pawnTerm[0]) }} đến
              {{ dateTimeFormat(ruleForm?.pawnTerm[1]) }}</div
            >
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
            <el-table-column prop="content" :label="t('formDemo.kindOfMoney')">
                <el-select v-model="paymentType" class="m-2" placeholder="Select">
                  <el-option
                    v-for="item in optionsChooseMoneyType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
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

      <!-- Dialog Thông tin phiếu thu -->
      <el-dialog
      :close-on-click-modal="doCloseOnClickModal"
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
                  v-for="item in optionsCollaborators"
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
            <el-input v-model="enterMoney" style="width: 100%" :placeholder="t('formDemo.writtenWords')" />
          </div>
          <div class="flex gap-4 pt-4 items-center">
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
      :close-on-click-modal="doCloseOnClickModal"
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
                  v-for="item in optionsCollaborators"
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
            <el-select :disabled="checkEditAcountingEntryPaymentType" v-model="payment" placeholder="Select">
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
        v-model="chuocTruocHan"
        :orderId="id"
        :orderData="rentReturnOrder"
        :listProductsTable="listOfOrderProduct"
        @add-row="addRow"
        @remove-row="removeRow"
        @post-return-request="postReturnRequest"
        :orderStatusType="5"
        :type="4"
      />
      <ReturnOrder
        v-model="chuocHetHan"
        :orderId="id"
        :orderData="rentReturnOrder"
        :listProductsTable="listOfOrderProduct"
        @add-row="addRow"
        @post-return-request="postReturnRequest"
        :orderStatusType="51"
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
        :listProductsTable="listOfOrderProduct"
        @add-row="addRow"
        @post-return-request="postReturnRequest"
        :orderStatusType="7"
        @extend-date="extendDate"
        :type="4"
      />

      <!-- Dialog Thông tin phiếu đề nghị thanh toán -->
      <el-dialog
      :close-on-click-modal="doCloseOnClickModal"
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
                  v-for="item in optionsCollaborators"
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
            <el-select :disabled="checkEditAcountingEntryPaymentType" v-model="payment" placeholder="Select">
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
            <!-- Thông tin phiếu xuất đổi -->
            <el-dialog
:close-on-click-modal="doCloseOnClickModal"
        v-model="informationWarehouseReceipt"
        :title="warehouseTicketData?.transactionType == 2 ? t('reuse.informationExportReturnSpaTicket') :  t('reuse.informationTransferReturnSpaTicket') "
        width="40%"
        align-center
      >
        <div>
          <el-divider />
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('formDemo.documentsAttached') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
          <div class="flex gap-4 items-center">
            <label class="w-[30%] text-right">{{ t('formDemo.orderCode') }}</label>
            <div class="w-[100%] text-xl">{{ ruleForm.orderCode }}</div>
          </div>
          <div class="flex gap-4 pb-4 items-center">
            <label class="w-[30%] text-right">{{ t('reuse.pawnTime') }}</label>
            <div class="w-[100%] text-black dark:text-light-50"
              >{{ dateTimeFormat(ruleForm.pawnTerm[0]) }} đến
              {{ dateTimeFormat(ruleForm.pawnTerm[1]) }}</div
            >
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
                >{{ t('formDemo.warehouserExport') }} <span class="text-red-500">*</span></label
              >
              <el-select v-model="warehouseTicketData.staffId" placeholder="Trần Hữu Dương | 0998844533">
                <el-option
                  v-for="item in optionsCollaborators"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div class="flex gap-4 pt-4 pb-4 items-center">
              <label class="w-[30%] text-right">{{ t('formDemo.ReasonExchangeReturn') }}</label>
              <div class="w-[100%]">Trả hàng Spa</div>
            </div>
          </div>
          <div class="flex items-center">
            <span class="w-[45%] text-base font-bold break-w">{{
                warehouseTicketData?.transactionType == 2 ? t('formDemo.productInformationExportChange') : t('reuse.informationProductTransferReturn')
            }}</span>
            <span class="block h-1 w-[55%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
        </div>
        <div class="pt-2 pb-2">
          <el-table ref="singleTableRef" :data="warehouseTicketData" border style="width: 100%">
            <el-table-column label="STT" type="index" width="60" align="center" />
            <el-table-column
              prop="productPropertyCode"
              :label="t('formDemo.productManagementCode')"
            />
            <el-table-column
              prop="productPropertyName"
              :label="t('formDemo.commodityName')"
              width="200"
            />
            <el-table-column prop="accessory" :label="t('reuse.accessory')"/>
            <el-table-column prop="code" label="Code"/>
            <el-table-column prop="description" :label="t('formDemo.descriptionProduct')"/>
            <el-table-column prop="quantity" :label="t('reuse.quantity')" />
          </el-table>
        </div>
        <div class="flex items-center">
          <span class="w-[25%] text-base font-bold">{{ t('formDemo.status') }}</span>
          <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
        </div>
        
        <StatusWarehouse :arrayStatusWH="arrayStatusWH" :label="t('reuse.exportTicketStatus')"/>

        <template #footer>
          <div class="flex justify-end">
            <el-button @click="informationWarehouseReceipt = false" type="primary">Lưu & ghi phiếu xuất trả</el-button>
            <div>
              <span class="pl-4 dialog-footer">
                <el-button @click="informationWarehouseReceipt = false">{{
                  t('reuse.exit')
                }}</el-button>
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
              prop="warehouseTicketCode"
              :label="t('formDemo.deliveryNotesExportWarehouse')"
              align="left"
              width="200"
            >
                <template #default="props">
                  <div @click="() => openDetailFullyIntegrated(props)" class="text-blue-500" role="button">
                    {{ props.row.warehouseTicketCode }}
                  </div>
                </template>
            </el-table-column>
            <el-table-column prop="warehouseTicketStatusName" :label="t('formDemo.status')" />
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
  padding: 5px 0;
  box-shadow: none;
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

.duplicate-status + .duplicate-status {
  margin-left: 10px;
}

.active {
  opacity: 1 !important;
}

.limit-text {
  width: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

::v-deep(.el-input__wrapper) {
  width: 100%;
}

::v-deep(.el-select .el-input) {
  width: 100% !important;
}

#content {
  height: 200px;
  padding: 0 10px;
  overflow: auto;
}
</style>
