const rentalorderList: {
  createDate: Date
  oderCode: string
  creator: string
  client: string
  explain: string
  rentalQuantity: string
  returned: string
  totalMoney: string
  totalTermRentalFee: string
  outstandingDebt: string
  revenueExpenditure: string
  rentalTerm: string
  startDate: Date
  endDate: Date
  status: string
}[] = []

const rentalorderListMock = {
  createDate: '@date("dd/MM/yyyy")',
  oderCode: '@natural',
  creator: '@name',
  client: '@name',
  explain: '@string(15)',
  rentalQuantity: '10',
  returned: '00',
  totalMoney: '10.000.000 đ',
  totalTermRentalFee: '5.000.000 đ',
  outstandingDebt: '00 đ',
  revenueExpenditure: 'phải thu',
  rentalTerm: 'theo ngày',
  startDate: '@date("dd/MM/yyyy")',
  endDate: '@date("dd/MM/yyyy")',
  status: 'đang thuê'
}

export { rentalorderList, rentalorderListMock }
