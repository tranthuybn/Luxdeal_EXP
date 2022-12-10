/* eslint-disable prefer-const */
import Mock from 'mockjs'
interface productDepartmentList {
  id: number
  managementCode: string
  DepartmentName: Date
  numberPersonnel: string
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
      numberPersonnel: '@natural(1,100)',
      createDate: '@date("dd/MM/yyyy")',
      creator: '@name',
      status: '@boolean'
    })
  )
}

export { productDepartmentList }
