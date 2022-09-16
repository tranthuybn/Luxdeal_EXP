import moment from 'moment'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
export const formatMoneyInput = (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
export const parseMoneyInput = (value) => value.replace(/\$\s?|(,*)/g, '')
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
export const productStatusTransferToText = (val) => {
  if (val) return `${t('reuse.active')}`
  return `${t('reuse.inactive')}`
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
export const dateTimeFormat = (val) => {
  return moment(val).format('l')
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
export default {
  formatPotentialCustomerStatusIdToText,
  onlineToText,
  formatServiceIdToText,
  FORM_DATA,
  objectToQueryParams,
  formatMoneyInput,
  formatDateTime,
  productStatusTransferToText,
  dateTimeFormat,
  valueDateFormat,
  dateFormType,
  dateTimeDisable
}
