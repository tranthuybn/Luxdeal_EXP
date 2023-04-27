<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ElTable, ElTableColumn } from 'element-plus'
import { dateTimeFormat } from '@/utils/format'
import { changeMoney } from '@/utils/tsxHelper'
import { onBeforeMount } from 'vue'
const { t } = useI18n()

const props = defineProps({
  priceBillPawn: {
    type: Number,
    default: NaN
  },
  formData: {
    type: Object,
    default: () => {}
  },
  dataCustomer: {
    type: Object,
    default: () => { }
  },
  dataEdit: {
    type: Object,
    default: () => { }
  },
  dayPayment: {
    type: Number,
    default: 0
  }
})

const tradingCode = ref('CDSG0273')
const payeeTableDate = reactive([{}])
const payeeDateDefault = {
  date: '',
  content: '',
  amountOfMoney: '',
  customerSign: '',
}
onBeforeMount(() => {
  for(let i = 0; i < 20; i++){
    payeeTableDate.push(payeeDateDefault)
  }
})

</script>

<template>
  <div class="p-5 break-words">
    <div class="h-screen">
      <div class="flex justify-between">
        <div class="logo-luxury">
          <img class="w-[30%]" src="@/assets/imgs/images.png" />
        </div>
        <div class="index-code w-[35%] text-xs">
          <p>Mẫu số: 04a-AU</p>
          <p>Mã giao dịch: {{ tradingCode }}</p>
        </div>
      </div>
  
      <div class="infomation text-xs">
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
          <p>authonlyluxury@gmail.com</p>
        </div>
  
        <div class="flex gap-3">
          <p class="font-bold w-[80px]">Website:</p>
          <p>https://authonlyluxury.com</p>
        </div>
      </div>
  
      <div class="title-bill font-bold text-center py-3 text-xl">BIÊN BẢN XÁC NHẬN KHOẢN VAY</div>
  
      <div class="flex justify-between text-xs">
        <div class="flex-left">
          <div class="flex gap-3">
            <p class="w-[160px]">Ngày:</p>
            <p>{{ dateTimeFormat(new Date()) }}</p>
          </div>
  
          <div class="flex gap-3">
            <p class="w-[160px]">Họ và tên khách hàng:</p>
            <p>{{ dataCustomer?.userName }}</p>
          </div>
  
          <div class="flex gap-3">
            <p class="w-[160px]">Giá trị hàng cầm đồ:</p>
            <p>{{ changeMoney.format(props.priceBillPawn) }}</p>
          </div>
  
          <div class="flex gap-3">
            <div class="">
              <p class="w-[160px]">Bằng chữ:</p>
              <p class="">Chi phí gồm: chi phí lãi + phí lưu kho + phí thẩm định</p>
            </div>
            <div class="flex gap-3">
              <p>{{  }}</p>
            </div>
          </div>
        </div>
  
        <div class="flex-right">
          <div class="phone flex gap-3">
            <p>Số điện thoại: </p>
            <p class="mb-6 phone-number"> {{ dataCustomer?.phoneNumber }} </p>
          </div>
  
          <div class="flex gap-3">
            <p>Số ngày trả lãi một đợt:</p>
            <p class="day-return">{{ dayPayment }} ngày </p>
          </div>
        </div>
      </div>
  
      <div class="pawn-property">
        <p class="title-table mt-3 text-xs">Tài sản cầm đồ: </p>
        <el-table 
         size="small" 
         :data="dataEdit ? dataEdit?.orderDetails : []" 
         class="mt-2"
         header-row-class-name="text-black border-black border text-[10px]"
        header-cell-class-name="border-black border text-center"
        cell-class-name="border-black border px-0.5"
         >
          <el-table-column prop="productCode"  :label="t('reuse.productCode')" align="center" />
          <el-table-column prop="productName"  :label="t('formDemo.commodityName')" align="center" />
          <el-table-column prop="accessory"  label="Phụ kiện đi kèm" align="center" />
          <el-table-column prop="quantity"  :label="t('reuse.quantity')" align="center" />
          <el-table-column prop="unitName" width="50" :label="t('reuse.unitNamePawn')" align="center" />
          <el-table-column prop="interestMoney" :label="t('reuse.intoMoneyByday')"  align="center" >
            <template #default="data">
              {{ changeMoney.format(data.row.interestMoney) }}
            </template>
          </el-table-column>
          <el-table-column prop="unitPrice" :label="t('formDemo.moneyPawnGOC')"  align="center" >
            <template #default="data">
              {{ changeMoney.format(data.row.unitPrice) }}
            </template>
          </el-table-column>
        </el-table>
      </div>
  
      <p class="assure mt-3 text-xs">
        Tôi xin cam đoan tài sản thế chấp trên thuộc quyền sở hữu, sử dụng hợp pháp của mình. Tôi sẽ thanh toán nợ gốc, lãi cho Authonly đầy đủ, đúng hạn. Khi số dư nợ lãi đến 30 ngày mà tôi không thanh toán, Authonly có toàn quyền xử lý tài sản thế chấp để thu hồi nợ vay. Nếu vi phạm các cam kết trên, tôi xin hoàn toàn chịu trách nhiệm.
      </p>
      <p class="text-xs">Hợp đồng cầm đồ bên Authonly chỉ giải quyết với chính chủ theo tên và chứng minh của khách hàng đã kí từ lúc đầu hoặc có giấy ủy quyền, sang nhượng của chủ hợp đồng.</p>
    </div>
    
    <div>
      <div class="money-receipt text-center font-bold py-3 text-xl">BIÊN NHẬN TIỀN</div>

      <ElTable 
        :data="payeeTableDate" 
        header-row-class-name="text-black border-black border text-[10px]"
        header-cell-class-name="border-black border text-center"
        cell-class-name="border-black border px-0.5 h-6"
      >
        <ElTableColumn :label="t('formDemo.day')" prop="date"/>
        <ElTableColumn :label="t('reuse.content')" prop="content"/>
        <ElTableColumn :label="t('reuse.amountOfMoney')" prop="amountOfMoney"/>
        <ElTableColumn :label="t('reuse.customerSign')" prop="customerSign"/>
      </ElTable>
  
      <div class="signature-confirmation my-3">
        <div class="flex justify-around text-xs">
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
    </div>
</template>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');

* {
  font-family: Lora, serif;
}


::v-deep(.el-table--fit){
  border-right: 1px solid #000;
  border-bottom: 1px solid #000;
}
</style>
