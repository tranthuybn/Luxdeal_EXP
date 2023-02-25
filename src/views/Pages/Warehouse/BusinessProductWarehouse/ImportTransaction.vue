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
  UpdateInventoryOrder,
  updateTicketManually
} from '@/api/Warehouse'
import { getWareHouseTransactionList } from '@/api/Business'
import { dateTimeFormat } from '@/utils/format'
import { statusWhType, TicketStatusHistory } from './TicketEnum'

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
  if (validTicket && validTable) {
    let uploadData: any = {}
    uploadData.type = 1
    uploadData.warehouseProductJson = [{}]
    uploadData.warehouseProductJson = productWarehouseRef.value?.ListOfProductsForSale.map(
      (row) => ({
        productPropertyId: row.productPropertyId,
        quantity: Number(row.quantity),
        price: row.price,
        accessory: row.accessory,
        productPropertyQuality: row.productPropertyQuality,
        toLotId: row.lot?.value,
        fileId: row?.fileId
      })
    )
    uploadData.staffId = detailTicketRef.value?.FormData.staffId
    uploadData.customerId = detailTicketRef.value?.FormData.customerId
    uploadData.description = detailTicketRef.value?.FormData.description
    uploadData.toWarehouseId = detailTicketRef.value?.FormData.toWarehouseId
    uploadData.code = detailTicketRef.value?.FormData.ticketCode

    if (type.value == 'add') {
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
    if (type.value == 'edit') {
      uploadData.ticketId = id.value
      await updateTicketManually(JSON.stringify(uploadData))
        .then(() => {
          ElNotification({
            message: t('reuse.updateSuccess'),
            type: 'success'
          }),
            push({
              name: 'Inventorymanagement.ListWarehouse.inventory-tracking'
            })
        })
        .catch(() =>
          ElNotification({
            message: t('reuse.updateFail'),
            type: 'warning'
          })
        )
    }
  }
}
const ticketData = ref({
  ticketCode: '',
  createdAt: '',
  staffId: '',
  staffName: '',
  customerName: '',
  description: '',
  customerId: '',
  isActive: '',
  status: '',
  staffValue: '',
  orderCode: '',
  updatedAt: '',
  fromWarehouseId: '',
  warehouse: {},
  toWarehouseId: '',
  orderId: 0,
  orderType: 0
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
const lastStatus = ref()
const serviceType = ref(6)
const returnRequestId = ref(0)
const duplicateStatusButton = ref(false)

let arrayStatusWH = ref(Array<statusWhType>())
const callApiForData = async () => {
  if (id.value !== 0 && !isNaN(id.value)) {
    type.value = 'detail'
    const res = await getWareHouseTransactionList({ Id: id.value })
    if (res) {
      ticketData.value.ticketCode = res.data[0].transactionCode
      ticketData.value.createdAt = res.data[0].createdAt
      ticketData.value.staffId = res.data[0]?.staffId
      ticketData.value.staffName = res.data[0]?.staffName
      ticketData.value.customerId = res.data[0]?.customerId
      ticketData.value.customerName = res.data[0]?.customerName
      ticketData.value.description = res.data[0]?.description
      ticketData.value.orderCode = res.data[0]?.orderCode
      ticketData.value.updatedAt = res.data[0].updatedAt
      ticketData.value.toWarehouseId = res.data[0]?.toWarehouseId
      ticketData.value.warehouse = {
        value: res.data[0]?.toWarehouseId,
        label: res.data[0]?.toWarehouseName
      }
      ticketData.value.orderId = res.data[0]?.orderId
      serviceType.value = res.data[0]?.orderType
      returnRequestId.value = res.data[0]?.returnRequestID
      status.value = res.data[0]?.status

      arrayStatusWH.value = res.data[0]?.statusHistory

if (arrayStatusWH.value?.length) {
  arrayStatusWH.value[arrayStatusWH.value?.length - 1].isActive = true

if (arrayStatusWH.value[arrayStatusWH.value?.length - 1].approveAt)
  duplicateStatusButton.value = true
else duplicateStatusButton.value = false

lastStatus.value = res.data[0]?.statusHistory[res.data[0]?.statusHistory.length -1]
}
      productData.value = res.data[0].transactionDetails.map((item) => ({
        productPropertyId: item.productPropertyId,
        productPropertyName: item.productPropertyName,
        productPropertyCode: item.productPropertyCode,
        productName: item.productName,
        productCode: item.productCode,
        quantity: item.quantity,
        productPropertyQuality: item?.detail[0]?.productPropertyQuality,
        accessory: item.accessory,
        unitName: item.unitName,
        price: item?.detail[0]?.unitPrice,
        warehouse: { value: res.data[0]?.toWarehouseId, label: res.data[0]?.toWarehouseName },
        location: { value: item?.detail[0].toLocationId, label: item?.detail[0].toLocationName },
        lot: {
          value: item?.detail[0]?.toLotId,
          location: item?.detail[0]?.toLocationName,
          lotCode: item.lotCode
        },
        imageUrl: item?.imageUrl
      }))
    }
  } else {
    type.value = 'add'
    ticketData.value.ticketCode = 'NK' + moment().format('hhmmss')
    ticketData.value.updatedAt = moment().format()

    arrayStatusWH.value.push({
    name: 'Khởi tạo & ghi số',
    isActive: true,
    approveAt: String(moment()),
    value: 1
    })
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
  //const id =
  //trả về id dùng tiếp ko cần đẩy ra ngoài
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
  if (!productWarehouseRef.value?.checkValueOfTable()) {
    return
  }
  const payload = {
    ticketId: id.value,
    type: 1,
    warehouseProductJson: productWarehouseRef.value?.ListOfProductsForSale.map((row) => ({
      productPropertyId: row.productPropertyId,
      quantity: Number(row.quantity),
      price: row.price,
      accessory: row.accessory,
      productPropertyQuality: row.productPropertyQuality,
      toLotId: row.lot?.value
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

const updateTicket = (warehouse) => {
  ticketData.value.warehouse = warehouse
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
          :orderId="ticketData.orderId"
          :warehouse="ticketData.warehouse"
          :serviceType="serviceType"
          :returnRequestId="returnRequestId"
        />
        <div class="w-[100%]">
          <el-divider content-position="left">{{ t('formDemo.statusAndManipulation') }}</el-divider>
        </div>
        <div class="flex gap-4 w-[100%] ml-1 pb-3 mb-2">
          <label class="ml-10">{{ t('reuse.importTicketStatus')}}</label>
          <div class="w-[75%]">
          <div class="flex items-cumter w-[100%]">
            <div
              class="duplicate-status"
              v-for="item in arrayStatusWH"
              :key="item.value"
            >
              <div v-if="item.value == TicketStatusHistory.NewCreate">
                <span
                  class="box custom-after bg-gray-300 dark:text-gray-300"
                  :class="{ active: item.isActive }"
                >
                  {{ item.name }}

                  <span class="triangle-right right_1"> </span>
                </span>
                <p v-if="item?.approveAt">{{
                  item?.approveAt ? dateTimeFormat(item?.approveAt) : ''
                }}</p>
                <p v-else class="text-transparent">s</p>
              </div>
              <div v-else-if="item.value == TicketStatusHistory.Approve">
                <span
                  class="box box_3 custom-after text-orange-400 dark:text-black"
                  :class="{ active: item.isActive }"
                >
                  {{ item.name }}
                  <span class="triangle-right right_3"> </span>
                </span>
                <p v-if="item?.approveAt">{{
                  item?.approveAt ? dateTimeFormat(item?.approveAt) : ''
                }}</p>
                <p v-else class="text-transparent">s</p>
              </div>
              <div v-else-if="item.value == TicketStatusHistory.Imported || item.value == TicketStatusHistory.Depositing">
                <span
                  class="box box_2 custom-after text-blue-500 dark:text-black"
                  :class="{ active: item.isActive }"
                >
                  {{ item.name }}
                  <span class="triangle-right right_2"> </span>
                </span>
                <p v-if="item?.approveAt">{{
                  item?.approveAt ? dateTimeFormat(item?.approveAt) : ''
                }}</p>
                <p v-else class="text-transparent">s</p>
              </div>
              <div v-else-if="item.value == TicketStatusHistory.CancelImport">
                
                <span
                  class="box box_4 custom-after text-rose-500 dark:text-black"
                  :class="{ active: item.isActive }"
                >
                  {{ item.name }}
                  <span class="triangle-right right_4"> </span>
                </span>
                <p v-if="item?.approveAt">{{
                  item?.approveAt ? dateTimeFormat(item?.approveAt) : ''
                }}</p>
                <p v-else class="text-transparent">s</p>
              </div>
            </div>
          </div>
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
              v-if="Number(ticketData.orderId) !== 0"
              :disabled="type == 'add' || type == 'edit' || (lastStatus.value == 4 && !lastStatus.approveAt)"
              @click="updateInventoryOrder"
              >{{ t('reuse.importWarehouseNow') }}</ElButton
            >
            <ElButton
              v-else
              class="w-[150px]"
              type="primary"
              :disabled="type == 'add' || type == 'edit'"
              @click="updateInventory"
              >{{ t('reuse.importWarehouseNow') }}</ElButton
            >
            <ElButton
              class="w-[150px]"
              type="primary"
              @click="addTransaction"
              v-if="Number(ticketData.orderId) == 0 && type == 'add'"
              >{{ t('reuse.save') }}</ElButton
            >
            <ElButton
              class="w-[150px]"
              type="primary"
              @click="addTransaction"
              v-if="Number(ticketData.orderId) == 0 && type == 'edit'"
              >{{ t('reuse.save') }}</ElButton
            >
            <ElButton
              class="w-[150px]"
              v-if="type == 'detail' && Number(ticketData.orderId) == 0"
              @click="type = 'edit'"
              >{{ t('reuse.edit') }}</ElButton
            >
            <ElButton
              class="w-[150px]"
              type="danger"
              v-if="Number(ticketData.orderId) !== 0"
              :disabled="type == 'add' || type == 'edit'|| (lastStatus.value == 4 && !lastStatus.approveAt)"
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
  
  .box {
    padding: 0 10px 0 20px;
    position: relative;
    display: flex;
    width: fit-content;
    align-items: center;
    border: 1px solid #ccc;
    background-color: #ccc;
    opacity: 0.6;
  }
  
  .box_1 {
    border: 1px solid rgba(209, 213, 219, var(--tw-bg-opacity));
    --tw-bg-opacity: 1;
    background-color: rgba(209, 213, 219, var(--tw-bg-opacity));
  
  }
  
  .box_2 {
    border: 1px solid #f4f8fd;
    background-color: #f4f8fd;
  }
  
  .box_3 {
    border: 1px solid #f8dec9;
    background-color: #f8dec9;
  }
  
  .box_4 {
    border: 1px solid #fce5e1;
    background-color: #fce5e1;
  }
  .duplicate-status + .duplicate-status {
    margin-left: 10px;
  }
  .active {
    opacity: 1 !important;
  }
  .right_1 {
    border-left: 11px solid rgba(209, 213, 219, var(--tw-bg-opacity)) !important;
  }
  .right_2 {
    border-left: 11px solid #f4f8fd !important;
  }
  
  .right_3 {
    border-left: 11px solid #f8dec9 !important;
  }
  
  .right_4 {
    border-left: 11px solid #fce5e1 !important;
  }
  .triangle-right {
    position: absolute;
    right: -12px;
    width: 0;
    height: 0;
    border-top: 13px solid transparent;
    border-bottom: 12px solid transparent;
    border-left: 11px solid #ccc;
  }
  .custom-after::after {
    content: '';
    position: absolute;
    z-index: 1998;
    width: 11px;
    border-style: solid;
    height: 100%;
    left: -1px;
    border-bottom-width: 12px;
    border-left-width: 10px;
    border-top-width: 12px;
    border-bottom-color: transparent;border-top-color: transparent;
    --tw-border-opacity: 1;
    border-left-color: rgba(255, 255, 255, var(--tw-border-opacity));
  }
</style>