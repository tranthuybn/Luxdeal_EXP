<script setup lang="ts">
import { onBeforeMount, onMounted, reactive, ref, unref } from 'vue'
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
  ElDialog,
  ElDatePicker,
  FormRules,
  ElForm,
  ElTreeSelect,
  ElFormItem,
  FormInstance,
  UploadUserFile
} from 'element-plus'
import MultipleOptionsBox from '@/components/MultipleOptionsBox.vue'
import liquidationContractPrint from '../../Components/formPrint/src/liquidationContractPrint.vue'
import type { UploadFile } from 'element-plus'
import { FORM_IMAGES } from '@/utils/format'

import ProductAttribute from '../../ProductsAndServices/ProductLibrary/ProductAttribute.vue'
import {
  getProductsList,
  getCollaboratorsInOrderList,
  getAllCustomer,
  addNewSpaOrders,
  getSellOrderList,
  getOrderTransaction,
  createQuickProduct,
  getproductId,
  getCheckProduct
} from '@/api/Business'
import { useIcon } from '@/hooks/web/useIcon'
import { Collapse } from '../../Components/Type'
import moment from 'moment'
import { getCity, getDistrict, getWard } from '@/utils/Get_Address'
import { useRoute, useRouter } from 'vue-router'
import { PRODUCTS_AND_SERVICES } from '@/utils/API.Variables'
import { getCategories } from '@/api/LibraryAndSetting'
const { t } = useI18n()

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

const codeProducts = [
  {
    value: '1',
    label: 'SPB34653'
  }
]

// handle input
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
const optionsPawnTerm = [
  {
    value: 'payBeforeOneTime',
    label: 'Trả trước một lần'
  },
  {
    value: 'payLaterOneTime',
    label: 'Trả sau một lần'
  },
  {
    value: 'byDate',
    label: 'Theo ngày'
  },
  {
    value: 'byWeek',
    label: 'Theo tuần'
  },
  {
    value: 'Monthly',
    label: 'Theo tháng'
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
// tạo đơn hàng
// const { push } = useRouter()
const router = useRouter()
const id = Number(router.currentRoute.value.params.id)
// const type = String(router.currentRoute.value.params.type)
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
  quantity: number | undefined
  accessory: string | undefined
  unitName: string
  price: string | number | undefined
  finalPrice: string
  paymentType: string
  edited: boolean
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
  quantity: 1,
  accessory: '',
  unitName: 'Cái',
  price: '',
  finalPrice: '',
  paymentType: '',
  edited: true
})

let ListOfProductsForSale = ref<Array<ListOfProductsForSaleType>>([])

const addLastIndexSellTable = () => {
  ListOfProductsForSale.value.push({ ...productForSale })
}
// const forceRemove = ref(false)

//add row to the end of table if fill all table
// watch(
//   () => ListOfProductsForSale,
//   () => {
//     if (
//       ListOfProductsForSale.value[ListOfProductsForSale.value.length - 1].productPropertyId &&
//       ListOfProductsForSale.value[ListOfProductsForSale.value.length - 1].accessory &&
//       ListOfProductsForSale.value[ListOfProductsForSale.value.length - 1].quantity &&
//       ListOfProductsForSale.value[ListOfProductsForSale.value.length - 1].productName &&
//       forceRemove.value == false &&
//       type !== 'detail'
//     ) {
//       addLastIndexSellTable()
//     }
//   },
//   { deep: true }
// )
// total order
let totalOrder = ref(0)
let dataEdit = ref()

const ListFileUpload = ref<UploadUserFile[]>([])
// const Files = ListFileUpload.value.map((file) => file.raw).filter((file) => file !== undefined)
// const handleChange: UploadProps['onChange'] = async (_uploadFile, uploadFiles) => {
//   ListFileUpload.value = uploadFiles
// }
const removeListProductsSale = (index) => {
  if (!ListOfProductsForSale[ListOfProductsForSale.value.length - 1]) {
    ListOfProductsForSale.value.splice(index, 1)
  }
}

