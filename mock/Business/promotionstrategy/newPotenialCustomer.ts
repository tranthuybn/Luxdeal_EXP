const potenialCustomerList: {
  id: number
  createDate: Date
  sale: string
  lastContent: string
  saleName: string
  orderSalesAssign: number
}[] = []

const potenialCustomerListMock = {
  id: '@id',
  createDate: '@date("dd/MM/yyyy")',
  sale: 'sale' + ' ' + '@natural(1,20)',
  lastContent: '@string(10,30)',
  saleName: '@name',
  orderSalesAssign: '@natural(0,100)%'
}

export { potenialCustomerList, potenialCustomerListMock }
