/* eslint-disable prefer-const */
import Mock from 'mockjs'
import { config } from '@/config/axios/config'
interface productDepartmentList {
  id: number
  managementCode: string
  DepartmentName: Date
  numberOfEmployees: string
  createDate: Date
  creator: string
  status: boolean
}
const count = 77
let productDepartmentList: productDepartmentList[] = []
for (let i = 0; i < count; i++) {
  productDepartmentList.push(
    Mock.mock({
      id: '@id',
      managementCode: '@string',
      DepartmentName: '@name',
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
    url: '/Department/List',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = productDepartmentList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: productDepartmentList.length,
          list: pageList
        }
      }
    }
  }
]