const editData = async () => {
  if (type == 'detail') checkDisabled.value = true
  if (type == 'edit' || type == 'detail') {
    const res = await getSellOrderList({ Id: id, ServiceType: 5 })
    const transaction = await getOrderTransaction({ id: 10 })
    if (debtTable.value.length > 0) debtTable.value.splice(0, debtTable.value.length - 1)
    debtTable.value = transaction.data

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
    // debtTable.value.push({ ...addDebtTable })
  }
}

const valueClassify = ref('individual')
const optionsClassify = [
  {
    value: 'company',
    label: t('formDemo.company')
  },
  {
    value: 'individual',
    label: t('formDemo.individual')
  }
]

const loaiHinhValue = ref('')
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
const deliveryMethod = ref(chooseDelivery[0].value)
const dialogDepositSlip = ref(false)

const changeAddressCustomer = (data) => {
  if (data) {
    // customerAddress.value = optionsCustomerApi.value.find((e) => e.value == data)?.address ?? ''
    const result = optionsCustomerApi.value.find((e) => e.value == data)
    console.log('result: ', result)
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
  console.log('infoCompany: ', typeof infoCompany.taxCode)
}

const loaiHinh = [
  {
    value: 'xuatKho',
    label: 'Xuất trả'
  },
  {
    value: 'nhapKho',
    label: 'Nhập kho nội bộ'
  }
]

// Call api danh sách cộng tác viên
// const collaboratorsValue = ref()
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

// Call api danh sách khách hàng
// const customersValue = ref('')
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

// const checked1 = ref(true)
const checked2 = ref(false)
// const checked3 = ref(false)
// const checked4 = ref(false)
const dialogAddQuick = ref(false)

// const checked7 = ref(false)

const input = ref('')

const historyTable = [
  {
    name: 'Droplist & chỉ lấy sản phẩm trong danh sách sản phẩm bán của đơn này',
    quantity: '//',
    unitPrice: '//',
    intoMoney: '//'
  }
]

function printPage(id: string, { url, title, w, h }) {
  // const prtHtml = document.getElementById(id)?.innerHTML

  let stylesHtml = ''
  for (const node of [...document.querySelectorAll('link[rel="stylesheet"], style')]) {
    stylesHtml += node.outerHTML
  }
  // const WinPrint = window.open(
  //   '',
  //   '',
  //   'left=0,top=0,width=800px,height=1123px,toolbar=0,scrollbars=0,status=0'
  // )
  // WinPrint?.document.write(`<!DOCTYPE html>
  //               <html>
  //                 <head>
  //                   ${stylesHtml}
  //                 </head>
  //                 <body style="overflow-y: scroll">
  //                   ${prtHtml}
  //                 </body>
  //               </html>`)

  //get content need to print
  const printContents = document.getElementById(id)?.innerHTML
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
const dialogFormVisible = ref(false)

let checkValidateForm = ref(false)
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
      checkValidateForm.value = true
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
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
  pawnTerm: [],
  paymentPeriod: '',
  collaboratorCommission: '',
  orderNotes: '',
  customerName: '',
  delivery: ''
})

