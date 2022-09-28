const flashsaleList: {
  id: number
  createDate: Date
  flashSaleCode: string
  descriptions: string
  subject: string
  start: Date
  doneLabel: Date
  promotion: string
  status: boolean
  creator: string
}[] = []

const flashsaleListMock = {
  id: '@id',
  createDate: '@date("dd/MM/yyyy")',
  flashSaleCode: '@natural',
  descriptions: '@string(10,20)',
  subject: '@string',
  start: '@date("dd/MM/yyyy")',
  doneLabel: '@date("dd/MM/yyyy")',
  promotion: '@image',
  status: '@boolean',
  creator: '@name'
}

export { flashsaleList, flashsaleListMock }
