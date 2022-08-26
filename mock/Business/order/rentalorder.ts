const rentalorderList: {
  createDate: Date
  orderCode: string
  creator: string
  customer: string
  companyInfo: string
  collaboratorsCode: string
  promotionCode: string
  explain: string
  returnedNumber: string
  rentingNumber: string
  totalDepositMoney: string
  receiptAndExpenditure: string
  unpaidDebt: string
  rentTerm: string
  startDate: Date
  endDate: Date
  status: string
}[] = []

const rentalorderListMock = {
  createDate: '@date("dd/MM/yyyy")',
  orderCode: '@natural',
  creator: '@name',
  customer: '@name',
  companyInfo: '@title',
  collaboratorsCode: '@natural',
  promotionCode: '@natural',
  explain: '@string(15)',
  returnedNumber: '10',
  rentingNumber: '10.000.000 đ',
  totalDepositMoney: '15.000.000 đ',
  totalRentFeeByTerm: '5.000.000 đ',
  unpaidDebt: '00 đ',
  receiptAndExpenditure: 'phải thu',
  rentTerm: 'theo ngày',
  startDate: '@date("dd/MM/yyyy")',
  endDate: '@date("dd/MM/yyyy")',
  status: 'đang thuê'
}

export { rentalorderList, rentalorderListMock }
