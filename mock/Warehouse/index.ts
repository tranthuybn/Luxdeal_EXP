import { config } from '@/config/axios/config'
import { productStorageList } from './productStorage'
import { warehouseList } from '../Warehouse/warehouse'
import { serviceResponse } from 'mock/_reponseStructure'
const { result_code } = config
const timeout = 1000
export default [
  {
    url: '/productStorage/List',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize, id } = query
      const pageList = productStorageList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: productStorageList.length
      })
      return {
        ...responseStructure
      }
    }
  },
  {
    url: '/warehouse/List',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = warehouseList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: warehouseList.length
      })
      return {
        ...responseStructure
      }
    }
  }
]
