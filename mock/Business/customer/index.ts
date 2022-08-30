const customerList: {
  id: number
  createDate: Date
  customerName: string
  customerCode: string
  gender: string
  contact: string
  companyInfo: string
  type: string
  accountType: string
  status: boolean
  referralCode: string
  creator: string
}[] = []

const customerListMock = {
  id: '@id',
  createDate: '@date("dd/MM/yyyy")',
  customerName: '@name',
  customerCode: '@natural',
  gender: '@string(4)',
  contact: '@sentence(3,5)',
  companyInfo: '@paragraph(1)',
  type: '@string(5)',
  accountType: '@string(5)',
  status: '@boolean',
  creator: '@name',
  referralCode: '@natural',
  account: '@string(10,20)',
  totalMoney: '@integer(500-1000)',
  debt: '@integer(500-1000)',
  withdrawalRequest: '@integer(500-1000)',
  requestDate: '@date("dd/MM/yyyy")',
  requestStatus: '@integer',
  accountStatus: '@boolean'
}

export { customerList, customerListMock }
