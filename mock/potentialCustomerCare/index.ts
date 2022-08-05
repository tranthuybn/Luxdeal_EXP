import { config } from '@/config/axios/config'
import Mock from 'mockjs'
const { result_code } = config

const timeout = 1000

const count = 100

const potentialCustomerCareTable: {
  receivedDate: Date

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

  status: String
}[] = []

for (let i = 0; i < count; i++) {
  potentialCustomerCareTable.push(
    Mock.mock({
      receivedDate: '@date("dd/MM/yyyy")',

      sale: '@name',

      customerInfo: '@region',

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

      status: '@word(3,5)'
    })
  )
}

export default [
  {
    url: '/potentialCustomerCareTable/List',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = potentialCustomerCareTable.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: potentialCustomerCareTable.length,
          list: pageList
        }
      }
    }
  }
]
