<script setup lang="ts">
import { useIcon } from '@/hooks/web/useIcon'
import moment from 'moment'
import { Collapse } from '../../Components/Type'
import { onBeforeMount, ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { useRouter } from 'vue-router'
import { ElCollapse, ElCollapseItem, ElButton, ElDivider, ElNotification } from 'element-plus'
import DetailTicket from './DetailTicket.vue'
import ProductWarehouse from './ProductWarehouse.vue'
import {
  cancelTicket,
  createTicketManually,
  UpdateInventory,
  UpdateInventoryOrder
} from '@/api/Warehouse'
import { getWareHouseTransactionList } from '@/api/Business'
import { dateTimeFormat } from '@/utils/format'

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
const transactionType = 1

const back = async () => {
  push({
    name: 'Inventorymanagement.ListWarehouse.inventory-tracking'
  })
}

const activeName = ref(collapse[0].name)
const detailTicketRef = ref<InstanceType<typeof DetailTicket>>()
const productWarehouseRef = ref<InstanceType<typeof ProductWarehouse>>()
const addTransaction = async () => {
  let validTicket: any = false
  validTicket = await detailTicketRef.value?.submitFormTicket()
  let validTable = productWarehouseRef.value?.checkValueOfTable()
  console.log('validTicket', validTicket, validTable, validTicket && validTable)
  if (validTicket && validTable) {
    console.log('run here')
    let uploadData: any = {}
    uploadData.type = 1
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
    uploadData.toWarehouseId = detailTicketRef.value?.FormData.toWarehouseId
    uploadData.code = detailTicketRef.value?.FormData.ticketCode

    await createTicketManually(JSON.stringify(uploadData))
      .then(() => {
        ElNotification({
          message: t('reuse.addSuccess'),
          type: 'success'
        }),
          push({
            name: 'Inventorymanagement.ListWarehouse.inventory-tracking'
          })
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
  orderCode: '',
  updatedAt: '',
  fromWarehouseId: '',
  toWarehouseId: '',
  orderId: '',
  orderType: ''
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
const status = ref(0)
const serviceType = ref(6)
const callApiForData = async () => {
  if (id.value !== 0 && !isNaN(id.value)) {
    type.value = 'detail'
    const res = await getWareHouseTransactionList({ Id: id.value })
    if (res) {
      ticketData.value.ticketCode = res.data[0].transactionCode
      ticketData.value.createdAt = res.data[0].createdAt
      ticketData.value.staffId = res.data[0]?.staffName
      ticketData.value.customerId = res.data[0]?.customerName
      ticketData.value.description = res.data[0]?.description
      ticketData.value.orderCode = res.data[0]?.orderCode
      ticketData.value.updatedAt = res.data[0].updatedAt
      ticketData.value.toWarehouseId = res.data[0]?.toWarehouseId
      ticketData.value.orderId = res.data[0]?.orderId
      serviceType.value = res.data[0]?.orderType
      status.value = res.data[0]?.status
      productData.value = res.data[0].transactionDetails.map((item) => ({
        productPropertyId: item.productPropertyId,
        quantity: item.quantity,
        productPropertyQuality: item?.detail[0]?.productPropertyQuality,
        accessory: item.accessory,
        productName: item.productPropertyName,
        unitName: item.unitName,
        price: item?.detail[0]?.unitPrice,
        warehouse: { value: res.data[0]?.toWarehouseId, label: res.data[0]?.toWarehouseName },
        location: { value: item?.detail[0].toLocationId, label: item?.detail[0].toLocationName },
        lot: { value: item?.detail[0]?.toLotId, label: item?.detail[0]?.toLotName },
        imageUrl: item?.imageUrl
      }))
      console.log('ticketData', ticketData.value)
      console.log('productData', productData.value)
    }
  } else {
    type.value = 'add'
    ticketData.value.ticketCode = 'NK' + moment().format('hhmmss')
    ticketData.value.updatedAt = moment().format()
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

const updateInventory = async () => {
  const payload = {
    ticketId: id.value,
    type: 1
  }
  await UpdateInventory(JSON.stringify(payload))
    .then(() => {
      ElNotification({
        message: t('reuse.success'),
        type: 'success'
      }),
        push({
          name: 'Inventorymanagement.ListWarehouse.inventory-tracking'
        })
    })
    .catch(() =>
      ElNotification({
        message: t('reuse.fail'),
        type: 'warning'
      })
    )
}
const updateInventoryOrder = async () => {
  const payload = {
    ticketId: id.value,
    type: 1,
    warehouseProductJson: productWarehouseRef.value?.ListOfProductsForSale.map((row) => ({
      productPropertyId: row.productPropertyId,
      quantity: row.quantity,
      price: row.price,
      accessory: row.accessory,
      productPropertyQuality: row.productPropertyQuality,
      fileId: row.fileId,
      toLotId: row.lot?.value,
      warehouseId: row.warehouse?.value,
      locationId: row.location?.value
    }))
  }
  await UpdateInventoryOrder(JSON.stringify(payload))
    .then(() => {
      ElNotification({
        message: t('reuse.success'),
        type: 'success'
      }),
        push({
          name: 'Inventorymanagement.ListWarehouse.inventory-tracking'
        })
    })
    .catch(() =>
      ElNotification({
        message: t('reuse.fail'),
        type: 'warning'
      })
    )
}

const updateTicket = (warehouseId) => {
  ticketData.value.toWarehouseId = warehouseId
}
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
          <DetailTicket
            ref="detailTicketRef"
            :transactionType="transactionType"
            :type="type"
            :ticketData="ticketData"
            @update-ticket="updateTicket"
          />
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
          :orderId="parseInt(ticketData.orderId)"
          :warehouseId="parseInt(ticketData.toWarehouseId)"
        />
        <div class="w-[100%]">
          <el-divider content-position="left">{{ t('formDemo.statusAndManipulation') }}</el-divider>
        </div>
        <div class="flex gap-4 w-[100%] ml-1 items-center pb-3">
          <label class="w-[12%] text-right">{{ t('reuse.importTicketStatus') }}</label>
          <div>
            <p class="status bg-gray-300 day-updated">{{ t('reuse.initializeAndWrite') }}</p>
            <p class="date text-gray-300">
              {{
                ticketData.createdAt
                  ? dateTimeFormat(ticketData.createdAt)
                  : dateTimeFormat(moment())
              }}
            </p>
          </div>
          <div v-if="status == 3">
            <p class="status bg-gray-300 day-updated text-red-500">{{ t('reuse.cancelImport') }}</p>
            <p class="date text-gray-300">
              {{ dateTimeFormat(ticketData.updatedAt) }}
            </p>
          </div>
          <div v-if="status == 4">
            <p class="status bg-gray-300 day-updated text-blue-500">{{ t('reuse.import') }}</p>
            <p class="date text-gray-300">
              {{ dateTimeFormat(ticketData.updatedAt) }}
            </p>
          </div>
        </div>
        <div class="ml-[170px] flex">
          <ElButton class="w-[150px]" :disabled="type == 'add' || type == 'edit'">{{
            t('reuse.printImportTicket')
          }}</ElButton>
          <div v-if="status !== 4 && status !== 3" class="ml-[20px] flex">
            <ElButton
              class="w-[150px]"
              type="primary"
              :disabled="type == 'add' || type == 'edit'"
              @click="updateInventory"
              >{{ t('reuse.importWarehouseNow') }}</ElButton
            >
            <ElButton
              class="w-[150px]"
              type="primary"
              v-if="serviceType == 6 && Number(ticketData.orderId) !== 0"
              :disabled="type == 'add' || type == 'edit'"
              @click="updateInventoryOrder"
              >{{ t('reuse.importWarehouseNow') }}</ElButton
            >
            <ElButton
              class="w-[150px]"
              type="primary"
              @click="addTransaction"
              v-if="serviceType == 6 && Number(ticketData.orderId) == 0 && type == 'add'"
              >{{ t('reuse.save') }}</ElButton
            >
            <ElButton
              class="w-[150px]"
              v-if="serviceType == 6 && type == 'detail' && Number(ticketData.orderId) == 0"
              @click="type = 'edit'"
              >{{ t('reuse.edit') }}</ElButton
            >
            <ElButton
              class="w-[150px]"
              type="danger"
              v-if="serviceType == 6 && Number(ticketData.orderId) !== 0"
              :disabled="type == 'add' || type == 'edit'"
              @click="cancelTicketWarehouse"
              >{{ t('reuse.cancelImport') }}</ElButton
            >
          </div>
        </div>
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

.day-updated {
  position: relative;
  padding-left: 20px;
  width: fit-content;
}

.day-updated::after {
  content: '';
  position: absolute;
  top: 0;
  right: -12px;
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 14px solid transparent;
  border-left: 12px solid rgba(209, 213, 219, var(--tw-bg-opacity));
}

.day-updated::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  border-top: 12px solid transparent;
  border-bottom: 12px solid transparent;
  border-left: 12px solid white;
}
</style>
