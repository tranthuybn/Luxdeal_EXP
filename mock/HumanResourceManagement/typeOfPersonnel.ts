/* eslint-disable prefer-const */
import Mock from 'mockjs'
interface productTypePersonnelList {
  managementCode: string
  TypePersonnelName: Date
  numberOfEmployees: string
  createDate: Date
  creator: string
  status: boolean
}
const count = 77
let productTypePersonnelList: productTypePersonnelList[] = []
for (let i = 0; i < count; i++) {
  productTypePersonnelList.push(
    Mock.mock({
      managementCode: '@string',
      TypePersonnelName: '@name',
      numberOfEmployees: '@string',
      createDate: '@date("dd/MM/yyyy")',
      creator: '@name',
      status: '@boolean'
    })
  )
}

export { productTypePersonnelList }
