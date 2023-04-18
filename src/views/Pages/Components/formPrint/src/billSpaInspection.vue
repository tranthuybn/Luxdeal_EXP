<script setup lang="ts">
import { ElDivider, ElTable, ElTableColumn } from 'element-plus'
// import { useIcon } from '@/hooks/web/useIcon'

import { useI18n } from '@/hooks/web/useI18n'
import { ref } from 'vue'

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

// let dataEditor = ref(props.dataEditor)
let titleCategory = ref(props.titleCategory)
console.log('props:', props)
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

    <div class="about-product mb-2" v-if="props.dataProduc">
      <p class="name mb-2">MÃ ĐƠN HÀNG: <b>{{ props.dataProduc.code }}</b></p>
      <p class="name mb-2"> THÔNG TIN KHÁCH HÀNG: <br/>
       Họ và tên:  {{ props.dataProduc.customer.name }} <br/>
       Điện thoại:  {{ props.dataProduc.customer.phonenumber }} <br/>
       Email:  {{ props.dataProduc.customer.email }} <br/>
      </p>
    </div>

    <hr />
    {{ titleCategory }}
    <!-- <h2 class="title-bill-spa font-medium text-2xl py-2">TÚI / VÍ</h2>
    <hr /> -->
    <div id="content-data"></div>
    <el-table
    width="100%"
        :data="props.dataProduc ? props.dataProduc.orderDetails : []"
        border
      >
        <el-table-column label="STT" type="index" align="center" />
        <el-table-column prop="productPropertyCode" label="Mã quản lý sản phẩm" width="200" />
        <el-table-column prop="productPropertyName" label="Thông ti sản phẩm" />
        <el-table-column prop="description" label="Nội dung thăm khám">
          <template #default="data">
            <p v-html="data.row.description"> </p> 
          </template>
        </el-table-column>
      </el-table>
    <!-- <p v-html="dataEditor"> </p> -->
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
  font-family: Lora, serif;
}

.text-end {
  text-align: end;
}

::v-deep(table) {
  word-break: break-word;
}

table {
  width: 100%;
  font-family: arial, sans-serif;
  border-collapse: collapse;
}

td,
th {
  padding: 8px;
  text-align: left;
  border: 1px solid #ddd;
}
</style>
