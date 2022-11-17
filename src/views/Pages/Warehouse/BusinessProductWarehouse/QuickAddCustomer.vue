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
  ElNotification
} from 'element-plus'
import { ref } from 'vue'

const { t } = useI18n()
defineProps({
  showDialog: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['close-dialog'])
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
const valueSelectCustomer = ref(1)
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
const addQuickCustomerName = ref()
const quickTaxCode = ref()
const quickRepresentative = ref()
const quickPhoneNumber = ref()
const quickEmail = ref()

const addStatus = ref(false)
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
    .then(() => {
      ElNotification({
        message: t('reuse.addSuccess'),
        type: 'success'
      }),
        (addStatus.value = true)
    })
    .catch(() =>
      ElNotification({
        message: t('reuse.addFail'),
        type: 'warning'
      })
    )
}
const closeDialog = () => {
  addStatus.value ? emit('close-dialog', customerData) : emit('close-dialog', null)
}
const customerData = ref()
const rules = { companyName: { required: true } }
</script>
<template>
  <el-dialog
    :model-value="showDialog"
    width="40%"
    align-center
    :title="t('formDemo.QuicklyAddCustomers')"
    @close="closeDialog"
  >
    <el-form ref="ruleFormRef" :model="customerData" :rules="rules" label-width="120px" status-icon>
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
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          type="primary"
          class="w-[150px]"
          @click.stop.prevent="
            () => {
              createQuickCustomer()
              closeDialog()
            }
          "
          >{{ t('reuse.save') }}</el-button
        >
        <el-button class="w-[150px]" @click.stop.prevent="closeDialog">{{
          t('reuse.exit')
        }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>
