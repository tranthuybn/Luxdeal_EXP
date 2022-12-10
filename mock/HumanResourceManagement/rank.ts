/* eslint-disable prefer-const */
import Mock from 'mockjs'
interface productRankList {
  id: number
  managementCode: string
  RankName: Date
  numberPersonnel: string
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
      numberPersonnel: '@natural(1,100)',
      createDate: '@date("dd/MM/yyyy")',
      creator: '@name',
      status: '@boolean'
    })
  )
}
export { productRankList }
