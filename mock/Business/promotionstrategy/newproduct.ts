const newproductList: {
  createDate: Date
  newproductCode: string
  descriptions: string
  subject: string
  start: Date
  doneLabel: number
  promotion: string
  status: boolean
}[] = []

const newproductListMock = {
  createDate: '@date("dd/MM/yyyy")',
  newproductCode: '@natural',
  descriptions: '@string(10,20)',
  subject: '@string',
  start: '@date("dd/MM/yyyy")',
  doneLabel: '@date("dd/MM/yyyy")',
  promotion: '@image',
  status: '@boolean'
}

export { newproductList, newproductListMock }
