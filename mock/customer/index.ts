import { config } from '@/config/axios/config'
import Mock from 'mockjs'
const { result_code } = config
import { MockMethod } from 'vite-plugin-mock'
const timeout = 1000
const count = 100

const customerList: {
  createDate: Date
  customerOrRepresentative: string
  customerCode: string
  gender: string
  contact: string
  companyInfo: string
  type: string
  accountType: string
  status: string
}[] = []

for (let i = 0; i < count; i++) {
  customerList.push(
    Mock.mock({
      createDate: '@date(dd/MM/yyyy)',
      customerOrRepresentative: '@name',
      customerCode: '@natural',
      gender: '@string(5)',
      contact: '@sentence(5)',
      companyInfo: '@sentence(5)',
      type: '@string(5)',
      accountType: '@string(5)',
      status: '@character(5)'
    })
  )
}

export default [
  {
    url: '/customer/List',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = customerList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: customerList.length,
          list: pageList
        }
      }
    }
  }
] as MockMethod[]
