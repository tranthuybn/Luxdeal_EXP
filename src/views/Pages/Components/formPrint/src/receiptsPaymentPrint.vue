<script setup lang="ts">
import { useI18n } from '@/hooks/web/useI18n'

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
</script>

<template>
  <div class="pt-[28px] m-6">
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
    <div class="pb-6">
      <div class="flex pb-1 items-center">
        <label class="font-bold basis-1/5">{{ t('formDemo.address') }} :</label>
        <div class="text-[16px]">
          <div class="mb-2">73B Lý Nam Đế - Hoàn Kiếm - Hà Nội</div>
          <div>116 Nguyễn Cư Trinh - Quận 1 - Hồ Chí Minh</div>
        </div>
      </div>
      <div class="flex pb-1 items-center">
        <label class="font-bold basis-1/5">{{ t('reuse.phoneNumber') }} :</label>
        <div class="text-[16px]">098 23 56789 - 098 202 1919</div>
      </div>
      <div class="flex pb-1 items-center">
        <label class="font-bold basis-1/5">{{ t('reuse.email') }} :</label>
        <div class="text-[16px]">info@authonlyluxury.com</div>
      </div>
      <div class="flex pb-1 items-center">
        <label class="font-bold basis-1/5">Website :</label>
        <div class="text-[16px]">authonlyluxury.com</div>
      </div>
    </div>
    <div class="text-center pb-6">
      <div class="font-bold text-2xl">{{ nameDialog }}</div>
      <div
        >Ngày {{ new Date().getDate() }} tháng {{ new Date().getMonth() + 1 }} năm
        {{ new Date().getFullYear() }}</div
      >
    </div>
    <div class="pb-10">
      <div class="flex pb-3 items-center text-[16px]">
        <label class="basis-1/4">{{ t('reuse.fullName') }} :</label>
        <div>Chị Loan - 0903667626</div>
      </div>
      <div class="flex pb-3 items-center text-[16px]">
        <label class="basis-1/4">{{ t('reuse.reason') }} :</label>
        <div>Thu phí</div>
      </div>
      <div class="flex pb-3 items-center text-[16px]">
        <label class="basis-1/4">{{ t('reuse.amountOfMoney') }} :</label>
        <div>799.000</div>
      </div>
      <div class="flex pb-3 items-center text-[16px]">
        <label class="basis-1/4">{{ t('formDemo.writtenWords') }} :</label>
        <div>Bảy trăm chín mươi chín ngàn đồng</div>
      </div>
      <div class="flex pb-3 items-center text-[16px]">
        <label class="basis-1/4">{{ t('formDemo.formPayment') }} :</label>
        <div>Tiền mặt</div>
      </div>
      <div class="flex pb-3 items-center text-[16px]">
        <label class="basis-1/4">{{ t('formDemo.documentsAttached') }} :</label>
        <div>Chứng từ gốc</div>
      </div>
    </div>
    <div class="flex items-center justify-between text-center">
      <div class="basis-2/10">
        <div class="font-bold mb-1">Giám đốc</div>
        <div class="text-[14px] italic">(Ký, họ tên, đóng dấu)</div>
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

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');

* {
  font-family: Lora, serif;
  font-weight: 500;
}
</style>
