<script setup lang="ts">
import { reactive, ref, watch, onBeforeMount, unref } from 'vue'
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
  ElTreeSelect
} from 'element-plus'
import type { UploadFile } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { Collapse } from '../../Components/Type'
import moment from 'moment'
import { FORM_IMAGES } from '@/utils/format'
import { getCity, getDistrict, getWard } from '@/utils/Get_Address'
import { PRODUCTS_AND_SERVICES } from '@/utils/API.Variables'
import { dateTimeFormat } from '@/utils/format'
import {
  getCollaboratorsInOrderList,
  getAllCustomer,
  getPromotionsList,
  getProductsList,
  addNewOrderList,
  getSellOrderList,
  createQuickProduct,
  getCheckProduct,
  getproductId,
  addQuickCustomer,
  getTotalOrder
} from '@/api/Business'
import { getCategories } from '@/api/LibraryAndSetting'
import MultipleOptionsBox from '@/components/MultipleOptionsBox.vue'
import CurrencyInputComponent from '@/views/Pages/Components/CurrencyInputComponent.vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'

const { t } = useI18n()

const changeMoney = new Intl.NumberFormat('vi', {
  style: 'currency',
  currency: 'vnd',
  minimumFractionDigits: 0
})

const ruleFormRef = ref<FormInstance>()
const ruleFormRef2 = ref<FormInstance>()
const ruleForm = reactive({
  orderCode: 'DHB039423',
  leaseTerm: t('reuse.byMonth'),
  rentalPeriod: [],
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
var curDate = 'DCT' + moment().format('hhmmss')

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
    value: 'deliveryAtTheCounter',
    label: t('formDemo.selfDelivery')
  },
  {
    value: 'deliveryToYourPlace',
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
  fromDate: string
  toDate: string
  quantity: number
  hirePrice: string
  depositePrice: string
  finalPrice: string
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
  quantity: 2,
  hirePrice: '',
  depositePrice: '',
  finalPrice: '',
  unitName: t('formDemo.psc'),
  intoARentalDeposit: ''
})

interface tableDataType {
  initializationDate: string
  certificateInformation: string
  receiptOrPayment: string
  quantity: number
  unitPrice: string
  intoMoney: string
  collected: string
  rentalFeeDebt: string
  kindOfMoney: string
  paymentProposal: string
  payment: string
  alreadyPaidForTt: boolean
  statusAccountingEntry: string
}
const debtTable = ref<Array<tableDataType>>([
  {
    initializationDate: moment().format('L').toString(),
    certificateInformation: 'Thu tiền cọc thuê',
    receiptOrPayment: 'PT354344',
    quantity: 0,
    unitPrice: '',
    intoMoney: '',
    collected: '95,000,000 đ',
    rentalFeeDebt: '',
    kindOfMoney: t('formDemo.deposit'),
    paymentProposal: '',
    payment: 'Thanh toán chuyển khoản',
    alreadyPaidForTt: false,
    statusAccountingEntry: 'Đã ghi sổ'
  },
  {
    initializationDate: moment().format('L').toString(),
    certificateInformation: 'Kỳ thanh toán phí thuê theo tháng/ Ngày 22/02/2022/Tháng thứ 1',
    receiptOrPayment: 'PT354344',
    quantity: 0,
    unitPrice: '',
    intoMoney: '',
    collected: '1,800,000 đ',
    rentalFeeDebt: '1,800,000 đ',
    kindOfMoney: t('formDemo.fee'),
    paymentProposal: 'DNTT6543',
    payment: 'Thanh toán chuyển khoản',
    alreadyPaidForTt: false,
    statusAccountingEntry: 'Đã ghi sổ'
  }
])

// const deleteRowDebtTable = (index: number) => {
//   debtTable.value.splice(index, 1)
// }

const onAddDebtTableItem = () => {
  debtTable.value.push({
    initializationDate: moment().format('L').toString(),
    certificateInformation: '',
    receiptOrPayment: '',
    quantity: 0,
    unitPrice: '',
    intoMoney: '',
    collected: '',
    rentalFeeDebt: '',
    kindOfMoney: '',
    paymentProposal: '',
    payment: '',
    alreadyPaidForTt: false,
    statusAccountingEntry: ''
  })
}

