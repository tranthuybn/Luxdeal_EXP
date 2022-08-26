const receiptsAndExpendituresList: {
  formCode: string
  contentDescriptions: string
  amountOfMoney: number
  revenueAndExpenditure: boolean
  subject: string
  reciprocalProfile: string
  accountCode: string
  accountName: string
  accountingDate: Date
  createDate: Date
  creator: string
  status: string
}[] = []

const receiptsAndExpendituresListMock = {
  formCode: '@natural',
  contentDescriptions: '@string(10,20)',
  amountOfMoney: '@natural(1000,100000)',
  revenueAndExpenditure: '@boolean',
  subject: '@string(10,20)',
  reciprocalProfile: '@string(10,20)',
  accountCode: '@natural',
  accountName: '@name',
  accountingDate: '@date("dd/MM/yyyy")',
  createDate: '@date("dd/MM/yyyy")',
  creator: '@string(10,20)',
  status: '@string(10,20)'
}

export { receiptsAndExpendituresList, receiptsAndExpendituresListMock }
