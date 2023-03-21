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
  ElTableColumn,
  ElInput,
  ElDialog,
  ElForm,
  ElRadio,
  ElRadioGroup,
  ElFormItem,
  ElDatePicker,
  FormInstance,
  FormRules,
  UploadUserFile,
  ElMessage,
  ElNotification,
  ElTooltip
} from 'element-plus'
import CurrencyInputComponent from '@/components/CurrencyInputComponent.vue'
import { useIcon } from '@/hooks/web/useIcon'
import { formatOrderReturnReason, FORM_IMAGES } from '@/utils/format'
import MultipleOptionsBox from '@/components/MultipleOptionsBox.vue'
import { dateTimeFormat } from '@/utils/format'
import { appModules } from '@/config/app'
import liquidationContractPrint from '../../Components/formPrint/src/liquidationContractPrint.vue'
import Qrcode from '@/components/Qrcode/src/Qrcode.vue'
import {GenerateCodeOrder, updateStatusTransaction} from '@/api/Business'
import {
  getProductsList,
  getCustomerById,
  getCollaboratorsInOrderList,
  getAllCustomer,
  addNewSpaOrders,
  getOrderList,
  getOrderTransaction,
  addTPV,
  getReceiptPaymentVoucher,
  getCodePaymentRequest,
  addDNTT,
  addOrderStransaction,
  createReturnRequest,
  getReturnRequest,
  getDetailAccountingEntryById,
  addQuickCustomer,
  GetProductPropertyInventory,
  updateOrderInfo,
  finishOrder,
  getListWareHouse,
  approvalOrder,
  updateOrderTransaction,
  GetPaymentRequestDetail,
  getDetailReceiptPaymentVoucher,
  finishReturnOrder,
  GetWarehouseTransaction,
  getReturnRequestForOrder,
  cancelReturnOrder,
createTicketFromReturnOrder
} from '@/api/Business'

import { Collapse } from '../../Components/Type'
import moment from 'moment'
import { STATUS_ORDER_DEPOSIT } from '@/utils/API.Variables'
import { useRoute, useRouter } from 'vue-router'
import ReturnOrder from './ReturnOrder.vue'
import { API_URL } from '@/utils/API_URL'
import { API_ORDER } from '@/utils/API.Variables'
import { deleteTempCode } from '@/api/common'
//them nhanh sp
import { getBrandSelectOptions, getUnitSelectOptions, getOriginSelectOptions, getCategory } from '@/views/Pages/ProductsAndServices/ProductLibrary/ProductLibraryManagement'
import { deleteProductProperty } from '@/api/LibraryAndSetting'
import AddQuickProduct from './AddQuickProduct.vue'

import * as orderUtility from './OrderFixbug'
import { TicketType } from '../../Warehouse/BusinessProductWarehouse/TicketEnum'
import UploadMultipleImages from './UploadMultipleImages.vue'
import EntryTransactionStatus from './EntryTransactionStatus.vue'

const { utility } = appModules
const changeMoney = new Intl.NumberFormat('vi', {
  style: 'currency',
  currency: 'vnd',
  minimumFractionDigits: 0
})
const { t } = useI18n()

const doCloseOnClickModal = ref(false)


var autoCustomerCode = 'KH' + moment().format('hhmmss')


const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })
const percentIcon = useIcon({ icon: 'material-symbols:percent' })

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
                optionsCollaborators.value?.push({
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

const autoCollaboratorCommission = (index) => {
  optionsCollaborators.value.map((val) => {
    if (val.value == index) ruleForm.collaboratorCommission = val.collaboratorCommission
  })
}

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
    DistrictId: null,
    WardId: null,
    Address: null,
    CustomerType: valueSelectCustomer.value
  }
  const formCustomerPayLoad = FORM_IMAGES(payload)
  await addQuickCustomer(formCustomerPayLoad)
    .then(() => {
      ElNotification({
        message: t('reuse.addSuccess'),
        type: 'success'
      })
      callCustomersApi()
    }
    )
    .catch(() =>
      ElNotification({
        message: t('reuse.addFail'),
        type: 'warning'
      })
    )
}

const clearDataInput = () => {
  ;(addQuickCustomerName.value = ''),
    (quickTaxCode.value = ''),
    (quickRepresentative.value = ''),
    (quickPhoneNumber.value = ''),
    (quickEmail.value = '')
}
// check disabled
const disabledEdit = ref(false)

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

// const checkPercent = (_rule: any, value: any, callback: any) => {
//   if (value === '') callback(new Error(t('formDemo.pleaseInputDiscount')))
//   else if (/\s/g.test(value)) callback(new Error(t('reuse.notSpace')))
//   else if (isNaN(value)) callback(new Error(t('reuse.numberFormat')))
//   else if (value < 0) callback(new Error(t('reuse.positiveNumber')))
//   else if (value < 0 || value > 100) callback(new Error(t('formDemo.validatePercentNum')))
//   callback()
// }

let customerAddress = ref('')

let infoCompany = reactive({
  name: '',
  taxCode: '',
  phone: '',
  email: ''
})
interface IRuleForm {
  orderCode: string
  collaborators: string
  rentalPeriod: any
  pawnTerm: string
  paymentPeriod: string
  collaboratorCommission: string
  orderNotes: string
  customerName: string
  delivery: number
  warehouse: string
}

const ruleForm = reactive({delivery: 0} as IRuleForm)

const ruleFormRef = ref<FormInstance>()
const ruleFormRef2 = ref<FormInstance>()

