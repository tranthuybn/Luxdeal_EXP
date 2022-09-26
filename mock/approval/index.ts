import Mock from 'mockjs'
import { config } from '@/config/axios/config'
import {
  ProductsApprovalList,
  ProductsApprovalListMock
} from './productsApproval/productsApprovalTable'
import { serviceResponse } from 'mock/_reponseStructure'
interface ApprovalManagement {
  id: Number
  categoryInfo: string
  condition: string
  approveOrNot: boolean
  children: Array<ApprovalManagement>
}

const count = 77
const ApprovalManagementList: ApprovalManagement[] = []
for (let i = 0; i < count; i++) {
  ProductsApprovalList.push(Mock.mock(ProductsApprovalListMock))
  ApprovalManagementList.push(
    Mock.mock({
      id: i,
      categoryInfo: '@title(5, 10)',
      condition: '@title(5, 10)',
      approveOrNot: '@boolean',
      children: [
        {
          id: i,
          categoryInfo: '@title(5, 10)',
          condition: '@title(5, 10)',
          approveOrNot: '@boolean'
        },
        {
          id: i,
          categoryInfo: '@title(5, 10)',
          condition: '@title(5, 10)',
          approveOrNot: '@boolean'
        }
      ]
    })
  )
}
const { result_code } = config
const timeout = 1000

export default [
  {
    url: '/ApprovalManagement/List',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = ApprovalManagementList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: ApprovalManagementList.length
      })
      return {
        ...responseStructure
      }
    }
  },
  {
    url: '/ProductsApproval/List',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = ProductsApprovalList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: ProductsApprovalList.length
      })
      return {
        ...responseStructure
      }
    }
  }
]
