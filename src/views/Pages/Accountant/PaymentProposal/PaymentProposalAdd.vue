<script setup lang="ts">
import { useI18n } from '@/hooks/web/useI18n'
import {
  ElCollapse,
  ElCollapseItem,
  ElSelect,
  ElOption,
  ElButton,
  ElDivider,
  ElTable,
  ElTableColumn,
  ElInput,
  ElForm,
  ElFormItem,
  ElDatePicker  
} from 'element-plus'
import type {FormRules, FormInstance} from 'element-plus'
import MultipleOptionsBox from '@/components/MultipleOptionsBox.vue'
// import CurrencyInputComponent from '@/components/CurrencyInputComponent.vue'
import {
  GetPaymentRequestDetail,
  getAllStaffList,
  getAllCustomer,
  approvalOrder,
  addDNTT
} from '@/api/Business'
import { onBeforeMount, reactive, ref, watch, h } from 'vue'
import { FORM_IMAGES } from '@/utils/format'
import { dateTimeFormat } from '@/utils/format'
import { useIcon } from '@/hooks/web/useIcon'
import { Collapse } from '../../Components/Type'
import moment from 'moment';
import { useRoute, useRouter } from 'vue-router'

const { t } = useI18n()
const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })

const changeMoney = new Intl.NumberFormat('vi', {
  style: 'currency',
  currency: 'vnd',
  minimumFractionDigits: 0
})

const ruleFormRef = ref<FormInstance>()

//lay du lieu tu router
const router = useRouter()
const route = useRoute()

let id: any = Number(router.currentRoute.value.params.id)
let type = String(route.params.type)
const approvalId = String(route.params.approvalId)

// Validate
const rules = reactive<FormRules>({  
  peopleId: [
   { required: true, message: 'Chọn dữ liệu' },
   { type: 'string', message: 'Chọn giá trị' }   
  ]                      
})

