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
export const formatRankingCustomer = (val) => {
  switch (val) {
    case 1:
      return t('reuse.silver')
    case 2:
      return t('reuse.gold')
    case 3:
      return t('reuse.platinum')
    case 4:
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
    case 1:
      return t('reuse.onlyCustomer')
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
  return `${t('reuse.inactive')}`
}
export const collaboratorStatusTransferToText = (val) => {
  if (val == 0) return `${t('reuse.pending')}`
  else if (val == 1) return `${t('reuse.active')}`
  else if (val == 2) return `${t('reuse.inactive')}`
  return `${t('reuse.lock')}`
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
  if (val) return `${t('reuse.online')}`
  return `${t('reuse.offline')}`
}
export const businessIventoryStatusTransferToText = (val) => {
  if (val) return `${t('reuse.stocking')}`
  return `${t('reuse.outOfStock')}`
}

export const businessStatusTransferToText = (val) => {
  if (val == 0) return `${t('reuse.active')}`
  else if (val == 1) return `${t('reuse.pending')}`
  else if (val == 2) return `${t('reuse.finishPending')}`
  return `${t('reuse.inactive')}`
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
      return ''
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
      return t('formDemo.giftSpa')
    case 2:
      return t('formDemo.giftDiscount')
    default:
      return ''
  }
}

export const dateTimeFormat = (val) => {
  return moment(val).format('DD/MM/YYYY')
}

export const postDateTime = (val) => {
  return moment(val).format('YYYY/MM/DD')
}
export const formatTransactionStatus = (val) => {
  switch (val) {
    case 1:
      return t('reuse.waitingConfirm')
    case 2:
      return t('reuse.confirmed')
    case 3:
      return t('reuse.cancelled')
    default:
      return ''
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
  dateTimeDisable
}
