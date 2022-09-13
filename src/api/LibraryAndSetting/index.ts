import { useAxios } from '@/hooks/web/useAxios'
import { objectToQueryParams } from '@/utils/format'
import { PRODUCTS_AND_SERVICES_API } from '@/utils/API_URL'
const fixedBaseURL = true
const request = useAxios()
export const getProductCategories = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/products/List', params })
  return res && res.data
}
export const getSpaProductCategories = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/SpaProduct/List', params })
  return res && res.data
}
export const getPropertyProductCategories = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/PropertyProduct/List', params })
  return res && res.data
}
export const getColorCategories = async (params: any): Promise<IResponse> => {
  const paramsObj = { categoryType: PRODUCTS_AND_SERVICES.COLORS, ...params }
  const res = await request.get(
    {
      url: `/api/v1/Categories/GetCategories?${objectToQueryParams(paramsObj)}`
    },
    fixedBaseURL
  )
  return res && res.data
}
export const getSizeCategories = async (params: any): Promise<IResponse> => {
  const paramsObj = { categoryType: PRODUCTS_AND_SERVICES.SIZE, ...params }
  const res = await request.get(
    {
      url: `/api/v1/Categories/GetCategories?${objectToQueryParams(paramsObj)}`
    },
    fixedBaseURL
  )
  return res && res.data
}
export const getMaterialCategories = async (params: any): Promise<IResponse> => {
  const paramsObj = { categoryType: PRODUCTS_AND_SERVICES.MATERIAL, ...params }
  const res = await request.get(
    {
      url: `/api/v1/Categories/GetCategories?${objectToQueryParams(paramsObj)}`
    },
    fixedBaseURL
  )
  return res && res.data
}
export const getStatusCategories = async (params: any): Promise<IResponse> => {
  const paramsObj = { categoryType: PRODUCTS_AND_SERVICES.STATUS, ...params }
  const res = await request.get(
    {
      url: `/api/v1/Categories/GetCategories?${objectToQueryParams(paramsObj)}`
    },
    fixedBaseURL
  )
  return res && res.data
}
export const getGenderCategories = async (params: any): Promise<IResponse> => {
  const paramsObj = { categoryType: PRODUCTS_AND_SERVICES.GENDER, ...params }
  const res = await request.get(
    {
      url: `/api/v1/Categories/GetCategories?${objectToQueryParams(paramsObj)}`
    },
    fixedBaseURL
  )
  return res && res.data
}
export const getUnitCategories = async (params: any): Promise<IResponse> => {
  const paramsObj = { categoryType: PRODUCTS_AND_SERVICES.UNIT, ...params }
  const res = await request.get(
    {
      url: `/api/v1/Categories/GetCategories?${objectToQueryParams(paramsObj)}`
    },
    fixedBaseURL
  )
  return res && res.data
}
export const GETCATEGORY = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${PRODUCTS_AND_SERVICES_API.GET_CATEGORY}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}
export const getBusinessProductLibrary = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/BusinessProductLibrary/List', params })
  return res && res.data
}
export const getSpaLibrary = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/spa', params })
  return res && res.data
}
export const getFeaturesDepositFee = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/features-Deposit', params })
  return res && res.data
}
export const getFeaturesPawnFee = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/features-pawn', params })
  return res && res.data
}
export const getFeaturesPrices = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/features-prices', params })
  return res && res.data
}
export const getFeaturesRentalPrice = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/features-Rental-Price', params })
  return res && res.data
}
export const getSpaLPrice = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/spa-price', params })
  return res && res.data
}
export const getInventoryTrading = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/inventory-trading', params })
  return res && res.data
}
export const getPriceByQuantity = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/price-by-quantity', params })
  return res && res.data
}
export const getImportAndExportHistory = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/import-Export-History', params })
  return res && res.data
}
