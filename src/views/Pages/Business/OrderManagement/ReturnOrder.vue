<script setup lang="ts">
import { ElDivider, ElDialog, ElTable, ElTableColumn } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { dateTimeFormat } from '@/utils/format'

const { t } = useI18n()
const props = defineProps({
  showDialog: {
    type: Boolean,
    default: false
  },
  type: {
    type: Number,
    default: 0
  },
  orderData: {
    type: Object,
    default: () => {}
  }
})
console.log('orderData?', props.orderData)
</script>
<template>
  <el-dialog
    :model-Value="showDialog"
    class="font-bold"
    :title="t('formDemo.infoReturnAheadOfTime')"
    width="40%"
    align-center
  >
    <div>
      <el-divider />
      <div class="flex items-center">
        <span class="w-[25%] text-base font-bold">{{ t('formDemo.orderInformation') }}</span>
        <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
      </div>
      <div class="flex pt-4 pb-4 items-center">
        <div class="flex-1">
          <div class="flex gap-4">
            <label class="w-[40%] text-right">{{ t('formDemo.orderCode') }}</label>
            <div class="w-[60%] text-xl text-black font-bold dark:text-light-50">{{
              orderData?.rentalOrderCode
            }}</div>
          </div>
          <div class="flex gap-4">
            <label class="w-[40%] text-right">{{ t('reuse.rentalTerm') }}</label>
            <div class="w-[60%] text-black dark:text-light-50">{{
              orderData?.leaseTerm == '1'
                ? 'Theo ngày'
                : orderData?.leaseTerm == '7'
                ? 'Theo tuần'
                : 'Theo tháng'
            }}</div>
          </div>
          <div class="flex gap-4">
            <label class="w-[40%] text-right">{{ t('formDemo.rentalPeriod') }}</label>
            <div class="w-[60%] text-black dark:text-light-50"
              >{{ dateTimeFormat(orderData?.rentalPeriod[0]) }} đến
              {{ dateTimeFormat(orderData?.rentalPeriod[1]) }}</div
            >
          </div>
        </div>

        <div class="flex-1"> QRCode </div>
      </div>
      <div class="flex items-center">
        <span class="w-[25%] text-base font-bold">{{ t('reuse.customerInfo') }}</span>
        <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
      </div>
      <div>
        <div class="flex gap-4 items-center">
          <label class="w-[30%] text-right">{{ t('reuse.customerName') }}</label>
          <div class="w-[100%] text-black dark:text-light-50">{{ orderData?.name }}</div>
        </div>
        <div class="flex gap-4 items-center">
          <label class="w-[30%] text-right">{{ t('formDemo.address') }}</label>
          <div class="w-[100%] text-black dark:text-light-50">{{ orderData?.customerAddress }}</div>
        </div>
        <div class="flex gap-4 pb-4 items-center">
          <label class="w-[30%] text-right">{{ t('reuse.phoneNumber') }}</label>
          <div class="w-[100%] text-black dark:text-light-50">{{ orderData?.phone }}</div>
        </div>
      </div>
      <div class="flex items-center">
        <span class="w-[30%] text-base font-bold break-w">{{
          t('formDemo.rentalProductInformation')
        }}</span>
        <span class="block h-1 w-[70%] border-t-1 dark:border-[#4c4d4f]"></span>
      </div>
    </div>
    <div class="pt-2 pb-2">
      <el-table :data="orderData?.tableData" border style="width: 100%">
        <el-table-column label="STT" type="index" width="60" align="center" />
        <el-table-column prop="productName" :label="t('formDemo.commodityName')" width="280" />
        <el-table-column prop="quantity" :label="t('reuse.quantity')" width="90" />
        <el-table-column prop="price" :label="t('formDemo.rentalUnitPrice')">
          <template #default="scope">
            <div class="text-right">{{ scope.row.price }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="hirePrice" :label="t('formDemo.rentalFee')">
          <template #default="scope">
            <div class="text-right">{{ scope.row.hirePrice }}</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>
