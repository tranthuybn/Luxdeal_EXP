import { useI18n } from '@/hooks/web/useI18n'
import type { Slots } from 'vue'
import { getSlot } from '@/utils/tsxHelper'
import { PlaceholderModel } from './types'

const { t } = useI18n()

/**
 *
 * @param schema Corresponding component data
 * @returns Return to prompt information object
 * @description Used to automatically set Placeholder
 */
export const setTextPlaceholder = (schema: FormSchema): PlaceholderModel => {
  const textMap = ['Input', 'Autocomplete', 'InputNumber', 'InputPassword']
  const selectMap = ['Select', 'TimePicker', 'DatePicker', 'TimeSelect', 'TimeSelect']
  if (textMap.includes(schema?.component as string)) {
    return {
      placeholder: t('common.inputText')
    }
  }
  if (selectMap.includes(schema?.component as string)) {
    // 一些范围选择器
    const twoTextMap = ['datetimerange', 'daterange', 'monthrange', 'datetimerange', 'daterange']
    if (
      twoTextMap.includes(
        (schema?.componentProps?.type || schema?.componentProps?.isRange) as string
      )
    ) {
      return {
        startPlaceholder: t('common.startTimeText'),
        endPlaceholder: t('common.endTimeText'),
        rangeSeparator: '-'
      }
    } else {
      return {
        placeholder: t('common.selectText')
      }
    }
  }
  return {}
}

/**
 *
 * @param col Built -in grid
 * @returns Return to grid attribute
 * @description The grid attribute of merged and passed in
 */
export const setGridProp = (col: ColProps = {}): ColProps => {
  const colProps: ColProps = {
    // If there is a SPAN, it means that the user is higher priority, so you don’t need to default
    ...(col.span
      ? {}
      : {
          xs: 24,
          sm: 12,
          md: 12,
          lg: 12,
          xl: 12
        }),
    ...col
  }
  return colProps
}

/**
 *
 * @param item Passing component attributes
 * @returns Clearable attributes are added by default
 */
export const setComponentProps = (item: FormSchema): Recordable => {
  const notNeedClearable = ['ColorPicker']
  const componentProps: Recordable = notNeedClearable.includes(item.component as string)
    ? { ...item.componentProps }
    : {
        clearable: true,
        ...item.componentProps
      }
  // Need to delete additional attributes
  delete componentProps?.slots
  return componentProps
}

/**
 *
 * @param slots Groove
 * @param slotsProps Slot attribute
 * @param field Field name
 */
export const setItemComponentSlots = (
  slots: Slots,
  slotsProps: Recordable = {},
  field: string
): Recordable => {
  const slotObj: Recordable = {}
  for (const key in slotsProps) {
    if (slotsProps[key]) {
      // Since the component may be repeated, there is a unique prefix
      slotObj[key] = (data: Recordable) => {
        return getSlot(slots, `${field}-${key}`, data)
      }
    }
  }
  return slotObj
}

/**
 *
 * @param schema Form Form Structured Array
 * @param formModel Form model
 * @returns FormModel
 * @description Generate the corresponding form model
 */
export const initModel = (schema: FormSchema[], formModel: Recordable) => {
  const model: Recordable = { ...formModel }
  schema.map((v) => {
    // If it is HIDDEN, delete the corresponding value
    if (v.hidden) {
      delete model[v.field]
    } else if (v.component && v.component !== 'Divider') {
      const hasField = Reflect.has(model, v.field)
      // If there are already values before, it will not be repaid, but the existing value is used
      model[v.field] = hasField ? model[v.field] : v.value !== void 0 ? v.value : ''
    }
  })
  return model
}

/**
 * @param slots Groove
 * @param field Field name
 * @returns Return to Form item slot
 */
export const setFormItemSlots = (slots: Slots, field: string): Recordable => {
  const slotObj: Recordable = {}
  if (slots[`${field}-error`]) {
    slotObj['error'] = (data: Recordable) => {
      return getSlot(slots, `${field}-error`, data)
    }
  }
  if (slots[`${field}-label`]) {
    slotObj['label'] = (data: Recordable) => {
      return getSlot(slots, `${field}-label`, data)
    }
  }
  return slotObj
}
