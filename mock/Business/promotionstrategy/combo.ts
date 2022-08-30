const comboList: {
  id: number
  createDate: Date
  comboCode: string
  descriptions: string
  ServiceLibrarySpaService: string
  productCode: string
  start: Date
  doneLabel: Date
  cost: number
  comboPrice: number
  status: boolean
  creator: string
}[] = []

const comboListMock = {
  id: '@id',
  createDate: '@date("dd/MM/yyyy")',
  comboCode: '@natural',
  descriptions: '@string(10,20)',
  ServiceLibrarySpaService: '@string',
  productCode: '@natural',
  start: '@date("dd/MM/yyyy")',
  doneLabel: '@date("dd/MM/yyyy")',
  cost: '@natural(10000,10000000)',
  comboPrice: '@natural(10000,10000000)',
  status: '@boolean',
  creator: '@name'
}

export { comboList, comboListMock }