const historyTable = [
  {
    initializationDate: moment().format('L').toString(),
    productManagementCode: 'SPB34654',
    productInfo:
      'LV Flourine re X monogram bag da sần - Lage(35.5-40)-Gently used / Đỏ; không quai',
    accessory: '',
    quantity: '01',
    unit: t('formDemo.psc'),
    invoiceForGoodsEnteringTheWarehouse: 'NK0934',
    inventoryStatus: 'Chưa nhập kho'
  },
  {
    initializationDate: moment().format('L').toString(),
    productManagementCode: 'SPB34654',
    productInfo:
      'LV Flourine re X monogram bag da sần - Lage(35.5-40)-Gently used / Đỏ; không quai',
    accessory: '',
    quantity: '01',
    unit: t('formDemo.psc'),
    invoiceForGoodsEnteringTheWarehouse: 'NK87654',
    inventoryStatus: 'Đã nhập kho'
  },
  {
    initializationDate: moment().format('L').toString(),
    productManagementCode: 'SPB34654',
    productInfo:
      'LV Flourine re X monogram bag da sần - Lage(35.5-40)-Gently used / Đỏ; không quai',
    accessory: '',
    quantity: '01',
    unit: t('formDemo.psc'),
    invoiceForGoodsEnteringTheWarehouse: 'NK8756434',
    inventoryStatus: 'Đã hủy'
  }
]

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

const dialogAddQuick = ref(false)
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

// select khách hàng
const valueSelectCustomer = ref(t('formDemo.customer'))
const optionsCustomer = [
  {
    value: 'customer',
    label: t('formDemo.customer')
  }
]

// const openDialogChoosePromotion = ref(false)
const radioVAT = ref(false)
const dialogFormVisible = ref(false)

const openDialogChoosePromotion = ref(false)

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
    optionsCollaborators.value = listCollaborators.value.map((collaborator) => ({
      label: collaborator.name,
      value: collaborator.id
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
      optionsCustomerApi.value = getCustomerResult.map((customer) => ({
        label: customer.representative
          ? customer.representative + ' | MST ' + customer.taxCode
          : customer.name + ' | ' + customer.phonenumber,
        value: customer.id,
        address: customer.address,
        isOrganization: customer.isOrganization,
        name: customer.name,
        taxCode: customer.taxCode,
        phone: customer.phonenumber,
        email: customer.email,
        id: customer.id
      }))
    }
  }
  optionCallCustomerAPi++
}

// Call api promo list
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
  currentRow.value = val
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
  promo.value = promoTable.value.find((e) => e.value == data)
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
    // customerAddress.value = optionsCustomerApi.value.find((e) => e.value == data)?.address ?? ''
    const result = optionsCustomerApi.value.find((e) => e.value == data)
    optionCallPromoAPi = 0
    customerIdPromo.value = result.id
    callPromoApi()
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
    // deliveryMethod.value = ''
  }
}

interface tableOrderDetailType {
  productPropertyId: number
  quantity: number | undefined
  accessory: string | undefined
}
let tableOrderDetail = ref<Array<tableOrderDetailType>>([])
let totalPriceOrder = ref()
let totalFinalOrder = ref()
// Total order
const autoCalculateOrder = async () => {
  if (tableData.value[tableData.value.length - 1].productPropertyId == '') tableData.value.pop()
  tableOrderDetail.value = tableData.value.map((e) => ({
    productPropertyId: parseInt(e.productPropertyId),
    quantity: e.quantity,
    accessory: e.accessory
  }))
  const payload = {
    serviceType: 3,
    fromDate: '2022-10-31T09:15:56.106Z',
    toDate: '2022-10-31T09:15:56.106Z',
    paymentPeriod: 1,
    days: 1,
    campaignId: campaignId.value,
    orderDetail: tableOrderDetail.value
  }
  const res = await getTotalOrder(payload)

  totalPriceOrder.value = res.reduce((total, e) => {
    total += e.totalPrice
    return total
  }, 0)
  totalFinalOrder.value = res.reduce((total, e) => {
    total += e.finalPrice
    return total
  }, 0)
}

