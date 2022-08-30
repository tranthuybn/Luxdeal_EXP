/* eslint-disable prefer-const */
import Mock from 'mockjs'
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
export { productRankList }
