<script setup lang="ts">
import { getStaff } from '@/api/Warehouse'
import { useI18n } from '@/hooks/web/useI18n'
import { useIcon } from '@/hooks/web/useIcon'
import { useValidator } from '@/hooks/web/useValidator'
import { ElButton, ElDivider, ElInput, ElForm, ElFormItem, FormRules } from 'element-plus'
import MultipleOptionsBox from '@/components/MultipleOptionsBox.vue'
import { onBeforeMount, reactive, ref, unref } from 'vue'
import { getAllCustomer } from '@/api/Business'

const { t } = useI18n()
const { required } = useValidator()
const plusIcon = useIcon({ icon: 'akar-icons:plus' })

defineProps({
  type: {
    type: String,
    default: ''
  },
  id: {
    type: Number,
    default: NaN
  }
})
const emit = defineEmits(['open-dialog'])
onBeforeMount(() => {
  getListStaff(), callCustomersApi()
})

type FormDataInput = {
  TicketId: string
  CreatedAt: Date
  CollaboratorStatus: boolean
  Discount: string
  customersValue: any
  isActive?: boolean
  status?: string
  staffValue: any
}
const EmptyCustomData = {} as FormDataInput
let FormData = reactive(EmptyCustomData)
const disabledForm = ref(false)
const rules = reactive<FormRules>({
  Discount: [
    required(),
    {
      validator: (_rule: any, value: any, callback: any) => {
        if (value > 100) {
          callback(new Error(t('reuse.checkDiscount')))
        }
        callback()
      },
      required: false,
      trigger: 'change'
    }
  ],
  customersValue: [required()]
})
let infoCompany = reactive({
  name: '',
  taxCode: '',
  phone: '',
  email: '',
  representative: '',
  phonenumber: '',
  address: '',
  bankId: '',
  accountName: '',
  accountNumber: '',
  bankName: '',
  CustomerId: '',
  cccd: '',
  cccdCreateAt: '',
  cccdPlaceOfGrant: '',
  sex: '',
  doB: ''
})
const optionsStaffApi = ref()
const optionsCustomerApi = ref<Array<any>>([])
const callCustomersApi = async () => {
  const res = await getAllCustomer({ PageIndex: 1, PageSize: 20 })
  const getCustomerResult = res.data
  if (Array.isArray(unref(getCustomerResult)) && getCustomerResult?.length > 0) {
    optionsCustomerApi.value = getCustomerResult.map((customer) => ({
      code: customer.code,
      phone: customer.phonenumber,
      name: customer.name,
      label: customer.name + ' | ' + customer.phonenumber,
      email: customer.email,
      id: customer.id
    }))
  }
}
let customerAddress = ref('')
const clear = () => {
  infoCompany.name = ''
  infoCompany.taxCode = ''
  infoCompany.phone = ''
  infoCompany.email = ''
  infoCompany.representative = ''
  infoCompany.phonenumber = ''
  infoCompany.address = ''
  infoCompany.bankId = ''
  infoCompany.accountName = ''
  infoCompany.accountNumber = ''
  infoCompany.bankName = ''
  infoCompany.CustomerId = ''
}
const getValueOfStaffSelected = (_value, __data) => {}

