<script setup lang="ts">
import { reactive, ref, watch, unref, onBeforeMount, onMounted } from 'vue'
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
  ElMessage
} from 'element-plus'
import type { UploadFile } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { Collapse } from '../../Components/Type'
import { useRoute, useRouter } from 'vue-router'
import moment from 'moment'
import MultipleOptionsBox from '@/components/MultipleOptionsBox.vue'
import {
  getProductsList,
  getCollaboratorsInOrderList,
  getPromotionsList,
  getAllCustomer,
  addNewOrderList,
  getSellOrderList
} from '@/api/Business'
import { FORM_IMAGES } from '@/utils/format'
import { getCity, getDistrict, getWard } from '@/utils/Get_Address'
import type { FormInstance, FormRules } from 'element-plus'

const { t } = useI18n()

const ruleFormRef = ref<FormInstance>()
const ruleFormRef2 = ref<FormInstance>()
const ruleForm = reactive({
  orderCode: 'DHB039423',
  collaborators: '',
  discount: '',
  orderNotes: '',
  customerName: '',
  delivery: ''
})

const rules = reactive<FormRules>({
  orderCode: [{ required: true, message: 'Please input order code', trigger: 'blur' }],
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
      ElMessage.success(t('reuse.addSuccess'))
      checkValidate.value = true
    } else {
      ElMessage.error(t('reuse.notFillAllInformation'))
      checkValidateForm.value = false
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
    name: 'productImportHistory',
    title: t('formDemo.productImportHistory'),
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

const input = ref('')

interface ListOfProductsForSaleType {
  name: string
  productCode: string
  productName: string
  productPropertyCode: string
  productPropertyName: string
  id: string
  code: string
  quantity: number | undefined
  selfImportAccessories: string | undefined
  dram: string
  unitPrice: string
  intoMoney: string
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
  code: '',
  quantity: 1,
  selfImportAccessories: '',
  dram: t('formDemo.psc'),
  unitPrice: 'đ',
  intoMoney: 'đ',
  paymentType: '',
  edited: true
})
let ListOfProductsForSale = ref<Array<ListOfProductsForSaleType>>([])
const tableData2 = [
  {
    name: '',
    quantity: '',
    unitPrice: '',
    intoMoney: ''
  }
]

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
// const deleteRowDebtTable = (index: number) => {
//   debtTable.value.splice(index, 1)
// }

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
let dialogAddQuick = ref(false)
const openDialogChooseWarehouse = ref(false)
const openDialogChoosePromotion = ref(false)
const valueProvince = ref('')
const valueDistrict = ref('')
const valueCommune = ref('')

const district = ref()
const ward = ref()
const street = ref()

const enterdetailAddress = ref([])
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
  alreadyPaidForTt: boolean
  statusAccountingEntry: string
}
const debtTable = ref<Array<tableDataType>>([
  {
    dateOfPayment: moment().format('L').toString(),
    col: 1,
    content: 'Phiếu thanh toán',
    collected: '',
    spent: '',
    salesDebt: '0 đ',
    edited: true,
    paymentType: '',
    alreadyPaidForTt: false,
    statusAccountingEntry: 'Đã ghi sổ'
  }
])

const onAddDebtTableItem = () => {
  debtTable.value.push({
    dateOfPayment: moment().format('L').toString(),
    col: 1,
    content: '',
    collected: '95,000,000 đ',
    spent: '',
    salesDebt: '',
    edited: true,
    paymentType: '',
    alreadyPaidForTt: false,
    statusAccountingEntry: ''
  })
}

const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<tableDataType[]>([])

const handleSelectionChange = (val: tableDataType[]) => {
  multipleSelection.value = val
}

const radioVAT = ref(false)
let infoCompany = reactive({
  name: '',
  taxCode: '',
  phone: '',
  email: ''
})

let customerAddress = ref('')
// Call api danh sách khách hàng
// const ruleForm.customerName = ref('')
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
        value: product.id,
        address: product.address,
        isOrganization: product.isOrganization,
        name: product.name,
        taxCode: product.taxCode,
        phone: product.phonenumber,
        email: product.email,
        id: product.id
      }))
    }
  }
  optionCallCustomerAPi++
}

// Call api danh sách sản phẩm
let listProductsTable = ref()
const optionsApi = ref()

