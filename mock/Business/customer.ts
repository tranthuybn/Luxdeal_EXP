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
  status: '@boolean'
}

export { customerList, customerListMock }
