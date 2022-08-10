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
  totalMoney: '10.000.000 đ',
  debt: '10.000.000 đ',
  withdrawalRequest: '10.000.000 đ',
  requestDate: '@date("dd/MM/yyyy")',
  requestStatus: 'Chờ Duyệt',
  accountStatus: 'Đang hoạt động'
}

export { customerList, customerListMock }