//[{"ProductPropertyId":2,"Quantity":1,"ProductPrice":10000,"SoldPrice":10000,"WarehouseId":1,"SpaServiceIds":"47,48","Accessory":"Accessory1"}]

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
  pawnTerm: [
    {
      type: 'date',
      required: true,
      message: 'Please pick a date',
      trigger: 'change'
    }
  ],
  paymentPeriod: [
    {
      required: true,
      message: 'Please pick a date',
      trigger: 'change'
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
const value4 = ref('')
const checkDisabled = ref(false)
const postData = () => {
  // let productPayment = reactive<
  //   Array<{
  //     productPropertyId: number | string
  //     quantity: Number
  //     ProductPrice: Number
  //     SoldPrice: Number
  //     warehouseId: Number
  //     isPaid: Boolean
  //     accessory: String
  //   }>
  // >([])
  submitForm(ruleFormRef.value, ruleFormRef2.value)
  if (checkValidateForm.value) {
    const productPayment = JSON.stringify([
      {
        ProductPropertyId: 2,
        Quantity: 1,
        ProductPrice: 10000,
        SoldPrice: 10000,
        WarehouseId: 1,
        IsPaid: true,
        Accessory: 'Accessory1'
      },
      {
        ProductPropertyId: 3,
        Quantity: 1,
        ProductPrice: 90000,
        SoldPrice: 80000,
        WarehouseId: 1,
        IsPaid: true,
        Accessory: 'Accessory2'
      }
    ])
    // if (ListOfProductsForSale.length > 0) {
    // ListOfProductsForSale.forEach((element) => {
    // if (element && Array.isArray(element) && element.length > 0)
    // element.forEach(() => {
    // productPayment.push(
    //   // {
    //   //   ProductPropertyId: 2,
    //   //   Quantity: 1,
    //   //   ProductPrice: 10000,
    //   //   SoldPrice: 10000,
    //   //   WarehouseId: 1,
    //   //   IsPaid: true,
    //   //   Accessory: 'Accessory1'
    //   // },
    //   {
    //     ProductPropertyId: 3,
    //     Quantity: 1,
    //     ProductPrice: 90000,
    //     SoldPrice: 80000,
    //     WarehouseId: 1,
    //     IsPaid: true,
    //     Accessory: 'Accessory2'
    //   }
    // )
    // })
    // })
    // }

    const payload = {
      ServiceType: 4,
      OrderCode: ruleForm.orderCode,
      PromotionCode: 'AA12',
      CollaboratorId: ruleForm.collaborators,
      CollaboratorCommission: ruleForm.collaboratorCommission,
      Description: ruleForm.orderNotes,
      CustomerId: 2,
      DeliveryOptionId: 1,
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
    console.log('postData', payload)
    addNewSpaOrders(formDataPayLoad)
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

const handleChangeQuickAddProduct = async (data) => {
  console.log('data: ', data)

  const dataSelectedObj = listProducts.value.find((product) => product.productPropertyId == data)
  // quickProductName.value = dataSelectedObj.name
  console.log('dataSelectedObj: ', dataSelectedObj)

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
  console.log('data checked', data)
}

const district = ref()
const ward = ref()
const street = ref()

const cities = ref()

const callApiCity = async () => {
  cities.value = await getCity()
}

const CityChange = async (value) => {
  district.value = await getDistrict(value)
}

const districtChange = async (value) => {
  ward.value = await getWard(value)
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

const activeName = ref(collapse[0].name)
var curDate = 'DHxx' + moment().format('hhmmss')
const dialogBillLiquidation = ref(false)
onBeforeMount(() => {
  callCustomersApi()
  callApiCollaborators()
  callAPIProduct()
  callApiCity()

  if (type == 'add') {
    ruleForm.orderCode = curDate
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
      <!-- Dialog thêm nhanh khách hàng -->
      <el-dialog
        v-model="dialogAddQuick"
        width="40%"
        align-center
        :title="`${t('formDemo.QuicklyAddCustomers')}`"
      >
        <div v-if="valueClassify == 'company'">
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
              <el-input style="width: 100%" :placeholder="`${t('formDemo.enterCompanyName')}`" />
            </div>
            <div class="flex gap-4 pt-4 pb-4">
              <label class="w-[30%] text-right"
                >{{ t('formDemo.taxCode') }} <span class="text-red-500">*</span></label
              >
              <el-input style="width: 100%" :placeholder="`${t('formDemo.enterTaxCode')}`" />
            </div>
            <div class="flex gap-4 pt-4 pb-4">
              <label class="w-[30%] text-right">{{ t('formDemo.representative') }}</label>
              <el-input style="width: 100%" :placeholder="`${t('formDemo.enterRepresentative')}`" />
            </div>
            <div class="flex gap-4 pt-4 pb-4">
              <label class="w-[30%] text-right"
                >{{ t('reuse.phoneNumber') }} <span class="text-red-500">*</span></label
              >
              <el-input style="width: 100%" :placeholder="`${t('formDemo.enterPhoneNumber')}`" />
            </div>
            <div class="flex gap-4 pt-4 pb-4">
              <label class="w-[30%] text-right">{{ t('reuse.email') }}</label>
              <el-input style="width: 100%" :placeholder="`${t('formDemo.enterEmail')}`" />
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
              <el-input style="width: 100%" :placeholder="`${t('formDemo.enterCustomerName')}`" />
            </div>

            <div class="flex gap-4 pt-4 pb-4">
              <label class="w-[30%] text-right"
                >{{ t('reuse.phoneNumber') }} <span class="text-red-500">*</span></label
              >
              <el-input style="width: 100%" :placeholder="`${t('formDemo.enterPhoneNumber')}`" />
            </div>
            <div class="flex gap-4 pt-4 pb-4">
              <label class="w-[30%] text-right">{{ t('reuse.email') }}</label>
              <el-input style="width: 100%" :placeholder="`${t('formDemo.enterEmail')}`" />
            </div>
          </div>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button
              type="primary"
              class="w-[150px]"
              @click.stop.prevent="dialogAddQuick = false"
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
              label-width="180px"
              class="de,p-ruleForm"
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

              <el-form-item :label="t('formDemo.pawnFeePaymentTime')" prop="paymentPeriod">
                <el-select v-model="ruleForm.paymentPeriod" :placeholder="t('reuse.byDay')">
                  <el-option
                    v-for="i in optionsPawnTerm"
                    :key="i.value"
                    :label="i.label"
                    :value="i.value"
                  />
                </el-select>
              </el-form-item>

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
                            placeholder="Select"
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
                            placeholder="Select"
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
                            placeholder="Select"
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
                            placeholder="Select"
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
        <el-divider content-position="left">{{
          t('formDemo.listOfConsignmentProducts')
        }}</el-divider>
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
                :defaultValue="props.row.productPropertyCode"
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
          <el-table-column :label="t('reuse.quantitySold')" align="center" width="90" />
          <el-table-column :label="t('formDemo.numberOfTimesRented')" align="center" width="100" />
          <el-table-column :label="t('reuse.numberOfTimesSpa')" align="center" width="100" />
          <el-table-column :label="t('reuse.currentlyLeased')" align="center" width="100" />
          <el-table-column
            :label="`${t('reuse.quantityImportedInternalWarehouse')}`"
            align="center"
            width="100"
          />
          <el-table-column :label="`${t('reuse.returnedNumber')}`" align="center" width="100" />
          <el-table-column
            prop="dram"
            :label="`${t('reuse.dram')}`"
            align="center"
            min-width="100"
          />
          <el-table-column :label="`${t('reuse.pawnMoney')}`" align="center" width="100" />
          <el-table-column prop="intoMoney" :label="`${t('reuse.pawnfeeMoney')}`" width="200">
            <div class="flex w-[100%]">
              <div class="flex-1">200,000đ/1n</div>
              <div class="flex-1 text-right text-blue-500 cursor-pointer">
                + {{ t('reuse.fix') }}
              </div>
            </div>
          </el-table-column>
          <el-table-column :label="`${t('formDemo.intoMoneyPawn')}`" align="center" width="100" />
          <el-table-column :label="`${t('formDemo.businessManagement')}`" width="200">
            <div class="flex w-[100%]">
              <div class="flex-1">...</div>
              <div class="flex-1 text-right text-blue-500 cursor-pointer"
                >+ {{ t('router.business') }}</div
              >
            </div>
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

        <div class="w-[100%]">
          <el-divider content-position="left">{{ t('formDemo.statusAndManipulation') }}</el-divider>
        </div>
        <div class="flex gap-4 w-[100%] ml-1 items-center pb-3">
          <label class="w-[9%] text-right">{{ t('formDemo.orderStatus') }}</label>
          <div class="w-[84%] pl-1">
            <el-checkbox v-model="checked2" :label="t('reuse.closedTheOrder')" size="large" />
            <!-- <el-checkbox v-model="checked3" :label="t('formDemo.pawning')" size="large" />
            <el-checkbox v-model="checked4" :label="t('formDemo.renewingThePawn')" size="large" />

            <el-checkbox v-model="checked7" :label="`${t('common.doneLabel')}`" size="large" /> -->
          </div>
        </div>
        <div class="w-[100%] flex gap-4">
          <div class="ml-[10%] w-[100%] flex ml-1 gap-4">
            <el-button class="min-w-42 min-h-11" @click="dialogBillLiquidation = true">{{
              t('formDemo.printLiquidationContract')
            }}</el-button>
            <el-button class="min-w-42 min-h-11">{{ t('formDemo.billInterest') }}</el-button>
            <el-button @click="postData" type="primary" class="min-w-42 min-h-11">{{
              t('formDemo.saveAndPending')
            }}</el-button>
            <el-button type="danger" class="min-w-42 min-h-11">{{
              t('button.cancelOrder')
            }}</el-button>
          </div>
        </div>
      </el-collapse-item>

      <!-- phieu in -->
      <div id="billPawn">
        <slot>
          <liquidationContractPrint />
        </slot>
      </div>

      <!-- Dialog thông tin hợp đồng thanh lý-->
      <el-dialog
        v-model="dialogBillLiquidation"
        title="Thông tin hợp đồng thanh lý"
        class="font-bold"
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
              <liquidationContractPrint />
            </slot>
          </div>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button class="btn" @click="dialogBillLiquidation = false">{{
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
          /><el-table-column
            prop="certificateInformation"
            :label="t('formDemo.negotiablePrice')"
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
          <el-table-column prop="collected" :label="t('formDemo.collected')" align="left">
            <template #default="props">
              <div class="text-right">{{ props.row.collected }}</div>
            </template>
          </el-table-column>
          <el-table-column :label="t('formDemo.spent')" align="right">đ</el-table-column>
          <el-table-column
            prop="rentalFeeDebt"
            :label="`${t('reuse.outstandingDebt')}`"
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
          <el-divider content-position="left">{{ t('formDemo.importTrackingTable') }}</el-divider>
          <el-table :data="historyTable" border class="pl-4 dark:text-[#fff]">
            <el-table-column :label="`${t('formDemo.productManagementCode')}`" width="150">
              <el-select v-model="value4" class="m-2">
                <el-option
                  v-for="item in codeProducts"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-table-column>
            <el-table-column prop="name" :label="`${t('reuse.productInformation')}`" width="720" />
            <el-table-column :label="`${t('reuse.accessory')}`" width="180">
              <el-input
                :v-model="input"
                :placeholder="`/${t('formDemo.selfImportAccessories')}/`"
              />
            </el-table-column>
            <el-select v-model="loaiHinhValue" class="m-2">
              <el-option
                v-for="item in loaiHinh"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>

            <el-table-column :label="t('reuse.type')" align="center" width="120">
              <el-select v-model="loaiHinhValue" class="m-2">
                <el-option
                  v-for="item in loaiHinh"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-table-column>
            <el-table-column prop="quantity" :label="`${t('formDemo.amount')}`" width="120" />
            <el-table-column prop="quantity" :label="`${t('reuse.dram')}`" width="120" />

            <el-table-column
              :label="`${t('formDemo.deliveryNotesAndImport')}`"
              align="right"
              width="200"
              class="text-blue-500"
            >
              <div class="flex w-[100%]">
                <div class="flex-1 text-blue-500">XJDFAW43</div>
                <div class="flex-1 text-right text-blue-500 cursor-pointer"
                  >+ {{ t('reuse.fix') }}</div
                >
              </div>
            </el-table-column>
            <el-table-column :label="`${t('formDemo.manipulation')}`" align="center" width="180">
              <div class="flex gap-4">
                <el-button type="primary">{{ t('reuse.save') }}</el-button>
                <el-button type="danger">{{ t('reuse.delete') }}</el-button>
              </div>
            </el-table-column>
          </el-table>
          <button class="bg-none border-1 pt-2 pb-2 pl-4 pr-4 mt-2 text-[#cccccc]">+ Thêm</button>
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
