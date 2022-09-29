const rentalorderList: {
  id: number
  createDate: Date
  orderCode: string
  creator: string
  customer: string
  collaboratorsCode: string
  promotionCode: string
  productManagementCode: string
  productInformation: string
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
  id: '@id',
  createDate: '@date("dd/MM/yyyy")',
  orderCode: '@natural',
  creator: '@name',
  customer: '@name',
  collaboratorsCode: '@natural',
  promotionCode: '@natural',
  explain: '@paragraph(1)',
  productManagementCode: '@natural',
  productInformation: '@paragraph(1)',
  returnedNumber: '00',
  rentingNumber: '10',
  totalDepositMoney: '20.000.000 đ',
  totalRentFeeByTerm: '5.000.000 đ',
  unpaidDebt: '00 đ',
  receiptAndExpenditure: 'phải thu',
  rentTerm: 'theo ngày',
  startDate: '@date("dd/MM/yyyy")',
  endDate: '@date("dd/MM/yyyy")',
  status: 'đang thuê'
}

export { rentalorderList, rentalorderListMock }
