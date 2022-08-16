import { config } from '@/config/axios/config'
import { productList } from './productCategories/products'

const { result_code } = config
const timeout = 1000

export default [
  {
    url: '/products/List',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = productList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: productList.length,
          list: pageList
        }
      }
    }
  }
]
