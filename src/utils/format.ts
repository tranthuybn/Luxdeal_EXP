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
  if (val) return `${t('reuse.show')}`
  return `${t('reuse.notShow')}`
}

export const dateTimeFormat = 'DD/MM/YYYY'
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

export default {
  objectToQueryParams,
  formatMoneyInput,
  formatDateTime,
  productStatusTransferToText,
  dateTimeFormat,
  valueDateFormat,
  dateFormType,
  dateTimeDisable
}
