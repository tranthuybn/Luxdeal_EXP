<script setup lang="ts">
import { ElDivider } from 'element-plus'

import { useI18n } from '@/hooks/web/useI18n'

import { onBeforeMount } from 'vue'

const { t } = useI18n()

const props = defineProps({
  dataCustomer: {
    type: Object,
    default: () => { }
  },
  dataEdit: {
    type: Object,
    default: () => { }
  }
})

onBeforeMount(() => {
  console.log('customer: ', props.dataCustomer)
})

function getArraySum(arr) {
  var total = 0
  for (var i in arr) {
    if (arr[i].totalPrice !== 0) total = arr[i].totalPrice
  }
  return total
}
</script>

<template>
  <div class="p-5">
    <div class="flex flex-end"> </div>
    <div class="flex items-end">
      <div class="basis-8/12 text-center">
        <img class="w-[60%] float-right" src="@/assets/imgs/images.png" />
      </div>
      <div class="basis-4/12 text-right text-base"> AUTHONLYLUXURY.COM </div>
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
      <div class="flex items-end">0987654321 - 01245789544 | AUTHONLYLUXURY@GMAIL.COM</div>
    </div>
    <el-divider />

    <div class="flex justify-between">
      <div class="index-trading-code">
        <p class="index">Mẫu số: 6-AU</p>
        <p class="trading-code">Mã Giao Dịch: NHSG440</p>
      </div>
      <div class="liquidation-contract-name">
        <h2>HỢP ĐỒNG KÝ GỬI HÀNG HÓA</h2>
      </div>
    </div>
    <div class="number-location">
      <div class="flex justify-between">
        <p class="number"> Số: 0524 / HĐTLHH </p>
        <p class="location"> Hôm nay, 08/09/2022, tại 116 Nguyễn Cự Trinh, Quận 1, TP HCM. </p>
      </div>
    </div>
    <el-divider />

    <div class="info-include">
      <h3>Chúng tôi gồm có:</h3>
      <div class="info-group">
        <div class="liquidation-party-a mt-3">
          <div class="flex">
            <div class="info w-[200px]">
              <p class="underline">BÊN THANH LÝ(BÊN A):</p>
              <p>MÃ KHÁCH HÀNG:</p>
              <p>ĐỊA CHỈ:</p>
              <p>CMTND/CCCD:</p>
              <P>SỐ ĐIỆN THOẠI:</P>
              <P>TÀI KHOẢN SỐ:</P>
            </div>
            <div class="info">
              <p>{{ dataCustomer?.userName }}</p>
              <p>{{ dataCustomer?.code }}</p>
              <p>{{ dataCustomer?.address }}</p>
              <p>{{ dataCustomer?.cccd }}</p>
              <p>{{ dataCustomer?.phoneNumber }}</p>
              <p></p>
            </div>
          </div>
        </div>

        <div class="liquidation-party-b mt-5">
          <div class="flex">
            <div class="info w-[200px]">
              <p class="underline">BÊN THANH LÝ(BÊN B):</p>
              <p>ĐỊA CHỈ:</p>
              <p>NGƯỜI ĐẠI DIỆN:</p>
              <P>CHỨC VỤ:</P>
              <P>CMTND/CCCD:</P>
              <p>SỐ ĐIỆN THOẠI:</p>
            </div>
            <div class="info">
              <p>MR. LÝ SIN</p>
              <p>03221</p>
              <p>05, ĐƯỜNG THÀNH, HOÀN KIẾM, HÀ NỘI, VIỆT NAM</p>
              <p>0123420442104</p>
              <p>0123420442104</p>
              <p>TECHCOMBANK <strong>0123420442104</strong>, CHỦ TK: LÝ SIN</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-divider />

    <div class="contract-and-signing mb-5">
      <h4>Hai bên cùng thỏa thuận cùng ký kết hợp đồng với những nội dung sau:</h4>
      <h3 class="underline">ĐIỀU 1: ĐỐI TƯỢNG CỦA HỢP ĐỒNG</h3>
      <p
        >I.I. BÊN A - ONG LY TIÉU LONG GIAO CHO BÊN B - CTTNHH AUTHONLY THANH LY HÔ CÁC MÓN DÓ DÃ
        QUA SÙ DUNG THEO PHUONG THÚC KY GÚI. GIÁ CÀ, SÖ LUONG, Ti LÊ HOA HÓNG DUOC CHIÉT KHÃU THEO
        BÀNG MUC DUOI DÂY:
      </p>

      <el-table :data="dataEdit ? dataEdit.orderDetails : []" border class="mt-2">
        <el-table-column prop="stt" type="index" min-width="80" label="Stt" align="center" />
        <el-table-column prop="productCode" label="Mã hàng" align="center" />
        <el-table-column prop="productName" min-width="150" label="Tên hàng" align="center" />
        <el-table-column prop="code" label="Code" align="center" />
        <el-table-column prop="accessory" label="Phụ kiện đi kèm" align="center" />
        <el-table-column prop="unitPrice" label="Giá nhập" align="center" />
        <el-table-column prop="businessSetup" label="Loại hàng" align="center" />
        <el-table-column prop="note" label="Ghi chú" align="center" />
      </el-table>
      
      <div class="total-money text-end pr-[115px]" v-if="dataEdit">
        <p>Tổng tiền | {{ getArraySum(dataEdit.orderDetails) }}</p>
      </div>
    </div>
    <el-divider />
    <p
      >I.I. BÊN A - ONG LY TIÉU LONG GIAO CHO BÊN B - CTTNHH AUTHONLY THANH LY HÔ CÁC MÓN DÓ DÃ QUA
      SÙ DUNG THEO PHUONG THÚC KY GÚI. GIÁ CÀ, SÖ LUONG, Ti LÊ HOA HÓNG DUOC CHIÉT KHÃU THEO BÀNG
      MUC DUOI DÂY:
    </p>
    <p
      >I.I. BÊN A - ONG LY TIÉU LONG GIAO CHO BÊN B - CTTNHH AUTHONLY THANH LY HÔ CÁC MÓN DÓ DÃ QUA
      SÙ DUNG THEO PHUONG THÚC KY GÚI. GIÁ CÀ, SÖ LUONG, Ti LÊ HOA HÓNG DUOC CHIÉT KHÃU THEO BÀNG
      MUC DUOI DÂY:
    </p>
    <p
      >I.I. BÊN A - ONG LY TIÉU LONG GIAO CHO BÊN B - CTTNHH AUTHONLY THANH LY HÔ CÁC MÓN DÓ DÃ QUA
      SÙ DUNG THEO PHUONG THÚC KY GÚI. GIÁ CÀ, SÖ LUONG, Ti LÊ HOA HÓNG DUOC CHIÉT KHÃU THEO BÀNG
      MUC DUOI DÂY:
    </p>

    <h3 class="underline">ĐIỀU 1: ĐỐI TƯỢNG CỦA HỢP ĐỒNG</h3>
    <p
      >I.I. BÊN A - ONG LY TIÉU LONG GIAO CHO BÊN B - CTTNHH AUTHONLY THANH LY HÔ CÁC MÓN DÓ DÃ QUA
      SÙ DUNG THEO PHUONG THÚC KY GÚI. GIÁ CÀ, SÖ LUONG, Ti LÊ HOA HÓNG DUOC CHIÉT KHÃU THEO BÀNG
      MUC DUOI DÂY:
    </p>

    <h3 class="underline">ĐIỀU 1: ĐỐI TƯỢNG CỦA HỢP ĐỒNG</h3>
    <p
      >I.I. BÊN A - ONG LY TIÉU LONG GIAO CHO BÊN B - CTTNHH AUTHONLY THANH LY HÔ CÁC MÓN DÓ DÃ QUA
      SÙ DUNG THEO PHUONG THÚC KY GÚI. GIÁ CÀ, SÖ LUONG, Ti LÊ HOA HÓNG DUOC CHIÉT KHÃU THEO BÀNG
      MUC DUOI DÂY:
    </p>

    <h3 class="underline">ĐIỀU 1: ĐỐI TƯỢNG CỦA HỢP ĐỒNG</h3>
    <p
      >I.I. BÊN A - ONG LY TIÉU LONG GIAO CHO BÊN B - CTTNHH AUTHONLY THANH LY HÔ CÁC MÓN DÓ DÃ QUA
      SÙ DUNG THEO PHUONG THÚC KY GÚI. GIÁ CÀ, SÖ LUONG, Ti LÊ HOA HÓNG DUOC CHIÉT KHÃU THEO BÀNG
      MUC DUOI DÂY:
    </p>

    <h3 class="underline">ĐIỀU 1: ĐỐI TƯỢNG CỦA HỢP ĐỒNG</h3>
    <p
      >I.I. BÊN A - ONG LY TIÉU LONG GIAO CHO BÊN B - CTTNHH AUTHONLY THANH LY HÔ CÁC MÓN DÓ DÃ QUA
      SÙ DUNG THEO PHUONG THÚC KY GÚI. GIÁ CÀ, SÖ LUONG, Ti LÊ HOA HÓNG DUOC CHIÉT KHÃU THEO BÀNG
      MUC DUOI DÂY:
    </p>

    <div class="flex signature justify-around mb-15">
      <div class="receiving-party">
        <h5 class="text-center">BÊN NHẬN</h5>
        <p>(KÝ, GHI RÕ HỌ TÊN)</p>
      </div>

      <div class="sending-party">
        <h5 class="text-center">BÊN GỬI</h5>
        <p>(KÝ, GHI RÕ HỌ TÊN)</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
* {
  font-family: 'Lora', serif;
  font-weight: 500;
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
