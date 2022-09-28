/* eslint-disable prefer-const */
import Mock from 'mockjs'
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

export { productDepartmentList }
