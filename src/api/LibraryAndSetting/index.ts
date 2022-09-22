import { useAxios } from '@/hooks/web/useAxios'
import { FORM_DATA, FORM_IMAGES, objectToQueryParams } from '@/utils/format'
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

export const getCategories = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${PRODUCTS_AND_SERVICES_API.GET_CATEGORY}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}
export const getCategoryById = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${PRODUCTS_AND_SERVICES_API.GET_CATEGORY_BY_ID}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}
export const postCategory = async (data): Promise<IResponse> => {
  data = FORM_DATA(data)
  const res = await request.post(
    { url: `${PRODUCTS_AND_SERVICES_API.ADD_CATEGORY}`, data },
    fixedBaseURL
  )
  return res && res.data
}
export const updateCategory = async (data): Promise<IResponse> => {
  data = FORM_DATA(data)
  const res = await request.post(
    { url: `${PRODUCTS_AND_SERVICES_API.UPDATE_CATEGORY}`, data },
    fixedBaseURL
  )
  return res && res.data
}
export const deleteCategory = async (params): Promise<IResponse> => {
  const res = await request.delete(
    {
      url: `${PRODUCTS_AND_SERVICES_API.DELETE_CATEGORY}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}
export const getBusinessProductLibrary = async (params): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${PRODUCTS_AND_SERVICES_API.GET_PRODUCT}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}
export const getCodeAndNameProductLibrary = async (params?): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${PRODUCTS_AND_SERVICES_API.CHECK_PRODUCT}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}
export const postProductLibrary = async (data): Promise<IResponse> => {
  const res = await request.post(
    { url: `${PRODUCTS_AND_SERVICES_API.POST_PRODUCT}`, data },
    fixedBaseURL
  )
  return res && res.data
}
export const updateProductLibrary = async (data): Promise<IResponse> => {
  const res = await request.put(
    { url: `${PRODUCTS_AND_SERVICES_API.UPDATE_PRODUCT}`, data },
    fixedBaseURL
  )
  return res && res.data
}
export const updateProductSeo = async (data): Promise<IResponse> => {
  const res = await request.put(
    { url: `${PRODUCTS_AND_SERVICES_API.UPDATE_SEO_PRODUCT}`, data },
    fixedBaseURL
  )
  return res && res.data
}
export const deleteProduct = async (params): Promise<IResponse> => {
  const res = await request.delete(
    {
      url: `${PRODUCTS_AND_SERVICES_API.DELETE_PRODUCT}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}
export const getSpaLibrary = async (params): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${PRODUCTS_AND_SERVICES_API.GET_SPA}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}
export const deleteSpa = async (params): Promise<IResponse> => {
  const res = await request.delete(
    {
      url: `${PRODUCTS_AND_SERVICES_API.DELETE_SPA}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}
export const postSpa = async (data): Promise<IResponse> => {
  data = FORM_IMAGES(data)
  const res = await request.post(
    { url: `${PRODUCTS_AND_SERVICES_API.POST_SPA}`, data },
    fixedBaseURL
  )
  return res && res.data
}
export const updateSpa = async (data): Promise<IResponse> => {
  data = FORM_DATA(data)
  const res = await request.post(
    { url: `${PRODUCTS_AND_SERVICES_API.PUT_SPA}`, data },
    fixedBaseURL
  )
  return res && res.data
}
export const getSpaById = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${PRODUCTS_AND_SERVICES_API.GET_SPASERVICE}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data.data
}
export const deleteSpaImage = async (params): Promise<IResponse> => {
  const res = await request.delete(
    {
      url: `${PRODUCTS_AND_SERVICES_API.DELETE_SPA_IMAGE}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
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
export const getFeaturesPrices = async (params?: any): Promise<IResponse> => {
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
