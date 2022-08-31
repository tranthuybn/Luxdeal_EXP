import { config } from '@/config/axios/config'
import { productList } from './productCategories/products'
import {
  ColorCategoriesList,
  SizeCategoriesList,
  MaterialCategoriesList,
  StatusCategoriesList,
  GenderCategoriesList
} from './productCategories/attribute'
import { UnitCategoriesList } from './productCategories/unit'
import { BrandCategoriesList } from './productCategories/brand'
import { OriginCategoriesList } from './productCategories/origin'
import { BusinessProductLibrary } from './productLibrary/businessProduct'
import { SpaLibrary } from './ServiceLibrary/spa'

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
  },
  {
    url: '/ColorCategories/List',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = ColorCategoriesList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: ColorCategoriesList.length,
          list: pageList
        }
      }
    }
  },
  {
    url: '/SizeCategories/List',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = SizeCategoriesList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: SizeCategoriesList.length,
          list: pageList
        }
      }
    }
  },
  {
    url: '/MaterialCategories/List',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = MaterialCategoriesList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: MaterialCategoriesList.length,
          list: pageList
        }
      }
    }
  },
  {
    url: '/StatusCategories/List',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = StatusCategoriesList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: StatusCategoriesList.length,
          list: pageList
        }
      }
    }
  },
  {
    url: '/GenderCategories/List',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = GenderCategoriesList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: GenderCategoriesList.length,
          list: pageList
        }
      }
    }
  },
  {
    url: '/UnitCategories/List',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = UnitCategoriesList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: UnitCategoriesList.length,
          list: pageList
        }
      }
    }
  },
  {
    url: '/BrandCategories/List',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = BrandCategoriesList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: BrandCategoriesList.length,
          list: pageList
        }
      }
    }
  },
  {
    url: '/OriginCategories/List',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = OriginCategoriesList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: OriginCategoriesList.length,
          list: pageList
        }
      }
    }
  },
  {
    url: '/BusinessProductLibrary/List',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { status, pageIndex, pageSize } = query
      const mockList = BusinessProductLibrary.filter((item) => {
        if (status && item.status.indexOf(status) < 0) return false
        return true
      })
      const pageList = mockList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: BusinessProductLibrary.length,
          list: pageList
        }
      }
    }
  },
  {
    url: '/spa',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { status, pageIndex, pageSize } = query
      const mockList = SpaLibrary.filter((item) => {
        if (status && item.status.indexOf(status) < 0) return false
        return true
      })
      const pageList = mockList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: SpaLibrary.length,
          list: pageList
        }
      }
    }
  }
]
