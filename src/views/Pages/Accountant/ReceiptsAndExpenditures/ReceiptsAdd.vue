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
  ElDialog,
  ElTreeSelect
} from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { Collapse } from '../../Components/Type'
import { useRouter } from 'vue-router'
import moment from 'moment'
import MultipleOptionsBox from '@/components/MultipleOptionsBox.vue'
import {
  getDetailReceiptPaymentVoucher,
  getProductsList,
  getCollaboratorsInOrderList,
  getAllCustomer,
  // editStatusReceiptPaymentVoucher,
  getStaffList
} from '@/api/Business'
import { FORM_IMAGES } from '@/utils/format'
import { getCity } from '@/utils/Get_Address'
import type { FormRules } from 'element-plus'
import { getStaff } from '@/api/Warehouse'
import receiptsPaymentPrint from '../../Components/formPrint/src/receiptsPaymentPrint.vue'
import { CreateANewReceiOrPayment, EditAReceiptOrPaymentVoucher } from '@/api/Accountant'
import { appModules } from '@/config/app'
const { utility } = appModules
const { t } = useI18n()
//lay du lieu tu router
const router = useRouter()
const id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)
const optionsStaffApi = ref()
var curDate = 'PT' + moment().format('hhmmss')
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

const lableReceiptsPayment = reactive({
  lableInformation: t('formDemo.informationReceipts'),
  lableCode: t('formDemo.receiptsCode'),
  lableReason : t('formDemo.reasonCollectingMoney'),
  lableAmount: t('formDemo.amountCollect'),
})
if (router.currentRoute.value.name == 'accountant.receipts-expenditures.payment-add') {
  lableReceiptsPayment.lableInformation = t('formDemo.paymentVoucherInformation')
  lableReceiptsPayment.lableCode = t('formDemo.codePayment')
  lableReceiptsPayment.lableReason = t('formDemo.reasonsSpendMoney')
  lableReceiptsPayment.lableAmount = t('formDemo.amountSpent')
}
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


// form phiếu thu
let formReceipts = ref<any>()
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
const parentingStatusData = ref({ title: 'Không xác định', value: false })
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
  status: number | undefined
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


const scrollCustomerTop = ref(false)
const scrollCustomerBottom = ref(false)
const pageIndexCustomer = ref(1)

const ScrollCustomerTop = () => {
  scrollCustomerTop.value = true
}
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
                })
              )
        })
        .catch(() => {
          noMoreCustomerData.value = true
        })
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
  infoCompany.name = obj.label
  infoCompany.phone = obj.phone
  infoCompany.email = obj.email
  changeAddressCustomer(value)
  customerID.value = value
  formAddress.province = obj.provinceId != null ? obj.provinceId : ''
  formAddress.district = obj.districtId != null ? obj.districtId : ''
  formAddress.wardCommune = obj.wardId != null ? obj.wardId : ''
  formAddress.detailedAddress = obj.address != null ? obj.address : ''
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

