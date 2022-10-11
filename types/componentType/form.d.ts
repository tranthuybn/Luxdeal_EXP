import type { CSSProperties } from 'vue'
import { string } from 'vue-types'

declare global {
  declare type ComponentName =
    | 'Radio'
    | 'RadioButton'
    | 'Checkbox'
    | 'CheckboxButton'
    | 'Input'
    | 'Autocomplete'
    | 'InputNumber'
    | 'Select'
    | 'Cascader'
    | 'Switch'
    | 'Slider'
    | 'TimePicker'
    | 'DatePicker'
    | 'Rate'
    | 'ColorPicker'
    | 'Transfer'
    | 'Divider'
    | 'TimeSelect'
    | 'SelectV2'
    | 'InputPassword'
    | 'Editor'
    | 'Descriptions'
    | 'Tag'
    | 'Button'

  declare type ColProps = {
    span?: number
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
    tag?: string
  }

  declare type FormValueType = string | number | string[] | number[] | boolean | undefined | null

  declare type FormItemProps = {
    labelWidth?: string | number
    required?: boolean
    rules?: Recordable
    error?: string
    showMessage?: boolean
    inlineMessage?: boolean
    style?: CSSProperties
  }

  declare type ComponentOptions = {
    label?: string
    value?: FormValueType
    disabled?: boolean
    key?: string | number
    children?: ComponentOptions[]
    options?: ComponentOptions[]
  } & Recordable

  declare type ComponentOptionsAlias = {
    labelField?: string
    valueField?: string
  }

  declare type ComponentProps = {
    optionsAlias?: ComponentOptionsAlias
    options?: ComponentOptions[]
    optionsSlot?: boolean
  } & Recordable

  declare type FormSchema = {
    // Unique value
    field: string
    // title
    label?: string
    // hint
    labelMessage?: string
    // COL component attribute
    colProps?: ColProps
    // Form component attributes, slots correspond to the slot of the form component, rules: $ {field} -xxx, you can view the Element-Plus document
    componentProps?: { slots?: Recordable } & ComponentProps
    // FormITEM component attribute
    formItemProps?: FormItemProps
    // Rendering component
    component?: ComponentName
    // Initial value
    value?: FormValueType
    // Whether to hide
    hidden?: boolean
    // Disabled
    disabled?: boolean
    // Remote loading drop
    api?: <T = any>() => AxiosPromise<T>
    title?: string
    modelValue?: any
  }

  declare type FormSetPropsType = {
    field: string
    path: string
    value: any
  }
}