const collapse: Array<Collapse> = [
  {
    icon: minusIcon,
    name: 'generalInformation',
    title: t('formDemo.paymentrequestinformation')
  },
  {
    icon: plusIcon,
    name: 'productAndPayment',
    title: t('formDemo.detailedlistofexpenses')
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
const activeName = ref([collapse[0].name, collapse[1].name])
const ishow= ref(false)
const ishide = ref(true)
// const changeshow = () =>{ return ishow.value=true, ishide.value=false}
// const hide = () =>{ return ishide.value=true,ishow.value=false}
var curDate = 'DNTT' + moment().format('hhmmss')

let form = ref({
attachDocument: false,
code: "",
createdAt: new Date(),
createdBy: "",
idCustomer: '',
debtMoney: 0,
depositeMoney: 0,
description: null,
enterMoney: "",
OrderId: '',
id: undefined,
isDelete: false,
orderId: undefined,
paymentType: true,
peopleId: undefined,
peopleName: null,
pepopleType: 1,
reasonCollectMoney: "",
status: 1,
totalMoney: '',
totalPrice: 0,
updatedAt: "",
updatedBy: ""
})

interface typeOfTableData {
  dayVouchers: any
  note: string
  numberVouchers: string | number
  paymentRequestId: number | undefined
  quantity: number
  spentFor: string
  totalPrice: number
  unitPrice: number
}

const tableData = ref<Array<typeOfTableData>>([])
const tableProduction = ref([
    {
       stt:'',
       masp:'',
       tenhh:'',
       ngayban:'',
       giaban:'',
       giakygui:'',
       giadamphan:'',
       phaitt:'',
       thaotac:''
    }
  ])
 


const deleteRow = (index: number) => {
  tableData.value.splice(index, 1)
}

const deleteRowProduction = (index: number) => {
  tableProduction.value.splice(index, 1)
}

const onAddItem = () => {
  tableData.value.push({    
    dayVouchers: new Date(),
    note: "",
    numberVouchers: "",
    paymentRequestId: undefined,
    quantity: 1,
    spentFor: "",
    totalPrice: 0,
    unitPrice: 0
  })
}
watch(
  () => tableData.value[tableData.value.length - 1],
  () => {
    if (
      tableData.value[tableData.value.length - 1].numberVouchers &&
      tableData.value[tableData.value.length - 1].dayVouchers &&
      tableData.value[tableData.value.length - 1].spentFor &&
      tableData.value[tableData.value.length - 1].quantity &&
      tableData.value[tableData.value.length - 1].unitPrice &&
      tableData.value[tableData.value.length - 1].totalPrice
    )
    onAddItem()
  },
  {
    deep: true
  }
)

const autoCalculate = () =>{
  form.value.totalPrice = 0
  tableData.value.forEach((el) => {
    if (el.numberVouchers && el.unitPrice) {
      form.value.totalPrice += el.totalPrice
    }
  })
  form.value.debtMoney = form.value.totalPrice - form.value.depositeMoney
}

const autoCalculateFun = () => {
  form.value.debtMoney = form.value.totalPrice - form.value.depositeMoney
}

interface typeDetailExpenses {
  numberVouchers: string | number
  dayVouchers: any
  spentFor: string
  quantity: number
  unitPrice: number
  totalPrice: number
  note: string
}

let detailedListExpenses = ref<Array<typeDetailExpenses>>([])
const postData = async() => {
  if (!tableData.value[tableData.value.length - 1].numberVouchers) tableData.value.pop()
  detailedListExpenses.value = tableData.value.map((el) => ({
    numberVouchers: el.numberVouchers,
    dayVouchers: el.dayVouchers,
    spentFor: el.spentFor,
    quantity: el.quantity,
    unitPrice: el.unitPrice,
    totalPrice: el.totalPrice,
    note: el.note
  }))

  const payload = {
    Code: form.value.code,
    TotalMoney: form.value.totalMoney,
    PaymentType: form.value.paymentType,
    PeopleId: form.value.peopleId,
    status: 1,
    PeopleType: 1,
    Description: '',
    Document: undefined,
    AccountingEntryId: undefined,
    ReasonCollectMoney: form.value.reasonCollectMoney,
    EnterMoney: form.value.enterMoney,
    ExpensesDetail: JSON.stringify(detailedListExpenses.value),
    DepositeMoney: form.value.depositeMoney,
    DebtMoney: form.value.debtMoney,
    TotalPrice: form.value.totalPrice
  }

  await addDNTT(FORM_IMAGES(payload))
}

const getDetailPayment = async() => {
  const res = await GetPaymentRequestDetail({id: id})

  form.value = res.data.paymentRequest
  tableData.value = res.data.paymentRequestDetail
  console.log('form:', form.value)
  console.log('formCode: ', form.value.code)
}

const optionsPayments = [
  {
    value: true,
    key: 1,
    label: 'Thanh toán tiền mặt',
  },
  {
    value: false,
    key: 2,
    label: 'Thanh toán qua thẻ',
  }
]

// Danh sách nhân viên
// const currentCreator = ref()
const getStaffList = ref()
const callApiStaffList = async () => {
  const res = await getAllStaffList({ PageIndex: 1, PageSize: 40 })
  getStaffList.value = res.data.map((el) => ({
    value: el?.id,
    label: el?.name + ' | ' + el?.contact
  }))
  // getStaffList.value.push(
  //   {
  //     value: currentCreator.value.id,
  //     label: currentCreator.value.name + ' | ' + currentCreator.value.contact
  //   }
  // )
}

// Call api danh sách khách hàng
// infinity scroll KH
const pageIndexCustomer = ref(1)
const optionsCustomerApi = ref<Array<any>>([])
const callCustomersApi = async () => {
  const res = await getAllCustomer({
    PageIndex: pageIndexCustomer.value,
    PageSize: 20
  })
  const getCustomerResult = res.data
  if (res.data && res.data?.length > 0) {
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

const ScrollCustomerTop = () => {
  scrollCustomerTop.value = true
}

const scrollCustomerTop = ref(false)
const scrollCustomerBottom = ref(false)

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
                id: customer.id
                })
              )
        })
        .catch(() => {
          noMoreCustomerData.value = true
        })
}

const customerName = ref()
const customerPhone = ref()
const customerEmail = ref()
const getValueOfCustomerSelected = (value, obj) => {
  form.value.idCustomer = value
  customerName.value = obj.name
  customerPhone.value = obj.phone
  customerEmail.value = obj.email
}


const { push } = useRouter()
// Duyệt đề nghị thanh toán
const approvalPayments = async (checkApproved) => {
  const payload = { ItemType: 5, Id: parseInt(approvalId), IsApprove: checkApproved }
  await approvalOrder(FORM_IMAGES(payload))
  push({
    name: `accountant.payment-proposal.payment-proposal-list`
  })
}
const disabledEdit = ref(false)
// Xem detail or edit or approved 
const editData = () => {
  if (type == 'approval-payments' || type == 'detail' || type == 'edit') {
    disabledEdit.value = true
    getDetailPayment()
  } else {
    form.value.code = curDate
    onAddItem()
  }
}

