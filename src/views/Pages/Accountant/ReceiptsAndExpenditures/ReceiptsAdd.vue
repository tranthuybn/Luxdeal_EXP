<script setup lang="ts">
import { dateTimeFormat } from '@/utils/format'
import { h, reactive, ref, watch, unref, onBeforeMount } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import {
  ElCollapse,
  ElCollapseItem,
  ElSelect,
  ElOption,
  ElCheckbox,
  ElButton,
  ElDivider,
  ElInput,
  ElForm,
  ElFormItem,
  ElNotification,
  ElMessage,
  ElDialog
} from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { Collapse } from '../../Components/Type'
import { useRoute, useRouter } from 'vue-router'
import moment from 'moment'
import MultipleOptionsBox from '@/components/MultipleOptionsBox.vue'
import {
  getDetailReceiptPaymentVoucher,
  getProductsList,
  getCollaboratorsInOrderList,
  getAllCustomer,
  editReceiptPaymentVoucher,
  addNewOrderList,
  getOrderList,
  updateOrderStatus
} from '@/api/Business'
import { FORM_IMAGES } from '@/utils/format'
import { STATUS_ORDER_PURCHASE } from '@/utils/API.Variables'
import { getCity } from '@/utils/Get_Address'
import type { FormRules } from 'element-plus'
import { getStaff } from '@/api/Warehouse'
import receiptsPaymentPrint from '../../Components/formPrint/src/receiptsPaymentPrint.vue'
const { t } = useI18n()
//lay du lieu tu router
const router = useRouter()
const id = Number(router.currentRoute.value.params.id)
const route = useRoute()
const type = String(route.params.type)
const optionsStaffApi = ref()
var curDate = 'MH' + moment().format('hhmmss')
var autoCodeSellOrder = 'MH' + moment().format('hmmss')
var autoCodePaymentRequest = 'DNTT' + moment().format('hhmmss')
const sellOrderCode = ref()
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
const getListStaff = async () => {
  const res = await getStaff({ pageIndex: 1, pageSize: 20 })
  optionsStaffApi.value = res.data.map((item) => ({
    code: item.code,
    phone: item.phonenumber,
    name: item.name,
    label: item.name + ' | ' + item.phonenumber,
    id: item.id
  }))
}
const getValueOfStaffSelected = (value, _obj) => {
  petitionerData.value = value
}

// form phiếu thu
let formReceipts = ref<any>()
const scrollStaffBottom = ref(false)
const pageIndexStaff = ref(1)
const noMoreStaffData = ref(false)
const noMoreCustomerData = ref(false)
const getFormReceipts = () => {
  PrintReceipts.value = true
  if (dataDetail.value) {
    formReceipts.value = Object.assign(
      {},
      {
        sellOrderCode: dataDetail.value.orderCode ?? '',
        codeReceipts: dataDetail.value.code ?? '',
        moneyReceipts: dataDetail.value.totalMoney ?? 0,
        reasonCollectingMoney: dataDetail.value.description ?? 0,
        enterMoney: dataDetail.value.enterMoney ?? 0,
        payment: payment.value == 0 ? 'Tiền mặt' : 'Tiền thẻ'
      }
    )
    console.log('formReceipts.value ', formReceipts.value)
  } else {
    ElMessage({
      showClose: true,
      message: 'Vui lòng nhập tiền bằng chữ',
      type: 'error'
    })
  }
}
const ScrollStaffBottom = () => {
  scrollStaffBottom.value = true
  pageIndexStaff.value++
  noMoreStaffData.value
    ? ''
    : getStaff({ PageIndex: pageIndexStaff.value, PageSize: 20 })
        .then((res) => {
          res.data.length == 0
            ? (noMoreCustomerData.value = true)
            : res.data.map((item) =>
                optionsStaffApi.value.push({
                  code: item.code,
                  phone: item.phonenumber,
                  name: item.name,
                  label: item.name + ' | ' + item.phonenumber,
                  id: item.id
                })
              )
        })
        .catch(() => {
          noMoreStaffData.value = true
        })
}
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
  }
]

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

