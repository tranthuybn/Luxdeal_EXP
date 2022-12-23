<script setup lang="ts">
import { ElTable, ElTableColumn } from 'element-plus'

import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()
const tableData = [
  {
    stt: 1,
    codeProduct: '159853',
    name: 'Túi Dior lady mini màu metalic bạc khóa trắng',
    code: '15-bo-1115',
    assetsory: 'dây đeo dài',
    price: '25,000,000',
    category: 'Nhập Bán',
    note: ''
  }
]

const props = defineProps({
  dataCustomer: {
    type: Object,
    default: () => {}
  }
})

console.log('dataCustom: ', props.dataCustomer)
</script>

<template>
  <div class="content">
    <div class="flex">
      <div class="flex-1">
        <div class="text-center">
          <img class="w-[30%]" src="@/assets/imgs/images.png" />
        </div>
        <div class="mt-1">
          <div class="flex pb-1 items-center">
            <label class="mr-2 font-bold">{{ t('formDemo.address') }}:</label>
            <div>73B Lý Nam Đế, Q. Hoàn Kiếm, Hà Nội.</div>
          </div>
          <div class="flex pb-1 items-center">
            <label class="mr-2 font-bold">{{ t('formDemo.phoneNumber') }}:</label>
            <div>0982356789 - 0982021919</div>
          </div>
          <div class="flex pb-1 items-center">
            <label class="mr-2 font-bold">{{ t('reuse.email') }}:</label>
            <div>authonlyluxury@gmai.com</div>
          </div>
          <div class="flex pb-1 items-center">
            <label class="mr-2 font-bold">{{ t('formDemo.website') }}:</label>
            <div>https://authonlyluxury.com</div>
          </div>
        </div>
      </div>
      <div class="flex-1 items-end">
        <div class="flex pb-1 items-center">
          <label class="mr-2 font-bold">Mẫu số:</label>
          <div>6-AU</div>
        </div>
        <div class="flex pb-1 items-center">
          <label class="mr-2 font-bold">Mẫu giao dịch:</label>
          <div>NHLND1338</div>
        </div>
      </div>
    </div>
    <div class="mt-2">
      <div class="text-center">
        <div class="liquidation-contract-name">
          <h2 class="font-bold">HỢP ĐỒNG THANH LÝ HÀNG HÓA</h2>
        </div>
        <div>
          <p class="number"> Số: 1338 / HĐTLHH </p>
        </div>
      </div>
      <div class="mt-3">
        <p class="location"> Hôm nay, 15/12/2022, tại 73B Lý Nam Đế, Q. Hoàn Kiếm, Hà Nội. </p>
      </div>
      <div>
        <p>Chúng tôi gồm có:</p>
        <div>
          <p class="font-bold">BÊN KÝ GỬI HÀNG HÓA (BÊN A): {{ dataCustomer?.userName }}</p>
          <p>Mã khách hàng: {{ dataCustomer?.code }}</p>
          <p>Địa chỉ: {{ dataCustomer?.address }}</p>
          <p>Số CMT: {{ dataCustomer?.cccd }}</p>
          <p>Điện thoại: {{ dataCustomer?.phoneNumber }}</p>
          <p>Tài khoản số: Stk: </p>
        </div>
        <div>
          <p class="font-bold">BÊN CỬA HÀNG ỦY QUYỀN THANH LÝ HỘ (BÊN B): Giang Huyền Trang</p>
          <p>Địa chỉ: 73B Lý Nam Đế, Q. Hoàn Kiếm, Hà Nội.</p>
          <p>Điện thoại: 0982.356.789</p>
          <p>Do ông (bà): NGUYỄN THỊ THANH TÂM</p>
          <p>Số CMT: 0001198020666</p>
          <p>Chức vụ: Chủ cửa hàng làm đại diện</p>
        </div>
        <p>Hai bên cùng thỏa thuận ký hợp đồng với những nội dung sau:</p>
        <div>
          <p class="font-bold">ĐIỀU 1: ĐỐI TƯỢNG CỦA HỢP ĐỒNG</p>
          <P
            >1.1 Bên ký gửi ông/bà: Khúc Thiên Trinh giao cho bên cửa hàng Authonly thanh lý hộ các
            món đồ đã qua sử dụng theo phương thức ký gửi các món đồ, giá cả, số lượng, tỉ lệ hoa
            hồng được chiết khấu theo bảng mục dưới đây:</P
          >
          <el-table :data="tableData" border class="mt-2">
            <el-table-column prop="stt" min-width="80" label="Stt" align="center" />
            <el-table-column prop="codeProduct" label="Mã hàng" align="center" />
            <el-table-column prop="name" min-width="150" label="Tên hàng" align="center" />
            <el-table-column prop="code" label="Code" align="center" />
            <el-table-column prop="assetsory" label="Phụ kiện đi kèm" align="center" />
            <el-table-column prop="price" label="Giá nhập" align="center" />
            <el-table-column prop="category" label="Loại hàng" align="center" />
            <el-table-column prop="note" label="Ghi chú" align="center" />
          </el-table>
          <!-- <el-table>
            <el-table-column prop="note" align="center" />
          </el-table> -->
          <div class="total-money text-end pr-[115px]">
            <p class="total">Tổng tiền 400.000</p>
          </div>
          <div class="mt-2">
            <p
              >1.2. <strong>Bên B</strong> có quyền trả lại những mặt hàng không đúng như cam kết
              của <strong>bên A</strong> tại Điều 3</p
            >
            <p
              >1.3. <strong>Bên B</strong> nhận mua lại những món hàng thời trang
              <strong>bên A</strong> thanh lý do không còn nhu cầu sử dụng nữa để bán lại cho khách
              hàng muốn mua hàng cũ với giá thành tốt hơn</p
            >
            <p
              >1.4. Sau khi hoàn tất thủ tục thì sản phẩm <strong>bên A</strong> bán/kí gửi cho
              <strong>bên B</strong> và <strong>bên A</strong> không có quyền lấy lại</p
            >
            <p class="mt-3 font-bold">ĐIỀU 2: PHƯƠNG THỨC THANH TOÁN</p>
            <p
              ><strong>Bên B</strong> thực hiện việc kiểm hàng và thanh toán theo phương thức:
              Vietcombank ĐAH 888</p
            >
            <p class="mt-3 font-bold">ĐIỀU 3: CAM KẾT SỬ DỤNG DỊCH VỤ</p>
            <p
              >3.1. <strong>Bên A</strong> cam kết những món đồ thanh lý cho
              <strong>bên B</strong> là hãng chính hãng, thuộc quyền sở hữu của mình không phải do
              phạm tội mà có và hoàn toàn chịu trách nhiệm trước pháp luật về nguồn gốc xuất xứ của
              hàng hóa nêu trên.</p
            >
            <p
              >3.2. Sau khi nhận hàng, <strong>bên B</strong> chịu trách nhiệm thanh toán cho
              <strong>bên A</strong> đầy đủ và đúng hẹn.</p
            >
          </div>
        </div>
      </div>

      <div class="flex signature justify-around mb-15">
        <div class="receiving-party">
          <h5 class="text-center font-bold">Bên nhận</h5>
          <p>(Ký, ghi rõ họ tên)</p>
        </div>

        <div class="sending-party">
          <h5 class="text-center font-bold">Bên gửi</h5>
          <p>(Ký, ghi rõ họ tên)</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.content {
  font-family: 'Times New Roman', Times, serif;
  font-size: 13px;
}
::v-deep(table) {
  font-size: 13px;
}
</style>
