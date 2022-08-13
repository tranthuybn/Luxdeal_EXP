const collaboratorsList: {
  contact: string
  createDate: Date
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

const collaboratorsListMock = {
  contact: '@string(10,20)',
  createDate: '@date("dd/MM/yyyy")',
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

export { collaboratorsList, collaboratorsListMock }
