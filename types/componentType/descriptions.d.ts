declare interface DescriptionsSchema {
  span?: number // How many points
  field: string // Field name
  label?: string // label name
  width?: string | number
  minWidth?: string | number
  align?: 'left' | 'center' | 'right'
  labelAlign?: 'left' | 'center' | 'right'
  className?: string
  labelClassName?: string
}
