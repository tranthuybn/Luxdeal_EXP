import { useAxios } from '@/hooks/web/useAxios'

const request = useAxios()

export const getNotificationList = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/notification/List', params })
  return res && res.data
}
