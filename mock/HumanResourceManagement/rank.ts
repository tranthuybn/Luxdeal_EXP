/* eslint-disable prefer-const */
import Mock from 'mockjs'
import { config } from '@/config/axios/config'
interface productRankList {
  managementCode: string
  RankName: Date
  numberOfEmployees: string
  createDate: Date
  creator: string
  status: boolean
}
const count = 77
let productRankList: productRankList[] = []
for (let i = 0; i < count; i++) {
  productRankList.push(
    Mock.mock({
      managementCode: '@string',
      RankName: '@name',
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
    url: '/Rank/List',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = productRankList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: productRankList.length,
          list: pageList
        }
      }
    }
  }
]
