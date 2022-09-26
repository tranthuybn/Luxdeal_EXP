import { config } from '@/config/axios/config'
import { PurchaseOrder, PurchaseOrderList } from './purchaseOrder'
import Mock from 'mockjs'
import { serviceResponse } from 'mock/_reponseStructure'
const { result_code } = config
const count = 77
const timeout = 1000
for (let i = 0; i < count; i++) {
  PurchaseOrder.push(Mock.mock(PurchaseOrderList))
}
export default [
  {
    url: '/purchaseOrder/List',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = PurchaseOrder.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: PurchaseOrder.length
      })
      return {
        ...responseStructure
      }
    }
  }
]
