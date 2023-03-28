import { postAutomaticWarehouse, StartOrder, cancelOrder, finishOrder, GetWarehouseTransaction } from '@/api/Business'
import { useI18n } from '@/hooks/web/useI18n'
import { useIcon } from '@/hooks/web/useIcon'
import { FORM_IMAGES } from '@/utils/format'
import { ElMessage, ElNotification } from 'element-plus'
import { ref } from 'vue'
import { TicketStatus } from '../../Warehouse/BusinessProductWarehouse/TicketEnum' 


const { t } = useI18n()

export const viewIcon = useIcon({ icon: 'uil:search' })
export const deleteIcon = useIcon({ icon: 'uil:trash-alt' })

export enum ServiceType {
    Ban = 1,
    KyGui = 2,
    ChoThue = 3,
    CamDo = 4,
    Spa =5,
    MuaHang = 6
}

export type TransactionStatusHistory = {
  transactionStatus: number,
  isActive: Boolean,
  createdAt: string,
  transactionStatusName: string,
  approvedAt: string
}

// Phiếu xuất kho tự động
export const automaticCouponWareHouse = async (type,id) => {
    let success = false
    const payload = {
      OrderId: id,
      Type: type
    }
  
    await postAutomaticWarehouse(payload)
    .then(()=>{
      success = true
    })
    .catch((error)=>{
      ElNotification({
          message: error.response.data.message ?? t('reuse.fail'),
          type: 'warning'
        })
    })
    return success
  }
  //Bắt đầu đơn hàng(Hoàn thành đơn hàng)
export const startOrder = async (orderId, serviceType) => {
    let success = false
    const payload = {
        OrderId : orderId,
        ServiceType: serviceType
    }
    await StartOrder(FORM_IMAGES(payload))
    .then(()=>{
      success = true
      ElNotification({
        message: t('reuse.success'),
        type: 'success'
      })
    })
    .catch((error)=>{
      ElNotification({
          message: error.response.data.message ?? t('reuse.fail'),
          type: 'error'
        })
    })
    return success
  }

//Hủy đơn hàng
export const cancelOrderAPI = async (orderId, serviceType) => {
    let success = false
    const payload = {
        OrderId : orderId,
        ServiceType: serviceType
    }
    await cancelOrder(FORM_IMAGES(payload))
    .then(()=>{
      success = true
      ElNotification({
        message: t('reuse.success'),
        type: 'success'
      })
    })
    .catch((error)=>{
      ElNotification({
          message: error.response.data.message ?? t('reuse.fail'),
          type: 'error'
        })
    })
    return success
  }

//Đối soát và kết thúc đơn hàng
export const finishOrderAPI = async (orderId) => {
    let success = false
    const payload = {
        OrderId : orderId
    }
    await finishOrder(FORM_IMAGES(payload))
    .then(()=>{
      success = true
      ElNotification({
        message: t('reuse.success'),
        type: 'success'
      })
    })
    .catch((error)=>{
      ElNotification({
          message: error.response.data.message ?? t('reuse.fail'),
          type: 'error'
        })
    })
    return success
  }

//Lấy trạng thái của kho
export const disableStatusWarehouse = ref(true)
  //false: Đã xuất/nhập kho
  //true: Chưa xuất
export const getStatusWarehouse = async (orderId) => {
  let success = 0
  if(orderId ==0 || isNaN(orderId)){
    disableStatusWarehouse.value = true
    return success
  }
  const payload = {
      OrderId : orderId
  }
  await GetWarehouseTransaction(payload)
  .then((res)=>{
    res.data.forEach((row)=>{
      if(row.returnRequestId == 0){
        success = row.status
      }
    })
    ElNotification({
      message: t('reuse.success'),
      type: 'success'
    })
  })
  .catch((error)=>{
    ElNotification({
        message: error.response.data.message ?? t('reuse.fail'),
        type: 'error'
      })
  })
  success == TicketStatus.Accepted ? disableStatusWarehouse.value = false : disableStatusWarehouse.value = true

  return success
}
export const checkStatusReturnRequestInWarehouse = (status) => {
  status == TicketStatus.Accepted ? disableStatusWarehouse.value = false : disableStatusWarehouse.value = true
}

export const checkPercent = (_rule: any, value: any, callback: any) => {
  if (/\s/g.test(value)) callback(new Error(t('reuse.notSpace')))
  else if (!value) callback()
  else if (isNaN(value)) callback(new Error(t('reuse.numberFormat')))
  else if (value < 0) callback(new Error(t('reuse.positiveNumber')))
  else if (value < 0 || value > 100) callback(new Error(t('formDemo.validatePercentNum')))
  callback()
}

export const ValidatePostData = (tableData)=>{
  let valid = true

  tableData
  .filter((row)=>row.productPropertyId || row.productPropertyId !== '')
  .forEach((row)=>{
    if(!row.quantity || row.quantity <= 0){
      ElMessage({
        message: t('reuse.invalidQuantity'),
        type: 'warning'
      })
      valid = false
      return valid
    }
  })
  return valid
}