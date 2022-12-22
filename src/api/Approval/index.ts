import { useAxios } from '@/hooks/web/useAxios'
import { API_URL, APPROVAL_API } from '@/utils/API_URL'
const request = useAxios()
const fixedBaseURL = API_URL

export const getApproveManagementList = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: `${APPROVAL_API.GET_LIST_APPROVAL}`, params }, fixedBaseURL)
  return res && res.data
}
export const getProductsApproval = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/ProductsApproval/List', params })
  return res && res.data
}

export const getOrderApproval = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/OrdersApproval/List', params })
  return res && res.data
}

export const getOrderPayments = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/OrdersApproval/Payments', params })
  return res && res.data
}