const printPage = (id: string, { url, title, w, h }) => {
  const printContents = document.getElementById(id)?.innerHTML

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
const inputRecharger = ref()

const staff = localStorage.getItem('STAFF_INFO')?.toString() || ''
const staffInfo = JSON.parse(staff) || ''
const staffItem = JSON.parse(staffInfo?.v) || ''
// inputRecharger.value = staffItem?.id
if(type == ':type') inputRecharger.value = staffItem?.name + ' | ' + staffItem?.phone

const scrollingRecharger = (e) => {
  const clientHeight = e.target.clientHeight
  const scrollHeight = e.target.scrollHeight
  const scrollTop = e.target.scrollTop
  if (scrollTop == 0) {
    scrollRechargerTop.value = true
  }
  if (scrollTop + clientHeight >= scrollHeight) {
    ScrollRechargerBottom()
  }
}

//lấy danh sách staff
const optionsRecharger = ref()

const pageIndexRecharger = ref(1)
const callApiRecharger = async () => {
  const res = await getStaffList({
    PageIndex: pageIndexRecharger.value,
    PageSize: 20
  })
  if (res.data && res.data?.length > 0) {
    optionsRecharger.value = res.data.map((recharger) => ({
      label: recharger.name + ' | ' + recharger.phonenumber,
      value: recharger.id
    }))
  }
}


const valueTree = ref()

const dataTree = [
  {
    value: 1,
    label: '111 | Tiền mặt',
    children: [],
  },
  {
    value: 1,
    label: '112 | Tiền gửi ngân hàng',
    children: [
      {
        value: 21,
        label: '1121 | Teckcombank',
      },
      {
         value: 22,
            label: '1122 | Vietcombank',
      },
    ],
  },
  {
    value: 3,
    label: '113 | Doanh thu bán hàng',
    children: [
      {
        value: '3-1',
        label: 'Level two 3-1',
        children: [
          {
            value: '3-1-1',
            label: 'Level three 3-1-1',
          },
        ],
      },
    ],
  },
  {
    value: 4,
    label: '114 | Doanh thu cho thuê',
    children: [
      {
        value: '3-1',
        label: 'Level two 3-1',
        children: [
          {
            value: '3-1-1',
            label: 'Level three 3-1-1',
          },
        ],
      },
    ],
  },
]

const scrollRechargerTop = ref(false)
const scrollRechargerBottom = ref(false)
const noMoreRechargerData = ref(false)

const ScrollRechargerBottom = () => {
  scrollRechargerBottom.value = true
  pageIndexCollaborator.value++
  noMoreRechargerData.value
    ? ''
    : getStaffList({ PageIndex: pageIndexRecharger.value, PageSize: 20 })
        .then((res) => {
          res.data.length == 0
            ? (noMoreRechargerData.value = true)
            : res.data.map((el) =>
                optionsRecharger.value.push({
                  label: el.name + ' | ' + el.phoneNumber,
                  value: el.id
                })
              )
        })
        .catch(() => {
          noMoreRechargerData.value = true
        })
}

let listStatus = ref([
  {
    color: 'info',
    text: t('reuse.initializeAndWrite')
  }
  // {
  //   color: 'warning',
  //   text: t('reuse.checkReceipts')
  // },
  // {
  //   color: 'class="status bg-gray-300 day-updated text-blue-500',
  //   text: t('reuse.collectedMoney')
  // },
  // {
  //   color: 'class="status bg-gray-300 day-updated text-blue-500',
  //   text: t('reuse.planned')
  // },
  // {
  //   color: 'status bg-gray-300 day-updated text-red-500',
  //   text: t('reuse.cancelled')
  // }
])
// total order
let dataDetail = ref<ReceiptOrPaymentVoucherDetail>({
  code: '',
  type: '',
  description: '',
  totalMoney: 0,
  typeOfPayment: 1,
  peopleType: 0,
  peopleName: '',
  peopleId: '',
  status: 0,
  accountNumber: '',
  accountName: '',
  accountingDate: '',
  id: 0,
  createdAt: moment().format('DD/MM/YYYY'),
  createdBy: '',
  customerId: '',
  updatedAt: '',
  orderId: 0,
  orderCode: '',
  enterMoney: ''
})
const checkDisabelDetail = ref(false)

const infoCustomerId = ref()

const changeAddressCustomer = (data) => {
  infoCustomerId.value = optionsCustomerApi.value.find((e) => e.value.id == data)
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
// const checkDisabled = ref(false)
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
const { push } = useRouter()

const postData = async () => {
  const payload = {
    Code : dataDetail.value.code,
    TotalMoney : dataDetail.value.totalMoney,
    TypeOfPayment :dataDetail.value.typeOfPayment ,
    status : 1,
    PeopleType: 2,
    PeopleId  : customerID.value,
    OrderId : 2123 ,
    Type : type == 'undefined' ? 0 : 1,
    Description: dataDetail.value.description,
    Document: [],
    AccountingEntryId: valueTree.value ?? 0,
    EnterMoney: dataDetail.value.enterMoney, 
  }

  await CreateANewReceiOrPayment(FORM_IMAGES(payload))
    .then(() => {
      ElNotification({
        message: t('reuse.addSuccess'),
        type: 'success'
      }),
        push({
          name: 'accountant.receipts-expenditures.receipts-expenditures-list',
          params: { backRoute: 'accountant.receipts-expenditures.receipts-expenditures-list' }
        })
    })
    .catch((res) =>
      ElNotification({
        message: res.response.data.message,
        type: 'warning'
      })
    )
}
const { go } = useRouter()

const editDataBtn = () => {
  if(type == 'detail' || type == 'edit') push({
          name: `accountant.receipts-expenditures.receipts-expenditures-list.${utility}`,
          params: { type: 'edit', id: id }
        })
}

const saveDataEdit = async () => {
  const payload = {
    Id: id,
    TotalMoney : dataDetail.value.totalMoney,
    TypeOfPayment :dataDetail.value.typeOfPayment ,
    status : 1,
    PeopleType: 2,
    PeopleId  : customerID.value,
    Type : 1,
    Description: dataDetail.value.description,
    AccountingEntryId: valueTree.value ?? 0,
    EnterMoney: dataDetail.value.enterMoney, 
  }
  await EditAReceiptOrPaymentVoucher(FORM_IMAGES(payload))
    .then(() => {
      ElNotification({
        message: t('reuse.updateSuccess'),
        type: 'success'
      }),
        push({
          name: 'accountant.receipts-expenditures.receipts-expenditures-list',
          params: { backRoute: 'accountant.receipts-expenditures.receipts-expenditures-list' }
        })
    })
    .catch((res) =>
      ElNotification({
        message: res.response.data.message,
        type: 'warning'
      })
    )
}

// const updateStatus = async (status: number) => {
//   const payload = {
//     status: status,
//     TypeOfPayment: dataDetail.value.typeOfPayment,
//     PeopleType: dataDetail.value.peopleType,
//     PeopleId: dataDetail.value.peopleId,
//     Id: dataDetail.value.id,
//     Type: 1
//   }
//   const formDataPayLoad = FORM_IMAGES(payload)
//   await editStatusReceiptPaymentVoucher(formDataPayLoad).then(() => {
//     ElNotification({
//       message: t('reuse.addSuccess'),
//       type: 'success'
//     })
//   })
// }

const editData = async () => {
  if (type == 'detail') checkDisabelDetail.value = true

  if (type == 'edit' || type == 'detail') {
    var su = await getDetailReceiptPaymentVoucher({ id: id })
    // console.log('su: ', su)
    if (su.data) dataDetail.value = Object.assign({}, su?.data)
    if (dataDetail.value.typeOfPayment == 2) {
      lableReceiptsPayment.lableInformation = t('formDemo.paymentVoucherInformation')
      lableReceiptsPayment.lableCode = t('formDemo.codePayment')
      lableReceiptsPayment.lableReason = t('formDemo.reasonsSpendMoney')
      lableReceiptsPayment.lableAmount = t('formDemo.amountSpent')
    }
    var cus = optionsCustomerApi.value.find((x) => x.id == dataDetail.value.customerId)
    getValueOfCustomerSelected(dataDetail.value.customerId, cus)

    inputRecharger.value = staffItem?.name + ' | ' + staffItem?.phone


    // arrayStatusOrder.value = orderObj?.statusHistory
    // if (arrayStatusOrder.value?.length) {
    //   arrayStatusOrder.value[arrayStatusOrder.value?.length - 1].isActive = true
    // }



    }
}

onBeforeMount(async () => {
  callApiRecharger()
  getListStaff()
  callCustomersApi()
  await editData()
  callApiCollaborators()
  await callApiProductList()
  callApiCity()
  if (type == 'add' || type == ':type' || type == 'undefined') {
    dataDetail.value.code = curDate
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
                  lableReceiptsPayment.lableInformation
                }}</el-divider>
              </div>
              <el-form-item :label="lableReceiptsPayment.lableCode" prop="orderCode">
                <p style="width: 100%">{{ dataDetail.code }}</p>
              </el-form-item>
              <el-form-item :label="t('reuse.createDate')" prop="orderCode">
                <p style="width: 100%" v-if="type == 'detail' || type == 'edit' ">{{ dateTimeFormat(dataDetail.createdAt) }}</p>
                <p style="width: 100%" v-else>{{ dataDetail.createdAt }}</p>      
              </el-form-item>

              <el-form-item class="mt-5" :label="t('reuse.petitioner')" prop="staffId">
                <el-select v-model="inputRecharger" :disabled="checkDisabelDetail" placeholder="Chọn người đề nghị">
                <div @scroll="scrollingRecharger" id="content">
                  <el-option
                    v-for="item in optionsRecharger"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </div>
              </el-select>

              </el-form-item> 

              <el-form-item
                :label="lableReceiptsPayment.lableReason"
                prop="reasonCollectingMoney"
                >
                <el-input
                :disabled="checkDisabelDetail"
                  v-model="dataDetail.description"
                  :placeholder="t('formDemo.enterDescription')"
                />
              </el-form-item>
              <div class="flex w-[100%] gap-6">
                <div class="flex-1"
                  ><el-divider content-position="left">{{ t('reuse.subject') }}</el-divider>
                </div>
              </div>
              <div class="flex justify-between">
                <ElFormItem
                  :label="t('reuse.selectObject')"
                  class="w-full"
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
                    :disabled="checkDisabelDetail"
                    valueKey="id"
                    labelKey="label"
                    :hiddenKey="['id']"
                    :placeHolder="t('reuse.selectObject')"
                    @scroll-top="ScrollCustomerTop"
                    @scroll-bottom="ScrollCustomerBottom"
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
                    <div>Email: {{ infoCompany.email }}</div>
                  </div>
                </div>
              </el-form-item>
              <div class="text-sm text-[#303133] font-medium pb-4 dark:text-[#fff]">
                <el-divider content-position="left">{{
                  t('formDemo.billingInformation')
                }}</el-divider>
              </div>
              <ElFormItem :label="lableReceiptsPayment.lableAmount" prop="Price">
                <el-input
                  size="default"
                  :disabled="checkDisabelDetail"
                  v-model="dataDetail.totalMoney"
                  :placeholder="t('reuse.placeholderMoney')"
                  :suffixIcon="h('div', 'đ')"
                  :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                  :clearable="true"
                  type="number" 
                />
              </ElFormItem>
              <ElFormItem :label="t('formDemo.writtenWords')" prop="Price">
                <ElInput
                  size="default"
                  :disabled="checkDisabelDetail"
                  v-model="dataDetail.enterMoney"
                  :placeholder="t('formDemo.writtenWords')"
                />
              </ElFormItem>
              <ElFormItem :label="t('formDemo.formPayment')"  prop="Price">
                <el-select v-model="dataDetail.typeOfPayment" :disabled="checkDisabelDetail" placeholder="Select">
                  <el-option
                      v-for="item in choosePayment"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                </el-select>
              </ElFormItem>
              
              <ElFormItem :label="t('formDemo.planningAccount')" prop="Price">
                  <el-tree-select
                  v-model="valueTree"
                  :data="dataTree"
                  :disabled="checkDisabelDetail"
                  check-strictly
                  :render-after-expand="false"
                  show-checkbox
                />
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
                  <div class="ml-5" v-for="(item, index) in listStatus" :key="index">
                    <div class="flex items-center">
                      <span
                        class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-neutral-900 dark:bg-transparent"
                      ></span>
                      <span class="box" :type="item.color">
                        {{ item.text }}
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
                <div class="edit-click" v-if="type == 'edit'">
                  <el-button
                  @click="saveDataEdit"
                  type="primary"
                  class="min-w-42 min-h-11"
                  >{{ t('reuse.save') }}</el-button
                >
                <el-button
                  
                  @click="go(-1)"
                  type="primary"
                  class="min-w-42 min-h-11"
                  >{{ t('button.cancel') }}</el-button
                >
                </div>
              
                <el-button
                  @click="getFormReceipts()"
                 v-if="type == 'detail'"
                 type="default" class="min-w-42 min-h-11">
                  {{ t('button.print') }}
                </el-button>
                <el-button
                  @click="postData"
                  type="primary"
                  class="min-w-42 min-h-11"
                  v-if="dataDetail.status == 0 && type !== 'edit'"
                  >{{ t('button.saveAndWaitApproval') }}</el-button
                >

                <el-button
                  v-if="type == 'detail'"
                  @click="editDataBtn"
                  type="primary"
                  class="min-w-42 min-h-11"
                  >{{ t('button.edit') }}</el-button
                >

                <!-- <el-button
                  @click="updateStatus(2)"
                  type="default"
                  class="min-w-42 min-h-11"
                  v-if="dataDetail.status == 1 && type !== 'edit'"
                >
                  {{ t('button.carrying') }}</el-button
                >
                <el-button
                  @click="updateStatus(3)"
                  type="primary"
                  class="min-w-42 min-h-11"
                  v-if="dataDetail.status == 1 && type !== 'edit'"
                  >{{ t('button.plan') }}</el-button
                >
                <el-button
                  @click="updateStatus(4)"
                  v-if="dataDetail.status == 1 && type !== 'edit'"
                  :disabled="checkDisabled"
                  type="danger"
                  class="min-w-42 min-h-11"
                  >{{ t('button.cancel') }}</el-button
                > -->
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
    /* Hidden by default */
    position: fixed;
    top: 0;

    /* Sit on top */
    left: 0;

    /* Stay in place */
    z-index: 10;
    display: block;
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
  padding: 0 10px;
  overflow: auto;
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

.day-updated {
  position: relative;
  width: fit-content;
  padding-left: 20px;
  color: var(--el-color-primary);
  background: rgb(44 109 218 / 5%);
}

.day-updated::after {
  position: absolute;
  top: 0;
  right: -12px;
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 12px solid transparent;
  border-left: 12px solid rgb(44 109 218 / 5%);
  content: '';
}

.day-updated::before {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 12px solid white;
  content: '';
}
</style>
