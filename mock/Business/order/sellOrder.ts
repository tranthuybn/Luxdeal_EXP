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
  collaboratorsCode: string
  promotionCode: string
  companyInfo: string
  explain: string
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
  status: '@boolean',
  collaboratorsCode: '@natural',
  promotionCode: '@natural',
  companyInfo: '@natural',
  explain: '@paragraph(1)'
}

export { SellOrder, SellOrderListMock }
