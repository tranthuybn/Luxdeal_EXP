<script setup lang="ts">
import { ElDivider, ElTable, ElTableColumn } from 'element-plus'
import { changeMoney } from '@/utils/tsxHelper'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

const props = defineProps({
  dataEdit: {
    type: Object,
    default: () => {}
  },
  dataSent:{
    type: Object,
    default: () => {}
  }
})
console.log('dataEdit', props.dataEdit)
console.log('dataSent', props.dataSent)
const currencyFormatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
</script>

<template>
  <div class="flex" style="width: 100%; font-size: 10px;">
    <div class="basis-3/12">
      <img src="@/assets/imgs/images.png" />
    </div>

    <div class="basis-9/12">
      <div class="font-bold text-2xl uppercase pl-[30px]"> {{ t('reuse.labelPaymentProposalprint') }} </div>
      <el-divider />
      <div class="flex justify-between">
        <div class="pl-[72px]"
          >Ngày {{ new Date().getDate() }} tháng {{ new Date().getMonth() + 1 }} năm
          {{ new Date().getFullYear() }}</div
        >
        <div>BM_02-13_01/v1.0</div>
      </div>
      <div class="float-right">
        <div class="flex pb-1">
          <label class="mr-2 font-bold">Số: </label>
          <div class="">.......................</div>
        </div>
        <div class="flex pb-1">
          <label class="mr-2 font-bold">Nợ: </label>
          <div class="">.......................</div>
        </div>
        <div class="flex pb-1">
          <label class="mr-2 font-bold">Có: </label>
          <div class="">.......................</div>
        </div>
        <div class="flex pb-1">
          <label class="mr-2 font-bold">Phòng ban: </label>
          <div class="">Văn phòng</div>
        </div>
      </div>
    </div>
  </div>

  <div class="pb-1 ">
    <div class="flex items-center ">
      <label class="font-bold basis-5/12">{{ t('reuse.fullName') }} :</label>
      <div>{{ props.dataEdit.userName ?? '' }} </div>
    </div>
    <div class="flex items-center ">
      <label class="font-bold basis-5/12"
        >{{ t('formDemo.paymentOrder') }} {{ t('reuse.amountOfMoney') }} :</label
      >
      <div>{{ props.dataSent?.moneyReceipts ? changeMoney.format(props.dataSent.moneyReceipts) : 0 }}</div>
    </div>
    <div class="flex items-center ">
      <label class="font-bold basis-5/12">{{ t('reuse.paymentReason') }} :</label>
      <div>{{ props.dataSent.inputReasonCollectMoney ?? '' }}</div>
    </div>
    <div class="flex items-center ">
      <label class="font-bold basis-5/12">{{ t('formDemo.formPayment') }} :</label>
      <div class="mr-2">{{ props.dataSent.payment}}</div>
    </div>
    <div class="flex items-center ">
      <label class="font-bold basis-5/12">{{ t('userDemo.accountInfo') }} :</label>
      <div class="uppercase">{{ props.dataEdit?.accountName}}</div>
    </div>
    <div class="flex items-center ">
      <label class="basis-5/12">{{ t('userDemo.accountNumber') }} :</label>
      <div>{{ props.dataEdit?.accountNumber}}</div>
    </div>
  </div>

  <div class="m-6">
    <div class="font-bold  pb-5">Bảng kê chi tiết các khoản chi</div>
    <el-table ref="singleTableRef" style="margin-right: 5px ;" v-if="dataSent"  :data="dataSent ? dataSent.detailedListExpenses : []"  border>
      <el-table-column label="Chứng từ" align="center">
        <el-table-column prop="STT" type="index" label="STT"  />
        <el-table-column prop="numberVouchers" label="Số" />
        <el-table-column prop="dayVouchers" label="Ngày"  />
      </el-table-column>
      <el-table-column prop="spentFor" :label="t('formDemo.spendFor')" />
      <el-table-column prop="quantity" :label="t('formDemo.sl')"  />
      <el-table-column prop="unitPrice" :label="t('reuse.unitPrice')">
        <template #default="data">
          <div class="text-right">{{ currencyFormatter.format(data.row.unitPrice) }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="finalPrice" :label="t('reuse.amountMoneyVnd')">
        <template #default="data">
          <div class="text-right">{{ currencyFormatter.format(data.row.quantity * data.row.unitPrice) }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="note" :label="t('reuse.note')"  />
    </el-table>
  </div>

  <div class="flex h-[16vh] justify-between text-center">
    <div class="text-1xl font-medium border-b basis-3/10">
      <div> Giám đốc </div>
    </div>
    <div class="text-1xl font-medium border-b basis-3/10">
      <div> Kế toán trưởng </div>
    </div>
    <div class="text-1xl font-medium border-b basis-3/10">
      <div> Người lập bảng kê </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');

* {
  font-family: Lora, serif;
  font-weight: 500;
}

.el-divider--horizontal {
  margin: 0;
}
</style>
