type FormValueType = string | number | boolean
type ComponentOptions = {
  label?: string
  value?: FormValueType
  disabled?: boolean
  key?: string | number
  children?: ComponentOptions[]
  options?: ComponentOptions[]
}
export interface tableChildren {
  date?: string
  customerCareContent?: String
  manipulation?: string
  editedChild?: Boolean
}
export interface tableDataType {
  id: any
  staffId: Number
  staffName: String
  content: String
  createdAt: String
  date: any
  percentageOfSales: number
  manipulation: string
  edited: Boolean
  family: Array<tableChildren>
}

export interface potentialCustomerInfo {
  id: any
  name: String
  userName: String
  code: String
  phonenumber: String
  email: String
  link: String
  taxCode: String
  isOrganization: boolean
  historyTransaction: Number
  isOnline: Boolean
  accessChannel: Number
  source: Number
  note: String
  service: any
  serviceDetail: string
  orderCode: string
  statusId: Number
  total: Number
}

export interface potentialCustomerHistoryInfo {
  id: any
  staffId: Number
  content: any
  percentageOfSales: Number
}
