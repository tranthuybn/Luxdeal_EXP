const orderPawnList: {
  id: number
  createDate: Date
  orderCode: string
  creator: string
  customer: string
  companyInfo: string
  collaboratorsCode: string
  promotionCode: string
  explain: string
  pawnNumber: string
  depositedSoldNumber: string
  spaTimes: string
  depositingRentNumber: string
  depositedRentTimes: string
  transferToWarehouseNumber: string
  redeemNumber: string
  totalPawnMoney: string
  totalDepositRevenue: string
  totalNegotiateMoney: string
  totalFeeMoney: string
  unpaidDebt: string
  depositManagement: string
  startDate: Date
  endDate: Date
  status: string
}[] = []

const orderPawnListMock = {
  id: '@id',
  createDate: '@date("dd/MM/yyyy")',
  orderCode: '@natural',
  creator: '@name',
  customer: '@name',
  companyInfo: '@title',
  collaboratorsCode: '@natural',
  promotionCode: '@natural',
  explain: '@paragraph(1)',
  depositManagement: 'Cầm đồ; Ký gửi bán; Ký gửi cho thuê',
  pawnNumber: '@integer(1, 10)',
  depositedSoldNumber: '@integer(1, 10)',
  spaTimes: '@integer(1, 10)',
  depositingRentNumber: '@integer(1, 10)',
  transferToWarehouseNumber: '@integer(1, 10)',
  redeemNumber: '@integer(1, 10)',
  depositedRentTimes: '@integer(1, 10)',
  totalPawnMoney: '50.000.000 đ',
  totalDepositRevenue: '250.000.000 đ',
  totalNegotiateMoney: '200.000.000 đ',
  totalFeeMoney: '20.000.000 đ',
  unpaidDebt: '10.000.000 đ',
  receiptAndExpenditure: 'phải thu',
  startDate: '@date("dd/MM/yyyy")',
  endDate: '@date("dd/MM/yyyy")',
  status: 'Đang cầm đồ'
}

export { orderPawnList, orderPawnListMock }
