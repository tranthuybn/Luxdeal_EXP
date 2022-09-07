const orderDepositList: {
  id: number
  createDate: Date
  orderCode: string
  creator: string
  customer: string
  companyInfo: string
  collaboratorsCode: string
  promotionCode: string
  explain: string
  depositNumber: string
  soldNumber: string
  spaTimes: string
  rentedTimes: string
  rentingNumber: string
  returnedNumber: string
  totalDepositRevenue: string
  totalNegotiateMoney: string
  totalFeeMoney: string
  unpaidDebt: string
  depositManagement: string
  startDate: Date
  endDate: Date
  status: string
}[] = []

const orderDepositListMock = {
  id: '@id',
  createDate: '@date("dd/MM/yyyy")',
  orderCode: '@natural',
  creator: '@name',
  customer: '@name',
  companyInfo: '@title',
  collaboratorsCode: '@natural',
  promotionCode: '@natural',
  explain: '@paragraph(1)',
  depositManagement: 'Ký gửi, bán, cho thuê',
  depositNumber: '@integer(1, 10)',
  soldNumber: '@integer(1, 10)',
  spaTimes: '@integer(1, 10)',
  rentedTimes: '@integer(1, 10)',
  rentingNumber: '@integer(1, 10)',
  returnedNumber: '@integer(1, 10)',
  totalDepositRevenue: '250.000.000 đ',
  totalNegotiateMoney: '200.000.000 đ',
  totalFeeMoney: '20.000.000 đ',
  unpaidDebt: '10.000.000 đ',
  receiptAndExpenditure: 'phải thu',
  startDate: '@date("dd/MM/yyyy")',
  endDate: '@date("dd/MM/yyyy")',
  status: 'Đang ký gửi'
}

export { orderDepositList, orderDepositListMock }