const rules = reactive<FormRules>({
  orderCode: [{ required: true, message: t('formDemo.pleaseInputOrderCode'), trigger: 'blur' }],
  warehouse: [
    {
      required: true,
      message: t('formDemo.pleaseSelectWarehouse'),
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
        chooseWarehouse?.push({
          value: el.id,
          label: el.name
        })
      }
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
const inputDeposit = ref('10,000,000 đ')
const payment = ref(choosePayment[0].value)
// Thông tin phiếu thu
const dialogInformationReceipts = ref(false)

// Thông tin phiếu đề nghị thanh toán
const dialogIPRForm = ref(false)

// Thông tin phiếu chi
const dialogPaymentVoucher = ref(false)
// tạo đơn hàng
const router = useRouter()
const tab = String(router.currentRoute.value.params.tab)
const id = Number(router.currentRoute.value.params.id)
const route = useRoute()
const type = String(route.params.type)
const approvalId = String(route.params.approvalId)

interface ListOfProductsForSaleType {
  name: string
  productCode: string
  productName: string
  productPropertyCode: string
  productPropertyName: string
  id: string
  productPropertyId: string
  spaServices: string
  businessSetup: string
  businessSetupName: string

  amountSpa: number
  quantity: string
  accessory: string | undefined
  code: string | undefined
  description: string | undefined
  unitName: string
  warehouseTotal?: number | any
  price: string | number | undefined
  consignmentSellPrice: string | number | undefined
  consignmentHirePrice: string | number | undefined
  finalPrice: string
  paymentType: string
  edited: boolean
  warehouseId: number | undefined
  warehouseName: string
  newProduct: Boolean
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
  quantity: '',
  accessory: '',
  code: '',
  description: '',
  businessSetup: '',
  businessSetupName: '',

  unitName: 'Cái',
  consignmentSellPrice: 0,
  consignmentHirePrice: 0,
  price: '',
  finalPrice: '',
  paymentType: '',
  edited: true,
  warehouseId: undefined,
  warehouseName: '',
  newProduct:false
})

let ListOfProductsForSale = ref<Array<ListOfProductsForSaleType>>([])

const addLastIndexSellTable = () => {
  ListOfProductsForSale.value?.push({ ...productForSale })
}
// Thông tin phiếu thanh toán tiền cọc thuê
const dialogDepositSlip = ref(false)

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

interface tableDataType {
  [x: string]: any
  typeEntry: number
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
  idPTC?: number
  statusAccountingEntry: string
}

let countExisted = ref(0)
let countExistedDNTT = ref(0)
const debtTable = ref<Array<tableDataType>>([])
let newTable = ref()
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

// Thêm mã phiếu đề nghị thanh toán vào debtTable
const handleChangePaymentRequest = () => {
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
const checkDisabled = ref(false)

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
      value: product.productCode,
      name: product.name ?? '',
      inventory:product.tonKho ?? 0,
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

// Call api danh sách sản phẩm
const listProducts = ref()

const pageIndexProducts = ref(1)
const callAPIProduct = async () => {
  const res = await getProductsList({ PageIndex: pageIndexProducts.value, PageSize: 20, ServiceType: 2, IsApprove: true })
  if (res.data && res.data?.length > 0) {
    listProducts.value = res.data.map((product) => ({
      productCode: product.productCode,
      value: product.code,
      name: product.name ?? '',
      inventory:product.tonKho?? 0,
      unit: product.unitName,
      price: product.price,
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
            : res.data.map(
                (product: {
                  code: any
                  productCode: any
                  name: any
                  price: { toString: () => any }
                  id: { toString: () => any }
                  productPropertyCode: any
                }) =>
                  listProducts.value?.push({
                    productCode: product.productCode,
                    value: product.code,
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

const getValueOfSelected = (value, obj, scope) => {
  const selected = ListOfProductsForSale.value
    .filter((row) => row !== scope.row)
    .find((product) => product.productPropertyId == value)
  if(selected){
    ElMessage({
      message: t('reuse.productCodeExist'),
      type: 'warning'
    })
    scope.row.productPropertyId = undefined
    return
  }

  const data = scope.row

  duplicateProduct.value = undefined
  duplicateProduct.value = ListOfProductsForSale.value.find(
    (val) => val.productPropertyId == value
  )
  if (duplicateProduct.value) {
    duplicateProductMessage()
  } else {
    data.productPropertyId = obj.productPropertyId
    data.productCode = obj.value
    data.productName = obj.name
    data.price = obj.price
    data.unitName = obj.unit
    callApiWarehouse(scope)
  }

  // add new row
    if (scope.$index == ListOfProductsForSale.value.length - 1) {
      ListOfProductsForSale.value.push({ ...productForSale })
    }
}


const handleTotal = (scope: {
  row: { intoMoney: string; quantity: string; unitPrice: string }
}) => {
  scope.row.intoMoney = (parseInt(scope.row.quantity) * parseInt(scope.row.unitPrice)).toString()
}

let statusOrder = ref(STATUS_ORDER_DEPOSIT[10].orderStatus)
interface statusOrderType {
  orderStatusName: string
  orderStatus: number
  createdAt?: string
  isActive?: boolean
  approvedAt?: string
}
let arrayStatusOrder = ref(Array<statusOrderType>())
arrayStatusOrder.value.pop()


const duplicateStatusButton = ref(false)
// load lại trạng thái đơn hàng
const reloadStatusOrder = async () => {
  const res = await getOrderList({ Id: id, ServiceType: 2 })

  const orderObj = { ...res?.data[0] }
  isPartialReturn.value = orderObj?.isPartialReturn
  ListOfProductsForSale.value = orderObj.orderDetails
  arrayStatusOrder.value = orderObj?.statusHistory
  if (arrayStatusOrder.value?.length) {
    arrayStatusOrder.value[arrayStatusOrder.value?.length - 1].isActive = true
    statusOrder.value = arrayStatusOrder.value[arrayStatusOrder.value?.length - 1].orderStatus
    if (arrayStatusOrder.value[arrayStatusOrder.value?.length - 1].approvedAt)
      duplicateStatusButton.value = true
    else duplicateStatusButton.value = false
  }
}

const approvalFunction = async (isApprove) => {
  const payload = { ItemType: 2, Id: parseInt(approvalId), IsApprove: isApprove }
  await approvalOrder(FORM_IMAGES(payload))
  push({
    name: `approve.orders-approval.orders-new`
  })
}

const cancelOrder = async () =>{
  const res = await orderUtility.cancelOrderAPI(id, orderUtility.ServiceType.KyGui)
   if(res){
    await deleteTempCode({
     Code:ruleForm.orderCode
      })
    }
    await reloadStatusOrder()
}
// const updateStatusOrders = async (typeState) => {
//   // 13 hoàn thành đơn hàng
//   await deleteTempCode(ruleForm.orderCode)
//   if (typeState == STATUS_ORDER_DEPOSIT[0].orderStatus) {
//     let payload = {
//       OrderId: id
//     }
//     await cancelOrder(FORM_IMAGES(payload))
//     reloadStatusOrder()
//   } else if (typeState == STATUS_ORDER_DEPOSIT[2].orderStatus) {
//     let payload = {
//       OrderId: id
//     }
//     await finishStatusOrder(FORM_IMAGES(payload))
//     reloadStatusOrder()
//   } else {
//     let paylpad = { OrderId: id, ServiceType: 2, OrderStatus: typeState }
//     await updateStatusOrder(FORM_IMAGES(paylpad))
//     reloadStatusOrder()
//   }
// }

const chooseDelivery = [
  {
    value: 0,
    label: t('reuse.receiveConsignmentGoodsAtCounter')
  }
]
const changeAddressCustomer = (data: any) => {
  if (data) {
    const result = optionsCustomerApi.value.find((e) => e.value == data)
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
    title: t('formDemo.listOfConsignmentProducts'),
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

// disabled thêm mới phiếu thu chi, phiếu đề nghị thanh toán
const disabledPTAccountingEntry = ref(true)
const disabledPCAccountingEntry = ref(true)
const disabledDNTTAccountingEntry = ref(true)

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
  inputRecharger.value = staffItem?.name + ' | ' + staffItem?.phone

  detailedListExpenses.value.splice(0, detailedListExpenses.value.length - 1)
  addRowDetailedListExpoenses()
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
  detailedListExpenses.value?.push({
    numberVouchers: '',
    dayVouchers: '',
    spentFor: '',
    quantity: 0,
    unitPrice: 0,
    totalPrice: 0,
    note: ''
  })
}

function openReceiptDialog() {
  getReceiptCode()
  moneyReceipts.value = 0
  if (newTable.value?.length) {
    newTable.value.forEach((e) => {
      moneyReceipts.value += e.receiveMoney
    })
  }
  clearData()
  dialogInformationReceipts.value = true
  nameDialog.value = 'Phiếu thu'
}

function openPaymentDialog() {
  moneyReceipts.value = 0
  getcodeExpenditures()
  if (newTable.value?.length) {
    newTable.value.forEach((e) => {
      moneyReceipts.value += e.paidMoney
    })
  }
  clearData()
  dialogPaymentVoucher.value = !dialogPaymentVoucher.value
  nameDialog.value = 'Phiếu chi'
}

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

const input = ref('')

const valueProvince = ref('')
const valueDistrict = ref('')
const valueCommune = ref('')

const collapseChangeEvent = (val: string | string[]) => {
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
const activeName = ref([collapse[0].name, collapse[1].name])

const dialogAddQuick = ref(false)

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
    } else {
      ElMessage.error(t('reuse.notFillAllInformation'))
      checkValidateForm.value = false
    }
  })
}
let orderDetailsTable = reactive([{}])
let idOrderPost = ref()
// tạo đơn hàng
const { push } = useRouter()
const postData = async () => {
  if (checkValidateForm.value) {
    orderDetailsTable = ListOfProductsForSale.value
    .filter((row)=>row.productPropertyId || row.productPropertyId !== '')
    .map((val) => ({
      ProductPropertyId: parseInt(val.productPropertyId),
      Quantity: parseInt(val.quantity),
      UnitPrice: 0,
      HirePrice: 0,
      DepositePrice: 0,
      TotalPrice: 0,
      BusinessSetup: val.businessSetup,
      ConsignmentSellPrice: val.consignmentSellPrice,
      ConsignmentHirePrice: val.consignmentHirePrice,
      SpaServiceIds: null,
      Accessory: val.accessory,
      WarehouseId: null,
      PriceChange: false,
      Code: val.code,
      Description: val.description
    }))
    const productPayment = JSON.stringify([...orderDetailsTable])
    const payload = {
      ServiceType: 2,
      OrderCode: ruleForm.orderCode,
      PromotionCode: 'AA12',
      CollaboratorId: ruleForm.collaborators,
      CollaboratorCommission: ruleForm.collaboratorCommission,
      Description: ruleForm.orderNotes,
      WarehouseId: ruleForm.warehouse,
      Files: Files.value,
      CustomerId: customerID.value,
      DeliveryOptionId: ruleForm.delivery,
      ProvinceId: valueProvince.value ?? 1,
      DistrictId: valueDistrict.value ?? 1,
      WardId: valueCommune.value ?? 1,
      Address: enterdetailAddress.value,
      fromDate: moment(ruleForm.rentalPeriod[0]).format('YYYY/MM/DD'),
      toDate: moment(ruleForm.rentalPeriod[1]).format('YYYY/MM/DD'),
      Days: 1,
      OrderDetail: productPayment,
      CampaignId: 2,
      VAT: 1,
      TotalPrice: 0,
      DepositePrice: 0,
      DiscountMoney: 0,
      InterestMoney: 0,
      Status: 4
    }
    const formDataPayLoad = FORM_IMAGES(payload)
    const res = await addNewSpaOrders(formDataPayLoad)
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
    idOrderPost.value = res.data
  }
}

const batDauKyGui = async () =>{
  const res = await orderUtility.automaticCouponWareHouse(TicketType.NhapKho,id)
  if(res){
    await orderUtility.startOrder(id,orderUtility.ServiceType.KyGui)
  }
  await reloadStatusOrder()

}

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

// Bút toán bổ sung
const dialogAccountingEntryAdditional = ref(false)
const alreadyPaidForTt = ref(true)

const tableAccountingEntry = ref([
  {
    content: '',
    kindOfMoney: '',
    receiveMoney: 0,
    paidMoney: 0,
    collected: 0,
    spent: 0,
    intoMoney: 0
  }
])

const openDialogChooseWarehouse = ref(false)
const dialogbusinessManagement = ref(false)

const formBusuness = reactive({
  id: 1,
  check: '',
  applyExport: ''
})

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

const inputReasonCollectMoney = ref()

const nameDialog = ref('')

var autoCodeReturnRequest = 'DT' + moment().format('hms')
const codeReceipts = ref()
const codeExpenditures = ref()
const codePaymentRequest = ref()
// var curDate = 'DHKG' + moment().format('hhmmss')

const dialogBillLiquidation = ref(false)
const enterdetailAddress = ref([])

const getReceiptCode = async () => {
  codeReceipts.value = await getReceiptPaymentVoucher()
}

const getcodeExpenditures = async () => {
  codeExpenditures.value = await getReceiptPaymentVoucher()
}

const newCodePaymentRequest = async () => {
  codePaymentRequest.value = await getCodePaymentRequest()
}

const totalFinalSpa = ref(0)
const totalFinalNego = ref(0)

const getTotalPriceDeibt = () => {
  totalFinalSpa.value = 0
  totalFinalNego.value = 0
  debtTable.value.forEach((val) => {
    if (val?.orderTypeBTSpa === 5) {
      totalFinalSpa.value += val?.negotiatePrice
    } else {
      totalFinalNego.value += val?.negotiatePrice
    }
  })
}

const getOrderStransactionList = async () => {
  const transaction = await getOrderTransaction({ id: id })
  debtTable.value = transaction.data
}

watch(
  () => debtTable.value,
  () => {
    if (debtTable.value.length > 0) {
      getTotalPriceDeibt()
    }
  }
)

const radioTracking = ref('2')

const inputRecharger = ref()
const moneyReceipts = ref(0)
const formReceipts = ref()
// input nhập tiền viết bằng chữ
const enterMoney = ref()

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
    PeopleId: staffItem?.id,
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
    TotalMoney: moneyReceipts.value,
    TypeOfPayment: 1,
    status: 1,
    PeopleType: 1,
    PeopleId: staffItem?.id,
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

// Lấy chi tiết phiếu thu chi
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

const optionsTypeMoney = [
  {
    value: 1,
    label: 'Tiền giá đàm phán'
  },
  {
    value: 2,
    label: 'Tiền phí Spa'
  },
  {
    value: 3,
    label: 'Tiền khác'
  }
]
const valueTypeMoney = ref(optionsTypeMoney[1])

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
const checkPTC = ref(0)

let childrenTable = ref()
let objOrderStransaction = ref()
let idStransaction = ref()

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
    accountingEntryId: idAcountingEntry.value,
    isReceiptedMoney: alreadyPaidForTt.value,
    paymentMethods: 1
  }
  await updateOrderTransaction(payload)
  getOrderStransactionList()
}
const idAcountingEntry = ref()
// Thêm bút toán cho đơn hàng
const postOrderStransaction = async (index: number) => {
  childrenTable.value = ListOfProductsForSale.value.map((val) => ({
    merchadiseTobePayforId: parseInt(val.id),
    quantity: parseInt(val.quantity)
  }))

  const payload = {
    orderId: id,
    content: tableAccountingEntry.value[0].content,
    paymentRequestId: null,
    receiptOrPaymentVoucherId: null,
    receiveMoney: tableAccountingEntry.value[0].receiveMoney,
    paidMoney: tableAccountingEntry.value[0].paidMoney,
    deibt: 0,
    typeOfPayment: checkPTC.value ? checkPTC.value : 0,
    paymentMethods: 1,
    status: 0,
    isReceiptedMoney: alreadyPaidForTt.value !== true ? 0 : 1,
    typeOfMoney: 1,
    merchadiseTobePayfor: childrenTable.value,
    TypeOfAccountingEntry: index == 1 ? 1 : index == 2 ? 2 : index == 3 ? 3 : 4,
    ReturnRequestId: null
  }

  objOrderStransaction.value = await addOrderStransaction(payload)
  idStransaction.value = objOrderStransaction.value.paymentRequestId
  getOrderStransactionList()
}

const inputReasonReturn = ref('')
const tableReturnFullyIntegrated = ref<Array<historyTableType>>([])
if (tableReturnFullyIntegrated.value.length == 0)
  tableReturnFullyIntegrated.value?.push({
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

const finishOrderDeposit = async () => {
  const payload = {
    OrderId: id
  }
  const formPayload = FORM_IMAGES(payload)
  await finishOrder(formPayload)
  reloadStatusOrder()
}

const historyTable = ref<Array<any>>([])

// Lấy bảng lịch sử nhập xuất đổi trả
const getReturnRequestTable = async () => {
  // const res = await getReturnRequest({ CustomerOrderId: id })
  const res = await getReturnRequestForOrder({ CustomerOrderId: id })
  const optionsReturnRequest = res.data
  if (Array.isArray(unref(optionsReturnRequest)) && optionsReturnRequest?.length > 0) {
    historyTable.value = optionsReturnRequest.map((e) => ({
      createdAt: e.returnRequestInfo?.createdAt ?? '',
      productPropertyId: e?.productPropertyId,
      productPropertyName: e?.productPropertyName,
      productPropertyCode: e?.productPropertyCode,
      accessory: e?.accessory,
      quantity: e?.quantity,
      unitName: e?.unitName,
      returnDetailType: e?.returnDetailType,
      returnDetailTypeName: e?.returnDetailTypeName,
      returnDetailStatusName: e?.returnDetailStatusName,
      value: e?.productPropertyId,
      warehouseTicketCode: e.warehouseTicketCode,
      warehouseTicketId: e.warehouseTicketId,
      warehouseTicketStatusName: e.warehouseTicketStatusName,
      warehouseTicketStatus: e.warehouseTicketStatus
    }))
    orderUtility.checkStatusReturnRequestInWarehouse(historyTable.value[0]?.warehouseTicketStatus)
  }
}
const consignOrderCode = ref()
const isPartialReturn = ref(false)
const editButton = ref(false)
let changeButtonEdit = ref(false)
const disableEditData = ref(false)
const disableCreateOrder = ref(false)
const editData = async () => {
  await orderUtility.getStatusWarehouse(id)

  if (type == 'detail') checkDisabled.value = true
  disableEditData.value = true

  if (type == 'edit' || type == 'detail' || type == 'approval-order') {
    disabledEdit.value = true
    disableCreateOrder.value = true

    const transaction = await getOrderTransaction({ id: id })
    const res = await getOrderList({ Id: id, ServiceType: 2 })
    if (debtTable.value.length > 0) debtTable.value.splice(0, debtTable.value.length - 1)
    debtTable.value = transaction.data
    getTotalPriceDeibt()

    getReturnRequestTable()

    const orderObj = { ...res?.data[0] }
    isPartialReturn.value = orderObj?.isPartialReturn
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

    let arrayLength = arrayStatusOrder.value?.length
      while(statusOrder.value == 27 /*Trả 1 phần*/){
        arrayLength -= 2
        statusOrder.value = arrayStatusOrder.value[arrayLength - 1]?.orderStatus
      }
      if (statusOrder.value == 27 /*Trả 1 phần*/) {
        statusOrder.value = arrayStatusOrder.value[arrayStatusOrder.value?.length - 3]?.orderStatus
        }


    if (statusOrder.value == 2 && type == 'edit') {
      disableEditData.value = true
      editButton.value = true
    }
    dataEdit.value = orderObj
    if (res.data) {
      customerData.customerId = orderObj.customerId
      await getCustomerInfo(customerData.customerId)

      ruleForm.orderCode = orderObj.code
      ruleForm.collaborators = orderObj?.collaborator?.id
      ruleForm.collaboratorCommission = orderObj.collaboratorCommission
      ruleForm.customerName = orderObj.customer.id
      ruleForm.orderNotes = orderObj.description
      ruleForm.warehouse = orderObj?.warehouseId
      consignOrderCode.value = ruleForm.orderCode

      ruleForm.rentalPeriod = [orderObj.fromDate, orderObj.toDate]
      totalOrder.value = orderObj.totalPrice
      if (ListOfProductsForSale.value?.length > 0)
        ListOfProductsForSale.value.splice(0, ListOfProductsForSale.value.length - 1)
      ListOfProductsForSale.value = orderObj.orderDetails
      getTotalWarehouse()

      // moment(orderObj.toDate).format('DD/MM/YYYY') == moment().format('L')
      //   ? (checkGiahan.value = true)
      //   : (checkGiahan.value = false)

      customerAddress.value = orderObj.address
      ruleForm.delivery = orderObj.deliveryOptionName
      // customerIdPromo.value = orderObj.customerId
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
    Files.value = orderObj.orderFiles.map((element) => ({
          url: `${API_URL}${element?.path}`,
          name: element?.fileId
      })
    )
  } else if (type == 'add' || !type) {
    ListOfProductsForSale.value?.push({ ...productForSale })
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

const editOrderInfo = async () => {
  const payload = {
    Id: id,
    CollaboratorId: ruleForm.collaborators,
    CollaboratorCommission: parseFloat(ruleForm.collaboratorCommission),
    Description: ruleForm.orderNotes,
    Files: Files.value,
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
// Dialog trả hàng trước hạn
const changeReturnGoods = ref(false)

// Thông tin phiếu để nghị thanh toán spa
const dialogDepositFeeInformation = ref(false)
const typeDialog = ref(1)
const idAccounting = ref()
const negotiablePrice = ref(0)
const condition = ref(false)
// Chi tiết bút toán
const openDialogAcountingEntry = (scope,restrue) => {
  condition.value = restrue
  const data = scope.row
  idAccounting.value = data.id
  switch (data.typeOfAccountingEntry) {
    case 4:
      openAcountingEntryDialog(data.id, 4)
      break
    case 3:
      openAcountingEntryDialog(data.id, 3)
      break
    case 5:
      openAccountingEntry(data.id, data.orderTypeBTSpa)
      break
    default:
      console.log(`Sorry, we are out of ${data.typeOfAccountingEntry}.`)
  }
}


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

const typeTable = ref<Array<any>>([])
const tablePaymentSlip = ref()
const openAccountingEntry = async (id, type) => {
  typeDialog.value = type
  const res = await getDetailAccountingEntryById({ id: id })
  typeTable.value[0] = res?.data?.accountingEntry

  if(type == 1) {
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
  dialogDepositSlip.value = true
}

const tableProductInformationExportChange = ref<Array<historyTableType>>([])
let formAccountingId = ref()
let tableSalesSlip = ref()
const openAcountingEntryDialog = async (index, num) => {
  const res = await getDetailAccountingEntryById({ id: index })

  idAcountingEntry.value = index

  formAccountingId.value = { ...res.data }
  tableSalesSlip.value = formAccountingId.value?.paidMerchandises
  tableSalesSlip.value.forEach((e) => {
    e.totalPrice = e.unitPrice * e.quantity
  })
  inputDeposit.value = formAccountingId.value.accountingEntry?.receiveMoney
  tableAccountingEntry.value[0] = formAccountingId.value.accountingEntry
  tableAccountingEntry.value.forEach((el) => {
    el.intoMoney = Math.abs(el.paidMoney - el.receiveMoney)
  })
  valueMoneyAccoungtingEntry.value = 0
  tableAccountingEntry.value.map((val) => {
    if (val.intoMoney) valueMoneyAccoungtingEntry.value += val.intoMoney
  })
  alreadyPaidForTt.value = formAccountingId.value.accountingEntry?.isReceiptedMoney

  //trạng thái bút toán
  statusAccountingEntry.value = formAccountingId.value.statusHistorys
  statusAccountingEntry.value[statusAccountingEntry.value.length-1].isActive = true
  if (statusAccountingEntry.value[statusAccountingEntry.value.length-1].transactionStatus == 0) {
    showCancelAcountingEntry.value = false
    showCreatedOrUpdateButton.value = false

  } else {
    showCancelAcountingEntry.value = true
    showCreatedOrUpdateButton.value = true
  }

  getReturnOrder()
  if (num == 4) {
    dialogAccountingEntryAdditional.value = true
  } else {
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

// Đúng thì hiển thị button Lưu và ghi sổ và hủy bút toán
const showCreatedOrUpdateButton = ref (false)
const showCancelAcountingEntry = ref(true)
const statusAccountingEntry = ref<orderUtility.TransactionStatusHistory[]>([])

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

const getReturnOrder = () => {
  listOfOrderProduct.value = ListOfProductsForSale.value?.map((el) => ({
    productCode: el?.productCode,
    productPropertyCode: el?.productPropertyCode,
    productPropertyName: el?.productPropertyName,
    productPropertyId: el?.productPropertyId,
    maximumQuantity: el?.quantity
  }))
}

if (tableProductInformationExportChange.value?.length == 0) addProductInformationExportChange()

const indexRow = ref()

const handleSelectionbusinessManagement = (val: tableDataType[]) => {
  const label = val.map((e) => e.applyExport)
  const x = val.map((e) => e.id)
  ListOfProductsForSale.value[indexRow.value].businessSetup = x.join(', ')
  ListOfProductsForSale.value[indexRow.value].businessSetupName = label.join(', ')
}
const businessTableRef = ref<InstanceType<typeof ElTable>>()

const ckeckChooseProduct = (scope) => {
  if (!scope.row.productPropertyId) {
    ElNotification({
      message: 'Bạn phải chọn sản phẩm trước',
      type: 'info'
    })
  } else {
    dialogbusinessManagement.value = true
    if(disabledEdit.value){
      const businessArray = scope.row.businessSetup.split(", ")
      const businessIndex: number[] = []
      businessArray.forEach((element)=>{
        if(element == '1') businessIndex.push(0)
        if(element == '3') businessIndex.push(1)
        if(element == '5') businessIndex.push(2)
      })
      setTimeout(()=>{
        businessIndex.forEach((element)=>{
          businessTableRef.value!.toggleRowSelection(listApplyExport[element],true)
        })
      }, 1000)
    }
  }
}


const updateStatusReturnAheadOfTime = (index) => {
  statusOrder.value = index
  doneExpendReturn()
}

// Hủy trả hàng trước hạn
const cancelExpendReturn = async() => {
  cancelExpend.value = false
  doneExpand.value = false
  const payload = {
    OrderId: id
  }
  await cancelReturnOrder(FORM_IMAGES(payload)).then(()=>{
    getReturnRequestTable()
  })
  reloadStatusOrder()
}
// Hoàn thành trả hàng trước hạn
const doneExpendReturn = async() => {
  cancelExpend.value = false
  doneExpand.value = false
  const payload = {
    OrderId: id
  }
  await finishReturnOrder(FORM_IMAGES(payload)).then(()=>{
    getReturnRequestTable()
  })
  reloadStatusOrder()
}

const completePayment = ref(false)
//TruongNgo
const truocHan = ref(false)
const hetHan = ref(false)
const giaHan = ref(false)
const doneExpand = ref(false)
const cancelExpend = ref(false)

const rentReturnOrder = ref({} as any)
let productArray: any = []
const listOfOrderProduct = ref()
const detailOfOrderProduct = ref()

//Hủy trả hàng
const openCancelPayment = () => {
  setDataForReturnOrder()
  callApiDetail()
  cancelExpend.value = true
  completePayment.value = true
}

const deleteTable = () => {
  detailOfOrderProduct.value = undefined
}

// Hoàn thành trả hàng trước hạn
const openCompletePayment = () => {
  setDataForReturnOrder()
  callApiDetail()
  doneExpand.value = true
  completePayment.value = true
}

// Hoàn thành trả hàng
const callApiDetail = async() => {
  const res = await getReturnRequest({ CustomerOrderId: id })
  const objDetail = res?.data[0]
    if (objDetail?.xuatDetails[0]?.productPropertyId) {
      detailOfOrderProduct.value = objDetail?.xuatDetails
    }

}

const setDataForReturnOrder = async () => {
  productArray = ListOfProductsForSale.value.map((row) => row.productPropertyId)
  listOfOrderProduct.value = listProducts.value.filter((item) => {
    return productArray.includes(item.productPropertyId)
  })
  

  rentReturnOrder.value.orderCode = ruleForm.orderCode
  rentReturnOrder.value.period = ruleForm.rentalPeriod
  rentReturnOrder.value.extendDate = ''
  rentReturnOrder.value.name = infoCompany.name
  rentReturnOrder.value.customerAddress = customerAddress
  rentReturnOrder.value.phone = infoCompany.phone
  rentReturnOrder.value.inputReturnReason = inputReasonReturn
  rentReturnOrder.value.tableData = ListOfProductsForSale
}
// Tạo mới yêu cầu đổi trả
const postReturnRequest = async (reason) => {
  let tableReturnPost = [{}]
  if (rentReturnOrder.value.tableData.length < 2) {
    return
  }
  rentReturnOrder.value.tableData.pop()
  tableReturnPost = rentReturnOrder?.value?.tableData.map((e) => ({
    productPropertyId: Number(e?.productPropertyId),
    quantity: parseInt(e?.quantity),
    description: e?.description,
    accessory: e?.accessory,
    returnDetailType: 4,
    unitPrice: 0,
    totalPrice: 0,
    isSpa: true
  }))

  const payload = {
    customerOrderId: id,
    code: autoCodeReturnRequest,
    name: formatOrderReturnReason(reason),
    description: formatOrderReturnReason(reason),
    returnRequestType: 4,
    tienBan: 0,
    tienHoan: 0,
    totalPrice: 0,
    giaHanDetails: tableReturnPost,
    nhapDetails: [],
    xuatDetails: [],
    isPaid: true
  }
  await createReturnRequest(payload)
  .then(async (res)=>{
    idReturnRequest.value = res
    await createTicketFromReturnOrders()
    getReturnRequestTable()
  })
  .catch((err) => {
      ElNotification({
      message: err.response.data.message,
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
        message: 'Tạo phiếu trả thành công',
        type: 'success'
      })
    })
    .catch(() =>
      ElNotification({
        message: 'Tạo phiếu trả thất bại',
        type: 'warning'
      })
    )
}

// trả hàng hết hạn
const paymentExpired = async (status) => {
  let tableReturnPost = [{}]

  tableReturnPost = rentReturnOrder.value.tableData.map((e) => ({
    productPropertyId: Number(e.productPropertyId),
    quantity: parseInt(e.quantity),
    accessory: e.accessory,
    returnDetailType: 4,
    unitPrice: 0,
    totalPrice: 0,
    isSpa: true
  }))
  const payload = {
    customerOrderId: id,
    code: autoCodeReturnRequest,
    name: formatOrderReturnReason(status),
    description: formatOrderReturnReason(status),
    returnRequestType: 4,
    tienBan: 0,
    tienHoan: 0,
    totalPrice: 0,
    giaHanDetails: [],
    nhapDetails: [],
    xuatDetails: tableReturnPost,
    isPaid: true
  }
  await createReturnRequest(payload)
  .then(async (res)=>{
    ElNotification({
      message: 'Đã trả hàng hết hạn thành công!',
      type: 'success'
    })
    idReturnRequest.value = res
    await createTicketFromReturnOrders()
    getReturnRequestTable()
    reloadStatusOrder()
  })
  .catch((err) => {
      ElNotification({
      message: err.response.data.message,
      type: 'warning'
    })
  })
}

// Trả hàng trước thời hạn
const returnGoodsAheadOfTime = async (status, data) => {
  let tableReturnPost = [{}]

  data?.pop()
  tableReturnPost = data.map((e) => ({
    productPropertyId: parseInt(e?.productPropertyId),
    quantity: parseInt(e?.quantity),
    accessory: e?.accessory
  }))
  const payload = {
    customerOrderId: id,
    code: autoCodeReturnRequest,
    name: formatOrderReturnReason(status),
    description: formatOrderReturnReason(status),
    returnRequestType: 3,
    tienBan: 0,
    tienHoan: 0,
    totalPrice: 0,
    giaHanDetails: [],
    nhapDetails: [],
    xuatDetails: tableReturnPost,
    isPaid: true
  }
  await createReturnRequest(payload)
  .then(async (res)=>{
    ElNotification({
      message: 'Tạo phiếu trả thành công',
      type: 'success'
    })
    idReturnRequest.value = res
    await createTicketFromReturnOrders()
    getReturnRequestTable()
    reloadStatusOrder()
  })
  .catch((err) => {
      ElNotification({
      message: err.response.data.message,
      type: 'warning'
    })
  })
}
// hoàn thành trả hàng

if (type == 'add' || type == ':type') {
  arrayStatusOrder.value?.push({
    orderStatusName: 'Duyệt đơn hàng',
    orderStatus: 4,
    isActive: true
  })
}

const Files = ref<UploadUserFile[]>([])

const addRow = () => {
  rentReturnOrder.value.tableData?.push({ ...productForSale })
}
const removeRow = (index) => {
  rentReturnOrder.value.tableData.splice(index, 1)
}
const warehouseTicketCode = ref()
const staffId = ref()
const openDetailFullyIntegrated = async (props) => {
  const res = await GetWarehouseTransaction({ Id: parseInt(props.row.warehouseTicketId) })
  warehouseTicketCode.value = res.data[0].transactionCode
  staffId.value = res.data[0].staffId

  // informationWarehouseReceipt.value = true
}

const completeThePayment = ref(false)

const doneReturnGoods = async () => {
  const payload = {
    OrderId: id
  }
  const formDataPayLoad = FORM_IMAGES(payload)
  await finishReturnOrder(formDataPayLoad).then(()=>{
    getReturnRequestTable()
  })
  completeThePayment.value = true
}
const disabledDate = (_time: Date) => {
  return false
  // return time.getTime() <= Date.now()
}
const billLiquidationDis = ref(false)

const staff = localStorage.getItem('STAFF_INFO')?.toString() || ''
const staffInfo = JSON.parse(staff) || ''
const staffItem = JSON.parse(staffInfo?.v) || ''
inputRecharger.value = staffItem?.id

onBeforeMount(async () => {
  await editData()
  callCustomersApi()
  callApiCollaborators()
  await callAPIProduct()
  await callApiWarehouseList()

  if (type == ('add') || type == (':type') ) {
    disableCreateOrder.value = true
    await GenerateCodeOrder({CodeType:5,ServiceType:2})
    .then((res) =>
    {
      ruleForm.orderCode = res.data
    })
    // ruleForm.orderCode = curDate
    billLiquidationDis.value = true
    disableEditData.value = false
  }
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

const openDetailOrder = (id, type) => {
  const typeServiceOrder = API_ORDER.find((e) => e.key == type)
  push({
      name: `business.order-management.order-list.${utility}`,
      params: {
        type: 'detail',
        tab: typeServiceOrder?.label,
        id: id
      }
    })
}

const UpdateStatusTransaction = async() => {
  const payload = {
    AccountingEntryId: idAcountingEntry.value,
    OrderTransactionStatus: 0
  }

  updateStatusTransaction(FORM_IMAGES(payload))
  // Cập nhật lại bảng lịch sử công nợ
  getOrderStransactionList()
}
const openAdditionalDialog = () => {
  showCreatedOrUpdateButton.value = true
  showCancelAcountingEntry.value = false
  updateDetailAcountingEntry.value = false
  createStatusAcountingEntry()

  dialogAccountingEntryAdditional.value = true
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
                  clearDataInput()
                }
              "
              >{{ t('reuse.save') }}</el-button
            >
            <el-button
              class="w-[150px]"
              @click.stop.prevent="
                () => {
                  dialogAddQuick = false
                  clearDataInput()
                }
              "
              >{{ t('reuse.exit') }}</el-button
            >
          </span>
        </template>
      </el-dialog>

      <!-- Dialog Thêm nhanh sản phẩm -->
      <AddQuickProduct :list-products="listProducts" v-model="dialogAddProduct" @save="postQuickProduct" v-if="dialogAddProduct"/>

      <!-- phieu in -->
      <div id="billLiquidationContract">
        <slot>
          <liquidationContractPrint
            v-if="dataEdit"
            :dataCustomer="customerData" 
            :dataUser="staffItem"
            :dataEdit="dataEdit"
          />
        </slot>
      </div>

      <!-- Dialog thông tin hợp đồng ký gửi-->
      <el-dialog
      :close-on-click-modal="doCloseOnClickModal"
        v-model="dialogBillLiquidation"
        title="Thông tin hợp đồng ký gửi"
        class="font-bold"
        width="40%"
        align-center
      >
        <div class="section-bill">
          <div class="flex gap-3 justify-end">
            <el-button
              @click="
                printPage('billLiquidationContract', {
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
              <liquidationContractPrint
                v-if="dataEdit"
                :dataCustomer="customerData" 
                :dataUser="staffItem"
                :dataEdit="dataEdit"
              />
            </slot>
          </div>
        </div>
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
            <div class="w-[100%] text-xl font-bold">{{ ruleForm.orderCode }}</div>
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
            <label class="w-[30%] text-right">{{ t('reuse.status') }}</label>
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
            <div class="w-[100%] text-xl font-bold">{{ consignOrderCode }}</div>
          </div>
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('formDemo.generalInformation') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
          <div>
            <div class="flex gap-4 pt-4 items-center">
              <label class="w-[30%] text-right">{{ t('formDemo.receiptsCode') }}</label>
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
            <label class="w-[30%] text-right">{{ t('reuse.moneyPaid') }}</label>
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
            <label class="w-[30%] text-right">{{ t('reuse.status') }}</label>
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
            <span class="w-[25%] text-base font-bold">{{ t('formDemo.documentsAttached') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
            <!-- <button @click="testDialog = true">Test</button> -->
          </div>
          <div class="flex gap-4 pt-4 pb-4 items-center">
            <label class="w-[30%] text-right">{{ t('formDemo.orderCode') }}</label>
            <div class="w-[100%] text-xl font-bold">{{ consignOrderCode }}</div>
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
                v-model="inputReasonCollectMoney"
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
            <label class="w-[30%] text-right">{{ t('reuse.status') }}</label>
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
                      newCodePaymentRequest()
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


      <!-- Bút toán bổ sung -->
      <el-dialog
      :close-on-click-modal="doCloseOnClickModal"
        v-model="dialogAccountingEntryAdditional"
        :title="t('formDemo.accountingEntryAdditional')"
        width="45%"
        align-center
      >
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
                <p class="font-bold text-xl">{{ consignOrderCode }}</p>
              </div>
              <div class="flex gap-4 pt-2 pb-4 items-center">
                <label class="text-right">{{ t('reuse.depositPeriod') }}</label>
                <p class=""
                  >{{ dateTimeFormat(ruleForm.rentalPeriod[0]) }} đến
                  {{ dateTimeFormat(ruleForm.rentalPeriod[1]) }}</p
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
            <el-table-column :label="t('formDemo.kindOfMoney')" width="200">
              <el-select v-model="valueTypeMoney" class="m-2" placeholder="Select">
                <el-option
                  v-for="item in optionsTypeMoney"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-table-column>
            <el-table-column prop="receiveMoney" :label="t('formDemo.collected')" width="200">
              <template #default="props">
                <CurrencyInputComponent
                  @change="(data) => autoChangeMoneyAccountingEntry(data, props)"
                  class="handle-fix"
                  v-model="props.row.receiveMoney"
                />
              </template>
            </el-table-column>
            <el-table-column prop="paidMoney" :label="t('formDemo.spent')" width="200">
              <template #default="props">
                <CurrencyInputComponent
                  @change="(data) => autoChangeMoneyAccountingEntry(data, props)"
                  class="handle-fix"
                  v-model="props.row.paidMoney"
                />
              </template>
            </el-table-column>
            <el-table-column prop="intoMoney" :label="t('formDemo.intoMoney')" width="200">
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
          <EntryTransactionStatus :statusAccountingEntry="statusAccountingEntry"/>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button
              v-if="showCreatedOrUpdateButton"
              type="primary"
              @click="
                () => {
                  updateInfoAcountingEntry(4)
                  dialogAccountingEntryAdditional = false
                }
              "
              >{{ t('formDemo.saveRecordDebts') }}</el-button
            >
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
            <el-button @click="dialogAccountingEntryAdditional = false">{{
              t('reuse.exit')
            }}</el-button>
          </span>
        </template>
      </el-dialog>

      <!-- Thông tin phiếu thanh toán tiền đàm phán -->
      <el-dialog
      :close-on-click-modal="doCloseOnClickModal"
        v-model="dialogDepositSlip"
        :title="t('formDemo.negotiatedPaymentInformation')"
        width="40%"
        align-center
      >
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
                <p class="font-bold text-xl">{{ consignOrderCode }}</p>
              </div>
              <div class="flex gap-4 pt-2 pb-4 items-center">
                <label class="text-right">{{ t('reuse.depositPeriod') }}</label>
                <p class="">{{ dateTimeFormat(ruleForm.rentalPeriod[0]) }} đến
                  {{ dateTimeFormat(ruleForm.rentalPeriod[1]) }}</p>
              </div>
            </div>
            <div class="flex-right">
              <div class="flex-1 flex items-start gap-4">
                <span>
                  <div>{{ t('formDemo.qrCodePurchaseOrder') }}</div>
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
            <el-table-column prop="unitPrice" :label="t('formDemo.priceForSale')" min-width="100">
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
                <CurrencyInputComponent
                  v-model="data.row.negotiablePrice"
                  @change="changePriceNegotiable(data)" />
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
            <el-table-column prop="consignmentPrice" :label="t('formDemo.depositpriceForRental')" min-width="150" >
              <template #default="props">
                {{ changeMoney.format(props.row.consignmentPrice) }}
              </template>
            </el-table-column>
            <el-table-column prop="negotiablePrice" :label="t('formDemo.negotiablePrice')" min-width="150">
              <template #default="data">
                <CurrencyInputComponent
                  v-model="data.row.negotiablePrice"
                  @change="changePriceNegotiable(data)"
                />
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
            <label class="w-[30%] text-right">{{ t('reuse.status') }}</label>
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

      <!-- Dialog Thông tin thanh toán phiếu kí gửi spa -->
      <el-dialog
      :close-on-click-modal="doCloseOnClickModal"
        v-model="dialogDepositFeeInformation"
        :title="'Thông tin thanh toán phiếu kí gửi spa'"
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
                <div class="text-xl">{{ ruleForm.orderCode }}</div>
              </div>
              <div class="flex gap-4 py-2 items-center">
                <label class="text-right w-[170px]">{{ t('formDemo.pawnTime') }}</label>
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
              t('formDemo.productInformationSale')
            }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
        </div>
        <div class="pt-2 pb-2">
          
          <el-table ref="singleTableRef" :data="ListOfProductsForSale" border style="width: 100%">
            <el-table-column label="STT" type="index" width="60" align="center" />
            <el-table-column prop="productName" :label="t('formDemo.commodityName')" width="280" />

            <el-table-column prop="productName" :label="t('formDemo.saleDate')" width="280" />

            <el-table-column prop="quantity" :label="t('reuse.pawnNumber')" width="90" />
            <el-table-column prop="price" :label="t('reuse.unitPrices')" />
            <el-table-column prop="finalPrice" :label="t('formDemo.consignmentPriceForSale')" />
          </el-table>
          <div class="flex justify-end">
            <div class="w-[145px] text-right">
              <p class="text-black font-bold dark:text-white"
                >{{ t('formDemo.negotiablePrice') }}
              </p>
            </div>
            <div class="w-[145px] text-right">
              <p class="pr-2 text-black font-bold dark:text-white">{{ '0 đ' }}</p>
            </div>
          </div>
        </div>
        <div class="flex items-center">
          <span class="w-[25%] text-base font-bold">{{ t('formDemo.payment') }}</span>
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
            <label class="w-[30%] text-right">{{ t('reuse.status') }}</label>
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
                <el-button class="min-w-42 min-h-11" @click="dialogDepositFeeInformation = false">{{
                  t('reuse.exit')
                }}</el-button>
              </span>
            </div>
          </div>
        </template>
      </el-dialog>

      <!-- Trả hàng trước thời hạn -->
      <ReturnOrder
        v-if="truocHan"
        v-model="truocHan"
        :orderId="id"
        :orderData="rentReturnOrder"
        :listProductsTable="listOfOrderProduct"
        :detailExpand="detailOfOrderProduct"
        :doneExpand="doneExpand"
        :cancelExpend="cancelExpend"
        @add-row="addRow"
        @remove-row="removeRow"
        @post-return-request="returnGoodsAheadOfTime"
        :orderStatusType="3"
        :type="3"
      />
      <!-- Hoàn thành trả hàng -->
      <ReturnOrder
        v-model="completePayment"
        v-if="completePayment"
        :orderId="id"
        :orderData="rentReturnOrder"
        :listProductsTable="listOfOrderProduct"
        :detailExpand="detailOfOrderProduct"
        :doneExpand="doneExpand"
        :cancelExpend="cancelExpend"
        :statusApproval="arrayStatusOrder[arrayStatusOrder?.length - 1]?.orderStatus"
        :dateApproval="arrayStatusOrder[arrayStatusOrder?.length - 1]?.approvedAt"
        @add-row="addRow"
        @remove-row="removeRow"
        @cancel-expend="cancelExpendReturn"
        @post-return-request="doneReturnGoods"
        @update-status="updateStatusReturnAheadOfTime"
        :orderStatusType="3"
        :type="3"
      />
      <!-- Hết hạn -->
      <ReturnOrder
        v-if="hetHan"
        v-model="hetHan"
        :orderId="id"
        :orderData="rentReturnOrder"
        :listProductsTable="listOfOrderProduct"
        @add-row="addRow"
        @post-return-request="paymentExpired"
        :orderStatusType="3"
        :type="3"
      />
      <!-- Gia hạn ký gửi -->
      <ReturnOrder
        v-if="giaHan"
        v-model="giaHan"
        :orderId="id"
        :orderData="rentReturnOrder"
        :listProductsTable="listOfOrderProduct"
        @add-row="addRow"
        @remove-row="removeRow"
        @post-return-request="postReturnRequest"
        :orderStatusType="9"
        :type="3"
      />

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
                :disabled="disableCreateOrder"
                  v-model="ruleForm.orderCode"
                  style="width: 100%"
                  :placeholder="t('formDemo.enterOrderCode')"
                />
              </el-form-item>

              <el-form-item :label="t('formDemo.depositTerm')" prop="rentalPeriod">
                <el-date-picker
                  v-model="ruleForm.rentalPeriod"
                  :disabled="disableEditData"
                  unlink-panels
                  :disabled-date="disabledDate"
                  type="daterange"
                  :start-placeholder="t('formDemo.startDay')"
                  :end-placeholder="t('formDemo.endDay')"
                  format="DD/MM/YYYY"
                />
              </el-form-item>

              <el-form-item :label="t('formDemo.collaborators')" prop="collaborators">
                <div class="flex gap-2">
                  <el-form-item style="flex: 1">
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

                  <el-form-item prop="collaboratorCommission" style="flex: 1">
                    <el-input
                      v-model="ruleForm.collaboratorCommission"
                      :disabled="checkDisabled"
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
              label-width="170px"
              class="demo-ruleForm"
            >
              <div class="flex w-[100%] gap-8">
                <el-divider content-position="left">{{ t('formDemo.customer') }}</el-divider>
                <el-divider content-position="left">{{ t('formDemo.methodOfDeliverySpa') }}</el-divider>
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
                            :disabled="checkDisabled"
                            labelKey="label"
                            :hiddenKey="['id']"
                            :placeHolder="'Chọn khách hàng'"
                            :defaultValue="ruleForm.customerName"
                            :clearable="false"
                            @update-value="(value, obj) => getValueOfCustomerSelected(value, obj)"
                          />
                          <!-- :placeHolder="'Chọn khách hàng'" -->
                          <el-button :disabled="checkDisabled" @click="dialogAddQuick = true">+ {{ t('button.add') }}</el-button> 
                        </div>
                      </div>
                    </el-form-item>
                  </div>
                </div>
                <div class="flex-1">
                  <el-form-item :label="t('reuse.chooseImportWarehouse')" prop="warehouse">
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
                    <div>Số điện thoại: {{ infoCompany.phone ?? '' }}</div>
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
        <el-table
          :data="ListOfProductsForSale"
          border
          :class="[
            'bg-[var(--el-color-white)] dark:(bg-[var(--el-color-black)] border-[var(--el-border-color)] border-1px)'
          ]"
        >
          <el-table-column
            :label="t('formDemo.productManagementCode')"
            min-width="100"
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
            prop="productName"
            :label="t('formDemo.productInformation')"
            min-width="276"
          />
          <el-table-column prop="accessory" :label="t('reuse.accessory')" width="200">
            <template #default="data">
              <div v-if="type === 'detail'">{{ data.row.accessory }}</div>
              <el-input
                v-else
                class="max-w-[150px]"
                :disabled="disabledEdit"
                v-model="data.row.accessory"
                :placeholder="`/${t('formDemo.selfImportAccessories')}/`"
              />
            </template>
          </el-table-column>
          <el-table-column prop="code" :label="t('formDemo.code')" min-width="90">
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

          <el-table-column prop="description" :label="t('formDemo.descriptionProduct')" min-width="150">
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

          <el-table-column prop="quantity" :label="t('reuse.depositNumber')" min-width="90">
            <template #default="data">
              <div v-if="type === 'detail'">{{ data.row.quantity }}</div>
              <el-input
                v-else
                v-model="data.row.quantity"
                :disabled="disabledEdit"
                @change="handleTotal(data)"
                style="width: 100%"
              />
            </template>
          </el-table-column>
          <el-table-column prop="unitName" :label="t('reuse.dram')" min-width="80" />

          <el-table-column
            prop="consignmentSellPrice"
            :label="t('formDemo.consignmentPriceForSale')"
            min-width="130"
          >
            <template #default="props">
              <div v-if="type == 'add' || type == ':type'">
                <CurrencyInputComponent v-model="props.row.consignmentSellPrice" />
              </div>
              <div v-else>
                {{ changeMoney.format(props.row.consignmentSellPrice) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="consignmentHirePrice"
            :label="t('formDemo.depositpriceForRentalByDay')"
            min-width="130"
          >
            <template #default="props">
              <div v-if="type == 'add' || type == ':type'">
                <CurrencyInputComponent v-model="props.row.consignmentHirePrice" />
              </div>
              <div v-else>
                {{ changeMoney.format(props.row.consignmentHirePrice) }}
              </div>
            </template>
          </el-table-column>

          <el-table-column :label="t('formDemo.businessManagement')" min-width="200" prop="businessSetupName">
            <template #default="data">
              <div class="flex w-[100%]">
                <div class="flex-1">
                  <span>{{ data.row.businessSetupName }}</span>
                </div>
                <div class="flex-1 text-right">
                  <el-button
                    text
                    border 
                    class="text-blue-500"
                    :disabled="checkDisabled" 
                    @click="
                      () => {
                        indexRow = data.$index
                        ckeckChooseProduct(data)
                      }
                    ">
                    <span class="text-blue-500">+ {{ t('router.business') }}</span></el-button>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="warehouseTotal" :label="t('reuse.inventory')" width="200">
            <template #default="props">
              <div class="flex w-[100%] items-center">
                <el-button
                  text
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
        <div class="w-[100%]">
          <el-divider content-position="left">{{ t('formDemo.statusAndManipulation') }}</el-divider>
        </div>
        <div class="flex gap-4 w-[100%] ml-1 items-center pb-3">
          <label class="w-[9%] text-right">{{ t('formDemo.orderTrackingStatus') }}</label>
          <div class="w-[84%] pl-1">
            <el-radio-group v-model="radioTracking" class="ml-4">
              <el-radio label="2" value="2" size="large">{{
                t('formDemo.receivedDelivery')
              }}</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="flex gap-4 w-[100%] ml-1 pb-3">
          <label class="w-[9%] text-right">{{ t('formDemo.orderStatus') }}</label>
          <div class="w-[89%]">
            <div class="flex items-center flex-wrap w-[100%]">
              <div
                class="duplicate-status"
                v-for="item in arrayStatusOrder"
                :key="item.orderStatus"
              >
                <div
                  v-if="
                    item.orderStatus == STATUS_ORDER_DEPOSIT[10].orderStatus ||
                    item.orderStatus == STATUS_ORDER_DEPOSIT[6].orderStatus ||
                    item.orderStatus == STATUS_ORDER_DEPOSIT[3].orderStatus ||
                    item.orderStatus == STATUS_ORDER_DEPOSIT[5].orderStatus ||
                    item.orderStatus == STATUS_ORDER_DEPOSIT[7].orderStatus ||
                    item.orderStatus == STATUS_ORDER_DEPOSIT[12].orderStatus ||
                    item.orderStatus == STATUS_ORDER_DEPOSIT[11].orderStatus
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
                  <i
                    :class="item.isActive ? 'text-gray-500' : 'text-gray-300'"
                    v-if="item?.approvedAt">{{
                      item?.approvedAt ? dateTimeFormat(item?.approvedAt) : ''
                    }}</i>
                  <p v-else class="text-transparent">s</p>
                </div>
                <div
                  v-else-if="
                    item.orderStatus == STATUS_ORDER_DEPOSIT[1].orderStatus ||
                    item.orderStatus == STATUS_ORDER_DEPOSIT[4].orderStatus
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
                  <i
                    :class="item.isActive ? 'text-gray-500' : 'text-gray-300'"
                    v-if="item?.approvedAt">{{
                      item?.approvedAt ? dateTimeFormat(item?.approvedAt) : ''
                    }}</i>
                  <p v-else class="text-transparent">s</p>
                </div>
                <div v-else-if="item.orderStatus == STATUS_ORDER_DEPOSIT[2].orderStatus">
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
                  <i
                    :class="item.isActive ? 'text-gray-500' : 'text-gray-300'"
                    v-if="item?.approvedAt">{{
                      item?.approvedAt ? dateTimeFormat(item?.approvedAt) : ''
                    }}</i>
                  <p v-else class="text-transparent">s</p>
                </div>
                <div
                  v-else-if="
                    item.orderStatus == STATUS_ORDER_DEPOSIT[8].orderStatus ||
                    item.orderStatus == STATUS_ORDER_DEPOSIT[0].orderStatus
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
                  <i
                    :class="item.isActive ? 'text-gray-500' : 'text-gray-300'"
                    v-if="item?.approvedAt">{{
                      item?.approvedAt ? dateTimeFormat(item?.approvedAt) : ''
                    }}</i>
                  <p v-else class="text-transparent">s</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex w-[100%] gap-2 mt-2">
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
                statusOrder == STATUS_ORDER_DEPOSIT[6].orderStatus ||
                statusOrder == STATUS_ORDER_DEPOSIT[12].orderStatus ||
                statusOrder == STATUS_ORDER_DEPOSIT[1].orderStatus ||
                statusOrder == STATUS_ORDER_DEPOSIT[4].orderStatus ||
                (statusOrder == STATUS_ORDER_DEPOSIT[5].orderStatus &&
                  completeThePayment &&
                  !duplicateStatusButton) ||
                statusOrder == STATUS_ORDER_DEPOSIT[7].orderStatus ||
                statusOrder == STATUS_ORDER_DEPOSIT[8].orderStatus ||
                statusOrder == STATUS_ORDER_DEPOSIT[9].orderStatus ||
                (statusOrder == STATUS_ORDER_DEPOSIT[10].orderStatus && (type == 'add' || type == ':type'))
              "
              class="min-w-42 min-h-11"
              :disabled="billLiquidationDis"
              @click="dialogBillLiquidation = true"
              >{{ t('formDemo.printLiquidationContract') }}</el-button
            >

            <el-button 
              v-if="statusOrder == STATUS_ORDER_DEPOSIT[11].orderStatus"
              class="min-w-42 min-h-11"
              :disabled="billLiquidationDis"
              @click="dialogBillLiquidation = true">
              {{ t('formDemo.printConsignmentContract') }}
            </el-button>
            <el-button
              v-if="statusOrder == STATUS_ORDER_DEPOSIT[1].orderStatus"
              type="primary"
              @click="
                  batDauKyGui
              "
              class="min-w-42 min-h-11"
              >{{ t('formDemo.startRentingTermDeposit') }}</el-button
            >
            <el-button
              v-if="statusOrder == STATUS_ORDER_DEPOSIT[10].orderStatus && (type == 'add' || type == ':type')"
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
              v-if="statusOrder == STATUS_ORDER_DEPOSIT[1].orderStatus"
              @click="changeEditInDetail"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.editOrder') }}</el-button
            >
            <el-button
              v-if="
                statusOrder == STATUS_ORDER_DEPOSIT[1].orderStatus ||
                statusOrder == STATUS_ORDER_DEPOSIT[10].orderStatus ||
                statusOrder == STATUS_ORDER_DEPOSIT[9].orderStatus
              "
              @click="
                () => {
                  cancelOrder()
                }
              "
              type="danger"
              class="min-w-42 min-h-11"
              >{{ t('button.cancelOrder') }}</el-button
            >
            <el-button
              v-if="statusOrder == STATUS_ORDER_DEPOSIT[8].orderStatus"
              @click="
                () => {
                  setDataForReturnOrder()
                  truocHan = true
                }
              "
              type="warning"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.aheadTimeReturns') }}</el-button
            >
            <el-tooltip :disabled="!unref(orderUtility.disableStatusWarehouse)">
              <template #content>
                <span>{{t('reuse.orderStillInWarehouse')}}</span>
              </template>
              <div>
                <el-button
                  v-if="statusOrder == STATUS_ORDER_DEPOSIT[4].orderStatus ||
                  (statusOrder == STATUS_ORDER_DEPOSIT[11].orderStatus && 
                  isPartialReturn)"
                  :disabled="unref(orderUtility.disableStatusWarehouse)"
                  @click="
                    () => {
                      deleteTable()
                      setDataForReturnOrder()
                      truocHan = true
                    }
                  "
                  type="warning"
                  class="min-w-42 min-h-11"
                  >{{ t('formDemo.durationPrepayment') }}</el-button
                >
              </div>
              </el-tooltip>

            <el-button
              v-if="statusOrder == STATUS_ORDER_DEPOSIT[5].orderStatus && !duplicateStatusButton"
              @click="
                () => {
                  openCancelPayment()
                }
              "
              class="min-w-42 min-h-11"
              >{{ t('formDemo.cancelReturn') }}</el-button
            >

            <el-tooltip :disabled="!orderUtility.disableStatusWarehouse">
              <template #content>
                <span>{{t('reuse.orderStillInWarehouse')}}</span>
              </template>
              <div>
            <el-button
              v-if="
                statusOrder == STATUS_ORDER_DEPOSIT[9].orderStatus ||
                statusOrder == STATUS_ORDER_DEPOSIT[6].orderStatus
              "
              @click="
                () => {
                  setDataForReturnOrder()
                  hetHan = true
                }
              "
              :disabled="unref(orderUtility.disableStatusWarehouse)"
              type="warning"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.infoReturnExpired') }}</el-button
            >
              </div>
            </el-tooltip>

            <div v-if="!completeThePayment">
              <el-button
                v-if="statusOrder == STATUS_ORDER_DEPOSIT[5].orderStatus && duplicateStatusButton"
                @click="
                  () => {
                    openCompletePayment()
                  }
                "
                type="warning"
                class="min-w-42 min-h-11"
                >{{ t('formDemo.completeReturn') }}</el-button
              >
              <el-button
                v-if="statusOrder == STATUS_ORDER_DEPOSIT[5].orderStatus && duplicateStatusButton"
                @click="
                  () => {
                    openCancelPayment()
                  }
                "
                class="min-w-42 min-h-11"
                >{{ t('formDemo.cancelReturn') }}</el-button
              >
              <el-button
                v-if="
                (statusOrder == STATUS_ORDER_DEPOSIT[11].orderStatus && 
                !isPartialReturn)"
                @click="
                  () => {
                    finishOrderDeposit()
                  }
                "
                type="info"
                class="min-w-42 min-h-11"
                >{{ t('formDemo.checkFinish') }}</el-button
              >
            </div>
            <div v-if="completeThePayment && statusOrder != STATUS_ORDER_DEPOSIT[2].orderStatus">
              <el-button
                class="min-w-42 min-h-11"
                :disabled="billLiquidationDis"
                @click="dialogBillLiquidation = true"
                >{{ t('formDemo.printConsignmentContract') }}</el-button
              >
              <el-button
                @click="
                  () => {
                    finishOrderDeposit()
                  }
                "
                type="info"
                class="min-w-42 min-h-11"
                >{{ t('formDemo.checkFinish') }}</el-button
              >
            </div>
            <el-button
              v-if="
              statusOrder == STATUS_ORDER_DEPOSIT[12].orderStatus ||
                statusOrder == STATUS_ORDER_DEPOSIT[7].orderStatus ||
                (statusOrder == STATUS_ORDER_DEPOSIT[5].orderStatus &&
                  completeThePayment &&
                  !duplicateStatusButton)
              "
              @click="
                () => {
                  finishOrderDeposit()
                }
              "
              type="info"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.checkFinish') }}</el-button
            >
            <el-button
              v-if="
                statusOrder == STATUS_ORDER_DEPOSIT[6].orderStatus ||
                statusOrder == STATUS_ORDER_DEPOSIT[9].orderStatus
              "
              @click="
                () => {
                  setDataForReturnOrder()
                  giaHan = true
                }
              "
              class="min-w-42 min-h-11 !border-red-500"
              ><p class="text-red-500">Gia hạn ký gửi</p></el-button
            >

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
              :disabled="disabledEdit"
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

        <el-button
          text
          @click="openAdditionalDialog"
          >+ {{ t('reuse.addAccountingEntry') }}</el-button
        >
        <el-button :disabled="disabledPTAccountingEntry" @click="openReceiptDialog" text
          >+ {{ t('reuse.addReceiptBill') }}</el-button
        >
        <el-button :disabled="disabledPCAccountingEntry" @click="openPaymentDialog" text
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
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" align="center" width="60" />
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
          >
        <template #default="data">
          <div>{{ data.row.content }}</div>
          <div v-if="data.row.orderIdBTSpa">
            <span>Mã đơn hàng:</span>
            <span
            @click="openDetailOrder(data.row.orderIdBTSpa, data.row.orderTypeBTSpa)" 
            class="cursor-pointer text-blue-500 pl-2">{{ data.row.orderCodeBTSpa }}</span>
          </div>
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
              <div
                @click="(index) => getDetailPaymentRequest(index, props)"
                class="cursor-pointer text-blue-500"
                >{{ props.row.paymentRequestCode }}</div
              >
            </template>
          </el-table-column>

          <el-table-column
            prop="negotiatePrice"
            :label="t('reuse.typeMoney')"
            align="left"
            min-width="150"
          >
            <template #default="props">
              <div
                >{{ changeMoney.format(props.row.negotiatePrice) ?? '0 đ' }}</div
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
              <div v-else>{{ changeMoney.format(data.row.receiveMoney) ?? '0 đ' }}</div>
            </template>
          </el-table-column>

          <el-table-column prop="paidMoney" :label="t('formDemo.spent')" min-width="150">
            <template #default="data">
              <el-input
                v-model="data.row.paidMoney"
                v-if="type != 'detail'"
                style="width: 100%; border: none; outline: none"
              />
              <div v-else>{{ changeMoney.format(data.row.paidMoney) ?? '0 đ' }}</div>
            </template>
          </el-table-column>

          <el-table-column prop="deibt" :label="`${t('reuse.outstandingDebt')}`" min-width="150">
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
              <div v-if="props.row.receiveMoney > props.row.paidMoney" class="text-blue-500">
              {{ t('reuse.haveToCollect') }}
              </div>
              <div v-else class="text-red-500">{{ t('reuse.havetoPay') }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="paymentMethods"
            :label="t('formDemo.choosePayment')"
            min-width="200"
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
                  @click="() => openDialogAcountingEntry(data,true)"
                  class="border-1 border-blue-500 pt-2 pb-2 pl-4 pr-4 dark:text-[#fff] rounded"
                >
                  {{ t('reuse.detail') }}
                </button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="text-center">
          <div class="font-bold">
            <span>{{ t('formDemo.spaFeePayment') + ': ' }}</span>
            <span class="pl-2">{{ changeMoney.format(totalFinalSpa) }}</span>
          </div>
          <div class="font-bold">
            <span>{{ t('formDemo.negoFeePayment') + ': ' }}</span>
            <span class="pl-2">{{ changeMoney.format(totalFinalNego) }}</span>
          </div>
        </div>
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
                <div>{{ data.row.accessory }}</div>
              </template>
            </el-table-column>

            <el-table-column prop="quantity" :label="t('formDemo.amount')" width="150" />
            <el-table-column prop="unitName" :label="t('reuse.dram')" width="120" />
            <el-table-column
              prop="warehouseTicketCode"
              :label="t('reuse.billExport')"
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

.duplicate-status + .duplicate-status {
  margin-left: 10px;
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

.active {
  opacity: 1 !important;
}

::v-deep(label) {
  color: #828387;
}

::v-deep(.cell) {
  color: #303133;
}

::v-deep(.el-select .el-input) {
  width: 100% !important;
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

::v-deep(.el-dialog__title) {
  font-weight: bold;
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

@media screen {
  #billLiquidationContract {
    display: none;
  }

  .dialog-content {
    display: block;
  }
}

::v-deep(.el-dialog__body) {
  padding-top: 0;
}

::v-deep(.el-dialog__header) {
  padding-bottom: 0;
}

::v-deep(.el-range-editor.el-input__wrapper) {
  width: 100%;
}

::v-deep(.el-table th.el-table__cell) {
  padding: 0 !important;
}

.limit-text {
  width: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

#content {
  height: 200px;
  padding: 0 10px;
  overflow: auto;
}
</style>
