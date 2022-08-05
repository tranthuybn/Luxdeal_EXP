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
