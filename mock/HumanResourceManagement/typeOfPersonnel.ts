/* eslint-disable prefer-const */
import Mock from 'mockjs'
interface productTypePersonnelList {
  id: number
  managementCode: string
  TypePersonnelName: string
  numberPersonnel: string
  createDate: Date
  creator: string
  status: boolean
}
const count = 77
let productTypePersonnelList: productTypePersonnelList[] = []
for (let i = 0; i < count; i++) {
  productTypePersonnelList.push(
    Mock.mock({
      id: '@id',
      managementCode: '@string',
      TypePersonnelName: '@name',
      numberPersonnel: '@natural(1,100)',
      createDate: '@date("dd/MM/yyyy")',
      creator: '@name',
      status: '@boolean'
    })
  )
}

export { productTypePersonnelList }
