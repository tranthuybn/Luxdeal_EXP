/* eslint-disable prefer-const */
import Mock from 'mockjs'
interface productBranchList {
  id: number
  managementCode: string
  branchName: Date
  numberPersonnel: string
  createDate: Date
  creator: string
  status: boolean
}
const count = 77
let productBranchList: productBranchList[] = []
for (let i = 0; i < count; i++) {
  productBranchList.push(
    Mock.mock({
      id: '@id',
      managementCode: '@string',
      branchName: '@name',
      numberPersonnel: '@natural(1,100)',
      createDate: '@date("dd/MM/yyyy")',
      creator: '@name',
      status: '@boolean'
    })
  )
}
export { productBranchList }
