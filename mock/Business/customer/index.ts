const customerList: {
  createDate: Date
  customerOrRepresentative: string
  customerCode: string
  gender: string
  contact: string
  companyInfo: string
  type: string
  accountType: string
  status: boolean
  collaboratorsName: string
  collaboratorsCode: string
  account: string
  totalMoney: number
  debt: number
  withdrawalRequest: number
  requestDate: Date
  requestStatus: string
  accountStatus: string
}[] = []

const customerListMock = {
  createDate: '@date("dd/MM/yyyy")',
  customerOrRepresentative: '@name',
  customerCode: '@natural',
  gender: '@string(4)',
  contact: '@sentence(3,5)',
  companyInfo: '@paragraph(1)',
  type: '@string(5)',
  accountType: '@string(5)',
  status: '@boolean',
  collaboratorsName: '@name',
  collaboratorsCode: '@natural',
  account: '@string(10,20)',
  totalMoney: '@integer(500-1000)',
  debt: '@integer(500-1000)',
  withdrawalRequest: '@integer(500-1000)',
  requestDate: '@date("dd/MM/yyyy")',
  requestStatus: '@integer',
  accountStatus: '@boolean'
}

export { customerList, customerListMock }
