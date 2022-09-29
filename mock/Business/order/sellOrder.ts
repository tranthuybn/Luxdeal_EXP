const SellOrder: {
  id: number
  createDate: Date
  orderCode: string
  creator: string
  customer: string
  description: string
  saleNumber: number
  totalMoney: number
  debitTotal: number
  receiptAndExpenditure: boolean
  status: number
  collaboratorsCode: string
  promotionCode: string
  productManagementCode: string
  companyInfo: string
  explain: string
  productInformation: string
}[] = []

const SellOrderListMock = {
  id: '@id',
  createDate: '@date("dd/MM/yyyy")',
  orderCode: '@natural',
  creator: '@name',
  customer: '@name',
  description: '@paragraph(1)',
  productManagementCode: '@natural',
  saleNumber: '@natural(1,1000)',
  totalMoney: '@natural(10000,1000000) đ',
  debitTotal: '@natural(10000,1000000) đ',
  receiptAndExpenditure: '@boolean',
  status: '@natural(0,7)',
  collaboratorsCode: '@natural',
  promotionCode: '@natural',
  companyInfo: '@title',
  explain: '@paragraph(1)',
  productInformation: '@paragraph(1)'
}

export { SellOrder, SellOrderListMock }
