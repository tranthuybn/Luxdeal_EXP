<script setup lang="ts">
import { dateTimeFormat } from '@/utils/format'
import { ElRow, ElCol } from 'element-plus';

//dialogPrinRepairSpa
const props = defineProps({
  billRepairData: {
    type: Object,
    default: ()=>{}
  }
})

</script>

<template>
  <div v-for="(item, index) in props.billRepairData" :key="index" class="">
    <div class="flex justify-center flex-wrap text-[10px]">
      <img class="h-25" src="@/assets/imgs/images.png" />
      <div class="mb-1"><span class="font-bold">Địa chỉ:</span> 73B Lý Nam Đế, Q.Hoàn Kiếm, Hà Nội</div>
      <div class="mb-1"><span class="font-bold">Địa chỉ:</span> 116 Nguyễn Cư Trinh, Quận 1, TP.HCM</div>
      <div class="mb-1"><span class="font-bold">Email:</span> authonolyluxury@gmail.com</div>
      <div class="mb-1"><span class="font-bold">Phone:</span> 0982356789 - 0982021919</div>
      <div class="mb-1"><span class="font-bold">Website:</span> http://authonolyluxury.com</div>
      <div class="my-4 font-bold text-1xl">PHIẾU SỬA CHỮA SẢN PHẨM AUTHONOLY SPA</div>
    </div>
    <div class="mt-4 text-[10px]">
      <ElRow>
        <ElCol :span="12"><span class="font-bold">Cửa hàng: {{ item.storeName }}</span></ElCol>
        <ElCol :span="12"><span class="font-bold">Ngày nhận: {{ dateTimeFormat(item.fromDate) }}</span></ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="6"><span class="font-bold">Phiếu nhập: </span> <span>{{ item.importTicket }}</span></ElCol>
        <ElCol :span="6"><span class="font-bold">Code SP: </span> <span>{{ item.codeSP }}</span></ElCol>
        <ElCol :span="12"><span class="font-bold">Mã hàng: </span> <span>{{ item.productPropertyCode }}</span></ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="12"><span class="font-bold">Tên KH: </span> <span>{{ item.customerName }}</span></ElCol>
        <ElCol :span="12"><span class="font-bold">Ngày trả: </span> <span>{{ dateTimeFormat(item.toDate) }}</span></ElCol>
      </ElRow>
      <ElRow>
        <p></p>
      </ElRow>
    </div>
    <table size="small" class="mt-4">
      <tbody>
        <tr>
          <td rowspan="3">
            <div><span class="font-bold">Tên SP sửa chữa:</span> <span> {{ item.productName }}</span></div>
            <div><span class="font-bold">Phụ kiện đi kèm:</span> <span> {{ item.accessory }}</span></div>
            <div><span class="font-bold">Ghi chú:</span> <span v-html="item.description"></span></div>
          </td>
          <td rowspan="1"><span class="font-bold">NVTN:</span></td>
        </tr>
        <tr>
          <td rowspan="1"><span class="font-bold">Người giao:</span></td>
        </tr>
        <tr>
          <td rowspan="1"><span class="font-bold">Người nhận:</span></td>
        </tr>
        </tbody>
    </table>
    <table size="small"  class="mt-8">
      <tbody>
        <tr>
          <td><span class="font-black text-center">Nội dung</span></td>
        </tr>
        <tr>
          <td v-for="(service,index) in item.spaService" :key="index">
            - {{ service?.name }}
          </td>
        </tr>
        </tbody>
    </table>
    <table size="small"  class="mt-4">
      <thead>
        <tr>
          <th>Quy trình thực hiện</th>
          <th>Người thực hiện</th>
          <th>Ngày giờ tiếp nhận</th>
          <th>Ngày giờ hoàn thành</th>
          <th>Hóa chất</th>
          <th>Định lượng sử dụng</th>
          <th>Đánh giá</th>
          <th>Ghi chú</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
        </tr>
        <tr>
          <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
        </tr>
        <tr>
          <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
        </tr>
        <tr>
          <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
        </tr>
        <tr>
          <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
        </tr>
        <tr>
          <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
        </tr>
        <tr>
          <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
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

::v-deep(td), ::v-deep(th){
  padding: 16px 0 16px 8px;
  text-align: left;
  word-break: break-word;
  border: 1px solid #ddd;
}
</style>