let optionCallAPi = 0
const callApiProductList = async () => {
  if (optionCallAPi == 0) {
    const res = await getProductsList({ ProductId: 1 })
    if (Array.isArray(res.data) && res.data.length > 0) {
      optionsApi.value = res.data.map((product) => ({
        label: product.id.toString(),
        value: product.id.toString(),
        name: product.name,
        price: product.price.toString(),
        id: product.id
      }))
      optionCallAPi++
      listProductsTable.value = optionsApi.value
    }
  }
}

const getValueOfSelected = (_value, obj, scope) => {
  console.log('obj: ', obj)
  console.log('scope: ', scope)
  scope.row.code = obj.label
  scope.row.productCode = obj.value
  scope.row.productName = obj.name
  scope.row.unitPrice = obj.price
  scope.row.intoMoney = (parseInt(scope.row.quantity) * parseInt(scope.row.unitPrice)).toString()
}
const handleTotal = (scope) => {
  scope.row.intoMoney = (parseInt(scope.row.quantity) * parseInt(scope.row.unitPrice)).toString()
}

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
  ListOfProductsForSale.value.push({ ...productForSale })
}

const initialRadio = ref(false)

//add row to the end of table if fill all table
watch(
  () => ListOfProductsForSale,
  () => {
    if (
      ListOfProductsForSale.value[ListOfProductsForSale.value.length - 1].selfImportAccessories &&
      ListOfProductsForSale.value[ListOfProductsForSale.value.length - 1].quantity &&
      ListOfProductsForSale.value[ListOfProductsForSale.value.length - 1].productName &&
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

let customerIdPromo = ref()

const removeListProductsSale = (index) => {
  if (!ListOfProductsForSale[ListOfProductsForSale.value.length - 1].selfImportAccessories) {
    forceRemove.value = true
    ListOfProductsForSale.value.splice(index, 1)
  }
}

const checkDisabled = ref(false)

const dialogAddProduct = ref(false)
const addnewproduct = () => {
  dialogAddProduct.value = true
}
// tạo đơn hàng
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
  if (checkValidate.value) {
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

    console.log('productPayment: ', ListOfProductsForSale.value)
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
      ServiceType: 1,
      OrderCode: ruleForm.orderCode,
      PromotionCode: 'AA12',
      CollaboratorId: ruleForm.collaborators,
      CollaboratorCommission: ruleForm.discount,
      Description: ruleForm.orderNotes,
      CustomerId: ruleForm.customerName,
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
    addNewOrderList(formDataPayLoad)
  }
}

const viewIcon = useIcon({ icon: 'uil:search' })
const deleteIcon = useIcon({ icon: 'uil:trash-alt' })

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

//lay du lieu tu router
const router = useRouter()
const id = Number(router.currentRoute.value.params.id)
// const type = String(router.currentRoute.value.params.type)
const route = useRoute()
const type = String(route.params.type)

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

      if (ListOfProductsForSale.value.length > 0)
        ListOfProductsForSale.value.splice(0, ListOfProductsForSale.value.length - 1)
      ListOfProductsForSale.value = orderObj.orderDetails
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
  } else if (type == 'add' || !type) {
    ListOfProductsForSale.value.push({ ...productForSale })
  }
}

// Call api danh sách mã giảm giá
let promoTable = ref()
const promoLoading = ref(true)
const listPromotions = ref()
const optionPromotions = ref()
let optionCallPromoAPi = 0
const callPromoApi = async () => {
  if (optionCallPromoAPi == 0) {
    const res = await getPromotionsList({ ServiceType: 1, CustomerId: customerIdPromo.value })
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
    deliveryMethod.value = ''
  }
}

// Thông tin phiếu thu
const dialogInformationReceipts = ref(false)

// Thông tin phiếu đề nghị thanh toán
const dialogIPRForm = ref(false)

// fake tạm option thêm nhanh sản phẩm
const value = ref('')
const value1 = ref('')
const payment = choosePayment[0].value

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

