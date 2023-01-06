<script setup lang="ts">
import { addQuickCustomer } from '@/api/Business'
import { useI18n } from '@/hooks/web/useI18n'
import { FORM_IMAGES } from '@/utils/format'
import {
  ElSelect,
  ElOption,
  ElButton,
  ElDivider,
  ElInput,
  ElDialog,
  ElNotification,
  ElForm,
  ElFormItem
} from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'

const { required, ValidService } = useValidator()
const { t } = useI18n()
defineProps({
  showDialog: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['close-dialog'])
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
const optionsCustomer = [
  {
    value: 1,
    label: t('formDemo.customer')
  },
  {
    value: 2,
    label: t('reuse.supplier')
  },
  {
    value: 3,
    label: t('formDemo.joint')
  }
]

const customerId = ref(0)
// Thêm nhanh khách hàng
const createQuickCustomer = async () => {
  await customerFormRef.value?.validate(async (valid) => {
    if (valid) {
      const payload = {
        IsOrganization: valueClassify.value,
        Name: customerData.value.addQuickCustomerName,
        TaxCode: customerData.value.quickTaxCode,
        Representative: customerData.value.quickRepresentative,
        Phonenumber: customerData.value.quickPhoneNumber,
        Email: customerData.value.quickEmail,
        DistrictId: 1,
        WardId: 1,
        Address: 1,
        CustomerType: customerData.value.valueSelectCustomer
      }
      await addQuickCustomer(FORM_IMAGES(payload))
        .then((res) => {
          ElNotification({
            message: t('reuse.addSuccess'),
            type: 'success'
          }),
            (customerId.value = res?.data)
        })
        .catch(() => {
          ElNotification({
            message: t('reuse.addFail'),
            type: 'error'
          })
        })
        .finally(() => closeDialogAfterAdd())
    } else {
      console.log('invalid')
    }
  })
}
const exitDialog = () => {
  emit('close-dialog', null)
}
const closeDialogAfterAdd = () => {
  emit('close-dialog', customerId.value)
}
const valueClassify = ref(false)
const customerData = ref({
  valueSelectCustomer: 1,
  addQuickCustomerName: '',
  quickTaxCode: '',
  quickRepresentative: '',
  quickPhoneNumber: '',
  quickEmail: ''
})
const rules = reactive<FormRules>({
  quickTaxCode: [required()],
  quickEmail: [ValidService.checkEmail],
  link: [ValidService.checkLink],
  quickPhoneNumber: [
    required(),
    {
      validator: (_rule: any, value: any, callback: any) => {
        if (isNaN(value)) callback(new Error(t('reuse.numberFormat')))
        else if (value < 0) callback(new Error(t('reuse.positiveNumber')))
        callback()
      },
      required: true,
      trigger: 'blur'
    },
    ValidService.checkPhone
  ],
  addQuickCustomerName: [required()]
})
const customerFormRef = ref<FormInstance>()
</script>
<template>
  <el-dialog
    :model-value="showDialog"
    width="40%"
    align-center
    :title="t('formDemo.QuicklyAddCustomers')"
    @close="exitDialog"
  >
    <el-form
      ref="customerFormRef"
      :model="customerData"
      :rules="rules"
      label-width="120px"
      status-icon
    >
      <div v-if="valueClassify == true">
        <el-divider />
        <div class="flex">
          <el-form-item :label="t('formDemo.classify')" prop="valueClassify">
            <el-select v-model="valueClassify" placeholder="Select">
              <el-option
                v-for="(item, index) in optionsClassify"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="valueSelectCustomer">
            <el-select v-model="customerData.valueSelectCustomer" placeholder="Select">
              <el-option
                v-for="item in optionsCustomer"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
        <el-form-item :label="t('formDemo.companyName')" prop="addQuickCustomerName">
          <el-input
            v-model="customerData.addQuickCustomerName"
            style="width: 100%"
            :placeholder="t('formDemo.enterCompanyName')"
          />
        </el-form-item>
        <el-form-item :label="t('formDemo.taxCode')" prop="quickTaxCode">
          <el-input
            v-model="customerData.quickTaxCode"
            style="width: 100%"
            :placeholder="t('formDemo.enterTaxCode')"
          />
        </el-form-item>
        <el-form-item :label="t('formDemo.representative')" prop="quickRepresentative">
          <el-input
            v-model="customerData.quickRepresentative"
            style="width: 100%"
            :placeholder="t('formDemo.enterRepresentative')"
          />
        </el-form-item>
        <el-form-item :label="t('reuse.phoneNumber')" prop="quickPhoneNumber">
          <el-input
            v-model="customerData.quickPhoneNumber"
            style="width: 100%"
            :placeholder="t('formDemo.enterPhoneNumber')"
          />
        </el-form-item>
        <el-form-item :label="t('reuse.email')" prop="quickEmail">
          <el-input
            v-model="customerData.quickEmail"
            style="width: 100%"
            :placeholder="`${t('formDemo.enterEmail')}`"
          />
        </el-form-item>
      </div>
      <div v-else>
        <el-divider />
        <div class="flex">
          <el-form-item :label="t('formDemo.classify')" prop="valueClassify">
            <el-select v-model="valueClassify" placeholder="Select">
              <el-option
                v-for="(item, index) in optionsClassify"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="valueSelectCustomer">
            <el-select v-model="customerData.valueSelectCustomer" placeholder="Select">
              <el-option
                v-for="item in optionsCustomer"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
        <el-form-item :label="t('reuse.customerName')" prop="addQuickCustomerName">
          <el-input
            v-model="customerData.addQuickCustomerName"
            style="width: 100%"
            :placeholder="t('formDemo.enterCustomerName')"
          />
        </el-form-item>
        <el-form-item :label="t('reuse.phoneNumber')" prop="quickPhoneNumber">
          <el-input
            v-model="customerData.quickPhoneNumber"
            style="width: 100%"
            :placeholder="t('formDemo.enterPhoneNumber')"
          />
        </el-form-item>
        <el-form-item :label="t('reuse.email')" prop="quickEmail">
          <el-input
            v-model="customerData.quickEmail"
            style="width: 100%"
            :placeholder="t('formDemo.enterEmail')"
          />
        </el-form-item>
      </div>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" class="w-[150px]" @click="createQuickCustomer">{{
          t('reuse.save')
        }}</el-button>
        <el-button class="w-[150px]" @click.stop.prevent="exitDialog">{{
          t('reuse.exit')
        }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>
