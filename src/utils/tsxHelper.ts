import { Slots } from 'vue'
import { isFunction } from '@/utils/is'

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


export const filterHandler = (config, field) => {
  const [value,row,column ] = config
  const property = column[field]
  return row[property] === value
}

export const changeMoney = new Intl.NumberFormat('vi', {
  style: 'currency',
  currency: 'vnd',
  minimumFractionDigits: 0
})
