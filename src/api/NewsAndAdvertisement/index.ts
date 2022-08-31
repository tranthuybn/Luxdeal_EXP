import { useAxios } from '@/hooks/web/useAxios'

const request = useAxios()

export const getNotificationList = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/notification/List', params })
  return res && res.data
}
export const getBannerAdvertisementList = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/bannerAdvertisement/List', params })
  return res && res.data
}
export const getNewsList = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/NewsList', params })
  return res && res.data
}
export const getManageNewsList = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/manageNews', params })
  return res && res.data
}
export const getPoliciesGuidelinesList = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/PoliciesGuidelinesList', params })
  return res && res.data
}
