import { Slots } from 'vue'
import { isFunction } from '@/utils/is'
import moment from 'moment';

export const getSlot = (slots: Slots, slot = 'default', data?: Recordable) => {
  // Reflect.has determines whether an object exists in a certain attribute
  if (!slots || !Reflect.has(slots, slot)) {
    return null
  }
  if (!isFunction(slots[slot])) {
    console.error(`${slot} is not a function!`)
    return null
  }
  const slotFn = slots[slot]
  if (!slotFn) return null
  return slotFn(data)
}


export const filterHandler = (value,row,column) => {
  const property = column['property']
  return row[property] === value
}

export const changeMoney = new Intl.NumberFormat('vi', {
  style: 'currency',
  currency: 'vnd',
  minimumFractionDigits: 0
})

export const formartDate = (date) => {
  if(date) return moment(date, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')
  return ''
}