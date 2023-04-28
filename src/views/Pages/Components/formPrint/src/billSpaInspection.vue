<script setup lang="ts">
import { ElDivider, ElRow, ElCol } from 'element-plus'
// import { useIcon } from '@/hooks/web/useIcon'

import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

const props = defineProps({
  dataEditor: {
    type: String,
    default: ''
  },
  titleCategory: {
    type: String,
    default: ''
  },
  dataProduc: {
    type: Object,
    default: () => {}
  }
})

</script>

<template>
  <div >
    <div v-for="(item, index) in props.dataProduc?.orderDetails" class="h-screen w-full p-5" :key="index">
      <div class="flex items-center justify-center">
        <div class="basis-5/12 text-center">
          <img src="@/assets/imgs/images.png" />
        </div>
      </div>
      <div class="flex justify-between text-[12px]">
        <div>
          <div class="flex pb-1 items-center">
            <label class="mr-2">{{ t('formDemo.address') }} 1:</label>
            <div>TP. Hồ Chí Minh</div>
          </div>
          <div class="flex items-center">
            <label class="mr-2">{{ t('formDemo.address') }} 2:</label>
            <div>TP. Hà Nội</div>
          </div>
        </div>
        <!-- <el-button :icon="callIcon" />  -->
        <div>
          <div class="items-end text-end mb-1">AUTHONLYLUXURY@GMAIL.COM</div>
          <div class="flex items-end">0987654321 - 01245789544 | AUTHONLYLUXURY@GMAIL.COM</div>
        </div>
      </div>
      <el-divider />
  
      <div class="font-medium text-center text-1xl">PHIẾU THĂM KHÁM SẢN PHẨM</div>
  
      <el-divider />
  
      <div class="flex flex-col">
          <el-row class="text-[12px] mb-1">
            <el-col :span="4">
              <span>{{ `${t('reuse.productName')} :` }}</span>
            </el-col>
            <el-col :span="20">{{ item?.productName }}</el-col>
          </el-row>
          <el-row class="text-[12px] mb-2">
            <el-col :span="4">
              <span>{{ `${t('reuse.productCode')} :` }}</span>
            </el-col>
            <el-col :span="20">{{ item?.productPropertyCode }}</el-col>
          </el-row>
      </div>
      <hr />
      <div class="text-1xl my-2 font-bold">{{ `${item.productType1Name} / ${item.productTypeName}` }}</div>
      <hr />
      <div v-html="item.description" class="text-[12px] mt-2 table-data"> </div>  
    </div>
  </div>
</template>

<style lang="scss" scoped>

@page {
  size: A5 portrait;
  margin: 0;
}


@media print {
  * {
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
    box-sizing: border-box !important;
    page-break-inside: avoid !important;
    text-shadow: none !important;
    background: none !important;
    box-shadow: none !important;
  }
  body {
    margin: 0;
    padding: 0;
  }
}

@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');

* {
  font-family: Lora, serif;
}

.text-end {
  text-align: end;
}

::v-deep(table) {
  word-break: break-word;
}

::v-deep(.table-data){
  table{
    width: 100% !important;
  }
  tr{
    border-bottom: 1px solid #e5e7eb;
    padding-top: 12px;
    padding-bottom: 3px;
    display: flex;
    gap: 5px
  }
  td:first-child {
    min-width: 80px
  }
}

</style>
