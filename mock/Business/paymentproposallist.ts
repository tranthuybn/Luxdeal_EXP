const paymentList: {
  proposalCode: string
  contentDescriptions: string
  amountOfMoney: number
  revenueAndExpenditure: boolean
  subject: string
  type: string
  reciprocalProfile: string
  createDate: Date
  creator: string
  status: string
}[] = []

const paymentListMock = {
  proposalCode: '@natural',
  contentDescriptions: '@string(10,20)',
  amountOfMoney: '@natural(1000,100000)',
  revenueAndExpenditure: '@boolean',
  subject: '@string(10,20)',
  type: '@string(10,20)',
  reciprocalProfile: '@string(10,20)',
  createDate: '@date("dd/MM/yyyy")',
  creator: '@string(10,20)',
  status: '@string(10,20)'
}

export { paymentList, paymentListMock }
