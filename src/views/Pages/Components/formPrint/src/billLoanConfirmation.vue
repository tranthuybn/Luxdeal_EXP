<script setup lang="ts">
import { ref } from 'vue'

const tradingCode = ref('CDSG0273')

const infomation = [
  {
    email: 'aoiugwjana@gmail.com',
    phoneNumber: '01521515-059215215',
    date: '07/11/2022',
    name: 'NGUYỄN ĐAN TRƯỜNG',
    pricePawn: 200000000,
    priceText: 'Hai trăm triệu đồng'
  }
]
</script>

<template>
  <div class="p-5 break-words">
    <div class="flex justify-between">
      <div class="logo-luxury">
        <img class="w-[30%]" src="@/assets/imgs/images.png" />
      </div>
      <div class="index-code w-[35%]">
        <p>Mẫu số: 04a-AU</p>
        <p>Mã giao dịch: {{ tradingCode }}</p>
      </div>
    </div>

    <div class="infomation">
      <div class="flex gap-3">
        <p class="font-bold w-[80px]">Địa chỉ:</p>
        <div class="location">
          <p>73B Lý nam đế, Q. Hoàn Kiếm</p>
          <p>73B Lý nam đế, Q. Hoàn Kiếm</p>
        </div>
      </div>
      <div class="flex gap-3">
        <p class="font-bold w-[80px]">Điện thoại:</p>
        <p>01521515-059215215</p>
      </div>

      <div class="flex gap-3">
        <p class="font-bold w-[80px]">Email:</p>
        <p>{{ infomation[0].email }}</p>
      </div>

      <div class="flex gap-3">
        <p class="font-bold w-[80px]">Website:</p>
        <p> {{ infomation[0].phoneNumber }}</p>
      </div>
    </div>

    <div class="title-bill font-bold text-center py-3 text-xl">BIÊN BẢN XÁC NHẬN KHOẢN VAY</div>

    <div class="flex justify-between">
      <div class="flex-left">
        <div class="flex gap-3">
          <p class="font-bold w-[160px]">Ngày:</p>
          <p>{{ infomation[0].date }}</p>
        </div>

        <div class="flex gap-3">
          <p class="font-bold w-[160px]">Họ và tên khách hàng:</p>
          <p>{{ infomation[0].name }}</p>
        </div>

        <div class="flex gap-3">
          <p class="font-bold w-[160px]">Giá trị hàng cầm đồ:</p>
          <p>{{ infomation[0].pricePawn }}</p>
        </div>

        <div class="flex gap-3">
          <div class="">
            <p class="font-bold w-[160px]">Bằng chữ:</p>
            <p class="w-[150px]">Chi phí gồm: chi phí lãi + phí lưu kho + phí thẩm định</p>
          </div>
          <div class="">
            <p>{{ infomation[0].priceText }}</p>
            <p>2500</p>
          </div>
        </div>
      </div>

      <div class="flex-right">
        <div class="phone flex gap-3">
          <p>Số điện thoại:</p>
          <p class="mb-6 phone-number"> 0333278085 </p>
        </div>

        <div class="flex gap-3">
          <p>Số ngày trả lãi một đợt:</p>
          <p class="day-return"> 10 ngày </p>
        </div>
      </div>
    </div>

    <div class="pawn-property">
      <p class="title-table">Tài sản cầm đồ</p>
      <table>
        <tr>
          <th>stt</th>
          <th>Mã sản phẩm</th>
          <th>Tên hàng</th>
          <th>Phụ kiện đi kèm</th>
          <th>Số lượng</th>
          <th>Đơn vị</th>
        </tr>
        <tr>
          <td>1</td>
          <td>LVajfw</td>
          <td>thông tin sản phẩm</td>
          <td></td>
          <td>05</td>
          <td>Chiếc</td>
        </tr>
      </table>
    </div>

    <p class="assure mt-3">
      Tôi xin cam doan tài san the chap trên thuôc quyen só huu, su dung hop pháp cua minh. Tôi sē
      thanh toán no goc, lài cho Authonly day dù, dung han Khi só du no lài den 30 ngay mà tôi không
      thanh toán, Authonly có toàn quyên xÙ ly tài san the châp de thu hoi no vay. Neu vi pham các
      cam ket trên, tôi xin hoàn toàn chiu trách nhiêm. Hop dong cam do bên Authonly chi giai quyêt
      voi chinh chù theo tên và chung minh cua khách hàng dã ki tur lúc dàu hoãc
    </p>

    <div class="money-receipt text-center font-bold py-3 text-xl">BIÊN NHẬN TIỀN</div>

    <table>
      <tr>
        <th>Ngày</th>
        <th>Nội dung</th>
        <th>Số tiền</th>
        <th>khách hàng ký</th>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>

      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    </table>

    <div class="signature-confirmation my-3">
      <div class="flex justify-around">
        <div class="customer">
          <p>Khách hàng</p>
          <span>(Ký,họ tên)</span>
        </div>
        <div class="receiver">
          <p>Người nhận</p>
          <span>(Ký,họ tên)</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
* {
  font-family: 'Lora', serif;
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
