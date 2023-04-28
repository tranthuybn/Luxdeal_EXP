<script setup lang="ts">
import { ElDivider, ElTable, ElTableColumn} from 'element-plus'
import { changeMoney, formartDate } from '@/utils/tsxHelper'
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
const defaultRowNumber = 7
const rowData = {
  numberVouchers: '',
  dayVouchers: '',
  spentFor: '',
  quantity: '',
  unitPrice: '',
  totalPrice: '',
  note: ''
}
const appendRow = [
  {
    spentFor: t('reuse.totaMoney'),
    totalPrice: props.dataSent?.totalPrice || ''
  },
  {
    spentFor: t('formDemo.deposit'),
    totalPrice: props.dataSent?.depositeMoney || ''
  },
  {
    spentFor: t('reuse.remaining'),
    totalPrice: props.dataSent?.debtMoney || ''
  },
]
const dataTableDefault: any = reactive([])
onBeforeMount(() => {
  for (let i = 0; i < defaultRowNumber; i++) {
    dataTableDefault.push(rowData)
  } 
  dataTableDefault.push(...appendRow)
})

const dataTable = computed(() => {
  const tableExpensesData = props.dataSent?.detailedListExpenses
  if(tableExpensesData && tableExpensesData.length > 0) {
    const tableExpensesDataLength = tableExpensesData.length
    if(tableExpensesDataLength < defaultRowNumber){
      for(let i = 0; i < (defaultRowNumber - tableExpensesDataLength); i++){
        tableExpensesData.push(rowData)
      }
      tableExpensesData.push(...appendRow)
    }
    return tableExpensesData
  }
  return dataTableDefault
})

const checkUnitPrice = ({row}) => {
  const price = Number(row?.unitPrice)
  if(price) return currencyFormatter.format(price)
  return ''
}
const checkTotalPrice = ({row}) => {
  if(row?.totalPrice) return currencyFormatter.format(row.totalPrice)
  const price = Number(row?.unitPrice)
  const quantity = Number(row?.quantity)
  if(price) return currencyFormatter.format(price * quantity)
  return ''
}

console.log('dataEdit', props.dataEdit)
console.log('dataSent', props.dataSent)
const currencyFormatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
</script>

<template>
  <div class="w-full h-full pt-4 p-4">
    <div class="flex" style="width: 100%; font-size: 10px;">
      <div class="basis-3/12">
        <img src="@/assets/imgs/images.png" />
      </div>
  
      <div class="basis-9/12">
        <div class="font-bold text-1xl uppercase pl-[30px]"> {{ t('reuse.labelPaymentProposalprint') }} </div>
        <el-divider />
        <div class="flex justify-between mt-1">
          <div class="pl-[72px] text-[10px]"
            >Ngày {{ new Date().getDate() }} tháng {{ new Date().getMonth() + 1 }} năm
            {{ new Date().getFullYear() }}</div
          >
          <div>BM_02-13_01/v1.0</div>
        </div>
        <div class="float-right text-[10px]">
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
  
    <div class="pb-1 text-[10px]">
      <div class="flex items-center">
        <label class="font-bold basis-4/12 mb-1">{{ t('reuse.fullName') }} :</label>
        <div>{{ props.dataEdit.userName ?? '' }} </div>
      </div>
      <div class="flex items-center">
        <label class="font-bold basis-4/12 mb-1"
          >{{ t('formDemo.paymentOrder') }} {{ t('reuse.amountOfMoney') }} :</label
        >
        <div>{{ props.dataSent?.money ? changeMoney.format(props.dataSent.money) : 0 }}</div>
      </div>
      <div class="flex items-center">
        <label class="font-bold basis-4/12 mb-1">{{ t('reuse.paymentReason') }} :</label>
        <div>{{ props.dataSent.description ?? '' }}</div>
      </div>
      <div class="flex items-center ">
        <label class="font-bold basis-4/12 mb-1">{{ t('formDemo.formPayment') }} :</label>
        <div class="mr-2">{{ props.dataSent.payment}}</div>
      </div>
      <div class="flex items-center">
        <label class="font-bold basis-4/12 mb-1">{{ t('userDemo.accountInfo') }} :</label>
        <div class="uppercase">{{ props.dataEdit?.accountName}}</div>
      </div>
      <div class="flex items-center">
        <label class="basis-4/12 mb-1">{{ t('userDemo.accountNumber') }} :</label>
        <div>{{ props.dataEdit?.accountNumber}}</div>
      </div>
      <div class="font-bold mb-1">{{ t('formDemo.detailedlistofexpenses') }}</div>
    </div>
    <div>
      <el-table
        size="small" 
        ref="singleTableRef" 
        :data="dataTable"  
        header-row-class-name="text-black border-black border text-[10px]"
        header-cell-class-name="border-black border"
        cell-class-name="border-black border px-0.5"
        >
        <el-table-column label="Chứng từ" align="center">
          <el-table-column width="35" align="center" type="index" label="STT"  />
          <el-table-column width="50" align="center" prop="numberVouchers" label="Số" />
          <el-table-column width="50" align="center" prop="dayVouchers" label="Ngày">
            <template #default="scope">
            <div>{{formartDate(scope.row.dayVouchers)}}</div>
          </template>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="spentFor" header-align="center" width="110px" :label="t('formDemo.spendFor')" />
        <el-table-column prop="quantity" align="center" width="35px" :label="t('formDemo.sl')"  />
        <el-table-column prop="unitPrice" align="center"  width="90px" :label="t('reuse.unitPrice')">
          <template #default="scope">
            <div class="text-right">{{ checkUnitPrice(scope) }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="totalPrice" width="90px" :label="t('reuse.amountMoneyVnd')">
          <template #default="scope">
            <div class="text-right">{{ checkTotalPrice(scope) }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="note" width="60" :label="t('reuse.note')"  />
      </el-table>
    </div>
  
    <div class="flex h-[16vh] justify-between text-center mt-3 text-[10px]">
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

<style lang="scss" scoped>
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

::v-deep(.el-table){
  border: 1px solid #000;
  width: 100%;
}

::v-deep(.el-table__body-wrapper){
  font-size: 10px;
}

::v-deep(.cell){
  padding: 0 3px;
}

</style>
