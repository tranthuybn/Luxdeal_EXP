const orderSpaList: {
  id: number
  createDate: Date
  orderCode: string
  creator: string
  customer: string
  companyInfo: string
  collaboratorsCode: string
  promotionCode: string
  explain: string
  spaNumberInput: string
  soldNumber: string
  spaTimes: string
  rentedTimes: string
  rentingNumber: string
  returnedNumber: string
  totalDepositRevenue: string
  totalNegotiateMoney: string
  totalSpaFeeMoney: string
  unpaidDebt: string
  depositManagement: string
  spaDeadline: Date
  status: string
  spaService: string
}[] = []

const orderSpaListMock = {
  id: '@id',
  spaService: 'Vệ sinh, hấp nhiệt',
  createDate: '@date("dd/MM/yyyy")',
  orderCode: '@natural',
  creator: '@name',
  customer: '@name',
  companyInfo: '@title',
  collaboratorsCode: '@natural',
  promotionCode: '@natural',
  explain: '@paragraph(1)',
  spaTimes: '@integer(1, 10)',
  spaNumberInput: '@integer(1, 10)',
  returnedNumber: '@integer(1, 10)',
  totalSpaFeeMoney: '20.000.000 đ',
  unpaidDebt: '10.000.000 đ',
  receiptAndExpenditure: 'phải thu',
  spaDeadline: '@date("dd/MM/yyyy")',
  status: 'Đang spa'
}

export { orderSpaList, orderSpaListMock }
