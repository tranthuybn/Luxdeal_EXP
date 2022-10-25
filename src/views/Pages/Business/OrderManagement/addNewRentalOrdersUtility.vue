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
  ElTreeSelect
} from 'element-plus'
import type { UploadFile } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { Collapse } from '../../Components/Type'
import moment from 'moment'
import { FORM_IMAGES } from '@/utils/format'
import { getCity, getDistrict, getWard } from '@/utils/Get_Address'
import { PRODUCTS_AND_SERVICES } from '@/utils/API.Variables'
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
  addQuickCustomer
} from '@/api/Business'
import { getCategories } from '@/api/LibraryAndSetting'
import MultipleOptionsBox from '@/components/MultipleOptionsBox.vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'

const { t } = useI18n()

const ruleFormRef = ref<FormInstance>()
const ruleFormRef2 = ref<FormInstance>()
const ruleForm = reactive({
  orderCode: 'DHB039423',
  leaseTerm: t('reuse.byMonth'),
  rentalPeriod: '',
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

const deliveryMethod = ref(chooseDelivery[0].value)

const radio1 = ref('')
const percentageIcon = useIcon({ icon: 'material-symbols:percent' })

const input = ref('')

interface tableRentalProduct {
  name: string
  rentalStartDate: string
  rentalEndDate: string
  quantity: number
  rentalUnitPrice: string
  rentalFee: string
  dram: string
  intoARentalDeposit: string
}

const tableData = ref<Array<tableRentalProduct>>([])

const productForSale = reactive<tableRentalProduct>({
  name: 'LV Flourine red X monogam bag da sần - Lage(35.5 - 40.5)-Gently used / Đỏ; không quai',
  rentalStartDate: '20/03/2022',
  rentalEndDate: '20/06/2022',
  quantity: 2,
  rentalUnitPrice: '2,000,000 đ',
  rentalFee: '4,000,000 đ',
  dram: t('formDemo.psc'),
  intoARentalDeposit: '15,000,000 đ'
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

const deleteRowDebtTable = (index: number) => {
  debtTable.value.splice(index, 1)
}

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
const valueProvince = ref('')
const valueDistrict = ref('')
const valueCommune = ref('')

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
    optionsCollaborators.value = listCollaborators.value.map((product) => ({
      label: product.name,
      value: product.id
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
      optionsCustomerApi.value = getCustomerResult.map((product) => ({
        label: product.representative
          ? product.representative + ' | MST ' + product.taxCode
          : product.name + ' | ' + product.phonenumber,
        value: product.code,
        address: product.address,
        isOrganization: product.isOrganization,
        name: product.name,
        taxCode: product.taxCode,
        phone: product.phonenumber,
        email: product.email
      }))
    }
  }
  optionCallCustomerAPi++
}

const changeAddressCustomer = (data) => {
  if (data) {
    // customerAddress.value = optionsCustomerApi.value.find((e) => e.value == data)?.address ?? ''
    const result = optionsCustomerApi.value.find((e) => e.value == data)
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
    deliveryMethod.value = ''
  }
}

// Call api promo list
const initialRadio = ref(false)
let promoTable = ref()
const promoLoading = ref(true)
const listPromotions = ref()
const optionPromotions = ref()
let optionCallPromoAPi = 0
const callPromoApi = async () => {
  if (optionCallPromoAPi == 0) {
    const res = await getPromotionsList('')
    let count = 0
    listPromotions.value = res.data
    optionPromotions.value = listPromotions.value.map((product) => ({
      radio: count++,
      label: product.code,
      value: product.name,
      name: product.description,
      discount: product.reduce,
      min: product.minimumPriceToGetReduce,
      max: product.maximumReduce
    }))
    optionCallPromoAPi++
    promoTable.value = optionPromotions.value
  }
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

// call api province
const cities = ref()
const district = ref()
const ward = ref()
const street = ref()
const enterdetailAddress = ref([])

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
      ServiceType: 1,
      OrderCode: ruleForm.orderCode,
      PromotionCode: 'AA12',
      CollaboratorId: ruleForm.collaborators,
      CollaboratorCommission: ruleForm.discount,
      Description: ruleForm.orderNotes,
      CustomerId: ruleForm.customerName,
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
        //     name: 'business.collaborators.collaboratorsList',
        //     params: { backRoute: 'business.collaborators.collaboratorsList' }
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

const options = [
  {
    value: t('reuse.byDay'),
    label: t('reuse.byDay')
  },
  {
    value: t('reuse.byWeek'),
    label: t('reuse.byWeek')
  },
  {
    value: t('reuse.byMonth'),
    label: t('reuse.byMonth')
  }
]

const optionsRentalPaymentPeriod = [
  {
    value: t('formDemo.onetimePaymentInAdvance'),
    label: t('formDemo.onetimePaymentInAdvance')
  },
  {
    value: t('formDemo.payAfterOneTime'),
    label: t('formDemo.payAfterOneTime')
  },
  {
    value: t('reuse.byDay'),
    label: t('reuse.byDay')
  },
  {
    value: t('reuse.byWeek'),
    label: t('reuse.byWeek')
  },
  {
    value: t('reuse.byMonth'),
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
    const res = await getSellOrderList({ Id: id })
    const orderObj = { ...res.data[0] }
    if (res.data) {
      ruleForm.orderCode = orderObj.code
      ruleForm.collaborators = orderObj.collaborator.name
      ruleForm.discount = orderObj.CollaboratorCommission
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
  scope.row.productPropertyId = obj.label
  scope.row.productCode = obj.value
  scope.row.productName = obj.name
  scope.row.price = obj.price
  scope.row.finalPrice = (parseInt(scope.row.quantity) * parseInt(scope.row.price)).toString()
}

const dialogAddProduct = ref(false)
const addnewproduct = () => {
  dialogAddProduct.value = true
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
  console.log('data: ', data)

  const dataSelectedObj = listProductsTable.value.find(
    (product) => product.productPropertyId == data
  )
  // quickProductName.value = dataSelectedObj.name
  console.log('dataSelectedObj: ', dataSelectedObj)

  // call API checkProduct
  let codeCheckProduct = ref()
  let checkProductAPI = 0
  if (checkProductAPI == 0) {
    const res = await getCheckProduct({ keyWord: dataSelectedObj.value })
    codeCheckProduct.value = res.data[0]
    console.log('codeCheckProduct: ', codeCheckProduct)
  }
  checkProductAPI++

  // call API getProductId
  let formProductData = ref()
  let getProductIdAPI = 0
  if (getProductIdAPI == 0) {
    const res = await getproductId({ Id: codeCheckProduct.value.id })
    formProductData.value = res.data[0]

    console.log('res: ', res.data)
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
const value = ref('')
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

onBeforeMount(() => {
  callApiCollaborators()
  callCustomersApi()
  callPromoApi()
  callApiProductList()
  callApiCity()
  editData()
  getBrandSelectOptions()
  getUnitSelectOptions()
  getOriginSelectOptions()
  getCategory()
  if (type == 'add') {
    ruleForm.orderCode = curDate
  }
})
</script>

<template>
  <div class="demo-collapse dark:bg-[#141414]">
    <el-collapse v-model="activeName" @change="collapseChangeEvent">
      <el-collapse-item :name="collapse[0].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[0].icon" link />
          <span class="text-center text-xl">{{ collapse[0].title }}</span>
        </template>

        <!-- Dialog Thêm nhanh khách hàng -->
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
              <span class="w-[25%] text-base font-bold">{{
                t('formDemo.generalInformation')
              }}</span>
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
              <span class="w-[25%] text-base font-bold">{{
                t('formDemo.billingInformation')
              }}</span>
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
              <span class="w-[25%] text-base font-bold">{{
                t('formDemo.generalInformation')
              }}</span>
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
              <span class="w-[25%] text-base font-bold">{{
                t('formDemo.billingInformation')
              }}</span>
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
                <div class="w-[100%] text-xl">DNTT890345</div>
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
              <el-table
                ref="singleTableRef"
                :data="detailedListExpenses"
                border
                style="width: 100%"
              >
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
              <span class="w-[25%] text-base font-bold">{{
                t('formDemo.billingInformation')
              }}</span>
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
                    v-for="item in options"
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
                          <el-button @click="dialogAddQuick = true"
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
                      class="hover:bg-transparent; focus:bg-transparent"
                      text
                      @click="dialogFormVisible = true"
                      ><span class="text-blue-500">+ {{ t('formDemo.changeTheAddress') }}</span>
                    </el-button>
                    <el-dialog
                      v-model="dialogFormVisible"
                      width="40%"
                      align-center
                      title="Địa chỉ nhận hàng"
                    >
                      <el-divider />
                      <div>
                        <div class="flex w-[100%] gap-4 items-center">
                          <label class="w-[25%] text-right"
                            >{{ t('formDemo.provinceOrCity') }}
                            <span class="text-red-500">*</span></label
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
                            >{{ t('formDemo.countyOrDistrict') }}
                            <span class="text-red-500">*</span></label
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
                            >{{ t('formDemo.wardOrCommune') }}
                            <span class="text-red-500">*</span></label
                          >
                          <el-select
                            v-model="valueCommune"
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
                            >{{ t('formDemo.detailedAddress') }}
                            <span class="text-red-500">*</span></label
                          >
                          <el-select
                            v-model="enterdetailAddress"
                            style="width: 96%"
                            class="m-2 fix-full-width"
                            :placeholder="t('formDemo.enterDetailAddress')"
                            clearable
                            filterable
                            allow-create
                          >
                            <el-option
                              v-for="item in street"
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
                            class="w-[150px]"
                            type="primary"
                            @click="dialogFormVisible = false"
                            >{{ t('reuse.save') }}</el-button
                          >
                          <el-button class="w-[150px]" @click="dialogFormVisible = false">{{
                            t('reuse.exit')
                          }}</el-button>
                        </span>
                      </template>
                    </el-dialog>
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
        title="Warning"
        width="35%"
        align-center
        class="z-50"
      >
        <el-divider />
        <div>
          <div class="flex items-center gap-3">
            <el-input
              style="width: 100%"
              v-model="input"
              :placeholder="t('formDemo.enterPromoCode')"
            />
            <el-button class="w-[150px] border-1 border-blue-500" plain>{{
              t('formDemo.apply')
            }}</el-button>
          </div>
          <div class="bg-[#F4F8FD] mt-2 mb-4">
            <div class="ml-2 text-blue-500">FGF3443D</div>
            <div class="ml-2 text-blue-500">Giảm giá 60% đơn hàng ...</div>
            <div class="ml-2 text-blue-500">Áp dụng cho đơn hàng từ 300k</div>
          </div>
          <div class="flex items-center">
            <h2 class="font-bold text-base w-[40%]">Hoặc chọn mã có sẵn</h2>
            <el-divider />
          </div>
          <el-table :data="promoTable" border :loading="promoLoading">
            <el-table-column prop="radio" width="90" align="center">
              <template #default="props">
                <el-radio-group v-model="initialRadio" class="ml-4 fix-label-color">
                  <el-radio :label="props.row.radio" />
                </el-radio-group>
              </template>
            </el-table-column>
            <el-table-column prop="name" />
            <el-table-column prop="discount" width="120" align="left" />
          </el-table>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button class="w-[150px]" type="primary" @click="openDialogChoosePromotion = false"
              >{{ t('reuse.save') }}
            </el-button>
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
            prop="productManagementCode"
            :label="t('formDemo.productManagementCode')"
            width="150"
          >
            <template #default="props">
              <div v-if="type == 'detail'">
                {{ props.row.productManagementCode }}
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
                  <div class="block h-1 w-[100%] border-top-1 pb-2"></div>
                  <div class="text-base text-blue-400 cursor-pointer pl-2" @click="addnewproduct"
                    >+ {{ t('formDemo.quicklyAddProducts') }}</div
                  >
                </template></MultipleOptionsBox
              >
            </template>
          </el-table-column>
          <el-table-column prop="name" :label="t('formDemo.productInformation')" width="380" />
          <el-table-column :label="t('reuse.accessory')" width="180">
            <el-input v-model="input" :placeholder="`/${t('formDemo.selfImportAccessories')}/`" />
          </el-table-column>
          <el-table-column
            prop="rentalStartDate"
            :label="t('formDemo.rentalStartDate')"
            width="120"
          />
          <el-table-column prop="rentalEndDate" :label="t('formDemo.rentalEndDate')" width="120" />
          <el-table-column prop="quantity" :label="t('formDemo.rentalQuantity')" width="90" />
          <el-table-column prop="dram" :label="t('reuse.dram')" align="center" width="100" />
          <el-table-column
            prop="rentalUnitPrice"
            :label="t('formDemo.rentalUnitPrice')"
            align="right"
            width="180"
          />
          <el-table-column
            prop="rentalFee"
            :label="t('formDemo.rentalFee')"
            align="right"
            width="180"
          />
          <el-table-column
            prop="intoARentalDeposit"
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
            <div class="dark:text-[#fff]">4,000,000 đ</div>
            <div class="dark:text-[#fff] leading-8">-400,000 đ</div>
            <div class="dark:text-[#fff] text-transparent dark:text-transparent">s</div>
            <div class="text-black font-bold dark:text-[#fff]">3,600,000 đ</div>
            <div class="text-black font-bold dark:text-[#fff]">15,000,000 đ</div>
          </div>

          <div class="w-60">
            <div class="dark:text-[#fff] text-transparent dark:text-transparent">s</div>
            <div class="text-blue-500 cursor-pointer">FGF3443D | Giảm giá thuê 10% ... </div>
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
            <div class="flex items-center w-[100%]">
              <span
                class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-black dark:bg-transparent"
              ></span>
              <span class="box_2 text-[#FEB951] dark:text-black">
                {{ t('formDemo.browsePriceChanges') }}
                <span class="triangle-right_2"> </span>
              </span>
            </div>
          </div>
        </div>

        <div class="w-[100%] flex gap-2">
          <div class="w-[12%]"></div>
          <div class="w-[100%] flex ml-1 gap-4">
            <el-button class="min-w-42 min-h-11">{{
              t('formDemo.rentalFeePaymentSlip')
            }}</el-button>
            <el-button class="min-w-42 min-h-11">{{ t('formDemo.depositSlip') }}</el-button>
            <el-button @click="postData" type="primary" class="min-w-42 min-h-11">{{
              t('formDemo.saveAndPending')
            }}</el-button>
            <el-button type="danger" class="min-w-42 min-h-11">{{
              t('button.cancelOrder')
            }}</el-button>
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
            <template #default="scope">
              <el-button @click.prevent="deleteRowDebtTable(scope.$index)">{{
                t('reuse.detail')
              }}</el-button>
            </template>
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
                <div class="text-blue-500 cursor-pointer">{{ props.row.inventoryStatus }} </div>
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
  border: 1px solid #ccc;
  background-color: #ccc;
  position: relative;
  display: flex;
  width: fit-content;
  align-items: center;
}

.box_2 {
  padding: 0 10px 0 20px;
  border: 1px solid #fff0d9;
  background-color: #fff0d9;
  position: relative;
  display: flex;
  width: fit-content;
  align-items: center;
}

.triangle-right_2 {
  position: absolute;
  right: -12px;
  width: 0;
  height: 0;
  border-top: 13px solid transparent;
  border-bottom: 12px solid transparent;
  border-left: 11px solid #fff0d9;
}

.triangle-left {
  position: absolute;
  z-index: 1998;
  width: 0;
  height: 0;
}
.triangle-right {
  position: absolute;
  right: -11px;
  width: 0;
  height: 0;
  border-top: 13px solid transparent;
  border-bottom: 13px solid transparent;
  border-left: 10px solid #ccc;
}

::v-deep(.el-table td.el-table__cell div) {
  width: 100%;
}

::v-deep(.el-table) {
  z-index: 0;
}
</style>
