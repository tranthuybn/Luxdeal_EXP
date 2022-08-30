/* eslint-disable prefer-const */
import Mock from 'mockjs'
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
export { productBranchList }
