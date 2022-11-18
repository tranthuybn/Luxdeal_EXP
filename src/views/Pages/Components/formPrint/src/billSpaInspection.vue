<script setup lang="ts">
import { ElDivider } from 'element-plus'
// import { useIcon } from '@/hooks/web/useIcon'

import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

// const locateIcon = useIcon({ icon: 'entypo:location' })

// const tableData = [
//   {, ElTable, ElTableColumn
//     stt: 'da',
//     codeProduct: 'da',
//     name: 'da',
//     code: 'da',
//     assetsory: 'da',
//     price: 'da',
//     loai: 'da',
//     note: 'da'
//   }
// ]
</script>

<template>
  <div class="p-5">
    <div class="flex items-center">
      <div class="basis-8/12 text-center">
        <img class="w-[60%] float-right" src="@/assets/imgs/images.png" />
      </div>
    </div>
    <div class="flex justify-between text-sm">
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
        <div class="items-end text-end">AUTHONLYLUXURY@GMAIL.COM</div>
        <div class="flex items-end">0987654321 - 01245789544 | AUTHONLYLUXURY@GMAIL.COM</div>
      </div>
    </div>
    <el-divider />

    <h1 class="title-bill-spa font-medium text-center text-3xl">PHIẾU THĂM KHÁM SẢN PHẨM</h1>

    <el-divider />

    <div class="about-product mb-2">
      <p class="name mb-2"> TÊN SẢN PHẨM: </p>
      <p class="product-code">MÃ SẢN PHẨM: </p>
    </div>

    <hr />
    <h2 class="title-bill-spa font-medium text-2xl py-2">TÚI / VÍ</h2>
    <hr />

    <div class="product-status mt-3">
      <p class="before-product mb-1">MẶT TRƯỚC:</p>
      <hr />
    </div>

    <div class="product-status my-2">
      <p class="before-product mb-1">MẶT SAU:</p>
      <hr />
    </div>

    <div class="product-status my-2">
      <p class="before-product mb-1">HAI BÊN:</p>
      <hr />
    </div>

    <div class="product-status my-2">
      <p class="before-product mb-1">ĐÁY:</p>
      <hr />
    </div>
    <div class="product-status my-2">
      <p class="before-product mb-1">QUAI:</p>
      <hr />
    </div>

    <div class="product-status my-2">
      <p class="before-product mb-1">DÂY TÚI:</p>
      <hr />
    </div>
  </div>
</template>

<style scoped>
/* *{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
} */

@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
* {
  font-family: 'Lora', serif;
}
.text-end {
  text-align: end;
}
::v-deep(table) {
  word-break: break-word;
}

table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td,
th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}
</style>
