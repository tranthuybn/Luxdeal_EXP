/* eslint-disable prefer-const */
import Mock from 'mockjs'
import { config } from '@/config/axios/config'
interface productBranchList {
  managementCode: string
  branchName: Date
  numberOfEmployees: string
  createDate: Date
  creator: string
  status: boolean
}
const count = 77
let productBranchList: productBranchList[] = []
for (let i = 0; i < count; i++) {
  productBranchList.push(
    Mock.mock({
      managementCode: '@string',
      branchName: '@name',
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
    url: '/Branch/List',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = productBranchList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: productBranchList.length,
          list: pageList
        }
      }
    }
  }
]
