import { useAxios } from '@/hooks/web/useAxios'
import { ADDRESS_API } from '@/utils/API_URL'

const request = useAxios()
export const getAllCity = async (): Promise<IResponse> => {
  const res = await request.get({ url: `${ADDRESS_API.CITY}` }, 1)
  return res && res.data
}
export const getAllDistrict = async (params): Promise<IResponse> => {
  const res = await request.get({ url: `${ADDRESS_API.DISTRICT}`, params }, 1)
  return res && res.data
}
export const getAllWard = async (params): Promise<IResponse> => {
  const res = await request.get({ url: `${ADDRESS_API.WARD}`, params }, 1)
  return res && res.data
}
export const getAllStreet = async (params): Promise<IResponse> => {
  const res = await request.get({ url: `${ADDRESS_API.STREET}`, params }, 1)
  return res && res.data
}