// Call api danh sách sản phẩm
let listProductsTable = ref()
let optionCallAPi = 0
const callApiProductList = async () => {
  if (optionCallAPi == 0) {
    const res = await getProductsList()
    if (Array.isArray(res.data) && res.data.length > 0) {
      listProductsTable.value = res.data.map((product) => ({
        productCode: product.code,
        value: product.productCode,
        name: product.name ?? '',
        price: product.price.toString(),
        productPropertyId: product.id.toString(),
        productPropertyCode: product.productPropertyCode
      }))
      optionCallAPi++
    }
  }
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

// tạo đơn hàng

const postData = async () => {
  submitForm(ruleFormRef.value, ruleFormRef2.value)
  if (checkValidate.value) {
    const productPayment = JSON.stringify([
      {
        ProductPropertyId: 2,
        Quantity: 1,
        ProductPrice: 10000,
        SoldPrice: 10000,
        accessory: 'todo',
        WarehouseId: 1,
        IsPaid: true,
        Accessory: 'Accessory1'
      },
      {
        ProductPropertyId: 3,
        Quantity: 1,
        ProductPrice: 90000,
        SoldPrice: 80000,
        accessory: 'todo',
        WarehouseId: 1,
        IsPaid: true,
        Accessory: 'Accessory2'
      }
    ])
    const payload = {
      ServiceType: 3,
      OrderCode: ruleForm.orderCode,
      PromotionCode: 'AA12',
      CollaboratorId: ruleForm.collaborators,
      CollaboratorCommission: ruleForm.discount,
      Description: ruleForm.orderNotes,
      CustomerId: ruleForm.customerName,
      fromDate: ruleForm.rentalPeriod[0],
      toData: ruleForm.rentalPeriod[1],
      Files: Files,
      DeliveryOptionId: ruleForm.delivery,
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
    await addNewOrderList(formDataPayLoad)
      .then(
        () =>
          ElNotification({
            message: t('reuse.addSuccess'),
            type: 'success'
          })
        // () =>
        //   push({
        //     name: 'business/order-management/order-list-ad',
        //     params: { backRoute: String(business/order-management/order-list-ad) }
        //   })
      )
      .catch(() =>
        ElNotification({
          message: t('reuse.addFail'),
          type: 'warning'
        })
      )
  }
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
  if (type == 'detail') checkDisabled.value = true
  if (type == 'edit' || type == 'detail') {
    const res = await getSellOrderList({ Id: id, ServiceType: 3 })
    const orderObj = { ...res.data[0] }

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
      if (tableData.value.length > 0) tableData.value.splice(0, tableData.value.length - 1)
      tableData.value = orderObj.orderDetails
      customerAddress.value = orderObj.address
      ruleForm.delivery = orderObj.deliveryOptionName
      customerIdPromo.value = orderObj.customerId
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
    tableData.value.push({ ...productForSale })
  }
}

const getValueOfSelected = (_value, obj, scope) => {
  console.log('_value: ', _value)
  console.log('obj: ', obj)
  console.log('scope: ', scope)
  scope.row.productManagementCode = obj.productPropertyId
  scope.row.productCode = obj.productPropertyId
  scope.row.productName = obj.name
  scope.row.rentalUnitPrice = obj.price
  scope.row.rentalFee = (
    parseInt(scope.row.quantity) * parseInt(scope.row.rentalUnitPrice)
  ).toString()
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
  // quickProductName.value = dataSelectedObj.name

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
const payment = choosePayment[0].value
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

const tableSalesSlip = [
  {
    commodityName:
      'LV Flourine red X monogam bag da sần - Lage(35.5-40.5)-Gently used / Đỏ; không quai',
    quantity: '2',
    rentalUnitPrice: '2,000,000 đ',
    rentalFee: '4,000,000 đ'
  }
]

const feePaymentPeriod = ref('Kỳ thanh toán phí thuê theo tháng/Ngày 22/02/2022/ Tháng thứ 2')

// Thông tin phiếu thanh toán tiền cọc thuê
const dialogDepositSlip = ref(false)

const tableDeposit = [
  {
    commodityName:
      'LV Flourine red X monogam bag da sần - Lage(35.5-40.5)-Gently used / Đỏ; không quai',
    quantity: '2',
    intoARentalDeposit: '15,000,000 đ'
  }
]

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

//add row to the end of table if fill all table
const forceRemove = ref(false)
const addLastIndexSellTable = () => {
  tableData.value.push({ ...productForSale })
}

watch(
  () => tableData,
  () => {
    if (
      tableData.value[tableData.value.length - 1].productPropertyId &&
      tableData.value[tableData.value.length - 1].quantity &&
      forceRemove.value == false &&
      type !== 'detail'
    ) {
      addLastIndexSellTable()
    }
  },
  { deep: true }
)
watch(
  () => checkValidate.value,
  () => {
    if (checkValidate.value === true) {
      postData()
    }
  }
)

let autoChangeCommune = ref()
let autoChangeDistrict = ref()
let autoChangeProvince = ref()
watch(
  () => enterdetailAddress.value,
  () => {
    if (enterdetailAddress.value) {
      autoChangeProvince.value = cities.value.find((e) => e.value == valueProvince.value)
      autoChangeDistrict.value = district.value.find((e) => e.value == valueDistrict.value)
      autoChangeCommune.value = ward.value.find((e) => e.value == valueCommune.value)
      customerAddress.value =
        enterdetailAddress.value +
        ', ' +
        autoChangeCommune.value.label +
        ', ' +
        autoChangeDistrict.value.label +
        ', ' +
        autoChangeProvince.value.label
    }
  }
)

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
// bắt thay đổi đơn hàng

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

const recharger = ref('Trần Hữu Dương | 0998844533')

onBeforeMount(() => {
  callApiCollaborators()
  callCustomersApi()
  callApiProductList()
  editData()
  if (type == 'add') {
    ruleForm.orderCode = curDate
  }
})
</script>

<template>
  <div class="demo-collapse dark:bg-[#141414]">
    <el-collapse v-model="activeName" @change="collapseChangeEvent">
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
            <div class="w-[100%] text-xl">BH24354</div>
          </div>
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('formDemo.generalInformation') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
          <div>
            <div class="flex gap-4 pt-4 items-center">
              <label class="w-[30%] text-right">{{ t('formDemo.receiptsCode') }}</label>
              <div class="w-[100%] text-xl">PT890345</div>
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
                <el-button type="primary" @click="dialogInformationReceipts = false">{{
                  t('formDemo.saveRecordDebts')
                }}</el-button>
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
            <div class="w-[100%] text-xl">BH24354</div>
          </div>
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('formDemo.generalInformation') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
          <div>
            <div class="flex gap-4 pt-4 items-center">
              <label class="w-[30%] text-right">{{ t('formDemo.receiptsCode') }}</label>
              <div class="w-[100%] text-xl">PT890345</div>
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
                <el-button type="primary" @click="dialogPaymentVoucher = false">{{
                  t('formDemo.saveRecordDebts')
                }}</el-button>
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
            <div class="w-[100%] text-xl">BH24354</div>
          </div>
          <div class="flex items-center">
            <span class="w-[25%] text-base font-bold">{{ t('router.analysis') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
          <div>
            <div class="flex gap-4 pt-4 items-center">
              <label class="w-[30%] text-right">{{ t('formDemo.PaymentRequestCode') }}</label>
              <div class="w-[100%] text-xl text-black dark:text-light-50">DNTT890345</div>
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
                <el-button type="primary" @click="dialogIPRForm = false">{{
                  t('formDemo.saveRecordDebts')
                }}</el-button>
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
                <div class="w-[60%] text-xl text-black font-bold dark:text-light-50">T24354</div>
              </div>
              <div class="flex gap-4">
                <label class="w-[40%] text-right">{{ t('reuse.rentalTerm') }}</label>
                <div class="w-[60%] text-black dark:text-light-50">Theo tháng</div>
              </div>
              <div class="flex gap-4">
                <label class="w-[40%] text-right">{{ t('formDemo.rentalPeriod') }}</label>
                <div class="w-[60%] text-black dark:text-light-50">20/02/2022 đến 20/04/2022</div>
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
              <div class="w-[100%] text-black dark:text-light-50">Công ty cổ phần Sài Gòn</div>
            </div>
            <div class="flex gap-4 items-center">
              <label class="w-[30%] text-right">{{ t('formDemo.address') }}</label>
              <div class="w-[100%] text-black dark:text-light-50"
                >79 Khúc Thừa Dụ, phường Dịch Vọng, quận Cầu Giấy, Hà Nội</div
              >
            </div>
            <div class="flex gap-4 pb-4 items-center">
              <label class="w-[30%] text-right">{{ t('reuse.phoneNumber') }}</label>
              <div class="w-[100%] text-black dark:text-light-50">0932424343</div>
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
          <el-table ref="singleTableRef" :data="tableSalesSlip" border style="width: 100%">
            <el-table-column label="STT" type="index" width="60" align="center" />
            <el-table-column
              prop="commodityName"
              :label="t('formDemo.commodityName')"
              width="280"
            />
            <el-table-column prop="quantity" :label="t('reuse.quantity')" width="90" />
            <el-table-column prop="rentalUnitPrice" :label="t('formDemo.rentalUnitPrice')">
              <template #default="props">
                <div class="text-right">{{ props.row.rentalUnitPrice }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="rentalFee" :label="t('formDemo.rentalFee')">
              <template #default="props">
                <div class="text-right">{{ props.row.rentalFee }}</div>
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
              <p class="pr-2">4,000,000 đ</p>
              <p class="pr-2">đ</p>
              <p class="pr-2 text-black font-bold dark:text-white">4,000,000 đ</p>
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
            <el-button @click="dialogRentalPaymentInformation = false">{{
              t('button.print')
            }}</el-button>
            <div>
              <span class="dialog-footer">
                <el-button type="primary" @click="dialogRentalPaymentInformation = false">{{
                  t('formDemo.saveRecordDebts')
                }}</el-button>
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
                <div class="w-[60%] text-xl text-black font-bold dark:text-light-50">T24354</div>
              </div>
              <div class="flex gap-4">
                <label class="w-[40%] text-right">{{ t('reuse.rentalTerm') }}</label>
                <div class="w-[60%] text-black dark:text-light-50">Theo tháng</div>
              </div>
              <div class="flex gap-4">
                <label class="w-[40%] text-right">{{ t('formDemo.rentalPeriod') }}</label>
                <div class="w-[60%] text-black dark:text-light-50">20/03/2022 đến 20/03/2022</div>
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
              <div class="w-[100%] text-black dark:text-light-50">Công ty cổ phần Sài Gòn</div>
            </div>
            <div class="flex gap-4 items-center">
              <label class="w-[30%] text-right">{{ t('formDemo.address') }}</label>
              <div class="w-[100%] text-black dark:text-light-50"
                >79 Khúc Thừa Dụ, phường Dịch Vọng, quận Cầu Giấy, Hà Nội</div
              >
            </div>
            <div class="flex gap-4 pb-4 items-center">
              <label class="w-[30%] text-right">{{ t('reuse.phoneNumber') }}</label>
              <div class="w-[100%] text-black dark:text-light-50">0932424343</div>
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
          <el-table ref="singleTableRef" :data="tableDeposit" border style="width: 100%">
            <el-table-column label="STT" type="index" width="60" align="center" />
            <el-table-column
              prop="commodityName"
              :label="t('formDemo.commodityName')"
              width="420"
            />
            <el-table-column prop="quantity" :label="t('reuse.quantity')" width="90" />
            <el-table-column prop="intoARentalDeposit" :label="t('formDemo.intoARentalDeposit')">
              <template #default="props">
                <div class="text-right">{{ props.row.intoARentalDeposit }}</div>
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
              <p class="pr-2 text-black font-bold dark:text-white">15,000,000 đ</p>
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
            <el-button @click="dialogDepositSlip = false">{{ t('button.print') }}</el-button>
            <div>
              <span class="dialog-footer">
                <el-button type="primary" @click="dialogDepositSlip = false">{{
                  t('formDemo.saveRecordDebts')
                }}</el-button>
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

      <!-- Dialog Địa chỉ nhận hàng -->
      <el-dialog v-model="dialogFormVisible" width="40%" align-center title="Địa chỉ nhận hàng">
        <el-divider />
        <div>
          <div class="flex w-[100%] gap-4 items-center">
            <label class="w-[25%] text-right"
              >{{ t('formDemo.provinceOrCity') }} <span class="text-red-500">*</span></label
            >
            <el-select
              v-model="valueProvince"
              style="width: 96%"
              class="m-2 fix-full-width"
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
          </div>
          <div class="flex w-[100%] gap-4 items-center">
            <label class="w-[25%] text-right"
              >{{ t('formDemo.countyOrDistrict') }} <span class="text-red-500">*</span></label
            >
            <el-select
              v-model="valueDistrict"
              style="width: 96%"
              class="m-2 fix-full-width"
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
          </div>
          <div class="flex w-[100%] gap-4 items-center">
            <label class="w-[25%] text-right"
              >{{ t('formDemo.wardOrCommune') }} <span class="text-red-500">*</span></label
            >
            <el-select
              v-model="valueCommune"
              clearable
              style="width: 96%"
              class="m-2 fix-full-width"
              :placeholder="t('formDemo.chooseWard')"
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
              >{{ t('formDemo.detailedAddress') }} <span class="text-red-500">*</span></label
            >
            <el-input
              v-model="enterdetailAddress"
              style="width: 96%"
              class="m-2 fix-full-width"
              :placeholder="t('formDemo.enterDetailAddress')"
            />
          </div>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button class="w-[150px]" type="primary" @click="dialogFormVisible = false">{{
              t('reuse.save')
            }}</el-button>
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
                            :disabled="checkDisabled"
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
                :items="listProductsTable"
                valueKey="productPropertyId"
                labelKey="productCode"
                :hiddenKey="['id']"
                :placeHolder="'Chọn mã sản phẩm'"
                :defaultValue="props.row.productPropertyCode"
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
                v-model="props.row.accessory"
                :placeholder="`/${t('formDemo.selfImportAccessories')}/`"
              />
              <div v-else>{{ props.row.accessory }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="fromDate" :label="t('formDemo.rentalStartDate')" width="120">
            <template #default="props">
              <div v-if="props.row.fromDate != ''">
                {{ dateTimeFormat(props.row.fromDate) }}
              </div>
              <el-date-picker
                v-else
                v-model="props.row.fromDate"
                type="date"
                placeholder="Chọn ngày"
                format="DD/MM/YYYY"
              />
            </template>
          </el-table-column>
          <el-table-column prop="toDate" :label="t('formDemo.rentalEndDate')" width="120">
            <template #default="props">
              <div v-if="props.row.toDate != ''">
                {{ dateTimeFormat(props.row.toDate) }}
              </div>
              <el-date-picker
                v-else
                v-model="props.row.toDate"
                type="date"
                placeholder="Chọn ngày"
                format="DD/MM/YYYY"
              />
            </template>
          </el-table-column>
          <el-table-column prop="quantity" :label="t('formDemo.rentalQuantity')" width="90">
            <template #default="props">
              <div v-if="type == 'detail'">{{ props.row.quantity }}</div>
              <el-input v-model="props.row.quantity" />
            </template>
          </el-table-column>
          <el-table-column prop="unitName" :label="t('reuse.dram')" align="center" width="100" />
          <el-table-column
            prop="hirePrice"
            :label="t('formDemo.rentalUnitPrice')"
            align="right"
            width="180"
          >
            <template #default="props">
              <CurrencyInputComponent
                v-model="props.row.hirePrice"
                v-if="type != 'detail'"
                @change="changePriceRowTable"
              />
              <div v-else>{{
                props.row.hirePrice != ''
                  ? changeMoney.format(parseInt(props.row.hirePrice))
                  : '0 đ'
              }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="finalPrice"
            :label="t('formDemo.rentalFee')"
            align="right"
            width="180"
          >
            <template #default="props">
              {{
                props.row.finalPrice != ''
                  ? changeMoney.format(parseInt(props.row.finalPrice))
                  : '0 đ'
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="depositePrice"
            :label="t('formDemo.intoARentalDeposit')"
            align="right"
            width="180"
          />
          <el-table-column :label="t('formDemo.exportWarehouse')" width="200">
            <div class="flex w-[100%]">
              <div class="flex-1">Còn hàng</div>
              <div class="flex-1 text-right text-blue-500 cursor-pointer"
                >+ {{ t('formDemo.chooseWarehouse') }}</div
              >
            </div>
          </el-table-column>
          <el-table-column :label="t('formDemo.manipulation')" align="center" width="90">
            <button class="bg-[#F56C6C] pt-2 pb-2 pl-4 pr-4 text-[#fff] rounded">{{
              t('reuse.delete')
            }}</button>
          </el-table-column>
        </el-table>
        <div class="flex justify-end pt-4">
          <div class="w-50">
            <div class="dark:text-[#fff]">{{ t('formDemo.intoMoney') }}</div>
            <div class="text-blue-500 cursor-pointer">
              <el-button text @click="openDialogChoosePromotion = true" style="padding: 0">
                <span class="text-blue-500"> + {{ t('formDemo.choosePromotion') }}</span>
              </el-button>
            </div>
            <div class="text-blue-500 cursor-pointer">
              <el-dropdown class="flex justify-end" trigger="click">
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
            <div class="h-[32px] text-right dark:text-[#fff]"
              >-
              {{
                totalPriceOrder != undefined
                  ? changeMoney.format(totalPriceOrder - totalFinalOrder)
                  : '0 đ'
              }}
            </div>
            <div class="text-right dark:text-[#fff] text-transparent dark:text-transparent">s</div>
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
          <label class="w-[9%] text-right">{{ t('formDemo.orderStatus') }}</label>
          <div class="w-[84%] pl-1">
            <el-radio-group v-model="radio1" class="ml-4">
              <!-- <el-radio label="1">{{ t('reuse.closedTheOrder') }}</el-radio> -->
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
              <!-- <el-radio label="5">{{ t('reuse.paying') }}</el-radio>
              <el-radio label="6">{{ t('common.doneLabel') }}</el-radio> -->
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
            <el-button @click="dialogRentalPaymentInformation = true" class="min-w-42 min-h-11">{{
              t('formDemo.rentalVoucher')
            }}</el-button>
            <el-button
              @click="dialogDepositSlip = true"
              :disabled="checkDisabled"
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
            <el-button @click="dialogRentalPaymentInformation = true" class="min-w-42 min-h-11">{{
              t('formDemo.rentalVoucher')
            }}</el-button>
            <el-button
              @click="dialogDepositSlip = true"
              :disabled="checkDisabled"
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
            <el-button @click="dialogRentalPaymentInformation = true" class="min-w-42 min-h-11">{{
              t('formDemo.rentalVoucher')
            }}</el-button>
            <el-button
              @click="dialogDepositSlip = true"
              :disabled="checkDisabled"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.depositSlip') }}</el-button
            >
            <el-button
              :disabled="checkDisabled"
              @click="
                () => {
                  postData()
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
                  postData
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
            <el-button @click="dialogRentalPaymentInformation = true" class="min-w-42 min-h-11">{{
              t('formDemo.rentalVoucher')
            }}</el-button>
            <el-button
              @click="dialogDepositSlip = true"
              :disabled="checkDisabled"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.depositSlip') }}</el-button
            >
            <button
              :disabled="checkDisabled"
              @click="
                () => {
                  postData()
                  statusOrder = 6
                  addStatusOrder(5)
                  changeStatus(7)
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
                  postData()
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
            <el-button @click="dialogRentalPaymentInformation = true" class="min-w-42 min-h-11">{{
              t('formDemo.rentalVoucher')
            }}</el-button>
            <el-button
              @click="dialogDepositSlip = true"
              :disabled="checkDisabled"
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
            <el-button @click="dialogRentalPaymentInformation = true" class="min-w-42 min-h-11">{{
              t('formDemo.rentalVoucher')
            }}</el-button>
            <el-button
              @click="dialogDepositSlip = true"
              :disabled="checkDisabled"
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
                }
              "
              class="min-w-42 min-h-11 bg-[#FFF0D9] text-[#FD9800] rounded font-bold"
              >{{ t('formDemo.returnsExpired') }}</button
            >
          </div>
          <div v-else-if="statusOrder == 10" class="w-[100%] flex ml-1 gap-4">
            <el-button @click="dialogRentalPaymentInformation = true" class="min-w-42 min-h-11">{{
              t('formDemo.rentalVoucher')
            }}</el-button>
            <el-button
              @click="dialogDepositSlip = true"
              :disabled="checkDisabled"
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
                  postData()
                  statusOrder = 8
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
        <el-button @click="dialogInformationReceipts = true" text>+ Thêm phiếu thu</el-button>
        <el-button @click="dialogPaymentVoucher = true" text>+ Thêm phiếu chi</el-button>
        <el-button @click="dialogIPRForm = true" text>+ Thêm đề nghị thanh toán</el-button>
        <el-table ref="multipleTableRef" :data="debtTable" border>
          <el-table-column type="selection" width="40" />
          <el-table-column
            prop="initializationDate"
            :label="t('formDemo.initializationDate')"
            width="150"
            align="center"
          />
          <el-table-column
            prop="certificateInformation"
            :label="t('formDemo.certificateInformation')"
            width="240"
          />
          <el-table-column
            prop="receiptOrPayment"
            :label="t('formDemo.receiptOrPayment')"
            align="right"
          >
            <template #default="props">
              <div class="text-blue-500">{{ props.row.receiptOrPayment }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="paymentProposal"
            :label="t('router.paymentProposal')"
            align="right"
          >
            <template #default="props">
              <div class="text-blue-500">{{ props.row.paymentProposal }}</div>
            </template>
          </el-table-column>
          <el-table-column :label="t('formDemo.kindOfMoney')" prop="kindOfMoney">
            <template #default="props">
              <div>{{ props.row.kindOfMoney }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="collected" :label="t('formDemo.collected')" align="left">
            <template #default="props">
              <div class="text-right">{{ props.row.collected }}</div>
            </template>
          </el-table-column>
          <el-table-column :label="t('formDemo.spent')" align="right">đ</el-table-column>
          <el-table-column
            prop="rentalFeeDebt"
            :label="`${t('formDemo.rentalFeeDebt')}`"
            align="right"
          />
          <el-table-column :label="t('formDemo.receivableOrPayable')" width="120">
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
            align="center"
            min-width="120"
          />
          <el-table-column :label="t('formDemo.manipulation')" width="90" align="center">
            <el-button @click="dialogDepositSlip = true">{{ t('reuse.detail') }}</el-button>
          </el-table-column>
        </el-table>
        <el-button class="ml-4 mt-4" @click="onAddDebtTableItem"
          >+ {{ t('formDemo.add') }}</el-button
        >
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
            <el-table-column
              prop="initializationDate"
              :label="t('formDemo.initializationDate')"
              width="150"
            />
            <el-table-column
              prop="productManagementCode"
              :label="t('formDemo.productManagementCode')"
              width="150"
            />
            <el-table-column
              prop="productInfo"
              :label="t('formDemo.productInformation')"
              width="680"
            />
            <el-table-column :label="t('reuse.accessory')" width="180" />

            <el-table-column prop="quantity" :label="t('formDemo.amount')" width="120" />
            <el-table-column prop="unit" :label="t('reuse.dram')" width="90" />
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
</style>
