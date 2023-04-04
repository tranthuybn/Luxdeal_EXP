<script setup lang="ts">
import { getWareHouseList } from '@/api/Business'
import { Qrcode } from '@/components/Qrcode'
import { ElDivider, ElImage, ElCheckboxGroup, ElCheckbox } from 'element-plus'
import { onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { orderType, moneyFormat } from '@/utils/format'
import { API_URL } from '@/utils/API_URL'
import { UpdateBusinessSetup } from '@/api/Warehouse'

const { t } = useI18n()
const props = defineProps({
  id: {
    type: Number,
    default: NaN
  }
})

const lotDetail = ref({
  productPropertyName: '',
  productCode: '',
  productPropertyCode: '',
  categoryParentName: '',
  categoryChildName: '',
  brand: '',
  origin: '',
  accessory: '',
  warehouse: '',
  locationWarehouse: '',
  lotCode: '',
  totalImport: '',
  inventory: '',
  inputPrice: '',
  bussinessSetups: [],
  lotImageUrl: '',
  serviceType: ''
})
const callAPI = async () => {
  await getWareHouseList({ Id: props.id }).then((res) => {
    lotDetail.value.productPropertyName = res.data[0].productPropertyName
    lotDetail.value.productCode = res.data[0].productCode
    lotDetail.value.productPropertyCode = res.data[0]?.productPropertyCode
    lotDetail.value.categoryParentName = res.data[0]?.categoryParentName
    lotDetail.value.categoryChildName = res.data[0]?.categoryChildName
    lotDetail.value.brand = res.data[0]?.productPropertyAttribute[0]?.value
    lotDetail.value.origin = res.data[0]?.productPropertyAttribute[3]?.value
    lotDetail.value.accessory = res.data[0]?.accessory
    lotDetail.value.warehouse = res.data[0]?.warehouse
    lotDetail.value.locationWarehouse = res.data[0]?.locationWarehouse
    lotDetail.value.lotCode = res.data[0]?.lotCode
    lotDetail.value.totalImport = res.data[0]?.totalImport
    lotDetail.value.inventory = res.data[0]?.inventory
    lotDetail.value.inputPrice = res.data[0]?.inputPrice
    lotDetail.value.bussinessSetups = res.data[0]?.bussinessSetup
    lotDetail.value.lotImageUrl = res.data[0]?.lotImageUrl
    lotDetail.value.serviceType = res.data[0]?.orderServiceType
  })
}
onBeforeMount(() => callAPI())

const updateBusinessSetup = async (data) =>{
  const payload ={
    lotId: props.id,
    businessSetup: data.toString()
  }
  await UpdateBusinessSetup(JSON.stringify(payload))
}
</script>
<template>
  <div class="flex">
    <div class="w-6/10">
      <ElDivider content-position="left">{{ t('reuse.productInformation') }}</ElDivider>
      <div class="ml-1/20">
        <div class="flex">
          <div class="w-1/4 text-right pr-4">{{ t('formDemo.productInfomation') }}</div>
          <div class="w-7/10 break-words">{{ lotDetail.productPropertyName }}</div>
        </div>
        <div class="flex">
          <div class="w-1/4 text-right pr-4">{{ t('reuse.productCode') }}</div>
          <div class="w-7/10 break-words">{{ lotDetail.productCode }}</div></div
        >
        <div class="flex">
          <div class="w-1/4 text-right pr-4">{{ t('reuse.managementCode') }}</div>
          <div class="w-7/10 break-words">{{ lotDetail.productPropertyCode }}</div></div
        >
        <div class="flex">
          <div class="w-1/4 text-right pr-4">{{ t('reuse.category') }}</div>
          <div class="w-7/10 break-words"
            >{{ lotDetail.categoryParentName }} / {{ lotDetail.categoryChildName }}</div
          ></div
        >
        <div class="flex">
          <div class="w-1/4 text-right pr-4">{{ t('router.productCategoryBrand') }}</div>
          <div class="w-7/10 break-words">{{ lotDetail.brand }}</div></div
        >
        <div class="flex">
          <div class="w-1/4 text-right pr-4">{{ t('router.productCategoryOrigin') }}</div>
          <div class="w-7/10 break-words">{{ lotDetail.origin }}</div></div
        >
        <div class="flex">
          <div class="w-1/4 text-right pr-4">{{ t('reuse.accessory') }}</div>
          <div class="w-7/10 break-words">{{
            lotDetail.accessory ? lotDetail.accessory : 'Không có'
          }}</div></div
        >
      </div>
      <div>
        <ElDivider content-position="left">{{
          t('reuse.warehouseManagementInformation')
        }}</ElDivider>
        <div class="ml-1/20">
          <div class="flex">
            <div class="w-1/4 text-right pr-4">{{ t('reuse.currentWarehouseLocation') }}</div>
            <div class="w-7/10 break-words"
              >{{ lotDetail.warehouse }} / {{ lotDetail.locationWarehouse }}</div
            ></div
          >
          <div class="flex">
            <div class="w-1/4 text-right pr-4">{{ t('reuse.lotCode') }}</div>
            <div class="w-7/10 break-words"
              >{{ lotDetail.lotCode }}/{{ orderType(lotDetail.serviceType) }}</div
            ></div
          >
          <div class="flex">
            <div class="w-1/4 text-right pr-4">{{ t('reuse.amountImportLot') }}</div>
            <div class="w-7/10 break-words">{{ lotDetail.totalImport }}</div></div
          >
          <div class="flex">
            <div class="w-1/4 text-right pr-4">{{ t('reuse.quantityInventory') }}</div>
            <div class="w-7/10 break-words">{{ lotDetail.inventory }}</div></div
          >
          <div class="flex">
            <div class="w-1/4 text-right pr-4">{{ t('reuse.CashIntoInventory') }}</div>
            <div class="w-7/10 break-words">{{
              moneyFormat(Number(lotDetail.inventory) * Number(lotDetail.inputPrice))
            }}</div></div
          >
        </div>
      </div>
      <div>
        <ElDivider content-position="left">{{ t('reuse.businessManagement') }}</ElDivider>
        <div class="ml-1/20">
          <div class="flex">
            <div class="w-1/4 text-right pr-4">{{ t('reuse.allowToExport') }}</div>
            <div class="w-7/10 break-words">
              <el-checkbox-group v-model="lotDetail.bussinessSetups" @change="updateBusinessSetup">
                <el-checkbox :label="1">{{ t('reuse.sell') }}</el-checkbox>
                <el-checkbox :label="2">{{ t('reuse.rent') }}</el-checkbox>
                <el-checkbox :label="3">Spa</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-4/10">
      <div>
        <ElDivider content-position="left">{{ t('reuse.addImage') }}</ElDivider>
        <el-image
          :src="`${API_URL}${lotDetail.lotImageUrl}`"
          style="width: 250px; height: 200px"
          fit="scale-down"
          ><template #error>
            <div class="image-slot">
              {{ t('reuse.notHaveImage') }}
            </div>
          </template>
        </el-image>
      </div>
      <div>
        <ElDivider content-position="left">{{ t('reuse.QRCodeProduct') }}</ElDivider>
        <Qrcode :width="100" />
      </div>
    </div>
  </div>
</template>
