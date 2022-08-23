const SellOrder: {
  createDate: Date
  orderCode: string
  creator: string
  customer: string
  description: string
  saleNumber: number
  totalMoney: number
  debitTotal: number
  receiptAndExpenditure: boolean
  status: boolean
}[] = []

const SellOrderListMock = {
  createDate: '@date("dd/MM/yyyy")',
  orderCode: '@natural',
  creator: '@name',
  customer: '@name',
  description: '@paragraph(1)',
  saleNumber: '@natural(1,1000)',
  totalMoney: '@natural(10000,1000000)',
  debitTotal: '@natural(10000,1000000)',
  receiptAndExpenditure: '@boolean',
  status: '@boolean'
}

export { SellOrder, SellOrderListMock }