onBeforeMount(async () => {
  callCustomersApi()
  callApiCollaborators()
  await callApiProductList()
  callApiCity()
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

      <!-- Dialog thêm nhanh sản phẩm -->
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
              <el-select v-model="value" :placeholder="t('reuse.selectCategory')">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div class="flex gap-4 pt-4 pb-4 items-center">
              <label class="w-[30%] text-right">{{ t('router.productCategoryBrand') }} </label>
              <el-select v-model="value" :placeholder="t('reuse.chooseBrand')">
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
                >{{ t('router.productCategoryUnit') }} <span class="text-red-500">*</span></label
              >
              <el-select v-model="value" :placeholder="t('reuse.chooseUnit')">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div class="flex gap-4 pt-4 pb-4 items-center">
              <label class="w-[30%] text-right">{{ t('router.productCategoryOrigin') }}</label>
              <el-select v-model="value" :placeholder="t('reuse.chooseOrigin')">
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
            <span class="w-[25%] text-base font-bold">{{ t('formDemo.productInfomation') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
        </div>
        <div>
          <div class="flex gap-4 pt-4 pb-4 items-center">
            <label class="w-[30%] text-right"
              >{{ t('reuse.productCode') }} <span class="text-red-500">*</span></label
            >
            <el-select v-model="value" :placeholder="t('formDemo.AddSelectProductCode')">
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
              >{{ t('reuse.managementCode') }} <span class="text-red-500">*</span></label
            >
            <el-input style="width: 100%" :placeholder="t('formDemo.addManagementCode')" />
          </div>
          <div class="flex gap-4 pt-4 pb-4 items-center">
            <label class="w-[30%] text-right"
              >{{ t('reuse.productName') }} <span class="text-red-500">*</span></label
            >
            <el-input style="width: 100%" :placeholder="t('formDemo.EnterNameDescription')" />
          </div>
          <div class="flex gap-4 pt-4 pb-4 items-center">
            <label class="w-[30%] text-right">{{ t('formDemo.shortDescription') }}</label>
            <el-input style="width: 100%" :placeholder="t('formDemo.EnterNameDescription')" />
          </div>
          <div class="flex gap-4 pt-4 pb-4 items-center">
            <label class="w-[30%] text-right">{{ t('formDemo.productCharacteristics') }}</label>
            <el-select v-model="value1" multiple :placeholder="t('formDemo.selectFeature')">
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
            <el-button class="btn" type="primary" @click="dialogAddProduct = false">{{
              t('button.edit')
            }}</el-button>
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
              t('router.productCategoryProducts')
            }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
          <div>
            <div class="flex gap-4 pt-4 pb-4 items-center">
              <label class="w-[30%] text-right">{{ t('formDemo.receiptsCode') }}</label>
              <div class="w-[100%] text-xl">PT890345</div>
            </div>
            <div class="flex gap-4 pt-4 pb-4 items-center">
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
            <div class="flex gap-4 pt-4 pb-4 items-center">
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
            <span class="w-[25%] text-base font-bold">{{ t('formDemo.productInfomation') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
        </div>
        <div>
          <div class="flex gap-4 pt-4 pb-4 items-center">
            <label class="w-[30%] text-right">Mã phiếu thu</label>
            <div class="w-[100%] text-xl">105,000,000 đ</div>
          </div>
          <div class="flex gap-4 pt-4 pb-4 items-center">
            <label class="w-[30%] text-right"
              >{{ t('formDemo.writtenWords') }} <span class="text-red-500">*</span></label
            >
            <el-input style="width: 100%" :placeholder="t('formDemo.writtenWords')" />
          </div>
          <div class="flex gap-4 pt-4 pb-4 items-center">
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
          <div class="flex gap-4 pt-4 pb-4 items-center">
            <label class="w-[30%] text-right">Trạng thái</label>
            <div class="w-[100%]">
              <span class="border-1 pl-2 pr-2">Khởi tạo & ghi sổ</span>
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

      <!-- Dialog thông tin phiếu đề nghị thanh toán -->

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
            <div class="flex gap-4 pt-4 pb-4 items-center">
              <label class="w-[30%] text-right">{{ t('formDemo.PaymentRequestCode') }}</label>
              <div class="w-[100%] text-xl">DNTT890345</div>
            </div>
            <div class="flex gap-4 pt-4 pb-4 items-center">
              <label class="w-[30%] text-right"
                >{{ t('formDemo.proponent') }} <span class="text-red-500">*</span></label
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
            <span class="w-[25%] text-base font-bold">{{ t('formDemo.billingInformation') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
        </div>
        <div>
          <div class="flex gap-4 pt-4 pb-4 items-center">
            <label class="w-[30%] text-right">Mã phiếu thu</label>
            <div class="w-[100%] text-xl">10,000,000 đ</div>
          </div>
          <div class="flex gap-4 pt-4 pb-4 items-center">
            <label class="w-[30%] text-right"
              >{{ t('formDemo.writtenWords') }} <span class="text-red-500">*</span></label
            >
            <el-input style="width: 100%" :placeholder="t('formDemo.writtenWords')" />
          </div>
          <div class="flex gap-4 pt-4 pb-4 items-center">
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
          <div class="flex gap-4 pt-4 pb-4 items-center">
            <label class="w-[30%] text-right">Trạng thái</label>
            <div class="w-[100%]">
              <span class="border-1 pl-2 pr-2">Khởi tạo & ghi sổ</span>
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

      <!--  -->
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
                  <el-form-item prop="discount" label-width="0">
                    <div class="flex items-center">
                      <el-input
                        :disabled="checkDisabled"
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
                  action="#"
                  list-type="picture-card"
                  :disabled="checkDisabled"
                  :auto-upload="false"
                >
                  <template #file="{ file }">
                    <div>
                      <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                      <span class="el-upload-list__item-actions">
                        <span
                          class="el-upload-list__item-preview"
                          @click="handlePictureCardPreview(file)"
                        >
                          <ElButton :icon="viewIcon" class="avatar-uploader-icon border-none" />
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
                          <ElButton :icon="deleteIcon" class="avatar-uploader-icon border-none" />
                        </span>
                      </span>
                    </div>
                  </template>
                  <el-dialog v-model="dialogVisible">
                    <img w-full :src="dialogImageUrl" alt="Preview Image" />
                  </el-dialog>
                  <div class="text-[#303133] font-medium dark:text-[#fff]"
                    >+ {{ t('formDemo.addPhotosOrFiles') }}
                  </div>
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
              <el-checkbox v-model="props.row.warehouseCheckbox" />
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
        <el-divider content-position="left">{{ t('formDemo.ListOfProductsForSale') }}</el-divider>
        <el-table
          :data="ListOfProductsForSale"
          border
          :class="[
            'bg-[var(--el-color-white)] dark:(bg-[var(--el-color-black)] border-[var(--el-border-color)] border-1px)'
          ]"
        >
          <el-table-column :label="t('formDemo.productManagementCode')" min-width="200" prop="code">
            <template #default="props">
              <MultipleOptionsBox
                :fields="[
                  t('reuse.productCode'),
                  t('reuse.managementCode'),
                  t('formDemo.productInformation')
                ]"
                filterable
                :items="listProductsTable"
                valueKey="id"
                labelKey="label"
                :hiddenKey="['id']"
                :placeHolder="'Chọn mã sản phẩm'"
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
          <el-table-column
            prop="productName"
            :label="t('formDemo.productInformation')"
            min-width="620"
          >
            <!-- <template #default="props">
              <MultipleOptionsBox
                :fields="[
                  t('reuse.productCode'),
                  t('reuse.managementCode'),
                  t('formDemo.productInformation')
                ]"
                filterable
                :items="listProductsTable"
                valueKey="id"
                labelKey="label"
                :hiddenKey="['id']"
                :placeHolder="'Chọn mã sản phẩm'"
                :clearable="false"
                @update-value="(value, obj) => getValueOfSelected(value, obj, props)"
                ><template #underButton>
                  <div class="block h-1 w-[100%] border-top-1 pb-2"></div>
                  <div class="text-base text-blue-400 cursor-pointer pl-2" @click="addnewproduct"
                    >+ {{ t('formDemo.quicklyAddProducts') }}</div
                  >
                </template></MultipleOptionsBox
              >
            </template> -->
          </el-table-column>
          <el-table-column prop="selfImportAccessories" :label="t('reuse.accessory')" width="180">
            <template #default="data">
              <div v-if="type === 'detail'">{{ data.row.selfImportAccessories }}</div>
              <el-input
                v-else
                class="max-w-[150px]"
                v-model="data.row.selfImportAccessories"
                :placeholder="`/${t('formDemo.selfImportAccessories')}/`"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="quantity"
            :label="`${t('formDemo.amount')}`"
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
          <el-table-column
            prop="dram"
            :label="`${t('reuse.dram')}`"
            align="center"
            min-width="100"
          />
          <el-table-column
            prop="unitPrice"
            :label="`${t('reuse.unitPrice')}`"
            align="right"
            width="180"
          />

          <el-table-column
            prop="intoMoney"
            :label="`${t('formDemo.intoMoney')}`"
            align="right"
            width="180"
          />
          <el-table-column :label="`${t('formDemo.exportWarehouse')}`" min-width="200">
            <div class="flex w-[100%] items-center">
              <div class="w-[40%]">Còn hàng</div>
              <div class="w-[60%]">
                <el-button text @click="openDialogChooseWarehouse = true">
                  <span class="text-blue-500"> + {{ t('formDemo.chooseWarehouse') }}</span>
                </el-button>
              </div>
            </div>
          </el-table-column>

          <el-table-column :label="`${t('formDemo.manipulation')}`" align="center" min-width="90">
            <template #default="scope">
              <button
                @click.prevent="removeListProductsSale(scope.$index)"
                class="bg-[#F56C6C] pt-2 pb-2 pl-4 pr-4 text-[#fff] rounded"
                >{{ t('reuse.delete') }}</button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-table :data="tableData2" class="dark:text-[#fff]">
          <el-table-column width="250" />
          <el-table-column width="220" />
          <el-table-column width="220" />
          <el-table-column width="550" />
          <el-table-column align="right" width="180">
            <div class="dark:text-[#fff]">{{ t('formDemo.intoMoney') }}</div>
            <div class="text-blue-500 cursor-pointer">
              <el-button
                text
                :disabled="checkDisabled"
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
            <el-dropdown trigger="click" :disabled="checkDisabled">
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
                        <el-radio class="text-left" style="color: blue" label="2">VAT 10%</el-radio>
                      </div>
                      <div style="width: 100%">
                        <el-radio class="text-left" style="color: blue" label="3">VAT 8%</el-radio>
                      </div>
                      <div style="width: 100%">
                        <el-radio class="text-left" style="color: blue" label="4">VAT 5%</el-radio>
                      </div>
                      <div style="width: 100%">
                        <el-radio class="text-left" style="color: blue" label="5">VAT 0%</el-radio>
                      </div>
                    </el-radio-group>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>

            <div class="dark:text-[#fff]">{{ t('formDemo.totalAmountReceivable') }}</div>
          </el-table-column>
          <el-table-column align="right" width="180">
            <div class="dark:text-[#fff]">190,000,000 đ</div>
            <div class="dark:text-[#fff]">-95,000,000 đ</div>
            <div class="dark:text-[#fff] text-transparent dark:text-transparent">s</div>
            <div class="dark:text-[#fff]">95,000,000 đ</div>
          </el-table-column>
          <el-table-column width="200" align="right">
            <div class="text-blue-500 cursor-pointer">FGF343D | Giảm giá 60% ... </div>
            <div class="dark:text-[#fff] text-transparent dark:text-transparent">s</div>
          </el-table-column>
        </el-table>

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
          <div class="w-[89%]"
            ><span class="pl-2 pr-2 bg-[#FFF0D9] text-[#FEB951] leading-5 dark:bg-transparent">{{
              t('formDemo.browsePriceChanges')
            }}</span>
          </div>
        </div>

        <div class="w-[100%] flex gap-2">
          <div class="w-[12%]"></div>
          <div class="w-[100%] flex ml-1 gap-4">
            <el-button :disabled="checkDisabled" class="min-w-42 min-h-11">{{
              t('formDemo.printSalesSlip')
            }}</el-button>
            <el-button :disabled="checkDisabled" class="min-w-42 min-h-11">{{
              t('formDemo.temporaryStorage')
            }}</el-button>
            <el-button
              :disabled="checkDisabled"
              @click="postData"
              type="primary"
              class="min-w-42 min-h-11"
              >{{ t('formDemo.complete') }}</el-button
            >
            <el-button :disabled="checkDisabled" type="danger" class="min-w-42 min-h-11">{{
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
        <el-button @click="dialogInformationReceipts = true" text>+ Thêm phiếu chi</el-button>
        <el-button @click="dialogIPRForm = true" text>+ Thêm đề nghị thanh toán</el-button>
        <el-table
          ref="multipleTableRef"
          :data="debtTable"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" align="center" />
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
          <el-table-column
            prop="content"
            :label="`${t('formDemo.certificateInformation')}`"
            min-width="240"
          >
            <template #default="data">
              <el-input v-model="data.row.content" v-if="data.row.edited" style="width: 100%" />
            </template>
          </el-table-column>
          <el-table-column
            :label="`${t('formDemo.receiptOrPayment')}`"
            min-width="120"
            align="left"
          >
            <div @click="dialogInformationReceipts = true" class="text-blue-500">PT354344</div>
          </el-table-column>
          <el-table-column :label="`${t('formDemo.paymentOrder')}`" align="left" min-width="150">
            <div @click="dialogIPRForm = true" class="text-blue-500">DNTT6543</div>
          </el-table-column>
          <el-table-column
            prop="collected"
            :label="t('formDemo.collected')"
            align="left"
            min-width="150"
          >
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
          <el-table-column prop="salesDebt" :label="t('formDemo.salesDebt')" min-width="150">
            <template #default="data">
              <el-input
                v-model="data.row.salesDebt"
                v-if="type == 'edit'"
                style="width: 100%; border: none; outline: none"
              />
              <div v-else class="text-right">
                {{ data.row.salesDebt }}
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="t('formDemo.receivableOrPayable')" min-width="120">
            <div>Phải thu</div>
          </el-table-column>
          <el-table-column prop="paymentType" :label="t('formDemo.choosePayment')" min-width="180">
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
          <el-table-column
            :label="t('formDemo.statusAccountingEntry')"
            prop="statusAccountingEntry"
            align="center"
            min-width="120"
          />
          <el-table-column
            prop="alreadyPaidForTt"
            :label="`${t('formDemo.alreadyPaidForTt')}`"
            align="center"
            min-width="70"
          >
            <template #default="scope">
              <el-checkbox v-model="scope.row.alreadyPaidForTt" />
            </template>
          </el-table-column>
          <el-table-column :label="`${t('formDemo.manipulation')}`" min-width="120" align="center">
            <template #default>
              <div class="flex">
                <!-- @click.prevent="deleteRowDebtTable(scope.$index)" -->
                <!-- @click="centerDialogVisible = true" -->
                <button
                  class="border-1 border-blue-500 pt-2 pb-2 pl-4 pr-4 dark:text-[#fff] rounded"
                >
                  {{ t('reuse.detail') }}
                </button>
                <!-- <button
                  class="bg-[#F56C6C] pt-2 pb-2 pl-4 pr-4 text-[#fff] rounded"
                  @click.prevent="deleteRowDebtTable(scope.$index)"
                >
                  {{ t('reuse.delete') }}
                </button> -->
              </div>
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
            <el-table-column :label="`${t('formDemo.productManagementCode')}`" width="150">
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
                  @update-value="(value, obj) => getValueOfSelected(value, obj, props)"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              :label="`${t('formDemo.productInformation')}`"
              width="720"
            />
            <el-table-column :label="`${t('reuse.accessory')}`" width="180">
              <el-input
                :v-model="input"
                :placeholder="`/${t('formDemo.selfImportAccessories')}/`"
              />
            </el-table-column>

            <el-table-column prop="quantity" :label="`${t('formDemo.amount')}`" width="150" />
            <el-table-column prop="dram" :label="`${t('reuse.dram')}`" align="center" width="120" />

            <el-table-column
              :label="`${t('formDemo.invoiceForGoodsEnteringTheWarehouse')}`"
              align="right"
              width="200"
            >
              <div class="flex text-blue-500">
                <span class="flex-1 text-left">NK3424</span>
                <span class="flex-1">+ {{ t('button.edit') }}</span>
              </div>
            </el-table-column>
            <el-table-column :label="`${t('formDemo.manipulation')}`" align="center" width="180">
              <template #default="scope">
                <div class="flex gap-4 justify-center">
                  <button
                    class="border-1 bg-[#F56C6C] pt-2 pb-2 pl-4 pr-4 text-[#fff] rounded"
                    @click.prevent="deleteRow(scope.$index)"
                  >
                    {{ t('reuse.delete') }}
                  </button>
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

::v-deep(.el-dialog__title) {
  font-weight: bold;
}

.btn {
  width: 150px;
}
</style>
