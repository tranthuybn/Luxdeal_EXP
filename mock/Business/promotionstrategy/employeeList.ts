const employeeList: {
  id: number
  createDate: Date
  dateOfBirth: Date
  employeeName: string
  employeeCode: string
  gender: string
  contact: string
  branch: string
  department: string
  rank: string
  type: string
  status: boolean
  creator: string
}[] = []

const employeeListMock = {
  id: '@id',
  createDate: '@date("dd/MM/yyyy")',
  dateOfBirth: '@date("dd/MM/yyyy")',
  employeeName: '@name',
  employeeCode: '@natural',
  gender: '@string(4)',
  contact: '@sentence(3,5)',
  branch: '@string(4)',
  department: '@string(4)',
  rank: '@string(4)',
  type: '@string',
  status: '@boolean',
  creator: '@name'
}

export { employeeList, employeeListMock }
