import moment from 'moment'
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
export const statusTransferToText = (val) => {
  if (val) return 'Đang hoạt động'
  return 'Dừng hoạt động'
}
export const dateTimeFormat = 'DD/MM/YYYY'
export const valueDateFormat = 'YYYY-MM-DD'
export const dateFormType = 'date'
export const dateTimeDisable = false
export default {
  formatMoneyInput,
  formatDateTime,
  statusTransferToText,
  dateTimeFormat,
  valueDateFormat,
  dateFormType,
  dateTimeDisable
}
