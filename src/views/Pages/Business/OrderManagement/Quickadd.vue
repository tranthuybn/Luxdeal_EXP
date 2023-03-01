<script setup lang="ts">
import { ref} from 'vue'
import { t } from '@/hooks/web/useI18n'
import {
  ElSelect,
  ElOption,
  ElButton,
  ElDivider,
  ElInput,
  ElDialog,
ElNotification,
 } from 'element-plus'
import { addQuickCustomer } from '@/api/Business';
import { FORM_IMAGES } from '@/utils/format';


const dialogAddQuick = ref(false)
const valueClassify = ref(false)

  const optionsClassify = [
  {
    value: true,
    id: 1,
    label: t('formDemo.company')
  },
  {
    value: false,
    id: 2,
    label: t('formDemo.individual')
  }
]
const valueSelectCustomer = ref(1)
const addQuickCustomerName = ref()
const quickTaxCode = ref()
const quickRepresentative = ref()
const quickPhoneNumber = ref()
const quickEmail = ref()
//thêm nhanh khách hàng
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
    .then(() =>
      ElNotification({
        message: t('reuse.addSuccess'),
        type: 'success'
      })
    )
    .catch(() =>
      ElNotification({
        message: t('reuse.addFail'),
        type: 'warning'
      })
    )
}



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





</script>


<template>
    <div>
        <!-- Dialog Thêm nhanh khách hàng -->
<el-dialog
v-model="dialogAddQuick"
width="40%"
align-center
:title="t('formDemo.QuicklyAddCustomers')"
>
<!-- class="font-bold" -->
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
              :key="item.id"
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
              :key="item.id"
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
<template #footer>
  <span class="dialog-footer">
    <el-button
      type="primary"
      class="w-[150px]"
      @click.stop.prevent="
        () => {
          createQuickCustomer()
          dialogAddQuick = false
        }
      "
      >{{ t('reuse.save') }}</el-button
    >
    <el-button class="w-[150px]" @click.stop.prevent="openDialogAddQuickCustomer">{{
      t('reuse.exit')
    }}</el-button>
  </span>
</template>
</el-dialog>
    </div>
</template>

<style scoped>

</style>
