<template>
  <div class="flex pt-6">
    <div class="basis-4/12">
      <img src="@/assets/imgs/images.png" />
    </div>
    <div class="basis-8/12">
      <div class="font-bold text-2xl uppercase pl-[32px]"> Giấy đề nghị thanh toán </div>
      <el-divider />
      <div class="flex justify-between">
        <div class="pl-[72px]"
          >Ngày {{ new Date().getDate() }} tháng {{ new Date().getMonth() + 1 }} năm
          {{ new Date().getFullYear() }}</div
        >
        <div>BM_02-13_01/v1.0</div>
      </div>
      <div>
        <div class="flex">
          <label class="">{{ t('reuse.phoneNumber') }} :</label>
          <div class="">098 23 56789</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElDivider } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()
</script>

<style scoped>
.el-divider--horizontal {
  margin: 0;
}
</style>
