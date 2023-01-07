import { useAxios } from '@/hooks/web/useAxios'
import { API_URL, WAREHOUSE_API, STAFF_API } from '@/utils/API_URL'
import { FORM_DATA, objectToQueryParams } from '@/utils/format'

const request = useAxios()
const fixedBaseURL = API_URL

export const getProductStorage = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${WAREHOUSE_API.GET_LIST_PRODUCT_STORAGE}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}

export const createNewProductStorage = async (params: any): Promise<IResponse> => {
  const res = await request.post(
    {
      url: `${WAREHOUSE_API.CREATE_PRODUCT_STORAGE}`,
      data: params
    },
    fixedBaseURL
  )
  return res && res.data
}
export const getStaff = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${STAFF_API.GET_STAFF}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}
export const updateProductStorage = async (data): Promise<IResponse> => {
  data = FORM_DATA(data)
  const res = await request.put(
    {
      url: `${WAREHOUSE_API.UPDATE_PRODUCT_STORAGE}`,
      data
    },
    fixedBaseURL
  )
  return res && res.data
}

export const deleteProductStorage = async (params): Promise<IResponse> => {
  const res = await request.delete(
    {
      url: `${WAREHOUSE_API.DELETE_PRODUCT_STORAGE}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}

export const createLotWarehouseImage = async (params: any): Promise<IResponse> => {
  const res = await request.post(
    {
      url: `${WAREHOUSE_API.CREATE_LOT_WAREHOUSE_IMAGE}`,
      data: params
    },
    fixedBaseURL
  )
  return res && res.data
}
export const getWarehouseLot = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${WAREHOUSE_API.GET_WAREHOUSE_LOT}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}

export const createWarehouseLot = async (params: any): Promise<IResponse> => {
  const res = await request.post(
    {
      url: `${WAREHOUSE_API.CREATE_WAREHOUSE_LOT}`,
      data: params
    },
    fixedBaseURL
  )
  return res && res.data
}
export const createTicketManually = async (params: any): Promise<IResponse> => {
  const res = await request.post(
    {
      url: `${WAREHOUSE_API.CREATE_TICKET_MANUALLY}`,
      data: params
    },
    fixedBaseURL
  )
  return res && res.data
}
export const cancelTicket = async (params): Promise<IResponse> => {
  const res = await request.delete(
    {
      url: `${WAREHOUSE_API.CANCEL_TICKET}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}
export const UpdateInventory = async (params: any): Promise<IResponse> => {
  const res = await request.put(
    {
      url: `${WAREHOUSE_API.UPDATE_INVENTORY}`,
      data: params
    },
    fixedBaseURL
  )
  return res && res.data
}
export const UpdateInventoryOrder = async (params: any): Promise<IResponse> => {
  const res = await request.put(
    {
      url: `${WAREHOUSE_API.UPDATE_INVENTORY_ORDER}`,
      data: params
    },
    fixedBaseURL
  )
  return res && res.data
}
