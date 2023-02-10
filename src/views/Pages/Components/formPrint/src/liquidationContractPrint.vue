<script setup lang="ts">
import { ElDivider, ElTable, ElTableColumn } from 'element-plus'

import { useI18n } from '@/hooks/web/useI18n'
import { getEmployeeById } from '@/api/Accountant'

import { onBeforeMount, ref } from 'vue'

const { t } = useI18n()

const props = defineProps({
  dataCustomer: {
    type: Object,
    default: () => { }
  },
  dataUser: {
    type: Object,
    default: () => { }
  },
  dataEdit: {
    type: Object,
    default: () => { }
  }
})

const userInfo = ref()
//lấy chi tiết user
const getUser = async () => {
  if (props.dataUser) {
    const res = await getEmployeeById({ Id: props.dataUser?.id })
    userInfo.value = res.data
  }
}

onBeforeMount(() => {
  getUser()
})

function getArraySum(arr) {
  var total = 0
  for (var i in arr) {
    if (arr[i].consignmentSellPrice !== 0) total += arr[i].consignmentSellPrice
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
        <p class="location"> Hôm nay, , tại 116 Nguyễn Cự Trinh, Quận 1, TP HCM. </p>
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
              <p>{{ dataCustomer?.bank?.code }} </p>
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
              <p>{{ userInfo?.name }}</p>
              <p>{{ userInfo?.address }}</p>
              <p>{{ userInfo?.name }}</p>
              <p>{{ userInfo?.name }}</p>
              <p>{{ userInfo?.cccd }}</p>
              <p>{{ userInfo?.phone }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-divider />

    <div class="contract-and-signing mb-5">
      <h4>Hai bên cùng thỏa thuận cùng ký kết hợp đồng với những nội dung sau:</h4>
      <h3 class="underline pt-3">ĐIỀU 1: ĐỐI TƯỢNG CỦA HỢP ĐỒNG</h3>
      <p
        >I.I. BÊN A - {{ dataCustomer?.userName }} GIAO CHO BÊN B - {{ userInfo?.name }} THANH LÝ HỘ CÁC MÓN ĐỒ ĐÃ
        QUA SỬ DỤNG THEO PHƯƠNG THỨC KÝ GỬI. GIÁ CẢ, SỐ LƯỢNG, TỈ LỆ HOA HỒNG ĐƯỢC CHIẾT KHẤU THEO
        BẢNG MỤC DƯỚI DÂY:
      </p>

      <el-table :data="dataEdit ? dataEdit?.orderDetails : []" border class="mt-2">
        <el-table-column prop="stt" type="index" width="100" label="STT" align="center" />
        <el-table-column prop="productCode" label="Mã hàng" min-width="150" align="center" />
        <el-table-column prop="productName" min-width="150" label="Tên hàng" align="center" />
        <el-table-column prop="code" label="Code" min-width="150" align="center" />
        <el-table-column prop="accessory" label="Phụ kiện đi kèm" min-width="150" align="center" />
        <el-table-column prop="description" label="Tình trạng" min-width="150" align="center" />
        <el-table-column prop="consignmentSellPrice" label="Giá nhập" min-width="150" align="center">
          <template #default="data">
            {{ data.row.consignmentSellPrice }} VND
          </template>
        </el-table-column>
        <el-table-column prop="businessSetupName" label="Loại hàng" min-width="150" align="center" />
        <el-table-column prop="note" label="Ghi chú" min-width="150" align="center" />
      </el-table>
      
      <div class="total-money text-end pr-[115px] pt-3" v-if="dataEdit">
        <p>Tổng tiền | {{ getArraySum(dataEdit.orderDetails) }} VND</p>
      </div>
    </div>
    <el-divider />
    
    <p>I.2. BÊN B CÓ QUYỀN TRẢ LẠI NHỮNG MẶT HÀNG KHÔNG ĐÚNG NHƯ CAM KẾT CỦA BÊN A TẠI ĐIỀU 3</p>
    <p>I.3. BÊN B NHẬN MUA LẠI NHỮNG MÓN HÀNG THỜI TRANG BÊN A THANH LÝ DO KHÔNG CÒN NHU CẦU SỬ DỤNG ĐỂ BÁN CHO KHÁCH HÀNG CHO KHÁCH HÀNG MUỐN MUA HÀNG ĐÃ QUA SỬ DỤNG VỚI GIÁ THÀNH TỐT HƠN.</p>
    <p>I.4. SAU KHI HOÀN TẤT THỦ TỤC THÌ SẢN PHẨM BÊN A BÁN / KÝ GỬI CHO BÊN B ĐÃ HOÀN TOÀN THUỘC QUYỀN SỞ HỮU CỦA BÊN B, BÊN A KHÔNG CÓ QUYỀN LẤY LẠI.</p>

    <h3 class="underline pt-3">ĐIỀU 2: PHƯƠNG THỨC THANH TOÁN</h3>
    <p>BÊN B THỰC HIỆN VIỆC KIỂM TRA HÀNG VÀ THANH TOÁN THEO PHƯƠNG THỨC VIETCOMBANK DDAH888.</p>
   
    <h3 class="underline pt-3">ĐIỀU 3: CAM KẾT SỬ DỤNG DỊCH VỤ</h3>
    <p>3.1. BÊN A CAM KẾT NHỮNG MÓN ĐỒ THANH LÝ CHO BÊN B LÀ HÀNG CHÍNH HÃNG, THUỘC QUYỀN SỞ HỮU CỦA MÌNH, KHÔNG PHẢI DO
      PHẠM TỘI MÀ CÓ VÀ HOÀN TOÀN CHỊU TRÁCH NHIỆM TRƯỚC PHÁP LUẬT VỀ NGUỒN GỐC XUẤT XỨ CỦA HÀNG HÓA NÊU TRÊN.</p>
    <p>3.2. SAU KHI NHẬN HÀNG, BÊN B CHỊU TRÁCH NHIỆM THANH TOÁN CHO BÊN A ĐẦY ĐỦ VÀ ĐÚNG HẸN.</p>

    <h3 class="underline pt-3">ĐIỀU 4: GIẢI QUYẾT TRANH CHẤP</h3>
    <p>4.1. HAI BÊN CẦN CHỦ ĐỘNG THÔNG BÁO CHO NHAU BIẾT TÌNH HÌNH THỰC HIỆN HỢP ĐỒNG, NẾU CÓ GÌ BẤT LỢI PHÁT SINH, CÁC BÊN PHẢI KỊP THỜI THÔNG BÁO CHO NHAU BIẾT VÀ TÍCH CỰC GIẢI QUYẾT TRÊN CƠ SỞ THƯƠNG LƯỢNG, BÌNH ĐẲNG, CÓ LỢI (CÓ LẬP BIÊN BẢN).</p>
    <p>4.2. TRƯỜNG HỢP CÁC BÊN KHÔNG TỰ GIẢI QUYẾT ĐƯỢC MỚI ĐƯA VIỆC TRANH CHẤP RA TÒA ÁN GIẢI QUYẾT, HỢP ĐỒNG ĐƯỢC THÀNH LẬP THÀNH 02 (HAI) BẢN, MỖI BÊN GIỮ MỘT BẢN VÀ CÓ GIÁ TRỊ NHƯ NHAU.</p>

    <h3 class="underline pt-3">ĐIỀU 5: CAM KẾT SỬ DỤNG DỊCH VỤ</h3>
    <p>5.1. BÊN A CAM KẾT NHỮNG MÓN ĐỒ GIAO CHO BÊN B THANH LÝ HỘ LÀ HÀNG CHÍNH HÃNG THUỘC QUYỀN SỞ HỮU CỦA MÌNH, KHÔNG PHẢI DO PHẠM TỘI MÀ CÓ VÀ HOÀN THÀNH CHỊU TRÁCH NHIỆM TRƯỚC PHÁP LUẬT VỀ NGUỒN GỐC XUẤT XỨ CỦA NHỮNG HÀNG HÓA NÊU TRÊN.</p>
    <p>5.2. SAU KHI NHẬN HÀNG, BÊN B PHẢI CHỊU TRÁCH NHIỆM VỀ SỰ HƯ HỎNG, MẤT MÁT, MẶC DÙ QUYỀN SỞ HỮU HÀNG HÓA TẠI CỬA HÀNG VẪN THUỘC VỀ BÊN A VÀ CÓ QUYỀN RÚT HÀNG KÝ GỬI VỀ KHI CÓ THÔNG BÁO TRƯỚC CHO BÊN B.</p>
    <p>5.3. THỜI HẠN BÊN A KÝ GỬI BÊN B ÍT NHẤT LÀ 15 NGÀY, SAU 15 NGÀY NẾU BÊN B CHƯA BÁN ĐƯỢC HÀNG CHO BÊN A, BÊN A CÓ QUYỀN LẤY HÀNG VỀ. NẾU DƯỚI 15 NGÀY MÀ BÊN A MUỐN LẤY HÀNG VỀ PHẢI CHỊU PHÍ 10%.</p>
    

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
