/* eslint-disable prefer-const */
import Mock from 'mockjs'
interface productRankList {
  id: number
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
      id: '@id',
      managementCode: '@string',
      RankName: '@name',
      numberOfEmployees: '@string',
      createDate: '@date("dd/MM/yyyy")',
      creator: '@name',
      status: '@boolean'
    })
  )
}
export { productRankList }
