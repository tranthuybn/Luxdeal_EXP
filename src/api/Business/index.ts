import { useAxios } from '@/hooks/web/useAxios'

const request = useAxios()

export const getPotentialCustomerList = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/potentialCustomerCareTable/List', params })
  return res && res.data
}
export const getCustomerList = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/customer/List', params })
  return res && res.data
}
export const getSellOrderList = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/sell-order/list', params })
  return res && res.data
}
export const getCollaboratorsList = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/collaborators/List', params })
  return res && res.data
}
export const getRentalorderList = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/rentalorder/List', params })
  return res && res.data
}
