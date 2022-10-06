<script setup lang="ts">
import { reactive, ref, watch, onBeforeMount, unref } from 'vue'
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
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElDatePicker,
  ElForm,
  ElFormItem,
  FormRules,
  FormInstance
} from 'element-plus'
import type { UploadFile } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { useForm } from '@/hooks/web/useForm'
import { Form } from '@/components/Form'
import { Collapse } from '../../Components/Type'
import moment from 'moment'
import MultipleOptionsBox from '@/components/MultipleOptionsBox.vue'
import { useRouter } from 'vue-router'
import { FORM_IMAGES } from '@/utils/format'
import {
  getProductsList,
  getCollaboratorsInOrderList,
  getPromotionsList,
  getAllCustomer,
  getSpaList,
  addNewSpaOrders
} from '@/api/Business'
import { useValidator } from '@/hooks/web/useValidator'
const { required, ValidService } = useValidator()

const { t } = useI18n()

const schema = reactive<FormSchema[]>([
  {
    field: 'orderInformation',
    label: t('formDemo.orderInformation'),
    component: 'Divider',
    colProps: {
      span: 12
    }
  },
  {
    field: 'orderCode',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('formDemo.enterOrderCode')
    }
  },
  {
    field: 'deliveryDate',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placehoder: t('formDemo.enterDate')
    }
  },
  {
    field: 'collaborators',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('formDemo.selectOrEnterTheCollaboratorCode')
    }
  },
  {
    field: 'orderNotes',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('formDemo.addNotes')
    }
  }
])

const newList = reactive<FormSchema[]>([
  {
    field: 'customer',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'customerName',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'debtAndAddress',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'companyInformation',
    component: 'Input',
    colProps: {
      span: 12
    }
  }
])
// const addIcon = useIcon({ icon: 'uil:plus' })
const viewIcon = useIcon({ icon: 'uil:search' })
const deleteIcon = useIcon({ icon: 'uil:trash-alt' })
const percentIcon = useIcon({ icon: 'material-symbols:percent' })

const { register } = useForm()

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

const choosePayment = [
  {
    value: 'cashPayment',
    label: t('formDemo.cashPayment')
  },
  {
    value: 'cardPayment',
    label: t('formDemo.cardPayment')
  }
]

const radio1 = ref('')

const input = ref('')

interface ListOfProductsForSaleType {
  name: string
  productCode: string
  id: string
  code: string
  quantity: number | undefined
  selfImportAccessories: string | undefined
  dram: string
  unitPrice: string
  intoMoney: string
  paymentType: string
  alreadyPaidForTt: string
  edited: boolean
}

// interface spaOdersInfo {
//   name: string
//   productCode: string
//   id: string
//   code: string
//   customerInfo: string | undefined
//   dram: string
//   unitPrice: string
//   intoMoney: string
//   paymentType: string
//   alreadyPaidForTt: string
// }

const ListOfProductsForSale = reactive<Array<ListOfProductsForSaleType>>([
  {
    name: '',
    productCode: '',
    id: '',
    code: '',
    quantity: 1,
    selfImportAccessories: '',
    dram: t('formDemo.psc'),
    unitPrice: 'đ',
    intoMoney: 'đ',
    paymentType: '',
    alreadyPaidForTt: '',
    edited: true
  }
])
const tableData2 = [
  {
    name: '',
    quantity: '',
    unitPrice: '',
    intoMoney: ''
  }
]

onBeforeMount(() => {
  callCustomersApi()
  callApiCollaborators()
  callApiProductList()
})

const historyTable = ref([
  {
    name: 'Droplist & chỉ lấy sản phẩm trong danh sách sản phẩm bán của đơn này',
    quantity: '',
    unit: t('formDemo.psc')
  }
])

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

//add row table
const deleteRowDebtTable = (index: number) => {
  debtTable.value.splice(index, 1)
}

const onAddHistoryTableItem = () => {
  historyTable.value.push({
    name: '',
    quantity: '',
    unit: t('formDemo.psc')
  })
}
const deleteRow = (index: number) => {
  historyTable.value.splice(index, 1)
}
// Dialog change address

const dialogFormVisible = ref(false)
const dialogAddQuick = ref(false)
const openDialogChooseWarehouse = ref(false)
const openDialogChoosePromotion = ref(false)
const valueProvince = ref('')
const valueDistrict = ref('')
const valueCommune = ref('')
const province = [
  {
    value: 'HN',
    label: 'HN'
  },
  {
    value: 'TP.HCM',
    label: 'TP.HCM'
  },
  {
    value: 'ĐN',
    label: 'ĐN'
  },
  {
    value: 'Vinh',
    label: 'Vinh'
  },
  {
    value: 'Nha Trang',
    label: 'Nha Trang'
  }
]
const district = [
  {
    value: 'Thanh Xuan',
    label: 'Thanh Xuan'
  },
  {
    value: 'Hai Ba Trung',
    label: 'Hai Ba Trung'
  },
  {
    value: 'Dong Da',
    label: 'Dong Da'
  },
  {
    value: 'Vinh',
    label: 'Vinh'
  },
  {
    value: 'Nha Trang',
    label: 'Nha Trang'
  }
]
const enterdetailAddress = ref('')
const tableWarehouse = [
  {
    warehouseCheckbox: '',
    name: 'Kho Hà Nội',
    address: ''
  },
  {
    warehouseCheckbox: '',
    name: 'Kho Hồ Chí Minh',
    address: ''
  }
]

