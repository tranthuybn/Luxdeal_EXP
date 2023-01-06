import { useAxios } from '@/hooks/web/useAxios'
import { API_URL, APPROVAL_API, PRODUCTS_AND_SERVICES_API, ORDER_API } from '@/utils/API_URL'
import { objectToQueryParams } from '@/utils/format'
const request = useAxios()
const fixedBaseURL = API_URL

export const getApproveManagementList = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: `${APPROVAL_API.GET_LIST_APPROVAL}`, params }, fixedBaseURL)
  return res && res.data
}

export const getProductsApproval = async (params): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${APPROVAL_API.GET_LIST_PRODUCT_APPROVAL}?${objectToQueryParams(params)}`
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

// export const getOrderApproval = async (params: any): Promise<IResponse> => {
//   const res = await request.get({ url: '/OrdersApproval/List', params })
//   return res && res.data
// }

// Lấy danh sách order cần duyệt
export const getOrderApproval = async (params): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${ORDER_API.ORDER_APPROVAL_LIST}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}

export const getOrderPayments = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/OrdersApproval/Payments', params })
  return res && res.data
}
