import { postAutomaticWarehouse, StartOrder, cancelOrder, finishOrder } from '@/api/Business'
import { useI18n } from '@/hooks/web/useI18n'
import { useIcon } from '@/hooks/web/useIcon'
import { FORM_IMAGES } from '@/utils/format'
import { ElNotification } from 'element-plus'
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
