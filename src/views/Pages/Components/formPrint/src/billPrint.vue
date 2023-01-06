<script setup lang="ts">
import { useI18n } from '@/hooks/web/useI18n'
// import { useIcon } from '@/hooks/web/useIcon'

import { ElDivider, ElTable, ElTableColumn } from 'element-plus'

const { t } = useI18n()
// const locateIcon = useIcon({ icon: 'entypo:location' })
// const callIcon = useIcon({ icon: 'fluent:chat-mail-20-filled' })

const props = defineProps({
  dataEdit: {
    type: Object,
    default: () => {}
  },
  nameDialog: {
    type: String,
    default: () => ''
  }
})

const policySale = [
  {
    title: 'Quý khách vui lòng kiểm tra hàng trước khi thanh toán',
    id: 1
  },
  {
    title: 'Thời hạn đổi trả sản phẩm là 3 ngày kể từ ngày mua hàng',
    id: 2
  },
  {
    title: 'Hàng đổi trả cần ở tình trạng nguyên vẹn',
    id: 3
  }
]

const policyDeposit = [
  {
    title: 'Thời hạn thanh toán tối đa sau khi tiến hành đặt cọc...',
    id: 1
  },
  {
    title: 'Thời hạn hủy đơn hàng là 1 ngày sau khi tiến hành đặt cọc',
    id: 2
  }
]
function getArraySum(arr) {
  var total = 0
  for (var i in arr) {
    if (arr[i].finalPrice !== 'đ') total += arr[i].finalPrice
  }
  return total
}
</script>

<template>
  <div>
    <div class="flex items-end pb-[30px]">
      <div class="basis-8/12 text-center">
        <img class="w-[60%] float-right" src="@/assets/imgs/images.png" />
      </div>
      <div class="basis-4/12 text-right"> AUTHONLYLUXURY.COM </div>
    </div>
    <div class="flex justify-between">
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

    <div class="flex justify-between items-center divide-x">
      <div class="basis-5/12">
        <div class="flex pb-2 items-center">
          <label class="basis-2/5">{{ t('reuse.customerName') }}:</label>
          <div v-if="dataEdit" class="basis-3/5">{{ dataEdit.customer.name }}</div>
        </div>
        <div class="flex pb-2 items-center">
          <label class="basis-2/5">{{ t('formDemo.address') }}:</label>
          <div v-if="dataEdit" class="basis-3/5">{{ dataEdit.address }}</div>
        </div>
        <div class="flex pb-2 items-center">
          <label class="basis-2/5">{{ t('reuse.phoneNumber') }}:</label>
          <div v-if="dataEdit" class="basis-3/5">{{ dataEdit.customer.phonenumber }}</div>
        </div>
      </div>
      <div class="basis-7/12 text-center">
        <p v-if="nameDialog === 'bill'" class="text-4xl">Phiếu thanh toán</p>
        <p v-else class="text-4xl">Phiếu đặt cọc</p>
        <div class="flex justify-center pb-3">
          <label class="mr-2">{{ t('formDemo.day') }}:</label>
          <div>{{ new Date().toLocaleDateString() }}</div>
        </div>
        <div class="flex justify-center">
          <label class="mr-2 text-1xl">{{ t('formDemo.orderCode') }}:</label>
          <div v-if="dataEdit" class="text-1xl">{{ dataEdit.code }}</div>
        </div>
      </div>
    </div>

    <el-divider />

    <div class="pb-[16px]">
      <el-table
        ref="singleTableRef"
        :data="dataEdit ? dataEdit.orderDetails : []"
        border
        style="width: 100%"
      >
        <el-table-column label="STT" type="index" width="60" align="center" />
        <el-table-column prop="productName" :label="t('formDemo.commodityName')" width="280" />
        <el-table-column prop="quantity" :label="t('reuse.quantity')" width="90" />
        <el-table-column prop="price" :label="t('reuse.unitPrices')">
          <template #default="data">
            <div class="text-right">{{ data.row.price }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="finalPrice" :label="t('formDemo.intoMoney')">
          <template #default="data">
            <div class="text-right">{{ data.row.quantity * data.row.price }}</div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="flex justify-between items-start pb-[20px]">
      <div class="border basis-6/12 p-2">
        Chính sách:
        <div v-if="nameDialog === 'bill'">
          <div v-for="policy in policySale" :key="policy.id"> - {{ policy.title }} </div>
        </div>
        <div v-else>
          <div v-for="policy in policyDeposit" :key="policy.id"> - {{ policy.title }} </div>
        </div>
      </div>
      <div class="basis-5/12 flex flex-col justify-between">
        <div v-if="nameDialog === 'bill'">
          <div class="bill flex justify-between">
            <div class="text-[20px]">{{ t('formDemo.total') }}</div>
            <div v-if="dataEdit">{{ getArraySum(dataEdit.orderDetails) }} VNĐ</div>
          </div>
          <div class="bill flex justify-between">
            <div class="text-[20px]">{{ t('formDemo.status') }}</div>
            <div>Đã thanh toán</div>
          </div>
        </div>
        <div v-else>
          <div class="deposit flex justify-between">
            <div class="text-[20px]">{{ t('formDemo.total') }}</div>
            <div v-if="dataEdit">150.000.000 VNĐ</div>
          </div>
          <div class="deposit flex justify-between text-[#409eff]">
            <div class="text-[20px]">{{ t('formDemo.deposit') }}</div>
            <div v-if="dataEdit">50.000.000 VNĐ</div>
          </div>
          <div class="deposit flex justify-between text-[#f56c6c]">
            <div class="text-[20px]">{{ t('router.cashReturn') }}</div>
            <div v-if="dataEdit">100.000.000 VNĐ</div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex h-[16vh] justify-between text-center pb-3">
      <div class="text-1xl font-medium border-b basis-4/12">
        <div> Chữ ký khách hàng </div>
        <div> (Customer's signature) </div>
      </div>
      <div class="text-1xl font-medium border-b basis-4/12">
        <div> Đại diện bán hàng </div>
        <div> (Sale respresantatives) </div>
      </div>
    </div>

    <div>
      <div class="text-center text-[20px]"> TRÂN TRỌNG CẢM ƠN QUÝ KHÁCH! </div>
      <div class="text-center text-base"> Thank you for being our valued customer! </div>
    </div>
  </div>
</template>

<style scoped>
.el-divider--horizontal {
  margin: 14px 0;
}
.bill:nth-child(1) {
  padding-bottom: 12px;
}
.bill:nth-child(2) {
  padding: 16px 0;
  border-top: 1px solid #e5e7eb;
}
.deposit:nth-child(1) {
  padding-bottom: 12px;
}
.deposit:nth-child(2) {
  padding-bottom: 12px;
}
.deposit:nth-child(3) {
  padding: 12px 0;
  border-top: 1px solid #e5e7eb;
}
</style>
