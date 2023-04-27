<script setup lang="ts">
import { useI18n } from '@/hooks/web/useI18n'
import {ElForm, ElFormItem} from 'element-plus'
import { getTodayDate } from '@/utils/tsxHelper'


const { t } = useI18n()
const props = defineProps({
  dataEdit: {
    type: Object,
    default: () => {}
  },
  nameDialog: {
    type: String,
    default: () => ''
  }
})

console.log('dataEdit: ', props.dataEdit)
const currencyFormatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
const formData = {...props.dataEdit}
</script>

<template>
  <div class="h-screen text-sm p-4">
    <div class="flex justify-between items-center pb-4">
      <div class="basis-6/12">
        <img
          src="//bizweb.dktcdn.net/thumb/medium/100/420/578/themes/812458/assets/logo.png?1665130169158"
        />
      </div>
      <div class="basis-6/12 text-right">
        <div>Mẫu số: 12-AU</div>
        <div>Mã giao dịch: {{ props.dataEdit.codeReceipts ?? '' }}</div>
        <div>Chi nhánh: Hồ Chí Minh</div>
      </div>
    </div>
    <ElForm label-width="120px" label-position="left">
      <ElFormItem :label="`${t('formDemo.address')}:`">
        <div class="flex flex-col">
          <span>73B Lý Nam Đế - Hoàn Kiếm - Hà Nội</span>
          <span>116 Nguyễn Cư Trinh - Quận 1 - Hồ Chí Minh</span>
        </div>
      </ElFormItem>
      <ElFormItem :label="`${t('reuse.phoneNumber')}:`">098 23 56789 - 098 202 1919</ElFormItem>
      <ElFormItem :label="`${t('reuse.email')}:`">info@authonlyluxury.com</ElFormItem>
      <ElFormItem :label="`${t('formDemo.website')}:`">authonlyluxury.com</ElFormItem>
    </ElForm>
    <div class="text-center pb-6 mt-4">
      <div class="font-bold text-2xl">{{ nameDialog }}</div>
      <div>{{ getTodayDate() }}</div>
    </div>
    <ElForm :data="formData" label-width="200px" label-position="left">
      <ElFormItem :label="`${t('reuse.fullName')}:`">{{ dataEdit.user?.label ?? '' }}</ElFormItem>
      <ElFormItem :label="`${t('reuse.reason')}:`">{{ formData.reasonCollectingMoney }}</ElFormItem>
      <ElFormItem :label="`${t('reuse.amountOfMoney')}:`">{{ currencyFormatter.format(formData.moneyReceipts) }}</ElFormItem>
      <ElFormItem :label="`${t('formDemo.writtenWords')}:`">{{ formData.enterMoney }}</ElFormItem>
      <ElFormItem :label="`${t('formDemo.formPayment')}:`">{{ formData.payment }}</ElFormItem>
      <ElFormItem :label="`${t('formDemo.documentsAttached')}:`">{{ formData.sellOrderCode }}</ElFormItem>
    </ElForm>
    <div class="flex items-center justify-between text-center text-sm mt-2">
      <div class="basis-2/10">
        <div class="font-bold mb-1">Giám đốc</div>
        <div class="italic">(Ký, họ tên, đóng dấu)</div>
      </div>
      <div class="basis-2/10">
        <div class="font-bold">Kế toán</div>
        <div class="italic">(Ký, họ tên)</div>
      </div>
      <div class="basis-2/10">
        <div class="font-bold">Người nộp tiền</div>
        <div class="italic">(Ký, họ tên)</div>
      </div>
      <div class="basis-2/10">
        <div class="font-bold">Người lập</div>
        <div class="italic">(Ký, họ tên)</div>
      </div>
      <div class="basis-2/10">
        <div class="font-bold">Người nhận tiền</div>
        <div class="italic">(Ký, họ tên)</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');

* {
  font-family: Lora, serif;
  font-weight: 500;
}

::v-deep(.el-form-item) {
  margin-bottom: 0 ;
  display: flex !important;
  align-items: flex-start !important;
}
</style>
