import { config } from '@/config/axios/config'
import { productBranchList } from './branch'
import { productDepartmentList } from './department'
import { productRankList } from './rank'
import { productTypePersonnelList } from './typeOfPersonnel'

const { result_code } = config
const timeout = 1000

export default [
  {
    url: '/Branch/List',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = productBranchList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: productBranchList.length,
          list: pageList
        }
      }
    }
  },
  {
    url: '/Department/List',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = productDepartmentList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: productDepartmentList.length,
          list: pageList
        }
      }
    }
  },
  {
    url: '/Rank/List',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = productRankList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: productRankList.length,
          list: pageList
        }
      }
    }
  },
  {
    url: '/TypePersonnel/List',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = productTypePersonnelList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: productTypePersonnelList.length,
          list: pageList
        }
      }
    }
  }
]
