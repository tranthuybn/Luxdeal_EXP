import Mock from 'mockjs'
const PurchaseOrder: {
  id: string
  productCode: string
  saleCode: string
  saleName: string
  companyInformation: string
  description: string
  numberInput: string
  totalMoneyInput: string
  unpaidDebt: string
  revenueAndExpenditure: string
  creator: string
  createDate: Date
  status: string
}[] = []
const PurchaseOrderList = {
  productCode: '@string(10,20)',
  saleCode: '@string(10,20)',
  saleName: '@last',
  companyInformation: '@name',
  description: '@title',
  numberInput: '@integer(10,20)',
  totalMoneyInput: '@integer(0,10000) đ',
  unpaidDebt: '@integer(0,10000) đ',
  revenueAndExpenditure: 'Phải chi',
  creator: '@first',
  createDate: '@date("dd/MM/yyyy")',
  status: 'Đang giao hàng'
}
export { PurchaseOrder, PurchaseOrderList }
