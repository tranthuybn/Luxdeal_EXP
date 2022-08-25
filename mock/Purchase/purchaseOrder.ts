import Mock from 'mockjs'
const PurchaseOrder: {
  id: string
  productCode: string
  saleCode: string
  saleName: string
  companyName: string
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
  companyName: '@name',
  description: '@title',
  numberInput: '@natural',
  totalMoneyInput: '@natural',
  unpaidDebt: '@natural',
  revenueAndExpenditure: '@natural',
  creator: '@first',
  createDate: '@date("dd/MM/yyyy")',
  status: 'Đang giao hàng'
}
export { PurchaseOrder, PurchaseOrderList }
