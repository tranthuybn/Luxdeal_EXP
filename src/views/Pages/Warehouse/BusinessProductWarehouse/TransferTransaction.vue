<script setup lang="ts">
import { useIcon } from '@/hooks/web/useIcon'
import { Collapse } from '../../Components/Type'
import { onBeforeMount, ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { useRouter } from 'vue-router'
import { ElCollapse, ElCollapseItem, ElButton, ElDivider, ElNotification } from 'element-plus'
import DetailTicket from './DetailTicket.vue'
import TransferPW from './TransferPW.vue'
import {
  cancelTicket,
  createTicketManually,
  UpdateInventory,
  UpdateInventoryOrder,
  updateTicketManually
} from '@/api/Warehouse'
import { addOrderStransaction, getWareHouseTransactionList } from '@/api/Business'
import moment from 'moment'
import { statusWhType } from './TicketEnum'
import StatusWarehouse from './StatusWarehouse.vue'

const { t } = useI18n()

const { push } = useRouter()
const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })
const escape = useIcon({ icon: 'quill:escape' })

const collapse: Array<Collapse> = [
  {
    icon: minusIcon,
    name: 'profileWareHouse',
    title: t('reuse.detailTransfer')
  },
  {
    icon: plusIcon,
    name: 'importedProductsWareHouse',
    title: t('reuse.transferProductWarehouse')
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
const returnRequestId = ref(0)

const back = async () => {
  push({
    name: 'Inventorymanagement.ListWarehouse.inventory-tracking'
  })
}

const activeName = ref(collapse[0].name)
const detailTicketRef = ref<InstanceType<typeof DetailTicket>>()
const productWarehouseRef = ref<InstanceType<typeof TransferPW>>()
const addTransaction = async () => {
  let responseValue = 0
  if (
    (await detailTicketRef.value?.submitFormTicket()) &&
    productWarehouseRef.value?.checkValueOfTable()
  ) {
    let uploadData: any = {}
    uploadData.type = 3
    uploadData.warehouseProductJson = [{}]
    uploadData.warehouseProductJson = productWarehouseRef.value?.ListOfProductsForSale.map(
      (row) => ({
        productPropertyId: row.productPropertyId,
        quantity: Number(row.quantity),
        price: row.price,
        accessory: row.accessory,
        productPropertyQuality: row.productPropertyQuality,
        toLotId: row.toLot?.value,
        fromLotId: row.fromLot?.value
      })
    )
    uploadData.staffId = detailTicketRef.value?.FormData.staffId
    uploadData.customerId = detailTicketRef.value?.FormData.customerId
    uploadData.description = detailTicketRef.value?.FormData.description
    uploadData.toWarehouseId = detailTicketRef.value?.FormData.toWarehouseId
    uploadData.fromWarehouseId = detailTicketRef.value?.FormData.fromWarehouseId
    uploadData.code = detailTicketRef.value?.FormData.ticketCode

    if (type.value == 'add') {
      await createTicketManually(JSON.stringify(uploadData))
        .then((res) => {
          ElNotification({
            message: t('reuse.addSuccess'),
            type: 'success'
          })
          responseValue = res.data
          id.value = res.data
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
  return responseValue
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
  toWarehouse: {},
  fromWarehouse: {},
  toWarehouseId: '',
  fromWarehouseId: '',
  orderId: 0,
  returnRequestId: 0,
  serviceType: 6
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
  productCode?: string
  quantity: number
  price: number
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
  orderId?: number
  serviceType?: number
}
const status = ref(1)
const lastStatus = ref()
const productData = ref<ProductWarehouse[]>([{} as ProductWarehouse])
const serviceType = ref(6)

let arrayStatusWH = ref(Array<statusWhType>())
  const duplicateStatusButton = ref(false)

const callApiForData = async () => {
  if (id.value !== 0 && !isNaN(id.value)) {
    type.value = 'detail'
    const res = await getWareHouseTransactionList({ Id: id.value })
    if (res) {
      ticketData.value.ticketCode = res.data[0].transactionCode
      ticketData.value.createdAt = res.data[0].createdAt
      ticketData.value.staffId = res.data[0]?.staffId
      ticketData.value.customerId = res.data[0]?.customerId
      ticketData.value.description = res.data[0]?.description
      ticketData.value.orderCode = res.data[0]?.orderCode
      ticketData.value.updatedAt = res.data[0]?.updatedAt
      ticketData.value.fromWarehouseId = res.data[0]?.fromWarehouseId
      ticketData.value.toWarehouseId = res.data[0]?.toWarehouseId
      ticketData.value.fromWarehouse = {
        label: res.data[0]?.fromWarehouseName,
        value: res.data[0]?.fromWarehouseId
      }
      ticketData.value.toWarehouse = {
        label: res.data[0]?.toWarehouseName,
        value: res.data[0]?.toWarehouseId
      }
      ticketData.value.serviceType = res.data[0]?.orderType
      ticketData.value.orderId = res.data[0]?.orderId
      returnRequestId.value = res.data[0]?.returnRequestID

      status.value = res.data[0].status
lastStatus.value = res.data[0]?.statusHistory[res.data[0]?.statusHistory.length -1]
      arrayStatusWH.value = res.data[0]?.statusHistory
        if (arrayStatusWH.value?.length) {
      arrayStatusWH.value[arrayStatusWH.value?.length - 1].isActive = true

    if (arrayStatusWH.value[arrayStatusWH.value?.length - 1].approveAt)
      duplicateStatusButton.value = true
    else duplicateStatusButton.value = false
  }
      orderData.value = res.data[0].orderDetails
    
      serviceType.value = res.data[0]?.orderType
      
      productData.value = res.data[0].transactionDetails.map((item) => ({
        productPropertyId: item.productPropertyId,
        productPropertyName: item.productPropertyName,
        productPropertyCode: item.productPropertyCode,
        productName: item.productName,
        productCode: item.productCode,
        quantity: item.detail[0]?.quantity,
        price: item.importPrice,
        productPropertyQuality: item.productPropertyQuality,
        accessory: item.accessory,
        unitName: item.unitName,
        toLocation: { value: item.detail[0]?.toLocationId, label: item.detail[0].toLocationName },
        fromLocation: {
          value: item.detail[0]?.fromLocationId,
          label: item.detail[0]?.fromLocationName
        },
        fromLot: { value: item.detail[0]?.fromLotId, label: item.detail[0]?.fromLotCode },
        toLot: { value: item.detail[0]?.toLotId, label: item.detail[0]?.toLotCode },
        orderId: item.detail[0]?.orderId,
        imageUrl: item?.imageUrl,
        serviceType: item.detail[0]?.serviceType

      }))
    }
  } else {
    type.value = 'add'
    ticketData.value.ticketCode = 'CK' + moment().format('hhmmss')
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

const transferNow = async () => {
  if(Number(ticketData.value.orderId) !== 0){//ticket from order
    await updateInventoryOrder()
  }
  else{
    if(isNaN(id.value) || id.value == 0){
      const res = await addTransaction()
      if(res != 0){
        await updateInventory()
      }
    }
    else{
      await updateInventory()
    }
  }
  back()
}

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
let childrenTable: any[] = []
const orderData = ref()

const callButToan = async (data) => {
  data.forEach(async (product) => {
      if (product.serviceType == 2 || product.serviceType == 4) {  
        childrenTable[0] = {
          merchadiseTobePayforId: product.productPropertyId,
          quantity: product.quantity
        }

        const orderDetail = orderData.value.find((row) => row.productPropertyId == product.productPropertyId)

        const payload = {
          orderId: product.consignmentOrderId,
          content: product.productName,
          paymentRequestId: null,
          receiptOrPaymentVoucherId: null,
          receiveMoney: serviceType.value == 5 ? orderDetail.totalPrice : 0,
          paidMoney: 0,
          deibt: serviceType.value == 5 ? orderDetail.totalPrice : 0,
          typeOfPayment: 1,
          paymentMethods: 1,
          status: 0,
          isReceiptedMoney: 0,
          typeOfMoney: 1,
          merchadiseTobePayfor: childrenTable,
          ReturnRequestId: null,
          TypeOfAccountingEntry: 5,
          OrderIdBTSpa: ticketData.value.orderId,
          OrderCodeBTSpa: ticketData.value.orderCode,
          orderTypeBTSpa: serviceType.value,
          productCode: product.productPropertyCode,
          productName: product.productName,
          unitPrice: serviceType.value == 5 ? orderDetail.unitPrice : 0,
          consignmentPrice: 0,
          negotiatePrice: serviceType.value == 5 ? orderDetail.totalPrice : 0,
          totatlPriceSale: 0,
          totatlPriceRental: 0,
          rentalPriceByDay: 0,
          totalPriceSpa: serviceType.value == 5 ? orderDetail.totalPrice : 0,
          spaService: serviceType.value == 5 ? orderDetail.spaServices.map(val => 
            val.name
          ).toString() : ''
        }
        await addOrderStransaction(payload)
      }
  })
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
      productPropertyCode: row.productCode,
      productName: row.productName,
      quantity: Number(row.quantity),
      price: row.price,
      accessory: row.accessory,
      productPropertyQuality: row.productPropertyQuality,
      toLotId: row.toLot?.value,
      fromLotId: row.fromLot?.value,
      consignmentOrderId: row.orderId,
      serviceType: row.serviceType
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
      callButToan(payload.warehouseProductJson);
    })
    .catch(() =>
      ElNotification({
        message: t('reuse.fail'),
        type: 'warning'
      })
    )
}

const updateTicket = (warehouse, type) => {
  if (type == 1) {
    ticketData.value.toWarehouse = warehouse
  }
  if (type == 2) {
    ticketData.value.fromWarehouse = warehouse
  }
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
            :type="type"
            :ticketData="ticketData"
            :transactionType="transactionType"
            @update-ticket="updateTicket"
          />
        </div>
      </el-collapse-item>

      <el-collapse-item :name="collapse[1].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[1].icon" link />
          <span class="text-center text-xl">{{ collapse[1].title }}</span>
        </template>
        <TransferPW
          ref="productWarehouseRef"
          :type="type"
          :transactionType="transactionType"
          :productData="productData"
          :ticketData="ticketData"
          :status="status"
          :returnRequestId="returnRequestId"
        />
        <div class="w-[100%]">
          <el-divider content-position="left">{{ t('formDemo.statusAndManipulation') }}</el-divider>
        </div>

        <StatusWarehouse :arrayStatusWH="arrayStatusWH" :label="t('reuse.transferTicketStatus')"/>

        <div class="ml-[170px] flex">
          <ElButton class="w-[150px]" :disabled="type == 'add' || type == 'edit'">{{
            t('reuse.printTransferTicket')
          }}</ElButton>
          <div v-if="status == 1 || status == 2" class="ml-[20px] flex">
            <ElButton
              v-if="lastStatus.value !== 4 || (lastStatus.value == 4 && lastStatus.approveAt != null)"
              class="w-[150px]"
              type="primary"
              @click="transferNow"
              >{{ t('reuse.transferWarehouseNow') }}</ElButton
            >
            <ElButton
              class="w-[150px]"
              type="primary"
              @click="addTransaction"
              v-if="Number(ticketData.orderId) == 0"
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
              v-if="Number(ticketData.orderId) == 0"
              :disabled="type == 'add' || type == 'edit' || (lastStatus.value == 4 && !lastStatus.approveAt)"
              @click="cancelTicketWarehouse"
              >{{ t('reuse.cancelTransfer') }}</ElButton
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
    position: relative;
    display: flex;
    width: fit-content;
    padding: 0 10px 0 20px;
    background-color: #ccc;
    border: 1px solid #ccc;
    opacity: 0.6;
    align-items: center;
  }
  
  .box_1 {
    --tw-bg-opacity: 1;

    background-color: rgb(209 213 219 / var(--tw-bg-opacity));
    border: 1px solid rgb(209 213 219 / var(--tw-bg-opacity));
  
  }
  
  .box_2 {
    background-color: #f4f8fd;
    border: 1px solid #f4f8fd;
  }
  
  .box_3 {
    background-color: #f8dec9;
    border: 1px solid #f8dec9;
  }
  
  .box_4 {
    background-color: #fce5e1;
    border: 1px solid #fce5e1;
  }

  .duplicate-status + .duplicate-status {
    margin-left: 10px;
  }

  .active {
    opacity: 1 !important;
  }

  .right_1 {
    border-left: 11px solid rgb(209 213 219 / var(--tw-bg-opacity)) !important;
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
    --tw-border-opacity: 1;

    position: absolute;
    left: -1px;
    z-index: 1998;
    width: 11px;
    height: 100%;border-top-color: transparent;
    border-bottom-color: transparent;
    border-left-color: rgb(255 255 255 / var(--tw-border-opacity));
    border-style: solid;
    border-top-width: 12px;
    border-bottom-width: 12px;
    border-left-width: 10px;
    content: '';
  }
</style>