const getValueOfCustomerSelected = (_value, obj) => {
  console.log('obj Customer:', obj)
  infoCompany.name = obj.name
  infoCompany.phonenumber = obj.phone
  infoCompany.email = obj.email
}
const openQuickAddDialog = () => {
  emit('open-dialog')
}
const formattedToday = ref('')
const getDateToday = () => {
  const today = new Date()
  const yyyy = today.getFullYear()
  let mm: any = today.getMonth() + 1 // Months start at 0!
  let dd: any = today.getDate()

  if (dd < 10) {
    dd = '0' + dd
  }
  if (mm < 10) {
    mm = '0' + mm
  }
  formattedToday.value = dd + '/' + mm + '/' + yyyy
}
getDateToday()

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
                  code: customer.code,
                  phone: customer.phonenumber,
                  name: customer.name,
                  label: customer.name + ' | ' + customer.phonenumber,
                  email: customer.email,
                  id: customer.id
                })
              )
        })
        .catch(() => {
          noMoreCustomerData.value = true
        })
}
const scrollStaffBottom = ref(false)
const pageIndexStaff = ref(1)
const noMoreStaffData = ref(false)
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
</script>
<template>
  <div class="w-[50%]">
    <ElForm
      ref="ruleFormRef"
      :model="FormData"
      :disabled="disabledForm"
      :rules="rules"
      hide-required-asterisk
      label-width="170px"
      status-icon
    >
      <el-divider content-position="left">{{ t('reuse.profileWareHouse') }}</el-divider>

      <ElFormItem :label="t('reuse.formCode')" prop="TicketId" />
      <ElFormItem :label="t('reuse.createDate')">
        <div class="pl-6">{{ formattedToday }}</div>
      </ElFormItem>
      <ElFormItem class="mt-5" :label="t('reuse.petitioner')">
        <div class="flex">
          <label><span class="text-red-600"> *</span></label>
          <MultipleOptionsBox
            :fields="[t('reuse.employeeCode'), t('reuse.phoneNumber'), t('reuse.employeeName')]"
            filterable
            width="700px"
            :items="optionsStaffApi"
            valueKey="id"
            labelKey="label"
            :hiddenKey="['id']"
            :placeHolder="t('formDemo.chooseASeller')"
            :defaultValue="FormData.customersValue"
            :clearable="false"
            @update-value="(value, obj) => getValueOfStaffSelected(value, obj)"
            @scroll-bottom="ScrollStaffBottom"
          />
        </div>
      </ElFormItem>
      <ElFormItem class="mb-7" :label="t('reuse.note')" prop="Discount">
        <div class="flex">
          <label><span class="text-red-600"> *</span></label>
          <ElInput
            v-model="FormData.Discount"
            size="default"
            :placeholder="t('reuse.enterNote')"
            :formatter="(value) => value.replace(/^\s+|\s+$/gm, '')"
          />
        </div>
      </ElFormItem>
      <el-divider class="mt-10" content-position="left">{{ t('reuse.subject') }}</el-divider>
      <ElFormItem class="mt-5" :label="t('reuse.selectObject')">
        <div class="flex">
          <label><span class="text-red-600"> *</span></label>
          <MultipleOptionsBox
            :fields="[t('reuse.customerCode'), t('reuse.phoneNumber'), t('reuse.customerName')]"
            filterable
            width="700px"
            :items="optionsCustomerApi"
            valueKey="id"
            labelKey="label"
            :hiddenKey="['id']"
            :placeHolder="t('formDemo.chooseACustomer')"
            :defaultValue="FormData.customersValue"
            :clearable="false"
            @update-value="(value, obj) => getValueOfCustomerSelected(value, obj)"
            @scroll-bottom="ScrollCustomerBottom"
          />
          <el-button @click="openQuickAddDialog" :icon="plusIcon" style="padding: 8px 30px">{{
            t('button.add')
          }}</el-button>
        </div>
      </ElFormItem>
      <ElFormItem :label="t('formDemo.customerName')" v-if="infoCompany.name">
        <div class="leading-4">
          <div class="ml-5">{{ infoCompany.name }}</div>
        </div>
      </ElFormItem>
      <ElFormItem
        class="w-[100%]"
        style="display: inline-block"
        :label="t('reuse.phoneNumber')"
        v-if="infoCompany.phonenumber"
      >
        <div class="leading-4">
          <div class="ml-5">{{ infoCompany.phonenumber }}</div>
        </div>
      </ElFormItem>
      <ElFormItem
        class="w-[100%]"
        style="display: inline-block"
        :label="t('reuse.email')"
        v-if="infoCompany.email"
      >
        <div class="leading-4">
          <div class="ml-5">{{ infoCompany.email }}</div>
        </div>
      </ElFormItem>
    </ElForm>
  </div>
  <div class="w-[50%]">
    <div class="text-sm text-[#303133] font-medium p pl-4 dark:text-[#fff]">
      <el-divider content-position="left">{{ t('formDemo.documentsAttached') }}</el-divider>
    </div>
    <ElFormItem
      class="w-[100%]"
      style="display: inline-block"
      :label="t('reuse.orderCode')"
      v-if="infoCompany.email"
    />
  </div>
</template>