// const checkDiscount = ref(false)

// handle input
interface tableDataType {
  dateOfPayment: string
  col: number
  content: string
  collected: string
  spent: string
  salesDebt: string
  edited: boolean
  paymentType: string
}
const debtTable = ref<Array<tableDataType>>([
  {
    dateOfPayment: moment().format('L').toString(),
    col: 1,
    content: '',
    collected: '',
    spent: '',
    salesDebt: '',
    edited: true,
    paymentType: ''
  }
])

const onAddDebtTableItem = () => {
  debtTable.value.push({
    dateOfPayment: moment().format('L').toString(),
    col: 1,
    content: '',
    collected: '',
    spent: '',
    salesDebt: '',
    edited: true,
    paymentType: ''
  })
}

const radioVAT = ref(false)

// Call api danh sách khách hàng
let customerAddress = ref('')

const customersValue = ref('')
const optionsCustomerApi = ref<Array<any>>([])
let optionCallCustomerAPi = 0
const callCustomersApi = async () => {
  if (optionCallCustomerAPi == 0) {
    const res = await getAllCustomer({ PageIndex: 1, PageSize: 20 })
    const getCustomerResult = res.data
    console.log('getCustomerResult', getCustomerResult)
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

let infoCompany = reactive({
  name: '',
  taxCode: '',
  phone: '',
  email: ''
})
const valueDate = ref('')
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

// Call api danh sách sản phẩm
let listProductsTable = ref()
const listProducts = ref()
const optionsApi = ref()

let optionCallAPi = 0
const callApiProductList = async () => {
  if (optionCallAPi == 0) {
    const res = await getProductsList({ ProductId: 1 })
    listProducts.value = res.data
    optionsApi.value = listProducts.value.map((product) => ({
      label: product.id.toString(),
      value: product.id.toString(),
      name: product.name,
      price: product.price.toString()
    }))
    optionCallAPi++
    listProductsTable.value = optionsApi.value
  }
}

const changeName = (optionID, scope) => {
  const option = optionsApi.value.find((option) => option.name == optionID)
  scope.row.name = option.name
  scope.row.unitPrice = option.price
  scope.row.intoMoney = (parseInt(scope.row.quantity) * parseInt(scope.row.unitPrice)).toString()
}

const handleTotal = (scope) => {
  scope.row.intoMoney = (parseInt(scope.row.quantity) * parseInt(scope.row.unitPrice)).toString()
}

// Call api danh sách cộng tác viên
const collaboratorsValue = ref()
const listCollaborators = ref()
const optionsCollaborators = ref()
let optionCallCollaborators = 0
const callApiCollaborators = async () => {
  if (optionCallCollaborators == 0) {
    const res = await getCollaboratorsInOrderList('')
    listCollaborators.value = res.data
    console.log('api', listCollaborators)

    optionsCollaborators.value = listCollaborators.value.map((product) => ({
      label: product.name,
      value: product.id
    }))
  }
  optionCallCollaborators++
}

// Call api danh sách mã giảm giá
let promoTable = ref()
const promoLoading = ref(true)
const listPromotions = ref()
const optionPromotions = ref()
let optionCallPromoAPi = 0
const callPromoApi = async () => {
  if (optionCallPromoAPi == 0) {
    const res = await getPromotionsList('')
    listPromotions.value = res.data
    optionPromotions.value = listPromotions.value.map((product) => ({
      radio: '',
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

// api Spa

let callApiTable = ref()
const listServicesSpa = ref()
const optionsApiServicesSpa = ref()
let optionCallAPiServicesSpa = 0
const callApiServicesSpa = async () => {
  if (optionCallAPiServicesSpa == 0) {
    const res = await getSpaList('')
    listServicesSpa.value = res.data

    optionsApiServicesSpa.value = listServicesSpa.value.map((product) => ({
      id: product.id,
      value: product.cost,
      name: product.name
    }))
    optionCallAPiServicesSpa++
    console.log('optionsApi', optionsApiServicesSpa.value)
  }
  callApiTable.value = optionsApiServicesSpa.value
  console.log('table: ', callApiTable.value)
}
onBeforeMount(() => {
  callApiServicesSpa()
})

const checked1 = ref(true)

// phân loại khách hàng: 1: công ty, 2: cá nhân
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
// select khách hàng
const valueSelectCustomer = ref(t('formDemo.customer'))
const optionsCustomer = [
  {
    value: 'customer',
    label: t('formDemo.customer')
  }
]

const forceRemove = ref(false)
const addLastIndexSellTable = () => {
  ListOfProductsForSale.push({
    name: '',
    productCode: '',
    id: '',
    code: '',
    quantity: undefined,
    selfImportAccessories: undefined,
    dram: t('formDemo.psc'),
    unitPrice: 'đ',
    intoMoney: 'đ',
    paymentType: '',
    alreadyPaidForTt: '',
    edited: true
  })
}

//add row to the end of table if fill all table
watch(
  () => ListOfProductsForSale[ListOfProductsForSale.length - 1],
  () => {
    if (
      ListOfProductsForSale[ListOfProductsForSale.length - 1].selfImportAccessories !== undefined &&
      ListOfProductsForSale[ListOfProductsForSale.length - 1].name !== undefined &&
      ListOfProductsForSale[ListOfProductsForSale.length - 1].quantity !== undefined &&
      forceRemove.value == false
    ) {
      addLastIndexSellTable()
    }
  },
  { deep: true }
)

const removeListProductsSale = (index) => {
  if (ListOfProductsForSale[ListOfProductsForSale.length - 1].selfImportAccessories == undefined) {
    forceRemove.value = true
    console.log('index:', index)
    ListOfProductsForSale.splice(index, 1)
  }
}
const dialogFormSettingServiceSpa = ref(false)

//lay du lieu tu router
// const router = useRouter()
// const id = Number(router.currentRoute.value.params.id)
// const type = String(router.currentRoute.value.params.type)
const collaboratorCommission = ref('')
// // post data form

// const postData = () => {
//   const payload = {
//     ServiceType: 5,
//     OrderCode: inputCode.value,
//     PromotionCode: 'test',
//     deliveryDate: valueDate.value,
//     CollaboratorId: collaboratorsValue.value,
//     CollaboratorCommission: CollaboratorCommission.value,
//     Description: 'desc',
//     CustomerId: 1,
//     DeliveryOptionId: 1,
//     ProvinceId: 1,
//     DistrictId: 3,
//     WardId: 2,
//     Address: 'HN',
//     OrderDetail: {
//       productPropertyId: 2,
//       quantity: 1,
//       warehouseId: 6,
//       isPaid: true,
//       accessory: 'Dây túi xách'
//     },
//     CampaignId: 1,
//     VAT: 2,
//     Status: 1
//   }
//   const formDataPayload = FORM_IMAGES(payload)
//   addNewSpaOrders(formDataPayload)
//   console.log('pay', payload)
//   addNewSpaOrders(payload)
// }

// tạo đơn hàng

const inputDiscount = ref()
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

  const inputCode = ref('DHB039423')

  const payload = {
    ServiceType: 1,
    OrderCode: inputCode.value,
    PromotionCode: 'AA12',
    CollaboratorId: 1,
    CollaboratorCommission: inputDiscount.value,
    Description: 'sadasd',
    CustomerId: 2,
    DeliveryOptionId: 1,
    ProvinceId: 1,
    DistrictId: 1,
    WardId: 1,
    Address: 'trieu khuc',
    OrderDetail: productPayment,
    CampaignId: 2,
    VAT: 1
  }
  const formDataPayLoad = FORM_IMAGES(payload)
  console.log('postData', payload)
  addNewSpaOrders(formDataPayLoad)
}

interface User {
  date: string
  name: string
  address: string
}
const multipleSelection = ref<User[]>([])
const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val
}

const form = reactive({
  name: '',
  typea: '',
  phoneNumber: '',
  email: ''
})

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

const ruleFormRef = ref<FormInstance>()

const ruleForm = reactive({
  name: 'MS53623',
  collaborators: '',
  collaboratorCommission: '',
  orderNotes: '',
  customersValue: '',
  count: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: ''
})

const rules = reactive<FormRules>({
  name: [{ required: true, message: 'Please input Activity name', trigger: 'blur' }],
  collaborators: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
    { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
  ],
  collaboratorCommission: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
    { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
  ],
  orderNotes: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
    { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
  ],
  count: [
    {
      required: true,
      message: 'Please select Activity count',
      trigger: 'change'
    }
  ],
  customersValue: [
    {
      required: true,
      message: 'Please select Activity count',
      trigger: 'change'
    }
  ],
  date1: [
    {
      type: 'date',
      required: true,
      message: 'Please pick a date',
      trigger: 'change'
    }
  ],
  date2: [
    {
      type: 'date',
      required: true,
      message: 'Please pick a time',
      trigger: 'change'
    }
  ],
  type: [
    {
      type: 'array',
      required: true,
      message: 'Please select at least one activity type',
      trigger: 'change'
    }
  ],
  resource: [
    {
      required: true,
      message: 'Please select activity resource',
      trigger: 'change'
    }
  ],
  desc: [{ required: true, message: 'Please input activity form', trigger: 'blur' }]
})

const deliveryMethod = ref(chooseDelivery[0].value)
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
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
              label-width="165px"
              class="demo-ruleForm"
              status-icon
            >
              <el-divider content-position="left">{{ t('formDemo.orderInformation') }}</el-divider>
              <el-button @click="submitForm(ruleFormRef)">fawf</el-button>
              <el-form-item :label="t('formDemo.orderCode')" prop="name">
                <el-input
                  v-model="ruleForm.name"
                  style="width: 100%"
                  :placeholder="t('formDemo.enterOrderCode')"
                />
              </el-form-item>

              <el-form-item :label="t('formDemo.deliveryDate')" prop="date1" required>
                <div class="custom-date">
                  <el-date-picker
                    v-model="ruleForm.date1"
                    type="date"
                    format="DD/MM/YYYY"
                    :placeholder="t('formDemo.returnDate')"
                    style="width: 100%"
                  />
                </div>
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
                <div class="text-right text-[#FECB80] italic">{{
                  t('formDemo.lessThanTenProfiles')
                }}</div>
              </div>
              <div class="pl-4">
                <el-upload
                  action="#"
                  list-type="picture-card"
                  :auto-upload="false"
                  class="relative"
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
                          <ElButton :icon="deleteIcon" />
                        </span>
                      </span>
                    </div>
                  </template>
                  <el-dialog v-model="dialogVisible" class="absolute">
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
              ref="ruleFormRef"
              :model="ruleForm"
              :rules="rules"
              label-width="165px"
              class="demo-ruleForm"
              status-icon
            >
              <div class="flex w-[100%] gap-8">
                <el-divider content-position="left">{{ t('formDemo.customer') }}</el-divider>
                <el-divider content-position="left">{{
                  t('formDemo.methodOfDeliverySpa')
                }}</el-divider>
              </div>

              <el-form-item :label="t('formDemo.chooseACustomer')" prop="customersValue">
                <div class="flex gap-6">
                  <div class="flex w-[50%]">
                    <div class="flex w-[100%] gap-4 items-center">
                      <div class="flex items-center w-[79%] gap-4">
                        <div class="flex w-[100%] gap-2 bg-transparent">
                          <el-select
                            v-model="ruleForm.customersValue"
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
                              <label class="w-[30%] text-right max-w-[162.73px]">{{
                                t('formDemo.classify')
                              }}</label>
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
                              <label class="w-[30%] text-right">{{
                                t('formDemo.companyName')
                              }}</label>
                              <el-input
                                style="width: 100%"
                                :placeholder="`${t('formDemo.enterCompanyName')}`"
                              />
                            </div>
                            <div class="flex gap-4 pt-4 pb-4">
                              <label class="w-[30%] text-right">{{ t('formDemo.taxCode') }}</label>
                              <el-input
                                style="width: 100%"
                                :placeholder="`${t('formDemo.enterTaxCode')}`"
                              />
                            </div>
                            <div class="flex gap-4 pt-4 pb-4">
                              <label class="w-[30%] text-right">{{
                                t('formDemo.representative')
                              }}</label>
                              <el-input
                                style="width: 100%"
                                :placeholder="`${t('formDemo.enterRepresentative')}`"
                              />
                            </div>
                            <div class="flex gap-4 pt-4 pb-4">
                              <label class="w-[30%] text-right">{{ t('formDemo.taxCode') }}</label>
                              <el-input
                                style="width: 100%"
                                :placeholder="`${t('formDemo.enterTaxCode')}`"
                              />
                            </div>
                            <div class="flex gap-4 pt-4 pb-4">
                              <label class="w-[30%] text-right">{{
                                t('formDemo.representative')
                              }}</label>
                              <el-input
                                style="width: 100%"
                                :placeholder="`${t('formDemo.enterRepresentative')}`"
                              />
                            </div>
                          </div>
                        </div>
                        <div v-else>
                          <el-divider />
                          <div>
                            <div class="flex gap-4 pt-4 pb-4 items-center">
                              <label class="w-[30%] text-right max-w-[162.73px]">{{
                                t('formDemo.classify')
                              }}</label>
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
                              <label class="w-[30%] text-right">{{ t('reuse.phoneNumber') }}</label>
                              <el-input
                                style="width: 100%"
                                :placeholder="`${t('formDemo.enterPhoneNumber')}`"
                              />
                            </div>

                            <div class="flex gap-4 pt-4 pb-4">
                              <label class="w-[30%] text-right">{{ t('reuse.phoneNumber') }}</label>
                              <el-input
                                style="width: 100%"
                                :placeholder="`${t('formDemo.enterPhoneNumber')}`"
                              />
                            </div>
                            <div class="flex gap-4 pt-4 pb-4">
                              <label class="w-[30%] text-right">{{ t('reuse.email') }}</label>
                              <el-input
                                style="width: 100%"
                                :placeholder="`${t('formDemo.enterEmail')}`"
                              />
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
                            <el-button
                              class="w-[150px]"
                              @click.stop.prevent="dialogAddQuick = false"
                              >{{ t('reuse.exit') }}</el-button
                            >
                          </span>
                        </template>
                      </el-dialog>
                    </div>
                  </div>
                  <div class="flex w-[50%] max-h-[42px]">
                    <div class="flex w-[100%] gap-4">
                      <label class="w-[20%] text-right ml-2">{{
                        t('formDemo.chooseShipping')
                      }}</label>
                      <el-select
                        v-model="deliveryMethod"
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
                </div>
              </el-form-item>

              <div class="flex w-[100%] gap-6">
                <div class="w-[50%] pl-[8%]">
                  <p
                    v-if="customersValue !== ''"
                    class="max-w-[698.39px] bg-[#F4F8FD] ml-3 pl-2 text-blue-500 dark:bg-[#3B3B3B]"
                    >{{ t('formDemo.noDebt') }}</p
                  >
                </div>
                <div class="flex w-[50%] gap-4" v-if="customersValue !== ''">
                  <p class="w-[16%] ml-2 text-[#828387] text-right">{{
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
                          <label class="w-[25%] text-right">{{
                            t('formDemo.provinceOrCity')
                          }}</label>
                          <el-select
                            v-model="valueProvince"
                            style="width: 96%"
                            class="m-2 fix-full-width"
                            placeholder="Select"
                          >
                            <el-option
                              v-for="item in province"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            />
                          </el-select>
                        </div>
                        <div class="flex w-[100%] gap-4 items-center">
                          <label class="w-[25%] text-right">{{
                            t('formDemo.countyOrDistrict')
                          }}</label>
                          <el-select
                            v-model="valueDistrict"
                            style="width: 96%"
                            class="m-2 fix-full-width"
                            placeholder="Select"
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
                          <label class="w-[25%] text-right">{{
                            t('formDemo.wardOrCommune')
                          }}</label>
                          <el-select
                            v-model="valueCommune"
                            style="width: 96%"
                            class="m-2 fix-full-width"
                            placeholder="Select"
                          >
                            <el-option
                              v-for="item in choosePayment"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            />
                          </el-select>
                        </div>
                        <div class="flex w-[100%] gap-4 items-center">
                          <label class="w-[25%] text-right">{{
                            t('formDemo.detailedAddress')
                          }}</label>
                          <el-input
                            v-model="enterdetailAddress"
                            class="m-2 fix-full-width"
                            style="width: 96%"
                            placeholder="Please input"
                          />
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

              <el-form-item :label="t('reuse.customerInfo')">
                <div class="w-[100%]" v-if="customersValue !== ''">
                  <div class="leading-6 mt-2">
                    <div>nguyễn phương linh</div>
                    <div>Số điện thoại: 094345355</div>
                    <div>Email: info@baca.com</div>
                  </div>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-collapse-item>

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
              <el-checkbox v-model="props.row.warehouseCheckbox" size="large" />
            </template>
          </el-table-column>
          <el-table-column prop="name" :label="t('formDemo.warehouseInformation')" width="360" />
          <el-table-column :label="t('reuse.inventory')">
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
          <div class="bg-[#F4F8FD] mt-2 mb-4 dark:bg-transparent">
            <div class="ml-2 text-blue-500">FGF3443D</div>
            <div class="ml-2 text-blue-500">Giảm giá 60% đơn hàng ...</div>
            <div class="ml-2 text-blue-500">Áp dụng cho đơn hàng từ 300k</div>
          </div>
          <div class="flex items-center">
            <h2 class="font-bold text-base w-[40%]">Hoặc chọn mã có sẵn</h2>
            <el-divider />
          </div>
          <el-table :data="promoTable" border :loading="promoLoading">
            <el-table-column width="50" prop="value" label-class-name="noHeader" align="center">
              <template #default="data">
                <el-radio-group v-model="data.row.radio" class="ml-4">
                  <el-radio label="1" size="large" />
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
        <el-divider content-position="left">{{ t('formDemo.listProductSpa') }}</el-divider>
        <el-table
          :data="ListOfProductsForSale"
          border
          :class="[
            'bg-[var(--el-color-white)] dark:(bg-[var(--el-color-black)] border-[var(--el-border-color)] border-1px)'
          ]"
        >
          <el-table-column
            :label="`${t('formDemo.productManagementCode')}`"
            min-width="250"
            prop="code"
          >
            <template #default="props">
              <MultipleOptionsBox
                :fields="[
                  t('reuse.productCode'),
                  t('reuse.managementCode'),
                  t('formDemo.productInformation')
                ]"
                filterable
                :items="listProductsTable"
                :valueKey="'name'"
                :labelKey="'id'"
                :hiddenKey="['id']"
                :placeHolder="'Chọn mã sản phẩm'"
                @focus="callApiProductList()"
                :clearable="false"
                @change="(option) => changeName(option, props)"
              />
            </template>
          </el-table-column>

          <el-table-column prop="name" :label="t('formDemo.productInformation')" min-width="400" />
          <el-table-column prop="selfImportAccessories" :label="t('reuse.accessory')" width="180">
            <template #default="data">
              <el-input
                class="max-w-[150px]"
                v-model="data.row.selfImportAccessories"
                :placeholder="`/${t('formDemo.selfImportAccessories')}/`"
              />
            </template>
          </el-table-column>
          <el-table-column :label="t('router.ServiceLibrarySpaService')" width="230">
            <div class="flex w-[100%] items-center text-center">
              <div class="flex-1">Kiểm tra</div>
              <div class="flex-1 text-right text-blue-500 cursor-pointer">
                <el-button text border @click="dialogFormSettingServiceSpa = true"
                  ><span class="text-blue-500">+ {{ t('reuse.selectService') }}</span></el-button
                ></div
              >
            </div>
          </el-table-column>
          <el-table-column
            prop="quantity"
            :label="t('formDemo.numberOfSpa')"
            align="center"
            width="90"
          >
            <template #default="data">
              <el-input
                v-model="data.row.quantity"
                @change="handleTotal(data)"
                v-if="data.row.edited"
                style="width: 100%"
              />
            </template>
          </el-table-column>
          <el-table-column :label="t('formDemo.testOrSpa')" align="center" width="90" />
          <el-table-column :label="t('reuse.returnedNumber')" align="center" width="100" />
          <el-table-column
            prop="dram"
            :label="`${t('reuse.dram')}`"
            align="center"
            min-width="100"
          />

          <el-table-column
            prop="intoMoney"
            :label="t('formDemo.spaFeePayment')"
            align="right"
            width="150"
          />
          <el-table-column :label="`${t('reuse.importWarehouse')}`" min-width="200">
            <div class="flex w-[100%] items-center">
              <div class="flex-1">{{ t('reuse.stocking') }}</div>
              <div class="w-[60%]">
                <el-button text @click="openDialogChooseWarehouse = true">
                  <span class="text-blue-500"> + {{ t('formDemo.chooseWarehouse') }}</span>
                </el-button>
              </div>
            </div>
          </el-table-column>

          <el-table-column :label="`${t('formDemo.manipulation')}`" align="center" min-width="200">
            <template #default="scope">
              <!-- <button
                @click.prevent="removeListProductsSale(scope.$index)"
                class="bg-[#EA4F37] pt-2 pb-2 pl-4 pr-4 text-[#fff]"
                >Xóa</button
              > -->
              <div class="flex gap-2">
                <el-button plain>In tem</el-button>
                <el-button @click.prevent="removeListProductsSale(scope.$index)" type="danger">{{
                  t('reuse.delete')
                }}</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-table :data="tableData2" class="pl-4 dark:text-[#fff]">
          <el-table-column min-width="250" />
          <el-table-column min-width="680" />
          <el-table-column min-width="180" />
          <el-table-column min-width="90" />
          <el-table-column min-width="100" />
          <el-table-column align="right" min-width="180">
            <div class="dark:text-[#fff]">{{ t('formDemo.spaFeePayment') }}</div>
            <div class="text-blue-500 cursor-pointer">
              <el-button
                text
                @click="
                  () => {
                    openDialogChoosePromotion = true
                    callPromoApi()
                  }
                "
                style="padding: 0"
              >
                <span class="text-blue-500"> + {{ t('formDemo.choosePromotion') }}</span>
              </el-button>
            </div>
            <el-dropdown trigger="click">
              <span class="el-dropdown-link text-blue-500 cursor-pointer flex items-center">
                {{ t('formDemo.doesNotIncludeVAT') }}
                <Icon icon="material-symbols:keyboard-arrow-down" :size="16" />
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <el-radio-group v-model="radioVAT" class="flex-col">
                      <div style="width: 100%">
                        <el-radio class="text-left" style="color: blue" label="1" size="large">{{
                          t('formDemo.VATNotIncluded')
                        }}</el-radio>
                      </div>
                      <div style="width: 100%">
                        <el-radio class="text-left" style="color: blue" label="2" size="large"
                          >VAT 10%</el-radio
                        >
                      </div>
                      <div style="width: 100%">
                        <el-radio class="text-left" style="color: blue" label="3" size="large"
                          >VAT 8%</el-radio
                        >
                      </div>
                      <div style="width: 100%">
                        <el-radio class="text-left" style="color: blue" label="4" size="large"
                          >VAT 5%</el-radio
                        >
                      </div>
                      <div style="width: 100%">
                        <el-radio class="text-left" style="color: blue" label="5" size="large"
                          >VAT 0%</el-radio
                        >
                      </div>
                    </el-radio-group>
                  </el-dropdown-item>
                  <el-dropdown-item divided>
                    <div style="width: 100%; text-align: center"> Confirm </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>

            <div class="dark:text-[#fff]">{{ t('formDemo.totalSpaFeeDebt') }}</div>
          </el-table-column>
          <el-table-column align="right" min-width="180">
            <div class="dark:text-[#fff]">190,000,000 đ</div>
            <div class="dark:text-[#fff]">-95,000,000 đ</div>
            <div class="dark:text-[#fff] text-transparent dark:text-transparent">s</div>
            <div class="dark:text-[#fff]">95,000,000 đ</div>
          </el-table-column>
          <!-- <el-table-column min-width="200" align="right">
            <div class="text-blue-500 cursor-pointer">FGF343D | Giảm giá 60% ... </div>
            <div class="dark:text-[#fff] text-transparent dark:text-transparent">s</div>
          </el-table-column> -->
          <el-table-column align="center" min-width="90" />
          <el-table-column min-width="90" />
        </el-table>
        <el-divider content-position="left">{{ t('formDemo.debtTrackingSheet') }}</el-divider>
        <el-table :data="debtTable" border>
          <el-table-column
            prop="dateOfPayment"
            :label="`${t('formDemo.dateOfPayment')}`"
            min-width="150"
            align="center"
          >
            <template #default="data">
              <el-date-picker
                v-model="data.row.dateOfPayment"
                type="date"
                placeholder="Pick a day"
                format="DD/MM/YYYY"
              />
            </template>
          </el-table-column>
          <el-table-column prop="content" :label="`${t('reuse.content')}`" min-width="240">
            <template #default="data">
              <el-input v-model="data.row.content" v-if="data.row.edited" style="width: 100%" />
            </template>
          </el-table-column>
          <el-table-column
            :label="`${t('formDemo.receiptOrPayment')}`"
            min-width="120"
            align="right"
          >
            <div class="text-blue-500">+{{ t('formDemo.receiptOrPayment') }}</div>
          </el-table-column>
          <el-table-column :label="`${t('formDemo.paymentOrder')}`" align="right">
            <div class="text-blue-500">+{{ t('formDemo.paymentOrder') }}</div>
          </el-table-column>
          <el-table-column :label="`${t('formDemo.collected')}`" align="left" min-width="150">
            <template #default="data">
              <el-input
                v-model="data.row.collected"
                v-if="data.row.edited"
                style="width: 100%; border: none; outline: none"
              />
            </template>
          </el-table-column>
          <el-table-column :label="`${t('formDemo.spent')}`" min-width="150">
            <template #default="data">
              <el-input
                v-model="data.row.spent"
                v-if="data.row.edited"
                style="width: 100%; border: none; outline: none"
              />
            </template>
          </el-table-column>
          <el-table-column :label="`${t('formDemo.spaFeeDebt')}`" min-width="150">
            <template #default="data">
              <el-input
                v-model="data.row.salesDebt"
                v-if="data.row.edited"
                style="width: 100%; border: none; outline: none"
              />
            </template>
          </el-table-column>
          <el-table-column :label="`${t('formDemo.receivableOrPayable')}`" min-width="120">
            <div>{{ t('reuse.haveToCollect') }}</div>
          </el-table-column>
          <el-table-column
            prop="paymentType"
            :label="`${t('formDemo.choosePayment')}`"
            min-width="180"
          >
            <template #default="props">
              <el-select v-model="props.row.paymentType" class="m-2">
                <el-option
                  v-for="(item, index) in choosePayment"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column :label="t('formDemo.alreadyPaidForTt')" width="90" align="center">
            <el-checkbox v-model="checked1" label="" size="large" />
          </el-table-column>
          <el-table-column :label="`${t('formDemo.manipulation')}`" min-width="90" align="center">
            <template #default="scope">
              <!-- <button
                class="border-1 bg-[#F78F8F] pt-2 pb-2 pl-4 pr-4 text-[#fff]"
                @click.prevent="deleteRowDebtTable(scope.$index)"
              >
                Xóa
              </button> -->
              <el-button @click.prevent="deleteRowDebtTable(scope.$index)" type="danger">{{
                t('reuse.delete')
              }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button class="ml-4 mt-4" @click="onAddDebtTableItem"
          >+ {{ t('formDemo.add') }}</el-button
        >
        <div class="w-[100%]">
          <el-divider content-position="left">{{ t('formDemo.statusAndManipulation') }}</el-divider>
        </div>
        <div class="flex gap-4 w-[100%] ml-1 items-center pb-3">
          <label class="w-[9%] text-right">{{ t('formDemo.orderStatus') }}</label>
          <div class="w-[84%] pl-1">
            <el-radio-group v-model="radio1" class="ml-4">
              <el-radio label="1" size="large">{{ t('reuse.closedTheOrder') }}</el-radio>
              <el-radio label="2" size="large">{{ t('reuse.delivery') }}</el-radio>
              <el-radio label="3" size="large">{{ t('reuse.successfulDelivery') }}</el-radio>
              <el-radio label="4" size="large">{{ t('reuse.deliveryFailed') }}</el-radio>
              <el-radio label="5" size="large">{{ t('reuse.paying') }}</el-radio>
              <el-radio label="6" size="large">{{ t('common.doneLabel') }}</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="flex gap-2 pb-8">
          <div class="w-[11%]"></div>
          <div class="w-[89%]"
            ><span class="pl-2 pr-2 bg-[#FFF0D9] text-[#FEB951] leading-5 dark:bg-transparent">{{
              t('formDemo.changedUnitPriceIsWaitingForPriceApproval')
            }}</span>
          </div>
        </div>

        <div class="w-[100%] flex gap-2">
          <div class="w-[12%]"></div>
          <div class="w-[100%] flex ml-1 gap-4">
            <el-button class="min-w-42 min-h-11" @click="callApiServicesSpa">{{
              t('formDemo.printSpaBill')
            }}</el-button>
            <el-button class="min-w-42 min-h-11">{{ t('formDemo.temporaryStorage') }}</el-button>
            <el-button @click="postData" type="primary" class="min-w-42 min-h-11">{{
              t('formDemo.complete')
            }}</el-button>
            <el-button type="danger" class="min-w-42 min-h-11">{{
              t('button.cancelOrder')
            }}</el-button>
          </div>
        </div>
      </el-collapse-item>

      <!-- dialog2 -->
      <el-dialog
        v-model="dialogFormSettingServiceSpa"
        title="Cài đặt phí dịch vụ Spa"
        width="30%"
        align-center
      >
        <el-divider />

        <el-form :model="form">
          <el-table
            ref="multipleTableRef"
            border
            :data="callApiTable"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="name" label="Thông tin dịch vụ Spa" width="320" />
            <el-table-column prop="id" label="Bảng giá" width="auto" show-overflow-tooltip />
          </el-table>
        </el-form>
        <div class="flex justify-between px-3 mt-2">
          <strong>Thành tiền phí dịch vụ Spa</strong>
          <p class="price font-medium">50000</p>
        </div>

        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="dialogFormSettingServiceSpa = false">{{
              t('reuse.save')
            }}</el-button>
            <el-button @click="dialogFormSettingServiceSpa = false">{{
              t('reuse.exit')
            }}</el-button>
          </span>
        </template>
      </el-dialog>
      <!-- end dialog 2 -->
      <el-collapse-item :name="collapse[2].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[2].icon" link />
          <span class="text-center text-xl">{{ collapse[2].title }}</span>
        </template>
        <div>
          <el-divider content-position="left">Bảng theo dõi nhập hàng</el-divider>
          <el-table
            :data="ListOfProductsForSale"
            border
            :class="[
              'bg-[var(--el-color-white)] dark:(bg-[var(--el-color-black)] border-[var(--el-border-color)] border-1px)'
            ]"
          >
            <el-table-column
              :label="`${t('formDemo.productManagementCode')}`"
              min-width="250"
              prop="code"
            >
              <template #default="props">
                <MultipleOptionsBox
                  :fields="[
                    t('reuse.productCode'),
                    t('reuse.managementCode'),
                    t('formDemo.productInformation')
                  ]"
                  filterable
                  :items="listProductsTable"
                  :valueKey="'name'"
                  :labelKey="'id'"
                  :hiddenKey="['id']"
                  :placeHolder="'Chọn mã sản phẩm'"
                  @focus="callApiProductList()"
                  :clearable="false"
                  @change="(option) => changeName(option, props)"
                />
              </template>
            </el-table-column>

            <el-table-column
              prop="name"
              :label="t('formDemo.productInformation')"
              min-width="400"
            />
            <el-table-column :label="`${t('reuse.accessory')}`" width="180">
              <el-input
                :v-model="input"
                :placeholder="`/${t('formDemo.selfImportAccessories')}/`"
              />
            </el-table-column>

            <el-table-column prop="quantity" :label="`${t('formDemo.amount')}`" width="120" />
            <el-table-column prop="dram" :label="`${t('reuse.dram')}`" align="center" width="120" />

            <el-table-column :label="`${t('formDemo.deliveryNote')}`" align="right" width="200">
              <div class="flex w-[100%] items-center">
                <div class="flex-1">
                  <span class="text-blue-500"> MADKAW</span>
                </div>
                <div class="w-[60%]">
                  <el-button text @click="openDialogChooseWarehouse = true">
                    <span class="text-blue-500"> + {{ t('formDemo.edit') }}</span>
                  </el-button>
                </div>
              </div>
            </el-table-column>
            <el-table-column :label="`${t('formDemo.manipulation')}`" align="center" width="180">
              <template #default="scope">
                <div class="flex gap-4 justify-center">
                  <el-button @click.prevent="deleteRow(scope.$index)" type="danger">{{
                    t('reuse.delete')
                  }}</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-button class="ml-4 mt-4" @click="onAddHistoryTableItem"
            >+ {{ t('formDemo.add') }}</el-button
          >
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

::v-deep(.el-input) {
  width: auto;
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

::v-deep(.el-input) {
  width: fit-content;
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
</style>
