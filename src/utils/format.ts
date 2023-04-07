import moment from 'moment'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
export const formatMoneyInput = (value) => {
  return Number(`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','))
}
export const parseMoneyInput = (value) => {
  return Number(value.replace(/\$\s?|(,*)/g, ''))
}
export const formatDateTime = (dateTime, typeDefinition = [], targetType) => {
  if (dateTime && moment(dateTime, typeDefinition).isValid()) {
    if (targetType) {
      return moment(dateTime, typeDefinition).format(targetType)
    } else {
      return moment(dateTime, typeDefinition)
    }
  }
  return ''
}
export const formatProductStatus = (val) => {
  switch (val) {
    case 0:
      return t('reuse.pending')
    case 1:
      return t('reuse.notActive')
    case 2:
      return t('reuse.active') + t('reuse.finishPending')
    default:
      return ''
  }
}


export const formatSettingPointStatus = (val) => {
  if (val) {
    return t('reuse.active')
  } else {
    return t('reuse.notActive')
  }
}
export const formatCustomerPointStatus = (val) => {
  switch (val) {
    case 1:
      return t('reuse.using')
    case 2:
      return t('reuse.lockPoint')
    default:
      return ''
  }
}
export const formatTransactionType = (val) => {
  switch (val) {
    case 1:
      return t('reuse.import')
    case 2:
      return t('reuse.export')
    case 3:
      return t('reuse.transfer')
    default:
      return ''
  }
}
export const formatOrderReturnReason = (val) => {
  switch (val) {
    case 1:
      return 'Đổi'
    case 2:
      return 'Đổi trả'
      case 3:
    return 'Trả hàng trước hạn'
    case 4:
      return 'Trả hàng hết hạn'
    case 5: 
      return 'Gia hạn'    
    case 6:
      return 'Chuộc trước hạn'
    case 7:
      return 'Spa'
    case 8:
      return 'Chuộc hết hạn'
    case 9:
      return 'Đứt hàng'
    default:
      return ''
  }
}
export const formatRankingCustomer = (val) => {
  switch (val) {
    case 0:
      return t('reuse.silver')
    case 1:
      return t('reuse.gold')
    case 2:
      return t('reuse.platinum')
    case 3:
      return 'Titan'
    default:
      return ''
  }
}
export const formatSubjectVoucher = (val) => {
  switch (val) {
    case 3:
      return t('reuse.allCustomer')
    case 2:
      return t('reuse.groupCustomer')
    default:
      return ''
  }
}
export const formatStatusVoucher = (val) => {
  switch (val) {
    case 0:
      return t('reuse.pending')
    case 1:
      return t('reuse.finishPending')
    case 2:
      return t('reuse.inactive')
    case 3:
      return t('reuse.active')
    default:
      return ''
  }
}

export const formatStatusRatingEmployee = (val) => {
  if(val) return t('reuse.isWorking')
  return  t('reuse.stopWorking')

}

export const formatPaymentMethod = (val) => {
  switch (val) {
    case 1:
      return t('reuse.payThroughMoney')
    case 2:
      return t('reuse.payThroughCard')
    default:
      return ''
  }
}

export const formatPaymentOrReceipts = (val) => {
  switch (val) {
    case 1:
      return t('reuse.get')
    case 0:
      return t('reuse.spend')
    default:
      return ''
  }
}

export const formatStatusAccounting = (val) => {
  switch (val) {
    case 0:
      return t('reuse.pending')
    case 1:
      return t('reuse.pending')
    case 2:
      return t('reuse.finishPending')
    case 3:
      return t('reuse.accounted')
    case 4:
      return t('reuse.cancelled')
    default:
      return ''
  }
}

export const formatStatusGeneral = (val) => {
  switch (val) {
    case 0:
      return t('reuse.pending')
    case 1:
      return t('reuse.finishPending')
    case 2:
      return t('reuse.cancelled')
    default:
      return ''
  }
}

export const formatCustomerRatings = (val) => {
  switch (val) {
    case 1:
      return t('reuse.byMonth')
    case 2:
      return t('customerList.byQuarter')
    case 3:
      return t('customerList.byYear')
    default:
      return ''
  }
}
export const priceTransferToText = (val) => {
  return `${val + ' đ'}`
}
export const productStatusPending = (val) => {
  if (val) return `${t('reuse.active')}`
  return `${t('reuse.pending')}`
}
export const productStatusTransferToText = (val) => {
  if (val) return `${t('reuse.active')}`
  else return `${t('reuse.inactive')}`
}



export const formatStatusEmployee = (val) => {
  switch (val) {
    case 1:
      return t('reuse.active')
    case 0:
      return t('reuse.inactive')
    default:
      return ''
  }
}

export const collaboratorStatusTransferToText = (val) => {
  switch (val) {
    case 0:
      return t('reuse.pending')
    case 1:
      return t('reuse.active')
    case 2:
      return t('reuse.inactive')
    case 3:
      return t('reuse.lock')
    default:
      return ' '
  }
}
export const formatPointSettingType = (val) => {
  switch (val) {
    case 1:
      return t('router.buyPointsPackage')
    case 2:
      return t('reuse.pointsForSellOrder')
    case 3:
      return t('reuse.pointsForRentOrder')
    case 4:
      return t('reuse.pointsForDepositOrder')
    case 5:
      return t('reuse.pointsForPawnOrder')
    case 6:
      return t('reuse.pointsForSpaOrder')
    case 7:
      return t('reuse.pointsForAffiliate')
    default:
      return ''
  }
}
export const isFileTransferToText = (val) => {
  if (val == true) return `${t('common.ok')}`
  else if (val == false) return `${t('reuse.no')}`
}
export const paidTransferToText = (val) => {
  if (val == true) return `${t('formDemo.alreadyPaidForTt')}`
  else if (val == false) return `${t('reuse.notPaid')}`
}
export const commissionPaymentStatusTransferToText = (val) => {
  if (val == 1) return `${t('reuse.waitingForProcessing')}`
  else if (val == 2) return `${t('reuse.inUse')}`
  else if (val == 3) return `${t('reuse.used')}`
  return `${t('reuse.cancelled')}`
}
export const formatPotentialCustomerStatusIdToText = (val) => {
  switch (val) {
    case 1:
      return t('reuse.newData')
    case 2:
      return t('reuse.takingCare')
    case 3:
      return t('common.doneLabel')
    default:
      return t('reuse.newData')
  }
}
export const formatServiceIdToText = (val) => {
  switch (val) {
    case 1:
      return t('reuse.sell')
    case 2:
      return t('reuse.deposit')
    case 3:
      return t('reuse.rent')
    case 4:
      return t('workplace.mortgage')
    case 5:
      return t('workplace.spa')
    default:
      return t('reuse.sell')
  }
}
export const onlineToText = (val) => {
  if (val) return t('reuse.online')
  return t('reuse.offline')
}
export const businessIventoryStatusTransferToText = (val) => {
  if (val) t('reuse.stocking')
  return t('reuse.outOfStock')
}

export const businessStatusTransferToText = (val) => {
  if (val == 2) return t('reuse.active')
  else if (val == 0) return t('reuse.pending')
  else if (val == 1) return t('reuse.finishPending')
  return t('reuse.inactive')
}

export const orderType = (val) => {
  switch (val) {
    case 1:
      return t('reuse.sell')
    case 2:
      return t('reuse.deposit')
    case 3:
      return t('reuse.rent')
    case 4:
      return t('reuse.pawn')
    case 5:
      return 'Spa'
    case 6:
      return t('reuse.internal')
    default:
      return ' '
  }
}

export const campaignType = (val) => {
  switch (val) {
    case 1:
      return t('router.flashsale')
    case 2:
      return t('router.collection')
    case 3:
      return t('router.newproduct')
    case 4:
      return t('router.voucher')
    case 5:
      return t('router.combo')
    default:
      return t('router.flashsale')
  }
}

export const TargetType = (val) => {
  switch (val) {
    case 1:
      return t('reuse.customer')
    case 2:
      return t('reuse.groupCustomer')
    case 3:
      return t('reuse.allCustomer')
    default:
      return t('reuse.customer')
  }
}

export const VoucherType = (val) => {
  switch (val) {
    case 1:
      return t('formDemo.giftDiscount')
    case 2:
      return t('formDemo.giftSpa')
    default:
      return ''
  }
}

export const dateTimeFormat = (val) => {
  if (val) return moment(val).format('DD/MM/YYYY')
  return ''
}

export const statusBranch = (val) => {
  if (val == true) return `${t('reuse.active')}`
  else if (val == false) return `${t('reuse.inactive')}`
}

export const postDateTime = (val) => {
  return moment(val).format('YYYY-MM-DD')
}
export const formatTransactionStatus = (val) => {
  switch (val) {
    case 1:
      return t('reuse.waitingConfirm')
    case 2:
      return t('reuse.waitingTransfer')
    case 3:
      return t('reuse.cancelled')
    case 4:
      return t('reuse.confirmed')
    default:
      return ''
  }
}
export const lotBusinessSetup = (val) => {
  switch (val) {
    case 1:
      return t('reuse.sell')
    case 2:
      return t('workplace.deposit')
    case 3:
      return t('reuse.rent')
    case 4:
      return t('workplace.mortgage')
    case 5:
      return t('workplace.spa')
    case 6:
      return 'Mua'
    default:
      return ' '
  }
}

export const valueDateFormat = 'YYYY-MM-DD'
export const dateFormType = 'date'
export const dateTimeDisable = false
export const objectToQueryParams = (params) => {
  let requestString = ''
  if (params && Object.keys(params).length > 0) {
    Object.keys(params).map((key) => {
      if (params[key] !== '' && params[key] !== null && params[key] !== 'undefined') {
        if (Array.isArray(params[key])) {
          params[key].map((item) => {
            requestString += `${key}=${item}&`
          })
        } else requestString += `${key}=${params[key]}&`
      }
    })
  }
  return requestString
}
export const FORM_DATA = (object) => {
  const formData = new FormData()
  Object.keys(object).forEach((key) => formData.append(key, object[key]))
  return formData
}
export const FORM_IMAGES = (data) => {
  return Object.keys(data).reduce((form, key) => {
    if (data[key] != null && typeof data[key] != 'undefined') {
      form.append(key, data[key])
      if (Array.isArray(data[key]) && data[key].length > 0)
        data[key].forEach((el) => {
          form.append(key, el)
        })
    }
    return form
  }, new FormData())
}
export const FORM_DATA1 = (data) => {
  return Object.keys(data).reduce((form, key) => {
    if (data[key] != null && typeof data[key] != 'undefined') {
      form.append(key, data[key])
      if (Array.isArray(data[key]) && data[key].length > 0)
        data[key].forEach((el) => {
          form.append(key, el)
        })
    }
    return form
  }, new FormData())
}
export const moneyFormat = (money) => {
  if (isNaN(money)) {
    return 0
  } else {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(money)
  }
}
export const moneyToNumber = (currency) => {
  return Number(currency.replace(/[^0-9.-]+/g, ''))
}

export const statusOrder = (val) => {
  switch (val) {
    case -1:
      return t('reuse.deliveryFailed')
    case 0:
      return t('formDemo.waitingDelivery')
    case 2:
      return t('reuse.delivery')
    case 3:
      return t('reuse.successfulDelivery')
    case 4:
      return t('formDemo.receivedDelivery')
    default:
      return ''
  }
}

export const formatStatusProductAndService = (val) => {
  switch (val) {
    case 1:
      return t('reuse.approval')
    case 2:
      return t('reuse.active')
    case 3:
      return t('reuse.stopActive')
    default:
      return ''
  }
}

export default {
  formatPotentialCustomerStatusIdToText,
  onlineToText,
  formatServiceIdToText,
  FORM_DATA,
  FORM_IMAGES,
  objectToQueryParams,
  formatMoneyInput,
  moneyToNumber,
  formatDateTime,
  productStatusTransferToText,
  businessStatusTransferToText,
  businessIventoryStatusTransferToText,
  dateTimeFormat,
  collaboratorStatusTransferToText,
  campaignType,
  TargetType,
  VoucherType,
  valueDateFormat,
  dateFormType,
  dateTimeDisable,
  statusOrder
}
