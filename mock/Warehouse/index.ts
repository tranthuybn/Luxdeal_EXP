import { config } from '@/config/axios/config'
import { productStorageList } from './productStorage'
import { warehouseList } from '../Warehouse/warehouse'
const { result_code } = config
const timeout = 1000
export default [
  {
    url: '/productStorage/List',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = productStorageList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: productStorageList.length,
          list: pageList
        }
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
      return {
        code: result_code,
        data: {
          total: warehouseList.length,
          list: pageList
        }
      }
    }
  }
]
