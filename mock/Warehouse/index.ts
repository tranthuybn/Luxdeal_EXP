import { config } from '@/config/axios/config'
import { productStorageList } from './productStorage'
import Mock from 'mockjs'
const { result_code } = config
const count = 77
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
  }
]
