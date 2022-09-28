import { config } from '@/config/axios/config'
import { serviceResponse } from 'mock/_reponseStructure'
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
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: productBranchList.length
      })
      return {
        ...responseStructure
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
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: productDepartmentList.length
      })
      return {
        ...responseStructure
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
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: productRankList.length
      })
      return {
        ...responseStructure
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
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: productTypePersonnelList.length
      })
      return {
        ...responseStructure
      }
    }
  }
]
