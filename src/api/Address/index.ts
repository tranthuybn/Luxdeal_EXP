import { useAxios } from '@/hooks/web/useAxios'
import { ADDRESS_API } from '@/utils/API_URL'
import { LOGIN_API_URL } from '@/utils/API_URL'

const request = useAxios()
export const getAllCity = async (): Promise<IResponse> => {
  const res = await request.get({ url: `${ADDRESS_API.CITY}` }, LOGIN_API_URL)
  return res && res.data
}
export const getAllDistrict = async (params): Promise<IResponse> => {
  const res = await request.get({ url: `${ADDRESS_API.DISTRICT}`, params }, LOGIN_API_URL)
  return res && res.data
}
export const getAllWard = async (params): Promise<IResponse> => {
  const res = await request.get({ url: `${ADDRESS_API.WARD}`, params }, LOGIN_API_URL)
  return res && res.data
}
export const getAllStreet = async (params): Promise<IResponse> => {
  const res = await request.get({ url: `${ADDRESS_API.STREET}`, params }, LOGIN_API_URL)
  return res && res.data
}
