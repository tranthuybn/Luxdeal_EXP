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
import { featuresDepositFee } from './productLibrary/featuresDepositFee'
import { featuresPawnFee } from './productLibrary/featuresPawnFee'
import { featuresPrices } from './productLibrary/featuresPrice'
import { featuresRentalPrice } from './productLibrary/featuresRentalPrice'
import { spaPrice } from './productLibrary/spaPrice'
import { inventoryTrading } from './productLibrary/inventoryTrading'
import { priceByQuantity } from './productLibrary/priceByQuantity'
import { importAndExportHistory } from './productLibrary/importAndExportHistory'
import { serviceResponse } from 'mock/_reponseStructure'

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
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: productList.length
      })
      return {
        ...responseStructure
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
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: ColorCategoriesList.length
      })
      return {
        ...responseStructure
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
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: SizeCategoriesList.length
      })
      return {
        ...responseStructure
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
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: MaterialCategoriesList.length
      })
      return {
        ...responseStructure
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
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: StatusCategoriesList.length
      })
      return {
        ...responseStructure
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
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: GenderCategoriesList.length
      })
      return {
        ...responseStructure
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
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: UnitCategoriesList.length
      })
      return {
        ...responseStructure
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
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: BrandCategoriesList.length
      })
      return {
        ...responseStructure
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
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: OriginCategoriesList.length
      })
      return {
        ...responseStructure
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
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: BusinessProductLibrary.length
      })
      return {
        ...responseStructure
      }
    }
  },
  {
    url: '/features-Deposit',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { status, pageIndex, pageSize } = query
      const mockList = featuresDepositFee.filter((item) => {
        if (status && item.status.indexOf(status) < 0) return false
        return true
      })
      const pageList = mockList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: featuresDepositFee.length
      })
      return {
        ...responseStructure
      }
    }
  },
  {
    url: '/features-pawn',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { status, pageIndex, pageSize } = query
      const mockList = featuresPawnFee.filter((item) => {
        if (status && item.status.indexOf(status) < 0) return false
        return true
      })
      const pageList = mockList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: featuresPawnFee.length
      })
      return {
        ...responseStructure
      }
    }
  },
  {
    url: '/features-prices',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { status, pageIndex, pageSize } = query
      const mockList = featuresPrices.filter((item) => {
        if (status && item.status.indexOf(status) < 0) return false
        return true
      })
      const pageList = mockList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: featuresPrices.length
      })
      return {
        ...responseStructure
      }
    }
  },
  {
    url: '/features-Rental-Price',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { status, pageIndex, pageSize } = query
      const mockList = featuresRentalPrice.filter((item) => {
        if (status && item.status.indexOf(status) < 0) return false
        return true
      })
      const pageList = mockList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: featuresRentalPrice.length
      })
      return {
        ...responseStructure
      }
    }
  },
  {
    url: '/spa-price',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { status, pageIndex, pageSize } = query
      const mockList = spaPrice.filter((item) => {
        if (status && item.status.indexOf(status) < 0) return false
        return true
      })
      const pageList = mockList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: spaPrice.length
      })
      return {
        ...responseStructure
      }
    }
  },
  {
    url: '/inventory-trading',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = inventoryTrading.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: inventoryTrading.length
      })
      return {
        ...responseStructure
      }
    }
  },
  {
    url: '/price-by-quantity',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = priceByQuantity.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: priceByQuantity.length
      })
      return {
        ...responseStructure
      }
    }
  },
  {
    url: '/import-Export-History',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = importAndExportHistory.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: importAndExportHistory.length
      })
      return {
        ...responseStructure
      }
    }
  }
]
