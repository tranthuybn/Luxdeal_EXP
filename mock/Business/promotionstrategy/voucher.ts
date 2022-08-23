const voucherList: {
  createDate: Date
  voucherCode: string
  descriptions: string
  type: string
  subject: string
  start: Date
  doneLabel: number
  promotion: string
  status: boolean
}[] = []

const voucherListMock = {
  createDate: '@date("dd/MM/yyyy")',
  voucherCode: '@natural',
  descriptions: '@string(10,20)',
  type: '@string(10,20)',
  subject: '@string',
  start: '@date("dd/MM/yyyy")',
  doneLabel: '@date("dd/MM/yyyy")',
  promotion: '@image',
  status: '@boolean'
}

export { voucherList, voucherListMock }
