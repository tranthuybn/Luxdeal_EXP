<script setup lang="ts">
import { dateTimeFormat } from '@/utils/format'
import { ElRow, ElCol, ElTable, ElTableColumn } from 'element-plus';
import { useI18n } from '@/hooks/web/useI18n'
import { onBeforeMount, reactive } from 'vue';

//dialogPrinRepairSpa
const props = defineProps({
  billRepairData: {
    type: Object,
    default: ()=>{}
  }
})
const { t } = useI18n()

const defaultDataTable = {
  implementationProcess: '',
  executor: '',
  receptionDate: '',
  completionDate: '',
  chemistry: '',
  quantitativeUse: '',
  evaluate: '',
  note: '',
}
const tableData = reactive([{}])
onBeforeMount(() => {
  for(let i = 0; i < 10 ; i++){
    tableData.push(defaultDataTable)
  }
})
const getDataTableService = (spaService) => {
  const result = spaService.map(item => ({serviceInfo: `- ${item.name}`}))
  return result
}
</script>

<template>
  <div v-for="(item, index) in props.billRepairData" :key="index" class="h-screen p-4">
    <div class="flex items-center flex-col text-[10px]">
        <div><img class="h-25" src="@/assets/imgs/images.png" /></div>
        <div class="flex flex-col my-2">
          <span class="mb-1"><span class="font-bold">Địa chỉ 1:</span> 73B Lý Nam Đế, Q.Hoàn Kiếm, Hà Nội</span>
          <span class="mb-1"><span class="font-bold">Địa chỉ 2:</span> 116 Nguyễn Cư Trinh, Quận 1, TP.HCM</span>
          <span class="mb-1"><span class="font-bold">Email:</span> authonolyluxury@gmail.com</span>
          <span class="mb-1"><span class="font-bold">Phone:</span> 0982356789 - 0982021919</span>
          <span class="mb-1"><span class="font-bold">Website:</span> http://authonolyluxury.com</span>
        </div>
        <div class="my-2 font-bold text-1xl">PHIẾU SỬA CHỮA SẢN PHẨM AUTHONOLY SPA</div>
      </div>
    <div class="mt-4 text-[10px]">
      <ElRow>
        <ElCol :span="12"><span class="font-bold">Cửa hàng: {{ item.storeName }}</span></ElCol>
        <ElCol :span="12"><span class="font-bold">Ngày nhận: {{ dateTimeFormat(item.fromDate) }}</span></ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="7"><span class="font-bold">Phiếu nhập: </span> <span>{{ item.importTicket }}</span></ElCol>
        <ElCol :span="5"><span class="font-bold">Code SP: </span> <span>{{ item.codeSP }}</span></ElCol>
        <ElCol :span="12"><span class="font-bold">Mã hàng: </span> <span>{{ item.productPropertyCode }}</span></ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="12"><span class="font-bold">Tên KH: </span> <span>{{ item.customerName }}</span></ElCol>
        <ElCol :span="12"><span class="font-bold">Ngày trả: </span> <span>{{ dateTimeFormat(item.toDate) }}</span></ElCol>
      </ElRow>
    </div>
    <div class="mt-4 text-[10px]">
      <ElRow>
        <ElCol :span="16">
          <ElCol class="mb-1"><span class="font-bold">Tên SP sửa chữa:</span> <span> {{ item.productName }}</span></ElCol>
          <ElCol class="mb-1"><span class="font-bold">Phụ kiện đi kèm:</span> <span> {{ item.accessory }}</span></ElCol>
          <ElCol class="mb-1"><span class="font-bold">Ghi chú:</span> </ElCol>
        </ElCol>
        <ElCol :span="8">
          <ElCol class="font-bold mb-1 border-custom">NVTN</ElCol>
          <ElCol class="font-bold mb-1">Người giao:</ElCol>
          <ElCol class="font-bold mb-1">Người nhận:</ElCol>
        </ElCol>
      </ElRow>
    </div>
    <div>
      <el-table 
        size="small" 
        :data="getDataTableService(item.spaService)" 
        class="mt-2 "
        header-row-class-name="text-black border-black border  text-[10px] text-center"
        header-cell-class-name="border-black border"
        row-class-name="border-black border"
        cell-class-name="border-black border px-0.5 text-[10px]"
      >
        <ElTableColumn width="679px" :label="t('reuse.content')" prop="serviceInfo"/>
      </el-table>
    </div>

    <ElTable 
      size="small" 
      :data="tableData" 
      class="mt-2"         
      header-row-class-name="text-black border-black border text-[10px]"
      header-cell-class-name="border-black border text-center"
      row-class-name="border-black border"
      cell-class-name="border-black border px-0.5 h-7"
    >
      <ElTableColumn width="100" :label="t('reuse.implementationProcess')" prop="implementationProcess"/>
      <ElTableColumn width="70" :label="t('reuse.executor')" prop="executor"/>
      <ElTableColumn width="70" :label="t('reuse.receptionDate')" prop="receptionDate"/>
      <ElTableColumn width="70" :label="t('reuse.completionDate')" prop="completionDate"/>
      <ElTableColumn width="70" :label="t('reuse.chemistry')" prop="chemistry"/>
      <ElTableColumn width="70" :label="t('reuse.quantitativeUse')" prop="quantitativeUse"/>
      <ElTableColumn width="40" :label="t('reuse.evaluate')" prop="evaluate"/>
      <ElTableColumn width="40" :label="t('reuse.note')" prop="note"/>
    </ElTable>
  </div>
</template>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');

* {
  font-family: Lora, serif;
}

.text-end {
  text-align: end;
}

/* ::v-deep(table) {
  word-break: break-word;
}

table {
  width: 100%;
  font-family: arial, sans-serif;
  border-collapse: collapse;
}

::v-deep(td), ::v-deep(th){
  padding: 16px 0 16px 8px;
  text-align: left;
  word-break: break-word;
  border: 1px solid #ddd;
} */

::v-deep(.cell) {
  padding: 0px 3px;
  line-height: 15px;
}

::v-deep(.el-row) {
  border: 1px solid #000;
  padding: 3px 0;
}
</style>
