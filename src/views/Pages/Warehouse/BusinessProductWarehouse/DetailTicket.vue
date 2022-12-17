<script setup lang="ts">
import { getStaff } from '@/api/Warehouse'
import { useI18n } from '@/hooks/web/useI18n'
import { useIcon } from '@/hooks/web/useIcon'
import { useValidator } from '@/hooks/web/useValidator'
import { ElButton, ElDivider, ElInput, ElForm, ElFormItem } from 'element-plus'
import MultipleOptionsBox from '@/components/MultipleOptionsBox.vue'
import { computed, onBeforeMount, reactive, ref, unref } from 'vue'
import { getAllCustomer } from '@/api/Business'
import QuickAddCustomer from './QuickAddCustomer.vue'
import type { FormInstance, FormRules } from 'element-plus'
import { dateTimeFormat } from '@/utils/format'

const { t } = useI18n()
const { required, requiredOption } = useValidator()
const plusIcon = useIcon({ icon: 'akar-icons:plus' })

const props = defineProps({
  type: {
    type: String,
    default: ''
  },
  id: {
    type: Number,
    default: NaN
  },
  ticketData: {
    type: Object,
    default: () => {}
  },
  transactionType: {
    type: Number,
    default: 0
  }
})
const FormData = computed(() => {
  console.log('props.ticketData', props.ticketData)
  return props.ticketData
})
// const typeTransaction = computed(() => {
//   return props.transactionType
// })
const typeTransaction = ref(props.transactionType)
const rules = reactive<FormRules>({
  staffId: [required(), requiredOption()],
  description: [required()],
  customerId: [required(), requiredOption()]
})
let infoCompany = reactive({
  name: '',
  email: '',
  phonenumber: ''
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
const getValueOfStaffSelected = (value, _obj) => {
  FormData.value.staffId = value
}

const getValueOfCustomerSelected = (value, obj) => {
  FormData.value.customerId = value
  infoCompany.name = obj.name
  infoCompany.phonenumber = obj.phone
  infoCompany.email = obj.email
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
const dialogAddQuick = ref(false)

const openQuickAddDialog = () => {
  dialogAddQuick.value = true
}
const closeDialog = (value: any) => {
  if (value == null || value == 0) {
  } else {
    FormData.value.customerId = value
  }
  dialogAddQuick.value = false

  callCustomersApi()
}
const ruleFormRef = ref<FormInstance>()
const submitFormTicket = async () => {
  if (!ruleFormRef.value) return
  await ruleFormRef.value.validate((valid) => {
    if (valid) {
      return true
    } else {
      return false
    }
  })
}
onBeforeMount(() => {
  getListStaff(), callCustomersApi()
})
defineExpose({
  FormData,
  submitFormTicket
})
</script>
<template>
  <QuickAddCustomer
    v-if="dialogAddQuick"
    :showDialog="dialogAddQuick"
    @close-dialog="closeDialog"
  />
  <ElForm
    class="w-full flex"
    ref="ruleFormRef"
    :model="FormData"
    :disabled="props.type == 'detail'"
    :rules="rules"
    label-width="170px"
    status-icon
    require-asterisk-position="right"
  >
    <div class="w-[50%]">
      <el-divider content-position="left">{{
        typeTransaction == 1
          ? t('reuse.profileWareHouse')
          : typeTransaction == 2
          ? t('reuse.profileExport')
          : t('reuse.profileTransfer')
      }}</el-divider>

      <ElFormItem :label="t('reuse.formCode')" prop="ticketCode">
        <div class="pl-6">{{ FormData.ticketCode }}</div>
      </ElFormItem>
      <ElFormItem :label="t('reuse.createDate')">
        <div class="pl-6">{{
          FormData.createdAt ? dateTimeFormat(FormData.createdAt) : formattedToday
        }}</div>
      </ElFormItem>
      <ElFormItem class="mt-5" :label="t('reuse.petitioner')" prop="staffId">
        <MultipleOptionsBox
          :fields="[t('reuse.employeeCode'), t('reuse.phoneNumber'), t('reuse.employeeName')]"
          filterable
          width="700px"
          :items="optionsStaffApi"
          valueKey="id"
          labelKey="label"
          :hiddenKey="['id']"
          :placeHolder="t('formDemo.chooseASeller')"
          :defaultValue="FormData.staffId"
          :clearable="false"
          @update-value="(value, obj) => getValueOfStaffSelected(value, obj)"
          @scroll-bottom="ScrollStaffBottom"
        />
      </ElFormItem>
      <ElFormItem class="mb-7" :label="t('reuse.note')" prop="description">
        <ElInput
          v-model="FormData.description"
          size="default"
          :placeholder="t('reuse.enterNote')"
        />
      </ElFormItem>
      <el-divider class="mt-10" content-position="left">{{ t('reuse.subject') }}</el-divider>
      <div class="flex justify-between">
        <ElFormItem :label="t('reuse.selectObject')" class="w-4/5" prop="customerId">
          <MultipleOptionsBox
            :fields="[t('reuse.customerCode'), t('reuse.phoneNumber'), t('reuse.customerName')]"
            filterable
            class="w-full"
            width="700px"
            :items="optionsCustomerApi"
            valueKey="id"
            labelKey="label"
            :hiddenKey="['id']"
            :placeHolder="t('formDemo.chooseACustomer')"
            :defaultValue="FormData.customerId"
            :clearable="false"
            @update-value="(value, obj) => getValueOfCustomerSelected(value, obj)"
            @scroll-bottom="ScrollCustomerBottom"
          />
        </ElFormItem>
        <ElFormItem label-width="0px">
          <el-button
            @click="openQuickAddDialog"
            :icon="plusIcon"
            class="pl-8"
            :disabled="props.type == 'detail'"
            >{{ t('button.add') }}</el-button
          >
        </ElFormItem>
      </div>
      <ElFormItem :label="t('formDemo.customerName')" v-if="infoCompany.name">
        <div class="leading-4">
          <div class="ml-5">{{ infoCompany.name }}</div>
        </div>
      </ElFormItem>
      <ElFormItem class="w-[100%]" :label="t('reuse.phoneNumber')" v-if="infoCompany.phonenumber">
        <div class="leading-4">
          <div class="ml-5">{{ infoCompany.phonenumber }}</div>
        </div>
      </ElFormItem>
      <ElFormItem class="w-[100%]" :label="t('reuse.email')" v-if="infoCompany.email">
        <div class="leading-4">
          <div class="ml-5">{{ infoCompany.email }}</div>
        </div>
      </ElFormItem>
    </div>
    <div class="w-[50%]">
      <div class="text-sm text-[#303133] font-medium p pl-4 dark:text-[#fff]">
        <el-divider content-position="left">{{ t('formDemo.documentsAttached') }}</el-divider>
      </div>
      <ElFormItem class="w-[100%]" style="display: inline-block" :label="t('reuse.orderCode')">
        {{ FormData.orderCode }}
      </ElFormItem>
    </div>
  </ElForm>
</template>
