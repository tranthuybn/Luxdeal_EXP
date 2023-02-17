<script setup lang="ts">
import { dateTimeFormat } from '@/utils/format'

//dialogPrinRepairSpa
const props = defineProps({
  billRepairData: {
    type: Object,
    default: ()=>{}
  }
})

</script>

<template>
  <div class="header">
    <img class="w-240px h-120px" width="240" height="120" src="@/assets/imgs/images.png" />
    <div><span class="font-black">Địa chỉ:</span> 73B Lý Nam Đế, Q.Hoàn Kiếm, Hà Nội</div>
    <div><span class="font-black">Địa chỉ:</span> 116 Nguyễn Cư Trinh, Quận 1, TP.HCM</div>
    <div><span class="font-black">Email:</span> authonolyluxury@gmail.com</div>
    <div><span class="font-black">Phone:</span> 0982356789 - 0982021919</div>
    <div><span class="font-black">Website:</span> http://authonolyluxury.com</div>
    <div class="my-5 font-bold">PHIẾU SỬA CHỮA SẢN PHẨM AUTHONOLY SPA</div>
  </div>
  <table class="mt-4">
    <tbody>
      <tr>
        <td class="!border-r-0"></td>
        <td class="!border-x-0"></td>
        <td class="!border-x-0"></td>
        <td class="!border-l-0"></td>
      </tr>
      <tr>
        <td colspan="2"><span class="font-black">Cửa hàng: {{ billRepairData.storeName }}</span></td>
        <td colspan="2"><span class="font-black">Ngày nhận: {{ dateTimeFormat(billRepairData.fromDate) }}</span></td>
      </tr>
      <tr>
      </tr>
      <tr>
        <td colspan="1"><span class="font-black">Phiếu nhập: </span> <span>{{ billRepairData.importTicket }}</span></td>
        <td colspan="1"><span class="font-black">Code SP: </span> <span>{{ billRepairData.codeSP }}</span></td>
        <td colspan="2"><span class="font-black">Mã hàng: </span> <span>{{ billRepairData.productPropertyCode }}</span></td>
      </tr>
      <tr>
        <td colspan="2"><span class="font-black">Tên KH: </span> <span>{{ billRepairData.customerName }}</span></td>
        <td colspan="2"><span class="font-black">Ngày trả: </span> <span>{{ dateTimeFormat(billRepairData.toDate) }}</span></td>
      </tr>
      <tr>
        <td colspan="4"></td>
      </tr>
    </tbody>
  </table>
  <table class="mt-4">
    <tbody>
      <tr>
        <td rowspan="3">
          <div><span class="font-black">Tên SP sửa chữa:</span> <span> {{ billRepairData.productName }}</span></div>
          <div><span class="font-black">Phụ kiện đi kèm:</span> <span> {{ billRepairData.accessory }}</span></div>
          <div><span class="font-black">Ghi chú:</span> <span>{{ billRepairData.description }}</span></div>
        </td>
        <td rowspan="1"><span class="font-black">NVTN:</span></td>
      </tr>
      <tr>
        <td rowspan="1"><span class="font-black">Người giao:</span></td>
      </tr>
      <tr>
        <td rowspan="1"><span class="font-black">Người nhận:</span></td>
      </tr>
      </tbody>
  </table>
  <table class="mt-8">
    <tbody>
      <tr>
        <td><span class="font-black text-center">Nội dung</span></td>
      </tr>
      <tr>
        <td v-for="(item,index) in billRepairData.spaService" :key="index">
          - {{ item?.name }}
        </td>
      </tr>
      </tbody>
  </table>
  <table class="mt-4">
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
      <tr v-if="!props.billRepairData?.tableData">
        <td colspan="8" class="!text-center">Không có dữ liệu</td>
      </tr>
      <tr v-else v-for="(item,index) in props.billRepairData?.tableData" :key="index">
        <td v-if="item">{{ item }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
* {
  font-family: 'Lora', serif;
}
.header{
  display: flex;
  justify-content: center;
  flex-wrap: wrap
}
.header div{
  text-align:center;
  width: 100%;
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
  padding: 8px 0 8px 8px;
  word-break: break-word;
}
</style>
