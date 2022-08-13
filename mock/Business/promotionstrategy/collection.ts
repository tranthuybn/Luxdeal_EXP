const collectionList: {
  createDate: Date
  collectionCode: string
  descriptions: string
  subject: string
  start: Date
  doneLabel: number
  promotion: string
  status: boolean
}[] = []

const collectionListMock = {
  createDate: '@date("dd/MM/yyyy")',
  collectionCode: '@natural',
  descriptions: '@string(10,20)',
  subject: '@string',
  start: '@date("dd/MM/yyyy")',
  doneLabel: '@date("dd/MM/yyyy")',
  promotion: '@image',
  status: '@boolean'
}

export { collectionList, collectionListMock }
