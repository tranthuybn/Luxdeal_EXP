<script setup lang="ts">
import { useIcon } from '@/hooks/web/useIcon'
import { Collapse } from '../../Components/Type'
import { onBeforeMount, ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { useRouter } from 'vue-router'
import { ElCollapse, ElCollapseItem, ElButton, ElDivider, ElNotification } from 'element-plus'
import DetailTicket from './DetailTicket.vue'
import ProductWarehouse from './ProductWarehouse.vue'
import { cancelTicket, createTicketManually } from '@/api/Warehouse'
import { getWareHouseTransactionList } from '@/api/Business'

const { t } = useI18n()

const { push } = useRouter()
const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })
const escape = useIcon({ icon: 'quill:escape' })

const collapse: Array<Collapse> = [
  {
    icon: minusIcon,
    name: 'profileWareHouse',
    title: t('reuse.detailImportTicket')
  },
  {
    icon: plusIcon,
    name: 'importedProductsWareHouse',
    title: t('reuse.importProductWarehouse')
  }
]
const collapseChangeEvent = (val) => {
  if (val) {
    collapse.forEach((el) => {
      if (val.includes(el.name)) el.icon = minusIcon
      else if (el.icon == minusIcon) el.icon = plusIcon
    })
  } else
    collapse.forEach((el) => {
      el.icon = plusIcon
    })
}

// get data from router
const router = useRouter()
const id = ref(Number(router.currentRoute.value.params.id))
const type = ref('add')
const transactionType = 3

const back = async () => {
  push({
    name: 'Inventorymanagement.ListWarehouse.inventory-tracking'
  })
}

const activeName = ref(collapse[0].name)
const detailTicketRef = ref<InstanceType<typeof DetailTicket>>()
const productWarehouseRef = ref<InstanceType<typeof ProductWarehouse>>()
const addTransaction = async () => {
  console.log('checkValueOfTable', productWarehouseRef.value?.checkValueOfTable())
  if (detailTicketRef.value?.submitFormTicket() && productWarehouseRef.value?.checkValueOfTable()) {
    let uploadData: any = {}
    uploadData.type = 3
    uploadData.warehouseProductJson = [{}]
    uploadData.warehouseProductJson = productWarehouseRef.value?.ListOfProductsForSale.map(
      (row) => ({
        productPropertyId: row.productPropertyId,
        quantity: row.quantity,
        price: row.price,
        accessory: row.accessory,
        productPropertyQuality: row.productPropertyQuality,
        fileId: row.fileId,
        toLotId: row.lot?.value,
        warehouseId: row.warehouse?.value,
        locationId: row.location?.value
      })
    )
    uploadData.staffId = detailTicketRef.value?.FormData.staffId
    uploadData.customerId = detailTicketRef.value?.FormData.customerId
    uploadData.description = detailTicketRef.value?.FormData.description

    await createTicketManually(JSON.stringify(uploadData))
      .then((res) => {
        ElNotification({
          message: t('reuse.addSuccess'),
          type: 'success'
        })
        id.value = res.data
        type.value = 'detail'
      })
      .catch(() =>
        ElNotification({
          message: t('reuse.addFail'),
          type: 'warning'
        })
      )
  }
}
const ticketData = ref({
  ticketCode: '',
  createdAt: '',
  staffId: '',
  description: '',
  customerId: '',
  isActive: '',
  status: '',
  staffValue: '',
  orderCode: ''
})
type ExportLots = {
  fromLotId: number
  quantity: number
}
type Options = {
  value: number
  label: string
}