onBeforeMount(() => {
  if (type == ':type') type = 'add'
  editData()
  callApiStaffList()
  callCustomersApi()
})
</script>
<template>
  <el-collapse
    v-model="activeName" 
    @change="collapseChangeEvent" 
    :class="['bg-[var(--el-color-white)] dark:(bg-[var(--el-color-black)] border-[var(--el-border-color)] border-1px)']"
  > 
    <el-collapse-item :name="collapse[0].name" >
      <template #title>
        <el-button class="header-icon" :icon="collapse[0].icon" link />
        <span class="text-center text-xl">{{ collapse[0].title }}</span>
      </template>
      <div class="flex gap-4 bg-white">
        <div class="flex-1">
          <el-divider content-position="left">Thông tin đề nghị thanh toán</el-divider>
          <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="160px">
            <el-form-item prop="code" label="Mã phiếu">
              <div>{{ form.code }}</div>
            </el-form-item>
            <el-form-item prop="createdAt" label="Ngày tạo">
              <div>{{ dateTimeFormat(form.createdAt) }}</div>
            </el-form-item>
            <el-form-item label="Người yêu cầu" >
              <el-select v-model="form.peopleId" >
                <el-option
                  v-for="item in getStaffList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="Lý do chi tiền" prop="reasonCollectMoney" >
              <el-input v-model="form.reasonCollectMoney" placeholder="Nhập mô tả" />
            </el-form-item>

            <el-divider content-position="left">Đối tượng</el-divider>
            <el-form-item label="Chọn đối tượng" prop="idCustomer">
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
                :defaultValue="form.idCustomer"
                @scroll-top="ScrollCustomerTop"
                @scroll-bottom="ScrollCustomerBottom"
                @update-value="(value, obj) => getValueOfCustomerSelected(value, obj)"
                :clearable="false"
                />
                
              </el-form-item>
            <el-form-item>
              <div v-if="form.idCustomer">
                  <div> {{ customerName ?? '' }} </div>
                  <div>Số điện thoại: {{ customerPhone ?? '' }}</div>
                  <div>Email: {{ customerEmail ?? '' }}</div>
              </div>              
            </el-form-item>
          </el-form>
        </div>
        <div class="flex-1">
          <el-divider content-position="left">Chứng từ kèm theo</el-divider>
          <div v-if="type !== 'add'" >Mã đơn hàng {{ form?.OrderId }}</div>
        </div>
      </div>
      </el-collapse-item>

      <el-collapse-item :name="collapse[1].name"  v-if="ishide">
        <template #title >
          <el-button class="header-icon" :icon="collapse[1].icon" link/>
          <span class="text-center text-xl">{{ collapse[1].title }}</span>
        </template>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column type="index" label="STT" align="center" width="56" />
          <el-table-column prop="numberVouchers" label="Số chứng từ" width="132" >
            <template #default="props">
              <el-input  v-model="props.row.numberVouchers"/>
            </template>
          </el-table-column>
          <el-table-column prop="dayVouchers" label="Ngày chứng từ" width="132">
            <template #default="props">
                <el-date-picker
                  v-model="props.row.dayVouchers"
                  type="date"
                  placeholder="Pick a day"
                  format="DD/MM/YYYY"
                />
            </template>
          </el-table-column>
          <el-table-column prop="spentFor" label="Nội dung chi" width="436" >
            <template #default="props">
                  <el-input v-model="props.row.spentFor" />
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="Số lượng" width="150">
            <template #default="props">
              <el-input
                v-model="props.row.quantity"
                @change="
                  () => {
                    props.row.totalPrice = props.row.unitPrice * props.row.quantity
                    autoCalculate()
                  }
                "
              />
            </template>
          </el-table-column>
          <el-table-column prop="price" label="Đơn giá" width="150">
              <template #default="props">
                <el-input
                v-model="props.row.unitPrice" 
                @change="
                  () => {
                    props.row.totalPrice = props.row.unitPrice * props.row.quantity
                    autoCalculate()
                  }
                "/>
            </template>
          </el-table-column>
          <el-table-column prop="totalPrice" label="Thành tiền" width="150" >
            <template #default="props">
                {{ props.row.totalPrice }}
            </template>
          </el-table-column>
          <el-table-column prop="note" label="Ghi chú">
            <template #default="props">
              <el-input v-model="props.row.note" />
            </template>            
          </el-table-column>
          <el-table-column label="Thao Tác" width="86">
            <template #default="scope">
              <el-button size="small" type="danger" @click.prevent="deleteRow(scope.$index)" >Xóa</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="flex justify-end">
          <div class="total flex flex-col mt-4 w-[880px]">
            <div class="flex gap-4">
              <label class="w-[10%] text-right font-bold">Tổng tiền</label>
              <span class="w-[170px] text-right">{{ changeMoney.format(form.totalPrice) }}</span>
            </div>
            <div class="flex gap-4">
              <label class="w-[10%] text-right">Đặt cọc</label>
              <span class="w-[170px] text-right">
                <el-input @change="autoCalculateFun" placeholder="đ" class="poi_text_right" v-model="form.depositeMoney" />
              </span>
            </div>
            <div class="flex gap-4">
              <label class="w-[10%] text-right text-red-500">Còn lại</label>
              <span class="w-[170px] text-right">{{ changeMoney.format(form.debtMoney) }}</span>
            </div>
          </div>
        </div>
        <el-divider content-position="left" >Thông tin thanh toán</el-divider>
        <div class="flex flex-row">
          <el-form :model="form" label-width="160px" class="basis-1/2" >
            <el-form-item 
              label="Số tiền chi" 
              tabindex="Nhập số tiền"
              :rules="[
                { required: true, message: 'Nhập số tiền', trigger: 'change' }
                                         
              ]">
                <el-input
                  v-model="form.totalMoney"
                  size="default"
                  :placeholder="t('reuse.placeholderMoney')"
                  :suffixIcon="h('div', 'đ')"
                />
              <!-- <el-input v-model="form.totalMoney" :parser="(value) => changeMoney.format(value)" placeholder="Nhập số tiền" /> -->
              <!-- <CurrencyInputComponent
                v-model="form.totalMoney"
                v-if="type != 'detail'"
              /> -->
            </el-form-item>
            <el-form-item
              label="Viết bằng chữ"
              :rules="[
                { required: true, message: 'Nhập chữ' },
                { type: 'string', message: 'Nhập chữ' },
                                  
                ]"
              >
                <el-input v-model="form.enterMoney" placeholder="Viết bằng chữ" />
            </el-form-item>
            <el-form-item
              label="Hình thức thanh toán" 
              :rules="[
                { required: true, message: 'Viết bằng chữ' },
                { type: 'string', message: 'Viết bằng chữ' },
              ]"
            >
              <el-select v-model="form.paymentType" placeholder="Select">
                <el-option
                  v-for="item in optionsPayments"
                  :key="item.key"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="Trạng thái" class="day-update-wrap">
              <span class="day-updated">
                Khởi tạo & ghi số
              </span>
            </el-form-item>
            <el-form-item>
              <div class="dateCreated">
                <label> {{ dateTimeFormat(moment()) }} </label>
              </div>
            </el-form-item>
            <el-form-item v-if="type != 'approval-payments'">
              <el-button>In phiếu</el-button>
              <el-button type="primary" @click="postData">Lưu và chờ duyệt</el-button>
              <el-button type="danger">Hủy</el-button>
            </el-form-item>
            <el-form-item v-else>
              <el-button @click="approvalPayments(true)" type="warning">Duyệt</el-button>
              <el-button @click="approvalPayments(false)">Không duyệt</el-button>
            </el-form-item>
          </el-form>
        </div>

      </el-collapse-item>
      <el-collapse-item :name="collapse[2].name" v-if="ishow">
              <template #title >
                <el-button class="header-icon" :icon="collapse[2].icon" link/>
                <span class="text-center text-xl">{{ collapse[2].title }}</span>
              </template>
              <el-table :data="tableProduction" border style="width: 100%">
                <el-table-column type="index" label="STT" width="80" />
                <el-table-column prop="msp" label="Mã sản phẩm" width="100" >
                      <!-- <template #default="props">
                          <el-input  v-model="props.row.masp"/>
                      </template> -->
                </el-table-column>
                <el-table-column prop="tenhh" label="Tên hàng hóa" >
                    <!-- <template #default="props">
                        <el-date-picker
                          v-model="props.row.date"
                          type="date"
                          placeholder="Pick a day"
                          format="DD/MM/YYYY"
                        />
                    </template> -->
                </el-table-column>
                <el-table-column prop="ngayban" label="Ngày bán" >
                      <!-- <template #default="props">
                            <el-input v-model="props.row.content" />
                      </template> -->
                </el-table-column>
                <el-table-column prop="giaban" label="Gía bán" >
                      <!-- <template #default="props">
                          <el-input v-model="props.row.quanti" />
                    </template> -->
                </el-table-column>
                <el-table-column prop="giakygui" label="Gía ký gửi" >
                      <!-- <template #default="props">
                          <el-input v-model="props.row.price" />
                      </template> -->
                </el-table-column>
                <el-table-column prop="giadamphan" label="Gía đàm phám" >
                      <!-- <template #default="props">
                          <el-input v-model="props.row.total" />
                      </template> -->
                </el-table-column>
                <el-table-column prop="phaitt" label="Phải thanh toán trước" >
                      <!-- <template #default="props">
                        <el-input v-model="props.row.note" />
                      </template>             -->
                </el-table-column>
                <el-table-column label="Thao Tác" >
                      <template #default="scope">
                          <el-button size="small" type="danger" @click.prevent="deleteRowProduction(scope.$index)" >Xóa</el-button>
                      </template>
                </el-table-column>
              </el-table>
              
            <el-divider content-position="left" >Thông tin thanh toán</el-divider>
                <div class="flex flex-row">
                        <el-form :model="form" label-width="160px" class="basis-1/2" >
                                    <el-form-item 
                                            label="Số tiền chi" tabindex="" prop="name" :rules="
                                           [
                                          { required: true, message: 'Nhập số tiền' },
                                          { type: 'number', message: 'Nhập số tiền' },
                                    
                                          ]">
                                            <el-input v-model="form.reasonCollectMoney" placeholder="Nhập số tiền" />
                                    </el-form-item>
                                    <el-form-item
                                          label="Viết bằng chữ" prop="name" :rules="[
                                        { required: true, message: 'Nhập chữ' },
                                        { type: 'string', message: 'Nhập chữ' },
                                  
                                        ]">
                                              <el-input v-model="form.reasonCollectMoney" placeholder="Viết bằng chữ" />
                                    </el-form-item>
                                    <el-form-item
                                          label="Hình thức thanh toán" :rules="[
                                          { required: true, message: 'Viết bằng chữ' },
                                          { type: 'string', message: 'Viết bằng chữ' },
                                          ]">
                                              <el-select class="w-[100%]" v-model="form.peopleId" placeholder="Thanh toán tiền mặt">
                                                <el-option label="Zone one" value="shanghai" />
                                                <el-option label="Zone two" value="beijing" />
                                              </el-select>
                                    </el-form-item>
                                    <el-form-item label="Trạng thái ">
                                          <span class="day-updated">
                                            Khởi tạo & ghi số
                                          </span>
                                    </el-form-item>
                                    <el-form-item>
                                          <div>
                                            <label class="dateCreated" > {{ dateTimeFormat(moment()) }} </label>
                                          </div>
                                    </el-form-item>
                                    <el-form-item >
                                          <el-button>In phiếu</el-button>
                                          <el-button type="primary" @click="postData">Lưu và chờ duyệt</el-button>
                                          <el-button type="danger">Hủy</el-button>
                                    </el-form-item>
                        </el-form>
                </div>
      </el-collapse-item>
      </el-collapse>
</template>  
<style scoped lang="less">
.requied{
  color: red;
}
::v-deep(.el-select){
  width: 100%;
}
::v-deep(.el-form-item) {
  .dateCreated {
    color: #65676B;
    font-weight: 400;
    font-size: 10px;
    font-style: italic;
  }
}
::v-deep(.poi_text_right > .el-input__wrapper > .el-input__inner){
  text-align: right;
}
::ve-deep(.collapse-margin){
  margin-top: 30px;
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
  border-top: 14px solid transparent;
  border-bottom: 18px solid transparent;
  border-left: 12px solid rgba(44, 109, 218, 0.05);
}

.day-updated::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  border-top: 16px solid transparent;
  border-bottom: 16px solid transparent;
  border-left: 12px solid white;
}

::v-deep(.el-table td.el-table__cell div) {
  width: 100%;
}
</style>