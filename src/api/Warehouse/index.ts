import { useAxios } from '@/hooks/web/useAxios'
import { API_URL, WAREHOUSE_API } from '@/utils/API_URL'
import { objectToQueryParams } from '@/utils/format'

const request = useAxios()
const fixedBaseURL = API_URL

export const getProductStorageList = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${WAREHOUSE_API.GET_LIST_PRODUCT_STORAGE}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}

export const createNewProductStorage = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${WAREHOUSE_API.GET_LIST_PRODUCT_STORAGE}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}

export const updateProductStorage = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${WAREHOUSE_API.GET_LIST_PRODUCT_STORAGE}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}

export const deleteProductStorage = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${WAREHOUSE_API.GET_LIST_PRODUCT_STORAGE}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}
