const newproductList: {
  id: number
  createDate: Date
  newproductCode: string
  descriptions: string
  subject: string
  start: Date
  doneLabel: Date
  promotion: string
  status: boolean
  creator: string
}[] = []

const newproductListMock = {
  id: '@id',
  createDate: '@date("dd/MM/yyyy")',
  newproductCode: '@natural',
  descriptions: '@string(10,20)',
  subject: '@string',
  start: '@date("dd/MM/yyyy")',
  doneLabel: '@date("dd/MM/yyyy")',
  promotion: '@image',
  status: '@boolean',
  creator: '@name'
}

export { newproductList, newproductListMock }
