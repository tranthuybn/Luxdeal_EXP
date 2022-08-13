const flashsaleList: {
  createDate: Date
  flashSaleCode: string
  descriptions: string
  subject: string
  start: Date
  doneLabel: number
  promotion: string
  status: boolean
}[] = []

const flashsaleListMock = {
  createDate: '@date("dd/MM/yyyy")',
  flashSaleCode: '@natural',
  descriptions: '@string(10,20)',
  subject: '@string',
  start: '@date("dd/MM/yyyy")',
  doneLabel: '@date("dd/MM/yyyy")',
  promotion: '@image',
  status: '@boolean'
}

export { flashsaleList, flashsaleListMock }