interface EditReceiptEndearmentVoucher {
  id: number
  totalMoney: string | undefined
  typeOfPayment: number
  status: number
  peopleType: number
  PeopleId: number
  deletedDocument: string
  type: string | undefined
  document: Array<string> | undefined
  description: string
}
let EditReceiptAndPaymentVoucherData = ref<EditReceiptEndearmentVoucher>()

let ListOfProductsForSale = ref<Array<ListOfProductsForSaleType>>([])

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
const petitionerData = ref('')
const parentingStatusData = ref({ title: 'Không xác định', value: false })
const StatusData = ref()
const activeName = ref(collapse[0].name)
// dataDetail
interface ReceiptOrPaymentVoucherDetail {
  code: string
  type: string
  description: string | undefined
  totalMoney: number | undefined
  typeOfPayment: string | number | undefined
  peopleType: number | undefined
  peopleName: string
  peopleId: string | number | undefined
  status: string | number | undefined
  accountNumber: string | number | undefined
  accountName: string
  accountingDate: string | Date
  id: number
  createdBy: string | Date | undefined
  createdAt: string | undefined
  updatedAt: string | undefined
  customerId: string
  orderId: number
  orderCode: string | undefined
  enterMoney: string | undefined
}
const cities = ref()
const callApiCity = async () => {
  cities.value = await getCity()
}

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
      value: customer.id,
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
let totalFinalOrder = ref(0)

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
const printPage = (id: string, { url, title, w, h }) => {
  const printContents = document.getElementById(id)?.innerHTML
  console.log('printContents', printContents)

  let stylesHtml = ''
  for (const node of [...document.querySelectorAll('link[rel="stylesheet"], style')]) {
    stylesHtml += node.outerHTML
  }

  // if (printContents) {
  //   if (child) printContents.removeChild(child)
  //   const tempNode = document.createElement('p')
  //   tempNode.id = 'main-content'
  //   tempNode.innerHTML = editor.value
  //   printContents?.appendChild(tempNode)
  // }

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
const inputDeposit = ref(0)
const inputDepositPayment = ref(0)
const totalPaymentRequest = ref(0)

watch(
  () => inputDeposit.value,
  () => {
    moneyDeposit.value = totalFinalOrder.value - inputDeposit.value
  }
)

watch(
  () => inputDepositPayment.value,
  () => {
    moneyDepositPayment.value = totalPaymentRequest.value - inputDepositPayment.value
    if (moneyDepositPayment.value > moneyDeibt.value) {
      ElNotification({
        message: 'Số tiền còn lại lớn hơn số tiền chi',
        type: 'warning'
      })
    }
  }
)

// Phiếu xuất kho tự động
// const automaticCouponWareHouse = async (index) => {
//   const payload = {
//     OrderId: idOrderPost.value.data,
//     Type: index
//   }

//   await postAutomaticWarehouse(payload)
// }

// total order
let dataDetail = ref<ReceiptOrPaymentVoucherDetail>({
  code: '',
  type: '',
  description: '',
  totalMoney: 0,
  typeOfPayment: '',
  peopleType: 0,
  peopleName: '',
  peopleId: '',
  status: '',
  accountNumber: '',
  accountName: '',
  accountingDate: '',
  id: 0,
  createdAt: '',
  createdBy: '',
  customerId: '',
  updatedAt: '',
  orderId: 0,
  orderCode: '',
  enterMoney: ''
})

let dataEdit = ref()

const editData = async () => {
  if (type == 'edit' || type == 'detail') {
    var su = await getDetailReceiptPaymentVoucher({ id: id })
    console.log('su: ', su)
    if (su.data) dataDetail.value = Object.assign({}, su?.data)
    var cus = optionsCustomerApi.value.find((x) => x.id == dataDetail.value.customerId)
    getValueOfCustomerSelected(dataDetail.value.customerId, cus)
    const res = await getOrderList({ Id: id, ServiceType: 1 })
    const orderObj = { ...res?.data[0] }
    arrayStatusOrder.value = orderObj?.statusHistory
    if (arrayStatusOrder.value?.length) {
      arrayStatusOrder.value[arrayStatusOrder.value?.length - 1].isActive = true
    }
    dataEdit.value = orderObj
    if (res.data) {
      ruleForm.orderCode = orderObj.code
      sellOrderCode.value = ruleForm.orderCode
      ruleForm.collaborators = orderObj?.collaborator?.id
      ruleForm.discount = orderObj.collaboratorCommission
      ruleForm.customerName =
        orderObj.customer.isOrganization == 'True'
          ? orderObj.customer.representative + ' | ' + orderObj.customer.taxCode
          : orderObj.customer.name + ' | ' + orderObj.customer.phonenumber
      ruleForm.orderNotes = orderObj.description
      totalFinalOrder.value = orderObj.totalPrice
      ListOfProductsForSale.value = orderObj.orderDetails
      customerAddress.value = orderObj.address
      ruleForm.delivery = orderObj.deliveryOption

      totalFinalOrder.value = orderObj.totalPrice - orderObj.discountMoney
      // if (orderObj.customer?.isOrganization) {
      //   infoCompany.name = orderObj.customer?.name
      //   infoCompany.taxCode = orderObj.customer?.taxCode
      //   infoCompany.phone = orderObj.customer?.phonenumber
      //   infoCompany.email = 'Email: ' + orderObj.customer?.email
      // } else {
      //   infoCompany.name = orderObj.customer?.name + ' | ' + orderObj.customer?.taxCode
      //   infoCompany.taxCode = orderObj.customer?.taxCode
      //   infoCompany.phone = orderObj.customer?.phonenumber
      //   infoCompany.email = 'Email: ' + orderObj.customer?.email
      // }
    }
  } else if (type == 'add' || !type) {
  }
  //else if (type == 'add' || !type) {
  //   ListOfProductsForSale.value.push({ ...productForSale })
  // }
}
const infoCustomerId = ref()
const changeAddressCustomer = (data) => {
  infoCustomerId.value = optionsCustomerApi.value.find((e) => e.value.id == data)
  console.log(infoCustomerId.value)
  if (infoCustomerId.value) {
    customerAddress.value = optionsCustomerApi.value?.find((e) => e.value == data)?.address ?? ''
    infoCompany.name = infoCustomerId.value.name
    infoCompany.taxCode = infoCustomerId.value.taxCode
    infoCompany.phone = infoCustomerId.value.phone
    infoCompany.email = 'Email: ' + infoCustomerId.value.email
  }
}

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

// dialog print
const nameDialog = ref('')
const PrintReceipts = ref(false)
// Thêm mới phiếu đề nghị thanh toán
const moneyDeibt = ref()
let moneyDeposit = ref()
let moneyDepositPayment = ref()
// infinity scroll CTV
// Call api danh sách cộng tác viên
const optionsCollaborators = ref()
const checkDisabled = ref(false)
const pageIndexCollaborator = ref(1)
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

const updateStatus = async (status) => {
  EditReceiptAndPaymentVoucherData.value = { ...dataDetail }
  console.log(EditReceiptAndPaymentVoucherData.value)
  EditReceiptAndPaymentVoucherData.value.status = status
  await editReceiptPaymentVoucher(EditReceiptAndPaymentVoucherData.value)
    .then(() => {
      ElNotification({
        message: t('reuse.addSuccess'),
        type: 'success'
      })
    })
    .catch(() =>
      ElNotification({
        message: t('reuse.addFail'),
        type: 'error'
      })
    )
}
onBeforeMount(async () => {
  getListStaff()
  callCustomersApi()
  await editData()
  callApiCollaborators()
  await callApiProductList()
  callApiCity()

  if (type == 'add' || type == ':type') {
    ruleForm.orderCode = curDate
    sellOrderCode.value = autoCodeSellOrder
    codePaymentRequest.value = autoCodePaymentRequest
  }
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
      <div id="recpPaymentPrint">
        <slot>
          <receiptsPaymentPrint
            v-if="formReceipts"
            :dataEdit="formReceipts"
            :nameDialog="nameDialog"
          />
        </slot>
      </div>
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
              id="voucherForm"
              status-icon
              v-if="Object.keys(dataDetail).length > 0"
            >
              <div class="text-sm text-[#303133] font-medium pb-4 dark:text-[#fff]">
                <el-divider content-position="left">{{
                  t('formDemo.informationReceipts')
                }}</el-divider>
              </div>
              <el-form-item :label="t('formDemo.receiptsCode')" prop="orderCode">
                <p style="width: 100%">{{ dataDetail.code }}</p>
              </el-form-item>
              <el-form-item :label="t('reuse.createDate')" prop="orderCode">
                <p style="width: 100%">{{ dateTimeFormat(moment(dataDetail.createdAt)) }}</p>
              </el-form-item>
              <ElFormItem class="mt-5" :label="t('reuse.petitioner')" prop="staffId" required>
                <MultipleOptionsBox
                  :fields="[
                    t('reuse.employeeCode'),
                    t('reuse.phoneNumber'),
                    t('reuse.employeeName')
                  ]"
                  filterable
                  width="700px"
                  :items="optionsStaffApi"
                  valueKey="id"
                  labelKey="label"
                  :hiddenKey="['id']"
                  :placeHolder="t('formDemo.chooseASeller')"
                  :defaultValue="petitionerData"
                  :clearable="false"
                  @update-value="(value, obj) => getValueOfStaffSelected(value, obj)"
                  @scroll-bottom="ScrollStaffBottom"
                />
              </ElFormItem>
              <el-form-item
                :label="t('formDemo.reasonCollectingMoney')"
                prop="reasonCollectingMoney"
                required
              >
                <el-input
                  :disabled="checkDisabled"
                  v-model="dataDetail.description"
                  :placeholder="t('formDemo.reasonCollectingMoney')"
                />
              </el-form-item>
              <div class="flex w-[100%] gap-6">
                <div class="flex-1"
                  ><el-divider content-position="left">{{ t('reuse.subject') }}</el-divider></div
                >
              </div>
              <div class="flex justify-between">
                <ElFormItem
                  :label="t('reuse.selectObject')"
                  class="w-4/5"
                  prop="customerId"
                  width="100%"
                >
                  <MultipleOptionsBox
                    :fields="[
                      t('reuse.customerCode'),
                      t('reuse.phoneNumber'),
                      t('reuse.customerName')
                    ]"
                    filterable
                    class="w-full"
                    width="700px"
                    :items="optionsCustomerApi"
                    valueKey="id"
                    labelKey="label"
                    :hiddenKey="['id']"
                    :placeHolder="t('reuse.selectObject')"
                    :defaultValue="ruleForm.customerName"
                    @update-value="(value, obj) => getValueOfCustomerSelected(value, obj)"
                  />
                </ElFormItem>
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
              <div class="text-sm text-[#303133] font-medium pb-4 dark:text-[#fff]">
                <el-divider content-position="left">{{
                  t('formDemo.billingInformation')
                }}</el-divider>
              </div>
              <ElFormItem :label="t('formDemo.amountCollect')" prop="Price" required>
                <el-input
                  size="default"
                  v-model="dataDetail.totalMoney"
                  :placeholder="t('reuse.placeholderMoney')"
                  :suffixIcon="h('div', 'đ')"
                />
              </ElFormItem>
              <ElFormItem :label="t('formDemo.writtenWords')" prop="Price" required>
                <ElInput
                  size="default"
                  v-model="dataDetail.enterMoney"
                  :placeholder="t('formDemo.writtenWords')"
                />
              </ElFormItem>
              <ElFormItem :label="t('formDemo.formPayment')" prop="Price" required>
                <el-select v-model="dataDetail.typeOfPayment" placeholder="Select">
                  <el-option
                    v-for="item in choosePayment"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </ElFormItem>
              <ElFormItem :label="t('formDemo.planningAccount')" prop="Price">
                <el-select v-model="payment" placeholder="Select">
                  <el-option
                    v-for="item in choosePayment"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </ElFormItem>
              <ElFormItem :label="t('formDemo.paymentSpa')">
                <ElCheckbox
                  class="ml-5"
                  :label="parentingStatusData.title"
                  size="large"
                  v-model="parentingStatusData.value"
                />
              </ElFormItem>
              <ElFormItem
                class="flex align-items-start items-center w-[100%]"
                :label="t('formDemo.status')"
              >
                <div class="flex items-center">
                  <div class="ml-5">
                    <div class="flex items-center">
                      <span
                        class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-neutral-900 dark:bg-transparent"
                      ></span>
                      <span class="box dark:text-black">
                        Khởi tạo & ghi sổ
                        <span class="triangle-right"> </span>
                      </span>
                    </div>

                    <span style="font-style: italic">
                      {{ dateTimeFormat(dataDetail.updatedAt) }}</span
                    >
                  </div>
                </div>
              </ElFormItem>
              <ElFormItem>
                <el-button @click="getFormReceipts()" type="default" class="min-w-42 min-h-11">
                  {{ t('button.print') }}
                </el-button>
                <el-button
                  @click="updateStatus(1)"
                  type="primary"
                  class="min-w-42 min-h-11"
                  v-if="dataDetail.status == 0"
                  >{{ t('button.saveAndWaitApproval') }}</el-button
                >
                <el-button
                  @click="updateStatus(2)"
                  type="default"
                  class="min-w-42 min-h-11"
                  v-if="dataDetail.status == 1"
                >
                  {{ t('button.carrying') }}</el-button
                >
                <el-button
                  @click="updateStatus(3)"
                  type="primary"
                  class="min-w-42 min-h-11"
                  v-if="dataDetail.status == 1"
                  >{{ t('button.plan') }}</el-button
                >
                <el-button
                  @click="updateStatus(4)"
                  v-if="dataDetail.status == 1"
                  :disabled="checkDisabled"
                  type="danger"
                  class="min-w-42 min-h-11"
                  >{{ t('button.cancel') }}</el-button
                >
              </ElFormItem>
            </el-form>
          </div>
          <div class="w-[50%]">
            <div class="text-sm text-[#303133] font-medium p pl-4 dark:text-[#fff]">
              <el-divider content-position="left">{{ t('formDemo.attachments') }}</el-divider>
            </div>
            <div class="flex">
              <div class="pl-5">
                <div class="text-right">{{ t('formDemo.orderCode') }}</div>
              </div>
              <div class="pl-4">
                <p class="text-lg text-[#303133] font-medium p pl-4 dark:text-[#fff]">{{
                  dataDetail.orderCode
                }}</p>
              </div>
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
    <!-- Dialog In phiếu thu chi -->
    <ElDialog v-model="PrintReceipts" class="font-bold" width="40%" align-center>
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
    </ElDialog>
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

#content {
  height: 200px;
  overflow: auto;
  padding: 0 10px;
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
.day-updated {
  position: relative;
  padding-left: 20px;
  width: fit-content;
  color: var(--el-color-primary);
  background: rgba(44, 109, 218, 0.05);
}

.day-updated::after {
  content: '';
  position: absolute;
  top: 0;
  right: -12px;
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 12px solid transparent;
  border-left: 12px solid rgba(44, 109, 218, 0.05);
}

.day-updated::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 12px solid white;
}
</style>
