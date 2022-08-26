const potentialCustomerCareTable: {
  createDate: Date

  sale: String

  customerInfo: String

  transaction: String

  transactionStatus: String

  approachingChannel: String

  note: String

  originated: String

  service: String

  serviceDetail: String

  statusTag: String

  result: String

  order: String

  feedBack: String

  creator: string

  status: String
}[] = []

const potentialCustomerCareTableMock = {
  createDate: '@date("dd/MM/yyyy")',

  sale: '@name',

  customerInfo: '@paragraph(1,3)',

  transaction: '@sentence(3, 5)',

  transactionStatus: '@sentence(1, 3)',

  approachingChannel: '@word(3,5)',

  note: '@sentence(3, 5)',

  originated: '@sentence(3, 5)',

  service: '@sentence(3, 5)',

  serviceDetail: '@sentence(7, 9)',

  statusTag: '@word(3,5)',

  result: '@sentence(3, 5)',

  order: '@word(3,5)',

  feedBack: '@sentence(3, 5)',

  creator: '@name',

  status: '@word(3,5)'
}
export { potentialCustomerCareTable, potentialCustomerCareTableMock }
