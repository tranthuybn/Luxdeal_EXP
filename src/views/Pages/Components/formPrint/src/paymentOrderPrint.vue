<script setup lang="ts">
import { ElDivider, ElTable, ElTableColumn } from 'element-plus'
import { changeMoney } from '@/utils/tsxHelper'
import { useI18n } from '@/hooks/web/useI18n'
import { computed, onBeforeMount, reactive } from 'vue'

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
const dataTableDefault: any = reactive([])
onBeforeMount(() => {
  for (let i = 0; i < 10; i++) {
    dataTableDefault.push({
        numberVouchers: '',
        dayVouchers: '',
        spentFor: '',
        quantity: '',
        unitPrice: '',
        finalPrice: '',
        note: ''
    })
  } 
})

const dataTable = computed(() => {
  if(props.dataSent?.detailedListExpenses.length > 0) return props.dataSent?.detailedListExpenses
  return dataTableDefault
})

const checkUnitPrice = computed(() => {
  const price = Number(props.dataSent?.detailedListExpenses?.unitPrice)
  if(price) return currencyFormatter.format(price)
  return ''
})
const checkFinalPrice = computed(() => {
  const price = Number(props.dataSent?.detailedListExpenses?.unitPrice)
  const quantity = Number(props.dataSent?.detailedListExpenses?.quantity)
  if(price) return currencyFormatter.format(price * quantity)
  return ''
})
// console.log('dataTableDefault', dataTableDefault)
console.log('dataEdit', props.dataEdit)
console.log('dataSent', props.dataSent)
const currencyFormatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
</script>

<template>
  <div class="w-full h-full p-4 pt-7">
    <div class="flex" style="width: 100%; font-size: 10px;">
      <div class="basis-3/12">
        <img src="@/assets/imgs/images.png" />
      </div>
  
      <div class="basis-9/12">
        <div class="font-bold text-1xl uppercase pl-[30px]"> {{ t('reuse.labelPaymentProposalprint') }} </div>
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
      <div class="flex items-center text-xs">
        <label class="font-bold basis-5/12">{{ t('reuse.fullName') }} :</label>
        <div>{{ props.dataEdit.userName ?? '' }} </div>
      </div>
      <div class="flex items-center text-xs">
        <label class="font-bold basis-5/12"
          >{{ t('formDemo.paymentOrder') }} {{ t('reuse.amountOfMoney') }} :</label
        >
        <div>{{ props.dataSent?.moneyReceipts ? changeMoney.format(props.dataSent.moneyReceipts) : 0 }}</div>
      </div>
      <div class="flex items-center text-xs">
        <label class="font-bold basis-5/12">{{ t('reuse.paymentReason') }} :</label>
        <div>{{ props.dataSent.inputReasonCollectMoney ?? '' }}</div>
      </div>
      <div class="flex items-center text-xs ">
        <label class="font-bold basis-5/12">{{ t('formDemo.formPayment') }} :</label>
        <div class="mr-2">{{ props.dataSent.payment}}</div>
      </div>
      <div class="flex items-center text-xs">
        <label class="font-bold basis-5/12">{{ t('userDemo.accountInfo') }} :</label>
        <div class="uppercase">{{ props.dataEdit?.accountName}}</div>
      </div>
      <div class="flex items-center text-xs">
        <label class="basis-5/12">{{ t('userDemo.accountNumber') }} :</label>
        <div>{{ props.dataEdit?.accountNumber}}</div>
      </div>
    </div>
    <div>
      <div class="font-bold text-xs mb-2">{{ t('formDemo.detailedlistofexpenses') }}</div>
      <el-table size="small" ref="singleTableRef" :data="dataTable"  border>
        <el-table-column label="Chứng từ" align="center">
          <el-table-column align="center" type="index" label="STT"  />
          <el-table-column prop="numberVouchers" label="Số" />
          <el-table-column prop="dayVouchers" label="Ngày"  />
        </el-table-column>
        <el-table-column prop="spentFor" width="90px" :label="t('formDemo.spendFor')" />
        <el-table-column prop="quantity" width="40px" :label="t('formDemo.sl')"  />
        <el-table-column prop="unitPrice"  width="50px" :label="t('reuse.unitPrice')">
          <template #default>
            <div class="text-right">{{ checkUnitPrice }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="finalPrice" width="60px" :label="t('reuse.amountMoneyVnd')">
          <template #default>
            <div class="text-right">{{ checkFinalPrice }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="note" :label="t('reuse.note')"  />
      </el-table>
    </div>
  
    <div class="flex h-[16vh] justify-between text-center mt-4">
      <div class="text-xs font-medium border-b basis-3/10">
        <div> Giám đốc </div>
      </div>
      <div class="text-xs font-medium border-b basis-3/10">
        <div> Kế toán trưởng </div>
      </div>
      <div class="text-xs font-medium border-b basis-3/10">
        <div> Người lập bảng kê </div>
      </div>
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

@page {
  size: A5 portrait;
  margin: 0;
}

@media print {
  * {
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
    box-sizing: border-box !important;
    page-break-inside: avoid !important;
    text-shadow: none !important;
    background: none !important;
    box-shadow: none !important;
  }
  body {
    margin: 0;
    padding: 0;
  }
}

</style>
