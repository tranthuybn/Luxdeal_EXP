<script setup lang="ts">
import { reactive, ref, onBeforeMount, unref, watch } from 'vue'
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
  ElRadioGroup,
  ElRadio,
  ElDialog,
  // ElDropdown,
  // ElDropdownMenu,
  // ElDropdownItem,
  ElDatePicker,
  ElForm,
  ElFormItem,
  FormRules,
  FormInstance,
  ElNotification,
  UploadUserFile,
  UploadProps,
  ElMessage
} from 'element-plus'
import type { UploadFile } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { dateTimeFormat, formatOrderReturnReason, FORM_IMAGES, postDateTime } from '@/utils/format'
import { Collapse } from '../../Components/Type'
import Qrcode from '@/components/Qrcode/src/Qrcode.vue'
import moment from 'moment'
import ckEditor from '@/components/Editor/src/Editor.vue'
import MultipleOptionsBox from '@/components/MultipleOptionsBox.vue'
import {
  getProductsList,
  getCollaboratorsInOrderList,
  getAllCustomer,
  getSpaListByProduct,
  addNewSpaOrders,
  addQuickCustomer,
  getPromotionsList,
  getOrderList,
  getOrderTransaction,
  getReceiptPaymentVoucher,
  addTPV,
  getDetailReceiptPaymentVoucher,
  addDNTT,
  getCodePaymentRequest,
  addOrderStransaction,
  createReturnRequest,
  getDetailAccountingEntryById,
  updateOrderTransaction,
  GetPaymentRequestDetail,
  updateStatusOrder,
  updateOrderInfo,
  getListWareHouse,
  cancelOrder,
  finishStatusOrder,
  approvalOrder,
  getReturnRequestForOrder,
  GetWarehouseTransaction,
  getAllStaffList,
  updateSpaService,
  cancelReturnOrder,
  CancelUpdateSpaService,
  finishReturnOrder,
  FinishUpdateSpaService,
postAutomaticWarehouse,
createTicketFromReturnOrder,
updateStatusTransaction
} from '@/api/Business'
import ChooseWarehousePR from './ChooseImportWH.vue'
import CurrencyInputComponent from '@/components/CurrencyInputComponent.vue'
import { appModules } from '@/config/app'

import billSpaInspection from '../../Components/formPrint/src/billSpaInspection.vue'
import billSpaRepair from '../../Components/formPrint/src/billSpaRepair.vue'
import { useRoute, useRouter } from 'vue-router'
import receiptsPaymentPrint from '../../Components/formPrint/src/receiptsPaymentPrint.vue'
import { STATUS_ORDER_SPA } from '@/utils/API.Variables'
import ReturnOrder from './ReturnOrder.vue'
import { getProductStorage, getWarehouseLot } from '@/api/Warehouse'
import { API_URL } from '@/utils/API_URL'
import { getCity, getDistrict, getWard } from '@/utils/Get_Address'
import { deleteProductProperty } from '@/api/LibraryAndSetting'
import { GenerateCodeOrder } from '@/api/common'

const { t } = useI18n()
const { utility } = appModules


const viewIcon = useIcon({ icon: 'uil:search' })
const deleteIcon = useIcon({ icon: 'uil:trash-alt' })
const percentIcon = useIcon({ icon: 'material-symbols:percent' })


const doCloseOnClickModal = ref(false)
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
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
    name: 'consignmentReturnHistoryForCustomers',
    title: t('formDemo.spaDeliveryHistory'),
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

const radioTracking = ref('2')

const input = ref('')
type Options = {
  value: number
  label: string
}
type SpaService = {
  id: number
  name: string
  price: number
}
interface ListOfProductsForSaleType {
  name: string
  productCode: string
  productName: string
  productPropertyCode: string
  productPropertyName: string
  id: string
  productPropertyId: string | number | any
  spaServices: SpaService[]
  amountSpa: number
  quantity: number
  accessory: string | undefined
  code: string | undefined
  unitName: string
  warehouseLotId: number
  description: string
  price: string | number | undefined
  paymentType: string
  edited: boolean
  totalPrice: number
  locationLot?: Options
  lotCode?: Options
  lotName?: Options
  idLot: number
  fromLocation?: Options
  toWarehouse?: Options
  toLocation?: Options
  lot?: Options
  toLotId?: number,
  priceChange : Boolean
  returnedQuantity: number
  newProduct: Boolean
}

const productForSale = reactive<ListOfProductsForSaleType>({
  name: '',
  productCode: '',
  productName: '',
  productPropertyCode: '',
  productPropertyName: '',
  id: '',
  spaServices: [{id:0,name:'',price:0}],
  amountSpa: 2,
  productPropertyId: undefined,
  quantity: 1,
  accessory: '',
  code: '',
  unitName: '',
  warehouseLotId: 0,
  price: '',
  totalPrice: 0,
  idLot: 0,
  description: '',
  paymentType: '',
  edited: true,
  priceChange: false,
  returnedQuantity: 0,
  newProduct: false
})

const ListOfProductsForSale = ref<Array<ListOfProductsForSaleType>>([])

const changeMoney = new Intl.NumberFormat('vi', {
  style: 'currency',
  currency: 'vnd',
  minimumFractionDigits: 0
})

let totalPriceOrder = ref(0)
let totalFinalOrder = ref(0)
// Total order

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

// Lấy bảng lịch sử nhập xuất đổi trả
const getReturnRequestTable = async () => {
  const res = await getReturnRequestForOrder({ CustomerOrderId: id })
  const optionsReturnRequest = res.data
  if (Array.isArray(unref(optionsReturnRequest)) && optionsReturnRequest?.length > 0) {
    historyTable.value = optionsReturnRequest?.map((e) => ({
      createdAt: e.returnRequestInfo?.createdAt ?? '',
      productPropertyId: e?.productPropertyId,
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
      warehouseTicketStatusName: e.warehouseTicketStatusName,
      isSpa: e.isSpa
    }))
  }
}
const tableReturnFullyIntegrated = ref<Array<historyTableType>>([])

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

const warehouseTicketCode = ref()
const staffId = ref()
const warehouseTicketData = ref()
const productInReturnTicketIsSpa = ref()
const openDetailFullyIntegrated = async (props) => {
  const res = await GetWarehouseTransaction({ Id: parseInt(props.row.warehouseTicketId) })
  warehouseTicketCode.value = res.data[0].transactionCode
  staffId.value = res.data[0].staffId
  warehouseTicketData.value = res.data[0]
  informationWarehouseReceipt.value = true
  productInReturnTicketIsSpa.value = props.row.isSpa
}
// Thông tin phiếu nhập kho hoàn hàng đổi/trả
const informationWarehouseReceipt = ref(false)
// Dialog change address

const dialogAddQuick = ref(false)
const openDialogChoosePromotion = ref(false)

// api địa chỉ
const valueDistrict = ref('')
const enterdetailAddress = ref()

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

//call api kho
const warehouseOptions = ref()
const loadingWarehouse = ref(true)
let callAPIWarehouseTimes = 0
const callAPIWarehouse = async () => {
  if (callAPIWarehouseTimes == 0) {
    await getProductStorage({
      pageSize: 1000,
      pageIndex: 1
    }).then((res) => {
      warehouseOptions.value = res.data
        .filter((warehouse) => warehouse.children.length > 0)
        .map((item) => ({
          value: item.id,
          label: item.name
        }))
      loadingWarehouse.value = false
      callAPIWarehouseTimes++
    })
  }
}

/* Tạm thời bỏ VAT 21/02/2023
const radioVAT = ref(t('formDemo.doesNotIncludeVAT'))
const moneyVAT = ref()

// Cập nhật lại giá tiền khi thay đổi VAT
const changePriceVAT = () => {
  autoCalculateOrder()
}
*/

// Call api danh sách khách hàng
let customerAddress = ref('')

const optionsCustomerApi = ref<Array<any>>([])
const callCustomersApi = async () => {
  const res = await getAllCustomer({ PageIndex: 1, PageSize: 30 })
  const getCustomerResult = res.data
  if (Array.isArray(unref(getCustomerResult)) && getCustomerResult?.length > 0) {
    optionsCustomerApi.value = getCustomerResult.map((customer) => ({
      code: customer?.code,
      label: customer?.isOrganization
        ? customer?.name + ' | MST ' + customer?.taxCode
        : customer?.name + ' | ' + customer?.phonenumber,
      address: customer?.address,
      name: customer?.name,
      value: customer?.id,
      isOrganization: customer?.isOrganization,
      taxCode: customer?.taxCode,
      phone: customer?.phonenumber,
      email: customer?.email,
      id: customer?.id
    }))
  }
  if(dataEdit.value.customer){
  const find = optionsCustomerApi.value.find(customer => customer.id == dataEdit.value.customerId)
    if(!find){
      optionsCustomerApi.value.unshift({
        code: dataEdit.value?.code,
        label: dataEdit.value?.isOrganization
        ? dataEdit.value?.name + ' | MST ' + dataEdit.value?.taxCode
        : dataEdit.value?.name + ' | ' + dataEdit.value?.phonenumber,
        address: dataEdit.value?.address,
        name: dataEdit.value?.name,
        value: dataEdit.value?.id,
        isOrganization: dataEdit.value?.isOrganization,
        taxCode: dataEdit.value?.taxCode,
        phone: dataEdit.value?.phonenumber,
        email: dataEdit.value?.email,
        id: dataEdit.value?.id
      })
    }}
}
const scrollCustomerBottom = ref(false)
const pageIndexCustomer = ref(1)
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
                      code: customer?.code,
                      label: customer?.isOrganization
                        ? customer?.name + ' | MST ' + customer?.taxCode
                        : customer?.name + ' | ' + customer?.phonenumber,
                      address: customer?.address,
                      name: customer?.name,
                      value: customer?.id,
                      isOrganization: customer?.isOrganization,
                      taxCode: customer?.taxCode,
                      phone: customer?.phonenumber,
                      email: customer?.email,
                      id: customer?.id
                })
              )
        })
        .catch(() => {
          noMoreCustomerData.value = true
        })
}
let infoCompany = reactive({
  name: '',
  taxCode: '',
  phone: '',
  email: ''
})
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

const totalPriceSpa = (scope) => {
  let quantityInput = scope.row.quantity
  scope.row.totalPrice = quantityInput * totalSettingSpa.value
}

const inputDeposit = ref(0)
const inputPaymentBill = ref(0)
// Call api danh sách sản phẩm
const listProducts = ref()

