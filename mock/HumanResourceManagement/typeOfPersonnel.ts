/* eslint-disable prefer-const */
import Mock from 'mockjs'
import { config } from '@/config/axios/config'
interface productTypePersonnelList {
  managementCode: string
  TypePersonnelName: Date
  numberOfEmployees: string
  createDate: Date
  creator: string
  status: boolean
}
const count = 77
let productTypePersonnelList: productTypePersonnelList[] = []
for (let i = 0; i < count; i++) {
  productTypePersonnelList.push(
    Mock.mock({
      managementCode: '@string',
      TypePersonnelName: '@name',
      numberOfEmployees: '@string',
      createDate: '@date("dd/MM/yyyy")',
      creator: '@name',
      status: '@boolean'
    })
  )
}
const { result_code } = config
const timeout = 1000

export default [
  {
    url: '/TypePersonnel/List',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = productTypePersonnelList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: productTypePersonnelList.length,
          list: pageList
        }
      }
    }
  }
]