type ProductWarehouse = {
  productPropertyId?: number
  quantity?: number
  price?: number
  productPropertyQuality?: string
  accessory?: string
  fileId?: number
  fromLotId?: number
  toLotId?: number
  exportLots?: Array<ExportLots>
  productName?: string
  finalPrice?: string
  unitName?: string
  warehouse?: Options
  location?: Options
  lot?: Options
  imageUrl?: string
}
const productData = ref<ProductWarehouse[]>([{} as ProductWarehouse])
const serviceType = ref(6)
const testReactive = ref('test')
const callApiForData = async () => {
  if (id.value !== 0) {
    type.value = 'detail'
    const res = await getWareHouseTransactionList({ Id: id.value })
    if (res) {
      ticketData.value.ticketCode = res.data[0].transactionCode
      ticketData.value.createdAt = res.data[0].createdAt
      ticketData.value.staffId = res.data[0]?.staffId
      ticketData.value.customerId = res.data[0]?.customerId
      ticketData.value.description = res.data[0]?.description
      ticketData.value.orderCode = res.data[0]?.orderCode
      serviceType.value = res.data[0]?.serviceType
      productData.value = res.data[0].transactionDetails.map((item) => ({
        productPropertyId: item.productPropertyId,
        quantity: item.quantity,
        price: item.price,
        productPropertyQuality: item.productPropertyQuality,
        accessory: item.accessory,
        productName: item.productPropertyName,
        unitName: item.unitName,
        warehouse: { value: item?.toWarehouseId, label: item.toWarehouseName },
        location: { value: item?.toLocationId, label: item.toLocationName },
        lot: { value: item?.lotId, label: item.lotCode },
        imageUrl: item?.imageUrl
      }))
      testReactive.value = 'success'
    }
    console.log('ticketData.value', ticketData.value, 'productData.value', productData.value)
  } else {
    type.value = 'add'
  }
}
const cancelTicketWarehouse = async () => {
  await cancelTicket({ Id: id.value })
    .then(() => back())
    .catch(() => {
      ElNotification({
        message: t('reuse.deleteFail'),
        type: 'warning'
      })
    })
}
onBeforeMount(async () => await callApiForData())
</script>
<template>
  <div class="demo-collapse dark:bg-[#141414]">
    <el-collapse v-model="activeName" @change="collapseChangeEvent">
      <el-collapse-item :icon="false" :name="collapse[0].name">
        <template #title>
          <div class="flex w-[100%] justify-between">
            <div class="before">
              <el-button class="header-icon" :icon="collapse[0].icon" link />
              <span class="text-center text-xl">{{ collapse[0].title }}</span>
            </div>
            <div @click="back()" class="after">
              <span class="text-center text-xl">{{ t('reuse.exit') }}</span>
              <el-button class="header-icon" :icon="escape" link />
            </div>
          </div>
        </template>
        <div class="flex w-[100%]">
          <DetailTicket ref="detailTicketRef" :type="type" :ticketData="ticketData" />
        </div>
      </el-collapse-item>

      <el-collapse-item :name="collapse[1].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[1].icon" link />
          <span class="text-center text-xl">{{ collapse[1].title }}</span>
        </template>
        <ProductWarehouse
          ref="productWarehouseRef"
          :type="type"
          :transactionType="transactionType"
          :productData="productData"
          :testReactive="testReactive"
        />
        <div class="w-[100%]">
          <el-divider content-position="left">{{ t('formDemo.statusAndManipulation') }}</el-divider>
        </div>
        <div class="flex gap-4 w-[100%] ml-1 items-center pb-3">
          <label class="w-[9%] text-right">{{ t('reuse.importTicketStatus') }}</label>
          <span class="bg-gray-300">{{ t('reuse.initializeAndWrite') }}</span>
        </div>
        <div class="ml-[170px]">
          <ElButton class="w-[150px]" :disabled="type == 'add' || type == 'edit'">{{
            t('reuse.printImportTicket')
          }}</ElButton>
          <ElButton class="w-[150px]" type="primary" :disabled="type == 'add' || type == 'edit'">{{
            t('reuse.importWarehouseNow')
          }}</ElButton>
          <ElButton
            class="w-[150px]"
            type="primary"
            @click="addTransaction"
            v-if="serviceType == 6 && (type == 'add' || type == 'edit')"
            >{{ t('reuse.save') }}</ElButton
          >
          <ElButton
            class="w-[150px]"
            v-if="serviceType == 6 && type == 'detail'"
            @click="type = 'edit'"
            >{{ t('reuse.edit') }}</ElButton
          >
          <ElButton
            class="w-[150px]"
            type="danger"
            v-if="serviceType == 6"
            :disabled="type == 'add' || type == 'edit'"
            @click="cancelTicketWarehouse"
            >{{ t('reuse.cancelImport') }}</ElButton
          ></div
        >
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<style scoped>
::deep(.el-select) {
  width: 100%;
}
:deep(.cell) {
  word-break: break-word;
}
</style>