const pageIndexProducts = ref(1)
const callAPIProduct = async () => {
  const res = await getProductsList({ PageIndex: pageIndexProducts.value, PageSize: 20,  ServiceType: 5, IsApprove: true})
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
  ListOfProductsForSale.value.forEach(row=>{
    const find = listProducts.value.find(product => product.productPropertyId == row.productPropertyId)
    if(!find && row.productPropertyId){
      listProducts.value.unshift({
        productCode: row?.productCode,
        value: row?.productCode,
        name: row?.productName ?? '',
        unit: row?.unitName,
        productPropertyId: row?.productPropertyId,
        productPropertyCode: row?.productPropertyCode
    })
    }
  })
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
    : getProductsList({ PageIndex: pageIndexProducts.value, PageSize: 20,ServiceType: 5, IsApprove: true })
        .then((res) => {
          res.data.length == 0
            ? (noMoreProductData.value = true)
            : res.data.map((product) =>
                listProducts.value.push({
                  productCode: product.code,
                  value: product.productCode,
                  name: product.name ?? '',
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
// disabled thêm mới phiếu thu chi, phiếu đề nghị thanh toán
const disabledPTAccountingEntry = ref(true)
const disabledPCAccountingEntry = ref(true)
const disabledDNTTAccountingEntry = ref(true)
let totalSettingSpa = ref(0)
let countExisted = ref(0)
let countExistedDNTT = ref(0)
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

const handleSelectionChange2 = (val: tableDataType[]) => {
  ListOfProductsForSale.value[indexSpa.value].spaServices = val.map((e) => ({
    name: e.spaServiceName,
    id: e.id,
    price: e.price
  }))

}
const calculateSpaServiceMoney = ()=>{
  newTable.value = spaTableRef.value!.getSelectionRows()
  totalSettingSpa.value = 0
  newTable.value.map((val) => {
    totalSettingSpa.value += val.price
  })
}

// Tạm thời bỏ VAT 21/02/2023
// Cập nhật lại giá tiền khi thay đổi VAT
// const VAT = ref(false)

const getPriceSpaService = () => {
  if(spaTableRef.value!.getSelectionRows() < 1){
    ElNotification({
        title: 'Info',
        message: 'Bạn vui lòng chọn dịch vụ nhé!',
        type: 'info'
      })
      return
  }
  spaSelection.value.push({
    index: currentRow2.value,
    value: spaTableRef.value!.getSelectionRows()
  })
  if (checkInputPriceChange.value && statusOrder.value == STATUS_ORDER_SPA[1].orderStatus) {
    ListOfProductsForSale.value[currentRow2.value].priceChange = true
    arrayStatusOrder.value.splice(0, arrayStatusOrder.value.length)
    arrayStatusOrder.value.push({
      orderStatusName: 'Duyệt giá thay đổi',
      orderStatus: STATUS_ORDER_SPA[9].orderStatus,
      isActive: true
    })
    statusOrder.value = STATUS_ORDER_SPA[9].orderStatus
  }

  if(type == 'detail'){
    priceChangeSpa.value = false
    editButton.value = false
  }

  //Tính toán j đó khi bấm nút lưu
  handleSelectionChange2(spaTableRef.value!.getSelectionRows())
  ListOfProductsForSale.value[currentRow2.value].totalPrice = totalSettingSpa.value * ListOfProductsForSale.value[currentRow2.value].quantity
  autoCalculateOrder()
  dialogFormSettingServiceSpa.value = false
}
let promoValue = ref(0)
let promoCash = ref(0)

const getValueOfSelected = async (value, obj, scope) => {
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

  data.productPropertyId = obj?.productPropertyId
  data.productCode = obj.value
  data.productName = obj.name
  data.unitName = obj.unit
  data.quantity = 1
  data.spaServices = []
  data.totalPrice = 0
  data.accessory = ''
  data.description = ''
  totalPriceOrder.value = 0
  totalFinalOrder.value = 0
  ListOfProductsForSale.value.map((val) => {
    if (val.totalPrice) totalPriceOrder.value += val.totalPrice
  })
  promoCash.value != 0
    ? (totalFinalOrder.value = totalPriceOrder.value - promoCash.value)
    : (totalFinalOrder.value =
        totalPriceOrder.value - (totalPriceOrder.value * promoValue.value) / 100)

  /* Tạm thời bỏ VAT 21/02/2023 
  if (radioVAT.value.length < 4) {
    VAT.value = true
    const valueVAT = radioVAT.value.substring(0, radioVAT.value.length - 1)
    moneyVAT.value = (totalPriceOrder.value * parseInt(valueVAT)) / 100
    if (totalFinalOrder.value) {
      totalFinalOrder.value += (totalFinalOrder.value * parseInt(valueVAT)) / 100
    }
  }
  */
  // add new row
  if (scope.$index == ListOfProductsForSale.value.length - 1) {
    ListOfProductsForSale.value.push({ ...productForSale })
  }
}

const autoCalculateOrder = () => {
  checkInputPriceChange.value = false
  totalPriceOrder.value = 0
  totalFinalOrder.value = 0
  ListOfProductsForSale.value.forEach((val) => {
    if (val.totalPrice) totalPriceOrder.value += val.totalPrice
  })
  promoCash.value != 0
    ? (totalFinalOrder.value = totalPriceOrder.value - promoCash.value)
    : (totalFinalOrder.value =
        totalPriceOrder.value - (totalPriceOrder.value * promoValue.value) / 100)

  /* Tạm thời bỏ VAT 21/02/2023 
  if (radioVAT.value.length < 4) {
    VAT.value = true
    const valueVAT = radioVAT.value.substring(0, radioVAT.value.length - 1)
    moneyVAT.value = (totalPriceOrder.value * parseInt(valueVAT)) / 100

    if (totalFinalOrder.value) {
      totalFinalOrder.value += (totalFinalOrder.value * parseInt(valueVAT)) / 100
    }
  }
  */
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

// Call api danh sách mã giảm giá
let customerIdPromo = ref()

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
      discount: product.reduce,
      voucherConditionType: product.voucherConditionType,
      reducePercent: product.reducePercent,
      reduceCash: product.reduceCash,
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

const dialogPaymentVoucher = ref(false)
const dialogIPRForm = ref(false)
const valueProvince = ref('')
const valueCommune = ref('')

const dialogexaminationContentSpa = ref(false)

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
// api Spa

const listServicesSpa = ref()

const currentRow2 = ref(0)
const spaNotChange = ref(true)
const testSelect = (row) =>{
  spaTableRef.value?.toggleRowSelection(listServicesSpa.value[row],true)
}
const callApiServicesSpa = async (scope) => {
  let row:Number[] = []
  dialogFormSettingServiceSpa.value = true
  indexSpa.value = scope.$index
  if (scope.row.productPropertyId) {
    await getSpaListByProduct({
      ProductPropertyId: parseInt(scope.row.productPropertyId)
    }).then((res)=>{
    listServicesSpa.value = res.data
    if(scope.row.spaServices.length >0 && scope.row.spaServices[0].id != 0 && scope.row.spaServices){
      scope.row.spaServices.forEach(spaService=>{
        const rowIndex = listServicesSpa.value.findIndex(spa=>spa.id == spaService?.id)
        if(rowIndex !== -1){
          row.push(rowIndex)
        }
      })
    }
    currentRow2.value = scope.$index
  }).finally(()=>row.forEach(index=>testSelect(index)))
    // if (countSpaClick.value > 1 && res.data.length > 0) {
    //   ElNotification({
    //     title: 'Info',
    //     message: 'Bạn vui lòng chọn dịch vụ nhé!',
    //     type: 'info'
    //   })
    // } else if (res.data.length === 0) {
    //   ElNotification({
    //     title: 'Warning',
    //     message: 'Không có dịch vụ spa!',
    //     type: 'warning'
    //   })
    // }
  } else {
    ElMessage({
      message: t('reuse.pleaseChooseProduct'),
      type: 'warning'
    })
  }
}
const changeServiceSpa = ref(false)

const checkProductSelected = (scope) => {
  if (scope.row.productPropertyId) {
    dialogexaminationContentSpa.value = true
  } else {
    ElMessage({
      message: t('reuse.pleaseChooseProduct'),
      type: 'warning'
    })
  }
}
const spaTableRef = ref<InstanceType<typeof ElTable>>()
const spaSelection = ref<any[]>([])

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

const removeListProductsSale = async (index) => {
  if (!ListOfProductsForSale[ListOfProductsForSale.value.length - 1]) {
    //when remove row check newProduct if(true){call api remove proudct(id), shift listProducts}
    if(ListOfProductsForSale.value[index].newProduct == true){
      listProducts.value.splice(listProducts.value.findIndex(product => product.productPropertyId == ListOfProductsForSale.value[index].productPropertyId),1)
      await deleteProductProperty({Id: ListOfProductsForSale.value[index].productPropertyId})
    }
    ListOfProductsForSale.value.splice(index, 1)
  }
  if(ListOfProductsForSale.value.length == 0){
    addLastIndexSellTable()
  }
  autoCalculateOrder()
}

const dialogFormSettingServiceSpa = ref(false)
// var curDate = 'SPA' + Date.now()

const optionsTypeSpa = [
  {
    value: 0,
    label: 'Khách spa'
  },
  {
    value: 1,
    label: 'Nội bộ spa'
  }
]
const valueTypeSpa = ref(optionsTypeSpa[0].value)

const chooseDelivery = [
  {
    value: 0,
    label: t('formDemo.pickUpGoodsAtTheCounter')
  },
  {
    value: 1,
    label: t('formDemo.receiveGoodsAtCustomerAddress')
  }
]

//lay du lieu tu router
const router = useRouter()
let id = Number(router.currentRoute.value.params.id)
const route = useRoute()
const tab = String(router.currentRoute.value.params.tab)
const type = String(route.params.type)
const approvalId = String(route.params.approvalId)

let orderDetailsTable = reactive([{}])

let idLotData = ref(0)
const closeDialogWarehouse = (warehouseData) => {
  if (warehouseData != null) {
    idLotData.value = 0
    ListOfProductsForSale.value[currentRowWHTrans.value].locationLot = warehouseData.location
    ListOfProductsForSale.value[currentRowWHTrans.value].lotName = warehouseData?.lot.lotCode
    ListOfProductsForSale.value[currentRowWHTrans.value].idLot = warehouseData?.lot.idLot
    idLotData.value = warehouseData?.lot.idLot
  }
  dialogWarehouse.value = false
}

const postData = async (pushBack: boolean) => {
  let checkSpaLength = true 
  ListOfProductsForSale.value.forEach((row)=>{
  if(!row.spaServices || row.spaServices.length < 1){
    ElMessage({
      message: 'Vui lòng chọn dịch vụ',
      type: 'info'
    })
    checkSpaLength = false
    return
  }})
  if(checkSpaLength){
    //remove empty row
    ListOfProductsForSale.value.forEach((row,index)=>{
      if(!row.productPropertyId || row.productPropertyId == null){
        ListOfProductsForSale.value.splice(index,1)
      }
    })
  orderDetailsTable = ListOfProductsForSale.value.map((val) => ({
    ProductPropertyId: parseInt(val.productPropertyId),
    Quantity: val.quantity,
    ProductPrice: val.price,
    Description: val.description,
    UnitPrice: totalSettingSpa.value,
    SpaServices: val.spaServices,
    SpaServiceIds: val.spaServices.map(spa=>spa.id).toString(),
    TotalPrice: val.totalPrice,
    IsPaid: true,
    Accessory: val.accessory,
    WarehouseId: null,
    PriceChange: val.priceChange,
    WarehouseLotId: idLotData.value
  }))
  if(orderDetailsTable.length < 1){
    ElMessage({
      message: 'Vui lòng chọn sản phẩm',
      type: 'info'
    })
  }
  const productPayment = JSON.stringify([...orderDetailsTable])

  const payload = {
    ServiceType: 5,
    SpaType: valueTypeSpa.value,
    OrderCode: ruleForm.orderCode,
    PromotionCode: 'AA12',
    CollaboratorId: ruleForm.collaborators,
    CollaboratorCommission: ruleForm.collaboratorCommission,
    Description: ruleForm.orderNotes,
    CustomerId: valueTypeSpa.value == 0 ? customerID.value : 2,
    Files: Files,
    WarehouseId: valueTypeSpa.value == 0 ? ruleForm.warehouseImport : ruleForm.warehouseParent,
    DeliveryOptionId: ruleForm.delivery ?? 0,
    ProvinceId: valueProvince.value ?? 1,
    DistrictId: valueDistrict.value ?? 1,
    WardId: valueCommune.value ?? 1,
    Address: enterdetailAddress.value,
    OrderDetail: productPayment,
    CampaignId: 2,
    // VAT: adioVAT.value == t('formDemo.VATNotIncluded') ? null : radioVAT.value == t('formDemo.doesNotIncludeVAT') ? null      : parseInt(radioVAT.value),
    VAT: 0,
    // VATMoney: moneyVAT.value,
    VATMoney: 0,
    Days: 1,
    TotalPrice: totalPriceOrder.value,
    DepositePrice: 0,
    DiscountMoney:
      promoCash.value != 0
        ? promoCash.value
        : promoValue.value != 0
        ? (totalPriceOrder.value * promoValue.value) / 100
        : 0,
    InterestMoney: 0,
    FromDate: moment().format('YYYY-MM-DD'),
    ToDate: postDateTime(ruleForm.dateOfReturn),
    Status:  2,
  }
  const formDataPayLoad = FORM_IMAGES(payload)
  const res = await addNewSpaOrders(formDataPayLoad)
  if (res) {
    ElNotification({
      message: t('reuse.addSuccess'),
      type: 'success'
    })
  } else {
    ElNotification({
      message: t('reuse.addFail'),
      type: 'warning'
    })
  }
  // get data
  id = res.data
  
  valueTypeSpa.value === 0 ? warehouseTranferAuto(1) : warehouseTranferAuto(3)
  if (pushBack == true) {
      router.push({
        name: 'business.order-management.order-list',
        params: { backRoute: String(router.currentRoute.value.name), tab: tab }
      })
    }
    startSpa.value = false
  if (clickStarSpa.value == true) {
    addStatusOrder(5)
  }}

}
const warehouseTranferAuto = async (index) => {
  const payload = {
    OrderId: id,
    Type: index
  }

  await postAutomaticWarehouse(JSON.stringify(payload))
}
const clickStarSpa = ref(false)


const checkPercent = (_rule: any, value: any, callback: any) => {
  if (value === '') callback(new Error(t('formDemo.pleaseInputDiscount')))
  else if (/\s/g.test(value)) callback(new Error(t('reuse.notSpace')))
  else if (isNaN(value)) callback(new Error(t('reuse.numberFormat')))
  else if (value < 0) callback(new Error(t('reuse.positiveNumber')))
  else if (value < 0 || value > 100) callback(new Error(t('formDemo.validatePercentNum')))
  callback()
}

const checkDisabled = ref(false)
const checkDisabled3 = ref(false)
const checkDisabled2 = ref(false)

const ruleFormRef = ref<FormInstance>()
const ruleFormRef2 = ref<FormInstance>()
const ruleFormAddress = ref<FormInstance>()
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

const ruleForm = reactive({
  orderCode: '',
  collaborators: '',
  dateOfReturn: '',
  collaboratorCommission: '',
  orderNotes: '',
  customerName: '',
  delivery: 1,
  warehouseParent: '',
  warehouseImport: '',
  orderFiles: []
})

const rules = reactive<FormRules>({
  orderCode: [{ required: true, message: t('formDemo.pleaseInputOrderCode'), trigger: 'blur' }],
  warehouseImport: [
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
  dateOfReturn: [
    {
      type: 'date',
      required: true,
      message: t('common.required'),
      trigger: 'change'
    }
  ],
  customerName: [{ required: false }],
  delivery: [
    {
      required: true,
      message: t('common.required'),
      trigger: 'change'
    }
  ],
  warehouseParent: [
    {
      required: true,
      message: t('common.required'),
      trigger: 'change'
    }
  ]
})

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
      checkValidateForm.value = false
    }
  })
  await formEl2.validate((valid, _fields) => {
    if (valid && checkValidateForm.value) {
      postData(pushBack)
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

const dialogFormVisible = ref(false)

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

//thêm nahnh sp

// const dialogAddProduct = ref(false)
// let callProductApi = 0
// const currentNewProductRow = ref(-1)
// const addnewproduct = (currentRow) => {
//   currentNewProductRow.value = currentRow
//   dialogAddProduct.value = true
//   if(callProductApi == 0){
//     Promise.all([getBrandSelectOptions(),getUnitSelectOptions(),getOriginSelectOptions(),getCategory()])
//   }
//   callProductApi++
// }

// //end thêm nhanh sp
// const postQuickProduct = (product,productId)=>{
//   listProducts.value.unshift({
//       productCode: product.productCode,
//       value: product.productCode,
//       name: product.name ?? '',
//       unit: '',
//       price: 0,
//       productPropertyId: productId,
//       productPropertyCode: product.productPropertyCode
//     })

//     //Change productpropertyId of currentNewProductRow
//     ListOfProductsForSale.value[currentNewProductRow.value].productPropertyId = productId
//     ListOfProductsForSale.value[currentNewProductRow.value].productName = product.name
//     //set value like newProduct:true
//     ListOfProductsForSale.value[currentNewProductRow.value].newProduct = true
//     //when remove row check newProduct if(true){call api remove proudct(id), shift listProducts}
// }

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.warning(
    `${t('reuse.limitUploadImages')}. ${t('reuse.imagesYouChoose')}: ${files.length}. ${t(
      'reuse.total'
    )}${files.length + uploadFiles.length}`
  )
}

const getOrderStransactionList = async () => {
  const transaction = await getOrderTransaction({ id: id })
  debtTable.value = transaction.data
}
const autoCollaboratorCommission = (index) => {
  optionsCollaborators.value.map((val) => {
    if (val.value == index) ruleForm.collaboratorCommission = val.collaboratorCommission
  })
}
let totalOrder = ref(0)
let dataEdit = ref()
const saveContentEditor = () => {
  ListOfProductsForSale.value[currentRow2.value].description = editor.value
}

function printPage(id: string, { url, title, w, h }) {
  let stylesHtml = ''
  for (const node of [...document.querySelectorAll('link[rel="stylesheet"], style')]) {
    stylesHtml += node.outerHTML
  }

  const child = document.getElementById('main-content')
  const printContents = document.getElementById(id) ?? null
  if (printContents) {
    if (child) printContents.removeChild(child)
    const tempNode = document.createElement('p')
    tempNode.id = 'main-content'
    tempNode.innerHTML = editor.value
    printContents?.appendChild(tempNode)
  }

  // open new window at the center of screen
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
                    ${printContents?.innerHTML}

                  </body>
                </html>`)

  newWindow?.document.close()
  newWindow?.focus()
  setTimeout(() => {
    newWindow?.print()
    newWindow?.close()
  }, 500)
}

const printPages = (className: string, { url, title, w, h })=>{
  // Get HTML to print from element
const prtHtml = document.getElementsByClassName(className)!;

// Get all stylesheets HTML
let stylesHtml = '';
for (const node of [...document.querySelectorAll('link[rel="stylesheet"], style')]) {
  stylesHtml += node.outerHTML;
}

// Open the print window
// open new window at the center of screen
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

const WinPrint = window.open(
    url,
    title,
    `
				scrollbars=yes,
				width=${w / systemZoom},
				height=${h / systemZoom},
				top=${top},
				left=${left}      `
  )!
let html = ''
for(var i =0;i<prtHtml.length;i++){
  html += prtHtml[i].innerHTML
}

WinPrint.document.write(`<!DOCTYPE html>
<html>
  <head>
    <style>
    body {
        overflow: visible !important;
    }
    .page { page-break-after:always;}
    ${stylesHtml}
  </style>
  </head>
  <body>
    ${html}
  </body>
</html>`);

WinPrint?.document.close()
WinPrint?.focus()
  setTimeout(() => {
    WinPrint?.print()
    WinPrint?.close()
  }, 500)
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

let disabledCustomer = ref(false)
const loadingProductTable = ref(false)
const checkDisabledCustomer = () => {
  loadingProductTable.value = true
  if (valueTypeSpa.value == 0) {
    disabledCustomer.value = false
    customerID.value = null
  } else {
    ruleForm.customerName = ''
    disabledCustomer.value = true
  }
  setTimeout(()=>{
    loadingProductTable.value = false
  }, 700)
}

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

const getStaffList = ref()
const callApiStaffList = async () => {
  const res = await getAllStaffList({ PageIndex: 1, PageSize: 40 })
  getStaffList.value = res.data.map((el) => ({
    value: el.id,
    label: el.name + ' | ' + el.contact
  }))
}

// Thông tin phiếu bán hàng
const nameDialog = ref('')

const dialogBillSpaInfomation = ref(false)
function openBillSpaDialog() {
  dialogBillSpaInfomation.value = !dialogBillSpaInfomation.value
  ListInfoSpa.value = ListOfProductsForSale.value
  nameDialog.value = 'billPawn'
}
const clearData = () => {
  totalPayment.value = 0
  depositePayment.value = 0
  debtPayment.value = 0
  inputReasonCollectMoney.value = ''
  enterMoney.value = ''
  if ( typeof(Storage) !== "undefined") {
  var data:any = localStorage.getItem('STAFF_INFO');
  const datas = JSON.parse(data)
    inputRecharger.value = JSON.parse(datas.v)?.id
  } else {
    alert('LocalStorage không hỗ trợ trên trình duyệt này!!')
  }

  detailedListExpenses.value.splice(0, detailedListExpenses.value.length - 1)
  addRowDetailedListExpoenses()
}
function openReceiptDialog() {
  getReceiptCode()
  clearData()
  dialogInformationReceipts.value = !dialogInformationReceipts.value
  nameDialog.value = 'Phiếu thu'
}

function openPaymentDialog() {
  getcodeExpenditures()
  clearData()
  dialogPaymentVoucher.value = !dialogPaymentVoucher.value
  nameDialog.value = 'Phiếu chi'
}

let objIdPayment = ref()
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
    Document: undefined,
    AccountingEntryId: undefined,
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
  handleChangePaymentRequest()
}

let objOrderStransaction = ref()
let idStransaction = ref()
const tableAccountingEntry = ref([
  {
    content: '',
    kindOfMoney: '',
    receiveMoney: 0,
    paidMoney: 0,
    intoMoney: 0
  }
])
const alreadyPaidForTt = ref(true)

// debtTable
interface tableDataType {
  [x: string]: any
  createdAt: string | Date
  content: string
  receiptOrPaymentVoucherId: number | undefined
  paymentRequestId: string | undefined
  receiptOrPaymentVoucherCode: string
  moneyType: number
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

// Thêm bút toán cho đơn hàng
const codeReturnRequest = ref()
var autoCodeReturnRequest = 'DT' + moment().format('hms')
let childrenTable = ref()

const postOrderStransaction = async (num: number) => {
  childrenTable.value = ListOfProductsForSale.value.map((val) => ({
    merchadiseTobePayforId: parseInt(val.id),
    quantity: val.quantity
  }))

  const payload = {
    orderId: id,
    content:
      num == 1 ? t('formDemo.collectionOfSpaServiceFees') : tableAccountingEntry.value[0].content,
    paymentRequestId: null,
    receiptOrPaymentVoucherId: null,
    receiveMoney:
      num == 1 ? inputPaymentBill.value : num == 2 ? tableAccountingEntry.value[0].receiveMoney : 0,

    paidMoney: num == 1 ? 0 : num == 2 ? tableAccountingEntry.value[0].paidMoney : 0,
    deibt: num == 1 ? remainingMoney.value : 0,
    typeOfPayment: num == 1 
                  ? 1 
                  : tableAccountingEntry.value[0].receiveMoney - tableAccountingEntry.value[0].paidMoney >0 ? 1 : 0,
    paymentMethods: 1,
    status: 0,
    isReceiptedMoney: alreadyPaidForTt.value ? 1 : 0,
    typeOfMoney: 1,
    typeOfAccountingEntry: num,
    merchadiseTobePayfor: childrenTable.value
  }

  objOrderStransaction.value = await addOrderStransaction(payload)
  idStransaction.value = objOrderStransaction.value.paymentRequestId
  getOrderStransactionList()
}

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
if (tableReturnFullyIntegrated.value?.length == 0) addRowReturnFullyIntegrated()

watch(
  () => tableReturnFullyIntegrated.value,
  () => {
    if (
      tableReturnFullyIntegrated.value[tableReturnFullyIntegrated.value.length - 1]
        ?.productPropertyId &&
      tableReturnFullyIntegrated.value[tableReturnFullyIntegrated.value.length - 1].quantity &&
      tableReturnFullyIntegrated.value[tableReturnFullyIntegrated.value.length - 1].unitPrice &&
      tableReturnFullyIntegrated.value[tableReturnFullyIntegrated.value.length - 1].totalPrice
    )
      addRowReturnFullyIntegrated()
  },
  {
    deep: true
  }
)
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

const codeReceipts = ref()

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
const changeWH = ref(false)
let idParentWH = ref(0)
const getIDWarehouse = (index) => {
  changeWH.value = true
  idParentWH.value = index
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

interface typeWarehouse {
  value: any
  label: any
}
const chooseWarehouseImport = reactive<Array<typeWarehouse>>([])

const codePaymentRequest = ref()

// Thêm mã phiếu đề nghị thanh toán vào debtTable
const handleChangePaymentRequest = () => {
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

const newCodePaymentRequest = async () => {
  codePaymentRequest.value = await getCodePaymentRequest()
}
let statusOrder = ref(2)
interface statusOrderType {
  orderStatusName: string
  orderStatus: number
  createdAt?: string
  isActive?: boolean
  approvedAt?: string
}

const disabledDate = (time: Date) => {
  return time.getTime() <= Date.now()
}

// disabled phiếu thanh toán và phiếu đặt cọc tạm ứng
const priceChangeSpa = ref(false)
watch(
  ()=>ListOfProductsForSale.value,
  ()=>{
    if(type !== 'detail' && type !=='edit' && type !=='approval-order' && clickStarSpa.value == false){//type=='add'
    let priceChange = false
    ListOfProductsForSale.value.forEach((row)=>{
      if(row.priceChange){
        priceChange = true
        return;
      }
    })
    if(priceChange){
      priceChangeSpa.value = true
      statusOrder.value = STATUS_ORDER_SPA[9].orderStatus
      arrayStatusOrder.value = []
      arrayStatusOrder.value.push({
      orderStatusName: 'Duyệt giá thay đổi',
      orderStatus: STATUS_ORDER_SPA[9].orderStatus,
      isActive: true
    })
    }
    else{
      priceChangeSpa.value = false
      statusOrder.value = STATUS_ORDER_SPA[1].orderStatus
      arrayStatusOrder.value = []
      arrayStatusOrder.value.push({
      orderStatusName: 'Chốt đơn',
      orderStatus: STATUS_ORDER_SPA[1].orderStatus,
      isActive: true})
    }}
  },
  {
    deep: true
  })

const checkInputPriceChange = ref(false)
const changePriceSpaService = () => {
  checkInputPriceChange.value = true
  calculateSpaServiceMoney()
}

let arrayStatusOrder = ref(Array<statusOrderType>())
arrayStatusOrder.value.pop()
if (type == 'add' && priceChangeSpa.value == false)
  arrayStatusOrder.value.push({
    orderStatusName: 'Chốt đơn hàng',
    orderStatus: 2,
    isActive: true
  })

// Lý do thu tiền
const inputReasonCollectMoney = ref()

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

const updateOrderStatus = async (status: number, idOrder: any) => {
  const payload = {
    OrderId: idOrder ? idOrder : id,
    ServiceType: 5,
    OrderStatus: status
  }
  const formDataPayLoad = FORM_IMAGES(payload)
  await updateStatusOrder(formDataPayLoad)
  statusOrder.value = status
  reloadStatusOrder()
}
const approvalFunction = async (checkApproved) => {
  const payload = { ItemType: 2, Id: parseInt(approvalId), IsApprove: checkApproved }
  await approvalOrder(FORM_IMAGES(payload))
   if(checkApproved) {
      ElNotification({
        message: 'Duyệt thành công!',
        type: 'success'
        }),
        push({
         name: `approve.orders-approval.orders-new`
        })
    }else{
      ElNotification({
        message: 'Không duyệt!',
        type: 'info'
      }),
      push({
       name: `approve.orders-approval.orders-new`
      })
    }
}
const addStatusOrder = (index) => {
  arrayStatusOrder.value[arrayStatusOrder.value.length - 1].isActive = false
  arrayStatusOrder.value.push(STATUS_ORDER_SPA[index])
  statusOrder.value = STATUS_ORDER_SPA[index].orderStatus
  arrayStatusOrder.value[arrayStatusOrder.value.length - 1].isActive = true
  updateOrderStatus(STATUS_ORDER_SPA[index].orderStatus, id)
}
// const addStatusOrderByStatusValue = (statusValue) => {
//   addStatusOrder(STATUS_ORDER_SPA.findIndex(status=>status.orderStatus == statusValue))
// }
// Cập nhật trạng thái đơn hàng
const updateStatusOrders = async (typeState) => {
  // 13 hoàn thành đơn hàng
  if (typeState == STATUS_ORDER_SPA[0].orderStatus) {
    let payload = {
      OrderId: id
    }
    await cancelOrder(FORM_IMAGES(payload))
    reloadStatusOrder()
  } else if (typeState == STATUS_ORDER_SPA[2].orderStatus) {
    let payload = {
      OrderId: id
    }
    await finishStatusOrder(FORM_IMAGES(payload))
    reloadStatusOrder()
  } else {
    let paylpad = { OrderId: id, ServiceType: 5, OrderStatus: typeState }
    await updateStatusOrder(FORM_IMAGES(paylpad))
    reloadStatusOrder()
  }
}

// load lại trạng thái đơn hàng
const reloadStatusOrder = async () => {
  const res = await getOrderList({ Id: id, ServiceType: 5 })

  const orderObj = { ...res?.data[0] }
  arrayStatusOrder.value = orderObj?.statusHistory
  ListOfProductsForSale.value = orderObj?.orderDetails
  if (arrayStatusOrder.value?.length) {
    arrayStatusOrder.value[arrayStatusOrder.value?.length - 1].isActive = true
    statusOrder.value = arrayStatusOrder.value[arrayStatusOrder.value?.length - 1].orderStatus
    if (arrayStatusOrder.value[arrayStatusOrder.value?.length - 1].approvedAt)
      duplicateStatusButton.value = true
    else duplicateStatusButton.value = false

    //sửa trạng thái trả hàng
    let arrayLength = arrayStatusOrder.value?.length
      while(statusOrder.value == 58 /*Trả 1 phần*/){
        arrayLength -= 2
        statusOrder.value = arrayStatusOrder.value[arrayLength - 1]?.orderStatus
      }
  }
}

const showPromo = ref(false)
const disabledEdit = ref(false)
const duplicateStatusButton = ref(false) //check trạng thái cuối đã duyệt hay chưa
const startSpa = ref(false)
const editData = async () => {
  if (type == 'detail') {
    checkDisabled.value = true
    disabledCustomer.value = true
  }
  if (type == 'edit' || type == 'detail' || type == 'approval-order') {
    checkDisabled3.value = true
    disableCreateOrder.value = true
    disabledEdit.value = true
    const res = await getOrderList({ Id: id, ServiceType: 5, approveRequestId: type == 'approval-order'? approvalId : null })

    const transaction = await getOrderTransaction({ id: id })
    if (debtTable.value.length > 0) debtTable.value.splice(0, debtTable.value.length - 1)
    debtTable.value = transaction.data
    getReturnRequestTable()
    const orderObj = type == 'approval-order' ? res.data :{ ...res.data[0] } 

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

      let arrayLength = arrayStatusOrder.value?.length
      while(statusOrder.value == 58 /*Trả 1 phần*/){
        arrayLength -= 2
        statusOrder.value = arrayStatusOrder.value[arrayLength - 1]?.orderStatus
      }
      if (statusOrder.value == 58 /*Trả 1 phần*/) {
    statusOrder.value = arrayStatusOrder.value[arrayStatusOrder.value?.length - 3]?.orderStatus
    }
    }

    if (statusOrder.value == 2 && type == 'edit') {
      editButton.value = true
    }
    Files = orderObj.orderFiles

    /* Tạm thời bỏ VAT 21/02/2023 
    if (orderObj.vat == null) radioVAT.value = t('formDemo.VATNotIncluded')
    else radioVAT.value = orderObj.vat + '%'
    */
    dataEdit.value = orderObj
    if (res.data) {
      ruleForm.orderCode = orderObj.code
      spaOrderCode.value = ruleForm.orderCode
      ruleForm.collaborators = orderObj?.collaborator?.id

      ruleForm.collaboratorCommission = orderObj.collaboratorCommission
      ruleForm.customerName = orderObj.customer?.id
      ruleForm.orderNotes = orderObj.description
      ruleForm.warehouseImport = orderObj?.warehouseId
      ruleForm.warehouseParent = orderObj?.warehouseId

      valueTypeSpa.value = orderObj.spaType
      ruleForm.dateOfReturn = orderObj.toDate
      totalOrder.value = orderObj.totalPrice
      totalPriceOrder.value = orderObj.totalPrice
      totalFinalOrder.value = orderObj.totalPrice

      if (ListOfProductsForSale.value.length > 0)
        ListOfProductsForSale.value.splice(0, ListOfProductsForSale.value.length - 1)

      if (orderObj.discountMoney != 0) {
        showPromo.value = true
        promoCash.value = orderObj.discountMoney
      }
      ListOfProductsForSale.value = orderObj.orderDetails

      ListOfProductsForSale.value?.forEach((e) => {
        editor.value = e.description
      })

      /* Tạm thời bỏ VAT 21/02/2023 
      if (orderObj.vat) {
        VAT.value = true
        moneyVAT.value = orderObj.vatMoney
      }
      */
      totalFinalOrder.value = orderObj.totalPrice - orderObj.discountMoney
      customerAddress.value = orderObj.address
      ruleForm.delivery = orderObj.deliveryOptionName
      customerIdPromo.value = orderObj.customerId
      if (orderObj.customer?.isOrganization) {
        infoCompany.name = orderObj?.customer?.name
        infoCompany.taxCode = orderObj?.customer?.taxCode
        infoCompany.phone = orderObj?.customer?.phonenumber
        infoCompany.email = 'Email: ' + orderObj?.customer?.email
      } else {
        infoCompany.name = orderObj.customer.name + ' | ' + orderObj.customer.taxCode
        infoCompany.taxCode = orderObj.customer.taxCode
        infoCompany.phone = orderObj.customer.phonenumber
        infoCompany.email = 'Email: ' + orderObj.customer.email
      }
    }
    orderObj.orderFiles.map((element) => {
      fileList.value.push({
        url: `${API_URL}${element?.path}`,
        name: element?.fileId
      })
    })
  } else if (type == 'add' || !type || type != 'approval-order') {
    ListOfProductsForSale.value.push({ ...productForSale })
  }
}

// Lấy danh sách kho
const callApiWarehouseList = async () => {
  const res = await getListWareHouse('')
  if (res?.data) {
    res?.data.map((el) => {
      if (el.children) {
        chooseWarehouseImport.push({
          value: el.id,
          label: el.name
        })
      }
    })
  }
}

type ChooseWarehouse = {
  idLot: number
  quantity: number | undefined
  fromWarehouseId: number | undefined
  fromLocationId: number | undefined
  toWarehouseId: number | undefined
  toLocationId: number | undefined
  tolotId: number | undefined
}

const warehouseData = ref<ChooseWarehouse>({} as ChooseWarehouse)
//dialog warehouse chuyen kho
const dialogWarehouse = ref(false)
const currentRowWHTrans = ref(0)
const curPPID = ref(0)
const quantitySpa = ref(0)
const opendialogWarehouse = (props) => {
  if (props.row.productPropertyId) {
    dialogWarehouse.value = true
    curPPID.value = Number(props.row.productPropertyId)
    currentRowWHTrans.value = props.$index
    quantitySpa.value = Number(props.row.quantity)
  } else {
    ElMessage({
      message: t('reuse.pleaseChooseProduct'),
      type: 'warning'
    })
  }
}

const fromWarehouseFormat = (props) => {
  let locationLot = ''
  let lotName = ''
  if (
    props.row.locationLot !== undefined &&
    props.row.locationLot?.label !== null &&
    props.row.locationLot?.label !== undefined
  ) {
    locationLot = props.row.locationLot?.label
  }
  if (props.row.lotName !== undefined && props.row.lotName !== null) {
    lotName = props.row.lotName
  }
  return `${locationLot}/${lotName}`
}

let tableSalesSlip = ref()
let formAccountingId = ref()
const getAccountingEntry = (_index, scope) => {
  const data = scope.row
  switch (data.typeOfAccountingEntry) {
    case 1:
      openAcountingEntryDialog(data.id, 1)
      break
    case 2:
      openAcountingEntryDialog(data.id, 2)
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

const openAcountingEntryDialog = async (index, num) => {
  idAcountingEntry.value = index
  createStatusAcountingEntry()

  const res = await getDetailAccountingEntryById({ id: index })
  formAccountingId.value = { ...res.data }
  tableSalesSlip.value = formAccountingId.value?.paidMerchandises
  tableSalesSlip.value.forEach((e) => {
    e.totalPrice = e.unitPrice * e.quantity
  })
  inputDeposit.value = formAccountingId.value.accountingEntry?.receiveMoney
  remainingMoney.value = formAccountingId.value.accountingEntry?.deibt
  tableAccountingEntry.value[0] = formAccountingId.value.accountingEntry

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
  if (num == 1) {
    dialogBillSpaInfomation.value = true
  } else if (num == 2) {
    autoChangeMoneyAccountingEntry()
    dialogAccountingEntryAdditional.value = true
  }
}
// Đúng thì hiển thị button Lưu và ghi sổ và hủy bút toán
const showCreatedOrUpdateButton = ref (false)
const showCancelAcountingEntry = ref(true)

const UpdateStatusTransaction = async() => {
  const payload = {
    AccountingEntryId: idAcountingEntry.value,
    OrderTransactionStatus: 0
  }

  updateStatusTransaction(FORM_IMAGES(payload))
  // Cập nhật lại bảng lịch sử công nợ
  getOrderStransactionList()
}

const codeExpenditures = ref()

const getReceiptCode = async () => {
  codeReceipts.value = await getReceiptPaymentVoucher()
}

const getcodeExpenditures = async () => {
  codeExpenditures.value = await getReceiptPaymentVoucher()
}
const dialogPrinBillSpa = ref(false)

const dialogPrinRepairSpa = ref(false)
const billRepairData = ref()
const openRepairBill = () =>{
  var curDate = 'SPLND' + moment().format('hhmmss')
  const store = warehouseOptions.value.find((warehouse)=>warehouse.value == dataEdit.value.warehouseId)
  dialogPrinRepairSpa.value = true
  billRepairData.value =dataEdit.value.orderDetails.map((orderDetail)=>({
    storeName: store?.label,
    importTicket: curDate,//Tự sinh
    productPropertyCode: orderDetail.productPropertyCode,
    productName: orderDetail.productName,
    accessory: orderDetail.accessory,
    description: orderDetail.description,
    codeSP: orderDetail.code,
    fromDate: dataEdit.value.fromDate,
    toDate: dataEdit.value.toDate,
    spaService: orderDetail?.spaServices,
    customerName: dataEdit.value.customer.name
  }))
}

const dialogInformationReceipts = ref(false)
const spaOrderCode = ref()
// input nhập tiền viết bằng chữ
const enterMoney = ref()
// form phiếu thu
const formReceipts = ref()
const moneyReceipts = ref(0)
const inputRecharger = ref()
const PrintReceipts = ref(false)

const getFormReceipts = () => {
  if (enterMoney.value) {
    formReceipts.value = {
      sellOrderCode: spaOrderCode.value,
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
const editor = ref()

const indexSpa = ref()

const addStatusDelay = () => {
  setTimeout(() => {
    addStatusOrder(0)
  }, 4000)
}
const valueMoneyAccoungtingEntry = ref(0)

const lotData = ref()
const tempLotData = ref()
const loadingLot = ref(true)
const callApiWarehouseLot = async (props) => {
  await getWarehouseLot({
    WarehouseId: idParentWH.value,
    productPropertyId: props.row.productPropertyId
  })
    .then((res) => {
      lotData.value = res.data.map((item) => ({
        idLot: item.id,
        warehouseId: item.warehouseId,
        locationId: item.locationId,
        location: item.locationName,
        lotCode: item.code,
        orderType: item.serviceType,
        inventory: item.inventory,
        unit: item?.unitName,
        createdAt: item.createdAt
      }))
    })
    .finally(() => (loadingLot.value = false))
  tempLotData.value = lotData.value
}

const autoChangeMoneyAccountingEntry = () => {
  valueMoneyAccoungtingEntry.value = 0
  tableAccountingEntry.value.forEach((val) => {
      val.intoMoney = Math.abs(val.paidMoney - val.receiveMoney)
    valueMoneyAccoungtingEntry.value += val.intoMoney
  })
}
const { push } = useRouter()
const editButton = ref(false)

const changeEditInDetail = () => {
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
  }
}

const editOrderInfo = async () => {
  const payload = {
    Id: id,
    CollaboratorId: ruleForm.collaborators,
    CollaboratorCommission: parseFloat(ruleForm.collaboratorCommission),
    Description: ruleForm.orderNotes,
    Files: Files,
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

// Bút toán bổ sung
const dialogAccountingEntryAdditional = ref(false)
const changeReturnGoods = ref(false)
var autoCodePawnOrder = 'CD' + moment().format('hmmss')
var autoCodeReceipts = 'PT' + moment().format('hmmss')
var autoCodeExpenditures = 'PC' + moment().format('hmmss')
var autoCodePaymentRequest = 'DNTT' + moment().format('hhmmss')

const handleRemove = (file: UploadFile) => {
  return file
}

let ListInfoSpa = ref()

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
onBeforeMount(async () => {
  await editData()
  await callApiWarehouseList()
  await callAPIProduct()
  await callAPIWarehouse()
  callCustomersApi()
  callApiCollaborators()
  callApiStaffList()
  callApiCity()
  if (type == 'add' || type == ':type') {
    disableCreateOrder.value = true
    checkDisabled2.value = true
    startSpa.value = true
    await GenerateCodeOrder({CodeType:5,ServiceType:5})
    .then((res) =>
    {
      ruleForm.orderCode = res.data
    })
    
    // ruleForm.orderCode = curDate
    spaOrderCode.value = autoCodePawnOrder
    codeReceipts.value = autoCodeReceipts
    codeExpenditures.value = autoCodeExpenditures
    codePaymentRequest.value = autoCodePaymentRequest
  }
})

const remainingMoney = ref(0)
const priceBillPayment = () => {
  remainingMoney.value = totalPriceOrder.value - inputPaymentBill.value
}

// trả hàng spa

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
  rentReturnOrder.value.name = infoCompany.name
  rentReturnOrder.value.customerAddress = customerAddress
  rentReturnOrder.value.phone = infoCompany.phone
  rentReturnOrder.value.tableData = ListOfProductsForSale.value.map((row)=>({
    productPropertyId:row.productPropertyId,
    accessory:row.accessory,
    spaServices:row.spaServices,
    type:'Spa',
    quantity:1,
    maxQuantity: row.quantity - row.returnedQuantity,
    isSpa:null,
  }))
}
const addRow = () => {
  rentReturnOrder.value.tableData.push({ ...productForSale })
}
// Tạo mới yêu cầu đổi trả
const postReturnRequest = async (reason) => {
  codeReturnRequest.value = autoCodeReturnRequest

  let tableReturnPost = [{}]

  tableReturnPost = rentReturnOrder.value.tableData.map((e) => ({
    productPropertyId: Number(e.productPropertyId),
    quantity: parseInt(e.quantity),
    accessory: e.accessory,
    returnDetailType: 7,
    unitPrice: 0,
    totalPrice: 0,
    isSpa: e?.isSpa
  }))

  const payload = {
    customerOrderId: id,
    code: autoCodeReturnRequest,
    name: formatOrderReturnReason(reason),
    description: formatOrderReturnReason(reason),
    returnRequestType: 7,
    tienBan: 0,
    tienHoan: 0,
    totalPrice: 0,
    giaHanDetails: [],
    nhapDetails: [],
    xuatDetails: tableReturnPost,
    isPaid: true
  }

  await createReturnRequest(payload).then((res) => {
          ElNotification({
            message: t('reuse.addSuccess'),
            type: 'success'
          })
       
    console.log('res', res)
  createTicketFromReturnOrder({ orderId: id, returnRequestId: res })
      .then((res) => {
        if(res.statusCode == 400) {
          ElNotification({
            message: 'Đơn hàng chưa được nhập kho',
            type: 'warning'
          })
        }
       }).catch(() => {
      ElNotification({
      message: 'Đơn hàng chưa được nhập kho',
      type: 'warning'
    })
    })
  })
  await getReturnRequestTable()
  // let ISSPA = true
  // rentReturnOrder.value.tableData.forEach((row)=>{
  //   if(row.isSpa == false){
  //     ISSPA = false
  //   }
  // })
  await reloadStatusOrder()
  // ISSPA 
  // ? addStatusOrder(6) //Ko duyệt
  // : addStatusOrder(10) // Duyệt trả hàng spa
}

//Truong ngo SPA :(

//Nếu không nhảy ra khỏi trang thì id = id vừa tạo đơn
  const thayDoiDichVuSpa = async () =>{
    const payload = {
      id: id,
      orderDetails: ListOfProductsForSale.value.map((row)=>({
        id: row.id,
        spaServices: row.spaServices.map((spa)=>({
          id:spa.id,
          price:spa.price
        })),
        totalPrice: row.totalPrice
      }))
    }
    const res = await updateSpaService(JSON.stringify(payload)).then(() =>
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
  const cancelUpdateSpaService = async () =>{
    const res = await CancelUpdateSpaService(FORM_IMAGES({orderId:id})).then(() =>
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
    if(res) await reloadStatusOrder()
  }
  const finishUpdateSpaService = async () =>{
    const res = await FinishUpdateSpaService(FORM_IMAGES({orderId:id})).then(() =>
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
      <div id="recpPaymentPrint">
        <slot>
          <receiptsPaymentPrint
            v-if="formReceipts"
            :dataEdit="formReceipts"
            :nameDialog="nameDialog"
          />
        </slot>
      </div>
      <div v-for="(item,index) in billRepairData" :key="index" class="hidden">
          <div class="repairSpa">
              <div class="page">
                <billSpaRepair :billRepairData="item" />
              </div>
          </div>
      </div>
      
      <ChooseWarehousePR
        :showDialog="dialogWarehouse"
        @close-dialog-warehouse="closeDialogWarehouse"
        :productPropertyId="curPPID"
        :warehouseData="warehouseData"
        :quantitySpa="quantitySpa"
        :warehouseIDParent="parseInt(ruleForm.warehouseParent)"
        :changeWH="changeWH"
        :listLotWH="tempLotData"
        :tempLotData="lotData"
      />
      <!-- Dialog In phiếu thu -->
      <el-dialog :close-on-click-modal="doCloseOnClickModal" v-model="PrintReceipts" class="font-bold" width="40%" align-center>
        <div class="section-bill">
          <div class="flex gap-3 justify-end">
            <el-button
              @click="
                printPage('recpPaymentPrint', {
                  url: '',
                  title: 'In vé',
                  w: 800,
                  h: 920
                })
              "
              >{{ t('button.print') }}</el-button
            >

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
            <el-button
              class="w-[150px]"
              @click.stop.prevent="
                () => {
                  dialogAddQuick = false
                }
              "
              >{{ t('reuse.exit') }}</el-button
            >
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
              <el-divider content-position="left">{{ t('formDemo.orderInformation') }}</el-divider>
              <el-form-item :label="t('formDemo.orderCode')" prop="orderCode">
                <el-input
                  v-model="ruleForm.orderCode"
                  :disabled="true"
                  style="width: 100%"
                  :placeholder="t('formDemo.enterOrderCode')"
                />
              </el-form-item>

              <el-form-item :label="t('reuse.typeOfSpa')" prop="typeOfSpa">
                <el-select
                  v-model="valueTypeSpa"
                  @change="checkDisabledCustomer()"
                  :disabled="checkDisabled"
                  placeholder="Select"
                >
                  <el-option
                    v-for="item in optionsTypeSpa"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>

              <el-form-item :label="t('formDemo.deliveryDate')" prop="dateOfReturn">
                <div class="custom-date">
                  <el-date-picker
                    v-model="ruleForm.dateOfReturn"
                    :disabled="disabledEdit"
                    type="date"
                    :disabled-date="disabledDate"
                    format="DD/MM/YYYY"
                    :placeholder="t('formDemo.returnDate')"
                    style="width: 100%"
                  />
                </div>
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
                <div class="text-right text-[#FECB80] italic">{{
                  t('formDemo.lessThanTenProfiles')
                }}</div>
              </div>
              <div class="pl-4">
                <el-upload
                  action="#"
                  list-type="picture-card"
                  v-model:file-list="fileList"
                  :multiple="true"
                  :auto-upload="false"
                  :limit="10"
                  :on-exceed="handleExceed"
                  :disabled="disabledEdit"
                  class="relative"
                  :on-change="handleChange"
                >
                  <!-- <ElButton :icon="addIcon" class="avatar-uploader-icon" /> -->
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
                        <span v-if="!disabled" class="el-upload-list__item-delete"> </span>
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
                  <el-dialog :close-on-click-modal="doCloseOnClickModal" v-model="dialogVisible" class="absolute">
                    <div class="text-[#303133] font-medium dark:text-[#fff]"
                      >+ {{ t('formDemo.addPhotosOrFiles') }}
                    </div>
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
              label-width="170px"
              class="demo-ruleForm"
            >
              <div class="flex w-[100%] gap-8">
                <el-divider content-position="left">{{ t('formDemo.customer') }}</el-divider>
                <el-divider content-position="left">{{
                  t('formDemo.methodOfDeliverySpa')
                }}</el-divider>
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
                            width="700px"
                            :items="optionsCustomerApi"
                            valueKey="value"
                            :disabled="disabledCustomer"
                            labelKey="label"
                            :hiddenKey="['id']"
                            :placeHolder="'Chọn khách hàng'"
                            :defaultValue="ruleForm.customerName"
                            :clearable="false"
                            @update-value="(value, obj) => getValueOfCustomerSelected(value, obj)"
                            @scroll-bottom="ScrollCustomerBottom"
                          />
                          <el-button :disabled="disabledCustomer" @click="dialogAddQuick = true"
                            >+ {{ t('button.add') }}</el-button
                          >
                        </div>
                      </div>
                    </el-form-item>
                  </div>
                </div>

                <div class="flex-1">
                  <el-form-item
                    v-if="valueTypeSpa == 1"
                    prop="warehouseParent"
                    :label="t('reuse.chooseExportWarehouse')"
                  >
                    <div class="flex w-[100%] max-h-[42px] gap-2 items-center">
                      <div class="flex w-[80%] gap-4">
                        <el-select
                          :disabled="checkDisabled"
                          class="w-full"
                          v-model="ruleForm.warehouseParent"
                          @click="callAPIWarehouse"
                          :loading="loadingWarehouse"
                          @change="(data) => getIDWarehouse(data)"
                          placeholder="Chọn kho"
                        >
                          <el-option
                            v-for="item in warehouseOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </div>
                    </div>
                  </el-form-item>
                  <el-form-item
                    v-if="valueTypeSpa == 0"
                    prop="warehouseImport"
                    :label="t('reuse.chooseImportWarehouse')"
                  >
                    <div class="flex w-[100%] max-h-[42px] gap-2 items-center">
                      <div class="flex w-[80%] gap-4">
                        <el-select
                          :disabled="checkDisabled"
                          class="w-full"
                          v-model="ruleForm.warehouseImport"
                          :loading="loadingWarehouse"
                          placeholder="Chọn kho"
                        >
                          <el-option
                            v-for="item in chooseWarehouseImport"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </div>
                    </div>
                  </el-form-item>
                  <el-form-item
                    v-if="valueTypeSpa == 0"
                    :label="t('formDemo.chooseShipping')"
                    prop="delivery"
                  >
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
              @change="(data) => handleChangePromo(data)"
              v-model="input"
              filterable
              :placeholder="t('formDemo.enterPromoCode')"
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
      <el-collapse-item :name="collapse[1].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[1].icon" link />
          <span class="text-center text-xl">{{ collapse[1].title }}</span>
        </template>
        <el-divider content-position="left">{{ t('formDemo.listProductSpa') }}</el-divider>
        <el-table
          :data="ListOfProductsForSale"
          border
          :class="[
            'bg-[var(--el-color-white)] dark:(bg-[var(--el-color-black)] border-[var(--el-border-color)] border-1px)'
          ]"
          v-loading="loadingProductTable"
        >
          <el-table-column
            :label="t('formDemo.productManagementCode')"
            min-width="150"
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
                :disabled="disabledEdit || props.row.newProduct"
                labelKey="productCode"
                :hiddenKey="['id']"
                :placeHolder="t('reuse.chooseProductCode')"
                :defaultValue="props.row.productPropertyId"
                :clearable="false"
                @scroll-top="ScrollProductTop"
                @scroll-bottom="ScrollProductBottom"
                @update-value="(value, obj) => getValueOfSelected(value, obj, props)"
                />
            </template>
          </el-table-column>

          <el-table-column
            prop="productName"
            :label="t('formDemo.productInformation')"
            min-width="300"
          />
          <el-table-column prop="accessory" :label="t('reuse.accessory')" width="180">
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

          <el-table-column prop="code" :label="t('formDemo.code')" width="180">
            <template #default="data">
              <div v-if="type == 'detail'">
                {{ data.row.code }}
              </div>
              <el-input
                v-else
                :disabled="disabledEdit"
                v-model="data.row.code"
                :placeholder="`/${t('formDemo.selfImportCode')}/`"
              />
            </template>
          </el-table-column>

          <el-table-column prop="description" :label="t('formDemo.examinationContent')" width="230">
            <template #default="data">
              <div class="flex w-[100%] items-center text-center">
                <div class="flex-1 limit-text" v-html="data.row.description"> </div>
                <div class="flex-1 text-right text-blue-500 cursor-pointer">
                  <el-button
                    :disabled="disabledEdit"
                    text
                    border
                    @click="
                      () => {
                        currentRow2 = data.$index
                        editor = data.row.description
                        checkProductSelected(data)
                      }
                    "
                    ><span class="text-blue-500">+ {{ t('formDemo.add') }}</span></el-button
                  ></div
                >
              </div>
            </template>
          </el-table-column>

          <el-table-column
            :label="t('router.ServiceLibrarySpaService')"
            prop="spaServices"
            width="250"
          >
            <template #default="data">
              <div class="flex w-[100%] items-center text-center">
                <div class="flex-1">
                  <div v-for="item in data.row.spaServices" :key="item.id">{{ item.name }} </div>
                </div>

                <div class="flex-1 text-right text-blue-500 cursor-pointer">
                  <el-button
                    text
                    border
                    @click="
                      () => {
                        callApiServicesSpa(data)
                      }
                    "
                    ><span class="text-blue-500">+ {{ t('reuse.selectService') }}</span>
                  </el-button>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="quantity" :label="t('formDemo.numberOfSpa')" width="90">
            <template #default="data">
              <div v-if="type == 'detail'">
                {{ data.row.quantity }}
              </div>
              <el-input
                v-else
                @change="
                  () => {
                    totalPriceSpa(data)
                    autoCalculateOrder()
                  }
                "
                type="number"
                v-model="data.row.quantity"
                :disabled="disabledEdit"
                style="width: 100%"
              />
            </template>
          </el-table-column>

          <el-table-column prop="unitName" :label="t('reuse.dram')" width="120" />

          <el-table-column prop="totalPrice" :label="t('formDemo.spaFeePayment')" width="100" />

          <el-table-column
            v-if="valueTypeSpa == 1"
            prop="warehouseLotId"
            :label="t('reuse.selectedLotSpa')"
            min-width="210"
          >
            <template #default="props">
              <div class="flex w-[100%] items-center">
                <div v-if="type == 'add'" class="flex-left w-[60%]">
                  <div class="break-words">{{ fromWarehouseFormat(props) }}</div>
                </div>
                <div v-if="type != 'add'" class="flex-left w-[60%]">
                  {{ props.row.warehouseLotId }}
                </div>
                <div class="w-[40%]">
                  <el-button
                    :disabled="disabledEdit"
                    text
                    @click="
                      () => {
                        opendialogWarehouse(props)
                        callApiWarehouseLot(props)
                      }
                    "
                  >
                    <span class="text-blue-500"> + {{ t('reuse.selectedLot') }}</span>
                  </el-button>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column :label="t('formDemo.manipulation')" align="center">
            <template #default="scope">
              <div class="flex gap-2">
                <el-button
                  :disabled="disabledEdit"
                  @click.prevent="removeListProductsSale(scope.$index)"
                  align="center"
                  type="danger"
                  >{{ t('reuse.delete') }}</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-button class="ml-4 mt-4" :disabled="disabledEdit" @click="addLastIndexSellTable"
          >+ {{ t('formDemo.add') }}</el-button
        >
        <div class="flex justify-end pt-4">
          <div class="w-50">
            <div class="dark:text-[#fff]">{{ t('formDemo.spaFeePayment') }}</div>
            <div class="text-blue-500 cursor-pointer">
              <el-button
                text
                :disabled="checkDisabled3"
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
                        @change="changePriceVAT"
                        :disabled="disabledEdit"
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
              t('formDemo.totalSpaFeeDebt')
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
            <!-- <div v-if="VAT" class="text-right dark:text-[#fff]">{{changeMoney.format(moneyVAT)}}</div>
            <div v-else class="text-right dark:text-[#fff] text-transparent dark:text-transparent">s</div> -->
            <div class="text-right dark:text-[#fff]">{{
              totalPriceOrder != undefined ? changeMoney.format(totalFinalOrder) : '0 đ'
            }}</div>
          </div>

          <div class="w-60 pl-2">
            <div class="dark:text-[#fff] text-transparent dark:text-transparent">s</div>
            <div class="text-blue-500 cursor-pointer bg-[#F4F8FD]">
              {{ promoActive }}
            </div>
            <div class="dark:text-[#fff] text-transparent dark:text-transparent">s</div>
          </div>
        </div>

        <div class="w-[100%]">
          <el-divider content-position="left">{{ t('formDemo.statusAndManipulation') }}</el-divider>
        </div>
        <div class="flex gap-4 w-[100%] ml-1 items-center pb-3">
          <label class="ml-10">{{ t('formDemo.orderTrackingStatus') }}</label>
          <div class="w-[84%] pl-1">
            <el-radio-group v-model="radioTracking" class="ml-4">
              <el-radio label="2" value="2" size="large">{{
                t('formDemo.receivedDelivery')
              }}</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="flex gap-4 w-[100%] ml-1 items-center pb-3 mb-2">
          <label class="ml-10">{{ t('formDemo.orderStatus') }}</label>
          <div class="w-[89%]">
            <div class="flex items-center w-[100%]">
              <div
                class="duplicate-status"
                v-for="item in arrayStatusOrder"
                :key="item.orderStatus"
              >
                <div
                  v-if="
                    item.orderStatus == STATUS_ORDER_SPA[9].orderStatus ||
                    item.orderStatus == STATUS_ORDER_SPA[4].orderStatus ||
                    item.orderStatus == STATUS_ORDER_SPA[8].orderStatus ||
                    item.orderStatus == STATUS_ORDER_SPA[10].orderStatus
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
                    item.orderStatus == STATUS_ORDER_SPA[1].orderStatus ||
                    item.orderStatus == STATUS_ORDER_SPA[6].orderStatus ||
                    item.orderStatus == STATUS_ORDER_SPA[3].orderStatus ||
                    item.orderStatus == STATUS_ORDER_SPA[5].orderStatus ||
                    item.orderStatus == STATUS_ORDER_SPA[7].orderStatus ||
                    item.orderStatus == STATUS_ORDER_SPA[11].orderStatus ||
                    item.orderStatus == STATUS_ORDER_SPA[12].orderStatus ||
                    item.orderStatus == STATUS_ORDER_SPA[13].orderStatus
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
                <div v-else-if="item.orderStatus == STATUS_ORDER_SPA[2].orderStatus">
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
                <div v-else-if="item.orderStatus == STATUS_ORDER_SPA[0].orderStatus">
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

        <div class="flex w-[100%] gap-2 mt-2">
          <div class="w-[12%]"></div>
          <!-- edit -->
          <div v-if="editButton" class="w-[100%] flex ml-1 gap-4">
            <el-button
              :disabled="checkDisabled"
              @click="
                () => {
                  editOrderInfo()
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
          <!-- Có thay đổi giá dịch vụ Spa -->
          <div v-if="priceChangeSpa == true">
            <div class="w-[100%] flex ml-1 gap-3" v-if="!editButton">
              <el-button class="min-w-42 min-h-11" @click="dialogPrinBillSpa = true">{{
                t('formDemo.printSpaBill')
              }}</el-button>
              <el-button class="min-w-42 min-h-11" @click="openRepairBill">In phiếu sửa chữa</el-button>
              <el-button class="min-w-42 min-h-11" @click="openBillSpaDialog">{{
                t('formDemo.bill')
              }}</el-button>
              <el-button
                :disabled="checkDisabled"
                @click="
                  () => {
                    submitForm(ruleFormRef, ruleFormRef2, true)
                    statusOrder = 3
                  }
                "
                type="primary"
                class="min-w-42 min-h-11"
                >{{ t('reuse.saveAndPending') }}</el-button
              >
              <el-button
                @click="
                  () => {
                    addStatusDelay()
                  }
                "
                :disabled="checkDisabled"
                type="danger"
                class="min-w-42 min-h-11"
                >{{ t('button.cancelOrder') }}</el-button
              >
            </div>
          </div>
          <!-- Trạng thái không thay đổi giá dv Spa-->
          <div v-else>
            <div v-if="!editButton" class="w-[100%] flex ml-1 gap-3">
              <el-button
                v-if="
                  statusOrder == STATUS_ORDER_SPA[5].orderStatus ||
                  (statusOrder == STATUS_ORDER_SPA[6].orderStatus && duplicateStatusButton) ||
                  statusOrder == STATUS_ORDER_SPA[7].orderStatus ||
                  statusOrder == STATUS_ORDER_SPA[1].orderStatus||
                  statusOrder == STATUS_ORDER_SPA[12].orderStatus
                "
                :disabled="startSpa"
                class="min-w-42 min-h-11"
                @click="dialogPrinBillSpa = true"
                >{{ t('formDemo.printSpaBill') }}</el-button
              >
              <el-button 
              v-if="
                  statusOrder == STATUS_ORDER_SPA[5].orderStatus ||
                  (statusOrder == STATUS_ORDER_SPA[6].orderStatus && duplicateStatusButton) ||
                  statusOrder == STATUS_ORDER_SPA[7].orderStatus ||
                  statusOrder == STATUS_ORDER_SPA[1].orderStatus||
                  statusOrder == STATUS_ORDER_SPA[12].orderStatus
                "
                :disabled="startSpa"
              class="min-w-42 min-h-11" @click="openRepairBill">In phiếu sửa chữa</el-button>
              <el-button
                v-if="
                  statusOrder == STATUS_ORDER_SPA[5].orderStatus ||
                  (statusOrder == STATUS_ORDER_SPA[6].orderStatus && duplicateStatusButton) ||
                  statusOrder == STATUS_ORDER_SPA[7].orderStatus ||
                  statusOrder == STATUS_ORDER_SPA[1].orderStatus||
                  statusOrder == STATUS_ORDER_SPA[12].orderStatus
                "
                :disabled="startSpa"
                class="min-w-42 min-h-11"
                @click="openBillSpaDialog"
                >{{ t('formDemo.bill') }}</el-button
              >
              <el-button
                v-if="statusOrder == STATUS_ORDER_SPA[1].orderStatus && (type == 'add' || type == ':type')"
                @click="
                  () => {
                    submitForm(ruleFormRef, ruleFormRef2, true)
                  }
                "
                type="primary"
                class="min-w-42 min-h-11"
                >{{ t('formDemo.saveCloseOrder') }}</el-button
              >
              <el-button
                v-if="statusOrder == STATUS_ORDER_SPA[1].orderStatus && type == 'add'"
                @click="
                  () => {
                    submitForm(ruleFormRef, ruleFormRef2, false)
                    clickStarSpa = true
                    spaNotChange = true
                  }
                "
                type="primary"
                class="min-w-42 min-h-11"
              >
                Bắt đầu quá trình Spa
              </el-button>
              <el-button
                v-if="statusOrder == STATUS_ORDER_SPA[1].orderStatus && type != 'add'"
                @click="
                  () => {
                    addStatusOrder(5)
                    spaNotChange = true
                  }
                "
                type="primary"
                class="min-w-42 min-h-11"
              >
                Bắt đầu quá trình Spa
              </el-button>
              <el-button
                v-if="statusOrder == STATUS_ORDER_SPA[1].orderStatus && type == 'detail'"
                @click="changeEditInDetail"
                class="min-w-42 min-h-11"
                >{{ t('formDemo.editOrder') }}</el-button
              >
              <el-button
                v-if="statusOrder == STATUS_ORDER_SPA[1].orderStatus"
                @click="
                  () => {
                    updateStatusOrders(STATUS_ORDER_SPA[0].orderStatus)
                  }
                "
                type="danger"
                class="min-w-42 min-h-11"
                >{{ t('button.cancelOrder') }}</el-button
              >
              <el-button
                @click="
                  () => {
                    thayDoiDichVuSpa()
                  }
                "
                v-if="
                  statusOrder == STATUS_ORDER_SPA[5].orderStatus ||
                  statusOrder == STATUS_ORDER_SPA[7].orderStatus
                "
                :disabled="spaNotChange"
                type="warning"
                class="min-w-42 min-h-11"
              >
                Thay đổi dịch vụ Spa
              </el-button>
              <el-button
                v-if="
                  statusOrder == STATUS_ORDER_SPA[5].orderStatus ||
                  statusOrder == STATUS_ORDER_SPA[7].orderStatus
                "
                type="primary"
                @click="
                  () => {
                    changeReturnGoods = true
                    setDataForReturnOrder()
                    // addStatusOrder(1)
                  }
                "
                class="min-w-42 min-h-11"
              >
                Trả hàng Spa
              </el-button>
              <!-- <el-button
                v-if="statusOrder == STATUS_ORDER_SPA[6].orderStatus && duplicateStatusButton"
                type="primary"
                class="min-w-42 min-h-11"
                @click="addStatusOrder(5)"
              >
                Hoàn thành trả hàng
              </el-button> -->

              <!-- <el-button
                v-if="
                  (statusOrder == STATUS_ORDER_SPA[6].orderStatus && !duplicateStatusButton) ||
                  statusOrder == STATUS_ORDER_SPA[7].orderStatus
                "
                class="min-w-42 min-h-11"
              >
                Hủy trả hàng
              </el-button> -->
              <!-- <el-button
                v-if="statusOrder == STATUS_ORDER_SPA[6].orderStatus && duplicateStatusButton"
                type="info"
                @click="
                  () => {
                    updateStatusOrders(STATUS_ORDER_SPA[2].orderStatus)
                  }
                "
                class="min-w-42 min-h-11"
              >
                Đối soát & kết thúc
              </el-button> -->
            </div>
            <div v-if="changeServiceSpa" class="w-[100%] flex ml-1 gap-3">
              <el-button
                v-if="statusOrder == STATUS_ORDER_SPA[8].orderStatus"
                @click="
                  () => {
                    addStatusOrder(8)
                  }
                "
                type="primary"
                class="min-w-42 min-h-11"
                >{{ t('reuse.saveAndPending') }}</el-button
              >
              <el-button
                v-if="statusOrder == STATUS_ORDER_SPA[8].orderStatus"
                @click="
                  () => {
                    router.go(-1)
                    changeServiceSpa = false
                  }
                "
                type="danger"
                class="min-w-42 min-h-11"
                >{{ t('button.cancel') }}</el-button
              >
            </div>
            <div v-if="!changeServiceSpa">
              <el-button
                v-if="statusOrder == STATUS_ORDER_SPA[8].orderStatus"
                class="min-w-42 min-h-11"
                @click="cancelUpdateSpaService"
              >
                Hủy thay đổi dịch vụ Spa
              </el-button>
              <el-button
                v-if="statusOrder == STATUS_ORDER_SPA[8].orderStatus && duplicateStatusButton"
                type="warning"
                @click="finishUpdateSpaService"
                class="min-w-42 min-h-11"
              >
                Hoàn thành thay đổi dịch vụ Spa 
              </el-button>
            </div>
            <div v-if="statusOrder == 200" class="w-[100%] flex ml-1 gap-4">
              <el-button @click="approvalFunction(true)" type="warning" class="min-w-42 min-h-11">{{
              t('router.approve')
            }}</el-button>
            <el-button @click="approvalFunction(false)" class="min-w-42 min-h-11 rounded font-bold">{{
              t('router.notApproval')
            }}</el-button>
            </div>
          </div>
          <!-- Nút không thuộc về đâu =)) -->
          <el-button
                v-if="(statusOrder == STATUS_ORDER_SPA[10].orderStatus || statusOrder == STATUS_ORDER_SPA[11].orderStatus) && duplicateStatusButton"
                type="primary"
                @click="
                  () => {
                    finishReturnRequest()
                  }
                "
                class="min-w-42 min-h-11"
                >Hoàn thành trả hàng</el-button
              >
          <el-button
                v-if="statusOrder == STATUS_ORDER_SPA[10].orderStatus || statusOrder == STATUS_ORDER_SPA[11].orderStatus"
                @click="
                  () => {
                    cancelReturnRequest()
                  }
                "
                class="min-w-42 min-h-11"
                >Hủy trả hàng</el-button
              >
            <el-button
                v-if="statusOrder == STATUS_ORDER_SPA[12].orderStatus"
                type="info"
                @click="
                  () => {
                    updateStatusOrders(STATUS_ORDER_SPA[2].orderStatus)
                  }
                "
                class="min-w-42 min-h-11"
              >
                Đối soát & kết thúc
              </el-button>
        </div>

        <div class="w-[100%] flex gap-2">
          <div class="w-[12%]"></div>
          <div class="w-[100%] flex ml-1 gap-4"> </div>
        </div>
      </el-collapse-item>

      <!-- Thông tin phiếu thanh toán dv spa -->
      <el-dialog
:close-on-click-modal="doCloseOnClickModal"
        v-model="dialogBillSpaInfomation"
        :title="t('formDemo.informationOnSpaService')"
        width="45%"
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
                <div class="text-xl">{{ spaOrderCode }}</div>
              </div>
            </div>
            <div class="flex-right">
              <div class="flex-right">
                <div class="flex-1 flex items-start gap-4">
                  <span>
                    <div>Mã QR đơn hàng</div>
                  </span>

                  <span class="border"><Qrcode :width="100" :text="'QR'" /></span>
                </div> </div
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
            <span class="w-[25%] text-base font-bold break-w">{{
              t('formDemo.productInformationSpa')
            }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
        </div>
        <div class="pt-2 pb-2">
          <el-table ref="singleTableRef" :data="ListInfoSpa" border style="width: 100%">
            <el-table-column label="STT" type="index" width="60" align="center" />
            <el-table-column prop="productName" :label="t('formDemo.commodityName')" width="180" />

            <el-table-column
              prop="productName"
              :label="t('router.ServiceLibrarySpaService')"
              width="120"
            />
            <el-table-column prop="type" :label="t('reuse.type')" width="90" />
            <el-table-column prop="quantity" :label="t('formDemo.numberOfSpa')" width="90" />
            <el-table-column prop="price" :label="t('formDemo.priceSpaService')" width="120">
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
          <div class="flex flex-col justify-end items-end">
            <div class="price-a flex gap-3 mb-2">
              <div class="text-right">
                <p class="text-black dark:text-white">{{ t('formDemo.spaFeePayment') }} </p>
              </div>
              <div class="text-right">
                <p class="pr-2 text-black dark:text-white">{{
                  totalPriceOrder != undefined ? changeMoney.format(totalPriceOrder) : '0 đ'
                }}</p>
              </div>
            </div>
            <div class="price-b flex gap-3 mb-2">
              <div class="text-right">
                <p class="text-black dark:text-white">{{ t('reuse.promotion') }} </p>
              </div>
              <div class="text-right">
                <p class="pr-2 text-black dark:text-white">{{
                  promoValue == 0 ? changeMoney.format(promoCash) : promoValue
                }}</p>
              </div>
            </div>
            <div class="price-c flex gap-3 border-bottom-1 mb-2">
              <div class="text-right">
                <p class="text-black dark:text-white font-bold"
                  >{{ t('reuse.totalSpaFeeMoney') }}
                </p>
              </div>
              <div class="text-right">
                <p class="pr-2 text-black font-bold dark:text-white">{{
                  totalPriceOrder != undefined ? changeMoney.format(totalFinalOrder) : '0 đ'
                }}</p>
              </div>
            </div>

            <div class="price-c flex gap-3 mb-2">
              <div class="text-right">
                <p class="text-black dark:text-white">{{ t('reuse.totalSpaFeeDebt2') }} </p>
              </div>
              <div class="text-right">
                <p class="pr-2 text-black font-bold dark:text-white">{{ '0 đ' }}</p>
              </div>
            </div>
            <div class="price-c flex gap-3 mb-2">
              <div class="text-right">
                <p class="text-blue-500 dark:text-white">{{ t('formDemo.paymentSpa') }} </p>
              </div>
              <div class="text-right">
                <CurrencyInputComponent
                  class="handle-fix"
                  v-model="inputPaymentBill"
                  @change="priceBillPayment"
                  :max="totalPriceOrder"
                  :min="0"
                />
              </div>
            </div>
            <div class="price-c flex gap-3 mb-2">
              <div class="text-right">
                <p class="text-red-500 dark:text-white">{{ t('reuse.remaining') }} </p>
              </div>
              <div class="text-right">
                <p class="pr-2 text-black font-bold dark:text-white">{{
                  remainingMoney != undefined ? changeMoney.format(remainingMoney) : '0 đ'
                }}</p>
              </div>
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
          <div>
            <span class="dialog-footer">
              <el-button
                class="min-w-42 min-h-11"
                type="primary"
                @click="
                  () => {
                    dialogBillSpaInfomation = false
                    postOrderStransaction(1)
                  }
                "
                >{{ t('formDemo.saveRecordDebts') }}</el-button
              >
              <el-button class="min-w-42 min-h-11" @click="dialogBillSpaInfomation = false">{{
                t('reuse.exit')
              }}</el-button>
            </span>
          </div>
        </template>
      </el-dialog>

      <!-- phieu in -->
      <div id="billSpa">
        <slot>
          <billSpaInspection :dataEditor="editor" />
        </slot>
      </div>

      <!-- dialog In Phiếu thăm khám sản phẩm" -->
      <el-dialog
:close-on-click-modal="doCloseOnClickModal"
        v-model="dialogPrinBillSpa"
        title="Phiếu thăm khám sản phẩm"
        width="40%"
        align-center
      >
        <div class="section-bill">
          <div class="flex gap-3 justify-end">
            <el-button
              @click="
                printPage('billSpa', {
                  url: '',
                  title: 'In vé',
                  w: 800,
                  h: 920
                })
              "
              >{{ t('button.print') }}</el-button
            >

            <el-button class="btn" @click="dialogPrinBillSpa = false">{{
              t('reuse.exit')
            }}</el-button>
          </div>
          <div class="dialog-content">
            <slot>
              <billSpaInspection :dataEditor="editor" />
            </slot>
          </div>
        </div>
      </el-dialog>

<!-- dialog In Phiếu sửa chữa" -->
<el-dialog
:close-on-click-modal="doCloseOnClickModal"
        v-model="dialogPrinRepairSpa"
        width="40%"
        align-center
        :show-close="false"
      >
        <div class="section-bill">
          <div class="flex gap-3 justify-end">
            <el-button
              @click="printPages('repairSpa', {
                  url: '',
                  title: 'In phiếu sửa chữa',
                  w: 800,
                  h: 920
                })"
              >{{ t('button.print') }}</el-button
            >

            <el-button class="btn" @click="dialogPrinRepairSpa = false">{{
              t('reuse.exit')
            }}</el-button>
          </div>
          <div v-for="(item,index) in billRepairData" :key="index">
              <slot>
            <billSpaRepair :billRepairData="item" />
              </slot>
          </div>
        </div>
      </el-dialog>

      <!-- dialog nội dung thăm khám sản phẩm -->
      <el-dialog
:close-on-click-modal="doCloseOnClickModal"
        v-model="dialogexaminationContentSpa"
        :title="t('formDemo.examinationContentProduct')"
        width="40%"
        class="font-bold"
        align-center
      >
        <el-divider />
        <div class="title-category flex gap-2 text-center items-center">
          <p class="title font-normal">Danh mục:</p>
          <p class="category font-bold text-xl">Túi /ví</p>
        </div>
        <hr />

        <div class="content mt-2 font-normal">
          <p class="title-content w-[20%] my-2 font-normal"> Nội dung </p>
          <div class="ck-editer"> <ckEditor v-model="editor" /> </div>
        </div>

        <template #footer>
          <span class="dialog-footer">
            <el-button
              type="primary"
              @click="
                () => {
                  saveContentEditor()
                  dialogexaminationContentSpa = false
                }
              "
              >{{ t('reuse.save') }}</el-button
            >
            <el-button @click="dialogexaminationContentSpa = false">{{
              t('reuse.exit')
            }}</el-button>
          </span>
        </template>
      </el-dialog>
      <!-- dialog2 -->
      <el-dialog
:close-on-click-modal="doCloseOnClickModal"
        v-model="dialogFormSettingServiceSpa"
        title="Cài đặt phí dịch vụ Spa"
        width="40%"
        align-center
        :show-close="false"
      >
        <el-divider />

          <el-table
            ref="spaTableRef"
            border
            :data="listServicesSpa"
            @selection-change="calculateSpaServiceMoney"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="spaServiceName" label="Thông tin dịch vụ Spa" width="320" />
            <el-table-column prop="price" label="Bảng giá" width="auto" show-overflow-tooltip>
              <template #default="data">
                <CurrencyInputComponent
                  class="handle-fix"
                  @change="changePriceSpaService"
                  v-model="data.row.price"
                />
              </template>
            </el-table-column>
          </el-table>
        <div class="flex justify-between px-3 mt-2">
          <strong>{{ t('formDemo.spaServiceFeePayment') }}</strong>
          <p class="price font-medium">{{ totalSettingSpa }}</p>
        </div>

        <template #footer>
          <span class="dialog-footer">
            <el-button
              :disabled="type == 'approval-order'"
              type="primary"
              @click="
                () => {
                  getPriceSpaService()
                  spaNotChange = false
                }
              "
              >{{ t('reuse.save') }}</el-button
            >
            <el-button @click="dialogFormSettingServiceSpa = false, spaNotChange = true">{{
              t('reuse.exit')
            }}</el-button>
          </span>
        </template>
      </el-dialog>
      <!-- end dialog 2 -->

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
          <div class="flex gap-4 py-2 justify-between">
            <div class="flex-left">
              <div class="flex gap-4 py-2 items-center">
                <label class="text-right w-[170px] font-bold">{{ t('formDemo.orderCode') }}</label>
                <div class="text-xl">{{ spaOrderCode }}</div>
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
            <div class="flex gap-4 pt-2 items-center">
              <label class="w-[30%] text-right">{{ t('formDemo.address') }}</label>
              <div class="w-[100%]">{{ customerAddress }}</div>
            </div>
            <div class="flex gap-4 pt-2 pb-4 items-center">
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
            <el-table-column prop="content" :label="t('reuse.content')" width="260">
              <template #default="props">
                <el-input v-model="props.row.content" />
              </template>
            </el-table-column>

            <el-table-column prop="collected" :label="t('formDemo.collected')" width="200">
              <template #default="props">
                <CurrencyInputComponent
                  @change="autoChangeMoneyAccountingEntry"
                  class="handle-fix"
                  v-model="props.row.receiveMoney"
                />
              </template>
            </el-table-column>
            <el-table-column prop="spent" :label="t('formDemo.spent')" width="200">
              <template #default="props">
                <CurrencyInputComponent
                  @change="autoChangeMoneyAccountingEntry"
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
            <el-select v-model="payment" placeholder="Select">
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
          <div class="btn-save">
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
                }
              "
                > 
                 {{t('formDemo.cancelAccountingEntry')}}
              </el-button>
            <el-button size="large" @click="dialogAccountingEntryAdditional = false">{{
              t('reuse.exit')
            }}</el-button>
            </span>
          </div>
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
            <div class="w-[100%] text-xl font-bold">{{ spaOrderCode }}</div>
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
                  v-for="item in getStaffList"
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
            <div class="w-[100%] text-xl font-bold">{{ spaOrderCode }}</div>
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
                  v-for="item in getStaffList"
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
                style="width: 100%"
                v-model="inputReasonCollectMoney"
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
:close-on-click-modal="doCloseOnClickModal"
        v-model="dialogIPRForm"
        :title="t('formDemo.informationPaymentRequestForm')"
        width="45%"
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
            <div class="w-[100%] text-xl font-bold">
              {{ spaOrderCode }}
            </div>
          </div>
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('router.analysis') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
          <div>
            <div class="flex gap-4 pt-4 items-center">
              <label class="w-[30%] text-right">{{ t('formDemo.PaymentRequestCode') }}</label>
              <div class="w-[100%] text-xl font-bold">
                {{ codePaymentRequest }}
              </div>
            </div>
            <div class="flex gap-4 pt-4 items-center">
              <label class="w-[30%] text-right"
                >{{ t('formDemo.proponent') }} <span class="text-red-500">*</span></label
              >
              <el-select v-model="inputRecharger" placeholder="Chọn người đề nghị">
                <el-option
                  v-for="item in getStaffList"
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
                    placeholder="Chọn ngày"
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
              <el-table-column prop="unitPrices" :label="t('reuse.unitPrice')">
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
                  <div class="text-right">{{ props.row.totalPrice }}</div>
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
              <p class="text-black font-bold dark:text-white">Tổng tiền</p>
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
              <p class="text-blue-400 leading-8">Đặt cọc <span class="text-red-500">*</span></p>
              <p class="text-red-600 leading-8">Còn lại</p>
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

      <ReturnOrder
        v-model="changeReturnGoods"
        :orderId="id"
        :orderData="rentReturnOrder"
        :listProductsTable="listOfOrderProduct"
        @add-row="addRow"
        @post-return-request="postReturnRequest"
        :orderStatusType="8"
        :type="4"
      />

      <el-collapse-item :name="collapse[2].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[2].icon" link />
          <span class="text-center text-xl">{{ collapse[2].title }}</span>
        </template>
        <el-button
          :disabled="checkDisabled2"
          text
          @click="
            () => {
              dialogAccountingEntryAdditional = true
              alreadyPaidForTt = false
            }
          "
          >+ Thêm bút toán</el-button
        >
        <el-button :disabled="disabledPTAccountingEntry" @click="openReceiptDialog()" text
          >+ Thêm phiếu thu</el-button
        >
        <el-button :disabled="disabledPCAccountingEntry" @click="openPaymentDialog()" text
          >+ Thêm phiếu chi</el-button
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
            :label="t('formDemo.certificateInformationAndServiceArising')"
            width="240"
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

          <el-table-column prop="deibt" :label="t('formDemo.spaFeeDebt')" min-width="150">
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
              <div v-if="props.row.typeOfPayment == 1" class="text-blue-500"> Phải thu </div>
              <div v-else-if="props.row.typeOfPayment == 0" class="text-red-500"> Phải chi </div>
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
              <el-checkbox :disabled="checkDisabled" v-model="scope.row.isReceiptedMoney" />
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
                  v-if="type == 'detail'"
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
              <el-select v-model="warehouseTicketData.staffId" placeholder="Trần Hữu Dương | 0998844533">
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
          <el-table ref="singleTableRef" :data="warehouseTicketData?.transactionDetails" border style="width: 100%">
            <el-table-column label="STT" type="index" width="60" align="center" />
            <el-table-column
              prop="productName"
              :label="t('formDemo.commodityName')"
              width="280"
            />
            <el-table-column prop="accessory" :label="t('reuse.accessory')"/>
            <el-table-column prop="quantity" :label="t('reuse.quantity')" />
            <el-table-column prop="spa" :label="t('formDemo.status')">
              <template #default>
                <div>{{productInReturnTicketIsSpa ? t('reuse.hasSpa') : t('reuse.hasNotSpa')}}</div>
              </template>
            </el-table-column>
          </el-table>
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
          <div class="flex justify-end">
            <el-button @click="informationWarehouseReceipt = false" type="primary">Lưu & ghi phiếu xuất trả</el-button>
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

      <el-collapse-item :name="collapse[3].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[3].icon" link />
          <span class="text-center text-xl">{{ collapse[3].title }}</span>
        </template>
        <div>
          <el-divider />
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
                width="180"
              />
              <el-table-column
                prop="productPropertyName"
                :label="t('formDemo.productInformation')"
                min-width="620"
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
              <el-table-column
                prop="unitName"
                :label="t('reuse.dram')"
                align="center"
                width="120"
              />

              <el-table-column
                prop="warehouseTicketCode"
                :label="t('formDemo.invoiceForGoodsEnteringTheWarehouse')"
                align="left"
                width="200"
              >
                <template #default="props">
                  <div @click="() => openDetailFullyIntegrated(props)" class="text-blue-500" role="button">
                    {{ props.row.warehouseTicketCode }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="warehouseTicketStatusName"
                :label="t('reuse.status')"
                align="left"
                width="200"
              />
            </el-table>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<style scoped>
@media screen {
  #billSpa {
    display: none;
  }
  #recpPaymentPrint {
    display: none;
  }
  #repairSpa{
    display: none;
  }
  .dialog-content {
    display: block;
  }
}

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
::v-deep(.el-dialog__title) {
  font-weight: bold;
}

::v-deep(.el-upload--picture-card) {
  width: 160px;
  height: 40px;
  border: 1px solid #409eff;
}

::v-deep(.d-block > .el-row) {
  display: block;
}
.fix-width > .el-form-item {
  width: 80%;
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
.duplicate-status + .duplicate-status {
  margin-left: 10px;
}
.active {
  opacity: 1 !important;
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

.limit-text {
  display: -webkit-box;
  max-height: 3.2rem;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  -webkit-line-clamp: 2;
  line-height: 1.6rem;
}

::v-deep(.el-form-item__content) {
  display: block;
}
::v-deep(.custom-date .el-input__wrapper) {
  width: 100%;
}
::v-deep(.custom-date .el-date-editor) {
  width: 100%;
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

::v-deep(.el-table .cell) {
  word-break: break-word;
}

.dialog-footer button:first-child {
  margin-right: 10px;
  margin-left: 10px;
}

::v-deep(.el-dialog__body) {
  padding-top: 0;
}

::v-deep(.el-dialog__header) {
  padding-bottom: 0;
}
::v-deep(.el-input) {
  width: 100%;
  height: fit-content;
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
::v-deep(.fix-err > .el-form-item__content > .el-form-item__error) {
  padding-left: 8px;
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

#content {
  height: 200px;
  overflow: auto;
  padding: 0 10px;
}

@media print {
  * { overflow: visible !important; } 
  .page { page-break-after:always; }
}
</style>
