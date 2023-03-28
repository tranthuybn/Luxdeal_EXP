<script setup lang="ts">
import { useIcon } from '@/hooks/web/useIcon'
import { Collapse } from '../../Components/Type'
import { onBeforeMount, ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { useRouter } from 'vue-router'
import { ElCollapse, ElCollapseItem, ElButton, ElDivider, ElNotification } from 'element-plus'
import DetailTicket from './DetailTicket.vue'
import ExportPW from './ExportPW.vue'
import {
  cancelTicket,
  createTicketManually,
  ExportForDespositingTic,
  UpdateInventory,
  UpdateInventoryOrder,
  updateTicketManually
} from '@/api/Warehouse'
import { getWareHouseTransactionList, addOrderStransaction } from '@/api/Business'
import moment from 'moment'
import { statusWhType } from "./TicketEnum"
import StatusWarehouse from './StatusWarehouse.vue'
import * as warehouseUtility from './WarehouseHelper'

const { t } = useI18n()

const { push } = useRouter()
const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })
const escape = useIcon({ icon: 'quill:escape' })

const collapse: Array<Collapse> = [
  {
    icon: minusIcon,
    name: 'profileWareHouse',
    title: t('reuse.detailExport')
  },
  {
    icon: plusIcon,
    name: 'importedProductsWareHouse',
    title: t('reuse.productExport')
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
const transactionType = 2

const back = async () => {
  push({
    name: 'Inventorymanagement.ListWarehouse.inventory-tracking'
  })
}
const status = ref(2)
const lastStatus = ref({
  value: 0,
  approveAt: null,
  name: ''
})
const activeName = ref(collapse[0].name)
const detailTicketRef = ref<InstanceType<typeof DetailTicket>>()
const ExportPWRef = ref<InstanceType<typeof ExportPW>>()

const addTransaction = async (pushBack = false) => {
  let responseValue = 0
  if (detailTicketRef.value?.submitFormTicket() && ExportPWRef.value?.checkValueOfTable()) {
    let uploadData: any = {}
    uploadData.type = 2
    uploadData.warehouseProductJson = [{}]
    uploadData.warehouseProductJson = ExportPWRef.value?.ListOfProductsForSale.map((row) => ({
      productPropertyId: row.productPropertyId,
      quantity: Number(row.quantity),
      accessory: row.accessory,
      fileId: row.fileId,
      exportLots: row.exportLots?.map((val) => ({
        fromLotId: val.value,
        quantity: val.quantity
      }))
    }))
    uploadData.staffId = detailTicketRef.value?.FormData.staffId
    uploadData.customerId = detailTicketRef.value?.FormData.customerId
    uploadData.description = detailTicketRef.value?.FormData.description
    uploadData.fromWarehouseId = detailTicketRef.value?.FormData.fromWarehouseId
    uploadData.code = detailTicketRef.value?.FormData.ticketCode

    if (type.value == 'add') {
      await createTicketManually(JSON.stringify(uploadData))
        .then((res) => {
          ElNotification({
            message: t('reuse.addSuccess'),
            type: 'success'
          })
          if(pushBack){
            back()
          }
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
          back()
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
  fromWarehouseId: '',
  warehouse: {},
  toWarehouseId: '',
  orderId: 0,
  orderType: 0,
  statusHistory: {}
})
type ExportLots = {
  fromLotId: number
  quantity: number
}
type Options = {
  value: number
  label: string
}

type ExportPW = {
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
let arrayStatusWH = ref(Array<statusWhType>())
// let statusWH = ref('Khởi tạo & ghi số')
const duplicateStatusButton = ref(false)

const productData = ref<ExportPW[]>([{} as ExportPW])
const orderData = ref()
const serviceType = ref(6)
const returnRequestId = ref(0)
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
      ticketData.value.updatedAt = res.data[0].updatedAt
      ticketData.value.status = res.data[0]?.status

      ticketData.value.statusHistory = res.data[0]?.statusHistory
      arrayStatusWH.value = res.data[0]?.statusHistory

      if (arrayStatusWH.value?.length) {
        arrayStatusWH.value[arrayStatusWH.value?.length - 1].isActive = true
      
      if (arrayStatusWH.value[arrayStatusWH.value?.length - 1].approveAt)
        duplicateStatusButton.value = true
      else duplicateStatusButton.value = false
    }

      ticketData.value.fromWarehouseId = res.data[0]?.fromWarehouseId
      ticketData.value.warehouse = {
        value: res.data[0]?.fromWarehouseId,
        label: res.data[0]?.fromWarehouseName
      }
      ticketData.value.orderId = res.data[0]?.orderId
      serviceType.value = res.data[0]?.orderType
      returnRequestId.value = res.data[0]?.returnRequestId
      productData.value = res.data[0].transactionDetails.map((item) => ({
        productPropertyId: item.productPropertyId,
        productPropertyQuality: item.productPropertyQuality,
        accessory: item.accessory,
        productPropertyName: item.productPropertyName,
        productPropertyCode: item.productPropertyCode,
        productName: item.productName,
        productCode: item.productCode,
        unitName: item.unitName,
        exportLots: item?.detail.map((detail) => ({
          value: detail.fromLotId,
          quantity: detail.quantity
        })),
        location: item.locationName,
        lot: item.lotCode,
        imageUrl: item?.imageUrl,
        quantity: item.quantity
      }))

      orderData.value = res.data[0].orderDetails

      status.value = res.data[0]?.status
      lastStatus.value = res.data[0]?.statusHistory[res.data[0]?.statusHistory.length -1]
    }
  } else {
    type.value == 'add'
    ticketData.value.updatedAt = moment().format()
    ticketData.value.ticketCode = 'XK' + moment().format('hhmmss')

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

const exportNow = async () => {
  if(await warehouseUtility.confirmDialog(t('reuse.didYouReceiveProductMessage'))){
    if(Number(ticketData.value.orderId) !== 0){//ticket from order
      await updateInventoryOrder()
    }
    else{
      if(isNaN(id.value) || id.value == 0){
        const res = await addTransaction()
        if(res != 0){
          await updateInventory()
          back()
        }
      }
      else{
        await updateInventory()
      }
    }
  }
}

const updateInventory = async () => {
  const payload = {
    ticketId: id.value,
    type: 2
  }
  //const id =
  //trả về id dùng tiếp ko cần đẩy ra ngoài
  await UpdateInventory(JSON.stringify(payload))
    .then(() => {
      ElNotification({
        message: t('reuse.success'),
        type: 'success'
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
const callButToan = async (data) => {
  data.forEach((product) => {

    const orderDetail = orderData.value.find((row) => row.productPropertyId == product.productPropertyId)
    
    product.exportLots.forEach(async lot => {
      if (lot.serviceType == 2 || lot.serviceType == 4) {
        childrenTable[0] = {
          merchadiseTobePayforId: orderDetail.id,
          quantity: lot.quantity
        }


        const payload = {
          orderId: lot.consignmentOrderId,
          content: product.productName,
          paymentRequestId: null,
          receiptOrPaymentVoucherId: null,
          receiveMoney: 0,
          paidMoney: serviceType.value == 1 ? lot.quantity * orderDetail.unitPrice : serviceType.value == 3 ? lot.quantity * orderDetail.hirePrice : 0,
          deibt: serviceType.value == 1 ? lot.quantity * orderDetail.unitPrice : serviceType.value == 3 ? lot.quantity * orderDetail.hirePrice : 0,
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
          unitPrice: serviceType.value == 3 ? orderDetail.hirePrice : orderDetail.unitPrice,
          consignmentPrice: serviceType.value == 1 ? lot.consignmentSellPrice : serviceType.value == 3 ? lot.consignmentHirePrice : 0,
          negotiatePrice: 0,
          totatlPriceSale: serviceType.value == 1 ? lot.quantity * orderDetail.unitPrice : 0,
          totatlPriceRental: serviceType.value == 3 ? lot.quantity * orderDetail.hirePrice : 0,
          rentalPriceByDay: lot.consignmentHirePrice,
          totalPriceSpa: 0,
          spaService: ''
        }
        await addOrderStransaction(payload)
      }
    })
  })
} 

const updateInventoryOrder = async () => {
  if (!ExportPWRef.value?.checkValueOfTable()) {
    return
  }
  const payload = {
    ticketId: id.value,
    type: 2,
    warehouseProductJson: ExportPWRef.value?.ListOfProductsForSale.map((row) => ({
      productPropertyId: row.productPropertyId,
      productName: row.productName,
      quantity: row.quantity,
      accessory: row.accessory,
      fileId: row.fileId,
      exportLots: row.exportLots?.map((val) => ({
        fromLotId: val.value,
        quantity: Number(val.quantity),
        serviceType: val.serviceType,
        consignmentOrderId: val.consignmentOrderId,
        consignmentHirePrice: val.consignmentHirePrice,
        consignmentSellPrice: val.consignmentSellPrice
      }))
    }))
  }
  await UpdateInventoryOrder(JSON.stringify(payload))
    .then(() => {
      ElNotification({
        message: t('reuse.success'),
        type: 'success'
      }),
      back(),
        callButToan(payload.warehouseProductJson);
    })
    .catch(() =>
      ElNotification({
        message: t('reuse.fail'),
        type: 'warning'
      })
    )
}

const exportInventoryNow = async () => {
  if(await warehouseUtility.confirmDialog(t('reuse.didYouReceiveProductMessage'))){

  const payload = {
    TicketId: id.value,
  }
  await ExportForDespositingTic(payload)
    .then(() => {
      ElNotification({
        message: t('reuse.success'),
        type: 'success'
      }),
      back()
    })
    .catch(() =>
      ElNotification({
        message: t('reuse.fail'),
        type: 'warning'
      })
    )
  }
}



//tngo fixbug
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
        <ExportPW
          ref="ExportPWRef"
          :type="type"
          :transactionType="transactionType"
          :productData="productData"
          :orderId="ticketData.orderId"
          :warehouse="ticketData.warehouse"
          :serviceType="serviceType"
          :returnRequestId="returnRequestId"
          :status="status"
        />
        <div class="w-[100%]">
          <el-divider content-position="left">{{ t('formDemo.statusAndManipulation') }}</el-divider>
        </div>

        <StatusWarehouse :arrayStatusWH="arrayStatusWH" :label="t('reuse.exportTicketStatus')"/>

        <div class="ml-[170px] flex">
          <ElButton class="w-[150px]" disabled>{{
            t('reuse.printDeliveryNote')
          }}</ElButton>
          <div v-if="status == 1 || status == 2" class="ml-[20px] flex">
            <ElButton
              v-if="lastStatus.value !== 4 || (lastStatus.value == 4 && lastStatus.approveAt != null)"
              class="w-[150px]"
              type="primary"
              @click="exportNow"
              >{{ t('reuse.outStockNow') }}</ElButton
            >
            <ElButton
              class="w-[150px]"
              type="primary"
              @click="addTransaction(true)"
              v-if="Number(ticketData.orderId) == 0 && type =='add'"
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
              >{{ t('reuse.cancelExport') }}</ElButton
            >
          </div>
          <ElButton
              v-if="status == 5"
              class="w-[150px]"
              type="primary"
              :disabled="type == 'add' || type == 'edit'"
              @click="updateInventoryOrder"
              >{{ t('formDemo.depositNow') }}</ElButton
            >

            <ElButton
              v-if="status == 6"
              class="w-[150px]"
              type="primary"
              :disabled="type == 'add' || type == 'edit'"
              @click="exportInventoryNow"
              >{{ t('reuse.outStockNow') }}</ElButton
            >
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
</style>
